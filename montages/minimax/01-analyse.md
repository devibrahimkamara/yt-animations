# Étape 1 — Analyse · Vidéo MiniMax (« créer un jeu mobile avec l'IA en 15 min »)

*Process PLAYBOOK §8. Sources : transcription Whisper large-v3-turbo mot à mot (`01-analyse/transcript.txt`, 2 251 mots), détection des plans, des pauses et de la loudness, vérification image des moments exigés par la marque (`01-analyse/chk_modele.jpg`, `chk_jeu.jpg`). Statut : ✅ validé par Ibrahim le 11 octobre 2026 (voix seules 1 et 2 en cours d'enregistrement).*

## 1. Fiche

| Mesure | Valeur |
|---|---|
| Durée | 9 min 43 |
| Débit | **~232 mots/min** : très rapide, déjà dérushé serré |
| Pauses | Une seule pause > 0,6 s (6:55). **Aucune coupe de silence à faire.** |
| Audio | −26,5 LUFS, crête −3,6 dBTP : +12 dB vers −14 LUFS au master, voix propre |
| Image | 1080p30, 5,7 Mbit/s, fichier fusionné (capture + médaillon). 79 % de la durée en capture. |
| Langue | Français (script et brief en anglais) |

## 2. La carte de la vidéo (beats)

Type : A action/démo · E explication · P preuve/résultat · S sponsor/CTA · 🔵 = démonstration sponsorisée (habillage seulement).

| Temps | Beat | Type | Plan | Diagnostic |
|---|---|---|---|---|
| 0:00–0:12 | « Ce jeu que tu vois à mon écran n'existait pas il y a 15 minutes… 0 ligne de code… tu auras la méthode » | Hook | Face cam | ❌ **Il dit « que tu vois à mon écran », mais on ne voit que lui.** Insert du jeu sur téléphone (8:29–8:45) obligatoire. |
| 0:12–0:30 | MiniMax Code : designé, codé, testé (mobile, navigateur), publié au même endroit, < 15 min | E / S | Face cam | Énumération = **Carte du tuto** |
| 0:30–0:38 | « Tu peux les créer pour générer de l'argent… Poki, CrazyGames… on en parle plus tard » | Boucle ouverte | Face cam | Logos Poki / CrazyGames (images de 8:59) |
| 0:38–1:00 | Télécharger MiniMax Code (« lien dans la description »), Mac ou Windows | A 🔵 | Capture : site | ⚠️ Le brief exige le **commentaire épinglé** → correction à l'écran |
| 1:00–1:29 | Installer, Sign In, autoriser dans le navigateur | A 🔵 | Capture | Sous-étapes en pastilles |
| 1:29–2:10 | Select a folder → nouveau dossier « jeu mobile v1 » (conseil : un dossier par projet) | A 🔵 | Capture : Finder | Pastille « 1 dossier = 1 projet » |
| 2:10–2:22 | « L'étape que beaucoup oublient… un jeu très moche : concevoir le visuel d'abord » | Tension | Capture | ✅ Excellente phrase de re-hook → KCAP + médaillon agrandi |
| 2:22–2:56 | Prompt des assets (2 directions : bonbon pastel / néon) | A 🔵 | Capture : prompt surligné | Prompt lisible en zoom → **Prompt décortiqué** |
| 2:56–3:15 | Choix du modèle **M3.1** (« le plus récent, le plus puissant »), contexte et effort laissés par défaut | E 🔵 | Capture : menus modèle (**M3.1-Flash-Preview** visible) puis Context window (512K / 1M) et Effort (default → max) | ✅ Nom du modèle à l'écran. ⚠️ **Le médaillon cache en partie le menu Effort**. Lieu idéal pour la présentation de M3.1 demandée par Raya. |
| 3:15–3:50 | Résultat : pastel contre néon, arrière-plans, blocs, choix du pastel | P 🔵 | Capture : assets | **Re-engagement n°1** (~3:20) |
| 3:50–4:37 | Présentation de l'Infinite Canvas (zoomer, déplacer, comparer) | E / A 🔵 | Capture : canvas | 47 s de présentation : plongées qui suivent ses zooms |
| 4:37–5:11 | Plugin **Game Studio** (créé par l'équipe MiniMax) → + → Plugins | A 🔵 | Capture | Spotlight sur chaque clic |
| 5:11–5:39 | Prompt du jeu (Stack Up, direction A, une touche, jouable au pouce) | A 🔵 | Capture : prompt | Prompt décortiqué n°2 |
| 5:39–6:07 | M3.1 vérifié, permissions **Full access** contre **Ask for approval** | E 🔵 | Capture | Mini-comparatif à côté de l'interface |
| 6:07–6:26 | Le jeu est développé : l'IA a **testé, trouvé et corrigé** ses bugs (« Ce que le playtest a révélé (et corrigé) ») | P 🔵 | Capture : résumé | ✅ C'est **l'amélioration (refinement) la plus visible** de la vidéo → highlight ligne par ligne |
| 6:26–6:45 | URL localhost : uniquement disponible en local | E | Capture | Recréation de l'URL en grand |
| 6:45–7:18 | **Gameplay navigateur**, meilleur score 15, ça accélère | P | Capture : jeu plein écran | **Re-engagement n°2** |
| 7:18–7:56 | Navigateur intégré : vues Responsive, Mobile, iPhone XR | A 🔵 | Capture : menu device | Exigence du brief (Browser + device preview) ✅ |
| 7:56–8:29 | Test sur son propre téléphone : copier l'URL, **même Wi-Fi obligatoire** | A | Capture téléphone vertical | Piège → `[CAUTION]` |
| 8:29–8:45 | Gameplay sur téléphone, score 22–23 | P / wow | Téléphone | Le meilleur visuel : source de l'insert du hook |
| 8:45–8:54 | Récap des 3 façons de tester | E | Face cam | — |
| 8:54–9:28 | Gagner de l'argent : CrazyGames, Poki, revenus publicitaires | E | Capture Poki puis face cam | Ferme la boucle de 0:30. Aucun chiffre avancé → rien à vérifier |
| 9:28–9:37 | « Lien dans la description… tester gratuitement… et aussi dans le lien épinglé » | S | Face cam | CTA incomplet par rapport au brief (voir §3) |
| 9:37–9:43 | « Mets-moi en commentaire… à la prochaine vidéo, peace out » | Fin | Face cam | Pas de renvoi vers la vidéo SaaS → écran de fin |

## 3. Conformité au brief MiniMax

| Exigence | Dans la vidéo ? | Ce qu'on fait |
|---|---|---|
| Modèle M3.1 Flash Preview **affiché** | ✅ 3:01 et 5:42 (sélecteur « M3.1-Flash-Preview ») | Zoom + carte « M3.1 Flash Preview » |
| Expliquer le choix du modèle | 🟡 Une phrase : « le plus récent, le plus puissant » | **Phrase en voix seule demandée par Raya** (§5) + carte : 1M de contexte, réflexion réglable |
| Montrer le **réglage de profondeur de réflexion** | 🟡 Le menu Effort (default à max) s'ouvre ~3:10, mais il est laissé sur « default » et le médaillon le cache en partie | Médaillon déplacé + spotlight sur le menu Effort |
| Plugin installé à l'écran | ✅ Game Studio (4:37–5:11) | Spotlight |
| Prompts complets | ✅ Les 2 prompts sont lisibles à l'écran | Prompts décortiqués + en description |
| **Une amélioration (refinement)** | 🟡 Pas de correction demandée par toi ; l'IA corrige elle-même ses bugs (6:07) et tu choisis une direction visuelle | On met en avant la liste « Ce que le playtest a révélé (et corrigé) ». Si Raya veut une correction **demandée par toi**, il faudra une courte capture d'écran en plus (voir §5). |
| Résultat qui fonctionne | ✅ Navigateur + iPhone XR + vrai téléphone | — |
| Infinite canvas (optionnel ⭐) | ✅ 3:50–4:37 | — |
| CTA : essai gratuit + **points quotidiens** + M3.1 Flash Preview | 🟡 Essai gratuit oui ; points, M3.1 et H3 non dits | Carte animée pendant ton CTA (400 / jour, 1 000 jours 4 et 7, 4 000 sur la semaine) + ta phrase positive |
| Liens en **commentaire épinglé** | 🟡 Dit « description » (0:49, 9:30) puis « aussi dans le lien épinglé » (9:35) | Pastille « 📌 Lien en commentaire épinglé » à 0:49 et 9:30 |
| Phrase positive sur M3.1 à la fin (Raya) | ❌ | **Phrase en voix seule** (§5) |

## 4. Points d'attention

1. **« 15 minutes » contre l'écran.** À 5:42, l'interface affiche **« Processed 23m 58s »** pour la seule génération des assets. Ton hook dit « n'existait pas il y a 15 minutes ». Un spectateur attentif peut le relever en commentaire. Je propose de **ne pas zoomer sur ce compteur** (on ne floute rien : l'interface reste intacte). À toi de voir si tu préfères aussi adoucir l'ordre de grandeur à l'oral dans la voix seule (« en quelques minutes de travail de ma part »).
2. **Erreurs de transcription à corriger dans les sous-titres** : « Minimax Coding » → MiniMax Code ; « les parmi camara » → ibrahimkamara ; « staker » → stacker ; « ce l'ordi, c'est 23 si c'est 22 » (8:42) à réécouter.
3. **Le médaillon cache des éléments utiles** : menu Effort (3:10), bas des listes d'assets, menu device à droite (7:37). Le médaillon reconstruit (brief §« Comment on monte ») résout ça.
4. **Débit très rapide (232 mots/min)** : les textes à l'écran doivent rester courts, et chaque texte assez longtemps à l'écran (règle 9).
5. **Pas de faute de fond** : aucun chiffre de revenus avancé, donc rien d'inventé à vérifier.

## 5. Ce qu'il te reste à enregistrer (aucune image de toi)

| # | Quoi | Où dans la vidéo | Durée |
|---|---|---|---|
| 1 | **Voix seule : présentation de M3.1** (ex. « M3.1 Flash Preview, c'est le dernier modèle de MiniMax : il peut garder en mémoire jusqu'à un million de tokens, et on peut régler la profondeur de sa réflexion. ») | Après 3:06, sur le plan du menu modèle/effort | ~6 s |
| 2 | **Voix seule : ton avis positif sur M3.1** (avec tes mots, sincère) | Avant le CTA (~9:28), sur le gameplay | ~5 s |
| 3 | *(Facultatif, seulement si Raya l'exige)* une courte capture : tu demandes une correction (ex. bouton « Rejouer » plus grand) et le jeu se met à jour | Après 7:56 (vue iPhone XR) | ~20 s |

Même micro, même pièce, même distance. Je raccorde le son (EQ, niveau, ambiance).

## 6. Points forts

- Hook déjà bien écrit, promesse claire en 12 s, boucle « argent » ouverte à 0:30 et refermée à 8:54.
- Matériau visuel riche : 2 directions graphiques, canvas, gameplay navigateur, **vrai téléphone**, mur de jeux Poki.
- Dérushage très propre : aucune pause à couper.
- Re-engagements naturels à ~3:20 (révélation des visuels), ~6:45 (gameplay) et ~8:29 (téléphone).

## 7. Prochaine étape

Après ta validation (et l'enregistrement des voix 1 et 2) : **étape 3, montage audio** (traitement voix, intégration des 2 voix seules, niveaux), puis **étape 4, plan de montage**.
