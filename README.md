# ⚔ Dashboard Player vs Monster

Application web de gestion de tâches gamifiée sur le thème RPG/Fantasy.  
Backend **FastAPI** · Frontend **React + TypeScript (Vite)** · Base de données **SQLite**

---

## Aperçu

L'objectif : chaque tâche accomplie est une **quête** qui fait progresser ton personnage.  
Choisis une **Voie d'effort**, accumule de l'expérience, monte de niveau et améliore tes attributs.

---

## Fonctionnalités

### Authentification
- Inscription / Connexion sécurisée (JWT + bcrypt)
- Nom d'utilisateur : **minimum 6 caractères**
- Mot de passe : **minimum 8 caractères** avec au moins une minuscule, une majuscule, un chiffre et un caractère spécial
- Checklist de validation en temps réel à la saisie du mot de passe
- Affichage du mot de passe avec icône SVG dans le thème
- Session non persistante : reconnexion obligatoire à chaque ouverture de page
- Déconnexion automatique après **5 minutes d'inactivité** (avertissement + 30 secondes pour répondre)

### Quêtes (Tâches)
- Créer, supprimer et terminer des quêtes
- **Sous-quêtes** : jusqu'à 5 par quête, sur 3 niveaux maximum
- Cliquer sur une quête pour déplier / replier ses sous-quêtes
- Barre de progression automatique selon l'avancement des sous-quêtes
- **Limite de temps** au choix :
  - Durée (décompte en temps réel — JJ, HH:MM:SS, puis ⚠ urgent, puis ☠ Expirée)
  - Date limite (J-X jours)

### Voies d'effort
Chaque quête appartient à une voie qui progresse indépendamment :

| Voie | Bonus au passage de niveau |
|------|---------------------------|
| Voie du Corps | +2 Force, +2 Vie |
| Voie de l'Esprit | +2 Intel, +2 Magie |
| Voie du Paresseux | +2 Défense, +2 Magie |

Les sous-quêtes héritent automatiquement de la catégorie de leur quête parente.

### Système de niveaux
- Niveau global (1 → 20) basé sur le total de quêtes accomplies
- Seuils progressifs : ×1.5 jusqu'au niveau 5, ×3 jusqu'au niveau 7, paliers fixes (300/500/1000), puis ×2
- Chaque passage de niveau global octroie **5 points** à dépenser librement dans les attributs

### Attributs
5 statistiques améliorables manuellement avec les points de niveau :

| Attribut | Source |
|----------|--------|
| Force | Voie du Corps |
| Défense | Voie du Paresseux |
| Vie | Voie du Corps |
| Magie | Voie de l'Esprit + Voie du Paresseux |
| Intel | Voie de l'Esprit |

### Onglet Accomplies
- Onglet dédié à toutes les quêtes terminées
- 3 sous-groupes repliables — un par voie
- Compteur de quêtes accomplies par groupe

---

## Stack technique

| Couche | Technologies |
|--------|-------------|
| Backend | Python 3.14, FastAPI, SQLAlchemy (SQLite), Pydantic v2, python-jose, bcrypt |
| Frontend | React 18, TypeScript, Vite, CSS custom (dark glassmorphisme) |
| Polices | Cinzel (titres), Crimson Text (texte) — Google Fonts |

---

## Installation & lancement

### Prérequis
- Python 3.10+
- Node.js 18+

### Backend

```bash
cd fastapi_apprentissage
pip install fastapi uvicorn sqlalchemy python-jose bcrypt httpx
python -m uvicorn main:app --reload
```

API disponible sur `http://localhost:8000`  
Documentation interactive : `http://localhost:8000/docs`

### Frontend

```bash
cd fastapi_apprentissage/frontend
npm install
npx vite
```

Interface disponible sur `http://localhost:5173`  
Le proxy Vite redirige automatiquement `/api/*` vers `http://localhost:8000`.

---

## Structure du projet

```
fastapi_apprentissage/
├── main.py                  # Point d'entrée FastAPI
├── database.py              # Engine SQLAlchemy + session
├── models/                  # Modèles SQLAlchemy (ORM)
│   ├── user.py
│   ├── tache.py             # Tâches récursives (sous-tâches)
│   ├── competence.py        # Statistiques du personnage
│   └── categorie.py         # Progression par voie
├── services/                # Logique métier
│   ├── auth.py              # JWT, bcrypt, validation mot de passe
│   ├── taches.py            # CRUD + complétion (transaction unique)
│   ├── categories.py        # Progression des voies + bonus stats
│   ├── competences.py       # Amélioration des attributs
│   ├── niveaux.py           # Calcul des seuils de niveau
│   └── ia.py                # Détection de catégorie par mots-clés
├── routers/                 # Endpoints FastAPI
│   ├── auth.py              # /inscription /connexion /profil
│   ├── taches.py            # /taches CRUD + /terminer
│   ├── competences.py       # /competences
│   ├── categories.py        # /categories
│   └── ia.py                # /deviner-categorie
└── frontend/
    ├── src/
    │   ├── App.tsx                  # Auth, session, timeout inactivité
    │   ├── api.ts                   # Fonctions d'appel API typées
    │   ├── types.ts                 # Interfaces TypeScript
    │   ├── index.css                # Thème dark glassmorphisme RPG
    │   ├── screens/
    │   │   ├── AuthScreen.tsx       # Connexion / inscription + tooltips
    │   │   └── TasksScreen.tsx      # Écran principal
    │   └── components/
    │       ├── Icons.tsx            # Icônes SVG sur mesure (thème RPG)
    │       ├── NiveauCarte.tsx      # Barre de niveau global
    │       ├── CategoriesCarte.tsx  # Panneaux des 3 voies
    │       ├── CompetencesCarte.tsx # Grille des 5 attributs
    │       ├── TacheItem.tsx        # Quête récursive cliquable
    │       ├── QuestesTerminees.tsx # Onglet accomplies par voie
    │       └── Countdown.tsx        # Décompte temps réel
    └── vite.config.ts               # Proxy /api → FastAPI :8000
```

---

## Sécurité

- Tokens JWT avec expiration 24h
- Mots de passe hachés avec bcrypt (sans passlib — compatible Python 3.14)
- Isolation totale des données entre utilisateurs
- Session non persistante côté navigateur
- Timeout d'inactivité automatique (5 min + 30 sec)
- Validation du mot de passe côté client ET côté serveur
