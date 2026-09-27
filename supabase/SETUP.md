# Supabase setup

## App configuration

The local `.env.local` file uses the project URL and publishable key. For production, add these two variables to the hosting provider:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

The publishable key is intended for browser apps. Do not put a secret or service-role key in a `VITE_` variable.

## Create the database

The three migrations in `migrations/` have already been applied to the configured Supabase project and recorded in migration history. They create the booking and contact tables, row-level security, date-based minimum-stay rules, and the email notification queue. For a fresh project, apply them in filename order.

## Set up the administrator

The project has email/password sign-in enabled, public sign-ups disabled, and these two accounts allowlisted as administrators:

- `lecrinsetois@gmail.com`
- `optimum.tech.911@gmail.com`

The project owner set both accounts to the requested shared password. Change each password after first use. Admin access is checked in the database using the user's Auth ID; knowing the URL or having a signed-in account alone is not enough. `bootstrap_admin.sql` remains available for adding another administrator later.

The site stores contact messages and reservation requests in Supabase. They appear in the authenticated admin dashboard, including the guest's optional reservation message. Confirming a reservation creates its booked calendar range in the same database transaction.

## Booking calendar link

Import `https://lecrinsetois.fr/calendrier.ics` in Booking.com's calendar synchronization screen. The admin availability page also displays a copyable link. This is a live iCalendar feed of blocked and confirmed dates, not the `/disponibilites` web page. The feed goes live when the corresponding Cloudflare Pages deployment succeeds. Exporting this feed to Booking.com does not import Booking.com reservations back into Supabase; that requires Booking.com's separate export URL.

## Email notifications

The `send-notifications` Edge Function, insertion triggers, durable queue, and five-minute retry schedule are deployed. **Delivery is still blocked:** the project has no `RESEND_API_KEY`, and no sending domain is verified. Configure the free Resend plan with `lecrinsetois.fr` as a verified sending domain, then set the Supabase Edge Function secret `RESEND_API_KEY`. Optionally set `MAIL_FROM` to a sender at that verified domain (the default is `notifications@lecrinsetois.fr`). Requests collected while email is unavailable remain in `notification_jobs` and are retried after a provider is configured. The recipient is fixed to `lecrinsetois@gmail.com`. Never put the sending key in a `VITE_` variable or commit it to Git.

The prior browser-local data is not copied automatically. Export any messages, requests, availability blocks, booking settings, or partner edits that must be retained before switching to this backend.
