# Action Agent Contract And Flow

## 1. 文档目标

本文档定义 HKCampus Action Agent 的目标实现方式，重点覆盖：

- 统一 JSON contract
- `post_course_review` 评论弹框场景
- 前后端交互流程
- 状态机
- 扩展到其他写操作的方式
- 预先定义的测试用例

本文档是实现规格书，默认实现者按照本文档执行，不自行发明新的字段语义或状态名称。

## 2. 设计原则

1. 结构化 contract 优先于自然语言文本。
2. 同一个响应必须同时支持：
   - 旧聊天模式直接显示文本
   - 新前端模式渲染成 modal/card/form
3. 写操作必须以 draft 为中心，而不是以单次 tool call 为中心。
4. 评论、组队、群聊、日历、课表共用统一外壳 contract。
5. 补槽位、确认、取消、失败重试都必须是状态机的一部分。

## 3. 顶层响应契约

Action Agent 返回对象建议挂在现有 `AgentResponse` 之下，新增 `actionPayload` 字段。

目标形态：

```json
{
  "finalAnswer": "我可以帮你发课程评价，先选个评分吧。",
  "steps": [],
  "quickReplies": [],
  "actionPayload": {
    "type": "agent_action",
    "version": "1.0",
    "requestId": "req_123",
    "sessionId": "session_123",
    "message": {
      "text": "我可以帮你发课程评价，先选个评分吧。",
      "tone": "neutral"
    },
    "action": {
      "actionType": "post_course_review",
      "phase": "draft",
      "status": "awaiting_user_input",
      "canConfirm": false,
      "canSubmit": false,
      "canCancel": true,
      "requiresConfirmation": true,
      "missingFields": ["courseCode", "rating", "content"],
      "editableFields": ["courseCode", "rating", "content", "anonymous"],
      "draft": {},
      "uiSchema": {},
      "summary": {}
    },
    "next": {
      "expectedUserAction": "fill_or_edit_draft",
      "allowedInputs": ["free_text", "field_edit", "preset_select", "confirm", "cancel"]
    },
    "meta": {
      "source": "action_agent",
      "latencyTier": "fast"
    }
  }
}
```

## 4. 顶层字段定义

### 4.1 `finalAnswer`

类型：`string`

用途：

- 旧前端聊天模式直接展示
- 新前端在 modal 未启用时兜底展示

要求：

- 任何带 `actionPayload` 的响应仍需带 `finalAnswer`

### 4.2 `actionPayload`

类型：`object`

要求：

- 仅在 Action Agent 写操作场景下返回
- QA 场景默认不返回

## 5. `actionPayload` 结构定义

### 5.1 通用字段

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `type` | `string` | 是 | 固定为 `agent_action` |
| `version` | `string` | 是 | contract 版本，初始为 `1.0` |
| `requestId` | `string` | 是 | 本次 agent 请求 id |
| `sessionId` | `string` | 是 | 会话 id |
| `message` | `object` | 是 | 当前需要给用户看的文案 |
| `action` | `object` | 是 | 业务 action 主体 |
| `next` | `object` | 是 | 下一步用户允许做什么 |
| `meta` | `object` | 否 | 追踪与调试信息 |

### 5.2 `message`

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `text` | `string` | 是 | 展示给用户的主要文本 |
| `tone` | `string` | 否 | `neutral` / `positive` / `warning` / `error` |

### 5.3 `action`

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `actionType` | `string` | 是 | 动作类型 |
| `phase` | `string` | 是 | 当前阶段 |
| `status` | `string` | 是 | 当前状态 |
| `canConfirm` | `boolean` | 是 | 当前是否允许确认 |
| `canSubmit` | `boolean` | 是 | 当前是否允许提交 |
| `canCancel` | `boolean` | 是 | 当前是否允许取消 |
| `requiresConfirmation` | `boolean` | 是 | 最终提交前是否需要确认 |
| `missingFields` | `string[]` | 是 | 当前缺失字段 |
| `editableFields` | `string[]` | 是 | 前端允许编辑字段 |
| `draft` | `object` | 是 | 当前草稿数据 |
| `uiSchema` | `object` | 是 | 前端渲染信息 |
| `summary` | `object` | 是 | 摘要信息 |

### 5.4 `next`

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `expectedUserAction` | `string` | 是 | 推荐的下一步 |
| `allowedInputs` | `string[]` | 是 | 当前允许的交互方式 |

## 6. actionType 枚举

本期支持：

- `post_course_review`
- `post_course_teaming`
- `send_course_chat_message`
- `create_user_calendar_event`
- `write_user_schedule_entry`

