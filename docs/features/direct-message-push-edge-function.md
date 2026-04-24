# 私信服务端推送事件触发方案

本文说明如何为私信增加服务端推送：即使 App 没有启动，只要别人给用户发送私信并成功写入数据库，接收者也能收到系统通知弹窗。

## 1. 目标行为

最终行为：

- 发送方成功写入 `public.direct_messages` 后，服务端自动触发推送。
- 接收方 App 未启动、在后台、或被系统杀掉时，也能收到系统通知。
- 推送弹窗只显示发送者，不显示消息正文。
- 用户点击推送后进入与发送者的私信页面。
- 不把私信推送混入普通 `notifications` 列表。
- 重复触发时不会重复推送同一条消息。

推送展示：

```text
标题：发送者昵称
内容：给你发来一条新消息
```

推送 data：

```json
{
  "type": "direct_message",
  "senderId": "发送者 user id",
  "conversationId": "conversation id",
  "messageId": "message id"
}
```

点击后跳转：

```text
/messages/[senderId]
```

## 2. 推荐架构

推荐使用私信专用 Edge Function，而不是复用 `notifications` 表。

```text
public.direct_messages insert
  -> Postgres trigger
  -> pg_net 调用 send_direct_message_push Edge Function
  -> Edge Function 查发送者资料和接收者 push token
  -> 调 Expo Push API
  -> 写入 direct_message_push_deliveries 去重记录
```

推荐这个架构的原因：

- 私信是高频事件，不适合塞进普通通知列表。
- 私信已有自己的 unread count 和消息页。
- 专用 Edge Function 更容易处理跳转、免打扰、拉黑、去重和隐私策略。
- 服务端以数据库 insert 为事件源，比客户端主动调用更可靠。

## 3. 数据库去重表

创建 `direct_message_push_deliveries`，用 `message_id` 保证同一条消息只推送一次。

```sql
create table if not exists public.direct_message_push_deliveries (
  message_id uuid primary key references public.direct_messages(id) on delete cascade,
  receiver_id uuid not null references auth.users(id) on delete cascade,
  sent_at timestamptz not null default now(),
  expo_response jsonb
);
```

建议索引：

```sql
create index if not exists direct_message_push_deliveries_receiver_idx
  on public.direct_message_push_deliveries (receiver_id, sent_at desc);
```

## 4. 新建 Edge Function

在项目根目录执行：

```bash
supabase functions new send_direct_message_push
```

生成文件：

```text
supabase/functions/send_direct_message_push/index.ts
```

## 5. Edge Function 输入

Postgres trigger 调用 Edge Function 时传入新消息记录：

```json
{
  "type": "INSERT",
  "table": "direct_messages",
  "schema": "public",
  "record": {
    "id": "message id",
    "conversation_id": "conversation id",
    "sender_id": "sender id",
    "receiver_id": "receiver id",
    "content": "message content",
    "created_at": "timestamp"
  }
}
```

## 6. Edge Function 核心逻辑

按顺序执行：

1. 读取 `payload.record`。
2. 校验 `record.id`、`sender_id`、`receiver_id`、`conversation_id` 存在。
3. 如果 `sender_id === receiver_id`，直接返回，不推送。
4. 查询 `direct_message_push_deliveries`，如果 `message_id` 已存在，直接返回，避免重复推送。
5. 检查双方是否存在 block 关系；如果有，直接返回。
6. 查询发送者资料：
   - `users.display_name`
   - 可选：`users.avatar_url`
7. 查询接收者 push token：
   - `user_push_tokens.token`
8. 如果没有 token，直接返回成功，不报错。
9. 调 Expo Push API。
10. 成功后写入 `direct_message_push_deliveries`。

## 7. 推送内容策略

隐私策略选择：只显示发送者，不显示正文。

```ts
const title = sender.display_name || 'HKCampus';
const body = '给你发来一条新消息';
```

英文 fallback 可以是：

```ts
const body = 'sent you a new message';
```

不根据消息内容展示正文、图片名、文件名或分享内容。

