import { ArrowUpRight, Anchor, Compass, MapPinned, Waves } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import SEO from '../components/seo/SEO';
import FadeIn from '../components/common/FadeIn';
import EditorialImageRotator from '../components/common/EditorialImageRotator';
import { destinationImages } from '../data/images';
import { cityMoments, destinationPhotoCredits } from '../data/destination';
import { propertyData } from '../data/property';

const destinationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'TouristDestination',
  name: 'Sète',
  description: 'Ville portuaire entre l’étang de Thau et la Méditerranée, à découvrir depuis L’Écrin Sétois.',
  touristType: ['Culture', 'Gastronomie', 'Plage', 'Randonnée'],
  containsPlace: [
    { '@type': 'TouristAttraction', name: 'Mont Saint-Clair' },
    { '@type': 'TouristAttraction', name: 'Les Halles de Sète' },
    { '@type': 'CivicStructure', name: 'Théâtre Molière → Sète' },
  ],
};

export default function Sete() {
  return (
    <>
      <SEO
        title={`Sète : que voir et que faire | ${propertyData.name}`}
        description="Canaux, Halles, mont Saint-Clair, plages du lido et culture : un guide sensible et pratique pour vivre Sète depuis L’Écrin Sétois."
        structuredData={destinationStructuredData}
      />

      <section className="relative overflow-hidden bg-stone-950 pb-16 pt-28 text-stone-50 md:pb-24 md:pt-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(198,153,67,0.18),transparent_38%)]" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 md:items-end lg:grid-cols-[0.76fr_1.24fr] lg:gap-0 lg:px-8">
          <FadeIn direction="right" className="relative z-10 lg:pb-12 lg:pr-16">
            <p className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gold-300"><Compass size={16} /> La destination</p>
            <h1 className="font-serif text-5xl leading-[0.98] md:text-7xl">Sète,<br /><span className="font-light italic text-gold-300">l’île singulière.</span></h1>
            <p className="mt-8 max-w-xl text-lg font-light leading-relaxed text-stone-300 md:text-xl">Une ville portuaire qui se découvre par ses canaux, ses halles, ses pentes et ses horizons. Ici, on ne coche pas des monuments : on change de rythme.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/disponibilites" className="inline-flex min-h-13 items-center justify-center gap-2 bg-gold-400 px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-stone-950 transition hover:bg-gold-300">Préparer mon séjour <ArrowUpRight size={18} /></Link>
              <a href="https://www.tourisme-sete.com/" target="_blank" rel="noreferrer" className="inline-flex min-h-13 items-center justify-center gap-2 border border-stone-500 px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-stone-100 transition hover:border-gold-300 hover:text-gold-200">Office de tourisme <ArrowUpRight size={17} /></a>
            </div>
          </FadeIn>
          <FadeIn direction="left" className="relative lg:-mb-14">
            <div className="absolute -bottom-5 -left-5 h-28 w-28 border-l border-b border-gold-300/70" aria-hidden="true" />
            <EditorialImageRotator images={destinationImages} eager interval={7200} className="relative aspect-[16/10] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.38)] [clip-path:polygon(4%_0,100%_0,100%_92%,96%_100%,0_100%,0_8%)]" overlay />
            <p className="mt-4 text-right text-[10px] uppercase tracking-[0.15em] text-stone-500">Entre l’étang de Thau et la Méditerranée</p>
          </FadeIn>
        </div>
      </section>

      <section className="bg-[#f7f5f0] py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-700">Le bon repère</p><h2 className="mt-3 font-serif text-4xl leading-tight text-stone-950 md:text-5xl">Une ville entre deux eaux.</h2></div>
            <p className="max-w-3xl text-lg font-light leading-relaxed text-stone-600">Sète s’étire entre l’étang de Thau et la mer. Les canaux donnent son rythme au centre, le mont Saint-Clair donne de la hauteur à la ville et le lido ouvre une respiration côté plage.</p>
          </FadeIn>
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Waves, label: 'Les canaux', copy: 'Pour marcher, regarder les barques et rejoindre les quais sans itinéraire imposé.' },
              { icon: Anchor, label: 'Le port vivant', copy: 'Pour sentir l’histoire maritime de Sète dans les halles, les quais et les adresses locales.' },
              { icon: MapPinned, label: 'Le mont Saint-Clair', copy: 'Pour comprendre la géographie singulière de la ville depuis son meilleur belvédère.' },
            ].map(({ icon: Icon, label, copy }, index) => <FadeIn key={label} delay={index * 0.08}><motion.article whileHover={{ y: -5 }} className="h-full border border-stone-200 bg-white p-6 sm:p-7"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-100 text-gold-800"><Icon size={22} strokeWidth={1.5} /></div><h3 className="mt-6 font-serif text-2xl text-stone-950">{label}</h3><p className="mt-3 text-sm font-light leading-relaxed text-stone-600">{copy}</p></motion.article></FadeIn>)}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="mb-14 flex flex-col gap-4 border-b border-stone-200 pb-8 md:flex-row md:items-end md:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-700">Une journée à Sète</p><h2 className="mt-3 font-serif text-4xl text-stone-950 md:text-5xl">Suivre l’envie du moment.</h2></div><p className="max-w-sm text-sm leading-relaxed text-stone-500">Nos idées sont des invitations, pas un programme à respecter.</p></FadeIn>
          <div className="space-y-20 md:space-y-28">
            {cityMoments.map((moment, index) => {
              const reverse = index % 2 === 1;
              return <div key={moment.id} className="grid items-center gap-8 md:grid-cols-2 md:gap-14 lg:gap-20">
                <FadeIn direction={reverse ? 'left' : 'right'} className={reverse ? 'md:order-2' : ''}><div className="relative overflow-hidden shadow-[0_24px_60px_rgba(41,37,36,0.13)]"><img src={moment.image} alt={moment.imageAlt} loading="lazy" className="aspect-[4/3] w-full object-cover transition duration-700 hover:scale-[1.035]" /><span className="absolute bottom-4 left-4 bg-stone-950/75 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-gold-200">{moment.eyebrow}</span></div></FadeIn>
                <FadeIn direction={reverse ? 'right' : 'left'} className={reverse ? 'md:order-1' : ''}><p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-700">{moment.eyebrow}</p><h3 className="mt-3 font-serif text-4xl leading-tight text-stone-950 md:text-5xl">{moment.title}</h3><p className="mt-5 max-w-xl text-lg font-light leading-relaxed text-stone-600">{moment.description}</p><a href={moment.link} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 border-b border-gold-800 pb-1 text-xs font-bold uppercase tracking-[0.14em] text-gold-800">{moment.linkLabel} <ArrowUpRight size={15} /></a></FadeIn>
              </div>;
            })}
          </div>
        </div>
      </section>

      <section className="bg-stone-950 py-20 text-stone-50 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          <FadeIn className="md:col-span-1"><p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-300">Pour aller plus loin</p><h2 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">L’agenda qui bouge.</h2></FadeIn>
          <FadeIn delay={0.1} className="border-l border-stone-700 pl-6 md:col-span-2 md:pl-10"><p className="text-lg font-light leading-relaxed text-stone-300">Concerts, spectacles, rendez-vous maritimes et expositions donnent une autre raison de revenir. Consultez les agendas officiels avant votre arrivée pour choisir le bon moment.</p><div className="mt-8 flex flex-wrap gap-3"><a href="https://tmsete.com/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-stone-600 px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-stone-100 transition hover:border-gold-300 hover:text-gold-200">Théâtre Molière <ArrowUpRight size={15} /></a><a href="https://escaleasete.com/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-stone-600 px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-stone-100 transition hover:border-gold-300 hover:text-gold-200">Escale à Sète <ArrowUpRight size={15} /></a></div></FadeIn>
        </div>
      </section>

      <section className="bg-[#f7f5f0] py-10">
        <div className="mx-auto max-w-7xl px-4 text-xs leading-relaxed text-stone-500 sm:px-6 lg:px-8">
          <p>Photographies de destination : <span className="font-semibold text-stone-700">Wikimedia Commons</span>, utilisées sous licences Creative Commons.</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">{destinationPhotoCredits.map((credit) => <a key={credit.href} href={credit.href} target="_blank" rel="noreferrer" className="underline decoration-stone-300 underline-offset-2 hover:text-gold-800">{credit.label} · {credit.author}</a>)}</div>
        </div>
      </section>
    </>
  );
}
