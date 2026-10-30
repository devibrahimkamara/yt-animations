# Higgs Kling 4.0 : étape 0, brief

*30 octobre 2026. Playbook v2 (`analysis/PLAYBOOK.md`). Script : `00-brief/script.md`. Description, chapitres et sources : `00-brief/recap-description.md`.*

## 1. Fichiers reçus
| Fichier | Contenu | Format | Audio |
|---|---|---|---|
| `Higgsfield Kling Footage.mp4` | Face caméra : Ibrahim au bureau, ordinateur à gauche, plan fixe | 1920×1080, 30 i/s, 10,2 Mbit/s, **19 min 33** | Voix **−18,2 LUFS** (bon niveau, pas besoin de remonter fort), dynamique 4 LU |
| `Higgsfield Kling Screen Record.mp4` | Écran, **même durée** : pistes séparées, synchronisées | 1920×1080, 30 i/s, 7,9 Mbit/s | Même voix |

**Pistes séparées** : le « Glissé », le médaillon et le plein cadre écran sont possibles (§ 2.3).

### Ce que montre l'écran (planche `01-analyse/planche_ecran.jpg`, 1 image toutes les 10 s)
| Source | Écran | Usage |
|---|---|---|
| 0:00 – 1:35 | **Le script** (document sombre) | ❌ À ne pas montrer. Intro lue → illustrations |
| 1:40 – 4:00 | Threads : profil, puis statistiques (courbe, « 5,3 M ») | ✅ Preuve des chiffres |
| 4:00 – 5:45 | LinkedIn : profil, statistiques, post | ✅ Preuve |
| 5:50 – 7:50 | Search Console (2 sites), un article de blog | ✅ Preuve |
| 8:00 – 10:40 | **Le script** | ❌ « Ce qui a raté », transition, plan de la pub (Partie 2) → illustrations |
| 10:40 – 10:55 | Page Kling 4.0 sur Higgsfield, puis écran noir | ⚠️ Page de la marque (média kit à préférer) |
| 11:00 – 13:10 | Higgsfield, création des images K1 à K4 | ✅ 🔒 Démo sponsor |
| 13:10 – 14:20 | Une bibliothèque de visuels (posts à toi) | ⚠️ À vérifier : pas de rapport avec la démo ? |
| 14:30 – 16:00 | Kling 4.0, mode Frames, réglages, génération | ✅ 🔒 |
| 16:00 – 16:55 | **La pub de 30 s qui joue** (boutique vide → téléphone → boutique pleine → devanture le soir) | ✅ 🔒 Résultat : à remplacer par le **fichier HD** |
| 17:00 – 18:25 | Mode References : la tenue en wax, la 2e génération | ✅ 🔒 Résultat non montré : **fichier HD à recevoir** |
| 18:30 – 19:33 | **Le script** (verdict, conclusion) | ❌ → face cam ou illustrations |

## 2. Ce que le brief de la marque impose au montage (§ 1bis)
- Vidéo dédiée de **6 min ou plus**. Déroulé du site Higgsfield **à l'écran**, avec au moins 2 des 3 modes (ici : **Frames** et **References**).
- **Générations jouées en entier**, sans montage rapide qui cache la continuité. Pas d'accélération sur la démo.
- **Plan à côté du résultat** : pour Frames, les 4 images clés à côté des moments correspondants de la vidéo ; pour References, source + référence + résultat côte à côte → composant `PlanVsResult` (validé le 29/10).
- Phrases obligatoires dites à l'oral (30 s par clip, le double de Kling 3.0 ; 3 modes au même endroit ; coût visible sur le bouton Generate) : **à garder sans coupe**.
- Aucun logo ni marque de tiers à l'écran. Ne rien promettre sur la 4K, la HDR ni les 2 minutes. Le brief ne doit jamais apparaître à l'écran.
- Description : lien de suivi dans les premières lignes, mots-clés, au moins 3 chapitres en questions, commentaire épinglé (déjà rédigés dans `recap-description.md`).
- Doublage anglais automatique activé à la mise en ligne.

## 3. Ce que le positionnement impose (playbook v2)
- C'est un **défi sponsorisé** (format L1 « J'ai confié X à l'IA ») : l'outil est l'instrument du test.
- **Le Tableau du défi** pour la pub : les 4 moments du plan, cochés ✓ / ✗, et le score sur 4, avec le coût réel en crédits.
- Les chiffres de Threads, LinkedIn et des blogs viennent **des captures de l'écran** (l'écran fait foi).
- Ton sérieux mais chill : on garde les réactions.
- Musique calme sur le pratique, tension seulement avant les résultats.
- La précision « la pub n'est pas lancée » se garde sans coupe.

## 3bis. Réponses d'Ibrahim (30/10/2026)
- **Rushes déjà dérushés** par son moteur vidéo : blancs, silences et erreurs sont déjà coupés. **On ne coupe rien sans son autorisation.** Les passages de contexte qui semblent inutiles font l'objet de **propositions** dans l'analyse.
- **Média kit de la marque** : on ne s'en sert pas.
- **Fichiers HD reçus** (`00-brief/medias/`) :
  - `K1_boutique_vide.png`, `K2_telephone.png`, `K3_boutique_pleine.png`, `K4_devanture_soir.png` et `tenue_wax.png` (1024×1024, carrées) ;
  - `pub_frames_30s.mp4` : **940×940, carrée**, 30,0 s, 24 i/s ;
  - `references_wax_5s.mp4` : 1280×720, 5,0 s, 24 i/s.
- **Serveur de rendu** : 65.108.151.88, de nouveau joignable.

## 4. Ce qu'il manque (mis à jour le 30/10)
| # | Élément | Pourquoi |
|---|---|---|
| 1 | ✅ reçu · **Le MP4 HD de la pub de 30 s** (Frames) | Le lecteur de l'interface saccade (§ 4.2bis) |
| 2 | ✅ reçu · **Le MP4 HD de la 2e génération** (References, tenue en wax) | Elle n'a pas été montrée à l'écran |
| 3 | ✅ reçu · Les **4 images K1 à K4** et l'**image de la tenue**, en HD | Pour le prévu / obtenu |
| 4 | ❌ abandonné · Le **média kit** Higgsfield (Dropbox du brief) | Pour remplacer la page de la marque à 10:40 |
| 5 | Si une génération a raté puis a été relancée : les deux fichiers | Le brief apprécie qu'on montre les essais |

**Note** : le compte Higgsfield connecté à Claude n'a aucune génération Kling 4.0 : ce n'est pas le compte du tournage. Il faut donc envoyer les fichiers.

## 5. Questions à Ibrahim (🔒 à valider avant l'étape 1)
1. ~~Durée~~ : réglé. Rien n'est coupé sans accord ; les coupes de contexte sont proposées dans l'analyse.
2. **13:10 – 14:20** (bibliothèque de tes visuels) : on garde, ou c'est un passage hors sujet ?
3. **Miniature** : on suit la maquette du script (plan contre résultat : les 4 images à gauche, la pub à droite) ?
4. Vidéo vers laquelle renvoyer à la fin : « J'ai donné la même pub à 9 IA vidéo » (comme dans le script) ?
5. **Sortie** : quelle date ? La marque attend la vidéo vite après le lancement.
