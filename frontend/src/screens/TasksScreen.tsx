import { useState, useEffect, useCallback } from "react";
import {
  getProfil, getCategories, getCompetences,
  getTaches, creerTache, terminerTache, supprimerTache, ameliorerStat,
} from "../api";
import type { Profil, Categorie, Competences, Tache, StatKey } from "../types";
import NiveauCarte from "../components/NiveauCarte";
import CategoriesCarte from "../components/CategoriesCarte";
import CompetencesCarte from "../components/CompetencesCarte";
import TacheItem from "../components/TacheItem";
import QuestesTerminees from "../components/QuestesTerminees";
import { IconDuree, IconCalendrier } from "../components/Icons";

type TypeLimite = "aucune" | "duree" | "date";
type Onglet = "cours" | "terminees";

interface Props {
  nom: string;
  onDeconnexion: () => void;
}

export default function TasksScreen({ nom, onDeconnexion }: Props) {
  const [profil, setProfil]           = useState<Profil | null>(null);
  const [categories, setCategories]   = useState<Categorie[]>([]);
  const [competences, setCompetences] = useState<Competences | null>(null);
  const [taches, setTaches]           = useState<Tache[]>([]);

  const [onglet, setOnglet]           = useState<Onglet>("cours");
  const [formulaireVisible, setFormulaireVisible] = useState(false);
  const [titre, setTitre]             = useState("");
  const [description, setDescription] = useState("");
  const [categorie, setCategorie]     = useState("physique");
  const [typeLimite, setTypeLimite]   = useState<TypeLimite>("aucune");
  const [dureeH, setDureeH]           = useState("0");
  const [dureeMin, setDureeMin]       = useState("30");
  const [dateChoisie, setDateChoisie] = useState("");
  const [erreur, setErreur]           = useState("");

  const chargerProfil      = useCallback(async () => { setProfil(await getProfil()); }, []);
  const chargerCategories  = useCallback(async () => { setCategories(await getCategories()); }, []);
  const chargerCompetences = useCallback(async () => { setCompetences(await getCompetences()); }, []);
  const chargerTaches      = useCallback(async () => {
    try { setTaches(await getTaches()); }
    catch (e) { if ((e as Error).message === "401") onDeconnexion(); }
  }, [onDeconnexion]);

  useEffect(() => {
    chargerProfil();
    chargerCategories();
    chargerCompetences();
    chargerTaches();
  }, [chargerProfil, chargerCategories, chargerCompetences, chargerTaches]);

  function calculerDateLimite(): string | null {
    if (typeLimite === "duree") {
      const ms = (parseInt(dureeH) * 3600 + parseInt(dureeMin) * 60) * 1000;
      if (ms <= 0) return null;
      return new Date(Date.now() + ms).toISOString();
    }
    if (typeLimite === "date" && dateChoisie) {
      return new Date(dateChoisie + "T23:59:59").toISOString();
    }
    return null;
  }

  function resetFormulaire() {
    setTitre(""); setDescription(""); setCategorie("physique");
    setTypeLimite("aucune"); setDureeH("0"); setDureeMin("30"); setDateChoisie("");
  }

  async function handleAjouter() {
    if (!titre.trim()) { setErreur("Le titre est obligatoire."); return; }
    try {
      await creerTache(titre.trim(), description.trim() || null, categorie, calculerDateLimite());
      resetFormulaire();
      setFormulaireVisible(false);
      setErreur("");
      chargerTaches();
    } catch (e) {
      setErreur((e as Error).message);
    }
  }

  async function handleTerminer(id: number) {
    try {
      await terminerTache(id);
      chargerProfil();
      chargerCategories();
      chargerCompetences();
      chargerTaches();
    } catch (e) {
      if ((e as Error).message === "401") onDeconnexion();
      else setErreur((e as Error).message);
    }
  }

  async function handleSupprimer(id: number) {
    await supprimerTache(id);
    chargerTaches();
  }

  async function handleAjouterSous(parentId: number, t: string, d: string | null) {
    try {
      await creerTache(t, d, null, null, parentId);
      chargerTaches();
    } catch (e) {
      setErreur((e as Error).message);
    }
  }

  async function handleAmeliorer(stat: StatKey) {
    try {
      await ameliorerStat(stat);
      chargerCompetences();
    } catch (e) {
      setErreur((e as Error).message);
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="ecran-taches">
      <div className="container">

        <div className="entete">
          <div className="entete-gauche">
            <h1>⚔ Mes Quêtes</h1>
            <span className="utilisateur-badge">{nom}</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn btn-primary btn-inline"
              onClick={() => {
                setOnglet("cours");
                setFormulaireVisible(v => !v);
              }}
            >
              + Nouvelle quête
            </button>
            <button className="btn-deconnexion" onClick={onDeconnexion}>Quitter</button>
          </div>
        </div>

        {profil && <NiveauCarte profil={profil} />}
        <CategoriesCarte categories={categories} />
        {competences && <CompetencesCarte competences={competences} onAmeliorer={handleAmeliorer} />}

        {formulaireVisible && (
          <div className="carte">
            <input
              type="text"
              value={titre}
              onChange={e => setTitre(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAjouter()}
              placeholder="Titre *"
              autoFocus
            />
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Description (optionnelle)"
            />
            <select
              className="cat-select"
              value={categorie}
              onChange={e => setCategorie(e.target.value)}
            >
              <option value="physique">⚔ Voie du Corps</option>
              <option value="mental">✦ Voie de l'Esprit</option>
              <option value="paresseux">☽ Voie du Paresseux</option>
            </select>

            <div style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                {(["aucune", "duree", "date"] as TypeLimite[]).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTypeLimite(t)}
                    className={`btn btn-inline ${typeLimite === t ? "btn-primary" : "btn-ghost"}`}
                  >
                    {t === "aucune" && "Sans limite"}
                    {t === "duree"  && <span style={{display:"flex",alignItems:"center",gap:5}}><IconDuree size={14}/>Durée</span>}
                    {t === "date"   && <span style={{display:"flex",alignItems:"center",gap:5}}><IconCalendrier size={14}/>Date limite</span>}
                  </button>
                ))}
              </div>

              {typeLimite === "duree" && (
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    type="number" min="0" max="99"
                    value={dureeH}
                    onChange={e => setDureeH(e.target.value)}
                    style={{ width: 70 }}
                    placeholder="0"
                  />
                  <span style={{ fontFamily: "'Crimson Text', serif", color: "var(--texte-doux)" }}>h</span>
                  <input
                    type="number" min="0" max="59"
                    value={dureeMin}
                    onChange={e => setDureeMin(e.target.value)}
                    style={{ width: 70 }}
                    placeholder="30"
                  />
                  <span style={{ fontFamily: "'Crimson Text', serif", color: "var(--texte-doux)" }}>min</span>
                </div>
              )}

              {typeLimite === "date" && (
                <input
                  type="date"
                  value={dateChoisie}
                  min={today}
                  onChange={e => setDateChoisie(e.target.value)}
                />
              )}
            </div>

            <div className="carte-actions">
              <button className="btn btn-primary" onClick={handleAjouter}>Accepter la quête</button>
              <button className="btn btn-ghost" onClick={() => { setFormulaireVisible(false); resetFormulaire(); }}>Annuler</button>
            </div>
          </div>
        )}

        {/* ── Onglets ── */}
        <div style={{
          display: "flex",
          gap: 6,
          background: "rgba(0,0,0,0.25)",
          borderRadius: 12,
          padding: 5,
          marginBottom: 20,
        }}>
          {([
            { id: "cours",     label: "⚔ En cours"   },
            { id: "terminees", label: "✦ Accomplies"  },
          ] as { id: Onglet; label: string }[]).map(o => (
            <button
              key={o.id}
              onClick={() => { setOnglet(o.id); setFormulaireVisible(false); }}
              style={{
                flex: 1,
                padding: "10px 16px",
                borderRadius: 9,
                border: "none",
                cursor: "pointer",
                fontFamily: "'Cinzel', serif",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.07em",
                transition: "all 0.2s",
                background: onglet === o.id ? "rgba(155,93,229,0.25)" : "none",
                color: onglet === o.id ? "var(--violet-clair)" : "var(--texte-doux)",
                boxShadow: onglet === o.id ? "0 0 16px rgba(155,93,229,0.2)" : "none",
              }}
            >
              {o.label}
            </button>
          ))}
        </div>

        {erreur && <div className="erreur-taches">{erreur}</div>}

        {onglet === "cours" ? (() => {
          const estTerminee = (t: Tache) =>
            t.sous_taches.length === 0 ? t.terminee : (t.progression ?? 0) >= 100;
          const enCours = taches.filter(t => !estTerminee(t));

          if (enCours.length === 0) {
            return <div className="vide">Toutes les quêtes sont accomplies !</div>;
          }
          return (
            <>
              {enCours.map(t => (
                <TacheItem key={t.id} tache={t}
                  onTerminer={handleTerminer} onSupprimer={handleSupprimer} onAjouterSous={handleAjouterSous} />
              ))}
            </>
          );
        })() : (
          <QuestesTerminees taches={taches} />
        )}

      </div>
    </div>
  );
}
