import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { differenceInCalendarDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowRight, CalendarDays, Check } from 'lucide-react';
import SEO from '../components/seo/SEO';
import { propertyData } from '../data/property';
import FadeIn from '../components/common/FadeIn';
import AvailabilityCalendar, { SelectedDates } from '../components/booking/AvailabilityCalendar';
import { bookingSettingsService } from '../services/bookingSettingsService';

export default function Availability() {
  const [selectedDates, setSelectedDates] = useState<SelectedDates>({});
  const [minimumNights, setMinimumNights] = useState(2);

  useEffect(() => {
    const refresh = () => bookingSettingsService.getSettings().then((settings) => setMinimumNights(settings.minimumNights)).catch(() => undefined);
    void refresh();
    return bookingSettingsService.subscribe(refresh);
  }, []);
  const nights = useMemo(
    () => selectedDates.from && selectedDates.to ? differenceInCalendarDays(selectedDates.to, selectedDates.from) : 0,
    [selectedDates],
  );
  const selectionIsValid = Boolean(selectedDates.from && selectedDates.to && nights >= minimumNights);
  const reservationUrl = selectedDates.from && selectedDates.to
    ? `/reservation?arrival=${format(selectedDates.from, 'yyyy-MM-dd')}&departure=${format(selectedDates.to, 'yyyy-MM-dd')}`
    : '/reservation';

  return (
    <>
      <SEO 
        title={`Disponibilités | ${propertyData.name}`}
        description="Consultez nos disponibilités."
      />
      <section className="bg-stone-50 pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="max-w-3xl mb-12 md:mb-16">
            <span className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-orange-700"><CalendarDays size={17} /> Réserver en direct</span>
            <h1 className="text-4xl md:text-6xl font-serif leading-tight text-stone-900">Choisissez vos dates.</h1>
            <p className="mt-5 text-lg font-light leading-relaxed text-stone-600">Sélectionnez votre arrivée puis votre départ. Les dates indisponibles ne peuvent pas être réservées. Le séjour minimum est de {minimumNights} nuit{minimumNights > 1 ? 's' : ''}.</p>
          </FadeIn>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
            <FadeIn delay={0.1}>
              <AvailabilityCalendar selectedDates={selectedDates} onDateSelect={setSelectedDates} minimumNights={minimumNights} />
            </FadeIn>
            <FadeIn delay={0.2} className="xl:sticky xl:top-24">
              <aside className="border border-stone-200 bg-stone-900 p-6 text-stone-50 shadow-xl sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-300">Votre séjour</p>
                {selectedDates.from ? (
                  <div className="mt-6 space-y-5">
                    <div className="border-b border-stone-700 pb-5">
                      <p className="text-sm text-stone-400">Arrivée</p>
                      <p className="mt-1 font-serif text-2xl capitalize">{format(selectedDates.from, 'EEE d MMM', { locale: fr })}</p>
                    </div>
                    <div className="border-b border-stone-700 pb-5">
                      <p className="text-sm text-stone-400">Départ</p>
                      <p className="mt-1 font-serif text-2xl capitalize">{selectedDates.to ? format(selectedDates.to, 'EEE d MMM', { locale: fr }) : 'À sélectionner'}</p>
                    </div>
                    {nights > 0 && <p className="flex items-center gap-2 text-sm text-orange-200"><Check size={17} /> {nights} nuit{nights > 1 ? 's' : ''} sélectionnée{nights > 1 ? 's' : ''}</p>}
                  </div>
                ) : (
                  <p className="mt-6 text-lg leading-relaxed text-stone-300">Commencez par choisir votre date d’arrivée dans le calendrier.</p>
                )}
                {selectionIsValid ? (
                  <Link to={reservationUrl} className="mt-8 flex min-h-14 items-center justify-center gap-3 bg-orange-700 px-5 py-4 text-sm font-bold uppercase tracking-wider transition-colors hover:bg-orange-600">
                    Continuer ma réservation <ArrowRight size={18} />
                  </Link>
                ) : (
                  <div className="mt-8 min-h-14 border border-stone-700 px-5 py-4 text-center text-sm font-semibold text-stone-500">{selectedDates.to ? `Minimum ${minimumNights} nuits` : 'Choisissez vos deux dates'}</div>
                )}
                <p className="mt-4 text-xs leading-relaxed text-stone-400">Cette étape ne confirme pas une réservation. Vous pourrez envoyer votre demande ensuite.</p>
                <p className="mt-2 text-xs font-semibold text-orange-200">Durée minimum : {minimumNights} nuit{minimumNights > 1 ? 's' : ''}.</p>
              </aside>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
