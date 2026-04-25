import { db } from '../lib/firebase';
import { collection, getDocs, doc, updateDoc, query, limit } from 'firebase/firestore';
import type { Profile } from '../types/database';
import { placeholderProfile } from '../data/placeholder';

export const profileService = {
  async get(): Promise<Profile> {
    if (!db) return placeholderProfile;
    try {
      const q = query(collection(db, 'profile'), limit(1));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return placeholderProfile;
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Profile;
    } catch {
      return placeholderProfile;
    }
  },

  async update(id: string, updates: Partial<Profile>): Promise<Profile> {
    if (!db) throw new Error('Firebase is not configured');
    const docRef = doc(db, 'profile', id);
    await updateDoc(docRef, { ...updates, updated_at: new Date().toISOString() });
    return this.get();
  },
};
