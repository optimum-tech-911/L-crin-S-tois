import { Star } from 'lucide-react';
import { reviewsData } from '../../data/reviews';

/**
 * This remains hidden until genuine guest reviews are added to reviews.ts.
 * Never add sample reviews: visible reviews and schema must be authentic.
 */
export default function ReviewsSection() {
  if (!reviewsData.length) return null;

  return (
    <section className="border-y border-stone-200 bg-stone-100 py-16 md:py-24" aria-labelledby="guest-reviews-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-700">Expériences voyageurs</p>
        <h2 id="guest-reviews-title" className="mt-4 font-serif text-3xl text-stone-900 md:text-5xl">Ils ont séjourné à L’Écrin Sétois.</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviewsData.map((review) => (
            <article key={review.id} className="flex flex-col bg-white p-6 shadow-sm">
              <div className="flex gap-1 text-orange-600" aria-label={`${review.rating} sur 5`}>
                {Array.from({ length: 5 }, (_, index) => <Star key={index} size={16} fill={index < review.rating ? 'currentColor' : 'none'} />)}
              </div>
              <blockquote className="mt-5 flex-1 font-serif text-xl leading-relaxed text-stone-800">“{review.text}”</blockquote>
              <footer className="mt-6 border-t border-stone-100 pt-4 text-sm text-stone-500">{review.reviewerFirstName} · {review.source}</footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
