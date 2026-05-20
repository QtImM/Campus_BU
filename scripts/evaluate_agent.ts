/**
 * Agent 端到端评测脚本
 *
 * 用法: npx jest scripts/evaluate_agent.test.ts --no-coverage
 *
 * 运行 Golden Dataset 中的每条用例，通过真实 Agent Graph 执行，
 * 使用 LLM-as-a-Judge 打分，输出评测报告到 evaluation_report.json。
 */

import * as fs from 'fs';
import * as path from 'path';
import { createAgentGraphRuntime } from '../services/agent/graph';
import { callDeepSeek } from '../services/agent/llm';
import type { AgentGraphState, GraphTraceEntry } from '../services/agent/graph/types';

// ─── Types ───────────────────────────────────────────────────────────

export type GoldenCase = {
    id: string;
    query: string;
    expected_intent: string;
    expected_decision: string;
    language: string;
};

type JudgeResult = {
    score: number;
    reasoning: string;
};

export type CaseResult = {
    id: string;
    query: string;
    passed: boolean;
    intent_correct: boolean;
    decision_correct: boolean;
    faithfulness: JudgeResult;
    relevance: JudgeResult;
    latency: LatencyRecord;
    actual_intent: string;
    actual_decision: string;
    final_answer: string;
    error?: string;
};

type LatencyRecord = {
    e2e_ms: number;
    llm_total_ms: number;
    llm_call_count: number;
    ttft_ms: number;
    per_node_ms: Record<string, number>;
};

export type EvalReport = {
    model: string;
    timestamp: string;
    total: number;
    metrics: {
        intent_accuracy: number;
        decision_accuracy: number;
        faithfulness: number;
        answer_relevance: number;
        overall: number;
    };
    latency: {
        e2e_avg_ms: number;
        e2e_p50_ms: number;
        e2e_p95_ms: number;
        e2e_max_ms: number;
        llm_total_avg_ms: number;
        llm_call_count_avg: number;
        ttft_avg_ms: number;
        per_node_avg_ms: Record<string, number>;
    };
    per_intent: Record<string, {
        count: number;
        intent_acc: number;
        decision_acc: number;
        avg_latency_ms: number;
    }>;
    failures: Array<{
        id: string;
        query: string;
        field: string;
        expected: string;
        actual: string;
    }>;
    status: string;
};

// ─── Helpers ─────────────────────────────────────────────────────────

function percentile(sorted: number[], p: number): number {
    if (sorted.length === 0) return 0;
    const idx = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[Math.max(0, idx)];
}

function extractLatency(trace: GraphTraceEntry[]): Omit<LatencyRecord, 'e2e_ms'> {
    let llmTotal = 0;
    let llmCount = 0;
    let ttft = 0;
    const perNode: Record<string, number> = {};

    for (const entry of trace) {
        perNode[entry.node] = (perNode[entry.node] || 0) + entry.durationMs;

        if (entry.llmCalls) {
            for (const call of entry.llmCalls) {
                if (call.latencyMs) {
                    llmTotal += call.latencyMs;
                    llmCount += 1;
                }
            }
        }

        if (entry.node === 'synthesize_response') {
            ttft = entry.durationMs;
        }
    }

    return {
        llm_total_ms: llmTotal,
        llm_call_count: llmCount,
        ttft_ms: ttft,
        per_node_ms: perNode,
    };
}

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
        const raw = await callDeepSeek(messages);
        const parsed = JSON.parse(raw);
        return { score: Math.max(0, Math.min(1, parsed.score)), reasoning: parsed.reasoning || '' };
    } catch {
        return { score: 0, reasoning: 'judge call failed' };
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
        const raw = await callDeepSeek(messages);
        const parsed = JSON.parse(raw);
        return { score: Math.max(0, Math.min(1, parsed.score)), reasoning: parsed.reasoning || '' };
    } catch {
        return { score: 0, reasoning: 'judge call failed' };
    }
}

// ─── Core evaluation logic ───────────────────────────────────────────

