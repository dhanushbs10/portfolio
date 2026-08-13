create extension if not exists vector;

create table if not exists content_chunks (
  id bigint generated always as identity primary key,
  source text not null,
  content text not null,
  embedding vector(1536),
  created_at timestamptz default now()
);

create index if not exists content_chunks_embedding_idx on content_chunks using ivfflat (embedding vector_cosine_ops) with (lists = 100);

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

create table if not exists rate_limits (
  id bigint generated always as identity primary key,
  ip inet not null,
  message_count int not null default 1,
  window_start timestamptz default now(),
  created_at timestamptz default now()
);

create unique index if not exists rate_limits_ip_idx on rate_limits (ip);

create or replace function check_and_bump_rate_limit (
  p_ip inet,
  p_window_start timestamptz,
  p_max int
) returns boolean
language plpgsql as $$
declare v_count int;
begin
  delete from rate_limits where ip = p_ip and window_start < p_window_start;
  insert into rate_limits (ip, message_count, window_start) values (p_ip, 1, now())
    on conflict (ip) do update set message_count = rate_limits.message_count + 1
    returning message_count into v_count;
  return v_count < p_max;
end
$$;
