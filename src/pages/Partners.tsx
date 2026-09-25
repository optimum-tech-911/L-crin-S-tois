import { useEffect, useState } from 'react';
import { Gift, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import SEO from '../components/seo/SEO';
import FadeIn from '../components/common/FadeIn';
import { partnerService } from '../services/partnerService';
import { Partner } from '../types';
import { partnersData } from '../data/partners';

export default function Partners() {
  const [partners, setPartners] = useState<Partner[]>(partnersData);

  useEffect(() => {
    let active = true;
    const refresh = () => partnerService.getPartners().then((items) => active && setPartners(items)).catch(() => active && setPartners(partnersData));
    void refresh();
    const unsubscribe = partnerService.subscribe(refresh);
    return () => { active = false; unsubscribe(); };
  }, []);

  return (
    <>
      <SEO
        title="Partenaires et avantages locaux | L’Écrin Sétois"
        description="Découvrez les adresses partenaires de L’Écrin Sétois et les avantages réservés à nos voyageurs pendant leur séjour à Sète."
      />
      <section className="bg-[#f7f5f0] pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <span className="mb-6 block text-sm font-bold uppercase tracking-[0.18em] text-gold-700">Nos bonnes adresses</span>
            <h1 className="font-serif text-4xl leading-tight text-stone-950 md:text-6xl">Des rencontres locales,<br className="hidden md:block" /> <span className="font-light italic text-gold-800">un accueil plus personnel.</span></h1>
            <p className="mt-7 max-w-2xl text-lg font-light leading-relaxed text-stone-600 md:text-xl">Des commerces de quartier aux lieux culturels, retrouvez nos adresses partenaires et les informations utiles pour profiter de votre séjour à Sète.</p>
          </FadeIn>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {partners.length ? <div className="space-y-7">
            {partners.map((partner, index) => (
              <FadeIn key={partner.id} delay={index * 0.08}>
                <motion.article whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 200, damping: 22 }} className="grid overflow-hidden border border-stone-200 bg-[#faf9f6] shadow-[0_16px_42px_rgba(41,37,36,0.07)] md:grid-cols-[0.62fr_1.38fr]">
                  <div className="flex min-h-56 flex-col justify-between bg-stone-950 p-7 text-stone-50 md:p-9">
                    <div><p className="text-xs font-bold uppercase tracking-[0.17em] text-gold-300">{partner.category}</p><h2 className="mt-4 font-serif text-3xl">{partner.name}</h2></div>
                    {partner.offer && <div className="mt-8 border-t border-stone-700 pt-6"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-gold-300"><Gift size={17} /> Avantage voyageur</p><p className="mt-2 font-serif text-2xl">{partner.offer}</p></div>}
                  </div>
                  <div className="flex flex-col justify-center p-7 md:p-10 lg:p-12">
                    <p className="text-lg font-medium leading-relaxed text-stone-800">{partner.shortDescription}</p>
                    {partner.description && <p className="mt-4 max-w-2xl font-light leading-relaxed text-stone-600">{partner.description}</p>}
                    {partner.address && <p className="mt-5 flex items-center gap-2 text-sm text-stone-500"><MapPin size={16} /> {partner.address}</p>}
                    {partner.website && <a href={partner.website} target="_blank" rel="noreferrer" className="mt-7 self-start border-b border-gold-800 pb-1 text-xs font-bold uppercase tracking-[0.15em] text-gold-800">Découvrir l’adresse</a>}
                  </div>
                </motion.article>
              </FadeIn>
            ))}
          </div> : <FadeIn><div className="border border-dashed border-stone-300 p-10 text-center text-stone-500">Les prochaines adresses partenaires seront ajoutées ici.</div></FadeIn>}
          <p className="mt-8 text-xs leading-relaxed text-stone-500">Les éventuelles offres commerciales sont proposées par les partenaires selon leurs conditions et peuvent évoluer. Pensez à préciser que vous séjournez à L’Écrin Sétois.</p>
        </div>
      </section>
    </>
  );
}
