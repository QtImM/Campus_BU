# Apple Guideline 1.2 整改清单

最后更新：2026-04-07

主要依据：
- Apple App Review Guidelines 1.2 User-Generated Content: https://developer.apple.com/app-store/review/guidelines/#1.2

文档目的：
- 本文档用于严格对照 Apple Guideline 1.2，对 HKCampus 的用户生成内容能力进行整改、验收与提交流程约束。
- 目标是解决当前的拒审问题，并尽可能降低再次因 1.2 被拒的风险。
- 本文档不能绝对保证过审。最终是否通过，仍取决于你实际提交的版本、线上后端行为、审核员是否能顺利看到入口，以及 Review Notes 和真机录屏是否完整。

---

## 1. Apple 1.2 的官方要求

Apple 对带有用户生成内容或社交服务的 App 要求至少具备以下能力：

1. 必须有机制，过滤不当内容，防止其被发布到 App 中。
2. 必须有机制，允许用户举报冒犯性内容，并且开发者要及时响应。
3. 必须允许用户屏蔽 abusive users。
4. 必须公开联系信息，方便用户联系开发者。

你这次收到的拒审补充要求还明确提出：

1. 用户在访问 UGC 之前，必须先同意条款或 EULA。
2. 条款中必须明确写出，对 objectionable content 和 abusive users 零容忍。
3. 屏蔽 abusive user 后，应立即把该用户内容从当前用户 feed 中移除，并通知开发者。
4. 开发者必须在 24 小时内处理举报，包括删除违规内容并移除违规用户。
5. 重新提交时，必须附上真机录屏，演示：
   - 用户在访问 UGC 前看到并同意条款
   - 举报机制
   - 屏蔽用户机制

---

## 2. HKCampus 的整改范围

这份清单适用于 App 内所有 UGC 场景，而不是只适用于某一个 feed：

- 校园帖子
- 帖子评论与回复
- Forum 帖子
- Forum 评论与回复
- 教师评价
- 课程评价
- 课程聊天室 / 房间消息
- 私信
- 未来新增的匿名内容、社区内容、用户发表内容

只要其中任何一个 UGC 场景绕过了 moderation，Apple 都可能再次拒审。

---

## 3. 必须具备的产品能力

### 3.1 UGC 访问前的条款 / EULA 同意

必须达到的结果：
- 用户在访问任何 UGC 之前，必须先同意社区条款。

实现要求：
- 不能只在 `campus` tab 弹一次。
- 所有能访问 UGC 的入口都要被拦住，或者在全局首次进入 UGC 前统一拦截。
- 最好把同意状态按用户存到后端。
- 不能只依赖本地存储作为唯一依据。

条款中必须明确写出：
- 对骚扰、仇恨言论、色情内容、霸凌、威胁、诈骗、垃圾内容、违法内容零容忍。
- 用户可能被举报、屏蔽、暂停使用，或永久封禁。
- 违规内容可能在不事先通知的情况下被移除。
- 举报会在 24 小时内审核。
- 提供用于 moderation / support 的联系渠道。

验收标准：
- 新账号在未同意条款前，不能访问任何 UGC。
- 审核员在真机上能清楚看到条款页面。
- 条款页面后续也能在设置 / 个人中心 / legal 页面中找到。

### 3.2 不当内容过滤

必须达到的结果：
- App 不仅要在用户举报后处理内容，还必须在内容发布前就阻止明显违规内容。

最低可接受实现：
- 文本敏感词过滤，提交前拦截。
- 服务端写入前再做一次校验。
- 至少拦截这些类别：
  - 色情 / 淫秽 / 招嫖类内容
  - 仇恨言论
  - 暴力威胁
  - 针对个人的辱骂、骚扰、霸凌
  - 垃圾广告、诈骗、引流滥用
- 被拦截时要返回明确的提示文案。

强烈建议：
- 图片审核。
- 发帖 / 发消息频率限制，防止 spam。
- 高风险链接识别或域名限制。
- 对匿名内容做额外规则控制。

不能接受的做法：
- 只有客户端过滤，没有服务端校验。
- 只有人工审核，没有前置过滤。
- 只写“请文明发言”之类文案，但没有实际机制。

验收标准：
- 即使绕过前端，也无法通过接口提交明显违规文本。
- 所有 UGC 创建入口都执行同一套服务端 moderation 规则。
- 过滤事件有日志记录，便于审计与调整。

### 3.3 举报机制

必须达到的结果：
- 用户可以从每一个 UGC 场景中举报 offensive content。

实现要求：
- 每个内容项都要有明显、可操作的举报入口。
- 举报原因至少应包含：
  - 垃圾内容
  - 骚扰 / 霸凌
  - 仇恨 / 歧视
  - 色情内容
  - 暴力 / 威胁
  - 诈骗 / 欺诈
  - 其他
- 建议支持填写补充说明。
- 举报必须落到后端，形成可追踪记录。

