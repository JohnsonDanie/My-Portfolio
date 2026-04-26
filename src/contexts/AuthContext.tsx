import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  type User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  sendSignInLinkToEmail,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isFirebaseConfigured: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isFirebaseConfigured = auth !== null;

  useEffect(() => {
    // If Firebase is not configured, skip auth subscription entirely
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isFirebaseConfigured]);

  const signInWithEmail = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase Auth is not configured. Please add your Firebase credentials to the .env file.');
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithMagicLink = async (email: string) => {
    if (!auth) throw new Error('Firebase Auth is not configured. Please add your Firebase credentials to the .env file.');
    const actionCodeSettings = {
      url: window.location.origin + '/admin/login',
      handleCodeInApp: true,
    };
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem('emailForSignIn', email);
  };

  const signOut = async () => {
    if (!auth) return; // No-op if not configured
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isFirebaseConfigured, signInWithEmail, signInWithMagicLink, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
