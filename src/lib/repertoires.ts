export type SongReference = {
  id: string;
  title: string;
  type: 'hymn' | 'praise' | 'choir' | 'youth-choir';
  number?: number;
};

export type RepertoireBlock = {
  id: string;
  title: string;
  songs: SongReference[];
};

export type Repertoire = {
  id: string;
  name: string;
  createdAt: any; // Firestore Timestamp
  blocks?: RepertoireBlock[];
  
  // Legacy fields for backward compatibility
  firstHymns?: SongReference[];
  generalPraises?: SongReference[];
  preWordPraises?: SongReference[];
  sickPraises?: SongReference[];
  intermediatePraises?: SongReference[];
  finalPraises?: SongReference[];
};