举报记录至少应包含：
- reporter_user_id
- target_type
- target_id
- target_author_id
- reason
- details
- status
- created_at
- reviewed_at
- reviewed_by
- resolution

验收标准：
- 所有 UGC 场景都能创建举报。
- 举报失败时要有明确错误提示。
- 举报创建后，后台审核队列能立刻看到该记录。

### 3.4 屏蔽 abusive users

必须达到的结果：
- 用户可以在所有相关场景中屏蔽 abusive users。

实现要求：
- 屏蔽入口必须出现在：
  - 用户主页
  - 带作者信息的内容操作菜单
  - 私信 / 会话场景
- 屏蔽必须立即生效。
- 屏蔽后：
  - 对方内容从当前用户 feed 中立即消失
  - 对方评论 / 回复被隐藏
  - 私信不能继续触达或至少在当前用户侧被隐藏
  - 后续请求不再返回该用户内容

Apple 这次拒审特别强调：
- 屏蔽 abusive user 时，也应通知开发者，以便进行审核跟进。

因此服务端至少要做到：
- 创建 `user_blocks` 记录
- 创建 moderation event 或类似报告记录
- 触发当前页刷新，或在前端做 optimistic removal

验收标准：
- 用户点击屏蔽后，当前页面立刻看不到对方内容。
- 重新打开 App 后，对方内容不会再次出现。
- 所有 feed / list / detail 接口对 blocker 都能稳定过滤被屏蔽用户。

### 3.5 举报处理与 24 小时 SLA

必须达到的结果：
- 开发者必须真的具备在 24 小时内处理举报的能力，而不是只写在文案里。

必须具备的运营能力：
- 管理员或审核后台能够：
  - 查看待处理举报
  - 查看被举报内容
  - 删除 / 隐藏违规内容
  - 暂停 / 封禁违规用户
  - 记录处理结果
  - 记录处理时间

必须具备的规则：
- 所有举报在 24 小时内审核。
- 严重违规内容可先隐藏再审核。
- 多次违规用户必须支持暂停或永久封禁。

Apple 可能隐性期待的证据：
- 你们确实有审核操作面板或流程。
- Review Notes 里对 moderation 处理流程的描述是真实可执行的。

验收标准：
- 每一条举报都能从创建一路追踪到处理结果。
- 不能靠手动去数据库表里查数据当作正式审核流程。
- 所有审核动作都有审计记录。

### 3.6 公开联系信息

必须达到的结果：
- 用户可以轻松联系开发者反馈 moderation / safety 问题。

必须展示的位置：
- App 内：Help & Support 或 Legal 页面
- 公开的 Support URL
- Privacy Policy 或 Legal 页面

必须包含：
- 可用的 support email
- support page URL
- moderation 相关联系路径

验收标准：
- 联系方式无需特殊权限即可查看。
- 公开链接是 HTTPS 可访问页面。
- App Store Connect 中的 Support URL 与线上页面一致。

---

## 4. 本项目必须补的技术改造

### 4.1 数据库 / 后端

需要新增或确认存在以下数据结构与权限：

- `reports`
- `user_blocks`
- `user_bans` 或用户表中的封禁状态
- `moderation_actions` 或等价的审核审计表

建议的 `reports` 字段：
- `id`
- `reporter_id`
- `target_type`
- `target_id`
- `target_author_id`
- `reason`
- `details`
- `status`，例如 `pending`、`under_review`、`resolved`、`dismissed`
- `resolution`
- `reviewed_by`
- `created_at`
- `reviewed_at`

建议的 `user_blocks` 字段：
- `id`
- `blocker_id`
- `blocked_id`
- `created_at`
- 唯一约束 `(blocker_id, blocked_id)`

建议的 `user_bans` 字段：
- `user_id`
- `status`
- `reason`
- `created_at`
- `expires_at`
- `created_by`

必须满足的后端规则：
- 普通用户不能伪造 moderation resolution。
- 只有管理员 / 审核员能处理举报、封禁用户。
- 所有内容查询在适用场景下都应过滤 blocked users。
- 所有内容写入接口都要经过服务端内容过滤。

### 4.2 路由与访问控制

需要实现统一的 UGC gate，用于拦截：
- campus feed
- forum
- teacher review 页面
- course/community chat
- direct messages

不能继续把“是否已同意条款”只挂在单个 tab 页面上。

### 4.3 统一的 UGC 操作层

建议统一成共享动作组件或共享 hook，让所有 UGC 类型都支持：
- 举报
- 屏蔽用户
- 可选复制
- 可选私信

当前必须消除的风险：
- 有的页面只有举报
- 有的页面只有屏蔽
- 有的页面没有 moderation 入口

### 4.4 Feed 与详情过滤

blocked users 的过滤必须覆盖：
- 列表查询
- 详情查询
- 评论 / 回复查询
- 私信 / 会话查询
- 搜索结果
- 必要时也包括通知

