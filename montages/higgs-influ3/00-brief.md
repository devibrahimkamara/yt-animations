# Higgs Influ 3 : « Ton influenceur IA ne devrait pas être humain » (Étape 0 : brief)

*Ouvert le 6 octobre 2026. Script : `00-brief/script.md`. Brief sponsor : `00-brief/brief_higgsfield.md`.*

## 1. Ce qui est reçu

| Fichier | Contenu | Technique |
|---|---|---|
| `Higgsfield Influencler Footage.mp4` | Face cam, **une seule prise continue** (aucune coupe détectée) | 1920×1080, 30 i/s, 7,6 Mbit/s, 9:45,9 |
| `Higgsfield Influencler Capture-1.mp4` | Écran du Mac | 1920×1080, 30 i/s, 6,1 Mbit/s, 9:45,9 |
| Audio | **Identique sur les deux fichiers** (corrélation 1,00) : les pistes sont déjà synchronisées | AAC 44,1 kHz stéréo, **−25,9 LUFS** (voix basse, à normaliser à −16) |

**Ce que montre l'écran** (mesure de luminance, une image toutes les 5 s) :

| Source | Écran | Usage |
|---|---|---|
| 0:00 – 1:10 | Noir | — |
| 1:10 – 5:30 | **Le script dans le document** (Ibrahim le lit) | ❌ jamais à l'écran (notes de tournage, §10) |
| 5:30 – 6:35 | Higgsfield AI Influencer (Character Builder) | ✅ démo sponsor |
| 6:35 – 7:05 | Image claire (sans doute le portrait du chat sur fond blanc) | À vérifier à l'étape 1 |
| 7:05 – 9:25 | Higgsfield Genjutsu (référence + génération) | ✅ démo sponsor |
| 9:25 – 9:46 | Retour au script | ❌ |

**Conséquences :**
- La source fait 9:46 pour un script de ~7:30 : il y a des reprises et des blancs. Il faut un **dérushage** (méthode Higgs Influ 2, `analysis/tools/derush2.py`, alignement forcé sur le script) avant la restructuration.
- Les 4 premières minutes (hook, intro, formats 1 à 3, format mort) n'ont **aucune image d'écran utilisable**. Tout ce passage sera illustré par des captures et des vidéos réelles (§4.4bis), et probablement en grande partie en plein cadre (Ibrahim lit son script, §4.4ter, à confirmer par `gaze.py` à l'étape 1).
- Face cam très sombre (fond brun, éclairage latéral) : étalonnage léger prévu, sans changer l'ambiance.

## 2. Contraintes du sponsor (Higgsfield)

- Vidéo dédiée ≥ 6 min. Workflow complet à l'écran : **personnage → référence de mouvement → vidéo générée → au moins une variation**.
- Assets du **Media Kit** officiel à intégrer (logo, exemples).
- ❗ **Aucun personnage, logo ou extrait de tiers sans accord préalable** de Higgsfield. Or le hook et les formats 1 à 3 reposent sur des comptes tiers (influenceuse IA, drame de fruits, « Paws of Vengeance », chat orange, POV/Bigfoot).
- Démos Higgsfield intouchables (§1bis) : pas coupées, pas accélérées, pas déplacées, interface jamais masquée.

## 3. Ce qui manque (à me fournir)

1. **La vidéo de référence de 10 s** (Ibrahim qui joue la trahison), en fichier brut.
2. **Les vidéos générées par Genjutsu en HD** (la scène + les variations : pyjama, casino / ruelle, lettre / valise), téléchargées depuis Higgsfield.
3. **Le Media Kit Higgsfield** (logo, vidéos d'exemple).
4. **Les comptes cités** (pseudo TikTok ou lien) : l'influenceuse IA (319 vidéos, 36 k), le chat « Paws of Vengeance » (41 vidéos, 573 k), le compte de fruits (640 k, vidéo du 12 septembre à 35 M), le chat orange (2 M, hit à 80 M), un compte POV historique et un compte Bigfoot. Si la veille de la session de recherche existe (comme pour Jean Phil), je peux la retrouver.
5. Le lien de la vidéo Jean Phil (écran de fin).
6. Plus tard (étape 8) : le lien UTM du Creator Dashboard.

## 4. Questionnaire (à valider avant l'étape 1)

Réponses d'Ibrahim (6 octobre 2026) :
- **Comptes tiers** : Higgsfield a validé → on montre les vraies vidéos et profils (captures et enregistrements via `webcap.mjs`).
- **Vitesse** : ×1,10 **partout**, démo comprise (accord sponsor).
- **Vidéo de référence + rendus Genjutsu HD** : Ibrahim les dépose dans `~/Downloads`.
- **Recherches** : retrouvées dans la session de préparation → `00-brief/recherches.md`.
- Sponsor : Higgsfield. Segments intouchables : toute la démo (source 5:30 → 9:25), sauf les redites orales (§1bis, exception du 6/10).

Reste à fournir : Media Kit Higgsfield, lien de la vidéo Jean Phil, plus tard le lien UTM.
