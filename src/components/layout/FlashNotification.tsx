import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, CalendarDays } from 'lucide-react';
import { AvailabilityNotice, calendarService } from '../../services/calendarService';

export default function FlashNotification() {
  const [isVisible, setIsVisible] = useState(false);
  const [notice, setNotice] = useState<AvailabilityNotice | null>(null);

  useEffect(() => {
    let active = true;
    let hideTimer: number | undefined;
    const showAvailabilityNotice = async () => {
      const nextNotice = await calendarService.getAvailabilityNotice();
      if (!active) return;
      window.clearTimeout(hideTimer);
      if (!nextNotice) {
        setNotice(null);
        setIsVisible(false);
        return;
      }
      setNotice(nextNotice);
      setIsVisible(true);
      hideTimer = window.setTimeout(() => setIsVisible(false), 6000);
    };

    const initialTimer = window.setTimeout(showAvailabilityNotice, 3500);
    const interval = window.setInterval(showAvailabilityNotice, 90000);
    const unsubscribe = calendarService.subscribe(() => void showAvailabilityNotice());

    return () => {
      active = false;
      window.clearTimeout(initialTimer);
      window.clearTimeout(hideTimer);
      window.clearInterval(interval);
      unsubscribe();
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="fixed bottom-24 right-4 z-50 max-w-[calc(100vw-2rem)] border border-orange-700 bg-orange-800 text-stone-50 shadow-[10px_10px_0px_rgba(0,0,0,0.1)] md:right-8"
        >
          <Link to="/disponibilites" className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-orange-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-50">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
            >
              <Bell size={25} className="text-orange-200" />
            </motion.div>
            <div>
              <div className="font-bold uppercase tracking-widest text-xs text-orange-300 mb-1">{notice?.title}</div>
              <div className="font-serif text-orange-50 text-lg">{notice?.message}</div>
              <div className="mt-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-200"><CalendarDays size={13} /> Voir les dates</div>
            </div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
