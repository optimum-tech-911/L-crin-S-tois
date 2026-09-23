import { addDays, endOfWeek, format, startOfDay, subDays } from 'date-fns';

export type AvailabilityStatus = 'available' | 'booked' | 'blocked' | 'pending';

export interface AvailabilityRange {
  id: string;
  start: string;
  end: string;
  status: Exclude<AvailabilityStatus, 'available'>;
}

export interface AvailabilityNotice {
  title: string;
  message: string;
}

const toDateKey = (date: Date) => format(date, 'yyyy-MM-dd');

/**
 * Local availability repository. Replace the body of these methods with Supabase
 * queries later; the calendar UI intentionally depends only on this contract.
 */
export class CalendarService {
  private ranges: AvailabilityRange[];
  private listeners = new Set<() => void>();

  private readonly storageKey = 'ecrin-setois:availability-ranges';

  constructor() {
    const today = startOfDay(new Date());

    // Demo inventory for the front end. An admin panel can later persist these
    // same range objects in Supabase instead of keeping them in memory.
    const defaults: AvailabilityRange[] = [
      { id: 'demo-booked', start: toDateKey(addDays(today, 4)), end: toDateKey(addDays(today, 6)), status: 'booked' },
      { id: 'demo-blocked', start: toDateKey(addDays(today, 13)), end: toDateKey(addDays(today, 16)), status: 'blocked' },
      { id: 'demo-pending', start: toDateKey(addDays(today, 27)), end: toDateKey(addDays(today, 29)), status: 'pending' },
    ];
    this.ranges = this.readFromStorage() ?? defaults;

    // Keep open public and admin tabs in sync while the project uses local data.
    if (typeof window !== 'undefined') window.addEventListener('storage', this.handleStorage);
  }

  async getAvailability(start: Date, end: Date): Promise<Record<string, AvailabilityStatus>> {
    const availability: Record<string, AvailabilityStatus> = {};
    let day = startOfDay(start);

    while (day <= end) {
      availability[toDateKey(day)] = this.getDateStatus(day);
      day = addDays(day, 1);
    }

    return availability;
  }

  async getRanges(): Promise<AvailabilityRange[]> {
    return [...this.ranges].sort((a, b) => a.start.localeCompare(b.start));
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /** Compatibility helper for the earlier single-day calendar component. */
  async checkDateAvailable(date: Date): Promise<boolean> {
    return this.getDateStatus(date) === 'available';
  }

  async isRangeAvailable(from: Date, to: Date): Promise<boolean> {
    let day = startOfDay(from);

    while (day <= to) {
      if (this.getDateStatus(day) !== 'available') return false;
      day = addDays(day, 1);
    }

    return true;
  }

  async getAvailabilityNotice(referenceDate = new Date()): Promise<AvailabilityNotice | null> {
    const today = startOfDay(referenceDate);
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    let availableDays = 0;
    let day = today;

    while (day <= weekEnd) {
      if (this.getDateStatus(day) === 'available') availableDays += 1;
      day = addDays(day, 1);
    }

    if (!availableDays) return null;

    return { title: 'Disponibilités', message: 'Des disponibilités cette semaine !' };
  }

  /** Future admin action: create or replace an availability block. */
  async setAvailabilityRange(range: AvailabilityRange): Promise<void> {
    this.ranges = [
      ...this.ranges.filter((existing) => existing.id !== range.id),
      range,
    ];
    this.persist();
  }

  async createAvailabilityRange(range: Omit<AvailabilityRange, 'id'>): Promise<void> {
    await this.setAvailabilityRange({ ...range, id: crypto.randomUUID() });
  }

  /**
   * Calendar-first editing for the back office. Making one date available
   * cleanly cuts that day out of any overlapping unavailable period.
   */
  async setDateAvailability(date: Date, status: 'available' | 'blocked'): Promise<void> {
    const day = toDateKey(startOfDay(date));
    const remaining: AvailabilityRange[] = [];

    for (const range of this.ranges) {
      if (day < range.start || day > range.end) {
        remaining.push(range);
        continue;
      }

      if (range.start < day) {
        remaining.push({ ...range, end: toDateKey(subDays(date, 1)) });
      }
      if (range.end > day) {
        remaining.push({ ...range, id: crypto.randomUUID(), start: toDateKey(addDays(date, 1)) });
      }
    }

    if (status === 'blocked') {
      remaining.push({ id: crypto.randomUUID(), start: day, end: day, status: 'blocked' });
    }

    this.ranges = remaining;
    this.persist();
  }

  /** Future admin action: remove an availability block by exact dates. */
  async removeAvailabilityRange(id: string): Promise<void> {
    this.ranges = this.ranges.filter((range) => range.id !== id);
    this.persist();
  }

  private getDateStatus(date: Date): AvailabilityStatus {
    const dateKey = toDateKey(date);
    const matchingRange = this.ranges.find((range) => dateKey >= range.start && dateKey <= range.end);
    return matchingRange?.status ?? 'available';
  }

  private readFromStorage(): AvailabilityRange[] | null {
    if (typeof window === 'undefined') return null;
    try {
      const stored = window.localStorage.getItem(this.storageKey);
      if (!stored) return null;
      const ranges = JSON.parse(stored) as AvailabilityRange[];
      return Array.isArray(ranges) ? ranges.filter((range) => range.id && range.start && range.end && range.status) : null;
    } catch {
      return null;
    }
  }

  private persist() {
    if (typeof window !== 'undefined') window.localStorage.setItem(this.storageKey, JSON.stringify(this.ranges));
    this.notify();
  }

  private handleStorage = (event: StorageEvent) => {
    if (event.key !== this.storageKey) return;
    const persistedRanges = this.readFromStorage();
    if (!persistedRanges) return;
    this.ranges = persistedRanges;
    this.notify();
  };

  private notify() {
    this.listeners.forEach((listener) => listener());
  }
}

export const calendarService = new CalendarService();
export { toDateKey };
