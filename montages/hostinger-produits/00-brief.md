# Hostinger Produits Digitaux : créer et vendre un e-book avec l'IA (Étape 0 : brief)

*PLAYBOOK §8, étape 0. Fichiers reçus le 11 octobre 2026. Planches : `00-brief/ecran.jpg` (une image toutes les 15 s), `00-brief/visage.jpg`, `00-brief/cles.jpg`.*

## 1. Ce qui est reçu

| Fichier | Contenu | Technique |
|---|---|---|
| `~/Desktop/Hostinger Produits Digitaux footage.mp4` | Face cam, nouveau décor (fond brun-rouge sombre, micro sur bras) | 1920×1080, 30 i/s, 8,0 Mbit/s, 15:35,7 |
| `~/Desktop/Hostinger Produits Digitaux capture.mp4` | Écran du Mac | 1920×1080, 30 i/s, 2,8 Mbit/s, 15:35,7 |
| Audio | **Identique sur les deux fichiers** (empreinte identique) : pistes déjà synchronisées | AAC 44,1 kHz stéréo, **−28,0 LUFS** (voix basse, à remonter à −16) |

- **Source déjà dérushée** : aucune pause de plus de 1,2 s et aucune coupe d'image détectée. Pas de dérushage à faire.
- **Pas de 4K** : zooms face cam plafonnés à ×1,08.
- **Débit de l'écran faible (2,8 Mbit/s)** : les petits textes (prompts, e-book) seront recréés en grand plutôt que zoomés (règle 6).

## 2. Ce que montre l'écran

| Source | Écran | Usage prévu |
|---|---|---|
| 0:00 – 1:15 | Noir | Face cam (hook, intro) |
| ~1:15 – 1:30 | Accueil du navigateur Brave | ⚠️ barre de favoris personnelle visible (onglets YouTube perso) : à flouter ou recadrer |
| 1:30 – 4:30 | **Claude** (Sonnet 5) : conversation « Idées de mini produits digitaux à vendre », puis génération de l'e-book PDF de 24 pages « Monétiser sa chaîne YouTube depuis l'Afrique francophone » | Démo Claude, prompts à recréer en grand |
| 4:45 – 6:30 | Hostinger : accueil, offres (2,99 € / 3,99 € / 7,99 €), **paiement** | ⚠️ e-mail et données de paiement à flouter |
| 6:45 – 8:00 | Hostinger : inscription, « Comment voulez-vous créer votre site ? », mode de création, nom de domaine, « Alors, que souhaitez-vous créer ? » | Démo sponsor |
| 8:15 – 9:00 | Retour sur Claude (prompt de la page de vente, 9 sections) | Prompt à recréer en grand |
| 9:00 – 12:45 | Hostinger (éditeur avec Agent, onglet E-commerce) : page de vente « Votre chaîne a des milliers de vues. Pourquoi 0 $ sur votre compte ? », prix 19 $, modifications, tunnel de paiement (« Test Payment ») | Démo sponsor, cœur de la vidéo |
| 13:00 | « Félicitations, votre site est publié ! » (monetiser-youtube-afrique-254202.hostingersite.com) | Temps fort / preuve |
| 13:15 – 13:30 | Nom de domaine | Démo sponsor |
| 13:45 – 15:35 | Claude, couverture de l'e-book | Outro (à préciser à l'étape 1) |

## 3. Questionnaire (à valider avant l'étape 1)

1. **Sponsor** : Hostinger, comme la vidéo précédente ? Si oui, toutes les démos Hostinger restent intactes (§1bis). **Code promo KAMARA7** à réutiliser ? Lien partenaire ?
2. **Claude** est-il aussi partenaire, ou seulement un outil ? (Si non sponsorisé, on peut resserrer la démo Claude.)
3. **Titre et miniature** prévus (la promesse) ?
4. **Vidéo vers laquelle renvoyer** à la fin ? (Proposition : la vidéo Hostinger « site internet avec l'IA ».)
5. **Vitesse ×1,10** partout, démo Hostinger comprise (accord du sponsor) ?
6. **Données à flouter** : e-mail et paiement au checkout, barre de favoris du navigateur. Le nom de domaine temporaire peut rester visible ?
7. **L'e-book PDF** : peux-tu me le donner (pour le montrer en grand, et pour le mettre en ressource dans la description) ? Et la page de vente publiée est-elle encore en ligne (captures HD) ?
8. **Ressources de la description** (§8bis) : prompts Claude, prompt de la page de vente, checklist. Autre chose à ajouter ?

## 4. Estimation de la suite

| Étape | Contenu | Coût / temps |
|---|---|---|
| 1 · Analyse | Transcription Whisper mot par mot, typage des beats, regard caméra (`gaze.py`), diagnostic | ~10 min machine, ~50k tokens |
| 3 · Audio | Voix à −16 LUFS, pas de coupe (source déjà dérushée) | ~20k tokens |
| 4 · Plan | Habillage, textes exacts, musique par partie | ~80k tokens |
| 5 · Prototype 60 s | Première minute au style v2, rendu sur le serveur | ~60k tokens, ~5 min de rendu |
| 6–8 | 4 blocs d'environ 4 min, assemblage, livrables, miniature | ~250k tokens, ~40 min de rendu sur le serveur |

Vidéo de 15:36 (×1,10 ≈ 14:11), soit 1,7 fois la vidéo Hostinger précédente.

## 5. Réponses d'Ibrahim (11 octobre 2026) · ✅ brief validé

- **Sponsor : Hostinger.** Code promo **KAMARA7** (à l'écran et en description). Toutes les démos Hostinger restent intactes (§1bis).
- **Claude n'est pas partenaire** : la démo Claude n'est pas protégée par le §1bis (on reste toutefois sur la règle « pas de restructuration » : aucune coupe de contenu sans demande).
- **Vitesse ×1,10** partout, démo Hostinger comprise.
- **Nom de domaine temporaire** : visible.
- **PDF de l'e-book** : Ibrahim le fournit.
- Pas encore de titre ni de miniature (étape 8bis-M).
- **Pour le reste, Claude décide selon le playbook** : floutage e-mail, paiement et barre de favoris ; renvoi de fin vers la vidéo Hostinger « site internet avec l'IA » ; ressources de description = prompts Claude, prompt de la page de vente, checklist.
