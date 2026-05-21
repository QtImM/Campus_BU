import { createInitialSessionState, updateSessionStateWithTurn } from './session_state';
import { summarizeHistory } from './summarizer';
import { callDeepSeek, resolveModelName } from './llm';
import { AgentContext, AgentGeoPoint, AgentResponse } from './types';

/**
 * Thin adapter that owns entrypoint wiring and conversation context assembly.
 * All agent behavior (intent routing, tool execution, confirmation flow, memory)
 * lives in the LangGraph runtime.
 */
export class AgentExecutor {
    private context: AgentContext;
    private static readonly MAX_HISTORY_ITEMS = 12;
    private static readonly MAX_RECENT_HISTORY_ITEMS = 6;
    private static graphImportFailed = false;

    constructor(userId: string) {
        this.context = {
            userId,
            sessionId: `session_${Date.now()}`,
            history: [],
            historySummary: '',
            sessionState: createInitialSessionState(),
            deviceLocation: null,
        };
    }

    setDeviceLocation(location: AgentGeoPoint | null) {
        this.context.deviceLocation = location;
    }

    async process(prompt: string, onUpdate?: (text: string) => void): Promise<AgentResponse> {
        return this.processWithGraph(prompt, onUpdate);
    }

    async processWithGraph(prompt: string, onUpdate?: (text: string) => void): Promise<AgentResponse> {
        this.pushHistory('user', prompt);

        let response: AgentResponse;

        try {
            const { runAgentGraph } = require('.') as typeof import('.');
            const result = await runAgentGraph({
                input: prompt,
                userId: this.context.userId,
                sessionId: this.context.sessionId,
                history: this.context.history,
                historySummary: this.context.historySummary,
                sessionState: this.context.sessionState,
                deviceLocation: this.context.deviceLocation,
            });

            this.context.sessionState = result.sessionState;
            response = result.response;
        } catch (error) {
            AgentExecutor.graphImportFailed = true;
            console.error('[AgentExecutor] Graph runtime unavailable, falling back to lightweight chat mode:', error);
            response = await this.processWithFallbackLLM(prompt, onUpdate);
        }

        if (response.finalAnswer) {
            this.pushHistory('assistant', response.finalAnswer);
            if (onUpdate) onUpdate(response.finalAnswer);
        }

        return response;
    }

    private pushHistory(role: 'user' | 'assistant' | 'tool', content: string) {
        const item = { role, content } as const;
        this.context.history.push(item);
        this.context.sessionState = updateSessionStateWithTurn(this.context.sessionState, item);
        if (this.context.history.length > AgentExecutor.MAX_HISTORY_ITEMS) {
            const summarized = summarizeHistory(this.context.history, {
                keepRecent: AgentExecutor.MAX_RECENT_HISTORY_ITEMS,
            });
            this.context.historySummary = [this.context.historySummary, summarized.summary].filter(Boolean).join('\n');
            this.context.sessionState.summary = this.context.historySummary;
            this.context.history = summarized.recentHistory;
        }
    }

    private async processWithFallbackLLM(prompt: string, onUpdate?: (text: string) => void): Promise<AgentResponse> {
        const modelName = resolveModelName('fast');
        const locationHint = this.context.deviceLocation
            ? `Current user location: ${this.context.deviceLocation.latitude}, ${this.context.deviceLocation.longitude}`
            : 'Current user location: unavailable';

        const messages = [
            {
                role: 'system',
                content: [
                    'You are the HKCampus agent for HKBU students.',
                    'Answer in concise Chinese unless the user clearly writes in English.',
                    'You are running in fallback mode because the advanced graph runtime is unavailable in this build.',
                    'Do not mention internal errors unless the user asks.',
                    'If a question requires private user data or a database action that you cannot safely perform, say so clearly and ask the user to try again later.',
                    locationHint,
                    this.context.historySummary ? `Conversation summary:\n${this.context.historySummary}` : '',
                ].filter(Boolean).join('\n\n'),
            },
            ...this.context.history.slice(-6).map((item) => ({
                role: item.role === 'assistant' ? 'assistant' : 'user',
                content: item.content,
            })),
        ];

        const finalAnswer = await callDeepSeek(messages, { model: modelName });
        if (onUpdate) {
            onUpdate(finalAnswer);
        }

        return {
            finalAnswer,
            steps: [
                {
                    thought: AgentExecutor.graphImportFailed
                        ? 'Graph runtime unavailable, used fallback LLM mode'
                        : 'Used fallback LLM mode',
                    modelName,
                    path: 'llm',
                },
            ],
        };
    }
}
