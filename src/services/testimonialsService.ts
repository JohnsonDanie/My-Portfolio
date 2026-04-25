import { supabase } from '../lib/supabase';
import type { Testimonial } from '../types/database';
import { placeholderTestimonials } from '../data/placeholder';

export const testimonialsService = {
  async getAll(): Promise<Testimonial[]> {
    if (!supabase) return placeholderTestimonials;
    const { data, error } = await supabase
      .from('testimonials').select('*').order('order_index');
    if (error) return placeholderTestimonials;
    return data;
  },

  async create(t: Omit<Testimonial, 'id'>): Promise<Testimonial> {
    const { data, error } = await supabase.from('testimonials').insert([t]).select().single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Testimonial>): Promise<Testimonial> {
    const { data, error } = await supabase
      .from('testimonials').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) throw error;
  },
};