## 7. phase / status 定义

### 7.1 `phase`

允许值：

- `draft`
- `confirm`
- `submitting`
- `result`

说明：

- `draft`: 正在补参数或编辑草稿
- `confirm`: 参数已齐，等待最终确认
- `submitting`: 已提交，前端可显示 loading
- `result`: 已得到结果，成功/失败/取消都属于结果态

### 7.2 `status`

允许值：

- `awaiting_user_input`
- `ready_for_confirmation`
- `submitting`
- `completed`
- `failed`
- `cancelled`

要求：

- `phase` 与 `status` 必须语义一致
- 示例：
  - `phase = draft` 时，`status` 应为 `awaiting_user_input`
  - `phase = confirm` 时，`status` 应为 `ready_for_confirmation`

## 8. 课程评价 `post_course_review` 规格

### 8.1 `draft`

```json
{
  "courseCode": null,
  "rating": null,
  "content": "",
  "anonymous": false
}
```

字段定义：

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `courseCode` | `string \| null` | 是 | 课程代码 |
| `rating` | `number \| null` | 是 | 1 到 5 分 |
| `content` | `string` | 是 | 评论正文 |
| `anonymous` | `boolean` | 是 | 是否匿名 |

### 8.2 `uiSchema`

```json
{
  "surface": "review_modal",
  "title": "发布课程评价",
  "submitLabel": "提交评价",
  "cancelLabel": "取消",
  "fields": [
    {
      "name": "courseCode",
      "label": "课程代码",
      "component": "course_picker",
      "required": true,
      "placeholder": "例如 COMP3015"
    },
    {
      "name": "rating",
      "label": "评分",
      "component": "rating_picker",
      "required": true,
      "scale": 5
    },
    {
      "name": "content",
      "label": "评价内容",
      "component": "textarea",
      "required": true,
      "placeholder": "写下你的上课体验"
    },
    {
      "name": "anonymous",
      "label": "匿名发布",
      "component": "switch",
      "required": false
    }
  ],
  "presets": {
    "ratingToContentTemplates": {
      "1": [
        "这门课体验不太好，内容和节奏都有待改进。",
        "作业和讲解之间衔接不够顺畅。"
      ],
      "2": [
        "整体体验一般，有些部分比较吃力。",
        "课程有帮助，但教学节奏可以更清晰。"
      ],
      "3": [
        "整体中规中矩，适合愿意自己补充学习的同学。",
        "课程内容还可以，但有些地方可以讲得更细。"
      ],
      "4": [
        "课程整体不错，内容比较清晰，也有收获。",
        "老师讲解比较清楚，作业安排也算合理。"
      ],
      "5": [
        "老师讲解清晰，课程很有收获，推荐选修。",
        "整体体验很好，内容扎实，学习收获很大。"
      ]
    }
  }
}
```

要求：

- `surface` 固定使用 `review_modal`
- 前端看到 `surface = review_modal` 时，优先弹出 modal
- 用户选择 rating 后，前端从 `presets.ratingToContentTemplates` 里取推荐文案
- 前端不得自行硬编码不同评分对应的推荐语，必须以后端返回为准

### 8.3 `summary`

```json
{
  "title": "课程评价草稿",
  "lines": [
    "课程：COMP3015",
    "评分：5/5",
    "内容：老师讲解清晰，课程很有收获。",
    "匿名：否"
  ]
}
```

用途：

- confirm modal
- 聊天卡片摘要
- 调试日志

## 9. 课程评价关键响应示例

### 9.1 初次触发且缺参数

输入：

`帮我发个课程评价`

期望响应：

```json
{
  "finalAnswer": "我可以帮你发课程评价，先选个评分吧。",
  "actionPayload": {
    "type": "agent_action",
    "version": "1.0",
    "requestId": "req_review_001",
    "sessionId": "session_001",
    "message": {
      "text": "我可以帮你发课程评价，先选个评分吧。",
      "tone": "neutral"
    },
    "action": {
      "actionType": "post_course_review",
      "phase": "draft",
      "status": "awaiting_user_input",
      "canConfirm": false,
      "canSubmit": false,
      "canCancel": true,
      "requiresConfirmation": true,
      "missingFields": ["courseCode", "rating", "content"],
      "editableFields": ["courseCode", "rating", "content", "anonymous"],
      "draft": {
        "courseCode": null,
        "rating": null,
        "content": "",
        "anonymous": false
      },
      "uiSchema": {
        "surface": "review_modal"
      },
      "summary": {
        "title": "课程评价草稿",
        "lines": [
          "课程：未选择",
          "评分：未选择",
          "内容：未填写",
          "匿名：否"
        ]
      }
    },
    "next": {
      "expectedUserAction": "fill_or_edit_draft",
      "allowedInputs": ["free_text", "field_edit", "preset_select", "confirm", "cancel"]
    }
  }
}
```

