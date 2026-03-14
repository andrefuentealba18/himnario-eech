'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentSingleTabManager, type Firestore } from 'firebase/firestore';

// Define a singleton object to hold the initialized services
const services = (() => {
  let app: FirebaseApp;
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }

  // Modern way to enable persistence using persistentLocalCache
  // This resolves the 'indexedDbLocalCache' not found error
  const firestoreInstance = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentSingleTabManager()
    })
  });

  const authInstance = getAuth(app);

  return {
    firebaseApp: app,
    auth: authInstance,
    firestore: firestoreInstance,
  };
})();

// This function now simply returns the singleton.
export function initializeFirebase() {
  return services;
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './errors';
export * from './error-emitter';
