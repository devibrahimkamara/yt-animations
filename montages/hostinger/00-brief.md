# Étape 0 — Brief · Vidéo Hostinger (site internet avec l'IA)

*PLAYBOOK §8, étape 0. Fichiers reçus le 4 octobre 2026.*

## Ce qui est reçu

| Fichier | Durée | Format | Remarque |
|---|---|---|---|
| `~/Desktop/Hostinger Site Internet capture.mp4` | 8:58,5 | 1920×1080, 30 i/s, 3,6 Mbit/s | Capture d'écran (avec le son) |
| `~/Desktop/Hostinger Site Internet footage visage.mp4` | 8:58,5 | 1920×1080, 30 i/s, 8 Mbit/s | Face cam (avec le son) |

- **Pistes séparées** et de même durée : la synchro est à vérifier par le son à l'étape 1, mais elle devrait être immédiate.
- **Face cam** : nouveau décor, plus sombre que la vidéo AIsa (fond quasi noir). L'étalonnage sera plus marqué, sans abîmer la peau.
- **Pas de 4K** : les zooms sur la face cam restent plafonnés à ×1,08 (règle validée).

## Aperçu du contenu (planche toutes les 15 s)

| Temps | Écran |
|---|---|
| 0:05 – 1:50 | Page d'accueil Hostinger, « Lancez-vous en ligne dès aujourd'hui » |
| 0:35 | Une page blanche (à identifier) |
| 2:05 – 2:20 | Offres : Premium 2,99 €, Business 3,99 €, Cloud Startup 7,99 € |
| 2:35 – 2:50 | Paiement (**e-mail et données de paiement à flouter**) |
| 3:05 | Chargement |
| 3:20 – 4:05 | Générateur IA (« Alors, que souhaitez-vous créer ? ») et un prompt préparé (ChatGPT ou Claude ?) |
| 3:35 | Un bureau ou fond d'écran avec des icônes (**à vérifier : fenêtre parasite ?**) |
| 4:20 – 4:35 | Une conversation IA (fond sombre) |
| 4:50 – 7:20 | Le site généré : garage auto « Atelier… · Votre voiture. Notre obsession » (sections, avis, réalisations, formulaire), puis des modifications |
| 7:20 – 7:35 | « Félicitations, votre site est publié ! » |
| 7:50 – 8:58 | « Quel nom de domaine souhaitez-vous connecter à ce site ? » |

## Questions de cadrage (à valider par Ibrahim)

1. **Sponsor** : Hostinger est-il le sponsor ? Si oui, toutes les démos Hostinger restent intactes (§1bis). As-tu un **code promo** ou un **lien partenaire** à afficher à l'écran et en description ?
2. **Titre et miniature** prévus (la promesse) ?
3. **Vidéo vers laquelle renvoyer** à la fin ?
4. **Segments intouchables**, en plus des démos sponsor ?
5. **Données à flouter** : e-mail et paiement au checkout. Le nom de domaine choisi peut-il être montré ?
6. **Vitesse ×1,15** (§6bis) : on l'applique ? Si Hostinger est sponsor, il faut leur accord pour accélérer les démos.
7. **Ressources de la description** (§8bis) : je les déduirai du transcript (prompt du site, étapes…). Quelque chose de précis à ajouter ?
8. **Serveur de rendu** : le CPX62 Hetzner existe-t-il encore ? (Sinon on le recrée depuis le snapshot, ou on rend sur le Mac.)

## Estimation de la suite

| Étape | Contenu | Coût / temps |
|---|---|---|
| 1 · Analyse | Transcription Whisper mot par mot, synchro, typage des beats, diagnostic | ~10 min machine, ~40–60k tokens |
| 2 à 4 | Restructuration, audio, plan (textes et musique par partie) | ~80–120k tokens |
| 5 · Prototype 60 s | Première minute au style v2 | ~60k tokens, ~5 min de rendu sur serveur |
| 6–8 | 2 à 3 blocs, assemblage, livrables, ressources | ~150–200k tokens, ~25 min de rendu sur serveur |

La vidéo est 2,4 fois plus courte que AIsa et toute la boîte à outils est prête : il faut compter **une demi-journée** de bout en bout, validations comprises.

## Réponses d'Ibrahim (4 octobre 2026) · ✅ brief validé

- **Sponsor : Hostinger.** Code promo **KAMARA7** (à afficher à l'écran et en description). Le lien partenaire viendra plus tard, `[LIEN HOSTINGER]` en attendant.
- **Vitesse ×1,15 : oui**, comme pour toutes les vidéos (§6bis). Ibrahim en assume le choix pour les démos sponsorisées.
- **Ressources de la description : oui** (§8bis).
- **Rendu** : sur le serveur Hetzner CPX62, toujours actif (204.168.149.62).
- **Pour le reste, Claude décide selon le playbook** :
  - les démos Hostinger restent intactes ;
  - floutage de l'e-mail, du paiement et de toute donnée personnelle ;
  - le nom de domaine reste visible s'il s'agit du site de démo ;
  - promesse et hook déduits du contenu ;
  - vidéo de fin à proposer à l'étape 4.
