# Test de rendu sur un serveur loué (Hetzner) — procédure

**But :** mesurer le vrai temps de rendu du **bloc 1** (3 min de vidéo, 5 444 images) sur un serveur de 48 cœurs, et le comparer aux ~25 min du MacBook Air. Le tout sans AWS, pour environ 1 € de location.

## Ce que fait Ibrahim (5–10 min, une seule fois)

1. **Créer un compte** sur hetzner.com (Cloud). Hetzner demande une vérification d'identité et un moyen de paiement. C'est à toi de le faire : Claude ne crée pas de compte et ne saisit jamais de données de paiement.
2. Dans la console Hetzner Cloud, créer un **projet** nommé « rendu-video ».
3. **Security → SSH Keys → Add SSH key**, coller cette clé publique (créée uniquement pour ces rendus, distincte de tes clés habituelles) et la nommer « remotion » :

   ```
   ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIBDqk8dBzEUtYlZcP8yIe98LqIJKIiTzZ0Qu0VvdcbO5 remotion-render@ibrahim
   ```

4. **Add Server**, avec ces réglages :
   - **Location** : Falkenstein ou Nuremberg (Allemagne) ;
   - **Image** : Ubuntu 24.04 ;
   - **Type** : Dedicated vCPU, **CCX63** (48 vCPU). S'il n'est pas disponible, prendre le plus gros CCX proposé ;
   - **SSH key** : « remotion » ;
   - **Nom** : rendu-1.

   Le serveur est facturé **à l'heure** dès sa création (~1,37 €/h pour le CCX63).
5. Me donner **l'adresse IP** du serveur. C'est tout.

## Ce que fait Claude ensuite (automatique, ~45–60 min au total)

| Étape | Script | Durée estimée |
|---|---|---|
| Installation du serveur | `setup_server.sh` (dépendances Chrome, Node 22, ffmpeg) | ~3 min |
| Envoi du code et des médias (1,3 Go) | `render_remote.sh` | 5–20 min selon ta connexion |
| Rendu du bloc 1 | idem | **à mesurer** (estimation 4–8 min) |
| Rapatriement + comparaison au rendu local (SSIM) | idem | ~1 min |

## À la fin du test (important pour la facture)

- Supprimer le serveur dans la console (« Delete »). Tant qu'il existe, il est facturé, **même éteint**.
- Option : avant de le supprimer, créer un **snapshot** (copie du serveur installé, quelques centimes par mois). Les prochaines fois, l'installation est déjà faite.

## Limites connues

- Pas de carte graphique : le rendu est logiciel, compensé par le nombre de cœurs.
- La durée d'envoi dépend de ta connexion. Pour une vraie vidéo, on n'envoie que les médias de la vidéo concernée (~1,5–2 Go).
