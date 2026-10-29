# Playbook de montage — chaîne d'Ibrahim (le cobaye : tests et défis chiffrés · vie d'entrepreneur)

*Version 2 — 29 octobre 2026 (version 1 du 4 octobre 2026, tutoriels).*

> **v2 : aligné sur le positionnement des comptes perso, validé par Ibrahim le 29/10/2026.**
> - Le positionnement sert à trouver les idées, écrire les scripts, tourner **et monter**.
> - Sources : `~/ibrahim-brand/03-positionnement.md`, `05-formats-a-tester.md`, `scripts-tournage/00-cahier-des-charges.md` et l'analyse `07-playbook-montage-vs-positionnement.md`.
> - **Ce qui change** :
>   - le but : un test chiffré, pas un tutoriel ;
>   - le ton : sérieux mais chill ;
>   - la musique ;
>   - le sponsor dans l'histoire ;
>   - les deux fins ;
>   - les lignes rouges à l'image ;
>   - le terrain, les interviews, les compteurs, les formats courts 9:16 ;
>   - les miniatures ;
>   - les cases YouTube.
> - **Piliers** :
>   - A, « le cobaye » : tests et défis chiffrés, environ 60 % ;
>   - B, « entre deux mondes » : vie d'entrepreneur, Indonésie, voyages, environ 25 % ;
>   - C, réponses aux recherches : monétisation, argent en ligne, freelance, environ 15 %.
> - La checklist d'Ibrahim (`checklist_ibrahim.md`) avait été écrite pour des défis « Jour X/30 ». La v2 revient à cet usage.

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

