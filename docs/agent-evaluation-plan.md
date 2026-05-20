# Agent 评测体系

## Context

评测分两层：Jest 单元测试（12 文件 69 测试）+ 逻辑评测脚本（20 条 Golden Dataset）。逻辑评测通过 Jest 运行，测 intent 路由准确性 + prompt 质量，无需真实 API。

## 文件结构

```
scripts/
  evaluate_agent.ts          # 评测核心逻辑（导出函数）
  evaluate_agent.test.ts     # Jest 测试入口
  eval_golden_dataset.json   # Golden Dataset（20 条）
  evaluate_agent.py          # 旧 Python 脚本（保留）
  evaluation_report.json     # 自动生成
```

### 1. Golden Dataset (`scripts/eval_golden_dataset.json`)

20+ 条用例，覆盖所有 intent 类型：

```json
[
  {
    "id": "faq-01",
    "query": "GPA怎么算？",
    "expected_intent": "campus_faq",
    "expected_decision": "answer",
    "language": "zh"
  },
  {
    "id": "schedule-01",
    "query": "今天有什么课？",
    "expected_intent": "schedule_query",
    "expected_decision": "answer",
    "language": "zh"
  }
]
```

覆盖：campus_faq(5)、schedule_query(3)、course_community_read(3)、course_community_write(3)、building_query(2)、date_query(1)、unknown/edge(3+)

### 2. 主评测脚本 (`scripts/evaluate_agent.ts`)

运行流程：

```
对每条 golden dataset 用例:
  1. 记录开始时间
  2. 调用 createAgentGraphRuntime().run() 获取真实 Agent 输出
  3. 记录结束时间，计算 end_to_end_latency_ms
  4. 从 finalState.trace 提取每个节点的 durationMs
  5. 检查 intent 分类是否匹配 expected_intent（精确匹配 → 0/1）
  6. 检查 planner decision 是否匹配 expected_decision（精确匹配 → 0/1）
  7. 调用 callDeepSeek (裁判模型) 打 faithfulness 分（0-1）
  8. 调用 callDeepSeek (裁判模型) 打 answer_relevance 分（0-1）
  9. 记录结果

汇总输出 evaluation_report.json（含延迟统计）
```

### 3. 延迟指标

从 `finalState.trace`（每个 GraphTraceEntry 已有 `durationMs` 和 `llmCalls[].latencyMs`）提取：

| 指标 | 含义 | 来源 |
|---|---|---|
| `e2e_latency_ms` | 端到端总耗时 | `Date.now()` 包裹 runtime.run() |
| `llm_total_ms` | 所有 LLM 调用耗时之和 | `trace[].llmCalls[].latencyMs` 求和 |
| `llm_call_count` | LLM 调用次数 | `trace[].llmCalls.length` 求和 |
| `per_node_ms` | 每个节点耗时 | `trace[].durationMs` |
| `ttft_ms` | 首次响应时间（synthesizer 耗时） | `synthesize_response` 节点的 durationMs |

### 4. LLM-as-a-Judge 打分

复用 `services/agent/llm.ts` 的 `callDeepSeek`，构造裁判 prompt：

**Faithfulness Judge**：
```
给定证据: {evidence}
Agent 回答: {response}
拆解回答中的每个事实陈述，判断是否在证据中有依据。
输出 JSON: {"score": 0.0-1.0, "reasoning": "..."}
```

**Answer Relevance Judge**：
```
用户问题: {query}
Agent 回答: {response}
回答是否直接解决了用户问题？
输出 JSON: {"score": 0.0-1.0, "reasoning": "..."}
```

### 5. 报告输出

```json
{
  "model": "deepseek-chat (LangGraph v2)",
  "timestamp": "2026-05-19T...",
  "total": 20,
  "metrics": {
    "intent_accuracy": 0.90,
    "decision_accuracy": 0.85,
    "faithfulness": 0.88,
    "answer_relevance": 0.92,
    "overall": 0.89
  },
  "latency": {
    "e2e_avg_ms": 3200,
    "e2e_p50_ms": 2800,
    "e2e_p95_ms": 5500,
    "e2e_max_ms": 6100,
    "llm_total_avg_ms": 2400,
    "llm_call_count_avg": 2.1,
    "ttft_avg_ms": 1200,
    "per_node_avg_ms": {
      "normalize_input": 5,
      "route_intent": 3,
      "retrieve_context": 120,
      "plan_next_step": 800,
      "synthesize_response": 1200,
      "write_memory": 150
    }
  },
  "per_intent": {
    "campus_faq": { "count": 5, "intent_acc": 1.0, "decision_acc": 0.8, "avg_latency_ms": 3000 },
    "schedule_query": { "count": 3, "intent_acc": 0.67, "decision_acc": 1.0, "avg_latency_ms": 2500 }
  },
  "failures": [
    { "id": "schedule-02", "query": "...", "field": "intent", "expected": "...", "actual": "..." }
  ],
  "status": "PASS"
}
```

### 6. 运行方式

```bash
npm run eval
# 等价于: npx jest scripts/evaluate_agent.test.ts --no-coverage --testTimeout=120000
```

## 关键复用

| 复用目标 | 来源文件 |
|---|---|
| `createAgentGraphRuntime()` | `services/agent/graph/index.ts` |
| `callDeepSeek()` | `services/agent/llm.ts` |
| `createInitialAgentGraphState()` | `services/agent/graph/state.ts` |
| `classifyIntent()` | `services/agent/router.ts` |
| `AGENT_CONFIG` | `services/agent/config.ts` |

## 验证

1. `npm run eval` 运行评测
2. 检查 `scripts/evaluation_report.json` 输出
3. 确认 overall score > 0.8
4. 故意改坏一个 prompt，重跑验证 failure 能被捕获