// @ts-nocheck -- this file is checked and bundled by the Supabase Deno runtime.
import { createClient } from 'npm:@supabase/supabase-js@2';

const projectUrl = Deno.env.get('SUPABASE_URL');
const secretKeys = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}');
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || secretKeys.default;
const mailTo = 'lecrinsetois@gmail.com';

Deno.serve(async (request) => {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  if (!projectUrl || !serviceKey) {
    return Response.json({ error: 'email_not_configured' }, { status: 503 });
  }

  const client = createClient(projectUrl, serviceKey, { auth: { persistSession: false } });
  const { data: jobs, error: claimError } = await client.rpc('claim_notification_jobs', { p_limit: 10 });
  if (claimError) {
    console.error('Notification claim failed', claimError);
    return Response.json({ error: 'queue_unavailable' }, { status: 503 });
  }

  let sent = 0;
  let failed = 0;
  for (const job of jobs || []) {
    try {
      const table = job.kind === 'reservation' ? 'reservation_requests' : 'contact_messages';
      const { data: record, error: readError } = await client.from(table).select('*').eq('id', job.reference_id).single();
      if (readError || !record) throw new Error(readError?.message || 'Original request missing');

      const subject = job.kind === 'reservation'
        ? `Nouvelle demande de réservation — ${record.check_in} au ${record.check_out}`
        : `Nouveau contact — ${record.subject}`;
      const formData = job.kind === 'reservation'
        ? {
          name: `${record.first_name} ${record.last_name}`,
          email: record.email,
          phone: record.phone || 'Non renseigné',
          type: 'Demande de réservation',
          arrival: record.check_in,
          departure: record.check_out,
          guests: record.guests,
          country: record.country,
          message: record.message || 'Aucun message ajouté.',
          admin: 'https://lecrinsetois.fr/admin',
        }
        : {
          name: `${record.first_name} ${record.last_name}`,
          email: record.email,
          phone: record.phone || 'Non renseigné',
          type: 'Message de contact',
          subject: record.subject,
          message: record.message,
          admin: 'https://lecrinsetois.fr/admin',
        };
      const response = await fetch(`https://formsubmit.co/ajax/${mailTo}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          _replyto: record.email,
          _subject: subject,
          _template: 'table',
          _url: `https://lecrinsetois.fr/${job.kind === 'reservation' ? 'disponibilites' : 'contact'}`,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false) throw new Error(result.message || `FormSubmit returned ${response.status}`);
      const { error: updateError } = await client.from('notification_jobs').update({
        sent_at: new Date().toISOString(),
        processing_at: null,
        provider_message_id: result.id || null,
        last_error: null,
      }).eq('id', job.id);
      if (updateError) throw updateError;
      sent++;
    } catch (error) {
      failed++;
      const waitMinutes = Math.min(60, Math.max(1, 2 ** Math.min(job.attempts, 6)));
      await client.from('notification_jobs').update({
        processing_at: null,
        next_attempt_at: new Date(Date.now() + waitMinutes * 60_000).toISOString(),
        last_error: String(error).slice(0, 500),
      }).eq('id', job.id);
      console.error('Notification delivery failed', job.id, error);
    }
  }
  return Response.json({ sent, failed });
});
