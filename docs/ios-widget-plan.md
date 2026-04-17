# iOS WidgetKit 课表小组件实现计划

## Context

用户希望为 HKCampus 添加 iOS 桌面小组件，显示课表信息。项目是纯 Expo SDK 54 managed workflow，无任何 iOS 原生代码。需要通过 Expo Config Plugin 在 prebuild 时注入 WidgetKit 扩展。

**小组件功能：**
- **小尺寸**：显示下一节课（课名、时间、教室）
- **中尺寸**：显示今日完整课表列表

**数据来源**：Supabase `user_schedule_entries` 表，通过 `getUserScheduleEntries(userId)` 获取。

---

## 架构

```
React Native App                          iOS Widget Extension
┌─────────────────────┐                   ┌─────────────────────────┐
│ MyScheduleCard      │                   │ ScheduleWidget          │
│ → loadEntries()     │   App Groups      │ → TimelineProvider      │
│ → writeToWidget()   │ ──SharedDefaults──│ → 读取 JSON             │
│   (JSON写入)        │                   │ → SmallView / MediumView│
└─────────────────────┘                   └─────────────────────────┘
```

App Group: `group.com.budev.HKCampus`

---

## 实现步骤

### 1. 安装依赖

```bash
npm install react-native-shared-group-preferences
```

用于 RN 侧写入 App Group UserDefaults。

### 2. 创建 `services/widgetBridge.ts`（新文件）

RN 侧数据桥接，将课表 JSON 写入共享 UserDefaults：

- 函数 `writeScheduleToWidget(entries: UserScheduleEntry[]): Promise<void>`
- 仅 iOS 执行，Android 静默跳过
- 写入 key: `hkcampus_schedule_entries`，value: JSON 数组
- 字段：`id, title, courseCode, room, dayOfWeek, startTime, endTime, startPeriod, endPeriod`

### 3. 修改 `components/profile/MyScheduleCard.tsx`

在 `loadEntries()` 成功后调用 `writeScheduleToWidget(data)`，同步数据到 widget。

### 4. 创建 Swift Widget 代码（`targets/ScheduleWidget/`）

| 文件 | 职责 |
|------|------|
| `ScheduleWidgetProvider.swift` | TimelineProvider：读取 UserDefaults JSON，解析为今日课表和下一节课 |
| `ScheduleWidgetViews.swift` | SwiftUI 视图：SmallWidgetView（下一节课）、MediumWidgetView（今日列表） |
| `ScheduleWidget.swift` | Widget 入口 + Bundle，支持 `.systemSmall` 和 `.systemMedium` |
| `Info.plist` | Widget Extension 配置 |

**关键逻辑：**
- `dayOfWeek` 转换：Swift Calendar weekday (1=Sun) → App 格式 (1=Mon)
- 下一节课查找：先查今日剩余，再查后续天
- Timeline 刷新策略：午夜或 30 分钟后

### 5. 创建 Expo Config Plugin（`plugins/withScheduleWidget.ts`）

prebuild 时自动完成：
1. 主 App 添加 `com.apple.security.application-groups` entitlement
2. 复制 Swift 文件到 `ios/ScheduleWidget/`
3. 在 pbxproj 中添加 Widget Extension target（bundle ID: `com.budev.HKCampus.ScheduleWidget`）
4. 设置 build settings（Swift 版本、部署目标、签名团队）
5. 添加 target 依赖和 Embed App Extensions 构建阶段
6. 创建 widget 的 `.entitlements` 文件

### 6. 注册 Plugin

在 `app.json` 的 `plugins` 数组中添加 `"./plugins/withScheduleWidget"`。

---

## 新建/修改文件清单

| 序号 | 文件 | 操作 |
|------|------|------|
| 1 | `services/widgetBridge.ts` | 新建 |
| 2 | `components/profile/MyScheduleCard.tsx` | 修改（loadEntries 中加一行） |
| 3 | `targets/ScheduleWidget/ScheduleWidgetProvider.swift` | 新建 |
| 4 | `targets/ScheduleWidget/ScheduleWidgetViews.swift` | 新建 |
| 5 | `targets/ScheduleWidget/ScheduleWidget.swift` | 新建 |
| 6 | `targets/ScheduleWidget/Info.plist` | 新建 |
| 7 | `plugins/withScheduleWidget.ts` | 新建 |
| 8 | `app.json` | 修改（添加 plugin） |
| 9 | `package.json` | 修改（添加依赖） |

---

## 验证方式

1. `npx expo prebuild --platform ios --clean` → 检查 `ios/` 目录生成了 `ScheduleWidget` target
2. 打开 `ios/HKCampus.xcworkspace` → 确认 Widget target 存在且编译通过
3. 模拟器运行 → 长按桌面添加 HKCampus 小组件
4. 在 App 内课表页面查看/编辑课表 → 返回桌面确认 widget 数据更新
5. EAS Build 测试：`eas build --platform ios --profile development`

---

## 注意事项

- **数据时效性**：widget 只能读取 App 最后写入的数据，不会自行联网。用户需打开 App 才能同步最新课表。
- **签名**：需在 Apple Developer Portal 为主 App 和 Widget Extension 都启用 App Groups capability。
- **`react-native-shared-group-preferences` + New Arch**：需确认兼容 `newArchEnabled: true`，不兼容则改用 `expo-modules-core` 自写桥接模块。
