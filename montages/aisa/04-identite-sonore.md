# Identité sonore — vidéo AIsa

*PLAYBOOK §5bis. Choix validés par Ibrahim le 4 octobre 2026, sur la page d'écoute (chaque musique mixée sous un passage de sa voix tiré de la même partie). Source : Epidemic Sound (abonnement Creator, chaîne sur liste blanche).*

## Ton général

Sérieux, enquête, tension retenue. Ça va de la curiosité à la révélation, jusqu'au climax « trouver des clients ».

## Musiques, une par partie

| Partie | Temps (timeline v2) | Rôle / énergie | Musique (Epidemic, id) | Tempo | Ambiances |
|---|---|---|---|---|---|
| Intro / hook | 0:00–1:44 | Tension retenue · 3/5 | **Mistaken Identity** · Blue Saga (151300) | 90 | Dark / Suspense · Ambient / Pulses |
| Étape 1 · Ta preuve | 1:44–4:04 | Curiosité, enquête · 3/5 | **Radar Focus** · Blue Saga (283360) | 100 | Mysterious / Restless · Ambient / Pulses |
| Étape 2 · Les outils | 4:04–9:04 | Concentration, discret · 2/5 | **Open Road** · Lennon Hutton (151120) | 100 | Suspense / Restless · Ambient / Pulses |
| Étape 3 · Le rapport | 9:04–13:34 | Révélation, respiration · 3/5 | **Domestic** (146771) | 68 | Hopeful / Dreamy · Ambient |
| Étape 4 · Le plan SEO | 13:34–17:55 | Méthode, analyse · 3/5 | **Luxx** · Out To The World (253055) | 96 | Dark / Suspense · Ambient / Suspense |
| Étape 5 · Trouver des clients | 17:55–fin | Climax qui monte · 4/5 | **Exile** · Henry Miles (283665) | 92 | Epic / Fear / Dark · Orchestral Hybrid / Pulses |

**Cohérence** : tempos entre 90 et 100 BPM, sauf Domestic (68 BPM). C'est la respiration voulue au moment du rapport, qui fait contraste avant de repartir. L'énergie monte jusqu'à la fin, sans baisse dans le dernier tiers.

**Transitions** : fondu enchaîné de 1,5 s sous chaque carton d'étape. La musique se coupe avant le rapport (respiration) et pendant le noir de suspense du cold open.

**Niveaux** : environ 13 dB sous la voix pendant la parole, et +3 à +5 dB pendant les cartons, les showcases et le teaser.

## Effets sonores (kit Epidemic, rotation pour éviter la répétition)

| Famille | Sons retenus | Usage |
|---|---|---|
| Whoosh | whoosh low short 01 · 02 · 03 · 05 | Cartons d'étape, entrées d'insert, Le Glissé |
| Impact | boom cinematic big · deep · hit low · low hit | Révélations (51 900, 97 %, coûts, 10 prospects), fin du cold open |
| Riser | riser clean · reverse · suspense · whoosh | Avant chaque révélation (pic calé sur l'image) |
| Pop | ui notification 02 · 12 · select a · select b | Textes, pastilles, tuiles |
| Clic | button press a · b · magic keyboard key · ui notification 05 | Clics dans les démos |
| Validation | achievement · alert achievement · alert attention · ui notification 13 | Sous-étapes cochées, « ✓ AIsa connecté » |
| Texture de suspense | pad deep a · pad deep b | Le noir du cold open |

## Fichiers HQ (téléchargés le 4 octobre 2026)

Rangés dans `public/epidemic/hq/` : `m0…m5_*.mp3` pour les musiques, `<famille>_<nom>.mp3` pour les effets. Le kit `SFX_KIT` et la table `MUSIC` sont dans `src/montage/lib.tsx`.

- Chaque fichier a été vérifié contre son extrait d'écoute par corrélation de spectrogrammes : 28 sur 32 sont identiques (score 1,00).
- Remplaçants, de la même famille, à valider à l'écoute :
  - alert attention → `confirm_alert_03` ;
  - alert achievement → `confirm_alert_07` ;
  - pad deep a et b → `drone_pad_sub` (Drone, Pad, Ambience, Sub 02) ;
  - `pop_notif_03` en plus.
- Gains calculés pour que chaque famille sorte au niveau effectif de l'ancien kit (whoosh −20,5 dB, impact −17, pop −21,5, clic −25, validation −23,5, riser −22,5, nappe −27).
- Musiques : niveau intégré entre −11,3 et −12,9 LUFS, ramené à environ −29 LUFS par `musicGain()`.
