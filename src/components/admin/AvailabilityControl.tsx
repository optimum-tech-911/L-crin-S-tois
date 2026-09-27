import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameMonth,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { Check, ChevronLeft, ChevronRight, CircleAlert, LoaderCircle, Minus, MoonStar, Plus, Wifi } from 'lucide-react';
import clsx from 'clsx';
import { AvailabilityRange, AvailabilityStatus, calendarService, toDateKey } from '../../services/calendarService';
import { bookingSettingsService, MinimumStayRule } from '../../services/bookingSettingsService';
import { siteData } from '../../data/site';

type EditingMode = 'available' | 'blocked';

const weekdays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export default function AvailabilityControl() {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(today));
  const [mode, setMode] = useState<EditingMode>('blocked');
  const [availability, setAvailability] = useState<Record<string, AvailabilityStatus>>({});
  const [ranges, setRanges] = useState<AvailabilityRange[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingDate, setUpdatingDate] = useState<string | null>(null);
  const [minimumNights, setMinimumNights] = useState(2);
  const [minimumStayRules, setMinimumStayRules] = useState<MinimumStayRule[]>([]);
  const [ruleStart, setRuleStart] = useState('');
  const [ruleEnd, setRuleEnd] = useState('');
  const [ruleNights, setRuleNights] = useState(2);
  const [ruleBusy, setRuleBusy] = useState(false);
  const [ruleError, setRuleError] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const months = useMemo(() => [currentMonth, addMonths(currentMonth, 1)], [currentMonth]);

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
      const end = endOfWeek(endOfMonth(addMonths(currentMonth, 1)), { weekStartsOn: 1 });
      try {
      const [nextAvailability, nextRanges] = await Promise.all([calendarService.getAvailability(start, end), calendarService.getRanges()]);
      if (!active) return;
      setAvailability(nextAvailability);
      setRanges(nextRanges);
      setErrorMessage('');
      setIsLoading(false);
      } catch (error) {
        if (!active) return;
        setErrorMessage(error instanceof Error ? error.message : 'Impossible de charger le calendrier.');
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    void refresh();
    const unsubscribe = calendarService.subscribe(() => void refresh());
    return () => {
      active = false;
      unsubscribe();
    };
  }, [currentMonth]);

  useEffect(() => {
    const refresh = () => bookingSettingsService.getSettings().then((settings) => {
      setMinimumNights(settings.minimumNights);
      setMinimumStayRules(settings.rules);
    }).catch((error: unknown) => setRuleError(error instanceof Error ? error.message : 'Impossible de charger les règles de réservation.'));
    void refresh();
    return bookingSettingsService.subscribe(refresh);
  }, []);

  const updateMinimumNights = async (value: number) => {
    const normalized = Math.min(30, Math.max(1, Math.round(value)));
    setErrorMessage('');
    try {
      await bookingSettingsService.setMinimumNights(normalized);
      setMinimumNights(normalized);
    } catch (error) { setErrorMessage(error instanceof Error ? error.message : 'Impossible d’enregistrer le séjour minimum.'); }
  };

  const addMinimumStayRule = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRuleError('');
    setRuleBusy(true);
    try {
      await bookingSettingsService.addRule(ruleStart, ruleEnd, ruleNights);
      const settings = await bookingSettingsService.getSettings();
      setMinimumStayRules(settings.rules);
      setRuleStart('');
      setRuleEnd('');
    } catch (error) {
      setRuleError(error instanceof Error ? error.message : 'Impossible d’enregistrer cette période.');
    } finally { setRuleBusy(false); }
  };

  const removeMinimumStayRule = async (id: string) => {
    setRuleError('');
    setRuleBusy(true);
    try {
      await bookingSettingsService.removeRule(id);
      setMinimumStayRules((rules) => rules.filter((rule) => rule.id !== id));
    } catch (error) {
      setRuleError(error instanceof Error ? error.message : 'Impossible de supprimer cette période.');
    } finally { setRuleBusy(false); }
  };

  const updateDay = async (day: Date) => {
    if (isBefore(day, today) || isLoading || updatingDate) return;
    const key = toDateKey(day);
    const currentStatus = availability[key] ?? 'available';
    if ((mode === 'available' && currentStatus === 'available') || (mode === 'blocked' && currentStatus === 'blocked')) return;

    setUpdatingDate(key);
    try { await calendarService.setDateAvailability(day, mode); }
    catch (error) { setErrorMessage(error instanceof Error ? error.message : 'Impossible de modifier cette date.'); }
    finally { setUpdatingDate(null); }
  };

  const renderMonth = (month: Date, isSecondMonth: boolean) => {
    const firstDay = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
    const lastDay = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
    const days: Date[] = [];
    for (let day = firstDay; day <= lastDay; day = addDays(day, 1)) days.push(day);

    return (
      <section key={month.toISOString()} className={clsx('min-w-0', isSecondMonth && 'hidden md:block md:border-l md:border-stone-200 md:pl-7')}>
        <h3 className="mb-4 text-center font-serif text-xl capitalize text-stone-950">{format(month, 'MMMM yyyy', { locale: fr })}</h3>
        <div className="grid grid-cols-7 pb-2">
          {weekdays.map((weekday, index) => <span key={`${weekday}-${index}`} className="text-center text-[10px] font-bold tracking-[0.13em] text-stone-400">{weekday}</span>)}
        </div>
        <div className="grid grid-cols-7 gap-y-1">
          {days.map((day) => {
            const key = toDateKey(day);
            const inMonth = isSameMonth(day, month);
            const isPast = isBefore(day, today);
            const status = availability[key] ?? 'available';
            const isBusy = updatingDate === key;
            const isAvailable = status === 'available';
            const isPending = status === 'pending';

            return <div key={key} className="flex h-12 items-center justify-center sm:h-14">
              <button
                type="button"
                disabled={!inMonth || isPast || isBusy || Boolean(updatingDate) || Boolean(errorMessage)}
                onClick={() => void updateDay(day)}
                aria-label={`${format(day, 'EEEE d MMMM yyyy', { locale: fr })} — ${isAvailable ? 'disponible' : status === 'pending' ? 'en attente' : 'indisponible'}`}
                className={clsx(
                  'relative flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-bold transition duration-200 sm:h-11 sm:w-11',
                  !inMonth && 'invisible',
                  isPast && inMonth && 'cursor-not-allowed border-transparent text-stone-300',
                  inMonth && !isPast && isAvailable && 'border-emerald-500/35 bg-emerald-500/15 text-emerald-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_5px_14px_rgba(16,185,129,0.12)] hover:scale-105 hover:bg-emerald-500/25',
                  inMonth && !isPast && !isAvailable && !isPending && 'border-red-500/40 bg-red-500/15 text-red-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_5px_14px_rgba(239,68,68,0.13)] hover:scale-105 hover:bg-red-500/25',
                  inMonth && !isPast && isPending && 'border-amber-500/40 bg-amber-400/20 text-amber-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_5px_14px_rgba(245,158,11,0.12)]',
                  isBusy && 'animate-pulse text-transparent',
                )}
              >
                {format(day, 'd')}
                {isBusy && <LoaderCircle size={15} className="absolute animate-spin text-stone-700" />}
              </button>
            </div>;
          })}
        </div>
      </section>
    );
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
      {errorMessage && <p role="alert" className="border border-red-200 bg-red-50 p-4 text-sm text-red-800 xl:col-span-2">{errorMessage} Le calendrier reste en lecture seule tant que la connexion n’est pas rétablie.</p>}
      <section className="overflow-hidden border border-stone-200 bg-white shadow-sm">
        <div className="border-b border-stone-200 bg-[linear-gradient(115deg,rgba(255,255,255,1),rgba(236,253,245,0.72),rgba(255,255,255,1))] p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-800">Calendrier visuel</p>
              <h2 className="mt-1 font-serif text-2xl text-stone-950 sm:text-3xl">Disponibilités en direct</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone-600">Choisissez un mode, puis touchez les jours à modifier. Le calendrier de réservation public est synchronisé dans l’instant.</p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-emerald-600/25 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-900"><Wifi size={15} /> Synchronisé</span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-stone-950 p-1.5 sm:inline-grid sm:min-w-[410px]">
            <button type="button" onClick={() => setMode('available')} className={clsx('flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 text-sm font-bold transition', mode === 'available' ? 'bg-emerald-400 text-emerald-950 shadow-sm' : 'text-stone-300 hover:bg-stone-800')}><Check size={17} /> Rendre disponible</button>
            <button type="button" onClick={() => setMode('blocked')} className={clsx('flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 text-sm font-bold transition', mode === 'blocked' ? 'bg-red-500 text-white shadow-sm' : 'text-stone-300 hover:bg-stone-800')}><CircleAlert size={17} /> Rendre indisponible</button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <button type="button" onClick={() => setCurrentMonth((month) => subMonths(month, 1))} disabled={isSameMonth(currentMonth, startOfMonth(today))} className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 text-stone-800 transition hover:border-orange-700 hover:text-orange-800 disabled:cursor-not-allowed disabled:opacity-30" aria-label="Mois précédent"><ChevronLeft size={21} /></button>
            <p className="text-center text-xs font-bold uppercase tracking-[0.13em] text-stone-500">{mode === 'available' ? 'Mode : disponible' : 'Mode : indisponible'}</p>
            <button type="button" onClick={() => setCurrentMonth((month) => addMonths(month, 1))} className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 text-stone-800 transition hover:border-orange-700 hover:text-orange-800" aria-label="Mois suivant"><ChevronRight size={21} /></button>
          </div>
          <div className="grid gap-7 md:grid-cols-2 md:gap-7">
            {months.map((month, index) => renderMonth(month, index === 1))}
          </div>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-stone-100 pt-5 text-xs font-semibold text-stone-600">
            <span className="flex items-center gap-2"><i className="h-3 w-3 rounded border border-emerald-500/40 bg-emerald-500/20" /> Disponible</span>
            <span className="flex items-center gap-2"><i className="h-3 w-3 rounded border border-red-500/40 bg-red-500/20" /> Indisponible</span>
            <span className="flex items-center gap-2"><i className="h-3 w-3 rounded border border-amber-500/40 bg-amber-400/25" /> En attente</span>
          </div>
        </div>
      </section>

      <aside className="border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-800">Synchronisation Booking</p>
        <h2 className="mt-2 font-serif text-2xl text-stone-950">Lien iCal</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-500">Copiez ce lien dans l’importation de calendrier de Booking. Il contient les nuits réservées et bloquées et se met à jour automatiquement.</p>
        <input readOnly aria-label="Lien iCal à importer dans Booking" value={`${siteData.url}/calendrier.ics`} onFocus={(event) => event.target.select()} className="mt-4 h-11 w-full border border-stone-300 bg-stone-50 px-3 text-sm text-stone-800" />
        <div className="mt-2 flex gap-2"><button type="button" onClick={() => void navigator.clipboard.writeText(`${siteData.url}/calendrier.ics`).then(() => setLinkCopied(true)).catch(() => setLinkCopied(false))} className="min-h-10 bg-stone-900 px-4 text-sm font-bold text-white">{linkCopied ? 'Lien copié' : 'Copier le lien'}</button><a href={`${siteData.url}/calendrier.ics`} target="_blank" rel="noreferrer" className="flex min-h-10 items-center px-3 text-sm font-semibold text-stone-700 underline">Ouvrir</a></div>
        <div className="my-7 border-t border-stone-200" />
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-800">Règle de réservation</p>
        <h2 className="mt-2 font-serif text-2xl text-stone-950">Séjour minimum</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-500">Cette durée s’applique instantanément au calendrier et au formulaire publics.</p>
        <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-gold-300/70 bg-gold-50 p-3">
          <button type="button" onClick={() => updateMinimumNights(minimumNights - 1)} disabled={minimumNights <= 1} className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold-300 bg-white text-gold-900 transition hover:bg-gold-100 disabled:cursor-not-allowed disabled:opacity-35" aria-label="Réduire la durée minimale"><Minus size={18} /></button>
          <div className="text-center"><MoonStar className="mx-auto text-gold-800" size={20} /><p className="mt-1 font-serif text-3xl text-stone-950">{minimumNights}</p><p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">nuit{minimumNights > 1 ? 's' : ''}</p></div>
          <button type="button" onClick={() => updateMinimumNights(minimumNights + 1)} disabled={minimumNights >= 30} className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold-300 bg-white text-gold-900 transition hover:bg-gold-100 disabled:cursor-not-allowed disabled:opacity-35" aria-label="Augmenter la durée minimale"><Plus size={18} /></button>
        </div>

        <div className="my-7 border-t border-stone-200" />
        <h3 className="font-serif text-xl text-stone-950">Durée par période</h3>
        <p className="mt-2 text-sm leading-relaxed text-stone-500">La règle s’applique aux arrivées comprises dans la période choisie. En dehors de ces dates, la durée générale s’applique.</p>
        <form onSubmit={addMinimumStayRule} className="mt-4 space-y-3">
          <label className="block text-sm font-semibold text-stone-700">Arrivées du<input type="date" required min={toDateKey(today)} value={ruleStart} onChange={(event) => setRuleStart(event.target.value)} className="mt-1 h-11 w-full border border-stone-300 bg-white px-3" /></label>
          <label className="block text-sm font-semibold text-stone-700">Au<input type="date" required min={ruleStart || toDateKey(today)} value={ruleEnd} onChange={(event) => setRuleEnd(event.target.value)} className="mt-1 h-11 w-full border border-stone-300 bg-white px-3" /></label>
          <label className="block text-sm font-semibold text-stone-700">Nuits minimum<input type="number" required min={1} max={30} value={ruleNights} onChange={(event) => setRuleNights(Number(event.target.value))} className="mt-1 h-11 w-full border border-stone-300 bg-white px-3" /></label>
          <button type="submit" disabled={ruleBusy || !ruleStart || !ruleEnd || ruleEnd < ruleStart} className="min-h-11 w-full bg-stone-900 px-4 text-sm font-bold text-white disabled:opacity-40">{ruleBusy ? 'Enregistrement…' : 'Ajouter cette période'}</button>
        </form>
        {ruleError && <p role="alert" className="mt-3 text-sm text-red-800">{ruleError}</p>}
        <div className="mt-4 divide-y divide-stone-100">
          {minimumStayRules.map((rule) => <div key={rule.id} className="flex items-center justify-between gap-3 py-3 text-sm"><div><p className="font-bold text-stone-800">{format(parseISO(rule.start), 'd MMM', { locale: fr })} – {format(parseISO(rule.end), 'd MMM yyyy', { locale: fr })}</p><p className="text-stone-500">{rule.minimumNights} nuits minimum</p></div><button type="button" disabled={ruleBusy} onClick={() => void removeMinimumStayRule(rule.id)} className="min-h-10 px-2 font-semibold text-red-800 disabled:opacity-40">Supprimer</button></div>)}
          {!minimumStayRules.length && <p className="py-3 text-sm text-stone-500">Aucune période particulière.</p>}
        </div>

        <div className="my-7 border-t border-stone-200" />
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-800">Vue rapide</p>
        <h2 className="mt-2 font-serif text-2xl text-stone-950">Périodes actives</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-500">Une date rouge est indisponible. Touchez-la en mode vert pour la réouvrir immédiatement.</p>
        <div className="mt-5 divide-y divide-stone-100">
          {ranges.filter((range) => range.end >= toDateKey(today)).slice(0, 8).map((range) => <div key={range.id} className="py-4"><p className="text-sm font-bold text-stone-800">{format(parseISO(range.start), 'd MMM', { locale: fr })} — {format(parseISO(range.end), 'd MMM yyyy', { locale: fr })}</p><p className={clsx('mt-1 text-xs font-bold', range.status === 'pending' ? 'text-amber-800' : 'text-red-800')}>{range.status === 'pending' ? 'En attente' : range.status === 'booked' ? 'Réservé' : 'Indisponible'}</p></div>)}
          {!ranges.filter((range) => range.end >= toDateKey(today)).length && <p className="py-8 text-sm leading-relaxed text-stone-500">Aucune indisponibilité à venir.</p>}
        </div>
      </aside>
    </div>
  );
}
