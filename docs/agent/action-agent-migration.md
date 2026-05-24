# Action Agent Migration Plan

## 1. 目标

本文档描述 HKCampus Agent 从当前 LangGraph 写操作链路迁移到独立 Action Agent 链路的方案。目标不是只替换一个节点，而是把“课程评价、组队、课程群发言、记日历、写课表”这类表单补全型写操作，从问答导向的总 graph 中拆出，收敛成一条更短、更稳、更适合前端交互式 UI 的执行链。

迁移目标：

- 显著降低写操作平均 LLM 调用次数和端到端时延。
- 为后续“弹框填写、评分选择、预填文案、确认提交”预留统一 contract。
- 保持现有 FAQ / 检索 / 纯问答能力不受影响。
- 在迁移期内兼容旧的 `AgentResponse.finalAnswer` 文本消费模式。

## 2. 背景与现状

当前写操作主要走如下链路：

`normalize_input -> route_intent -> plan_next_step -> prepare_action -> clarify_user -> confirm_action -> execute_tools -> synthesize_response -> write_memory`

当前结构的主要问题：

1. `plan_next_step`、`prepare_action`、`clarify_user` 三段职责割裂。
2. `prepare_action` 依赖正则抽槽位，扩展新 action 成本高。
3. 缺参数时必须额外进入 `clarify_user`，产生额外 LLM 调用。
4. 用户补参数、确认、取消等 follow-up 仍会再次经过 planner，回合偏多。
5. 当前返回契约以文本回复为中心，不适合前端直接渲染成 modal/card/form。
6. “写评论”这类未来希望做成低门槛 UI 交互的场景，和 FAQ/QA 的运行模式差异很大，继续混在同一 graph 中会持续增加分支复杂度。

## 3. 迁移目标架构

### 3.1 总体原则

- QA 路径继续保留在现有 graph。
- 写操作路径拆分为独立 Action Agent runtime。
- `route_intent` 可以继续复用现有入口分类能力，但当 intent 落入写操作域时，应切换到 Action Agent。
- Action Agent 的输出以结构化 action draft 为第一优先，文本只作为兼容层。

### 3.2 目标链路

目标写操作链路：

`normalize_input -> route_intent -> action_agent_with_tools -> local_followup_router -> confirm_or_execute -> template_response`

说明：

- `action_agent_with_tools`
  - 负责识别 action type。
  - 负责一次性补齐能补齐的字段。
  - 字段不足时直接返回 draft + missing fields + UI schema，而不是单独走 clarifier 节点。
- `local_followup_router`
  - 负责处理 pending draft 的补槽位、确认、取消、简单改动。
  - 这类输入优先不再走 planner。
- `confirm_or_execute`
  - 参数齐全时进入确认态。
  - 确认后执行工具调用。
- `template_response`
  - 成功/失败/取消默认走模板回复。
  - 仅在确有必要时才回 LLM 做自然语言润色。

## 4. 迁移范围

### 4.1 本次必须覆盖

- `post_course_review`
- `post_course_teaming`
- `send_course_chat_message`
- `create_user_calendar_event`
- `write_user_schedule_entry`

### 4.2 本次不改动

- FAQ / knowledge base 检索逻辑
- read-only tools 的问答路径
- memory extraction 主体逻辑
- 旧的 fallback LLM 模式

### 4.3 允许复用

- 现有 `route_intent` 入口分类
- 现有工具执行 adapter
- 现有 `AgentExecutor` 入口壳层
- 现有 session state 持久化思路

## 5. 兼容目标

迁移期间必须同时满足：

1. 旧前端如果只消费 `finalAnswer`，仍能正常显示结果。
2. 新前端可以消费结构化 action payload，并渲染 modal/card/form。
3. 未迁移的意图仍走老 graph，不受新 action contract 影响。
4. 迁移失败时可回退到旧写操作链路。

## 6. 目标返回契约

Action Agent 的目标输出以结构化对象为主，文本为辅。

统一要求：

- 响应顶层需要同时允许：
  - `finalAnswer` 供旧聊天界面直接显示
  - `actionPayload` 供新前端进行结构化渲染
- `actionPayload` 的详细定义见 [action-agent-contract-and-flow.md](C:/Users/Tim/Documents/GitHub/HKCampus/docs/agent/action-agent-contract-and-flow.md)

## 7. 状态模型迁移

当前状态核心对象：`pendingAction`

目标状态核心对象：`pendingDraft`

建议迁移策略：

- 第一阶段允许 `pendingDraft` 与 `pendingAction` 并存。
- Action Agent 生成 `pendingDraft`。
- 执行工具前再映射为当前执行层理解的 tool input。
- 旧链路仍保留 `pendingAction`。
- 第二阶段，在所有写操作迁移完成后，逐步让旧 graph 不再拥有写操作态。

建议 `pendingDraft` 最低字段：

- `actionType`
- `phase`
- `status`
- `draft`
- `missingFields`
- `uiSchema`
- `summary`
- `source`

## 8. 模块改造建议

### 8.1 新增模块

- `services/agent/action_runtime/`
- `services/agent/action_runtime/index.ts`
- `services/agent/action_runtime/types.ts`
- `services/agent/action_runtime/contract.ts`
- `services/agent/action_runtime/action_agent.ts`
- `services/agent/action_runtime/followup_router.ts`
- `services/agent/action_runtime/template_response.ts`
- `services/agent/action_runtime/tool_adapter.ts`

### 8.2 可能修改模块

