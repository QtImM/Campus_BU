import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const EXPO_CHUNK_SIZE = 100;
const COOLDOWN_HOURS = 6;
const TOKEN_PAGE_SIZE = 1000;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: corsHeaders });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const serviceSupabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify JWT and get caller identity
    const jwtToken = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await serviceSupabase.auth.getUser(jwtToken);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: corsHeaders });
    }

    // Verify caller is an active admin
    const { data: adminRow } = await serviceSupabase
      .from('app_admins')
      .select('is_active')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .maybeSingle();

    if (!adminRow) {
      return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403, headers: corsHeaders });
    }

    const { postId, title, body } = await req.json();
    if (!postId || !title?.trim() || !body?.trim()) {
      return new Response(JSON.stringify({ error: 'invalid_params' }), { status: 400, headers: corsHeaders });
    }

    // Dedup: same post can only be broadcast once
    const { data: existingBroadcast } = await serviceSupabase
      .from('push_broadcasts')
      .select('id, created_at')
      .eq('post_id', String(postId))
      .maybeSingle();

    if (existingBroadcast) {
      return new Response(
        JSON.stringify({ error: 'already_sent', sentAt: existingBroadcast.created_at }),
        { status: 409, headers: corsHeaders }
      );
    }

    // Cooldown: max 1 broadcast per COOLDOWN_HOURS
    const cooldownCutoff = new Date(Date.now() - COOLDOWN_HOURS * 60 * 60 * 1000).toISOString();
    const { data: recentBroadcast } = await serviceSupabase
      .from('push_broadcasts')
      .select('id, created_at')
      .gt('created_at', cooldownCutoff)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (recentBroadcast) {
      const nextAvailable = new Date(
        new Date(recentBroadcast.created_at).getTime() + COOLDOWN_HOURS * 60 * 60 * 1000
      ).toISOString();
      return new Response(
        JSON.stringify({ error: 'cooldown', nextAvailable }),
        { status: 429, headers: corsHeaders }
      );
    }

    // Fetch all valid Expo push tokens (paginated)
    const allTokens: string[] = [];
    let page = 0;

    while (true) {
      const { data: tokens, error: tokensError } = await serviceSupabase
        .from('user_push_tokens')
        .select('token')
        .range(page * TOKEN_PAGE_SIZE, (page + 1) * TOKEN_PAGE_SIZE - 1);

      if (tokensError || !tokens || tokens.length === 0) break;

      for (const { token } of tokens) {
        if (token.includes('ExponentPushToken[')) {
          allTokens.push(token);
        }
      }

      if (tokens.length < TOKEN_PAGE_SIZE) break;
      page++;
    }

    console.log(`[broadcast_push] Found ${allTokens.length} valid tokens`);

    // Send to Expo in chunks of EXPO_CHUNK_SIZE
    let sentCount = 0;
    for (let i = 0; i < allTokens.length; i += EXPO_CHUNK_SIZE) {
      const chunk = allTokens.slice(i, i + EXPO_CHUNK_SIZE);
      const messages = chunk.map(to => ({
        to,
        sound: 'default',
        title: title.trim(),
        body: body.trim(),
        data: { type: 'broadcast', relatedId: String(postId) },
      }));

      try {
        const expoResponse = await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(messages),
        });

        if (expoResponse.ok) {
          sentCount += chunk.length;
        } else {
          console.error(`[broadcast_push] Expo chunk ${i} failed:`, await expoResponse.text());
        }
      } catch (e) {
        console.error(`[broadcast_push] Chunk ${i} exception:`, e);
      }
    }

    // Record the broadcast (even if sentCount is 0 — counts as "used" for dedup/cooldown)
    await serviceSupabase.from('push_broadcasts').insert({
      post_id: String(postId),
      admin_id: user.id,
      title: title.trim(),
      body: body.trim(),
      sent_count: sentCount,
    });

    console.log(`[broadcast_push] Done. Sent to ${sentCount}/${allTokens.length} devices`);
    return new Response(
      JSON.stringify({ sentCount }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('[broadcast_push] Unhandled error:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'internal_error' }),
      { status: 500, headers: corsHeaders }
    );
  }
});
