# ReAct Agent 迁移实现文档

## 1. 背景

### 当前能力

Campus Agent 使用 `@langchain/langgraph` StateGraph 实现多步推理：
- 意图分类 → RAG 检索 → 规划 → 工具执行 → 合成回复
- 支持 5 种写操作（课程评价、组队、聊天、日历、课表）
- 支持 FAQ 检索、建筑查询、附近地点查询
- 支持用户记忆存取

### 当前问题

**生产版 (EAS Build) 发消息闪退**：`@langchain/langgraph` 依赖 `@langchain/core`，后者使用 Node.js 的 `async_hooks` / `AsyncLocalStorage`。Hermes 引擎不支持这些 API，导致 `graph.invoke()` 执行时触发不可恢复的 native crash。

- Expo 开发模式：Metro 提供 polyfill，能正常运行
- EAS 生产构建：无 polyfill，crash

### 为什么现在要做

- 生产版 agent 完全不可用（已临时降级为 fallback LLM 纯对话模式）
- 用户无法使用核心功能：课表查询、FAQ 检索、课程评价等
- 需要一个不依赖 Node.js API 的 agent 运行时

### 本次改动解决什么

- 用 ReAct 模式完全替代 LangGraph graph 运行时
- 保持所有现有工具能力（读课表、FAQ、建筑、评价等）
- 开发版和生产版行为一致，不再闪退

### 本次改动不解决什么

- 不迁移到后端（仍在客户端运行）
- 不修改 Action Runtime（写操作流程保持不变）
- 不修改 UI 层（AgentChatScreen 接口不变）
- 不修改 DeepSeek API 调用方式

---

## 2. 目标

### 最终目标

用一个基于 DeepSeek function calling 的 ReAct 循环替代 LangGraph StateGraph，使 agent 在生产版和开发版中行为一致。

### 用户能感知到的变化

- 生产版不再闪退，agent 功能完整可用
- 回复质量相当（同样的 DeepSeek 模型 + 同样的工具集）
- 可能略微更快（省去 LangGraph 框架开销）

### 系统层面的变化

- 移除 `@langchain/langgraph`、`@langchain/core`、`@langchain/openai` 依赖
- graph/ 目录整体废弃（不删除，用 feature flag 隔离）
- 新增 `services/agent/react_runtime/` 模块
- `executor.ts` 中 `processWithLegacyGraph` 替换为 `processWithReactLoop`

### 本次不追求的内容

- 不追求多轮复杂状态机（如需要多次确认的写操作仍走 Action Runtime）
- 不追求 streaming token（仍为完整回复后一次性更新 UI）
- 不追求后端化/Edge Function 部署

---

## 3. 范围

### 3.1 In Scope

- 新建 `services/agent/react_runtime/` 模块，实现 ReAct 循环
- 定义 tool schemas 供 DeepSeek function calling 使用
- 迁移所有现有读工具（5 个）到 ReAct runtime
- 修改 `executor.ts` 路由逻辑
- 保持 Action Runtime 不变（写操作仍通过 `shouldUseActionAgent` 路由）
- 移除 `isProductionBuild()` hack，使两种环境走同一条代码路径
- 添加 feature flag `REACT_RUNTIME_ENABLED`（默认 true）
- 保留旧 graph 代码但不再调用

### 3.2 Out of Scope

- 不修改 `action_runtime/` 目录
- 不修改 `AgentChatScreen.tsx`（接口不变）
- 不修改 Supabase schema
- 不修改 FAQ/知识库数据
- 不删除 graph/ 目录（保留用于对比测试）
- 不实现 streaming

---

## 4. 成功标准

### 4.1 用户侧成功标准

| 场景 | 预期行为 |
|---|---|
| 用户发"你好" | 正常回复问候，不闪退 |
| 用户问"我的课表里有什么" | 调用 read_user_schedule 工具，返回课表信息 |
| 用户问"图书馆在哪" | 调用 read_campus_building 工具，返回建筑信息 |
| 用户问"GPA 怎么算" | 调用 search_campus_faq 工具，返回 FAQ 信息 |
| 用户问"附近有什么餐厅" | 调用 find_nearby_place 工具，返回地点信息 |
| 用户说"帮我发课程评价" | 路由到 Action Runtime（不经过 ReAct loop） |
| 连续多轮对话 | 历史正常维护，上下文连贯 |
| 网络错误 | 优雅降级，显示错误信息，不闪退 |

### 4.2 工程侧成功标准

- `__DEV__ === true` 和 `__DEV__ === false` 环境下行为完全一致
- 零 `@langchain/*` 运行时依赖（可保留在 devDependencies 供测试对比）
- ReAct 循环最多 5 轮，有超时保护（30s）
- 所有现有单元测试通过
- 新增 ReAct runtime 测试覆盖核心路径

---

## 5. 术语与状态定义

### 关键术语

