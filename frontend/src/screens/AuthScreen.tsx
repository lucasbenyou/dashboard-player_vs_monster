import { useState } from "react";
import { seConnecter, sInscrire } from "../api";

interface Props {
  onConnexion: (token: string, nom: string) => void;
}

type Onglet     = "connexion" | "inscription";
type ChampHover = "nom" | "mdp" | null;

const REGLES_MDP = [
  { label: "Au moins 8 caractères",      test: (v: string) => v.length >= 8 },
  { label: "Une minuscule (a-z)",         test: (v: string) => /[a-z]/.test(v) },
  { label: "Une majuscule (A-Z)",         test: (v: string) => /[A-Z]/.test(v) },
  { label: "Un chiffre (0-9)",            test: (v: string) => /[0-9]/.test(v) },
  { label: "Un caractère spécial (!@#…)", test: (v: string) => /[!@#$%^&*()\-_=+\[\]{};:'",.<>?/\\|~`]/.test(v) },
];

function validerMotDePasse(mdp: string): string | null {
  for (const r of REGLES_MDP) {
    if (!r.test(mdp)) return r.label + " requis";
  }
  return null;
}

const TOOLTIP_STYLE: React.CSSProperties = {
  position: "absolute",
  left: "calc(100% + 20px)",
  top: "50%",
  transform: "translateY(-50%)",
  width: 230,
  background: "rgba(15,8,40,0.95)",
  border: "1px solid rgba(155,93,229,0.35)",
  borderRadius: 12,
  padding: "14px 16px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
  zIndex: 10,
  pointerEvents: "none",
};

export default function AuthScreen({ onConnexion }: Props) {
  const [onglet, setOnglet]         = useState<Onglet>("connexion");
  const [nom, setNom]               = useState("");
  const [mdp, setMdp]               = useState("");
  const [erreur, setErreur]         = useState("");
  const [chargement, setChargement] = useState(false);
  const [mdpVisible, setMdpVisible] = useState(false);
  const [hover, setHover]           = useState<ChampHover>(null);

  function changerOnglet(o: Onglet) {
    setOnglet(o); setErreur(""); setNom(""); setMdp(""); setMdpVisible(false);
  }

  async function handleConnexion() {
    if (!nom.trim() || !mdp) { setErreur("Remplissez tous les champs."); return; }
    setChargement(true);
    try {
      const token = await seConnecter(nom.trim(), mdp);
      onConnexion(token, nom.trim());
    } catch (e) {
      setErreur((e as Error).message);
    } finally {
      setChargement(false);
    }
  }

  async function handleInscription() {
    if (nom.trim().length < 6) { setErreur("Le nom doit contenir au moins 6 caractères."); return; }
    const errMdp = validerMotDePasse(mdp);
    if (errMdp) { setErreur(errMdp); return; }
    setChargement(true);
    try {
      await sInscrire(nom.trim(), mdp);
      setErreur("Compte créé ! Connexion en cours…");
      const token = await seConnecter(nom.trim(), mdp);
      onConnexion(token, nom.trim());
    } catch (e) {
      setErreur((e as Error).message);
    } finally {
      setChargement(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") onglet === "connexion" ? handleConnexion() : handleInscription();
  }

  return (
    <div className="ecran-auth">
      {/* Wrapper relatif pour positionner les tooltips à droite */}
      <div style={{ position: "relative" }}>
        <div className="auth-carte">
          <h2>Livre des Quêtes</h2>
          <p className="auth-sous-titre">Inscrivez votre nom dans les annales</p>

          <div className="auth-onglets">
            <button className={`auth-onglet${onglet === "connexion" ? " actif" : ""}`}
              onClick={() => changerOnglet("connexion")}>Se connecter</button>
            <button className={`auth-onglet${onglet === "inscription" ? " actif" : ""}`}
              onClick={() => changerOnglet("inscription")}>S'inscrire</button>
          </div>

          <div className="auth-erreur">{erreur}</div>

          {/* ── Nom d'utilisateur ── */}
          <div className="auth-champ">
            <label>Nom d'utilisateur</label>
            <input
              type="text"
              value={nom}
              onChange={e => setNom(e.target.value)}
              onKeyDown={onKeyDown}
              onMouseEnter={() => setHover("nom")}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover("nom")}
              onBlur={() => setHover(null)}
              placeholder="votre nom"
              autoFocus
            />
          </div>

          {/* ── Mot de passe ── */}
          <div className="auth-champ">
            <label>Mot de passe</label>
            <div style={{ position: "relative" }}>
              <input
                type={mdpVisible ? "text" : "password"}
                value={mdp}
                onChange={e => setMdp(e.target.value)}
                onKeyDown={onKeyDown}
                onMouseEnter={() => setHover("mdp")}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover("mdp")}
                onBlur={() => setHover(null)}
                placeholder="••••••••"
                style={{ paddingRight: 48, marginBottom: 0 }}
              />
              <button
                type="button"
                onClick={() => setMdpVisible(v => !v)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 18,
                  color: "var(--texte-doux)",
                  padding: 4,
                  lineHeight: 1,
                }}
                title={mdpVisible ? "Masquer" : "Afficher"}
              >
                {mdpVisible ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {onglet === "connexion" ? (
            <button className="btn btn-primary" style={{ width: "100%", marginTop: 6 }}
              onClick={handleConnexion} disabled={chargement}>
              {chargement ? "Connexion…" : "Se connecter"}
            </button>
          ) : (
            <button className="btn btn-primary" style={{ width: "100%", marginTop: 6 }}
              onClick={handleInscription} disabled={chargement}>
              {chargement ? "Création…" : "Créer un compte"}
            </button>
          )}
        </div>

        {/* ── Tooltip Nom ── */}
        {hover === "nom" && onglet === "inscription" && (
          <div style={TOOLTIP_STYLE}>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 11, color: "var(--or)", letterSpacing: "0.1em", marginBottom: 8, textTransform: "uppercase" }}>
              Nom d'utilisateur
            </div>
            <div style={{ fontFamily: "'Crimson Text',serif", fontSize: 15, color: "var(--texte-doux)" }}>
              Minimum <strong style={{ color: "var(--texte)" }}>6 caractères</strong>
            </div>
          </div>
        )}

        {/* ── Tooltip Mot de passe ── */}
        {hover === "mdp" && (
          <div style={TOOLTIP_STYLE}>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 11, color: "var(--or)", letterSpacing: "0.1em", marginBottom: 10, textTransform: "uppercase" }}>
              Mot de passe
            </div>
            {onglet === "inscription" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {REGLES_MDP.map(r => {
                  const ok = mdp.length > 0 && r.test(mdp);
                  const na = mdp.length === 0;
                  return (
                    <div key={r.label} style={{
                      display: "flex", alignItems: "center", gap: 8,
                      fontFamily: "'Crimson Text',serif", fontSize: 14,
                      color: na ? "var(--texte-doux)" : ok ? "#4ade80" : "#f87171",
                    }}>
                      <span>{na ? "○" : ok ? "✓" : "✗"}</span>
                      {r.label}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ fontFamily: "'Crimson Text',serif", fontSize: 15, color: "var(--texte-doux)", fontStyle: "italic" }}>
                Entrez votre mot de passe.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
