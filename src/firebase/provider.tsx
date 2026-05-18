'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useEffect, useState } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged, signInAnonymously } from 'firebase/auth';

export interface FirebaseContextState {
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  user: User | null;
  isUserLoading: boolean;
  areServicesAvailable: boolean;
}

export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  ...services
}) => {
  const { auth } = services;
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  
  useEffect(() => {
    if (auth) {
      try {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            setUser(user);
            setIsUserLoading(false);
          } else {
            // If no user, sign in anonymously. The onAuthStateChanged will be called again with the new user.
            signInAnonymously(auth).catch((error) => {
              console.error("Error en el inicio de sesión anónimo", error);
              setIsUserLoading(false);
            });
          }
        });
        return () => unsubscribe();
      } catch (e) {
        console.error("Error initializing auth state listener:", e);
        setIsUserLoading(false);
      }
    } else {
      setIsUserLoading(false);
    }
  }, [auth]);

  const contextValue = useMemo(() => ({
    ...services,
    user, 
    isUserLoading, 
    areServicesAvailable: !!(services.firebaseApp && services.firestore && services.auth),
  }), [services, user, isUserLoading]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      {children}
    </FirebaseContext.Provider>
  );
};


export const useFirebase = (): FirebaseContextState => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }
  return context;
};

export const useAuth = (): Auth | null => {
  return useFirebase().auth;
};

export const useFirestore = (): Firestore | null => {
  return useFirebase().firestore;
};

export const useFirebaseApp = (): FirebaseApp | null => {
  return useFirebase().firebaseApp;
};

type MemoFirebase <T> = T & {__memo?: boolean};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList | undefined): T {
  const memoized = useMemo(factory, deps || []);
  if (typeof memoized === 'object' && memoized !== null) {
    Object.defineProperty(memoized, '__memo', { value: true, configurable: true });
  }
  return memoized;
}

export const useUser = () => {
    const { user, isUserLoading } = useFirebase();
    return { user, isUserLoading, userError: null };
};
