import { db } from '../lib/firebase';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import type { Experience } from '../types/database';

export const experienceService = {
  async getAll(): Promise<Experience[]> {
    if (!db) return [];
    try {
      const q = query(collection(db, 'experience'), orderBy('order_index'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Experience));
    } catch (error) {
      console.error('Error fetching experience:', error);
      return [];
    }
  },

  async create(exp: Omit<Experience, 'id'>): Promise<Experience> {
    if (!db) throw new Error('Firebase is not configured');
    const docRef = await addDoc(collection(db, 'experience'), exp);
    const newDoc = await getDoc(docRef);
    return { id: newDoc.id, ...newDoc.data() } as Experience;
  },

  async update(id: string, updates: Partial<Experience>): Promise<Experience> {
    if (!db) throw new Error('Firebase is not configured');
    const docRef = doc(db, 'experience', id);
    await updateDoc(docRef, updates);
    const updated = await getDoc(docRef);
    return { id: updated.id, ...updated.data() } as Experience;
  },

  async delete(id: string): Promise<void> {
    if (!db) throw new Error('Firebase is not configured');
    await deleteDoc(doc(db, 'experience', id));
  },
};
