import { isSupabaseConfigured, requireSupabase } from '../lib/supabase';
import { Partner } from '../types';

export type PartnerDraft = Omit<Partner, 'id' | 'slug'> & { slug?: string };

type PartnerRow = {
  id: string; slug: string; name: string; category: string; short_description: string;
  description: string | null; logo: string | null; image: string | null; website: string | null;
  phone: string | null; address: string | null; latitude: number | null; longitude: number | null;
  offer: string | null; promo_code: string | null; featured: boolean;
};

const fromRow = (row: PartnerRow): Partner => ({
  id: row.id, slug: row.slug, name: row.name, category: row.category,
  shortDescription: row.short_description, description: row.description ?? undefined,
  logo: row.logo ?? undefined, image: row.image ?? undefined, website: row.website ?? undefined,
  phone: row.phone ?? undefined, address: row.address ?? undefined,
  coordinates: row.latitude != null && row.longitude != null ? { lat: row.latitude, lng: row.longitude } : undefined,
  offer: row.offer ?? undefined, promoCode: row.promo_code ?? undefined, featured: row.featured,
});

const toSlug = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function toRow(draft: PartnerDraft) {
  return {
    slug: toSlug(draft.slug || draft.name), name: draft.name.trim(), category: draft.category.trim(),
    short_description: draft.shortDescription.trim(), description: draft.description?.trim() || null,
    logo: draft.logo || null, image: draft.image || null, website: draft.website || null,
    phone: draft.phone || null, address: draft.address || null,
    latitude: draft.coordinates?.lat ?? null, longitude: draft.coordinates?.lng ?? null,
    offer: draft.offer || null, promo_code: draft.promoCode || null, featured: draft.featured ?? false,
  };
}

/** Supabase-backed partner directory shared by public and admin views. */
export class PartnerService {
  private listeners = new Set<() => void>();
  private channel: ReturnType<ReturnType<typeof requireSupabase>['channel']> | null = null;

  async getPartners(): Promise<Partner[]> {
    const { data, error } = await requireSupabase().from('partners').select('*').order('featured', { ascending: false }).order('name');
    if (error) throw error;
    return ((data ?? []) as PartnerRow[]).map(fromRow);
  }

  async createPartner(draft: PartnerDraft): Promise<Partner> {
    const { data, error } = await requireSupabase().from('partners').insert(toRow(draft)).select('*').single();
    if (error) throw error;
    this.notify();
    return fromRow(data as PartnerRow);
  }

  async updatePartner(id: string, draft: PartnerDraft): Promise<void> {
    const { error } = await requireSupabase().from('partners').update({ ...toRow(draft), updated_at: new Date().toISOString() }).eq('id', id);
    if (error) throw error;
    this.notify();
  }

  async removePartner(id: string): Promise<void> {
    const { error } = await requireSupabase().from('partners').delete().eq('id', id);
    if (error) throw error;
    this.notify();
  }

  subscribe(listener: () => void): () => void {
    if (!isSupabaseConfigured) return () => undefined;
    this.listeners.add(listener);
    if (!this.channel) this.channel = requireSupabase().channel('partners-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'partners' }, () => this.notify()).subscribe();
    return () => {
      this.listeners.delete(listener);
      if (!this.listeners.size && this.channel) {
        void requireSupabase().removeChannel(this.channel);
        this.channel = null;
      }
    };
  }

  private notify() { this.listeners.forEach((listener) => listener()); }
}

export const partnerService = new PartnerService();