| 术语 | 定义 |
|---|---|
| ReAct Loop | 推理(Reasoning) + 行动(Acting) 循环：LLM 决定是否调用工具，执行工具后把结果反馈给 LLM，直到 LLM 给出最终回答 |
| Tool Schema | DeepSeek function calling 格式的工具定义（OpenAI compatible） |
| Tool Call | LLM 返回的工具调用请求（`tool_calls` 字段） |
| Tool Result | 工具执行后的结果，作为 `role: 'tool'` 消息反馈给 LLM |
| Max Iterations | ReAct 循环最大轮数，防止无限循环 |
| Fallback | 当 ReAct 循环整体失败时的兜底回复 |

### 状态定义

ReAct runtime 本身是**无状态的**（每次调用独立），状态由 `AgentExecutor` 的 `context` 持有：

```
AgentExecutor.context
  ├── history: AgentHistoryItem[]     # 对话历史
  ├── historySummary: string          # 历史摘要
  ├── sessionState: AgentSessionState # 会话状态
  └── deviceLocation: AgentGeoPoint   # 设备位置
```

### ReAct 循环内部状态

```
ReactLoopState:
  messages: ChatMessage[]     # 累积的 messages 数组（含 tool results）
  iteration: number           # 当前轮次 (0-based)
  done: boolean              # 是否结束
  finalAnswer: string | null  # 最终回答
  toolsUsed: string[]        # 本次调用过的工具列表
```

---

## 6. 目标架构

### Current Flow (LangGraph)

```
AgentExecutor.process()
  → processWithGraph()
    → shouldUseActionAgent() → [YES] → Action Runtime
    → [NO] → processWithLegacyGraph()
      → require('./index') → runAgentGraph()
        → StateGraph(normalize → route → retrieve → plan → synthesize → memory)
      → [CATCH] → processWithFallbackLLM() (纯对话，无工具)
```

### Target Flow (ReAct)

```
AgentExecutor.process()
  → processWithGraph()
    → shouldUseActionAgent() → [YES] → Action Runtime (不变)
    → [NO] → processWithReactLoop()
      → buildSystemPrompt(context)
      → reactLoop(messages, tools, maxIterations=5)
        → callDeepSeek(messages, { tools })
        → [has tool_calls] → executeTool() → append result → loop
        → [no tool_calls] → return finalAnswer
      → writeMemory() (可选，异步)
      → return AgentResponse
```

### 模块保留/替换/新增

| 模块 | 动作 | 原因 |
|---|---|---|
| `services/agent/executor.ts` | **修改** | 替换 `processWithLegacyGraph` 为 `processWithReactLoop` |
| `services/agent/react_runtime/` | **新增** | ReAct 循环核心 |
| `services/agent/react_runtime/index.ts` | **新增** | 入口 |
| `services/agent/react_runtime/loop.ts` | **新增** | ReAct 循环逻辑 |
| `services/agent/react_runtime/tools.ts` | **新增** | Tool schemas + 执行分发 |
| `services/agent/react_runtime/prompts.ts` | **新增** | System prompt 构建 |
| `services/agent/graph/` | **保留不调用** | 旧代码保留供对比，不再被 require |
| `services/agent/action_runtime/` | **不变** | 写操作路径不变 |
| `services/agent/llm.ts` | **修改** | 新增 `callDeepSeekWithTools` 函数 |
| `services/agent/config.ts` | **修改** | 新增 `REACT_RUNTIME_ENABLED` flag |
| `services/agent/router.ts` | **保留** | 仍用于 Action Agent 路由判断 |
| `services/agent/memory.ts` | **不变** | 记忆读写逻辑不变 |
| `services/agent/session_state.ts` | **不变** | 会话状态逻辑不变 |
| `@langchain/langgraph` | **移至 devDeps** | 不再在生产代码中引用 |
| `@langchain/core` | **移至 devDeps** | 同上 |
| `@langchain/openai` | **移至 devDeps** | 同上 |

---

## 7. 运行时责任边界

### 7.1 后端负责（Supabase）

- 提供 FAQ 知识库数据（`knowledge_base` 表）
- 提供用户课表数据（`user_schedule_entries` 表）
- 提供课程数据（`courses`、`course_reviews` 表）
- 提供用户记忆（`agent_memory` 表）
- 提供建筑/地点数据（`campus_buildings` 或内嵌 JSON）

### 7.2 前端负责（React Native 客户端）

- 维护对话历史和会话状态
- 调用 DeepSeek API（通过 `callDeepSeekWithTools`）
- 执行 ReAct 循环（最多 5 轮）
- 执行工具函数（工具函数内部访问 Supabase）
- 路由写操作到 Action Runtime
- 渲染回复和交互 UI

### 7.3 测试负责验证

