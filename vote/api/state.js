import { putJSON, bust, readBody, send, room } from './_store.js';
import { readState, HOST_KEY, session } from './_logic.js';
import { getJSON } from './_store.js';
import { findAct, publicAct } from './_q.js';

export default async function handler(req, res) {
  try {
    const url = new URL(req.url, 'http://x');
    if (req.method === 'GET') {
      const r = room(url.searchParams.get('r'));
      const s = await readState(r);
      const ses = session(r);
      return send(res, 200, { room: r, title: ses?.title || '', exists: !!ses, ts: s.ts, run: s.run || 0, phase: s.phase,
        act: s.act ? publicAct(findAct(r, s.act)) : null });
    }
    if (req.method === 'POST') {
      const b = await readBody(req);
      const r = room(b.r);
      if (!HOST_KEY() || b.k !== HOST_KEY()) return send(res, 403, { error: 'clé animateur invalide' });
      if (b.check) return send(res, 200, { ok: true, acts: (session(r)?.acts || []).map(a => ({ ...publicAct(a), ok: undefined, answers: a.kind === 'quiz' ? a.questions.map(q => q.ok) : undefined })) });
      const act = b.act ? findAct(r, b.act) : null;
      const phase = act ? (b.phase === 'closed' ? 'closed' : 'open') : 'idle';
      const cur = (await getJSON(`r/${r}/state.json`)) || {};
      const runs = { ...(cur.runs || {}) };
      if (act && (b.fresh || !runs[act.id])) runs[act.id] = Date.now();
      const s = { act: act?.id || null, phase, ts: Date.now(), run: act ? runs[act.id] : 0, runs };
      await putJSON(`r/${r}/state.json`, s);
      bust('state:' + r);
      return send(res, 200, s);
    }
    send(res, 405, { error: 'méthode' });
  } catch (e) { console.error(e); send(res, 500, { error: 'serveur' }); }
}
