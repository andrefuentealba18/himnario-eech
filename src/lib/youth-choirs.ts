export type YouthChoir = {
  id: string;
  title: string;
  lyrics: string;
  tone?: string;
  status?: 'pending' | 'approved';
  createdAt?: any; // Firestore Timestamp
};
