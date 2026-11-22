// Serveur local : sert public/ et les fonctions api/ (stockage en mémoire).
process.env.LOCAL_STORE = '1';
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
const mods = {};
http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x');
  if (u.pathname.startsWith('/api/')) {
    const name = u.pathname.slice(5).replace(/[^a-z]/g, '');
    mods[name] ||= (await import('./api/' + name + '.js')).default;
    return mods[name](req, res);
  }
  let p = u.pathname === '/' ? '/index.html' : u.pathname;
  if (p === '/animateur') p = '/host.html';
  if (p === '/presentateur') p = '/presenter.html';
  if (/^\/[a-z0-9-]{1,20}$/.test(p)) p = '/index.html';
  const f = path.join('public', p);
  if (!fs.existsSync(f)) { res.statusCode = 404; return res.end('404'); }
  res.setHeader('content-type', types[path.extname(f)] || 'application/octet-stream');
  fs.createReadStream(f).pipe(res);
}).listen(3311, () => console.log('ok 3311'));
