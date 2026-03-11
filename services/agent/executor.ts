import { FAQService } from '../faq';
import { getCourseByCode, getReviews, searchCourses } from '../courses';
import { supabase } from '../supabase';
import { fetchTeamingRequests } from '../teaming';
import { getUserScheduleEntries, UserScheduleEntry } from '../schedule';
import { LIBRARY_SCRIPTS } from './automation/library';
import { agentBridge } from './bridge';
import {
    formatBuildingInfo,
    formatNearbyPlaceInfo,
    isBuildingInfoQuery,
    isNearbyPlaceQuery,
} from './campus_queries';
import { callDeepSeekStream } from './llm';
import { getAllUserFacts, saveMemoryFact } from './memory';
import { TOOLS } from './tools';
import { AgentContext, AgentGeoPoint, AgentResponse, AgentStep } from './types';
import { Course, CourseTeaming, Review } from '../../types';

type ScheduleQueryIntent = 'today' | 'tomorrow' | 'next' | 'weekday' | 'all';

type ParsedScheduleQuery = {
    intent: ScheduleQueryIntent;
    dayOfWeek?: number;
};

const WEEKDAY_LABELS: Record<number, string> = {
    1: '周一',
    2: '周二',
    3: '周三',
    4: '周四',
    5: '周五',
    6: '周六',
    7: '周日',
};

const weekdayPatterns: Array<{ dayOfWeek: number; patterns: RegExp[] }> = [
    { dayOfWeek: 1, patterns: [/周一/, /星期一/, /\bmonday\b/i, /\bmon\b/i] },
    { dayOfWeek: 2, patterns: [/周二/, /星期二/, /\btuesday\b/i, /\btue\b/i] },
    { dayOfWeek: 3, patterns: [/周三/, /星期三/, /\bwednesday\b/i, /\bwed\b/i] },
    { dayOfWeek: 4, patterns: [/周四/, /星期四/, /\bthursday\b/i, /\bthu\b/i, /\bthur\b/i] },
    { dayOfWeek: 5, patterns: [/周五/, /星期五/, /\bfriday\b/i, /\bfri\b/i] },
    { dayOfWeek: 6, patterns: [/周六/, /星期六/, /\bsaturday\b/i, /\bsat\b/i] },
    { dayOfWeek: 7, patterns: [/周日/, /星期日/, /周天/, /星期天/, /\bsunday\b/i, /\bsun\b/i] },
];

const getHongKongNow = (): Date => {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Hong_Kong',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).formatToParts(new Date());

    const part = (type: string, fallback: string) => parts.find(item => item.type === type)?.value || fallback;
    const year = Number(part('year', '2026'));
    const month = Number(part('month', '01')) - 1;
    const day = Number(part('day', '01'));
    const hour = Number(part('hour', '00'));
    const minute = Number(part('minute', '00'));
    const second = Number(part('second', '00'));

    return new Date(year, month, day, hour, minute, second);
};

const getHongKongDayOfWeek = (offsetDays = 0): number => {
    const now = getHongKongNow();
    now.setDate(now.getDate() + offsetDays);
    const day = now.getDay();
    return day === 0 ? 7 : day;
};

const toMinutes = (value?: string): number | null => {
    if (!value) return null;
    const match = value.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return null;
    return Number(match[1]) * 60 + Number(match[2]);
};

const getEntrySortValue = (entry: UserScheduleEntry): number => {
    const startMinutes = getEntryStartMinutes(entry);
    if (startMinutes !== null) return startMinutes;
    return Number.MAX_SAFE_INTEGER;
};

const getEntryStartMinutes = (entry: Pick<UserScheduleEntry, 'startTime' | 'startPeriod'>): number | null => {
    const startMinutes = toMinutes(entry.startTime);
    if (startMinutes !== null) return startMinutes;
    if (typeof entry.startPeriod === 'number') return entry.startPeriod * 60;
    return null;
};

const formatScheduleEntry = (entry: UserScheduleEntry): string => {
    const title = entry.courseCode ? `${entry.title} (${entry.courseCode})` : entry.title;
    const timeText = entry.startTime && entry.endTime
        ? `${entry.startTime}-${entry.endTime}`
        : (entry.weekText || '时间待确认');
    const roomText = entry.room ? `，地点 ${entry.room}` : '';
    return `${timeText} ${title}${roomText}`;
};

