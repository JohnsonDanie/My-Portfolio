import { supabase } from '../lib/supabase';
import type { BlogPost } from '../types/database';
import { placeholderBlogPosts } from '../data/placeholder';

export const blogService = {
  async getPublished(): Promise<BlogPost[]> {
    if (!supabase) return placeholderBlogPosts.filter(p => p.published);
    const { data, error } = await supabase
      .from('blog_posts').select('*').eq('published', true).order('created_at', { ascending: false });
    if (error) return placeholderBlogPosts.filter(p => p.published);
    return data;
  },

  async getAll(): Promise<BlogPost[]> {
    if (!supabase) return placeholderBlogPosts;
    const { data, error } = await supabase
      .from('blog_posts').select('*').order('created_at', { ascending: false });
    if (error) return placeholderBlogPosts;
    return data;
  },

  async getBySlug(slug: string): Promise<BlogPost | null> {
    if (!supabase) return placeholderBlogPosts.find(p => p.slug === slug) || null;
    const { data, error } = await supabase
      .from('blog_posts').select('*').eq('slug', slug).single();
    if (error) return null;
    return data;
  },

  async create(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost> {
    const { data, error } = await supabase
      .from('blog_posts').insert([{ ...post, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }])
      .select().single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
    const { data, error } = await supabase
      .from('blog_posts').update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) throw error;
  },
};
