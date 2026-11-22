import { list, getJSON, cached, dec, room as R } from './_store.js';
import { SESSIONS, findAct, TEAMS } from './_q.js';

export const HOST_KEY = () => process.env.HOST_KEY || (process.env.LOCAL_STORE ? 'test' : null);

export async function readState(r) {
  return cached('state:' + r, 1000, async () =>
    (await getJSON(`r/${r}/state.json`)) || { act: null, phase: 'idle', ts: 0 });
}

// Position du deck diffusée par le présentateur (slide, clic, scores, minuteurs).
export async function readSlide(r) {
  return cached('slide:' + r, 700, async () => (await getJSON(`r/${r}/slide.json`)) || null);
}

const norm = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/[^a-z0-9 '-]/g, ' ').replace(/\s+/g, ' ').trim();

export async function latestVotes(r, actId) {
  const items = await list(`r/${r}/v/${actId}/`);
  const by = new Map();
  for (const it of items) {
    const file = it.pathname.split('/').pop();
    const i = file.indexOf('~');
    if (i < 0) continue;
    const pid = file.slice(0, i), p = dec(file.slice(i + 1));
    if (!p) continue;
    const prev = by.get(pid);
    if (!prev || it.uploadedAt > prev.at) by.set(pid, { pid, at: it.uploadedAt, ...p });
  }
  return [...by.values()];
}

export function aggregate(act, votes) {
  const out = { act: act.id, kind: act.kind, n: votes.length };
  if (act.kind === 'poll') {
    out.counts = act.questions.map((q, qi) => q.o.map((_, oi) => votes.filter(v => v.a?.[qi] === oi).length));
    out.answered = act.questions.map((_, qi) => votes.filter(v => Number.isInteger(v.a?.[qi])).length);
  } else if (act.kind === 'word') {
    const m = new Map();
    for (const v of votes) {
      const seen = new Set();
      for (const w of (v.a || [])) {
        // Un même mot n'est compté qu'une fois par personne.
        const k = norm(w); if (!k || seen.has(k)) continue;
        seen.add(k);
        const e = m.get(k) || { k, n: 0, forms: {} };
        e.n++; const f = String(w).trim().toLowerCase(); e.forms[f] = (e.forms[f] || 0) + 1;
        m.set(k, e);
      }
    }
    out.words = [...m.values()].map(e => ({ w: Object.entries(e.forms).sort((a, b) => b[1] - a[1])[0][0], n: e.n }))
      .sort((a, b) => b.n - a.n).slice(0, 60);
  } else if (act.kind === 'quiz') {
    const N = act.questions.length;
    const people = votes.map(v => {
      const a = v.a || [];
      const score = act.questions.reduce((s, q, i) => s + (a[i] === q.ok ? 1 : 0), 0);
      const done = act.questions.every((_, i) => Number.isInteger(a[i]));
      return { pid: v.pid, name: v.n, team: v.t, score, done, at: +v.at };
    });
    people.sort((x, y) => y.score - x.score || (y.done - x.done) || x.at - y.at);
    out.total = N;
    out.done = people.filter(p => p.done).length;
    out.people = people;
    out.teams = TEAMS.map(t => {
      const ps = people.filter(p => p.team === t);
      const sum = ps.reduce((s, p) => s + p.score, 0);
      return { team: t, players: ps.length, avg: ps.length ? +(sum / ps.length).toFixed(1) : 0 };
    });
    out.perQ = act.questions.map((q, i) => {
      const ans = votes.filter(v => Number.isInteger(v.a?.[i]));
      return { ok: q.ok, n: ans.length, counts: q.o.map((_, oi) => ans.filter(v => v.a[i] === oi).length) };
    });
  }
  return out;
}

export function session(r) { return SESSIONS[r] || null; }
export { findAct, R };
