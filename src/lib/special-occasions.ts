
export type SpecialCategory = "Predicación" | "Fúnebre" | "Cumpleaños" | "Bautismos";

export type SpecialOccasion = {
  id: string;
  title: string;
  lyrics: string;
  tone?: string;
  category: SpecialCategory;
  status?: 'pending' | 'approved';
  createdAt?: any;
};
