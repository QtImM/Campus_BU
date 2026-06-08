// ============================================================================
// crawl_hkbu — periodically pull HKBU official content and auto-publish it
// into the community forum as content_type = 'official' posts.
//
// Data source: HKBU runs Adobe AEM. Its QueryBuilder servlet is publicly
// readable and returns clean structured JSON (title / description / displayTime
// / path) for every news page — far more robust than scraping the Angular SPA.
//
//   GET https://www.hkbu.edu.hk/bin/querybuilder.json
//        ?path=<rootPath>&type=cq:Page
//        &p.limit=N&orderby=@jcr:content/displayTime&orderby.sort=desc
//        &p.hits=full&p.nodedepth=2
//
// Pipeline per source: fetch → normalize → dedup (hkbu_feed_items) →
//   insert forum_posts → record ledger → (optionally) push for important items.
//
// Auth: caller must send header `x-cron-secret: <CRON_SECRET>`. The Supabase
// Cron job (pg_net) sends this; an admin can also invoke it manually for a
// dry-run with the same secret.
//
// Runs as service_role → bypasses RLS, so it can author content_type='official'
// posts on behalf of the auto-provisioned "HKBU 官方" bot account.
// ============================================================================

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

// ──────────────────────────────────────────────────────────────────────────
// Config
// ──────────────────────────────────────────────────────────────────────────
const HKBU_HOST = "https://www.hkbu.edu.hk";
const AEM_CONTENT_PREFIX = "/content/hongkongbaptistuniversity";

const REQUEST_TIMEOUT_MS = 12000;
const MAX_RETRIES = 2;
const EXPO_CHUNK_SIZE = 100;
const TOKEN_PAGE_SIZE = 1000;
const PUSH_COOLDOWN_HOURS = 6;

interface SourceConfig {
  key: string;
  rootPath: string;
  category: string; // must be a valid forum_posts.category
  tags: string[];
  important: boolean; // eligible to trigger a push broadcast
}

const SOURCES: SourceConfig[] = [
  {
    key: "press_release",
    rootPath: `${AEM_CONTENT_PREFIX}/en/whats-new/press-release`,
    category: "general",
    tags: ["hkbu", "official", "press_release"],
    important: true,
  },
  {
    key: "campus_digest",
    rootPath: `${AEM_CONTENT_PREFIX}/en/whats-new/campus-digest`,
    category: "general",
    tags: ["hkbu", "official", "campus_digest"],
    important: false,
  },
  {
    key: "research_news",
    rootPath: `${AEM_CONTENT_PREFIX}/en/whats-new/research-news`,
    category: "general",
    tags: ["hkbu", "official", "research"],
    important: false,
  },
  {
    key: "announcement",
    rootPath: `${AEM_CONTENT_PREFIX}/en/whats-new/announcement`,
    category: "general",
    tags: ["hkbu", "official", "announcement"],
    important: true,
  },
  // ── Not yet configured (no stable structured source confirmed) ───────────
  // events       → separate platform event.hkbu.edu.hk (JS-rendered)
  // scholarships → location TBD
  // career       → location TBD
  // Add a SourceConfig entry here once a QueryBuilder rootPath is confirmed.
];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

// ──────────────────────────────────────────────────────────────────────────
// Fetch helpers
// ──────────────────────────────────────────────────────────────────────────
async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: { Accept: "application/json,text/html" },
    });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchJsonWithRetry(url: string): Promise<any> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetchWithTimeout(url, REQUEST_TIMEOUT_MS);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      lastError = err;
    }
  }
  throw new Error(`fetch failed: ${String(lastError)}`);
}

function buildQueryBuilderUrl(rootPath: string, limit: number): string {
  const p = new URLSearchParams({
    path: rootPath,
    type: "cq:Page",
    "p.limit": String(limit),
    orderby: "@jcr:content/displayTime",
    "orderby.sort": "desc",
    "p.hits": "full",
    "p.nodedepth": "2",
  });
  return `${HKBU_HOST}/bin/querybuilder.json?${p.toString()}`;
}

// ──────────────────────────────────────────────────────────────────────────
// Normalize AEM hits → feed items
// ──────────────────────────────────────────────────────────────────────────
interface FeedItem {
  externalId: string; // jcr:path (stable)
  url: string;
  titleEn: string;
  descEn: string;
  imageUrl: string | null;
  publishedAt: string | null; // ISO
}

