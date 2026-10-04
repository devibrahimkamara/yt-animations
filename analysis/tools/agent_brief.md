# Brief d'analyse — vidéo de référence (grille commune)

## Contexte
On construit le **playbook de montage** d'Ibrahim, créateur YouTube francophone (IA, make money, tutoriels d'outils IA). Ses vidéos : face caméra (un seul plan, 1080p) + ~85 % de captures d'écran avec webcam en médaillon. Le montage est automatisé dans Remotion (React) : tout élément retenu doit pouvoir être **reproduit en code** (animations, textes, zooms/recadrages, inserts, SFX, musique). Le but de l'analyse n'est PAS de copier, mais de **répertorier tous les procédés** (visuels, sonores, structurels) qui servent la rétention, pour ensuite créer un playbook original.

Règles déjà validées par Ibrahim (à garder en tête pour juger) : fluidité avant tout (zooms sans à-coups, coupes dans les pauses), temps de lecture suffisant pour les textes (rien de « rushé »), sobriété (audience européenne : pas de stickers criards, flèches rouges, effets « arnaque »), mobile-first (textes grands), voix toujours au-dessus de tout.

## Catégories d'Ibrahim (à utiliser pour classer chaque élément du catalogue)
Il a lui-même identifié ces familles — tague chaque élément avec une ou plusieurs d'entre elles (colonne « Famille Ibrahim »), et signale ce qui n'entre dans aucune :
1. Zooms progressifs
2. Effets sonores
3. Musique de fond
4. Textes animés / overlays / animations
5. B-roll / images / vidéos **générés par IA**
6. B-roll / images / vidéos **réels** — distinguer **stock** vs **contenu réel qui illustre une chose réelle** (capture, archive, document, produit)
7. Animations motion design (type Remotion / HyperFrames, faites en code ou After Effects)
8. Visuels / animations / 3D **générés par IA**
9. Flous et effets d'image (blur, profondeur de champ, vignettage, glow…)
10. Storytelling / narration (structure du récit, boucles, anecdotes, tension)
11. Boosters de rétention : cartons de titre, upper/lower thirds, **tracker de progression de la vidéo** (chapitre en cours, étape X/Y, barre de progression…)
12. B-roll réel **du créateur lui-même** (lui en situation, autre lieu, coulisses)

Pour les familles 5, 6, 8 et 12, indique à chaque fois les **indices** qui te font conclure (IA / stock / réel / tourné par le créateur) et ton niveau de confiance.

## Matériel disponible (dans le dossier de la vidéo)
- `digest.md` : mesures automatiques sur **toutes les frames** (coupes, durée des plans, zooms mesurés, cadrage visage), événements sonores détectés sur la piste hors-voix séparée par Demucs (whoosh, pops, impacts, avec le mot prononcé au même moment), niveaux et passages musicaux, **transcript horodaté**. Lis-le en premier.
- `sheets/s_NNN.jpg` : planches de 16 vignettes = **1 image par seconde**, horodatées (hh:mm:ss en jaune). Planche N couvre les secondes (N−1)×16 à N×16−1. **Regarde-les TOUTES**, dans l'ordre.
- `src.mp4` : la vidéo. Pour voir un détail (texte d'un overlay, typographie, animation rapide), extrais des frames en pleine résolution ou à plus haute cadence :
  `ffmpeg -v error -ss <t> -i src.mp4 -frames:v 1 -vf scale=1280:-1 /tmp/claude-501/<slug>_<t>.jpg` (ou `-t 1.5 -vf fps=10,scale=480:-1,tile=5x3` pour décomposer une animation). Fais-le pour chaque type d'élément important (au moins 15–25 zooms ciblés), surtout dans les 60 premières secondes.
- Contexte transversal : `/Users/ibrahimkamara/yt-animations/analysis/checklist_ibrahim.md` (sa checklist de montage) — à lire rapidement pour savoir ce qui l'intéresse.

## Limites à respecter
- Tu ne peux pas écouter : les sons sont décrits par leurs mesures (durée, timbre, montée, position par rapport aux coupes/mots). Ne prétends pas avoir entendu.
- Ne recopie pas de longs passages du transcript (citations < 15 mots).

## Livrable : `RAPPORT.md` dans le dossier de la vidéo, en français, structuré ainsi

### 1. Fiche
Chaîne, titre, durée, format (face cam / écran / B-roll en %), rythme global (coupes/min, plan médian), débit de parole, mots/min.

### 2. Structure minute par minute
Tableau : minute · ce qui se passe (contenu) · type dominant (A=action/démo, E=explication, P=preuve, T=transition/chapitre, S=sponsor/CTA) · densité visuelle · éléments notables. Puis : où sont les chapitres, interruptions de motif majeures (timecodes), sponsor/CTA, comment se passe la fin (signal de fin ? CTA ? boucle vers une autre vidéo ?).

### 3. Les 60 premières secondes à la seconde près
Découpage fin (0–5, 5–15, 15–35, 35–60 s et au-delà si l'intro dure plus) : plans, textes à l'écran, sons, musique, ce qui est promis/montré, techniques d'accroche (cold open, preuve, teaser « coming up », boucle ouverte…).

### 4. Catalogue des éléments (le cœur du rapport)
Un bloc par élément distinct (vise exhaustif : typiquement 20–40 éléments), format :
```
#### [ID court] Nom de l'élément — catégorie (visuel-texte / visuel-motion / visuel-cadrage / insert / transition / son-SFX / son-musique / structure)
- Famille Ibrahim : n° (1–12) ou « hors liste »
- Exemples : timecodes (3–6)
- Fréquence : nombre total / cadence
- Description précise : apparence (position, taille relative, typo, couleurs, fond), animation (entrée/sortie, durée, easing), durée à l'écran, son associé
- Fonction rétention : pourquoi ça marche
- Pertinence pour les tutos IA/make money d'Ibrahim : 1–3 (+ justification d'une ligne)
- Reproduction Remotion : comment (composants, données nécessaires, difficulté faible/moyenne/forte)
```
### 5. Son
Musique (présence, niveau relatif, changements, silences), familles de SFX et leur placement (sur coupes ? sur textes ? sur mots-clés ?), traitement voix.

### 6. Ce qui est spécifique / signature de ce créateur
Ce qui rend la chaîne reconnaissable en 3 s.

### 7. Top 10 des procédés à transposer chez Ibrahim
Classés par impact/effort, avec comment les rendre **originaux** (une variante propre à lui plutôt qu'une copie).

Sois factuel et précis (timecodes partout). Longueur cible : 3 000–6 000 mots. Ta réponse finale (dans le chat) : 10 lignes max — chemin du rapport + 5 constats majeurs.
