export type Hymn = {
  id: string;
  number: number;
  title: string;
  lyrics: string;
  tone?: string;
};

// The actual data is now managed by the useHymns hook in `src/context/hymns-context.tsx`
// which uses Firestore.
export const hymns: Hymn[] = [];