## 8. Expo Push payload

Edge Function 发送给 Expo 的消息建议如下：

```ts
{
  to: pushToken.token,
  sound: 'default',
  title,
  body,
  data: {
    type: 'direct_message',
    senderId: record.sender_id,
    conversationId: record.conversation_id,
    messageId: record.id,
  },
}
```

注意：

- `type` 用 `direct_message`，方便 App 点击通知后区分。
- `senderId` 用于跳转 `/messages/[senderId]`。
- `conversationId` 和 `messageId` 用于后续扩展，例如打开后定位消息。

## 9. 新建数据库触发函数

使用 `pg_net` 调用 Edge Function。

```sql
create extension if not exists pg_net;

create or replace function public.handle_new_direct_message_push()
returns trigger
language plpgsql
security definer
as $$
declare
  url text;
  service_key text;
begin
  url := current_setting('request.env.supabase_url', true) || '/functions/v1/send_direct_message_push';

  if url is null or url = '/functions/v1/send_direct_message_push' then
    url := 'http://host.docker.internal:54321/functions/v1/send_direct_message_push';
  end if;

  service_key := current_setting('request.env.supabase_service_role_key', true);

  if service_key is null then
    service_key := 'YOUR_SERVICE_ROLE_KEY';
  end if;

  perform net.http_post(
    url := url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_key
    ),
    body := jsonb_build_object(
      'type', 'INSERT',
      'table', 'direct_messages',
      'schema', 'public',
      'record', row_to_json(new)
    ),
    timeout_milliseconds := 5000
  );

  return new;
end;
$$;
```

## 10. 绑定 direct_messages trigger

```sql
drop trigger if exists on_direct_message_created_push on public.direct_messages;

create trigger on_direct_message_created_push
after insert on public.direct_messages
for each row
execute function public.handle_new_direct_message_push();
```

## 11. 设置 Supabase Secrets

部署前设置：

```bash
supabase secrets set SUPABASE_URL="你的 Supabase URL"
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="你的 service role key"
```

不要把 service role key 写进仓库。

## 12. 部署 Edge Function

```bash
supabase functions deploy send_direct_message_push
```

## 13. App 点击通知跳转

在根布局的通知响应监听里增加：

```ts
if (data?.type === 'direct_message' && data.senderId) {
  router.push({
    pathname: '/messages/[id]',
    params: { id: data.senderId },
  });
}
```

保留现有 Daily Digest 的跳转逻辑，两者通过 `data.type` 区分。

## 14. 测试步骤

按顺序测试：

1. 确认接收方已开启推送权限。
2. 确认接收方 `user_push_tokens` 有 token。
3. 让发送方向接收方发送一条私信。
4. 检查 `direct_messages` 是否插入成功。
5. 检查 `send_direct_message_push` Edge Function logs。
6. 检查 `direct_message_push_deliveries` 是否写入 `message_id`。
7. 确认接收方系统通知出现。
8. 点击通知，确认进入 `/messages/[senderId]`。
9. 重复调用同一条消息的 payload，确认不会重复推送。

## 15. 错误处理策略

推荐策略：

- 没有 push token：返回 200，不重试。
- 用户互相拉黑：返回 200，不推送。
- Expo 返回部分 token 失败：记录 logs，但不要阻塞其他 token。
- 同一 `message_id` 已发送：返回 200，避免重复。
- 数据库查询异常：返回 500，让 logs 暴露问题。

## 16. 后续可扩展项

后续可以加：

- 会话免打扰。
- 用户级“私信推送开关”。
- App 正在当前聊天页时不推送。
- 多条消息合并推送。
- 根据用户语言展示中文或英文 body。
- 清理无效 Expo token。

## 17. 回滚方式

如果私信推送异常：

1. 删除或禁用 trigger：

```sql
drop trigger if exists on_direct_message_created_push on public.direct_messages;
```

2. 保留 Edge Function 和 deliveries 表。
3. 检查 Edge Function logs。
4. 修复后重新创建 trigger。
