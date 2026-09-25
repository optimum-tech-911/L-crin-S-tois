import { isSupabaseConfigured, requireSupabase } from '../lib/supabase';

export type ContactMessageStatus = 'new' | 'read' | 'replied';

export interface ContactMessageInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface StoredContactMessage extends ContactMessageInput {
  id: string;
  createdAt: string;
  status: ContactMessageStatus;
}

type MessageRow = {
  id: string; first_name: string; last_name: string; email: string; phone: string;
  subject: string; message: string; created_at: string; status: ContactMessageStatus;
};

const fromRow = (row: MessageRow): StoredContactMessage => ({
  id: row.id, firstName: row.first_name, lastName: row.last_name, email: row.email,
  phone: row.phone, subject: row.subject, message: row.message, createdAt: row.created_at, status: row.status,
});

/** Contact submissions are public inserts; reading and triaging requires admin RLS. */
export class MessageService {
  private listeners = new Set<() => void>();
  private channel: ReturnType<ReturnType<typeof requireSupabase>['channel']> | null = null;

  async submitMessage(input: ContactMessageInput): Promise<void> {
    const { error } = await requireSupabase().from('contact_messages').insert({
      first_name: input.firstName.trim(), last_name: input.lastName.trim(), email: input.email.trim(),
      phone: input.phone?.trim() ?? '', subject: input.subject.trim(), message: input.message.trim(),
    });
    if (error) throw error;
  }

  async getMessages(): Promise<StoredContactMessage[]> {
    const { data, error } = await requireSupabase().from('contact_messages').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return ((data ?? []) as MessageRow[]).map(fromRow);
  }

  async updateMessageStatus(id: string, status: ContactMessageStatus): Promise<void> {
    const { error } = await requireSupabase().from('contact_messages').update({ status }).eq('id', id);
    if (error) throw error;
    this.notify();
  }

  subscribe(listener: () => void): () => void {
    if (!isSupabaseConfigured) return () => undefined;
    this.listeners.add(listener);
    if (!this.channel) this.channel = requireSupabase().channel('contact-messages-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_messages' }, () => this.notify()).subscribe();
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

export const messageService = new MessageService();
