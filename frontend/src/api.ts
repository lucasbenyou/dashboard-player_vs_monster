import type { Tache, Profil, Categorie, Competences, StatKey } from "./types";

const API = "/api";

function token(): string {
  return localStorage.getItem("token") ?? "";
}

function authHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token()}`,
  };
}

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Erreur réseau" }));
    throw new Error(err.detail ?? "Erreur");
  }
  return res.json() as Promise<T>;
}

// ── Auth ──────────────────────────────────────────────────

export async function seConnecter(nom: string, motDePasse: string): Promise<string> {
  const res = await fetch(`${API}/connexion`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nom, mot_de_passe: motDePasse }),
  });
  const data = await json<{ access_token: string }>(res);
  return data.access_token;
}

export async function sInscrire(nom: string, motDePasse: string): Promise<void> {
  const res = await fetch(`${API}/inscription`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nom, mot_de_passe: motDePasse }),
  });
  await json(res);
}

// ── Profil / Niveau ───────────────────────────────────────

export async function getProfil(): Promise<Profil> {
  const res = await fetch(`${API}/profil`, { headers: authHeaders() });
  return json<Profil>(res);
}

// ── Catégories ────────────────────────────────────────────

export async function getCategories(): Promise<Categorie[]> {
  const res = await fetch(`${API}/categories`, { headers: authHeaders() });
  return json<Categorie[]>(res);
}

// ── Compétences ───────────────────────────────────────────

export async function getCompetences(): Promise<Competences> {
  const res = await fetch(`${API}/competences`, { headers: authHeaders() });
  return json<Competences>(res);
}

export async function ameliorerStat(stat: StatKey): Promise<void> {
  const res = await fetch(`${API}/competences/${stat}`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  await json(res);
}

// ── Tâches ────────────────────────────────────────────────

export async function getTaches(): Promise<Tache[]> {
  const res = await fetch(`${API}/taches`, { headers: authHeaders() });
  if (res.status === 401) throw new Error("401");
  return json<Tache[]>(res);
}

export async function creerTache(
  titre: string,
  description: string | null,
  categorie: string | null,
  dateLimite: string | null,
  parentId?: number
): Promise<Tache> {
  const res = await fetch(`${API}/taches`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ titre, description, categorie, date_limite: dateLimite, parent_id: parentId ?? null }),
  });
  return json<Tache>(res);
}

export async function terminerTache(id: number): Promise<void> {
  const res = await fetch(`${API}/taches/${id}/terminer`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  if (res.status === 401) throw new Error("401");
  await json(res);
}

export async function supprimerTache(id: number): Promise<void> {
  await fetch(`${API}/taches/${id}`, { method: "DELETE", headers: authHeaders() });
}
