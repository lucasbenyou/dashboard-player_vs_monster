import type { Competences, StatKey } from "../types";
import { IconForce, IconDefense, IconVie, IconMagie, IconIntel } from "./Icons";

const STATS: { key: StatKey; label: string; icone: React.ReactNode }[] = [
  { key: "force",   label: "Force",   icone: <IconForce /> },
  { key: "defense", label: "Défense", icone: <IconDefense /> },
  { key: "vie",     label: "Vie",     icone: <IconVie /> },
  { key: "magie",   label: "Magie",   icone: <IconMagie /> },
  { key: "intel",   label: "Intel",   icone: <IconIntel /> },
];

interface Props {
  competences: Competences;
  onAmeliorer: (stat: StatKey) => void;
}

export default function CompetencesCarte({ competences, onAmeliorer }: Props) {
  const aDesPoints = competences.points_disponibles > 0;
  const maxStat = Math.max(competences.force, competences.defense, competences.vie, competences.magie, competences.intel);

  return (
    <div className="comp-carte">
      <div className="comp-entete">
        <span className="comp-titre">✦ Attributs</span>
        {aDesPoints && (
          <span className="points-badge">
            {competences.points_disponibles} point{competences.points_disponibles > 1 ? "s" : ""} disponible{competences.points_disponibles > 1 ? "s" : ""}
          </span>
        )}
      </div>
      <div className="comp-grille">
        {STATS.map(({ key, label, icone }) => (
          <div key={key} className="stat-item">
            <div className="stat-icone">{icone}</div>
            <div className="stat-nom">{label}</div>
            <div className="stat-val">{competences[key]}</div>
            <div className="stat-barre-bg">
              <div
                className="stat-barre-fill"
                style={{ width: `${Math.min((competences[key] / maxStat) * 100, 100)}%` }}
              />
            </div>
            {aDesPoints && (
              <button className="btn-plus" onClick={() => onAmeliorer(key)}>+</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
