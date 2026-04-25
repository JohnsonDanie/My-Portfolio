import { db } from '../lib/firebase';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import type { Skill } from '../types/database';
import { placeholderSkills } from '../data/placeholder';

export const skillsService = {
  async getAll(): Promise<Skill[]> {
    if (!db) return placeholderSkills;
    try {
      const q = query(collection(db, 'skills'), orderBy('category'), orderBy('order_index'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Skill));
    } catch {
      return placeholderSkills;
    }
  },

  async create(skill: Omit<Skill, 'id'>): Promise<Skill> {
    if (!db) throw new Error('Firebase is not configured');
    const docRef = await addDoc(collection(db, 'skills'), skill);
    const newDoc = await getDoc(docRef);
    return { id: newDoc.id, ...newDoc.data() } as Skill;
  },

  async update(id: string, updates: Partial<Skill>): Promise<Skill> {
    if (!db) throw new Error('Firebase is not configured');
    const docRef = doc(db, 'skills', id);
    await updateDoc(docRef, updates);
    const updated = await getDoc(docRef);
    return { id: updated.id, ...updated.data() } as Skill;
  },

  async delete(id: string): Promise<void> {
    if (!db) throw new Error('Firebase is not configured');
    await deleteDoc(doc(db, 'skills', id));
  },
};
