type Env = {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_PUBLISHABLE_KEY?: string;
};

type AvailabilityRow = { id: string; start_date: string; end_date: string; status: string };
type Context = { request: Request; env: Env };

const calendarHeaders = {
  'Content-Type': 'text/calendar; charset=utf-8',
  'Content-Disposition': 'inline; filename="lecrinsetois.ics"',
  'Cache-Control': 'public, max-age=300',
  'Access-Control-Allow-Origin': '*',
};

function compactDate(value: string): string {
  return value.replaceAll('-', '');
}

function dayAfter(value: string): string {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10).replaceAll('-', '');
}

export function renderCalendar(rows: AvailabilityRow[], now = new Date()): string {
  const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//L Ecrin Setois//Availability Calendar//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  for (const row of rows) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(row.start_date) || !/^\d{4}-\d{2}-\d{2}$/.test(row.end_date)) continue;
    lines.push(
      'BEGIN:VEVENT',
      `UID:${row.id}@lecrinsetois.fr`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${compactDate(row.start_date)}`,
      `DTEND;VALUE=DATE:${dayAfter(row.end_date)}`,
      'SUMMARY:Unavailable',
      'STATUS:CONFIRMED',
      'TRANSP:OPAQUE',
      'END:VEVENT',
    );
  }
  lines.push('END:VCALENDAR');
  return `${lines.join('\r\n')}\r\n`;
}

export async function onRequest(context: Context): Promise<Response> {
  if (context.request.method === 'HEAD') return new Response(null, { headers: calendarHeaders });
  if (context.request.method !== 'GET') return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });

  const baseUrl = context.env.VITE_SUPABASE_URL;
  const publishableKey = context.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!baseUrl || !publishableKey) return new Response('Calendar unavailable', { status: 503, headers: { 'Cache-Control': 'no-store' } });

  try {
    const url = new URL('/rest/v1/availability_ranges', baseUrl);
    url.searchParams.set('select', 'id,start_date,end_date,status');
    url.searchParams.set('status', 'in.(booked,blocked,pending)');
    url.searchParams.set('order', 'start_date.asc');
    const response = await fetch(url, { headers: { apikey: publishableKey, Authorization: `Bearer ${publishableKey}` } });
    if (!response.ok) throw new Error(`Supabase calendar returned ${response.status}`);
    const rows = await response.json() as AvailabilityRow[];
    if (!Array.isArray(rows)) throw new Error('Invalid calendar response');
    return new Response(renderCalendar(rows), { status: 200, headers: calendarHeaders });
  } catch (error) {
    console.error('Calendar export failed', error);
    return new Response('Calendar unavailable', { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
