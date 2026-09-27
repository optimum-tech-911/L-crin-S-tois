import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { differenceInCalendarDays, format, isValid, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowLeft, CheckCircle2, Send } from 'lucide-react';
import SEO from '../components/seo/SEO';
import { propertyData } from '../data/property';
import FadeIn from '../components/common/FadeIn';
import { bookingService } from '../services/bookingService';
import { bookingSettingsService, DEFAULT_SETTINGS, minimumNightsForArrival } from '../services/bookingSettingsService';

export default function Reservation() {
  const [searchParams] = useSearchParams();
  const arrival = useMemo(() => parseISO(searchParams.get('arrival') ?? ''), [searchParams]);
  const departure = useMemo(() => parseISO(searchParams.get('departure') ?? ''), [searchParams]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [settingsReady, setSettingsReady] = useState(false);
  const [settingsError, setSettingsError] = useState('');
  const minimumNights = minimumNightsForArrival(settings, isValid(arrival) ? format(arrival, 'yyyy-MM-dd') : undefined);
  const datesAreOrdered = isValid(arrival) && isValid(departure) && departure > arrival;
  const nights = datesAreOrdered ? differenceInCalendarDays(departure, arrival) : 0;
  const hasValidDates = settingsReady && datesAreOrdered && nights >= minimumNights;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', country: 'France', guests: '1', message: '' });

  useEffect(() => {
    const refresh = () => bookingSettingsService.getSettings().then((next) => {
      setSettings(next);
      setSettingsReady(true);
      setSettingsError('');
    }).catch(() => { setSettingsReady(false); setSettingsError('Impossible de charger les conditions de séjour. Rechargez la page pour réessayer.'); });
    void refresh();
    return bookingSettingsService.subscribe(refresh);
  }, []);

  useEffect(() => {
    if (isSubmitted) document.getElementById('reservation-status')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [isSubmitted]);

  const submitRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!hasValidDates) return;

    setIsSubmitting(true);
    setValidationError('');
    try {
    const result = await bookingService.submitReservationRequest({
      checkIn: arrival,
      checkOut: departure,
      guests: Number(form.guests),
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      country: form.country,
      message: form.message || undefined,
    });
    setIsSubmitting(false);
    if (result.success) setIsSubmitted(true);
    else setValidationError(result.message);
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : 'Votre demande n’a pas pu être envoyée. Réessayez.');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO 
        title={`Réserver | ${propertyData.name}`}
        description="Réservez votre séjour en direct pour bénéficier du meilleur tarif."
        noIndex
      />
      <section className="bg-stone-50 pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <Link to="/disponibilites" className="inline-flex items-center gap-2 text-sm font-bold text-orange-800 transition-colors hover:text-orange-600"><ArrowLeft size={17} /> Modifier mes dates</Link>
            <h1 className="mt-6 text-4xl md:text-6xl font-serif text-stone-900">Finaliser ma demande.</h1>
          </FadeIn>

          {!settingsReady ? (
            <div role={settingsError ? 'alert' : 'status'} className="mt-10 border border-stone-200 bg-white p-8 text-center text-stone-700 md:p-12">{settingsError || 'Chargement des conditions de séjour…'}</div>
          ) : !hasValidDates ? (
            <FadeIn delay={0.1} className="mt-10 border border-stone-200 bg-white p-8 text-center shadow-sm md:p-12">
              <h2 className="font-serif text-3xl text-stone-900">{datesAreOrdered ? 'Prolongez votre séjour.' : 'Choisissez d’abord vos dates.'}</h2>
              <p className="mx-auto mt-4 max-w-lg text-stone-600">{datesAreOrdered ? `Le séjour minimum est de ${minimumNights} nuits. Choisissez une date de départ plus tardive.` : 'Pour préparer votre demande de réservation, sélectionnez une arrivée et un départ dans le calendrier.'}</p>
              <Link to="/disponibilites" className="mt-8 inline-flex min-h-14 items-center gap-3 bg-orange-700 px-6 py-4 text-sm font-bold uppercase tracking-wider text-stone-50 transition-colors hover:bg-orange-600">Voir les disponibilités <Send size={17} /></Link>
            </FadeIn>
          ) : isSubmitted ? (
            <div id="reservation-status" role="status" className="mt-10 border border-orange-200 bg-orange-50 p-8 text-center md:p-12">
              <CheckCircle2 className="mx-auto text-orange-700" size={48} />
              <h2 className="mt-5 font-serif text-3xl text-stone-900">Votre demande est envoyée.</h2>
              <p className="mx-auto mt-4 max-w-lg text-stone-600">Nous vous recontacterons pour confirmer la disponibilité et les modalités de votre séjour.</p>
            </div>
          ) : (
            <div className="mt-10 grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
              <FadeIn delay={0.1} className="border border-stone-200 bg-stone-900 p-6 text-stone-50 lg:sticky lg:top-24">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-300">Vos dates</p>
                <div className="mt-6 space-y-5">
                  <div className="border-b border-stone-700 pb-5"><p className="text-sm text-stone-400">Arrivée</p><p className="mt-1 font-serif text-2xl capitalize">{format(arrival, 'EEE d MMM', { locale: fr })}</p></div>
                  <div><p className="text-sm text-stone-400">Départ</p><p className="mt-1 font-serif text-2xl capitalize">{format(departure, 'EEE d MMM', { locale: fr })}</p></div>
                </div>
              </FadeIn>
              <div>
                <form onSubmit={submitRequest} className="border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
                  <h2 className="font-serif text-3xl text-stone-900">Vos coordonnées</h2>
                  <p className="mt-2 text-sm text-stone-500">Nous utiliserons ces informations uniquement pour répondre à votre demande.</p>
                  <div className="mt-7 grid gap-5 sm:grid-cols-2">
                    {[
                      ['firstName', 'Prénom', 'text'], ['lastName', 'Nom', 'text'], ['email', 'E-mail', 'email'], ['phone', 'Téléphone', 'tel'],
                    ].map(([name, label, type]) => (
                      <label key={name} className="block text-sm font-semibold text-stone-700">{label}{name === 'phone' && <span className="font-normal text-stone-400"> (facultatif)</span>}
                        <input name={name} required={name !== 'phone'} type={type} autoComplete={{ firstName: 'given-name', lastName: 'family-name', email: 'email', phone: 'tel' }[name]} value={form[name as keyof typeof form]} onChange={(event) => setForm({ ...form, [name]: event.target.value })} className="mt-2 h-12 w-full border border-stone-300 bg-stone-50 px-3 text-stone-900 outline-none transition focus:border-orange-700 focus:ring-2 focus:ring-orange-100" />
                      </label>
                    ))}
                    <label className="block text-sm font-semibold text-stone-700">Pays
                      <input name="country" required autoComplete="country-name" value={form.country} onChange={(event) => setForm({ ...form, country: event.target.value })} className="mt-2 h-12 w-full border border-stone-300 bg-stone-50 px-3 text-stone-900 outline-none transition focus:border-orange-700 focus:ring-2 focus:ring-orange-100" />
                    </label>
                    <label className="block text-sm font-semibold text-stone-700">Voyageurs
                      <select value={form.guests} onChange={(event) => setForm({ ...form, guests: event.target.value })} className="mt-2 h-12 w-full border border-stone-300 bg-stone-50 px-3 text-stone-900 outline-none transition focus:border-orange-700 focus:ring-2 focus:ring-orange-100">
                        {[1, 2, 3, 4, 5, 6].map((guests) => <option key={guests} value={guests}>{guests} voyageur{guests > 1 ? 's' : ''}</option>)}
                      </select>
                    </label>
                  </div>
                  <label className="mt-5 block text-sm font-semibold text-stone-700">Votre message <span className="font-normal text-stone-400">(facultatif)</span>
                    <textarea rows={4} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} className="mt-2 w-full resize-y border border-stone-300 bg-stone-50 p-3 text-stone-900 outline-none transition focus:border-orange-700 focus:ring-2 focus:ring-orange-100" />
                  </label>
                  {validationError && <p role="alert" className="mt-5 border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-800">{validationError}</p>}
                  <button type="submit" disabled={isSubmitting} className="mt-7 flex min-h-14 w-full items-center justify-center gap-3 bg-orange-700 px-6 py-4 text-sm font-bold uppercase tracking-wider text-stone-50 transition-colors hover:bg-orange-600 disabled:cursor-wait disabled:bg-stone-400">
                    {isSubmitting ? 'Envoi en cours…' : <>Envoyer ma demande <Send size={17} /></>}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
