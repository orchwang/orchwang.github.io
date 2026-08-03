/*
 * Knowledge Graph — a force-directed map of every internal link between posts.
 *
 * Nodes are posts (one per published entry). Edges come in three typed layers:
 *   - link  : explicit `](/YYYY/MM/DD/...html)` references in post bodies
 *             (extracted at build time by _plugins/graph_links.rb; emitted by
 *             graph.json). Bidirectional: weight = link count.
 *   - series: adjacent posts in the same `series:` chain, ordered by date.
 *   - tag   : posts that share >=3 tags (capped at the top 3 per node so the
 *             hairball stays readable).
 *
 * Pixel-art rendering: nodes are square (4–12px even-snap), edges are 1px lines
 * (tag layer = 2px dashed), no antialiasing, devicePixelRatio respected for label
 * legibility. d3-force handles only the physics — Canvas 2D draws everything
 * so it stays light at 237 nodes / ~1,100 edges.
 *
 * Design tokens drive every colour, so the graph repaints on a light/dark
 * theme switch. See specs/knowledge-graph/plan.md for the full design.
 */
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCollide,
  forceX,
  forceY
} from 'https://cdn.jsdelivr.net/npm/d3-force@3.0.0/+esm';

(async function () {
  'use strict';

  // ---- self-gate: only run on the graph page -------------------------------
  const canvas = document.getElementById('graph-canvas');
  if (!canvas) return;
  const stage = document.getElementById('graph-stage');
  const fallback = document.getElementById('graph-fallback');
  const loading = document.getElementById('graph-loading');
  if (!stage) { if (loading) loading.style.display = 'none'; return; }

  // Bail out if 2D canvas isn't available — fallback stays visible.
  let probe;
  try { probe = canvas.getContext('2d'); } catch (e) { probe = null; }
  if (!probe) { if (loading) loading.style.display = 'none'; return; }

  // ---- constants -----------------------------------------------------------
  const CATEGORY_TOKEN = {
    'Technology': '--steel',
    'Articles': '--gold',
    'Engineering': '--orc-green',
    'Retrospec': '--crimson',
    'Career': '--accent-color',
    'Language': '--secondary-color',
    'BookLog': '--bone'
  };
  const FALLBACK_TOKENS = ['--steel', '--gold', '--orc-green', '--crimson',
    '--accent-color', '--secondary-color', '--bone', '--primary-color'];

  // Category → anchor on a circle. Slight rotation per theme is irrelevant;
  // these are stable spatial continents matching the worldmap palette.
  const CATEGORIES = Object.keys(CATEGORY_TOKEN);

  const NODE_MIN = 4;          // px (smallest node)
  const NODE_MAX = 14;         // px (largest hub)
  const TAG_THRESHOLD = 3;     // shared tags to qualify as a tag-similarity edge
  const TAG_TOPK_PER_NODE = 3; // cap per node so the layer doesn't hairball
  const MAX_LABEL_ZOOM = 1.5;  // show node title only at this zoom and above

  // ---- palette (token reader) ---------------------------------------------
  const _pc = document.createElement('canvas'); _pc.width = _pc.height = 1;
  const _pctx = _pc.getContext('2d', { willReadFrequently: true });
  function parseColor(str) {
    _pctx.clearRect(0, 0, 1, 1);
    _pctx.fillStyle = '#000';
    try { _pctx.fillStyle = String(str).trim(); } catch (e) { /* keep black */ }
    _pctx.fillRect(0, 0, 1, 1);
    const d = _pctx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2]];
  }
  function readToken(name) {
    return parseColor(getComputedStyle(document.documentElement).getPropertyValue(name));
  }
  const rgbStr = (c) => 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')';

  function isDarkTheme() {
    const attr = document.documentElement.getAttribute('data-theme');
    if (attr === 'dark') return true;
    if (attr === 'light') return false;
    return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }

  let palette = {};
  function readPalette() {
    palette = {
      bg: readToken('--bg-color'),
      bgSunken: readToken('--bg-sunken'),
      panel: readToken('--bg-panel'),
      border: readToken('--border-strong'),
      chromeBg: readToken('--chrome-bg'),
      chromeInk: readToken('--chrome-ink'),
      gold: readToken('--gold'),
      goldBright: readToken('--gold-bright'),
      goldSoft: parseColor('rgba(154,111,18,0.16)'),
      text: readToken('--text-color'),
      textLight: readToken('--text-light')
    };
    if (isDarkTheme()) {
      palette.goldSoft = parseColor('rgba(245,197,66,0.15)');
    }
    palette.categories = {};
    CATEGORIES.forEach((name, i) => {
      palette.categories[name] = readToken(CATEGORY_TOKEN[name]);
    });
  }
  readPalette();

  function colorForCategory(name, index) {
    if (palette.categories[name]) return palette.categories[name];
    return readToken(FALLBACK_TOKENS[index % FALLBACK_TOKENS.length]);
  }

  // ---- data ----------------------------------------------------------------
  let posts;
  try {
    posts = await fetch('/graph.json').then((r) => r.json());
  } catch (e) {
    if (loading) loading.style.display = 'none';
    return;
  }
  if (!Array.isArray(posts) || posts.length === 0) {
    if (loading) loading.style.display = 'none';
    return;
  }

  // Index by URL (id).
  const byUrl = new Map();
  for (const p of posts) byUrl.set(p.url, p);

  // Top category per post (only the FIRST category drives the colour).
  function topCat(p) {
    const cats = p.categories || [];
    return cats.length ? cats[0] : 'Uncategorized';
  }

  // Build the three edge layers.
  // 1) link layer — bidirectional, deduped, weight = link count.
  const linkPairs = new Map(); // key -> { a, b, weight }
  for (const p of posts) {
    for (const u of (p.outbound || [])) {
      if (!byUrl.has(u)) continue;
      if (u === p.url) continue;
      const [lo, hi] = p.url < u ? [p.url, u] : [u, p.url];
      const key = lo + '|' + hi;
      let e = linkPairs.get(key);
      if (!e) { e = { a: lo, b: hi, weight: 0 }; linkPairs.set(key, e); }
      e.weight += 1;
    }
  }
  const linkEdges = [...linkPairs.values()];

  // 2) series layer — adjacent pairs in the same series, sorted by date.
  const seriesPosts = new Map();
  for (const p of posts) {
    if (!p.series) continue;
    let arr = seriesPosts.get(p.series);
    if (!arr) { arr = []; seriesPosts.set(p.series, arr); }
    arr.push(p);
  }
  const seriesChains = [];
  for (const [, arr] of seriesPosts) {
    arr.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
    for (let i = 0; i < arr.length - 1; i++) {
      seriesChains.push({ a: arr[i].url, b: arr[i + 1].url });
    }
  }
  // Series orderings (used by the legend select).
  const seriesNames = [...seriesPosts.keys()].sort();

  // 3) tag layer — shared-tag similarity. Cap by top-K per node to keep density
  // bounded. Only emit an edge if both endpoints rank each other within top-K
  // for the shared-tag count (i.e. symmetric).
  const tagSimByPair = new Map(); // key "lo|hi" -> sharedTagCount
  // Compute shared-tag count for every pair (small enough at 237 nodes).
  for (let i = 0; i < posts.length; i++) {
    const a = posts[i];
    const tagA = new Set((a.tags || []).map((t) => t.toLowerCase()));
    for (let j = i + 1; j < posts.length; j++) {
      const b = posts[j];
      const tagB = b.tags || [];
      let shared = 0;
      for (const t of tagB) {
        if (tagA.has(t.toLowerCase())) shared += 1;
      }
      if (shared >= TAG_THRESHOLD) {
        const [lo, hi] = a.url < b.url ? [a.url, b.url] : [b.url, a.url];
        tagSimByPair.set(lo + '|' + hi, shared);
      }
    }
  }
  // Per-node top-K.
  const tagEdgeKeys = new Set();
  for (const p of posts) {
    const myShared = [];
    for (const [key, count] of tagSimByPair) {
      const [lo, hi] = key.split('|');
      if (lo === p.url || hi === p.url) myShared.push([key, count]);
    }
    myShared.sort((x, y) => y[1] - x[1]);
    myShared.slice(0, TAG_TOPK_PER_NODE).forEach(([key]) => tagEdgeKeys.add(key));
  }
  const tagEdges = [...tagEdgeKeys].map((k) => {
    const [a, b] = k.split('|');
    return { a, b, weight: tagSimByPair.get(k) };
  });

  // ---- nodes & adjacency ---------------------------------------------------
  // nodes: { id, post, x, y, vx, vy, degree, category, color, size }.
  // `id` is the post URL — d3-forceLink resolves edges by id, so we keep
  // edges as URL strings here and only resolve to node objects at render
  // time. Sharing the same node object across multiple forceLink instances
  // corrupts the index assignment (each link force reassigns `.index`).
  const nodes = posts.map((p) => {
    const cat = topCat(p);
    return {
      id: p.url,
      post: p,
      category: cat,
      degree: 0,        // link-layer degree (in + out / 2 effectively via undirected)
      degreeIn: 0,
      degreeOut: 0,
      x: 0, y: 0, vx: 0, vy: 0,
      index: -1,         // assigned by d3-force; -1 = uninitialised
      series: p.series || null
    };
  });
  const nodeById = new Map(nodes.map((n) => [n.id, n]));

  for (const e of linkEdges) {
    const a = nodeById.get(e.a), b = nodeById.get(e.b);
    if (!a || !b) continue;
    a.degree += e.weight; b.degree += e.weight;
  }
  // in/out (per direction) — for the panel "이 글이 참조 / 이 글을 참조".
  for (const p of posts) {
    const n = nodeById.get(p.url);
    if (!n) continue;
    n.degreeOut = (p.outbound || []).filter((u) => nodeById.has(u)).length;
  }
  for (const n of nodes) {
    n.degreeIn = n.degree - n.degreeOut;
  }

  // Build the three edge layers. Each edge carries `{ source, target }` as
  // URL strings — the canonical shape d3-force expects. We keep references
  // to the original weight/weight for opacity and a `kind` tag for render.
  const linkEdgeObjs = [];
  for (const e of linkEdges) {
    if (!nodeById.has(e.a) || !nodeById.has(e.b)) continue;
    linkEdgeObjs.push({ source: e.a, target: e.b, weight: e.weight, kind: 'link' });
  }
  const seriesEdgeObjs = [];
  for (const e of seriesChains) {
    if (!nodeById.has(e.a) || !nodeById.has(e.b)) continue;
    seriesEdgeObjs.push({ source: e.a, target: e.b, kind: 'series' });
  }
  const tagEdgeObjs = [];
  for (const e of tagEdges) {
    if (!nodeById.has(e.a) || !nodeById.has(e.b)) continue;
    tagEdgeObjs.push({ source: e.a, target: e.b, weight: e.weight, kind: 'tag' });
  }

  // Maximum degree for node sizing (cap to avoid one post dwarfing all).
  let maxDegree = 1;
  for (const n of nodes) if (n.degree > maxDegree) maxDegree = n.degree;
  function nodeSize(n) {
    if (maxDegree <= 1) return NODE_MIN + 2;
    const t = Math.sqrt(Math.min(1, n.degree / maxDegree));
    return NODE_MIN + Math.round((NODE_MAX - NODE_MIN) * t * 2) / 2;
  }

  // Map a post to a categorical anchor (a ring of points around the origin).
  // Uncategorised posts share the Uncategorised anchor (same as fallback token).
  const categoryAngles = new Map();
  const N_CAT = CATEGORIES.length;
  CATEGORIES.forEach((c, i) => {
    const a = (i / N_CAT) * Math.PI * 2 - Math.PI / 2;
    categoryAngles.set(c, { x: Math.cos(a), y: Math.sin(a) });
  });

  // ---- force simulation ----------------------------------------------------
  // Category anchors form a ring; forceX/Y pulls each category slightly toward
  // its anchor so the colour clusters also cluster spatially.
  const RADIUS = 320; // simulation space radius for category ring
  const sim = forceSimulation(nodes)
    .force('charge', forceManyBody().strength(-90).distanceMax(220))
    .force('collide', forceCollide().radius((d) => nodeSize(d) + 2))
    .force('link-link', forceLink(linkEdgeObjs).id((d) => d.id).distance(46).strength(0.45))
    .force('link-series', forceLink(seriesEdgeObjs).id((d) => d.id).distance(28).strength(0.85))
    .force('link-tag', forceLink(tagEdgeObjs).id((d) => d.id).distance(70).strength(0.18))
    .force('x', forceX((d) => {
      const a = categoryAngles.get(d.category);
      return a ? a.x * RADIUS : 0;
    }).strength(0.06))
    .force('y', forceY((d) => {
      const a = categoryAngles.get(d.category);
      return a ? a.y * RADIUS : 0;
    }).strength(0.06))
    .alpha(1)
    .alphaDecay(0.022)
    .stop();

  // Run the simulation to a warm-start position before first paint, then keep
  // ticking on demand only.
  for (let i = 0; i < 300; i++) sim.tick();

  // ---- render state --------------------------------------------------------
  let zoom = 1;
  let camX = 0, camY = 0;
  let isDragging = false, dragMoved = false;
  let dragStartX = 0, dragStartY = 0, dragCamStartX = 0, dragCamStartY = 0;
  let hoveredId = null;
  let selectedId = null;
  let searchTerm = '';
  const activeCategoryFilters = new Set(CATEGORIES); // toggled = visible
  const visibleLayers = { link: true, series: true, tag: false };
  let highlightedSeries = '';

  const ctx = canvas.getContext('2d');
  let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  let cw = 0, ch = 0;

  function resize() {
    const rect = stage.getBoundingClientRect();
    cw = Math.max(320, Math.floor(rect.width));
    ch = Math.max(320, Math.floor(rect.height));
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    canvas.width = cw * dpr;
    canvas.height = ch * dpr;
    canvas.style.width = cw + 'px';
    canvas.style.height = ch + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
    render();
  }

  // Convert client coords (CSS pixels) to simulation coords.
  function clientToSim(cx, cy) {
    const rect = canvas.getBoundingClientRect();
    const px = cx - rect.left - cw / 2 - camX * zoom;
    const py = cy - rect.top - ch / 2 - camY * zoom;
    return { x: px / zoom, y: py / zoom };
  }

  // ---- render --------------------------------------------------------------
  function render() {
    ctx.fillStyle = rgbStr(palette.bgSunken);
    ctx.fillRect(0, 0, cw, ch);

    ctx.save();
    ctx.translate(cw / 2 + camX * zoom, ch / 2 + camY * zoom);
    ctx.scale(zoom, zoom);

    // adjacency map for hover/selection highlighting (link layer only)
    const neighborSet = hoveredId || selectedId
      ? neighborsOf(hoveredId || selectedId)
      : null;

    // ---- edges (under nodes) ----
    if (visibleLayers.link) {
      drawEdges(linkEdgeObjs, {
        base: rgbStr(palette.textLight),
        weightOpacity: (w) => Math.min(0.9, 0.18 + 0.18 * Math.min(w, 4)),
        dim: (a, b) => isFiltered(a) || isFiltered(b),
        highlight: (a, b) => neighborSet && neighborSet.has(a.id) && neighborSet.has(b.id),
        seriesHighlight: (a, b) => false,
        series: false
      });
    }
    if (visibleLayers.series) {
      drawEdges(seriesEdgeObjs, {
        base: rgbStr(palette.gold),
        weightOpacity: () => 0.8,
        dim: (a, b) => isFiltered(a) || isFiltered(b),
        highlight: () => false,
        seriesHighlight: (a, b) => highlightedSeries && (a.series === highlightedSeries && b.series === highlightedSeries),
        series: true
      });
    }
    if (visibleLayers.tag) {
      drawEdges(tagEdgeObjs, {
        base: rgbStr(palette.gold),
        weightOpacity: (w) => 0.35 + 0.1 * Math.min(w, 5),
        dim: (a, b) => isFiltered(a) || isFiltered(b),
        highlight: () => false,
        seriesHighlight: () => false,
        dashed: true,
        series: false
      });
    }

    // ---- nodes ----
    const showLabel = zoom >= MAX_LABEL_ZOOM;
    for (const n of nodes) {
      const dim = isFiltered(n) || (searchTerm && !matchesSearch(n, searchTerm));
      const dimByHighlight = neighborSet && !(neighborSet.has(n.id) || n.id === (hoveredId || selectedId));
      const isFocus = (hoveredId && n.id === hoveredId) || (selectedId && n.id === selectedId);
      const size = nodeSize(n);
      const color = colorForCategory(n.category, CATEGORIES.indexOf(n.category));
      ctx.globalAlpha = (dim || dimByHighlight) ? 0.18 : 1;
      ctx.fillStyle = isFocus ? rgbStr(palette.goldBright) : rgbStr(color);
      // Pixel-art square (even-snap).
      const sx = Math.round(n.x - size / 2);
      const sy = Math.round(n.y - size / 2);
      ctx.fillRect(sx, sy, size, size);
      // Hard outline so dense areas read.
      if (isFocus || size >= 9) {
        ctx.strokeStyle = rgbStr(palette.border);
        ctx.lineWidth = 1 / zoom;
        ctx.strokeRect(sx + 0.5, sy + 0.5, size - 1, size - 1);
      }
      ctx.globalAlpha = 1;
      if (showLabel && !dim && !dimByHighlight) {
        const label = shortTitle(n.post.title);
        ctx.font = '11px "Galmuri11", "Pretendard Variable", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        const tx = Math.round(n.x);
        const ty = Math.round(n.y + size / 2 + 2);
        // Background plate so text reads over edges.
        const w = ctx.measureText(label).width;
        ctx.fillStyle = rgbStr(palette.panel);
        ctx.fillRect(tx - w / 2 - 3, ty - 1, w + 6, 13);
        ctx.fillStyle = rgbStr(palette.text);
        ctx.fillText(label, tx, ty);
      }
    }

    ctx.restore();
  }

  function drawEdges(edges, opts) {
    const base = opts.base;
    ctx.lineWidth = opts.series ? 2 / zoom : 1 / zoom;
    ctx.strokeStyle = base;
    for (const e of edges) {
      // d3-force rewrites source/target from URL strings into node objects
      // after .tick() runs. Read whichever form is present.
      const a = (typeof e.source === 'object') ? e.source : nodeById.get(e.source);
      const b = (typeof e.target === 'object') ? e.target : nodeById.get(e.target);
      if (!a || !b) continue;
      const dim = opts.dim(a, b);
      const highlight = opts.highlight(a, b);
      const seriesHi = opts.seriesHighlight && opts.seriesHighlight(a, b);
      if (dim && !highlight && !seriesHi) {
        ctx.globalAlpha = 0.04;
      } else if (seriesHi) {
        ctx.globalAlpha = 1;
        ctx.strokeStyle = rgbStr(palette.goldBright);
        ctx.lineWidth = 3 / zoom;
      } else if (highlight) {
        ctx.globalAlpha = 1;
        ctx.strokeStyle = rgbStr(palette.goldBright);
        ctx.lineWidth = 2 / zoom;
      } else {
        ctx.globalAlpha = opts.weightOpacity(e.weight || 1);
      }
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = base;
      ctx.lineWidth = (opts.series ? 2 : 1) / zoom;
    }
  }

  function neighborsOf(id) {
    const set = new Set();
    function each(edges) {
      for (const e of edges) {
        const src = (typeof e.source === 'object') ? e.source : nodeById.get(e.source);
        const tgt = (typeof e.target === 'object') ? e.target : nodeById.get(e.target);
        if (!src || !tgt) continue;
        if (src.id === id) set.add(tgt.id);
        else if (tgt.id === id) set.add(src.id);
      }
    }
    if (visibleLayers.link) each(linkEdgeObjs);
    if (visibleLayers.series) each(seriesEdgeObjs);
    if (visibleLayers.tag) each(tagEdgeObjs);
    set.add(id);
    return set;
  }

  function isFiltered(node) {
    return !activeCategoryFilters.has(node.category);
  }

  function matchesSearch(node, term) {
    if (!term) return true;
    const t = term.toLowerCase();
    if ((node.post.title || '').toLowerCase().indexOf(t) !== -1) return true;
    for (const tag of (node.post.tags || [])) {
      if (String(tag).toLowerCase().indexOf(t) !== -1) return true;
    }
    return false;
  }

  function shortTitle(title) {
    if (!title) return '';
    if (title.length <= 22) return title;
    return title.slice(0, 21) + '…';
  }

  // ---- interact (pan, zoom, hover, click) ----------------------------------
  function hitTest(cx, cy) {
    const p = clientToSim(cx, cy);
    let best = null;
    let bestDist = Infinity;
    for (const n of nodes) {
      if (isFiltered(n)) continue;
      const s = nodeSize(n);
      const dx = n.x - p.x, dy = n.y - p.y;
      const d2 = dx * dx + dy * dy;
      const r = s / 2 + 3 / zoom;
      if (d2 <= r * r && d2 < bestDist) { bestDist = d2; best = n; }
    }
    return best;
  }

  canvas.addEventListener('pointermove', (ev) => {
    if (isDragging) return;
    const hit = hitTest(ev.clientX, ev.clientY);
    if (hit) {
      hoveredId = hit.id;
      canvas.classList.add('is-pointer');
      setHud(
        (hit.post.categories && hit.post.categories[0]) || '노드',
        hit.post.title,
        `${hit.degreeOut} 참조 · ${hit.degreeIn} 피참조 · ${(hit.post.tags || []).slice(0, 3).map((t) => '#' + t).join(' ') || '—'}`
      );
    } else {
      hoveredId = null;
      canvas.classList.remove('is-pointer');
      clearHud();
    }
    render();
  });

  canvas.addEventListener('pointerleave', () => {
    hoveredId = null;
    canvas.classList.remove('is-pointer');
    clearHud();
    render();
  });

  canvas.addEventListener('pointerdown', (ev) => {
    isDragging = true;
    dragMoved = false;
    dragStartX = ev.clientX; dragStartY = ev.clientY;
    dragCamStartX = camX; dragCamStartY = camY;
    canvas.setPointerCapture(ev.pointerId);
  });
  canvas.addEventListener('pointermove', (ev) => {
    if (!isDragging) return;
    const dx = ev.clientX - dragStartX;
    const dy = ev.clientY - dragStartY;
    if (Math.abs(dx) + Math.abs(dy) > 3) dragMoved = true;
    camX = dragCamStartX + dx / zoom;
    camY = dragCamStartY + dy / zoom;
    render();
  });
  canvas.addEventListener('pointerup', (ev) => {
    isDragging = false;
    if (!dragMoved) {
      const hit = hitTest(ev.clientX, ev.clientY);
      if (hit) selectNode(hit.id);
      else if (selectedId) selectNode(null); // 빈 공간 클릭 → 선택 해제
    }
  });
  canvas.addEventListener('pointercancel', () => { isDragging = false; });

  canvas.addEventListener('dblclick', (ev) => {
    const hit = hitTest(ev.clientX, ev.clientY);
    if (hit) selectNode(hit.id);
    else if (selectedId) selectNode(null); // 더블클릭도 동일
  });

  canvas.addEventListener('wheel', (ev) => {
    ev.preventDefault();
    const factor = Math.exp(-ev.deltaY * 0.0015);
    const newZoom = Math.max(0.3, Math.min(4, zoom * factor));
    // Zoom around the cursor: keep the simulation-space point under the cursor fixed.
    const before = clientToSim(ev.clientX, ev.clientY);
    zoom = newZoom;
    const after = clientToSim(ev.clientX, ev.clientY);
    camX += (after.x - before.x);
    camY += (after.y - before.y);
    render();
  }, { passive: false });

  // Keyboard: pan with arrows, +/- to zoom.
  canvas.addEventListener('keydown', (ev) => {
    const step = 30 / zoom;
    if (ev.key === 'ArrowLeft') { camX -= step; ev.preventDefault(); render(); }
    else if (ev.key === 'ArrowRight') { camX += step; ev.preventDefault(); render(); }
    else if (ev.key === 'ArrowUp') { camY -= step; ev.preventDefault(); render(); }
    else if (ev.key === 'ArrowDown') { camY += step; ev.preventDefault(); render(); }
    else if (ev.key === '+' || ev.key === '=') { zoom = Math.min(4, zoom * 1.2); ev.preventDefault(); render(); }
    else if (ev.key === '-' || ev.key === '_') { zoom = Math.max(0.3, zoom / 1.2); ev.preventDefault(); render(); }
    else if (ev.key === 'Escape' && selectedId) { selectNode(null); }
  });

  // ---- HUD & panel ---------------------------------------------------------
  const hud = document.getElementById('graph-hud');
  const hudEyebrow = document.getElementById('graph-hud-eyebrow');
  const hudTitle = document.getElementById('graph-hud-title');
  const hudMeta = document.getElementById('graph-hud-meta');
  const panelEyebrow = document.getElementById('graph-panel-eyebrow');
  const panelTitle = document.getElementById('graph-panel-title');
  const panelSub = document.getElementById('graph-panel-sub');
  const panelMeta = document.getElementById('graph-panel-meta');
  const panelDate = document.getElementById('graph-panel-date');
  const panelTags = document.getElementById('graph-panel-tags');
  const panelOutSection = document.getElementById('graph-panel-out');
  const panelOutList = document.getElementById('graph-panel-out-list');
  const panelOutCount = document.getElementById('graph-panel-out-count');
  const panelInSection = document.getElementById('graph-panel-in');
  const panelInList = document.getElementById('graph-panel-in-list');
  const panelInCount = document.getElementById('graph-panel-in-count');
  const panelSeriesSection = document.getElementById('graph-panel-series');
  const panelSeriesList = document.getElementById('graph-panel-series-list');

  function setHud(eyebrow, title, meta) {
    if (!hud) return;
    hud.setAttribute('aria-hidden', 'false');
    hudEyebrow.textContent = eyebrow || '';
    hudTitle.textContent = title || '';
    hudMeta.textContent = meta || '';
  }
  function clearHud() {
    if (!hud) return;
    hud.setAttribute('aria-hidden', 'true');
    hudEyebrow.textContent = '';
    hudTitle.textContent = '';
    hudMeta.textContent = '';
  }

  function selectNode(id) {
    selectedId = id;
    if (!id) {
      panelEyebrow.textContent = '노드';
      panelTitle.textContent = '노드를 선택하시오';
      panelSub.textContent = '그래프에서 노드를 클릭하면 그 글의 메타와 참조·피참조 목록이 펼쳐집니다.';
      panelMeta.hidden = true;
      panelOutSection.hidden = true;
      panelInSection.hidden = true;
      panelSeriesSection.hidden = true;
      // 선택 해제 시 카메라는 그대로 둔다 — 보고 있던 위치가 갑자기 튀지 않도록.
      render();
      return;
    }
    const node = nodeById.get(id);
    if (!node) return;
    const post = node.post;
    panelEyebrow.textContent = (post.categories && post.categories[0]) || '노드';
    const titleEl = document.createElement('a');
    titleEl.href = post.url;
    titleEl.textContent = post.title;
    titleEl.className = 'graph-panel-title-link';
    panelTitle.innerHTML = '';
    panelTitle.appendChild(titleEl);
    panelSub.textContent = post.date + ' · 연결 ' + node.degree + '개';
    panelMeta.hidden = false;
    panelDate.textContent = post.date;
    panelTags.innerHTML = '';
    for (const t of (post.tags || [])) {
      const chip = document.createElement('span');
      chip.className = 'graph-tag-chip';
      chip.textContent = '#' + t;
      panelTags.appendChild(chip);
    }

    // Outbound — links FROM this post.
    const outArr = (post.outbound || [])
      .map((u) => byUrl.get(u))
      .filter(Boolean);
    panelOutSection.hidden = false;
    panelOutCount.textContent = outArr.length ? '(' + outArr.length + ')' : '';
    panelOutList.innerHTML = '';
    outArr.sort((a, b) => (a.date < b.date ? 1 : -1));
    for (const t of outArr) {
      const li = makePanelItem(t, () => selectNode(t.url));
      panelOutList.appendChild(li);
    }

    // Inbound — posts that link TO this one.
    const inArr = [];
    for (const p of posts) {
      if ((p.outbound || []).indexOf(post.url) !== -1) inArr.push(p);
    }
    panelInSection.hidden = false;
    panelInCount.textContent = inArr.length ? '(' + inArr.length + ')' : '';
    panelInList.innerHTML = '';
    inArr.sort((a, b) => (a.date < b.date ? 1 : -1));
    for (const t of inArr) {
      const li = makePanelItem(t, () => selectNode(t.url));
      panelInList.appendChild(li);
    }

    // Same series — peers in the same series, sorted by date.
    if (post.series) {
      const peers = posts.filter((p) => p.series === post.series)
        .sort((a, b) => (a.date < b.date ? -1 : 1));
      panelSeriesSection.hidden = false;
      panelSeriesList.innerHTML = '';
      for (const t of peers) {
        const li = makePanelItem(t, () => selectNode(t.url));
        panelSeriesList.appendChild(li);
      }
    } else {
      panelSeriesSection.hidden = true;
    }

    // Center the camera on the selected node.
    if (node) {
      camX = -node.x;
      camY = -node.y;
    }
    render();
  }

  function makePanelItem(post, onClick) {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'graph-panel-item';
    btn.addEventListener('click', onClick);
    const title = document.createElement('span');
    title.className = 'graph-panel-item-title';
    title.textContent = post.title;
    const meta = document.createElement('span');
    meta.className = 'graph-panel-item-meta';
    meta.textContent = post.date + (post.series ? ' · ' + post.series : '');
    const ext = document.createElement('a');
    ext.href = post.url;
    ext.className = 'graph-panel-item-open';
    ext.textContent = '↗ 열기';
    ext.addEventListener('click', (ev) => ev.stopPropagation());
    btn.appendChild(title);
    btn.appendChild(meta);
    li.appendChild(btn);
    li.appendChild(ext);
    return li;
  }

  // ---- controls ------------------------------------------------------------
  // Legend (category toggles).
  const legend = document.getElementById('graph-legend');
  function buildLegend() {
    if (!legend) return;
    legend.innerHTML = '';
    const counts = new Map();
    for (const n of nodes) counts.set(n.category, (counts.get(n.category) || 0) + 1);
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    sorted.forEach(([cat, count], i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'graph-legend-item';
      b.dataset.cat = cat;
      const sw = document.createElement('span');
      sw.className = 'graph-legend-swatch';
      sw.style.background = rgbStr(colorForCategory(cat, i));
      const label = document.createElement('span');
      label.className = 'graph-legend-label';
      label.textContent = cat;
      const cnt = document.createElement('span');
      cnt.className = 'graph-legend-count';
      cnt.textContent = count;
      b.appendChild(sw); b.appendChild(label); b.appendChild(cnt);
      b.addEventListener('click', () => {
        if (activeCategoryFilters.has(cat)) {
          if (activeCategoryFilters.size === 1) {
            // don't allow zero — toggle all back on
            CATEGORIES.forEach((c) => activeCategoryFilters.add(c));
          } else {
            activeCategoryFilters.delete(cat);
          }
        } else {
          activeCategoryFilters.add(cat);
        }
        refreshLegend();
        render();
      });
      legend.appendChild(b);
    });
    refreshLegend();
  }
  function refreshLegend() {
    if (!legend) return;
    legend.querySelectorAll('.graph-legend-item').forEach((el) => {
      el.classList.toggle('is-active', activeCategoryFilters.has(el.dataset.cat));
    });
  }

  // Layer toggles.
  document.getElementById('layer-link').addEventListener('change', (ev) => {
    visibleLayers.link = ev.target.checked;
    render();
  });
  document.getElementById('layer-series').addEventListener('change', (ev) => {
    visibleLayers.series = ev.target.checked;
    render();
  });
  document.getElementById('layer-tag').addEventListener('change', (ev) => {
    visibleLayers.tag = ev.target.checked;
    render();
  });

  // Series select.
  const seriesSelect = document.getElementById('series-select');
  seriesNames.forEach((s) => {
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s + ' (' + seriesPosts.get(s).length + ')';
    seriesSelect.appendChild(opt);
  });
  seriesSelect.addEventListener('change', (ev) => {
    highlightedSeries = ev.target.value;
    render();
  });

  // Search input.
  const searchInput = document.getElementById('search-input-graph');
  const searchClear = document.getElementById('graph-search-clear');
  searchInput.addEventListener('input', (ev) => {
    searchTerm = ev.target.value || '';
    searchClear.hidden = !searchTerm;
    render();
  });
  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchTerm = '';
    searchClear.hidden = true;
    render();
    searchInput.focus();
  });

  // ---- stats (infographic band) -------------------------------------------
  function computeStats() {
    const totalEdges = linkEdges.length + seriesChains.length + tagEdges.length;
    const components = countComponents();
    const hubs = [...nodes].sort((a, b) => b.degree - a.degree).slice(0, 5);
    const orphans = nodes.filter((n) => n.degree === 0).length;

    // Category distribution.
    const catCounts = new Map();
    for (const n of nodes) catCounts.set(n.category, (catCounts.get(n.category) || 0) + 1);

    // Top tags.
    const tagCounts = new Map();
    for (const p of posts) {
      for (const t of (p.tags || [])) {
        tagCounts.set(t, (tagCounts.get(t) || 0) + 1);
      }
    }
    const topTags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);

    return { totalEdges, components, hubs, orphans, catCounts, topTags };
  }

  function countComponents() {
    // Union-find over the link-layer (most meaningful — that's the "knowledge" graph).
    const parent = new Map();
    for (const n of nodes) parent.set(n.id, n.id);
    function find(x) {
      let r = x;
      while (parent.get(r) !== r) r = parent.get(r);
      // path compression
      let cur = x;
      while (parent.get(cur) !== r) {
        const next = parent.get(cur);
        parent.set(cur, r);
        cur = next;
      }
      return r;
    }
    function union(a, b) { parent.set(find(a), find(b)); }
    for (const e of linkEdgeObjs) {
      const src = (typeof e.source === 'object') ? e.source.id : e.source;
      const tgt = (typeof e.target === 'object') ? e.target.id : e.target;
      union(src, tgt);
    }
    const roots = new Set();
    for (const n of nodes) roots.add(find(n.id));
    return roots.size;
  }

  function renderStats() {
    const stats = computeStats();

    document.getElementById('stat-num-posts').textContent = nodes.length;
    document.getElementById('stat-num-edges').textContent = stats.totalEdges;
    document.getElementById('stat-num-components').textContent = stats.components;
    document.getElementById('stat-num-hubs').textContent = stats.hubs.length;
    document.getElementById('stat-num-orphans').textContent = stats.orphans;

    // Category distribution bar.
    const catBar = document.getElementById('graph-cat-bar');
    catBar.innerHTML = '';
    const total = nodes.length;
    const cats = [...stats.catCounts.entries()].sort((a, b) => b[1] - a[1]);
    cats.forEach(([cat, count], i) => {
      const seg = document.createElement('button');
      seg.type = 'button';
      seg.className = 'graph-cat-seg';
      seg.style.background = rgbStr(colorForCategory(cat, i));
      seg.style.flexGrow = String(count);
      seg.title = cat + ' — ' + count + '개 (' + Math.round(count / total * 100) + '%)';
      seg.setAttribute('aria-label', seg.title);
      seg.addEventListener('click', () => {
        if (activeCategoryFilters.has(cat) && activeCategoryFilters.size === 1) {
          // don't allow zero — toggle all back on
          CATEGORIES.forEach((c) => activeCategoryFilters.add(c));
        } else if (activeCategoryFilters.has(cat)) {
          activeCategoryFilters.delete(cat);
        } else {
          activeCategoryFilters.add(cat);
        }
        refreshLegend();
        render();
      });
      catBar.appendChild(seg);
    });

    // Top tag chips.
    const tagChips = document.getElementById('graph-tag-chips');
    tagChips.innerHTML = '';
    stats.topTags.forEach(([tag, count]) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'graph-stat-chip';
      chip.textContent = '#' + tag + ' · ' + count;
      chip.addEventListener('click', () => {
        searchInput.value = tag;
        searchTerm = tag;
        searchClear.hidden = false;
        render();
      });
      tagChips.appendChild(chip);
    });

    // Hub list.
    const hubList = document.getElementById('graph-hub-list');
    hubList.innerHTML = '';
    stats.hubs.forEach((n) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'graph-hub-item';
      btn.addEventListener('click', () => selectNode(n.id));
      const title = document.createElement('span');
      title.className = 'graph-hub-title';
      title.textContent = n.post.title;
      const meta = document.createElement('span');
      meta.className = 'graph-hub-meta';
      meta.textContent = n.category + ' · 연결 ' + n.degree;
      btn.appendChild(title);
      btn.appendChild(meta);
      li.appendChild(btn);
      hubList.appendChild(li);
    });
  }

  buildLegend();
  renderStats();

  // ---- theme reactivity ----------------------------------------------------
  function onThemeChange() {
    readPalette();
    buildLegend();
    renderStats();
    render();
  }
  new MutationObserver(onThemeChange).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  if (window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    if (mq.addEventListener) mq.addEventListener('change', onThemeChange);
    else if (mq.addListener) mq.addEventListener('change', onThemeChange);
  }

  // ---- resize --------------------------------------------------------------
  if (window.ResizeObserver) new ResizeObserver(resize).observe(stage);
  window.addEventListener('resize', resize);
  resize();

  // ---- loop (gated) --------------------------------------------------------
  // rAF is dormant in the resting state — physics is warm-started (300 ticks)
  // and `render()` is called directly from interaction handlers. The
  // visibility/intersection gating only matters for any future animation
  // hook; here it just tracks state for completeness.
  let visible = true, onScreen = true;
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; });
  if (window.IntersectionObserver) {
    new IntersectionObserver((entries) => { onScreen = entries[0].isIntersecting; },
      { threshold: 0.01 }).observe(stage);
  }
  // Reveal.
  if (loading) loading.style.display = 'none';
  if (fallback) fallback.style.display = 'none';
  if (stage) stage.classList.add('is-ready');

  // First-time hint: show briefly then fade.
  const zoomHint = document.getElementById('graph-zoom-hint');
  if (zoomHint) {
    zoomHint.setAttribute('aria-hidden', 'false');
    setTimeout(() => {
      zoomHint.style.transition = 'opacity 0.6s ease';
      zoomHint.style.opacity = '0';
      setTimeout(() => {
        zoomHint.setAttribute('aria-hidden', 'true');
        zoomHint.style.opacity = '';
        zoomHint.style.transition = '';
      }, 700);
    }, 4200);
  }
})();
