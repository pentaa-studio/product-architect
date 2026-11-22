import { cached, send, room, readBody, delPrefix, bust } from './_store.js';
import { latestVotes, aggregate, findAct, readState } from './_logic.js';

export default async function handler(req, res) {
  try {
    const url = new URL(req.url, 'http://x');
    if (req.method === 'POST') { // réinitialiser une activité (répétition)
      const b = await readBody(req);
      const r = room(b.r);
      const act = findAct(r, b.act);
      if (!act) return send(res, 404, { error: 'activité' });
      const n = await delPrefix(`r/${r}/v/${act.id}/`);
      bust('res:' + r);
      return send(res, 200, { ok: true, deleted: n });
    }
    const r = room(url.searchParams.get('r'));
    const act = findAct(r, url.searchParams.get('act'));
    if (!act) return send(res, 404, { error: 'activité' });
    const full = await cached(`res:${r}:${act.id}`, 1500, async () => aggregate(act, await latestVotes(r, act.id)));
    if (url.searchParams.has('k')) return send(res, 200, full); // écran animateur
    // Côté téléphone : seulement son propre score de QCM, une fois le QCM fermé.
    const pid = url.searchParams.get('me');
    const s = await readState(r);
    if (act.kind === 'quiz' && pid && !(s.act === act.id && s.phase === 'open')) {
      const i = full.people.findIndex(p => p.pid === pid);
      return send(res, 200, { mine: i >= 0 ? { score: full.people[i].score, total: full.total, rank: i + 1, of: full.people.length } : null });
    }
    send(res, 200, { n: full.n });
  } catch (e) { console.error(e); send(res, 500, { error: 'serveur' }); }
}
