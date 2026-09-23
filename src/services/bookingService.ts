import { differenceInCalendarDays } from 'date-fns';
import { bookingSettingsService } from './bookingSettingsService';
import { calendarService } from './calendarService';

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

export class BookingService {
  private readonly storageKey = 'ecrin-setois:reservation-requests';

  async submitReservationRequest(request: BookingRequest): Promise<{ success: boolean; message: string; id: string }> {
    const settings = await bookingSettingsService.getSettings();
    const nights = differenceInCalendarDays(request.checkOut, request.checkIn);
    if (nights < settings.minimumNights) {
      return { success: false, message: `Le séjour minimum est de ${settings.minimumNights} nuits.`, id: '' };
    }
    if (!(await calendarService.isRangeAvailable(request.checkIn, request.checkOut))) {
      return { success: false, message: 'Ces dates ne sont plus entièrement disponibles. Veuillez consulter le calendrier.', id: '' };
    }

    const booking: StoredBookingRequest = {
      ...request,
      id: crypto.randomUUID(),
      checkIn: request.checkIn.toISOString(),
      checkOut: request.checkOut.toISOString(),
      createdAt: new Date().toISOString(),
      status: 'new',
    };
    this.write([booking, ...this.read()]);

    return { success: true, message: 'Votre demande a bien été enregistrée.', id: booking.id };
  }

  async getReservationRequests(): Promise<StoredBookingRequest[]> {
    return this.read();
  }

  async updateReservationStatus(id: string, status: BookingRequestStatus): Promise<void> {
    this.write(this.read().map((booking) => booking.id === id ? { ...booking, status } : booking));
  }

  private read(): StoredBookingRequest[] {
    if (typeof window === 'undefined') return [];
    try {
      const value = window.localStorage.getItem(this.storageKey);
      return value ? JSON.parse(value) as StoredBookingRequest[] : [];
    } catch {
      return [];
    }
  }

  private write(bookings: StoredBookingRequest[]) {
    if (typeof window !== 'undefined') window.localStorage.setItem(this.storageKey, JSON.stringify(bookings));
  }
}

export const bookingService = new BookingService();
