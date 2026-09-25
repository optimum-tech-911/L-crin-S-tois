import { FormEvent, type ReactNode, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Cloud,
  Handshake,
  Inbox,
  LayoutDashboard,
  Mail,
  Users,
} from 'lucide-react';
import SEO from '../components/seo/SEO';
import AvailabilityControl from '../components/admin/AvailabilityControl';
import PartnersControl from '../components/admin/PartnersControl';
import { AvailabilityRange, AvailabilityStatus, calendarService } from '../services/calendarService';
import { BookingRequestStatus, bookingService, StoredBookingRequest } from '../services/bookingService';
import { ContactMessageStatus, messageService, StoredContactMessage } from '../services/messageService';
import { isSupabaseConfigured, requireSupabase } from '../lib/supabase';

type AdminTab = 'dashboard' | 'reservations' | 'messages' | 'availability' | 'partners';

const statusLabels: Record<AvailabilityStatus, string> = { available: 'Disponible', booked: 'Réservé', blocked: 'Bloqué', pending: 'En attente' };
const bookingLabels: Record<BookingRequestStatus, string> = { new: 'Nouvelle', contacted: 'Contactée', confirmed: 'Confirmée', declined: 'Refusée' };
const messageLabels: Record<ContactMessageStatus, string> = { new: 'Nouveau', read: 'Lu', replied: 'Répondu' };

const bookingBadge: Record<BookingRequestStatus, string> = {
  new: 'bg-orange-100 text-orange-900', contacted: 'bg-blue-100 text-blue-900', confirmed: 'bg-emerald-100 text-emerald-900', declined: 'bg-stone-200 text-stone-700',
};