const parseScheduleQuery = (query: string): ParsedScheduleQuery => {
    const normalized = query.trim();

    if (/下一节|下节|下一堂|next class/i.test(normalized)) {
        return { intent: 'next', dayOfWeek: getHongKongDayOfWeek() };
    }

    if (/明天|tomorrow/i.test(normalized)) {
        return { intent: 'tomorrow', dayOfWeek: getHongKongDayOfWeek(1) };
    }

    for (const item of weekdayPatterns) {
        if (item.patterns.some(pattern => pattern.test(normalized))) {
            return { intent: 'weekday', dayOfWeek: item.dayOfWeek };
        }
    }

    if (/今天|今日|today/i.test(normalized)) {
        return { intent: 'today', dayOfWeek: getHongKongDayOfWeek() };
    }

    return { intent: 'all' };
};

const formatScheduleSummary = (entries: UserScheduleEntry[], label: string): string => {
    if (entries.length === 0) {
        return `${label}没有课。`;
    }

    const lines = entries
        .sort((a, b) => getEntrySortValue(a) - getEntrySortValue(b))
        .map((entry, index) => `${index + 1}. ${formatScheduleEntry(entry)}`);

    return `${label}共有 ${entries.length} 节课：\n${lines.join('\n')}`;
};

type CourseCommunityScope = 'reviews' | 'chat' | 'teaming' | 'all';

const extractCourseCode = (query: string): string | null => {
    const match = query.toUpperCase().match(/\b([A-Z]{2,6}\s?\d{4}[A-Z]?)\b/);
    if (!match) return null;
    return match[1].replace(/\s+/g, '');
};

