// @ts-nocheck -- this file is checked and bundled by the Supabase Deno runtime.
import { createClient } from 'npm:@supabase/supabase-js@2';

const projectUrl = Deno.env.get('SUPABASE_URL');
const secretKeys = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}');
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || secretKeys.default;
const resendKey = Deno.env.get('RESEND_API_KEY');
const mailFrom = Deno.env.get('MAIL_FROM') || 'L Ecrin Setois <notifications@lecrinsetois.fr>';
const mailTo = 'lecrinsetois@gmail.com';

function plainText(job, record) {
  const lines = job.kind === 'reservation'
    ? [
      'Nouvelle demande de réservation', '',
      `Voyageur : ${record.first_name} ${record.last_name}`,
      `Arrivée : ${record.check_in}`,
      `Départ : ${record.check_out}`,
      `Voyageurs : ${record.guests}`,
      `Pays : ${record.country}`,
    ]
    : [
      'Nouveau message de contact', '',
      `Expéditeur : ${record.first_name} ${record.last_name}`,
      `Sujet : ${record.subject}`,
    ];
  lines.push(`E-mail : ${record.email}`, `Téléphone : ${record.phone || 'Non renseigné'}`);
  lines.push('', 'Message :', record.message || 'Aucun message ajouté.');
  lines.push('', 'Retrouvez la demande dans l’administration du site.');
  return lines.join('\n');
}

Deno.serve(async (request) => {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  if (!projectUrl || !serviceKey || !resendKey || !mailFrom) {
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
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': `lecrinsetois-${job.id}`,
        },
        body: JSON.stringify({
          from: mailFrom,
          to: [mailTo],
          reply_to: record.email,
          subject,
          text: plainText(job, record),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || `Email provider returned ${response.status}`);
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
