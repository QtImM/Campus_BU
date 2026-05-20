/**
 * Agent 延迟 Benchmark
 *
 * 运行: npx jest __tests__/services/agent/benchmark.test.ts --no-coverage --testTimeout=60000
 *
 * 直接测量各阶段真实耗时（不依赖 LangGraph），结果保存到 scripts/benchmark_history.json。
 * 每次运行与上一次对比，最多保留最近 2 条记录。
 */

import fs from 'fs';
import path from 'path';

const HISTORY_PATH = path.resolve(__dirname, '../../../scripts/benchmark_history.json');

// 加载 .env
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// 只 import 不依赖 LangGraph 的模块
const { callDeepSeek } = require('../../../services/agent/llm');
const { classifyIntent } = require('../../../services/agent/router');

const BENCHMARK_CASES = [
    { id: 'faq-simple', query: 'GPA怎么算？' },
    { id: 'faq-english', query: 'How do I connect to eduroam wifi?' },
    { id: 'schedule', query: '今天有什么课？' },
    { id: 'building', query: 'AAB在哪？' },
];

type BenchmarkRecord = {
    timestamp: string;
    per_case: Array<{
        id: string;
        query: string;
        intent_ms: number;
        intent: string;
        llm_ms: number;
        llm_response: string;
        total_ms: number;
    }>;
    avg_intent_ms: number;
    avg_llm_ms: number;
    avg_total_ms: number;
};

function loadHistory(): BenchmarkRecord[] {
    try { return JSON.parse(fs.readFileSync(HISTORY_PATH, 'utf-8')); } catch { return []; }
}

function saveHistory(records: BenchmarkRecord[]) {
    fs.writeFileSync(HISTORY_PATH, JSON.stringify(records.slice(-2), null, 2), 'utf-8');
}

function printComparison(current: BenchmarkRecord, previous?: BenchmarkRecord) {
    const fmt = (n: number) => String(n).padStart(6);
    const delta = (cur: number, prev: number) => {
        const d = cur - prev;
        const pct = prev > 0 ? ((d / prev) * 100).toFixed(0) : '0';
        const sign = d > 0 ? '+' : '';
        return `  ${sign}${d}ms (${sign}${pct}%)`;
    };

    console.log(`\n${'='.repeat(64)}`);
    console.log(`  Agent Latency Benchmark  ${current.timestamp}`);
    console.log(`${'='.repeat(64)}`);

    console.log('\n  Per-case:');
    for (const c of current.per_case) {
        const prev = previous?.per_case.find(p => p.id === c.id);
        console.log(`    ${c.id.padEnd(16)} intent=${fmt(c.intent_ms)}ms  llm=${fmt(c.llm_ms)}ms  total=${fmt(c.total_ms)}ms  [${c.intent}]`);
        if (prev) {
            console.log(`${''.padEnd(20)}${delta(c.total_ms, prev.total_ms).trim()}`);
        }
        console.log(`${''.padEnd(20)}"${c.llm_response}"`);
    }

    console.log('\n  Averages:');
    const rows: Array<[string, number, number | undefined]> = [
        ['intent routing', current.avg_intent_ms, previous?.avg_intent_ms],
        ['LLM call', current.avg_llm_ms, previous?.avg_llm_ms],
        ['total', current.avg_total_ms, previous?.avg_total_ms],
    ];
    for (const [label, cur, prev] of rows) {
        const comp = prev !== undefined ? delta(cur, prev) : '';
        console.log(`    ${label.padEnd(16)} ${fmt(cur)}ms${comp}`);
    }

    if (previous) console.log(`\n  (vs ${previous.timestamp})`);
    console.log(`\n${'='.repeat(64)}\n`);
}

describe('Agent Latency Benchmark', () => {
    it('measures intent routing + LLM call latency', async () => {
        const results: BenchmarkRecord['per_case'] = [];

        for (const tc of BENCHMARK_CASES) {
            // 1. Intent routing
            const intentStart = Date.now();
            const route = classifyIntent(tc.query);
            const intentMs = Date.now() - intentStart;

            // 2. LLM call (planner prompt, like real agent)
            const llmStart = Date.now();
            let llmResponse = '';
            try {
                llmResponse = await callDeepSeek([
                    { role: 'system', content: 'You are a campus assistant for HKBU. Reply concisely in the same language as the user.' },
                    { role: 'user', content: tc.query },
                ]);
            } catch (e: any) {
                llmResponse = `ERROR: ${e.message}`;
            }
            const llmMs = Date.now() - llmStart;

            results.push({
                id: tc.id,
                query: tc.query,
                intent_ms: intentMs,
                intent: route.intent,
                llm_ms: llmMs,
                llm_response: llmResponse.slice(0, 60),
                total_ms: intentMs + llmMs,
            });
        }

        const record: BenchmarkRecord = {
            timestamp: new Date().toISOString(),
            per_case: results,
            avg_intent_ms: Math.round(results.reduce((s, r) => s + r.intent_ms, 0) / results.length),
            avg_llm_ms: Math.round(results.reduce((s, r) => s + r.llm_ms, 0) / results.length),
            avg_total_ms: Math.round(results.reduce((s, r) => s + r.total_ms, 0) / results.length),
        };

        const history = loadHistory();
        const previous = history.length > 0 ? history[history.length - 1] : undefined;
        printComparison(record, previous);

        history.push(record);
        saveHistory(history);
        console.log(`已保存到 ${path.relative(process.cwd(), HISTORY_PATH)}`);
    });
});
