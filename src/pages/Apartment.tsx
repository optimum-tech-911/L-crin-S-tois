import React from 'react';
import SEO from '../components/seo/SEO';
import { propertyData } from '../data/property';
import EditorialImageRotator from '../components/common/EditorialImageRotator';
import { heroImages, livingDiningImages, bedroomImages, bathroomImages, kitchenImages, balconyImages } from '../data/images';
import FadeIn from '../components/common/FadeIn';
import { Bath, Check, CookingPot, Snowflake, Sparkles, Tv, Waves } from 'lucide-react';
import { motion } from 'motion/react';

const amenityIcons = [CookingPot, Snowflake, Tv, Bath, Waves];

export default function Apartment() {
  const sections = [
    {
      id: 'living',
      title: 'Salon & Salle à manger',
      eyebrow: 'Pièce de vie',
      description: "Un espace de vie lumineux et confortable, pensé pour partager des moments conviviaux après une journée de découverte à Sète.",
      images: livingDiningImages,
    },
    {
      id: 'bedroom',
      title: 'La Chambre',
      eyebrow: 'Espace nuit',
      description: "Un cocon de douceur avec une literie de qualité hôtelière pour des nuits reposantes.",
      images: bedroomImages,
    },
    {
      id: 'bathroom',
      title: 'La Salle de bain',
      eyebrow: 'Salle d’eau',
      description: "Moderne et fonctionnelle, équipée d'une grande douche à l'italienne.",
      images: bathroomImages,
    },
    {
      id: 'kitchen',
      title: 'La Cuisine',
      eyebrow: 'Cuisine équipée',
      description: "Entièrement équipée pour préparer vos repas comme à la maison, avec des produits frais du marché.",
      images: kitchenImages,
    },
    {
      id: 'balcony',
      title: 'Le Balcon',
      eyebrow: 'Extérieur',
      description: "Profitez de l'air marin et de la vue dès le petit matin sur notre balcon aménagé.",
      images: balconyImages,
    }
  ];

  return (
    <>
      <SEO 
        title={`L'appartement | ${propertyData.name} — Sète`}
        description="Appartement climatisé et rénové à Sète avec chambre séparée, cuisine équipée, lave-linge, Wi-Fi, TV 4K, Disney+ et balcon."
      />
      <section className="overflow-hidden bg-[#f7f5f0] pb-20 pt-32 md:pb-28 md:pt-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative grid items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-0">
            <FadeIn direction="right" className="relative z-20 lg:translate-x-8">
              <div className="bg-[#f7f5f0] py-6 lg:py-14 lg:pr-14">
                <span className="mb-6 block text-sm font-medium uppercase tracking-widest text-gold-700">L'appartement</span>
                <h1 className="font-serif text-4xl leading-tight text-stone-900 md:text-6xl">
                  Un espace pensé <br className="hidden md:block" />
                  <span className="font-light italic text-gold-800">pour votre confort.</span>
                </h1>
                <p className="mt-8 max-w-xl text-lg font-light leading-relaxed text-stone-600">{propertyData.longDescription}</p>
              </div>
            </FadeIn>
            <FadeIn direction="left" className="relative lg:-ml-14">
              <div className="absolute -bottom-6 -right-6 h-3/4 w-3/4 bg-gold-100 md:-bottom-10 md:-right-10" aria-hidden="true" />
              <EditorialImageRotator images={heroImages} eager interval={6500} className="relative aspect-[4/3] shadow-[0_30px_65px_rgba(41,37,36,0.17)] [clip-path:polygon(6%_0,100%_0,100%_94%,94%_100%,0_100%,0_6%)]" />
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-20 md:py-28">
        <div className="absolute -right-20 top-8 h-72 w-72 rounded-full bg-gold-100/60 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="grid gap-7 border-b border-stone-200 pb-10 md:grid-cols-[0.7fr_1.3fr] md:items-end">
            <div><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-gold-700"><Sparkles size={16} /> Tout est prêt</p><h2 className="mt-3 font-serif text-4xl text-stone-950 md:text-5xl">Les équipements</h2></div>
            <p className="max-w-2xl text-lg font-light leading-relaxed text-stone-600">Du café du matin à la soirée devant un film, l’appartement est équipé pour vous permettre de voyager léger et de vous sentir rapidement chez vous.</p>
          </FadeIn>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {propertyData.amenities.map((category, index) => {
              const Icon = amenityIcons[index] ?? Check;
              return <FadeIn key={category.category} delay={(index % 3) * 0.07} className="h-full">
                <motion.article whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 210, damping: 22 }} className="group h-full border border-stone-200 bg-[#faf9f6] p-6 transition-colors hover:border-gold-400 hover:bg-[#fffaf0] sm:p-7">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold-300 bg-white text-gold-800 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-105"><Icon size={22} strokeWidth={1.6} /></div>
                  <h3 className="mt-5 font-serif text-2xl text-stone-950">{category.category}</h3>
                  <ul className="mt-5 grid gap-2.5 text-sm text-stone-600">
                    {category.items.map((item) => <li key={item} className="flex items-start gap-2"><Check className="mt-0.5 shrink-0 text-gold-700" size={15} /><span>{item}</span></li>)}
                  </ul>
                </motion.article>
              </FadeIn>;
            })}
          </div>
        </div>
      </section>
      
      <section className="bg-stone-50 py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-24 md:gap-36">
            {sections.map((section, index) => {
              if (!section.images || section.images.length === 0) return null;
              
              const isEven = index % 2 === 0;
              
              return (
                <div key={section.id} className="relative grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-0">
                  <FadeIn 
                    direction={isEven ? "right" : "left"} 
                    className={`relative z-20 ${isEven ? 'lg:order-1 lg:col-span-5 lg:translate-x-8' : 'lg:order-2 lg:col-span-5 lg:-translate-x-8'}`}
                  >
                    <div className={`relative max-w-md bg-stone-50 py-7 ${isEven ? 'lg:pr-12' : 'lg:pl-12 lg:ml-auto'}`}>
                      <div className="relative z-10">
                      <div className="mb-5 flex items-center gap-3"><div className="h-px w-10 bg-gold-500" aria-hidden="true" /><p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-700">{section.eyebrow}</p></div>
                      <h2 className="mb-6 text-3xl font-serif text-stone-900 md:text-4xl">{section.title}</h2>
                      <p className="text-lg font-light leading-relaxed text-stone-600">
                        {section.description}
                      </p>
                      </div>
                    </div>
                  </FadeIn>
                  
                  <FadeIn 
                    direction={isEven ? "left" : "right"} 
                    className={`relative ${isEven ? 'lg:order-2 lg:col-span-7' : 'lg:order-1 lg:col-span-7'}`}
                  >
                    <div className={`absolute top-8 h-[calc(100%-4rem)] w-4/5 bg-gold-100 ${isEven ? '-right-7' : '-left-7'}`} aria-hidden="true" />
                    <EditorialImageRotator 
                      images={section.images} 
                      interval={6000 + (index * 500)} // slight variation in timing
                      className={`relative aspect-[4/3] overflow-hidden shadow-[0_26px_55px_rgba(41,37,36,0.15)] md:aspect-[16/10] ${isEven ? '[clip-path:polygon(5%_0,100%_0,100%_93%,95%_100%,0_100%,0_7%)]' : '[clip-path:polygon(0_0,95%_0,100%_7%,100%_100%,5%_100%,0_93%)]'}`}
                    />
                  </FadeIn>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
