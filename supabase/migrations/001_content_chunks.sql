create extension if not exists vector;

create table if not exists content_chunks (
  id bigint generated always as identity primary key,
  source text not null,
  content text not null,
  embedding vector(1536),
  created_at timestamptz default now()
);

create index if not exists content_chunks_embedding_idx on content_chunks using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- Insert via RPC so we bypass JS -> vector serialization issues
create or replace function insert_chunk (
  p_source text,
  p_content text,
  p_embedding float8[]
) returns void
language plpgsql as $$
begin
  insert into content_chunks (source, content, embedding)
  values (p_source, p_content, p_embedding::vector(1536));
end
$$;

create or replace function match_documents (
  query_embedding vector(1536),
  match_count int default 5
) returns table (id bigint, source text, content text, similarity float)
language sql stable as $$
select id, source, content,
  1 - (embedding <=> query_embedding) as similarity
from content_chunks
order by embedding <=> query_embedding
limit match_count
$$;
