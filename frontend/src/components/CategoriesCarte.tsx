import type { Categorie } from "../types";

const LABELS: Record<string, string> = { physique: "Voie du Corps", mental: "Voie de l'Esprit", paresseux: "Voie du Paresseux" };

interface Props {
  categories: Categorie[];
}

export default function CategoriesCarte({ categories }: Props) {
  return (
    <div className="cat-carte">
      <div className="cat-titre">⚔ Voies d'effort</div>
      <div className="cat-grille">
        {categories.map(c => {
          const label = c.taches_prochain !== null
            ? `${c.taches_niveau} / ${c.taches_prochain} tâches`
            : `${c.taches_niveau} tâches (MAX)`;
          return (
            <div key={c.type} className="cat-item">
              <div className="cat-entete">
                <span className="cat-icone">{c.icone}</span>
                <span className="cat-nom">{LABELS[c.type]}</span>
                <span className="cat-niveau-badge">Niv. {c.niveau}</span>
              </div>
              <div className="cat-piste">
                <div className={`cat-fill ${c.type}`} style={{ width: `${c.progression}%` }} />
              </div>
              <div className="cat-sous-label">{label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
