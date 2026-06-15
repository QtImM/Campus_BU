/**
 * Action Runtime Contract Tests
 *
 * Covers UT-001 through UT-010 from docs/agent/action-agent-contract-and-flow.md §15.1
 */

import {
    buildActionPayload,
    createDefaultDraft,
    computeMissingFields,
    REVIEW_PRESETS,
    buildSummary,
    createUiSchema,
    getEditableFields,
} from '../../../../services/agent/action_runtime/contract';
import type {
    ActionType,
    PostCourseReviewDraft,
    ActionPayload,
} from '../../../../services/agent/action_runtime/types';

// ─── UT-001 顶层 contract 结构正确 ──────────────────────────────────

describe('UT-001: top-level contract structure', () => {
    it('response contains finalAnswer and actionPayload', () => {
        const draft = createDefaultDraft('post_course_review') as PostCourseReviewDraft;
        const payload = buildActionPayload({
            actionType: 'post_course_review',
            draft,
            requestId: 'req_001',
            sessionId: 'session_001',
            messageText: '我可以帮你发课程评价，先选个评分吧。',
        });

        expect(payload).toBeDefined();
        expect(payload.type).toBe('agent_action');
        expect(payload.version).toBe('1.0');
        expect(payload.requestId).toBe('req_001');
        expect(payload.sessionId).toBe('session_001');
        expect(payload.message).toBeDefined();
        expect(payload.message.text).toBe('我可以帮你发课程评价，先选个评分吧。');
        expect(payload.action).toBeDefined();
        expect(payload.next).toBeDefined();
    });

    it('actionPayload.type is agent_action', () => {
        const draft = createDefaultDraft('post_course_review');
        const payload = buildActionPayload({
            actionType: 'post_course_review',
            draft,
            requestId: 'req_002',
            sessionId: 'session_002',
            messageText: 'test',
        });

        expect(payload.type).toBe('agent_action');
    });
});

// ─── UT-002 评论草稿缺字段时 missingFields 正确 ─────────────────────

describe('UT-002: review draft missing fields', () => {
    it('missingFields contains courseCode, rating, content when all empty', () => {
        const draft = createDefaultDraft('post_course_review');
        const missing = computeMissingFields('post_course_review', draft);

        expect(missing).toContain('courseCode');
        expect(missing).toContain('rating');
        expect(missing).toContain('content');
        expect(missing).toHaveLength(3);
    });

    it('missingFields is empty when all required fields present', () => {
        const draft: PostCourseReviewDraft = {
            courseCode: 'COMP3015',
            rating: 5,
            difficulty: null,
            workload: null,
            grading: null,
            tags: [],
            content: '老师讲解清晰',
            anonymous: false,
        };
        const missing = computeMissingFields('post_course_review', draft);

        expect(missing).toHaveLength(0);
    });
});

// ─── UT-003 选择评分后带出推荐文案 ──────────────────────────────────

describe('UT-003: rating presets', () => {
    it('uiSchema.presets.ratingToContentTemplates["5"] exists', () => {
        const presets = REVIEW_PRESETS.ratingToContentTemplates;
        expect(presets['5']).toBeDefined();
        expect(Array.isArray(presets['5'])).toBe(true);
        expect(presets['5'].length).toBeGreaterThanOrEqual(1);
    });

    it('all ratings 1-5 have presets', () => {
        const presets = REVIEW_PRESETS.ratingToContentTemplates;
        for (let i = 1; i <= 5; i++) {
            const key = String(i) as keyof typeof presets;
            expect(presets[key]).toBeDefined();
            expect(presets[key].length).toBeGreaterThanOrEqual(1);
        }
    });
});

// ─── UT-004 评论参数齐全后进入确认态 ────────────────────────────────

describe('UT-004: review draft enters confirm state when complete', () => {
    it('phase=confirm, status=ready_for_confirmation, canConfirm=true', () => {
        const draft: PostCourseReviewDraft = {
            courseCode: 'COMP3015',
            rating: 5,
            difficulty: null,
            workload: null,
            grading: null,
            tags: [],
            content: '老师讲解清晰',
            anonymous: false,
        };

        const payload = buildActionPayload({
            actionType: 'post_course_review',
            draft,
            requestId: 'req_004',
            sessionId: 'session_004',
            messageText: '请确认是否发布这条课程评价。',
        });

        expect(payload.action.phase).toBe('confirm');
        expect(payload.action.status).toBe('ready_for_confirmation');
        expect(payload.action.canConfirm).toBe(true);
        expect(payload.action.canSubmit).toBe(true);
        expect(payload.action.missingFields).toHaveLength(0);
    });
});

// ─── UT-005 成功提交后结果态正确 ────────────────────────────────────

