'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { firebaseConfig } from './config';

export type FirebaseInstances = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

const FirebaseContext = createContext<FirebaseInstances | null>(null);

export const FirebaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [instances, setInstances] = useState<FirebaseInstances | null>(null);

  useEffect(() => {
    const initialize = async () => {
      if (!firebaseConfig || !(firebaseConfig as any).apiKey) {
        console.warn("La configuración de Firebase está ausente. La aplicación no se puede conectar a Firebase.");
        return;
      }

      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      const auth = getAuth(app);
      const firestore = getFirestore(app);

      try {
        await enableIndexedDbPersistence(firestore);
      } catch (err: any) {
        if (err.code === 'failed-precondition') {
          console.warn("La persistencia de Firestore falló: solo se puede habilitar en una pestaña a la vez.");
        } else if (err.code === 'unimplemented') {
          console.warn("La persistencia de Firestore no es compatible con este navegador.");
        }
      }
      
      setInstances({ app, auth, firestore });
    };

    initialize();
  }, []); // El error estaba aquí, la dependencia [instances] creaba un bucle infinito.

  return (
    <FirebaseContext.Provider value={instances}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);
export const useFirebaseApp = () => useFirebase()?.app;
export const useAuth = () => useFirebase()?.auth;
export const useFirestore = () => useFirebase()?.firestore;
