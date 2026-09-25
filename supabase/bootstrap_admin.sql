-- Run once after creating the admin user in Authentication > Users.
-- Replace the email below with that user's exact Supabase Auth email.
do $$
declare
  admin_email text := lower(trim('REPLACE_WITH_ADMIN_EMAIL'));
  admin_user_id uuid;
begin
  if admin_email = 'replace_with_admin_email' then
    raise exception 'Replace REPLACE_WITH_ADMIN_EMAIL with the admin account email first.';
  end if;

  select id into admin_user_id from auth.users where lower(email) = admin_email;
  if admin_user_id is null then
    raise exception 'No Supabase Auth user exists for %. Create that user under Authentication > Users first.', admin_email;
  end if;

  insert into private.admin_users (user_id) values (admin_user_id)
  on conflict (user_id) do nothing;
end;
$$;
