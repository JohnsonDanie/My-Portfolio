import { supabase } from '../lib/supabase';
import type { Skill } from '../types/database';
import { placeholderSkills } from '../data/placeholder';

export const skillsService = {
  async getAll(): Promise<Skill[]> {
    if (!supabase) return placeholderSkills;
    const { data, error } = await supabase
      .from('skills').select('*').order('category').order('order_index');
    if (error) return placeholderSkills;
    return data;
  },

  async create(skill: Omit<Skill, 'id'>): Promise<Skill> {
    const { data, error } = await supabase.from('skills').insert([skill]).select().single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Skill>): Promise<Skill> {
    const { data, error } = await supabase
      .from('skills').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (error) throw error;
  },
};
