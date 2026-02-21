'use client';

import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

// Re-export all the hooks
export { useAuth, useUser, useFirestore, useCollection, useDoc, useFirebaseApp, FirebaseProvider } from './provider';
export { FirebaseClientProvider } from './client-provider';

export type FirebaseInstances = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

let instances: FirebaseInstances | null = null;

export function initializeFirebase(): FirebaseInstances | null {
  if (instances) {
    return instances;
  }

  // Prevent initialization if config is not populated
  if (!firebaseConfig || !(firebaseConfig as any).apiKey) {
    console.warn("Firebase config not found, skipping initialization.");
    return null;
  }

  try {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const auth = getAuth(app);
    const firestore = getFirestore(app);

    instances = { app, auth, firestore };
    return instances;
  } catch (error) {
    console.error("Firebase initialization failed:", error);
    return null;
  }
}
