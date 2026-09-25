import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Check, Gift, Pencil, Plus, Save, Store, Trash2, X } from 'lucide-react';
import { Partner } from '../../types';
import { PartnerDraft, partnerService } from '../../services/partnerService';

const emptyDraft: PartnerDraft = {
  name: '',
  category: '',
  shortDescription: '',
  description: '',
  offer: '',
  website: '',
  address: '',
  featured: false,
};

export default function PartnersControl() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [draft, setDraft] = useState<PartnerDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const refresh = () => partnerService.getPartners().then(setPartners).catch((error: unknown) => setErrorMessage(error instanceof Error ? error.message : 'Impossible de charger les partenaires.'));

  useEffect(() => {
    void refresh();
    return partnerService.subscribe(() => void refresh());
  }, []);

  const title = useMemo(() => editingId ? 'Modifier le partenaire' : 'Ajouter un partenaire', [editingId]);

  const setField = <K extends keyof PartnerDraft>(field: K, value: PartnerDraft[K]) => {
    setSaved(false);
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const reset = () => {
    setDraft(emptyDraft);
    setEditingId(null);
    setSaved(false);
  };

  const edit = (partner: Partner) => {
    setEditingId(partner.id);
    setDraft({
      name: partner.name,
      slug: partner.slug,
      category: partner.category,
      shortDescription: partner.shortDescription,
      description: partner.description ?? '',
      offer: partner.offer ?? '',
      website: partner.website ?? '',
      address: partner.address ?? '',
      featured: partner.featured ?? false,
    });
    setSaved(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage('');
    try {
      if (editingId) await partnerService.updatePartner(editingId, draft);
      else await partnerService.createPartner(draft);
      setSaved(true);
      if (!editingId) setDraft(emptyDraft);
      window.setTimeout(() => setSaved(false), 1800);
    } catch (error) { setErrorMessage(error instanceof Error ? error.message : 'Impossible d’enregistrer ce partenaire.'); }
    finally { setIsSaving(false); }
  };

  const remove = async (partner: Partner) => {
    if (!window.confirm(`Supprimer ${partner.name} des partenaires ?`)) return;
    setErrorMessage('');
    try { await partnerService.removePartner(partner.id); if (editingId === partner.id) reset(); }
    catch (error) { setErrorMessage(error instanceof Error ? error.message : 'Impossible de supprimer ce partenaire.'); }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[390px_minmax(0,1fr)] xl:items-start">
      <section className="border border-stone-200 bg-white p-4 shadow-sm sm:p-6 xl:sticky xl:top-6">
        <div className="flex items-start justify-between gap-3">
          <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-800">Carnet d’adresses</p><h2 className="mt-2 font-serif text-2xl text-stone-950">{title}</h2></div>
          {editingId && <button type="button" onClick={reset} className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-stone-600 hover:border-stone-400" aria-label="Annuler la modification"><X size={18} /></button>}
        </div>
        <p className="mt-2 text-sm leading-relaxed text-stone-500">Les changements apparaissent immédiatement sur la page publique Partenaires.</p>
        {errorMessage && <p role="alert" className="mt-4 border border-red-200 bg-red-50 p-3 text-sm text-red-800">{errorMessage}</p>}
        <form onSubmit={save} className="mt-6 space-y-4">
          <Field label="Nom" required value={draft.name} onChange={(value) => setField('name', value)} placeholder="Ex. Caveau Voltaire" />
          <Field label="Catégorie" required value={draft.category} onChange={(value) => setField('category', value)} placeholder="Ex. Vins locaux" />
          <Field label="Description courte" required value={draft.shortDescription} onChange={(value) => setField('shortDescription', value)} multiline placeholder="Une phrase claire affichée en premier." />
          <Field label="Description détaillée" value={draft.description ?? ''} onChange={(value) => setField('description', value)} multiline placeholder="Pourquoi vous recommandez cette adresse…" />
          <Field label="Avantage voyageur" value={draft.offer ?? ''} onChange={(value) => setField('offer', value)} placeholder="Ex. −10 % pendant le séjour" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <Field label="Adresse" value={draft.address ?? ''} onChange={(value) => setField('address', value)} placeholder="Facultatif" />
            <Field label="Site web" value={draft.website ?? ''} onChange={(value) => setField('website', value)} placeholder="https://…" type="url" />
          </div>
          <label className="flex cursor-pointer items-start gap-3 border border-stone-200 bg-stone-50 p-3 text-sm text-stone-700">
            <input type="checkbox" checked={draft.featured ?? false} onChange={(event) => setField('featured', event.target.checked)} className="mt-0.5 h-4 w-4 accent-amber-700" />
            <span><strong className="block">Mettre en avant</strong><span className="text-xs text-stone-500">Affiche ce partenaire comme adresse prioritaire.</span></span>
          </label>
          <button disabled={isSaving} className="flex min-h-13 w-full items-center justify-center gap-2 bg-gold-800 px-5 py-3 text-sm font-bold text-white transition hover:bg-gold-700 disabled:opacity-60">
            {saved ? <><Check size={18} /> Enregistré</> : editingId ? <><Save size={18} /> Enregistrer les modifications</> : <><Plus size={18} /> Ajouter le partenaire</>}
          </button>
        </form>
      </section>

      <section className="border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
        <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-800">Page publique</p><h2 className="mt-2 font-serif text-2xl text-stone-950">Partenaires publiés</h2><p className="mt-2 text-sm text-stone-500">{partners.length} adresse{partners.length !== 1 ? 's' : ''} visible{partners.length !== 1 ? 's' : ''}.</p></div>
        {partners.length ? <div className="mt-6 space-y-3">
          {partners.map((partner) => <article key={partner.id} className="border border-stone-200 p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2"><Store size={17} className="text-gold-800" /><p className="font-serif text-xl text-stone-950">{partner.name}</p>{partner.featured && <span className="rounded-full bg-gold-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-900">Mis en avant</span>}</div>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-stone-400">{partner.category}</p>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-stone-600">{partner.shortDescription}</p>
                {partner.offer && <p className="mt-3 flex items-center gap-2 text-sm font-bold text-gold-800"><Gift size={16} /> {partner.offer}</p>}
              </div>
              <div className="flex shrink-0 gap-2">
                <button type="button" onClick={() => edit(partner)} className="flex min-h-11 items-center gap-2 border border-stone-300 px-3 text-sm font-bold text-stone-700 hover:border-gold-700 hover:text-gold-800"><Pencil size={16} /> Modifier</button>
                <button type="button" onClick={() => void remove(partner)} className="flex h-11 w-11 items-center justify-center border border-red-200 text-red-700 hover:bg-red-50" aria-label={`Supprimer ${partner.name}`}><Trash2 size={17} /></button>
              </div>
            </div>
          </article>)}
        </div> : <div className="mt-6 border border-dashed border-stone-300 bg-stone-50 px-5 py-12 text-center text-sm text-stone-500">Aucun partenaire publié.</div>}
      </section>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, required = false, multiline = false, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; required?: boolean; multiline?: boolean; type?: string }) {
  const classes = 'mt-2 w-full border border-stone-300 bg-stone-50 px-3 text-sm text-stone-900 outline-none transition focus:border-gold-700 focus:ring-2 focus:ring-gold-100';
  return <label className="block text-sm font-semibold text-stone-700">{label}{multiline ? <textarea rows={3} required={required} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={`${classes} resize-y py-3`} /> : <input type={type} required={required} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={`${classes} h-12`} />}</label>;
}
