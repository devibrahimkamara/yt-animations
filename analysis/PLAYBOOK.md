# Playbook de montage — chaîne d'Ibrahim (tutos IA · make money)

*Version 1 — 4 octobre 2026.*

**Sources :**
- analyse image par image de 4 vidéos de référence :
  - Dan Martell ×2 ;
  - Sandeep Swadia ;
  - Sanji Nai-Chien ;
- la recherche documentaire sur le montage de tutoriels ;
- la checklist d'Ibrahim, « Le montage : rythme, preuve et pipeline » ;
- les retours validés sur le test MINIMAX v1 à v3.

**Détails dans :**
- `analysis/ref/*/RAPPORT.md` ;
- `analysis/research_tutoriels.md` ;
- `analysis/checklist_ibrahim.md`.

> **Règle d'usage.**
> - Ce playbook s'applique **à la lettre à chaque vidéo** qu'Ibrahim demande de monter (« voici les fichiers, monte la vidéo »). C'est un document de travail pour Claude, pas une page à publier.
> - Le montage suit **le process pas à pas du §8** : 10 étapes, chacune terminée par **une validation d'Ibrahim** avant de passer à la suivante. On ne monte jamais une vidéo entière d'une traite.
> - Chaque élément a un identifiant (`[ID]`) qui correspond à un composant Remotion, existant ou à construire.
> - Les valeurs suivies de *(à calibrer)* viennent d'avis d'experts ou de dérivations, pas de mesures. Elles seront ajustées avec les courbes de rétention de la chaîne (§11).

---

## 0. En une page

Une vidéo d'Ibrahim, c'est **un tuto qui se regarde comme un documentaire premium sobre** :
- la preuve est montrée dans les 5 premières secondes ;
- un plan visible du tuto sert de fil rouge ;
- chaque écran est mis en scène, jamais montré brut ;
- les textes sont lisibles sur un téléphone ;
- une identité visuelle et sonore reconnaissable en 3 secondes.

| Pilier | Ce qu'on fait | Ce qu'on ne fait jamais |
|---|---|---|
| **Rythme** | Quelque chose de nouveau toutes les ~3 s en face cam, toutes les 5 à 12 s en démo. On varie la densité selon le segment. | Un plan identique de plus de 10 s. Deux explications d'affilée. Ralentir dans le dernier tiers. |
| **Preuve** | Résultat réel à 0:00. Plan continu, puis zoom, puis chiffre incrusté. Chiffres cohérents au centime. | Chiffre recréé sans capture réelle. Flèche ou cercle rouge criard. Données perso visibles. |
| **Lisibilité** | Zoom sur la zone d'action. Prompts et petits textes **recréés en grand**. Texte affiché au moins `max(1,2 s ; mots/2,5 + 0,5 s)`. | Écran entier illisible. Texte qui disparaît avant d'être lu. |
| **Fluidité** | Zooms en ease-in-out, coupes dans les pauses de la voix, entrées et sorties en douceur. | Zoom qui démarre en à-coup. Coupe en plein mot. Élément qui « clignote ». |
| **Signature** | Une couleur (bleu `#3060ff`), une police (Plus Jakarta Sans), un fond « aurora », un kit sonore fixe, une transition signature. | Changer de style d'une vidéo à l'autre. Stickers, confettis, néons. |
| **Son** | La voix toujours au-dessus de tout. Musique très basse qui s'efface sous les explications. Effets sonores = événements. Master à −14 LUFS. | Musique avant l'image dans le hook. Effet sonore décoratif sur un mot. Voix trop basse. |

---

## 1. Les 13 règles d'or (non négociables)

