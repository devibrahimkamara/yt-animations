# Banc d'essai du rendu — 4 octobre 2026

**Machine :** MacBook Air M2 (8 cœurs, 16 Go), utilisée en même temps par Ibrahim. Bruit de mesure observé : ±15 % (V3 et V3b, même réglage, 95 s contre 110 s).

**Protocole :**
- 3 extraits de 4 s de `MontageAisa`, soit 360 images : *lourd* (phrase sur face cam floutée), *écran* (Bing + médaillon + chiffre héros), *visage* (face cam + icônes) ;
- rendu H.264 CRF 12 ;
- fidélité mesurée contre la référence V0 (SSIM 1,0 = identique ; PSNR ≥ 45 dB = invisible à l'œil).

**Point de retour :** branche `optim-rendu`, tag git `avant-optim`.

| Variante | Réglages | Temps (360 images) | Gain | SSIM | PSNR |
|---|---|---|---|---|---|
| V0 référence | PNG, 4 rendus parallèles | 78,6 s | — | 1 | — |
| V1 | JPEG 95 | 74,1 s | −6 % | 0,981–0,990 | 46,6–48,8 dB |
| **V2** | **GPU (`--gl=angle`)** | 63,9 s | **−19 %** | 0,993–0,996 | 50,3–51,4 dB |
| V3 / V3b | Grain précalculé | 95,1 / 109,6 s | **+21 à +39 %** (plus lent) | 1,000 | identique |
| V8 | GPU + grain précalculé | 74,7 s | −5 % | 0,993–0,996 | 50,3–51,4 dB |
| **V7** | **GPU + JPEG 95** | **42,4 s** | **−46 %** | 0,981–0,989 | 46,2–47,1 dB |
| V4 | GPU + JPEG 95 + grain | 45,1 s | −43 % | idem V7 | idem V7 |
| V9 | GPU + JPEG 100 + grain | 59,1 s | −25 % | 0,989–0,992 | 48,0–48,7 dB |
| V5 / V6 | V4 avec 3 / 6 rendus parallèles | 44,4 / 43,1 s | ≈ V4 | idem | idem |

## Conclusions

1. **Le GPU est le vrai levier.** Il gagne 19 % à lui seul, avec une image quasi identique (PSNR > 50 dB). Les infimes écarts viennent de l'anticrénelage calculé par la carte graphique.
2. **Le JPEG 95 ne gagne presque rien seul (−6 %), mais combiné au GPU il double la vitesse (−46 %).** Avec le GPU, la capture des PNG devient le goulot. Fidélité : PSNR 46–47 dB. Aucune différence visible en zoom (`comparaison_zoom.png`).
3. **Le grain précalculé est une fausse bonne idée.** Il est plus lent dans tous les cas : sans doute le chargement de l'image dans chaque onglet coûte plus cher que le filtre SVG. À abandonner.
4. **Le nombre de rendus en parallèle (3, 4 ou 6) ne change rien sur ce Mac.** 3 suffit et laisse plus de RAM pour travailler à côté.

## Projection sur la vidéo complète (39 030 images)

| Réglage | Durée estimée |
|---|---|
| Actuel (V0) | ~2 h 20 |
| GPU seul (V2) | ~1 h 55 |
| GPU + JPEG 95 (V7) | **~1 h 15** |
| Un bloc de 3 min (5 444 images) avec V7 | **~11 min** (contre ~20–25 min) |