function pathToUrl(jcrPath: string): string {
  const rel = jcrPath.startsWith(AEM_CONTENT_PREFIX)
    ? jcrPath.slice(AEM_CONTENT_PREFIX.length)
    : jcrPath;
  return `${HKBU_HOST}${rel}.html`;
}

function parseDate(raw: unknown): string | null {
  if (!raw || typeof raw !== "string") return null;
  const t = Date.parse(raw);
  return Number.isNaN(t) ? null : new Date(t).toISOString();
}

function extractImageUrl(content: any): string | null {
  // AEM stores a teaser at jcr:content/image/thumbnailLandscape (a DAM path)
  const raw =
    content?.image?.thumbnailLandscape ??
    content?.image?.fileReference ??
    content?.image?.thumbnailPortrait ??
    null;
  if (typeof raw !== "string" || !raw.trim()) return null;
  return raw.startsWith("http") ? raw : `${HKBU_HOST}${raw}`;
}

function normalizeHits(payload: any): FeedItem[] {
  const hits: any[] = Array.isArray(payload?.hits) ? payload.hits : [];
  const items: FeedItem[] = [];
  for (const hit of hits) {
    const jcrPath: string | undefined = hit?.["jcr:path"];
    const content = hit?.["jcr:content"] ?? {};
    const titleEn: string = (content?.["jcr:title"] ?? "").toString().trim();
    if (!jcrPath || !titleEn) continue; // skip non-article / PDF / malformed
    items.push({
      externalId: jcrPath,
      url: pathToUrl(jcrPath),
      titleEn,
      descEn: (content?.["jcr:description"] ?? "").toString().trim(),
      imageUrl: extractImageUrl(content),
      publishedAt: parseDate(content?.["displayTime"]) ?? parseDate(hit?.["jcr:created"]),
    });
  }
  return items;
}

function truncate(s: string, max: number): string {
  const t = s.trim();
  return t.length <= max ? t : t.slice(0, max - 1).trimEnd() + "…";
}

function composePostContent(item: FeedItem): string {
  const parts: string[] = [];
  if (item.descEn) parts.push(item.descEn.trim());
  parts.push(`🔗 Read the full article:\n${item.url}`);
  parts.push("[This post is auto-synced from HKBU official content.]");
  return parts.join("\n\n");
}

// ──────────────────────────────────────────────────────────────────────────
// Bot account bootstrap (auto-provision "HKBU 官方")
// ──────────────────────────────────────────────────────────────────────────
interface BotIdentity {
  user_id: string;
  email: string;
  name: string;
  avatar: string | null;
}

async function findUserIdByEmail(admin: SupabaseClient, email: string): Promise<string | null> {
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error || !data?.users?.length) return null;
    const match = data.users.find((u) => (u.email ?? "").toLowerCase() === email.toLowerCase());
    if (match) return match.id;
    if (data.users.length < 200) return null;
  }
  return null;
}

async function resolveBotUser(admin: SupabaseClient): Promise<BotIdentity> {
  const name = Deno.env.get("HKBU_BOT_NAME") ?? "HKBU 官方";
  const email = Deno.env.get("HKBU_BOT_EMAIL") ?? "hkbu-official@bot.hkcampus.app";
  const avatar = Deno.env.get("HKBU_BOT_AVATAR") ?? null;

  // 1. cached?
  const { data: cfg } = await admin
    .from("app_config")
    .select("value")
    .eq("key", "hkbu_bot")
    .maybeSingle();
  if (cfg?.value?.user_id) {
    return { user_id: cfg.value.user_id, email, name, avatar };
  }

  // 2. create (or find existing)
  let userId: string | null = null;
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { name, is_bot: true, role: "hkbu_official" },
  });
  if (createErr) {
    userId = await findUserIdByEmail(admin, email);
    if (!userId) throw new Error(`bot bootstrap failed: ${createErr.message}`);
  } else {
    userId = created.user.id;
  }

  const identity: BotIdentity = { user_id: userId, email, name, avatar };
  await admin.from("app_config").upsert({ key: "hkbu_bot", value: identity });
  return identity;
}