- ReAct 循环在 0 工具调用时正确返回
- ReAct 循环在 1-3 次工具调用后正确返回
- ReAct 循环在达到 maxIterations 时正确兜底
- 各工具 schema 与工具函数签名匹配
- DeepSeek API 错误时优雅降级
- 写操作仍正确路由到 Action Runtime
- 历史记录和摘要正确维护

### 7.4 禁止事项

- 前端不得直接 import `@langchain/*` 模块
- 不得在 ReAct 循环内做写操作（写操作必须走 Action Runtime）
- 不得在工具执行中抛出未捕获异常（必须返回 `{ success: false }` 格式）
- 不得依赖 `async_hooks`、`AsyncLocalStorage` 或任何 Node.js-only API
- 不得在 ReAct 循环中调用超过 5 轮（硬性上限）

---

## 8. 数据契约 / JSON Contract

### 8.1 DeepSeek Function Calling 请求格式

```json
{
  "model": "deepseek-v4-flash",
  "messages": [
    { "role": "system", "content": "..." },
    { "role": "user", "content": "我的课表里有什么" }
  ],
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "read_user_schedule",
        "description": "读取用户的课程表",
        "parameters": {
          "type": "object",
          "properties": {},
          "required": []
        }
      }
    }
  ],
  "tool_choice": "auto",
  "temperature": 0.7,
  "stream": false
}
```

### 8.2 DeepSeek Function Calling 响应格式

**无工具调用（直接回复）：**
```json
{
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "你好！我是校园助手，有什么可以帮你的？",
      "tool_calls": null
    },
    "finish_reason": "stop"
  }]
}
```

**有工具调用：**
```json
{
  "choices": [{
    "message": {
      "role": "assistant",
      "content": null,
      "tool_calls": [{
        "id": "call_abc123",
        "type": "function",
        "function": {
          "name": "read_user_schedule",
          "arguments": "{}"
        }
      }]
    },
    "finish_reason": "tool_calls"
  }]
}
```

### 8.3 Tool Result 消息格式

```json
{
  "role": "tool",
  "tool_call_id": "call_abc123",
  "content": "{\"success\":true,\"data\":[{\"title\":\"COMP4015\",\"dayOfWeek\":1,\"startTime\":\"09:00\",\"endTime\":\"11:00\",\"room\":\"DLB 701\"}]}"
}
```

### 8.4 Tool Schema 定义

```typescript
type ToolSchema = {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: {
      type: 'object';
      properties: Record<string, {
        type: string;
        description: string;
        enum?: string[];
      }>;
      required: string[];
    };
  };
};
```

### 8.5 工具执行结果内部格式

```typescript
type ToolResult = {
  success: boolean;
  data?: any;
  error?: string;
  summary: string;  // 给 LLM 看的人类可读摘要
};
```

### 8.6 状态示例

**初始态（用户发消息）：**
```json
{
  "messages": [
    { "role": "system", "content": "You are the HKCampus agent..." },
    { "role": "user", "content": "图书馆在哪" }
  ],
  "iteration": 0,
  "done": false,
  "finalAnswer": null,
  "toolsUsed": []
}
```

**处理中（工具已调用，等待 LLM 合成）：**
```json
{
  "messages": [
    { "role": "system", "content": "..." },
    { "role": "user", "content": "图书馆在哪" },
    { "role": "assistant", "content": null, "tool_calls": [{"id": "call_1", "type": "function", "function": {"name": "read_campus_building", "arguments": "{\"query\":\"图书馆\"}"}}] },
    { "role": "tool", "tool_call_id": "call_1", "content": "{\"success\":true,\"summary\":\"HKBU Library is located at...\"}" }
  ],
  "iteration": 1,
  "done": false,
  "finalAnswer": null,
  "toolsUsed": ["read_campus_building"]
}
```

**成功态：**
```json
{
  "messages": [...],
  "iteration": 1,
  "done": true,
  "finalAnswer": "浸大图书馆位于善衡校园...",
  "toolsUsed": ["read_campus_building"]
}
```

**失败态（API 错误）：**
```json
{
  "messages": [...],
  "iteration": 0,
  "done": true,
  "finalAnswer": "抱歉，我暂时无法处理你的请求，请稍后再试。",
  "toolsUsed": [],
  "error": "DeepSeek API error: 503"
}
```

**超时态（达到 max iterations）：**
```json
{
  "messages": [...],
  "iteration": 5,
  "done": true,
  "finalAnswer": "抱歉，这个问题比较复杂，我目前还无法完全解答。请尝试更具体的问题。",
  "toolsUsed": ["search_campus_faq", "read_campus_building"]
}
```

---

## 9. 文件级实施清单

### 9.1 新增文件

#### `services/agent/react_runtime/index.ts`
- **责任**：模块入口，导出 `runReactAgent`
- **必须提供**：`runReactAgent(input: ReactAgentInput): Promise<ReactAgentResult>`
- **不负责**：UI 渲染、会话状态管理

