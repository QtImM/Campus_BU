-- Re-clear and re-crawl after fixing paragraph extraction + AEM nodedepth=8.

DELETE FROM forum_posts
WHERE id IN (
  SELECT forum_post_id FROM hkbu_feed_items
  WHERE forum_post_id IS NOT NULL
);

DELETE FROM hkbu_feed_items;

SELECT public.trigger_hkbu_crawl();