1. **La preuve avant la parole.** Les 3 à 5 premières secondes montrent le résultat réel : le jeu qui tourne, l'app générée, le chiffre. On n'ouvre jamais sur « salut, aujourd'hui… ». *(checklist + recherche : 55 % des spectateurs perdus avant 60 s, chiffre de source secondaire.)*
2. **La promesse est tenue dans la première minute.** Le titre et la miniature doivent se retrouver dans ce qu'on montre avant 0:60. *(25 % des abandons viennent d'une info attendue qui n'est pas là, TechSmith.)*
3. **Le plan du tuto est visible.** Un sommaire apparaît dans les 35 premières secondes. Il revient comme tracker à chaque étape, et une pastille « Étape N/T » reste affichée. *(Martell « Habits » et Swadia ; segmentation de Mayer.)*
4. **Jamais deux explications d'affilée** (alternance A/E). Une explication ne dépasse jamais 60 s, avec un changement visuel toutes les 15 à 20 s. *(checklist ; le creux 4:00–6:04 de Martell AI est l'exemple à éviter.)*
5. **Chaque écran est mis en scène :** établissement, puis plongée, puis tenue. Jamais une capture plein écran brute plus de 2 s. *(Swadia, Sanji.)*
6. **Tout texte trop petit est recréé en grand** : prompt, commentaire, calcul, réglage. On ne se contente pas de le zoomer. *(Sanji ; c'est la solution au problème mobile.)*
7. **Aucune attente réelle de plus de ~2 s.** La génération IA est compressée, avec un badge honnête (« ⏩ 3 min de génération »).
8. **Un effet marquant par plan, au maximum.** Zoom, texte ou effet sonore, mais pas les trois en même temps. Chaque effet répond à la question « où regarder maintenant ? ». *(checklist, parcimonie ; principe de cohérence de Mayer.)*
9. **Texte = temps de lecture.** Chaque texte reste au moins `max(1,2 s ; nb_mots / 2,5 + 0,5 s)`, puis sort en fondu et glissement (~0,35 s). *(retour Ibrahim sur la v1.)*
10. **La voix est la référence.** Rien n'est plus fort qu'elle. Musique 18 à 25 dB en dessous. Master à −14 LUFS, crête ≤ −1 dBTP.
11. **Le dernier tiers ne ralentit jamais.** On n'annonce pas la fin. La vidéo se termine sur un renvoi vers une autre vidéo dans les 20 dernières secondes.
12. **On reste sobre et crédible.** Pas de flèches ni de cercles rouges, pas de néon, pas de confettis. L'IA générée est annoncée comme telle. L'échec reçoit le même traitement graphique que le succès.
13. **Le contenu sponsorisé est intouchable.** Quand une vidéo est sponsorisée, toutes les présentations et démonstrations du produit ont été validées par la marque. Voir les règles détaillées au §1bis.

### 1bis. Règles des vidéos sponsorisées

| Interdit sur les segments du sponsor | Autorisé (on rend intéressant **par l'habillage**) |
|---|---|
| Couper, raccourcir ou fusionner une démonstration ou une présentation | Zoom, plongée et recadrage sur l'interface (`[SCREEN-STAGE]`), tant que l'élément montré reste visible |
| Accélérer une démonstration (pas de ×4, pas de time-skip ajouté) | `[SPOTLIGHT]`, `[HIGHLIGHT]`, `[CURSOR]`, `[STEP-LT]`, `[CHAPTER-PILL]`, pastilles et callouts courts placés à côté de l'élément |
| Réordonner les démonstrations, ou en déplacer une | Effets sonores, musique, jingle, mise en valeur de la voix |
| Masquer l'interface du produit plus de ~1–2 s (carte plein écran, insert par-dessus) | **Ajouter** du contenu *entre* deux démonstrations (carton d'étape, Carte du tuto, teaser, `[SHOWCASE]` du résultat), ce qui allonge sans rien retirer |
| Modifier ce qui est dit sur le produit | Variante « côte à côte » des cartes recréées (`[PROMPT-CARD]`, `[RECREATE]`) : l'interface reste visible, légèrement assombrie, et la carte se pose à côté |

- **Avec des pistes séparées** (face cam / écran), la marque a validé le *contenu*, pas un montage visuel. Donc l'interface est à l'écran **dès qu'il s'y passe une action**, et la face cam plein écran n'est autorisée que pendant les explications où l'écran est figé (validé par Ibrahim sur AIsa).
- Les attentes déjà coupées par le monteur (« après quelques minutes… ») restent telles quelles.
- **La restructuration (étape 2) ne touche que ce qui n'est pas sponsorisé** : hook, transitions, réactions, contexte, CTA de fin.
- En cas de doute sur un segment, on le traite comme sponsorisé et on pose la question à l'étape 0.

---

## 2. La charte signature (figée 6 mois)

### 2.1 Visuel — identité v2 « Noir & Lime » (validée par Ibrahim le 4 octobre 2026)

Référence complète : `analysis/identite-v2/charte.md`. Planche de référence : `src/identiteV2/Board.tsx`. Composants : `src/montage/lib.tsx` et `src/montage/Explainers.tsx`.

| Élément | Valeur | Remarque |
|---|---|---|
| Police | **Geist** 500 (titres, approche −0,03 em) et 400 (corps) · **Instrument Serif *italique*** pour **un** mot par phrase (`Em`, `rich("… *mot* …")`) | Reprend l'espace membre. Plus de graisse 800. Le serif italique remplace le surlignage et le soulignement. |
| Couleur d'accent | **Lime `#c6f36d`** (`LIME`), profond `#8dbb3a`, fond de pastille `#1e2712` | **Un seul élément lime par écran** : mot-clé, chiffre héros ou CTA |
| Couleurs d'état | Bon `#8ee3a1`, mauvais `#ff8a7a` | ✓ / ✗, avant / après |
| Fond des inserts | Noir `#090b08` + halos lime (16 % et 10 %) qui respirent + grain 5 % (`Backdrop`, `Grain`) | Jamais d'aurora multicolore |
| Cartes / panneaux | Verre : dégradé blanc 7,5 % → 2 %, bord blanc 8 %, rayon 28–40 px (`glass`) · carte lime pour un chiffre héros (`LIME_CARD`) | |
| Sur-titres | Majuscules, espacement 0,16 em, lime, 30–36 px (`Eyebrow`) · étoile ✦ pour « l'IA » (`Star`) | |
| Tailles (1080p, mobile) | Phrase-thèse 120–140 px · chiffre héros 220–300 px · texte de carte ≥ 44 px · légende ≥ 30 px | |
| Mouvement | Mots qui **sortent du flou** (`blurIn`) · inserts qui entrent et sortent en fondu flou (`Reveal`) · captures qui arrivent **inclinées** puis se redressent (`ScreenStage tilt`) · phrase-thèse seule sur face cam floutée (`FocusVeil` + `KeyLine valign="center"`) | Jamais de coupe sèche vers un insert |
| Easing | `EASE = bezier(0.22, 1, 0.36, 1)` pour les entrées · `inOut(cubic/sin)` pour les caméras | |
| Étalonnage face cam | Léger (luminosité +10 %, contraste +5 %, saturation +6 %) | Les écrans restent neutres |

### 2.2 Sonore (kit Epidemic validé le 4 octobre 2026, `public/epidemic/hq/`, `SFX_KIT` dans `src/montage/lib.tsx` ; le tableau ci-dessous décrit les rôles, l'ancien kit Mixkit est abandonné)

| Rôle | Fichier | Usage |
|---|---|---|
| **Révélation** (unique, réutilisé à chaque chiffre ou résultat) | `impact_heartbeat_deep__mk498` | Chiffre héros, résultat final, « 15 min ». C'est le « son de la chaîne » de la checklist. |
| Porte de chapitre / transition majeure | `swoosh_vacuum__mk1465` (pic à 1,56 s) | Entrée du carton d'étape, entrée d'un insert « preuve » |
| Transition lourde, adoucie | `impact_whoosh_deep__mk1143` (pic à 0,55 s, gain ×0,5) | Sortie d'insert, retour face cam après un temps fort |
| Apparition de texte | `pop_dry_notif`, `pop_light_explainer`, `pop_long`, `pop_bubble` (en rotation) | Une seule fois par bloc de texte, pas par mot |
| Interface / clic | `click_select`, `click_classic`, `click_ui_tone`, `click_tech_select` | Clic réel dans une démo, entrée de pastille |
| Validation | `click_box_check__mk1120` | Case cochée, trait sous un mot, étape terminée |
| Montée de tension | `riser_trailer__mk790` (2,6 s), `riser_stutter_space__mk1144` (6,5 s) | Les secondes avant un résultat ou une révélation (pic calé sur l'image) |
| Musique | **Propre à chaque vidéo** (voir §5bis), depuis Epidemic Sound | Une musique par partie, style sérieux. Le kit Mixkit initial est abandonné (jugé « pas premium »). |
| **À créer** | Jingle d'étape de 2 s (motif fixe, monte d'un demi-ton à chaque étape) | Idée de Martell « Habits », rendue originale. Généré une fois, puis réutilisé. |

Tous les gains sont calculés **par rapport à la voix** (pop −9 dB, clic −12 dB, impact −4 dB sous la voix p90). Le **pic** de chaque son est calé sur l'image, grâce à `public/sfx/_analyse.json` (champ `peak_t`).

### 2.3 Les 3 gestes signature (ce qui nous rend reconnaissables)

1. **« Le Glissé »** : la face cam rétrécit en carte de verre et glisse vers le médaillon en bas à droite, puis revient. C'est la transition entre « moi » et « l'écran », environ 25 fois par vidéo. *(inspiré de Sanji, sans rotation ou ≤ 5°, trajectoire courbe, ombre douce)*
2. **« Le Prompt décortiqué »** : le prompt sort de l'interface, se pose en grand sur le fond noir, et chaque partie s'allume en lime au moment où on la nomme, avec des étiquettes françaises (Rôle · Tâche · Format · Contraintes). *(inspiré de Swadia et Sanji, avec des libellés propres à Ibrahim)*
3. **« La Carte du tuto »** : un schéma de workflow en N blocs (les étapes, chacune avec le logo de l'outil utilisé). Il apparaît dans le hook, revient à chaque étape avec le bloc actif allumé, et son dernier bloc, le résultat, se révèle au climax. *(combine la pyramide de Martell AI, le tracker de Martell « Habits », les piliers de Swadia et le tableau de Sanji, en une seule carte maîtresse)*

---

## 3. Structure d'une vidéo (tuto de 8 à 15 min)

### 3.1 La timeline type

| Moment | Contenu | Type | Densité (plans) | Éléments |
|---|---|---|---|---|
| **0:00–0:05** | **Le résultat réel**, plein écran, avec la phrase-choc d'Ibrahim | P | 2 à 3 plans | `[PROOF-OPEN]`, sans musique, puis `[REVEAL]` sur le chiffre ou le mot-clé |
| 0:05–0:15 | Face cam, promesse en une phrase + tension (doute, enjeu, « sans coder ») | E | 4 à 6 | `[FAUX-MULTICAM]`, `[KCAP]` sur la phrase-thèse, musique qui entre |
| 0:15–0:35 | **La Carte du tuto** (sommaire en N étapes + prérequis : outil, prix, temps) | T | 8 à 12 | `[TUTO-MAP]` construite étape par étape, logos des outils |
| 0:35–0:60 | Teaser des moments forts (1 s chacun, sans contexte) + boucle ouverte (« à la fin, je te montre… ») | T | 10 à 15 | `[TEASER]`, pastille « À venir » |
| 0:60 | Étape 1 | A | — | `[STEP-CARD]` (carton d'étape + tracker) |
| ~2:30–3:00 | **Re-engagement n°1** : premier résultat intermédiaire spectaculaire | P | — | `[SHOWCASE]` + `[REVEAL]` |
| Après l'étape 2 | CTA ou sponsor **lié au problème qu'on vient de résoudre**, démontré, ≤ 30 s | S | — | `[CTA-DEMO]` |
| ~6:00 (ou 2/3) | **Re-engagement n°2** : l'amélioration la plus visuelle ou le moment wow | P | Plan tenu 5 à 15 s | Respiration avant, puis `[REVEAL]` |
| Dernier tiers | Étapes finales **sans ralentir** ; « la dernière étape, c'est celle que 90 % sautent » | A | Montante | `[STEP-CARD]`, densité maintenue |
| Fin | Résultat final complet → récap de 10 s (la Carte entièrement allumée) → **renvoi vers une autre vidéo** dans les 20 dernières secondes, sans « au revoir » | P/S | Montante | `[TUTO-MAP]` complète, `[NEXT-VIDEO]` |

Événements majeurs (wow, révélation, nouvelle étape) **à ~25 %, 50 % et 65 %** de la durée. Interruption de motif majeure toutes les 60 à 90 s.

### 3.2 Les 60 premières secondes : le test

On regarde la minute **sur un téléphone, son coupé, bras tendu**, et on se pose 3 questions :
1. Je comprends la promesse ?
2. Je vois le résultat ou un chiffre ?
3. Quelque chose change au moins toutes les 3 secondes ?

Trois « oui », la minute est bonne. Un seul « non », on la remonte. La minute d'ouverture se monte **en dernier**, avec un budget de temps disproportionné.

### 3.3 La vague visuelle (ouverture et relances)

Le cycle : action de 0 à 3 s, réaction de 3 à 6 s, respiration de 6 à 9 s, puis on repart. Ça évite l'effet mitraillette, qui fatigue autant que la monotonie.

---

## 4. Grammaire de montage par type de séquence

### 4.1 Face caméra (intro, explications « pourquoi », réactions, outro)

| ID | Élément | Réglages |
|---|---|---|
| `[FAUX-MULTICAM]` | 3 cadrages tirés d'un plan unique : **Large** 100 % · **Serré** 113–116 % centré visage · **Décalé** 110–115 %, visage sur un tiers (pour poser un panneau de l'autre côté) | Coupe **uniquement dans une pause de voix** (Whisper). Changement toutes les 3 à 8 s. Zoom max ~1,16 en 1080p, ~2,0 en 4K. |
| `[PUSH-IN]` | Zoom progressif sur ~1 plan sur 5 : lent (+4 à +8 % sur 5 à 8 s) sur les phrases-thèses ; plus marqué (+8 à +10 % sur 2 s) seulement dans les 30 premières secondes | `inOut(quad)`, à-coup max mesuré < 0,05 %/frame. Parfois un léger dézoom (−3 %) pour varier. |
| `[KCAP]` | Sous-titre cinétique **seulement sur la phrase-clé** (1 ou 2 par chapitre), mot par mot, mots-clés en `ACCENT_LIGHT` | 84 px, bas-centre, ombre. Temps de lecture (règle 9). **Jamais sur une capture d'écran.** |
| `[KEYLINE]` | Phrase-clé flottante (2 à 6 mots) dans l'espace vide à côté du visage, côté choisi selon la position du visage | Avec `[FAUX-MULTICAM]` « Décalé ». Alterne gauche/droite pour les énumérations. |
| `[UNDERLINE]` | Trait `ACCENT` qui se dessine sous les mots-clés à la fin de la phrase | + `click_box_check` |
| `[GLASS-LIST]` | Liste en verre à droite (visage décalé à gauche), qui se construit au rythme de la voix. Cumulative : elle revient avec un item de plus à chaque retour. | Coches `ACCENT` ou vertes, sortie en glissement vers la droite |
| `[STAT]` | Chiffre héros ou compteur qui défile (roulette en ease-out) avec une ligne de contexte minuscule (« jour 3 sur 7 », « coût total ») | Le compteur ralentit puis se fige, + `[REVEAL]` (son). Tenu ≥ 3 s. |
| `[FLOW-LINE]` | Processus en 3 étapes dessiné par un fil lumineux dans l'espace vide (« contacter → attendre → négocier ») | Dessin du trait 0,6 s par segment, libellés en flou → net *(inspiré de Sanji)* |
| `[SELF-BROLL]` | B-roll réel d'Ibrahim : il tape sur son ordi, il est au téléphone, en coulisses | Prouve qu'il fait vraiment les manipulations. À tourner une fois, à réutiliser. |

**Retour face cam** : toutes les 60 à 120 s de démo, pour le « pourquoi », une mise en garde, une réaction ou une transition d'étape.

### 4.2 Démo d'écran (cœur des tutos : ~85 % du temps)

**La séquence de base `[SCREEN-STAGE]`, à chaque entrée dans un écran :**
1. **Entrée par « Le Glissé »** (`[GLIDE]`) : la face cam devient médaillon et révèle l'écran.
2. **Plan d'établissement** de 1 à 2 s : fenêtre de l'app entière (coins arrondis, ombre douce) à 65–75 % de la largeur, posée sur l'aurora, avec une légère dérive (+3 %).
3. **Plongée** vers la zone d'action : ×1,6 à ×2,2 en **0,5 à 0,8 s, ease-in-out**, flou de mouvement léger.
4. **Tenue** d'au moins 1,5 à 2 s. Suivi par paliers : quand l'action se déplace, panoramique doux de 0,5 s plutôt qu'un dézoom suivi d'un rezoom. Les clics proches (moins de 1,5 s, même zone) sont fusionnés.
5. **Réorientation** : à chaque nouvel écran ou nouvelle étape, dézoom de 1 à 2 s vers la vue large, puis on replonge.

| ID | Élément | Réglages |
|---|---|---|
| `[PIP]` | Médaillon webcam : carré arrondi (rayon ~12 %), **18 à 22 % de la largeur**, en bas à droite, cadre verre | **Se rétracte** pendant les manipulations denses, `[PROMPT-CARD]` et `[SPOTLIGHT]`. **Évite** la zone zoomée (déplacement automatique). **S'agrandit** jusqu'à ~35 % quand Ibrahim réagit à un résultat. |
| `[SPOTLIGHT]` | Assombrissement du reste de l'écran (opacité 45 à 60 %) autour d'un rectangle arrondi, avec halo `ACCENT` et micro-zoom ×1,05 | 1,5 à 3 s, 1 à 3 fois par minute au maximum. **Remplace** flèches et cercles. |
| `[PROMPT-CARD]` | **« Le Prompt décortiqué »** : prompt recréé en HTML sur le fond v2 (carte verre, étiquette de l'outil). Le texte s'écrit au rythme de la voix (ou s'affiche d'un coup s'il est long). Chaque partie s'allume en `LIME` au moment où elle est nommée, avec une rangée d'étiquettes françaises au-dessus. | Durée de lecture : un prompt de 40 mots demande ~16 s. Sinon : « prompt complet en description », avec le badge `[COPY-BADGE]`. |
| `[RECREATE]` | Recréation en grand de tout texte trop petit : réponse de l'IA, réglage, commentaire, message d'erreur | Carte verre, ≥ 44 px. Un élément à la fois, tenu 3 à 5 s. |
| `[HIGHLIGHT]` | Surligneur `ACCENT` (opacité ~35 %) qui balaie une ligne de la réponse de gauche à droite (0,3 s par ligne), synchronisé avec la voix ; le reste passe à ~30 % d'opacité | *(Martell, Sanji)* |
| `[GEN-WAIT]` | Attente compressée. Moins de 10 s : accélérée ×4 à ×8. Plus de 10 s : jump cuts toutes les ~1 s sur les étapes visibles du log, plus un **push-in continu** jusqu'à ×2,5, plus le badge `⏩ 3 min 20 de génération` | La voix continue d'expliquer. On n'attend jamais en silence. |
| `[SHOWCASE]` | Le résultat généré est **sorti de l'interface** et posé en grand sur l'aurora : images en cartes, carrousel pour les séries, vidéo 9:16 centrée avec son propre son | Après chaque génération. C'est la récompense de l'étape. + `[REVEAL]`. |
| `[CURSOR]` | Curseur agrandi ×1,5 à 2 et lissé, anneau de clic `ACCENT` (~250 ms) + `click_*` | Masqué s'il reste immobile plus de 2 s |
| `[SCROLL-FAST]` | Long document parcouru en accéléré (flou vertical), avec une tenue de 1 à 2 s sur chaque section nommée | *(Sanji : 28 pages en 10 s)* |
| `[BLUR-DATA]` | Floutage de l'e-mail, des clés API, soldes, onglets et notifications, ou recadrage serré si c'est plus propre | Vérifié à la passe de relecture 4 |
| `[CAUTION]` | Moment « attention ici » : on ralentit volontairement (zoom tenu 3 à 4 s), pastille ⚠️, musique coupée | 3 ou 4 fois par vidéo au maximum, sur la clé API, un réglage caché ou une commande |
| `[STEP-LT]` | Pastille numérotée + intitulé (« 2 · Connecte ton compte ») en bas à gauche **pendant la démo**, qui survit aux coupes | Version légère du carton d'étape, pour les sous-étapes *(Martell « Habits »)* |

### 4.3 Transitions et structure

| ID | Élément | Réglages |
|---|---|---|
| `[GLIDE]` | **Le Glissé**, face cam ↔ médaillon (voir §2.3) | ~1 s, spring amorti, + `pop_*` léger. **La** transition par défaut entre face cam et écran. |
| `[STEP-CARD]` | Carton d'étape plein écran : un volet aurora monte du bas (0,4 s), « Étape 3/5 » + titre de 3 mots + **la Carte du tuto** avec le bloc actif allumé et une barre de progression | ≤ 2,5 s au total. + `swoosh_vacuum` (pic calé sur le volet) + jingle d'étape. Généré depuis le JSON des étapes : un libellé erroné est impossible. |
| `[TUTO-MAP]` | **La Carte du tuto** : N blocs reliés (workflow), chaque bloc avec le logo de l'outil et un livrable. Construite dans le hook, rappelée à chaque étape, complète à la fin. | Composant unique, état `activeIndex` |
| `[CHAPTER-PILL]` | Pastille permanente en haut à gauche sur la face cam : « Étape 2/5 · Générer les visuels », avec une mini-barre segmentée | ≥ 40 px. Masquée pendant les plans écran (où `[STEP-LT]` prend le relais). |
| `[TEASER]` | « À venir » : 3 ou 4 fragments d'une seconde des moments forts, avec une pastille « À venir » | Dans les 35 à 60 premières secondes uniquement |
| `[BRIDGE]` | Phrase-pont récapitulative avant chaque étape : « Ton X est prêt, maintenant il faut Y. Étape N. » | Au script. Le carton se cale **automatiquement** sur le mot « étape » du transcript. |
| `[CHECKLIST]` | Sous-étapes en pastilles qui se cochent à chaque retour (✓ + libellé court) ; les suivantes restent numérotées (boucle ouverte) | + `click_box_check` à chaque coche *(Martell « Habits » : bulles 1-2-3-4)* |
| `[WHIP]` | Transition rapide par flou directionnel (0,3 s), seulement pour un changement de lieu ou de format | Une à deux fois par vidéo |

### 4.4 Preuve et résultats (make money)

| ID | Élément | Réglages |
|---|---|---|
| `[PROOF-OPEN]` | Ouverture sur le résultat réel : jeu sur téléphone, dashboard, chiffre. Si c'est un chiffre, `[STAT]` en roulette, très grand. | Sans musique les 3 premières secondes (la preuve arrive « nue »), puis la musique entre |
| `[PROOF-3T]` | La preuve en 3 temps : (1) **plan continu conservé** (navigation dans l'app, sans coupe = rien de fabriqué) → (2) zoom progressif sur le montant → (3) gros plan fixe + chiffre incrusté en grand | **Toujours une capture réelle**, même partiellement floutée. Jamais uniquement un graphique recréé (faiblesse de Sanji). |
| `[LEDGER]` | Bilan chiffré « calculette » : chaque poste entre au centre puis se range en colonne, le total se calcule, les traits passent sous les totaux | **Cohérence au centime** vérifiée automatiquement : les montants viennent d'un JSON unique |
| `[SCREEN-TRUTH]` | **En cas d'écart entre un chiffre dit à l'oral et celui affiché dans l'interface, l'écran fait foi** (consigne d'Ibrahim). On affiche et on incruste la valeur de l'écran, sans poser la question. | Pas d'incrustation qui contredise l'interface |
| `[TILT-DOC]` | Source (article, rapport, page officielle) en carte légèrement inclinée sur l'aurora, phrase-clé surlignée, puis le chiffre en compteur | 1 à 2 s sur le document, puis `[STAT]` |
| `[ENGAGEMENT]` | Compteurs réels (vues, abonnés, ventes) zoomés au curseur dans l'interface native, commentaires réels **recréés en grand** | Captures natives = preuve sociale |

### 4.5 Storytelling et illustration

| ID | Élément | Réglages |
|---|---|---|
| `[STORY-ILLU]` | Anecdotes et métaphores illustrées par des **images IA d'un style maison unique**, toujours le même (proposition : trait encre + une seule couleur `ACCENT`). On peut partir d'une vraie photo d'Ibrahim (img2img). | Le style IA signifie « récit / passé / idée » ; le réel signifie « maintenant / preuve » *(Martell « Habits »)* |
| `[STORY-BED]` | Une seule nappe musicale un peu plus présente sous une histoire personnelle (−30 dB sous la voix) | Une fois par vidéo au maximum |
| `[AI-LABEL]` | Tout visuel ou toute voix IA est annoncé comme tel (pastille « Généré par IA ») | Crédibilité, audience européenne |

### 4.6 Appels à l'action

| ID | Élément | Réglages |
|---|---|---|
| `[CTA-DEMO]` | CTA **démontré, pas annoncé** : on voit en 6 s le parcours exact (commenter « PROMPT », réponse auto, document reçu) sur un mockup téléphone ou navigateur | Placé après l'étape 2, lié au problème qu'elle vient de résoudre |
| `[COPY-BADGE]` | Badge « Prompt complet en description » ou « Copier » qui apparaît quand un prompt est terminé | Renvoie vers l'aimant à leads |
| `[NEXT-VIDEO]` | Renvoi vers une autre vidéo dans les 20 dernières secondes (« la suite logique, c'est… »), coupe sèche | Pas d'outro, pas d'écran de fin ajouté après le contenu |

---

## 5. Le son en détail

| Couche | Niveau cible | Comportement |
|---|---|---|
| **Voix** | −16 LUFS après traitement (master final −14 LUFS) | Chaîne validée par Ibrahim (AIsa, test A/B/C/D) : **débruitage IA DeepFilterNet doux** (`atten_lim_db=12`, venv `analysis/.venv-df`, Python 3.11) → passe-haut 70 Hz → compression 2:1 légère → normalisation −16 LUFS en 2 passes. **Jamais `afftdn`** (artefacts métalliques, voix jugée dégradée). Les sources arrivent souvent très basses (MINIMAX −26,6 LUFS, AIsa −30,5 LUFS) : à surveiller à chaque vidéo. |
| **Musique sous la voix** | **12 à 14 dB sous la voix (≈ −29 LUFS)** — retour Ibrahim : 19 dB sous la voix était inaudible | Descend automatiquement dès qu'Ibrahim parle (ducking). Plus basse encore (−25 dB) pendant les explications denses. |
| **Musique sans voix** | 12 à 14 dB sous le niveau de voix | Remonte pendant les montages de résultat, `[GEN-WAIT]` et les cartons d'étape |
| **Silence musical** | — | Les 3 premières secondes (preuve nue), juste avant le verdict et le moment wow, et pendant `[CAUTION]`. Le contraste vaut n'importe quel effet. |
| **Effets sonores** | Calculés par rapport à la voix p90 : pop −9 dB, clic −12 dB, impact −4 dB | Un effet = un événement porteur de sens. Jamais 2 dans la même seconde. Jamais sur un mot de la voix (décalé de 100 à 200 ms). Pic calé sur l'image. |
| **Ambiance de pièce** | Le plus bas | Placée sous les jump cuts pour éviter les micro-silences |

**Placement observé chez les références (à reproduire) :**
- Les gros whooshs signalent les **changements de niveau** (chapitre, volet, insert).
- Les pops valident **chaque élément qui apparaît**.
- Les clics accompagnent les **actions dans l'interface**.
- Aucune des 4 vidéos n'utilise d'impact sur les mots-clés après le hook : l'emphase passe par l'image.

**Musique :**
- Le style : lo-fi, chill-tech ou ambient, **sans voix**, tempo stable de 90 à 115 BPM.
- On change de morceau ou de couche aux grands chapitres.
- Les 4 références montrent deux écoles. Martell et Swadia n'utilisent presque pas de musique (stings seulement). Sanji met une nappe à 30 dB sous la voix 60 % du temps. **Notre choix** : une nappe très basse (Ibrahim veut de la musique), qui s'efface sous les explications denses, plus des stings ou le jingle aux étapes.

---

### 5bis. L'identité sonore propre à chaque vidéo (règle d'Ibrahim, 4 octobre 2026)

**Principe :** chaque vidéo a **sa propre identité sonore**, construite à partir de son transcript. Chaque partie (intro, puis chaque chapitre ou étape) a **sa propre musique de fond**. L'ensemble reste cohérent : même famille de styles, transitions soignées. On ne réutilise donc pas les mêmes musiques d'une vidéo à l'autre. La **signature de chaîne** (son de révélation, jingle d'étape, sons d'interface) reste constante pour la reconnaissance.

**Le style d'Ibrahim : sérieux.** Ibrahim est un personnage sérieux, la musique doit le porter.

| ✅ Familles autorisées | ❌ À proscrire |
|---|---|
| Suspense minimal (pulsations, tension retenue) | Dubstep, EDM, drops |
| Enquête / « investigation » (basses pulsées, textures sombres) | House, deep house, trance, « chill beats » |
| Documentaire / néo-classique (piano, cordes, sobre) | Pop entraînante, ukulélé « corporate happy » |
| Cinématique minimal / hybride sobre (montées, sans percussions épiques) | Trap, hip-hop énergique |
| Dark ambient / drones (respirations, moments de révélation) | Tout morceau avec voix ou paroles |
| Électronique minimale, sérieuse (IDM lente, textures tech) | Orchestral épique massif (couvre la voix) |

**Méthode (à l'étape 4, « Plan de montage »)** : produire une **fiche identité sonore** dans `montages/<slug>/04-identite-sonore.md`.
1. **Arc émotionnel par partie**, lu dans le transcript : pour chaque chapitre, son rôle (tension, curiosité, méthode, révélation, climax) et son énergie (1 à 5).
2. **Une musique par partie**, choisie dans les familles autorisées, avec un rôle clair : par exemple hook en suspense minimal, mise en place en électronique sérieuse discrète, révélation en néo-classique ou cinématique, climax en suspense montant.
3. **Cohérence** : tempos voisins (±15 BPM entre parties consécutives), tonalités compatibles si possible, énergie qui suit l'arc (jamais de baisse dans le dernier tiers, règle 11).
4. **Transitions** : fondu enchaîné de 1 à 2 s **sous le carton d'étape** (le jingle d'étape couvre la jonction).
5. **Effets sonores** : le **noyau signature** est constant (révélation, porte de chapitre, validation, interface). On peut y ajouter 1 ou 2 accents propres à la vidéo (texture liée au sujet).
6. **Source** : Epidemic Sound (abonnement Creator d'Ibrahim, chaîne sur liste blanche). Présélection par Claude via le compte d'Ibrahim, écoute et choix par Ibrahim sur une page d'écoute, mixés sous sa voix.

## 6. Rythme : les chiffres de référence

| Type de segment | Durée de plan | Densité | Pourquoi |
|---|---|---|---|
| Hook (0–60 s) | 1 à 3 s | Très haute (30 à 40 plans par minute) | Prouver l'énergie tout de suite |
| Action / démo | 2 à 5 s, ou un plan écran plus long animé de l'intérieur toutes les 2 à 4 s | Haute | Entraîner |
| Explication | 4 à 8 s | Moyenne, avec un changement visuel toutes les 15 à 20 s | Laisser comprendre |
| Moment wow / résultat | 5 à 15 s, plan tenu | Basse | Laisser l'émotion exister |
| Verdict / bilan | 2 à 6 s | Montante | Construire vers le chiffre |

| Cadence | Valeur |
|---|---|
| Micro-changement (mouvement, texte, son, cadrage) | Toutes les ~3 s en face cam, toutes les 5 à 12 s en démo |
| Insert ou changement d'axe | Toutes les 15 à 30 s |
| Bascule face cam plein écran pendant les démos | Toutes les 60 à 120 s |
| Interruption de motif majeure | Toutes les 60 à 90 s |
| Événements majeurs | À ~25 %, 50 % et 65 % de la durée |
| Durée d'un texte | `max(1,2 s ; nb_mots / 2,5 + 0,5 s)` + sortie de 0,35 s |
| Silences entre phrases | Ramenés à 0,15–0,35 s (sauf la respiration de 1 à 2 s après un résultat) |

*Mesures des références :*

| Vidéo | Coupes | Plan médian | Débit | Face cam |
|---|---|---|---|---|
| Martell AI | 14,7 / min | 3,1 s | 197 mots/min | — |
| Martell « Habits » | 1 toutes les 5,5 s | — | — | — |
| Swadia | 1 toutes les 4,0 s | 2,8 s | — | 60 % |
| Sanji | 1 toutes les 5,2 s | — | — | ~25 à 30 % |

---

### 6bis. Vitesse finale ×1,15 (choix d'Ibrahim, 4 octobre 2026)

Ibrahim a comparé ×1,00, ×1,10 et ×1,15 sur le hook et sur une démo : il préfère **nettement ×1,15**.

- **Où** : à la toute fin de l'étape 7, sur la vidéo assemblée. Images `setpts=PTS/1.15` et son `atempo=1.15` (la voix garde sa hauteur), puis master −14 LUFS en 2 passes. Une 21:41 devient une 18:52.
- **Conséquence au montage** : tous les temps de lecture se calculent pour la vitesse finale. Un texte tenu `readTime(mots) × 1,15` à ×1,00 reste lisible une fois accéléré.
- **Livrables** : sous-titres et chapitres divisés par 1,15 (`*_x1.15.srt`, `chapitres_x1.15.txt`, `description_x1.15.md`). On garde aussi la version ×1,00.
- **Sponsor** : une démonstration sponsorisée accélérée enfreint la règle 13 et le §1bis. Avant de publier en ×1,15 une vidéo sponsorisée, Ibrahim valide avec le sponsor. Sinon, on n'accélère que les passages hors démo.

## 7. La restructuration (méthode de l'étape 2 du process)

**Objectif :** réorganiser une vidéo déjà tournée pour améliorer la rétention, sans changer son sens et en la gardant compréhensible. On produit des **propositions**, qu'Ibrahim valide avant toute action (étape 2 du §8). Le résultat propre à chaque vidéo est écrit dans `montages/<slug>/02-restructuration.md`.

**Contrainte sponsor (§1bis) :** sur une vidéo sponsorisée, les démonstrations du produit ne sont ni coupées, ni accélérées, ni déplacées. La restructuration agit alors sur le hook, les ajouts entre les démonstrations (cartons, teasers, showcases), les boucles ouvertes et la fin.

**Méthode (automatisée à partir du transcript horodaté) :**

1. **Découper** le transcript en *beats* : chaque beat reçoit un type (A action · E explication · P preuve/résultat · R réaction · C contexte · S CTA) et ses dépendances (« nécessite l'étape 2 »).
2. **Repérer les 4 matériaux de hook :**
   - (a) le résultat final qui fonctionne ;
   - (b) la réaction la plus forte ;
   - (c) la phrase la plus intrigante ou la plus chiffrée (« 15 minutes », « 0 ligne de code ») ;
   - (d) le moment où quelque chose casse ou surprend.
3. **Proposer le cold open :** (a) + une phrase de (b) ou (c), en 5 à 10 s. Puis la promesse originale. Le résultat complet reste à sa place chronologique (on n'en montre que 3 à 6 s au début, sinon plus de raison de rester).
4. **Proposer les boucles ouvertes :** une phrase d'une étape ultérieure insérée en teaser à la fin d'un chapitre précédent.
5. **Détecter les problèmes :**
   - deux E consécutifs, ou une explication de plus de 60 s, donc une action ou une réaction à intercaler ;
   - une répétition, dont on garde la version la plus courte ;
   - une digression, à couper ;
   - le dernier tiers trop lent ;
   - « comme tu as vu » après un déplacement, à corriger.
6. **Règles de sécurité :**
   - on ne déplace **jamais une étape** du tuto, seulement les résultats, réactions et contextes ;
   - après chaque saut, on réoriente (plan large et carton) ;
   - on vérifie la continuité visuelle (médaillon, thème de l'interface, onglets).
7. **Livrable :** un tableau « avant → après » (timecodes, raison, gain attendu, risque), la timeline cible et les chapitres YouTube recalculés.

*(Exemple appliqué : MINIMAX, `montages/minimax/02-restructuration.md`.)*

---

## 8. Le process pas à pas (obligatoire pour chaque vidéo)

**Principe :** 10 étapes. Chacune produit un **livrable** et se termine par une **validation d'Ibrahim** (🔒). Tant que la validation n'est pas donnée, on ne passe pas à l'étape suivante. Avant chaque étape lourde, Claude annonce une **estimation de tokens et de temps**.

**Ordre :**
- on monte l'audio avant l'image (checklist) ;
- on valide le style sur un prototype court avant de produire en volume ;
- la première minute est **re-finalisée en dernier**.

**Dossier de travail par vidéo :** `montages/<slug>/` avec :
- `00-brief.md`
- `01-analyse.md`
- `02-restructuration.md`
- `03-audio/`
- `04-plan.md` + `edit-plan.json`
- `05-hook/`
- `06-blocs/`
- `07-final/`
- `registre.md`

Les composants réutilisables sont dans `src/montage/`.

| # | Étape | Ce que fait Claude | Livrable remis à Ibrahim | 🔒 Ce qu'Ibrahim valide |
|---|---|---|---|---|
| **0** | **Réception et brief** | Inventaire des fichiers : face cam, captures, pistes séparées ?, audio, résolution, débit, fps. Questions de cadrage. | `00-brief.md` : ce qui est reçu, ce qui manque, et le questionnaire : **sponsor ? points imposés ? segments intouchables ?** titre et miniature (la promesse) · liste des étapes du tuto · vidéo vers laquelle renvoyer · captures de preuve disponibles · ressources à mettre en description | Les réponses au questionnaire et la liste des segments intouchables |
| **1** | **Analyse** | Transcription Whisper mot par mot, typage des beats (A/E/P/R/C/S), mesures (visage, pauses, niveaux LUFS, qualité image), repérage des matériaux de hook, des preuves, des pièges et des digressions | `01-analyse.md` : la carte de la vidéo (beats, timecodes, durées), le diagnostic (problèmes de rythme, d'audio, de lisibilité) et les points forts | Le diagnostic (« oui, c'est bien ma vidéo, ces problèmes sont réels ») |
| **2** | **Restructuration** (§7) | Propositions avant → après dans le respect du §1bis : cold open, Carte du tuto, teasers et boucles, ajouts entre démonstrations, coupes hors sponsor, fin | `02-restructuration.md` : tableau des actions (raison, gain, risque), timeline cible, chapitres YouTube provisoires | Chaque action, une par une (oui / non / modifié) |
| **3** | **Montage audio** (la colonne vertébrale) | Application des coupes et déplacements validés. Traitement voix (passe-haut, compression, −16 LUFS), ambiance sous les coupes, silences ramenés à 0,15–0,35 s (hors démonstrations sponsorisées). **Pas encore d'image retravaillée.** | `03-audio/` : la vidéo réordonnée en basse définition avec l'audio traité. « Si elle tient à l'écoute, elle tiendra à l'image. » | L'écoute de bout en bout : ordre, coupes, qualité de la voix |
| **4** | **Plan de montage** | Pour chaque segment : cadrages et zooms, écrans (points focaux, spotlights), **tous les textes à l'écran mot pour mot**, cartons d'étape, Carte du tuto, inserts, SFX (fichier et instant), musique (morceaux et niveaux), preuves (montants vérifiés). Contrôle des cadences (§6) et des règles (§1). | `04-plan.md` : tableau lisible, chapitre par chapitre, avec les textes exacts (orthographe à valider ici) + `edit-plan.json` | Les choix d'habillage, **l'orthographe de chaque texte**, les morceaux de musique |
| **5** | **Prototype : les 60 premières secondes** | Rendu complet (image + son + master) de la première minute, au style final | `05-hook/` : la vidéo de 60 s + la planche de vérification | Le **style** (couleurs, typo, zooms, sons, rythme). C'est la porte la plus importante : une fois validé, le style ne change plus pour le reste. |
| **6** | **Production par blocs** | Rendu bloc par bloc (un chapitre, 1 à 3 min). Avant chaque envoi : mesure de fluidité (à-coups de zoom), vérification du temps de lecture des textes, contrôle visuel des planches. | `06-blocs/bloc-N.mp4`, un par un | **Chaque bloc**. Les retours sur un bloc s'appliquent aux suivants. |
| **7** | **Assemblage et finitions** | Assemblage, raccords entre blocs, **re-finalisation de la première minute** (montée en dernier, avec tout ce qu'on sait du reste), master −14 LUFS / −1 dBTP, relecture automatique en 4 passes (§9) | `07-final/` : vidéo complète + rapport de relecture (ce qui passe, ce qui a été corrigé) | Le visionnage complet, **sur téléphone** puis au casque |
| **8** | **Export et livrables** | Export final (1080p ou 4K, débit élevé, AAC 48 kHz), chapitres YouTube définitifs, sous-titres `.srt` (noms propres corrigés, noms de famille de tiers retirés), liste de 3 ou 4 moments candidats pour des Shorts, et **les ressources de la description** (§8bis) | `08-livrables/` : `chapitres.txt` + `.srt` + `shorts.md` + `description.md` + `ressources/` | Le « bon pour publication » et la liste des ressources |
| **9** | **Boucle d'apprentissage** (72 h après publication) | Lecture de la courbe de rétention fournie par Ibrahim (capture d'écran ou chiffres) : chute à 30 s, 3 décrochages, pic | Une ligne ajoutée à `analysis/registre.md` + une proposition d'ajustement du playbook | Les ajustements du playbook (§11) |

**Règles du process :**
- **Une étape = une validation.** Si Ibrahim demande des changements, on corrige et on renvoie le livrable de la même étape. On n'avance pas « en parallèle » sur l'étape suivante.
- **Les retours se capitalisent.** Tout retour qui vaut pour les vidéos futures est ajouté au playbook (et à la mémoire). Par exemple : « textes trop rapides » est devenu la règle 9.
- **Le coût est annoncé.** Avant les étapes 1, 5, 6 et 7, Claude donne une estimation (tokens et temps).
- **Fichiers source :**
  - pistes séparées (face cam, écran sans médaillon, audio) ;
  - face cam en 4K si possible ;
  - export d'au moins 20 Mbit/s ;
  - voix enregistrée assez fort.

  Sinon, on signale à l'étape 0 ce que ça empêche (exemple : avec une vidéo fusionnée, pas de « Glissé » ni de médaillon qui s'efface).
- **Étapes techniques internes** (sans validation séparée) : traitement voix, détection des pauses, calcul des gains SFX par rapport à la voix, mesure de fluidité, rendu, master audio en 2 passes.
- **Rendu** : toujours via `analysis/tools/render_montage.sh <Composition> <sortie.mp4> [images]`. Réglages validés le 4 octobre 2026 : GPU + JPEG 95 + 3 rendus parallèles, CRF 12, puis master −14 LUFS. Gain mesuré de −46 % à image équivalente (`analysis/bench/RAPPORT.md`). **Avant tout rendu de plus de ~5 min, annoncer la durée et attendre le feu vert d'Ibrahim** : il travaille sur la même machine.

### 8bis. Les ressources de la description (règle d'Ibrahim, 4 octobre 2026)

**But :** quelqu'un qui veut reproduire le tutoriel trouve tout dans la description, **sans réfléchir ni retaper quoi que ce soit**.

**Méthode (étape 8) :**
1. Relire tout le transcript et repérer chaque élément réutilisable :
   - les prompts donnés à l'outil ;
   - les réglages (modèle, effort, mode) ;
   - les liens et outils cités ;
   - les fichiers produits (CSV, PDF, modèles) ;
   - les coûts constatés ;
   - les étapes d'installation ;
   - tout ce qui a été dit comme « je le mets en description » ou « tu pourras le copier ».
2. **Les prompts sont recopiés mot pour mot depuis l'écran** (règle `[SCREEN-TRUTH]`), jamais depuis la voix. On rogne la capture sur la zone du prompt pour le lire en entier. Si le prompt exact n'est pas visible à l'écran, on écrit une version prête à l'emploi et on le signale.
3. Pour chaque prompt, on fournit **deux versions** : celle de la vidéo, et une version à adapter, avec des [CROCHETS] à remplir pour son propre cas.
4. On ajoute ce qui fait gagner du temps au spectateur :
   - checklist d'installation ;
   - modèles de messages (e-mail, LinkedIn) ;
   - modèles de fichiers ;
   - mini e-book ou guide si le sujet le demande.
   Tout est généré par Claude, en fonction de la vidéo.
5. On écrit `description.md` :
   - accroche ;
   - lien sponsor ;
   - lien vers les ressources ;
   - les prompts courts en clair ;
   - les chapitres ;
   - les outils utilisés ;
   - les coûts réels ;
   - un appel à commenter.
   Les liens inconnus restent entre [CROCHETS], à compléter par Ibrahim.
6. Livrables : `montages/<slug>/08-livrables/ressources/` (un fichier par ressource, numérotés dans l'ordre de la vidéo) et `description.md`. Ibrahim valide la liste et choisit où les héberger (description, Google Drive, son espace membre).

Exemple de référence : `montages/aisa/08-livrables/` contient 5 prompts, les messages de prospection et la checklist.

## 9. Relecture (4 passes, dont une partie automatisée)

| Passe | Contrôles | Automatique ? |
|---|---|---|
| **1. Rythme** (en accéléré, son coupé) | Aucune plage identique > 10 s · densité variable · pas de ralentissement dans le dernier tiers · cartons d'étape présents et espacés | Oui : mesure des plans et des changements visuels |
| **2. Structure** | Preuve avant 5 s · Carte du tuto avant 35 s · re-engagement vers 3 min · pas d'E→E · boucles refermées · chapitres YouTube = chapitres visuels | Partiellement : typage des beats |
| **3. Son** (casque puis haut-parleur de téléphone) | Rien plus fort que la voix · pas de trou d'ambiance · musique qui descend sous la parole · −14 LUFS / −1 dBTP | Oui pour les niveaux. L'écoute finale reste celle d'Ibrahim. |
| **4. Lisibilité** (téléphone, bras tendu) | Textes ≥ 44 px · chaque texte tenu assez longtemps · écrans lisibles · aucune donnée perso · rien dans les zones d'interface YouTube | Oui pour tailles et durées. Contrôle visuel des planches. |
| **+ Fluidité** | À-coup de zoom < 0,05 %/frame · aucune coupe en plein mot · aucune sortie brutale | Oui (mesure ORB sur le rendu) |
| **+ Orthographe** | Tous les textes à l'écran relus (coquille vue chez Swadia : « deletage ») | Oui, puis Ibrahim |

---

## 10. Ce qu'on ne fait jamais

- Générique de chaîne, « salut c'est Ibrahim » avant la preuve, fondu au noir, outro lente.
- Plan écran brut et entier pendant plus de 2 s. Plan de 30 s sans recadrage (Swadia 13:37).
- Flèches ou cercles rouges, néon, flammes sur l'interface, confettis, points d'interrogation flottants, stickers.
- Sous-titres karaoké sur une capture d'écran.
- Chiffres recréés sans capture réelle, ou incohérents (Sanji : 154 contre 140 ventes, trois totaux différents).
- Couper, accélérer, déplacer ou masquer une démonstration sponsorisée (§1bis).
- Archives ou extraits d'autres créateurs sans droits (Martell : F1, Taylor Swift ; Sanji : autres YouTubers).
- Cartons dupliqués à la main (Martell : libellé de l'habitude 7 sur la 8). Chez nous, tout est généré depuis les données.
- Musique sur les 3 premières secondes. Effet sonore sur un mot. Voix trop basse.
- Laisser visible ce qui n'est pas destiné au spectateur. Ça se vérifie sur la planche de l'écran, bloc par bloc. Quatre cas :
  - les notes de tournage (script, « PROMPT À COLLER », description préparée) ;
  - le Launchpad ou le Dock ;
  - un chemin de fichier avec le nom d'utilisateur ;
  - l'historique ou les sessions d'autres projets.
- Afficher des données de tiers : noms et e-mails dans un CSV, profil LinkedIn, contacts trouvés par l'IA. On floute à l'image, et on retire les noms de famille des sous-titres.
- Lancer un rendu de plus de ~5 min sur le Mac d'Ibrahim sans son feu vert. Il travaille dessus.
- Masteriser chaque bloc puis les recoller. La bande son finale est reconstruite d'un seul tenant, puis masterisée une seule fois (§13).

---

## 11. La boucle d'apprentissage

72 h après publication, on relève sur la courbe de rétention, avec ce qui était à l'écran à chaque fois :
- la chute à 30 s (si > 40 %, le hook ne livre pas la promesse) ;
- les 3 décrochages les plus violents ;
- le pic le plus haut (le matériau à multiplier).

On tient **une ligne par vidéo** dans `analysis/registre.md` : décrochages, pics, décision pour la vidéo suivante. Les valeurs *(à calibrer)* de ce playbook (facteurs de zoom, cadences, niveaux de musique) seront ajustées à partir de ce registre. Au bout de 10 vidéos, il vaudra plus que n'importe quelle référence.

---

## 13. Production technique : le pipeline validé (vidéo AIsa, 4 octobre 2026)

Tout ce qui suit a été testé sur la vidéo AIsa (21:41, montée et livrée en une journée). On le refait tel quel.

### 13.1 Architecture Remotion
- **Une seule composition pour toute la vidéo** (`src/MontageAisa/Full.tsx`, modèle à copier) :
  - écrite en **temps absolus de la timeline** (helper `At from/to`) ;
  - une fonction `BlockN` par chapitre ;
  - le prototype de l'étape 5 est intégré en mode `embedded` (sans sa propre voix ni musique).
- **Voix** : un seul `Audio` pour toute la voix montée (`voice_full.wav`, issue de l'EDL de l'étape 3).
- **Musiques** : une `MusicTrack` par partie, avec des courbes de niveau en temps absolu et des fondus enchaînés sous les cartons.
- **SFX** : une liste `SFX_Bn` par bloc.
- **Correspondance source ↔ timeline** : lue dans `03-audio/edl_v2.json`. Chaque segment a un décalage constant ; chaque carton ou respiration de 2 s ajoute 2 s.
- **Écran et face cam** sont rendus en entier une fois :
  - `face_full_dn.mp4` (débruitage `hqdn3d=2:1.5:6:5`, CRF 14) ;
  - `screen_full.mp4` (copie sans audio) ;
  - même horloge que la source.

### 13.2 Méthode par bloc (environ 45 min de travail par bloc de 4–5 min)
1. **Transcript** du bloc avec les temps timeline, puis **planche de l'écran avec les temps exacts**. Une image toutes les 5–6 s, le temps écrit sur chaque vignette. Attention : un `drawtext` sur `t` après `fps` donne des temps faux. Il faut extraire chaque image à son temps.
2. **Images quadrillées** (grille de 100 px) pour relever les coordonnées des zones de zoom, des chiffres et des zones à flouter.
3. **Temps des mots** (Whisper) pour caler chaque élément sur la voix.
4. **Détection des fenêtres parasites** par différence d'images sur une zone (notes, Finder, Launchpad), pour obtenir les intervalles exacts à masquer.
5. Code, puis **12 images fixes de contrôle** rendues une par une. Jamais en parallèle sur le Mac : la mémoire sature.
6. Correction, puis rendu du bloc.

### 13.3 Pièges et règles de calcul
- **Blocage de caméra de `ScreenStage`** : dès que le zoom remplit l'écran, le centre demandé est ramené dans la fenêtre. Pour poser un cadre ou une légende sur l'écran (`Spotlight`), il faut calculer avec le **centre réel bloqué**, pas le centre demandé.
- **Médaillon** (`FacePip`, en bas à droite, x ≥ 1432, y ≥ 702) : il masque ce qui est dessous. On vérifie que les chiffres zoomés n'y tombent pas, et on décale le centre si besoin.
- **Flous** : `masks` dans `ScreenStage`, en coordonnées de la capture. Ils suivent la caméra. On prend une marge, car une ligne de tableau peut remonter au défilement.
- **Un élément qui commence avant la fin d'un bloc** (pastille du chapitre suivant…) impose de re-rendre ce bloc après coup.
- **Bande son** :
  - on ne fait pas de rendu audio seul de toute la timeline : plus de 30 min sur le Mac, abandonné ;
  - on reconstruit la bande son depuis l'audio brut de chaque bloc (`analysis/tools/build_soundtrack.py`) ;
  - on retire le retard de l'encodeur AAC, **2 048 échantillons au début de chaque bloc** ;
  - on vérifie l'alignement voix ↔ timeline par corrélation : il doit être de 0,0 ms.

### 13.4 Rendu
- **Réglages** : `analysis/tools/render_montage.sh`, soit GPU + JPEG 95 + 3 rendus en parallèle, CRF 12. Gain de −46 % mesuré (`analysis/bench/RAPPORT.md`).
- **Serveur loué**, scripts dans `analysis/cloud/` :
  - un serveur Ubuntu 24.04, clé SSH `~/.ssh/hetzner_remotion` ;
  - `setup_server.sh` une fois, puis `chain_blocs.sh <IP> bloc-N:début-fin …` ;
  - le rendu est **détaché** sur le serveur, avec `ServerAliveInterval` (la box coupe les connexions SSH muettes) ;
  - mesure sur le bloc 1 : CPX62 (16 vCPU) = 8 min, contre ~12 min pour le Mac optimisé ;
  - envoi des médias : ~5 min à 33 Mbit/s.
- **Assemblage** : `analysis/tools/assemble_final.sh`. Il contrôle le nombre d'images de chaque bloc, met les images bout à bout sans réencodage, pose la bande son, puis fait le master −14 LUFS en 2 passes.
- **Contrôles finaux** :
  - raccords entre blocs, en images avant/après ;
  - `blackdetect` et `freezedetect` : un gel de plus de 10 s se justifie ;
  - alignement voix ;
  - LUFS et pic.

### 13.5 Sous-titres
- `analysis/tools/make_srt.py`, à partir des mots Whisper et de l'EDL.
- Un fichier `corrections.json` par vidéo : marques mal transcrites (ChargeGPT → ChatGPT, cloud code → Claude Code, aissa → AIsa, SameRush → Semrush…) et noms de famille de tiers retirés.
- 2 lignes de 42 caractères au plus, 6 s au plus.
- Pas de coupure sur une apostrophe ni au milieu d'un nombre (espace insécable).

## 12. Feuille de route : composants à construire

**Construits et validés (identité v2, 4 octobre 2026)** :
- dans `src/montage/lib.tsx` : `ScreenStage` (inclinaison 3D, flou, assombrissement, zones floutées), `FacePip` (« Le Glissé »), `FaceCam`, `KeyLine` (sortie de flou, centrée ou en bas), `FocusVeil`, `Stat`, `ChapterCard`, `ChapterPill`, `Pill`, `Eyebrow`, `Em` / `rich`, `Star`, `Backdrop`, `Grain`, `Reveal`, `SfxTrack`, `MUSIC` / `musicGain` ;
- dans `src/montage/Explainers.tsx` : `BrandTiles`, `ChatMock`, `TutoMap`, `Tag`, `IconRow`, `GoogleToAI`, `Teaser`, `NoteCard`, `StepLT`, `TopPill`, `Spotlight`, `PromptCard`, `CheckCard`, `ListCard`, `DataTable`.

**À l'étude** :

- **Shorts verticaux** des 4 moments de `shorts.md`, avec une mise en page 9:16 dédiée.


Ordre = impact sur les tutos ÷ effort. ✅ = déjà prouvé dans le test MINIMAX v3.

| Lot | Composants | Effort |
|---|---|---|
| **Lot 0 (fait)** | ✅ `[FAUX-MULTICAM]`, ✅ `[PUSH-IN]` fluide, ✅ `[KCAP]` avec temps de lecture, ✅ insert preuve téléphone, ✅ SFX calés sur le pic, ✅ traitement voix + master −14 LUFS | — |
| **Lot 1 : démos d'écran** | `[SCREEN-STAGE]` (établissement → plongée → tenue, piloté par points focaux), `[GLIDE]` + `[PIP]`, `[SPOTLIGHT]`, `[GEN-WAIT]` + badge, `[CURSOR]` | Moyen. C'est le plus rentable : 85 % des vidéos. |
| **Lot 2 : structure** | `[TUTO-MAP]`, `[STEP-CARD]` + jingle, `[CHAPTER-PILL]`, `[STEP-LT]`, `[CHECKLIST]`, `[BRIDGE]` (détection automatique dans le transcript) | Faible à moyen |
| **Lot 3 : lisibilité et preuve** | `[PROMPT-CARD]`, `[RECREATE]`, `[HIGHLIGHT]`, `[SHOWCASE]`, `[STAT]`, `[LEDGER]`, `[PROOF-3T]` | Moyen |
| **Lot 4 : récit et CTA** | `[GLASS-LIST]`, `[KEYLINE]`, `[FLOW-LINE]`, `[TEASER]`, `[CTA-DEMO]`, `[STORY-ILLU]` (définir le style IA maison) | Moyen |
| **Lot 5 : outillage** | `edit-plan.json` → Remotion, ducking automatique, contrôles de relecture automatiques, module de restructuration | Moyen |

**Prérequis côté tournage et export :**
- pistes séparées (face cam, écran, audio) ;
- face cam en 4K si possible ;
- export d'au moins 20 Mbit/s en 1080p, ou ProRes ;
- voix enregistrée plus fort (−18 à −12 dBFS en crête).
