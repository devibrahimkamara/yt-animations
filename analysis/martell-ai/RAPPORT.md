# Analyse montage — Dan Martell, « How to Make AI Sound EXACTLY Like you » (0:00–5:00)

Sources : `shots.json` (OpenCV, 8 992 frames), `audio_events.json` (Demucs + librosa), `audio.json` (Whisper), planches `sheets/` (1 img/s).

## 1. Rythme global

| Mesure | Valeur |
|---|---|
| Plans en 5 min | **99** → 1 coupe toutes les **3,0 s** (médiane 2,2 s) |
| Plan le plus long | 13,6 s (jamais plus) |
| Débit de parole | **203 mots/min**, aucun blanc (silences coupés) |
| Répartition | ~55 % face cam / ~45 % inserts (écran, motion design, B-roll) |
| Effets sonores | **66 en 5 min** → 1 toutes les ~4,5 s (≈ 12 dans les 25 premières s) |
| Musique audible | Seulement en *stings* de 2–4 s aux transitions (8 en 5 min) |

### Structure
- **0–35 s : hook** — montage le plus dense (coupe toutes les ~1,5 s), preuve visuelle immédiate (mails IA, Slack, Google Docs), sous-titres cinétiques sur la phrase clé.
- **35–39 s : teaser « Coming up… »** — carte PiP visage + prompt tapé, fond dégradé bleu.
- **40–54 s : promesse + présentation du système** (tableau blanc pyramide).
- **55–62 s : crédibilité** — archives 2014/2016/2019 dans des cartes avec badge année.
- **~66 s → : chapitre 1 « Build the Brain »**, tag de chapitre permanent en haut à gauche ; **~268 s : chapitre 2 « Make It Think Like You »**.

## 2. Caméra, cadrages et zooms

- Dan a **3 vraies caméras** : face large, 3/4 latérale, plongée sur le tableau blanc. Il alterne presque à chaque phrase.
- Taille du visage à l'écran : plan large ≈ 19–21 % de la hauteur, plan serré ≈ 27–34 %. Les sauts entre plans vont de ×1,4 à ×2,0.
- En plan 3/4, le visage est **décentré** (centre à 35–42 % de la largeur, règle des tiers). En plan face, il est centré (50 %).
- Sur les 53 plans face cam :
  - **30 sont statiques** (variation de ±2 %).
  - **10 ont un push-in de plus de 5 %** :
    - *Rapides dans le hook* : +21 % en 2,2 s (0:00), +12 % en 1,8 s (0:33), +9 % en 1,3 s (0:39).
    - *Lents ailleurs* : +27 % sur 5,9 s (2:33), +15 % sur 7,7 s (4:52), +9 % sur 10 s (3:55).
  - **5 ont un léger dézoom** (−2 à −5 %).
- **Règle observée** : le mouvement vient surtout du **changement de cadrage à chaque coupe**. Le zoom progressif est réservé à environ 1 plan sur 5, en général pendant une phrase importante.

## 3. Catalogue des habillages (avec exemples)

| # | Élément | Où | Description |
|---|---|---|---|
| 1 | Sous-titres cinétiques ciblés | 0:00, 0:23 | Gros texte blanc gras en bas, mots qui « rebondissent » un par un. **Pas de sous-titres permanents**, seulement sur les phrases-clés. |
| 2 | Soulignement rouge | 0:24 | Trait rouge qui se dessine sous « can't replace a human ». |
| 3 | Écran flottant avec profondeur | 0:02–0:15 | Capture (Gmail) inclinée/flottante, bords flous (profondeur de champ), fond noir. |
| 4 | Surlignage mot à mot | 0:09–0:15 | Surligneur jaune sur les « mots d'IA » (delve, quietly…) synchronisé à la voix. |
| 5 | Teaser « Coming up… » | 0:35 | Carte PiP du visage + champ de prompt qui se tape, dégradé bleu, mention « Coming up… ». |
| 6 | Cartes d'archives | 0:55 | Vidéos anciennes dans une carte arrondie + badge année (2014, 2016, 2019). |
| 7 | Scroll avec flou de mouvement | 1:03 | Défilement de la chaîne YouTube avec un fort flou directionnel (transition « whip »). |
| 8 | Tag de chapitre permanent | 1:08 → | Pastille translucide en haut à gauche : « 1. Build the Brain ». |
| 9 | Carte-titre de chapitre | 2:16 | Titre serif italique + sphère 3D + arc à 3 étapes qui se remplit. **Réutilisée 3 fois** comme carte de progression (2:16, 3:24, 3:36). |
| 10 | Motion design sur mesure | 2:02, 3:11 | Cerveau en particules + mots flottants ; enregistrement → cerveau → listes de tâches. |
| 11 | Lower-third outil | 2:41–3:45 | Logo + URL en bas à gauche (granola.ai, wisprflow.ai, obsidian.md, notion.so…). |
| 12 | Carte citation en split | 2:53 | Visage à gauche, texte à droite sur fond sombre : « The tool doesn't matter / *It's the capturing that does.* » (serif italique + mot en couleur). |
| 13 | Liste à puces en verre | 2:34 | Panneau translucide à droite, 3 puces avec icônes qui arrivent une par une, puis sortie floutée. |
| 14 | Pastille CTA | 3:57 | « Find all prompts in the description » en bas, au moment où il le dit. |
| 15 | Écran + webcam PiP N&B | 2:09 | Démo d'outil avec la face cam en noir et blanc dans un coin. |
| 16 | B-roll illustratif littéral | partout | Le mot dit = l'image : « record » → bouton REC en macro, « data » → réseau de fichiers, « while driving » → voiture. Stock + tournages perso. |
| 17 | Ancre visuelle récurrente | 0:27, 0:50, 1:33… | Le tableau blanc pyramide revient à chaque étape du système. |

