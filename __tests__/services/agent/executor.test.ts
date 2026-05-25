const mockRunReactAgent = jest.fn().mockResolvedValue({
    finalAnswer: 'react answer',
    iterations: 1,
    toolsUsed: [],
});

const mockRunActionAgent = jest.fn().mockResolvedValue({
    finalAnswer: 'action answer',
    pendingDraft: null,
    actionPayload: {
        version: '1',
        kind: 'action',
        action: {
            actionType: 'post_course_review',
            phase: 'draft',
            status: 'awaiting_user_input',
        },
    },
});

jest.mock('../../../services/supabase', () => ({
    supabase: {
        from: jest.fn(() => ({
            select: jest.fn(() => ({
                in: jest.fn(() => ({
                    order: jest.fn(() => Promise.resolve({ data: [], error: null })),
                })),
                eq: jest.fn(() => ({
                    maybeSingle: jest.fn(() => Promise.resolve({ data: null, error: null })),
                })),
            })),
            insert: jest.fn(() => Promise.resolve({ error: null })),
        })),
    },
}));

jest.mock('../../../services/agent/react_runtime', () => ({
    runReactAgent: (...args: any[]) => mockRunReactAgent(...args),
}));

jest.mock('../../../services/agent/action_runtime', () => ({
    runActionAgent: (...args: any[]) => mockRunActionAgent(...args),
    detectActionType: jest.fn((input: string) => {
        if (/评价/.test(input)) return 'post_course_review';
        if (/组队|队友/.test(input)) return 'post_course_teaming';
        if (/聊天室|消息/.test(input)) return 'send_course_chat_message';
        if (/日历|calendar/.test(input)) return 'create_user_calendar_event';
        if (/课表|schedule/.test(input)) return 'write_user_schedule_entry';
        return null;
    }),
    executeToolCall: jest.fn(),
}));

jest.mock('../../../services/agent/llm', () => ({
    callDeepSeek: jest.fn(),
    callDeepSeekStream: jest.fn(),
    callDeepSeekWithTools: jest.fn(),
    resolveModelName: jest.fn((tier: 'fast' | 'reasoning') => (
        tier === 'fast' ? 'mock-fast-model' : 'mock-reasoning-model'
    )),
}));

jest.mock('../../../services/agent/memory', () => ({
    getAllUserFacts: jest.fn().mockResolvedValue({}),
    getMemoryFact: jest.fn().mockResolvedValue(null),
    saveMemoryFact: jest.fn().mockResolvedValue(true),
}));

jest.mock('../../../services/agent/memory_extractor', () => ({
    extractMemoryCandidatesFromConversation: jest.fn().mockResolvedValue([]),
    filterMemoryCandidates: jest.fn().mockReturnValue([]),
}));

const { AgentExecutor } = require('../../../services/agent/executor') as {
    AgentExecutor: new (userId: string) => any;
};

describe('AgentExecutor ReAct delegation', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockRunReactAgent.mockResolvedValue({
            finalAnswer: 'react answer',
            iterations: 1,
            toolsUsed: [],
        });
        mockRunActionAgent.mockResolvedValue({
            finalAnswer: 'action answer',
            pendingDraft: null,
            actionPayload: {
                version: '1',
                kind: 'action',
                action: {
                    actionType: 'post_course_review',
                    phase: 'draft',
                    status: 'awaiting_user_input',
                },
            },
        });
    });

    it('delegates process to the ReAct runtime', async () => {
        const executor = new AgentExecutor('user-1');
        const response = await executor.process('GPA 怎么算？');

        expect(mockRunReactAgent).toHaveBeenCalledWith(expect.objectContaining({
            input: 'GPA 怎么算？',
            userId: 'user-1',
        }));
        expect(response.finalAnswer).toBe('react answer');
    });

    it('delegates processWithGraph to the ReAct runtime entrypoint', async () => {
        const executor = new AgentExecutor('user-1');
        const response = await executor.processWithGraph('GPA 怎么算？');

        expect(mockRunReactAgent).toHaveBeenCalledWith(expect.objectContaining({
            input: 'GPA 怎么算？',
            userId: 'user-1',
        }));
        expect(response.finalAnswer).toBe('react answer');
    });

    it('appends finalAnswer to history after ReAct run', async () => {
        const executor = new AgentExecutor('user-1');
        await executor.process('hello');

        const history = executor.context.history;
        expect(history[history.length - 1].role).toBe('assistant');
        expect(history[history.length - 1].content).toBe('react answer');
    });

    it('forwards deviceLocation to ReAct runtime', async () => {
        const executor = new AgentExecutor('user-1');
        executor.setDeviceLocation({ latitude: 22.3375, longitude: 114.1833 });
        await executor.process('附近有什么吃的');

        expect(mockRunReactAgent).toHaveBeenCalledWith(expect.objectContaining({
            deviceLocation: { latitude: 22.3375, longitude: 114.1833 },
        }));
    });

    it('forwards history and historySummary to ReAct runtime', async () => {
        const executor = new AgentExecutor('user-1');
        executor.pushHistory('user', 'hello');
        executor.pushHistory('assistant', 'hi there');
        executor.pushHistory('user', 'GPA 怎么算？');

        await executor.process('GPA 怎么算？');

        expect(mockRunReactAgent).toHaveBeenCalledWith(expect.objectContaining({
            history: expect.arrayContaining([
                expect.objectContaining({ role: 'user', content: 'hello' }),
                expect.objectContaining({ role: 'assistant', content: 'hi there' }),
            ]),
        }));
    });

    it('routes all detected write operations to the action runtime', async () => {
        const prompts = [
            '帮我发一条课程评价',
            '我想组队',
            '发个消息到聊天室',
            '记个日历事件',
            '写个课表',
        ];

        for (const prompt of prompts) {
            const executor = new AgentExecutor('user-1');
            await executor.process(prompt);
        }

        expect(mockRunActionAgent).toHaveBeenCalledTimes(prompts.length);
        expect(mockRunReactAgent).not.toHaveBeenCalled();
    });

    it('falls back to fallback LLM when ReAct runtime is disabled', async () => {
        const { AGENT_CONFIG } = require('../../../services/agent/config') as {
            AGENT_CONFIG: { REACT_RUNTIME_ENABLED: boolean };
        };
        const mockCallDeepSeek = require('../../../services/agent/llm').callDeepSeek as jest.Mock;
        const originalEnabled = AGENT_CONFIG.REACT_RUNTIME_ENABLED;

        AGENT_CONFIG.REACT_RUNTIME_ENABLED = false;
        mockCallDeepSeek.mockResolvedValue('fallback answer');

        const executor = new AgentExecutor('user-1');
        const response = await executor.process('hello');

        expect(response.finalAnswer).toBe('fallback answer');
        expect(mockRunReactAgent).not.toHaveBeenCalled();

        AGENT_CONFIG.REACT_RUNTIME_ENABLED = originalEnabled;
    });
});
