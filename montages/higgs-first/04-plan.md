# Higgsfield First Video (Seedance 2.5) · plan de montage (03/11/2026)

Composition `HiggsFirstFull` (`src/MontageHiggsFirst/Full.tsx`), 25 051 images (13:55).
Rushes : face + écran de 13:37, transcription `01-analyse/transcript.txt`.

## Décisions d'Ibrahim
- Aucune coupe : la durée lui convient (03/11/2026).
- La fin (démo Genjutsu + conclusion) manque dans les rushes (coupée par erreur au premier montage) : Ibrahim l'enverra. Le montage s'arrête à 13:21 source (« Genjutsu dans le menu d'en haut »).

## Timeline de sortie
| Sortie | Source | Contenu |
|---|---|---|
| 0:00 → 0:03 | — | Ouverture : la vidéo d'Abidjan, son seul (brief : ouvrir sur le résultat, sans logo) |
| 0:03 → 11:19.7 | 0:00 → 11:16.7 | Rushes |
| 11:19.7 → 11:34.8 | — | **Abidjan en entier, avec son son** (« tu vas la regarder en entier ») |
| 11:34.8 → 13:10.4 | 11:16.7 → 12:52.3 | Rushes |
| 13:10.4 → 13:25.4 | — | **Bali en entier, avec son son** (« encore une fois, 105 crédits ») |
| 13:25.4 → 13:55 | 12:52.3 → 13:21.9 | Rushes (Genjutsu, à compléter) |

## Habillage (temps source)
- 0:00-0:15 : Abidjan, Bali, puis les deux côte à côte (même visage, mêmes lunettes, mêmes accessoires).
- 0:37-2:10 : kit média de la marque (2 familles, tableau des modèles d'images, Nano Banana 2.1, GPT Image 2.5, Soul Cinema 1.5, Seedream 5.0 Pro, tableau des modèles vidéo avec la ligne surlignée : Wan, Kling, Seedance). 2:12 : « Ma combinaison » GPT Image 2.5 + Seedance 2.5.
- 3:08-3:16 et 5:09-5:18 : « Lien : 1re ligne de la description ». 5:01 : « Jusqu'à 50 % de réduction avec mon lien » (écrit et dit), lien juste après.
- Flous : comptes Google 3:48-3:56 ; carte bancaire 6:00-6:09.
- Prix sur le bouton Generate (zoom + carte) : 2,75 (7:35), 2,75 (9:11), 105 (10:50), 105 (12:50).
- Étapes 1 à 6 (StepLT) : compte, personnage, fiche, Seedance, Bali, Genjutsu.
- Awa en grand à 7:56 ; la fiche en grand à 9:19 (de face / de profil / gros plan) ; comparaison fiche ↔ vidéo à 11:21.
- Musique : pistes Epidemic de Kling 4.0, coupée pendant les deux vidéos jouées en entier. Mix final à −14 LUFS.

## Rendu
Serveur Singapour, 4 morceaux vidéo en parallèle (concurrence 5) + piste audio WAV, assemblage `-c copy`, loudnorm 2 passes : `/root/rendu/hf_render.sh` → `/root/rendu/hf/higgs_first_final.mp4`.
