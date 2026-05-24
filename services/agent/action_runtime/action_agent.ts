/**
 * Action Agent
 *
 * LLM-driven action identification and field extraction.
 * Replaces the old plan_next_step -> prepare_action -> clarify_user chain
 * for write operations.
 * See docs/agent/action-agent-contract-and-flow.md §8 and migration doc §3.2.
 */

import { callDeepSeek } from '../llm';
import type {
    ActionAgentInput,
    ActionAgentResult,
    ActionType,
    PendingDraft,
    PostCourseReviewDraft,
} from './types';
import {
    buildActionPayload,
    computeMissingFields,
    createDefaultDraft,
    buildSummary,
    createUiSchema,
} from './contract';
import { getPresetContentForRating } from './followup_router';
import { processFollowup, classifyFollowup } from './followup_router';
import { buildToolCallFromDraft } from './tool_adapter';
import { buildSuccessResult, buildFailureResult, buildCancelResult } from './template_response';

// ─── Action Type Detection (local, no LLM) ──────────────────────────

const ACTION_PATTERNS: Array<{ pattern: RegExp; actionType: ActionType }> = [
    { pattern: /发.*评价|写.*评价|发布.*评价|(?:想|要|给.*写|帮我写|帮我发).*评价|评价.*课|评价一下|write.*review|post.*review/i, actionType: 'post_course_review' },
    { pattern: /组队|找队友|teaming|队友/i, actionType: 'post_course_teaming' },
    { pattern: /聊天室|群聊|发.*消息|chatroom|send.*message/i, actionType: 'send_course_chat_message' },
    { pattern: /日历|calendar|记.*日历|创建.*事件/i, actionType: 'create_user_calendar_event' },
    { pattern: /课表|schedule|记.*课表|写.*课表/i, actionType: 'write_user_schedule_entry' },
];

export const detectActionType = (input: string): ActionType | null => {
    for (const { pattern, actionType } of ACTION_PATTERNS) {
        if (pattern.test(input)) return actionType;
    }
    return null;
};

// ─── LLM-based Field Extraction ─────────────────────────────────────

const buildExtractionPrompt = (actionType: ActionType, input: string): Array<{ role: string; content: string }> => [
    {
        role: 'system',
        content: `你是一个字段提取助手。用户想要执行 "${actionType}" 操作。
请从用户输入中提取相关字段，返回纯 JSON（不要 markdown 代码块）。

post_course_review 字段：
- courseCode: string | null (课程代码，如 COMP3015)
- rating: number | null (1-5 星)
- content: string (评价内容)
- anonymous: boolean (是否匿名，默认 false)

post_course_teaming 字段：
- courseCode: string | null
- section: string (小组，如 A1)
- content: string (自我介绍)
- contactMethod: string (联系方式)

send_course_chat_message 字段：
- courseCode: string | null
- content: string (消息内容)

create_user_calendar_event 字段：
- title: string
- eventType: string (exam/quiz/assignment/custom)
- eventDate: string | null (YYYY-MM-DD)
- startTime: string | null (HH:MM)
- endTime: string | null (HH:MM)
- location: string
- note: string
- courseCode: string | null

write_user_schedule_entry 字段：
- title: string
- courseCode: string | null
- dayOfWeek: number | null (1-7)
- startTime: string | null (HH:MM)
- endTime: string | null (HH:MM)
- room: string
- weekText: string

只返回能从输入中提取到的字段，不要猜测。如果某个字段无法提取，不要包含在返回中。
返回格式：{"fieldName": "value", ...}`,
    },
    { role: 'user', content: input },
];

const extractFieldsViaLLM = async (
    actionType: ActionType,
    input: string
): Promise<Record<string, any>> => {
    try {
        const raw = await callDeepSeek(buildExtractionPrompt(actionType, input));
        // Try to parse JSON from the response
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return {};
    } catch {
        return {};
    }
};

// ─── Preset Content Injection ────────────────────────────────────────

const injectPresetContent = (draft: PostCourseReviewDraft): PostCourseReviewDraft => {
    if (draft.rating != null && !draft.content) {
        const presets = getPresetContentForRating(draft.rating);
        if (presets.length > 0) {
            return { ...draft, content: presets[0] };
        }
    }
    return draft;
};

// ─── Main Entry Point ───────────────────────────────────────────────