// ──────────────────────────────────────────────────────────────────────────
// Push (important items only) — service_role replica of broadcast_push
// ──────────────────────────────────────────────────────────────────────────
async function sendBroadcastPush(
  admin: SupabaseClient,
  botId: string,
  postId: string,
  title: string,
  body: string,
): Promise<number> {
  // cooldown: at most 1 broadcast per PUSH_COOLDOWN_HOURS globally
  const cutoff = new Date(Date.now() - PUSH_COOLDOWN_HOURS * 3600_000).toISOString();
  const { data: recent } = await admin
    .from("push_broadcasts")
    .select("id")
    .gt("created_at", cutoff)
    .limit(1)
    .maybeSingle();
  if (recent) {
    console.log("[crawl_hkbu] push skipped (cooldown)");
    return 0;
  }

  // collect valid Expo tokens
  const tokens: string[] = [];
  for (let page = 0; ; page++) {
    const { data, error } = await admin
      .from("user_push_tokens")
      .select("token")
      .range(page * TOKEN_PAGE_SIZE, (page + 1) * TOKEN_PAGE_SIZE - 1);
    if (error || !data || data.length === 0) break;
    for (const { token } of data) {
      if (typeof token === "string" && token.includes("ExponentPushToken[")) tokens.push(token);
    }
    if (data.length < TOKEN_PAGE_SIZE) break;
  }

  let sent = 0;
  for (let i = 0; i < tokens.length; i += EXPO_CHUNK_SIZE) {
    const chunk = tokens.slice(i, i + EXPO_CHUNK_SIZE);
    const messages = chunk.map((to) => ({
      to,
      sound: "default",
      title,
      body,
      data: { type: "broadcast", relatedId: postId, source: "hkbu_official" },
    }));
    try {
      const res = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messages),
      });
      if (res.ok) sent += chunk.length;
      else console.error("[crawl_hkbu] expo chunk failed:", await res.text());
    } catch (e) {
      console.error("[crawl_hkbu] expo chunk exception:", e);
    }
  }

  // record (admin_id = bot user id). Non-fatal if it fails (e.g. FK).
  const { error: insErr } = await admin.from("push_broadcasts").insert({
    post_id: postId,
    admin_id: botId,
    title,
    body,
    sent_count: sent,
  });
  if (insErr) console.error("[crawl_hkbu] push_broadcasts insert error:", insErr);

  return sent;
}

