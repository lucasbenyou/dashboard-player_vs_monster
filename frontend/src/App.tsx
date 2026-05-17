import { useState, useEffect, useRef } from "react";
import AuthScreen from "./screens/AuthScreen";
import TasksScreen from "./screens/TasksScreen";
import { IconSablier } from "./components/Icons";

const INACTIVITY_MS = 5 * 60 * 1000;  // 5 minutes
const REPONSE_MS    = 30 * 1000;       // 30 secondes pour répondre

export default function App() {
  // Jamais de session persistante — vider localStorage à chaque chargement de page
  useState(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("nom");
  });
  const [token, setToken] = useState<string | null>(null);
  const [nom, setNom]     = useState<string>("");
  const [modal, setModal] = useState(false);

  const inactivityRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reponseRef    = useRef<ReturnType<typeof setTimeout> | null>(null);

  function deconnecter() {
    setToken(null);
    setNom("");
    setModal(false);
  }

  function onConnexion(newToken: string, newNom: string) {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setNom(newNom);
  }

  // Réinitialise le timer d'inactivité à chaque interaction
  function resetInactivite() {
    if (!token) return;
    setModal(false);
    if (inactivityRef.current) clearTimeout(inactivityRef.current);
    if (reponseRef.current)    clearTimeout(reponseRef.current);

    inactivityRef.current = setTimeout(() => {
      setModal(true);
      reponseRef.current = setTimeout(() => {
        deconnecter();
      }, REPONSE_MS);
    }, INACTIVITY_MS);
  }

  // Démarrer / arrêter le suivi d'inactivité selon la connexion
  useEffect(() => {
    if (!token) {
      if (inactivityRef.current) clearTimeout(inactivityRef.current);
      if (reponseRef.current)    clearTimeout(reponseRef.current);
      return;
    }

    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart", "click"] as const;
    events.forEach(e => document.addEventListener(e, resetInactivite, true));
    resetInactivite();

    return () => {
      events.forEach(e => document.removeEventListener(e, resetInactivite, true));
      if (inactivityRef.current) clearTimeout(inactivityRef.current);
      if (reponseRef.current)    clearTimeout(reponseRef.current);
    };
  }, [token]);

  return (
    <>
      {!token
        ? <AuthScreen onConnexion={onConnexion} />
        : <TasksScreen nom={nom} onDeconnexion={deconnecter} />
      }

      {modal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(0,0,0,0.7)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            background: "rgba(20,10,50,0.95)",
            border: "1px solid rgba(240,192,64,0.4)",
            borderRadius: 16,
            padding: "40px 48px",
            textAlign: "center",
            boxShadow: "0 0 60px rgba(155,93,229,0.2)",
            maxWidth: 360,
          }}>
            <div style={{ marginBottom: 16, color: "var(--or)" }}><IconSablier size={40} /></div>
            <h2 style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 20,
              color: "var(--or)",
              marginBottom: 12,
            }}>
              Êtes-vous encore là ?
            </h2>
            <p style={{
              fontFamily: "'Crimson Text', serif",
              fontSize: 16,
              color: "var(--texte-doux)",
              fontStyle: "italic",
              marginBottom: 28,
            }}>
              Aucune activité depuis 5 minutes.<br />
              Vous serez déconnecté dans 30 secondes.
            </p>
            <button
              className="btn btn-primary"
              style={{ width: "100%", fontSize: 14 }}
              onClick={resetInactivite}
            >
              Oui, je suis là !
            </button>
          </div>
        </div>
      )}
    </>
  );
}
