import { addDays, format, startOfDay } from 'date-fns';
import { isSupabaseConfigured, requireSupabase } from '../lib/supabase';

export type AvailabilityStatus = 'available' | 'booked' | 'blocked' | 'pending';

export interface AvailabilityRange {
  id: string;
  start: string;
  end: string;
  status: Exclude<AvailabilityStatus, 'available'>;
}

export const toDateKey = (date: Date) => format(date, 'yyyy-MM-dd');

type AvailabilityRow = {
  id: string;
  start_date: string;
  end_date: string;
  status: Exclude<AvailabilityStatus, 'available'>;
};

const fromRow = (row: AvailabilityRow): AvailabilityRange => ({ id: row.id, start: row.start_date, end: row.end_date, status: row.status });

/** Supabase-backed availability repository shared by the public calendar and admin. */
export class CalendarService {
  private ranges: AvailabilityRange[] = [];
  private listeners = new Set<() => void>();
  private channel: ReturnType<ReturnType<typeof requireSupabase>['channel']> | null = null;

  async getAvailability(start: Date, end: Date): Promise<Record<string, AvailabilityStatus>> {
    const ranges = await this.loadRanges(start, end);
    const availability: Record<string, AvailabilityStatus> = {};
    for (let day = startOfDay(start); day <= end; day = addDays(day, 1)) {
      const dateKey = toDateKey(day);
      const range = ranges.find((item) => dateKey >= item.start && dateKey <= item.end);
      availability[dateKey] = range?.status ?? 'available';
    }
    return availability;
  }

  async getRanges(): Promise<AvailabilityRange[]> {
    const client = requireSupabase();
    const { data, error } = await client.from('availability_ranges').select('id,start_date,end_date,status').order('start_date');
    if (error) throw error;
    this.ranges = (data ?? []).map(fromRow);
    return [...this.ranges];
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

  async checkDateAvailable(date: Date): Promise<boolean> {
    return this.isRangeAvailable(date, date);
  }

  async isRangeAvailable(from: Date, to: Date): Promise<boolean> {
    const ranges = await this.loadRanges(from, to);
    let day = startOfDay(from);
    while (day <= to) {
      const dateKey = toDateKey(day);
      if (ranges.some((range) => dateKey >= range.start && dateKey <= range.end)) return false;
      day = addDays(day, 1);
    }
    return true;
  }

  async setAvailabilityRange(range: AvailabilityRange): Promise<void> {
    const client = requireSupabase();
    const { error } = await client.from('availability_ranges').upsert({
      id: range.id,
      start_date: range.start,
      end_date: range.end,
      status: range.status,
    });
    if (error) throw error;
    await this.getRanges();
    this.notify();
  }

  async createAvailabilityRange(range: Omit<AvailabilityRange, 'id'>): Promise<void> {
    const client = requireSupabase();
    const { error } = await client.from('availability_ranges').insert({
      start_date: range.start,
      end_date: range.end,
      status: range.status,
    });
    if (error) throw error;
    await this.getRanges();
    this.notify();
  }

  async setDateAvailability(date: Date, status: 'available' | 'blocked'): Promise<void> {
    const { error } = await requireSupabase().rpc('admin_set_date_availability', {
      p_date: toDateKey(startOfDay(date)),
      p_status: status,
    });
    if (error) throw error;
    await this.getRanges();
    this.notify();
  }

  async removeAvailabilityRange(id: string): Promise<void> {
    const { error } = await requireSupabase().from('availability_ranges').delete().eq('id', id);
    if (error) throw error;
    await this.getRanges();
    this.notify();
  }

  private async loadRanges(start: Date, end: Date): Promise<AvailabilityRange[]> {
    const { data, error } = await requireSupabase()
      .from('availability_ranges')
      .select('id,start_date,end_date,status')
      .lte('start_date', toDateKey(end))
      .gte('end_date', toDateKey(start));
    if (error) throw error;
    const ranges = (data ?? []).map(fromRow);
    this.ranges = ranges;
    return ranges;
  }

  private startRealtime() {
    if (this.channel) return;
    this.channel = requireSupabase()
      .channel('availability-ranges-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'availability_ranges' }, () => {
        void this.getRanges().then(() => this.notify()).catch(() => this.notify());
      })
      .subscribe();
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }
}

export const calendarService = new CalendarService();