### 9.2 用户已选 5 星，自动带出推荐文案

```json
{
  "finalAnswer": "我先帮你带出一条 5 星评价草稿，你可以直接改。",
  "actionPayload": {
    "type": "agent_action",
    "version": "1.0",
    "requestId": "req_review_002",
    "sessionId": "session_001",
    "message": {
      "text": "我先帮你带出一条 5 星评价草稿，你可以直接改。",
      "tone": "positive"
    },
    "action": {
      "actionType": "post_course_review",
      "phase": "draft",
      "status": "awaiting_user_input",
      "canConfirm": false,
      "canSubmit": false,
      "canCancel": true,
      "requiresConfirmation": true,
      "missingFields": ["courseCode", "content"],
      "editableFields": ["courseCode", "rating", "content", "anonymous"],
      "draft": {
        "courseCode": null,
        "rating": 5,
        "content": "老师讲解清晰，课程很有收获，推荐选修。",
        "anonymous": false
      },
      "uiSchema": {
        "surface": "review_modal"
      },
      "summary": {
        "title": "课程评价草稿",
        "lines": [
          "课程：未选择",
          "评分：5/5",
          "内容：老师讲解清晰，课程很有收获，推荐选修。",
          "匿名：否"
        ]
      }
    },
    "next": {
      "expectedUserAction": "fill_or_edit_draft",
      "allowedInputs": ["free_text", "field_edit", "preset_select", "confirm", "cancel"]
    }
  }
}
```

### 9.3 参数齐全，进入确认态

```json
{
  "finalAnswer": "请确认是否发布这条课程评价。",
  "actionPayload": {
    "type": "agent_action",
    "version": "1.0",
    "requestId": "req_review_003",
    "sessionId": "session_001",
    "message": {
      "text": "请确认是否发布这条课程评价。",
      "tone": "neutral"
    },
    "action": {
      "actionType": "post_course_review",
      "phase": "confirm",
      "status": "ready_for_confirmation",
      "canConfirm": true,
      "canSubmit": true,
      "canCancel": true,
      "requiresConfirmation": true,
      "missingFields": [],
      "editableFields": ["rating", "content", "anonymous"],
      "draft": {
        "courseCode": "COMP3015",
        "rating": 5,
        "content": "老师讲解清晰，课程很有收获。",
        "anonymous": false
      },
      "uiSchema": {
        "surface": "review_confirm_modal",
        "title": "确认发布课程评价"
      },
      "summary": {
        "title": "待发布课程评价",
        "lines": [
          "课程：COMP3015",
          "评分：5/5",
          "内容：老师讲解清晰，课程很有收获。",
          "匿名：否"
        ]
      }
    },
    "next": {
      "expectedUserAction": "confirm_or_edit",
      "allowedInputs": ["confirm", "cancel", "field_edit"]
    }
  }
}
```

### 9.4 成功提交

```json
{
  "finalAnswer": "已帮你发布到 COMP3015 的课程评价。",
  "actionPayload": {
    "type": "agent_action",
    "version": "1.0",
    "requestId": "req_review_004",
    "sessionId": "session_001",
    "message": {
      "text": "已帮你发布到 COMP3015 的课程评价。",
      "tone": "positive"
    },
    "action": {
      "actionType": "post_course_review",
      "phase": "result",
      "status": "completed",
      "canConfirm": false,
      "canSubmit": false,
      "canCancel": false,
      "requiresConfirmation": false,
      "missingFields": [],
      "editableFields": [],
      "draft": {
        "courseCode": "COMP3015",
        "rating": 5,
        "content": "老师讲解清晰，课程很有收获。",
        "anonymous": false
      },
      "uiSchema": {
        "surface": "result_card"
      },
      "summary": {
        "title": "已发布课程评价",
        "lines": [
          "课程：COMP3015",
          "评分：5/5"
        ]
      }
    },
    "next": {
      "expectedUserAction": "none",
      "allowedInputs": []
    }
  }
}
```

## 10. 其他 action 的最小 draft 结构

### 10.1 `post_course_teaming`

```json
{
  "courseCode": null,
  "section": "",
  "content": "",
  "contactMethod": ""
}
```

### 10.2 `send_course_chat_message`

