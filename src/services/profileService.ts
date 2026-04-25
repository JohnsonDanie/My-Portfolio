import { supabase } from '../lib/supabase';
import type { Profile } from '../types/database';
import { placeholderProfile } from '../data/placeholder';

export const profileService = {
  async get(): Promise<Profile> {
    if (!supabase) return placeholderProfile;
    const { data, error } = await supabase.from('profile').select('*').single();
    if (error) return placeholderProfile;
    return data;
  },

  async update(id: string, updates: Partial<Profile>): Promise<Profile> {
    const { data, error } = await supabase
      .from('profile')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};
