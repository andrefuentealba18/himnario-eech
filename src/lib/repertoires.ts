export type SongReference = {
  id: string;
  title: string;
  type: 'hymn' | 'praise' | 'choir' | 'youth-choir';
  number?: number;
};

export type Repertoire = {
  id: string;
  name: string;
  createdAt: any; // Firestore Timestamp
  firstHymns?: SongReference[];
  generalPraises?: SongReference[];
  preWordPraises?: SongReference[];
  sickPraises?: SongReference[];
  intermediatePraises?: SongReference[];
  finalPraises?: SongReference[];
};
