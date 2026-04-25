import { supabase } from '../lib/supabase';
import type { ContactMessage } from '../types/database';

export const messagesService = {
  async send(message: Omit<ContactMessage, 'id' | 'read' | 'created_at'>): Promise<void> {
    const { error } = await supabase.from('contact_messages').insert([{
      ...message,
      read: false,
      created_at: new Date().toISOString(),
    }]);
    if (error) throw error;
  },

  async getAll(): Promise<ContactMessage[]> {
    const { data, error } = await supabase
      .from('contact_messages').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async markRead(id: string): Promise<void> {
    const { error } = await supabase
      .from('contact_messages').update({ read: true }).eq('id', id);
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (error) throw error;
  },
};
