/**
 * Action Agent Integration Tests
 *
 * Covers IT-001 through IT-009 from docs/agent/action-agent-contract-and-flow.md §15.2
 */

import { runActionAgent, detectActionType } from '../../../../services/agent/action_runtime/action_agent';
import { processFollowup, classifyFollowup } from '../../../../services/agent/action_runtime/followup_router';
import { buildToolCallFromDraft } from '../../../../services/agent/action_runtime/tool_adapter';
import { buildSuccessResult, buildFailureResult, buildCancelResult } from '../../../../services/agent/action_runtime/template_response';
import { computeMissingFields } from '../../../../services/agent/action_runtime/contract';
import type { PendingDraft, PostCourseReviewDraft, ActionAgentInput } from '../../../../services/agent/action_runtime/types';

jest.mock('../../../../app/i18n/i18n', () => ({
    t: (_key: string, vars?: Record<string, any>) => vars?.code ? `课程 ${vars.code} 不存在` : 'mocked',
}));

jest.mock('../../../../services/supabase', () => ({
    supabase: {
        from: jest.fn(() => ({
            select: jest.fn(() => ({
                eq: jest.fn(() => ({
                    maybeSingle: jest
                        .fn()
                        .mockResolvedValueOnce({ data: { id: 'course-1', code: 'ACCT1006', name: 'Accounting 1006' }, error: null })
                        .mockResolvedValue({ data: null, error: null }),
                })),
            })),
        })),
    },
}));

// Mock the LLM module
jest.mock('../../../../services/agent/llm', () => ({
    callDeepSeek: jest.fn().mockResolvedValue(JSON.stringify({
        courseCode: null,
        rating: null,
        content: '',
    })),
    resolveModelName: jest.fn().mockReturnValue('deepseek-v4-flash'),
}));

jest.mock('../../../../services/agent/graph/tools/course_community_tools', () => ({
    postCourseReviewTool: jest.fn().mockResolvedValue({ success: true }),
    postCourseTeamingTool: jest.fn().mockResolvedValue({ success: true }),
    sendCourseChatMessageTool: jest.fn().mockResolvedValue({ success: true }),
}));

jest.mock('../../../../services/agent/graph/tools/calendar_tools', () => ({
    createCalendarEventTool: jest.fn().mockResolvedValue({ success: true }),
}));

jest.mock('../../../../services/agent/graph/tools/schedule_tools', () => ({
    writeUserScheduleTool: jest.fn().mockResolvedValue({ success: true }),
}));

const makeInput = (
    text: string,
    pendingDraft: PendingDraft | null = null,
    sessionState: Record<string, any> = {}
): ActionAgentInput => ({
    input: text,
    userId: 'test_user',
    sessionId: 'test_session',
    requestId: 'test_request',
    pendingDraft,
    history: [],
    sessionState: {
        facts: {},
        recentDecisions: [],
        openLoops: [],
        ...sessionState,
    },
});

const makeReviewDraft = (overrides: Partial<PostCourseReviewDraft> = {}): PendingDraft => ({
    actionType: 'post_course_review',
    phase: 'draft',
    status: 'awaiting_user_input',
    draft: {
        courseCode: overrides.courseCode ?? null,
        rating: overrides.rating ?? null,
        difficulty: overrides.difficulty ?? null,
        workload: overrides.workload ?? null,
        grading: overrides.grading ?? null,
        tags: overrides.tags ?? [],
        content: overrides.content ?? '',
        anonymous: overrides.anonymous ?? false,
    },
    missingFields: computeMissingFields('post_course_review', {
        courseCode: overrides.courseCode ?? null,
        rating: overrides.rating ?? null,
        difficulty: overrides.difficulty ?? null,
        workload: overrides.workload ?? null,
        grading: overrides.grading ?? null,
        tags: overrides.tags ?? [],
        content: overrides.content ?? '',
        anonymous: overrides.anonymous ?? false,
    }),
    uiSchema: { surface: 'review_modal' },
    summary: { title: '课程评价草稿', lines: [] },
    source: 'action_agent',
    requestId: 'test_request',
    sessionId: 'test_session',
});

// ─── IT-001 文本触发评论草稿 ────────────────────────────────────────

