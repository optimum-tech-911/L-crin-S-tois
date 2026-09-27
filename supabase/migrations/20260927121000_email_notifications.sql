-- Keep notification requests in the database so a temporary email outage cannot lose them.
create extension if not exists pg_net with schema extensions;
create extension if not exists pg_cron with schema pg_catalog;

create table if not exists public.notification_jobs (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('reservation', 'contact')),
  reference_id uuid not null,
  created_at timestamptz not null default now(),
  next_attempt_at timestamptz not null default now(),
  processing_at timestamptz,
  sent_at timestamptz,
  provider_message_id text,
  attempts integer not null default 0,
  last_error text,
  unique (kind, reference_id)
);
alter table public.notification_jobs enable row level security;
revoke all on public.notification_jobs from public, anon, authenticated;
grant select, insert, update on public.notification_jobs to service_role;

create or replace function public.enqueue_guest_notification()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.notification_jobs (kind, reference_id)
  values (case when tg_table_name = 'reservation_requests' then 'reservation' else 'contact' end, new.id)
  on conflict (kind, reference_id) do nothing;
  perform net.http_post(
    url := 'https://edtgxflbenlqkruwczgp.supabase.co/functions/v1/send-notifications',
    headers := '{"Content-Type":"application/json"}'::jsonb,
    body := '{}'::jsonb,
    timeout_milliseconds := 5000
  );
  return new;
end;
$$;
revoke all on function public.enqueue_guest_notification() from public, anon, authenticated;

create trigger reservation_email_notification after insert on public.reservation_requests
  for each row execute function public.enqueue_guest_notification();
create trigger contact_email_notification after insert on public.contact_messages
  for each row execute function public.enqueue_guest_notification();

create or replace function public.claim_notification_jobs(p_limit integer default 10)
returns setof public.notification_jobs
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.role() <> 'service_role' then
    raise exception 'Service role required.' using errcode = '42501';
  end if;
  return query
  with pending as (
    select id from public.notification_jobs
    where sent_at is null and next_attempt_at <= now()
      and (processing_at is null or processing_at < now() - interval '5 minutes')
    order by created_at
    for update skip locked
    limit least(greatest(p_limit, 1), 20)
  )
  update public.notification_jobs j
  set processing_at = now(), attempts = j.attempts + 1
  from pending
  where j.id = pending.id
  returning j.*;
end;
$$;
revoke all on function public.claim_notification_jobs(integer) from public, anon, authenticated;
grant execute on function public.claim_notification_jobs(integer) to service_role;

select cron.schedule(
  'retry-guest-email-notifications',
  '*/5 * * * *',
  $$ select net.http_post(
    url := 'https://edtgxflbenlqkruwczgp.supabase.co/functions/v1/send-notifications',
    headers := '{"Content-Type":"application/json"}'::jsonb,
    body := '{}'::jsonb,
    timeout_milliseconds := 5000
  ); $$
);
