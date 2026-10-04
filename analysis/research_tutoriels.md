# Monter un tutoriel YouTube (outils IA, logiciels, démos d'écran) pour maximiser la rétention

*Recherche documentaire, octobre 2026. Contexte : chaîne FR IA / make money. Format : ~85 % de capture d'écran avec webcam en médaillon, intro et outro face caméra. Exemple de référence : tuto « créer un jeu mobile avec MiniMax Code », 9 min 43.*

## Légende de fiabilité (à lire d'abord)

- **[MESURÉ]** : étude empirique avec méthode publiée (papier académique, données de plateforme, enquête avec échantillon déclaré).
- **[DONNÉE SECONDAIRE]** : chiffre repris par des blogs ou outils marketing dont la méthode est opaque ou que je n'ai pas pu remonter jusqu'à la source primaire. Utile pour s'orienter, pas pour décider seul.
- **[EXPERT]** : consensus ou opinion de praticiens (monteurs, créateurs, éditeurs d'outils). Aucune mesure contrôlée derrière.
- **[DÉRIVÉ]** : règle chiffrée que je propose en combinant plusieurs sources. À calibrer sur les analytics de la chaîne.

Avertissement général : il circule énormément de chiffres de rétention invérifiables (« +34 % de complétion avec la webcam », « +85 % de watch time grâce aux pattern interrupts », « chapitres = +30 % »). Je les signale comme tels. Les sources les plus solides de ce rapport sont Guo et al. 2014 (6,9 millions de sessions vidéo), l'étude TechSmith 2024 (~1 000 répondants), les principes de Mayer et les données de rétention de YouTube lui-même.

---

## 1. Structure d'un tutoriel à forte rétention

### Ce qui est mesuré

- **La chute du début est la plus grosse perte.** Un rapport de benchmark (Retention Rabbit 2025, >10 000 vidéos, cité par Kontentino) annonce une rétention moyenne de 23,7 % et 55 % de spectateurs perdus dans les 60 premières secondes, avec des how-to éducatifs autour de 42 % (https://www.kontentino.com/social-media-urban-dictionary/retention-rate/) **[DONNÉE SECONDAIRE]**. Le document interne de MrBeast Productions donne un cas réel : 21 millions de spectateurs perdus en première minute sur 60 millions (https://www.alexanderjarvis.com/memo-how-to-succeed-in-mrbeast-production/) **[MESURÉ, un seul cas]**.
- **YouTube mesure lui-même l'intro.** Dans « Moments clés », YouTube affiche le % de spectateurs encore là à 30 s. Une bonne valeur signifie que l'ouverture correspond à ce que promettaient la miniature et le titre (https://support.google.com/youtube/answer/9314415) **[MESURÉ, outil plateforme]**.
- **Pourquoi les gens quittent un tuto** (TechSmith Video Viewer Study 2024, ~1 000 répondants, https://assets.techsmith.com/docs/TechSmith-Video-Viewer-Study-2024.pdf) **[MESURÉ, déclaratif]** :
  - 33 % ont trouvé l'info cherchée avant la fin. C'est un départ « normal » pour un tuto.
  - 25 % disent que la vidéo ne contenait pas l'info attendue. C'est un décalage entre promesse et contenu.
  - 22 % trouvaient la vidéo ennuyeuse. Les 4 causes citées : voix monotone, manque de concision, longueur, digressions.
  - 9 % sont partis à cause d'une mauvaise qualité : son et image floue arrivent à égalité, devant les explications insuffisantes.
  - Conseil explicite du rapport : arriver vite au sujet et ne pas s'attarder sur l'intro ou le contexte.
- **Les tutos se regardent de manière non linéaire.** Guo, Kim et Rubin (2014, 6,9 M sessions edX) montrent que les tutoriels sont plus souvent revus que les cours, et que les gens y sautent aux passages utiles. Leur recommandation : ajouter des repères visuels pour faciliter le survol, par exemple de gros blocs de texte aux transitions (https://up.csail.mit.edu/other-pubs/las2014-pguo-engagement.pdf) **[MESURÉ]**.
- **Chapitres.** À leur lancement (mai 2020), YouTube a indiqué que les chapitres poussent les spectateurs à regarder une plus grande partie de la vidéo et à y revenir plus souvent (https://www.socialmediatoday.com/news/youtube-rolls-out-video-chapters-to-all-creators/578811/) **[MESURÉ par YouTube, sans chiffre publié]**. Les chiffres « +30 % », « +8-10 % (TubeBuddy) » et « +64 % » qui circulent (https://timeskip.io/blog/youtube-chapters) sont **[DONNÉE SECONDAIRE]**.
- **Prévisualiser la tâche aide l'apprentissage.** Les lignes directrices de van der Meij pour les vidéos de formation logicielle demandent de prévisualiser la tâche (organisateur préalable), de garder des segments courts avec un début et une fin nets, et de synchroniser l'action à l'écran avec la narration. Elles ont été testées en 3 études : meilleure motivation, meilleure maîtrise et meilleure rétention à une semaine (https://research.utwente.nl/en/publications/eight-guidelines-for-the-design-of-instructional-videos-for-softw/ ; version à 11 lignes directrices, 2022 : https://doi.org/10.55177/tc786532) **[MESURÉ]**.

### Règles actionnables

1. **0–5 s : montrer le résultat final.** Le jeu mobile qui tourne, l'appli générée, le chiffre gagné. Plan plein écran, sans logo ni générique. *Pourquoi* : le spectateur d'un tuto vient d'une recherche et veut vérifier tout de suite que la vidéo livre ce résultat (https://tubemilestone.com/blog/structure-youtube-tutorial) **[EXPERT]**. C'est aussi ce que demande YouTube : coller à la promesse titre/miniature dans les 30 premières secondes **[MESURÉ, cf. ci-dessus]**.
2. **5–20 s : la promesse en une phrase**, face caméra ou en voix sur le résultat : « En 10 minutes, sans coder, tu vas avoir ce jeu sur ton téléphone. » Puis une raison de rester : ce qui rend la méthode différente, ou un piège que tu vas éviter.
3. **20–35 s : feuille de route courte.** 3 à 5 étapes affichées en liste animée qui restera le fil conducteur, plus les prérequis (compte, prix, outil). Ne pas dépasser environ 15 s. Le schéma « prouver le titre en 10 s → pourquoi c'est important en 10 s → feuille de route en une ligne » est le format recommandé par plusieurs praticiens (https://outlierkit.com/resources/youtube-hooks-and-retention/) **[EXPERT]**.
4. **Pas de générique ni de « salut tout le monde, aujourd'hui… » avant 20 s.** Les longues intros animées figurent parmi les causes classiques d'une chute de 20 à 40 % dans les 15–30 premières secondes (https://subscribr.ai/youtube-strategy/what-is-good-youtube-audience-retention) **[EXPERT]**.
5. **Chapitres YouTube** (premier à 0:00, au moins 3, chacun ≥ 10 s), alignés sur les étapes de la feuille de route, **et chapitres visuels dans la vidéo**. Une carte « Étape 2/5 – Générer les assets » de 1,5 à 2 s à chaque transition matérialise les « gros blocs de texte » recommandés par Guo et al. et le principe de segmentation de Mayer.
6. **Re-engagement autour de 3 min et de 6 min.** Le doc MrBeast prévoit un moment fort vers la 3e minute et un autre vers la 6e. Après 6 min, le public déjà investi tolère des passages plus explicatifs **[EXPERT, chaîne de divertissement]**. Transposé à un tuto : vers 3 min, montrer un premier résultat intermédiaire spectaculaire (le jeu qui tourne déjà en version brute). Vers 6 min, montrer l'amélioration la plus visuelle.
7. **Boucles ouvertes.** Annoncer tôt un élément qui ne sera livré que plus tard, par exemple « à la fin je te montre comment le publier sur le Play Store, c'est là que la plupart bloquent », puis rappeler la promesse tous les 2 à 3 min (https://outlierkit.com/resources/youtube-hooks-and-retention/) **[EXPERT]**. Attention : l'« effet Zeigarnik », souvent invoqué pour justifier cette technique, ne se réplique pas sur la mémoire. Une méta-analyse de 2025 (37 études) ne trouve pas de meilleur rappel des tâches interrompues, mais trouve une tendance à vouloir *reprendre* une tâche interrompue (effet Ovsiankina) (https://ideas.repec.org/a/pal/palcom/v12y2025i1d10.1057_s41599-025-05000-w.html) **[MESURÉ]**. Conclusion : la boucle ouverte peut fonctionner comme promesse de suite, mais ne la vends pas comme de la « science ».
8. **Placement du CTA ou du sponsor.** Placer le sponsor en milieu de vidéo, une fois qu'une vraie valeur a été livrée et avant la phase de conclusion. Il doit être court et intégré au récit plutôt que présenté comme une rupture de ton (https://creatorsagency.co/blog/youtube-creator-audience-retention-finance-sponsors) **[EXPERT]**. Pour un tuto IA, l'idéal est que le sponsor *soit* une étape de la démo. Le CTA « abonne-toi » doit être lié à une valeur (« si le jeu marche chez toi… ») et durer moins de 5 s, jamais dans les 30 premières secondes.
9. **La fin : ne pas l'annoncer.** Le doc MrBeast recommande de ne jamais signaler la fin et de terminer abruptement **[EXPERT]**. Seuls environ 16 % des spectateurs atteignent les 10 dernières secondes (Retention Rabbit, via https://research.stripo.email/youtube-benchmarks) **[DONNÉE SECONDAIRE]**. Proscrire « voilà, c'est tout pour aujourd'hui ». Enchaîner le dernier résultat sur un renvoi vers une autre vidéo (« la suite logique, c'est… ») pendant les 20 dernières secondes, la zone des écrans de fin. Ne pas ajouter d'écran de fin *après* le contenu (https://broadcastbeat.com/news/use-youtube-end-screens-to-retain-viewers) **[EXPERT]**.
10. **Accepter les départs « réussis ».** Un tiers des sorties de tuto viennent de gens qui ont obtenu ce qu'ils voulaient (TechSmith) **[MESURÉ]**. Il vaut mieux garder l'étape la plus demandée au milieu, ou glisser un bonus non annoncé dans le dernier tiers, que de la livrer en premier. Le doc MrBeast et OutlierKit conseillent tous deux de placer le meilleur moment vers les deux tiers de la vidéo **[EXPERT]**.

---

## 2. Montage des captures d'écran

### Ce qui est mesuré

- **Signalisation (Mayer).** On apprend mieux quand des indices visuels soulignent l'essentiel : flèches, encadrés, surlignage (https://ugc.futurelearn.com/uploads/files/7d/d6/7dd6188d-c343-4311-b064-ac98d2c95abc/Multimedia_Principles._R._E._Mayer__2020.pdf ; synthèse appliquée à la vidéo : Brame 2016, https://pmc.ncbi.nlm.nih.gov/articles/PMC5132380/) **[MESURÉ]**.
- **Les écrans de code et de slides engagent moins que l'humain qui annote.** Guo et al. : les tutos « style Khan » (main qui dessine) sont regardés 1,5 à 2 fois plus longtemps que les screencasts de code ou de slides. Leur recommandation : quand on montre du code ou des slides, ajouter de l'emphase en dessinant par-dessus **[MESURÉ]**. Pour nous, cela veut dire que les annotations animées (cercles tracés, flèches, surlignage) compensent la froideur d'un écran brut.
- **Effet du « cueing » sur les tutos logiciels : mitigé.** Certaines études ne trouvent aucun effet. D'autres trouvent un effet chez les apprenants de niveau intermédiaire, mais pas chez les experts (https://eproceedings.epublishing.ekt.gr/index.php/cetpe/article/view/3779 ; https://ir.lib.uth.gr/xmlui/handle/11615/78446) **[MESURÉ]**. Conséquence : les indices doivent guider le regard, pas décorer. Trop d'indices équivaut à aucun indice.
- **Les spectateurs réclament des « focus indicators ».** Dans l'enquête TechSmith, un son clair, des graphismes professionnels et des indicateurs montrant où regarder sont classés parmi les caractéristiques visuelles les plus importantes **[MESURÉ, déclaratif]**.
- **Webcam / présence du formateur.** Guo et al. : alterner tête parlante et slides engage davantage que des slides seuls **[MESURÉ]**. Mais les revues de littérature trouvent que le formateur à l'écran (souvent en médaillon) est apprécié sans améliorer clairement l'apprentissage. Il peut même créer une attention partagée quand il n'est pas nécessaire, et il aide surtout les spectateurs à faible mémoire de travail (https://pmc.ncbi.nlm.nih.gov/articles/PMC9861543 ; https://link.springer.com/article/10.1007/s10639-022-11532-4) **[MESURÉ]**. TechSmith : 87 % préfèrent un vrai humain à un avatar ou une IA, mais seulement 14 % citent « voir le visage » comme raison de rester **[MESURÉ, déclaratif]**. Le chiffre « +34 % de complétion avec webcam » (vibrantsnap) est **[DONNÉE SECONDAIRE]**.

### Règles actionnables

**Zoom / recadrage dynamique**
1. **Zoomer sur chaque zone d'action** : clic, saisie, menu ouvert. Facteur 1,6 à 2,2× pour une UI web en 1080p. Le texte de l'UI doit faire au moins ~28–32 px de hauteur une fois zoomé, puisque le visionnage se fait en grande partie sur mobile (cf. la règle mobile du projet). **[DÉRIVÉ]**
2. **Durée des transitions de zoom : 0,4 à 0,8 s** en ease-in-out (courbe ressort amortie ou ease cubique), puis **tenir le zoom au moins 1,5 à 2 s**. Les tutoriels d'outils parlent de 1 à 2 s pour un zoom « marqué » et de 2 à 3 s pour un zoom « subtil » (https://www.temperstack.com/learn/screen-studio/add-zoom-effects/) **[EXPERT]**. En pratique, pour un tuto rythmé, une transition de 0,5 à 0,6 s suffit **[DÉRIVÉ]**.
3. **Fusionner les clics proches.** Si deux actions sont à moins d'environ 1,5 s et dans la même région, garder le zoom et faire un panoramique doux au lieu de dézoomer puis rezoomer. Les outils d'auto-zoom (Screen Studio, Tella, Canvid) déclenchent un zoom par clic, et leurs propres guides prévoient de supprimer ou corriger les zooms superflus (https://screen.studio/guide/disable-automatic-zooms- ; https://www.tella.com/blog/how-to-add-auto-zoom-to-screen-recordings) **[EXPERT]**.
4. **Dézoomer pour réorienter** au moins à chaque nouvelle étape ou nouvel écran, pendant 1 à 2 s en vue large, pour que le spectateur sache où il se trouve dans l'interface. Ensuite, rezoomer. **[EXPERT/DÉRIVÉ]**
5. **Flou de mouvement léger** sur les zooms et panoramiques, et **lissage du curseur** (Screen Studio les active par défaut et lisse les mouvements saccadés : https://daveswift.com/screen-studio/) **[EXPERT]**.

**Temps morts et attentes**
6. **Couper toute frappe de plus de 2 s.** Afficher le texte final d'un coup, ou faire un effet de frappe accéléré (×4 à ×8). Pour un prompt long, montrer le prompt complet en carte lisible (zoom, fond assombri) pendant le temps de lecture (cf. §3), plutôt que de le regarder se taper. **[EXPERT]**
7. **Attentes de génération IA ou de chargement :** ne jamais laisser plus d'environ 2 s d'attente réelle.
   - Attente de moins de 10 s : accélération ×4 à ×8.
   - Attente de plus de 10 s : coupe en « time skip » avec un badge du type « ⏩ 3 min 20 de génération » ou un compteur qui défile, puis arrivée directe sur le résultat. C'est aussi une info utile (le spectateur saura combien de temps ça prend chez lui).
   - Supprimer les attentes de chargement et les errances de souris (https://wowto.ai/blog/10-screen-recording-tips-create-better-video-tutorials ; https://www.techsmith.com/learn/tutorials/academy/screen-recording-basics-video-editing-part-2/) **[EXPERT]**.
8. **Silences entre les phrases :** les ramener à 0,15–0,35 s. Garder 1 à 2 s de « respiration » après un résultat important (https://www.vibrantsnap.com/fr/blog/how-to-make-tutorial-videos-people-watch) **[EXPERT]**.

**Mise en évidence**
9. **Spotlight :** assombrir le reste de l'écran (opacité 50 à 65 %) autour d'un rectangle arrondi sur l'élément clé, pendant 1,5 à 3 s. À réserver aux moments « c'est ICI que ça se passe » : bouton critique, champ de clé API, réglage piège. Une à trois fois par minute au maximum. **[EXPERT/DÉRIVÉ]**
10. **Encadré ou cercle tracé à la main** : animation de 0,3 à 0,5 s. Un seul indice actif à la fois, et sa couleur d'accent ne doit pas exister ailleurs dans l'UI montrée. Les indices restent en place tant que la voix en parle. Fondement : principe de signalisation, et main qui annote chez Guo. **[MESURÉ (principe) + EXPERT (valeurs)]**
11. **Étiquettes et callouts :** 2 à 5 mots, placés près de l'élément et pas en bas de l'écran (principe de contiguïté spatiale de Mayer). **[MESURÉ (principe)]**
12. **Curseur :** l'agrandir à 1,5–2× et le lisser. Le masquer quand il est immobile plus de 2 s. Montrer chaque clic par un anneau qui s'étend (~250 ms) avec un léger « tic » sonore (cf. §4). **[EXPERT]**
13. **Flouter les données sensibles** : e-mail, clés API, soldes, noms de clients, onglets ouverts, notifications. Utiliser un flou gaussien fort ou une pixellisation qui suit l'élément. En amont : profil de navigateur propre, notifications coupées, zoom de l'UI à 150–200 % (https://www.vibrantsnap.com/fr/blog/how-to-create-professional-tutorial-videos-2025) **[EXPERT]**.

**Webcam / face caméra**
14. **Médaillon** : 18 à 22 % de la largeur, coin opposé à la zone d'action. Le **déplacer ou le masquer** automatiquement quand il recouvre l'élément zoomé. Réduire, voire masquer le médaillon pendant les séquences de manipulation dense (plusieurs clics enchaînés), où il crée de l'attention partagée sans bénéfice. **[MESURÉ (attention partagée) + DÉRIVÉ]**
15. **Passer en plein écran face caméra** pour la promesse, les explications de « pourquoi », les mises en garde, les avis personnels et les transitions entre étapes (2 à 8 s). Varier ainsi écran et visage, c'est exactement le schéma « tête parlante alternée avec slides » que Guo et al. trouvent plus engageant. Viser **une bascule plein écran face caméra toutes les 60 à 120 s**. **[MESURÉ (principe) + DÉRIVÉ (fréquence)]**
16. **Agrandir le médaillon** (par exemple de 20 % à 35 %) quand le créateur réagit émotionnellement à un résultat : surprise, « regarde ça ». La réaction est le contenu. **[EXPERT]**

---

## 3. Rythme propre aux tutos

### Ce qui est mesuré

- **Débit de parole.** Chez Guo et al., les vidéos s'étalent de 48 à 254 mots/min (moyenne 156). L'engagement augmente avec le débit, jusqu'à 2× à durée égale. Pour les vidéos de 6 à 12 min, la tranche intermédiaire de 145 à 165 mots/min est même moins engageante que les débits lents ou rapides **[MESURÉ]**. TechSmith conseille un débit naturel et plutôt rapide, puisque le spectateur peut ralentir lui-même **[MESURÉ + EXPERT]**.
- **Durée d'engagement.** Chez Guo et al., la médiane d'engagement plafonne à environ 6 minutes, quelle que soit la longueur de la vidéo. Les auteurs recommandent des segments de moins de 6 min **[MESURÉ, MOOC, public captif]**. Côté YouTube, TechSmith 2024 constate que les vidéos de 10 à 19 min sont désormais le format préféré pour un contenu pédagogique (25 %). Près d'un tiers juge qu'au-delà de 20 min c'est trop long **[MESURÉ, déclaratif]**. Conclusion pour 9–10 min : la durée convient, à condition d'être découpée en segments de 1 à 3 min avec début et fin nets (van der Meij).
- **Fréquence des « pattern interrupts ».** Une affirmation « 1 200 chaînes : changer d'angle, de graphique ou de rythme toutes les 40 s = +11 % de rétention, deux fois plus souvent = moins bon » circule sans source primaire traçable (https://www.startmotionmedia.com/27-battle-tested-tactics-to-max-video-retention) **[DONNÉE SECONDAIRE]**. L'idée qu'il existe un optimum, et qu'au-delà l'ajout d'effets nuit, est cohérente avec la littérature sur les « détails séduisants » : 58 études et 7 500 élèves montrent qu'un contenu intéressant mais hors sujet fait baisser l'apprentissage (https://news.wsu.edu/press-release/2020/03/19/seductive-details-inhibit-learning) **[MESURÉ]**.
- **Fatigue du « retention editing ».** Une enquête YPulse indique que 74 % des 13–39 ans préfèrent du contenu spontané au contenu très scripté (https://www.ypulse.com/newsfeed/2024/04/02/young-people-are-getting-tired-of-retention-editing-on-youtube/) **[MESURÉ, déclaratif, indirect]**.
- **Redondance (Mayer).** On apprend moins bien avec narration + texte identique à l'écran qu'avec la narration seule. Exceptions documentées : texte plus court que la narration (mots-clés), termes techniques ou inconnus, rythme lent ou contrôlé par l'apprenant, absence d'image (https://cloud.wikis.utexas.edu/wiki/x/2wJqAw) **[MESURÉ]**.
- **Vitesse de lecture des sous-titres.** Netflix plafonne à 20 caractères/s pour les adultes et 17 pour les enfants. La TV classique travaille à 12–15 car./s. La BBC vise 160–180 mots/min. Le spectateur doit aussi « lire » l'image (https://titlevision.dk/sm/reading_speed.htm ; https://hun.proz.com/forum/subtitling/369973-style_guide_of_subtitling.html) **[MESURÉ / normes industrielles]**.

### Règles actionnables

1. **Il y a deux tempos.**
   - Le tempo de *forme* (silences, attentes, intro) doit être agressif.
   - Le tempo de *fond* (une action importante à reproduire) doit laisser le temps de voir : chaque action critique reste lisible au moins 1,5 à 2 s après le clic avant de passer à la suite.
   - Ne jamais couper *pendant* le clic qu'on explique. **[DÉRIVÉ]**
2. **Changements visuels en tuto :** viser **un événement visuel « significatif » toutes les 5 à 12 s** : zoom ou panoramique, changement d'écran, callout, bascule webcam, carte de chapitre. Pas de changement purement décoratif (zoom punch sans raison, glitch, emoji) plus d'une fois toutes les 20 à 30 s. Un vlog peut couper toutes les 2 à 4 s, alors que le tuto se rythme sur les *actions*. **[DÉRIVÉ, à valider sur la courbe]**
3. **Chaque effet doit répondre à « où regarder maintenant ? ».** Sinon, le couper. C'est le principe de cohérence de Mayer (élaguer l'accessoire) et la logique Fireship : une image qui n'amuse pas, n'enseigne pas ou ne fait pas transition est coupée (https://www.wisp.blog/blog/how-to-create-video-content-like-fireship-hyperplexed-and-juxtoposed) **[MESURÉ (principe) + EXPERT]**.
4. **Ralentir volontairement** (moins de coupes, zoom tenu 3 à 4 s, pas de musique montante) aux 3 ou 4 moments où l'utilisateur risque de se tromper : clé API, paramètre caché, commande à copier. Ajouter un **marqueur « ⚠️ »** et éventuellement un arrêt sur image avec le texte à recopier. **[EXPERT/DÉRIVÉ]**
5. **Mini-récap à chaque fin d'étape** (3 à 5 s) : la checklist de la feuille de route se coche avec l'étape terminée. Prévoir aussi un récap final de 10 à 15 s *avant* le dernier résultat ou bonus, pas après. C'est un repère pour ceux qui survolent (Guo : les tutos sont revus et survolés). **[MESURÉ (principe) + DÉRIVÉ]**
6. **Texte à l'écran :**
   - Mots-clés uniquement, 2 à 6 mots, jamais la transcription de la phrase en cours (redondance).
   - Exceptions à afficher en entier : noms d'outils, URL, prompts, chiffres, commandes (termes techniques, cf. exceptions de Mayer).
7. **Durée d'affichage** **[DÉRIVÉ des normes de sous-titrage]** :
   - En concurrence avec une UI à regarder, on retient environ 12–15 caractères/s (≈ 2,5 mots/s).
   - **Durée = max(1,2 s ; nb_mots / 2,5 + 0,5 s)**.
   - Un prompt de 40 mots demande donc environ 16 s, ou bien on le montre brièvement en disant « tout le prompt est en description ».
8. **Sous-titres dynamiques** (mot par mot) : ils sont utiles pour le face caméra, en particulier sur mobile ou sans le son. **À couper sur les passages de capture d'écran**, où ils entrent en compétition avec l'UI pour le regard. Sinon, les limiter à une ligne de 3 à 5 mots en bas, en évitant la zone des contrôles du lecteur. **[MESURÉ (redondance/attention partagée) + EXPERT]**

---

## 4. Son

### Ce qui est mesuré / normé

- **YouTube normalise vers −14 LUFS intégrés.** Il ne fait que *baisser* les vidéos plus fortes et ne remonte jamais une vidéo trop faible. Prévoir un plafond de crête vraie à −1 dBTP, à cause du réencodage Opus/AAC. La valeur « content loudness » est visible dans « Stats for nerds » (https://www.meterplugs.com/blog/2019/09/18/youtube-changes-loudness-reference-to-14-lufs.html ; https://youlean.co/?p=30813) **[MESURÉ / observé]**.
- **Un mauvais son fait partir les gens.** Chez TechSmith, c'est la première cause d'abandon pour qualité, à égalité avec l'image floue. 35 % citent une narration de qualité comme raison de rester. Seulement 13 % citent la musique de fond **[MESURÉ, déclaratif]**.
- **La musique peut nuire à l'apprentissage.** Les méta-analyses sur les détails séduisants (Rey 2012, WSU 2020) montrent un effet négatif. La pénalité mémoire de la musique serait concentrée sur ce qui est dit *pendant* la musique, alors qu'elle augmente l'engagement attentionnel (https://culturaesaude.med.br/en/background-music-increases-viewer-engagement-a-systematic-review-and-meta-analysis/) **[MESURÉ, source secondaire de qualité moyenne]**. Van der Meij et Hopfner (2022) consacrent d'ailleurs une ligne directrice spécifique à la musique de fond (https://doi.org/10.55177/tc786532).

### Règles actionnables

1. **Master final : −14 LUFS intégrés (±1), crête vraie ≤ −1 dBTP.** Viser −16 LUFS ne pose pas problème, mais être plus faible fait paraître la vidéo plus terne que les autres. **[MESURÉ/NORME]**
2. **Voix** : passe-haut à 80 Hz, débruitage léger, de-esser, compression 3:1 à 4:1 (2 à 6 dB de réduction), de-plosive. Crêtes de voix vers −6 / −3 dBFS, voix seule autour de −14 à −16 LUFS court terme. TechSmith recommande aussi de retirer bruits de bouche et plosives **[EXPERT]**.
3. **Musique sous la voix : −18 à −25 dB sous la voix** (https://vidpros.com/fix-background-music-too-loud-video/), avec ducking de 15 à 25 dB, attaque de 10 à 30 ms et relâchement de 200 à 500 ms (https://openclip.app/learn/audio-ducking.md) **[EXPERT]**. Pour un tuto, la musique doit à peine s'entendre sous la voix : **au minimum −20 dB sous la voix pendant les explications denses**, et la remonter (−12 à −14 dB) seulement pendant les time-skips, les montages de résultat et l'intro.
4. **Style de musique** : lo-fi, électro douce ou chill-tech, sans voix ni paroles, sans mélodie très présente, tempo stable de 90 à 115 BPM. Changer de morceau ou de couche à chaque grand chapitre pour marquer la segmentation. **Couper la musique** (ou presque) aux moments « ⚠️ attention ici ». Le silence devient alors un signal. **[EXPERT + DÉRIVÉ du principe de cohérence]**
5. **Effets sonores** : clic de souris discret (−24 à −30 LUFS, court) synchronisé avec l'anneau de clic. « Whoosh » très léger sur les zooms *importants* seulement, pas sur chaque zoom. « Pop » sur l'apparition d'un callout. « Ding » ou validation quand une étape de la checklist se coche. Pendant un time-skip, un « tick » de défilement accéléré. Règle : **un effet sonore = un événement porteur de sens**. Ne jamais en mettre plus de 2 dans la même seconde. **[EXPERT/DÉRIVÉ]**
6. **Aucun effet sonore ni musique forte sur les mots-clés de la voix.** Décaler l'effet de 100 à 200 ms avant ou après le mot. **[DÉRIVÉ]**

---

## 5. Restructurer un tutoriel déjà tourné

### Principes (avis d'experts, appuyés sur les données ci-dessus)

1. **Repérer les 4 « matériaux de hook »** dans les rushes :
   - (a) le résultat final qui fonctionne ;
   - (b) la réaction la plus forte du créateur (surprise, rire, « c'est fou ») ;
   - (c) la phrase la plus intrigante ou la plus chiffrée (« ça m'a coûté 0 € », « 4 minutes ») ;
   - (d) le moment où quelque chose casse ou surprend.
   Le cold open (5 à 10 s) se monte avec (a) plus une phrase prise dans (b) ou (c). La promesse originale du créateur suit immédiatement.
2. **Déplacer la démo finale au début, mais en version courte.** Garder 3 à 6 s du résultat en ouverture, puis le résultat complet à sa place chronologique à la fin. Sans cela, le spectateur qui a tout vu au début n'a plus de raison de rester. Ajouter le marqueur « 👉 tu vas voir comment on arrive à ça ». **[EXPERT]**
3. **Supprimer** :
   - l'ancienne intro (« salut, aujourd'hui… ») si la promesse est déjà dans le cold open ;
   - les explications dites deux fois (garder la plus courte et la plus claire) ;
   - les digressions hors sujet (4e cause d'ennui chez TechSmith) ;
   - les erreurs et retours en arrière, *sauf* si l'erreur est instructive (« si tu as cette erreur, voilà pourquoi »). Une erreur instructive se garde et se signale avec un callout.
4. **Ne pas casser la compréhension :**
   - ne jamais déplacer une *étape* (dépendances de l'interface) ; seuls le résultat, les réactions et les explications de contexte se déplacent ;
   - après un saut, **réorienter** avec un plan large d'environ 1 s et une carte de chapitre ;
   - si une phrase déplacée fait référence à quelque chose de pas encore vu (« comme tu as vu… »), la couper ou la recouvrir d'un sous-titre corrigé ;
   - vérifier la cohérence visuelle : le médaillon webcam, le thème de l'UI et les onglets ouverts ne doivent pas « sauter » de façon visible. Sinon, masquer la coupe avec un zoom ou un fondu. **[EXPERT/DÉRIVÉ]**
5. **Créer des boucles ouvertes en post-production** : prendre une phrase du créateur sur une étape ultérieure (« et là le jeu s'exporte directement en APK ») et l'insérer, avec 1 à 2 s d'image, à la fin d'un chapitre précédent, en teaser « 🔜 ». **[EXPERT]**
6. **Réordonner la feuille de route** pour qu'elle colle *exactement* aux chapitres réels après montage. Promesse et contenu qui ne correspondent pas expliquent 25 % des abandons (TechSmith) **[MESURÉ]**.
7. **Pour un tuto de 9 min 43 comme MiniMax Code** **[DÉRIVÉ]**, voici une timeline cible de 8 à 9 min après nettoyage :

   | Moment | Contenu |
   |---|---|
   | 0:00–0:06 | Jeu qui tourne sur le téléphone + phrase-choc |
   | 0:06–0:20 | Promesse face caméra |
   | 0:20–0:35 | Feuille de route en 4 étapes + prérequis |
   | ~0:35 | Étape 1 |
   | ~2:30–3:00 | Premier résultat intermédiaire (re-engagement) |
   | ~4:00 | Sponsor ou CTA intégré |
   | ~6:00 | Amélioration la plus visuelle (2e re-engagement) |
   | ~7:30 | Bonus ou export (boucle ouverte refermée) |
   | Fin | Récap de 10 s puis renvoi vers une autre vidéo, sans « au revoir » |

---

## 6. Données chiffrées (récapitulatif)

| Chiffre | Fiabilité | Source |
|---|---|---|
| Engagement médian plafonné à ~6 min quelle que soit la longueur ; segments < 6 min recommandés | MESURÉ (6,9 M sessions, MOOC) | Guo et al. 2014, https://up.csail.mit.edu/other-pubs/las2014-pguo-engagement.pdf |
| Tutos « main qui annote » regardés 1,5 à 2× plus longtemps que les screencasts code/slides | MESURÉ | idem |
| Engagement jusqu'à 2× plus élevé avec un débit de parole plus rapide (plage 48–254 mots/min) | MESURÉ | idem |
| Tutos plus souvent revus et survolés que les cours → besoin de repères visuels | MESURÉ | idem |
| 33 % quittent un tuto car ils ont eu l'info ; 25 % car l'info attendue n'y était pas ; 22 % par ennui ; 9 % pour la qualité (son = image floue en tête) | MESURÉ, déclaratif (~1 000 rép.) | TechSmith 2024, https://assets.techsmith.com/docs/TechSmith-Video-Viewer-Study-2024.pdf |
| Format préféré pour la vidéo pédagogique : 10–19 min (25 %) ; ~1/3 juge > 20 min trop long | MESURÉ, déclaratif | idem |
| 87 % préfèrent un humain réel ; 14 % citent « voir le visage » comme raison de rester ; 13 % la musique | MESURÉ, déclaratif | idem |
| Les chapitres font regarder plus et revenir plus souvent (pas de chiffre) | MESURÉ par YouTube | https://www.socialmediatoday.com/news/youtube-rolls-out-video-chapters-to-all-creators/578811/ |
| 21 M de spectateurs perdus en minute 1 sur 60 M (un cas MrBeast) | MESURÉ (anecdotique) | https://www.alexanderjarvis.com/memo-how-to-succeed-in-mrbeast-production/ |
| Rétention moyenne 23,7 % ; 55 % perdus avant 60 s ; how-to ≈ 42 % ; 16 % atteignent les 10 dernières s | DONNÉE SECONDAIRE (Retention Rabbit 2025, >10 000 vidéos) | https://www.kontentino.com/social-media-urban-dictionary/retention-rate/ ; https://research.stripo.email/youtube-benchmarks |
| Repères « bonne » rétention : 50–70 % à 30 s ; ~70 % à 1 min = bon signal | EXPERT | https://subscribr.ai/youtube-strategy/what-is-good-youtube-audience-retention |
| Chapitres = +30 % / +8–10 % (TubeBuddy) / +64 % d'engagement | DONNÉE SECONDAIRE | https://timeskip.io/blog/youtube-chapters |
| Changement visuel toutes les ~40 s = +11 % de rétention (1 200 chaînes) | DONNÉE SECONDAIRE, invérifiable | https://www.startmotionmedia.com/27-battle-tested-tactics-to-max-video-retention |
| Webcam = +34 % de complétion ; couleurs de marque = +23 % de rétention | DONNÉE SECONDAIRE, invérifiable | https://www.vibrantsnap.com/fr/blog/how-to-create-professional-tutorial-videos-2025 |
| Détails séduisants (dont musique) : baisse d'apprentissage (58 études, 7 500 élèves) | MESURÉ (méta-analyse) | https://news.wsu.edu/press-release/2020/03/19/seductive-details-inhibit-learning |
| Pas d'avantage mémoire des tâches interrompues (Zeigarnik), mais tendance à reprendre (37 études) | MESURÉ (méta-analyse 2025) | https://ideas.repec.org/a/pal/palcom/v12y2025i1d10.1057_s41599-025-05000-w.html |
| Lignes directrices vidéo logicielle (aperçu, segments courts, synchronisation) → meilleures compétences et rétention à 1 semaine | MESURÉ (3 études) | van der Meij 2013, https://research.utwente.nl/en/publications/eight-guidelines-for-the-design-of-instructional-videos-for-softw/ |
| YouTube : référence −14 LUFS, baisse uniquement | MESURÉ / observé | https://www.meterplugs.com/blog/2019/09/18/youtube-changes-loudness-reference-to-14-lufs.html |
| Sous-titres : max 20 car./s adulte (Netflix), 160–180 mots/min (BBC) | NORME | https://titlevision.dk/sm/reading_speed.htm |

**Aucune étude publique sérieuse ne chiffre l'impact des zooms ou de l'auto-zoom sur la rétention YouTube.** Leur justification repose sur le principe de signalisation de Mayer et sur la lisibilité mobile, pas sur une mesure de rétention. À tester en A/B sur la chaîne, par exemple avec la fonction « Test & Compare » de YouTube ou en comparant les courbes de rétention à format égal.

---

## 7. Erreurs fréquentes qui tuent la rétention des tutos

1. **Intro avant le résultat** : générique, « salut c'est X », storytelling, contexte. C'est la première cause de chute à 30 s **[MESURÉ (YouTube intro) + EXPERT]**.
2. **Promesse non tenue ou non montrée** : la miniature montre un jeu, mais la première minute parle d'abonnement. 25 % d'abandons pour « pas l'info attendue » **[MESURÉ]**.
3. **Écran 100 % large, illisible sur mobile** : texte d'UI de 12 px, aucun zoom. Image « floue » = première cause d'abandon qualité, à égalité avec le son **[MESURÉ]**.
4. **Son médiocre** : écho, souffle, voix trop basse face à la musique, musique avec paroles **[MESURÉ]**.
5. **Temps morts** : frappe en temps réel, barres de chargement, génération IA en direct, curseur qui erre, « euh… attends… » **[EXPERT]**.
6. **Voix monotone et verbeuse**, digressions. Ce sont les 4 causes d'ennui chez TechSmith **[MESURÉ]**.
7. **Sur-montage** : zoom à chaque clic, effet sonore partout, glitch, emoji, sous-titres karaoké sur la capture d'écran. Cela produit de la surcharge cognitive et des détails séduisants, et le spectateur ne sait plus où regarder **[MESURÉ (principe) + EXPERT]**.
8. **Médaillon webcam qui masque l'action** ou qui reste fixe pendant 9 minutes sans jamais basculer en face caméra **[DÉRIVÉ]**.
9. **Aller trop vite sur l'étape critique** : coupe pendant le clic, clé API ou commande jamais lisible plus d'une seconde. Le spectateur décroche ou revient en arrière, ce qui se voit en pic de revisionnage **[EXPERT]**.
10. **Ne pas réorienter** après un changement d'écran ou d'outil (pas de plan large, pas de chapitre). Le spectateur se perd **[MESURÉ (segmentation/signalisation)]**.
11. **Signaler la fin** (« voilà, pour conclure… », long outro, écran de fin ajouté après le contenu) **[EXPERT]**.
12. **Sponsor qui rompt le ton** dans la première minute, ou longue lecture générique de fonctionnalités **[EXPERT]**.
13. **Pas de chapitres**, ou chapitres décalés par rapport au montage final **[MESURÉ (YouTube, qualitatif)]**.
14. **Données sensibles visibles** (clé API, e-mail, soldes) : risque de sécurité, et retouche après publication impossible sans ré-upload **[EXPERT]**.

---

## Note sur les chaînes de référence

Je n'ai pas trouvé d'analyse publiée et sourcée du montage de Matt Wolfe, Riley Brown, Futurepedia, Kevin Stratvert ou des chaînes FR citées. Les éléments connus restent qualitatifs :

- **Matt Wolfe** : démonstration pratique avant profondeur technique (https://automationatlas.io/creators/matt-wolfe/).
- **Fireship** : densité d'information, humour, coupe de tout ce qui n'enseigne, n'amuse ou ne fait pas transition (https://www.wisp.blog/blog/how-to-create-video-content-like-fireship-hyperplexed-and-juxtoposed).
- **Kevin Stratvert** (Camtasia) : coupes, zooms, callouts, titres, zoom et panoramique automatiques (https://techsmith.com/blog/webinars/behind-the-scenes-how-i-create-my-tutorials).
- **Ali Abdaal** : une rétention de 55–60 % sur 15–25 min est parfois avancée, sans source primaire **[DONNÉE SECONDAIRE]**.

Pour calibrer le playbook, le plus fiable reste d'analyser image par image 3 à 5 tutos à forte audience de la niche et de mesurer : nombre de zooms par minute, durée des transitions, fréquence des bascules face caméra, durée du cold open. Ces mesures servent ensuite de paramètres par défaut pour Remotion.
