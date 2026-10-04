# Charte visuelle v2 — chaîne Ibrahim Kamara

*Point 5 des retouches, 4 octobre 2026. Sources :*
- *9 explainers SaaS YouTube (Addx, Burnwe, Solair ×3, What a Story, Zelios ×3) ;*
- *11 aperçus Envato ;*
- *l'espace membre `new style formation`, direction « Noir & Lime » validée par Ibrahim.*

*Planches : `analysis/identite-v2/sheets/`. Statut : **validée par Ibrahim le 4 octobre 2026** (planche `analysis/identite-v2/planche/`).*

## 1. Le constat

### Ce que font toutes les références

1. **Pas de coupes, du mouvement continu.**
   - En moyenne 0 à 3 coupes franches par minute. Seuls le showreel Burnwe et quelques aperçus Envato en ont davantage.
   - Les scènes s'enchaînent par la caméra : travelling, zoom dans une carte, morphing d'un élément vers le suivant.
2. **Une idée par écran.**
   - Une phrase courte, centrée, en gros corps.
   - Un seul mot clé dans la couleur d'accent : « Clear *hierarchy* », « Nothing gets *missed* », « Time *for* ».
3. **Texte qui sort du flou.** Chaque mot apparaît flou, légèrement décalé vers le bas, puis devient net. Autres variantes : texte tapé avec curseur clignotant, mot qui glisse.
4. **Interfaces réelles mises en scène.**
   - Captures inclinées en perspective 3D (8 à 15°), posées sur un fond.
   - Cartes en verre qui flottent au-dessus, avec ombre douce.
   - Profondeur de champ : l'arrière-plan est flou.
   - Un curseur qui clique.
5. **Une seule teinte d'accent sur un fond quasi uni.**
   - Fond très sombre éclairé par un halo ou un faisceau de lumière directionnel (Solair, Zelios NeuraFlow, Envato 03/06).
   - Ou fond clair laiteux (Flike, LangEase, Alex), parfois en alternance pour le rythme.
6. **Motifs récurrents de l'IA** : étoile à 4 branches (✦), anneaux d'orbite, pastilles arrondies (pills), cartes de statistiques à gros chiffres.
7. **Grain léger** sur tout l'écran, ce qui donne un rendu « cinéma » plutôt que « PowerPoint ».

### Ce qui cloche dans la charte actuelle

- Bleu #3060ff générique et fond aurora trop chargé : ça ne ressemble à rien de reconnaissable.
- Plus Jakarta Sans en graisse 700–800 : trop « startup enthousiaste » pour un personnage sérieux.
- Les inserts arrivent en coupe franche plein écran au lieu de naître d'un mouvement.

## 2. La décision : aligner la chaîne sur l'espace membre (« Noir & Lime »)

Ton espace membre a déjà une identité forte et premium, que tu as validée. En la reprenant pour la chaîne, le spectateur qui passe de la vidéo à la formation reste dans le même univers. C'est la logique de marque des références : chaque studio garde une seule teinte du début à la fin.

Ce positionnement colle aussi au ton sérieux : un noir profond et calme, avec le lime utilisé avec parcimonie pour ce qui compte. On trouve exactement ce rendu dans la référence Envato 04 (« Flow AI », cartes lime à gros chiffres).

## 3. Les jetons

| Rôle | Valeur | Usage |
|---|---|---|
| Fond | `#090b08` | Tous les fonds d'insert |
| Surface | `#12160f`, `#181d14` | Cartes, panneaux |
| Texte | `#f2f5ec` | Titres |
| Texte doux | `#dce3d3` | Corps |
| Atténué | `#9ba394` | Légendes, sources, contexte |
| Trait | `#262c21`, ou blanc à 8 % | Bordures |
| **Accent lime** | `#c6f36d` | **1 élément par écran maximum** : mot clé, chiffre héros, CTA |
| Lime profond | `#8dbb3a` | Dégradés, halo |
| Lime fond | `#1e2712` | Pastilles (texte lime sur fond lime sombre) |
| Bon / mauvais | `#8ee3a1` / `#ff8a7a` | Avant/après, erreurs, ✓ ✗ |

