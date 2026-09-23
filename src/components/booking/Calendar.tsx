import React, { useState, useEffect } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays,
  isBefore,
  startOfDay
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { calendarService } from '../../services/calendarService';
import clsx from 'clsx';

interface CalendarProps {
  selectedDates: { from?: Date; to?: Date };
  onDateSelect: (dates: { from?: Date; to?: Date }) => void;
}

export default function Calendar({ selectedDates, onDateSelect }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, boolean>>({});

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Load availability
  useEffect(() => {
    const loadAvailability = async () => {
      // In a real app, you'd fetch a range based on currentDate
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const start = startOfWeek(monthStart, { weekStartsOn: 1 });
      const end = endOfWeek(monthEnd, { weekStartsOn: 1 });
      
      const map: Record<string, boolean> = {};
      let day = start;
      while (day <= end) {
        const isAvailable = await calendarService.checkDateAvailable(day);
        map[day.toISOString()] = isAvailable;
        day = addDays(day, 1);
      }
      setAvailabilityMap(map);
    };
    loadAvailability();
  }, [currentDate]);

  const onDateClick = (day: Date) => {
    // If it's before today or not available, do nothing
    if (isBefore(day, startOfDay(new Date())) || availabilityMap[day.toISOString()] === false) {
      return;
    }

    if (!selectedDates.from || (selectedDates.from && selectedDates.to)) {
      onDateSelect({ from: day, to: undefined });
    } else if (isBefore(day, selectedDates.from)) {
      onDateSelect({ from: day, to: undefined });
    } else {
      // Check if any date in between is unavailable
      let current = addDays(selectedDates.from, 1);
      let isValidRange = true;
      while (isBefore(current, day)) {
        if (availabilityMap[current.toISOString()] === false) {
          isValidRange = false;
          break;
        }
        current = addDays(current, 1);
      }

      if (isValidRange) {
        onDateSelect({ from: selectedDates.from, to: day });
      } else {
        onDateSelect({ from: day, to: undefined });
      }
    }
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-6">
        <button onClick={prevMonth} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="font-serif text-lg text-stone-900 capitalize">
          {format(currentDate, 'MMMM yyyy', { locale: fr })}
        </div>
        <button onClick={nextMonth} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center text-xs font-medium text-stone-400 uppercase tracking-wider py-2">
          {format(addDays(startDate, i), 'EEEE', { locale: fr }).substring(0, 3)}
        </div>
      );
    }
    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        const isPast = isBefore(cloneDay, startOfDay(new Date()));
        const isAvailable = availabilityMap[cloneDay.toISOString()];
        const isSelectedFrom = selectedDates.from && isSameDay(cloneDay, selectedDates.from);
        const isSelectedTo = selectedDates.to && isSameDay(cloneDay, selectedDates.to);
        const isSelected = isSelectedFrom || isSelectedTo;
        const isBetween = selectedDates.from && selectedDates.to && 
                          isBefore(cloneDay, selectedDates.to) && 
                          isBefore(selectedDates.from, cloneDay);
        
        days.push(
          <div
            key={day.toString()}
            className={clsx(
              "p-1 flex items-center justify-center relative cursor-pointer text-sm transition-colors",
              !isSameMonth(day, monthStart) ? "text-stone-300" : "text-stone-700",
              isPast || isAvailable === false ? "text-stone-300 line-through cursor-not-allowed bg-stone-50/50" : "hover:bg-stone-100",
              isSelected && "bg-stone-900 text-stone-50 hover:bg-stone-800 rounded-sm font-medium",
              isBetween && "bg-stone-200 text-stone-900"
            )}
            onClick={() => onDateClick(cloneDay)}
          >
            <span className={clsx("h-10 w-10 flex items-center justify-center", isSelected && "rounded-sm")}>{formattedDate}</span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div className="bg-white p-6 md:p-8 border border-stone-200 shadow-sm">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      
      <div className="mt-8 pt-6 border-t border-stone-100 flex gap-6 text-sm text-stone-600">
         <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border border-stone-300 rounded-sm"></div>
            <span>Disponible</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-stone-900 rounded-sm"></div>
            <span>Sélectionné</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-stone-50 border border-stone-100 rounded-sm relative">
               <div className="absolute inset-0 m-auto w-full h-[1px] bg-stone-300 rotate-45"></div>
            </div>
            <span>Indisponible</span>
         </div>
      </div>
    </div>
  );
}