#### `services/agent/react_runtime/loop.ts`
- **责任**：ReAct 循环核心逻辑
- **必须提供**：
  - `reactLoop(messages, tools, options): Promise<ReactLoopResult>`
  - 循环控制（maxIterations、超时、错误处理）
  - 工具调用分发
- **不负责**：system prompt 构建、工具实现

#### `services/agent/react_runtime/tools.ts`
- **责任**：Tool schemas 定义 + 工具执行分发
- **必须提供**：
  - `REACT_TOOL_SCHEMAS: ToolSchema[]`
  - `executeReactTool(name, args, context): Promise<ToolResult>`
- **不负责**：工具的底层实现（复用 graph/tools/ 中的函数）

#### `services/agent/react_runtime/prompts.ts`
- **责任**：构建 system prompt
- **必须提供**：
  - `buildReactSystemPrompt(context): string`
- **不负责**：LLM 调用

#### `services/agent/react_runtime/types.ts`
- **责任**：类型定义
- **必须提供**：所有 ReAct runtime 相关类型

### 9.2 修改文件

#### `services/agent/executor.ts`
- **现在的问题**：`processWithLegacyGraph` 调用 LangGraph，生产版 crash
- **本次必须改什么**：
  - 删除 `isProductionBuild()` hack
  - 删除 `processWithLegacyGraph` 方法
  - 新增 `processWithReactLoop` 方法，调用 `runReactAgent`
  - 更新 `processWithGraph` 路由逻辑
- **改完后应满足**：开发版和生产版走同一代码路径，无 `require('.')`

#### `services/agent/llm.ts`
- **现在的问题**：没有 function calling 支持
- **本次必须改什么**：
  - 新增 `callDeepSeekWithTools(messages, tools, options): Promise<ChatCompletionMessage>`
  - 返回完整 message 对象（含 `tool_calls`）
- **改完后应满足**：支持 `tools` 参数和 `tool_choice: 'auto'`

#### `services/agent/config.ts`
- **现在的问题**：无 ReAct 相关配置
- **本次必须改什么**：
  - 新增 `REACT_RUNTIME_ENABLED: boolean`（默认 true）
  - 新增 `REACT_MAX_ITERATIONS: number`（默认 5）
  - 新增 `REACT_TIMEOUT_MS: number`（默认 30000）
- **改完后应满足**：可通过环境变量控制

#### `package.json`
- **现在的问题**：`@langchain/*` 在 dependencies 中
- **本次必须改什么**：
  - 将 `@langchain/core`、`@langchain/langgraph`、`@langchain/openai` 移至 `devDependencies`
- **改完后应满足**：生产 bundle 不包含 LangChain 代码

### 9.3 不允许修改的文件

| 文件 | 原因 |
|---|---|
| `services/agent/action_runtime/*` | 写操作路径独立，本次不动 |
| `components/agent/AgentChatScreen.tsx` | UI 层接口不变 |
| `services/agent/memory.ts` | 记忆逻辑不变 |
| `services/agent/memory_extractor.ts` | 记忆提取逻辑不变 |
| `services/messages.ts` | DM 系统无关 |
| `app/agent/chat.tsx` | 路由文件无关 |

---

## 10. 非可延期项

### 必须项 1：Feature Flag `REACT_RUNTIME_ENABLED`
- **为什么不能延后**：需要能够快速回滚到 fallback LLM 模式
- **如果缺失会导致**：一旦 ReAct 出问题无法紧急关闭

### 必须项 2：所有读工具必须有 try/catch 包装
- **为什么不能延后**：工具执行失败不能导致整个 ReAct 循环崩溃
- **如果缺失会导致**：Supabase 暂时不可用时 app crash

### 必须项 3：maxIterations 硬性上限
- **为什么不能延后**：LLM 可能进入无限工具调用循环
- **如果缺失会导致**：用户等待超长时间、API 费用失控

### 必须项 4：超时保护
- **为什么不能延后**：网络问题可能导致单次 API 调用 hang 住
- **如果缺失会导致**：UI 永久显示加载状态

### 必须项 5：移除 `@langchain/*` 从 dependencies
- **为什么不能延后**：这是本次修复的根本目的
- **如果缺失会导致**：Metro 仍会打包 LangChain 代码，潜在 crash 风险

### 必须项 6：保留 `processWithFallbackLLM` 作为最终兜底
- **为什么不能延后**：ReAct 循环本身也可能失败（API key 无效等）
- **如果缺失会导致**：agent 完全不可用

---

## 11. 集成连接点

### 11.1 入口连接

```
AgentChatScreen.handleSend()
  → agentRef.current.process(userMsg, onUpdate)
    → AgentExecutor.process(prompt, onUpdate)
      → AgentExecutor.processWithGraph(prompt, onUpdate)
        → [write ops] → Action Runtime (不变)
        → [read/chat] → processWithReactLoop(prompt, onUpdate)
          → runReactAgent({
              input: prompt,
              userId: context.userId,
              sessionId: context.sessionId,
              history: context.history,
              historySummary: context.historySummary,
              deviceLocation: context.deviceLocation,
              sessionState: context.sessionState,
            })
          → return AgentResponse
```

