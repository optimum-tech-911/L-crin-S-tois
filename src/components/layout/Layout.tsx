import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Header from './Header';
import Footer from './Footer';
import StickyBookingBar from '../booking/StickyBookingBar';
import FlashNotification from './FlashNotification';
import ScrollProgress from '../common/ScrollProgress';

export default function Layout() {
  const location = useLocation();
  return (
    <div className="flex flex-col min-h-screen bg-stone-50 font-sans text-stone-900 selection:bg-stone-200 selection:text-stone-900 overflow-x-hidden">
      <ScrollProgress />
      <Header />
      <main className="flex-grow flex flex-col relative">
        <AnimatePresence mode="wait">
          <motion.div 
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            className="flex-grow flex flex-col"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <StickyBookingBar />
      <FlashNotification />
    </div>
  );
}
