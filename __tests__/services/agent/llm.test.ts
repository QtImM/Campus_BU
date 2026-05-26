describe('callDeepSeekStream via fetch', () => {
    const originalFetch = global.fetch;
    const originalXmlHttpRequest = (global as any).XMLHttpRequest;

    beforeEach(() => {
        jest.resetModules();
        process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY = 'test-key';
        process.env.EXPO_PUBLIC_AGENT_FAST_MODEL = 'mock-fast-model';
        delete (global as any).XMLHttpRequest;
    });

    afterEach(() => {
        global.fetch = originalFetch;
        (global as any).XMLHttpRequest = originalXmlHttpRequest;
    });

    it('consumes the final SSE chunk even without a trailing newline', async () => {
        const chunks = [
            'data: {"choices":[{"delta":{"content":"Hello"}}]}\n',
            'data: {"choices":[{"delta":{"content":" world"}}]}',
        ];

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            body: {
                getReader: () => ({
                    read: jest
                        .fn()
                        .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode(chunks[0]) })
                        .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode(chunks[1]) })
                        .mockResolvedValueOnce({ done: true, value: undefined }),
                }),
            },
            text: jest.fn(),
        } as any);

        const { callDeepSeekStream } = require('../../../services/agent/llm');
        const result = await callDeepSeekStream([{ role: 'user', content: 'hello' }]);

        expect(result).toBe('Hello world');
    });
});

describe('callDeepSeekWithTools', () => {
    const originalFetch = global.fetch;

    beforeEach(() => {
        jest.resetModules();
        process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY = 'test-key';
        process.env.EXPO_PUBLIC_AGENT_FAST_MODEL = 'mock-fast-model';
    });

    afterEach(() => {
        global.fetch = originalFetch;
    });

    it('returns reasoning_content when DeepSeek thinking mode includes it', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue({
                choices: [{
                    message: {
                        content: null,
                        reasoning_content: '先推理再调工具',
                        tool_calls: [{
                            id: 'call_1',
                            type: 'function',
                            function: {
                                name: 'read_user_schedule',
                                arguments: '{}',
                            },
                        }],
                    },
                }],
            }),
            text: jest.fn(),
        } as any);

        const { callDeepSeekWithTools } = require('../../../services/agent/llm');
        const result = await callDeepSeekWithTools(
            [{ role: 'user', content: '今天有什么课' }],
            []
        );

        expect(result).toEqual({
            content: null,
            reasoning_content: '先推理再调工具',
            tool_calls: [{
                id: 'call_1',
                type: 'function',
                function: {
                    name: 'read_user_schedule',
                    arguments: '{}',
                },
            }],
        });
    });
});
