'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

export type FirebaseInstances = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

const FirebaseContext = createContext<FirebaseInstances | null>(null);

let firebaseInstances: FirebaseInstances | null = null;

function getFirebaseInstances_cached() {
    if (firebaseInstances) {
        return firebaseInstances;
    }

    if (!firebaseConfig || !(firebaseConfig as any).apiKey) {
        console.warn("Firebase config not found, skipping initialization.");
        return null;
    }
    
    try {
        const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
        const firestore = getFirestore(app);
        const auth = getAuth(app);
        firebaseInstances = { app, auth, firestore };
        return firebaseInstances;
    } catch (error) {
        console.error("Firebase initialization failed:", error);
        return null;
    }
}


export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebase, setFirebase] = useState<FirebaseInstances | null>(null);

  useEffect(() => {
    setFirebase(getFirebaseInstances_cached());
  }, []);

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
