import { putMarker, enc, readBody, send, room } from './_store.js';
import { readState, findAct } from './_logic.js';
import { TEAMS } from './_q.js';

const clean = (s, n) => String(s ?? '').replace(/[\u0000-\u001f]/g, '').trim().slice(0, n);

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return send(res, 405, { error: 'méthode' });
    const b = await readBody(req);
    const r = room(b.r);
    const pid = String(b.pid || '').replace(/[^a-z0-9]/gi, '').slice(0, 16);
    if (pid.length < 6) return send(res, 400, { error: 'identifiant' });
    const s = await readState(r);
    if (s.act !== b.act || s.phase !== 'open') return send(res, 409, { error: 'fermé' });
    const act = findAct(r, b.act);
    if (!act) return send(res, 404, { error: 'activité' });
    let a = Array.isArray(b.answers) ? b.answers : [];
    if (act.kind === 'word') {
      a = a.map(w => clean(w, 30)).filter(Boolean).slice(0, act.max || 3);
      if (!a.length) return send(res, 400, { error: 'vide' });
    } else {
      a = act.questions.map((q, i) => (Number.isInteger(a[i]) && a[i] >= 0 && a[i] < q.o.length) ? a[i] : null);
      while (a.length && a[a.length - 1] === null) a.pop();
    }
    const team = TEAMS.includes(b.team) ? b.team : '';
    await putMarker(`r/${r}/v/${act.id}/${pid}~${enc({ n: clean(b.name, 24), t: team, a })}`);
    send(res, 200, { ok: true });
  } catch (e) { console.error(e); send(res, 500, { error: 'serveur' }); }
}