Une vidéo d'Ibrahim, c'est **un test réel, avec un enjeu, des règles et des vrais chiffres**. On voit Ibrahim essayer, rater et réussir. L'outil, souvent une IA, est **l'instrument du test, jamais le sujet d'une leçon**. Le ton est **sérieux mais chill**. Concrètement :
- la preuve est montrée dans les 5 premières secondes (succès ou échec : c'est la fin réelle) ;
- le **Tableau du défi** (règles, compteur, objectif) sert de fil rouge ;
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
3. **Le protocole et le compteur sont visibles.** Règles, budget, durée et enjeu (« sinon… ») sont posés à l'écran et à l'oral avant 60 s. Le **Tableau du défi** (« Jour 3/7 · 152 € / 500 € », « Tentative 2/3 ») revient à chaque palier et reste affiché en pastille. *(checklist d'Ibrahim : compteurs permanents ; 04b point 6.)*
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
14. **Sérieux mais chill.** On garde les rires, les réactions, les blancs comiques et les ratés. Pas de « mode professeur », pas de suspense sous un passage pratique (§ 5bis).
15. **On monte la fin réelle.** Les scripts prévoient deux fins (réussite / échec). À l'étape 0, Ibrahim indique celle qui s'est produite. Le hook, la miniature et les compteurs la suivent. Aucune trace de la fin non tournée ne reste.
16. **Lignes rouges à l'image.** Pas de religion ni de politique, aucun chiffre du business indonésien, jamais de mention des chaînes faceless, et **jamais le visage de l'enfant d'Ibrahim** (décision d'Ibrahim du 29/10/2026). Détail au § 4.9.
17. **Montants en euros.** Tout montant incrusté est en euros. Une conversion en FCFA (taux fixe 1 € = 655,957 FCFA) apparaît en petit, seulement si Ibrahim l'a décidé pour la vidéo.

### 1bis. Règles des vidéos sponsorisées

| Interdit sur les segments du sponsor | Autorisé (on rend intéressant **par l'habillage**) |
|---|---|
| Couper, raccourcir ou fusionner une démonstration ou une présentation | Zoom, plongée et recadrage sur l'interface (`[SCREEN-STAGE]`), tant que l'élément montré reste visible |
| Accélérer une démonstration (pas de ×4, pas de time-skip ajouté) | `[SPOTLIGHT]`, `[HIGHLIGHT]`, `[CURSOR]`, `[STEP-LT]`, `[CHAPTER-PILL]`, pastilles et callouts courts placés à côté de l'élément |
| Réordonner les démonstrations, ou en déplacer une | Effets sonores, musique, jingle, mise en valeur de la voix |
| Masquer l'interface du produit plus de ~1–2 s (carte plein écran, insert par-dessus) | **Ajouter** du contenu *entre* deux démonstrations (carton de palier, Tableau du défi, teaser, `[SHOWCASE]` du résultat), ce qui allonge sans rien retirer |
| Modifier ce qui est dit sur le produit | Variante « côte à côte » des cartes recréées (`[PROMPT-CARD]`, `[RECREATE]`) : l'interface reste visible, légèrement assombrie, et la carte se pose à côté |

**Le sponsor dans le positionnement (v2)** :
- **Place** : intégration vers **1:30-2:00**, de **55 à 90 s**, amenée par une phrase de l'histoire (Fuzay² + LegalPlace, Bekam + LemFi : `04b` § 4). L'autre option : l'outil du sponsor **est** l'instrument du défi, sans annonce séparée (« défi sponsorisé »).
- **Un sponsor au plus par vidéo.** Jamais de sponsor dans un « je teste les promesses des autres » (L3), un micro-trottoir (C6) ou un compteur sans voix (C9).
- **On rend la démo intéressante d'abord par l'enjeu**, puis par l'habillage. L'enjeu, c'est ce que l'outil doit réussir, le temps ou l'argent qui reste. Les interdits ci-dessus restent valables.
- **Une vidéo dédiée devient un défi sponsorisé.** La marque paie, mais la vidéo reste un test avec un résultat montré tel quel, même mauvais. Le partenaire l'accepte par écrit avant le tournage.
- **La mention « Collaboration commerciale » s'affiche dans la vidéo** quand la loi ou le contrat l'exige (loi du 9 juin 2023). Elle s'affiche en permanence si le format le prévoit, comme C8 version A.

- **Avec des pistes séparées** (face cam / écran), la marque a validé le *contenu*, pas un montage visuel. Donc l'interface est à l'écran **dès qu'il s'y passe une action**, et la face cam plein écran n'est autorisée que pendant les explications où l'écran est figé (validé par Ibrahim sur AIsa).
- Les attentes déjà coupées par le monteur (« après quelques minutes… ») restent telles quelles.
- **Exception validée par Ibrahim (6 octobre 2026) : démo longue et monotone** (Character Builder Higgsfield, 3 min 11 sans aucun événement à l'écran, « on s'ennuie »). On retire les **redites orales** (énumérations d'options, phrases dites deux fois, blancs), **jamais une étape ni un choix montré**, et on rend le reste vivant (§4.2bis). Liste des coupes dans `src/<Montage>/cuts.ts`, montrée à Ibrahim avec le bloc.
- **La restructuration (étape 2) ne touche que ce qui n'est pas sponsorisé** : hook, transitions, réactions, contexte, CTA de fin.
- En cas de doute sur un segment, on le traite comme sponsorisé et on pose la question à l'étape 0.
- **Retours de la marque** (sur un brouillon ou sur le montage), une demande de la marque passe avant les interdits ci-dessus :
  1. **Recaler les temps.** Si la marque a vu le brouillon brut, ses minutages correspondent à la **source**. On les convertit en temps de timeline avec l'EDL de l'étape 3 (source → T, puis ÷ la vitesse finale, §6bis).
  2. **Relire la phrase dite à cet instant** (transcript). Le visuel demandé doit illustrer ce qui est dit, sans que la voix change.
  3. **Capturer la page demandée en français et en haute définition.** ⚠️ Les sites des marques redirigent selon le pays de connexion : vérifier la langue, la devise et les prix sur la capture, puis la refaire en France (VPN) si besoin.
  4. **Consigner chaque demande** dans le plan (`04-plan.md` §0, une ligne par demande : demande, solution, temps). Si le montage est déjà rendu, on ne refait que le bloc concerné, puis on réassemble.
  5. **Après le montage**, renvoyer à la marque une liste « demande → minutage dans la version finale ».

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
| Musique | **Propre à chaque vidéo** (voir §5bis), depuis Epidemic Sound | Une musique par partie, style sérieux mais chill selon le moment (§ 5bis). Le kit Mixkit initial est abandonné (jugé « pas premium »). |
| **À créer** | Jingle d'étape de 2 s (motif fixe, monte d'un demi-ton à chaque étape) | Idée de Martell « Habits », rendue originale. Généré une fois, puis réutilisé. |

Tous les gains sont calculés **par rapport à la voix** (pop −9 dB, clic −12 dB, impact −4 dB sous la voix p90). Le **pic** de chaque son est calé sur l'image, grâce à `public/sfx/_analyse.json` (champ `peak_t`).

### 2.3 Les 3 gestes signature (ce qui nous rend reconnaissables)

1. **« Le Glissé »** : la face cam rétrécit en carte de verre et glisse vers le médaillon en bas à droite, puis revient. C'est la transition entre « moi » et « l'écran », environ 25 fois par vidéo. *(inspiré de Sanji, sans rotation ou ≤ 5°, trajectoire courbe, ombre douce)*
2. **« Le Prompt décortiqué »** : le prompt sort de l'interface, se pose en grand sur le fond noir, et chaque partie s'allume en lime au moment où on la nomme, avec des étiquettes françaises (Rôle · Tâche · Format · Contraintes). *(inspiré de Swadia et Sanji, avec des libellés propres à Ibrahim)* **v2 : réservé à un seul moment clé par vidéo**, la consigne donnée à l'IA du défi (L1, L6). Ce n'est plus un geste répété : le prompt est un élément de l'histoire, pas une leçon.
3. **« Le Tableau du défi »** (remplace « la Carte du tuto ») : le compteur du test (« Jour N/T », « montant / objectif », « reste X € », « Tentative X/Y ») et les règles en une ligne. Il est construit dans le protocole (avant 60 s), revient à chaque palier, puis se fige sur le chiffre final au verdict, accompagné du son de révélation. Il est alimenté par **le registre du test** (`registre.json` : une ligne par dépense, gain ou palier, avec la capture qui le prouve). Aucun chiffre ne s'affiche sans ligne dans ce registre. *(checklist d'Ibrahim : compteurs permanents Jour X/30 ; `[STAT]` et `[LEDGER]`)*

---

## 3. Structure d'une vidéo longue (test, défi ou vie d'entrepreneur, de 12 à 20 min)

Le script de tournage (`~/ibrahim-brand/scripts-tournage/`) donne déjà la structure : il est construit pour la rétention, et on ne le restructure pas (§ 7). Ce tableau sert de **contrôle**, pas de modèle à imposer.

### 3.1 La timeline type (pilier A : test ou défi)

| Moment | Contenu | Type | Densité (plans) | Éléments |
|---|---|---|---|---|
| **0:00–0:05** | **Le résultat réel** (fin réelle : vente, notification, solde, ou le blocage), avec la phrase-choc d'Ibrahim | P | 2 à 3 plans | `[PROOF-OPEN]`, sans musique, puis `[REVEAL]` sur le chiffre |
| 0:05–0:30 | Retour au début : la promesse du titre et de la miniature tenue, l'enjeu | E | 4 à 6 | `[FAUX-MULTICAM]`, `[KCAP]` sur la phrase-thèse, musique qui entre |
| 0:30–0:60 | **Le protocole** : règles, budget, durée, enjeu (« sinon… ») | T | 8 à 12 | **Tableau du défi** construit règle par règle |
| 0:35–0:60 | Teaser des moments forts (1 s chacun, sans contexte) + boucle ouverte (« à la fin, tu vois le vrai bilan ») | T | 10 à 15 | `[TEASER]`, pastille « À venir » |
| **1:30–2:00** | Sponsor : intégration de 55 à 90 s amenée par l'histoire, **ou** l'outil du sponsor entre comme instrument du défi | S | — | § 1bis |
| Paliers | « Jour N », « Tentative X/Y » : action, réaction, chiffre | A/P | — | `[STEP-CARD]` « Jour 3/7 », compteur mis à jour |
| ~25 % / 50 % / 65 % | Re-engagements : 1re vente ou 1er blocage, retournement, moment le plus fort | P | Plan tenu 5 à 15 s | Respiration avant, puis `[REVEAL]` |
| Dernier tiers | Les derniers paliers **sans ralentir** | A | Montante | Densité maintenue |
| 3 à 7 dernières minutes | **Le bilan** : recettes, dépenses, frais, bénéfice net. Long, c'est la récompense attendue (`04b` point 8) | P | Montante | `[LEDGER]`, `[PROOF-3T]`, Tableau du défi figé |
| Fin | Verdict → « ce que je referais autrement » → prochain test (« Commente… ») **ou** renvoi vers une autre vidéo dans les 20 dernières secondes, sans « au revoir » | P/S | Montante | `[NEXT-VIDEO]` |

**Piliers B et C** :
- **B** (vlog, expatrié, portrait chiffré) : même ouverture sur le moment le plus fort. Le protocole devient « ce que tu vas voir » : lieu, personne, question. Densité plus basse, voir § 4.6.
- **C** (alerte, monétisation) : preuve Studio à 0:00, puis le constat, puis ce que le spectateur peut faire. Ce n'est jamais un tuto pas à pas.

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
| `[KCAP]` | Sous-titre cinétique **seulement sur la phrase-clé** (1 ou 2 par chapitre), mot par mot, mots-clés en `ACCENT_LIGHT` | 84 px, bas-centre, ombre. Temps de lecture (règle 9). **Jamais sur une capture d'écran.** v2 : règle des vidéos longues. Pour les formats courts, voir § 14 (sous-titres selon le format). |
| `[KEYLINE]` | Phrase-clé flottante (2 à 6 mots) dans l'espace vide à côté du visage, côté choisi selon la position du visage | Avec `[FAUX-MULTICAM]` « Décalé ». Alterne gauche/droite pour les énumérations. |
| `[UNDERLINE]` | Trait `ACCENT` qui se dessine sous les mots-clés à la fin de la phrase | + `click_box_check` |
| `[GLASS-LIST]` | Liste en verre à droite (visage décalé à gauche), qui se construit au rythme de la voix. Cumulative : elle revient avec un item de plus à chaque retour. | Coches `ACCENT` ou vertes, sortie en glissement vers la droite |
| `[STAT]` | Chiffre héros ou compteur qui défile (roulette en ease-out) avec une ligne de contexte minuscule (« jour 3 sur 7 », « coût total ») | Le compteur ralentit puis se fige, + `[REVEAL]` (son). Tenu ≥ 3 s. |
| `[FLOW-LINE]` | Processus en 3 étapes dessiné par un fil lumineux dans l'espace vide (« contacter → attendre → négocier ») | Dessin du trait 0,6 s par segment, libellés en flou → net *(inspiré de Sanji)* |
| `[SELF-BROLL]` | B-roll réel d'Ibrahim : il tape sur son ordi, il est au téléphone, en coulisses | Prouve qu'il fait vraiment les manipulations. v2 : **propre à chaque vidéo** (le jour du test, le lieu du tournage). On ne réutilise un plan générique qu'en dernier recours. |
| `[REACTION]` | Réactions d'Ibrahim gardées entières : rire, surprise, déception, blague, raté | v2, règle 14. Le dérushage ne raccourcit pas ces moments. On les repère à l'étape 1 et on les liste dans `01-analyse.md`. |

### 4.2bis Démo longue : jamais de temps mort à l'écran (retour d'Ibrahim, 6 octobre 2026)

Une démo où « rien ne se passe à l'écran » pendant plus de **15 s** (même interface, petits clics, aucune animation) fait chuter la rétention. Ibrahim l'a jugée « ennuyeuse à mourir » sur le Character Builder (3 min 11). Le plan de montage (étape 4) doit prévoir pour chaque démo de plus de 30 s :
1. **Un cadrage sur la zone utile** : si toute l'action est dans un panneau, on découpe ce panneau et on le pose **en grand** (`ScreenStage` avec `win` = le panneau et `free`), au lieu de montrer la page entière où 80 % ne bouge pas.
2. **Un objet qui se construit au rythme des choix** dans l'espace libéré : par exemple la **carte joueur façon FIFA** (`PlayerCard`, `src/MontageHiggsInflu2/Illus.tsx`) qui se remplit à chaque caractéristique choisie et révèle le résultat à la fin. Variantes : checklist, jauge, liste de réglages.
3. **Un événement visuel au moins toutes les 5 à 8 s** : zoom sur le clic, surlignage, pastille, ligne qui se remplit, avec un pop discret.
4. **Le resserrage du texte** : énumérations d'options, phrases dites deux fois, blancs. Coupes définies dans `cuts.ts` (temps T d'origine), appliquées aux pistes par `analysis/tools/apply_cuts.py` sur le serveur (`*_v2`), tous les temps du montage passant par `T()`. Voir §1bis pour les démos sponsorisées.
5. **La récompense** : le résultat est révélé (carte, `[SHOWCASE]`), avec un vrai moment sonore (§5ter).

