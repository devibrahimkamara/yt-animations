# Hostinger Produits Digitaux (Étape 1 : analyse)

*11 octobre 2026. Sources : transcription mlx_whisper large-v3-turbo mot à mot (`01-analyse/micro.json`, `transcript.txt`), planches de l'écran toutes les 5 s (`planche_ecran_1.jpg` = source 1:15→9:00, `planche_ecran_2.jpg` = 9:00→15:36), contrôle du panier (`prix_392.jpg`). Temps = temps de la source (÷ 1,10 pour la version finale).*

## Mesures

| Mesure | Valeur | Lecture |
|---|---|---|
| Durée | 15:35,7, face cam et écran synchronisés (audio identique) | Montage direct, sans recalage |
| Débit de parole | **265 mots/min**, une seule pause ≥ 0,6 s (6:28, 0,9 s) | Déjà très serré. À ×1,10 : ~290 mots/min, comme Hostinger 1 |
| Coupes | Aucune coupe d'image ni pause longue | Source dérushée, rien à couper |
| Voix | −28,0 LUFS, bruit de fond −57 dB | Voix basse : chaîne voix validée (DeepFilterNet doux, −16 LUFS) |
| Face cam | Fond brun-rouge sombre, visage centré, 1080p | Étalonnage léger, zoom ≤ ×1,08 |
| Regard caméra (`gaze.py`) | Intro 0:00–1:15 : tangage médian −4,3°, regard bas 0,37 · fin 13:45–15:36 : +0,2°, 0,52 · démo : −8,9°, 0,74 | **Tu regardes l'objectif en intro et en fin** : face cam autorisée (§4.4ter). Pendant la démo tu regardes l'écran, qui est montré de toute façon |

## La carte de la vidéo (beats)

| Source | Beat | Contenu | Écran |
|---|---|---|---|
| 0:00 – 0:17 | **P / C** Hook | 2021, pas d'IA, premier produit digital = « **plusieurs milliers d'euros** » | Noir (face cam seule) |
| 0:17 – 0:25 | Promesse | Toutes les étapes pour créer son premier produit digital avec l'IA | Noir |
| 0:25 – 0:37 | C | Présentation (vidéos depuis 2020) + « abonne-toi, pouce bleu » | Noir |
| 0:37 – 1:07 | E | Les **2 blocages** : créer le produit, créer la page de vente → payer quelqu'un ou ne jamais le faire | Noir |
| 1:07 – 1:20 | Plan | « l'IA et **deux outils** » ; étape 1 : le produit en quelques minutes | Noir → accueil Brave (⚠️ favoris) |
| 1:20 – 2:08 | **A** Étape 1 · Claude | Claude ou ChatGPT, prompt « idées de mini produits digitaux », pourquoi l'e-book, **faire des recherches sur Internet** | Claude : prompt, réponse |
| 2:08 – 2:28 | A | Les idées proposées : guide YouTube avec l'IA, **monétiser sa chaîne depuis l'Afrique** (article de blog qui cartonne) | Claude : liste d'idées |
| 2:28 – 3:09 | **A + E** | Prompt « e-book pro ultra complet avec des infos réelles » ; pourquoi préciser (hallucinations) ; recherches en cours (Payoneer, Wise) | Claude : prompt, recherches |
| 3:09 – 3:26 | **P** Résultat 1 | L'e-book PDF : « Monétiser sa chaîne YouTube depuis l'Afrique francophone », table des matières, plan d'action | Claude + PDF (couverture) |
| 3:26 – 4:17 | E | Vérifier les infos : prompt de relecture à donner à Claude ; exemple RPM Afrique (0,10–0,50 $) | PDF (page 4 : 0,10–0,50 $ / 3–10 $) |
| 4:17 – 4:28 | A | Télécharger le PDF | Claude |
| 4:28 – 4:45 | Transition | Étape 2 : la page de vente, livraison automatique (« pas envoyer les PDF sur WhatsApp ») | Claude → accueil Hostinger |
| 4:45 – 5:50 | **S** Sponsor | hostinger.com, offres, **Pack Unlimited 3,99 €/mois** sites illimités, idée agence, e-mail pro + domaine gratuits 1 an, création avec l'IA | Offres 2,99 / 3,99 / 7,99 € |
| 5:50 – 6:40 | **S** | Panier : 1 mois ≈ 19 €, 12 mois ≈ 53 €, **code KAMARA7 → 47,83 €** (vérifié à l'écran : −10 %, −4,79 €) | Panier (rien de personnel visible à 6:32) |
| 6:40 – 6:52 | S | Inscription, paiement (non montré) | « S'inscrire » (⚠️ e-mail à vérifier) |
| 6:52 – 8:04 | **A** Étape 2 · Hostinger | Nouveau site → « Décrivez-le, nous le construisons » → mode IA → nom de domaine temporaire (cite ibrahimkamara.com) | Parcours de création |
| 8:04 – 8:58 | **A** | Claude écrit le prompt de la page de vente (couleurs de l'e-book), **limite de 2 000 caractères** → Claude le raccourcit, copier-coller | Claude ↔ Hostinger |
| 8:58 – 9:22 | A | Génération du site (attente déjà coupée : « je reviendrai ») | Logo Hostinger, Agent qui travaille |
| 9:22 – 10:45 | **P** Résultat 2 | La page : « Votre chaîne a des milliers de vues. Pourquoi 0 $ sur votre compte ? », **19 $** choisi par l'IA, chapitres, « basé sur des données 2026 » | Page de vente, défilement |
| 10:13 – 10:50 | E | Se mettre en avant (photos, nom) pour la confiance | Page de vente |
| 10:50 – 11:35 | **A** | Modifier par prompt : mettre Ibrahim en avant dans la copie | Éditeur + Agent |
| 11:36 – 12:10 | **P** | Résultat : « Par Ibrahim Kamara », section dédiée avec son histoire | Page modifiée |
| 12:10 – 12:35 | **P** | Version mobile, bouton d'achat → panier (paiement test) | Aperçu mobile, checkout 19 $ |
| 12:35 – 13:40 | **A** | Publier → « Félicitations, votre site est publié ! », domaine temporaire, connecter un domaine personnalisé (gratuit 1 an, ~10 €/an ensuite) | Publication, domaine |
| 13:45 – 14:05 | Transition | Produit + page + domaine = prêt ; « le plus dur, c'est trouver des acheteurs » | **Claude figé** |
| 14:05 – 14:46 | E | Trafic n°1 : le contenu (gratuit mais long terme) | **Claude figé** |
| 14:46 – 15:17 | E | Trafic n°2 : la publicité payante (Facebook, TikTok, YouTube Ads) | **Claude figé** |
| 15:17 – 15:36 | **S** CTA | Renvoi vers sa vidéo **Google Ads**, lien Hostinger en description et en commentaire épinglé | **Claude figé** |

## Diagnostic

1. **Le hook ne montre aucune preuve.** Pendant 1:15, l'écran est noir : Ibrahim parle de son premier produit à « plusieurs milliers d'euros » et des deux blocages, mais rien n'est montré. On ne réordonne pas : on **illustre par-dessus** dès 0:00 avec le résultat final (couverture de l'e-book, page de vente à 19 $, « site publié ») et des visuels réels (§4.4bis). C'est le premier levier.
2. **Carte du tuto toute trouvée** : « l'IA et deux outils, deux problèmes » (0:37–1:12). Carte en 3 blocs : 1. Le produit (Claude) → 2. La page de vente (Hostinger) → 3. Les clients (trafic).
3. **Démo Claude longue et textuelle (1:20–4:28, ~3 min)** : de petits textes sur fond blanc, illisibles sur téléphone. Prompts et idées **recréés en grand** (`[PROMPT-CARD]`, `[RECREATE]`), PDF montré en grand (le vrai PDF que tu fournis). Claude n'est pas sponsor, mais on garde tout (pas de restructuration).
4. **La fin (13:45 → 15:36, 1 min 51) n'a aucune image utile** : Claude reste figé pendant tout le passage sur le trafic. Il faut tout illustrer : schéma contenu vs publicité, vraies interfaces Facebook / TikTok / YouTube Ads, puis le renvoi vers la vidéo Google Ads. C'est le deuxième levier (règle 11 : le dernier tiers ne ralentit pas).
5. **Sponsor bien servi** : 3,99 €/mois, 47,83 € avec KAMARA7 (vérifié), domaine et e-mail offerts. On met en valeur le code et les chiffres. La démo Hostinger reste intacte (§1bis).
6. **Phrases à signaler (on ne coupe pas)** :
   - 5:13 « l'offre ultime, unlimited, qui est illimitée, pardon » : petite reprise, sans gravité ;
   - 6:22 « ça ne donne pas de nom » : inaudible, sens incertain ;
   - 12:55 « c'est télé public, les lives » (sans doute « c'est en ligne, public, live ») ;
   - 13:00 il lit « 256782 » alors que l'écran montre **254202** : pas d'incrustation du chiffre oral, l'écran fait foi ;
   - 15:35 « Allez, peace » (Whisper : « pis ça »).
