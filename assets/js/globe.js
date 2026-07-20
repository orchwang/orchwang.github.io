/*
 * World Map — a pixel-art three.js globe of every post.
 *
 * Continents = top-level categories, provinces = sub-categories. The landmasses
 * are generated procedurally from a category-name seed (deterministic — same
 * planet every visit). Each post is a pixel marker sitting in its region; tags
 * that span two or more continents are drawn as dashed great-circle arcs.
 *
 * Pixel look: the scene is rendered at a low internal resolution and CSS-upscaled
 * with `image-rendering: pixelated`, and the sphere wears a single NearestFilter
 * canvas texture painted in chunky 4px texels. Design tokens drive every colour
 * so the world repaints itself on a light/dark theme switch.
 *
 * See specs/worldmap-globe/plan.md for the full design.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

(async function () {
  'use strict';

  const canvas = document.getElementById('globe-canvas');
  if (!canvas) return;

  const stage = document.getElementById('globe-stage');
  const fallback = document.getElementById('globe-fallback');
  const loading = document.getElementById('globe-loading');

  // Bail to the (already-visible) HTML fallback if WebGL is unavailable.
  try {
    const probe = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!probe) throw new Error('no webgl');
  } catch (e) {
    if (loading) loading.style.display = 'none';
    return;
  }

  // ---- constants -----------------------------------------------------------
  const GRID_W = 256, GRID_H = 128;      // world cell grid
  const TEXEL = 4;                        // canvas px per cell
  const TEX_W = GRID_W * TEXEL;           // 1024
  const TEX_H = GRID_H * TEXEL;           // 512
  const INTERNAL_W = 380;                 // fixed internal render width (chunky)
  const SEED_VERSION = 'warsong-codex-v1';
  const DEG = Math.PI / 180;
  const TWO_PI = Math.PI * 2;
  const POLE_ROWS = 8;                    // ice-cap rows top & bottom (|lat|>78°)
  const LAND_BASE = 130, LAND_K = 235;    // target area = BASE + K*sqrt(postCount)
  const MARKER_R = 1.012;
  const ARC_SEG = 34;

  // Continent base colour = one design token per top-level category.
  const CONTINENT_TOKEN = {
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

  // ---- rng (deterministic) -------------------------------------------------
  function xmur3(str) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return function () {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      h ^= h >>> 16;
      return h >>> 0;
    };
  }
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function seededRng(str) { return mulberry32(xmur3(SEED_VERSION + '::' + str)()); }

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
  function mix(a, b, t) {
    return [
      Math.round(a[0] + (b[0] - a[0]) * t),
      Math.round(a[1] + (b[1] - a[1]) * t),
      Math.round(a[2] + (b[2] - a[2]) * t)
    ];
  }
  const rgbStr = (c) => 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')';
  const rgb01 = (c) => [c[0] / 255, c[1] / 255, c[2] / 255];

  function isDarkTheme() {
    const attr = document.documentElement.getAttribute('data-theme');
    if (attr === 'dark') return true;
    if (attr === 'light') return false;
    return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }

  let palette = {};
  function readPalette() {
    // The sea is a decorative sea-blue (the warm token palette has no blue) —
    // muted/desaturated so it still sits with the Orgrimmar tones, one tone per
    // theme: a mid slate-blue by day, a deep night sea after dark.
    const dark = isDarkTheme();
    const ocean = dark ? [28, 76, 101] : [64, 115, 145];
    palette = {
      ocean: ocean,
      ice: mix(ocean, [236, 241, 246], 0.6),   // pale icy caps
      bg: readToken('--bg-color'),
      panel: readToken('--bg-panel'),
      coast: readToken('--border-strong'),
      gold: readToken('--gold'),
      goldBright: readToken('--gold-bright'),
      text: readToken('--text-color')
    };
    palette.continents = {};
    for (const name in CONTINENT_TOKEN) {
      palette.continents[name] = readToken(CONTINENT_TOKEN[name]);
    }
  }
  readPalette();

  function continentBase(name, index) {
    if (palette.continents[name]) return palette.continents[name];
    return readToken(FALLBACK_TOKENS[index % FALLBACK_TOKENS.length]);
  }

  // ---- geometry helpers (aligned with THREE.SphereGeometry uv) -------------
  // three: u = azimuth/2π, polar angle from +Y = v*π, uv = (u, 1 - v).
  function cellToVec3(col, row, r) {
    const u = (col + 0.5) / GRID_W;
    const v = (row + 0.5) / GRID_H;
    const az = u * TWO_PI;
    const polar = v * Math.PI;
    const sp = Math.sin(polar);
    return new THREE.Vector3(-r * Math.cos(az) * sp, r * Math.cos(polar), r * Math.sin(az) * sp);
  }
  function vec3ToCell(v) {
    const n = v.clone().normalize();
    const polar = Math.acos(THREE.MathUtils.clamp(n.y, -1, 1));
    let az = Math.atan2(n.z, -n.x);
    if (az < 0) az += TWO_PI;
    const col = Math.min(GRID_W - 1, Math.max(0, Math.floor(az / TWO_PI * GRID_W)));
    const row = Math.min(GRID_H - 1, Math.max(0, Math.floor(polar / Math.PI * GRID_H)));
    return [col, row];
  }
  const idx = (col, row) => row * GRID_W + col;

  // ---- data ----------------------------------------------------------------
  let posts;
  try {
    posts = await fetch('/globe.json').then((r) => r.json());
  } catch (e) {
    if (loading) loading.style.display = 'none';
    return;
  }

  // Build continent → province tree.
  const continentMap = new Map();
  for (const p of posts) {
    const cats = p.categories || [];
    if (!cats.length) continue;
    const top = cats[0];
    const sub = cats[1] || null;
    let cont = continentMap.get(top);
    if (!cont) { cont = { name: top, posts: [], subs: new Map() }; continentMap.set(top, cont); }
    cont.posts.push(p);
    const subKey = sub || '__capital__';
    let prov = cont.subs.get(subKey);
    if (!prov) { prov = { name: sub, posts: [] }; cont.subs.set(subKey, prov); }
    prov.posts.push(p);
  }
  const continents = [...continentMap.values()].sort((a, b) => b.posts.length - a.posts.length);
  if (!continents.length) { if (loading) loading.style.display = 'none'; return; }

  // Tag → continent pairs (for arcs).
  const tagConts = new Map();
  for (const p of posts) {
    const top = (p.categories || [])[0];
    if (!top) continue;
    for (const t of (p.tags || [])) {
      let s = tagConts.get(t);
      if (!s) { s = new Set(); tagConts.set(t, s); }
      s.add(top);
    }
  }
  const pairMap = new Map();
  for (const [tag, set] of tagConts) {
    if (set.size < 2) continue;
    const arr = [...set];
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        const key = [arr[i], arr[j]].sort().join('|');
        let e = pairMap.get(key);
        if (!e) { e = { a: arr[i] < arr[j] ? arr[i] : arr[j], b: arr[i] < arr[j] ? arr[j] : arr[i], tags: new Set() }; pairMap.set(key, e); }
        e.tags.add(tag);
      }
    }
  }

  // ---- worldgen ------------------------------------------------------------
  // regionGrid: cell → regionId (0 = ocean). regions[]: 1-indexed province data.
  const regionGrid = new Uint16Array(GRID_W * GRID_H);   // 0 = ocean
  const contGrid = new Int16Array(GRID_W * GRID_H).fill(-1);
  const regions = [null];                                // index 0 reserved (grid 0 = ocean)

  function neighbors(col, row) {
    const out = [];
    out.push([(col + 1) % GRID_W, row]);
    out.push([(col - 1 + GRID_W) % GRID_W, row]);
    if (row > POLE_ROWS) out.push([col, row - 1]);
    if (row < GRID_H - 1 - POLE_ROWS) out.push([col, row + 1]);
    return out;
  }

  function generateWorld() {
    // 1) continent seeds on a Fibonacci sphere, latitude-clamped, seed-jittered.
    const rng = seededRng('continents');
    const rot = rng() * TWO_PI;
    const golden = Math.PI * (3 - Math.sqrt(5));
    const N = continents.length;
    const seedCells = [];
    for (let i = 0; i < N; i++) {
      let y = 1 - (i + 0.5) / N * 2;
      y = THREE.MathUtils.clamp(y + (rng() - 0.5) * 0.2, -0.82, 0.82); // clamp ~|lat|<=55°
      const rad = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = rot + golden * i + (rng() - 0.5) * 0.4;
      const v = new THREE.Vector3(Math.cos(theta) * rad, y, Math.sin(theta) * rad);
      seedCells.push(vec3ToCell(v));
    }

    // 2) grow continents with round-robin stochastic flood fill.
    const owner = new Int16Array(GRID_W * GRID_H).fill(-1);
    const frontiers = continents.map(() => []);
    const areas = new Array(N).fill(0);
    const targets = continents.map((c) => LAND_BASE + LAND_K * Math.sqrt(c.posts.length));
    const grng = seededRng('grow');

    function claim(col, row, ci) {
      const id = idx(col, row);
      if (owner[id] !== -1) return false;
      owner[id] = ci; areas[ci]++;
      for (const [nc, nr] of neighbors(col, row)) {
        if (owner[idx(nc, nr)] === -1) frontiers[ci].push([nc, nr]);
      }
      return true;
    }
    for (let i = 0; i < N; i++) {
      let [c, r] = seedCells[i];
      // nudge a seed that landed on an already-claimed / polar cell
      let guard = 0;
      while ((owner[idx(c, r)] !== -1 || r <= POLE_ROWS || r >= GRID_H - 1 - POLE_ROWS) && guard++ < 40) {
        c = (c + 1 + Math.floor(grng() * GRID_W)) % GRID_W;
        r = POLE_ROWS + 1 + Math.floor(grng() * (GRID_H - 2 - 2 * POLE_ROWS));
      }
      claim(c, r, i);
    }
    let active = true;
    while (active) {
      active = false;
      for (let i = 0; i < N; i++) {
        if (areas[i] >= targets[i] || frontiers[i].length === 0) continue;
        active = true;
        const f = frontiers[i];
        const k = Math.floor(grng() * f.length);
        const cell = f[k];
        f[k] = f[f.length - 1]; f.pop();
        if (owner[idx(cell[0], cell[1])] !== -1) continue;
        // ragged coast: occasionally defer a cell instead of claiming
        if (grng() < 0.16) { f.push(cell); continue; }
        claim(cell[0], cell[1], i);
      }
    }

    // 3) provinces: partition each continent into sub-category regions.
    for (let ci = 0; ci < N; ci++) {
      const cont = continents[ci];
      const contCells = [];
      for (let id = 0; id < owner.length; id++) if (owner[id] === ci) contCells.push(id);
      if (!contCells.length) continue;

      const provs = [...cont.subs.values()].sort((a, b) => b.posts.length - a.posts.length);
      const prng = seededRng('prov::' + cont.name);
      const base = continentBase(cont.name, ci);

      // Register regions, choose a spread seed cell for each province.
      const provRegions = provs.map((prov, pi) => {
        const region = {
          id: regions.length,
          continent: cont.name,
          contIndex: ci,
          sub: prov.name,
          posts: prov.posts,
          cells: [],
          color: pi === 0 ? base : mix(base, palette.panel, Math.min(0.42, 0.14 + pi * 0.11))
        };
        regions.push(region);
        return region;
      });

      // Seed points: pick cells spaced through the continent's cell list.
      const passign = new Int16Array(GRID_W * GRID_H).fill(-1);
      const pfront = provRegions.map(() => []);
      const step = contCells.length / provRegions.length;
      provRegions.forEach((region, pi) => {
        let pick = contCells[Math.floor((pi + 0.5) * step + (prng() - 0.5) * step * 0.6)];
        if (pick == null) pick = contCells[Math.floor(prng() * contCells.length)];
        passign[pick] = pi;
        region.cells.push(pick);
        const col = pick % GRID_W, row = (pick / GRID_W) | 0;
        for (const [nc, nr] of neighbors(col, row)) {
          const nid = idx(nc, nr);
          if (owner[nid] === ci && passign[nid] === -1) pfront[pi].push(nid);
        }
      });

      // Weighted region growth (larger sub-categories claim faster).
      const minCount = Math.max(1, Math.min.apply(null, provs.map((p) => p.posts.length)));
      const weights = provs.map((p) => Math.max(1, Math.min(6, Math.round(p.posts.length / minCount))));
      let remaining = contCells.length - provRegions.length;
      let grow = true;
      while (remaining > 0 && grow) {
        grow = false;
        for (let pi = 0; pi < provRegions.length; pi++) {
          for (let w = 0; w < weights[pi] && remaining > 0; w++) {
            const fr = pfront[pi];
            if (!fr.length) break;
            grow = true;
            const k = Math.floor(prng() * fr.length);
            const nid = fr[k]; fr[k] = fr[fr.length - 1]; fr.pop();
            if (passign[nid] !== -1 || owner[nid] !== ci) continue;
            passign[nid] = pi;
            provRegions[pi].cells.push(nid);
            remaining--;
            const col = nid % GRID_W, row = (nid / GRID_W) | 0;
            for (const [nc, nr] of neighbors(col, row)) {
              const mid = idx(nc, nr);
              if (owner[mid] === ci && passign[mid] === -1) pfront[pi].push(mid);
            }
          }
        }
      }
      // Any stragglers (isolated pockets) → nearest province by continent index.
      for (const id of contCells) {
        if (passign[id] === -1) { passign[id] = 0; provRegions[0].cells.push(id); }
      }

      // Bake into the shared grids.
      for (const region of provRegions) {
        for (const id of region.cells) { regionGrid[id] = region.id; contGrid[id] = ci; }
      }
    }

    // 4) centroids (unit vectors) for continents and regions.
    for (const region of regions) {
      if (!region) continue;
      const acc = new THREE.Vector3();
      for (const id of region.cells) acc.add(cellToVec3(id % GRID_W, (id / GRID_W) | 0, 1));
      region.centroid = region.cells.length ? acc.normalize() : new THREE.Vector3(0, 1, 0);
    }
    continents.forEach((cont, ci) => {
      const acc = new THREE.Vector3();
      let n = 0;
      for (let id = 0; id < contGrid.length; id++) {
        if (contGrid[id] === ci) { acc.add(cellToVec3(id % GRID_W, (id / GRID_W) | 0, 1)); n++; }
      }
      cont.centroid = n ? acc.normalize() : new THREE.Vector3(0, 1, 0);
      cont.regionIds = regions.filter((r) => r && r.contIndex === ci).map((r) => r.id);
    });
  }
  generateWorld();

  // ---- markers (one pixel per post) ---------------------------------------
  const markerPosts = [];
  const markerVecs = [];
  {
    const regionBySub = new Map(); // "cont|sub" -> region
    for (const region of regions) { if (region) regionBySub.set(region.continent + '|' + (region.sub || '__capital__'), region); }
    for (const p of posts) {
      const cats = p.categories || [];
      const top = cats[0]; if (!top) continue;
      const region = regionBySub.get(top + '|' + (cats[1] || '__capital__'))
        || regions.find((r) => r && r.continent === top);
      if (!region || !region.cells.length) continue;
      const r = seededRng('marker::' + p.url);
      const cell = region.cells[Math.floor(r() * region.cells.length)];
      const v = cellToVec3(cell % GRID_W, (cell / GRID_W) | 0, MARKER_R);
      markerPosts.push({ post: p, region: region, vec: v });
      markerVecs.push(v);
    }
  }

  // ---- texture painter -----------------------------------------------------
  const texCanvas = document.createElement('canvas');
  texCanvas.width = TEX_W; texCanvas.height = TEX_H;
  const tctx = texCanvas.getContext('2d');
  let highlightIds = new Set();

  function isCoast(id, col, row) {
    for (const [nc, nr] of neighbors(col, row)) {
      if (regionGrid[idx(nc, nr)] === 0) return true;
    }
    return false;
  }
  function paint() {
    tctx.fillStyle = rgbStr(palette.ocean);
    tctx.fillRect(0, 0, TEX_W, TEX_H);
    // ice caps
    tctx.fillStyle = rgbStr(palette.ice);
    tctx.fillRect(0, 0, TEX_W, POLE_ROWS * TEXEL);
    tctx.fillRect(0, TEX_H - POLE_ROWS * TEXEL, TEX_W, POLE_ROWS * TEXEL);
    for (let row = 0; row < GRID_H; row++) {
      for (let col = 0; col < GRID_W; col++) {
        const id = idx(col, row);
        const rid = regionGrid[id];
        if (rid === 0) continue;
        const region = regions[rid];
        let color = region.color;
        if (highlightIds.has(rid)) color = mix(color, palette.goldBright, 0.55);
        else if (isCoast(id, col, row)) color = mix(color, palette.coast, 0.7);
        tctx.fillStyle = rgbStr(color);
        tctx.fillRect(col * TEXEL, row * TEXEL, TEXEL, TEXEL);
      }
    }
    if (texture) texture.needsUpdate = true;
  }

  // ---- scene ---------------------------------------------------------------
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.18, 2.55);

  const texture = new THREE.CanvasTexture(texCanvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  paint();

  const worldGroup = new THREE.Group();   // sphere + markers + arcs rotate together
  scene.add(worldGroup);

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 96, 64),
    new THREE.MeshBasicMaterial({ map: texture })
  );
  worldGroup.add(sphere);

  // markers
  const mPos = new Float32Array(markerVecs.length * 3);
  const mCol = new Float32Array(markerVecs.length * 3);
  function fillMarkerColors() {
    markerPosts.forEach((m, i) => {
      const base = highlightIds.has(m.region.id)
        ? mix(palette.goldBright, [255, 255, 255], 0.15)
        : mix(m.region.color, [255, 255, 255], 0.35);
      const c = rgb01(base);
      mCol[i * 3] = c[0]; mCol[i * 3 + 1] = c[1]; mCol[i * 3 + 2] = c[2];
    });
  }
  markerVecs.forEach((v, i) => { mPos[i * 3] = v.x; mPos[i * 3 + 1] = v.y; mPos[i * 3 + 2] = v.z; });
  fillMarkerColors();
  const mGeo = new THREE.BufferGeometry();
  mGeo.setAttribute('position', new THREE.BufferAttribute(mPos, 3));
  mGeo.setAttribute('color', new THREE.BufferAttribute(mCol, 3));
  const points = new THREE.Points(mGeo, new THREE.PointsMaterial({ size: 3.4, sizeAttenuation: false, vertexColors: true }));
  worldGroup.add(points);

  // arcs
  const arcGroup = new THREE.Group();
  worldGroup.add(arcGroup);
  const pairList = [...pairMap.values()].sort((a, b) => b.tags.size - a.tags.size);
  const maxTags = pairList.length ? pairList[0].tags.size : 1;
  const shownPairs = pairList.slice(0, 12);
  function slerp(a, b, t) {
    const dot = THREE.MathUtils.clamp(a.dot(b), -1, 1);
    const omega = Math.acos(dot);
    if (omega < 1e-4) return a.clone();
    const so = Math.sin(omega);
    return a.clone().multiplyScalar(Math.sin((1 - t) * omega) / so)
      .add(b.clone().multiplyScalar(Math.sin(t * omega) / so));
  }
  const arcLines = [];
  for (const pair of shownPairs) {
    const ca = continents.find((c) => c.name === pair.a);
    const cb = continents.find((c) => c.name === pair.b);
    if (!ca || !cb) continue;
    const v1 = ca.centroid, v2 = cb.centroid;
    const omega = Math.acos(THREE.MathUtils.clamp(v1.dot(v2), -1, 1));
    const pts = [];
    for (let i = 0; i <= ARC_SEG; i++) {
      const t = i / ARC_SEG;
      const p = slerp(v1, v2, t).normalize();
      const lift = 1 + 0.30 * Math.sin(t * Math.PI) * (omega / Math.PI);
      p.multiplyScalar(1.02 * lift);
      pts.push(p);
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const baseOpacity = 0.28 + 0.5 * (pair.tags.size / maxTags);
    const mat = new THREE.LineDashedMaterial({
      color: rgbStr(palette.gold), transparent: true, opacity: baseOpacity,
      dashSize: 0.05, gapSize: 0.035
    });
    const line = new THREE.Line(geo, mat);
    line.computeLineDistances();
    line.userData = { a: pair.a, b: pair.b, baseOpacity: baseOpacity, tags: pair.tags };
    arcGroup.add(line);
    arcLines.push(line);
  }
  function updateArcColors(activeCont) {
    for (const line of arcLines) {
      const ud = line.userData;
      const touches = !activeCont || ud.a === activeCont || ud.b === activeCont;
      const hot = activeCont && touches;
      line.material.color.set(rgbStr(hot ? palette.goldBright : palette.gold));
      line.material.opacity = activeCont ? (touches ? Math.min(0.95, ud.baseOpacity + 0.35) : 0.06) : ud.baseOpacity;
    }
  }

  const controls = new OrbitControls(camera, canvas);
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.rotateSpeed = 0.5;
  controls.minDistance = 1.55;
  controls.maxDistance = 4.2;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.45;

  scene.background = null; // canvas alpha:true → CSS bg shows the token colour

  // ---- HUD & panel ---------------------------------------------------------
  const hud = document.getElementById('globe-hud');
  const hudEyebrow = document.getElementById('globe-hud-eyebrow');
  const hudTitle = document.getElementById('globe-hud-title');
  const hudMeta = document.getElementById('globe-hud-meta');
  const legend = document.getElementById('globe-legend');
  const panelEyebrow = document.getElementById('globe-panel-eyebrow');
  const panelTitle = document.getElementById('globe-panel-title');
  const panelSub = document.getElementById('globe-panel-sub');
  const panelList = document.getElementById('globe-panel-list');

  let activeContinent = null;

  function setHud(eyebrow, title, meta, marker) {
    if (!hud) return;
    hud.setAttribute('aria-hidden', 'false');
    hud.classList.toggle('is-marker', !!marker);
    hudEyebrow.textContent = eyebrow || '';
    hudTitle.textContent = title || '';
    hudMeta.textContent = meta || '';
  }
  function clearHud() {
    if (!hud) return;
    hud.setAttribute('aria-hidden', 'true');
    hud.classList.remove('is-marker');
  }

  function renderPanel(eyebrow, title, sub, postArr) {
    panelEyebrow.textContent = eyebrow;
    panelTitle.textContent = title;
    panelSub.textContent = sub;
    const sorted = [...postArr].sort((a, b) => (a.date < b.date ? 1 : -1));
    panelList.innerHTML = '';
    for (const p of sorted) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = p.url; a.className = 'globe-post';
      const t = document.createElement('span'); t.className = 'globe-post-title'; t.textContent = p.title;
      const d = document.createElement('span'); d.className = 'globe-post-date'; d.textContent = p.date;
      a.appendChild(t); a.appendChild(d);
      if (p.tags && p.tags.length) {
        const tg = document.createElement('span'); tg.className = 'globe-post-tags';
        tg.textContent = p.tags.slice(0, 4).map((x) => '#' + x).join(' ');
        a.appendChild(tg);
      }
      li.appendChild(a);
      panelList.appendChild(li);
    }
  }

  function selectContinent(name) {
    const cont = continentMap.get(name); if (!cont) return;
    activeContinent = name;
    highlightIds = new Set(cont.regionIds);
    paint(); fillMarkerColors(); mGeo.attributes.color.needsUpdate = true;
    updateArcColors(name);
    renderPanel('대륙', name, cont.posts.length + '개의 출정 기록 · ' + cont.subs.size + '개 영역', cont.posts);
    highlightLegend(name);
  }
  function selectRegion(region) {
    activeContinent = region.continent;
    highlightIds = new Set([region.id]);
    paint(); fillMarkerColors(); mGeo.attributes.color.needsUpdate = true;
    updateArcColors(region.continent);
    renderPanel(region.continent, region.sub || '주요 영토', region.posts.length + '개의 출정 기록', region.posts);
    highlightLegend(region.continent);
  }

  // legend (clickable continent key)
  function buildLegend() {
    if (!legend) return;
    legend.setAttribute('aria-hidden', 'false');
    legend.innerHTML = '';
    continents.forEach((cont, ci) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'globe-legend-item'; b.dataset.cont = cont.name;
      const sw = document.createElement('span'); sw.className = 'globe-legend-swatch';
      sw.style.background = rgbStr(continentBase(cont.name, ci));
      const label = document.createElement('span'); label.className = 'globe-legend-label';
      label.textContent = cont.name;
      const cnt = document.createElement('span'); cnt.className = 'globe-legend-count';
      cnt.textContent = cont.posts.length;
      b.appendChild(sw); b.appendChild(label); b.appendChild(cnt);
      b.addEventListener('click', () => selectContinent(cont.name));
      legend.appendChild(b);
    });
  }
  function highlightLegend(name) {
    if (!legend) return;
    legend.querySelectorAll('.globe-legend-item').forEach((el) => {
      el.classList.toggle('is-active', el.dataset.cont === name);
    });
  }
  function refreshLegendSwatches() {
    if (!legend) return;
    legend.querySelectorAll('.globe-legend-item').forEach((el) => {
      const ci = continents.findIndex((c) => c.name === el.dataset.cont);
      el.querySelector('.globe-legend-swatch').style.background = rgbStr(continentBase(el.dataset.cont, ci));
    });
  }
  buildLegend();

  // ---- picking -------------------------------------------------------------
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let hoveredMarker = null;

  function pointerToNdc(ev) {
    const rect = canvas.getBoundingClientRect();
    ndc.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
    ndc.y = -(((ev.clientY - rect.top) / rect.height) * 2 - 1);
  }
  function regionAt(ev) {
    pointerToNdc(ev);
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObject(sphere, false)[0];
    if (!hit || !hit.uv) return null;
    const col = Math.min(GRID_W - 1, Math.max(0, Math.floor(hit.uv.x * GRID_W)));
    const row = Math.min(GRID_H - 1, Math.max(0, Math.floor((1 - hit.uv.y) * GRID_H)));
    const rid = regionGrid[idx(col, row)];
    return { region: rid ? regions[rid] : null, point: hit.point };
  }
  const _camN = new THREE.Vector3(), _tmp = new THREE.Vector3(), _best = new THREE.Vector3();
  function markerAt(ev) {
    // Nearest marker in screen space, restricted to the near hemisphere (cheap
    // normal test), with a single occlusion raycast for the winner only.
    const rect = canvas.getBoundingClientRect();
    const mx = ev.clientX - rect.left, my = ev.clientY - rect.top;
    _camN.copy(camera.position).normalize();
    let best = null, bestD = 13 * 13;
    for (const m of markerPosts) {
      _tmp.copy(m.vec).applyMatrix4(worldGroup.matrixWorld);
      if (_tmp.clone().normalize().dot(_camN) < 0.12) continue; // far hemisphere
      const proj = _tmp.clone().project(camera);
      if (proj.z > 1) continue;
      const sx = (proj.x * 0.5 + 0.5) * rect.width;
      const sy = (-proj.y * 0.5 + 0.5) * rect.height;
      const d = (sx - mx) * (sx - mx) + (sy - my) * (sy - my);
      if (d < bestD) { bestD = d; best = m; _best.copy(_tmp); }
    }
    if (!best) return null;
    // occlusion check: is the winning marker actually in front of the globe?
    const dir = _best.clone().sub(camera.position).normalize();
    raycaster.set(camera.position, dir);
    const sHit = raycaster.intersectObject(sphere, false)[0];
    if (sHit && sHit.distance < _best.distanceTo(camera.position) - 0.02) return null;
    return best;
  }

  function onMove(ev) {
    const marker = markerAt(ev);
    if (marker) {
      hoveredMarker = marker;
      canvas.classList.add('is-pointer');
      const p = marker.post;
      setHud(marker.region.continent + (marker.region.sub ? ' ▸ ' + marker.region.sub : ''),
        p.title, p.date + (p.tags && p.tags.length ? '  ·  ' + p.tags.slice(0, 3).map((x) => '#' + x).join(' ') : ''), true);
      return;
    }
    hoveredMarker = null;
    canvas.classList.remove('is-pointer');
    const r = regionAt(ev);
    if (r && r.region) {
      const cont = continentMap.get(r.region.continent);
      setHud(r.region.continent, r.region.sub || '주요 영토', r.region.posts.length + ' posts', false);
    } else {
      clearHud();
    }
  }
  function onClick(ev) {
    if (hoveredMarker) { window.location.href = hoveredMarker.post.url; return; }
    const r = regionAt(ev);
    if (r && r.region) selectRegion(r.region);
  }

  // pointer wiring — distinguish a drag (orbit) from a tap (select)
  let downX = 0, downY = 0, downT = 0, moved = false;
  canvas.addEventListener('pointermove', (ev) => { if (ev.pressure > 0) moved = true; onMove(ev); });
  canvas.addEventListener('pointerdown', (ev) => { downX = ev.clientX; downY = ev.clientY; downT = performance.now(); moved = false; });
  canvas.addEventListener('pointerup', (ev) => {
    const dist = Math.hypot(ev.clientX - downX, ev.clientY - downY);
    if (dist < 6 && performance.now() - downT < 500) onClick(ev);
  });
  canvas.addEventListener('pointerleave', () => { hoveredMarker = null; canvas.classList.remove('is-pointer'); clearHud(); });

  // keyboard: rotate / zoom / select
  canvas.addEventListener('keydown', (ev) => {
    const step = 0.2;
    controls.autoRotate = false;
    if (ev.key === 'ArrowLeft') { worldGroup.rotation.y -= step; ev.preventDefault(); }
    else if (ev.key === 'ArrowRight') { worldGroup.rotation.y += step; ev.preventDefault(); }
    else if (ev.key === 'ArrowUp') { worldGroup.rotation.x = Math.max(-1.1, worldGroup.rotation.x - step); ev.preventDefault(); }
    else if (ev.key === 'ArrowDown') { worldGroup.rotation.x = Math.min(1.1, worldGroup.rotation.x + step); ev.preventDefault(); }
    else if (ev.key === '+' || ev.key === '=') { camera.position.multiplyScalar(0.9); ev.preventDefault(); }
    else if (ev.key === '-' || ev.key === '_') { camera.position.multiplyScalar(1.1); ev.preventDefault(); }
  });

  // ---- theme reactivity ----------------------------------------------------
  function onThemeChange() {
    readPalette();
    // regions keep their shape; only the palette-derived colours are recomputed
    regions.forEach((region) => {
      if (!region) return;
      const base = continentBase(region.continent, region.contIndex);
      const provIndex = continentMap.get(region.continent)
        ? [...continentMap.get(region.continent).subs.values()]
          .sort((a, b) => b.posts.length - a.posts.length)
          .findIndex((p) => (p.name || '__capital__') === (region.sub || '__capital__'))
        : 0;
      region.color = provIndex <= 0 ? base : mix(base, palette.panel, Math.min(0.42, 0.14 + provIndex * 0.11));
    });
    paint();
    fillMarkerColors(); mGeo.attributes.color.needsUpdate = true;
    updateArcColors(activeContinent);
    refreshLegendSwatches();
  }
  new MutationObserver(onThemeChange).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  if (window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    if (mq.addEventListener) mq.addEventListener('change', onThemeChange);
    else if (mq.addListener) mq.addListener(onThemeChange);
  }

  // ---- resize --------------------------------------------------------------
  function resize() {
    const w = stage.clientWidth || 640;
    const h = stage.clientHeight || 480;
    const aspect = w / h;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    const iw = INTERNAL_W;
    const ih = Math.max(160, Math.round(INTERNAL_W / aspect));
    renderer.setSize(iw, ih, false); // updateStyle=false → CSS keeps canvas at 100%
  }
  if (window.ResizeObserver) new ResizeObserver(resize).observe(stage);
  window.addEventListener('resize', resize);
  resize();

  // ---- loop (gated) --------------------------------------------------------
  let running = true, visible = true, onScreen = true, last = 0;
  function setRunning() { running = visible && onScreen; if (running) requestAnimationFrame(loop); }
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; setRunning(); });
  if (window.IntersectionObserver) {
    new IntersectionObserver((entries) => {
      onScreen = entries[0].isIntersecting;
      setRunning();
    }, { threshold: 0.01 }).observe(stage);
  }
  // idle → resume auto-rotate 6s after last interaction
  let idleTimer = null;
  controls.addEventListener('start', () => { controls.autoRotate = false; if (idleTimer) clearTimeout(idleTimer); });
  controls.addEventListener('end', () => { if (idleTimer) clearTimeout(idleTimer); idleTimer = setTimeout(() => { controls.autoRotate = true; }, 6000); });

  function loop(now) {
    if (!running) return;
    requestAnimationFrame(loop);
    if (now - last < 33) return; // ~30fps cap
    last = now;
    controls.update();
    renderer.render(scene, camera);
  }

  // reveal
  if (loading) loading.style.display = 'none';
  if (fallback) fallback.style.display = 'none';
  if (stage) stage.classList.add('is-ready');
  requestAnimationFrame(loop);
})();
