'use client';

import { HymnsProvider } from '@/context/hymns-context';
import { PraisesProvider } from '@/context/praises-context';

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <HymnsProvider>
      <PraisesProvider>{children}</PraisesProvider>
    </HymnsProvider>
  );
}
