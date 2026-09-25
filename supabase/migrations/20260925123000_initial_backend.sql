-- L’Écrin Sétois: persistent booking, contact, partner and availability data.
-- Browser traffic uses only the publishable key. Row Level Security protects writes.

create extension if not exists pgcrypto;
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists private.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
revoke all on private.admin_users from public, anon, authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select auth.uid() is not null
    and exists (select 1 from private.admin_users where user_id = auth.uid());
$$;
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

create table if not exists public.availability_ranges (
  id uuid primary key default gen_random_uuid(),
  start_date date not null,
  end_date date not null,
  status text not null check (status in ('booked', 'blocked', 'pending')),
  booking_request_id uuid,
  created_at timestamptz not null default now(),
  constraint availability_ranges_order check (end_date >= start_date)
);
create index if not exists availability_ranges_dates_idx on public.availability_ranges (start_date, end_date);

create table if not exists public.booking_settings (
  id integer primary key default 1 check (id = 1),
  minimum_nights integer not null default 2 check (minimum_nights between 1 and 30),
  updated_at timestamptz not null default now()
);
insert into public.booking_settings (id, minimum_nights) values (1, 2) on conflict (id) do nothing;

create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null,
  short_description text not null,
  description text,
  logo text,
  image text,
  website text,
  phone text,
  address text,
  latitude double precision,
  longitude double precision,
  offer text,
  promo_code text,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reservation_requests (
  id uuid primary key default gen_random_uuid(),
  check_in date not null,
  check_out date not null,
  guests smallint not null check (guests between 1 and 6),
  first_name text not null check (length(trim(first_name)) between 1 and 100),
  last_name text not null check (length(trim(last_name)) between 1 and 100),
  email text not null check (length(trim(email)) between 3 and 320),
  phone text not null default '',
  country text not null check (length(trim(country)) between 1 and 100),
  message text,
  status text not null default 'new' check (status in ('new', 'contacted', 'confirmed', 'declined')),
  created_at timestamptz not null default now(),
  constraint reservation_requests_dates check (check_out > check_in)
);
create index if not exists reservation_requests_created_idx on public.reservation_requests (created_at desc);
alter table public.availability_ranges
  add constraint availability_ranges_booking_fk
  foreign key (booking_request_id) references public.reservation_requests(id) on delete set null;
create unique index if not exists availability_ranges_booking_unique_idx
  on public.availability_ranges (booking_request_id) where booking_request_id is not null;

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  first_name text not null check (length(trim(first_name)) between 1 and 100),
  last_name text not null check (length(trim(last_name)) between 1 and 100),
  email text not null check (length(trim(email)) between 3 and 320),
  phone text not null default '',
  subject text not null check (length(trim(subject)) between 1 and 200),
  message text not null check (length(trim(message)) between 1 and 10000),
  status text not null default 'new' check (status in ('new', 'read', 'replied')),
  created_at timestamptz not null default now()
);
create index if not exists contact_messages_created_idx on public.contact_messages (created_at desc);

alter table public.availability_ranges enable row level security;
alter table public.booking_settings enable row level security;
alter table public.partners enable row level security;
alter table public.reservation_requests enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists availability_public_read on public.availability_ranges;
create policy availability_public_read on public.availability_ranges for select to anon, authenticated using (true);
drop policy if exists availability_admin_manage on public.availability_ranges;
create policy availability_admin_manage on public.availability_ranges for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists booking_settings_public_read on public.booking_settings;
create policy booking_settings_public_read on public.booking_settings for select to anon, authenticated using (true);
drop policy if exists booking_settings_admin_manage on public.booking_settings;
create policy booking_settings_admin_manage on public.booking_settings for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists partners_public_read on public.partners;
create policy partners_public_read on public.partners for select to anon, authenticated using (true);
drop policy if exists partners_admin_manage on public.partners;
create policy partners_admin_manage on public.partners for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists reservations_admin_read on public.reservation_requests;
create policy reservations_admin_read on public.reservation_requests for select to authenticated
  using ((select public.is_admin()));
drop policy if exists reservations_admin_update on public.reservation_requests;
create policy reservations_admin_update on public.reservation_requests for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists messages_admin_read on public.contact_messages;
create policy messages_admin_read on public.contact_messages for select to authenticated
  using ((select public.is_admin()));
drop policy if exists messages_public_insert on public.contact_messages;
create policy messages_public_insert on public.contact_messages for insert to anon, authenticated
  with check (status = 'new');
drop policy if exists messages_admin_update on public.contact_messages;
create policy messages_admin_update on public.contact_messages for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

grant select on public.availability_ranges, public.booking_settings, public.partners to anon, authenticated;
grant insert, update, delete on public.availability_ranges, public.booking_settings, public.partners to authenticated;
grant select, update on public.reservation_requests to authenticated;
grant select, insert, update on public.contact_messages to anon, authenticated;
revoke insert, delete on public.reservation_requests from anon, authenticated;
revoke delete on public.contact_messages from anon, authenticated;

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
  if p_check_out <= p_check_in then
    raise exception 'La date de départ doit être après la date d’arrivée.' using errcode = 'P0001';
  end if;
  select minimum_nights into v_minimum_nights from public.booking_settings where id = 1;
  if p_check_out - p_check_in < coalesce(v_minimum_nights, 2) then
    raise exception 'Le séjour minimum est de % nuits.', coalesce(v_minimum_nights, 2) using errcode = 'P0001';
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
revoke all on function public.submit_reservation_request(date, date, smallint, text, text, text, text, text, text) from public;
grant execute on function public.submit_reservation_request(date, date, smallint, text, text, text, text, text, text) to anon, authenticated;

