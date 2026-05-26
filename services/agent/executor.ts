import { createInitialSessionState, updateSessionStateWithTurn } from './session_state';
import { AGENT_CONFIG } from './config';
import { summarizeHistory } from './summarizer';
import { callDeepSeek, resolveModelName } from './llm';
import { AgentContext, AgentGeoPoint, AgentResponse } from './types';
import { runActionAgent, detectActionType, executeToolCall } from './action_runtime';
import type { PendingDraft } from './action_runtime';
import { runReactAgent } from './react_runtime';

/**
 * Thin adapter that owns entrypoint wiring and conversation context assembly.
 * All agent behavior (intent routing, tool execution, confirmation flow, memory)
 * lives in the ReAct runtime.
 *
 * Write operations are routed to the Action Agent runtime when ACTION_AGENT_ENABLED.
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
        const response = await this.processWithGraph(prompt, onUpdate);
        return response;
    }

    async processWithGraph(prompt: string, onUpdate?: (text: string) => void): Promise<AgentResponse> {
        this.pushHistory('user', prompt);

        let response: AgentResponse;

        // ─── Route to Action Agent for write operations ─────────────
        const useAction = this.shouldUseActionAgent(prompt);
        if (useAction) {
            try {
                response = await this.processWithActionAgent(prompt);
            } catch (error) {
                console.error('[AgentExecutor] Action Agent failed, falling back to React loop:', error);
                response = await this.processWithReactLoop(prompt, onUpdate);
            }
        } else {
            response = await this.processWithReactLoop(prompt, onUpdate);
        }

        if (!response.finalAnswer) {
            console.warn('[AgentExecutor] finalAnswer is empty/undefined, response:', JSON.stringify(response).slice(0, 200));
            response.finalAnswer = '抱歉，我暂时无法生成回复，请稍后再试。';
        }

        this.pushHistory('assistant', response.finalAnswer);
        if (onUpdate) onUpdate(response.finalAnswer);

        return response;
    }

    /**
     * Determine if the input should be routed to the Action Agent.
     * All detected write operations must route to the Action Agent
     * because the legacy graph path is no longer used.
     */
    private shouldUseActionAgent(prompt: string): boolean {
        if (!AGENT_CONFIG.ACTION_AGENT_ENABLED) {
            return false;
        }

        // If there's a pending draft, always use Action Agent for follow-ups
        if (this.context.sessionState.pendingDraft) {
            return true;
        }

        const actionType = detectActionType(prompt);
        return actionType !== null || this.isImplicitReviewFollowup(prompt);
    }

    private isImplicitReviewFollowup(prompt: string): boolean {
        const trimmed = prompt.trim();
        if (!this.context.sessionState.referencedCourse) {
            return false;
        }

        return /^(评价|評價|review|写评价|寫評價|发评价|發評價)$|^(我要|我想|帮我|幫我).*(评价|評價|review)$/i.test(trimmed);
    }

    /**
     * Process input through the Action Agent runtime.
     */
    private async processWithActionAgent(prompt: string): Promise<AgentResponse> {
        const requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

        const result = await runActionAgent({
            input: prompt,
            userId: this.context.userId,
            sessionId: this.context.sessionId,
            requestId,
            pendingDraft: this.context.sessionState.pendingDraft ?? null,
            history: this.context.history,
            sessionState: this.context.sessionState,
        }, executeToolCall);

        // Update session state with the new pending draft
        this.context.sessionState = {
            ...this.context.sessionState,
            pendingDraft: result.pendingDraft,
        };

        return {
            finalAnswer: result.finalAnswer,
            steps: [{
                thought: `action_agent: ${result.actionPayload?.action.phase || 'unknown'}`,
                path: 'llm',
            }],
            actionPayload: result.actionPayload,
        };
    }

    /**
     * Process input through the ReAct runtime.
     * Falls back to fallback LLM if REACT_RUNTIME_ENABLED is false or runtime fails.
     */
    private async processWithReactLoop(prompt: string, onUpdate?: (text: string) => void): Promise<AgentResponse> {
        if (!AGENT_CONFIG.REACT_RUNTIME_ENABLED) {
            return this.processWithFallbackLLM(prompt, onUpdate);
        }

        try {
            const result = await runReactAgent({
                input: prompt,
                userId: this.context.userId,
                sessionId: this.context.sessionId,
                history: this.context.history,
                historySummary: this.context.historySummary,
                sessionState: this.context.sessionState,
                deviceLocation: this.context.deviceLocation,
            });

            return {
                finalAnswer: result.finalAnswer,
                steps: [{
                    thought: result.error
                        ? `react: ${result.error}`
                        : `react: ${result.iterations} iterations, tools: [${result.toolsUsed.join(', ')}]`,
                    path: 'llm',
                }],
            };
        } catch (error) {
            console.error('[AgentExecutor] ReAct runtime failed, falling back to lightweight chat mode:', error);
            return this.processWithFallbackLLM(prompt, onUpdate);
        }
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
