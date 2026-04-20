# Task

## 背景
当前客户端仍直接持有 DeepSeek API Key，并在前端请求中直接发送 Authorization Header。这会导致密钥被打包进客户端，可被逆向提取，属于最高优先级安全隐患。

已确认的相关位置：
- services/agent/config.ts 读取 EXPO_PUBLIC_DEEPSEEK_API_KEY
- services/agent/llm.ts 直接向 DeepSeek 发请求并携带 Bearer Key
- services/translate.ts 直接向 DeepSeek 发请求并携带 Bearer Key
- README.md 与 .env.example 引导客户端配置 EXPO_PUBLIC_DEEPSEEK_API_KEY

## 目标
1. 客户端不再持有 DeepSeek API Key。
2. 客户端仅使用 Supabase Auth JWT 调用后端代理。
3. 代理端持有并使用 DEEPSEEK_API_KEY。
4. 保持现有 Agent 与翻译功能可用，减少行为回归。
5. 保持改动最小、可快速上线、可快速回滚。

## 非目标
1. 不在本任务中重构 Agent 路由策略、提示词或业务流程。
2. 不在本任务中做向量检索、缓存系统或模型切换平台改造。
3. 不在本任务中新增复杂计费系统。
4. 不在本任务中重写 OCR 后端链路。

## 输入条件
1. 现有 Supabase 项目与登录体系可用。
2. 客户端已集成 Supabase SDK，并能获取当前会话。
3. 可在 Supabase Edge Functions 配置服务端环境变量。

## 输出结果
1. 新增一个受 JWT 保护的 LLM 代理函数（Supabase Edge Function）。
2. Agent 与翻译调用全部改为走代理函数。
3. 客户端配置中移除 EXPO_PUBLIC_DEEPSEEK_API_KEY 依赖。
4. 文档与 .env.example 更新为“服务端持钥”模式。
5. 补齐最小回归测试与手工验收步骤。

## 关键假设
1. 代理第一期支持非流式完成；流式可作为第二期增强。
2. 业务端允许在代理不可用时返回友好错误，而不是回退到客户端直连。
3. 现有 Supabase Auth JWT 可用于代理鉴权。

## 约束条件
1. 优先最小改动路径，不扩大范围。
2. 禁止将任何第三方模型密钥重新放回客户端。
3. 错误处理必须避免把上游完整错误与敏感信息透传给客户端。
4. 必须保留可回滚路径（功能开关或版本回退）。
