# Higgs Influ 3 : étape 1, analyse

*6 octobre 2026. Sources : transcription Whisper mot à mot (`01-analyse/micro.json`, `transcript.txt`), alignement forcé (`micro_aligned.json`, 2 386 mots sur 2 433), regard (`gaze.json`), planches de l'écran (`planche_demo_*.jpg`) et des rendus (`planche_rendus.jpg`). Temps = temps de la source.*

## 1. La carte de la vidéo

Types de beats : A action · E explication · P preuve/résultat · R réaction · C contexte · S sponsor/CTA. 🔒 = démo sponsorisée (intouchable, §1bis).

| Source | Durée | Beat | Contenu | Écran disponible |
|---|---|---|---|---|
| 0:00 – 0:20 | 20 s | P/C | **Hook** : influenceuse 319 vidéos / 36 k contre chat 41 vidéos / 573 k, « 100 fois plus de vues », « 99 % créent des influenceuses » | ❌ (noir) |
| 0:20 – 0:40 | 20 s | E | Pourquoi : influenceuses partout, toutes pareilles ; chats, animaux, fruits = dizaines de millions | ❌ |
| 0:40 – 1:09 | 29 s | C/S | « 400 vidéos analysées, 12 types » + promesse (formats qui explosent, format mort, démo de A à Z) + **présentation de Higgsfield / AI Influencer 2.0** | ❌ (script) |
| 1:10 – 2:05 | 55 s | E | **Format 1 : drame de fruits** (@fruitystories36, 640 k, 35 M le 12/9) + leçon « l'émotion compte, pas le personnage » | ❌ |
| 2:05 – 3:16 | 71 s | E | **Format 2 : la série de chats** (@cat_flix_, Paws of Vengeance, part 10 = 82 M) + leçon « des épisodes » | ❌ |
| 3:16 – 4:18 | 62 s | E | **Format 3 : l'animal héros** (@orange.cat.philos, 2 M, ~300 k de moyenne, 80 M) + leçon « un héros, mille situations » | ❌ |
| 4:18 – 4:52 | 34 s | E | **Le format mort** : POV historiques, Bigfoot | ❌ |
| 4:52 – 5:17 | 25 s | E | **La règle** : analyser 5–6 comptes, regarder leurs vidéos récentes | ❌ |
| 5:17 – 5:37 | 20 s | S | Transition vers la pratique + « premier lien en description et en commentaire épinglé » | ❌ puis Higgsfield à 5:30 |
| 5:37 – 6:35 | 58 s | A 🔒 | **Character Builder** : choix « chat », style costume, bijoux, Générer (« un seul crédit ») | ✅ |
| 6:35 – 6:48 | 13 s | P/R 🔒 | **Le chat généré** (portrait + pied) : « il fait grave rigoler » | ✅ |
| 6:48 – 7:10 | 22 s | E | Explication de la vidéo de référence (scène de déception) | ❌ **l'écran montre le script** (≈ 6:48 – 7:03) |
| 7:10 – 7:58 | 48 s | A 🔒 | **Genjutsu** : upload de la référence, choix du chat, Motion Transfer, 720p, 56 crédits, Processing (dont **5,3 s de silence** à 7:12) | ✅ |
| 7:58 – 8:24 | 26 s | P/R 🔒 | **Le résultat** joue à l'écran : « il suit même mes mouvements » | ✅ |
| 8:24 – 9:12 | 48 s | A 🔒 | **Les 3 variations** par prompt : pyjama, casino, sac de voyage, lancées en parallèle | ✅ (écrans « Processing ») |
| 9:12 – 9:24 | 12 s | P | Promesse : « je te mettrai à l'écran les trois vidéos » + comparaison avec l'original | ❌ (écran Processing) → rendus HD fournis |
| 9:24 – 9:46 | 22 s | S | Rappel du lien + renvoi vers la vidéo Jean Phil + « peace out » | ❌ (script) |

**Rushes complémentaires reçus** : ta vidéo de référence (IMG_7271.mov, 8,7 s, 4K vertical) et les 4 rendus Genjutsu HD (720×1280, 8 s chacun) : chat en costume, pyjama (de nuit), casino, sac de voyage. Tous bons.

## 2. Diagnostic

### Rythme et structure
1. **5 min 17 d'explication d'affilée avant la première action** (0:00 → 5:17). C'est le risque n°1 de la vidéo : E → E → E (règle 4). Il n'existe **aucune image d'écran utilisable** sur ce passage : tout doit venir des vrais comptes (profils, vidéos qui jouent, compteurs), capturés par nous (§4.4bis).
2. **Pas de preuve visuelle du résultat dans les 5 premières secondes** (règle 1) : le hook est un chiffre, et le résultat le plus spectaculaire (ton chat qui rejoue ta scène) arrive à 7:58. Matériau de cold open idéal : la référence et le chat côte à côte, 3 s.
3. Chaque format (55 à 71 s) dépasse la limite des 60 s par explication : il faudra un changement visuel toutes les 15 à 20 s (profil → vidéo qui joue → chiffre → leçon).
4. Démo sponsor : 3 min 50 au total, découpée en 4 actions, avec un résultat au milieu (6:35) et un à la fin (7:58). Bon rythme naturel. Seul temps mort : 5,3 s de navigation silencieuse à 7:12, et les écrans « Processing » de 8:50 à 9:20.
5. **Fin** : la promesse « je te mettrai les trois vidéos à l'écran » (9:12) doit être tenue par un `[SHOWCASE]` : l'original + les 4 rendus. C'est le climax de la vidéo.

