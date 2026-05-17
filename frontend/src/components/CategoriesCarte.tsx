import type { Categorie } from "../types";
import { IconCorps, IconEsprit, IconParesseux } from "./Icons";

const LABELS: Record<string, string> = {
  physique:  "Voie du Corps",
  paresseux: "Voie du Paresseux",
  mental:    "Voie de l'Esprit",
};

const ICONES: Record<string, React.ReactNode> = {
  physique:  <IconCorps size={20} />,
  mental:    <IconEsprit size={20} />,
  paresseux: <IconParesseux size={20} />,
};

const ORDER = ["physique", "mental", "paresseux"];

interface Props {
  categories: Categorie[];
}

export default function CategoriesCarte({ categories }: Props) {
  const triees = [...categories].sort(
    (a, b) => ORDER.indexOf(a.type) - ORDER.indexOf(b.type)
  );

  return (
    <div className="cat-carte">
      <div className="cat-titre">⚔ Voies d'effort</div>
      <div className="cat-grille">
        {triees.map(c => {
          const label = c.taches_prochain !== null
            ? `${c.taches_niveau} / ${c.taches_prochain} tâches`
            : `${c.taches_niveau} tâches (MAX)`;
          return (
            <div key={c.type} className="cat-item">
              <div className="cat-entete">
                <span className="cat-icone">{ICONES[c.type]}</span>
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
