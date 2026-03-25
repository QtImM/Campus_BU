create extension if not exists vector;

alter table if exists public.agent_knowledge_base
    alter column content set not null;

alter table if exists public.agent_knowledge_base
    alter column embedding type vector(384)
    using embedding::vector(384);

create index if not exists agent_knowledge_base_embedding_hnsw_idx
    on public.agent_knowledge_base
    using hnsw (embedding vector_cosine_ops);

grant select on public.agent_knowledge_base to anon, authenticated;

create or replace function public.match_knowledge_base(
    query_embedding vector(384),
    match_threshold float default 0.55,
    match_count int default 5
)
returns table (
    id uuid,
    content text,
    metadata jsonb,
    similarity float
)
language sql
stable
as $$
    select
        kb.id,
        kb.content,
        kb.metadata,
        1 - (kb.embedding <=> query_embedding) as similarity
    from public.agent_knowledge_base kb
    where kb.embedding is not null
      and 1 - (kb.embedding <=> query_embedding) >= match_threshold
    order by kb.embedding <=> query_embedding
    limit match_count;
$$;

grant execute on function public.match_knowledge_base(vector(384), float, int) to anon, authenticated;
