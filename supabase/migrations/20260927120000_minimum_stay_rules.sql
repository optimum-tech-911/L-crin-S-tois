-- A date range applies to arrivals within that range. The default remains in booking_settings.
create table if not exists public.minimum_stay_rules (
  id uuid primary key default gen_random_uuid(),
  start_date date not null,
  end_date date not null,
  minimum_nights integer not null check (minimum_nights between 1 and 30),
  created_at timestamptz not null default now(),
  constraint minimum_stay_rules_dates check (end_date >= start_date),
  constraint minimum_stay_rules_no_overlap exclude using gist (daterange(start_date, end_date, '[]') with &&)
);

alter table public.minimum_stay_rules enable row level security;
create policy minimum_stay_rules_public_read on public.minimum_stay_rules
  for select to anon, authenticated using (true);
create policy minimum_stay_rules_admin_manage on public.minimum_stay_rules
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
grant select on public.minimum_stay_rules to anon, authenticated;
grant insert, update, delete on public.minimum_stay_rules to authenticated;

create or replace function public.submit_reservation_request(
  p_check_in date,
  p_check_out date,
  p_guests smallint,
  p_first_name text,
  p_last_name text,
  p_email text,
  p_phone text,
  p_country text,
  p_message text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
  v_minimum_nights integer;
begin
  if p_check_in < current_date then
    raise exception 'La date d’arrivée doit être aujourd’hui ou plus tard.' using errcode = 'P0001';
  end if;
  if p_check_out <= p_check_in then
    raise exception 'La date de départ doit être après la date d’arrivée.' using errcode = 'P0001';
  end if;
  select coalesce(
    (select r.minimum_nights from public.minimum_stay_rules r
      where p_check_in between r.start_date and r.end_date limit 1),
    (select s.minimum_nights from public.booking_settings s where s.id = 1),
    2
  ) into v_minimum_nights;
  if p_check_out - p_check_in < v_minimum_nights then
    raise exception 'Le séjour minimum est de % nuits pour cette arrivée.', v_minimum_nights using errcode = 'P0001';
  end if;
  if p_guests < 1 or p_guests > 6 then
    raise exception 'Nombre de voyageurs invalide.' using errcode = 'P0001';
  end if;
  if exists (
    select 1 from public.availability_ranges a
    where a.start_date < p_check_out and a.end_date >= p_check_in
      and a.status in ('booked', 'blocked', 'pending')
  ) then
    raise exception 'Ces dates ne sont plus entièrement disponibles.' using errcode = 'P0001';
  end if;
  insert into public.reservation_requests
    (check_in, check_out, guests, first_name, last_name, email, phone, country, message)
  values
    (p_check_in, p_check_out, p_guests, trim(p_first_name), trim(p_last_name), trim(p_email), coalesce(trim(p_phone), ''), trim(p_country), nullif(trim(p_message), ''))
  returning id into v_id;
  return v_id;
end;
$$;

do $$ begin
  alter publication supabase_realtime add table public.minimum_stay_rules;
exception when duplicate_object then null;
end $$;
