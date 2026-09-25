import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { propertyData } from '../../data/property';
import clsx from 'clsx';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const navLinks = [
    { name: "L'appartement", path: '/appartement' },
    { name: 'Galerie', path: '/galerie' },
    { name: 'Sète', path: '/sete' },
    { name: 'Guide', path: '/guide' },
    { name: 'Partenaires', path: '/partenaires' },
    { name: 'FAQ', path: '/faq' },
  ];

  const isHome = location.pathname === '/';
  const isTransparent = isHome && !isScrolled && !isMenuOpen;
  
  const textColor = isTransparent ? "text-stone-50" : "text-stone-900";
  const linkColor = isTransparent ? "text-stone-200 hover:text-stone-50" : "text-stone-500 hover:text-stone-900";
  const btnBg = isTransparent ? "bg-stone-50 text-orange-900 hover:bg-stone-200 shadow-md" : "bg-orange-800 text-stone-50 hover:bg-orange-900 shadow-[2px_2px_0px_rgba(0,0,0,0.1)]";

  // Animation variants for the mobile menu overlay
  const menuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const linkVariants = {
    closed: { y: 20, opacity: 0 },
    open: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.3 + i * 0.05,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  return (
    <>
      <header className={clsx(
        "fixed w-full top-0 z-50 transition-all duration-500 ease-out",
        isTransparent ? "bg-gradient-to-b from-stone-950/75 via-stone-950/35 to-transparent border-transparent" : "bg-stone-50/95 backdrop-blur-md border-b border-stone-200/50 shadow-sm"
      )}>
        <div className={clsx(
          "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-500",
          isScrolled ? "h-16" : "h-24"
        )}>
          <Link to="/" className={clsx("flex items-center gap-3 text-2xl font-serif font-semibold tracking-wide uppercase transition-colors duration-300", isMenuOpen ? "text-stone-900" : textColor)}>
            <img src="/brand/mark.png?v=2" alt="" className="h-10 w-10 rounded-full bg-stone-50 object-contain p-0.5 shadow-sm" />
            <span>{propertyData.shortName}</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-9">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={clsx(
                    "text-[15px] font-semibold tracking-[0.01em] transition-all duration-300 relative py-2",
                    isTransparent ? "[text-shadow:0_2px_10px_rgba(0,0,0,0.55)]" : "[text-shadow:none]",
                    isActive ? textColor : linkColor
                  )}
                >
                  {link.name}
                  {isActive && (
                    <span className={clsx("absolute bottom-0 left-0 w-full h-[1px] transition-colors duration-300", isTransparent ? "bg-stone-50" : "bg-stone-900")} />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/contact" className={clsx("text-[15px] font-semibold tracking-[0.01em] transition-colors", linkColor)}>
              Contact
            </Link>
            <Link 
              to="/disponibilites" 
              className={clsx(
                "px-7 py-3 text-[15px] font-bold transition-all duration-300 rounded-none active:scale-95",
                btnBg
              )}
            >
              Réserver
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            className={clsx("md:hidden p-2 -mr-2 transition-colors", isMenuOpen ? "text-stone-900" : textColor)}
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-label="Menu principal"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Cinematic Full Screen Menu for Mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="md:hidden fixed inset-0 z-40 bg-stone-100 overflow-y-auto"
          >
            <div className="min-h-screen flex flex-col justify-between pt-32 pb-16 px-6">
              <div className="flex flex-col gap-12">
                
                {/* Navigation Links */}
                <nav className="flex flex-col gap-4">
                  {[{ name: 'Accueil', path: '/' }, ...navLinks].map((link, i) => {
                    const isActive = location.pathname === link.path;
                    return (
                      <motion.div 
                        custom={i} 
                        variants={linkVariants} 
                        key={link.path}
                        className="overflow-hidden"
                      >
                        <Link 
                          to={link.path} 
                          className="group flex items-center text-4xl sm:text-5xl font-serif text-stone-900 transition-colors hover:text-orange-800"
                        >
                          <span className={clsx(
                            "transition-all duration-500 origin-left inline-block",
                            isActive ? "text-orange-800 italic pr-4" : "group-hover:italic group-hover:pr-4"
                          )}>
                            {link.name}
                          </span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* Additional Info / CTA */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="flex flex-col gap-8"
                >
                  <div className="pt-8 border-t border-stone-200">
                    <Link 
                      to="/disponibilites" 
                      className="inline-flex items-center justify-center gap-3 bg-orange-900 text-stone-50 px-8 py-5 rounded-none text-lg font-medium hover:bg-orange-950 transition-colors w-full"
                    >
                      Réserver votre séjour
                      <ArrowRight size={20} />
                    </Link>
                  </div>
                </motion.div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-16 pt-8 border-t border-stone-200 flex flex-col items-center gap-4 text-sm text-stone-500"
              >
                <p>© {new Date().getFullYear()} {propertyData.name}</p>
                <Link to="/mentions-legales" className="hover:text-stone-900 transition-colors">Mentions Légales</Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
