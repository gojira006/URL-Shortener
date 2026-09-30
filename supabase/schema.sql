create table public.links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slug text unique not null,
  target_url text not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

create table public.clicks (
  id bigint generated always as identity primary key,
  link_id uuid not null references public.links(id) on delete cascade,
  clicked_at timestamptz not null default now(),
  country text,
  device text,
  browser text,
  os text,
  referrer text,
  is_bot boolean not null default false
);
create index clicks_link_id_clicked_at_idx on public.clicks (link_id, clicked_at desc);

alter table public.links enable row level security;
alter table public.clicks enable row level security;
create policy "Users manage their own links" on public.links for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users read clicks for their links" on public.clicks for select using (exists (select 1 from public.links where links.id = clicks.link_id and links.user_id = auth.uid()));

create or replace function public.clicks_per_day(p_link_id uuid, p_days integer)
returns table(label text, clicks bigint) language sql stable security invoker set search_path = public as $$
  select to_char(date_trunc('day', clicked_at), 'YYYY-MM-DD'), count(*) from clicks
  where link_id = p_link_id and clicked_at >= now() - make_interval(days => p_days) and not is_bot
  group by 1 order by 1;
$$;
create or replace function public.clicks_by_country(p_link_id uuid, p_days integer)
returns table(label text, clicks bigint) language sql stable security invoker set search_path = public as $$
  select coalesce(country, 'Unknown'), count(*) from clicks where link_id = p_link_id and clicked_at >= now() - make_interval(days => p_days) and not is_bot group by 1 order by 2 desc limit 10;
$$;
create or replace function public.clicks_by_device(p_link_id uuid, p_days integer)
returns table(label text, clicks bigint) language sql stable security invoker set search_path = public as $$
  select coalesce(device, 'Unknown'), count(*) from clicks where link_id = p_link_id and clicked_at >= now() - make_interval(days => p_days) and not is_bot group by 1 order by 2 desc limit 10;
$$;
create or replace function public.clicks_by_browser(p_link_id uuid, p_days integer)
returns table(label text, clicks bigint) language sql stable security invoker set search_path = public as $$
  select coalesce(browser, 'Unknown'), count(*) from clicks where link_id = p_link_id and clicked_at >= now() - make_interval(days => p_days) and not is_bot group by 1 order by 2 desc limit 10;
$$;
create or replace function public.clicks_by_referrer(p_link_id uuid, p_days integer)
returns table(label text, clicks bigint) language sql stable security invoker set search_path = public as $$
  select coalesce(referrer, 'Direct'), count(*) from clicks where link_id = p_link_id and clicked_at >= now() - make_interval(days => p_days) and not is_bot group by 1 order by 2 desc limit 10;
$$;
