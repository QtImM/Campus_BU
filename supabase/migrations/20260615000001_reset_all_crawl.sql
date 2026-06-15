-- One-off: clear ALL crawled posts to re-fetch with full article body content.
-- v2: re-run after fixing paragraph extraction and AEM nodedepth.

DELETE FROM forum_posts
WHERE id IN (
  SELECT forum_post_id FROM hkbu_feed_items
  WHERE forum_post_id IS NOT NULL
);

DELETE FROM hkbu_feed_items;

-- Trigger immediate re-crawl (all sources)
SELECT public.trigger_hkbu_crawl();
