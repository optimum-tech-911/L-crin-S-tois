import React from 'react';
import SEO from '../components/seo/SEO';
import { propertyData } from '../data/property';
import FadeIn from '../components/common/FadeIn';

export default function Legal() {
  return (
    <>
      <SEO 
        title={`Mentions Légales | ${propertyData.name}`}
        description="Mentions légales et conditions générales de vente."
      />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <FadeIn>
          <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-8">Mentions Légales</h1>
          <div className="prose prose-stone text-stone-600 font-light leading-relaxed">
            <p>Mentions légales et conditions de vente.</p>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