7. **Données à masquer** : favoris du navigateur (1:15–1:20), page d'inscription (6:40–6:52, à vérifier image par image), checkout test de la page (12:20–12:35 : champs vides, paiement test, à priori OK).

## Les points forts

- **Deux résultats très visuels** : l'e-book de 24 pages au design pro et la page de vente « Pourquoi 0 $ sur votre compte ? ». C'est la matière idéale pour le hook et les Shorts.
- **Un vrai moment pédagogique** : la limite de 2 000 caractères et Claude qui raccourcit le prompt. Le problème et sa solution sont montrés à l'écran.
- **Le choix du prix par l'IA** (19 $, adapté à l'audience africaine) et la modification par prompt (« Par Ibrahim Kamara ») : deux moments « wow » simples.
- Un fil rouge clair : **2 problèmes, 2 outils**, puis le vrai défi (les clients).

## Correctifs de transcription (pour les sous-titres)

Cloud → **Claude** · Camara7 → **KAMARA7** · chat GPT → **ChatGPT** · ad cent → **AdSense** · drag and draw → **drag and drop** · monétiser YouTube Afrique.256782 → nom affiché à l'écran · « pis ça » → **peace**.

## Ce qu'il me faut pour la suite

- **Le PDF de l'e-book** (pour le montrer en grand et le mettre en ressource).

## Lecture du script (§4.4ter) · ajout du 11 octobre 2026

`gaze.py` sur le nouveau serveur (77.42.82.162) → `01-analyse/gaze.json`, `lecture_script.json`. Le critère absolu du playbook détecte 87 passages, mais **presque tous pendant la démo**, où tu regardes ton écran (l'écran est montré, donc sans effet). Hors démo : un seul passage de 1,2 s (0:40) et **aucun dans la fin**. Comparé par partie, ton regard est sur l'objectif en intro et en fin : la face cam y est autorisée, avec des illustrations par-dessus là où le diagnostic le demande (hook, trafic).

✅ Diagnostic validé par Ibrahim le 11 octobre 2026.
