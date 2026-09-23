export interface BookingSettings {
  minimumNights: number;
}

const DEFAULT_SETTINGS: BookingSettings = { minimumNights: 2 };

/**
 * Local booking-rules repository. Its small contract is intentionally ready to
 * be backed by a Supabase settings row without changing the calendar screens.
 */
export class BookingSettingsService {
  private settings: BookingSettings;
  private listeners = new Set<() => void>();
  private readonly storageKey = 'ecrin-setois:booking-settings';

  constructor() {
    this.settings = this.read() ?? DEFAULT_SETTINGS;
    if (typeof window !== 'undefined') window.addEventListener('storage', this.handleStorage);
  }

  async getSettings(): Promise<BookingSettings> {
    return { ...this.settings };
  }

  async setMinimumNights(minimumNights: number): Promise<void> {
    const normalized = Math.min(30, Math.max(1, Math.round(minimumNights)));
    this.settings = { ...this.settings, minimumNights: normalized };
    this.persist();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private read(): BookingSettings | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = window.localStorage.getItem(this.storageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Partial<BookingSettings>;
      if (!Number.isFinite(parsed.minimumNights)) return null;
      return { minimumNights: Math.min(30, Math.max(1, Math.round(parsed.minimumNights as number))) };
    } catch {
      return null;
    }
  }

  private persist() {
    if (typeof window !== 'undefined') window.localStorage.setItem(this.storageKey, JSON.stringify(this.settings));
    this.notify();
  }

  private handleStorage = (event: StorageEvent) => {
    if (event.key !== this.storageKey) return;
    const next = this.read();
    if (!next) return;
    this.settings = next;
    this.notify();
  };

  private notify() {
    this.listeners.forEach((listener) => listener());
  }
}

export const bookingSettingsService = new BookingSettingsService();
