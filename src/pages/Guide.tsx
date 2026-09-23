import { ArrowUpRight, CarFront, Footprints, MapPin, Mountain, ParkingCircle, Sunrise, Utensils, Waves } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import SEO from '../components/seo/SEO';
import FadeIn from '../components/common/FadeIn';
import { nearbyPlaces, parkingTips, saintClairWalk } from '../data/nearby';
import { cityMoments, destinationPhotoCredits } from '../data/destination';
import { propertyData } from '../data/property';

const guideStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Guide local de Sète depuis L’Écrin Sétois',
  itemListElement: [...nearbyPlaces, ...cityMoments].map((place, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: 'category' in place ? place.name : place.title,
    url: 'category' in place ? place.website : place.link,
  })),
};

const dayPlan = [
  { time: '08:30', label: 'Marcher', title: 'Les quais avant la foule', copy: 'Commencez au bord de l’eau, traversez les ponts et laissez les canaux donner le tempo.', icon: Sunrise },
  { time: '11:30', label: 'Goûter', title: 'Les Halles de Sète', copy: 'Poissons, coquillages, tielles et produits du pays : une pause qui se choisit au comptoir.', icon: Utensils },
  { time: '16:00', label: 'Choisir', title: 'Culture ou horizon', copy: 'Une exposition, un spectacle, une promenade sur les quais ou une escapade vers le lido.', icon: Waves },
  { time: '19:00', label: 'Respirer', title: 'Le panorama du mont', copy: 'Montez quand la lumière baisse : la ville se lit alors entre lagune, toits et Méditerranée.', icon: Mountain },
];

