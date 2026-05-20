/**
 * LLM-as-a-Judge 评分函数
 *
 * 调用真实 DeepSeek API 对 Agent 输出进行 faithfulness 和 relevance 打分。
 * 与 evaluate_agent.ts 分离，避免被 Jest mock 覆盖。
 */

import { callDeepSeek } from '../services/agent/llm';

export type JudgeResult = {
    score: number;
    reasoning: string;
};

const JUDGE_MODEL = undefined; // 使用默认 fast model

export async function judgeFaithfulness(
    evidence: Array<{ topic: string; contentSnippet: string }>,
    response: string
): Promise<JudgeResult> {
    if (!evidence.length || !response) {
        return { score: 0, reasoning: 'no evidence or empty response' };
    }

    const evidenceText = evidence.map(e => `[${e.topic}] ${e.contentSnippet}`).join('\n');

    const messages = [
        {
            role: 'system',
            content: [
                'You are a strict evaluation judge for an AI agent serving HKBU students.',
                'Given the RETRIEVE evidence and the AGENT response, evaluate faithfulness.',
                'Faithfulness = proportion of factual claims in the response that are supported by the evidence.',
                'Return ONLY a JSON object: {"score": 0.0-1.0, "reasoning": "brief explanation"}',
            ].join(' '),
        },
        {
            role: 'user',
            content: `RETRIEVE EVIDENCE:\n${evidenceText}\n\nAGENT RESPONSE:\n${response}`,
        },
    ];

    try {
        const raw = await callDeepSeek(messages, { model: JUDGE_MODEL });
        const parsed = JSON.parse(raw);
        return { score: Math.max(0, Math.min(1, parsed.score)), reasoning: parsed.reasoning || '' };
    } catch (error) {
        return { score: 0, reasoning: `judge call failed: ${String(error)}` };
    }
}

export async function judgeRelevance(query: string, response: string): Promise<JudgeResult> {
    if (!response) {
        return { score: 0, reasoning: 'empty response' };
    }

    const messages = [
        {
            role: 'system',
            content: [
                'You are a strict evaluation judge for an AI agent serving HKBU students.',
                'Given the USER query and the AGENT response, evaluate answer relevance.',
                'Does the response directly address the user\'s question? Is it on-topic?',
                'Return ONLY a JSON object: {"score": 0.0-1.0, "reasoning": "brief explanation"}',
            ].join(' '),
        },
        {
            role: 'user',
            content: `USER QUERY: ${query}\n\nAGENT RESPONSE:\n${response}`,
        },
    ];

    try {
        const raw = await callDeepSeek(messages, { model: JUDGE_MODEL });
        const parsed = JSON.parse(raw);
        return { score: Math.max(0, Math.min(1, parsed.score)), reasoning: parsed.reasoning || '' };
    } catch (error) {
        return { score: 0, reasoning: `judge call failed: ${String(error)}` };
    }
}
