import { db } from '../lib/firebase';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import type { Testimonial } from '../types/database';

export const testimonialsService = {
  async getAll(): Promise<Testimonial[]> {
    if (!db) return [];
    try {
      const q = query(collection(db, 'testimonials'), orderBy('order_index'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      return [];
    }
  },

  async create(testimonial: Omit<Testimonial, 'id'>): Promise<Testimonial> {
    if (!db) throw new Error('Firebase is not configured');
    const docRef = await addDoc(collection(db, 'testimonials'), testimonial);
    const newDoc = await getDoc(docRef);
    return { id: newDoc.id, ...newDoc.data() } as Testimonial;
  },

  async update(id: string, updates: Partial<Testimonial>): Promise<Testimonial> {
    if (!db) throw new Error('Firebase is not configured');
    const docRef = doc(db, 'testimonials', id);
    await updateDoc(docRef, updates);
    const updated = await getDoc(docRef);
    return { id: updated.id, ...updated.data() } as Testimonial;
  },

  async delete(id: string): Promise<void> {
    if (!db) throw new Error('Firebase is not configured');
    await deleteDoc(doc(db, 'testimonials', id));
  },
};
