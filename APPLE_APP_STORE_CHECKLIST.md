# Apple 上架前检查清单

适用项目：`HKCampus`

最后更新：`2026-04-01`

状态说明：

- `已完成`：已经由你确认，或可从当前仓库明确确认
- `待完成`：大概率还需要你补材料、补验证、或在 App Store Connect 中完成
- `高风险`：如果不补，很容易卡住 Apple 审核或导致被拒

---

## 已完成

### Apple 账号与构建基础

- [x] 已加入 Apple Developer Program
- [x] 已在 App Store Connect 创建 App
- [x] 已发布 TestFlight 测试版本
- [x] 项目已配置 iOS `bundleIdentifier`：`com.budev.HKCampus`
- [x] 项目已配置 iOS `buildNumber`
- [x] 项目已配置 `appleTeamId`
- [x] 项目已具备 EAS iOS production 构建配置

### App 基础配置

- [x] App 名称已配置：`HKCampus`
- [x] 已配置 iOS 权限文案
- [x] 已声明 `ITSAppUsesNonExemptEncryption: false`
- [x] 已配置图标与启动图

### 代码中已存在的审核相关能力

- [x] 代码中存在账号删除入口逻辑：`[services/auth.ts](/c:/Users/Tim/Documents/GitHub/CampusCopy/services/auth.ts#L116)`
- [x] 代码中存在举报能力：`[services/moderation.ts](/c:/Users/Tim/Documents/GitHub/CampusCopy/services/moderation.ts)`
- [x] 代码中存在屏蔽用户能力：`[services/moderation.ts](/c:/Users/Tim/Documents/GitHub/CampusCopy/services/moderation.ts)`
- [x] 代码中存在隐私政策文档：`[docs/privacy/privacy-policy.html](/c:/Users/Tim/Documents/GitHub/CampusCopy/docs/privacy/privacy-policy.html)`
- [x] 推送通知能力已接入代码：`[services/push_notifications.ts](/c:/Users/Tim/Documents/GitHub/CampusCopy/services/push_notifications.ts)`

### 安全相关已确认项

- [x] 仓库中未发现 `SUPABASE_SERVICE_ROLE_KEY` 明文提交
- [x] Edge Function 使用环境变量读取 `SUPABASE_SERVICE_ROLE_KEY`
- [x] 前端使用的是 Supabase `anon/publishable key`，不是 `service role key`

---

## 高风险

### 1. 账号删除是否真的通过审核标准

- [x] 删除账号逻辑已调整为：`delete_user` RPC 成功后才退出登录，失败时不会假装成功：`[services/auth.ts](/c:/Users/Tim/Documents/GitHub/CampusCopy/services/auth.ts#L116)`
- [x] 删除失败时会明确提示用户仍保持登录：`[app/(tabs)/profile.tsx](/c:/Users/Tim/Documents/GitHub/CampusCopy/app/(tabs)/profile.tsx)`、`[utils/deleteAccountFeedback.ts](/c:/Users/Tim/Documents/GitHub/CampusCopy/utils/deleteAccountFeedback.ts)`
- [x] 删除成功后会明确显示“账号已注销”，便于 Apple 审核员识别：`[app/(tabs)/profile.tsx](/c:/Users/Tim/Documents/GitHub/CampusCopy/app/(tabs)/profile.tsx)`
- [ ] 高风险：如果 Supabase 生产环境没有可用的 `delete_user` RPC，Apple 可能判定“App 内没有真正提供账号删除”
- [ ] 高风险：如果生产库的级联删除或清理策略不符合你的实际预期，审核演示时仍可能暴露问题

建议你优先确认：

- [x] 已在真机上完整走一遍“删除账号 -> 无法重新登录”的关键验证
- [ ] 在生产库中手动验证 `delete_user` RPC 可执行
- [ ] 去 Supabase 检查 `auth.users`、`users`、帖子等关联数据是否按你的预期删除或清理

### 2. 审核员是否能顺利登录

- [ ] 高风险：如果你的注册/登录依赖学校邮箱，审核员可能无法自行完成验证
- [ ] 高风险：如果 `Review Notes` 没有提供测试账号、测试邮箱、OTP 获取方式或白名单说明，容易被拒

建议你优先准备：

- [ ] 一个审核专用测试账号
- [ ] 明确的登录步骤
- [ ] 如果需要 OTP，提供审核员可操作的完整方式

### 3. 隐私政策与 App Store Connect 隐私资料

- [ ] 高风险：虽然仓库里有隐私政策文件，但目前无法仅从仓库确认它已经部署为公网可访问 URL
- [ ] 高风险：如果 App Store Connect 里的 `Privacy Policy URL` 不可访问，审核可能直接卡住
- [ ] 高风险：如果 App Privacy 标签填写与实际数据收集不一致，容易被打回

建议你优先确认：