describe('UT-005: completed result state', () => {
    it('status=completed, phase=result', () => {
        const draft: PostCourseReviewDraft = {
            courseCode: 'COMP3015',
            rating: 5,
            difficulty: null,
            workload: null,
            grading: null,
            tags: [],
            content: '老师讲解清晰',
            anonymous: false,
        };

        const payload = buildActionPayload({
            actionType: 'post_course_review',
            draft,
            requestId: 'req_005',
            sessionId: 'session_005',
            messageText: '已帮你发布到 COMP3015 的课程评价。',
            messageTone: 'positive',
            phaseOverride: 'result',
            statusOverride: 'completed',
        });

        expect(payload.action.phase).toBe('result');
        expect(payload.action.status).toBe('completed');
        expect(payload.action.canConfirm).toBe(false);
        expect(payload.action.canSubmit).toBe(false);
        expect(payload.action.canCancel).toBe(false);
    });
});

// ─── UT-006 取消后状态正确 ──────────────────────────────────────────

describe('UT-006: cancelled state', () => {
    it('status=cancelled', () => {
        const draft = createDefaultDraft('post_course_review');

        const payload = buildActionPayload({
            actionType: 'post_course_review',
            draft,
            requestId: 'req_006',
            sessionId: 'session_006',
            messageText: '已取消这次操作。',
            phaseOverride: 'result',
            statusOverride: 'cancelled',
        });

        expect(payload.action.status).toBe('cancelled');
        expect(payload.action.phase).toBe('result');
    });
});

// ─── UT-007 不再依赖自然语言判断状态 ────────────────────────────────

describe('UT-007: state transitions independent of text', () => {
    it('changing messageText does not affect phase/status', () => {
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

        const payload1 = buildActionPayload({
            actionType: 'post_course_review',
            draft,
            requestId: 'req_007a',
            sessionId: 'session_007',
            messageText: '请确认。',
        });

        const payload2 = buildActionPayload({
            actionType: 'post_course_review',
            draft,
            requestId: 'req_007b',
            sessionId: 'session_007',
            messageText: '完全不同的话',
        });

        expect(payload1.action.phase).toBe(payload2.action.phase);
        expect(payload1.action.status).toBe(payload2.action.status);
        expect(payload1.action.canConfirm).toBe(payload2.action.canConfirm);
    });
});

// ─── UT-008 评论 uiSchema.surface 正确 ──────────────────────────────

describe('UT-008: review uiSchema surface', () => {
    it('surface = review_modal for draft phase', () => {
        const uiSchema = createUiSchema('post_course_review', 'draft');
        expect(uiSchema.surface).toBe('review_modal');
    });

    it('surface = review_confirm_modal for confirm phase', () => {
        const uiSchema = createUiSchema('post_course_review', 'confirm');
        expect(uiSchema.surface).toBe('review_confirm_modal');
    });

    it('surface = result_card for result phase', () => {
        const uiSchema = createUiSchema('post_course_review', 'result');
        expect(uiSchema.surface).toBe('result_card');
    });
});

// ─── UT-009 非评论 action 使用不同 surface ──────────────────────────

describe('UT-009: non-review actions use different surfaces', () => {
    it('teaming uses teaming_modal', () => {
        const uiSchema = createUiSchema('post_course_teaming', 'draft');
        expect(uiSchema.surface).not.toBe('review_modal');
        expect(uiSchema.surface).toContain('teaming');
    });

    it('calendar uses calendar_modal', () => {
        const uiSchema = createUiSchema('create_user_calendar_event', 'draft');
        expect(uiSchema.surface).not.toBe('review_modal');
        expect(uiSchema.surface).toContain('calendar');
    });

    it('schedule uses schedule_modal', () => {
        const uiSchema = createUiSchema('write_user_schedule_entry', 'draft');
        expect(uiSchema.surface).not.toBe('review_modal');
        expect(uiSchema.surface).toContain('schedule');
    });

    it('chat uses chat_modal', () => {
        const uiSchema = createUiSchema('send_course_chat_message', 'draft');
        expect(uiSchema.surface).not.toBe('review_modal');
        expect(uiSchema.surface).toContain('chat');
    });
});

// ─── UT-010 finalAnswer 与 message.text 语义一致 ────────────────────

describe('UT-010: finalAnswer and message.text are semantically aligned', () => {
    it('both contain the same core information', () => {
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

        const finalAnswer = '已帮你发布到 COMP3015 的课程评价。';
        const payload = buildActionPayload({
            actionType: 'post_course_review',
            draft,
            requestId: 'req_010',
            sessionId: 'session_010',
            messageText: finalAnswer,
            messageTone: 'positive',
            phaseOverride: 'result',
            statusOverride: 'completed',
        });

        // They don't need to be identical, but should not contradict
        expect(payload.message.text).toContain('COMP3015');
        expect(finalAnswer).toContain('COMP3015');
    });
});
