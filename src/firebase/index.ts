'use client';

import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

// Re-export all the hooks and providers
export { useAuth, useUser, useFirestore, useCollection, useDoc, useFirebaseApp, FirebaseProvider } from './provider';
export { FirebaseClientProvider } from './client-provider';

export type FirebaseInstances = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};
