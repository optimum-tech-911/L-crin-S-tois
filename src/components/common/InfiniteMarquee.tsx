import React from 'react';
import { motion } from 'motion/react';

export default function InfiniteMarquee() {
  return (
    <div className="w-full bg-orange-900 text-orange-200 py-3 overflow-hidden flex border-b border-orange-950">
      <motion.div
        className="flex whitespace-nowrap text-xs font-medium uppercase tracking-[0.2em]"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ ease: "linear", duration: 25, repeat: Infinity }}
      >
        <div className="flex gap-12 px-6">
           <span>Réservez en direct au meilleur tarif</span>
           <span>•</span>
           <span>Séjour inoubliable à Sète</span>
           <span>•</span>
           <span>Vue imprenable sur la Méditerranée</span>
           <span>•</span>
           <span>Confort absolu</span>
           <span>•</span>
           <span>Réservez en direct au meilleur tarif</span>
           <span>•</span>
           <span>Séjour inoubliable à Sète</span>
           <span>•</span>
           <span>Vue imprenable sur la Méditerranée</span>
           <span>•</span>
           <span>Confort absolu</span>
           <span>•</span>
        </div>
        <div className="flex gap-12 px-6">
           <span>Réservez en direct au meilleur tarif</span>
           <span>•</span>
           <span>Séjour inoubliable à Sète</span>
           <span>•</span>
           <span>Vue imprenable sur la Méditerranée</span>
           <span>•</span>
           <span>Confort absolu</span>
           <span>•</span>
           <span>Réservez en direct au meilleur tarif</span>
           <span>•</span>
           <span>Séjour inoubliable à Sète</span>
           <span>•</span>
           <span>Vue imprenable sur la Méditerranée</span>
           <span>•</span>
           <span>Confort absolu</span>
           <span>•</span>
        </div>
      </motion.div>
    </div>
  );
}
