import { putJSON, bust, readBody, send, room } from './_store.js';
import { readState, readSlide, HOST_KEY, session } from './_logic.js';
import { getJSON } from './_store.js';
import { findAct, publicAct } from './_q.js';

export default async function handler(req, res) {
  try {
    const url = new URL(req.url, 'http://x');
    if (req.method === 'GET') {
      const r = room(url.searchParams.get('r'));
      const ses = session(r);
      const [s, slide] = await Promise.all([readState(r), ses?.deck ? readSlide(r) : null]);
      return send(res, 200, { room: r, title: ses?.title || '', exists: !!ses, deck: !!ses?.deck, ts: s.ts, run: s.run || 0, phase: s.phase,
        act: s.act ? publicAct(findAct(r, s.act)) : null, slide });
    }
    if (req.method === 'POST') {
      const b = await readBody(req);
      const r = room(b.r);
      if (!HOST_KEY() || b.k !== HOST_KEY()) return send(res, 403, { error: 'clé animateur invalide' });
      if (b.slide) {
        const v = b.slide, num = (x, max) => Math.max(0, Math.min(max, Math.floor(Number(x) || 0)));
        const slide = { i: num(v.i, 999), step: num(v.step, 99), ts: Date.now(),
          scores: Array.isArray(v.scores) ? v.scores.slice(0, 4).map(n => num(n, 9999)) : null,
          timers: Array.isArray(v.timers) ? v.timers.slice(0, 4).map(t => t && ({ run: !!t.run, rem: Number(t.rem) || 0, end: Number(t.end) || 0, total: Number(t.total) || 0 })) : [] };
        await putJSON(`r/${r}/slide.json`, slide);
        bust('slide:' + r);
        return send(res, 200, slide);
      }
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