describe('IT-001: text triggers review draft', () => {
    it('detectActionType identifies review request', () => {
        expect(detectActionType('帮我发个课程评价')).toBe('post_course_review');
        expect(detectActionType('写个评价')).toBe('post_course_review');
        expect(detectActionType('发布课程评价')).toBe('post_course_review');
    });

    it('runActionAgent returns post_course_review draft', async () => {
        const result = await runActionAgent(makeInput('帮我发个课程评价'));

        expect(result.actionPayload).not.toBeNull();
        expect(result.actionPayload!.action.actionType).toBe('post_course_review');
        expect(result.pendingDraft).not.toBeNull();
        expect(result.pendingDraft!.actionType).toBe('post_course_review');
    });

    it('uses referencedCourse when user follows up with just "评价"', async () => {
        const result = await runActionAgent(makeInput('评价', null, {
            referencedCourse: 'ACCT1006',
        }));

        expect(result.actionPayload).not.toBeNull();
        expect(result.actionPayload!.action.actionType).toBe('post_course_review');
        expect((result.actionPayload!.action.draft as PostCourseReviewDraft).courseCode).toBe('ACCT1006');
        expect(result.actionPayload!.action.uiSchema.surface).toBe('review_modal');
    });
});

// ─── IT-002 文本补课程代码 ──────────────────────────────────────────

describe('IT-002: text fills course code', () => {
    it('COMP3015 fills courseCode in draft', () => {
        const pending = makeReviewDraft();
        const result = processFollowup('COMP3015', pending);

        expect(result.updatedDraft).not.toBeNull();
        expect((result.updatedDraft!.draft as PostCourseReviewDraft).courseCode).toBe('COMP3015');
    });
});

// ─── IT-003 文本补评分 ──────────────────────────────────────────────

describe('IT-003: text fills rating', () => {
    it('"5星" fills rating to 5', () => {
        const pending = makeReviewDraft();
        const result = processFollowup('5星', pending);

        expect(result.updatedDraft).not.toBeNull();
        expect((result.updatedDraft!.draft as PostCourseReviewDraft).rating).toBe(5);
    });

    it('"3" fills rating to 3', () => {
        const pending = makeReviewDraft();
        const result = processFollowup('3', pending);

        expect(result.updatedDraft).not.toBeNull();
        expect((result.updatedDraft!.draft as PostCourseReviewDraft).rating).toBe(3);
    });
});

// ─── IT-004 文本补内容 ──────────────────────────────────────────────

describe('IT-004: text fills content', () => {
    it('"老师很好" fills content when content is empty and no course code/rating match', () => {
        const pending = makeReviewDraft();
        const result = processFollowup('老师很好', pending);

        expect(result.updatedDraft).not.toBeNull();
        expect((result.updatedDraft!.draft as PostCourseReviewDraft).content).toBe('老师很好');
    });
});

// ─── IT-005 参数齐全后进入确认 ──────────────────────────────────────

describe('IT-005: enters confirmation when all fields filled', () => {
    it('confirm kind when all fields present', () => {
        const pending = makeReviewDraft({
            courseCode: 'COMP3015',
            rating: 5,
            content: '很好',
        });
        const result = processFollowup('确认', pending);

        expect(result.kind).toBe('confirm');
        expect(result.updatedDraft).not.toBeNull();
    });

    it('missingFields is empty when all fields filled', () => {
        const draft: PostCourseReviewDraft = {
            courseCode: 'COMP3015',
            rating: 5,
            difficulty: null,
            workload: null,
            grading: null,
            tags: [],
            content: '很好',
            anonymous: false,
        };
        const missing = computeMissingFields('post_course_review', draft);
        expect(missing).toHaveLength(0);
    });
});

// ─── IT-006 确认后执行工具 ──────────────────────────────────────────

describe('IT-006: confirm executes tool', () => {
    it('buildToolCallFromDraft returns correct tool input', () => {
        const pending = makeReviewDraft({
            courseCode: 'COMP3015',
            rating: 5,
            content: '很好',
        });

        const toolCall = buildToolCallFromDraft(pending, 'user123');

        expect(toolCall.toolName).toBe('post_course_review');
        expect(toolCall.input.courseId).toBe('COMP3015');
        expect(toolCall.input.rating).toBe(5);
        expect(toolCall.input.content).toBe('很好');
    });
});

