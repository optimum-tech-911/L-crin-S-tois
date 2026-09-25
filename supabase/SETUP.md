# Supabase setup

## App configuration

The local `.env.local` file uses the project URL and publishable key. For production, add these two variables to the hosting provider:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

The publishable key is intended for browser apps. Do not put a secret or service-role key in a `VITE_` variable.

## Create the database

The migration `migrations/20260925123000_initial_backend.sql` has already been applied to the configured Supabase project. It creates the tables, row-level security policies, booking RPCs, live calendar subscriptions, and initial partners. Do not run it a second time on this project. For a fresh Supabase project, apply it once in **SQL Editor**.

## Set up the administrator

The project has email/password sign-in enabled, public sign-ups disabled, and these two accounts allowlisted as administrators:

- `lecrinsetois@gmail.com`
- `optimum.tech.911@gmail.com`

The project owner set both accounts to the requested shared password. Change each password after first use. Admin access is checked in the database using the user's Auth ID; knowing the URL or having a signed-in account alone is not enough. `bootstrap_admin.sql` remains available for adding another administrator later.

The site stores contact messages and reservation requests in Supabase. They appear in the authenticated admin dashboard. Confirming a reservation creates its booked calendar range in the same database transaction. Automatic email notifications are not active: the project has no SMTP server or email API credential configured. Add a verified mail provider before enabling notification delivery; never put its secret in a `VITE_` variable.

The prior browser-local data is not copied automatically. Export any messages, requests, availability blocks, booking settings, or partner edits that must be retained before switching to this backend.
