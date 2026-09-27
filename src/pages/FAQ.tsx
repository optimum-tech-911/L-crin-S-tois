import SEO from '../components/seo/SEO';
import { propertyData } from '../data/property';
import FadeIn from '../components/common/FadeIn';

const questions = [
  {
    question: 'Comment consulter les disponibilités ?',
    answer: 'Rendez-vous sur la page Disponibilités, puis choisissez votre date d’arrivée et votre date de départ. Les dates indisponibles ne peuvent pas être sélectionnées.',
  },
  {
    question: 'Comment envoyer une demande de réservation ?',
    answer: 'Après avoir sélectionné vos dates, vous pouvez poursuivre vers le formulaire de demande et nous transmettre vos coordonnées. La demande ne confirme pas encore le séjour.',
  },
  {
    question: 'Où puis-je voir les photos de l’appartement ?',
    answer: 'La galerie présente les différentes pièces de L’Écrin Sétois. La page Appartement propose également une visite par espace.',
  },
  {
    question: 'Quels sont les principaux équipements du logement ?',
    answer: 'L’appartement est climatisé et dispose notamment d’une cuisine équipée, d’un lave-vaisselle, d’un lave-linge, du Wi-Fi gratuit, d’une TV QLED 4K avec Disney+, d’un HomePod, d’un sèche-cheveux et d’un balcon aménagé. La liste détaillée est disponible sur la page Appartement.',
  },
  {
    question: 'Quelle est la durée minimale du séjour ?',
    answer: 'La durée minimale en vigueur est indiquée directement sous le calendrier des disponibilités. Elle peut varier selon la date d’arrivée et est prise en compte automatiquement lors du choix des dates.',
  },
  {
    question: 'L’Écrin Sétois est-il un hôtel ?',
    answer: 'L’Écrin Sétois est un appartement meublé de tourisme classé 2 étoiles, et non un hôtel. Il offre une alternative indépendante pour un séjour à Sète, avec cuisine équipée, chambre séparée et balcon.',
  },
  {
    question: 'Où stationner près de l’appartement ?',
    answer: 'Le guide local présente les options suggérées par l’hôte, notamment la place de la République, le parking couvert Victor-Hugo et la rue du 4-Septembre. La signalisation, les horaires et les tarifs affichés sur place restent à vérifier.',
  },
];

export default function FAQ() {
  return (
    <>
      <SEO 
        title={`FAQ location de vacances à Sète | ${propertyData.name}`}
        description="Disponibilités, demande de réservation et visite de l’appartement : retrouvez les réponses aux questions fréquentes sur L’Écrin Sétois à Sète."
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: questions.map(({ question, answer }) => ({
            '@type': 'Question',
            name: question,
            acceptedAnswer: { '@type': 'Answer', text: answer },
          })),
        }}
      />
      <section className="bg-stone-50 pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <span className="text-sm font-bold tracking-[0.18em] text-orange-700 uppercase">Besoin d’aide ?</span>
            <h1 className="mt-5 text-4xl md:text-6xl font-serif text-stone-900">Questions fréquentes</h1>
            <p className="mt-5 max-w-2xl text-lg font-light leading-relaxed text-stone-600">Les informations essentielles pour découvrir le logement et préparer votre demande de séjour.</p>
          </FadeIn>
          <div className="mt-12 space-y-3">
            {questions.map(({ question, answer }, index) => (
              <FadeIn key={question} delay={index * 0.08}>
                <details className="group border border-stone-200 bg-white open:border-orange-200">
                  <summary className="cursor-pointer list-none px-6 py-5 pr-14 font-serif text-xl text-stone-900 marker:hidden transition-colors hover:text-orange-800">
                    {question}
                    <span className="float-right font-sans text-2xl text-orange-700 transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                  </summary>
                  <div className="faq-content border-t border-stone-100 px-6 py-5 text-base leading-relaxed text-stone-600">{answer}</div>
                </details>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
