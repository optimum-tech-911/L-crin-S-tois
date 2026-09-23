import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ImageData } from '../../types';

interface HeroCarouselProps {
  images: ImageData[];
  className?: string;
}

const SLIDE_DURATION = 9000;

export default function HeroCarousel({ images, className = '' }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (images.length < 2 || prefersReducedMotion) return;

    const timer = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % images.length);
    }, SLIDE_DURATION);

    return () => window.clearInterval(timer);
  }, [currentIndex, images.length, prefersReducedMotion]);

  useEffect(() => {
    if (images.length < 2) return;

    const preloadTimer = window.setTimeout(() => {
      const nextImage = images[(currentIndex + 1) % images.length];
      const image = new Image();
      image.src = nextImage.src;
    }, 2000);

    return () => window.clearTimeout(preloadTimer);
  }, [currentIndex, images]);

  if (!images.length) return null;

  const image = images[currentIndex];

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-label="Aperçu de l'appartement">
      <AnimatePresence initial={false} mode="sync">
        <motion.img
          key={image.id}
          src={image.src}
          alt={image.alt}
          className="absolute inset-0 h-full w-full object-cover will-change-transform"
          style={{ objectPosition: image.focalPoint ?? 'center' }}
          initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 1.025 }}
          animate={{ opacity: 1, scale: prefersReducedMotion ? 1 : 1.1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.15, ease: 'easeInOut' },
            scale: { duration: SLIDE_DURATION / 1000 + 1.2, ease: 'linear' },
          }}
          loading={currentIndex === 0 ? 'eager' : 'lazy'}
          fetchPriority={currentIndex === 0 ? 'high' : 'auto'}
        />
      </AnimatePresence>

      {images.length > 1 && (
        <div className="absolute bottom-6 right-4 z-30 flex items-center gap-2 sm:bottom-8 sm:right-8 lg:right-12" aria-label="Choisir une photo">
          <span className="mr-1 text-xs font-medium tracking-[0.2em] text-stone-100/80">
            {String(currentIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
          </span>
          {images.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-50 ${
                index === currentIndex ? 'w-8 bg-stone-50' : 'w-3 bg-stone-50/50 hover:bg-stone-50/80'
              }`}
              aria-label={`Afficher la photo ${index + 1}`}
              aria-current={index === currentIndex ? 'true' : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
