# Étape 0 — Brief · Vidéo MiniMax (« créer un jeu mobile avec l'IA en 15 min, zéro code »)

*Process PLAYBOOK §8. Statut : 🔒 en attente de validation d'Ibrahim. L'ancienne `02-restructuration.md` (4 octobre) est caduque : l'étape 2 a été supprimée le 6 octobre, la vidéo est gardée telle que tournée.*

## Fichiers reçus

| Fichier | Contenu | Technique | Remarque |
|---|---|---|---|
| `/Volumes/SSD2/MINIMAX.mp4` | **Montage déjà fusionné par le monteur** : face cam plein écran + capture d'écran avec ta webcam incrustée en médaillon | 1920×1080, 30 fps, **5,7 Mbit/s** (faible), 9:43 | Pas de pistes séparées (le monteur n'a envoyé que ce fichier) |
| Audio | Voix seule, déjà dérushée | AAC 44,1 kHz stéréo, 192 kbit/s | **−26,5 LUFS**, crête −3,6 dBTP, LRA 5 LU : à remonter de ~10 dB, propre |
| `00-brief/script.txt` | Ton script (anglais), titre : *I Built a Mobile Game With AI in 15 Minutes (Zero Coding)* | — | Sert de référence pour le sponsor et les textes à l'écran |

### Carte des plans (détection automatique des changements de plan)

