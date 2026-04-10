
export type SpecialCategory = "Bautismo" | "Santa Cena" | "Matrimonio" | "Fúnebre" | "Aniversario" | "Campaña";

export type SpecialOccasion = {
  id: string;
  title: string;
  lyrics: string;
  tone?: string;
  category: SpecialCategory;
  status?: 'pending' | 'approved';
  createdAt?: any;
};