不能只在渲染层简单隐藏。
必须在数据查询层也做过滤。

### 4.5 管理员审核工具

最低可接受实现：
- App 内隐藏管理员页面，或一个受保护的 web/admin 工具

至少支持：
- 查看待处理举报
- 查看被举报内容
- 删除违规内容
- 封禁 / 暂停用户
- 保存处理结果

---

## 5. 对照 Apple 要求的完成定义

### 要求 A：过滤 objectionable material，防止被发布

只有同时满足以下条件，才算完成：
- 有客户端提交前过滤
- 有服务端写入前校验
- 即使绕过前端，也不能把明显违规内容存进数据库

### 要求 B：用户可举报 offensive content，且开发者及时响应

只有同时满足以下条件，才算完成：
- 所有 UGC 场景都有举报入口
- 举报能写入后端
- 管理员能处理举报
- 24 小时审核流程真实可执行

### 要求 C：用户可屏蔽 abusive users

只有同时满足以下条件，才算完成：
- 所有相关 UGC 场景都有屏蔽入口
- 屏蔽会持久化到后端
- 内容会立即消失
- 刷新后仍持续过滤
- 开发者能收到后续审核线索

### 要求 D：公开联系信息

只有同时满足以下条件，才算完成：
- App 内可见 support email
- 公网 support 页面可访问
- App Store Connect 的 Support URL 已更新

### 审核员特别关注：访问 UGC 前先同意条款

只有同时满足以下条件，才算完成：
- 新账号访问任何 UGC 前都能看到条款
- 审核员可在真机上复现
- 条款中明确写了零容忍政策

---

## 6. 重新提交时的真机录屏清单

必须用真实 iPhone 录制：

1. 启动 App，使用新账号或全新安装环境。
2. 打开一个 UGC 页面，展示 Terms / EULA gate。
3. 同意条款。
4. 打开一条帖子 / 评论 / 评价的操作菜单，展示“举报”。
5. 完成一次举报。
6. 打开用户相关操作菜单，展示“屏蔽用户”。
7. 确认屏蔽。
8. 展示被屏蔽用户的内容立刻从当前页面消失。
9. 可选展示 Help & Support / 联系方式页面。

录屏要求：
- 不能用模拟器
- 不要剪掉关键步骤
- 点击路径必须清楚

---

## 7. App Review 回复模板

实现完成后，可在 App Store Connect 中使用下列回复模板：

```text
Hello App Review Team,

Thank you for your feedback regarding Guideline 1.2.

We have updated HKCampus to strengthen protections for user-generated content:

1. Users must accept our Terms of Use before accessing user-generated content.
2. The Terms clearly state that objectionable content and abusive behavior are not tolerated.
3. We implemented content filtering to prevent objectionable material from being posted.
4. Users can report offensive content directly from the relevant content action menus.
5. Users can block abusive users, and blocked users' content is removed from the blocking user's experience immediately.
6. Our moderation workflow allows us to review reports within 24 hours and remove offending content and accounts when necessary.
7. Support contact information is published both in the app and on our public support page.

A physical-device screen recording has been included showing:
- Terms acceptance before accessing user-generated content
- The reporting flow
- The blocking flow

If you need any additional information, we are happy to provide it.
```

---

## 8. 项目改造任务分级

### P0：必须在重新提交前完成

- 增加 `reports` 与 `user_blocks` 的后端 migration。
- 增加管理员审核处理能力。
- 为所有 UGC 写入路径增加服务端内容过滤。
- 把所有 UGC 入口统一接入条款同意 gate。
- 给所有 UGC 入口补齐“屏蔽用户”。
- 确保屏蔽后内容立即消失，且刷新后不会回来。
- 确认 App 内 support email 与 support URL 可见。
- 录制真机演示视频。

### P1：强烈建议在重新提交前完成

- 增加图片审核。
- 增加重复违规用户封禁能力。
- 增加 block/report 后的开发者通知流程。
- 增加 blocked-user filtering 与 report creation 的测试。

### P2：后续加固

- 增加举报量与审核 SLA 统计。
- 增加自动 spam/rate-limit 控制。
- 增加审核备注与申诉流程。

---

## 9. 最终提交前的 Release Gate

只有下面所有条件都满足，才建议重新提交：

- 所有 UGC 页面都能先经过条款同意 gate。
- 不当内容在存储前就能被过滤。
- 所有 UGC 页面都能举报。
- 所有相关 UGC 页面都能屏蔽用户。
- 被屏蔽用户内容会立即消失，刷新后仍保持隐藏。
- 管理员能在 24 小时内查看并处理举报。
- 违规用户能被暂停或封禁。
- App 内和公网都能看到支持联系方式。
- App Review Notes 已更新。
- 真机录屏已上传。

如果上面任意一项未完成，当前版本依然存在再次因 Guideline 1.2 被拒的实质风险。