**参数传递：**
- `runReactAgent` 接收 `ReactAgentInput`（与旧 `GraphEntryInput` 字段一致）
- 返回 `ReactAgentResult`（包含 `AgentResponse` + 可选的 memory writes）

### 11.2 状态连接

| 状态 | 持有者 | 更新者 | 消费者 |
|---|---|---|---|
| `context.history` | `AgentExecutor` | `pushHistory()` | ReAct prompt builder |
| `context.historySummary` | `AgentExecutor` | `summarizeHistory()` | ReAct prompt builder |
| `context.sessionState` | `AgentExecutor` | `updateSessionStateWithTurn()` | ReAct prompt builder |
| `context.deviceLocation` | `AgentExecutor` | `setDeviceLocation()` | `find_nearby_place` tool |
| `sessionState.pendingDraft` | `AgentExecutor` | Action Runtime | `shouldUseActionAgent()` |

### 11.3 UI 连接

**不变**。`AgentChatScreen` 仅消费 `AgentResponse` 接口：

```typescript
interface AgentResponse {
  finalAnswer?: string;
  steps: AgentStep[];
  quickReplies?: string[];
  actionPayload?: ActionPayload | null;
}
```

ReAct runtime 必须返回相同结构。`actionPayload` 在 ReAct 路径中始终为 `null`（写操作走 Action Runtime）。

### 11.4 执行连接

```
ReAct Loop
  → callDeepSeekWithTools(messages, REACT_TOOL_SCHEMAS)
    → DeepSeek API (HTTPS)
    → response.tool_calls?
      → executeReactTool(name, args, context)
        → [name = 'read_user_schedule'] → readUserScheduleTool(userId)
        → [name = 'search_campus_faq'] → searchCampusFaqTool(query)
        → [name = 'read_campus_building'] → readCampusBuildingTool(query)
        → [name = 'find_nearby_place'] → findNearbyPlaceTool(query, location)
        → [name = 'read_memory_facts'] → readMemoryFactsTool(userId)
      → tool result appended to messages
      → next iteration
```

**成功/失败回传：**
- 工具成功：`{ success: true, data: ..., summary: "..." }` → 序列化为 tool message content
- 工具失败：`{ success: false, error: "...", summary: "工具执行失败: ..." }` → 同样序列化，LLM 可根据错误信息决定是否重试或回复用户

---

## 12. 交互流程

### 12.1 主流程（FAQ 查询）

1. 用户输入："GPA 怎么计算"
2. `handleSend()` → `process("GPA 怎么计算")`
3. `shouldUseActionAgent()` → false（不是写操作）
4. `processWithReactLoop()` 调用
5. 构建 system prompt（含历史摘要、会话状态）
6. 第 1 轮 LLM 调用：LLM 返回 `tool_calls: [{ name: "search_campus_faq", arguments: { query: "GPA calculation" } }]`
7. 执行 `searchCampusFaqTool("GPA calculation")`
8. 工具返回 FAQ 结果
9. 第 2 轮 LLM 调用：LLM 收到工具结果，合成最终回答
10. 返回 `AgentResponse { finalAnswer: "GPA 的计算方式是..." }`
11. UI 更新显示回复

### 12.2 主流程（简单问候）

1. 用户输入："你好"
2. `processWithReactLoop()` 调用
3. 第 1 轮 LLM 调用：LLM 判断不需要工具，直接回复
4. 返回 `AgentResponse { finalAnswer: "你好！我是校园助手..." }`

### 12.3 取消流程

不适用（ReAct 路径无取消概念，写操作在 Action Runtime 中处理取消）。

### 12.4 失败重试流程

1. 第 1 轮 LLM 调用：DeepSeek API 返回 503
2. ReAct loop catch 错误
3. 返回 fallback 回复："抱歉，我暂时无法处理你的请求，请稍后再试。"
4. 不自动重试（由用户重新发消息触发）

### 12.5 工具执行失败流程

1. LLM 返回 `tool_calls: [{ name: "read_user_schedule" }]`
2. `readUserScheduleTool` 执行，Supabase 返回错误
3. 工具返回 `{ success: false, error: "Database unavailable", summary: "课表查询失败" }`
4. Tool result 反馈给 LLM
5. LLM 根据错误信息回复用户："抱歉，暂时无法查询你的课表，数据库可能暂时不可用。"

### 12.6 兼容旧模式流程

1. 设置 `REACT_RUNTIME_ENABLED = false`
2. `processWithReactLoop` 检测到 flag 为 false
3. 直接调用 `processWithFallbackLLM`（纯对话模式，无工具）
4. 功能降级但不闪退

