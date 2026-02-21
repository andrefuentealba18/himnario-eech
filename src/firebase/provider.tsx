'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { firebaseConfig } from './config';
import { useToast } from '@/hooks/use-toast';

export type FirebaseInstances = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

const FirebaseContext = createContext<FirebaseInstances | null>(null);

// Keep a module-level instance to avoid re-initialization on re-renders
let firebaseInstances: FirebaseInstances | null = null;

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebase, setFirebase] = useState<FirebaseInstances | null>(firebaseInstances);
  const { toast } = useToast();

  useEffect(() => {
    const initialize = async () => {
      // Only initialize if it hasn't been done already
      if (firebaseInstances) {
        setFirebase(firebaseInstances);
        return;
      }
      
      if (!firebaseConfig || !(firebaseConfig as any).apiKey) {
        console.warn("Firebase config not found, skipping initialization.");
        return;
      }
      
      try {
        const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
        const firestore = getFirestore(app);
        const auth = getAuth(app);

        // Attempt to enable offline persistence
        await enableIndexedDbPersistence(firestore)
          .then(() => {
            console.log("Firebase offline persistence enabled.");
            toast({
              title: 'Modo sin conexión activado',
              description: 'Los himnos y alabanzas cargarán más rápido la próxima vez.',
              duration: 5000,
            });
          })
          .catch((err) => {
            if (err.code == 'failed-precondition') {
              console.warn("Persistence failed: can only be enabled in one tab at a time.");
            } else if (err.code == 'unimplemented') {
              console.warn("Persistence not available in this browser.");
            }
          });

        firebaseInstances = { app, auth, firestore };
        setFirebase(firebaseInstances);

      } catch (error) {
        console.error("Firebase initialization failed:", error);
      }
    };

    if (!firebaseInstances) {
        initialize();
    }
  }, [toast]);

  return (
    <FirebaseContext.Provider value={firebase}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  return useContext(FirebaseContext);
};

export const useFirebaseApp = () => useFirebase()?.app;
export const useAuth = () => useFirebase()?.auth;
export const useFirestore = () => useFirebase()?.firestore;

// Re-export hooks that require firebase context
export { useUser } from './auth/use-user';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
