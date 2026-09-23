import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/seo/SEO';
import FadeIn from '../components/common/FadeIn';

export default function NotFound() {
  return (
    <>
      <SEO 
        title="Page non trouvée"
        description="La page que vous recherchez n'existe pas."
        noIndex
      />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex items-center justify-center min-h-[70vh]">
        <FadeIn className="text-center">
          <h1 className="text-6xl font-serif text-stone-900 mb-4">404</h1>
          <p className="text-xl text-stone-600 font-light mb-8">Cette page n'existe pas ou a été déplacée.</p>
          <Link to="/" className="inline-block bg-stone-900 text-stone-50 px-8 py-3 font-medium hover:bg-stone-800 transition-all active:scale-95 uppercase tracking-widest text-sm">
            Retour à l'accueil
          </Link>
        </FadeIn>
      </section>
    </>
  );
}
