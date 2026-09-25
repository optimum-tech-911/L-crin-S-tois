import { useEffect, useMemo, useState } from 'react';
import {
  addDays,
  addMonths,
  differenceInCalendarDays,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, LoaderCircle } from 'lucide-react';
import clsx from 'clsx';
import { AvailabilityStatus, calendarService, toDateKey } from '../../services/calendarService';

export interface SelectedDates {
  from?: Date;
  to?: Date;
}

interface AvailabilityCalendarProps {
  selectedDates: SelectedDates;
  onDateSelect: (dates: SelectedDates) => void;
  monthsToShow?: 1 | 2;
  minimumNights?: number;
}

const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export default function AvailabilityCalendar({
  selectedDates,
  onDateSelect,
  monthsToShow = 2,
  minimumNights = 1,
}: AvailabilityCalendarProps) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(today));
  const [availability, setAvailability] = useState<Record<string, AvailabilityStatus>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [availabilityError, setAvailabilityError] = useState('');

  const visibleMonths = useMemo(
    () => Array.from({ length: monthsToShow }, (_, index) => addMonths(currentMonth, index)),
    [currentMonth, monthsToShow],
  );

  useEffect(() => {
    let active = true;
    const rangeStart = startOfWeek(startOfMonth(visibleMonths[0]), { weekStartsOn: 1 });
    const rangeEnd = endOfWeek(endOfMonth(visibleMonths[visibleMonths.length - 1]), { weekStartsOn: 1 });

    const loadAvailability = () => {
      setIsLoading(true);
      calendarService.getAvailability(rangeStart, rangeEnd).then((map) => {
        if (!active) return;
        setAvailability(map);
        setAvailabilityError('');
        setIsLoading(false);
      }).catch((error: unknown) => {
        if (!active) return;
        const unavailable: Record<string, AvailabilityStatus> = {};
        for (let day = rangeStart; day <= rangeEnd; day = addDays(day, 1)) unavailable[toDateKey(day)] = 'blocked';
        setAvailability(unavailable);
        setAvailabilityError(error instanceof Error ? error.message : 'Le calendrier est momentanément indisponible.');
        setIsLoading(false);
      });
    };

    loadAvailability();
    const unsubscribe = calendarService.subscribe(loadAvailability);

    return () => {
      active = false;
      unsubscribe();
    };
  }, [visibleMonths]);

  const selectDay = async (day: Date, status: AvailabilityStatus, isInMonth: boolean) => {
    if (isLoading || !isInMonth || isBefore(day, today) || status !== 'available') return;

    if (!selectedDates.from || selectedDates.to || isBefore(day, selectedDates.from)) {
      onDateSelect({ from: day });
      return;
    }

    if (isSameDay(day, selectedDates.from)) {
      onDateSelect({ from: day });
      return;
    }

    if (differenceInCalendarDays(day, selectedDates.from) < minimumNights) return;

    try {
      const rangeIsAvailable = await calendarService.isRangeAvailable(selectedDates.from, day);
      onDateSelect(rangeIsAvailable ? { from: selectedDates.from, to: day } : { from: day });
    } catch (error) {
      setAvailabilityError(error instanceof Error ? error.message : 'Impossible de vérifier ces dates.');
    }
  };

  const renderMonth = (month: Date) => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
    const days: Date[] = [];

    for (let day = start; day <= end; day = addDays(day, 1)) days.push(day);

    return (
      <section key={month.toISOString()} className="min-w-0">
        <h3 className="mb-5 text-center font-serif text-xl capitalize text-stone-900">
          {format(month, 'MMMM yyyy', { locale: fr })}
        </h3>
        <div className="grid grid-cols-7 border-b border-stone-100 pb-2">
          {weekDays.map((day, index) => (
            <div key={`${day}-${index}`} className="text-center text-[11px] font-bold uppercase tracking-[0.12em] text-stone-400">
              {day}
            </div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7">
          {days.map((day) => {
            const dayKey = toDateKey(day);
            const status = availability[dayKey] ?? 'available';
            const isInMonth = isSameMonth(day, month);
            const isPast = isBefore(day, today);
            const isStart = Boolean(selectedDates.from && isSameDay(day, selectedDates.from));
            const isEnd = Boolean(selectedDates.to && isSameDay(day, selectedDates.to));
            const isBetween = Boolean(
              selectedDates.from && selectedDates.to && isBefore(selectedDates.from, day) && isBefore(day, selectedDates.to),
            );
            const isUnavailable = status !== 'available' || isPast;
            const isTooShort = Boolean(
              selectedDates.from
              && !selectedDates.to
              && isBefore(selectedDates.from, day)
              && differenceInCalendarDays(day, selectedDates.from) < minimumNights,
            );

            return (
              <div key={dayKey} className={clsx('flex h-12 items-center justify-center sm:h-13', isBetween && 'bg-orange-100/80')}>
                <button
                  type="button"
                  onClick={() => selectDay(day, status, isInMonth)}
                  disabled={!isInMonth || isUnavailable || isTooShort || isLoading}
                  aria-label={`${format(day, 'EEEE d MMMM yyyy', { locale: fr })}${isUnavailable ? ', indisponible' : isTooShort ? `, séjour minimum de ${minimumNights} nuits` : ''}`}
                  className={clsx(
                    'relative flex h-10 w-10 items-center justify-center rounded-full text-sm transition-all duration-200 sm:h-11 sm:w-11',
                    !isInMonth && 'invisible',
                    isInMonth && !isUnavailable && !isStart && !isEnd && 'font-medium text-stone-800 hover:bg-orange-100 hover:text-orange-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700',
                    isUnavailable && isInMonth && 'cursor-not-allowed text-stone-300 line-through decoration-stone-300',
                    isTooShort && isInMonth && !isUnavailable && 'cursor-not-allowed text-stone-300',
                    (isStart || isEnd) && 'bg-orange-800 font-bold text-stone-50 shadow-md ring-2 ring-orange-100',
                    isLoading && 'animate-pulse text-transparent',
                  )}
                >
                  {format(day, 'd')}
                  {status === 'pending' && isInMonth && !isPast && !isStart && !isEnd && (
                    <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-orange-500" aria-hidden="true" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  const cannotGoBack = isSameMonth(currentMonth, startOfMonth(today));

  return (
    <div className="border border-stone-200 bg-white p-4 shadow-[0_18px_50px_rgba(28,25,23,0.08)] sm:p-6 lg:p-8">
      <div className="mb-7 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setCurrentMonth((month) => subMonths(month, 1))}
          disabled={cannotGoBack}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 text-stone-800 transition-colors hover:border-orange-700 hover:text-orange-800 disabled:cursor-not-allowed disabled:opacity-35"
          aria-label="Mois précédent"
        >
          <ChevronLeft size={21} />
        </button>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-stone-500">
          {isLoading && <LoaderCircle size={15} className="animate-spin" />}
          Sélectionnez vos dates
        </div>
        <button
          type="button"
          onClick={() => setCurrentMonth((month) => addMonths(month, 1))}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 text-stone-800 transition-colors hover:border-orange-700 hover:text-orange-800"
          aria-label="Mois suivant"
        >
          <ChevronRight size={21} />
        </button>
      </div>

      {availabilityError && <p role="alert" className="mb-5 border border-red-200 bg-red-50 p-3 text-sm leading-relaxed text-red-800">Le calendrier ne peut pas vérifier les disponibilités. Les dates restent désactivées jusqu’au rétablissement de la connexion. {availabilityError}</p>}

      <div className={clsx('grid gap-8 lg:gap-12', monthsToShow === 2 && 'lg:grid-cols-2 lg:divide-x lg:divide-stone-100')}>
        {visibleMonths.map(renderMonth)}
      </div>

      <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 border-t border-stone-100 pt-5 text-xs font-medium text-stone-600">
        <span className="flex items-center gap-2"><i className="h-3 w-3 rounded-full border border-stone-300 bg-white" />Disponible</span>
        <span className="flex items-center gap-2"><i className="h-3 w-3 rounded-full bg-orange-800" />Vos dates</span>
        <span className="flex items-center gap-2"><i className="h-3 w-3 rounded-full bg-stone-200" />Indisponible</span>
        <span className="ml-auto font-bold text-stone-700">Séjour minimum : {minimumNights} nuit{minimumNights > 1 ? 's' : ''}</span>
      </div>
    </div>
  );
}
