import { db } from '../lib/firebase';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import type { BlogPost } from '../types/database';

export const blogService = {
  async getPublished(): Promise<BlogPost[]> {
    if (!db) return [];
    try {
      const q = query(collection(db, 'blog_posts'), where('published', '==', true), orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return [];
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
    } catch (error) {
      console.error('Error fetching published blog posts:', error);
      return [];
    }
  },

  async getAll(): Promise<BlogPost[]> {
    if (!db) return [];
    try {
      const q = query(collection(db, 'blog_posts'), orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
    } catch (error) {
      console.error('Error fetching all blog posts:', error);
      return [];
    }
  },

  async getBySlug(slug: string): Promise<BlogPost | null> {
    if (!db) return null;
    try {
      const q = query(collection(db, 'blog_posts'), where('slug', '==', slug));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as BlogPost;
    } catch (error) {
      console.error('Error fetching blog post by slug:', error);
      return null;
    }
  },

  async create(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost> {
    if (!db) throw new Error('Firebase is not configured');
    const docRef = await addDoc(collection(db, 'blog_posts'), { 
      ...post, 
      created_at: new Date().toISOString(), 
      updated_at: new Date().toISOString() 
    });
    const newDoc = await getDoc(docRef);
    return { id: newDoc.id, ...newDoc.data() } as BlogPost;
  },

  async update(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
    if (!db) throw new Error('Firebase is not configured');
    const docRef = doc(db, 'blog_posts', id);
    await updateDoc(docRef, { ...updates, updated_at: new Date().toISOString() });
    const updated = await getDoc(docRef);
    return { id: updated.id, ...updated.data() } as BlogPost;
  },

  async delete(id: string): Promise<void> {
    if (!db) throw new Error('Firebase is not configured');
    await deleteDoc(doc(db, 'blog_posts', id));
  },
};
