import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ImageData } from '../../types';

interface EditorialImageRotatorProps {
  images: ImageData[];
  interval?: number;
  transitionDuration?: number;
  className?: string;
  imageClassName?: string;
  overlay?: boolean;
  eager?: boolean;
}

export default function EditorialImageRotator({ 
  images, 
  interval = 7000, 
  transitionDuration = 1.2,
  className = '',
  imageClassName = '',
  overlay = false,
  eager = false,
}: EditorialImageRotatorProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ['start end', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [-16, 16]);

  useEffect(() => {
    if (!images || images.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      // Pause rotation if the tab is hidden
      if (!document.hidden) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [images?.length, interval]);

  if (!images || images.length === 0) return null;

  return (
    <motion.div
      ref={frameRef}
      whileHover={shouldReduceMotion ? undefined : { y: -6, scale: 1.015 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 240, damping: 22 }}
      className={`group relative overflow-hidden will-change-transform ${className}`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.035 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.99 }}
          transition={{ duration: transitionDuration, ease: "easeInOut" }}
          style={{ y: imageY }}
          className="absolute -inset-y-6 inset-x-0"
        >
          <img 
            src={images[currentIndex].src} 
            alt={images[currentIndex].alt}
            className={`w-full h-full object-cover ${imageClassName} animate-ken-burns`}
            style={{ objectPosition: images[currentIndex].focalPoint ?? 'center' }}
            loading={eager && currentIndex === 0 ? "eager" : "lazy"}
          />
        </motion.div>
      </AnimatePresence>
      {overlay && (
        <div className="absolute inset-0 bg-stone-900/40 pointer-events-none" />
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-50 bg-gold-300/90 transition-transform duration-700 group-hover:scale-x-100" />
      {images.length > 1 && (
        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 bg-stone-950/45 px-3 py-2 backdrop-blur-sm" aria-label="Choisir une image">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`Afficher l’image ${index + 1}`}
              aria-current={index === currentIndex ? 'true' : undefined}
              className={`h-0.5 transition-all duration-500 ${index === currentIndex ? 'w-8 bg-gold-300' : 'w-3 bg-stone-50/55 hover:bg-stone-50'}`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
