import { useState } from "react";
import type { Tache } from "../types";
import Countdown from "./Countdown";

const CAT_ICONE: Record<string, string> = { physique: "💪", mental: "🧠", paresseux: "😴" };

interface Props {
  tache: Tache;
  onTerminer: (id: number) => void;
  onSupprimer: (id: number) => void;
  onAjouterSous: (parentId: number, titre: string, description: string | null) => void;
}

export default function TacheItem({ tache, onTerminer, onSupprimer, onAjouterSous }: Props) {
  const [formVisible, setFormVisible] = useState(false);
  const [titreForm, setTitreForm] = useState("");
  const [descForm, setDescForm] = useState("");

  const estFeuille      = tache.sous_taches.length === 0;
  const pct             = tache.progression ?? 0;
  const estTerminee     = estFeuille ? tache.terminee : pct >= 100;
  const peutAjouterSous = tache.profondeur < 2 && tache.sous_taches.length < 5 && !estTerminee;

  function handleAjouterSous() {
    if (!titreForm.trim()) return;
    onAjouterSous(tache.id, titreForm.trim(), descForm.trim() || null);
    setTitreForm("");
    setDescForm("");
    setFormVisible(false);
  }

  return (
    <div className={`tache niveau-${tache.profondeur}${estTerminee ? " terminee" : ""}`}>
      <div className="tache-entete">
        <div>
          <span className={`tache-titre${estTerminee ? " barre" : ""}`}>{tache.titre}</span>
          <span className="niveau-badge">niv. {tache.profondeur}</span>
          {tache.categorie && (
            <span className={`badge-cat ${tache.categorie}`}>
              {CAT_ICONE[tache.categorie]}
            </span>
          )}
          {tache.date_limite && (
            <Countdown dateLimite={tache.date_limite} terminee={estTerminee} />
          )}
          {tache.description && <div className="tache-desc">{tache.description}</div>}
        </div>
        <div className="tache-actions">
          {estFeuille && !estTerminee && (
            <button className="btn btn-success btn-inline" onClick={() => onTerminer(tache.id)}>
              ✓ Terminer
            </button>
          )}
          {peutAjouterSous && (
            <button className="btn btn-ghost btn-inline" onClick={() => setFormVisible(v => !v)}>
              + sous-tâche
            </button>
          )}
          {!estTerminee && (
            <button className="btn btn-danger btn-inline" onClick={() => onSupprimer(tache.id)}>
              ✕
            </button>
          )}
        </div>
      </div>

      {!estFeuille && !estTerminee && (
        <div className="progression-wrapper">
          <div className="progression-label">Progression : {pct} %</div>
          <div className="progression-piste">
            <div className={`progression-fill${pct === 100 ? " complet" : ""}`} style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}

      {peutAjouterSous && formVisible && (
        <div className="form-sous">
          <input
            type="text"
            value={titreForm}
            onChange={e => setTitreForm(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAjouterSous()}
            placeholder="Titre *"
            autoFocus
          />
          <input
            type="text"
            value={descForm}
            onChange={e => setDescForm(e.target.value)}
            placeholder="Description (optionnelle)"
          />
          <div className="form-sous-actions">
            <button className="btn btn-primary btn-inline" onClick={handleAjouterSous}>Ajouter</button>
            <button className="btn btn-ghost btn-inline" onClick={() => setFormVisible(false)}>Annuler</button>
          </div>
        </div>
      )}

      {tache.sous_taches.length > 0 && (
        <div className="sous-taches">
          {tache.sous_taches.map(st => (
            <TacheItem key={st.id} tache={st}
              onTerminer={onTerminer} onSupprimer={onSupprimer} onAjouterSous={onAjouterSous} />
          ))}
        </div>
      )}
    </div>
  );
}
