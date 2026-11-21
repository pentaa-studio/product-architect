# Vote en direct · Formation Music Moods

Petit outil de vote en direct pour les séances de formation : sondages, nuage de mots et QCM noté par équipe (Jazz, Rock, Électro, Hip-hop). Construit avec Claude pour remplacer Wooclap.

## Les deux écrans

- **Participants** : `https://<domaine>/s1` (le QR code s'affiche sur l'écran animateur). Prénom, équipe, puis les questions arrivent toutes seules.
- **Animateur** : `https://<domaine>/animateur?r=s1&k=<HOST_KEY>`. La clé est retenue par le navigateur après la première visite.

Raccourcis animateur : `P` mode présentation, `O` ouvrir, `F` fermer, `↑` `↓` changer d'activité, `C` correction du QCM, `H` écran d'accueil.

## Modifier les questions

Tout est dans `api/_q.js`. Une séance = une clé (`s1`, `s2`…), une liste d'activités :

- `poll` : sondage, une ou plusieurs questions
- `word` : nuage de mots (`max` = nombre de mots par personne)
- `quiz` : QCM noté, `ok` = index de la bonne réponse (0 = la première). Jamais envoyé aux téléphones.

## Technique

- Fonctions Vercel (`api/`) + pages statiques (`public/`), aucune dépendance front.
- Stockage : Vercel Blob privé. Chaque vote est un fichier dont le nom contient la réponse, donc les résultats se lisent en une seule opération `list`.
- Variables d'environnement : `BLOB_READ_WRITE_TOKEN` (ajoutée par le store Blob) et `HOST_KEY` (clé animateur).
- En local : `node dev.mjs` puis http://localhost:3311/s1 et http://localhost:3311/animateur?r=s1&k=test (stockage en mémoire).
