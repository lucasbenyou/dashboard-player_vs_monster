import { useState } from "react";
import { seConnecter, sInscrire } from "../api";

interface Props {
  onConnexion: (token: string, nom: string) => void;
}

type Onglet = "connexion" | "inscription";

export default function AuthScreen({ onConnexion }: Props) {
  const [onglet, setOnglet] = useState<Onglet>("connexion");
  const [nom, setNom] = useState("");
  const [mdp, setMdp] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  function changerOnglet(o: Onglet) {
    setOnglet(o);
    setErreur("");
    setNom("");
    setMdp("");
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
      <div className="auth-carte">
        <h2>Livre des Quêtes</h2>
        <p className="auth-sous-titre">Inscrivez votre nom dans les annales</p>

        <div className="auth-onglets">
          <button
            className={`auth-onglet${onglet === "connexion" ? " actif" : ""}`}
            onClick={() => changerOnglet("connexion")}
          >
            Se connecter
          </button>
          <button
            className={`auth-onglet${onglet === "inscription" ? " actif" : ""}`}
            onClick={() => changerOnglet("inscription")}
          >
            S'inscrire
          </button>
        </div>

        <div className="auth-erreur">{erreur}</div>

        <div className="auth-champ">
          <label>
            Nom d'utilisateur
            {onglet === "inscription" && (
              <span style={{ color: "#9ca3af" }}> (min. 3 caractères)</span>
            )}
          </label>
          <input
            type="text"
            value={nom}
            onChange={e => setNom(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="votre nom"
            autoFocus
          />
        </div>

        <div className="auth-champ">
          <label>
            Mot de passe
            {onglet === "inscription" && (
              <span style={{ color: "#9ca3af" }}> (min. 6 caractères)</span>
            )}
          </label>
          <input
            type="password"
            value={mdp}
            onChange={e => setMdp(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="••••••"
          />
        </div>

        {onglet === "connexion" ? (
          <button className="btn btn-primary" style={{ width: "100%" }} onClick={handleConnexion} disabled={chargement}>
            {chargement ? "Connexion…" : "Se connecter"}
          </button>
        ) : (
          <button className="btn btn-primary" style={{ width: "100%" }} onClick={handleInscription} disabled={chargement}>
            {chargement ? "Création…" : "Créer un compte"}
          </button>
        )}
      </div>
    </div>
  );
}