### Prise et audio
- **Une seule prise propre** : très peu de reprises. Pauses de plus de 0,8 s : 12 (17,5 s). Temps récupérable en ramenant les pauses à 0,25 s : **≈ 33 s**.
- Redite candidate à la coupe : 8:02 « Et j'ai fait une erreur, je l'ai généré deux fois. Donc il a généré la vidéo deux fois. » (≈ 4 s, aparté dans la démo, validation nécessaire).
- **Durée estimée** : 9:46 − 33 s ≈ 9:13, puis ×1,10 → **≈ 8:23** (brief : ≥ 6 min ✅).
- Voix à −25,9 LUFS : normalisation à −16 (DeepFilterNet doux + chaîne validée).

### Image
- Face cam très sombre (fond brun, lumière latérale), micro dans le champ. Étalonnage léger prévu ; le zoom serré sera limité (source 1080p à 7,6 Mbit/s).
- Écran : la fenêtre du navigateur flotte sur le fond d'écran bleu du Mac (à recadrer). Le script est visible de 1:10 à 5:30, de ≈ 6:48 à 7:03 et après 9:25 : **jamais montré** (§10).

### Ce qui est dit vs les données (règle `[SCREEN-TRUTH]`)
| Source | Dit | Données (6/10) | Proposition |
|---|---|---|---|
| 0:42 | « plus de 400 vidéos, plus de 12 types » | ~360 vidéos (12 × ~30) + 10 comptes vérifiés = **près de 400** | Afficher « ~400 vidéos · 12 formats » (pas « 400+ ») |
| 0:00 | « 36 000 abonnés » | **36 800** | Afficher 36,8 k (capture du jour) |
| 2:19 | « Power of Vengeance » | Titre réel : **Paws Of Vengeance** | À l'écran, le vrai titre ; sous-titres corrigés |
| 2:45 | « chaque jour il y a des nouvelles parties » | **@cat_flix_ ne poste plus depuis le 8 mars 2026** | ⚠️ Faux : couper la phrase (≈ 1,5 s) ou ne rien afficher qui la souligne |
| 6:22 | « un seul crédit » | L'écran affiche le coût sur le bouton (à lire en zoom à l'étape 4) | L'écran fait foi |
| 0:57, 5:29… | « Hicksfield », « Xfield », « Dien Jutsu » (transcription) | Higgsfield, Genjutsu | Corrections des sous-titres (`corrections.json`) |

### Exigences du brief Higgsfield
| Exigence | Couverte ? |
|---|---|
| Création du personnage à l'écran | ✅ 5:37 – 6:48 |
| Référence de mouvement appliquée | ✅ 7:10 – 7:58 |
| Vidéo générée | ✅ 7:58 – 8:24 + rendu HD |
| Au moins une variation | ✅ 3 variations (tenue, décor, objet) + rendus HD |
| Assets du Media Kit | ❌ **manquant** (logo, exemples) |
| Contenu tiers | ✅ validé par Higgsfield (selon toi) |

## 3. Lecture du script (§4.4ter)

Détection `gaze.py` (critère du playbook, hors démo) → `01-analyse/lecture_script.json`. Ces passages deviennent des **illustrations plein cadre opaques**, sans face cam :

| Source | Durée | Ce que tu dis | Illustration prévue |
|---|---|---|---|
| 0:00 – 0:14,6 | 14,6 s | Le hook (319 vidéos / 36 k contre 41 / 573 k, 100×) | Les deux profils réels côte à côte, compteurs animés |
| 1:17 – 1:45 | 28 s | Histoire des fruits, 640 k, 35 M le 12/9, construction des titres | Profil @fruitystories36 qui défile, vidéo à 35 M qui joue, titres en grand |
| 2:17 – 2:37 | 19 s | Paws of Vengeance, parties 1 à 10, 82 M, 41 vidéos, 573 k | Grille du profil @cat_flix_ (Part 9/10/11), la part 10 qui joue |
| 3:26 – 3:50 | 24 s | Chat orange : moto, crocodile, 2 M, ~300 k, 80 M | La vidéo de la moto qui joue, profil, compteurs |
| 4:28 – 4:32 | 3,4 s | POV bâtisseur de pyramides, vlogs Bigfoot | Les 2 vidéos de 2025 côte à côte |
| 5:29 – 5:33 | 3,6 s | « On va se retrouver sur Higgsfield » | Déjà couvert : arrivée sur l'écran Higgsfield |

Partout ailleurs (hors démo), tu regardes l'objectif : face cam autorisée.

**Reprises** : la transcription littérale ne trouve aucune répétition réelle (seulement « même même » à 8:14, micro-bégaiement). Pas de dérushage de prises : on ne fait que resserrer les pauses.

## 4. Points forts
- Le résultat Genjutsu est excellent et drôle (le chat met les mains dans les poches) : c'est le matériau du hook et du climax.
- Les données sont solides et vérifiables : 4 comptes réels, chiffres mesurés, un ratio de 126× qui tient.
- La structure du script (4 formats + 1 mort + démo) donne une **Carte du tuto** naturelle : Fruits → Série → Héros → ☠ Mort → Démo.
- Démo complète, conforme au brief, sans attente à couper.