```json
{
  "courseCode": null,
  "content": ""
}
```

### 10.3 `create_user_calendar_event`

```json
{
  "title": "",
  "eventType": "custom",
  "eventDate": null,
  "startTime": null,
  "endTime": null,
  "location": "",
  "note": "",
  "courseCode": null
}
```

### 10.4 `write_user_schedule_entry`

```json
{
  "title": "",
  "courseCode": null,
  "dayOfWeek": null,
  "startTime": null,
  "endTime": null,
  "room": "",
  "weekText": ""
}
```

## 11. 前后端职责划分

### 11.1 后端职责

- 识别写操作类型
- 生成/更新 draft
- 计算 `missingFields`
- 生成 `summary`
- 返回 `uiSchema`
- 处理确认、取消、失败重试的状态迁移
- 在最终提交时调用真实工具 adapter

### 11.2 前端职责

- 根据 `actionPayload` 决定渲染方式
- 根据 `uiSchema.surface` 决定是否弹 modal
- 根据 `editableFields` 决定哪些字段可编辑
- 根据 `presets` 渲染推荐文案
- 将用户编辑后的 draft 回传后端
- 不自行推断业务状态

### 11.3 前端禁止事项

- 不要从 `finalAnswer` 解析结构化信息
- 不要硬编码评论评分对应文案
- 不要绕过 `status` 自己决定显示确认还是提交

## 12. 交互流程

### 12.1 评论草稿创建流程

1. 用户输入“帮我发个课程评价”
2. 后端识别 `post_course_review`
3. 后端返回 `actionPayload`
4. 前端看到 `surface = review_modal`
5. 前端弹出评论 modal

### 12.2 评分选择流程

1. 用户选择 4 星或 5 星
2. 前端读取 `presets.ratingToContentTemplates`
3. 前端将其中一条模板写入编辑框初始值
4. 用户可继续手改
5. 前端把更新后的 draft 回传后端

### 12.3 确认提交流程

1. 后端发现 `missingFields = []`
2. 后端切换到 `phase = confirm`
3. 前端渲染确认 modal/card
4. 用户确认
5. 后端调用工具
6. 成功后返回 `status = completed`
7. 前端关闭 modal 或展示成功态

### 12.4 取消流程

1. 用户点击取消或输入取消
2. 后端返回 `status = cancelled`
3. 当前 draft 被清理
4. 前端关闭 modal，并展示取消提示

## 13. 错误处理要求

### 13.1 工具执行失败

要求：

- `phase = result`
- `status = failed`
- `message.tone = error`
- `canCancel = true`
- 如果允许重试，则 `next.allowedInputs` 需要包含 `retry`

### 13.2 不合法字段值

例：

- 评分超出 1 到 5
- 课程代码格式不合法

要求：

- 后端不得静默容错
- 必须返回清晰字段级错误

建议增加字段：

```json
{
  "fieldErrors": {
    "rating": "评分必须在 1 到 5 之间"
  }
}
```

## 14. TypeScript 类型建议

建议最终采用 discriminated union：

- `actionType` 作为判别字段
- 不同 `actionType` 对应不同 `draft` 和 `uiSchema`

最少需要：

- `AgentActionPayload`
- `AgentAction`
- `PostCourseReviewDraft`
- `PostCourseReviewUiSchema`
- `ActionNextStep`

## 15. 测试规格

本章节是必须实现的测试清单。实现者不得自行删减，只能补充。

### 15.1 单元测试

#### UT-001 顶层 contract 结构正确

- Given：Action Agent 返回评论草稿响应
- When：序列化响应对象
- Then：响应中包含 `finalAnswer` 和 `actionPayload`
- And：`actionPayload.type = agent_action`

#### UT-002 评论草稿缺字段时 `missingFields` 正确

- Given：用户输入“帮我发个课程评价”
- When：生成 `post_course_review` draft
- Then：`missingFields` 包含 `courseCode`、`rating`、`content`

#### UT-003 选择评分后带出推荐文案

- Given：评分为 5
- When：构造评论 draft
- Then：`uiSchema.presets.ratingToContentTemplates["5"]` 存在
- And：可选模板至少 1 条

#### UT-004 评论参数齐全后进入确认态

- Given：草稿中 `courseCode`、`rating`、`content` 已齐
- When：生成下一状态
- Then：`phase = confirm`
- And：`status = ready_for_confirmation`
- And：`canConfirm = true`

#### UT-005 成功提交后结果态正确

- Given：工具调用成功
- When：生成结果响应
- Then：`status = completed`
- And：`phase = result`

