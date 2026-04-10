
'use client';

import { HymnsProvider } from '@/context/hymns-context';
import { PraisesProvider } from '@/context/praises-context';
import { ChoirsProvider } from '@/context/choirs-context';
import { YouthChoirsProvider } from '@/context/youth-choirs-context';
import { SpecialOccasionsProvider } from '@/context/special-occasions-context';
import { RepertoiresProvider } from '@/context/repertoires-context';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <HymnsProvider>
      <PraisesProvider>
        <ChoirsProvider>
          <YouthChoirsProvider>
            <SpecialOccasionsProvider>
              <RepertoiresProvider>
                {children}
                <FirebaseErrorListener />
              </RepertoiresProvider>
            </SpecialOccasionsProvider>
          </YouthChoirsProvider>
        </ChoirsProvider>
      </PraisesProvider>
    </HymnsProvider>
  );
}
