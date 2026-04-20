# Handoff

## 任务说明
将客户端直连 DeepSeek 改造为 Supabase Edge Function 代理模式。
目标是消除客户端持钥风险，同时保持 Agent 与翻译功能可用。

## 实施顺序

### 步骤 1：搭建代理函数
完成标志：
1. 新增 llm_proxy 函数可在本地或 Supabase 环境运行。
2. 函数能校验 JWT 并在通过后请求 DeepSeek。
3. 函数能返回与现有客户端兼容的数据结构。

### 步骤 2：客户端接入代理
完成标志：
1. llm.ts 与 translate.ts 均不再直连 DeepSeek。
2. 全部模型请求通过 proxy_client 统一出口。
3. 401/429/5xx 错误能映射到可读提示。

### 步骤 3：配置迁移与文档更新
完成标志：
1. .env.example 不再要求 EXPO_PUBLIC_DEEPSEEK_API_KEY。
2. README 改为服务端持钥说明。
3. 本地开发与部署文档可复现代理链路。

### 步骤 4：测试与验收
完成标志：
1. 关键单测通过。
2. Agent 与翻译手工回归通过。
3. 未登录鉴权拦截验证通过。

## 必跑命令
1. npm test -- __tests__/services/agent/llm.test.ts
2. npm test -- __tests__/services/agent/executor.test.ts
3. npm test -- __tests__/services/agent/memory_extractor.test.ts
4. 如新增翻译测试：npm test -- __tests__/services/translate.test.ts

## 必做验证
1. 代码全局搜索确认不存在客户端发送 DeepSeek Bearer Key 的逻辑。
2. 代理请求日志可看到 user_id 或等价主体信息。
3. 深色路径（上游失败、超时、限流）可稳定返回并可读。

## 不允许做的事
1. 不允许把 DEEPSEEK_API_KEY 改名后继续放在 EXPO_PUBLIC 前缀。
2. 不允许顺手重构无关业务模块。
3. 不允许为了通过测试而删除关键鉴权或错误处理逻辑。

## 不确定时的决策原则
1. 优先最小偏离。
2. 优先保持兼容。
3. 优先缩小范围。
4. 优先保守落地。

## 最终交付物清单
1. 代理函数代码与配置。
2. 客户端代理调用改造。
3. 配置与文档迁移。
4. 单测与手工验收记录。
