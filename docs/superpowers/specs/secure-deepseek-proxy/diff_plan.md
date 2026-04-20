# Diff Plan

## 变更范围

### 1) 新增 Supabase 代理函数
文件：
- supabase/functions/llm_proxy/index.ts
- supabase/functions/llm_proxy/deno.json

修改目的：
- 提供统一、受 JWT 保护的模型代理入口。

具体改动点：
1. 接收请求体（messages、model、temperature、stream、max_tokens、task_type）。
2. 读取 Authorization Header 并验证 JWT。
3. 校验参数白名单与上限（模型名、max_tokens、temperature）。
4. 使用服务端 DEEPSEEK_API_KEY 调用 DeepSeek。
5. 返回标准化响应与脱敏错误。
6. 增加基础限流钩子（按 user_id + 时间窗口）。

兼容性要求：
- 响应结构保持与现有客户端解析兼容（choices[0].message.content）。

数据结构/接口/状态流变化：
- 接口变化：客户端模型调用 URL 从 DeepSeek 改为 Supabase 函数。
- 数据结构：不变（客户端消费字段保持一致）。
- 状态流：不变（业务状态仍由现有页面与服务管理）。

### 2) 客户端模型调用统一收口
文件：
- services/agent/llm.ts
- services/translate.ts
- 新增 services/agent/proxy_client.ts（统一代理调用封装）

修改目的：
- 去掉客户端直连 DeepSeek，统一改为调用代理。

具体改动点：
1. 在 proxy_client.ts 中封装 invokeLlmProxy。
2. llm.ts 所有 callDeepSeek / callDeepSeekStream 内部切换为代理调用。
3. translate.ts 切换到代理调用，不再拼接 DeepSeek URL 与 Authorization。
4. 对 401/403/429/5xx 做统一错误映射，前端展示可读提示。

兼容性要求：
- 对上层调用签名保持不变，避免影响 executor、summarizer、memory_extractor 等调用点。

数据结构/接口/状态流变化：
- 数据结构：不变。
- 接口：内部调用目标变化。
- 状态流：不变。

### 3) 配置迁移
文件：
- services/agent/config.ts
- .env.example
- README.md
- 可选：app.config.ts（如需暴露代理基地址）

修改目的：
- 从“客户端持钥”切换为“服务端持钥”。

具体改动点：
1. 删除或废弃 EXPO_PUBLIC_DEEPSEEK_API_KEY 读取。
2. 新增代理开关与代理配置（例如 AGENT_PROXY_ENABLED）。
3. README 与 .env.example 改为说明 DEEPSEEK_API_KEY 仅在服务端配置。
4. 标注迁移步骤与常见故障排查。

兼容性要求：
- 不影响 Supabase 登录与现有业务配置。

数据结构/接口/状态流变化：
- 不变。

### 4) UI 可用性开关与回归
文件：
- components/common/TranslatableText.tsx
- __tests__/services/agent/llm.test.ts
- 视需要补充 __tests__/services/translate.test.ts

修改目的：
- 保证代理模式下功能可见性与测试稳定。

具体改动点：
1. 将翻译按钮显示条件从“客户端是否有 Key”改为“代理能力是否可用”。
2. 调整 llm 单测，改为 mock 代理层而非注入 EXPO_PUBLIC_DEEPSEEK_API_KEY。
3. 新增代理异常路径测试（401/429/500）。

兼容性要求：
- 不改变页面交互文案与已有组件接口。

数据结构/接口/状态流变化：
- 不变。

## 禁止改动文件
1. 与本任务无关的论坛、课程、地图、消息业务模块。
2. 后端 OCR 识别核心逻辑（backend/schedule_ocr_ai.py 等）。
3. 数据库 schema 与迁移文件（除非实现阶段发现代理日志必须落库，并经确认）。
