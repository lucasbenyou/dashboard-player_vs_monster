import { useState } from "react";
import type { Tache } from "../types";
import TacheItem from "./TacheItem";
import { IconCorps, IconEsprit, IconParesseux } from "./Icons";

const GROUPES = [
  { key: "physique",  label: "Voie du Corps",    icone: <IconCorps  size={20} /> },
  { key: "mental",    label: "Voie de l'Esprit", icone: <IconEsprit size={20} /> },
  { key: "paresseux", label: "Voie du Paresseux",icone: <IconParesseux size={20} /> },
] as const;

interface Props {
  taches: Tache[];
}

function estTerminee(t: Tache): boolean {
  return t.sous_taches.length === 0 ? t.terminee : (t.progression ?? 0) >= 100;
}

export default function QuestesTerminees({ taches }: Props) {
  const [ouvert, setOuvert] = useState<Record<string, boolean>>({});

  const terminees = taches.filter(estTerminee);

  if (terminees.length === 0) {
    return <div className="vide">Aucune quête accomplie pour l'instant.</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {GROUPES.map(({ key, label, icone }) => {
        const groupe   = terminees.filter(t => t.categorie === key);
        const expanded = ouvert[key] ?? false;

        return (
          <div key={key} style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: 14, overflow: "hidden",
          }}>
            <button
              onClick={() => setOuvert(o => ({ ...o, [key]: !o[key] }))}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12,
                padding: "16px 20px", background: "none", border: "none",
                cursor: "pointer", textAlign: "left",
              }}
            >
              <span style={{ display: "flex", color: "var(--texte-doux)" }}>{icone}</span>
              <span style={{
                fontFamily: "'Cinzel', serif", fontSize: 14, fontWeight: 700,
                color: "var(--texte)", letterSpacing: "0.06em", flex: 1,
              }}>
                {label}
              </span>
              <span style={{
                fontFamily: "'Cinzel', serif", fontSize: 10, fontWeight: 700,
                background: groupe.length > 0 ? "rgba(240,192,64,0.15)" : "rgba(255,255,255,0.05)",
                color: groupe.length > 0 ? "var(--or)" : "var(--texte-doux)",
                border: `1px solid ${groupe.length > 0 ? "rgba(240,192,64,0.3)" : "rgba(255,255,255,0.08)"}`,
                padding: "3px 12px", borderRadius: 100, marginRight: 8,
              }}>
                {groupe.length} quête{groupe.length !== 1 ? "s" : ""}
              </span>
              <span style={{
                color: "var(--texte-doux)", fontSize: 14,
                transition: "transform 0.2s",
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                display: "inline-block",
              }}>▾</span>
            </button>

            {expanded && (
              <div style={{ padding: "0 12px 12px" }}>
                {groupe.length === 0 ? (
                  <div style={{
                    textAlign: "center", fontStyle: "italic",
                    color: "var(--texte-doux)", fontSize: 14,
                    padding: "20px 0", opacity: 0.6,
                  }}>
                    Aucune quête accomplie dans cette voie.
                  </div>
                ) : (
                  groupe.map(t => (
                    <TacheItem key={t.id} tache={t}
                      onTerminer={() => {}} onSupprimer={() => {}} onAjouterSous={() => {}} />
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
