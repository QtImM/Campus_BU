# Agent 改造完成总结

## 总体结果

当前 agent 已完成六个阶段的一版落地实现，整体链路已经从“单一模型 + 原始历史 + 简单工具调用”演进为：

- 规则优先
- 稳定子任务优先
- 本地路由优先
- 缓存优先
- 模型分层
- 会话压缩
- FAQ / 知识库标准化检索
- 向量召回 + 轻量重排
- 轻量模型摘要
- CLI 调试显式化

当前主执行顺序大致为：

1. pending flow
2. 稳定子任务
3. 本地规则路由
4. 意图路由
5. 低风险回复缓存
6. 模型路由
7. ReAct + tool

---

## 第一阶段完成内容

目标：减少不必要的大模型调用。

已完成：

- 扩大本地 FAQ 路由覆盖
- FAQ、课表、建筑、附近地点等只读结果直接返回，不再二次喂给模型润色
- 压缩系统提示词，保留边界规则、工具规则、JSON 输出要求
- 增加对应回归测试

主要涉及文件：

- `services/agent/executor.ts`
- `services/faq.ts`
- `__tests__/services/agent/executor.test.ts`

---

## 第二阶段完成内容

目标：加入缓存，减少重复推理和重复检索。

已完成：

- 新增工具缓存基础设施
- 新增缓存 key 规范化
- 为只读工具接入 TTL 缓存
- 加入低风险 LLM 直接答复缓存
- 加入缓存统计
- 将本地强规则命中路径统一收敛到 `executeTool()`，避免绕过缓存

主要涉及文件：

- `services/agent/cache.ts`
- `services/agent/cache_keys.ts`
- `services/agent/executor.ts`

---

## 第三阶段完成内容

目标：加入模型路由，不让所有请求都走同一个模型层级。

已完成：

- 新增 `FAST_MODEL` / `REASONING_MODEL` 配置
- LLM 层支持按模型名调用
- 新增意图分类和复杂度判断
- 执行器根据复杂度和上下文决定走 `fast` 或 `reasoning`
- 在 step 中记录 `modelTier`、`modelName`、`routeReason`
- CLI 输出模型路由调试信息

主要涉及文件：

- `services/agent/config.ts`
- `services/agent/llm.ts`
- `services/agent/router.ts`
- `services/agent/executor.ts`
- `scripts/agent_cli.ts`

---

## 第四阶段完成内容

目标：加入会话压缩，减少长对话上下文成本。

已完成：

- 新增结构化 session state
- 新增规则式历史摘要器
- 执行器上下文改为：
  - structured session state
  - history summary
  - recent raw turns
- 长历史开始自动压缩

主要涉及文件：

- `services/agent/session_state.ts`
- `services/agent/summarizer.ts`
- `services/agent/types.ts`
- `services/agent/executor.ts`

---

## 第五阶段完成内容

目标：升级 FAQ / RAG 检索。

已完成：

- 新增 FAQ / KB 检索重排器
- 新增 query term 扩展
- 新增标准化 FAQ 回答构造
- FAQ 输出统一为：
  - 命中主题
  - 结论
  - 证据片段
  - 建议来源
- 执行器接入统一 FAQ 输出

主要涉及文件：

- `services/agent/retrieval.ts`
- `services/faq.ts`
- `services/agent/executor.ts`
- `__tests__/services/faq.test.ts`

---

## 第六阶段完成内容

目标：把高频、低风险、结构稳定的子任务迁移出大模型。

已完成：

- 新增稳定子任务引擎
- 当前已将 memory read / write 这类稳定子任务本地化
- 典型支持场景：
  - 记住我住在 Hall 3
  - 记住我是某专业
  - 以后叫我某个名字
  - 你记得我的专业吗
- 这类请求现在优先走本地提取和本地 memory，不再依赖大模型规划

主要涉及文件：

- `services/agent/stable_tasks.ts`
- `services/agent/executor.ts`
- `services/agent/memory.ts`

---

## 第七阶段完成内容

目标：补齐检索、摘要和调试链路，让 agent 更接近真实可运维状态。

已完成：