---

## 13. 回滚方案

### Feature Flag

```typescript
// config.ts
REACT_RUNTIME_ENABLED: parseBooleanFlag(
  process.env.EXPO_PUBLIC_REACT_RUNTIME_ENABLED, true
)
```

### 如何关闭新能力

设置环境变量 `EXPO_PUBLIC_REACT_RUNTIME_ENABLED=0`，重新构建。

### 关闭后系统走哪条旧路径

`processWithReactLoop` 开头检查 flag：
```typescript
if (!AGENT_CONFIG.REACT_RUNTIME_ENABLED) {
    return this.processWithFallbackLLM(prompt, onUpdate);
}
```

走 fallback LLM 模式（纯对话，无工具调用，直接调 DeepSeek）。

### 回滚后哪些数据需要保留

- 对话历史（在 `AgentExecutor.context` 中，内存态，无需特殊处理）
- 用户记忆（在 Supabase `agent_memory` 表中，不受影响）

### 是否需要数据迁移回退

不需要。ReAct 迁移不涉及数据库 schema 变更。

---

## 14. 风险分析

| 风险 | 触发条件 | 影响 | 规避 | 监控 |
|---|---|---|---|---|
| DeepSeek 不支持 function calling | API 版本变更 | 所有工具调用失败 | 检查 API 响应格式，fallback 到无工具模式 | 日志 `[ReactLoop] tool_calls parsing failed` |
| LLM 进入工具调用死循环 | 模型幻觉，反复调用同一工具 | 用户等待超时 | maxIterations=5 硬限制 | 日志迭代次数 |
| 工具执行耗时过长 | Supabase 慢查询 | 单轮超时 | 每个工具 10s 超时 | 日志 `[Tool] timeout` |
| 总体超时 | 多轮工具调用累积 | 30s 后强制返回 | Promise.race 超时保护 | 日志 `[ReactLoop] timeout` |
| DeepSeek API key 未配置 | `.env` 缺失 | agent 完全不可用 | `assertDeepSeekConfigured()` 前置检查 | 启动日志 |
| 工具 schema 与实际函数不匹配 | 代码修改遗漏 | 参数错误 | 类型检查 + 集成测试 | 工具执行失败率 |

---

## 15. 测试计划

### 15.1 单元测试

| 测试目标 | 文件 | 内容 |
|---|---|---|
| Tool schema 格式 | `react_runtime/tools.test.ts` | 验证所有 schema 符合 OpenAI function calling 格式 |
| Tool 执行分发 | `react_runtime/tools.test.ts` | 验证 `executeReactTool` 正确分发到对应工具函数 |
| System prompt 构建 | `react_runtime/prompts.test.ts` | 验证 prompt 包含必要上下文（历史、位置、会话状态） |
| 循环终止条件 | `react_runtime/loop.test.ts` | 验证 maxIterations、done flag、无 tool_calls 时退出 |
| Tool result 序列化 | `react_runtime/loop.test.ts` | 验证 tool result 正确格式化为 tool message |

### 15.2 集成测试

| 测试目标 | 文件 | 内容 |
|---|---|---|
| LLM + 工具完整链路 | `react_runtime/integration.test.ts` | Mock DeepSeek 返回 tool_calls，验证工具执行 + 二次调用 |
| Executor 路由 | `executor.test.ts` | 验证写操作走 Action Runtime，读操作走 ReAct |
| 错误降级 | `react_runtime/integration.test.ts` | Mock API 失败，验证 fallback 回复 |
| 超时保护 | `react_runtime/integration.test.ts` | Mock 工具执行慢，验证超时触发 |

### 15.3 前端集成测试

| 测试目标 | 内容 |
|---|---|
| AgentResponse 格式 | 验证 ReAct 返回的 response 能被 AgentChatScreen 正确渲染 |
| onUpdate 回调 | 验证最终回答通过 onUpdate 传递 |
| 写操作路由 | 验证"帮我发评价"仍触发 ReviewModal |

### 15.4 端到端测试

| 场景 | 验证点 |
|---|---|
| 打开 agent → 发"你好" | 不闪退，正常回复 |
| 发"我的课表" | 返回课表数据 |
| 发"图书馆在哪" | 返回建筑信息 |
| 发"帮我发课程评价" | 弹出 ReviewModal |
| 连续对话 5 轮 | 历史连贯，无 crash |

### 15.5 回归测试

| 测试目标 | 验证点 |
|---|---|
| Action Runtime 不受影响 | 课程评价完整流程仍可用 |
| 记忆功能不受影响 | 用户记忆仍正常读写 |
| Daily Digest 不受影响 | 资讯推送仍正常 |
| Feature flag 回滚 | 关闭后走 fallback 模式 |

---

## 16. 测试用例清单

