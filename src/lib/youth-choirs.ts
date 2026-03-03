
export type GroupType = "Coro Juventud" | "Grupo Ciclista" | "Departamento Infantil" | "Clase Dorcas" | "Departamento Juvenil";

export type YouthChoir = {
  id: string;
  title: string;
  lyrics: string;
  tone?: string;
  group: GroupType;
  status?: 'pending' | 'approved';
  createdAt?: any; // Firestore Timestamp
};