export default function Admin() {
  const [authReady, setAuthReady] = useState(false);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authBusy, setAuthBusy] = useState(false);
  const [dataError, setDataError] = useState('');
  const [actionError, setActionError] = useState('');
  const [tab, setTab] = useState<AdminTab>('dashboard');
  const [bookings, setBookings] = useState<StoredBookingRequest[]>([]);
  const [messages, setMessages] = useState<StoredContactMessage[]>([]);
  const [ranges, setRanges] = useState<AvailabilityRange[]>([]);

  const refresh = async () => {
    const [nextBookings, nextMessages, nextRanges] = await Promise.all([
      bookingService.getReservationRequests(), messageService.getMessages(), calendarService.getRanges(),
    ]);
    setBookings(nextBookings);
    setMessages(nextMessages);
    setRanges(nextRanges);
    setDataError('');
  };

  useEffect(() => {
    if (!isSupabaseConfigured) { setAuthReady(true); return; }
    const client = requireSupabase();
    let active = true;
    const validateSession = async (userEmail: string | null) => {
      setSessionEmail(userEmail);
      if (!userEmail) { setIsAdmin(false); setAuthReady(true); return; }
      const { data, error } = await client.rpc('is_admin');
      if (!active) return;
      if (error || data !== true) {
        setIsAdmin(false);
        setAuthError(error?.message || 'Ce compte n’a pas accès à l’administration.');
        await client.auth.signOut();
        setSessionEmail(null);
      } else {
        setIsAdmin(true);
        setAuthError('');
      }
      setAuthReady(true);
    };
    void client.auth.getSession().then(({ data, error }) => {
      if (error) setAuthError(error.message);
      void validateSession(data.session?.user.email ?? null);
    });
    const { data: authListener } = client.auth.onAuthStateChange((_event, session) => {
      window.setTimeout(() => { void validateSession(session?.user.email ?? null); }, 0);
    });
    return () => { active = false; authListener.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    const refreshSafe = () => { void refresh().catch((error: unknown) => setDataError(error instanceof Error ? error.message : 'Impossible de charger les données.')); };
    refreshSafe();
    const unsubCalendar = calendarService.subscribe(refreshSafe);
    const unsubMessages = messageService.subscribe(refreshSafe);
    const unsubBookings = bookingService.subscribe(refreshSafe);
    return () => { unsubCalendar(); unsubMessages(); unsubBookings(); };
  }, [isAdmin]);

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isSupabaseConfigured) return;
    setAuthBusy(true); setAuthError('');
    try {
      const { error } = await requireSupabase().auth.signInWithPassword({ email: email.trim(), password });
      if (error) setAuthError(error.message);
    } catch (error) { setAuthError(error instanceof Error ? error.message : 'Connexion impossible. Réessayez.'); }
    finally { setAuthBusy(false); setPassword(''); }
  };

  const newBookings = bookings.filter((booking) => booking.status === 'new').length;
  const newMessages = messages.filter((message) => message.status === 'new').length;
  const activeRanges = ranges.filter((range) => range.end >= format(new Date(), 'yyyy-MM-dd')).length;
  const navigation: Array<{ id: AdminTab; label: string; icon: typeof LayoutDashboard; count?: number }> = [
    { id: 'dashboard', label: 'Vue d’ensemble', icon: LayoutDashboard },
    { id: 'reservations', label: 'Demandes', icon: CalendarDays, count: newBookings },
    { id: 'messages', label: 'Messages', icon: Mail, count: newMessages },
    { id: 'availability', label: 'Disponibilités', icon: CalendarDays },
    { id: 'partners', label: 'Partenaires', icon: Handshake },
  ];

  const updateBooking = async (id: string, status: BookingRequestStatus) => {
    setActionError('');
    try { await bookingService.updateReservationStatus(id, status); await refresh(); }
    catch (error) { setActionError(error instanceof Error ? error.message : 'Mise à jour impossible.'); }
  };

  const updateMessage = async (id: string, status: ContactMessageStatus) => {
    setActionError('');
    try { await messageService.updateMessageStatus(id, status); await refresh(); }
    catch (error) { setActionError(error instanceof Error ? error.message : 'Mise à jour impossible.'); }
  };

  const emptyCopy = useMemo(() => ({
    reservations: 'Les nouvelles demandes envoyées depuis le site apparaîtront ici.',
    messages: 'Les messages du formulaire de contact apparaîtront ici.',
  }), []);

  if (!authReady) return <div className="grid min-h-screen place-items-center bg-[#f4f2ee] text-stone-600">Vérification de votre session…</div>;
  if (!isSupabaseConfigured) return <AuthShell><p className="text-sm leading-relaxed text-stone-600">Configurez <code>VITE_SUPABASE_URL</code> et <code>VITE_SUPABASE_PUBLISHABLE_KEY</code>, puis redémarrez le site.</p></AuthShell>;
  if (!isAdmin) return <AuthShell><form onSubmit={signIn} className="mt-6 space-y-4"><label className="block text-sm font-semibold text-stone-700">E-mail<input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 h-12 w-full border border-stone-300 bg-white px-3" /></label><label className="block text-sm font-semibold text-stone-700">Mot de passe<input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 h-12 w-full border border-stone-300 bg-white px-3" /></label>{authError && <p role="alert" className="border border-red-200 bg-red-50 p-3 text-sm text-red-800">{authError}</p>}<button disabled={authBusy} className="min-h-12 w-full bg-stone-900 px-5 font-bold text-white disabled:opacity-60">{authBusy ? 'Connexion…' : 'Se connecter'}</button></form></AuthShell>;

  return (
    <>
      <SEO title="Administration | L’Écrin Sétois" description="Espace d’administration sécurisé." noIndex />
      <main className="min-h-screen bg-[#f4f2ee] text-stone-900">
        <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">
          <aside className="border-b border-stone-200 bg-stone-950 px-4 py-4 text-stone-200 sm:px-5 lg:w-72 lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
            <div className="flex items-center gap-3 lg:block">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-stone-50 p-1">
                <img src="/brand/mark.png?v=2" alt="L’Écrin Sétois" className="h-full w-full object-contain" />
              </div>
              <div className="min-w-0 lg:mt-5"><p className="truncate font-serif text-xl text-stone-50">L’Écrin Sétois</p><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-orange-300 sm:text-xs">Administration sécurisée</p></div>
            </div>
            <div className="mt-7 hidden overflow-hidden bg-stone-50 p-3 lg:block">
              <img src="/brand/wordmark.png" alt="L’Écrin Sétois" className="h-auto w-full object-contain" />
            </div>
            <nav className="mt-5 grid grid-cols-2 gap-2 sm:mt-6 lg:flex lg:flex-col" aria-label="Navigation administration">
              {navigation.map(({ id, label, icon: Icon, count }) => (
                <button key={id} type="button" onClick={() => setTab(id)} className={`flex min-h-12 items-center gap-2 px-3 py-3 text-left text-xs font-bold transition-colors sm:text-sm lg:gap-3 lg:px-4 ${tab === id ? 'bg-orange-700 text-white' : 'text-stone-400 hover:bg-stone-900 hover:text-stone-50'}`}>
                  <Icon size={17} className="shrink-0" /> <span className="truncate">{label}</span>
                  {count ? <span className="ml-auto rounded-full bg-orange-200 px-2 py-0.5 text-xs text-orange-950">{count}</span> : null}
                </button>
              ))}
            </nav>
            <div className="mt-8 hidden border-t border-stone-800 pt-6 lg:block">
              <div className="flex items-start gap-3 text-xs leading-relaxed text-stone-400"><Cloud size={17} className="mt-0.5 shrink-0 text-orange-300" /><p><strong className="block text-stone-200">Connecté : {sessionEmail}</strong>Les données sont synchronisées avec Supabase.</p></div>
              <Link to="/" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-orange-200 hover:text-orange-100">Voir le site <ChevronRight size={16} /></Link>
            </div>
          </aside>

          <section className="min-w-0 flex-1 px-4 py-6 sm:px-7 sm:py-7 lg:px-10 lg:py-10">
            <header className="mb-8 flex flex-col gap-4 border-b border-stone-200 pb-7 sm:flex-row sm:items-center sm:justify-between">
              <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-800">Tableau de bord</p><h1 className="mt-2 font-serif text-3xl text-stone-950 sm:text-4xl">{navigation.find((item) => item.id === tab)?.label}</h1></div>
              <div className="flex flex-wrap items-center gap-3 self-start"><div className="inline-flex items-center gap-2 bg-stone-200 px-3 py-2 text-xs font-bold uppercase tracking-wider text-stone-700"><span className="h-2 w-2 rounded-full bg-emerald-600" /> Supabase connecté</div><button type="button" onClick={() => void requireSupabase().auth.signOut()} className="px-2 py-2 text-xs font-bold uppercase tracking-wider text-stone-600 hover:text-stone-950">Se déconnecter</button></div>
            </header>

            {(dataError || actionError) && <p role="alert" className="mb-6 border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">{actionError || dataError}</p>}

            {tab === 'dashboard' && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
                  <StatCard label="Nouvelles demandes" value={newBookings} icon={CalendarDays} tone="orange" />
                  <StatCard label="Messages à lire" value={newMessages} icon={Inbox} tone="blue" />
                  <StatCard label="Périodes gérées" value={activeRanges} icon={CircleDollarSign} tone="stone" />
                  <StatCard label="Contacts enregistrés" value={bookings.length + messages.length} icon={Users} tone="green" />
                </div>
                <div className="grid gap-6 xl:grid-cols-2">
                  <Panel title="Dernières demandes" action={() => setTab('reservations')} actionLabel="Voir les demandes">
                    {bookings.length ? <div className="divide-y divide-stone-100">{bookings.slice(0, 4).map((booking) => <div key={booking.id} className="flex items-center justify-between gap-3 py-4"><div><p className="font-semibold">{booking.firstName} {booking.lastName}</p><p className="mt-0.5 text-sm text-stone-500">{format(parseISO(booking.checkIn), 'd MMM', { locale: fr })} — {format(parseISO(booking.checkOut), 'd MMM', { locale: fr })}</p></div><StatusBadge label={bookingLabels[booking.status]} className={bookingBadge[booking.status]} /></div>)}</div> : <EmptyState text={emptyCopy.reservations} />}
                  </Panel>
                  <Panel title="Prochaines indisponibilités" action={() => setTab('availability')} actionLabel="Gérer le calendrier">
                    {ranges.length ? <div className="divide-y divide-stone-100">{ranges.slice(0, 4).map((range) => <div key={range.id} className="flex items-center justify-between gap-3 py-4"><div><p className="font-semibold capitalize">{statusLabels[range.status]}</p><p className="mt-0.5 text-sm text-stone-500">{format(parseISO(range.start), 'd MMM', { locale: fr })} — {format(parseISO(range.end), 'd MMM yyyy', { locale: fr })}</p></div><span className="h-2.5 w-2.5 rounded-full bg-orange-700" /></div>)}</div> : <EmptyState text="Aucune indisponibilité enregistrée." />}
                  </Panel>
                </div>
              </div>
            )}

            {tab === 'reservations' && <Panel title="Demandes de réservation" subtitle="Demandes envoyées depuis le calendrier public.">{bookings.length ? <><div className="space-y-3 md:hidden">{bookings.map((booking) => <article key={booking.id} className="border border-stone-200 p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="font-semibold">{booking.firstName} {booking.lastName}</p><p className="mt-0.5 text-sm text-stone-500">{booking.guests} voyageur{booking.guests > 1 ? 's' : ''}</p></div><StatusBadge label={bookingLabels[booking.status]} className={bookingBadge[booking.status]} /></div><p className="mt-4 text-sm font-semibold text-stone-800">{format(parseISO(booking.checkIn), 'd MMMM', { locale: fr })} — {format(parseISO(booking.checkOut), 'd MMMM yyyy', { locale: fr })}</p><div className="mt-3 border-t border-stone-100 pt-3 text-sm"><a href={`mailto:${booking.email}`} className="block break-all font-semibold text-orange-800 hover:underline">{booking.email}</a>{booking.phone && <a href={`tel:${booking.phone}`} className="mt-1 block text-stone-500 hover:text-stone-900">{booking.phone}</a>}</div><label className="mt-4 block text-xs font-bold uppercase tracking-wider text-stone-500">Suivi<select value={booking.status} onChange={(event) => updateBooking(booking.id, event.target.value as BookingRequestStatus)} className="mt-2 h-11 w-full border border-stone-300 bg-white px-3 text-sm font-semibold text-stone-800 outline-none focus:border-orange-700">{Object.entries(bookingLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></article>)}</div><div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[720px] text-left"><thead className="border-b border-stone-200 text-xs uppercase tracking-wider text-stone-500"><tr><th className="pb-3 font-bold">Voyageur</th><th className="pb-3 font-bold">Séjour</th><th className="pb-3 font-bold">Contact</th><th className="pb-3 font-bold">Statut</th></tr></thead><tbody className="divide-y divide-stone-100">{bookings.map((booking) => <tr key={booking.id}><td className="py-4"><p className="font-semibold">{booking.firstName} {booking.lastName}</p><p className="text-sm text-stone-500">{booking.guests} voyageur{booking.guests > 1 ? 's' : ''}</p></td><td className="py-4 text-sm text-stone-700">{format(parseISO(booking.checkIn), 'd MMM', { locale: fr })} — {format(parseISO(booking.checkOut), 'd MMM yyyy', { locale: fr })}</td><td className="py-4 text-sm"><a href={`mailto:${booking.email}`} className="font-semibold text-orange-800 hover:underline">{booking.email}</a><p className="text-stone-500">{booking.phone}</p></td><td className="py-4"><select value={booking.status} onChange={(event) => updateBooking(booking.id, event.target.value as BookingRequestStatus)} className="border border-stone-300 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-orange-700">{Object.entries(bookingLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></td></tr>)}</tbody></table></div></> : <EmptyState text={emptyCopy.reservations} />}</Panel>}

            {tab === 'messages' && <Panel title="Messages reçus" subtitle="Messages envoyés depuis le formulaire de contact.">{messages.length ? <div className="space-y-4">{messages.map((message) => <article key={message.id} className="border border-stone-200 p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="font-semibold">{message.firstName} {message.lastName}</p><a href={`mailto:${message.email}`} className="text-sm font-semibold text-orange-800 hover:underline">{message.email}</a><p className="mt-4 text-xs font-bold uppercase tracking-wider text-stone-500">{message.subject}</p><p className="mt-2 max-w-2xl whitespace-pre-wrap text-stone-700">{message.message}</p></div><div className="flex items-center gap-3"><StatusBadge label={messageLabels[message.status]} className={message.status === 'new' ? 'bg-orange-100 text-orange-900' : 'bg-stone-200 text-stone-700'} /><select value={message.status} onChange={(event) => updateMessage(message.id, event.target.value as ContactMessageStatus)} className="border border-stone-300 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-orange-700">{Object.entries(messageLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div></div></article>)}</div> : <EmptyState text={emptyCopy.messages} />}</Panel>}

            {tab === 'availability' && <AvailabilityControl />}
            {tab === 'partners' && <PartnersControl />}
          </section>
        </div>
      </main>
    </>
  );
}

function StatCard({ label, value, icon: Icon, tone }: { label: string; value: number; icon: typeof CalendarDays; tone: 'orange' | 'blue' | 'stone' | 'green' }) {
  const tones = { orange: 'bg-orange-100 text-orange-800', blue: 'bg-blue-100 text-blue-800', stone: 'bg-stone-200 text-stone-700', green: 'bg-emerald-100 text-emerald-800' };
  return <article className="border border-stone-200 bg-white p-4 shadow-sm sm:p-5"><div className={`flex h-9 w-9 items-center justify-center rounded-full sm:h-10 sm:w-10 ${tones[tone]}`}><Icon size={18} /></div><p className="mt-4 text-3xl font-serif text-stone-950 sm:mt-5">{value}</p><p className="mt-1 text-xs font-semibold leading-snug text-stone-500 sm:text-sm">{label}</p></article>;
}

function Panel({ title, subtitle, action, actionLabel, children }: { title: string; subtitle?: string; action?: () => void; actionLabel?: string; children: ReactNode }) {
  return <section className="border border-stone-200 bg-white p-4 shadow-sm sm:p-6"><header className="mb-5 flex items-start justify-between gap-3"><div><h2 className="font-serif text-xl text-stone-950 sm:text-2xl">{title}</h2>{subtitle && <p className="mt-1 text-sm leading-relaxed text-stone-500">{subtitle}</p>}</div>{action && <button onClick={action} className="shrink-0 text-xs font-bold text-orange-800 hover:text-orange-600 sm:text-sm">{actionLabel} →</button>}</header>{children}</section>;
}

function StatusBadge({ label, className }: { label: string; className: string }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${className}`}>{label}</span>;
}

function EmptyState({ text }: { text: string }) {
  return <div className="border border-dashed border-stone-300 bg-stone-50 px-5 py-10 text-center text-sm leading-relaxed text-stone-500">{text}</div>;
}

function AuthShell({ children }: { children: ReactNode }) {
  return <main className="grid min-h-screen place-items-center bg-[#f4f2ee] px-4 py-12 text-stone-900"><section className="w-full max-w-md border border-stone-200 bg-white p-6 shadow-sm sm:p-8"><img src="/brand/mark.png?v=2" alt="L’Écrin Sétois" className="h-12 w-12 object-contain" /><p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-stone-500">Espace privé</p><h1 className="mt-2 font-serif text-3xl">Administration</h1>{children}<Link to="/" className="mt-6 inline-block text-sm font-semibold text-stone-600 hover:text-stone-950">Retour au site</Link></section></main>;
}