export const runActionAgent = async (
    input: ActionAgentInput,
    executeTool?: (toolName: string, toolInput: Record<string, any>) => Promise<{ success: boolean }>
): Promise<ActionAgentResult> => {
    const { pendingDraft, requestId, sessionId } = input;

    // ─── Handle followup if there's a pending draft ─────────────────
    if (pendingDraft) {
        const followupKind = classifyFollowup(input.input);

        // Cancel
        if (followupKind === 'cancel') {
            return buildCancelResult(pendingDraft, requestId, sessionId);
        }

        // Confirm → execute tool
        if (followupKind === 'confirm') {
            const missingFields = computeMissingFields(pendingDraft.actionType, pendingDraft.draft);
            if (missingFields.length === 0) {
                if (executeTool) {
                    const toolCall = buildToolCallFromDraft(pendingDraft, input.userId);
                    try {
                        const result = await executeTool(toolCall.toolName, toolCall.input);
                        if (result.success) {
                            return buildSuccessResult(pendingDraft, requestId, sessionId);
                        }
                        return buildFailureResult(pendingDraft, requestId, sessionId);
                    } catch {
                        return buildFailureResult(pendingDraft, requestId, sessionId);
                    }
                }
                // No executor available, return confirm state
                return {
                    finalAnswer: '请确认是否发布这条课程评价。',
                    actionPayload: buildActionPayload({
                        actionType: pendingDraft.actionType,
                        draft: pendingDraft.draft,
                        requestId,
                        sessionId,
                        messageText: '请确认是否发布这条课程评价。',
                        phaseOverride: 'confirm',
                        statusOverride: 'ready_for_confirmation',
                    }),
                    pendingDraft,
                    toolExecuted: false,
                };
            }
        }

        // Free text → try slot filling
        const result = processFollowup(input.input, pendingDraft);
        if (result.updatedDraft) {
            const updated = result.updatedDraft;
            const missingFields = computeMissingFields(updated.actionType, updated.draft);

            // If all fields filled, move to confirm
            if (missingFields.length === 0) {
                const d = updated.draft as Record<string, any>;
                return {
                    finalAnswer: '参数已齐全，请确认是否提交。',
                    actionPayload: buildActionPayload({
                        actionType: updated.actionType,
                        draft: updated.draft,
                        requestId,
                        sessionId,
                        messageText: '参数已齐全，请确认是否提交。',
                        phaseOverride: 'confirm',
                        statusOverride: 'ready_for_confirmation',
                    }),
                    pendingDraft: updated,
                    toolExecuted: false,
                };
            }

            // Still missing fields
            const isBareNumber = /^\d{3,6}$/.test(input.input.trim()) && !/^[1-5]$/.test(input.input.trim());
            const missingLabels = missingFields.map(f => {
                if (f === 'courseCode') return isBareNumber ? '完整课程代码（如 COMP1006，数字代码可能对应多个课程）' : '课程代码';
                if (f === 'rating') return '评分';
                if (f === 'content') return '评价内容';
                return f;
            });
            const text = `还需要补充：${missingLabels.join('、')}`;
            return {
                finalAnswer: text,
                actionPayload: buildActionPayload({
                    actionType: updated.actionType,
                    draft: updated.draft,
                    requestId,
                    sessionId,
                    messageText: text,
                }),
                pendingDraft: updated,
                toolExecuted: false,
            };
        }

        // Cancel result
        return buildCancelResult(pendingDraft, requestId, sessionId);
    }

    // ─── New action request ─────────────────────────────────────────
    const actionType = detectActionType(input.input);
    if (!actionType) {
        return {
            finalAnswer: '我暂时还不能处理这个写操作，请先改成课程评价、组队、课表或日历事件。',
            actionPayload: null,
            pendingDraft: null,
            toolExecuted: false,
        };
    }

    // Extract fields via LLM
    const extracted = await extractFieldsViaLLM(actionType, input.input);
    let draft = { ...createDefaultDraft(actionType), ...extracted } as any;

    // Inject preset content for reviews
    if (actionType === 'post_course_review') {
        draft = injectPresetContent(draft);
    }

    const missingFields = computeMissingFields(actionType, draft);
    const summary = buildSummary(actionType, draft, 'draft');

    const newPendingDraft: PendingDraft = {
        actionType,
        phase: 'draft',
        status: 'awaiting_user_input',
        draft,
        missingFields,
        uiSchema: createUiSchema(actionType, 'draft'),
        summary,
        source: 'action_agent',
        requestId,
        sessionId,
    };

    const text = missingFields.length > 0
        ? `我可以帮你${actionType === 'post_course_review' ? '发课程评价' : actionType === 'post_course_teaming' ? '发组队信息' : actionType === 'send_course_chat_message' ? '发消息' : actionType === 'create_user_calendar_event' ? '创建日历事件' : '写课表'}，还需要补充：${missingFields.map(f => f === 'courseCode' ? '课程代码' : f === 'rating' ? '评分' : f === 'content' ? '评价内容' : f).join('、')}`
        : '参数已齐全，请确认是否提交。';

    return {
        finalAnswer: text,
        actionPayload: buildActionPayload({
            actionType,
            draft,
            requestId,
            sessionId,
            messageText: text,
        }),
        pendingDraft: newPendingDraft,
        toolExecuted: false,
    };
};
