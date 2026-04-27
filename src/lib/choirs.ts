export type Choir = {
  id: string;
  title: string;
  lyrics: string;
  tone?: string;
  speed?: string;
  status?: 'pending' | 'approved';
  createdAt?: any; // Firestore Timestamp
};
