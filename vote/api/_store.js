// Stockage : Vercel Blob privé en production, mémoire en local (LOCAL_STORE=1).
const LOCAL = !!process.env.LOCAL_STORE;

const mem = globalThis.__mmStore || (globalThis.__mmStore = new Map());

let blob = null;
async function sdk() {
  if (!blob) blob = await import('@vercel/blob');
  return blob;
}

export async function putJSON(pathname, data) {
  const body = JSON.stringify(data);
  if (LOCAL) { mem.set(pathname, { body, uploadedAt: new Date() }); return; }
  const { put } = await sdk();
  await put(pathname, body, {
    access: 'private', allowOverwrite: true, addRandomSuffix: false,
    contentType: 'application/json', cacheControlMaxAge: 60,
  });
}

export async function getJSON(pathname) {
  if (LOCAL) { const v = mem.get(pathname); return v ? JSON.parse(v.body) : null; }
  const { get } = await sdk();
  const r = await get(pathname, { access: 'private', useCache: false });
  if (!r || r.statusCode !== 200) return null;
  return JSON.parse(await new Response(r.stream).text());
}

export async function list(prefix) {
  if (LOCAL) {
    return [...mem.entries()].filter(([k]) => k.startsWith(prefix))
      .map(([pathname, v]) => ({ pathname, uploadedAt: v.uploadedAt }));
  }
  const { list } = await sdk();
  const out = [];
  let cursor;
  do {
    const r = await list({ prefix, cursor, limit: 1000 });
    out.push(...r.blobs.map(b => ({ pathname: b.pathname, uploadedAt: new Date(b.uploadedAt), url: b.url })));
    cursor = r.hasMore ? r.cursor : undefined;
  } while (cursor);
  return out;
}

export async function putMarker(pathname) {
  if (LOCAL) { mem.set(pathname, { body: '1', uploadedAt: new Date() }); return; }
  const { put } = await sdk();
  await put(pathname, '1', { access: 'private', allowOverwrite: true, addRandomSuffix: false, contentType: 'text/plain' });
}

export async function delPrefix(prefix) {
  const items = await list(prefix);
  if (LOCAL) { items.forEach(i => mem.delete(i.pathname)); return items.length; }
  const { del } = await sdk();
  for (let i = 0; i < items.length; i += 500) await del(items.slice(i, i + 500).map(x => x.url));
  return items.length;
}

// Petit cache mémoire par instance : 25 téléphones qui interrogent toutes les 2 s
// ne déclenchent qu'une lecture du stockage par seconde.
const cache = new Map();
export async function cached(key, ttl, fn) {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.t < ttl) return hit.v;
  const v = await fn();
  cache.set(key, { t: Date.now(), v });
  return v;
}
export function bust(prefix) { for (const k of cache.keys()) if (k.startsWith(prefix)) cache.delete(k); }

// Encodage des réponses dans le nom du fichier : les résultats se lisent
// avec une seule opération « list », sans ouvrir chaque fichier.
export const enc = o => Buffer.from(JSON.stringify(o)).toString('base64url');
export const dec = s => { try { return JSON.parse(Buffer.from(s, 'base64url').toString()); } catch { return null; } };

export function room(r) { return String(r || 's1').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 20) || 's1'; }

export async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  let s = '';
  for await (const c of req) s += c;
  try { return JSON.parse(s || '{}'); } catch { return {}; }
}

export function send(res, code, obj) {
  res.statusCode = code;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  res.end(JSON.stringify(obj));
}
