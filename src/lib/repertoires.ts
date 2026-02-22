export type SongReference = {
  id: string;
  title: string;
  type: 'praise' | 'choir' | 'youth-choir';
};

export type HymnReference = {
  id: string; // The firestore doc id, which is the number as a string
  number: number;
  title: string;
};

export type Repertoire = {
  id: string;
  name: string;
  createdAt: any; // Firestore Timestamp
  firstHymn?: HymnReference | null;
  generalPraises?: SongReference[];
  preWordPraise?: SongReference | null;
  sickPraise?: SongReference | null;
  intermediatePraise?: SongReference | null;
  finalPraise?: SongReference | null;
};

    