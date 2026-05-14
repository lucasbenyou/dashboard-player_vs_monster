import re
import httpx
from pydantic import BaseModel

MOTS_PHYSIQUE = [
    "sport", "courir", "marcher", "salle", "musculation", "vélo", "nager",
    "natation", "yoga", "étirer", "stretching", "escalade", "randonnée",
    "ménage", "nettoyer", "déménager", "jardiner", "construire", "réparer",
    "cuisine", "cuisiner", "porter", "soulever", "entraînement", "cardio",
]

MOTS_MENTAL = [
    "lire", "étudier", "apprendre", "cours", "réviser", "coder", "programmer",
    "écrire", "rédiger", "analyser", "recherche", "projet", "planifier",
    "mathématiques", "science", "langue", "traduction", "mémoriser", "calculer",
    "concevoir", "dessiner", "musique", "jouer", "instrument", "réfléchir",
]


class DevinageRequest(BaseModel):
    titre: str
    description: str | None = None


def _deviner_par_mots_cles(titre: str, description: str | None) -> str | None:
    texte = (titre + " " + (description or "")).lower()
    texte = re.sub(r"[^\w\s]", " ", texte)
    mots = set(texte.split())

    score_physique = sum(1 for m in MOTS_PHYSIQUE if m in mots or any(m in mot for mot in mots))
    score_mental   = sum(1 for m in MOTS_MENTAL   if m in mots or any(m in mot for mot in mots))

    if score_physique == 0 and score_mental == 0:
        return None
    return "physique" if score_physique >= score_mental else "mental"


# ── Option : appel à une IA externe (Ollama, OpenAI-compatible, etc.) ──────────
#
# Pour activer, remplace l'appel à _deviner_par_mots_cles dans deviner()
# par _deviner_par_ia() et configure l'URL + le modèle.
#
# Exemple avec Ollama en local (ollama run mistral) :
#   URL_IA  = "http://localhost:11434/api/chat"
#   MODELE  = "mistral"
#
# Exemple avec OpenAI :
#   URL_IA  = "https://api.openai.com/v1/chat/completions"
#   MODELE  = "gpt-4o-mini"
#   + ajouter Authorization: Bearer <clé> dans les headers

URL_IA = "http://localhost:11434/api/chat"
MODELE = "mistral"

PROMPT_SYSTEME = (
    "Tu es un classificateur de tâches. "
    "Réponds uniquement par 'physique', 'mental', ou 'aucun'. "
    "physique = effort du corps (sport, ménage, cuisine…). "
    "mental = effort de l'esprit (étudier, coder, lire, analyser…). "
    "aucun = aucune catégorie claire."
)


async def _deviner_par_ia(titre: str, description: str | None) -> str | None:
    contenu = titre + (f" — {description}" if description else "")
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.post(URL_IA, json={
            "model": MODELE,
            "messages": [
                {"role": "system",  "content": PROMPT_SYSTEME},
                {"role": "user",    "content": contenu},
            ],
            "stream": False,
        })
        r.raise_for_status()
        reponse = r.json()["message"]["content"].strip().lower()

    if "physique" in reponse:
        return "physique"
    if "mental" in reponse:
        return "mental"
    return None


def deviner(titre: str, description: str | None) -> str | None:
    # Échange cette ligne contre : return await _deviner_par_ia(titre, description)
    # si tu veux utiliser une IA externe (nécessite de rendre la fonction async)
    return _deviner_par_mots_cles(titre, description)
