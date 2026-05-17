import { useState } from "react";
import AuthScreen from "./screens/AuthScreen";
import TasksScreen from "./screens/TasksScreen";

export default function App() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [nom, setNom] = useState<string>(() => localStorage.getItem("nom") ?? "");

  function onConnexion(newToken: string, newNom: string) {
    localStorage.setItem("token", newToken);
    localStorage.setItem("nom", newNom);
    setNom(newNom);
    setToken(newToken);
  }

  function onDeconnexion() {
    localStorage.removeItem("token");
    localStorage.removeItem("nom");
    setToken(null);
    setNom("");
  }

  if (!token) return <AuthScreen onConnexion={onConnexion} />;
  return <TasksScreen nom={nom} onDeconnexion={onDeconnexion} />;
}