export async function evaluateCase(c: GoldenCase): Promise<CaseResult> {
    const runtime = createAgentGraphRuntime();

    const defaultSessionState = {
        facts: {} as Record<string, string>,
        recentDecisions: [] as string[],
        openLoops: [] as string[],
    };

    const e2eStart = Date.now();
    let finalState: AgentGraphState;

    try {
        const result = await runtime.run({
            input: c.query,
            userId: 'eval-user',
            sessionId: `eval-${c.id}`,
            history: [],
            sessionState: defaultSessionState,
        });
        finalState = result.finalState;
    } catch (error) {
        return {
            id: c.id,
            query: c.query,
            passed: false,
            intent_correct: false,
            decision_correct: false,
            faithfulness: { score: 0, reasoning: 'graph execution failed' },
            relevance: { score: 0, reasoning: 'graph execution failed' },
            latency: { e2e_ms: Date.now() - e2eStart, llm_total_ms: 0, llm_call_count: 0, ttft_ms: 0, per_node_ms: {} },
            actual_intent: 'error',
            actual_decision: 'error',
            final_answer: '',
            error: String(error),
        };
    }

    const e2eMs = Date.now() - e2eStart;
    const latencyData = extractLatency(finalState.trace);
    const latency: LatencyRecord = { e2e_ms: e2eMs, ...latencyData };

    // Map graph state to intent name
    const actualIntent = finalState.intent.kind === 'qa'
        ? finalState.intent.domain === 'faq' ? 'campus_faq'
            : finalState.intent.domain === 'schedule' ? 'schedule_query'
            : finalState.intent.domain === 'campus' ? 'building_query'
            : finalState.intent.domain === 'course_community' ? 'course_community_read'
            : 'unknown'
        : finalState.intent.kind === 'action' ? 'course_community_write'
        : finalState.intent.kind === 'hybrid' ? 'unknown'
        : 'unknown';

    const intentCorrect = actualIntent === c.expected_intent;
    const actualDecision = finalState.plan.decision;
    const decisionCorrect = actualDecision === c.expected_decision;

    // Judge scoring
    const evidence = finalState.evidence.map(e => ({ topic: e.topic, contentSnippet: e.contentSnippet }));
    const response = finalState.finalResponse || '';

    const [faithfulness, relevance] = await Promise.all([
        judgeFaithfulness(evidence, response),
        judgeRelevance(c.query, response),
    ]);

    const passed = intentCorrect && decisionCorrect && faithfulness.score >= 0.5 && relevance.score >= 0.5;

    return {
        id: c.id,
        query: c.query,
        passed,
        intent_correct: intentCorrect,
        decision_correct: decisionCorrect,
        faithfulness,
        relevance,
        latency,
        actual_intent: actualIntent,
        actual_decision: actualDecision,
        final_answer: response.slice(0, 200),
    };
}

