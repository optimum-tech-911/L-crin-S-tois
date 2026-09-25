import { isSupabaseConfigured, requireSupabase } from '../lib/supabase';

export interface BookingSettings {
  minimumNights: number;
}

const DEFAULT_SETTINGS: BookingSettings = { minimumNights: 2 };

/** Supabase-backed public booking rules, editable by an authenticated admin. */
export class BookingSettingsService {
  private settings: BookingSettings = DEFAULT_SETTINGS;
  private listeners = new Set<() => void>();
  private channel: ReturnType<ReturnType<typeof requireSupabase>['channel']> | null = null;

  async getSettings(): Promise<BookingSettings> {
    const { data, error } = await requireSupabase()
      .from('booking_settings')
      .select('minimum_nights')
      .eq('id', 1)
      .single();
    if (error) throw error;
    this.settings = { minimumNights: data.minimum_nights };
    return { ...this.settings };
  }

  async setMinimumNights(minimumNights: number): Promise<void> {
    const normalized = Math.min(30, Math.max(1, Math.round(minimumNights)));
    const { error } = await requireSupabase().from('booking_settings').update({ minimum_nights: normalized, updated_at: new Date().toISOString() }).eq('id', 1);
    if (error) throw error;
    this.settings = { minimumNights: normalized };
    this.notify();
  }

  subscribe(listener: () => void): () => void {
    if (!isSupabaseConfigured) return () => undefined;
    this.listeners.add(listener);
    this.startRealtime();
    return () => {
      this.listeners.delete(listener);
      if (!this.listeners.size && this.channel) {
        void requireSupabase().removeChannel(this.channel);
        this.channel = null;
      }
    };
  }

  private startRealtime() {
    if (this.channel) return;
    this.channel = requireSupabase()
      .channel('booking-settings-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'booking_settings' }, () => {
        void this.getSettings().then(() => this.notify()).catch(() => this.notify());
      })
      .subscribe();
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }
}

export const bookingSettingsService = new BookingSettingsService();
