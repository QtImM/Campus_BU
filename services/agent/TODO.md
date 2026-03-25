# Agent 后续优化 TODO

## 说明

六个阶段的一版实现已经完成。当前这个文件只保留后续真实优化项，不再重复记录已完成阶段。

完整完成总结见：

- [`services/agent/IMPLEMENTATION_SUMMARY.md`](/Users/xuweining/CodeBuddy/20260324190324/Campus_BU/services/agent/IMPLEMENTATION_SUMMARY.md)

---

## 已修复

### 1. 长对话压缩后的课程上下文回退

- 已让课程解析优先读取 `sessionState.referencedCourse`
- 已补回归测试，覆盖压缩历史后的课程解析

### 2. FAQ 弱相关本地结果误导结论

- 已在答案构造层重新比较 FAQ 分数与 KB 分数
- 本地 FAQ 置信度不足时，允许知识库结果优先作为结论
- 已补 FAQ 回归测试

### 3. 稳定子任务对复合意图的短路

- 已避免 memory 读写在明显复合意图下直接短路
- 当前策略是先不截断，让后续本地路由 / 模型路由继续处理
- 已补复合意图回归测试

### 4. Node 流式响应尾段 buffer 丢失

- 已在 fetch streaming 结束后补处理残留 buffer
- 已补 Node 路径单测

### 5. 低风险回复缓存 key 未绑定真实模型名

- 已改为使用真实 `FAST_MODEL` 参与响应缓存 key 生成

---

## 高优先级修复

当前高优先级问题已处理完成，后续优先进入检索、摘要质量和稳定子任务扩展。

---

## 中优先级优化

### 7. 接入真正的向量检索

当前问题：

- 第五阶段仍是规则式召回 + 重排
- 尚未调用 `match_knowledge_base`

建议：

- 在运行环境允许时接通 pgvector RPC
- 形成真正的向量召回 + 规则/轻量重排两段式检索

涉及文件：

- `services/faq.ts`
- `services/agent/retrieval.ts`
- Supabase RPC / migration

### 8. 把规则式摘要升级成轻量模型摘要

当前问题：

- 第四阶段摘要器仍是规则式列表摘要
- 对复杂长对话的压缩质量有限

建议：

- 让 fast model 定期生成结构化摘要
- 仍然保留 token budget 和字段约束

涉及文件：

- `services/agent/summarizer.ts`
- `services/agent/executor.ts`

### 9. 扩展稳定子任务覆盖面

可继续迁移的任务：

- FAQ 分类
- 写操作确认意图识别
- 简单偏好抽取
- query 规范化

涉及文件：

- `services/agent/stable_tasks.ts`
- `services/agent/router.ts`

### 10. 给 CLI 增加更明确的调试输出

建议补充：

- 是否命中本地规则
- 是否命中稳定子任务
- 是否命中缓存
- 当前模型配置

涉及文件：

- `scripts/agent_cli.ts`

---

## 测试补强

### 建议新增测试

- 长对话压缩后继续发课程社区写请求
- 一句内复合意图：memory + FAQ / memory + nearby / memory + course
- Node 流式解析尾段
- 切换 fast/reasoning model 后缓存 key 隔离
- FAQ 弱相关命中与知识库强相关命中的优先级

---

## 下一批最值得做的顺序

1. 接入真正的向量检索
2. 把规则式摘要升级成轻量模型摘要
3. 扩展稳定子任务覆盖面
4. 给 CLI 增加更明确的调试输出