create or replace function public.admin_update_reservation_status(p_id uuid, p_status text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_check_in date;
  v_check_out date;
begin
  if not public.is_admin() then
    raise exception 'Accès administrateur requis.' using errcode = '42501';
  end if;
  if p_status not in ('new', 'contacted', 'confirmed', 'declined') then
    raise exception 'Statut de réservation invalide.' using errcode = '22023';
  end if;
  select check_in, check_out into v_check_in, v_check_out
    from public.reservation_requests where id = p_id for update;
  if not found then raise exception 'Demande introuvable.' using errcode = 'P0002'; end if;

  delete from public.availability_ranges where booking_request_id = p_id;
  if p_status = 'confirmed' then
    if exists (
      select 1 from public.availability_ranges a
      where a.start_date < v_check_out and a.end_date >= v_check_in
        and a.status in ('booked', 'blocked', 'pending')
    ) then
      raise exception 'Ces dates sont déjà bloquées par une autre période.' using errcode = 'P0001';
    end if;
    insert into public.availability_ranges (start_date, end_date, status, booking_request_id)
      values (v_check_in, v_check_out - 1, 'booked', p_id);
  end if;
  update public.reservation_requests set status = p_status where id = p_id;
end;
$$;
revoke all on function public.admin_update_reservation_status(uuid, text) from public, anon;
grant execute on function public.admin_update_reservation_status(uuid, text) to authenticated;

create or replace function public.admin_set_date_availability(p_date date, p_status text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_range record;
begin
  if not public.is_admin() then
    raise exception 'Accès administrateur requis.' using errcode = '42501';
  end if;
  if p_status not in ('available', 'blocked') then
    raise exception 'Disponibilité invalide.' using errcode = '22023';
  end if;
  if p_status = 'available' and exists (
    select 1 from public.availability_ranges
    where p_date between start_date and end_date and booking_request_id is not null
  ) then
    raise exception 'Annulez ou refusez la réservation confirmée avant de libérer ces dates.' using errcode = 'P0001';
  end if;

  for v_range in
    select id, start_date, end_date, status
    from public.availability_ranges
    where p_date between start_date and end_date and booking_request_id is null
    for update
  loop
    delete from public.availability_ranges where id = v_range.id;
    if v_range.start_date < p_date then
      insert into public.availability_ranges (start_date, end_date, status)
      values (v_range.start_date, p_date - 1, v_range.status);
    end if;
    if v_range.end_date > p_date then
      insert into public.availability_ranges (start_date, end_date, status)
      values (p_date + 1, v_range.end_date, v_range.status);
    end if;
  end loop;

  if p_status = 'blocked' then
    insert into public.availability_ranges (start_date, end_date, status)
      values (p_date, p_date, 'blocked');
  end if;
end;
$$;
revoke all on function public.admin_set_date_availability(date, text) from public, anon;
grant execute on function public.admin_set_date_availability(date, text) to authenticated;

do $$
begin
  alter publication supabase_realtime add table public.availability_ranges;
exception when duplicate_object then null;
end;
$$;

do $$
begin
  alter publication supabase_realtime add table public.booking_settings;
exception when duplicate_object then null;
end;
$$;
do $$
begin
  alter publication supabase_realtime add table public.partners;
exception when duplicate_object then null;
end;
$$;
do $$
begin
  alter publication supabase_realtime add table public.reservation_requests;
exception when duplicate_object then null;
end;
$$;
do $$
begin
  alter publication supabase_realtime add table public.contact_messages;
exception when duplicate_object then null;
end;
$$;

insert into public.partners (slug, name, category, short_description, description, address, website, offer, featured)
values
  ('caveau-voltaire', 'Caveau Voltaire', 'Vins locaux & charcuterie', 'Une adresse de quartier pour découvrir des vins locaux et composer un apéritif sétois.', 'Situé à environ cinq minutes à pied de l’appartement. Présentez-vous comme voyageur de L’Écrin Sétois pour profiter de l’avantage partenaire, selon les conditions annoncées sur place.', null, null, '−10 % pendant votre séjour', true),
  ('theatre-moliere-sete', 'Théâtre Molière → Sète', 'Culture & spectacles', 'Une scène nationale au cœur de Sète, pour découvrir le théâtre, la danse, la musique et le cirque pendant votre séjour.', 'Inauguré en 1904, le Théâtre Molière est aujourd’hui la Scène nationale archipel de Thau. Consultez sa programmation et les informations pratiques pour préparer votre sortie.', 'Avenue Victor Hugo, 34200 Sète', 'https://tmsete.com/', null, false)
on conflict (slug) do nothing;
