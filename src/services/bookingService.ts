import { format } from 'date-fns';
import { isSupabaseConfigured, requireSupabase } from '../lib/supabase';

export interface BookingRequest {
  checkIn: Date;
  checkOut: Date;
  guests: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  message?: string;
}

export type BookingRequestStatus = 'new' | 'contacted' | 'confirmed' | 'declined';

export interface StoredBookingRequest extends Omit<BookingRequest, 'checkIn' | 'checkOut'> {
  id: string;
  checkIn: string;
  checkOut: string;
  createdAt: string;
  status: BookingRequestStatus;
}

type BookingRow = {
  id: string; check_in: string; check_out: string; guests: number; first_name: string;
  last_name: string; email: string; phone: string; country: string; message: string | null;
  created_at: string; status: BookingRequestStatus;
};

const fromRow = (row: BookingRow): StoredBookingRequest => ({
  id: row.id, checkIn: row.check_in, checkOut: row.check_out, guests: row.guests,
  firstName: row.first_name, lastName: row.last_name, email: row.email, phone: row.phone,
  country: row.country, message: row.message ?? undefined, createdAt: row.created_at, status: row.status,
});

/** Supabase-backed booking request flow. Availability is validated atomically by the database RPC. */
export class BookingService {
  private listeners = new Set<() => void>();
  private channel: ReturnType<ReturnType<typeof requireSupabase>['channel']> | null = null;

  async submitReservationRequest(request: BookingRequest): Promise<{ success: boolean; message: string; id: string }> {
    const { data, error } = await requireSupabase().rpc('submit_reservation_request', {
      p_check_in: format(request.checkIn, 'yyyy-MM-dd'), p_check_out: format(request.checkOut, 'yyyy-MM-dd'),
      p_guests: request.guests, p_first_name: request.firstName.trim(), p_last_name: request.lastName.trim(),
      p_email: request.email.trim(), p_phone: request.phone.trim(), p_country: request.country.trim(),
      p_message: request.message?.trim() || null,
    });
    if (error) return { success: false, message: error.message || 'Votre demande n’a pas pu être envoyée. Réessayez dans un instant.', id: '' };
    return { success: true, message: 'Votre demande a bien été enregistrée.', id: data as string };
  }

  async getReservationRequests(): Promise<StoredBookingRequest[]> {
    const { data, error } = await requireSupabase().from('reservation_requests').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return ((data ?? []) as BookingRow[]).map(fromRow);
  }

  async updateReservationStatus(id: string, status: BookingRequestStatus): Promise<void> {
    const { error } = await requireSupabase().rpc('admin_update_reservation_status', { p_id: id, p_status: status });
    if (error) throw error;
    this.notify();
  }

  subscribe(listener: () => void): () => void {
    if (!isSupabaseConfigured) return () => undefined;
    this.listeners.add(listener);
    if (!this.channel) this.channel = requireSupabase().channel('reservation-requests-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservation_requests' }, () => this.notify()).subscribe();
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

export const bookingService = new BookingService();
