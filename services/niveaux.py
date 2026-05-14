def _calculer_seuils() -> list[int]:
    """
    Tâches nécessaires pour chaque transition de niveau :
    - 1→5  : ×1.5 par niveau
    - 5→7  : ×3   par niveau
    - 7→8  : 300  (fixe)
    - 8→9  : 500  (fixe)
    - 9→10 : 1000 (fixe)
    - 10→20: ×2   par niveau
    """
    seuils = [0]
    req = 5.0
    for i in range(1, 20):
        seuils.append(seuils[-1] + round(req))
        if i < 4:
            req *= 1.5
        elif i < 6:
            req *= 3.0
        elif i == 6:
            req = 300
        elif i == 7:
            req = 500
        elif i == 8:
            req = 1000
        else:
            req *= 2.0
    return seuils


SEUILS = _calculer_seuils()
MAX_NIVEAU = 20


def niveau_actuel(taches_completees: int) -> int:
    niveau = 1
    for i, seuil in enumerate(SEUILS):
        if taches_completees >= seuil:
            niveau = i + 1
        else:
            break
    return min(niveau, MAX_NIVEAU)


def infos_niveau(taches_completees: int) -> dict:
    niveau = 1
    for i, seuil in enumerate(SEUILS):
        if taches_completees >= seuil:
            niveau = i + 1
        else:
            break
    niveau = min(niveau, MAX_NIVEAU)

    if niveau >= MAX_NIVEAU:
        return {
            "niveau": MAX_NIVEAU,
            "progression": 100,
            "taches_niveau": taches_completees - SEUILS[MAX_NIVEAU - 2],
            "taches_prochain_niveau": None,
        }

    seuil_actuel = SEUILS[niveau - 1]
    seuil_prochain = SEUILS[niveau]
    taches_dans_niveau = taches_completees - seuil_actuel
    taches_pour_progresser = seuil_prochain - seuil_actuel

    return {
        "niveau": niveau,
        "progression": round(taches_dans_niveau / taches_pour_progresser * 100),
        "taches_niveau": taches_dans_niveau,
        "taches_prochain_niveau": taches_pour_progresser,
    }
