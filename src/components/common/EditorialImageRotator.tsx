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
  const [isDragging, setIsDragging] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const pointerStartX = useRef<number | null>(null);
  const imageCount = images?.length ?? 0;
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ['start end', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [-16, 16]);

  const moveBy = (step: -1 | 1) => {
    setCurrentIndex((index) => (index + step + imageCount) % imageCount);
  };

  const showPrevious = () => moveBy(-1);
  const showNext = () => moveBy(1);
  const goToImage = (index: number) => {
    if (index === currentIndex) return;
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (imageCount <= 1 || isDragging) {
      return;
    }

    const timer = setInterval(() => {
      // Pause rotation if the tab is hidden
      if (!document.hidden) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % imageCount);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [imageCount, interval, currentIndex, isDragging]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showPrevious();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      showNext();
    }
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.target instanceof Element && event.target.closest('button')) return;
    pointerStartX.current = event.clientX;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const startX = pointerStartX.current;
    pointerStartX.current = null;
    setIsDragging(false);
    if (startX === null) return;

    const distance = event.clientX - startX;
    const threshold = Math.max(45, (frameRef.current?.clientWidth ?? 300) * 0.14);
    if (distance < -threshold) showNext();
    else if (distance > threshold) showPrevious();
  };

  const cancelPointer = () => {
    pointerStartX.current = null;
    setIsDragging(false);
  };

  if (!images || images.length === 0) return null;

  return (
    <motion.div
      ref={frameRef}
      whileHover={shouldReduceMotion ? undefined : { y: -6, scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 240, damping: 22 }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={cancelPointer}
      onKeyDown={handleKeyDown}
      tabIndex={images.length > 1 ? 0 : undefined}
      role={images.length > 1 ? 'group' : undefined}
      aria-roledescription={images.length > 1 ? 'carrousel' : undefined}
      aria-label={images.length > 1 ? 'Galerie d’images' : undefined}
      className={`group relative touch-pan-y overflow-hidden will-change-transform ${images.length > 1 ? 'cursor-grab active:cursor-grabbing' : ''} ${className}`}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.08, filter: 'blur(8px) brightness(0.82)' }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, filter: 'blur(0px) brightness(1)' }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.985, filter: 'blur(5px) brightness(1.08)' }}
          transition={{ duration: shouldReduceMotion ? 0.2 : Math.min(transitionDuration, 0.9), ease: [0.22, 0.61, 0.36, 1] }}
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
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-50 bg-champagne/90 transition-transform duration-700 group-hover:scale-x-100" />
      {images.length > 1 && (
        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 bg-stone-950/45 px-3 py-2 backdrop-blur-sm" aria-label="Choisir une image">
            {images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => goToImage(index)}
                aria-label={`Afficher l’image ${index + 1}`}
                aria-current={index === currentIndex ? 'true' : undefined}
                className={`h-0.5 transition-all duration-500 ${index === currentIndex ? 'w-8 bg-champagne-soft' : 'w-3 bg-stone-50/55 hover:bg-stone-50'}`}
              />
            ))}
        </div>
      )}
    </motion.div>
  );
}
