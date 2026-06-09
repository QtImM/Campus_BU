import { runActionAgent } from '../../../../services/agent/action_runtime/action_agent';
import type { ActionAgentInput, PendingDraft } from '../../../../services/agent/action_runtime/types';

jest.mock('../../../../services/agent/llm', () => ({
    callDeepSeek: jest.fn(),
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
    pendingDraft: PendingDraft | null = null
): ActionAgentInput => ({
    input: text,
    userId: 'test_user',
    sessionId: 'test_session',
    requestId: 'test_request',
    pendingDraft,
    history: [],
});

describe('action runtime execution hook', () => {
    it('executes tool on confirm when executor is provided', async () => {
        const pendingDraft: PendingDraft = {
            actionType: 'post_course_review',
            phase: 'draft',
            status: 'awaiting_user_input',
            draft: {
                courseCode: 'COMP3015',
                rating: 5,
                difficulty: null,
                workload: null,
                grading: null,
                tags: [],
                content: 'Great course',
                anonymous: false,
            },
            missingFields: [],
            uiSchema: { surface: 'review_modal' },
            summary: { title: '课程评价草稿', lines: [] },
            source: 'action_agent',
            requestId: 'req-1',
            sessionId: 'session-1',
        };

        const executeTool = jest.fn().mockResolvedValue({ success: true });
        const result = await runActionAgent(makeInput('确认', pendingDraft), executeTool);

        expect(executeTool).toHaveBeenCalledWith('post_course_review', expect.objectContaining({
            courseId: 'COMP3015',
            rating: 5,
            content: 'Great course',
        }));
        expect(result.toolExecuted).toBe(true);
        expect(result.toolSuccess).toBe(true);
        expect(result.pendingDraft).toBeNull();
        expect(result.actionPayload?.action.status).toBe('completed');
    });
});