**Résultat généré : le fichier HD plutôt que le lecteur de l'interface (retour d'Ibrahim, 7 octobre 2026).** Le lecteur vidéo des outils web saccade souvent à l'enregistrement (Genjutsu sur Higgs Influ 3). Dès qu'un rendu joue dans l'interface, on montre le **fichier HD téléchargé**, en grand, et à côté de l'original quand il y a une vidéo de référence (`ResultDuo`, synchronisés et bouclés sur la même durée). On demande les rendus HD à l'étape 0.

**Retour face cam** : toutes les 60 à 120 s de démo, pour le « pourquoi », une mise en garde, une réaction ou une transition d'étape.

### 4.2 Démo d'écran (une preuve parmi d'autres)

v2 : l'écran n'est plus le cœur de la vidéo. On le montre **quand il prouve quelque chose ou fait avancer le test** : une décision de l'IA, un gain, un blocage, un résultat généré. Le terrain, la face cam, le vlog, l'interview et les captures de preuve se partagent le reste, selon le script. Les règles ci-dessous s'appliquent à chaque séquence d'écran.

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
| `[BLUR-DATA]` | Floutage de l'e-mail, des clés API, soldes, onglets et notifications, ou recadrage serré si c'est plus propre. **On floute la zone précise, jamais tout l'écran** (retour d'Ibrahim, 6 octobre 2026 : la liste de fichiers du Finder était à flouter, mais le masque couvrait aussi la vidéo qu'il montrait). Avant de poser un masque, se demander : *qu'est-ce qu'Ibrahim montre à cet instant ?* Cela doit rester net. | Vérifié à la passe de relecture 4, sur une image prise au milieu de chaque masque |
| `[CAUTION]` | Moment « attention ici » : on ralentit volontairement (zoom tenu 3 à 4 s), pastille ⚠️, musique coupée | 3 ou 4 fois par vidéo au maximum, sur la clé API, un réglage caché ou une commande |
| `[STEP-LT]` | Pastille numérotée + intitulé (« 2 · Connecte ton compte ») en bas à gauche **pendant la démo**, qui survit aux coupes | Version légère du carton d'étape, pour les sous-étapes *(Martell « Habits »)* |

### 4.3 Transitions et structure

| ID | Élément | Réglages |
|---|---|---|
| `[GLIDE]` | **Le Glissé**, face cam ↔ médaillon (voir §2.3) | ~1 s, spring amorti, + `pop_*` léger. **La** transition par défaut entre face cam et écran. |
| `[STEP-CARD]` | Carton de palier plein écran : un volet aurora monte du bas (0,4 s), **« Jour 3/7 »** ou **« Tentative 2/3 »** + titre de 3 mots + le Tableau du défi avec le compteur à jour | ≤ 2,5 s au total. + `swoosh_vacuum` (pic calé sur le volet) + jingle de palier. Généré depuis le registre du test : un libellé ou un chiffre erroné est impossible. |
| `[DEFI-BOARD]` (remplace `[TUTO-MAP]`) | **Le Tableau du défi** : règles en une ligne, compteur (jour, montant / objectif, reste), état du test. Construit dans le protocole, rappelé à chaque palier, figé au verdict. | Composant unique alimenté par `registre.json`. Le composant `TutoMap` peut servir de base. |
| `[CHAPTER-PILL]` | Pastille permanente en haut à gauche : **« Jour 2/7 · 48 € / 100 € »** ou « Tentative 2/3 », avec une mini-barre segmentée | ≥ 40 px. Toujours au même endroit dans toutes les vidéos (checklist : « position des compteurs » figée). |
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
| `[PROOF-OWNER]` (v2) | Les preuves de **gains et de dépenses** (banque, Fiverr, ComeUp, Studio, paiements) sont **filmées ou capturées par Ibrahim**, en plan continu, le jour où elles arrivent. Claude ne se connecte jamais à ses comptes. | Chaque capture a sa ligne dans `registre.json` (date, montant, fichier). Jamais de capture refaite ou retouchée. |
| `[VERDICT-TAG]` (v2) | Verdict en étiquettes sobres : « VRAI » / « ARNAQUE », « ÇA MARCHE » / « ÇA NE MARCHE PAS », couleurs d'état (`#8ee3a1` / `#ff8a7a`) | C1, L3. Jamais de rouge criard ni de flèches. L'échec et le succès ont le même traitement (règle 12). |
| `[PLAN-VS-RESULT]` (v2) | « Prévu / obtenu » côte à côte : le plan (image clé, référence, consigne) à gauche, le résultat au même instant à droite | Généralise `ResultDuo` (§ 4.2bis). Brief Higgsfield (Frames, References), C8. |

### 4.4bis Illustrer par le réel : montrer plutôt qu'animer (règle d'Ibrahim, 5 octobre 2026)

**Principe :** quand Ibrahim parle d'une personne, d'un compte, d'un chiffre, d'un article ou d'un produit qui existe, on **le montre pour de vrai** : vraie photo, vraie capture de profil, vraies statistiques (abonnés, vues, likes), vraie vidéo, vrai article. Le motion design ne sert qu'à mettre en valeur ce qui est montré (cadre, zoom, chiffre en roulette), jamais à le remplacer. Le réel apporte crédibilité et confiance ; une animation de quelque chose qu'on pourrait simplement montrer affaiblit la vidéo.

| Étape | Méthode |
|---|---|
| **Repérage** (étape 4, plan de montage) | Chaque mention d'un élément réel dans le transcript = une ligne « illustration réelle » dans le plan : quoi montrer, source (URL), à quel mot. Les recherches faites pour le script (sessions Claude, notes d'Ibrahim) sont la première source : les retrouver et les copier dans `00-brief/recherches.md`. |
| **Collecte** | Captures dans un navigateur sans compte connecté (profils, compteurs, articles) ; miniatures de vidéos par l'accès public officiel (oEmbed TikTok, YouTube) ; captures d'écran des posts. **Jamais de contournement de CAPTCHA ou de connexion** : si une page est bloquée, on garde la partie visible (en-tête du profil) ou on demande à Ibrahim de capturer depuis son compte. Fichiers rangés dans `public/montage/<slug>/captures/`, avec la date de capture. |
| **Mise en scène** | Carte de capture posée sur un fond assombri (`Shot`), légèrement inclinée, avec une légende courte ; le chiffre clé repris en grand (`[STAT]`) ; plusieurs vidéos d'un compte en éventail. Toujours **l'écran fait foi** (`[SCREEN-TRUTH]`) : le chiffre affiché est celui de la capture. |
| **Vidéo sponsorisée** | Vérifier le brief : contenus de tiers (personnes, marques, logos) seulement si la marque l'a validé (sinon flou). Ibrahim tranche. |

