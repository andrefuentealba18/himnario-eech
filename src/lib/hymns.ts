export type Hymn = {
  number: number;
  title: string;
  lyrics: string;
};

export const hymns: Hymn[] = [];

export function getHymnById(id: number): Hymn | undefined {
  return hymns.find(hymn => hymn.number === id);
}
