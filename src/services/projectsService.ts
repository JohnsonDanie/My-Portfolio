import { db } from '../lib/firebase';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import type { Project } from '../types/database';

export const projectsService = {
  async getAll(): Promise<Project[]> {
    if (!db) return [];
    try {
      const q = query(collection(db, 'projects'), orderBy('order_index'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
    } catch (error) {
      console.error('Error fetching all projects:', error);
      return [];
    }
  },

  async getFeatured(): Promise<Project[]> {
    if (!db) return [];
    try {
      const q = query(collection(db, 'projects'), where('featured', '==', true), orderBy('order_index'));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return [];
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
    } catch (error) {
      console.error('Error fetching featured projects:', error);
      return [];
    }
  },

  async getBySlug(slug: string): Promise<Project | null> {
    if (!db) return null;
    try {
      const q = query(collection(db, 'projects'), where('slug', '==', slug));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Project;
    } catch (error) {
      console.error('Error fetching project by slug:', error);
      return null;
    }
  },

  async create(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    if (!db) throw new Error('Firebase is not configured');
    const docRef = await addDoc(collection(db, 'projects'), { 
      ...project, 
      created_at: new Date().toISOString(), 
      updated_at: new Date().toISOString() 
    });
    const newDoc = await getDoc(docRef);
    return { id: newDoc.id, ...newDoc.data() } as Project;
  },

  async update(id: string, updates: Partial<Project>): Promise<Project> {
    if (!db) throw new Error('Firebase is not configured');
    const docRef = doc(db, 'projects', id);
    await updateDoc(docRef, { ...updates, updated_at: new Date().toISOString() });
    const updated = await getDoc(docRef);
    return { id: updated.id, ...updated.data() } as Project;
  },

  async delete(id: string): Promise<void> {
    if (!db) throw new Error('Firebase is not configured');
    await deleteDoc(doc(db, 'projects', id));
  },
};