**Règle absolue (retour d'Ibrahim, 6 octobre 2026) : tout ce qu'Ibrahim explique et qu'il n'a pas filmé, on va le capturer.** « Va sur TikTok et tape AI influencer » → on enregistre nous-mêmes la recherche. « Son geste signature, c'est le shadowboxing » → on montre **la vidéo** du shadowboxing, pas une capture fixe. Illustrer, ce n'est pas mettre un texte ou un B-roll générique : ce sont **des captures d'écran qu'on va chercher et des extraits vidéo réels**. Au plan de montage (étape 4), chaque phrase du transcript est passée au crible « qu'est-ce qu'on voit à ce moment-là ? », et la colonne « illustration réelle » n'a pas le droit d'être vide sur une explication.

| Outil | Usage |
|---|---|
| `analysis/tools/webcap.mjs` | Chrome de bureau piloté (CDP), rendu ×2 (net en 1080p). `launch` ouvre une fenêtre persistante sur le Mac : **Ibrahim y passe lui-même le CAPTCHA** ou se connecte si besoin (jamais Claude). Puis `shot <url> <png>` (capture) et `record <url> <dossier> <s> [attente] [sélecteur]` (vidéo de l'écran : la vidéo d'un post qui joue, une recherche qui défile avec `SCROLL=px`). Encodage : `ffmpeg -f concat -i frames.txt` + recadrage. Rien n'est téléchargé : on enregistre ce que l'écran affiche. |
| **Contrôle des captures** | Avant usage : luminance max > 200/255 (une capture prise derrière un voile de CAPTCHA ou de connexion plafonne vers 76 : cartes « assombries », retour d'Ibrahim) ; largeur ≥ 1 200 px pour l'élément montré ; **l'écran fait foi** (le chiffre affiché est celui de la capture du jour, même s'il diffère de l'oral). |
| **Mise en scène** | Vidéo verticale en plein cadre avec fond flouté (`FullClip`) ; plusieurs vidéos qui jouent en éventail avec leurs vues (`FanClips`) ; capture plein cadre avec zooms et surlignage (`PanShot`). |

### 4.4ter Regard caméra : quand Ibrahim lit son script, on ne le montre pas (retour d'Ibrahim, 6 octobre 2026)

v2 : les nouveaux scripts sont parlés, souvent en selfie ou sur le terrain. Au tournage, on utilise un prompteur ou des phrases apprises plutôt que la lecture sur l'ordinateur. La règle reste valable pour les passages encore lus. Elle ne s'applique pas aux réactions, aux hésitations ni aux selfies de vlog : ce sont des moments réels.

Sur les passages scriptés (intro mot pour mot, explications lues), Ibrahim lit son ordinateur : il ne regarde pas l'objectif, parce qu'il **prévoit que ces passages seront entièrement illustrés**. Le laisser à l'écran, même sous une illustration posée par-dessus, « n'est pas professionnel ».
- **Détection automatique à l'étape 1** : `analysis/tools/gaze.py` (MediaPipe, serveur, ~45 s pour 10 min) mesure l'inclinaison de la tête et le regard vers le bas → `lecture_script.json` (critère : tangage lissé < −6,5° ou < −4° avec regard bas > 0,62, sur au moins 1,2 s). Sur Higgs Influ 2 : 0:00–0:18, 1:28–1:46, 5:15–5:26, 5:37–5:49, 9:00–9:11, 9:15–9:20.
- **Règle** : chaque passage détecté devient une **illustration plein cadre opaque** (vidéos et captures réelles, §4.4bis) qui couvre toute sa durée. La face cam revient dès qu'Ibrahim regarde l'objectif.
- La liste est montrée à Ibrahim dans `01-analyse.md`.

### 4.5 Storytelling et illustration

| ID | Élément | Réglages |
|---|---|---|
| `[STORY-ILLU]` | Anecdotes et métaphores illustrées par des **images IA d'un style maison unique**, toujours le même (proposition : trait encre + une seule couleur `ACCENT`). On peut partir d'une vraie photo d'Ibrahim (img2img). | Le style IA signifie « récit / passé / idée » ; le réel signifie « maintenant / preuve » *(Martell « Habits »)*. v2 : **le réel d'abord** (photos, archives, lieux d'Ibrahim). L'IA seulement pour ce qu'on ne peut ni filmer ni retrouver. |
| `[STORY-BED]` | Une seule nappe musicale un peu plus présente sous une histoire personnelle (−30 dB sous la voix) | Une fois par vidéo au maximum |
| `[AI-LABEL]` | Tout visuel ou toute voix IA est annoncé comme tel (pastille « Généré par IA ») | Crédibilité, audience européenne. **Une seule règle avec la mise en ligne (§ 8ter)** : ce qui est annoncé à l'écran est aussi déclaré dans Studio quand YouTube l'exige. Jamais de voix IA sur ces comptes. |

### 4.6 Terrain et vlog (pilier B ; v2)

Pour C7, L4, L5 et toutes les séquences tournées dehors.

| Élément | Règle |
|---|---|
| Image | **Brute assumée** : selfie, vue subjective, téléphone (`04a` § 5). La charte « Noir & Lime » ne s'applique qu'aux inserts : compteur, bilan, carte. |
| Son | Ambiance réelle du lieu (rue, scooter, bureau) gardée sous la voix. Musique plus basse ou absente quand le lieu « parle ». |
| Étalonnage | Raccord de peau et de lumière entre les lieux (checklist). Même look dans toute la vidéo. |
| Repère | Mini-carte ou nom du lieu (ville seulement, si Ibrahim l'a autorisé) à chaque changement de lieu. |
| Transitions | Pas de « Glissé » (il n'y a pas d'écran d'ordinateur). Coupe franche ou `[WHIP]` pour un changement de lieu. |
| B-roll de vie | Propre à chaque vidéo : bureau, équipe, trajets, repas. C'est le contenu, pas un remplissage. |
| Rythme | Plus calme que les tests : plans de 3 à 8 s, respirations plus longues. On garde quand même un événement toutes les 5 à 8 s. |

### 4.7 Interviews et micro-trottoirs (v2)

Pour C4, C6 et L5.

| Élément | Règle |
|---|---|
| Consentement | **Aucune image d'invité montée sans autorisation écrite** (image, voix, chiffre) rangée dans `00-brief/autorisations/`. On le vérifie à l'étape 0. Visage flouté si l'invité l'a demandé. |
| Cadrage | Interview : plan à deux puis plan serré sur l'invité ; deux micros (main + cravate). Micro-trottoir (C6) : **intervieweur hors champ**, seule la main d'Ibrahim et le micro sont visibles. |
| Bandeau | Prénom · métier · ville. Le montant arrive en grand (`[STAT]`) au moment où il est dit, en euros (règle 17). |
| Sous-titres | **Un mot géant à la fois** (micro-trottoir) ou 2 à 4 mots blancs au centre (interview). Traduction en français si l'invité parle indonésien ou anglais, relue par l'interprète. |
| Vitesse | **Pas d'accélération ×1,10** sur les voix d'invités (§ 6bis). |
| Montage | On ne coupe pas une réponse pour lui faire dire autre chose. Les refus et les silences peuvent rester s'ils sont drôles, jamais pour moquer l'invité. |

### 4.8 Compteurs, chronos et caméra fixe (v2)

Pour L1, L2, L6, C2, C3, C8 et C9.

| Élément | Règle |
|---|---|
| Compteur | HUD fixe, toujours au même endroit, animé à chaque mise à jour (roulette + son de révélation). Il est alimenté uniquement par `registre.json`. |
| Chrono | Minuteur réel, calé sur l'heure de tournage (horodatage des rushes). **Jamais recalculé ni arrangé au montage.** |
| Caméra fixe longue durée (L6) | Accéléré lissé avec l'horloge réelle à l'écran ; retour en temps réel sur les moments forts ; badge honnête (« ⏩ 14 h »). |
| Compteur sans voix (C9) | Pas de voix. Le texte porte tout. Musique + sons de caisse ou de notification, montée du compteur jusqu'au verdict, 22 à 32 s. |

### 4.9 Lignes rouges à l'image (v2, règle 16)

On les contrôle **sur la planche de chaque bloc** (§ 9, passe 4) et sur chaque format court.

| Ligne rouge | Ce qu'on fait au montage |
|---|---|
| Religion : temples, prières, offrandes, appel à la prière | Couper ou recadrer. Aucun commentaire |
| Politique : affiches, slogans, débats | Couper ou recadrer |
| Chiffres du business indonésien : caisse, prix, factures, tableaux, écrans de vente | Flouter la zone (`[BLUR-DATA]`) ou couper. Le business se montre, pas ses chiffres |
| Visage de l'enfant d'Ibrahim | **Jamais montré** (décision d'Ibrahim du 29/10/2026) : de dos, hors champ, ou flouté sur toute la durée. On vérifie chaque plan où l'enfant apparaît, même de loin ou en reflet |
| Chaînes faceless (faceless-studio) | Jamais visibles : onglets, Studio, Telegram, noms de projets, dossiers |
| Passants, plaques, visages non autorisés | Flouter |

### 4.10 Appels à l'action

| ID | Élément | Réglages |
|---|---|---|
| `[CTA-DEMO]` | CTA **démontré, pas annoncé** : on voit en 6 s le parcours exact (commenter « MOT », réponse auto, document reçu) sur un mockup téléphone ou navigateur | Lié au moment du test qu'il prolonge. Exemples : « Commente LOGO pour choisir le prochain commerce » (C8), « Commente le prochain test » |
| `[COPY-BADGE]` | Badge « Le registre complet est en description » (ou « Prompt complet en description » quand la consigne compte) | Renvoie vers le dossier du test (§ 8bis) |
| `[NEXT-VIDEO]` | Renvoi vers une autre vidéo dans les 20 dernières secondes (« la suite logique, c'est… »), coupe sèche | Pas d'outro, pas d'écran de fin ajouté après le contenu |

---

## 5. Le son en détail

| Couche | Niveau cible | Comportement |
|---|---|---|
| **Voix** | −16 LUFS après traitement (master final −14 LUFS) | Chaîne validée par Ibrahim (AIsa, test A/B/C/D) : **débruitage IA DeepFilterNet doux** (`atten_lim_db=12`, venv `analysis/.venv-df`, Python 3.11) → passe-haut 70 Hz → compression 2:1 légère → normalisation −16 LUFS en 2 passes. **Jamais `afftdn`** (artefacts métalliques, voix jugée dégradée). Les sources arrivent souvent très basses (MINIMAX −26,6 LUFS, AIsa −30,5 LUFS) : à surveiller à chaque vidéo. |
| **Musique sous la voix** | **≈ −32 LUFS (environ 16 dB sous la voix)**, −31 dans le hook. Retours d'Ibrahim : 19 dB sous la voix était inaudible (AIsa), −29 LUFS « trop fort, prend de la place sur la voix » (Higgs Influ 2, 6 octobre 2026), surtout avec un morceau dense | Les monteurs livrent des cuts presque sans pause : le ducking automatique ne joue presque jamais. Le niveau de base doit donc être juste, et le relief vient du **mixage** (§5ter). Plus basse encore (−3 dB) pendant les manipulations denses. |
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
- Le style : lo-fi, chill-tech ou ambient, **sans voix**, tempo stable de 90 à 115 BPM. **Familles détaillées et usages : § 5bis (v2).**
- On change de morceau ou de couche aux grands chapitres.
- Les 4 références montrent deux écoles. Martell et Swadia n'utilisent presque pas de musique (stings seulement). Sanji met une nappe à 30 dB sous la voix 60 % du temps. **Notre choix** : une nappe très basse (Ibrahim veut de la musique), qui s'efface sous les explications denses, plus des stings ou le jingle aux étapes.

---

**Mesurer avant de régler (retour d'Ibrahim, 6 octobre 2026 : « musique et effets encore trop forts »).** Les niveaux de musique et d'effets sont **relatifs à la voix**, jamais absolus. Sur Higgs Influ 2, la voix du cut du monteur arrivait à −29,4 LUFS (et non −16) : une musique réglée à −29 LUFS était donc au niveau de la voix. Méthode :
1. Mesurer la voix livrée (`ffmpeg -af ebur128`) et la normaliser à −16 LUFS (`loudnorm` 2 passes, linéaire) avant le montage.
2. Après rendu (audio seul : `remotion render … --codec=wav`, rapide), **soustraire la voix** du mix (même échantillonnage, corrélation ≈ 0,97) et mesurer le reste par section. Cible : musique + effets **15 à 18 dB sous la voix** (hook ≥ 14 dB, démo ~18 dB).
3. Pour retoucher le son d'un bloc déjà validé à l'image : rendre l'audio seul et le reposer sur la vidéo (pas de nouveau rendu image).

### 5ter. Le mixage audio : la musique joue avec l'émotion (règle d'Ibrahim, 6 octobre 2026)

Mettre des morceaux bout à bout et des effets sonores ne suffit pas. **La musique doit réagir à ce qui est dit** : pauses, coupures, reprises. C'est ce qui donne de l'émotion à la vidéo. Au plan de montage (étape 4), une colonne « mixage » est remplie pour chaque moment fort, et les événements sont codés avec `src/montage/mix.ts` (`MixEvent`, gains multipliés, temps de la timeline).

| Moment | Geste de mixage | Exemple (Higgs Influ 2) |
|---|---|---|
| **Passage à l'étape suivante** (« on passe à… », « ingrédient numéro 2 ») | Le morceau en cours **finit en fondu** (1,5 à 2 s) juste avant, ~1 s sans musique avec le whoosh du carton, puis le morceau suivant entre en fondu | Fin de m0 à 75,0 s, m1 entre à 76,4 s |
| **Révélation, chute, punchline** (« spoiler… », « alors que lui… ») | `stop` : la musique **s'arrête net** (fondu 0,1 s) sur le mot qui précède, silence, l'impact tombe sur la révélation, la musique repart en fondu (~1 s) | « Spoiler » → silence → « c'est de l'IA » + impact |
| **Phrase importante, mise en garde** | `dip` : la musique s'efface de 5 à 8 dB le temps de la phrase | « le point que 90 % des gens manquent » |
| **Résultat, moment wow** | `stop` court puis `swell` (+3 dB) avec un son de réussite | Révélation du personnage généré |
| **Manipulation dense** | `dip` de 3 dB sur toute la séquence | Character Builder |
| **Respiration sans voix** (illustration, attente) | `swell` de +3 à +4 dB | — |

Règles : 3 à 6 gestes de mixage par chapitre (pas plus : le contraste s'use) ; jamais deux `stop` à moins de 20 s ; les gestes sont listés dans le plan pour validation, puis entendus dans le bloc.

### 5bis. L'identité sonore propre à chaque vidéo (règle d'Ibrahim, 4 octobre 2026)

**Principe :** chaque vidéo a **sa propre identité sonore**, construite à partir de son transcript. Chaque partie (intro, puis chaque chapitre ou étape) a **sa propre musique de fond**. L'ensemble reste cohérent : même famille de styles, transitions soignées. On ne réutilise donc pas les mêmes musiques d'une vidéo à l'autre. La **signature de chaîne** (son de révélation, jingle d'étape, sons d'interface) reste constante pour la reconnaissance.

**Le style d'Ibrahim : sérieux mais chill (v2, 29/10/2026).** On le voit essayer, rater, rire. La musique accompagne l'humeur du moment. **Elle ne fabrique pas de tension sur un passage pratique** : un abonné de longue date a décrit son « corps tendu par le suspense » pendant des informations pratiques (`~/ibrahim-brand/research/02c-voix-audience.md`). *(Remplace « Le style d'Ibrahim : sérieux » de la v1.)*

| Moment | ✅ Familles | Exemples d'usage |
|---|---|---|
| **Pratique, explication, protocole, vlog** | Lo-fi, chill-tech, acoustique chaleureux, groove léger, électronique douce | Ibrahim pose les règles, travaille, se déplace, parle à son équipe |
| **Enjeu réel** (avant un résultat, un retrait d'argent, le verdict) | Suspense minimal (pulsations, tension retenue), montée sobre, puis **silence** | Les 20 s avant le chiffre (checklist), le clic « Retirer » |
| **Bilan, révélation, moment fort** | Néo-classique sobre (piano, cordes), cinématique minimal | Le Tableau du défi qui se fige, le bilan |
| **Histoire personnelle** | Nappe douce, néo-classique | `[STORY-BED]` |

| ❌ À proscrire |
|---|
| Suspense, enquête ou dark ambient **sous un passage pratique** |
| Dubstep, EDM, drops, trap, hip-hop énergique |
| Tout morceau avec voix ou paroles |
| Orchestral épique massif (couvre la voix) |
| Ukulélé « corporate happy » |

**Méthode (à l'étape 4, « Plan de montage »)** : produire une **fiche identité sonore** dans `montages/<slug>/04-identite-sonore.md`.
1. **Arc émotionnel par partie**, lu dans le transcript : pour chaque chapitre, son rôle (tension, curiosité, méthode, révélation, climax) et son énergie (1 à 5).
2. **Une musique par partie**, choisie dans les familles autorisées, avec un rôle clair : par exemple hook sur l'enjeu (suspense minimal court), protocole et pratique en lo-fi ou chill-tech, révélation en néo-classique ou cinématique, climax en suspense montant.
3. **Cohérence** : tempos voisins (±15 BPM entre parties consécutives), tonalités compatibles si possible, énergie qui suit l'arc (jamais de baisse dans le dernier tiers, règle 11).
4. **Transitions** : fondu enchaîné de 1 à 2 s **sous le carton d'étape** (le jingle d'étape couvre la jonction).
5. **Effets sonores** : le **noyau signature** est constant (révélation, porte de chapitre, validation, interface). On peut y ajouter 1 ou 2 accents propres à la vidéo (texture liée au sujet).
6. **Source** : Epidemic Sound (abonnement Creator d'Ibrahim, chaîne sur liste blanche). **Plus de page d'écoute (règle d'Ibrahim, 6 octobre 2026)** : Claude choisit directement **un morceau par partie**, d'après les goûts établis sur les vidéos précédentes (voir les fiches `04-identite-sonore.md` d'AIsa, Hostinger, Higgs Influ 2 : suspense pulsé, ambient/pulses, dark ambient, 90–105 BPM, artistes comme Blue Saga, Out To The World) (goûts de la v1, tutos : en v2, ces familles sont réservées aux moments d'enjeu ; pour le pratique et le vlog, on choisit dans les familles chill du tableau ci-dessus), via l'API publique `https://www.epidemicsound.com/json/search/tracks/?term=` (curl, sans navigateur). Il donne la sélection exacte (titre, artiste, id, rôle) ; Ibrahim télécharge et on passe à la suite.
7. **Téléchargement HQ : c'est Ibrahim qui le fait, à la main** (règle d'Ibrahim, 4 octobre 2026 : c'est plus rapide, et le pilotage du navigateur par Claude buguait beaucoup). Claude n'essaie **jamais** de télécharger depuis le navigateur.
   - **Claude fournit la liste** : titre, artiste et identifiant Epidemic de chaque morceau choisi (et de chaque effet sonore manquant).
   - **Ibrahim télécharge** dans `~/Downloads` et prévient.
   - **Claude range les fichiers** dans `public/epidemic/<slug>/hq/` et mesure leur niveau (LUFS).
   - En attendant, les prototypes peuvent utiliser les extraits d'écoute (`lqmp3`).

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

### 6bis. Vitesse finale ×1,10 (choix d'Ibrahim, mis à jour le 5 octobre 2026)

Historique : Ibrahim a comparé ×1,00, ×1,10 et ×1,15 sur le hook et sur une démo, et avait choisi ×1,15 (AIsa, Hostinger). Après avoir revu la vidéo Hostinger publiée, il la trouve un peu trop rapide : **on descend d'un niveau, à ×1,10**.

- **Statut : standard pour toutes les vidéos, à partir de la vidéo qui suit Hostinger**. On l'applique par défaut, sans redemander. Les vidéos déjà publiées ne sont pas régénérées.
- **Où** : à la toute fin de l'étape 7, sur la vidéo assemblée. Images `setpts=PTS/1.10` et son `atempo=1.10` (la voix garde sa hauteur), puis master −14 LUFS en 2 passes. `analysis/cloud/assemble_remote.sh` applique la vitesse de la variable `SPEED` (défaut 1.10).
- **Conséquence au montage** : tous les temps de lecture se calculent pour la vitesse finale. Un texte tenu `readTime(mots) × 1,10` à ×1,00 reste lisible une fois accéléré.
- **Livrables** : sous-titres et chapitres divisés par 1,10 (`*_x1.10.srt`, `chapitres_x1.10.txt`, `description_x1.10.md`). On garde aussi la version ×1,00.
- **Sponsor** : une démonstration sponsorisée accélérée enfreint la règle 13 et le §1bis. Avant de publier une vidéo sponsorisée accélérée, Ibrahim valide avec le sponsor. Sinon, on n'accélère que les passages hors démo.
- **Exceptions (v2)** : pas d'accélération sur les **voix d'invités** (interviews, micro-trottoirs, § 4.7), ni sur les **séquences d'ambiance de vlog** où le lieu « parle » (§ 4.6). La vitesse ×1,10 s'applique à la voix d'Ibrahim et aux séquences d'écran.

## 7. La restructuration — ÉTAPE SUPPRIMÉE

> **Décision d'Ibrahim (6 octobre 2026, Higgs Influ 3)** : « La vidéo était déjà très bien. Toute la restructuration annule tout. Garde ma vidéo comme elle était. On élimine complètement l'étape de la restructuration. » Ses scripts sont déjà construits pour la rétention (H.I.V.E.) : on ne réordonne pas, on ne coupe pas le contenu, on n'ajoute pas de séquence qui allonge la vidéo. Le travail se fait uniquement par l'habillage, sur la timeline d'origine. La méthode ci-dessous est conservée pour mémoire, **ne plus l'appliquer**.

### (archive) Méthode de l'ancienne étape 2

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
- `03-audio/`
- `04-plan.md` + `edit-plan.json`
- `05-hook/`
- `06-blocs/`
- `07-final/`
- `registre.md`

Les composants réutilisables sont dans `src/montage/`.

| # | Étape | Ce que fait Claude | Livrable remis à Ibrahim | 🔒 Ce qu'Ibrahim valide |
|---|---|---|---|---|
| **0** | **Réception et brief** | Inventaire des fichiers : face cam, captures, pistes séparées ?, audio, résolution, débit, fps. Questions de cadrage. Lecture du **script de tournage** (`~/ibrahim-brand/scripts-tournage/<script>.md`). | `00-brief.md` : ce qui est reçu, ce qui manque, et le questionnaire (v2) : **script et format (L1-L7, C1-C9), pilier (A/B/C) · fin réelle (réussite / échec) · registre du test (`registre.json`) et ses captures · sponsor ? place (1:30-2:00 ou outil du défi), points imposés, segments intouchables · autorisations des invités · lignes rouges repérées au tournage (enfant, lieux, chiffres du business indonésien) · conversion FCFA ou euros seuls ?** · titre et miniature (la promesse) · vidéo vers laquelle renvoyer · ressources à mettre en description | Les réponses au questionnaire, la fin réelle et la liste des segments intouchables |
| **1** | **Analyse** | Transcription Whisper mot par mot, typage des beats (A/E/P/R/C/S), mesures (visage, pauses, niveaux LUFS, qualité image), repérage des matériaux de hook, des preuves, des pièges et des digressions | `01-analyse.md` : la carte de la vidéo (beats, timecodes, durées), le diagnostic (problèmes de rythme, d'audio, de lisibilité) et les points forts | Le diagnostic (« oui, c'est bien ma vidéo, ces problèmes sont réels ») |
| ~~**2**~~ | ~~**Restructuration**~~ **SUPPRIMÉE** (décision d'Ibrahim, 6 octobre 2026) | On garde la vidéo **telle qu'Ibrahim l'a tournée** : ordre, texte et durée. Pas de cold open ajouté, pas de déplacement, pas de coupe de contenu, pas d'insertion qui allonge la timeline. On passe directement de l'analyse (1) au montage audio (3). | — | — |
| **3** | **Montage audio** (la colonne vertébrale) | Application des coupes et déplacements validés. Traitement voix (passe-haut, compression, −16 LUFS), ambiance sous les coupes, silences ramenés à 0,15–0,35 s (hors démonstrations sponsorisées). **Pas encore d'image retravaillée.** | `03-audio/` : la vidéo réordonnée en basse définition avec l'audio traité. « Si elle tient à l'écoute, elle tiendra à l'image. » | L'écoute de bout en bout : ordre, coupes, qualité de la voix |
| **4** | **Plan de montage** | Pour chaque segment : cadrages et zooms, écrans (points focaux, spotlights), **tous les textes à l'écran mot pour mot**, cartons de palier, Tableau du défi et compteur (chiffres tirés de `registre.json`), inserts, SFX (fichier et instant), musique (morceaux et niveaux), preuves (montants vérifiés). Contrôle des cadences (§6) et des règles (§1). | `04-plan.md` : tableau lisible, chapitre par chapitre, avec les textes exacts (orthographe à valider ici) + `edit-plan.json` | Les choix d'habillage, **l'orthographe de chaque texte**, les morceaux de musique |
| **5** | **Prototype : les 60 premières secondes** | Rendu complet (image + son + master) de la première minute, au style final | `05-hook/` : la vidéo de 60 s + la planche de vérification | Le **style** (couleurs, typo, zooms, sons, rythme). C'est la porte la plus importante : une fois validé, le style ne change plus pour le reste. |
| **6** | **Production par blocs** | Rendu bloc par bloc (un chapitre, 1 à 3 min). Avant chaque envoi : mesure de fluidité (à-coups de zoom), vérification du temps de lecture des textes, contrôle visuel des planches. | `06-blocs/bloc-N.mp4`, un par un | **Chaque bloc**. Les retours sur un bloc s'appliquent aux suivants. |
| **7** | **Assemblage et finitions** | Assemblage, raccords entre blocs, **re-finalisation de la première minute** (montée en dernier, avec tout ce qu'on sait du reste), master −14 LUFS / −1 dBTP, relecture automatique en 4 passes (§9) | `07-final/` : vidéo complète + rapport de relecture (ce qui passe, ce qui a été corrigé) | Le visionnage complet, **sur téléphone** puis au casque |
| **8** | **Export et livrables** | Export final (1080p ou 4K, débit élevé, AAC 48 kHz), chapitres YouTube définitifs, sous-titres `.srt` (noms propres corrigés, noms de famille de tiers retirés), les **3 à 5 extraits courts listés dans le script de tournage** (montés selon le § 14), et **les ressources de la description** (§8bis) | `08-livrables/` : `chapitres.txt` + `.srt` + `shorts.md` + `description.md` + `ressources/` | Le « bon pour publication » et la liste des ressources |
| **8bis-M** | **Miniature** (règle d'Ibrahim, 5 octobre 2026 : c'est Claude qui la génère ; méthode v2 du 29/10/2026) | **Point de départ : la maquette du script de tournage** (cadrage, objet, texte de 3 mots au plus, place du chiffre). **Méthode v2 · structure reprise + objets réels** : on cherche les miniatures les plus vues sur le même format (planche numérotée de 10 à 12, Ibrahim choisit) et on reprend leur **structure** : triptyque, prévu / obtenu, visage + interface de l'IA, montant flouté. On ne recopie jamais l'image elle-même. Les **objets réels du test** (vrai billet, vraie notification de paiement, vraie courbe Studio, vrai lieu) viennent des rushes ou d'une **photo de miniature prise au tournage**. Nano Banana Pro (Higgsfield, `nano_banana_pro`, 16:9, 2k, 2 variantes) sert à composer et à nettoyer, avec les règles d'identité du visage. **Une miniature à chiffre se fait après le test, et le chiffre affiché est celui de la vidéo** (ou flouté). Export 1280×720, < 2 Mo. | `09-miniature/` : les variantes + la retenue | Le choix de la miniature |
| **8bis-M · leçon (Higgs Influ 3, 7 octobre 2026)** | Le prompt de réplication générique a donné un rendu « très nul, rien à voir avec la référence » (personnages réalistes, mise en page perdue). Ce qui a marché : un prompt qui commence par **« Recreate the FIRST image as faithfully as possible… Only change the elements listed below »**, qui **liste explicitement chaque élément à garder** (mise en page, cartes, style 3D, fond, typographie du titre, chiffres, accessoires) puis **chaque élément à remplacer** (visage, personnages, textes exacts). **v2** : la leçon reste valable pour garder une **mise en page**. On remplace tout le contenu (personnages, logos, chiffres, images) par nos objets réels. Aucun logo, personnage ni image d'un autre créateur ou d'une marque n'est repris (et c'est interdit par les briefs de marque). | — | — |
| **8ter** | **Mise en ligne** (choix d'Ibrahim, 4 octobre 2026 : par Chrome, pas par l'API) | Dans YouTube Studio, via Claude in Chrome, sur la session déjà connectée d'Ibrahim (aucun identifiant ni jeton manipulé par Claude) : upload de la version accélérée (§6bis), titre, description, chapitres, tags, sous-titres `.srt`, **cases de déclaration (v2, 29/10/2026, remplace la règle du 20/10 « toujours NON ») : « promotion rémunérée » cochée pour toute vidéo sponsorisée (règle YouTube, loi française du 9 juin 2023) ; « Utilisation de l'IA » (contenu modifié ou synthétique réaliste) cochée quand YouTube l'exige, avec la même règle que la pastille `[AI-LABEL]` (§ 4.5) ; la mention de collaboration reste aussi dans la vidéo et la description, et on applique ce que demande le contrat de la marque**, miniature fournie par Ibrahim, écran de fin. La vidéo reste en **privé ou programmée**. On n'utilise pas l'API YouTube : un projet non audité verrouille les vidéos en privé, et l'écran de fin n'y existe pas. | Un récapitulatif de la mise en ligne (lien Studio, réglages) | **Le clic sur « Publier » : uniquement après un « oui » explicite d'Ibrahim, à chaque vidéo** (et accord de la marque si le contrat le prévoit) |
| **9** | **Boucle d'apprentissage** (72 h après publication) | Lecture de la courbe de rétention fournie par Ibrahim (capture d'écran ou chiffres) : chute à 30 s, 3 décrochages, pic | Une ligne ajoutée à `analysis/registre.md` + une proposition d'ajustement du playbook | Les ajustements du playbook (§11) |

**Règles du process :**
- **Valider bloc par bloc, même en urgence (règle non négociable, retour d'Ibrahim, 6 octobre 2026).** Sur Higgs Influ 2, la vidéo a été montée d'un bloc pour sortir le soir même : au visionnage, il a fallu reprendre presque tout (face cam pendant la lecture du script, captures fixes au lieu de vidéos, cartes assombries, musique trop forte, démo ennuyeuse, flou sur la mauvaise zone). Le temps « gagné » a été reperdu en retours. **Une date de sortie urgente ne justifie jamais de sauter une validation** : si le délai est intenable, Claude le dit et propose de décaler, il ne bâcle pas.
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

**Statut : standard pour toutes les vidéos**, généré par défaut à l'étape 8.

**But :** quelqu'un qui veut reproduire le tutoriel trouve tout dans la description, **sans réfléchir ni retaper quoi que ce soit**.

**v2 : le dossier du test.** Pour une vidéo de test ou de défi, les ressources deviennent **le dossier du test** :
- les règles ;
- le budget ;
- le registre jour par jour (dépenses, gains, captures) ;
- le bilan ;
- « ce que je referais autrement ».

Les prompts n'y figurent que quand la consigne compte pour l'histoire (L1, L6). La méthode ci-dessous reste valable pour ces prompts et pour les vidéos C.

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
| **2. Structure** | Preuve avant 5 s · protocole et Tableau du défi avant 60 s · sponsor vers 1:30-2:00 · re-engagement vers 3 min · pas d'E→E · boucles refermées · chapitres YouTube = chapitres visuels | Partiellement : typage des beats |
| **3. Son** (casque puis haut-parleur de téléphone) | Rien plus fort que la voix · pas de trou d'ambiance · musique qui descend sous la parole · −14 LUFS / −1 dBTP | Oui pour les niveaux. L'écoute finale reste celle d'Ibrahim. |
| **4. Lisibilité** (téléphone, bras tendu) | Textes ≥ 44 px · chaque texte tenu assez longtemps · écrans lisibles · aucune donnée perso · rien dans les zones d'interface YouTube · **lignes rouges à l'image (§ 4.9)** · **chaque chiffre affiché a sa ligne dans `registre.json`** · montants en euros | Oui pour tailles et durées. Contrôle visuel des planches. |
| **+ Positionnement** (v2) | Promesse du titre et de la miniature tenue avant 0:30 · protocole avant 60 s · pas de passage « tuto » de plus de 60 s sans enjeu · sponsor à sa place (§ 1bis) · fin réelle cohérente avec le hook et la miniature · réactions d'Ibrahim gardées · pas de suspense sous un passage pratique | Non : relecture de Claude, puis Ibrahim |
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
- Garder Ibrahim à l'écran pendant qu'il lit son script (§4.4ter), même sous une illustration.
- Illustrer avec une capture fixe ce qui existe en vidéo (un geste, une tendance, une recherche) : on montre la vidéo (§4.4bis).
- Flouter tout l'écran pour masquer une donnée : on floute la zone, pas ce qu'Ibrahim montre.
- Une démo de plus de 15 s sans aucun événement à l'écran (§4.2bis).
- Masteriser chaque bloc puis les recoller. La bande son finale est reconstruite d'un seul tenant, puis masterisée une seule fois (§13).
- **(v2)** Monter un passage en « tuto » pas à pas sans enjeu : l'outil sert le test, il n'est pas le sujet d'une leçon.
- **(v2)** Afficher un chiffre sans capture réelle ni ligne dans `registre.json`, ou garder une trace de la fin non tournée.
- **(v2)** Mettre une musique de suspense sous un passage pratique, ou couper les rires et les ratés d'Ibrahim.
- **(v2)** Montrer une ligne rouge (§ 4.9) : religion, politique, chiffres du business indonésien, visage de l'enfant, chaînes faceless.
- **(v2)** Recopier la miniature d'un autre créateur, ou y mettre un chiffre différent de celui de la vidéo.

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

- **Dérushage et voix basse (Higgs Influ 3, 6 octobre 2026)** : `derush2.py` coupe à l'énergie. Sur une voix enregistrée bas (−26 LUFS), ses consonnes faibles passent sous le seuil et **des mots disparaissent** (« posté 319 », « partout »…). Toujours lancer le **contrôle des mots perdus** (chaque mot de la transcription littérale et de l'alignement doit tomber dans un segment gardé ou dans une coupe validée) avant d'envoyer l'aperçu de l'étape 3. Si le contrôle échoue : ne couper que les vrais silences (énergie < plancher + 10 dB, aucun mot, ≥ 0,2 s), méthode de `montages/higgs-influ3/03-audio/build_step3.py`. Une prise serrée gagne alors très peu : ne pas promettre de gain de durée avant cette mesure.

- **Commandes enchaînées sur le Mac : jamais de commande dans une variable (Higgs Influ 3, 7 octobre 2026).** Le shell est zsh, qui ne découpe pas `$K` en mots : `K="ssh -i … root@IP"; $K …` échoue (« no such file »). Une chaîne de rendu lancée ainsi s'est arrêtée après la première étape, et 2 h 30 ont été perdues. Pour une chaîne d'étapes (rendu → bande son → assemblage), écrire un **script bash dans un fichier** (`#!/bin/bash`, `set -euo pipefail`) et le lancer en arrière-plan, puis **vérifier qu'il tourne** quelques minutes après.

- **Un seul rendu à la fois sur le serveur (Hostinger Produits, 11 octobre 2026).** `render_remote.sh` écrit toujours dans `/root/rendu/raw.mp4` et `DONE` : deux rendus lancés en même temps s'écrasent (le second fait `rm -f raw.mp4 DONE` pendant que le premier tourne). Avant de lancer un bloc, vérifier qu'aucun `render_remote.sh` ne tourne (`ps aux | grep render_remote`) ; pour enchaîner, un script qui attend la fin du précédent. Ne pas lancer non plus de capture Chrome sur le serveur pendant un rendu.
- **Captures de pages de marque redirigées selon le pays** : depuis l'Indonésie, hostinger.com/fr redirige vers la version indonésienne. Le serveur (Allemagne) n'a pas suffi (Chrome sans interface bloqué). Ce qui marche : le VPN d'Ibrahim réglé sur la France, puis `webcap.mjs` sur le Mac (vérifier `curl ipinfo.io/country` = FR).

### 13.4 Rendu
- **Validation par parties, toujours** : même pressé, on montre la vidéo à Ibrahim **par parties** (blocs ou aperçu découpé) avant la version finale. Tout raccourci du process est annoncé explicitement (retour d'Ibrahim, 5 octobre 2026).
- **Règle d'Ibrahim (4 octobre 2026) : aucun rendu sur le Mac.** Tout rendu, qu'il s'agisse d'images de contrôle, de prototypes, de blocs ou de la vidéo finale, se fait sur le serveur.
  - **Pourquoi** : sur le Mac, chaque image refait le bundle (20–40 s) et occupe la machine pendant qu'Ibrahim travaille. Sur le serveur, il n'y a qu'un bundle et les images partent en parallèle : 11 images en 1 min 25 s, envoi compris.
  - **Restent sur le Mac** les opérations de quelques secondes qui ne sont pas des rendus Remotion : extraire une image d'une source avec ffmpeg, faire une mesure, préparer l'audio, faire une planche-contact.
  - `analysis/cloud/sync.sh <IP> <slug>` envoie le code et les médias de la vidéo. Seuls les fichiers modifiés partent.
  - `analysis/cloud/stills_remote.sh <IP> <slug> <Composition> <dossier> t1 t2 …` produit les images de contrôle : 1 bundle, 8 images en parallèle, puis rapatriement.
  - Prototypes et blocs : `render_remote.sh` ou `chain_blocs.sh`.
  - Si le serveur est éteint, Claude demande à Ibrahim avant tout rendu local.
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

**Construits (v2, 29/10/2026), dans `src/montage/Defi.tsx`** (planches de démo `DefiDemoWide` et `DefiDemoVertical` dans `src/montage/DefiDemo.tsx`, données fictives) :
- **Registre du test** : type `Registre`, `checkRegistre` (refuse un montant sans capture), `etatAt`, `eur`, `registreCues` ;
- `DefiBoard` (le Tableau du défi) et `DayPill` (« Jour 3/7 · 48 € / 100 € »), alimentés par le registre ;
- `Timer` (chrono réel, ancres horaires des rushes, accéléré signalé) ;
- `PlanVsResult` (généralise `ResultDuo`, avec repères ✓ / ✗) ;
- `VerdictTag` ;
- `LowerThird` interview (prénom · métier · ville, montant en euros) ;
- `BigWordCaptions` (un mot géant à la fois) ;
- `VerticalMaster`, `SafeText`, `V_SAFE` et `VerticalCounter` (9:16, zones sûres, § 14).

**Style validé par Ibrahim le 29/10/2026** (images de contrôle rendues sur le serveur 65.108.151.88, copie dans `~/ibrahim-brand/montage-v2/`). Ces composants sont désormais le style de référence des vidéos du positionnement.


Ordre = impact sur les tutos ÷ effort. ✅ = déjà prouvé dans le test MINIMAX v3.

| Lot | Composants | Effort |
|---|---|---|
| **Lot 0 (fait)** | ✅ `[FAUX-MULTICAM]`, ✅ `[PUSH-IN]` fluide, ✅ `[KCAP]` avec temps de lecture, ✅ insert preuve téléphone, ✅ SFX calés sur le pic, ✅ traitement voix + master −14 LUFS | — |
| **Lot 1 : démos d'écran** | `[SCREEN-STAGE]` (établissement → plongée → tenue, piloté par points focaux), `[GLIDE]` + `[PIP]`, `[SPOTLIGHT]`, `[GEN-WAIT]` + badge, `[CURSOR]` | Moyen. C'est le plus rentable : 85 % des vidéos. |
| **Lot 2 : structure** | `[DEFI-BOARD]` (ex-`[TUTO-MAP]`), `[STEP-CARD]` + jingle, `[CHAPTER-PILL]`, `[STEP-LT]`, `[CHECKLIST]`, `[BRIDGE]` (détection automatique dans le transcript) | Faible à moyen |
| **Lot 3 : lisibilité et preuve** | `[PROMPT-CARD]`, `[RECREATE]`, `[HIGHLIGHT]`, `[SHOWCASE]`, `[STAT]`, `[LEDGER]`, `[PROOF-3T]` | Moyen |
| **Lot 4 : récit et CTA** | `[GLASS-LIST]`, `[KEYLINE]`, `[FLOW-LINE]`, `[TEASER]`, `[CTA-DEMO]`, `[STORY-ILLU]` (définir le style IA maison) | Moyen |
| **Lot 5 : outillage** | `edit-plan.json` → Remotion, ducking automatique, contrôles de relecture automatiques, module de restructuration | Moyen |

**Prérequis côté tournage et export :**
- pistes séparées (face cam, écran, audio) ;
- face cam en 4K si possible ;
- export d'au moins 20 Mbit/s en 1080p, ou ProRes ;
- voix enregistrée plus fort (−18 à −12 dBFS en crête).

---

## 14. Formats courts 9:16 (v2, 29/10/2026)

**À quoi ça sert** : les 9 formats courts (C1 à C9) et les 3 à 5 extraits de chaque vidéo longue. Scripts dans `~/ibrahim-brand/scripts-tournage/`.

| Élément | Règle |
|---|---|
| Fichier | **Un seul fichier maître** 1080×1920, 30 i/s, sans filigrane, pour TikTok, Instagram Reels et YouTube Shorts. Ce qui change d'une plateforme à l'autre : légende, titre du Short (≤ 100 caractères), couverture du Reel. |
| Zones sûres | Texte entre **15 % et 75 %** de la hauteur ; marges à droite (boutons) et en bas (légende). |
| Accroche | La promesse est tenue dans les **5 premières secondes** ; le montant ou l'enjeu est à l'écran dès la 1re seconde (`04a` point 2). Premier changement visuel avant 2 s. |
| Sous-titres selon le format | **Tests filmés à la main** (C1, C2, C3, C7) : peu ou pas de sous-titres, le texte sert aux chiffres et aux étapes. **Formats parlés** (C4, C5, C6, C8) : sous-titres incrustés, un mot géant à la fois (C6) ou 2 à 4 mots (C4, C5, C8). **C9** : pas de voix, le texte porte tout. Toujours relus. |
| Image | Brute pour les tests et les vlogs (selfie, vue subjective) ; plus propre pour les interviews (`04a` point 11). Inserts aux couleurs de la charte (compteur, verdict). |
| Durées | 22 à 32 s (C9) ; 45 s à 2 min (les autres). Si une version de plus de 60 s perd des vues sur Shorts, on prévoit une coupe de 60 s au plus. |
| Compteurs, verdict, lignes rouges | Mêmes règles qu'en vidéo longue (§ 4.4, 4.8, 4.9 ; règles 15 à 17). |
| Séries | « Jour N » (C3), « Épisode N » (C7), titre fixe (C4) : **gabarit fixe** (même ouverture, même compteur, même fin), construit une fois et réutilisé. |
| Son | Voix au-dessus de tout, master −14 LUFS. Musique selon le § 5bis (pas de suspense sur un passage pratique). |
| Process court | 1. Brief (script + rushes + fin réelle + registre) → 2. 1er montage complet → 3. **validation d'Ibrahim** → 4. légendes, titre, couverture. Pas de prototype ni de blocs. Cible : **≤ 30 min de montage par format court** (checklist). Rendus sur le serveur, jamais sur le Mac. |
| Extraits d'une vidéo longue | Repris du montage validé (pas de nouveau rendu de l'habillage si possible), recadrés en 9:16 avec le visage ou l'action au centre, accroche réécrite pour les 5 premières secondes. |

