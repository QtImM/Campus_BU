export type StableTaskDecision =
    | {
        type: 'memory_write';
        key: string;
        value: string;
        reason: string;
        matchedText?: string;
    }
    | {
        type: 'memory_read';
        key: string;
        reason: string;
        matchedText?: string;
    }
    | {
        type: 'faq_lookup';
        normalizedQuery: string;
        reason: string;
        topic: string;
        matchedText?: string;
    }
    | {
        type: 'write_confirmation';
        intent: 'confirm' | 'cancel';
        reason: string;
        matchedText?: string;
    }
    | {
        type: 'none';
        reason: string;
    };

const normalize = (value: string): string => value.trim();

const FAQ_TOPICS: Array<{ topic: string; patterns: RegExp[]; canonicalTerms: string[] }> = [
    { topic: 'gpa', patterns: [/gpa|绩点|績點|平均分/i], canonicalTerms: ['gpa', '绩点'] },
    { topic: 'library', patterns: [/library|main lib|图书馆|圖書館/i], canonicalTerms: ['图书馆', 'library'] },
    { topic: 'calendar', patterns: [/academic calendar|calendar|校历|校曆/i], canonicalTerms: ['academic calendar', '校历'] },
    { topic: 'hall', patterns: [/hall|residence|宿舍|住宿/i], canonicalTerms: ['hall', '宿舍'] },
    { topic: 'wifi', patterns: [/wifi|eduroam|internet|网络|網絡/i], canonicalTerms: ['wifi', 'eduroam'] },
    { topic: 'it_support', patterns: [/it service|it support|ito|技术支持|技術支援/i], canonicalTerms: ['it service', 'ito'] },
    { topic: 'tuition', patterns: [/tuition|fee|学费|學費|费用|費用/i], canonicalTerms: ['tuition', '学费'] },
    { topic: 'handbook', patterns: [/handbook|student handbook|学生手册|學生手冊/i], canonicalTerms: ['student handbook', '学生手册'] },
    { topic: 'visa', patterns: [/visa|签证|簽證|iang/i], canonicalTerms: ['visa', 'iang'] },
    { topic: 'course_registration', patterns: [/add\s*drop|add\/drop|选课|選課|注册|註冊|reg course/i], canonicalTerms: ['add drop', '选课', '注册'] },
    { topic: 'transcript', patterns: [/transcript|成绩单|成績單/i], canonicalTerms: ['transcript', '成绩单'] },
    { topic: 'scholarship', patterns: [/scholarship|financial aid|奖学金|獎學金|资助|資助/i], canonicalTerms: ['scholarship', 'financial aid', '奖学金'] },
];

const buildCanonicalFaqQuery = (prompt: string): { normalizedQuery: string; topic: string } | null => {
    const normalizedPrompt = normalize(prompt);
    for (const topic of FAQ_TOPICS) {
        if (topic.patterns.some(pattern => pattern.test(normalizedPrompt))) {
            const suffix = normalizedPrompt
                .replace(/[？?！!，,。.:：;；"'`()\[\]{}<>/\-_]/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
            return {
                topic: topic.topic,
                normalizedQuery: `${topic.canonicalTerms.join(' ')} ${suffix}`.trim(),
            };
        }
    }
    return null;
};

const inferMemoryKeyFromRead = (prompt: string): string | null => {
    if (/专业|major/i.test(prompt)) return 'major';
    if (/宿舍|hall|住宿|residence/i.test(prompt)) return 'hall';
    if (/喜欢吃|鍾意食|爱吃|愛吃|食物|food/i.test(prompt)) return 'favorite_food';
    if (/怎么称呼|點稱呼|nickname|叫我/i.test(prompt)) return 'nickname';
    if (/语言|語言|language/i.test(prompt)) return 'language_preference';
    return null;
};

const extractMemoryWrite = (prompt: string): { key: string; value: string } | null => {
    const nickname = prompt.match(/(?:以后)?(?:你可以)?叫我\s*([A-Za-z0-9_\-\u4e00-\u9fff]+)/i);
    if (nickname?.[1]) return { key: 'nickname', value: normalize(nickname[1]) };

    const major = prompt.match(/(?:我是|我读|我讀)\s*([A-Za-z&\s\u4e00-\u9fff]{2,40})\s*(?:专业|系|major)/i);
    if (major?.[1]) return { key: 'major', value: normalize(major[1]) };

    const hall = prompt.match(/(?:我住|我住在|我住係|记住我住|記住我住)\s*([A-Za-z0-9\-\s\u4e00-\u9fff]{2,40})/i);
    if (hall?.[1]) return { key: 'hall', value: normalize(hall[1]) };

    const favoriteFood = prompt.match(/(?:我喜欢吃|我喜歡食|我鍾意食|我爱吃|我愛吃)\s*([A-Za-z0-9\-\s\u4e00-\u9fff]{2,40})/i);
    if (favoriteFood?.[1]) return { key: 'favorite_food', value: normalize(favoriteFood[1]) };

    const language = prompt.match(/(?:我偏好|我習慣|我习惯|我喜欢用)\s*(中文|英文|english|chinese)/i);
    if (language?.[1]) return { key: 'language_preference', value: normalize(language[1]) };

    return null;
};

export const inferStableTask = (prompt: string): StableTaskDecision => {
    const normalized = prompt.trim();
    if (!normalized) return { type: 'none', reason: 'empty prompt' };

    if (/^(是|好的|好|确认|確認|可以|就这样|就這樣|没问题|沒問題|yes|ok|okay|confirm|send|发送|發送)$/i.test(normalized)) {
        return {
            type: 'write_confirmation',
            intent: 'confirm',
            reason: 'write confirmation intent recognized',
            matchedText: normalized,
        };
    }

    if (/^(取消|算了|不用了|先不用|停止|cancel|never mind)$/i.test(normalized)) {
        return {
            type: 'write_confirmation',
            intent: 'cancel',
            reason: 'write cancellation intent recognized',
            matchedText: normalized,
        };
    }

    if (/你记得|你記得|还记得|仲記得|記唔記得|记不记得|有没有记住|有冇記住/i.test(normalized)) {
        const key = inferMemoryKeyFromRead(normalized);
        if (key) {
            return {
                type: 'memory_read',
                key,
                reason: `memory read for ${key}`,
                matchedText: normalized,
            };
        }
    }

    if (/记住|記住|记一下|記一下|以后叫我|你可以叫我|帮我记住|幫我記住/i.test(normalized)) {
        const extracted = extractMemoryWrite(normalized);
        if (extracted) {
            return {
                type: 'memory_write',
                key: extracted.key,
                value: extracted.value,
                reason: `memory write for ${extracted.key}`,
                matchedText: normalized,
            };
        }
    }

    const faqQuery = buildCanonicalFaqQuery(normalized);
    if (faqQuery) {
        return {
            type: 'faq_lookup',
            normalizedQuery: faqQuery.normalizedQuery,
            topic: faqQuery.topic,
            reason: `stable faq lookup for ${faqQuery.topic}`,
            matchedText: normalized,
        };
    }

    return { type: 'none', reason: 'no stable subtask matched' };
};