// ─── IT-007 取消后不执行工具 ────────────────────────────────────────

describe('IT-007: cancel does not execute tool', () => {
    it('cancel kind returns null updatedDraft', () => {
        const pending = makeReviewDraft();
        const result = processFollowup('取消', pending);

        expect(result.kind).toBe('cancel');
        expect(result.updatedDraft).toBeNull();
    });

    it('buildCancelResult has toolExecuted=false', () => {
        const pending = makeReviewDraft();
        const result = buildCancelResult(pending, 'req', 'session');

        expect(result.toolExecuted).toBe(false);
        expect(result.pendingDraft).toBeNull();
    });
});

// ─── IT-008 提交失败可返回失败态 ────────────────────────────────────

describe('IT-008: failure returns failed state', () => {
    it('buildFailureResult has status=failed', () => {
        const pending = makeReviewDraft({
            courseCode: 'COMP3015',
            rating: 5,
            content: '很好',
        });
        const result = buildFailureResult(pending, 'req', 'session');

        expect(result.toolExecuted).toBe(true);
        expect(result.toolSuccess).toBe(false);
        expect(result.actionPayload).not.toBeNull();
        expect(result.actionPayload!.action.status).toBe('failed');
        expect(result.pendingDraft).toEqual(pending);
        expect(result.actionPayload!.next.allowedInputs).toContain('retry');
        expect(result.actionPayload!.next.allowedInputs).toContain('field_edit');
    });
});

// ─── IT-009 旧聊天模式仍能显示 ──────────────────────────────────────

describe('IT-009: legacy chat mode still works', () => {
    it('finalAnswer is always a non-empty string', async () => {
        const result = await runActionAgent(makeInput('帮我发个课程评价'));

        expect(result.finalAnswer).toBeDefined();
        expect(typeof result.finalAnswer).toBe('string');
        expect(result.finalAnswer.length).toBeGreaterThan(0);
    });

    it('actionPayload and finalAnswer coexist', async () => {
        const result = await runActionAgent(makeInput('帮我发个课程评价'));

        expect(result.actionPayload).not.toBeNull();
        expect(result.finalAnswer).toBeDefined();
        expect(result.finalAnswer!.length).toBeGreaterThan(0);
    });
});

// ─── Followup Router Tests ──────────────────────────────────────────

describe('followup router', () => {
    it('classifies cancel correctly', () => {
        expect(classifyFollowup('取消')).toBe('cancel');
        expect(classifyFollowup('算了')).toBe('cancel');
        expect(classifyFollowup('cancel')).toBe('cancel');
    });

    it('classifies confirm correctly', () => {
        expect(classifyFollowup('确认')).toBe('confirm');
        expect(classifyFollowup('好')).toBe('confirm');
        expect(classifyFollowup('yes')).toBe('confirm');
    });

    it('classifies free text correctly', () => {
        expect(classifyFollowup('老师很好')).toBe('free_text');
        expect(classifyFollowup('COMP3015')).toBe('free_text');
    });
});

// ─── Action Type Detection Tests ────────────────────────────────────

describe('detectActionType', () => {
    it('detects review requests', () => {
        expect(detectActionType('帮我发个课程评价')).toBe('post_course_review');
        expect(detectActionType('写个评价')).toBe('post_course_review');
    });

    it('detects teaming requests', () => {
        expect(detectActionType('我想组队')).toBe('post_course_teaming');
        expect(detectActionType('找队友')).toBe('post_course_teaming');
    });

    it('detects chat message requests', () => {
        expect(detectActionType('发个消息到聊天室')).toBe('send_course_chat_message');
    });

    it('detects calendar event requests', () => {
        expect(detectActionType('记个日历事件')).toBe('create_user_calendar_event');
    });

    it('detects schedule entry requests', () => {
        expect(detectActionType('写个课表')).toBe('write_user_schedule_entry');
    });

    it('returns null for non-write operations', () => {
        expect(detectActionType('今天有什么课')).toBeNull();
        expect(detectActionType('图书馆在哪里')).toBeNull();
    });
});
