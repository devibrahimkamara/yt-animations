# Messages de prospection (à envoyer depuis Claude Code via Gmail ou LinkedIn)

Le principe : on n'envoie pas une offre, on envoie **une observation chiffrée** tirée du rapport. Personnalise chaque crochet avec les données du fichier prospects.csv.

## E-mail

**Objet :** [Entreprise] est citée [X fois sur 10] quand on demande « [question client] » à ChatGPT

Bonjour [Prénom],

J'ai posé à ChatGPT, Perplexity et Google AI Mode les questions que vos clients posent avant de choisir un [type d'entreprise] à [ville].

Résultat : [Entreprise] apparaît dans [X] réponses sur [Y]. [Concurrent] apparaît dans [Z].

J'ai préparé un rapport court qui montre quelles questions vous font perdre des clients et les 5 contenus à créer pour être recommandé par les IA. Je vous l'envoie ?

[Ton prénom]

## Message LinkedIn (300 caractères max)

Bonjour [Prénom], j'ai testé [Entreprise] dans ChatGPT et Perplexity sur « [question client] » : vous êtes cité [X/Y] fois, [Concurrent] [Z/Y]. J'ai un rapport de 2 pages avec les contenus à créer pour remonter. Je vous l'envoie ?

## Prompt pour les envoyer depuis Claude Code

```
Pour chaque ligne de prospects.csv qui a un e-mail, prépare un brouillon Gmail à partir du modèle de 06-messages-prospection.md, en remplaçant les crochets par les données de la ligne et les résultats de visibilité IA. Ne les envoie pas : laisse-les en brouillon pour que je les relise.
```