## 4. Son

- **Voix** : sèche, très en avant, dynamique stable (LRA 4,2 LU). Sur le stream : −22 LUFS. Pour YouTube, viser −14 LUFS.
- **Musique** : pendant qu'il parle, la piste « hors voix » se situe ~32 dB sous la voix, donc **inaudible** (au mieux une nappe ambiante très faible, sans rythme). La musique **surgit en stings de 2–4 s** aux moments-clés :
  - 0:00 (intro) ; 0:40 (sortie du teaser) ; 0:52 (« build the brain ») ;
  - 2:02 et 2:16 (motion design / carte-titre) ; 3:18 ; 4:27 (chapitre 2).
- **Effets sonores** (66) :
  - **Whoosh/riser** (1–2,5 s, très fort) : entrées de motion design, cartes-titres, transitions de chapitre.
  - **Pops/clics** (<0,3 s, discrets) : apparition de texte, puces, UI.
  - **Impacts sourds** : mots-clés, coupes du hook.
  - **47 % tombent à moins de 0,6 s d'une coupe** : le son est collé à l'image.

*Limite de la méthode* : je mesure les instants, la durée, la puissance et le timbre (grave/aigu, montée) de chaque son. Je ne l'« entends » pas : la classification est déduite de ces mesures.

## 5. Recettes pour ta vidéo (une caméra, 1080p)

1. **Faux multicam (3 cadrages tirés d'un seul plan)**, en changeant à chaque phrase (toutes les 3–4 s) :
   - **Large** = 100 % ;
   - **Serré** = 120–125 % centré sur le visage ;
   - **Faux 3/4** = 115 % avec le visage décalé sur un tiers (35 % ou 65 %).

   Ne pas dépasser **130 %** en 1080p.
2. **Zooms progressifs** sur ~1 plan sur 5 :
   - hook : rapide (+10–15 % en 2 s) ;
   - ailleurs : lent (+5–8 % sur 5–8 s) ;
   - parfois un léger dézoom.
3. **Sous-titres cinétiques seulement sur les phrases-clés** + soulignement / surlignage.
4. **Tag de chapitre permanent** + **carte-titre de chapitre récurrente** (carte de progression).
5. **Lower-thirds outils** (logo + URL) dès qu'un outil est cité.
6. **Cartes citation en split**, **listes à puces en verre**, **pastille CTA**.
7. **SFX** : ~1 toutes les 4–5 s ; whoosh sur les transitions et entrées de motion design, pop sur chaque texte, impact sur les mots-clés du hook.
8. **Musique** : stings aux transitions. Si tu veux un fond continu, le mettre très bas (−28 à −32 dB sous la voix), plus présent dans le hook seulement.
9. **B-roll littéral** : les captures d'écran de l'outil dont tu parles (ici MiniMax) sont la priorité.

### Composants Remotion à construire
`FauxMulticam` (cadrages + zooms pilotés par JSON), `KineticCaption`, `UnderlineHighlight`, `ChapterTag`, `ChapterCard`, `ToolLowerThird`, `QuoteSplit`, `GlassBulletList`, `CTAPill`, `FloatingScreen` (profondeur + flou), `ComingUpTeaser`.
