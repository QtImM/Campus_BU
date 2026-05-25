jest.mock('../../../../services/agent/llm', () => ({
    callDeepSeekWithTools: jest.fn(),
}));

jest.mock('../../../../services/agent/react_runtime/tools', () => ({
    executeReactTool: jest.fn(),
    REACT_TOOL_SCHEMAS: [],
}));

const { reactLoop } = require('../../../../services/agent/react_runtime/loop') as {
    reactLoop: (messages: any[], tools: any[], context: any) => Promise<any>;
};
const { callDeepSeekWithTools } = require('../../../../services/agent/llm') as {
    callDeepSeekWithTools: jest.Mock;
};
const { executeReactTool } = require('../../../../services/agent/react_runtime/tools') as {
    executeReactTool: jest.Mock;
};

describe('reactLoop', () => {
    let clearTimeoutSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.clearAllMocks();
        clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    });

    afterEach(() => {
        clearTimeoutSpy.mockRestore();
    });

    it('returns directly when the model answers without tool calls', async () => {
        callDeepSeekWithTools.mockResolvedValue({
            content: '你好，我是 HKCampus 助手。',
            tool_calls: null,
        });

        const result = await reactLoop(
            [{ role: 'system', content: 'system prompt' }, { role: 'user', content: '你好' }],
            [],
            { userId: 'user-1', deviceLocation: null, sessionState: { facts: {}, recentDecisions: [], openLoops: [] } }
        );

        expect(result).toEqual({
            finalAnswer: '你好，我是 HKCampus 助手。',
            iterations: 0,
            toolsUsed: [],
        });
        expect(clearTimeoutSpy).toHaveBeenCalled();
    });

    it('serializes tool results and completes on the next model turn', async () => {
        callDeepSeekWithTools
            .mockResolvedValueOnce({
                content: null,
                tool_calls: [{
                    id: 'call_1',
                    type: 'function',
                    function: {
                        name: 'read_user_schedule',
                        arguments: '{"query":"今天有什么课"}',
                    },
                }],
            })
            .mockResolvedValueOnce({
                content: '你今天有一节 COMP4015。',
                tool_calls: null,
            });

        executeReactTool.mockResolvedValue({
            success: true,
            summary: 'loaded 1 schedule entry',
            data: [{ title: 'COMP4015' }],
        });

        const result = await reactLoop(
            [{ role: 'system', content: 'system prompt' }, { role: 'user', content: '今天有什么课' }],
            [],
            { userId: 'user-1', deviceLocation: null, sessionState: { facts: {}, recentDecisions: [], openLoops: [] } }
        );

        expect(executeReactTool).toHaveBeenCalledWith('read_user_schedule', { query: '今天有什么课' }, expect.any(Object));
        expect(result).toEqual({
            finalAnswer: '你今天有一节 COMP4015。',
            iterations: 1,
            toolsUsed: ['read_user_schedule'],
        });
    });
});