| Temps | Plan | Ce qu'on peut faire |
|---|---|---|
| 0:00–0:39 | **Face cam plein écran** (bibliothèque, micro) | Zoom ≤ 1,15 (1080p), inserts du jeu par-dessus |
| 0:39–8:05 | **Capture d'écran + médaillon** en bas à droite (~255×340 px, x 1598–1853, y 705–1045) : site MiniMax, installation, app, assets, Canvas (≈3:51), Game Studio, jeu dans le navigateur | Zooms et plongées dans l'écran (×2 sur l'interface nette, mais 5,7 Mbit/s → vérifier le piqué) |
| 8:05–8:46 | **Enregistrement du téléphone** (vertical, centré sur fond noir) + médaillon | Le meilleur visuel : réutilisable en insert dans le hook |
| 8:46–8:59 | Face cam plein écran | — |
| 8:59–9:12 | Capture Poki / CrazyGames + médaillon | Preuve « argent » |
| 9:12–9:43 | Face cam plein écran (CTA, fin) | — |

**Soit ~7 min 40 sur 9 min 43 (79 %) en capture avec médaillon figé.**

## Comment on monte autour du fichier fusionné

Ce qui est **impossible** : retour en face cam plein écran pendant les démos, vrai « Glissé », écran propre sous le médaillon.

Ce qui reste **possible**, et que je propose :
1. **Médaillon « reconstruit »** : on découpe la zone du médaillon (on connaît sa position exacte) et on la ré-affiche nous-mêmes, dans le style de la charte (bord lime, ombre). Quand on zoome sur une partie de l'écran qui n'est pas sous le médaillon, l'original sort du cadre et notre copie peut **rétrécir, se déplacer ou disparaître**. On retrouve ainsi un médaillon vivant, sans pistes séparées.
2. **Médaillon agrandi aux moments-clés** (phrases de tension, réactions) : ×1,5 maximum (au-delà, l'image de 255 px devient floue).
3. **Plongées dans l'écran** qui suivent chaque clic, comme pour AIsa : un événement visuel toutes les 5–12 s pendant les 7 min 40 de capture.
4. **Cartons d'étape, Carte du tuto, prompts décortiqués** par-dessus l'interface (sans allonger la timeline).
5. **Hook** : ton script prévoit « [Screen: the finished game running in the iPhone preview] » alors que 0:00–0:39 est en face cam. On met **le jeu sur téléphone (images de 8:05–8:46) en insert par-dessus** la face cam, sans rien déplacer ni ajouter à la timeline.

## Questionnaire

1. **Sponsor : MiniMax (MiniMax Code)**, d'après le script (CTA « try MiniMax Code for free », points quotidiens). Tu confirmes ? Segments intouchables par défaut : **toutes les démos, de 0:39 à 8:46**, plus le CTA. On habille par-dessus, on ne coupe rien.
2. **Écarts entre le script et ce qui a été tourné** (d'après l'ancienne transcription, à confirmer à l'étape 1) :
   - script : « link in the pinned comment » ; vidéo : « lien en description ». Lequel ?
   - script : 3 étapes ; vidéo : installation → visuels → Canvas → Game Studio → test PC et téléphone (même Wi-Fi) → argent. **Les cartons suivent ce qui est tourné**, d'accord ?
   - le CTA chiffré (400 points par jour, 1 000 les jours 4 et 7, 4 000 sur la semaine) est-il dit dans la vidéo ? S'il ne l'est pas, faut-il l'**afficher à l'écran** (exigence de la marque) ?
   - le passage « Play again » trop petit puis correction mobile, et le lien de partage via « Site », ont-ils été tournés ?
3. **Langue** : la vidéo est en **français** et le script en anglais. Les textes à l'écran sont en français, et le titre YouTube aussi ?
4. **Renvoi de fin** : la vidéo « créer un SaaS avec l'IA » (script). Elle existe déjà ? Lien ou titre ?
5. **Preuve « argent »** : « sur Poki, 100 % des revenus quand les joueurs viennent de ta propre audience ». Je vérifie ce chiffre sur la page développeurs de Poki avant de l'afficher. D'accord ?
6. **Ressources en description** : les 2 prompts du script (assets + jeu) et la correction mobile ?

## Demande de la marque reçue après le tournage (Raya, Tec-Do)

1. **Présenter brièvement le modèle M3.1.**
2. **Une courte phrase positive à la fin** sur ton expérience avec M3.1.

Solution proposée, sans retourner d'images : **2 phrases enregistrées en voix seule** (même micro, même pièce, ~5–8 s chacune), posées sur des plans d'écran (sélection de M3.1, gameplay), donc sans problème de synchro labiale. On y ajoute une carte « M3.1 » à l'écran au moment de la sélection. Exception assumée à la règle « pas d'insertion » : c'est une exigence du sponsor. Ce que tu dis déjà de M3.1 sera vérifié à l'étape 1.

### Brief complet de la marque (reçu le 11 octobre) → `00-brief/brief-marque.md`

Ce que ça change pour le montage :
- **Le nom du modèle « M3.1 Flash Preview » doit être visible à l'écran** → zoom + carte au moment de la sélection.
- **Le réglage de profondeur de réflexion** doit être montré → spotlight dessus.
- **Une amélioration visible** (refinement) est exigée → à mettre en valeur si elle a été tournée (correction mobile ? corrections faites par l'IA ?). Point vérifié à l'étape 1.
- **Liens obligatoires en commentaire épinglé** (téléchargement Desktop en premier, puis agent.minimax.io). Si tu dis « en description » dans la vidéo, on corrige à l'écran par un carton « Liens en commentaire épinglé ».
- **CTA** : si les points (400 / 1 000 / 4 000) ne sont pas dits, on les affiche en carte pendant ton CTA.
- **Offre M Plan −50 % : on ne la mentionne pas** (elle expire le 14 octobre, avant la sortie).
- Les faits officiels sur M3.1 (1M tokens de contexte, réflexion réglable, modèle de code multimodal) servent pour la phrase d'introduction de M3.1 et la carte à l'écran.

## Réponses d'Ibrahim

*(à compléter)*

## Prochaine étape

**Étape 1 : analyse**. Transcription Whisper mot par mot, typage des beats, repérage précis du médaillon et des zones de zoom nettes, matériaux du hook, comparaison script ↔ tourné. Estimation : **~100–150 k tokens, ~20 min**.