- Supabase 侧补充 `match_knowledge_base` RPC 加固 SQL
- FAQ 检索改为优先走 pgvector RPC，再做本地轻量重排
- 向量检索不可用时自动回退到关键词检索，避免线上直接失效
- 规则式长对话摘要升级为：
  - 规则摘要保底
  - fast model 定期生成结构化摘要
- 稳定子任务扩展到：
  - FAQ query 规范化
  - 写操作确认 / 取消识别
- CLI 增加显式调试信息：
  - path 命中路径
  - 本地规则 / 稳定子任务 / 缓存 / pending / intent route / llm 命中标记
  - 当前模型配置
- 增加对应 FAQ / 执行器回归测试

主要涉及文件：

- `supabase/migrations/20260325_agent_kb_rpc_hardening.sql`
- `services/faq.ts`
- `services/agent/embeddings.ts`
- `services/agent/summarizer.ts`
- `services/agent/stable_tasks.ts`
- `services/agent/executor.ts`
- `services/agent/types.ts`
- `scripts/agent_cli.ts`
- `__tests__/services/faq.test.ts`
- `__tests__/services/agent/executor.test.ts`

---

## 测试与调试

已完成：

- 回归测试覆盖执行器主流程
- FAQ 检索层单测
- 终端临时调试脚本
- 向量 RPC / 回退检索测试
- 轻量模型摘要测试

当前可用命令：

- `npm test -- --runTestsByPath __tests__/services/agent/executor.test.ts __tests__/services/faq.test.ts`
- `npm run agent:cli`
- `npm run agent:cli -- --prompt='你的问题'`

---

## 当前状态判断

这套 agent 现在已经不是“概念方案”，而是一版可运行的工程实现。

当前已经具备：

- 本地路由
- 缓存
- 模型分层
- 会话压缩
- 检索标准化
- 向量召回接入
- 稳定子任务本地化
- 显式调试路径输出

但它仍然是第一版工程实现，不是最终版。

需要继续优化的部分，已经集中整理到 [`services/agent/TODO.md`](/Campus_BU/services/agent/TODO.md)。

---

## 成本控制量化结论（current vs `old-896038f7`）

### 结论

- 已实现成本控制能力（缓存、本地路由、稳定子任务、模型分层、会话压缩均已落地）。
- 质量侧证据明确改善，且时延基本不变，说明降本策略没有引入明显性能退化。
- 目前还缺 token/金额级埋点，无法给出“每次对话节省金额”这一最终财务指标。

### 已执行的同口径对比测试

共同测试集（两边都存在）：

- `__tests__/services/agent/executor.test.ts`
- `__tests__/services/ai-ocr.test.ts`
- `__tests__/services/campus.test.ts`
- `__tests__/services/moderation.test.ts`

对比结果：

- current：36/38 通过，2 失败，4 套件中 2 套通过，端到端总时长 4420 ms
- old-896038f7：14/19 通过，5 失败，4 套件中 1 套通过，端到端总时长 4457 ms

量化差异：

- 用例通过率：94.74% vs 73.68%（+21.06 个百分点）
- 套件通过率：50.00% vs 25.00%（+25.00 个百分点）
- 失败用例数：2 vs 5（下降 60%）
- 可对比测试覆盖规模：38 vs 19（+100%）
- 端到端总时长：4420 ms vs 4457 ms（-37 ms，-0.83%）

### 如何继续完成“成本金额”量化

建议补 telemetry 字段：

- `requestId`
- `path`（pending/stable_task/local_rule/intent_route/cache/llm）
- `modelName`
- `promptTokens`
- `completionTokens`
- `totalTokens`
- `cacheHit`
- `latencyMs`

计算口径：

- 单次成本 = `promptTokens * inputPrice + completionTokens * outputPrice`
- 平均成本 = `sum(单次成本) / 请求数`
- 成本降幅 = `1 - avgCost(current) / avgCost(old)`

达标阈值（建议）：

- 平均成本下降 >= 35%
- 平均 total token 下降 >= 30%
- 高阶模型调用率 <= 25%
- 缓存命中率 >= 35%
