export type SongRequest = {
  id: string;
  submitterName: string;
  category: 'praise' | 'choir' | 'youth-choir';
  title: string;
  lyrics: string;
  tone?: string;
  speed?: 'Rapido' | 'Lento';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any; // Firestore Timestamp
};
