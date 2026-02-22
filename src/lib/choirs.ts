export type Choir = {
  id: string;
  title: string;
  lyrics: string;
  tone?: string;
  speed?: 'Rapido' | 'Lento';
  status?: 'pending' | 'approved';
  createdAt?: any; // Firestore Timestamp
};