- `services/agent/executor.ts`
- `services/agent/llm.ts`
- `services/agent/types.ts`
- `services/agent/session_state.ts`
- `services/agent/tools.ts`
- `components/agent/AgentChatScreen.tsx`

### 8.3 明确不要做的事

- 不要把 UI 逻辑硬编码进自然语言 prompt。
- 不要继续用 assistant 文本内容去反推 action 状态。
- 不要把“评论弹框”只做成前端临时拼装对象，必须由后端返回明确 contract。
- 不要在迁移初期同时大改 QA graph。

## 9. 分阶段实施计划

### Phase 0: 契约冻结

目标：

- 冻结 `actionPayload` JSON contract。
- 冻结课程评价场景的 `draft`、`uiSchema`、`status` 语义。
- 冻结前端渲染入口与兼容层行为。

完成标准：

- 两份设计文档评审通过。
- contract 字段名、状态名、actionType 枚举不再频繁变动。

### Phase 1: 后端最小闭环

目标：

- 新增 Action Agent runtime。
- 首先打通 `post_course_review`。
- 支持：
  - 一句话触发评论草稿
  - 返回结构化 action draft
  - 用户补字段 / 选模板 / 确认 / 取消
  - 最终调用现有 `post_course_review` adapter

完成标准：

- 旧聊天界面仍能看到文本回复。
- 测试文档中的 `post_course_review` 必测用例全部通过。

### Phase 2: 前端 modal 接入

目标：

- 前端识别 `actionPayload.uiSchema.surface === review_modal`
- 弹出评论填写框
- 支持评分选择、预填文案、手工修改、确认提交、取消

完成标准：

- 同一 action 能同时支持：
  - 纯文本追问模式
  - 新前端 modal 模式

### Phase 3: 扩展剩余写操作

目标：

- 把组队、课程群消息、日历、课表逐步迁到 Action Agent

完成标准：

- 写操作默认不再依赖 `clarify_user`
- 写操作 follow-up 默认不再先回 planner

### Phase 4: 清理旧链路

目标：

- 从写操作路径中移除旧的 `prepare_action -> clarify_user` 依赖
- 降低 graph 复杂度

完成标准：

- `course_community_write` 等写操作默认不再进入旧 graph 的写分支
- 旧分支保留受控回滚开关或彻底删除

## 10. 回滚策略

必须支持快速回滚，建议增加 feature flag：

- `ACTION_AGENT_ENABLED`
- `ACTION_AGENT_REVIEW_MODAL_ENABLED`

回滚策略：

1. 关闭 `ACTION_AGENT_REVIEW_MODAL_ENABLED`
   - 前端不再显示结构化 modal，退回纯文本聊天展示。
2. 关闭 `ACTION_AGENT_ENABLED`
   - 写操作重新走旧 graph。

回滚要求：

- 回滚后不需要数据库迁移。
- 回滚后旧 `pendingAction` 流程仍可运行。

## 11. 风险与注意事项

### 11.1 契约漂移风险

风险：

- 后端返回字段命名频繁变动，前端难以稳定接入。

控制方式：

- contract 文档冻结后再开工。
- TypeScript 类型与测试快照同步维护。

### 11.2 双状态并存风险

风险：

- `pendingAction` 和 `pendingDraft` 语义不清，容易冲突。

控制方式：

- 在迁移期明确：
  - 旧链路只写 `pendingAction`
  - 新链路只写 `pendingDraft`
- 入口处必须有清晰优先级判断。

### 11.3 前端只接文本导致价值不明显

风险：

- 后端已经输出结构化 draft，但前端仍只显示文本，无法体现新方案优势。

控制方式：

- `post_course_review` 一旦打通后，前端 modal 必须尽快接入，不要长期停留在“只有后端变了”状态。

### 11.4 工具调用成功但状态未清理

风险：

- 用户重复确认导致重复发帖。

控制方式：

- 执行成功后必须显式清理当前 draft。
- 增加重复提交保护用例。

## 12. 验收标准

### 功能验收

- 用户输入“帮我发个课程评价”时，系统可返回结构化评论 draft。
- 用户可通过文本或 UI 补全字段。
- 用户确认后可成功发出评论。
- 用户取消后状态清理正确。
- 用户执行失败后可重试。

### 性能验收

- 对“缺参数评论发布”路径，LLM 调用次数低于旧链路。
- 对“补参数 follow-up”路径，不应默认再次进入 planner。
- 成功提交后默认走模板回复，不强依赖额外 LLM。

### 兼容验收

- 旧聊天 UI 能显示 `finalAnswer`。
- 新 UI 能识别 `actionPayload`。
- QA 路径行为无回归。

## 13. 实施者交付要求

实现者完成后，必须提交：

1. 改动说明
2. 关键文件列表
3. 课程评价场景返回 JSON 样例
4. 关键 UI 截图或录屏
5. 测试结果
6. 尚未解决的问题清单

## 14. 最终 Review Gate

本次改造完成后，最终代码审核重点如下：

1. 是否严格遵守 action contract。
2. 是否真的降低了写操作的 LLM 回合数。
3. 是否避免把状态逻辑耦合到中文回复文案。
4. 是否让前端可以不解析自然语言就渲染评论弹框。
5. 是否为 `post_course_teaming`、`send_course_chat_message`、`create_user_calendar_event`、`write_user_schedule_entry` 预留了统一扩展路径。
6. 是否保留了可控回滚开关。

只有通过以上审核，才能视为迁移完成。