**Lumière** :
- halo radial lime à 16 % en haut à droite ;
- second halo à 10 % en bas à gauche ;
- grain fractal à 5 %, comme sur l'espace membre ;
- jamais d'aurora multicolore.

**Verre** :
- dégradé blanc 5,5 % → 1,5 % ;
- bordure blanche à 8 % ;
- reflet intérieur en haut ;
- rayon 28–36 px.

**Carte lime** (chiffre héros) :
- dégradé `#ddfb95` → `#c6f36d` → `#a6d64c` ;
- texte `#0d1208` ;
- ombre lime.

## 4. Typographie

- **Geist** pour tout, en graisse 500 (titres) et 400 (corps), avec un approche serrée de −0,03 em sur les titres. Fini les graisses 800.
- **Instrument Serif *italique*** pour **le** mot qui porte l'émotion de la phrase, en lime ou en blanc. C'est la signature de l'espace membre (« Ton *projet* ») ; elle remplace le surlignage.
  - Exemple : « comment être *recommandé* par les IA ».
- **Sur-titres** : majuscules, 0,16 em d'espacement, lime, petit corps. Exemple : « ÉTAPE 3 · LE RAPPORT ».
- **Tailles** (lecture sur téléphone) :
  - phrase-thèse 110–140 px ;
  - chiffre héros 220–300 px ;
  - texte de carte 44–56 px minimum ;
  - légende 30–34 px.

## 5. Le mouvement (la grammaire v2)

| Geste | Description | Remplace |
|---|---|---|
| **Sortie de flou** | Mot par mot : flou 12 px → 0, y +18 → 0, opacité 0 → 1, 0,45 s, décalage 0,08 s entre les mots | Apparition sèche des mots |
| **Plongée** | La face cam recule et rétrécit en carte arrondie ; la capture d'écran arrive inclinée (rotateX 10°) et se redresse en se rapprochant | Coupe franche vers l'insert |
| **Mise au point** | Arrière-plan flou à 6–10 px et assombri ; la carte au premier plan est nette, avec ombre | Inserts plats |
| **Carte héros** | Le chiffre arrive dans une carte lime ou en verre, le chiffre roule, puis une légende atténuée | `Stat` actuel |
| **Pastilles** | Pills arrondies en verre, l'une après l'autre (0,12 s), légère montée | Tuiles de couleurs |
| **✦ IA** | Étoile à 4 branches lime pour marquer « l'IA » ; anneau d'orbite pour les moteurs IA | Rien |
| **Curseur** | Curseur macOS qui glisse et clique (avec le son de clic), dans les démos | Rien |

Règles de rythme :
- toujours entrer en mouvement, jamais en coupe sèche ;
- tenir chaque écran au temps de lecture (règle déjà validée) ;
- sortir par un fondu doux ou une sortie de flou.

## 6. Ce qu'on garde

- La logique et le timing des composants validés : Le Glissé, Prompt décortiqué, Carte du tuto, temps de lecture, zooms fluides plafonnés.
- La face cam reste le fil conducteur. Les inserts naissent d'elle et y reviennent.
- Le flou des données personnelles et la règle sponsor : on habille autour des démos, jamais dessus.

## 7. Les risques à surveiller

- **Lime et logo AIsa** : on vérifie que le lime ne jure pas avec la couleur du sponsor quand sa page est à l'écran. Si c'est le cas, on passe en neutre pendant les démos sponsor.
- **Trop de noir** : sur 20 minutes, il faut alterner. On garde des scènes claires laiteuses pour 1 insert sur 4 environ (variante « clair » de la charte, comme dans Flike et LangEase), à tester.
- **Lisibilité mobile** : les tailles minimales de la section 4 ne sont pas négociables.
