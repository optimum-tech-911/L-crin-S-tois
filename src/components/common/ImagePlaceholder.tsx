import React from 'react';
import { motion } from 'motion/react';

interface ImagePlaceholderProps {
  text?: string;
  aspectRatio?: 'auto' | '16/9' | '16/10' | '4/5' | '1/1';
  className?: string;
}

export default function ImagePlaceholder({ 
  text = 'IMAGE PLACEHOLDER', 
  aspectRatio = '16/9',
  className = ''
}: ImagePlaceholderProps) {
  const ratioClasses = {
    'auto': 'aspect-auto',
    '16/9': 'aspect-video',
    '16/10': 'aspect-[16/10]',
    '4/5': 'aspect-[4/5]',
    '1/1': 'aspect-square'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.85, rotate: -4, borderRadius: "10%" }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0, borderRadius: "0%" }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ type: "spring", stiffness: 100, damping: 18 }}
      className={`overflow-hidden w-full bg-stone-200 group shadow-xl ${className} ${ratioClasses[aspectRatio]}`}
    >
      <motion.div 
        whileHover={{ scale: 1.05, rotate: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-full h-full relative"
      >
        <motion.div 
          animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
          transition={{ duration: 15, ease: "linear", repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-br from-stone-200 via-stone-300 to-stone-200 bg-[length:200%_200%]"
        />
        <div className="absolute inset-0 flex items-center justify-center p-4 z-10 pointer-events-none">
          <motion.span
            animate={{ y: [-3, 3, -3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="text-stone-500 text-sm font-bold tracking-widest text-center"
          >
            {text}
          </motion.span>
        </div>
      </motion.div>
    </motion.div>
  );
}
