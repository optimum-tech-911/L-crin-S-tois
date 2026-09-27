import { isSupabaseConfigured, requireSupabase } from '../lib/supabase';

export interface BookingSettings {
  minimumNights: number;
  rules: MinimumStayRule[];
}

export interface MinimumStayRule {
  id: string;
  start: string;
  end: string;
  minimumNights: number;
}

export const DEFAULT_SETTINGS: BookingSettings = { minimumNights: 2, rules: [] };

export function minimumNightsForArrival(settings: BookingSettings, arrival?: string): number {
  if (!arrival) return settings.minimumNights;
  return settings.rules.find((rule) => arrival >= rule.start && arrival <= rule.end)?.minimumNights ?? settings.minimumNights;
}

/** Supabase-backed public booking rules, editable by an authenticated admin. */
export class BookingSettingsService {
  private settings: BookingSettings = DEFAULT_SETTINGS;
  private listeners = new Set<() => void>();
  private channel: ReturnType<ReturnType<typeof requireSupabase>['channel']> | null = null;

  async getSettings(): Promise<BookingSettings> {
    const client = requireSupabase();
    const [settingsResult, rulesResult] = await Promise.all([
      client.from('booking_settings').select('minimum_nights').eq('id', 1).single(),
      client.from('minimum_stay_rules').select('id,start_date,end_date,minimum_nights').order('start_date'),
    ]);
    if (settingsResult.error) throw settingsResult.error;
    if (rulesResult.error) throw rulesResult.error;
    this.settings = {
      minimumNights: settingsResult.data.minimum_nights,
      rules: (rulesResult.data ?? []).map((row) => ({
        id: row.id, start: row.start_date, end: row.end_date, minimumNights: row.minimum_nights,
      })),
    };
    return { ...this.settings, rules: [...this.settings.rules] };
  }

  async setMinimumNights(minimumNights: number): Promise<void> {
    const normalized = Math.min(30, Math.max(1, Math.round(minimumNights)));
    const { error } = await requireSupabase().from('booking_settings').update({ minimum_nights: normalized, updated_at: new Date().toISOString() }).eq('id', 1);
    if (error) throw error;
    this.settings = { ...this.settings, minimumNights: normalized };
    this.notify();
  }

  async addRule(start: string, end: string, minimumNights: number): Promise<void> {
    if (!start || !end || end < start) throw new Error('Choisissez une période valide.');
    const { error } = await requireSupabase().from('minimum_stay_rules').insert({
      start_date: start,
      end_date: end,
      minimum_nights: Math.min(30, Math.max(1, Math.round(minimumNights))),
    });
    if (error) throw error;
    await this.getSettings();
    this.notify();
  }

  async removeRule(id: string): Promise<void> {
    const { error } = await requireSupabase().from('minimum_stay_rules').delete().eq('id', id);
    if (error) throw error;
    await this.getSettings();
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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'minimum_stay_rules' }, () => {
        void this.getSettings().then(() => this.notify()).catch(() => this.notify());
      })
      .subscribe();
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }
}

export const bookingSettingsService = new BookingSettingsService();