### Case RT-001: 简单问候无工具调用
- **Given**: 用户已登录，agent 已初始化
- **When**: 用户发送 "你好"
- **Then**: ReAct loop 调用 LLM 一次，LLM 不返回 tool_calls
- **Expected Output**: `{ finalAnswer: "你好！...", steps: [{ thought: "react: direct_answer", path: "llm" }] }`
- **Notes**: 验证最简路径，iteration = 0

### Case RT-002: 单工具调用（课表查询）
- **Given**: 用户已登录，Supabase 中有课表数据
- **When**: 用户发送 "我的课表里有什么"
- **Then**:
  1. 第 1 轮 LLM 返回 `tool_calls: [{ name: "read_user_schedule" }]`
  2. 工具执行返回课表数据
  3. 第 2 轮 LLM 收到工具结果，合成回答
- **Expected Output**: `{ finalAnswer: "你的课表中有以下课程：...", steps: [...] }`
- **Notes**: 验证单工具调用路径

### Case RT-003: 单工具调用（FAQ）
- **Given**: 知识库中有 GPA 相关 FAQ
- **When**: 用户发送 "GPA 怎么算"
- **Then**: LLM 调用 `search_campus_faq`，获取结果后合成回答
- **Expected Output**: 包含 GPA 计算信息的回复
- **Notes**: 验证 FAQ 检索工具

### Case RT-004: 单工具调用（建筑查询）
- **Given**: 建筑数据可用
- **When**: 用户发送 "图书馆在哪"
- **Then**: LLM 调用 `read_campus_building`
- **Expected Output**: 包含图书馆位置信息的回复

### Case RT-005: 单工具调用（附近地点）
- **Given**: 用户已授权位置权限，deviceLocation 已设置
- **When**: 用户发送 "附近有什么吃的"
- **Then**: LLM 调用 `find_nearby_place`，传入 deviceLocation
- **Expected Output**: 包含附近餐厅信息的回复
- **Notes**: 验证 deviceLocation 正确传递

### Case RT-006: 多工具调用
- **Given**: 用户已登录
- **When**: 用户发送 "我今天有什么课，顺便告诉我图书馆几点关门"
- **Then**: LLM 可能调用 `read_user_schedule` 和 `search_campus_faq`（可能在同一轮或两轮）
- **Expected Output**: 包含课表 + 图书馆时间的综合回复
- **Notes**: 验证多工具调用场景

### Case RT-007: 写操作路由到 Action Runtime
- **Given**: 用户已登录
- **When**: 用户发送 "帮我发一条 COMP4015 的课程评价"
- **Then**: `shouldUseActionAgent` 返回 true，不进入 ReAct loop
- **Expected Output**: Action Runtime 返回带 `actionPayload` 的 response
- **Notes**: 验证路由分离，ReAct 不处理写操作

### Case RT-008: 工具执行失败
- **Given**: Supabase 不可用
- **When**: 用户发送 "我的课表"，LLM 调用 `read_user_schedule`
- **Then**: 工具返回 `{ success: false, error: "..." }`，LLM 收到错误信息后回复用户
- **Expected Output**: 友好的错误提示，不 crash
- **Notes**: 验证工具失败时的优雅降级

### Case RT-009: 达到 maxIterations
- **Given**: Mock LLM 每轮都返回 tool_calls
- **When**: 循环执行到第 5 轮
- **Then**: 强制退出循环，返回兜底回复
- **Expected Output**: `{ finalAnswer: "抱歉，这个问题比较复杂..." }`
- **Notes**: 验证死循环保护

### Case RT-010: API 超时
- **Given**: DeepSeek API 响应超过 30s
- **When**: ReAct loop 等待 API 响应
- **Then**: Promise.race 超时触发，返回错误回复
- **Expected Output**: `{ finalAnswer: "抱歉，请求超时..." }`
- **Notes**: 验证超时保护

### Case RT-011: API Key 未配置
- **Given**: `EXPO_PUBLIC_DEEPSEEK_API_KEY` 为空或 placeholder
- **When**: 用户发送任何消息
- **Then**: `assertDeepSeekConfigured()` 抛出错误，被 catch 后返回提示
- **Expected Output**: 提示用户配置 API key
- **Notes**: 验证配置检查

### Case RT-012: Feature Flag 关闭
- **Given**: `REACT_RUNTIME_ENABLED = false`
- **When**: 用户发送 "我的课表"
- **Then**: 直接走 `processWithFallbackLLM`，无工具调用
- **Expected Output**: 纯 LLM 回复（可能不含课表数据）
- **Notes**: 验证回滚路径

### Case RT-013: 历史上下文保持
- **Given**: 用户之前问了 "COMP4015 的评价怎么样"
- **When**: 用户接着问 "那门课的老师是谁"
- **Then**: 历史中包含上一轮对话，LLM 能理解 "那门课" 指 COMP4015
- **Expected Output**: 与 COMP4015 相关的回复
- **Notes**: 验证历史连贯性

