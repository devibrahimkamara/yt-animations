# Dérushage automatique (étape 0bis) — règles de départ

Brouillon issu des consignes d'Ibrahim au monteur (5 octobre 2026) et d'une recherche sur les pratiques pro et les outils (auto-editor, Descript, FireCut, AutoCut, Gling, TimeBolt ; Berthouzoz et al., SIGGRAPH 2012). Il sera affiné au test « higgsfield INFLU 2 ».

## Passe 1 · Le cut (mécanique)
Consigne d'Ibrahim : vidéo très dynamique. On coupe presque tous les silences, même entre les mots, sauf si la phrase devient peu naturelle. Les coupes doivent être propres, on ne doit pas les sentir.

| Réglage | Valeur de départ |
|---|---|
| Seuil de silence | Relatif au locuteur : médiane RMS des mots − 25 dB, plancher = bruit de fond + 6 dB (jamais un dB fixe) |
| Pause à partir de laquelle on coupe | ≥ 180 ms |
| Pause restante dans une phrase | 80–120 ms |
| Pause restante à une fin de phrase ou d'idée | 150–250 ms (varier selon la ponctuation, sinon c'est robotique) |
| Marge avant un mot | 40–60 ms ; 60–80 ms sur une consonne explosive ou sifflante (p, t, k, s, f, ch), poussée jusqu'au retour sous le seuil, plafond 120 ms |
| Marge après un mot | 80–120 ms, prolongée tant que l'énergie dépasse le seuil − 6 dB (traîne des sifflantes), plafond 200 ms |
| Respirations | Retirées par défaut ; gardées entières seulement avant une nouvelle idée (jamais coupées en deux) |
| Morceau gardé minimum | 0,25 s (sinon fusionné avec le voisin) ; coupe minimum 0,15 s |

**Rendre les coupes inaudibles**
- Coupe au passage à zéro (recherche ± 5 ms), puis fondu à puissance constante de 10 ms (8 à 15 ms).
- Toujours couper dans un silence, jamais au milieu d'une respiration.
- **Fond d'ambiance** (room tone, pris dans les 1 à 2 s les plus calmes du rush) posé en continu sous la voix : pas de « trous » entre les coupes.
- Niveau homogène : loudness à −16 LUFS avant la coupe. Si un raccord fait un saut de plus de 3 dB (300 ms de chaque côté), on corrige le morceau suivant avec une rampe de 20 à 30 ms.
- Image : 1 image = 1 600 échantillons (30 i/s, 48 kHz). On calcule d'abord l'EDL audio, puis on arrondit l'image **vers l'extérieur** (jamais rogner le début d'un mot).
- Passage face cam → écran : décalage L-cut de 4 à 8 images. En jump cut face cam pur : 0.

**Erreurs, reprises, mots parasites**
- Reprises : fenêtres de 4 à 8 mots, comparaison avec les 3 phrases suivantes (ou 60 s), similarité ≥ 0,6 → on garde **la dernière prise complète**. Si la dernière prise est elle-même abandonnée, on garde la précédente.
- Faux départs : phrase interrompue (sans ponctuation finale, < 70 % de la phrase reprise, suivie d'une pause > 400 ms).
- Consignes parlées : « je recommence », « on la refait », « coupe ça », « attends », « pardon », « reprends » → coupe depuis le début de la phrase précédente jusqu'à la fin de la consigne.
- Mots parasites : « euh, heu, hum, bah, ben » isolés → toujours coupés. « du coup, voilà, hein, en fait, genre, quoi » → coupés seulement s'ils sont inutiles en début ou en fin de phrase (décision au cas par cas).
- ⚠️ Whisper efface souvent les « euh » : une zone voisée **sans mot** sous elle = parasite probable.
- Reprises éloignées (refaites plusieurs minutes plus tard) : détectées par l'alignement sur le script (passe 2).

## Passe 2 · Le refining (compréhension)
Consigne d'Ibrahim : retirer ce qui n'ajoute rien (explications en trop, digressions), sans couper ce qui sert la compréhension ni ce qu'exige le brief de la marque. Sources : **le script** et **le brief de la marque**.
- Aligner la transcription sur le script, phrase par phrase (alignement local). Plusieurs passages qui correspondent à la même phrase du script = plusieurs prises → on garde la meilleure : meilleur score, puis la plus récente, moins de parasites, moins de pauses.
- Hors script : rien n'est coupé d'office. Chaque passage est **proposé** avec sa raison (ex. une 2e explication de la même idée dans les 30 s ; « comme je disais »).
- **Liste protégée** : points imposés par la marque, appels à l'action, mentions obligatoires. Jamais coupés, et leur présence est vérifiée après coupe. Les démos sponsorisées ne sont pas touchées (§1bis).
- Plafond : environ 25 à 30 % de coupe en plus du cut. Pour chaque coupe : « la phrase suivante reste-t-elle compréhensible ? »

## Contrôle
- `coupes.md` : le texte complet, les coupes barrées avec leur raison (cut ou refining), les cas douteux à part.
- Aperçu audio sur le serveur, plus un extrait de 1,5 s autour de chaque raccord signalé (saut de niveau ou de spectre).
- Validation d'Ibrahim avant l'assemblage des rushes nettoyés.
