import { supabase } from '../lib/supabase';
import type { Experience } from '../types/database';
import { placeholderExperience } from '../data/placeholder';

export const experienceService = {
  async getAll(): Promise<Experience[]> {
    if (!supabase) return placeholderExperience;
    const { data, error } = await supabase
      .from('experience').select('*').order('order_index');
    if (error) return placeholderExperience;
    return data;
  },

  async create(exp: Omit<Experience, 'id'>): Promise<Experience> {
    const { data, error } = await supabase.from('experience').insert([exp]).select().single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Experience>): Promise<Experience> {
    const { data, error } = await supabase
      .from('experience').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('experience').delete().eq('id', id);
    if (error) throw error;
  },
};
