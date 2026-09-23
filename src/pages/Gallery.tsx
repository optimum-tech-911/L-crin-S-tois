import React from 'react';
import SEO from '../components/seo/SEO';
import { propertyData } from '../data/property';
import { galleryImages } from '../data/images';
import FadeIn from '../components/common/FadeIn';
import { motion } from 'motion/react';

export default function Gallery() {
  return (
    <>
      <SEO 
        title={`Galerie | ${propertyData.name}`}
        description="Visitez L'Écrin Sétois en images. Découvrez le salon, la vue, et l'atmosphère unique de notre appartement à Sète."
      />
      <div className="pt-32 pb-16 md:pt-40 md:pb-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <span className="text-sm font-medium tracking-widest text-orange-700 uppercase mb-6 block">Galerie</span>
            <h1 className="text-4xl md:text-6xl font-serif text-stone-900 leading-tight mb-8">
              Notre appartement <br className="hidden md:block" />
              <span className="italic text-orange-800 font-light">en images.</span>
            </h1>
          </FadeIn>
        </div>
      </div>
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
             {galleryImages.map((image, i) => (
               <FadeIn key={image.id} delay={(i % 4) * 0.08} direction={i % 2 === 0 ? 'up' : 'left'} className={i % 7 === 0 ? 'md:col-span-2' : ''}>
                 <motion.figure whileHover={{ y: -8 }} whileTap={{ scale: 0.985 }} transition={{ type: 'spring', stiffness: 210, damping: 22 }} className={`relative overflow-hidden group bg-stone-100 shadow-[0_18px_45px_rgba(41,37,36,0.08)] ${i % 7 === 0 ? 'aspect-[16/10]' : i % 5 === 0 ? 'aspect-square' : 'aspect-[4/5]'}`}>
                    <img 
                      src={image.src} 
                      alt={image.alt} 
                      style={{ objectPosition: image.focalPoint ?? 'center' }}
                      className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.075]"
                      loading={i < 3 ? "eager" : "lazy"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/55 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <figcaption className="absolute inset-x-0 bottom-0 translate-y-4 px-5 py-4 text-sm font-medium text-stone-50 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">{image.alt}</figcaption>
                    <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gold-400 transition-transform duration-700 group-hover:scale-x-100" />
                 </motion.figure>
               </FadeIn>
             ))}
          </div>
        </div>
      </section>
    </>
  );
}
