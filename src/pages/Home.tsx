import React from 'react';
import SEO from '../components/seo/SEO';
import { propertyData } from '../data/property';
import EditorialImageRotator from '../components/common/EditorialImageRotator';
import HeroCarousel from '../components/common/HeroCarousel';
import { heroImages, livingDiningImages, seteImages, bedroomImages, bathroomImages, kitchenImages, balconyImages } from '../data/images';
import FadeIn from '../components/common/FadeIn';
import { Link } from 'react-router-dom';
import { pricingData } from '../data/pricing';
import { siteData } from '../data/site';
import { motion } from 'motion/react';
import ReviewsSection from '../components/common/ReviewsSection';
import { ArrowUpRight, ChevronDown, Images } from 'lucide-react';

export default function Home() {
  const propertyFacts = [
    { label: 'Localisation', value: 'Sète, Hérault' },
    { label: 'Type', value: 'Appartement' },
    ...(propertyData.maxGuests ? [{ label: 'Voyageurs', value: `${propertyData.maxGuests} max.` }] : []),
    ...(propertyData.bedrooms ? [{ label: 'Chambre', value: String(propertyData.bedrooms) }] : []),
    ...(propertyData.areaSqm ? [{ label: 'Superficie', value: `${propertyData.areaSqm} m²` }] : []),
  ];

  return (
    <>
      <SEO 
        title="Hébergement à Sète | Appartement 2 étoiles | L’Écrin Sétois"
        description="Alternative à l’hôtel à Sète : L’Écrin Sétois est un appartement de vacances classé meublé de tourisme 2 étoiles, avec chambre, cuisine et balcon."
        structuredData={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: propertyData.name,
            url: siteData.url,
            inLanguage: 'fr-FR',
            publisher: {
              '@type': 'Organization',
              name: propertyData.name,
              url: siteData.url,
              logo: { '@type': 'ImageObject', url: `${siteData.url}/brand/mark.png?v=2` },
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'VacationRental',
            '@id': `${siteData.url}/#hebergement`,
            identifier: propertyData.id,
            additionalType: 'Apartment',
            name: propertyData.name,
            description: propertyData.shortDescription,
            url: siteData.url,
            image: [heroImages[0], ...livingDiningImages.slice(0, 2), ...bedroomImages.slice(0, 2), ...bathroomImages.slice(0, 2), kitchenImages[0], balconyImages[0]].map((photo) => `${siteData.url}${photo.src}`),
            email: siteData.contactEmail,
            starRating: { '@type': 'Rating', ratingValue: 2 },
            address: {
              '@type': 'PostalAddress',
              addressLocality: propertyData.location,
              addressRegion: propertyData.region,
              addressCountry: 'FR',
            },
            numberOfBedrooms: propertyData.bedrooms,
            numberOfBathroomsTotal: propertyData.bathrooms,
            amenityFeature: propertyData.amenities.flatMap((category) => category.items.map((item) => ({
              '@type': 'LocationFeatureSpecification',
              name: item,
              value: true,
            }))),
          },
        ]}
      />
      
      {/* 01 — HERO (Full bleed) */}
      <section className="relative h-[100svh] min-h-[620px] flex items-end overflow-hidden bg-stone-900">
        <HeroCarousel images={heroImages} className="z-0" />
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-stone-950/95 via-stone-900/48 to-stone-950/25"></div>
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-stone-950/35 via-transparent to-transparent"></div>
        <div className="relative z-20 w-full pb-24 sm:pb-20 md:pb-32">
          <FadeIn className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-stone-50">
            <span className="text-sm font-medium tracking-widest uppercase mb-4 block text-orange-400">
              {propertyData.location} · Méditerranée
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif leading-[1.05] max-w-3xl">
              <span className="block italic text-orange-200 font-light mb-2">L'art de vivre.</span>
              {propertyData.tagline}
            </h1>
            <p className="mt-5 md:mt-6 text-base sm:text-lg md:text-xl max-w-xl text-stone-200 font-light leading-relaxed">
              L’Écrin Sétois est un appartement de location saisonnière à Sète.
            </p>
            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <Link
                to="/disponibilites"
                className="group inline-flex min-h-14 items-center justify-center gap-3 bg-orange-700 px-6 py-4 text-sm font-semibold uppercase tracking-wider text-stone-50 shadow-lg transition-all duration-300 hover:bg-orange-600 hover:shadow-orange-950/30 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-200 active:scale-[0.98]"
              >
                Réserver votre séjour
                <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/galerie"
                className="group inline-flex min-h-14 items-center justify-center gap-3 border border-stone-50/80 bg-stone-950/15 px-6 py-4 text-sm font-semibold uppercase tracking-wider text-stone-50 backdrop-blur-[2px] transition-all duration-300 hover:border-stone-50 hover:bg-stone-50 hover:text-stone-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-50 active:scale-[0.98]"
              >
                Voir les photos
                <Images size={18} className="transition-transform duration-300 group-hover:scale-110" />
              </Link>
            </div>
            <p className="mt-5 text-xs font-medium uppercase tracking-[0.14em] text-stone-200/85">
              Réservation directe · Contact avec votre hôte
            </p>
          </FadeIn>
        </div>
        <motion.div
          animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-stone-300 z-30"
        >
          <ChevronDown size={32} />
        </motion.div>
      </section>

      {/* QUICK BOOKING BAR */}
      <section className="bg-orange-900 text-stone-50 py-6 border-b border-orange-950 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-800/40 via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.5 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-wrap gap-6 text-sm font-medium items-center">
                 {pricingData.startingPrice ? (
                   <span>À partir de {pricingData.startingPrice} € / nuit</span>
                 ) : (
                   <span>Tarifs et disponibilités</span>
                 )}
                 <div className="hidden md:flex gap-4 text-stone-400 font-normal">
                    <span>Réservation directe</span>
                    <span>•</span>
                    <span>Contact avec votre hôte</span>
                    <span>•</span>
                    <span>Conditions transparentes</span>
                 </div>
              </div>
              <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }} className="w-full md:w-auto"><Link to="/disponibilites" className="block w-full bg-stone-50 px-8 py-3 text-center text-sm font-medium uppercase tracking-wide text-orange-950 shadow-[4px_4px_0px_rgba(0,0,0,0.2)] transition-all hover:bg-stone-200 md:w-auto">Vérifier les disponibilités</Link></motion.div>
           </motion.div>
        </div>
      </section>

      {/* 02 — L'ÉCRIN SÉTOIS EN BREF */}
      <section className="border-b border-stone-200 bg-stone-50 py-14 md:py-20" itemScope itemType="https://schema.org/LodgingBusiness">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center lg:gap-12">
               <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-700">En quelques mots</p><h2 className="mt-3 font-serif text-3xl text-stone-900" itemProp="name">L’Écrin Sétois</h2></div>
               <div className="grid grid-cols-2 border-y border-stone-200 sm:grid-cols-3 md:grid-cols-5">
                 {propertyFacts.map((fact, index) => (
                   <motion.div key={fact.label} whileHover={{ y: -4, backgroundColor: 'rgba(176, 202, 223, 0.28)' }} transition={{ duration: 0.25 }} className="group min-w-0 border-r border-stone-200 px-3 py-5 last:border-r-0 sm:px-4 md:py-6">
                     <span className="block text-[10px] font-bold uppercase tracking-[0.13em] text-stone-400 transition-colors group-hover:text-gold-700">{fact.label}</span>
                     <span className="mt-2 block truncate font-serif text-base text-stone-900" itemProp={index === 0 ? 'address' : undefined}>{fact.value}</span>
                   </motion.div>
                 ))}
               </div>
            </FadeIn>
         </div>
      </section>

      {/* 03 — INTRODUCTION */}
      <section className="overflow-hidden bg-[#f7f5f0] py-20 md:py-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative grid grid-cols-1 items-center gap-8 md:grid-cols-[0.82fr_1.18fr] md:gap-0">
            <FadeIn direction="right" className="relative z-20 md:translate-x-8 lg:translate-x-14">
              <div className="relative bg-[#f7f5f0] py-8 md:py-14 md:pr-10 lg:pr-16">
                <div className="absolute -left-7 -top-12 select-none font-serif text-[10rem] italic leading-none text-gold-200/45 md:-left-12 md:-top-16 md:text-[13rem]">A</div>
                <div className="relative z-10">
                  <span className="mb-6 block text-sm font-medium uppercase tracking-widest text-gold-700">L'appartement</span>
                  <h2 className="mb-8 text-3xl font-serif leading-tight text-stone-900 md:text-5xl">
                  Plus qu'un logement, <br className="hidden md:block" />
                    <span className="font-light italic text-gold-800">votre adresse à Sète.</span>
                  </h2>
                </div>
                <div className="relative z-10 max-w-lg text-lg font-light leading-relaxed text-stone-600">
                  <p>{propertyData.longDescription}</p>
                  <p className="mt-5">Vous cherchez un hôtel à Sète ? L’Écrin Sétois offre un séjour indépendant dans un appartement classé meublé de tourisme 2 étoiles.</p>
                </div>
                <div className="relative z-10 mt-12 inline-block">
                  <Link to="/appartement" className="group border-b border-gold-900 pb-1 text-sm font-medium uppercase tracking-widest text-gold-900 transition-colors hover:border-gold-600 hover:text-gold-600">
                    Découvrir l'appartement
                  </Link>
                </div>
              </div>
            </FadeIn>
            <FadeIn direction="left" className="relative md:-ml-16 lg:-ml-28">
              <div className="absolute -inset-x-5 bottom-8 top-8 bg-gold-200/45 md:-right-10 md:left-20" aria-hidden="true" />
              <EditorialImageRotator 
                images={livingDiningImages} 
                interval={7000} 
                className="relative aspect-[4/5] shadow-[0_30px_60px_rgba(41,37,36,0.16)] [clip-path:polygon(7%_0,100%_0,100%_93%,93%_100%,0_100%,0_7%)]"
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 04 — EXPERIENCE / WHY THIS PROPERTY */}
      <section className="bg-stone-100 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <FadeIn className="mb-10 max-w-xl">
             <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-700">L’essentiel du séjour</p>
             <h2 className="mt-3 font-serif text-3xl text-stone-900 md:text-4xl">Ici, on prend le temps.</h2>
           </FadeIn>
           <div className="grid gap-8 md:grid-cols-3 md:gap-12">
              {[
                { title: 'Une adresse bien située', copy: "Le calme d’un quartier vivant, à proximité des canaux et des adresses sétoises." },
                { title: 'Le confort au quotidien', copy: 'Une literie de qualité et des équipements choisis pour se sentir bien après une journée dehors.' },
                { title: 'Votre rythme, simplement', copy: 'Une arrivée autonome, une cuisine équipée et la liberté d’organiser vos journées comme vous le souhaitez.' },
              ].map(({ title, copy }, index) => (
                <FadeIn key={title} delay={0.1 + index * 0.1}>
                  <motion.article whileHover={{ x: 7 }} whileTap={{ scale: 0.99 }} transition={{ type: 'spring', stiffness: 220, damping: 20 }} className="group border-l border-gold-500 pl-5 sm:pl-6">
                    <h3 className="font-serif text-2xl text-stone-900">{title}</h3>
                    <p className="mt-4 font-light leading-relaxed text-stone-600">{copy}</p>
                    <div className="mt-5 h-px w-10 bg-gold-500 transition-all duration-500 group-hover:w-20" />
                  </motion.article>
                </FadeIn>
              ))}
           </div>
        </div>
      </section>

      {/* 05 — GALLERY TEASER */}
      <section className="overflow-hidden bg-stone-50 py-20 md:py-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <FadeIn className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                 <h2 className="text-3xl md:text-5xl font-serif text-stone-900 leading-tight">En images</h2>
              </div>
              <Link to="/galerie" className="group text-stone-900 font-medium uppercase tracking-widest text-sm transition-colors border-b border-stone-900 pb-1 hover:text-stone-500 hover:border-stone-500">
                 Voir la galerie complète
              </Link>
           </FadeIn>
           <div className="relative">
              <div className="absolute -left-8 top-16 h-2/3 w-1/2 bg-gold-100 md:-left-20" aria-hidden="true" />
              <div className="relative grid grid-cols-1 gap-4 md:grid-cols-12">
              <FadeIn direction="up" delay={0.1} className="md:col-span-8 md:translate-y-8">
                 <EditorialImageRotator images={heroImages} interval={6500} className="h-[400px] shadow-[0_24px_50px_rgba(41,37,36,0.13)] [clip-path:polygon(0_0,100%_0,100%_92%,96%_100%,0_100%)]" />
              </FadeIn>
              <FadeIn direction="up" delay={0.2} className="md:col-span-4 flex flex-col gap-4">
                 <EditorialImageRotator images={bedroomImages} interval={7200} className="aspect-square shadow-[0_18px_40px_rgba(41,37,36,0.1)]" />
                 <EditorialImageRotator images={balconyImages} interval={8100} className="min-h-[150px] flex-1 shadow-[0_18px_40px_rgba(41,37,36,0.1)]" />
              </FadeIn>
              </div>
           </div>
        </div>
      </section>

      {/* 07 — DIRECT BOOKING VALUE */}
      <section className="bg-stone-950 py-20 text-stone-50 md:py-28">
         <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="grid items-end gap-10 border-b border-stone-700 pb-10 md:grid-cols-[1.1fr_0.9fr] md:gap-16 md:pb-12">
              <div>
                <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-gold-300">Réservation directe</p>
                <h2 className="font-serif text-4xl leading-tight md:text-6xl">Réservez ici,<br/><span className="font-light italic text-gold-300">simplement.</span></h2>
              </div>
              <div><p className="max-w-md font-light leading-relaxed text-stone-300">Consultez les dates, choisissez votre séjour et envoyez votre demande directement depuis le site.</p><Link to="/disponibilites" className="group mt-7 inline-flex min-h-14 items-center justify-center gap-3 bg-gold-400 px-7 py-4 text-sm font-bold uppercase tracking-wider text-stone-950 transition hover:bg-gold-300 active:scale-[0.98]">Voir les disponibilités <ArrowUpRight size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link></div>
            </FadeIn>
            <div className="mt-10 grid gap-7 sm:grid-cols-3 sm:gap-10">
              {[
                { title: 'Dates visibles', copy: 'Les dates indisponibles sont indiquées directement dans le calendrier.' },
                { title: 'Contact direct', copy: 'Votre demande est adressée à votre hôte, sans intermédiaire.' },
                { title: 'Sans engagement', copy: 'La demande de réservation ne confirme pas votre séjour.' },
              ].map(({ title, copy }, index) => <FadeIn key={title} delay={0.15 + index * 0.1}><motion.div whileHover={{ x: 7 }} whileTap={{ scale: 0.99 }} transition={{ type: 'spring', stiffness: 220, damping: 20 }} className="group border-l border-gold-500 pl-5"><h4 className="font-serif text-xl text-stone-50">{title}</h4><p className="mt-2 text-sm font-light leading-relaxed text-stone-300">{copy}</p><div className="mt-5 h-px w-10 bg-gold-300 transition-all duration-500 group-hover:w-20" /></motion.div></FadeIn>)}
            </div>
         </div>
      </section>

      <ReviewsSection />

      {/* 08 — SÈTE / DESTINATION */}
      <section className="overflow-hidden bg-[#f7f5f0] py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="relative grid grid-cols-1 items-center gap-8 md:grid-cols-[1.18fr_0.82fr] md:gap-0">
              <FadeIn direction="right" className="relative order-2 md:order-1 md:-mr-20 lg:-mr-32">
                 <div className="absolute -bottom-8 -left-8 h-1/2 w-2/3 border border-gold-300/70 md:-bottom-12 md:-left-12" aria-hidden="true" />
                 <EditorialImageRotator images={seteImages} interval={6000} className="relative aspect-[4/5] shadow-[0_30px_60px_rgba(41,37,36,0.16)] [clip-path:polygon(0_0,93%_0,100%_7%,100%_100%,7%_100%,0_93%)]" />
              </FadeIn>
              <FadeIn direction="left" className="relative z-20 order-1 md:order-2 md:-translate-x-4 lg:-translate-x-10">
                 <div className="relative bg-[#f7f5f0] py-8 md:py-14 md:pl-12 lg:pl-16">
                   <div className="absolute -left-10 -top-16 select-none font-serif text-[12rem] italic leading-none text-gold-200/50 md:-left-16 md:-top-24 md:text-[16rem]">S</div>
                   <div className="relative z-10">
                   <span className="mb-6 block text-sm font-medium uppercase tracking-widest text-gold-700">Sète</span>
                   <h2 className="mb-8 text-3xl font-serif leading-tight text-stone-900 md:text-5xl">
                     Une ville à vivre, <br className="hidden md:block" />
                     <span className="font-light italic text-gold-800">pas seulement à visiter.</span>
                   </h2>
                   <p className="mb-12 text-lg font-light leading-relaxed text-stone-600">
                     Nichée entre l'étang de Thau et la mer Méditerranée, Sète est une presqu'île singulière. Découvrez son port animé, ses plages de sable fin, ses halles authentiques et l'ascension mythique du Mont Saint-Clair.
                   </p>
                   <Link to="/sete" className="group border-b border-gold-900 pb-1 text-sm font-medium uppercase tracking-widest text-gold-900 transition-colors hover:border-gold-600 hover:text-gold-600">
                     Découvrir notre guide local
                   </Link>
                   </div>
                 </div>
              </FadeIn>
           </div>
        </div>
      </section>

      {/* 13 — FINAL CTA */}
      <section className="relative py-32 md:py-48 flex items-center justify-center text-center overflow-hidden">
         <div className="absolute inset-0 z-0 bg-stone-900">
            {heroImages.length > 0 && (
               <img src={heroImages[0].src} alt={heroImages[0].alt} className="h-full w-full object-cover opacity-40 animate-ken-burns" />
            )}
         </div>
         <div className="absolute inset-0 bg-stone-900/40 z-10"></div>
         <div className="relative z-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-stone-50">
            <FadeIn>
              <h2 className="text-4xl md:text-6xl font-serif mb-12">Sète vous attend.</h2>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                 <Link to="/disponibilites" className="w-full sm:w-auto bg-stone-50 text-stone-900 px-8 py-4 font-medium hover:-translate-y-1 hover:bg-stone-200 hover:shadow-xl transition-all active:scale-95 uppercase tracking-widest text-sm">
                   Vérifier mes dates
                 </Link>
                 <Link to="/contact" className="w-full sm:w-auto bg-transparent border border-stone-50 text-stone-50 px-8 py-4 font-medium hover:-translate-y-1 hover:bg-stone-50/10 transition-all active:scale-95 uppercase tracking-widest text-sm">
                   Nous contacter
                 </Link>
              </div>
            </FadeIn>
         </div>
      </section>
    </>
  );
}
