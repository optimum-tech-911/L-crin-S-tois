import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { pricingData } from '../../data/pricing';
import { motion, AnimatePresence } from 'motion/react';

export default function StickyBookingBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down a bit
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="md:hidden fixed bottom-0 left-0 w-full bg-stone-50/95 backdrop-blur-md border-t border-stone-200 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] z-50 pb-[max(1rem,env(safe-area-inset-bottom))]"
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {pricingData.startingPrice ? (
                <>
                  <span className="text-sm font-medium text-stone-900">À partir de {pricingData.startingPrice} €</span>
                  <span className="text-xs text-stone-500">par nuit</span>
                </>
              ) : (
                <span className="text-sm font-medium text-stone-900">Tarifs et disponibilités</span>
              )}
            </div>
            <Link 
              to="/disponibilites" 
              className="bg-orange-800 text-stone-50 px-6 py-3 text-sm font-medium hover:bg-orange-900 active:scale-95 transition-all shadow-md"
            >
              Réserver
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
