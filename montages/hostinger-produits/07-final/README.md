# Étape 7 : assemblage et relecture (11 octobre 2026)

## Fichiers
| Fichier | Durée | Où |
|---|---|---|
| `HostingerProduits_final_x1.10.mp4` (à publier) | **14:26,4** | ici + serveur `/root/rendu/blocs/final/` |
| `HostingerProduits_final_x1.10_apercu720.mp4` (téléphone) | 14:26,4 | ici |
| `HostingerProduits_final.mp4` (×1,00) | 15:52,8 | serveur seulement |

Composition `src/MontageHostingerProduits/Full.tsx` (timeline = source + 17 s d'insertions Hostinger, fonction `T()`). Blocs : H (0 → 2 483), 1 (2 484 → 8 039), 2 (8 040 → 16 289), 3 (16 290 → 23 159), 4 (23 160 → 28 581).

## Relecture automatique
| Contrôle | Résultat |
|---|---|
| Nombre d'images par bloc | 2 484 · 5 556 · 8 250 · 6 870 · 5 422 = 28 582 ✓ |
| Niveaux | ×1,00 et ×1,10 : **−14,0 LUFS**, crête **−1,0 dBTP** ✓ |
| Musique + effets sous la voix | hook 16,6–19 dB (mesuré au prototype), blocs vérifiés à −15,9 / −16,4 LUFS avant master ✓ |
| Synchro voix (corrélation, 6 points dont avant/après les 2 insertions) | **0 ms** partout ✓ |
| Écran noir (`blackdetect`) | aucun ✓ |
| Image figée > 6 s (`freezedetect`) | 5:18 (7,3 s) et 6:05 (6,3 s) : le panier Hostinger tenu pendant les explications, sous la limite de 10 s ✓ |
| Raccords entre blocs (image avant / après) | 4 raccords propres ✓ |
| Données personnelles | liste d'e-mails floutée (6:40,9 → 6:42,4), code postal de la fenêtre d'adresse flouté, favoris du navigateur jamais montrés ✓ |

## Retours Hostinger intégrés (04-plan.md §0)
- Page ai-builder-lp (FR, 2,99 €/mois) à la place de l'accueil (4:42 → 5:01 source).
- Séquence « Sélectionner et modifier » (8 s, sans voix) après 12:10 source.
- Séquence Hostinger Ecommerce (9 s, sans voix) après 12:30 source : forfait « croissance du commerce électronique » 5,99 €/mois (12 mois), vérifié sur la page officielle française.

## Reste à faire
- Visionnage complet par Ibrahim, sur téléphone puis au casque (validation 🔒 de l'étape 7).
- Étape 8 : sous-titres (corrections : Cloud → Claude, Camara7 → KAMARA7…), chapitres ×1,10, description, ressources (prompts, checklist), Shorts, miniature.