const extractCourseSearchTerm = (query: string): string => {
    const withoutCode = query.replace(/\b[A-Za-z]{2,6}\s?\d{4}[A-Za-z]?\b/g, ' ');
    const cleaned = withoutCode
        .replace(/课程|这门课|这堂课|评价|評價|点评|點評|review|reviews|chatroom|chat|聊天室|群聊|消息|teaming|组队|組隊|队友|隊友|情况|情況|怎么样|怎麼樣|如何|看看|想看|读取|讀取|read|about/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    return cleaned;
};

const detectCourseCommunityScope = (query: string): CourseCommunityScope => {
    if (/聊天室|群聊|chatroom|chat|message/i.test(query)) return 'chat';
    if (/组队|組隊|队友|隊友|teaming|teammate|team up/i.test(query)) return 'teaming';
    if (/评价|評價|点评|點評|review|reviews|口碑/i.test(query)) return 'reviews';
    return 'all';
};

const isScheduleQuery = (query: string): boolean => {
    return /课表|課表|课程安排|課程安排|今天.*课|今天.*課|明天.*课|明天.*課|周[一二三四五六日天].*课|星期[一二三四五六日天].*课|下一节|下节|下一堂|next class|today.*class|tomorrow.*class/i.test(query);
};

const isCourseCommunityQuery = (query: string): boolean => {
    const hasCourseIdentity = Boolean(extractCourseCode(query)) || /这门课|這門課|这堂课|這堂課|课程|課程/.test(query);
    const hasCommunityIntent = /评价|評價|点评|點評|review|reviews|聊天室|群聊|chatroom|chat|message|teaming|组队|組隊|队友|隊友|口碑|怎么样|怎麼樣|如何|值得上吗|值得上嗎|好不好|活跃吗|活躍嗎/.test(query);
    return hasCommunityIntent && hasCourseIdentity;
};

const formatReviewSummary = (reviews: Review[], course: Course): string => {
    if (reviews.length === 0) {
        return `${course.code} 目前还没有评价。`;
    }

    const ratedReviews = reviews.filter(review => typeof review.rating === 'number');
    const average = ratedReviews.length > 0
        ? (ratedReviews.reduce((sum, review) => sum + (review.rating || 0), 0) / ratedReviews.length).toFixed(1)
        : null;
    const preview = reviews.slice(0, 3).map((review, index) => {
        const ratingText = typeof review.rating === 'number' ? ` ${review.rating}星` : '';
        const content = review.content.length > 80 ? `${review.content.slice(0, 80)}...` : review.content;
        return `${index + 1}. ${review.authorName}${ratingText}：${content}`;
    });

    const header = average
        ? `${course.code} 目前有 ${reviews.length} 条评价，平均约 ${average} 星。`
        : `${course.code} 目前有 ${reviews.length} 条文字评价。`;

    return `${header}\n${preview.join('\n')}`;
};

const formatChatSummary = (messages: any[], course: Course): string => {
    if (messages.length === 0) {
        return `${course.code} 聊天室目前还没有消息。`;
    }

    const preview = messages.slice(-5).map((message: any, index: number) => {
        const author = message.users?.display_name || message.sender_id || '匿名同学';
        const content = String(message.content || '').replace(/\s+/g, ' ').trim();
        const shortened = content.length > 60 ? `${content.slice(0, 60)}...` : content;
        return `${index + 1}. ${author}：${shortened}`;
    });

    return `${course.code} 聊天室最近有 ${messages.length} 条消息，最新几条是：\n${preview.join('\n')}`;
};

const formatTeamingSummary = (requests: CourseTeaming[], course: Course): string => {
    if (requests.length === 0) {
        return `${course.code} 目前还没有公开的 teaming 帖子。`;
    }

    const preview = requests.slice(0, 3).map((item, index) => {
        const intro = item.selfIntro
            ? (item.selfIntro.length > 60 ? `${item.selfIntro.slice(0, 60)}...` : item.selfIntro)
            : '没有填写自我介绍';
        const target = item.targetTeammate ? `；想找 ${item.targetTeammate}` : '';
        return `${index + 1}. ${item.userName} [section ${item.section}]：${intro}${target}`;
    });

    return `${course.code} 目前有 ${requests.length} 条 teaming 帖子：\n${preview.join('\n')}`;
};

const buildCourseCommunityIdCandidates = async (course: Course, query: string): Promise<string[]> => {
    const candidates = new Set<string>();
    const codeFromQuery = extractCourseCode(query);
    const normalizedCode = (course.code || codeFromQuery || '').toUpperCase().replace(/\s+/g, '');
    const lowerCode = normalizedCode.toLowerCase();

    if (course.id) {
        candidates.add(course.id);
        candidates.add(String(course.id).toLowerCase());
        candidates.add(String(course.id).toUpperCase());
    }

    if (normalizedCode) {
        candidates.add(normalizedCode);
        candidates.add(lowerCode);
        candidates.add(`local_${normalizedCode}`);
        candidates.add(`local_${lowerCode}`);
    }

    if (codeFromQuery) {
        candidates.add(codeFromQuery);
        candidates.add(codeFromQuery.toLowerCase());
        candidates.add(`local_${codeFromQuery}`);
        candidates.add(`local_${codeFromQuery.toLowerCase()}`);
    }

    const byCode = normalizedCode ? await getCourseByCode(normalizedCode) : null;
    if (byCode?.id) {
        candidates.add(byCode.id);
    }

    return Array.from(candidates).filter(Boolean);
};

/**
 * The AgentExecutor handles the ReAct (Reasoning + Acting) loop.
 * It coordinates between the LLM and the local Tools.
 */
export class AgentExecutor {
    private context: AgentContext;

    constructor(userId: string) {
        this.context = {
            userId,
            sessionId: `session_${Date.now()}`,
            history: [],
            deviceLocation: null,
        };
    }

    setDeviceLocation(location: AgentGeoPoint | null) {
        this.context.deviceLocation = location;
    }

    /**
     * Main entry point for user prompts
     */
    async process(prompt: string, onUpdate?: (text: string) => void): Promise<AgentResponse> {
        this.context.history.push({ role: 'user', content: prompt });

        const routed = await this.tryLocalRoute(prompt);
        if (routed) {
            return routed;
        }

        let currentStep = 0;
        const maxSteps = 5;
        const steps: AgentStep[] = [];

        while (currentStep < maxSteps) {
            // 1. Ask real LLM for next step
            const decision = await this.realDeepSeekCall(prompt, steps, onUpdate);
            steps.push(decision);

            if (!decision.action) {
                // No more actions, the LLM has provided the final answer
                break;
            }

            // 2. Execute the Tool
            const observation = await this.executeTool(decision.action.tool, decision.action.input);
            decision.observation = observation;

            currentStep++;
        }

        return {
            steps,
            finalAnswer: steps[steps.length - 1].reply || steps[steps.length - 1].thought
        };
    }

    private async tryLocalRoute(prompt: string): Promise<AgentResponse | null> {
        if (isScheduleQuery(prompt)) {
            const observation = await this.readUserSchedule(prompt);
            return {
                steps: [{
                    thought: '本地命中课表查询',
                    action: {
                        tool: 'read_user_schedule',
                        input: { query: prompt }
                    },
                    observation,
                    reply: observation
                }],
                finalAnswer: observation
            };
        }

        if (isNearbyPlaceQuery(prompt)) {
            const observation = await this.findNearbyPlace(prompt);
            return {
                steps: [{
                    thought: '本地命中附近地点查询',
                    action: {
                        tool: 'find_nearby_place',
                        input: { query: prompt }
                    },
                    observation,
                    reply: observation
                }],
                finalAnswer: observation
            };
        }

        if (isBuildingInfoQuery(prompt)) {
            const observation = await this.readCampusBuilding(prompt);
            return {
                steps: [{
                    thought: '本地命中建筑信息查询',
                    action: {
                        tool: 'read_campus_building',
                        input: { query: prompt }
                    },
                    observation,
                    reply: observation
                }],
                finalAnswer: observation
            };
        }

        if (isCourseCommunityQuery(prompt)) {
            const observation = await this.readCourseCommunity(prompt);
            return {
                steps: [{
                    thought: '本地命中课程社区查询',
                    action: {
                        tool: 'read_course_community',
                        input: { query: prompt }
                    },
                    observation,
                    reply: observation
                }],
                finalAnswer: observation
            };
        }

        return null;
    }

    private async executeTool(toolName: string, input: any): Promise<string> {
        console.log(`[Agent] Executing tool: ${toolName}`, input);

        // Real and Mock tool implementations
        switch (toolName) {
            case 'read_user_schedule':
                return this.readUserSchedule(input?.query || '');
            case 'read_campus_building':
                return this.readCampusBuilding(input?.query || '');
            case 'find_nearby_place':
                return this.findNearbyPlace(input?.query || '');
            case 'read_course_community':
                return this.readCourseCommunity(input?.query || '');
            case 'get_user_profile':
                const facts = await getAllUserFacts(this.context.userId);
                if (Object.keys(facts).length === 0) {
                    return JSON.stringify({ major: 'Computer Science', hall: 'Hall 1', status: 'First Time User' });
                }
                return JSON.stringify(facts);
            case 'save_user_preference':
                await saveMemoryFact(this.context.userId, input.key, input.value);
                return `Successfully remembered that your ${input.key} is ${input.value}.`;
            case 'search_canteen_menu':
                return "Nearby Harmony Cafeteria has 'Spicy Chicken' on special today. It's only 5 mins from Hall 1.";
            case 'check_library_availability':
                try {
                    const result = await agentBridge.injectAndObserve(LIBRARY_SCRIPTS.SCAN_SLOTS, 'LIBRARY_SCAN_RESULT');
                    const availCount = (result.slots as any[]).filter(s => s.status === 'available').length;
                    return `I scanned the library page and found ${availCount} available slots.`;
                } catch (e) {
                    console.warn('[Agent] Real-time scan failed, using mock data.', e);
                    return "Floor 3 has 15 individual carrels available at the moment.";
                }
            case 'book_library_seat':
                return "Seat reservation initiated. Please confirm the time on the screen.";
            case 'search_campus_faq':
                // 1. Search local legacy FAQs
                const localResults = FAQService.searchFAQs(input.query);

                // 2. Search new Supabase Knowledge Base (73 chunks)
                const kbResults = await FAQService.searchKnowledgeBase(input.query);

                if (localResults.length === 0 && kbResults.length === 0) {
                    return "I couldn't find a specific answer in the official documents for that query. You might want to check the HKBU website directly.";
                }

                let responseText = "Here is what I found in the official HKBU records:\n\n";

                if (kbResults.length > 0) {
                    responseText += "### Official Student Handbook & Knowledge Base:\n";
                    responseText += kbResults.map((kb: any) => `- ${kb.content}`).join('\n\n');
                    responseText += "\n\n";
                }

                if (localResults.length > 0) {
                    responseText += "### Quick FAQ Reference:\n";
                    responseText += localResults.map(f => `Q: ${f.question_zh}\nA: ${f.answer_zh}`).join('\n\n');
                }

                return responseText;
            default:
                return `Error: Tool ${toolName} not found.`;
        }
    }

    private async readUserSchedule(query: string): Promise<string> {
        try {
            const entries = await getUserScheduleEntries(this.context.userId);
            if (entries.length === 0) {
                return '你的个人课表里还没有课程。你可以先去 Profile 里的 My Schedule 导入或手动添加。';
            }

            const parsed = parseScheduleQuery(query);
            const sortedEntries = [...entries].sort((a, b) => {
                if (a.dayOfWeek !== b.dayOfWeek) return a.dayOfWeek - b.dayOfWeek;
                return getEntrySortValue(a) - getEntrySortValue(b);
            });

            if (parsed.intent === 'next') {
                const now = getHongKongNow();
                const currentMinutes = now.getHours() * 60 + now.getMinutes();
                const todayEntries = sortedEntries.filter(entry => entry.dayOfWeek === parsed.dayOfWeek);
                const nextEntry = todayEntries.find(entry => {
                    const startMinutes = getEntryStartMinutes(entry);
                    return startMinutes !== null && startMinutes >= currentMinutes;
                });

                if (nextEntry) {
                    return `你下一节课是：${formatScheduleEntry(nextEntry)}。`;
                }

                return '你今天后面没有更多课了。';
            }

            if (parsed.intent === 'today' || parsed.intent === 'tomorrow' || parsed.intent === 'weekday') {
                const dayOfWeek = parsed.dayOfWeek || getHongKongDayOfWeek();
                const dayEntries = sortedEntries.filter(entry => entry.dayOfWeek === dayOfWeek);
                const label = parsed.intent === 'today'
                    ? '你今天'
                    : parsed.intent === 'tomorrow'
                        ? '你明天'
                        : `${WEEKDAY_LABELS[dayOfWeek]}`;
                return formatScheduleSummary(dayEntries, label);
            }

            const grouped = Object.entries(
                sortedEntries.reduce<Record<string, UserScheduleEntry[]>>((acc, entry) => {
                    const key = WEEKDAY_LABELS[entry.dayOfWeek] || `周${entry.dayOfWeek}`;
                    if (!acc[key]) acc[key] = [];
                    acc[key].push(entry);
                    return acc;
                }, {})
            ).map(([label, dayEntries]) => formatScheduleSummary(dayEntries, label));

            return `这是你当前课表概览：\n\n${grouped.join('\n\n')}`;
        } catch (error) {
            console.error('[Agent] Failed to read user schedule:', error);
            return '我暂时没法读取你的课表，可能是登录状态或数据库访问出了问题。';
        }
    }

    private async readCampusBuilding(query: string): Promise<string> {
        try {
            return await formatBuildingInfo(query);
        } catch (error) {
            console.error('[Agent] Failed to read campus building:', error);
            return '我暂时没法读取这栋楼的信息，请稍后再试。';
        }
    }

    private async findNearbyPlace(query: string): Promise<string> {
        try {
            return await formatNearbyPlaceInfo(query, this.context.deviceLocation);
        } catch (error) {
            console.error('[Agent] Failed to find nearby place:', error);
            return '我暂时没法根据你的位置找附近地点，请稍后再试。';
        }
    }

    private async resolveCourseFromQuery(query: string): Promise<Course | null> {
        const code = extractCourseCode(query);
        if (code) {
            const exact = await getCourseByCode(code);
            if (exact) return exact;

            // If the user provided an explicit course code, trust that signal first.
            // Do not fall through to fuzzy text search like "在聊啥", which can match unrelated courses.
            return {
                id: code,
                code,
                name: code,
                instructor: '',
                department: '',
                credits: 0,
                rating: 0,
                reviewCount: 0,
            };
        }

        const searchTerm = extractCourseSearchTerm(query) || code || query.trim();
        if (!searchTerm) return null;

        const results = await searchCourses(searchTerm, 5);
        if (results.length === 0) return null;

        if (code) {
            const matched = results.find(course => course.code?.toUpperCase().replace(/\s+/g, '') === code);
            if (matched) return matched;
        }

        return results[0];
    }

    private async readCourseCommunity(query: string): Promise<string> {
        try {
            const course = await this.resolveCourseFromQuery(query);
            if (!course) {
                return '我没定位到你说的是哪门课。请尽量带上课程代码，比如 COMP3015。';
            }

            const scope = detectCourseCommunityScope(query);
            const courseIds = await buildCourseCommunityIdCandidates(course, query);

            if (scope === 'reviews') {
                const reviews = await getReviews(course.id, course.code);
                return formatReviewSummary(reviews, course);
            }

            if (scope === 'chat') {
                const { data, error } = await supabase
                    .from('messages')
                    .select('content, sender_id, users(display_name)')
                    .in('course_id', courseIds)
                    .order('created_at', { ascending: true });

                if (error) {
                    console.error('[Agent] Failed to read course chat:', error);
                    return `我暂时没法读取 ${course.code} 的聊天室。`;
                }

                return formatChatSummary(data || [], course);
            }

            if (scope === 'teaming') {
                const requests = await fetchTeamingRequests(course.id);
                return formatTeamingSummary(requests, course);
            }

            const [reviews, messagesResult, requests] = await Promise.all([
                getReviews(course.id, course.code),
                supabase
                    .from('messages')
                    .select('content, sender_id, users(display_name)')
                    .in('course_id', courseIds)
                    .order('created_at', { ascending: true }),
                fetchTeamingRequests(course.id),
            ]);

            const chatText = messagesResult.error
                ? `${course.code} 聊天室暂时读取失败。`
                : formatChatSummary(messagesResult.data || [], course);

            return [
                `${course.code} ${course.name} 的社区概况：`,
                formatReviewSummary(reviews, course),
                chatText,
                formatTeamingSummary(requests, course),
            ].join('\n\n');
        } catch (error) {
            console.error('[Agent] Failed to read course community:', error);
            return '我暂时没法读取这门课的评价、聊天室或 teaming 信息。';
        }
    }

    private async realDeepSeekCall(prompt: string, previousSteps: AgentStep[], onUpdate?: (text: string) => void): Promise<AgentStep> {
        const systemPrompt = `You are "HKCampus Assistant" (浸大领航员), the exclusive AI assistant for Hong Kong Baptist University (HKBU) students.

## Your Persona & Tone:
1. You are a friendly, knowledgeable, and enthusiastic senior student at HKBU.
2. You speak naturally, concisely, and use emojis where appropriate.
3. Your primary language for replies is Chinese, but you can understand English perfectly. You may mix in common HKBU English slang (e.g., "Reg course", "AAB", "Main Lib", "Canteen").

## Core Rules & Boundaries:
1. EXCLUSIVE DOMAIN: You ONLY answer questions related to HKBU campus life, academic affairs, campus facilities (library, canteens, classrooms, dorms), student activities, and the HKCampus app.
2. REFUSAL POLICY: If a user asks a question completely unrelated to HKBU or university life (e.g., "Write a script", "Who is the US president", "Explain physics"), you MUST politely decline and steer the conversation back to campus topics.
   Example: "哈哈，这个问题超纲啦！作为你的专属校园助手，我更擅长带你吃遍浸大、找空闲课室或者抢图书馆座位哦。校园生活有什么需要帮忙的吗？🎓"
3. HONESTY: Do not hallucinate facts. If you do not know the answer, use a tool to find it.
4. PERSONAL SCHEDULE: If the user asks about their own classes, timetable, next class, or classes on a certain day, you MUST use the "read_user_schedule" tool.
5. COURSE COMMUNITY: If the user asks about a course's reviews, chatroom, teaming posts, or overall community status, you MUST use the "read_course_community" tool.
6. BUILDINGS: If the user asks where a building is, what a building code means, or asks about a campus building, you MUST use the "read_campus_building" tool.
7. NEARBY PLACES: If the user asks what is near them, where they are now, or which building/restaurant is closest, you MUST use the "find_nearby_place" tool.

Available Tools:
${JSON.stringify(TOOLS, null, 2)}

ReAct Protocol & Optimization:
1. If you NEED to use a tool, output ONLY "thought" (max 10 words) and "action".
2. If you CAN answer directly, output ONLY "reply" (generate this immediately so the user can see it streaming). DO NOT output "thought".

Response Format (JSON only):
{
  "thought": "Brief reasoning ONLY IF using a tool",
  "action": { "tool": "tool_name", "input": { "param": "value" } }, // ONLY IF using a tool
  "reply": "Your final response in Chinese (ONLY IF NOT using a tool)"
}

Current context:
- User Prompt: ${prompt}
- Progress so far: ${JSON.stringify(previousSteps)}`;

        try {
            const llmOutput = await callDeepSeekStream([
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt }
            ], (currentJsonStr) => {
                if (onUpdate) {
                    const match = currentJsonStr.match(/"reply"\s*:\s*"((?:[^"\\]|\\.)*)/);
                    if (match) {
                        try {
                            // Safely unescape the partial JSON string
                            let unescaped = match[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
                            onUpdate(unescaped);
                        } catch (e) { }
                    }
                }
            });

            // Clean up potentially backticked JSON
            const jsonStr = llmOutput.replace(/```json/g, '').replace(/```/g, '').trim();
            const result = JSON.parse(jsonStr);

            return {
                thought: result.thought,
                reply: result.reply,
                action: result.action
            };
        } catch (e) {
            console.error('[Agent] Real LLM call failed, falling back to basic mock.', e);
            return { thought: "抱歉，由于网络或 API 问题，我暂时无法进行深度推理。请稍后再试。" };
        }
    }
}
