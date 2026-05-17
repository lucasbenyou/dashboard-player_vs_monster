import type { Competences, StatKey } from "../types";

const STATS: { key: StatKey; label: string; icone: string }[] = [
  { key: "force",   label: "Force",   icone: "⚔" },
  { key: "defense", label: "Défense", icone: "🛡" },
  { key: "vie",     label: "Vie",     icone: "❤" },
  { key: "magie",   label: "Magie",   icone: "✨" },
  { key: "intel",   label: "Intel",   icone: "🧠" },
];

interface Props {
  competences: Competences;
  onAmeliorer: (stat: StatKey) => void;
}

export default function CompetencesCarte({ competences, onAmeliorer }: Props) {
  const aDesPoints = competences.points_disponibles > 0;
  const maxStat = Math.max(competences.force, competences.defense, competences.vie, competences.magie, competences.intel, 10);

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