export default function Guide() {
  return (
    <>
      <SEO
        title={`Guide local de Sète : que faire et où aller | ${propertyData.name}`}
        description="Un guide pratique et sensible depuis L’Écrin Sétois : journée à pied, Halles, canaux, mont Saint-Clair, lido, culture et stationnement."
        structuredData={guideStructuredData}
      />

      <section className="overflow-hidden bg-[#f7f5f0] pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:items-center lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:px-8">
          <FadeIn direction="right" className="relative z-10">
            <MapPin className="absolute -left-12 -top-16 hidden text-gold-200/70 md:block" size={160} strokeWidth={0.65} aria-hidden="true" />
            <p className="relative text-xs font-bold uppercase tracking-[0.2em] text-gold-700">Le carnet de l’hôte</p>
            <h1 className="relative mt-5 font-serif text-5xl leading-[1.02] text-stone-950 md:text-7xl">Vivre Sète<br /><span className="font-light italic text-gold-800">au bon moment.</span></h1>
            <p className="mt-7 max-w-xl text-lg font-light leading-relaxed text-stone-600 md:text-xl">Un itinéraire né de l’adresse : quelques minutes à pied, une bonne lumière, une table locale et toujours une raison de ralentir.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link to="/partenaires" className="inline-flex min-h-13 items-center justify-center gap-2 bg-gold-800 px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-gold-700">Nos adresses partenaires <ArrowUpRight size={17} /></Link><a href="https://www.tourisme-sete.com/" target="_blank" rel="noreferrer" className="inline-flex min-h-13 items-center justify-center gap-2 border border-stone-300 px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-stone-800 transition hover:border-gold-700 hover:text-gold-800">Agenda officiel <ArrowUpRight size={17} /></a></div>
          </FadeIn>
          <FadeIn direction="left" className="relative">
            <div className="absolute -bottom-6 -right-6 h-2/3 w-2/3 bg-gold-100" aria-hidden="true" />
            <img src="/optimized-images/sete-lido.jpg" alt="Le lido de Thau et le mont Saint-Clair" className="relative aspect-[4/3] w-full object-cover shadow-[0_28px_65px_rgba(41,37,36,0.16)] [clip-path:polygon(5%_0,100%_0,100%_94%,94%_100%,0_100%,0_6%)]" />
            <div className="absolute bottom-5 left-5 bg-stone-950/80 px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] text-gold-200 backdrop-blur-sm">Entre lagune et mer</div>
          </FadeIn>
        </div>
      </section>

      <section className="bg-stone-950 py-20 text-stone-50 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-300">Une journée sans voiture</p><h2 className="mt-3 font-serif text-4xl md:text-5xl">Le rythme que l’on vous souhaite.</h2></div><p className="max-w-sm text-sm leading-relaxed text-stone-400">Les horaires sont indicatifs : gardez de la place pour l’imprévu.</p></FadeIn>
          <div className="grid gap-px overflow-hidden border border-stone-800 bg-stone-800 sm:grid-cols-2 lg:grid-cols-4">
            {dayPlan.map(({ time, label, title, copy, icon: Icon }, index) => <FadeIn key={title} delay={index * 0.07} className="h-full"><motion.article whileHover={{ y: -5 }} className="group h-full bg-stone-950 p-6 transition-colors hover:bg-stone-900 sm:p-7"><div className="flex items-center justify-between"><span className="font-serif text-2xl text-gold-300">{time}</span><Icon className="text-stone-500 transition-colors group-hover:text-gold-300" size={21} strokeWidth={1.4} /></div><p className="mt-8 text-[10px] font-bold uppercase tracking-[0.18em] text-gold-300">{label}</p><h3 className="mt-2 font-serif text-2xl text-stone-50">{title}</h3><p className="mt-4 text-sm font-light leading-relaxed text-stone-400">{copy}</p></motion.article></FadeIn>)}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="mb-12 max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-700">Selon votre humeur</p><h2 className="mt-3 font-serif text-4xl leading-tight text-stone-950 md:text-5xl">Quatre manières de rencontrer la ville.</h2></FadeIn>
          <div className="grid gap-5 md:grid-cols-2">
            {cityMoments.map((moment, index) => <FadeIn key={moment.id} delay={index * 0.06}><motion.article whileHover={{ y: -5 }} className="group grid overflow-hidden border border-stone-200 bg-[#faf9f6] sm:grid-cols-[0.9fr_1.1fr]"><div className="overflow-hidden"><img src={moment.image} alt={moment.imageAlt} loading="lazy" className="h-full min-h-56 w-full object-cover transition duration-700 group-hover:scale-[1.045]" /></div><div className="flex flex-col justify-center p-6 sm:p-7"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-700">{moment.eyebrow}</p><h3 className="mt-3 font-serif text-2xl leading-tight text-stone-950">{moment.title}</h3><p className="mt-3 text-sm font-light leading-relaxed text-stone-600">{moment.description}</p><a href={moment.link} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 self-start border-b border-gold-800 pb-1 text-xs font-bold uppercase tracking-[0.12em] text-gold-800">{moment.linkLabel} <ArrowUpRight size={14} /></a></div></motion.article></FadeIn>)}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f5f0] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="mb-10 flex flex-col gap-4 border-b border-stone-200 pb-7 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-700">Depuis l’appartement</p><h2 className="mt-3 font-serif text-4xl text-stone-950 md:text-5xl">Les essentiels à pied.</h2></div><p className="max-w-sm text-sm leading-relaxed text-stone-500">Temps et distances approximatifs, à prendre comme des repères et non comme une promesse d’itinéraire.</p></FadeIn>
          <div className="grid gap-px overflow-hidden border border-stone-200 bg-stone-200 sm:grid-cols-2 lg:grid-cols-3">
            {nearbyPlaces.map((place, index) => <FadeIn key={place.id} delay={(index % 3) * 0.06} className="h-full"><motion.article whileHover={{ y: -5 }} className="group flex h-full min-h-60 flex-col bg-white p-6 transition-colors hover:bg-[#fffaf0] sm:p-7"><div className="flex items-start justify-between gap-3"><span className="text-[10px] font-bold uppercase tracking-[0.17em] text-gold-700">{place.category}</span><span className="flex shrink-0 items-center gap-1.5 rounded-full border border-gold-300/70 bg-[#fffaf0] px-2.5 py-1 text-xs font-bold text-stone-700"><Footprints size={13} /> {place.walkingTime}</span></div><h3 className="mt-7 font-serif text-2xl text-stone-950">{place.name}</h3><p className="mt-1 text-xs font-semibold uppercase tracking-wider text-stone-400">{place.distance}</p><p className="mt-4 flex-1 text-sm font-light leading-relaxed text-stone-600">{place.description}</p>{place.partner ? <Link to="/partenaires" className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-gold-800">Voir l’avantage <ArrowUpRight size={14} /></Link> : place.website ? <a href={place.website} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-gold-800">Informations officielles <ArrowUpRight size={14} /></a> : null}</motion.article></FadeIn>)}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:items-end"><FadeIn><p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-700">Venir en voiture</p><h2 className="mt-3 font-serif text-4xl text-stone-950 md:text-5xl">Les bons repères pratiques.</h2><p className="mt-5 max-w-md text-sm leading-relaxed text-stone-600">Conseils transmis par l’hôte. Vérifiez toujours la signalisation, les horaires et les tarifs sur place.</p></FadeIn><div className="grid gap-4 md:grid-cols-3">{parkingTips.map((tip, index) => <FadeIn key={tip.title} delay={index * 0.08}><motion.article whileHover={{ y: -4 }} className="h-full border border-stone-200 bg-[#faf9f6] p-5"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-100 text-gold-800">{index === 1 ? <ParkingCircle size={20} /> : <CarFront size={20} />}</div><h3 className="mt-5 font-serif text-xl text-stone-950">{tip.title}</h3><p className="mt-2 text-[10px] font-bold uppercase tracking-[0.12em] text-gold-700">{tip.detail}</p><p className="mt-3 text-sm font-light leading-relaxed text-stone-600">{tip.description}</p></motion.article></FadeIn>)}</div></div>
        </div>
      </section>

      <section className="bg-gold-100/55 py-16 md:py-20"><div className="mx-auto flex max-w-5xl flex-col items-start gap-7 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-800">Une balade à prévoir</p><h2 className="mt-3 font-serif text-3xl text-stone-950 md:text-4xl">Le panorama du mont Saint-Clair.</h2><p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-600">{saintClairWalk.walkingTime} · {saintClairWalk.distance} · {saintClairWalk.elevation}. Une montée récompensée par la vue.</p></div><a href={saintClairWalk.website} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-2 border-b border-gold-800 pb-1 text-xs font-bold uppercase tracking-[0.13em] text-gold-800">Itinéraire officiel <ArrowUpRight size={15} /></a></div></section>

      <section className="bg-[#f7f5f0] py-10"><div className="mx-auto max-w-7xl px-4 text-xs leading-relaxed text-stone-500 sm:px-6 lg:px-8"><p>Photographies de destination : <span className="font-semibold text-stone-700">Wikimedia Commons</span>, utilisées sous licences Creative Commons.</p><div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">{destinationPhotoCredits.map((credit) => <a key={credit.href} href={credit.href} target="_blank" rel="noreferrer" className="underline decoration-stone-300 underline-offset-2 hover:text-gold-800">{credit.label} · {credit.author}</a>)}</div></div></section>
    </>
  );
}
