export interface Tache {
  id: number;
  titre: string;
  description: string | null;
  categorie: "physique" | "mental" | "paresseux" | null;
  date_limite: string | null;  // ISO 8601 datetime string
  terminee: boolean;
  profondeur: number;
  progression?: number;
  sous_taches: Tache[];
}

export interface Profil {
  niveau: number;
  taches_completees: number;
  taches_niveau: number;
  taches_prochain_niveau: number | null;
  progression: number;
}

export interface Categorie {
  type: "physique" | "mental";
  icone: string;
  niveau: number;
  taches_niveau: number;
  taches_prochain: number | null;
  progression: number;
}

export interface Competences {
  intel: number;
  force: number;
  defense: number;
  vie: number;
  magie: number;
  points_disponibles: number;
}

export type StatKey = "intel" | "force" | "defense" | "vie" | "magie";
