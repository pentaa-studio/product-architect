// Les activités de chaque séance. Pour en ajouter : copier un bloc, changer l'id.
// kind : poll (sondage, plusieurs questions), word (nuage de mots), quiz (QCM noté).
// Dans un quiz, "ok" est l'index de la bonne réponse (0 = la première). Jamais envoyé aux téléphones.

export const SESSIONS = {
  s1: {
    title: 'Séance 1 · Comprendre, qualifier, choisir',
    acts: [
      {
        id: 'depart', kind: 'poll', title: "D'où partez-vous ?",
        questions: [
          { q: "Avez-vous déjà travaillé sur un produit ou une initiative IA ?", o: ['Oui', 'Non'] },
          { q: "Utilisez-vous l'IA dans votre travail ?", o: ['Chaque jour', 'De temps en temps', 'Presque jamais'] },
          { q: "Avez-vous déjà prototypé une app en langage naturel (vibe coding) ?", o: ['Oui', 'Non', "C'est quoi ?"] },
        ],
      },
      { id: 'ia', kind: 'word', title: "En un mot, c'est quoi l'IA pour vous ?", max: 3 },
      {
        id: 'qcm', kind: 'quiz', title: 'QCM · 10 questions sur la séance',
        questions: [
          { q: "Un LLM a d'abord été entraîné à…", o: ['Chercher des réponses sur internet', 'Prédire le mot suivant', 'Appliquer des règles écrites par des humains', 'Comprendre le sens comme un humain'], ok: 1 },
          { q: "Via une API, comme dans un produit, on paie un LLM…", o: ['Au token', 'Au nombre d\'utilisateurs', 'À la réponse, prix fixe', 'Uniquement à l\'abonnement mensuel'], ok: 0 },
          { q: "La fenêtre de contexte, c'est…", o: ['La mémoire de toutes vos conversations passées', 'Le nombre maximum de tokens que le modèle lit à la fois', "L'interface où l'on tape sa question", 'La liste des outils auxquels il a accès'], ok: 1 },
          { q: "Un LLM connaît-il le catalogue de Music Moods ?", o: ['Oui, il connaît toutes les chansons', 'Oui, s\'il a accès à internet', 'Non : il faut lui donner le catalogue dans son contexte', 'Non, et on ne peut rien y faire'], ok: 2 },
          { q: "La suppression du bruit dans Google Meet, c'est une IA…", o: ['Invisible', 'Fonction visible', 'Cœur du produit', "Ce n'est pas de l'IA"], ok: 0 },
          { q: "« Je veux trier mes playlists par date d'écoute. » Verdict de la grille ?", o: ["Clairement de l'IA", 'Peut-être, creusez', 'Pas d\'IA, du dev classique', 'Un agent'], ok: 2 },
          { q: "En plus des 3 questions de la grille, laquelle faut-il toujours se poser ?", o: ['Le CEO en a-t-il envie ?', 'Peut-on tolérer une erreur ?', 'Combien de tokens fait l\'US ?', 'Les concurrents le font-ils ?'], ok: 1 },
          { q: "Chaque avis App Store est classé par l'IA, puis un ticket Jira est créé. Le chemin est fixé à l'avance. C'est…", o: ['Une automatisation', 'Un workflow IA', 'Un assistant', 'Un agent'], ok: 1 },
          { q: "Agent = modèle + …", o: ['Prompt', 'Harnais', 'Base de données', 'Interface'], ok: 1 },
          { q: "Le MCP, c'est…", o: ['Un modèle d\'Anthropic', 'Une prise standard entre l\'IA et vos outils', 'Une méthode d\'entraînement', 'Un type d\'agent'], ok: 1 },
        ],
      },
      {
        id: 'retient', kind: 'poll', title: "Ce qu'on retient",
        questions: [{ q: 'Lequel vous a le plus servi ?', o: ['Comprendre', 'Qualifier', 'Choisir'] }],
      },
      { id: 'repart', kind: 'word', title: 'Un mot pour dire avec quoi vous repartez', max: 1 },
    ],
  },
  s2: {
    title: 'Séance 2 · Cadrer la valeur',
    acts: [
      {
        id: 'qcm', kind: 'quiz', title: 'QCM · 10 questions sur la séance',
        questions: [
          { q: "Les trois niveaux de la chaîne d'impact, dans l'ordre :", o: ['Stratégique, activation, opérationnel', 'Opérationnel, activation, stratégique', 'Activation, opérationnel, stratégique', 'Données, modèle, UX'], ok: 1 },
          { q: "Le taux d'écoute complète des playlists générées est un indicateur…", o: ['Opérationnel', "D'activation", 'Stratégique', 'De coût'], ok: 1 },
          { q: "Un modèle très précis que personne n'utilise…", o: ['Rapporte quand même', 'Ne rapporte rien', 'Finit toujours par rapporter', 'Est un KPI stratégique'], ok: 1 },
          { q: "Dans le retour d'expérience sur le churn, la première version reposait sur…", o: ['Un modèle de deep learning', 'Un agent', 'Des règles simples, sans IA', 'Un fine-tuning'], ok: 2 },
          { q: "Une hypothèse de la chaîne d'impact s'écrit…", o: ['Si…, alors…, ce qui…', 'En tant que…, je veux…', 'Étant donné…, quand…, alors…', 'Objectif, résultats clés'], ok: 0 },
          { q: "Chez Anthropic, un token généré coûte, par rapport à un token lu…", o: ['Le même prix', 'Moins cher', 'Environ 5 fois plus cher', '100 fois plus cher'], ok: 2 },
          { q: "Qu'est-ce qui fait le plus grimper la facture de tokens ?", o: ["Le nombre d'écrans de l'app", 'Le volume, la taille du contexte et le choix du modèle', 'Le nombre de développeurs', 'La langue des réponses'], ok: 1 },
          { q: "Pour adapter un modèle à son métier, on commence par…", o: ['Le fine-tuning', 'Entraîner son propre modèle', 'Le prompting, puis le RAG si besoin', 'Le modèle le plus gros'], ok: 2 },
          { q: "Le MVD, c'est le…", o: ['Minimum Viable Design', 'Minimum Valuable Data', 'Maximum Value Delivered', 'Model Validation Dataset'], ok: 1 },
          { q: "Lequel n'est PAS un coût caché d'un projet IA ?", o: ["L'évaluation des réponses", 'La conduite du changement', 'La maintenance des prompts', 'Le nom de la fonctionnalité'], ok: 3 },
        ],
      },
      {
        id: 'retient', kind: 'poll', title: "Ce qu'on retient",
        questions: [{ q: 'Lequel vous a le plus servi ?', o: ['Prouver', 'Chiffrer', 'Commencer petit'] }],
      },
      { id: 'repart', kind: 'word', title: 'Un mot pour dire avec quoi vous repartez', max: 1 },
    ],
  },
  s3: {
    title: 'Séance 3 · Prototyper et pitcher',
    acts: [
      {
        id: 'pitch', kind: 'poll', title: 'Le vote du pitch',
        questions: [{ q: 'Quel pitch vous a le plus convaincu ? (Pas le vôtre.)', o: ['Jazz', 'Rock', 'Électro', 'Hip-hop'] }],
      },
      {
        id: 'qcm', kind: 'quiz', title: 'QCM · la dernière manche',
        questions: [
          { q: 'Les 3U : utile, utilisable et…', o: ['Unique', 'Utilisée', 'Universelle', 'Urgente'], ok: 1 },
          { q: '« Pourquoi ce titre ? » sous chaque morceau, c\'est le pattern…', o: ['Orientation', 'Explicabilité', 'Garde-fous', 'Choix multiple'], ok: 1 },
          { q: "Pour tester la valeur d'une IA sans casser le parcours existant, on privilégie…", o: ['Une expérience IA à part', "L'IA partout dès la V1", 'Un chat sur toutes les pages', 'Un design system spécial IA'], ok: 0 },
          { q: "L'assistant prépare le virement, mais vous seul pouvez l'envoyer. C'est…", o: ['Human out of the loop', 'Human on the loop', 'Human in the loop', 'Un agent autonome'], ok: 2 },
          { q: "Le code d'un prototype vibe-codé…", o: ['Part en production tel quel', 'Doit être repris avant la production', 'Remplace les développeurs', 'Est plus sûr que du code écrit à la main'], ok: 1 },
          { q: "Avant d'améliorer un prompt, il faut d'abord…", o: ['Changer de modèle', 'Définir ses critères de succès', 'Écrire un prompt plus long', 'Demander à l\'IA de se corriger'], ok: 1 },
          { q: 'Dans un test A/B de prompt, on garde identique…', o: ["L'entrée, par exemple la même humeur", 'Le ton', 'La longueur de la réponse', 'Rien du tout'], ok: 0 },
          { q: "Pour qu'une app exploite la réponse de l'IA, on lui demande…", o: ['Un texte libre et chaleureux', 'Une sortie structurée, en JSON', 'Une image', 'Une réponse en anglais'], ok: 1 },
          { q: 'Dans un projet Claude, les instructions du projet…', o: ['Ne servent qu\'au premier message', "S'appliquent à chaque conversation du projet", 'Sont visibles par tous les utilisateurs de Claude', 'Remplacent les fichiers du projet'], ok: 1 },
          { q: "Avec l'IA, le plus dur aujourd'hui, c'est…", o: ['De construire', 'De choisir quoi construire', "D'écrire du code", 'De trouver un outil'], ok: 1 },
        ],
      },
      {
        id: 'retient', kind: 'poll', title: 'Ce que vous emportez',
        questions: [{ q: 'Lequel vous servira le plus ?', o: ['Comprendre', 'Cadrer', 'Lancer', 'Designer', 'Prototyper'] }],
      },
      { id: 'repart', kind: 'word', title: 'Un mot pour dire avec quoi vous repartez', max: 1 },
    ],
  },
};

export const TEAMS = ['Jazz', 'Rock', 'Électro', 'Hip-hop'];

export function findAct(room, id) {
  const s = SESSIONS[room] || SESSIONS.s1;
  return s.acts.find(a => a.id === id) || null;
}

// Version sans les bonnes réponses, pour les téléphones.
export function publicAct(a) {
  if (!a) return null;
  return {
    id: a.id, kind: a.kind, title: a.title, max: a.max,
    questions: (a.questions || []).map(x => ({ q: x.q, o: x.o })),
  };
}
