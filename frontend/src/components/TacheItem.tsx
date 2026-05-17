import { useState } from "react";
import type { Tache } from "../types";
import Countdown from "./Countdown";
import { IconCorps, IconEsprit, IconParesseux } from "./Icons";

const CAT_ICONE: Record<string, React.ReactNode> = {
  physique:  <IconCorps  size={14} />,
  mental:    <IconEsprit size={14} />,
  paresseux: <IconParesseux size={14} />,
};

interface Props {
  tache: Tache;
  onTerminer: (id: number) => void;
  onSupprimer: (id: number) => void;
  onAjouterSous: (parentId: number, titre: string, description: string | null) => void;
}

export default function TacheItem({ tache, onTerminer, onSupprimer, onAjouterSous }: Props) {
  const [formVisible, setFormVisible] = useState(false);
  const [sousVisible, setSousVisible] = useState(false);
  const [titreForm, setTitreForm]     = useState("");
  const [descForm, setDescForm]       = useState("");

  const estFeuille      = tache.sous_taches.length === 0;
  const pct             = tache.progression ?? 0;
  const estTerminee     = estFeuille ? tache.terminee : pct >= 100;
  const peutAjouterSous = tache.profondeur < 2 && tache.sous_taches.length < 5 && !estTerminee;
  const aNbSous         = tache.sous_taches.length;

  function handleAjouterSous() {
    if (!titreForm.trim()) return;
    onAjouterSous(tache.id, titreForm.trim(), descForm.trim() || null);
    setTitreForm(""); setDescForm(""); setFormVisible(false);
  }

  return (
    <div
      className={`tache niveau-${tache.profondeur}${estTerminee ? " terminee" : ""}`}
      onClick={aNbSous > 0 ? () => setSousVisible(v => !v) : undefined}
      style={aNbSous > 0 ? { cursor: "pointer" } : undefined}
    >
      <div className="tache-entete">
        <div>
          <span className={`tache-titre${estTerminee ? " barre" : ""}`}>{tache.titre}</span>
          <span className="niveau-badge">niv. {tache.profondeur}</span>

          {tache.categorie && (
            <span className={`badge-cat ${tache.categorie}`} style={{ verticalAlign: "middle" }}>
              {CAT_ICONE[tache.categorie]}
            </span>
          )}

          {aNbSous > 0 && (
            <button
              onClick={() => setSousVisible(v => !v)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                marginLeft: 8, background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)", borderRadius: 100,
                padding: "2px 10px", fontSize: 11, fontFamily: "'Cinzel', serif",
                color: "var(--texte-doux)", cursor: "pointer",
              }}
            >
              {sousVisible ? "▾" : "▸"} {aNbSous} sous-quête{aNbSous > 1 ? "s" : ""}
            </button>
          )}

          {tache.date_limite && (
            <Countdown dateLimite={tache.date_limite} terminee={estTerminee} />
          )}
          {tache.description && <div className="tache-desc">{tache.description}</div>}
        </div>
        <div className="tache-actions" onClick={e => e.stopPropagation()}>
          {estFeuille && !estTerminee && (
            <button className="btn btn-success btn-inline" onClick={() => onTerminer(tache.id)}>
              ✓ Terminer
            </button>
          )}
          {peutAjouterSous && (
            <button className="btn btn-ghost btn-inline" onClick={() => setFormVisible(v => !v)}>
              + sous-quête
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
        <div className="form-sous" onClick={e => e.stopPropagation()}>
          <input type="text" value={titreForm} onChange={e => setTitreForm(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAjouterSous()} placeholder="Titre *" autoFocus />
          <input type="text" value={descForm} onChange={e => setDescForm(e.target.value)}
            placeholder="Description (optionnelle)" />
          <div className="form-sous-actions">
            <button className="btn btn-primary btn-inline" onClick={handleAjouterSous}>Ajouter</button>
            <button className="btn btn-ghost btn-inline" onClick={() => setFormVisible(false)}>Annuler</button>
          </div>
        </div>
      )}

      {sousVisible && aNbSous > 0 && (
        <div className="sous-taches" onClick={e => e.stopPropagation()}>
          {tache.sous_taches.map(st => (
            <TacheItem key={st.id} tache={st}
              onTerminer={onTerminer} onSupprimer={onSupprimer} onAjouterSous={onAjouterSous} />
          ))}
        </div>
      )}
    </div>
  );
}
