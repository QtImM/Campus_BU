# HKCampus Agent Constraints

## Production-First Rule

所有涉及 `Expo` / `React Native` / `agent runtime` / `LLM` / `tool calling` / `polyfill` / `runtime dependency` 的改动，必须优先考虑 **EAS production build + Hermes** 的真实运行环境，不能只根据 Expo 本地开发模式是否可运行来判断方案可行。

## Mandatory Checks

在设计或修改方案时，agent 必须同时检查：

1. 该实现是否依赖 Node.js-only API。
2. 该实现是否依赖仅在 Metro / 开发模式下可用的 polyfill。
3. 该实现是否会在 Hermes 正式版中触发运行时崩溃、unhandled rejection 或初始化失败。
4. 该实现是否把仅用于开发或对比验证的依赖错误地留在生产运行路径中。

## Forbidden Assumptions

agent 不得做出以下假设：

- “本地 Expo 跑通了，所以正式版也没问题”
- “开发模式有 polyfill，生产模式应该也有”
- “只要代码没有 TypeScript 报错，就可以进入生产路径”

## Runtime Safety Rules

1. 生产主路径不得依赖 `async_hooks`、`AsyncLocalStorage` 或其他 Hermes / React Native 正式版不可用的 Node.js API。
2. 新增 agent 能力时，必须明确区分：
   - 生产主路径
   - fallback 路径
   - 仅开发/测试使用的路径
3. 如果某个运行时方案存在正式版兼容性风险，必须提供 feature flag、fallback 或隔离策略，不能直接替换生产主路径。
4. 对 `@langchain/*`、Node polyfill、动态 import、运行时注入等高风险依赖，默认按“生产不安全”处理，除非已经明确验证可用于 EAS/Hermes。

## Review Standard

凡是 agent 相关改动，在验收、评审或实现说明中，必须单独回答下面的问题：

- 这个方案在 EAS production build 中是否安全？
- 是否存在 Expo 开发模式可运行、但 Hermes 正式版会失败的差异？
- 是否已经把高风险依赖从生产主路径移除或隔离？

如果以上问题不能明确回答，默认视为 **不能直接进入生产路径**。
