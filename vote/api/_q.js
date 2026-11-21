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
