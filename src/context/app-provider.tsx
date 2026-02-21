'use client';

import { HymnsProvider } from '@/context/hymns-context';
import { PraisesProvider } from '@/context/praises-context';
import { ChoirsProvider } from '@/context/choirs-context';
import { YouthChoirsProvider } from '@/context/youth-choirs-context';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <HymnsProvider>
      <PraisesProvider>
        <ChoirsProvider>
          <YouthChoirsProvider>
            <>
              {children}
              <FirebaseErrorListener />
            </>
          </YouthChoirsProvider>
        </ChoirsProvider>
      </PraisesProvider>
    </HymnsProvider>
  );
}

    