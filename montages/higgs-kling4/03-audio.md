# Higgs Kling 4.0 : étape 3, montage audio

*30 octobre 2026. Script : `03-audio/process_voice.py` (chaîne validée sur AIsa, § 5 du playbook).*

- **Aucune coupe** (décision d'Ibrahim, voir `01-analyse.md` § 4) : la voix garde l'horloge de la source, 19 min 33.
- **Chaîne** : DeepFilterNet doux (12 dB) → passe-haut 70 Hz → compression 2:1 → normalisation −16 LUFS en 2 passes. Jamais `afftdn`.
- **Mesure** : source −18,2 LUFS → voix traitée **−16,0 LUFS**.
- **À écouter** :
  - `03-audio/ecoute_avant_apres_50s.mp3` : les 25 premières secondes brutes, puis les mêmes 25 s traitées ;
  - `03-audio/voix_traitee_complete.mp3` : toute la voix traitée.
- **🔒 À valider** : la qualité de la voix (pas de son métallique, pas de souffle, niveau régulier).
