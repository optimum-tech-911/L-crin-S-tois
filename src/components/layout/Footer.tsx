import React from 'react';
import { Link } from 'react-router-dom';
import { propertyData } from '../../data/property';
import { motion } from 'motion/react';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: false, amount: 0.7 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="mb-12 h-px origin-left bg-gradient-to-r from-gold-500 via-gold-300/50 to-transparent md:mb-16" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.4 }} className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-4"><img src="/brand/mark.png?v=2" alt="" className="h-12 w-12 rounded-full bg-stone-50 object-contain p-0.5" /><h3 className="text-stone-50 font-serif text-xl tracking-wide uppercase">{propertyData.shortName}</h3></div>
            <p className="text-sm">
              {propertyData.location}, {propertyData.country}
            </p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.4 }} transition={{ delay: 0.08 }}>
            <h4 className="text-stone-50 font-medium text-sm tracking-widest uppercase mb-6">Principal</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/appartement" className="inline-block hover:translate-x-1.5 hover:text-stone-50 transition-all">L'appartement</Link></li>
              <li><Link to="/galerie" className="inline-block hover:translate-x-1.5 hover:text-stone-50 transition-all">Galerie</Link></li>
              <li><Link to="/disponibilites" className="inline-block hover:translate-x-1.5 hover:text-stone-50 transition-all">Disponibilités</Link></li>
              <li><Link to="/disponibilites" className="inline-block hover:translate-x-1.5 hover:text-stone-50 transition-all">Réserver</Link></li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.4 }} transition={{ delay: 0.16 }}>
            <h4 className="text-stone-50 font-medium text-sm tracking-widest uppercase mb-6">Découvrir</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/sete" className="inline-block hover:translate-x-1.5 hover:text-stone-50 transition-all">Sète</Link></li>
              <li><Link to="/guide" className="inline-block hover:translate-x-1.5 hover:text-stone-50 transition-all">Guide</Link></li>
              <li><Link to="/partenaires" className="inline-block hover:translate-x-1.5 hover:text-stone-50 transition-all">Partenaires</Link></li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.25 }} transition={{ delay: 0.24 }} className="flex flex-col gap-12 md:gap-8">
            <div>
              <h4 className="text-stone-50 font-medium text-sm tracking-widest uppercase mb-6">Aide</h4>
              <ul className="space-y-4 text-sm">
                <li><Link to="/faq" className="hover:text-stone-50 transition-colors">FAQ</Link></li>
                <li><Link to="/contact" className="hover:text-stone-50 transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-stone-50 font-medium text-sm tracking-widest uppercase mb-6">Légal</h4>
              <ul className="space-y-4 text-sm">
                <li><Link to="/mentions-legales" className="hover:text-stone-50 transition-colors">Mentions légales</Link></li>
                <li><Link to="/confidentialite" className="hover:text-stone-50 transition-colors">Confidentialité</Link></li>
                <li><Link to="/conditions-de-reservation" className="hover:text-stone-50 transition-colors">Conditions de réservation</Link></li>
              </ul>
            </div>
          </motion.div>
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-stone-800 pt-8 sm:flex-row sm:items-center sm:justify-between" aria-label="Classement touristique">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500">Classement officiel</p>
            <p className="mt-1 font-serif text-lg text-stone-100">Meublé de tourisme · 2 étoiles</p>
            <p className="mt-1 text-xs text-stone-400">Classement attribué en 2023, valable jusqu’en 2028.</p>
          </div>
          <a href="/new-images/08-classement/classification-2-etoiles.jpeg" target="_blank" rel="noreferrer" className="group flex shrink-0 items-center gap-3 self-start sm:self-center" aria-label="Ouvrir le justificatif du classement deux étoiles">
            <img src="/new-images/08-classement/classification-2-etoiles.jpeg" alt="Justificatif du classement deux étoiles délivré par Atout France" className="w-24 border border-stone-700 bg-white p-1.5 transition group-hover:border-gold-400 sm:w-28" loading="lazy" />
            <span className="max-w-24 text-[10px] font-bold uppercase tracking-[0.12em] text-stone-400 transition group-hover:text-gold-300">Voir le justificatif</span>
          </a>
        </div>

        <div className="mt-16 pt-8 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between text-xs">
          <p>© {new Date().getFullYear()} {propertyData.name}. Tous droits réservés.</p>
          <a href="https://lecrinsetois.fr" className="mt-4 md:mt-0 hover:text-stone-50 transition-colors">lecrinsetois.fr</a>
        </div>
      </div>
    </footer>
  );
}
