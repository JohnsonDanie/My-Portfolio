import { supabase } from '../lib/supabase';
import type { Project } from '../types/database';
import { placeholderProjects } from '../data/placeholder';

export const projectsService = {
  async getAll(): Promise<Project[]> {
    if (!supabase) return placeholderProjects;
    const { data, error } = await supabase
      .from('projects').select('*').order('order_index');
    if (error) return placeholderProjects;
    return data;
  },

  async getFeatured(): Promise<Project[]> {
    if (!supabase) return placeholderProjects.filter(p => p.featured);
    const { data, error } = await supabase
      .from('projects').select('*').eq('featured', true).order('order_index');
    if (error) return placeholderProjects.filter(p => p.featured);
    return data;
  },

  async getBySlug(slug: string): Promise<Project | null> {
    if (!supabase) return placeholderProjects.find(p => p.slug === slug) || null;
    const { data, error } = await supabase
      .from('projects').select('*').eq('slug', slug).single();
    if (error) return null;
    return data;
  },

  async create(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects').insert([{ ...project, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }])
      .select().single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Project>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects').update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
  },
};
