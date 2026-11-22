# Vote en direct · Formation Music Moods

Petit outil de vote en direct pour les séances de formation : sondages, nuage de mots et QCM noté par équipe (Jazz, Rock, Électro, Hip-hop). Construit avec Claude pour remplacer Wooclap.

## Les deux écrans

- **Participants** : `https://<domaine>/s1` (le QR code s'affiche sur l'écran animateur). Prénom, équipe, puis les questions arrivent toutes seules.
- **Animateur** : `https://<domaine>/animateur?r=s1&k=<HOST_KEY>`. La clé est retenue par le navigateur après la première visite.

Raccourcis animateur : `P` mode présentation, `O` ouvrir, `F` fermer, `↑` `↓` changer d'activité, `C` correction du QCM, `H` écran d'accueil.

## Le deck en direct

Les séances `s1`, `s2` et `s3` ont aussi leur deck (`deck: true` dans `api/_q.js`).

- **Présentateur** : `https://<domaine>/presentateur?r=s1&k=<HOST_KEY>`. Le deck à gauche ; à droite, la slide suivante, l'aide-mémoire (durée prévue et consignes), le chrono avec l'écart au plan, et l'ouverture du vote quand la slide en a un. « Fenêtre de projection » ouvre le deck seul, à partager en visio.
- **Apprenants** : la même adresse que pour voter (`/s1`). Sur ordinateur, les slides à gauche suivent le formateur (position, scores, minuteurs) et le vote reste à droite. On peut revenir en arrière ; un bouton « Revenir au direct » recale sur le formateur.
- Les decks sont dans `public/deck/` (`s1.html`, `s2.html`, `s3.html`), avec `live.js` (modes de suivi) et `notes.js` (aide-mémoire, une entrée par slide, dans l'ordre).
- La position est stockée à part des votes (`r/<salle>/slide.json`), et transmise par `/api/state`.

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
