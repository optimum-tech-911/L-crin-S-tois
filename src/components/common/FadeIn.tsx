import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

const FadeIn: React.FC<FadeInProps> = ({ children, delay = 0, className = '', direction = 'up' }) => {
  const shouldReduceMotion = useReducedMotion();
  const directions = {
    up: { y: 54, x: 0, scale: 0.96, rotate: 0.8 },
    down: { y: -54, x: 0, scale: 0.96, rotate: -0.8 },
    left: { x: 54, y: 0, scale: 0.96, rotate: -0.8 },
    right: { x: -54, y: 0, scale: 0.96, rotate: 0.8 },
    none: { x: 0, y: 18, scale: 0.98, rotate: 0 }
  };

  const initial = shouldReduceMotion ? { opacity: 0 } : { opacity: 0, filter: 'blur(9px)', ...directions[direction] };

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, filter: 'blur(0px)', x: 0, y: 0, scale: 1, rotate: 0 }}
      viewport={{ once: false, amount: 0.18, margin: "-8% 0px -8% 0px" }}
      transition={shouldReduceMotion ? { duration: 0.18 } : { type: "spring", stiffness: 82, damping: 17, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default FadeIn;
