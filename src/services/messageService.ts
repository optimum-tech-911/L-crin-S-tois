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

/** Local repository with the same interface a Supabase adapter will later expose. */
export class MessageService {
  private readonly storageKey = 'ecrin-setois:contact-messages';

  async submitMessage(input: ContactMessageInput): Promise<StoredContactMessage> {
    const message: StoredContactMessage = { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString(), status: 'new' };
    this.write([message, ...this.read()]);
    return message;
  }

  async getMessages(): Promise<StoredContactMessage[]> {
    return this.read();
  }

  async updateMessageStatus(id: string, status: ContactMessageStatus): Promise<void> {
    this.write(this.read().map((message) => message.id === id ? { ...message, status } : message));
  }

  private read(): StoredContactMessage[] {
    if (typeof window === 'undefined') return [];
    try {
      const value = window.localStorage.getItem(this.storageKey);
      return value ? JSON.parse(value) as StoredContactMessage[] : [];
    } catch {
      return [];
    }
  }

  private write(messages: StoredContactMessage[]) {
    if (typeof window !== 'undefined') window.localStorage.setItem(this.storageKey, JSON.stringify(messages));
  }
}

export const messageService = new MessageService();
