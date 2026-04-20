# Plan

## 现状
1. 客户端配置层读取 EXPO_PUBLIC_DEEPSEEK_API_KEY，并通过 DEEPSEEK_ENABLED 控制功能可用性。
2. Agent 主链路在 services/agent/llm.ts 直接请求 DeepSeek。
3. 翻译链路在 services/translate.ts 直接请求 DeepSeek。
4. README.md 与 .env.example 仍引导把密钥放在 EXPO_PUBLIC 环境变量中。

结论：当前是“客户端持钥 + 客户端直连模型”的模式，无法满足移动端密钥保护要求。

## 问题定位
1. 密钥泄露面过大：安装包、抓包、逆向都可获取密钥。
2. 无服务端策略控制：缺少统一限流、模型白名单、错误脱敏。
3. 行为分散：Agent 与翻译各自发请求，不利于统一安全治理。

## 最小可行方案（推荐）
采用 Supabase Edge Function 作为统一 LLM 代理层。

方案要点：
1. 新增 llm_proxy 函数，客户端只调用该函数。
2. 代理函数通过 Authorization Bearer JWT 识别用户身份。
3. 代理函数从服务端环境变量读取 DEEPSEEK_API_KEY。
4. 代理函数仅允许受控模型与受控参数范围。
5. 客户端移除 EXPO_PUBLIC_DEEPSEEK_API_KEY，改为代理可用性开关。

选择理由：
1. 与现有 Supabase Auth 架构天然兼容。
2. 不新增独立网关基础设施，上线最快。
3. 对现有移动端代码改动面小，回滚简单。

## 备选方案
方案 B：复用 backend FastAPI 作为代理。

优点：
1. 可与 OCR 后端部署合并。

缺点：
1. 需要自行实现 Supabase JWT 验证与密钥轮转治理。
2. 部署、监控、跨服务联动复杂度更高。

结论：
优先方案 A（Supabase Edge Function）。FastAPI 作为后续备用，不在首期落地。

## 风险与影响面
1. 代理可用性风险：若函数异常，Agent 与翻译会受影响。
2. 延迟风险：多一跳网络，需观察移动端体验。
3. 鉴权边界风险：必须确保未登录状态无法调用代理。
4. 回归风险：现有单测依赖 EXPO_PUBLIC_DEEPSEEK_API_KEY，需要同步调整。

## 回滚策略
1. 保留旧调用代码一小段过渡窗口但默认关闭，紧急时可通过功能开关快速回退。
2. 出现严重故障时，发布热修复将 Agent/翻译入口降级为“暂不可用提示”，避免泄露 Key。
3. 代理函数可独立回滚，不阻塞客户端版本回退。