- [ ] 隐私政策网页已部署到公网
- [ ] App Store Connect 已填写正确的 `Privacy Policy URL`
- [ ] App Privacy 问卷已覆盖邮箱、资料、图片、位置、消息、通知等实际数据使用

### 4. UGC 社区治理闭环

- [ ] 高风险：虽然代码里有举报和屏蔽，但如果审核员看不到明确入口或无法确认处理机制，仍可能认为治理不足
- [ ] 高风险：如果没有对外支持邮箱/支持页面，社区类 App 处理申诉与举报的可信度不足

建议你优先确认：

- [ ] 举报入口在实际 UI 中可见、可操作
- [ ] 屏蔽功能在实际 UI 中可见、可操作
- [ ] 你有实际处理举报的后台或人工流程
- [ ] App Store Connect 里填写了 `Support URL`

---

## 待完成

### App Store Connect 元数据

- [ ] 准备并填写副标题
- [ ] 准备并填写关键词
- [ ] 准备并填写描述
- [ ] 准备并填写宣传文案
- [ ] 准备并填写 `Support URL`
- [ ] 如有官网，准备并填写 `Marketing URL`
- [ ] 准备并填写版权信息
- [ ] 完成年龄分级与内容说明

### 截图与素材

- [ ] 准备 iPhone 截图
- [ ] 如果要上 iPad，准备 iPad 截图
- [ ] 如有需要，准备 App Preview 视频

建议截图至少覆盖：

- [ ] 首页/校园功能
- [ ] 课程或地图功能
- [ ] 社区/论坛功能
- [ ] 消息或通知功能
- [ ] 个人中心/设置功能

### 权限与真机验证

- [ ] 验证相册权限请求时机和行为
- [ ] 验证相机权限请求时机和行为
- [ ] 验证定位权限请求时机和行为
- [ ] 验证 Face ID 权限相关流程
- [ ] 验证权限被拒绝后 app 不会崩溃

### 推送与设备能力

- [ ] 在 TestFlight 真机上完整验证推送通知
- [ ] 验证关闭通知后的降级体验
- [ ] 验证图片上传在真机上稳定可用
- [ ] 验证地图定位在授权/未授权两种状态下都正常

### 稳定性与提审质量

- [ ] 真机完整验证核心流程：登录、发帖、评论、私信、上传、通知、地图、课程
- [ ] 弱网环境下验证无白屏、无卡死
- [ ] 检查未登录/已登录切换
- [ ] 检查不同 iPhone 尺寸适配
- [ ] 如果支持 iPad，检查 iPad 布局
- [ ] 排查调试文案、占位页面、测试入口
- [ ] 提交前跑一轮基础测试

### Supabase 与数据安全

- [ ] 复核生产环境 Supabase 关键表的 RLS
- [ ] 复核消息、用户资料、帖子、通知、上传相关表的访问策略
- [ ] 确认 `anon key` 暴露不会造成越权读取或写入
- [ ] 确认生产环境变量与本地环境变量分离

### 审核材料

- [ ] 写好 `Review Notes`
- [ ] 写清测试账号
- [ ] 写清测试步骤
- [x] 写清账号删除入口位置：`Profile -> Delete Account`
- [ ] 如果某些功能依赖学校邮箱、地区或白名单，在备注中说明
- [ ] 写清支持联系方式

---

## 建议你现在先做的 7 件事

1. 去 Supabase 再确认一次生产环境账号删除真的成功，不只是无法重新登录。
2. 检查 `auth.users`、`users`、帖子等关联数据的最终状态是否符合你的设计。
3. 准备一个审核员可以直接登录的测试账号或完整 OTP 流程。
4. 把隐私政策部署到公网，并填入 App Store Connect。
5. 填好 `Support URL`、描述、关键词、截图。
6. 在 TestFlight 真机上完整回归推送、上传、定位、消息等流程。
7. 写好 `Review Notes`，让审核员第一次打开就能走通。

---

## 建议审核备注模板

```md
Thank you for reviewing HKCampus.

Test account:
- Email: [your review account]
- Password / OTP instructions: [fill in]

Notes:
- This app is designed for campus users.
- If a school email or special access is required, please use the test account above.
- Account deletion is available in: Profile -> Delete Account
- After successful deletion, the app shows a clear account deleted confirmation and returns to the login screen.
- Privacy Policy: [your public URL]
- Support: [your support URL or email]
```

---

## 我基于当前信息的判断

你现在已经过了“能不能发包”的阶段，真正影响正式上架的，不是 EAS 或 Apple 开发者账号，而是：

- 账号删除是否能通过审核验证
- 审核员是否能顺利登录
- 隐私政策与 App Privacy 是否填完整
- 社区治理与支持渠道是否足够清楚

其中“账号删除”这一块，你现在已经补上了最关键的一层审核可见性：

- 删除成功后会明确显示“账号已注销”
- 删除失败时不会假装成功，还会明确提示用户仍保持登录

下一步最值得继续补的是生产库数据检查和审核账号准备。