#### UT-006 取消后状态正确

- Given：用户取消评论草稿
- When：生成结果响应
- Then：`status = cancelled`
- And：当前 pending draft 被清理

#### UT-007 不再依赖自然语言判断状态

- Given：成功响应文案发生变化
- When：运行状态流
- Then：状态迁移不受文案变化影响

#### UT-008 评论 `uiSchema.surface` 正确

- Given：评论草稿场景
- When：生成 `uiSchema`
- Then：`surface = review_modal`

#### UT-009 非评论 action 使用不同 surface

- Given：组队或日历 action
- When：生成 `uiSchema`
- Then：`surface` 不应错误复用 `review_modal`

#### UT-010 `finalAnswer` 与 `message.text` 语义一致

- Given：评论草稿响应
- When：读取 `finalAnswer` 和 `actionPayload.message.text`
- Then：两者不要求完全相同
- But：不能表达相反含义

### 15.2 集成测试

#### IT-001 文本触发评论草稿

- Given：用户输入“帮我发个课程评价”
- When：跑完整 Action Agent 流程
- Then：返回 `post_course_review` draft

#### IT-002 文本补课程代码

- Given：已有评论 draft，缺 `courseCode`
- When：用户输入“COMP3015”
- Then：draft 中 `courseCode = COMP3015`

#### IT-003 文本补评分

- Given：已有评论 draft，缺 `rating`
- When：用户输入“5星”
- Then：draft 中 `rating = 5`

#### IT-004 文本补内容

- Given：已有评论 draft，缺 `content`
- When：用户输入“老师很好”
- Then：draft 中 `content = 老师很好`

#### IT-005 参数齐全后进入确认

- Given：draft 已补齐
- When：运行 follow-up router
- Then：进入确认态，而不是重新走 clarifier

#### IT-006 确认后执行工具

- Given：评论 draft 已就绪
- When：用户确认
- Then：调用 `post_course_review` tool adapter

#### IT-007 取消后不执行工具

- Given：评论 draft 已存在
- When：用户取消
- Then：不调用工具

#### IT-008 提交失败可返回失败态

- Given：工具 adapter 返回失败
- When：提交评论
- Then：响应 `status = failed`
- And：保留必要的重试信息

#### IT-009 旧聊天模式仍能显示

- Given：前端只读取 `finalAnswer`
- When：收到 action draft 响应
- Then：用户仍能看到清晰提示文本

### 15.3 前端集成测试

#### FE-001 识别评论 modal

- Given：收到 `surface = review_modal`
- When：前端渲染
- Then：弹出评论 modal

#### FE-002 评分切换触发模板更新

- Given：用户从 3 星切换到 5 星
- When：前端处理 `presets`
- Then：内容编辑框更新为 5 星推荐模板之一

#### FE-003 用户修改模板后可保留自定义内容

- Given：用户先选模板再手动修改
- When：再次切换界面状态
- Then：不得覆盖用户手工输入，除非用户主动重新选模板

#### FE-004 确认态渲染摘要

- Given：`phase = confirm`
- When：前端渲染
- Then：展示 `summary.lines`

#### FE-005 取消后关闭弹框

- Given：`status = cancelled`
- When：前端处理结果
- Then：关闭当前 modal

### 15.4 端到端测试

#### E2E-001 从一句话到发评论成功

- Given：用户进入聊天页
- When：输入“帮我发个课程评价”
- And：选择 5 星
- And：选择推荐文案
- And：填写课程代码 `COMP3015`
- And：确认提交
- Then：最终成功发出评论

#### E2E-002 从一句话到取消

- Given：用户进入聊天页
- When：输入“帮我发个课程评价”
- And：弹出 modal
- And：点击取消
- Then：不会创建评论

#### E2E-003 提交失败后的可恢复性

- Given：后端提交评论失败
- When：前端收到失败态
- Then：用户可以继续编辑并重试

## 16. 验收口径

实现完成后，必须至少提交以下材料：

- 课程评价的 4 类 JSON 样例：
  - 初次 draft
  - 评分后 draft
  - confirm 态
  - completed 态
- 关键测试运行结果
- 前端交互截图或录屏
- 说明是否仍兼容旧 `finalAnswer` 模式

## 17. 代码审查重点

最终代码审查时将重点检查：

1. contract 是否与本文档一致
2. 字段语义是否清晰稳定
3. 是否真的支持 modal，而不是只多返回了一层 JSON
4. 是否避免让前端解析自然语言
5. 是否为其他 actionType 留出了统一扩展位
6. 是否实现了本章所列测试用例
