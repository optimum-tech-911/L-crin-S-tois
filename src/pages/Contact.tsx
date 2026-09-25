import { FormEvent, useState } from 'react';
import { CheckCircle2, Send } from 'lucide-react';
import SEO from '../components/seo/SEO';
import { propertyData } from '../data/property';
import FadeIn from '../components/common/FadeIn';
import { messageService } from '../services/messageService';

export default function Contact() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await messageService.submitMessage(form);
      setIsSubmitted(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Votre message n’a pas pu être envoyé. Réessayez.');
    } finally { setIsSubmitting(false); }
  };

  return (
    <>
      <SEO 
        title={`Contact | ${propertyData.name}`}
        description="Contactez-nous pour toute question ou demande spécifique."
      />
      <section className="bg-stone-50 pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="max-w-2xl"><span className="text-sm font-bold uppercase tracking-[0.18em] text-orange-700">L’Écrin Sétois</span><h1 className="mt-5 text-4xl md:text-6xl font-serif text-stone-900">Nous contacter</h1><p className="mt-5 text-lg font-light leading-relaxed text-stone-600">Une question concernant votre séjour ou votre demande de réservation ? Écrivez-nous, nous vous répondrons dès que possible.</p></FadeIn>
          <FadeIn delay={0.1} className="mt-12 border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            {isSubmitted ? <div className="py-10 text-center"><CheckCircle2 className="mx-auto text-orange-700" size={48} /><h2 className="mt-5 font-serif text-3xl text-stone-900">Votre message est envoyé.</h2><p className="mt-3 text-stone-600">Merci, nous reviendrons vers vous dès que possible.</p></div> : <form onSubmit={submit}>{error && <p role="alert" className="mb-5 border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}<div className="grid gap-5 sm:grid-cols-2">{[['firstName', 'Prénom', 'text'], ['lastName', 'Nom', 'text'], ['email', 'E-mail', 'email'], ['phone', 'Téléphone', 'tel']].map(([name, label, type]) => <label key={name} className="block text-sm font-semibold text-stone-700">{label}<input required={name !== 'phone'} type={type} value={form[name as keyof typeof form]} onChange={(event) => setForm({ ...form, [name]: event.target.value })} className="mt-2 h-12 w-full border border-stone-300 bg-stone-50 px-3 outline-none transition focus:border-orange-700 focus:ring-2 focus:ring-orange-100" /></label>)}</div><label className="mt-5 block text-sm font-semibold text-stone-700">Sujet<input required value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} className="mt-2 h-12 w-full border border-stone-300 bg-stone-50 px-3 outline-none transition focus:border-orange-700 focus:ring-2 focus:ring-orange-100" /></label><label className="mt-5 block text-sm font-semibold text-stone-700">Votre message<textarea required rows={6} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} className="mt-2 w-full resize-y border border-stone-300 bg-stone-50 p-3 outline-none transition focus:border-orange-700 focus:ring-2 focus:ring-orange-100" /></label><button disabled={isSubmitting} className="mt-7 flex min-h-14 items-center justify-center gap-3 bg-orange-700 px-6 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-orange-600 disabled:bg-stone-400">{isSubmitting ? 'Envoi…' : <>Envoyer le message <Send size={17} /></>}</button></form>}
          </FadeIn>
        </div>
      </section>
    </>
  );
}
