-- Part 2: rate limiting

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
