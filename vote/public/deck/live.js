/* Mode direct des decks.
   ?live=follow  : apprenant. Suit le présentateur, peut revenir en arrière, bouton « Revenir au direct ».
   ?live=mirror  : fenêtre de projection. Suit toujours le présentateur (même navigateur, sans délai).
   ?live=thumb   : aperçu de la slide suivante dans la vue présentateur.
   ?live=presenter : le deck du formateur. La vue présentateur branche ses écouteurs directement. */
(function () {
  const qs = new URLSearchParams(location.search);
  const mode = qs.get('live');
  const room = (qs.get('r') || '').replace(/[^a-z0-9-]/g, '');
  const D = window.DeckAPI;
  if (!mode || !D) return;
  document.documentElement.dataset.live = mode;

  const css = document.createElement('style');
  css.textContent = `
    html[data-live="follow"] #btn-score, html[data-live="follow"] #btn-draw, html[data-live="follow"] .ctrl .hint { display: none; }
    html[data-live="follow"] .tbtns, html[data-live="follow"] .slide-btn,
    html[data-live="mirror"] .tbtns, html[data-live="mirror"] .slide-btn,
    html[data-live="thumb"] .tbtns, html[data-live="thumb"] .slide-btn { display: none !important; }
    html[data-live="mirror"] .ctrl, html[data-live="thumb"] .ctrl { display: none; }
    html[data-live="mirror"] .viewport, html[data-live="thumb"] .viewport { padding: 0; }
    html[data-live="thumb"] body { pointer-events: none; }
    .live-pill { position: fixed; left: 50%; top: 12px; transform: translateX(-50%); z-index: 50; display: none; align-items: center; gap: 10px;
      padding: 10px 18px; border-radius: 999px; border: 0; background: #c8f542; color: #0b0a12; font: 700 15px Figtree, system-ui, sans-serif; cursor: pointer;
      box-shadow: 0 10px 30px rgba(0,0,0,.4); }
    .live-pill::before { content: ""; width: 9px; height: 9px; border-radius: 50%; background: #0b0a12; animation: livePulse 1.4s ease-in-out infinite; }
    .live-pill.on { display: inline-flex; }
    @keyframes livePulse { 50% { opacity: .25; } }`;
  document.head.appendChild(css);

  if (mode === 'presenter') return;

  // En suivi, ni points, ni tirage, ni avance au clic sur la slide : on ne change rien par erreur.
  window.addEventListener('keydown', e => {
    if (/^Digit[1-4]$/.test(e.code) || /^[sStT]$/.test(e.key)) { e.stopImmediatePropagation(); e.preventDefault(); }
    if (mode !== 'follow' && !['f', 'F'].includes(e.key)) { e.stopImmediatePropagation(); }
  }, true);
  window.addEventListener('click', e => {
    if (e.target.closest && e.target.closest('#stage') && !e.target.closest('button, a, input, video')) e.stopPropagation();
  }, true);

  let live = true, applying = false, last = null, lastScores = '', lastTimers = '';
  const pill = document.createElement('button');
  pill.className = 'live-pill'; pill.type = 'button'; pill.textContent = 'Revenir au direct';
  document.body.appendChild(pill);
  pill.addEventListener('click', () => { live = true; pill.classList.remove('on'); if (last) apply(last, true); });

  window.__deckChanged = (i, step) => {
    if (applying || mode !== 'follow' || !last) return;
    if (i !== last.i || step !== last.step) { live = false; pill.classList.add('on'); }
  };

  function apply(m, force) {
    if (!m || typeof m.i !== 'number') return;
    last = m;
    if (Array.isArray(m.scores)) {
      const k = JSON.stringify(m.scores);
      if (k !== lastScores) { lastScores = k; D.setScores(m.scores); }
    }
    if (!live && !force) return;
    const s = D.state();
    applying = true;
    try {
      if (s.i !== m.i || s.step !== m.step) D.go(m.i, m.step);
      const t = JSON.stringify([m.i, m.timers || []]);
      if (force || t !== lastTimers || s.i !== m.i) { lastTimers = t; D.setTimers(m.i, m.timers || []); }
    } finally { applying = false; }
  }

  if (mode === 'thumb') {
    addEventListener('message', e => { const m = e.data || {}; if (m.mm === 'show') { applying = true; D.go(m.i, m.step || 0); applying = false; } });
    return;
  }
  if (mode === 'follow') {
    addEventListener('message', e => { const m = e.data || {}; if (m.mm === 'live' && m.slide) apply(m.slide); });
    if (parent !== window) parent.postMessage({ mm: 'ready' }, location.origin);
  }
  if (mode === 'mirror' && 'BroadcastChannel' in window) {
    const bc = new BroadcastChannel('mm-deck-' + room);
    bc.onmessage = e => { const m = e.data || {}; if (m.mm === 'live' && m.slide) apply(m.slide); };
    bc.postMessage({ mm: 'hello' });
  }
})();
