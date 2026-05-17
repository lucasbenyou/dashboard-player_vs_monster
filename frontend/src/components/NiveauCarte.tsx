import type { Profil } from "../types";

interface Props {
  profil: Profil;
}

export default function NiveauCarte({ profil }: Props) {
  const estMax = profil.taches_prochain_niveau === null;
  const label = estMax
    ? `${profil.taches_niveau} tâches complétées`
    : `${profil.taches_niveau} / ${profil.taches_prochain_niveau} tâches`;

  return (
    <div className="niveau-carte">
      <div className="niveau-badge-grand">
        {profil.niveau >= 20 ? "⚜ MAX" : `⚜ Niveau ${profil.niveau}`}
      </div>
      <div className="niveau-barre-wrapper">
        <div className="niveau-barre-label">
          <span>{label}</span>
          <span>{profil.progression} %</span>
        </div>
        <div className="niveau-piste">
          <div
            className={`niveau-fill${estMax ? " max" : ""}`}
            style={{ width: `${profil.progression}%` }}
          />
        </div>
      </div>
    </div>
  );
}
