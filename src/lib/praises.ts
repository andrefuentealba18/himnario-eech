export type Praise = {
  id: string;
  title: string;
  lyrics: string;
  tone?: string;
  speed?: 'Rapido' | 'Lento';
  status?: 'pending' | 'approved';
  createdAt?: any; // Firestore Timestamp
};

// The actual data is now managed by the usePraises hook in `src/hooks/use-praises.ts`
// which uses localStorage.
export const praises: Praise[] = [];

    