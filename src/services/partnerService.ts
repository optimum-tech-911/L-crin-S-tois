import { partnersData } from '../data/partners';
import { Partner } from '../types';

export type PartnerDraft = Omit<Partner, 'id' | 'slug'> & { slug?: string };

/** Local CRUD repository, ready to be replaced by a Supabase `partners` table. */
export class PartnerService {
  private partners: Partner[];
  private listeners = new Set<() => void>();
  private readonly storageKey = 'ecrin-setois:partners';

  constructor() {
    const stored = this.read();
    const containsOldDemoData = stored?.some((partner) => partner.name.includes('(Exemple)'));
    this.partners = !stored || containsOldDemoData ? partnersData : stored;
    if (containsOldDemoData && typeof window !== 'undefined') {
      window.localStorage.setItem(this.storageKey, JSON.stringify(this.partners));
    }
    if (typeof window !== 'undefined') window.addEventListener('storage', this.handleStorage);
  }

  async getPartners(): Promise<Partner[]> {
    return [...this.partners];
  }

  async createPartner(draft: PartnerDraft): Promise<Partner> {
    const partner: Partner = {
      ...draft,
      id: crypto.randomUUID(),
      slug: this.toSlug(draft.slug || draft.name),
    };
    this.partners = [...this.partners, partner];
    this.persist();
    return partner;
  }

  async updatePartner(id: string, draft: PartnerDraft): Promise<void> {
    this.partners = this.partners.map((partner) => partner.id === id ? {
      ...partner,
      ...draft,
      slug: this.toSlug(draft.slug || draft.name),
    } : partner);
    this.persist();
  }

  async removePartner(id: string): Promise<void> {
    this.partners = this.partners.filter((partner) => partner.id !== id);
    this.persist();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private toSlug(value: string) {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  private read(): Partner[] | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = window.localStorage.getItem(this.storageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Partner[];
      return Array.isArray(parsed) ? parsed.filter((partner) => partner.id && partner.name && partner.category) : null;
    } catch {
      return null;
    }
  }

  private persist() {
    if (typeof window !== 'undefined') window.localStorage.setItem(this.storageKey, JSON.stringify(this.partners));
    this.notify();
  }

  private handleStorage = (event: StorageEvent) => {
    if (event.key !== this.storageKey) return;
    const next = this.read();
    if (!next) return;
    this.partners = next;
    this.notify();
  };

  private notify() {
    this.listeners.forEach((listener) => listener());
  }
}

export const partnerService = new PartnerService();
