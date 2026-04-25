import { db } from '../lib/firebase';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import type { ContactMessage } from '../types/database';

export const messagesService = {
  async getAll(): Promise<ContactMessage[]> {
    if (!db) throw new Error('Firebase is not configured');
    const q = query(collection(db, 'messages'), orderBy('created_at', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactMessage));
  },

  async create(message: Omit<ContactMessage, 'id' | 'created_at' | 'read'>): Promise<ContactMessage> {
    if (!db) throw new Error('Firebase is not configured');
    const docRef = await addDoc(collection(db, 'messages'), { 
      ...message, 
      read: false, 
      created_at: new Date().toISOString() 
    });
    const newDoc = await getDoc(docRef);
    return { id: newDoc.id, ...newDoc.data() } as ContactMessage;
  },

  async markAsRead(id: string): Promise<ContactMessage> {
    if (!db) throw new Error('Firebase is not configured');
    const docRef = doc(db, 'messages', id);
    await updateDoc(docRef, { read: true });
    const updated = await getDoc(docRef);
    return { id: updated.id, ...updated.data() } as ContactMessage;
  },

  async delete(id: string): Promise<void> {
    if (!db) throw new Error('Firebase is not configured');
    await deleteDoc(doc(db, 'messages', id));
  },
};