export function buildReport(results: CaseResult[], dataset: GoldenCase[]): EvalReport {
    const total = results.length;
    const intentAcc = results.filter(r => r.intent_correct).length / total;
    const decisionAcc = results.filter(r => r.decision_correct).length / total;
    const avgFaith = results.reduce((s, r) => s + r.faithfulness.score, 0) / total;
    const avgRelev = results.reduce((s, r) => s + r.relevance.score, 0) / total;
    const overall = (intentAcc + decisionAcc + avgFaith + avgRelev) / 4;

    const e2eList = results.map(r => r.latency.e2e_ms).sort((a, b) => a - b);
    const e2eAvg = e2eList.reduce((s, v) => s + v, 0) / total;
    const llmTotalAvg = results.reduce((s, r) => s + r.latency.llm_total_ms, 0) / total;
    const llmCountAvg = results.reduce((s, r) => s + r.latency.llm_call_count, 0) / total;
    const ttftAvg = results.reduce((s, r) => s + r.latency.ttft_ms, 0) / total;

    const nodeNames = new Set<string>();
    for (const r of results) {
        for (const node of Object.keys(r.latency.per_node_ms)) {
            nodeNames.add(node);
        }
    }
    const perNodeAvg: Record<string, number> = {};
    for (const node of nodeNames) {
        const values = results.map(r => r.latency.per_node_ms[node] || 0);
        perNodeAvg[node] = Math.round(values.reduce((s, v) => s + v, 0) / total);
    }

    const intentGroups: Record<string, CaseResult[]> = {};
    for (const r of results) {
        const key = r.actual_intent;
        if (!intentGroups[key]) intentGroups[key] = [];
        intentGroups[key].push(r);
    }
    const perIntent: Record<string, { count: number; intent_acc: number; decision_acc: number; avg_latency_ms: number }> = {};
    for (const [intent, group] of Object.entries(intentGroups)) {
        perIntent[intent] = {
            count: group.length,
            intent_acc: +(group.filter(r => r.intent_correct).length / group.length).toFixed(2),
            decision_acc: +(group.filter(r => r.decision_correct).length / group.length).toFixed(2),
            avg_latency_ms: Math.round(group.reduce((s, r) => s + r.latency.e2e_ms, 0) / group.length),
        };
    }

    const failures = results
        .filter(r => !r.passed)
        .map(r => {
            if (r.error) return { id: r.id, query: r.query, field: 'execution', expected: 'success', actual: r.error };
            if (!r.intent_correct) return { id: r.id, query: r.query, field: 'intent', expected: dataset.find(d => d.id === r.id)!.expected_intent, actual: r.actual_intent };
            if (!r.decision_correct) return { id: r.id, query: r.query, field: 'decision', expected: dataset.find(d => d.id === r.id)!.expected_decision, actual: r.actual_decision };
            return { id: r.id, query: r.query, field: 'quality', expected: 'score>=0.5', actual: `faith=${r.faithfulness.score}, rel=${r.relevance.score}` };
        });

    return {
        model: 'deepseek-chat (LangGraph v2)',
        timestamp: new Date().toISOString(),
        total,
        metrics: {
            intent_accuracy: +intentAcc.toFixed(2),
            decision_accuracy: +decisionAcc.toFixed(2),
            faithfulness: +avgFaith.toFixed(2),
            answer_relevance: +avgRelev.toFixed(2),
            overall: +overall.toFixed(2),
        },
        latency: {
            e2e_avg_ms: Math.round(e2eAvg),
            e2e_p50_ms: percentile(e2eList, 50),
            e2e_p95_ms: percentile(e2eList, 95),
            e2e_max_ms: e2eList[e2eList.length - 1] || 0,
            llm_total_avg_ms: Math.round(llmTotalAvg),
            llm_call_count_avg: +llmCountAvg.toFixed(1),
            ttft_avg_ms: Math.round(ttftAvg),
            per_node_avg_ms: perNodeAvg,
        },
        per_intent: perIntent,
        failures,
        status: overall >= 0.8 ? 'PASS' : 'FAIL',
    };
}

export function printReport(report: EvalReport) {
    console.log(`\n========== Results ==========`);
    console.log(`Intent Accuracy:   ${(report.metrics.intent_accuracy * 100).toFixed(0)}%`);
    console.log(`Decision Accuracy: ${(report.metrics.decision_accuracy * 100).toFixed(0)}%`);
    console.log(`Faithfulness:      ${(report.metrics.faithfulness * 100).toFixed(0)}%`);
    console.log(`Answer Relevance:  ${(report.metrics.answer_relevance * 100).toFixed(0)}%`);
    console.log(`Overall:           ${(report.metrics.overall * 100).toFixed(0)}%`);
    console.log(`\n--- Latency ---`);
    console.log(`E2E Avg:    ${report.latency.e2e_avg_ms}ms`);
    console.log(`E2E P50:    ${report.latency.e2e_p50_ms}ms`);
    console.log(`E2E P95:    ${report.latency.e2e_p95_ms}ms`);
    console.log(`E2E Max:    ${report.latency.e2e_max_ms}ms`);
    console.log(`LLM Total:  ${report.latency.llm_total_avg_ms}ms avg`);
    console.log(`LLM Calls:  ${report.latency.llm_call_count_avg} avg`);
    console.log(`TTFT:       ${report.latency.ttft_avg_ms}ms avg`);
    console.log(`\nPer-node avg:`);
    for (const [node, ms] of Object.entries(report.latency.per_node_avg_ms).sort((a, b) => b[1] - a[1])) {
        console.log(`  ${node}: ${ms}ms`);
    }

    if (report.failures.length > 0) {
        console.log(`\n--- Failures (${report.failures.length}) ---`);
        for (const f of report.failures) {
            console.log(`  [${f.id}] ${f.field}: expected=${f.expected}, actual=${f.actual}`);
        }
    }

    console.log(`\nStatus: ${report.status}`);
}
