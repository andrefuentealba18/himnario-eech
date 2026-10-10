'use client';

import { HymnsProvider } from '@/context/hymns-context';
import { PraisesProvider } from '@/context/praises-context';
import { ChoirsProvider } from '@/context/choirs-context';
import { YouthChoirsProvider } from '@/context/youth-choirs-context';
import { SpecialOccasionsProvider } from '@/context/special-occasions-context';
import { RepertoiresProvider } from '@/context/repertoires-context';
import { ChurchProvider } from '@/context/church-context';
import { ChurchSelector } from '@/components/church-selector';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ChurchProvider>
      <ChurchSelector />
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
    </ChurchProvider>
  );
}
