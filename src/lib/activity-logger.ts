import { collection, addDoc, serverTimestamp, Firestore } from 'firebase/firestore';

export interface ActivityLog {
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE';
  type: string;
  title: string;
  churchId: string;
  churchName: string;
  userName: string;
  timestamp?: any;
}

export const logGlobalActivity = async (
  firestore: Firestore | null,
  data: Omit<ActivityLog, 'timestamp'>
) => {
  if (!firestore) return;
  try {
    await addDoc(collection(firestore, 'activityLogs'), {
      ...data,
      timestamp: serverTimestamp()
    });
  } catch (e) {
    console.error("Failed to log activity", e);
  }
};
