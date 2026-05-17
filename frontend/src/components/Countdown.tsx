import { useState, useEffect } from "react";

interface Props {
  dateLimite: string;
  terminee: boolean;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function formaterRestant(ms: number): { texte: string; statut: "ok" | "urgent" | "expire" } {
  if (ms <= 0) return { texte: "Expirée", statut: "expire" };

  const totalSec = Math.floor(ms / 1000);
  const jours    = Math.floor(totalSec / 86400);
  const heures   = Math.floor((totalSec % 86400) / 3600);
  const minutes  = Math.floor((totalSec % 3600) / 60);
  const secondes = totalSec % 60;

  if (jours >= 1) {
    const texte = jours === 1
      ? `J-1 (${pad(heures)}h${pad(minutes)})`
      : `J-${jours}`;
    return { texte, statut: "ok" };
  }

  const statut = totalSec < 3600 ? "urgent" : "ok";
  const texte  = `${pad(heures)}:${pad(minutes)}:${pad(secondes)}`;
  return { texte, statut };
}

export default function Countdown({ dateLimite, terminee }: Props) {
  const [restant, setRestant] = useState(() => new Date(dateLimite).getTime() - Date.now());

  useEffect(() => {
    if (terminee) return;
    const id = setInterval(() => {
      setRestant(new Date(dateLimite).getTime() - Date.now());
    }, 1000);
    return () => clearInterval(id);
  }, [dateLimite, terminee]);

  if (terminee) return null;

  const { texte, statut } = formaterRestant(restant);

  const couleurs = {
    ok:     { bg: "rgba(201,162,39,0.12)", border: "rgba(201,162,39,0.4)", color: "#8a6a10" },
    urgent: { bg: "rgba(139,26,26,0.12)",  border: "rgba(139,26,26,0.4)",  color: "#8b1a1a" },
    expire: { bg: "rgba(139,26,26,0.18)",  border: "rgba(139,26,26,0.6)",  color: "#c0392b" },
  }[statut];

  const icone = statut === "expire" ? "☠" : statut === "urgent" ? "⚠" : "⏳";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 11,
        fontFamily: "'Cinzel', serif",
        fontWeight: 700,
        letterSpacing: "0.06em",
        padding: "2px 9px",
        borderRadius: 2,
        border: `1px solid ${couleurs.border}`,
        background: couleurs.bg,
        color: couleurs.color,
        marginLeft: 8,
        verticalAlign: "middle",
        animation: statut === "urgent" ? "pulse-or 1s infinite" : undefined,
      }}
    >
      {icone} {texte}
    </span>
  );
}