### Case RT-014: 记忆读取
- **Given**: `agent_memory` 中有用户的 `nickname = "小明"` 记录
- **When**: LLM 调用 `read_memory_facts` 工具
- **Then**: 返回用户记忆数据
- **Expected Output**: LLM 能在回复中使用用户的昵称

### Case RT-015: 生产版不闪退（核心验收）
- **Given**: EAS production build，`__DEV__ === false`
- **When**: 用户打开 agent 页面并发送 "你好"
- **Then**: app 不 crash，正常返回回复
- **Expected Output**: 正常的问候回复
- **Notes**: 这是本次迁移的核心验收点

### Case RT-016: 连接点测试 - executor → react_runtime
- **Given**: `REACT_RUNTIME_ENABLED = true`
- **When**: 非写操作消息进入 `processWithReactLoop`
- **Then**: `runReactAgent` 被调用，参数包含正确的 userId、history、deviceLocation
- **Expected Output**: `runReactAgent` 返回值被正确转换为 `AgentResponse`
- **Notes**: 验证 executor 与 react_runtime 的接口对接

### Case RT-017: 连接点测试 - react_runtime → llm
- **Given**: ReAct loop 运行中
- **When**: 调用 `callDeepSeekWithTools`
- **Then**: 请求包含正确的 `tools` 和 `tool_choice` 字段
- **Expected Output**: DeepSeek API 正确响应（含或不含 tool_calls）
- **Notes**: 验证 LLM 调用接口

### Case RT-018: 连接点测试 - react_runtime → tools
- **Given**: LLM 返回 `tool_calls: [{ name: "read_user_schedule", arguments: "{}" }]`
- **When**: `executeReactTool("read_user_schedule", {}, context)` 被调用
- **Then**: 底层 `readUserScheduleTool(userId)` 被正确调用
- **Expected Output**: 工具结果正确返回并序列化
- **Notes**: 验证工具分发

---

## 17. Phase Pass 与 Product Pass

### 17.1 Phase Pass（本次迁移完成标准）

- [ ] `services/agent/react_runtime/` 目录创建完成，所有文件实现
- [ ] `executor.ts` 已改为调用 ReAct runtime
- [ ] `llm.ts` 新增 `callDeepSeekWithTools` 函数
- [ ] `@langchain/*` 移至 devDependencies
- [ ] `isProductionBuild()` hack 已移除
- [ ] Feature flag `REACT_RUNTIME_ENABLED` 已添加
- [ ] 单元测试全部通过（RT-001 ~ RT-014）
- [ ] 集成测试全部通过（RT-016 ~ RT-018）
- [ ] 本地 Expo 运行功能正常

### 17.2 Product Pass（产品完整验收标准）

- [ ] EAS production build 不闪退（RT-015）
- [ ] 所有 5 个读工具在生产版中正常工作
- [ ] 写操作（课程评价）完整流程在生产版中正常工作
- [ ] 连续对话 10 轮无异常
- [ ] 冷启动到首次回复 < 5s（排除网络延迟）
- [ ] 用户反馈无 regression

---

## 18. 实施者自检清单

提交前必须逐项回答：

| 检查项 | 是/否 | 备注 |
|---|---|---|
| 是否按文档修改了所有必须文件 | | |
| 是否实现了所有非可延期项（6项） | | |
| 是否补全了集成连接点（4个） | | |
| 是否通过了关键测试（RT-001~018） | | |
| 是否支持回滚（feature flag） | | |
| 是否有未完成项 | | |
| 生产版是否不闪退 | | |
| `@langchain/*` 是否移出 dependencies | | |
| 所有工具执行是否有 try/catch | | |
| 是否移除了 `isProductionBuild()` hack | | |

---

## 19. 最终 Review Checklist

| 检查项 | 通过 |
|---|---|
| 工具 schema 是否与工具函数签名一致 | |
| `AgentResponse` 格式是否与 UI 消费一致 | |
| 连接点是否真的接通（executor → react → llm → tools） | |
| 是否有隐藏的临时逻辑（hardcoded strings, magic numbers） | |
| 是否依赖自然语言文案维持状态 | |
| 是否有 feature flag | |
| 是否支持失败恢复（工具失败、API 超时） | |
| 写操作是否仍走 Action Runtime | |
| 是否区分了 Phase Pass 和 Product Pass | |
| 是否存在测试未覆盖的高风险路径 | |
| `@langchain/*` 在生产 bundle 中是否完全不被引用 | |
| `require('.')` 是否已移除 | |

---

## 20. 交付物要求

实现完成后必须附：

- [ ] 改动文件列表
- [ ] 关键 JSON 样例（ReAct 请求/响应、工具调用）
- [ ] 测试结果（截图或日志）
- [ ] 已知问题
- [ ] 未完成事项
- [ ] 是否达到 Phase Pass
- [ ] 是否达到 Product Pass