// ──────────────────────────────────────────────────────────────────────────
// Handler
// ──────────────────────────────────────────────────────────────────────────
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  // auth: shared cron secret
  const cronSecret = Deno.env.get("CRON_SECRET") ?? "";
  const provided = req.headers.get("x-cron-secret") ?? "";
  if (!cronSecret || provided !== cronSecret) {
    return json({ error: "unauthorized" }, 401);
  }

  let opts: {
    dryRun?: boolean;
    sources?: string[];
    limitPerSource?: number;
    maxNew?: number;
  } = {};
  try {
    if (req.headers.get("content-type")?.includes("application/json")) {
      opts = await req.json();
    }
  } catch {
    /* empty body is fine */
  }

  const dryRun = opts.dryRun === true;
  const limitPerSource = Math.min(Math.max(opts.limitPerSource ?? Number(Deno.env.get("HKBU_LIMIT_PER_SOURCE") ?? 8), 1), 50);
  const maxNew = Math.min(Math.max(opts.maxNew ?? Number(Deno.env.get("HKBU_MAX_NEW_PER_RUN") ?? 12), 1), 100);
  const pushEnabled = (Deno.env.get("HKBU_ENABLE_PUSH") ?? "false").toLowerCase() === "true" && !dryRun;
  const language = "en";

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  const activeSources = opts.sources?.length
    ? SOURCES.filter((s) => opts.sources!.includes(s.key))
    : SOURCES;

  const summary: Record<string, unknown> = {
    dryRun,
    pushEnabled,
    language,
    perSource: [] as unknown[],
  };

  let bot: BotIdentity | null = null;
  try {
    bot = await resolveBotUser(admin);
  } catch (err) {
    return json({ error: "bot_bootstrap_failed", detail: String(err) }, 500);
  }

  let publishedTotal = 0;
  const importantPublished: { postId: string; title: string; summary: string }[] = [];
  const previews: unknown[] = [];

  for (const source of activeSources) {
    const sourceReport: Record<string, unknown> = {
      key: source.key,
      fetched: 0,
      new: 0,
      published: 0,
      errors: 0,
    };

    try {
      const payload = await fetchJsonWithRetry(buildQueryBuilderUrl(source.rootPath, limitPerSource));
      const items = normalizeHits(payload);
      sourceReport.fetched = items.length;

      if (items.length === 0) {
        sourceReport.note = "no items (check rootPath / source may be empty)";
        (summary.perSource as unknown[]).push(sourceReport);
        continue;
      }

      // dedup: which of these are already in the ledger?
      const ids = items.map((i) => i.externalId);
      const { data: existing } = await admin
        .from("hkbu_feed_items")
        .select("external_id")
        .eq("source_key", source.key)
        .in("external_id", ids);
      const seen = new Set((existing ?? []).map((r: any) => r.external_id));
      const fresh = items.filter((i) => !seen.has(i.externalId));
      sourceReport.new = fresh.length;

      // oldest-first so the feed reads chronologically when several land together
      fresh.reverse();

      for (const item of fresh) {
        if (publishedTotal >= maxNew) {
          sourceReport.skippedByCap = (sourceReport.skippedByCap as number ?? 0) + 1;
          continue; // leave un-ledgered → next run picks it up
        }

        const postSummary = truncate(item.descEn || item.titleEn, 200);
        const content = composePostContent(item);

        if (dryRun) {
          previews.push({ source: source.key, title: item.titleEn, summary: postSummary, url: item.url, image: item.imageUrl });
          sourceReport.published = (sourceReport.published as number) + 1;
          publishedTotal++;
          continue;
        }

        // 1. publish forum post (service_role bypasses RLS for content_type='official')
        const { data: post, error: postErr } = await admin
          .from("forum_posts")
          .insert({
            title: item.titleEn,
            content,
            author_id: bot.user_id,
            author_name: bot.name,
            author_avatar: bot.avatar,
            category: source.category,
            images: item.imageUrl ? [item.imageUrl] : [],
            content_type: "official",
            status: "pending_review",
            sources: [{ type: "official_website", url: item.url, accessed_at: new Date().toISOString() }],
            tags: source.tags,
            language,
            summary: postSummary,
            last_verified_at: new Date().toISOString(),
          })
          .select("id")
          .single();

        if (postErr || !post) {
          sourceReport.errors = (sourceReport.errors as number) + 1;
          await admin.from("hkbu_feed_items").insert({
            source_key: source.key,
            external_id: item.externalId,
            url: item.url,
            title: item.titleEn,
            published_at: item.publishedAt,
            status: "error",
            error_detail: postErr?.message ?? "insert returned null",
          });
          continue;
        }

        // 2. record ledger (dedup guarantee)
        await admin.from("hkbu_feed_items").insert({
          source_key: source.key,
          external_id: item.externalId,
          url: item.url,
          title: item.titleEn,
          published_at: item.publishedAt,
          forum_post_id: post.id,
          status: "published",
        });

        sourceReport.published = (sourceReport.published as number) + 1;
        publishedTotal++;
        if (source.important) {
          importantPublished.push({ postId: post.id, title: item.titleEn, summary: postSummary });
        }
      }
    } catch (err) {
      sourceReport.errors = (sourceReport.errors as number) + 1;
      sourceReport.fatal = String(err);
      console.error(`[crawl_hkbu] source ${source.key} failed:`, err);
    }

    (summary.perSource as unknown[]).push(sourceReport);
  }

  // push: at most one broadcast per run, for the newest important item
  if (pushEnabled && importantPublished.length > 0) {
    const top = importantPublished[importantPublished.length - 1];
    try {
      const sent = await sendBroadcastPush(
        admin,
        bot.user_id,
        top.postId,
        "HKBU 官方动态",
        truncate(top.title, 120),
      );
      summary.pushSent = sent;
      if (sent > 0) {
        await admin.from("hkbu_feed_items").update({ pushed: true }).eq("forum_post_id", top.postId);
      }
    } catch (err) {
      summary.pushError = String(err);
    }
  }

  summary.publishedTotal = publishedTotal;
  summary.botUserId = bot.user_id;
  if (dryRun) summary.previews = previews;

  return json(summary);
});
