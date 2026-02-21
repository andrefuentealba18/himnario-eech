'use client';

import { HymnsProvider } from '@/context/hymns-context';
import { PraisesProvider } from '@/context/praises-context';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <HymnsProvider>
      <PraisesProvider>
        <>
          {children}
          <FirebaseErrorListener />
        </>
      </PraisesProvider>
    </HymnsProvider>
  );
}
