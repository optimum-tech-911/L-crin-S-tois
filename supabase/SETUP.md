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

The `send-notifications` Edge Function, insertion triggers, durable queue, and five-minute retry schedule are deployed. The function submits reservation and contact details to FormSubmit, addressed to `lecrinsetois@gmail.com`. Each email includes the sender's name, email, phone, message, and the reservation dates and guest count when relevant; it also links to `/admin`. The first test submission triggers FormSubmit's one-time email activation. Click its activation link to start receiving the queued submissions and future requests. FormSubmit documents that unconfirmed submissions are held for up to 30 days. Keep the delivery function server-side; do not add the email address to a public `VITE_` secret or send privileged Supabase keys to FormSubmit.

The prior browser-local data is not copied automatically. Export any messages, requests, availability blocks, booking settings, or partner edits that must be retained before switching to this backend.
