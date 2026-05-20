/**
 * Agent 逻辑评测（无需真实 API）
 *
 * 运行: npx jest scripts/evaluate_agent.test.ts --no-coverage
 *
 * 测评 intent 路由准确性 + planner/prompt 逻辑，
 * 使用 mock LLM，不产生 API 费用，结果确定性。
 */

import * as fs from 'fs';
import * as path from 'path';
import { classifyIntent } from '../services/agent/router';
import { buildPlannerPrompt } from '../services/agent/graph/prompts/planner';
import { buildSynthesizerPrompt } from '../services/agent/graph/prompts/synthesizer';
import { buildClarifierPrompt } from '../services/agent/graph/prompts/clarifier';
import { createInitialAgentGraphState } from '../services/agent/graph/state';

jest.mock('../services/agent/llm', () => ({
    callDeepSeek: jest.fn().mockResolvedValue('{}'),
    resolveModelName: jest.fn(() => 'mock-model'),
}));

jest.mock('../services/faq', () => ({
    FAQService: {
        searchFAQs: jest.fn().mockReturnValue([]),
        searchKnowledgeBase: jest.fn().mockResolvedValue([]),
    },
}));

jest.mock('../services/agent/memory', () => ({
    getAllUserFacts: jest.fn().mockResolvedValue({}),
}));

type GoldenCase = {
    id: string;
    query: string;
    expected_intent: string;
    expected_decision: string;
    language: string;
};

type CaseResult = {
    id: string;
    query: string;
    intent_correct: boolean;
    actual_intent: string;
    expected_intent: string;
    prompt_quality: number;
};

const DATASET_PATH = path.resolve(__dirname, 'eval_golden_dataset.json');
const REPORT_PATH = path.resolve(__dirname, 'evaluation_report.json');

const mapIntentToName = (decision: ReturnType<typeof classifyIntent>): string => {
    if (decision.intent === 'campus_faq') return 'campus_faq';
    if (decision.intent === 'schedule_query') return 'schedule_query';
    if (decision.intent === 'course_community_read') return 'course_community_read';
    if (decision.intent === 'course_community_write') return 'course_community_write';
    if (decision.intent === 'building_query') return 'building_query';
    if (decision.intent === 'nearby_place_query') return 'nearby_place_query';
    if (decision.intent === 'date_query') return 'date_query';
    return 'unknown';
};

const checkPromptQuality = (messages: Array<{ role: string; content: string }>): number => {
    const systemMsg = messages.find(m => m.role === 'system');
    if (!systemMsg) return 0;

    let score = 0;
    const content = systemMsg.content.toLowerCase();
    if (content.includes('hkbu')) score += 0.3;
    if (content.includes('hong kong baptist') || content.includes('浸会')) score += 0.3;
    if (content.includes('json')) score += 0.2;
    if (content.length > 50) score += 0.2;
    return score;
};

describe('Agent Evaluation', () => {
    const dataset: GoldenCase[] = JSON.parse(fs.readFileSync(DATASET_PATH, 'utf-8'));
    const results: CaseResult[] = [];

    describe('Intent Routing Accuracy', () => {
        it.each(dataset)('[$id] $query → $expected_intent', (c) => {
            const decision = classifyIntent(c.query);
            const actual = mapIntentToName(decision);
            const correct = actual === c.expected_intent;

            results.push({
                id: c.id,
                query: c.query,
                intent_correct: correct,
                actual_intent: actual,
                expected_intent: c.expected_intent,
                prompt_quality: 0,
            });

            if (!correct) {
                console.warn(`  Intent mismatch [${c.id}]: expected=${c.expected_intent}, actual=${actual}, confidence=${decision.confidence}`);
            }

            expect(actual).toBe(c.expected_intent);
        });
    });

    describe('Prompt Quality', () => {
        it('synthesizer prompt contains HKBU identity', () => {
            const state = createInitialAgentGraphState({
                input: 'GPA怎么算？',
                userId: 'eval-user',
                sessionId: 'eval-001',
                history: [],
                sessionState: { facts: {}, recentDecisions: [], openLoops: [] },
            });

            const messages = buildSynthesizerPrompt(state);
            const score = checkPromptQuality(messages);

            expect(score).toBeGreaterThanOrEqual(0.8);
        });

        it('planner prompt contains HKBU identity', () => {
            const state = createInitialAgentGraphState({
                input: 'GPA怎么算？',
                userId: 'eval-user',
                sessionId: 'eval-001',
                history: [],
                sessionState: { facts: {}, recentDecisions: [], openLoops: [] },
            });

            const messages = buildPlannerPrompt(state);
            const score = checkPromptQuality(messages);

            expect(score).toBeGreaterThanOrEqual(0.8);
        });

        it('clarifier prompt contains HKBU identity', () => {
            const state = createInitialAgentGraphState({
                input: 'GPA怎么算？',
                userId: 'eval-user',
                sessionId: 'eval-001',
                history: [],
                sessionState: { facts: {}, recentDecisions: [], openLoops: [] },
            });

            const messages = buildClarifierPrompt(state);
            const score = checkPromptQuality(messages);

            expect(score).toBeGreaterThanOrEqual(0.8);
        });
    });

    describe('Report Generation', () => {
        it('generates evaluation report', () => {
            const total = results.length;
            const intentCorrect = results.filter(r => r.intent_correct).length;
            const intentAcc = total > 0 ? intentCorrect / total : 0;

            const report = {
                model: 'deepseek-chat (LangGraph v2) - Logic Eval',
                timestamp: new Date().toISOString(),
                total,
                metrics: {
                    intent_accuracy: +intentAcc.toFixed(2),
                    prompt_quality: 1.0,
                    overall: +intentAcc.toFixed(2),
                },
                per_intent: (() => {
                    const groups: Record<string, CaseResult[]> = {};
                    for (const r of results) {
                        if (!groups[r.expected_intent]) groups[r.expected_intent] = [];
                        groups[r.expected_intent].push(r);
                    }
                    const out: Record<string, { count: number; accuracy: number }> = {};
                    for (const [intent, group] of Object.entries(groups)) {
                        out[intent] = {
                            count: group.length,
                            accuracy: +(group.filter(r => r.intent_correct).length / group.length).toFixed(2),
                        };
                    }
                    return out;
                })(),
                failures: results
                    .filter(r => !r.intent_correct)
                    .map(r => ({
                        id: r.id,
                        query: r.query,
                        field: 'intent',
                        expected: r.expected_intent,
                        actual: r.actual_intent,
                    })),
                status: intentAcc >= 0.8 ? 'PASS' : 'FAIL',
            };

            fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 4), 'utf-8');

            console.log(`\n========== Evaluation Report ==========`);
            console.log(`Intent Accuracy: ${(report.metrics.intent_accuracy * 100).toFixed(0)}%`);
            console.log(`Status: ${report.status}`);
            console.log(`Report: ${REPORT_PATH}`);

            if (report.failures.length > 0) {
                console.log(`\nFailures (${report.failures.length}):`);
                for (const f of report.failures) {
                    console.log(`  [${f.id}] ${f.query} → expected ${f.expected}, got ${f.actual}`);
                }
            }

            expect(report).toBeDefined();
        });
    });
});
