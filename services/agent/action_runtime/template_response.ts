/**
 * Template Response Builder
 *
 * Generates template-based responses for success/failure/cancel without LLM calls.
 * See docs/agent/action-agent-contract-and-flow.md §9.4, §13.
 */

import type { ActionAgentResult, ActionType, PendingDraft } from './types';
import { buildActionPayload, getEditableFields } from './contract';

const SUCCESS_MESSAGES: Record<ActionType, (draft: Record<string, any>) => string> = {
    post_course_review: (d) => `已帮你发布到 ${d.courseCode || '课程'} 的课程评价。`,
    post_course_teaming: (d) => `已帮你发布到 ${d.courseCode || '课程'} 的组队信息。`,
    send_course_chat_message: (d) => `已帮你发送到 ${d.courseCode || '课程'} 聊天室。`,
    create_user_calendar_event: (d) => `已帮你创建日历事件：${d.title || '事件'}。`,
    write_user_schedule_entry: (d) => `已帮你写入课表：${d.title || '课程'}。`,
};

const FAILURE_MESSAGES: Record<ActionType, (draft: Record<string, any>) => string> = {
    post_course_review: (d) => `发布 ${d.courseCode || '课程'} 的评价失败了，请稍后重试。`,
    post_course_teaming: (d) => `发布 ${d.courseCode || '课程'} 的组队信息失败了，请稍后重试。`,
    send_course_chat_message: (d) => `发送到 ${d.courseCode || '课程'} 聊天室失败了，请稍后重试。`,
    create_user_calendar_event: (d) => `创建日历事件失败了，请稍后重试。`,
    write_user_schedule_entry: (d) => `写入课表失败了，请稍后重试。`,
};

const CANCEL_MESSAGE = '已取消这次操作。你如果想改内容，直接重新告诉我，我会先给你确认稿。';

export const buildSuccessResult = (
    pendingDraft: PendingDraft,
    requestId: string,
    sessionId: string
): ActionAgentResult => {
    const d = pendingDraft.draft as Record<string, any>;
    const text = SUCCESS_MESSAGES[pendingDraft.actionType](d);

    return {
        finalAnswer: text,
        actionPayload: buildActionPayload({
            actionType: pendingDraft.actionType,
            draft: pendingDraft.draft,
            requestId,
            sessionId,
            messageText: text,
            messageTone: 'positive',
            phaseOverride: 'result',
            statusOverride: 'completed',
        }),
        pendingDraft: null,
        toolExecuted: true,
        toolSuccess: true,
    };
};

export const buildFailureResult = (
    pendingDraft: PendingDraft,
    requestId: string,
    sessionId: string
): ActionAgentResult => {
    const d = pendingDraft.draft as Record<string, any>;
    const text = FAILURE_MESSAGES[pendingDraft.actionType](d);
    const payload = buildActionPayload({
        actionType: pendingDraft.actionType,
        draft: pendingDraft.draft,
        requestId,
        sessionId,
        messageText: text,
        messageTone: 'error',
        phaseOverride: 'result',
        statusOverride: 'failed',
    });

    // Failure keeps the draft around so the user can retry or edit without starting over.
    payload.action.canCancel = true;
    payload.action.editableFields = getEditableFields(pendingDraft.actionType);
    payload.next = {
        expectedUserAction: 'fill_or_edit_draft',
        allowedInputs: ['retry', 'field_edit', 'free_text', 'cancel', 'confirm'],
    };

    return {
        finalAnswer: text,
        actionPayload: payload,
        pendingDraft,
        toolExecuted: true,
        toolSuccess: false,
    };
};

export const buildCancelResult = (
    pendingDraft: PendingDraft,
    requestId: string,
    sessionId: string
): ActionAgentResult => ({
    finalAnswer: CANCEL_MESSAGE,
    actionPayload: buildActionPayload({
        actionType: pendingDraft.actionType,
        draft: pendingDraft.draft,
        requestId,
        sessionId,
        messageText: CANCEL_MESSAGE,
        messageTone: 'neutral',
        phaseOverride: 'result',
        statusOverride: 'cancelled',
    }),
    pendingDraft: null,
    toolExecuted: false,
});
