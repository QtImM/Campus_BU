jest.mock('../../../../services/agent/react_runtime/prompts', () => ({
    buildReactSystemPrompt: jest.fn().mockReturnValue('system prompt'),
}));

jest.mock('../../../../services/agent/react_runtime/tools', () => ({
    REACT_TOOL_SCHEMAS: [],
}));

const mockReactLoop = jest.fn().mockResolvedValue({
    finalAnswer: 'done',
    iterations: 1,
    toolsUsed: [],
});

jest.mock('../../../../services/agent/react_runtime/loop', () => ({
    reactLoop: (...args: any[]) => mockReactLoop(...args),
}));

const { runReactAgent } = require('../../../../services/agent/react_runtime') as {
    runReactAgent: (input: any) => Promise<any>;
};

describe('runReactAgent', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockReactLoop.mockResolvedValue({
            finalAnswer: 'done',
            iterations: 1,
            toolsUsed: [],
        });
    });

    it('does not duplicate the current user message in the generated chat history', async () => {
        await runReactAgent({
            input: 'GPA 怎么算？',
            userId: 'user-1',
            sessionId: 'session-1',
            history: [
                { role: 'user', content: '之前的问题' },
                { role: 'assistant', content: '之前的回答' },
                { role: 'user', content: 'GPA 怎么算？' },
            ],
            historySummary: '',
            sessionState: {
                facts: {},
                recentDecisions: [],
                openLoops: [],
            },
            deviceLocation: null,
        });

        const [messages] = mockReactLoop.mock.calls[0];
        const samePromptMessages = messages.filter((message: { role: string; content: string | null }) => (
            message.role === 'user' && message.content === 'GPA 怎么算？'
        ));

        expect(samePromptMessages).toHaveLength(1);
    });
});
