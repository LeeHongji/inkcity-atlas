'use strict';
/* rendering: paper, per-tile bakes at a zoom, the frame, the build animation.
   A bake is: one base canvas per tile (everything that can never hide an actor), one small canvas per
   "sprite" object (things an actor can pass behind), and vector paths for the six boil drawings.
   Bakes are deterministic functions of (tile, zoom, region), so they are only a cache. */

const R = SF.R = { tex: null, jobs: [], pixels: 0, budget: 64e6, stamp: 0, drawStamp: 0, stats: { bakeMs: 0 }, dead: [], deadPx: 0, bmpUntil: 0, bmpPending: false, warmPx: 0 };
/* make the GPU finish a freshly drawn canvas now, not on the frame of the cut */
function warm(cv) { if (!R.warmCtx) R.warmCtx = mkCanvas(2, 2).getContext('2d'); R.warmCtx.drawImage(cv, 0, 0, 1, 1); }
/* replay a display list in slices of roughly equal work: points, plus the device pixels a fill covers (at x9 one big
   fill costs more than thousands of points) */
const fillArea = (d) => { if (d.ab == null) { const p = d.p; let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (let i = 0; i < p.length; i += 2) { if (p[i] < x0) x0 = p[i]; if (p[i] > x1) x1 = p[i]; if (p[i + 1] < y0) y0 = p[i + 1]; if (p[i + 1] > y1) y1 = p[i + 1]; } d.ab = (x1 - x0) * (y1 - y0); } return d.ab; };
const cmdWork = (d, pz2) => (d.p ? d.p.length : d.c ? d.c.length * 2 : 8) + (d.k === K_FILL && pz2 ? fillArea(d) * pz2 / 400 : 0);
function* replaySliced(ctx, list, hw, opt, pz) {
  let i0 = 0, w = 0; const pz2 = pz ? pz * pz : 0;
  for (let i = 0; i < list.length; i++) { w += cmdWork(list[i], pz2); if (w > 5000) { replay(ctx, list.slice(i0, i + 1), hw, opt); i0 = i + 1; w = 0; yield 'slice'; } }
  if (i0 < list.length) replay(ctx, list.slice(i0), hw, opt);
}

/* every cache canvas reports a GPU reset (R.lost): Chrome wipes them all and the caches must be rebuilt (gpuReset) */
const onLost = () => { R.lost = true; };
function mkCanvas(w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, w | 0); c.height = Math.max(1, h | 0); c.addEventListener('contextlost', onLost); return c; }
/* forget everything drawn on the GPU: paper and grain, bakes, construction canvases, actor bitmaps, pose atlases */
function gpuReset() {
  R.lost = false; R.jobs.length = 0; R.dead.length = 0; R.deadPx = 0; R.pixels = 0;
  mkTextures(); R.paperPat = null; R.paperPatN = null; R.grainPat = null; R.warmCtx = null; GLOWTEX.clear();
  for (const c of ABMP.list) c.dl.bmp.delete(c.key);
  ABMP.list.length = 0; ABMP.px = 0;
  for (const a of SF.actors) a.lastB = null;
  for (const A of ATLS) { A.pages.length = 0; atlasReset(A); }
  paReset(); POSEPG.pages.length = 0; if (R.lightCv) { R.lightCv = null; }
  for (const t of SF.live) { t.bakes = []; t.wide = null; t.cons = null; t.doneAt = null; }
}

/* ---------- paper and paint grain (seamless 512 px tiles) ---------- */
function mkTextures() {
  const N = 512;
  const pn = (x, y, per, seed) => {              // periodic value noise, [0,1]
    const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy, ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
    const k = (a, b) => h2(((a % per) + per) % per * 9173 + ((b % per) + per) % per * 31, seed);
    const a = k(ix, iy), b = k(ix + 1, iy), c = k(ix, iy + 1), d = k(ix + 1, iy + 1);
    return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
  };
  const paper = mkCanvas(N, N), grain = mkCanvas(N, N), paperN = mkCanvas(N, N), grainN = mkCanvas(N, N);
  const pc = paper.getContext('2d'), gc = grain.getContext('2d'), nc = paperN.getContext('2d'), gnc = grainN.getContext('2d');
  const pd = pc.createImageData(N, N), gd = gc.createImageData(N, N), nd = nc.createImageData(N, N), gnd = gnc.createImageData(N, N), NP = NIGHT.paper;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const i = (y * N + x) * 4;
    const fine = pn(x / 2.2, y / 2.2, Math.round(N / 2.2), 5) - 0.5, mid = pn(x / 8, y / 8, N / 8, 6) - 0.5, big = pn(x / 64, y / 64, N / 64, 7) - 0.5;
    const speck = h2(x * 7919 + y, 8);
    let v = fine * 3.4 + mid * 3.0 + big * 2.2;
    if (speck > 0.9965) v -= 5 + 6 * h2(x, y); else if (speck < 0.002) v += 3;
    pd.data[i] = clamp(240.5 + v, 0, 255); pd.data[i + 1] = clamp(238 + v * 0.95, 0, 255); pd.data[i + 2] = clamp(228 + v * 1.05, 0, 255); pd.data[i + 3] = 255;
    nd.data[i] = clamp(NP[0] + v * 0.5, 0, 255); nd.data[i + 1] = clamp(NP[1] + v * 0.52, 0, 255); nd.data[i + 2] = clamp(NP[2] + v * 0.62, 0, 255); nd.data[i + 3] = 255;   // the night's paper
    const g = fine * 1.5 + mid * 1.1 + (pn(x / 3.3, y / 1.4, Math.round(N / 3.3), 9) - 0.5) * 0.9;     // paint grain, signed
    if (g > 0) { gd.data[i] = 255; gd.data[i + 1] = 252; gd.data[i + 2] = 244; gd.data[i + 3] = clamp(g * 15, 0, 255); }
    else { gd.data[i] = 70; gd.data[i + 1] = 58; gd.data[i + 2] = 44; gd.data[i + 3] = clamp(-g * 15, 0, 255); }
    if (g > 0) { gnd.data[i] = 170; gnd.data[i + 1] = 182; gnd.data[i + 2] = 214; gnd.data[i + 3] = clamp(g * 6, 0, 255); }        // the night's grain
    else { gnd.data[i] = 8; gnd.data[i + 1] = 10; gnd.data[i + 2] = 20; gnd.data[i + 3] = clamp(-g * 14, 0, 255); }
  }
  pc.putImageData(pd, 0, 0); gc.putImageData(gd, 0, 0); nc.putImageData(nd, 0, 0); gnc.putImageData(gnd, 0, 0);
  R.tex = { paper, grain, paperN, grainN, N };
}

/* ---------- views ---------- */
/* cam = {z, cx, cy}: zoom relative to the wide view and centre in wide px.
   The picture is composed for 1920x1080 and fitted to the canvas. */
function mkView(cam, cw, ch, fit) {
  const s = Math.min(cw / 1920, ch / 1080), pz = cam.z * s;
  const v = { cam, cw, ch, s, z: cam.z, pz, tx: Math.round(cw / 2 - cam.cx * pz), ty: Math.round(ch / 2 - cam.cy * pz) };
  v.hw = lineW(cam.z) * ((typeof SCENE !== 'undefined' && SCENE.ink) || 1) / (2 * cam.z);   // main contour half-width, wide px (SCENE.ink: the scene's pen, finer < 1)
  v.amp = 0.9 / cam.z;                                       // boil amplitude, wide px
  if (fit) { const w = Math.round(1920 * s), h = Math.round(1080 * s); v.clip = [Math.round((cw - w) / 2), Math.round((ch - h) / 2), w, h]; }
  const c = v.clip || [0, 0, cw, ch];
  v.rect = [(c[0] - v.tx) / pz, (c[1] - v.ty) / pz, (c[0] + c[2] - v.tx) / pz, (c[1] + c[3] - v.ty) / pz];   // visible wide-px rect
  return v;
}
function isect(a, b) { return [Math.max(a[0], b[0]), Math.max(a[1], b[1]), Math.min(a[2], b[2]), Math.min(a[3], b[3])]; }
function devRect(r, pz) { const x0 = Math.floor(r[0] * pz), y0 = Math.floor(r[1] * pz); return [x0, y0, Math.ceil(r[2] * pz) - x0, Math.ceil(r[3] * pz) - y0]; }

function grainOver(ctx, x0, y0, w, h) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'source-atop';
  if (!R.grainPat) R.grainPat = ctx.createPattern(R.tex.grain, 'repeat');
  const ox = ((-x0 % 512) + 512) % 512, oy = ((-y0 % 512) + 512) % 512;
  ctx.translate(ox - 512, oy - 512); ctx.fillStyle = ctx.createPattern(LOOK.night ? R.tex.grainN : R.tex.grain, 'repeat'); ctx.fillRect(0, 0, w + 1024, h + 1024);
  ctx.restore();
}
/* the six boil drawings of a set of objects as one Path2D per colour per drawing; a generator so it can be sliced */
function* compileBoilGen(objs, hw, amp, region) {
  const out = []; let any = false, n = 0;
  for (let k = 0; k < BOIL_N; k++) {
    const by = new Map();
    for (const ob of objs) {
      if (region && !bbHit(ob.bb, region)) continue;
      for (const d of ob.list) {
        if (d.k !== K_RIB || !d.bo || !d.live) continue;
        if (region) {                                        // cull per stroke, not per object: big objects have many off-view lines
          if (!d.rb) { const c = d.c; let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (let i = 0; i < c.length; i += 2) { if (c[i] < x0) x0 = c[i]; if (c[i] > x1) x1 = c[i]; if (c[i + 1] < y0) y0 = c[i + 1]; if (c[i + 1] > y1) y1 = c[i + 1]; } d.rb = [x0 - 4, y0 - 4, x1 + 4, y1 + 4]; }
          if (!bbHit(d.rb, region)) continue;
        }
        const col = colOf(d, d.col); let p = by.get(col); if (!p) { p = new Path2D(); by.set(col, p); }
        ribPath(p, d, hw, null, k * d.w.length, amp); any = true;
        if ((++n % 150) === 0) yield 'boil';
      }
    }
    out.push(Array.from(by, ([col, path]) => ({ col, path })));
  }
  return any ? out : null;
}
function compileBoil(objs, hw, amp, region) { const g = compileBoilGen(objs, hw, amp, region); let r; do { r = g.next(); } while (!r.done); return r.value; }

/* ---------- bakes ---------- */
function* bakeGen(t, v, region, o) {
  o = o || {};
  const pz = v.pz, hw = v.hw, t0 = performance.now();
  const reg = isect(region, o.noCast ? t.bbNoCast : t.bb);
  const b = { tile: t, pz, z: v.z, region: reg, base: null, sprites: [], boil: null, pixels: 0, ready: false, stamp: ++R.stamp, noCast: !!o.noCast };
  if (reg[0] >= reg[2] || reg[1] >= reg[3]) { b.ready = true; return b; }
  // the canvas covers only what is drawn inside the region (a ring or a shared sea is mostly empty inside its box);
  // b.region stays the full region, so the bake still counts as covering the view
  let tight = [1e9, 1e9, -1e9, -1e9];
  for (const ob of t.statics) { if (o.noCast && ob.cast) continue; if (!bbHit(ob.bb, reg)) continue; tight = [Math.min(tight[0], ob.bb[0]), Math.min(tight[1], ob.bb[1]), Math.max(tight[2], ob.bb[2]), Math.max(tight[3], ob.bb[3])]; }
  tight = isect(reg, tight);
  if (tight[0] >= tight[2] || tight[1] >= tight[3]) { b.ready = true; return b; }
  const dr = devRect(tight, pz);
  const cv = mkCanvas(dr[2], dr[3]), ctx = cv.getContext('2d');
  ctx.setTransform(pz, 0, 0, pz, -dr[0], -dr[1]); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  b.base = { cv, x: dr[0], y: dr[1], w: dr[2], h: dr[3] }; b.pixels += dr[2] * dr[3];
  const baseObjs = [];
  let n = 0;
  for (const ob of t.statics) {
    if (o.noCast && ob.cast) continue;
    if (!bbHit(ob.bb, reg)) continue;
    if (ob.promoted && !o.noCast) continue;
    yield* replaySliced(ctx, ob.list, hw, { skipBoil: !o.noCast }, pz);
    baseObjs.push(ob);
    yield 'obj';
  }
  grainOver(ctx, dr[0], dr[1], dr[2], dr[3]); warm(cv); R.warmPx += dr[2] * dr[3]; yield 'grain+warm';
  if (!o.noCast) {
    b.boil = yield* compileBoilGen(baseObjs, hw, v.amp, reg); yield 'boil-done';
    for (const ob of t.statics) {
      if (!ob.promoted || !bbHit(ob.bb, reg)) continue;
      const r = devRect(isect(ob.bb, reg), pz);
      if (r[2] <= 0 || r[3] <= 0) continue;
      const sc = mkCanvas(r[2], r[3]), sx = sc.getContext('2d');
      sx.setTransform(pz, 0, 0, pz, -r[0], -r[1]); sx.lineCap = 'round'; sx.lineJoin = 'round';
      yield* replaySliced(sx, ob.list, hw, { skipBoil: true }, pz);
      grainOver(sx, r[0], r[1], r[2], r[3]); warm(sc); R.warmPx += r[2] * r[3];
      b.sprites.push({ ob, cv: sc, x: r[0], y: r[1], w: r[2], h: r[3], boil: yield* compileBoilGen([ob], hw, v.amp, reg) });
      b.pixels += r[2] * r[3];
      yield 'sprite';
    }
  }
  b.ready = true; R.stats.bakeMs += performance.now() - t0;
  return b;
}
function covers(b, need) { return b.region[0] <= need[0] + 0.01 && b.region[1] <= need[1] + 0.01 && b.region[2] >= need[2] - 0.01 && b.region[3] >= need[3] - 0.01; }
function findBake(t, v, noCast) {
  if (!t.bakes) t.bakes = [];
  const need = isect(v.rect, noCast ? t.bbNoCast : t.bb);
  for (const b of t.bakes) if (b.ready && b.noCast === !!noCast && Math.abs(b.pz - v.pz) < 1e-6 && covers(b, need)) { b.stamp = ++R.stamp; return b; }
  return null;
}
function evict() {
  let total = 0; const all = [];
  for (const t of SF.live) if (t.bakes) for (const b of t.bakes) { total += b.pixels; all.push(b); }
  R.pixels = total;
  if (total <= R.budget) return;
  all.sort((a, b) => a.stamp - b.stamp);
  for (const b of all) {
    if (total <= R.budget * 0.8) break;
    if (b.pin || b.stamp > R.drawStamp) continue;     // never evict what the frame on screen uses: that would thrash
    b.tile.bakes.splice(b.tile.bakes.indexOf(b), 1); total -= b.pixels;
    // releasing big GPU canvases costs several ms each: queue them and let reap() free one per frame
    if (b.base) toDead(b.base.cv); for (const s of b.sprites) toDead(s.cv);
  }
  R.pixels = total;
}
function toDead(cv) { R.dead.push(cv); R.deadPx += cv.width * cv.height; }
/* free evicted canvases. The film frees one per frame: freeing a big GPU canvas costs milliseconds (the cost lands on
   the GPU, after this loop), so a burst hitches the film. Exploring retires a whole bake per pan (a base and dozens of
   sprites) and waiting canvases pile up until the browser may drop the page's GPU canvas, so there (ms set) they are
   freed within a time budget, tripled while more than `cap` pixels wait. */
function reap(all, ms, cap) {
  const t0 = performance.now();
  while (R.dead.length) {
    const c = R.dead.pop(); R.deadPx -= c.width * c.height; c.width = 0; c.height = 0;
    if (all) continue;
    if (!ms || performance.now() - t0 > ms * (cap && R.deadPx > cap ? 3 : 1)) break;
  }
  if (!R.dead.length) R.deadPx = 0;
}
/* margin (fraction of the view) lets a bake survive a little panning */
function bakeRegion(v, margin) { const r = v.rect, mx = (r[2] - r[0]) * margin, my = (r[3] - r[1]) * margin; return [r[0] - mx, r[1] - my, r[2] + mx, r[3] + my]; }
function bakeNow(t, v, o) {
  o = o || {};
  const g = bakeGen(t, v, bakeRegion(v, o.margin || 0), o); let r;
  do { r = g.next(); } while (!r.done);
  if (!t.bakes) t.bakes = [];
  t.bakes.push(r.value); if (o.pin) r.value.pin = true;
  return r.value;
}
/* queue a bake to be done in slices; returns immediately */
function bakeLater(t, v, o) {
  o = o || {};
  const key = t.name + '|' + v.pz.toFixed(5) + '|' + v.rect.map((x) => Math.round(x)).join(',') + (o.noCast ? 'n' : '');
  for (const j of R.jobs) if (j.key === key) return;
  R.jobs.push({ key, t, gen: bakeGen(t, v, bakeRegion(v, o.margin || 0), o), pin: !!o.pin });
}
/* finish every queued job now (used at a cut, for the shot that is about to show) */
function finishJobs() { while (R.jobs.length) runJobs(1e9); }
/* run background jobs for up to ms. maxPx (exploring): also stop once this many pixels have been rasterised this frame;
   the raster lands on the GPU after the JavaScript returns, so a burst of fresh canvases would still drop frames */
function runJobs(ms, maxPx) {
  const end = performance.now() + ms; R.lastSteps = []; R.warmPx = 0;
  while (R.jobs.length && performance.now() < end && !(maxPx && R.warmPx >= maxPx)) {
    if (R.jobs[0].low && R.jobs.length > 1) { const k = R.jobs.findIndex((q) => !q.low); if (k > 0) R.jobs.unshift(R.jobs.splice(k, 1)[0]); }   // a low job waits for the bakes
    const j = R.jobs[0], ts = performance.now(), r = j.gen.next(), dt = performance.now() - ts;
    if (window.__slowJobs) R.lastSteps.push(+dt.toFixed(1));
    if (dt > 6 && window.__slowJobs) window.__slowJobs.push([Math.round(SF.app && SF.app.t0 ? (performance.now() - SF.app.t0) / 1000 * 30 : -1), j.key || (j.t ? 'bake:' + j.t.name : '?'), +dt.toFixed(1), r.value == null ? '' : String(r.value)]);
    if (r.done) { R.jobs.shift(); if (j.fn) { j.fn(r.value); continue; } if (!j.t.bakes) j.t.bakes = []; if (j.pin) r.value.pin = true; r.value.stamp = ++R.stamp; j.t.bakes.push(r.value); evict(); }   // fresh: a bake just made for the view is never the first to go
  }
  return R.jobs.length;
}
/* make sure every tile in view has an exact bake: now (sync) or soon */
function ensureBakes(v, sync, o) {
  let missing = 0;
  for (const t of SF.live) {
    if (!bbHit(t.bb, v.rect)) continue;
    if (findBake(t, v)) continue;
    missing++;
    if (sync) bakeNow(t, v, o); else bakeLater(t, v, o);
  }
  if (sync && missing) evict();
  return missing;
}
function bestBake(t, v) {
  // exact if we have it, otherwise the sharpest bake that covers the visible part (drawn scaled)
  const ex = findBake(t, v); if (ex) return ex;
  if (!t.bakes) return null;
  const need = isect(v.rect, t.bb); let best = null;
  for (const b of t.bakes) if (b.ready && !b.noCast && covers(b, need) && (!best || Math.abs(Math.log(b.pz / v.pz)) < Math.abs(Math.log(best.pz / v.pz)))) best = b;
  return best || t.wide || null;
}

/* ---------- the build: construction lines, then broken colour ---------- */
const SWEEP_X = 0.039, SWEEP_Y = 0.066;      // frames of delay per wide px to the right / down
function initCons(t, v) {
  const key = v.pz.toFixed(5);
  if (t.cons && t.cons.key === key) return t.cons;
  const pz = v.pz, hw = v.hw;
  const bb = t.bbNoCast, dr = devRect(bb, pz);
  const mx = (bb[0] + bb[2]) / 2, my = (bb[1] + bb[3]) / 2;
  const lag = t.o.paintLag == null ? 35 : t.o.paintLag, lead = t.o.lineLag == null ? lag - 16 : t.o.lineLag;
  const sweep = (x, y) => clamp(SWEEP_X * (x - mx) + SWEEP_Y * (y - my), -15, 15);
  const strokes = [];
  let sid = 0;
  for (const ob of t.statics) {
    if (ob.cast) continue;
    for (const d of ob.list) {
      sid++;
      if (d.k === K_RIB || d.k === K_STROKE || d.k === K_RING) {
        if (d.cons === false) continue;
        let x, y, len;
        if (d.k === K_RIB) { const m = (d.w.length >> 1) * 2; x = d.c[m]; y = d.c[m + 1]; len = d.len; }
        else if (d.k === K_STROKE) { const m = ((d.p.length / 2) >> 1) * 2; x = d.p[m]; y = d.p[m + 1]; len = Math.hypot(d.p[d.p.length - 2] - d.p[0], d.p[d.p.length - 1] - d.p[1]); }
        else { x = d.x; y = d.y; len = d.r * 6; }
        let a, dur;
        if (ob.rim) { a = t.rim + 3 * h2(sid, 5); dur = 3 + len / 110; }
        else { a = t.rim + lead + 0.55 * sweep(x, y) + (h2(sid, 6) - 0.5) * 7; dur = 1.5 + Math.min(5, len / 28); }
        strokes.push({ d, a, b: a + dur });
      } else if ((d.k === K_SEGS || d.k === K_TRIS) && d.cons) {
        const st = d.k === K_SEGS ? 4 : 6, p = d.p;
        for (let i = 0; i < p.length; i += st) { const a = t.rim + lead + 1 + 0.55 * sweep(p[i], p[i + 1]) + (h2(sid * 131 + i, 7) - 0.5) * 8; strokes.push({ d, i, a, b: a + 1 }); }
      }
    }
  }
  strokes.sort((p, q) => p.b - q.b);
  // paint dabs: ragged brush marks on a jittered grid; a few arrive late and leave paper holes for a moment
  const dabs = [], r = RNG('dab' + t.name), cx = 24, cy = 17;
  let last = 0;
  for (let y = bb[1] - cy; y < bb[3] + cy; y += cy) for (let x = bb[0] - cx + ((Math.round(y / cy) & 1) ? cx / 2 : 0); x < bb[2] + cx; x += cx) {
    const px = x + (r() - 0.5) * cx * 0.7, py = y + (r() - 0.5) * cy * 0.7;
    const late = r() < 0.14 ? 3 + r() * 6 : 0;
    const at = t.rim + lag + sweep(px, py) + (r() - 0.5) * 4 + late;
    const ang = -0.45 + (r() - 0.5) * 0.7, ra = cx * (0.85 + r() * 0.5), rb = cy * (0.6 + r() * 0.4), pts = [];
    const ph = r() * 9;
    for (let k = 0; k < 11; k++) {
      const th = k / 11 * TAU, rr = 1 + 0.3 * Math.sin(th * 3 + ph) + 0.22 * (r() - 0.5), ex = Math.cos(th) * ra * rr, ey = Math.sin(th) * rb * rr;
      pts.push((px + ex * Math.cos(ang) - ey * Math.sin(ang)) * pz - dr[0], (py + ex * Math.sin(ang) + ey * Math.cos(ang)) * pz - dr[1]);
    }
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (let k = 0; k < pts.length; k += 2) { x0 = Math.min(x0, pts[k]); x1 = Math.max(x1, pts[k]); y0 = Math.min(y0, pts[k + 1]); y1 = Math.max(y1, pts[k + 1]); }
    x0 = Math.max(0, Math.floor(x0)); y0 = Math.max(0, Math.floor(y0)); x1 = Math.min(dr[2], Math.ceil(x1)); y1 = Math.min(dr[3], Math.ceil(y1));
    if (x1 <= x0 || y1 <= y0) continue;
    dabs.push({ at, pts, x0, y0, w: x1 - x0, h: y1 - y0 }); if (at > last) last = at;
  }
  dabs.sort((p, q) => p.at - q.at);
  // the finished, uninhabited tile
  const fb = bakeNow(t, { pz, hw, amp: 0, z: v.z, rect: bb }, { noCast: true, pin: true });
  t.bakes.splice(t.bakes.indexOf(fb), 1);
  const lines = mkCanvas(dr[2], dr[3]), paint = mkCanvas(dr[2], dr[3]);
  t.doneAt = Math.min(t.castAt, Math.ceil(last) + 1);
  t.cons = { key, dr, pz, hw, strokes, dabs, final: fb.base.cv, lines, paint, lc: lines.getContext('2d'), pc: paint.getContext('2d'), iS: 0, iD: 0, n: -1 };
  t.cons.lc.lineCap = 'round';
  return t.cons;
}
function drawMark(ctx, s, hw) {
  const d = s.d, p = d.p, i = s.i;
  if (d.k === K_SEGS) { ctx.strokeStyle = dayCol(d.col); ctx.lineWidth = Math.max(0.35 * hw, d.wt * hw * 2); ctx.beginPath(); ctx.moveTo(p[i], p[i + 1]); ctx.lineTo(p[i + 2], p[i + 3]); ctx.stroke(); }
  else { ctx.fillStyle = dayCol(d.c); ctx.beginPath(); ctx.moveTo(p[i], p[i + 1]); ctx.lineTo(p[i + 2], p[i + 3]); ctx.lineTo(p[i + 4], p[i + 5]); ctx.closePath(); ctx.fill(); }
}
/* fresh: rebuild from nothing (seek mode), so a frame never depends on which frames were drawn before it */
function advanceCons(c, n, fresh) {
  if (n < c.n || (fresh && n !== c.n)) { c.lc.setTransform(1, 0, 0, 1, 0, 0); c.lc.clearRect(0, 0, c.dr[2], c.dr[3]); c.pc.clearRect(0, 0, c.dr[2], c.dr[3]); c.iS = 0; c.iD = 0; }
  c.n = n;
  const lc = c.lc, pc = c.pc;
  lc.setTransform(c.pz, 0, 0, c.pz, -c.dr[0], -c.dr[1]);
  while (c.iS < c.strokes.length && c.strokes[c.iS].b <= n) { const s = c.strokes[c.iS++]; if (s.i == null) drawPartial(lc, s.d, c.hw, 1); else drawMark(lc, s, c.hw); }
  while (c.iD < c.dabs.length && c.dabs[c.iD].at <= n) {
    const d = c.dabs[c.iD++], p = d.pts;
    pc.save(); pc.beginPath(); pc.moveTo(p[0], p[1]); for (let k = 2; k < p.length; k += 2) pc.lineTo(p[k], p[k + 1]); pc.closePath(); pc.clip();
    pc.drawImage(c.final, d.x0, d.y0, d.w, d.h, d.x0, d.y0, d.w, d.h); pc.restore();
  }
}
function drawCons(ctx, t, v, n, fresh) {
  const c = initCons(t, v);
  advanceCons(c, n, fresh);
  const X = c.dr[0] + v.tx, Y = c.dr[1] + v.ty;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(c.lines, X, Y);
  ctx.setTransform(v.pz, 0, 0, v.pz, v.tx, v.ty);
  for (let i = c.iS; i < c.strokes.length; i++) {            // strokes still being drawn
    const s = c.strokes[i]; if (s.a > n) continue;
    if (s.i == null) drawPartial(ctx, s.d, c.hw, clamp((n - s.a) / (s.b - s.a), 0.02, 1));
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(c.paint, X, Y);
}

/* ---------- the frame ---------- */
function tileState(t, n, allLive) {
  if (allLive || t.rim < 0) return 3;
  if (n < t.rim) return 0;
  if (n < (t.doneAt == null ? t.castAt : t.doneAt)) return 1;
  if (n < t.castAt) return 2;
  return 3;
}
function compiled(dl, hw, raw) {
  const night = LOOK.night && !raw, k = Math.round(hw * 4096) + (night ? 0.5 : 0), cl = (d, c) => (night ? nightOf(d, c) : dayCol(c));
  let c = dl.comp.get(k);
  if (c) return c;
  // group the display list into Path2Ds; keep painter's order
  c = []; let cur = null;
  const need = (m, col, lw) => { if (cur && cur.m === m && cur.col === col && cur.lw === lw) return cur.p; cur = { m, col, lw, p: new Path2D() }; c.push(cur); return cur.p; };
  for (const d of dl.cmds) {
    if (d.co) continue;
    switch (d.k) {
      case K_FILL: { const p = need(0, cl(d, d.c), 0), a = d.p; p.moveTo(a[0], a[1]); for (let i = 2; i < a.length; i += 2) p.lineTo(a[i], a[i + 1]); p.closePath(); break; }
      case K_RIB: ribPath(need(0, cl(d, d.col), 0), d, hw, null, -1, 0); break;
      case K_STROKE: { const p = need(1, cl(d, d.col), Math.max(0.35 * hw, d.wt * hw * 2)), a = d.p; p.moveTo(a[0], a[1]); for (let i = 2; i < a.length; i += 2) p.lineTo(a[i], a[i + 1]); break; }
      case K_DISC: { const p = need(0, cl(d, d.c), 0); p.moveTo(d.x + d.r, d.y); p.arc(d.x, d.y, d.r, 0, TAU); p.closePath(); break; }
      case K_RING: { const p = need(1, cl(d, d.col), Math.max(0.35 * hw, d.wt * hw * 2)); p.moveTo(d.x + d.r, d.y); p.arc(d.x, d.y, d.r, 0, TAU); break; }
      case K_SEGS: { const p = need(1, cl(d, d.col), Math.max(0.35 * hw, d.wt * hw * 2)), a = d.p; for (let i = 0; i < a.length; i += 4) { p.moveTo(a[i], a[i + 1]); p.lineTo(a[i + 2], a[i + 3]); } break; }
      case K_TRIS: { const p = need(0, cl(d, d.c), 0), a = d.p; for (let i = 0; i < a.length; i += 6) { p.moveTo(a[i], a[i + 1]); p.lineTo(a[i + 2], a[i + 3]); p.lineTo(a[i + 4], a[i + 5]); p.closePath(); } break; }
    }
  }
  if (dl.comp.size > 8) dl.comp.clear();
  dl.comp.set(k, c);
  return c;
}
/* Actors are drawn from small bitmaps: one per (pose key, zoom), rasterised the first time it is needed.
   A pose is a pure function of its key, so a bitmap is too; frames stay identical whatever order they are drawn in.
   Actors still growing in at their entrance are drawn as vectors. */
/* Small separate bitmaps, used wherever the poses cannot be known ahead (exploring, seeking) */
function actorBitmap(dl, sc, hw, lazy) {
  const key = Math.round(sc * 4096) * 65536 + Math.round(hw * 4096);
  if (!dl.bmp) dl.bmp = new Map();
  let b = dl.bmp.get(key);
  // exploring: while the zoom moves, or once this frame's raster budget is spent, draw the nearest bitmap this pose
  // already has, scaled; the exact one is made on a later frame, so the picture at rest is unchanged
  if (!b && lazy && (lazy === 'moving' || performance.now() > R.bmpUntil)) {
    let near = null, d = 1e9;
    for (const c of dl.bmp.values()) { const e = Math.abs(Math.log(c.sc / sc)); if (e < d) { d = e; near = c; } }
    R.bmpPending = true;
    if (near) { near.used = ++R.stamp; return near; }
    if (performance.now() > R.bmpUntil) return null;          // the caller finds another stand-in
  }
  if (!b) {
    const tb = performance.now();
    const bb = dl.bb, ox = Math.floor(bb[0] * sc) - 2, oy = Math.floor(bb[1] * sc) - 2, w = Math.ceil(bb[2] * sc) + 2 - ox, h = Math.ceil(bb[3] * sc) + 2 - oy;
    const slot = lazy && w <= POSEPG.MAX && h <= POSEPG.MAX && typeof SCENE !== 'undefined' && SCENE.poseAtlas ? paAlloc(w, h) : null;
    if (slot) {
      // a small pose (people seen from afar) goes onto a shared page: a frame's hundreds of people blit from a few
      // textures, not hundreds
      const cx = slot.pg.cx; cx.save(); cx.setTransform(1, 0, 0, 1, 0, 0); cx.beginPath(); cx.rect(slot.x, slot.y, w, h); cx.clip();
      cx.setTransform(sc, 0, 0, sc, slot.x - ox, slot.y - oy); cx.lineCap = 'round'; cx.lineJoin = 'round';
      for (const g of compiled(dl, hw)) { if (g.m === 0) { cx.fillStyle = g.col; cx.fill(g.p); } else { cx.strokeStyle = g.col; cx.lineWidth = g.lw; cx.stroke(g.p); } }
      cx.restore();
      b = { cv: slot.pg.cv, ax: slot.x, ay: slot.y, w, h, ox, oy, px: 0, used: ++R.stamp, dl, key, sc, gen: POSEPG.gen }; dl.bmp.set(key, b); POSEPG.list.push(b);
      R.bmpSpent = (R.bmpSpent || 0) + performance.now() - tb;
      b.used = ++R.stamp; return b;
    }
    const cv = mkCanvas(w, h), cx = cv.getContext('2d');
    cx.setTransform(sc, 0, 0, sc, -ox, -oy); cx.lineCap = 'round'; cx.lineJoin = 'round';
    for (const g of compiled(dl, hw)) { if (g.m === 0) { cx.fillStyle = g.col; cx.fill(g.p); } else { cx.strokeStyle = g.col; cx.lineWidth = g.lw; cx.stroke(g.p); } }
    b = { cv, ax: 0, ay: 0, w, h, ox, oy, px: w * h, used: ++R.stamp, dl, key, sc }; dl.bmp.set(key, b); ABMP.list.push(b); ABMP.px += b.px;
    if (ABMP.px > ABMP.budget) { ABMP.list.sort((p, q) => p.used - q.used); const cut = ABMP.list.splice(0, ABMP.list.length >> 2).filter((c) => c !== b); for (const c of cut) { c.dl.bmp.delete(c.key); ABMP.px -= c.px; if (lazy) toDead(c.cv); else c.cv.width = 0; } }   // exploring: freed a few at a time (reap), not hundreds in one frame
    R.bmpSpent = (R.bmpSpent || 0) + performance.now() - tb;
  }
  b.used = ++R.stamp;
  return b;
}
const ABMP = { list: [], px: 0, budget: (typeof SCENE !== 'undefined' && SCENE.poseBudget) || 32e6 };
/* SCENE.poseAtlas (exploring): small pose bitmaps are packed onto a few shared 2048 x 2048 pages, shelf by shelf. When
   the pages are full they are all cleared and filled again (gen counts the fillings: a bitmap from an earlier filling is
   gone). */
const POSEPG = { MAX: 160, S: 2048, NP: 4, pages: [], p: 0, x: 0, y: 0, row: 0, gen: 0, list: [] };
function paReset() {
  for (const b of POSEPG.list) if (b.dl.bmp && b.dl.bmp.get(b.key) === b) b.dl.bmp.delete(b.key);
  POSEPG.list = []; POSEPG.gen++; POSEPG.p = 0; POSEPG.x = 0; POSEPG.y = 0; POSEPG.row = 0;
  for (const pg of POSEPG.pages) { pg.cx.setTransform(1, 0, 0, 1, 0, 0); pg.cx.clearRect(0, 0, POSEPG.S, POSEPG.S); }
}
function paAlloc(w, h) {
  if (POSEPG.x + w + 1 > POSEPG.S) { POSEPG.y += POSEPG.row; POSEPG.x = 0; POSEPG.row = 0; }
  if (POSEPG.y + h + 1 > POSEPG.S) { POSEPG.p++; POSEPG.x = 0; POSEPG.y = 0; POSEPG.row = 0; }
  if (POSEPG.p >= POSEPG.NP) paReset();
  while (POSEPG.pages.length <= POSEPG.p) { const cv = mkCanvas(POSEPG.S, POSEPG.S); POSEPG.pages.push({ cv, cx: cv.getContext('2d') }); }
  const slot = { pg: POSEPG.pages[POSEPG.p], x: POSEPG.x, y: POSEPG.y }; POSEPG.x += w + 1; POSEPG.row = Math.max(POSEPG.row, h + 1);
  return slot;
}
const bmpLive = (b) => b && b.cv.width && (b.gen == null || b.gen === POSEPG.gen);   // SCENE.poseBudget: room for more poses (a city of many lively people)
/* Film playback: two pose atlases take turns. While a shot plays from one, every pose the next shot will show is packed
   into the other, so an atlas is never written while it is being read (that would make the browser copy it) and all the
   actor blits of a frame come from one texture. */
const ATLS = [0, 1].map((i) => ({ i, S: 2048, pages: [], p: 0, x: 0, y: 0, row: 0, gen: 0 }));
SF.atlasOn = -1;
function atlasReset(A) { for (const pg of A.pages) { pg.cx.setTransform(1, 0, 0, 1, 0, 0); pg.cx.clearRect(0, 0, A.S, A.S); } A.p = 0; A.x = 0; A.y = 0; A.row = 0; A.gen++; }
function atlasPage(A, k) { while (A.pages.length <= k) { const cv = mkCanvas(A.S, A.S); A.pages.push({ cv, cx: cv.getContext('2d') }); } return A.pages[k]; }
const poseKey = (sc, hw) => Math.round(sc * 4096) * 65536 + Math.round(hw * 4096);
function atlasGet(A, dl, sc, hw) { const m = dl.ab && dl.ab[A.i], b = m && m.get(poseKey(sc, hw)); return b && b.gen === A.gen ? b : null; }
function atlasPut(A, dl, sc, hw) {
  if (atlasGet(A, dl, sc, hw)) return;
  const bb = dl.bb, ox = Math.floor(bb[0] * sc) - 2, oy = Math.floor(bb[1] * sc) - 2, w = Math.ceil(bb[2] * sc) + 2 - ox, h = Math.ceil(bb[3] * sc) + 2 - oy;
  if (w + 1 > A.S || h + 1 > A.S) return;
  if (A.x + w + 1 > A.S) { A.y += A.row; A.x = 0; A.row = 0; }
  if (A.y + h + 1 > A.S) { if (A.p >= 5) return; A.p++; A.x = 0; A.y = 0; A.row = 0; }   // a new page; at most six
  const pg = atlasPage(A, A.p), ax = A.x, ay = A.y; A.x += w + 1; A.row = Math.max(A.row, h + 1);
  const cx = pg.cx; cx.save(); cx.setTransform(1, 0, 0, 1, 0, 0); cx.beginPath(); cx.rect(ax, ay, w, h); cx.clip();
  cx.setTransform(sc, 0, 0, sc, ax - ox, ay - oy); cx.lineCap = 'round'; cx.lineJoin = 'round';
  for (const g of compiled(dl, hw)) { if (g.m === 0) { cx.fillStyle = g.col; cx.fill(g.p); } else { cx.strokeStyle = g.col; cx.lineWidth = g.lw; cx.stroke(g.p); } }
  cx.restore();
  if (!dl.ab) dl.ab = [new Map(), new Map()];
  dl.ab[A.i].set(poseKey(sc, hw), { gen: A.gen, cv: pg.cv, ax, ay, w, h, ox, oy });
}
/* pack every pose that shot `cam` will show between frames a and b */
function* atlasPrepGen(A, cam, a, b, cw, ch) {
  atlasReset(A);
  const v = mkView(cam, cw, ch, true); let last = performance.now();
  for (let n = a; n < b; n++) {
    const t = n / FPS;
    for (const act of SF.actors) {
      const tl = act.tile; if (act.cast && (tl.rim >= 0 || tl.unfold) && n < tl.castAt + 12) continue;
      const st = actorState(act, t); if (!st) continue;
      const dl = actorDL(act, st), ss = st.s == null ? 1 : st.s;
      if (!bbHit([st.sx + dl.bb[0] * ss, st.sy + dl.bb[1] * ss, st.sx + dl.bb[2] * ss, st.sy + dl.bb[3] * ss], v.rect)) continue;
      atlasPut(A, dl, v.pz * ss, v.hw);
      if (performance.now() - last > 1.5) { yield 'pose'; last = performance.now(); }     // slices by time: a pose can cost a lot at x9
    }
  }
}
/* Long movers (a bus, a train car) give their half-size on the ground, st.ext = [hx, hy] in u (along x and y). In each run
   of actors with the same slot, those that overlap on screen are put in footprint order, as standing objects are (one
   wholly on the far side of the other in x or in y goes first); otherwise by x + y as before. A person beside a bus is
   then behind it or in front of it by where they stand, not by whose centre is nearer. */
function footOrder(L) {
  const box = (A) => { const e = A.st.ext || [0.4, 0.4], x = A.st.wx, y = A.st.wy; return [x - e[0], y - e[1], x + e[0], y + e[1]]; };
  for (let i0 = 0; i0 < L.length;) {
    let i1 = i0 + 1; while (i1 < L.length && L[i1].slot === L[i0].slot) i1++;
    const G = L.slice(i0, i1);
    if (G.length > 1 && G.some((A) => A.st.ext)) {
      const n = G.length, bx = G.map(box), after = G.map(() => []), indeg = new Int32Array(n), e = 0.02;
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
        if (!G[i].st.ext && !G[j].st.ext) continue;                          // two people keep their x + y order
        if (!bbHit(G[i].r, G[j].r)) continue;
        const a = bx[i], b = bx[j], aB = a[2] <= b[0] + e || a[3] <= b[1] + e, bB = b[2] <= a[0] + e || b[3] <= a[1] + e;
        const first = aB && !bB ? i : bB && !aB ? j : (G[i].key <= G[j].key ? i : j), second = first === i ? j : i;
        after[first].push(second); indeg[second]++;
      }
      const done = new Uint8Array(n), out = [];
      for (let s = 0; s < n; s++) {
        let best = -1; for (let i = 0; i < n; i++) if (!done[i] && indeg[i] === 0 && (best < 0 || G[i].key < G[best].key)) best = i;
        if (best < 0) for (let i = 0; i < n; i++) if (!done[i] && (best < 0 || G[i].key < G[best].key)) best = i;   // a cycle: the farthest
        done[best] = 1; out.push(G[best]); for (const j of after[best]) indeg[j]--;
      }
      for (let k = 0; k < n; k++) L[i0 + k] = out[k];
    }
    i0 = i1;
  }
}
/* exploring, at rest: whatever is left of the frame's pose budget draws the poses the people on screen will take in the
   next second, so the new pose is ready (sharp, at this zoom) when it comes, not a frame or two after it */
const WARM_DT = [0, 0.12, 0.3, 0.6, 1.0];
function prewarmPoses(v, t) {
  const n = ACTS.length; if (!n) return;
  // everybody's pose now first, then everybody's next ones: one person never takes the whole budget for a second ahead
  // while the others wait
  const W = R.warm || (R.warm = { d: 0, i: 0, left: n });
  let checks = 0;
  while (performance.now() < R.warmUntil && checks < n * WARM_DT.length) {
    if (W.left <= 0) { W.d = (W.d + 1) % WARM_DT.length; W.left = n; }
    const A = ACTS[W.i % n]; W.i = (W.i + 1) % n; W.left--; checks++;
    if (A.grow !== 1) continue;
    const st = actorState(A.a, t + WARM_DT[W.d]); if (!st) continue;
    const dl = actorDL(A.a, st), sc = v.pz * (st.s == null ? 1 : st.s);
    if (!(dl.bmp && dl.bmp.has(poseKey(sc, v.hw)))) actorBitmap(dl, sc, v.hw, false);
  }
}
/* a new view at rest (a zoom or a cut): start again from everybody's pose now */
function prewarmReset() { R.warm = null; }
function drawActor(ctx, v, A) {
  const st = A.st, ss = st.s == null ? 1 : st.s;
  if (st.alpha != null) ctx.globalAlpha = st.alpha;
  if (A.grow !== 1) {
    const c = compiled(A.dl, v.hw), s = ss * A.grow;
    ctx.setTransform(v.pz * s, 0, 0, v.pz * s, v.tx + st.sx * v.pz, v.ty + st.sy * v.pz);
    for (const g of c) { if (g.m === 0) { ctx.fillStyle = g.col; ctx.fill(g.p); } else { ctx.strokeStyle = g.col; ctx.lineWidth = g.lw; ctx.stroke(g.p); } }
  } else {
    const sc = v.pz * ss, A2 = SF.atlasOn >= 0 && !SF.noAtlas ? ATLS[SF.atlasOn] : null, ab = A2 && atlasGet(A2, A.dl, sc, v.hw);
    let b = ab || actorBitmap(A.dl, sc, v.hw, v.lazy);
    if (!b) {
      // exploring, the raster budget spent, and this pose has no bitmap yet: the actor's last bitmap stands in for a
      // frame or two (a step of a walk); the first time we see it, its own bitmap is made now (drawing its vectors
      // would cost about as much, and again on every frame until the budget reached it)
      const lb = A.a.lastB;
      b = bmpLive(lb) ? lb : actorBitmap(A.dl, sc, v.hw, false);
    } else if (!ab && b.sc != null && Math.abs(b.sc - sc) < 1e-6) A.a.lastB = b;
    else if (!ab && v.lazy === 'budget' && b.sc != null) {
      // at rest, a pose drawn for another zoom would be blown up (blurred): the person's last sharp bitmap at this zoom
      // (a gesture behind, for a moment) reads far better
      const lb = A.a.lastB; if (bmpLive(lb) && lb.sc != null && Math.abs(lb.sc - sc) < 1e-6) b = lb;
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (SF.noBlit) {}
    else if (ab || b.sc == null || Math.abs(b.sc - sc) < 1e-6) ctx.drawImage(b.cv, b.ax, b.ay, b.w, b.h, Math.round(v.tx + st.sx * v.pz) + b.ox, Math.round(v.ty + st.sy * v.pz) + b.oy, b.w, b.h);
    else { const k = sc / b.sc; ctx.drawImage(b.cv, b.ax, b.ay, b.w, b.h, v.tx + st.sx * v.pz + b.ox * k, v.ty + st.sy * v.pz + b.oy * k, b.w * k, b.h * k); }   // a stand-in while exploring
  }
  if (st.alpha != null) ctx.globalAlpha = 1;
}
function drawBoil(ctx, v, boil, k) {
  if (!boil || SF.noBoil) return;
  for (const g of boil[k]) { ctx.fillStyle = g.col; ctx.fill(g.path); }
}
/* ---------- night: the light itself ----------
   Lights come from g.glow calls (K.lamp, K.tree ...), from the colours a scene lists in SCENE.night (its own lamps,
   lanterns, signs and leaves), from the lit windows, and, for people and cars, from the light colours in their drawings.
   Over the frame: a warm glow where the lights are thick, pools on the ground, halos with a glint on the brightest,
   columns of light on water, head-lamp beams on the road, dust drifting in the lamplight, and motes rising over leaves,
   flowers and lawns. Everything is a function of the frame time, so a night frame is as repeatable as a day one. */
const GLOWTEX = new Map();
/* a soft round light in one colour: a bright core falling away to nothing (64 px, drawn at any size) */
function glowTex(col) {
  let c = GLOWTEX.get(col); if (c) return c;
  c = mkCanvas(64, 64); const x = c.getContext('2d'), p = parseCol(col) || [255, 210, 140, 1], rgb = p[0] + ',' + p[1] + ',' + p[2];
  const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(' + rgb + ',1)'); g.addColorStop(0.1, 'rgba(' + rgb + ',0.82)'); g.addColorStop(0.3, 'rgba(' + rgb + ',0.3)');
  g.addColorStop(0.62, 'rgba(' + rgb + ',0.08)'); g.addColorStop(1, 'rgba(' + rgb + ',0)');
  x.fillStyle = g; x.fillRect(0, 0, 64, 64); GLOWTEX.set(col, c); return c;
}
/* a wide, very soft glow (the light of a whole street): no bright core */
function hazeTex(col) {
  const key = 'haze' + col; let c = GLOWTEX.get(key); if (c) return c;
  c = mkCanvas(64, 64); const x = c.getContext('2d'), p = parseCol(col), rgb = p[0] + ',' + p[1] + ',' + p[2];
  const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(' + rgb + ',0.6)'); g.addColorStop(0.45, 'rgba(' + rgb + ',0.28)'); g.addColorStop(1, 'rgba(' + rgb + ',0)');
  x.fillStyle = g; x.fillRect(0, 0, 64, 64); GLOWTEX.set(key, c); return c;
}
/* the four-pointed glint of a bright light seen at night */
function starTex() {
  let c = GLOWTEX.get('*star'); if (c) return c;
  c = mkCanvas(64, 64); const x = c.getContext('2d');
  for (const vert of [false, true]) {
    const g = vert ? x.createLinearGradient(0, 0, 0, 64) : x.createLinearGradient(0, 0, 64, 0);
    g.addColorStop(0, 'rgba(255,244,220,0)'); g.addColorStop(0.5, 'rgba(255,248,230,0.95)'); g.addColorStop(1, 'rgba(255,244,220,0)');
    x.fillStyle = g; x.beginPath(); if (vert) x.ellipse(32, 32, 1.3, 32, 0, 0, TAU); else x.ellipse(32, 32, 32, 1.3, 0, 0, TAU); x.fill();
  }
  const r = x.createRadialGradient(32, 32, 0, 32, 32, 7); r.addColorStop(0, 'rgba(255,250,236,1)'); r.addColorStop(1, 'rgba(255,240,210,0)');
  x.fillStyle = r; x.fillRect(0, 0, 64, 64); GLOWTEX.set('*star', c); return c;
}
/* a head-lamp beam lying on the road: bright at the lamp, fading along its length and to its sides (128 x 32) */
function beamTex() {
  let c = GLOWTEX.get('*beam'); if (c) return c;
  c = mkCanvas(128, 32); const x = c.getContext('2d'), d = x.createImageData(128, 32);
  for (let j = 0; j < 32; j++) for (let i = 0; i < 128; i++) {
    const u = i / 127, v = (j - 15.5) / 15.5, w = 0.35 + 0.65 * u, a = Math.pow(1 - u, 1.6) * Math.exp(-(v * v) / (w * w) * 2.2) * smooth(u / 0.06);
    const k = (j * 128 + i) * 4; d.data[k] = 255; d.data[k + 1] = 238; d.data[k + 2] = 196; d.data[k + 3] = Math.round(255 * a);
  }
  x.putImageData(d, 0, 0); GLOWTEX.set('*beam', c); return c;
}
const LAMP_COL = '#FFC979', POOL_COL = '#FFB45C', AURA_COL = '#4FD8B0', HAZE_COL = '#FFA856', DUST_COL = '#FFE1AE';
const MOTE_COL = ['#E9FF9F', '#A9F7DF', '#FFF2B0', '#FFD58A'];
const AMB_G = 56;                                   // the warm glow over the city is summed in cells this many wide px across
/* every light in the city, once: R.lights [{ k, x, y, gx, gy, r, col, pool, rx, ry }], R.wins (lit windows) and R.amb
   (the warm glow over each part of the city), all in wide px */
function nightPrep() {
  if (R.lights) return R.lights;
  const S = nightSet(), L = [], water = [], wins = [], LITS = new Set(LIT.concat(LIT_COOL, [LIT_DIM]));
  const box = (p) => { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (let i = 0; i < p.length; i += 2) { if (p[i] < x0) x0 = p[i]; if (p[i] > x1) x1 = p[i]; if (p[i + 1] < y0) y0 = p[i + 1]; if (p[i + 1] > y1) y1 = p[i + 1]; } return [x0, y0, x1, y1]; };
  for (const t of SF.live) for (const ob of t.statics) {
    const n0 = L.length, w0 = wins.length;
    if (ob.glows) for (const e of ob.glows) L.push(Object.assign({}, e));
    const trees = [];
    for (const d of ob.list) {
      const c = d.c || d.col; if (typeof c !== 'string') continue;
      const key = c.toLowerCase();
      if (d.k === K_FILL && (d.win != null || S.win.has(key))) {              // a window: lit or dark, decided once
        const nc = nightOf(d, c);
        if (LITS.has(nc)) { const b = box(d.p), w = b[2] - b[0], h = b[3] - b[1]; if (w * h > 1.2) wins.push({ x: (b[0] + b[2]) / 2, y: (b[1] + b[3]) / 2, r: Math.max(w, h) / 2, col: nc, dim: nc === LIT_DIM, cool: LIT_COOL.indexOf(nc) >= 0 }); }
      }
      const isLamp = S.lamps.has(key), isGlow = S.glowScene.has(key), isLeaf = S.foliage.has(key), isWater = ob.ground && S.water.has(key) && d.k === K_FILL;
      const isShop = d.k === K_FILL && ((S.win.get(key) || 0) >= 0.99 || (d.nc && d.spill));
      const isLawn = ob.ground && d.k === K_FILL && S.grass.has(key);
      if (!isLamp && !isGlow && !isLeaf && !isWater && !isShop && !isLawn) continue;
      const b = d.k === K_DISC ? [d.x - d.r, d.y - d.r, d.x + d.r, d.y + d.r] : d.p ? box(d.p) : d.c && d.c.length ? box(d.c) : null;
      if (!b) continue;
      const w = b[2] - b[0], h = b[3] - b[1], x = (b[0] + b[2]) / 2, y = (b[1] + b[3]) / 2;
      if (isWater) { water.push({ b, p: d.p, gi: ob.gi }); continue; }
      if (isLawn) {                                                          // motes over a lawn, scattered through it
        const n = Math.min(14, Math.floor(w * h / 1500)), rr = RNG(Math.round(x * 7 + y * 13));
        for (let k = 0, tries = 0; k < n && tries < n * 8; tries++) { const px = b[0] + w * rr(), py = b[1] + h * rr(); if (!pointInPoly(px, py, d.p)) continue; L.push({ k: 'bloom', x: px, y: py, gx: px, gy: py, r: 7, col: null, pool: false, lawn: true }); k++; }
        continue;
      }
      if (isShop) { if (w * h > 20) L.push({ k: 'spill', x, y: b[3] - h * 0.3, gx: x, gy: b[3] + 3, r: Math.max(w, 6) / 2, col: null, pool: true }); continue; }
      if (isLamp) { const gy = y + S.lampH * VZ; L.push({ k: 'lamp', x, y, gx: x, gy, r: Math.max(1.2, Math.max(w, h) / 2), col: null, pool: S.lampPool }); continue; }
      if (isGlow) { if (w * h > 900) continue; L.push({ k: 'lantern', x, y, gx: x, gy: y, r: Math.max(1, Math.max(w, h) / 2), col: c, pool: false }); continue; }
      if (isLeaf && d.k === K_FILL && w * h > 30 && w * h < 9000 && w / Math.max(h, 0.1) > 0.4 && w / Math.max(h, 0.1) < 2.6) {
        const r = Math.sqrt(w * h / Math.PI) * 0.95;
        if (trees.some((q) => Math.hypot(q.x - x, q.y - y) < q.r * 0.7)) continue;      // the shaded and lit facets of one crown
        const e = { k: 'tree', x, y, gx: x, gy: y + r, r, col: null, pool: false }; trees.push(e); L.push(e);
      }
    }
    for (let i = n0; i < L.length; i++) { L[i].t = t; L[i].gi = ob.gi; }  // a light shines once its place is drawn
    for (let i = w0; i < wins.length; i++) { wins[i].t = t; wins[i].gi = ob.gi; }
  }
  // what stands in front: the halos, glows and reflections are laid over the finished frame, so a light, a lit window or
  // a patch of water that a later standing object paints over must not shine through it
  const OG = 48, grid = new Map(), gk = (i, j) => i * 100003 + j;
  for (const ob of SF.statics) {
    if (ob.ground || ob.cast || !ob.list) continue;
    const fills = [];
    for (const d of ob.list) {
      if (d.k !== K_FILL && d.k !== K_DISC) continue;
      const pc = typeof d.c === 'string' ? parseCol(d.c) : null; if (!pc || pc[3] < 0.9) continue;     // glass and shadows let light through
      const b = d.k === K_DISC ? [d.x - d.r, d.y - d.r, d.x + d.r, d.y + d.r] : box(d.p);
      if ((b[2] - b[0]) * (b[3] - b[1]) > 0.6) fills.push({ d, b });
    }
    if (!fills.length) continue;
    ob._occ = fills;
    for (let i = Math.floor(ob.bb[0] / OG); i <= Math.floor(ob.bb[2] / OG); i++) for (let j = Math.floor(ob.bb[1] / OG); j <= Math.floor(ob.bb[3] / OG); j++) { const k = gk(i, j); let a = grid.get(k); if (!a) grid.set(k, (a = [])); a.push(ob); }
  }
  // ground drawn over water (a quay, a bank, an island laid on a sea that runs under it) hides that water too
  const gg = new Map();
  for (const ob of SF.statics) {
    if (!ob.ground || !ob.list) continue;
    const fills = [];
    for (const d of ob.list) {
      if (d.k !== K_FILL || typeof d.c !== 'string' || S.water.has(d.c.toLowerCase())) continue;
      const pc = parseCol(d.c); if (!pc || pc[3] < 0.9) continue;
      const b = box(d.p); if ((b[2] - b[0]) * (b[3] - b[1]) > 4) fills.push({ d, b });
    }
    if (!fills.length) continue;
    ob._occG = fills;
    for (let i = Math.floor(ob.bb[0] / OG); i <= Math.floor(ob.bb[2] / OG); i++) for (let j = Math.floor(ob.bb[1] / OG); j <= Math.floor(ob.bb[3] / OG); j++) { const k = gk(i, j); let a = gg.get(k); if (!a) gg.set(k, (a = [])); a.push(ob); }
  }
  const landOver = (x, y, gi) => {
    for (const ob of gg.get(gk(Math.floor(x / OG), Math.floor(y / OG))) || []) {
      if (ob.gi <= gi || x < ob.bb[0] || x > ob.bb[2] || y < ob.bb[1] || y > ob.bb[3]) continue;
      for (const f of ob._occG) { const b = f.b; if (x < b[0] || x > b[2] || y < b[1] || y > b[3]) continue; if (pointInPoly(x, y, f.d.p)) return true; }
    }
    return false;
  };
  const covered = (x, y, gi) => {
    for (const ob of grid.get(gk(Math.floor(x / OG), Math.floor(y / OG))) || []) {
      if (ob.gi <= gi || x < ob.bb[0] || x > ob.bb[2] || y < ob.bb[1] || y > ob.bb[3]) continue;
      for (const f of ob._occ) { const b = f.b; if (x < b[0] || x > b[2] || y < b[1] || y > b[3]) continue; if (f.d.k === K_DISC ? Math.hypot(x - f.d.x, y - f.d.y) < f.d.r : pointInPoly(x, y, f.d.p)) return true; }
    }
    return false;
  };
  R.covered = covered;                                                     // (people's and cars' lights are checked as they move)
  for (const e of L) if (e.k !== 'tree' && e.k !== 'bloom' && e.k !== 'spill' && e.gi != null && covered(e.x, e.y, e.gi)) e.hid = true;   // its pool on the ground stays
  for (let i = wins.length - 1; i >= 0; i--) if (covered(wins[i].x, wins[i].y, wins[i].gi)) wins.splice(i, 1);
  // light falling on water: the first point on the water in front of (below, on screen) what lights it that nothing
  // stands over (a high light's reflection lies further down)
  if (water.length) for (const e of L) {
    if (e.k === 'tree' || e.k === 'bloom' || e.k === 'spill') continue;
    for (let k = 2; k <= 60; k += 2) {
      const qx = e.gx, qy = e.gy + k;
      const wet = water.find((w) => qx > w.b[0] && qx < w.b[2] && qy > w.b[1] && qy < w.b[3] && pointInPoly(qx, qy, w.p));
      if (wet) { if (!landOver(qx, qy, wet.gi) && !covered(qx, qy, -1)) { e.rx = qx; e.ry = qy; break; } }
      else if (e.rx == null && k > 34) break;
    }
  }
  // the warm glow of the lit city: every light adds to the cell it is in
  const cells = new Map(), tix = new Map(SF.live.map((t, i) => [t, i]));
  const add = (x, y, w, t) => { const k = (tix.get(t) || 0) * 1e7 + Math.floor(x / AMB_G) * 3001 + Math.floor(y / AMB_G); let c = cells.get(k); if (!c) cells.set(k, (c = { x: 0, y: 0, w: 0, t })); c.x += x * w; c.y += y * w; c.w += w; };
  for (const e of L) { const w = e.k === 'lamp' ? 1 : e.k === 'spill' ? 0.9 : e.k === 'neon' ? 0.7 : e.k === 'lantern' ? 0.25 + Math.min(0.75, e.r / 6) : 0; if (w) add(e.x, e.y, w, e.t); }
  for (const e of wins) add(e.x, e.y, (e.dim ? 0.03 : 0.08) * Math.min(3, e.r / 1.5), e.t);
  R.amb = [...cells.values()].filter((c) => c.w > 0.3).map((c) => ({ x: c.x / c.w, y: c.y / c.w, w: c.w, t: c.t }));
  R.wins = wins; R.lights = L; return L;
}
/* the lights in a person's or a car's drawing (head and tail lights, a lantern carried): centres in its own frame */
function actorLights(dl) {
  if (dl.lights !== undefined) return dl.lights;
  const S = nightSet(), out = [];
  for (const d of dl.cmds) {
    if (d.k !== K_FILL && d.k !== K_DISC) continue;
    if (!d.light && !S.glow.has(String(d.c).toLowerCase())) continue;
    const col = d.nc || d.c;
    if (d.k === K_DISC) { out.push({ x: d.x, y: d.y, r: d.r, col }); continue; }
    const p = d.p; let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (let i = 0; i < p.length; i += 2) { x0 = Math.min(x0, p[i]); x1 = Math.max(x1, p[i]); y0 = Math.min(y0, p[i + 1]); y1 = Math.max(y1, p[i + 1]); }
    out.push({ x: (x0 + x1) / 2, y: (y0 + y1) / 2, r: d.light ? Math.max(1.2, Math.max(x1 - x0, y1 - y0) / 2) : 1.2, col, head: String(d.c).toUpperCase() === '#F6E7A8' });
  }
  dl.lights = out.length ? out : null; return dl.lights;
}
/* stage 'ground': pools of lamplight and shop light on the paving. stage 'air': everything else (see above).
   o.lightT: seconds since night fell (the lamps come on in a wave from the middle of the view); none = all on */
/* SCENE.lightRes = k (< 1): the lights in the air are drawn into a buffer k times the size of the frame and added onto it
   (they only ever add light, so the sum is the same; soft glows lose nothing, and a city of thousands of lights costs a
   quarter of the fill). LIGHT_K: the scale drawLight draws at. */
let LIGHT_K = 1;
function drawLightAir(ctx, v, t, o) {
  const k = typeof SCENE !== 'undefined' && SCENE.lightRes;
  if (!(k > 0 && k < 1)) { drawLight(ctx, v, t, o, 'air'); return; }
  const w = Math.ceil(v.cw * k), h = Math.ceil(v.ch * k);
  let c = R.lightCv; if (!c || c.width !== w || c.height !== h) { if (c) c.width = 0; c = R.lightCv = mkCanvas(w, h); }
  const cx = c.getContext('2d'); cx.setTransform(1, 0, 0, 1, 0, 0); cx.globalAlpha = 1; cx.globalCompositeOperation = 'source-over'; cx.clearRect(0, 0, w, h);
  LIGHT_K = k; try { drawLight(cx, v, t, o, 'air'); } finally { LIGHT_K = 1; }
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(c, 0, 0, w, h, 0, 0, w / k, h / k); ctx.restore();
}
function drawLight(ctx, v, t, o, stage) {
  const L = nightPrep(), pz = v.pz, tx = v.tx, ty = v.ty, rc = v.rect, lt = o.lightT;
  const diag = Math.hypot(rc[2] - rc[0], rc[3] - rc[1]) / 2, cx = (rc[0] + rc[2]) / 2, cy = (rc[1] + rc[3]) / 2;
  const onAt = (x, y) => lt == null ? 1 : clamp((lt - 0.1 - 1.2 * Math.min(1, Math.hypot(x - cx, y - cy) / diag)) / 0.35, 0, 1);
  // while the city draws itself, a place's lights come on as its paint is finished (none over bare paper)
  const nn = o.n == null ? t * FPS : o.n;
  const tileOn = (tl) => { if (!tl || o.allLive || tl.rim < 0 || tl._st === -1 || tl._st == null) return 1; if (tl._st < 2) return 0; return smooth((nn - (tl.doneAt == null ? tl.castAt : tl.doneAt)) / 12); };
  const on = (e) => onAt(e.x, e.y) * tileOn(e.t);
  const vis = (x, y, R) => x + R > rc[0] && x - R < rc[2] && y + R > rc[1] && y - R < rc[3];
  ctx.save(); ctx.setTransform(LIGHT_K, 0, 0, LIGHT_K, 0, 0); ctx.globalCompositeOperation = 'lighter';
  const img = (tex, x, y, R, a, sy) => {
    sy = sy || 1; const RR = R * pz;
    if (a <= 0.004 || RR < 0.7) return;                                   // nothing a pixel wide
    ctx.globalAlpha = a > 1 ? 1 : a; ctx.drawImage(tex, tx + x * pz - RR, ty + y * pz - RR * sy, RR * 2, RR * 2 * sy);
  };
  const spr = (col, x, y, R, a, sy) => img(glowTex(col), x, y, R, a, sy);
  if (stage === 'ground') {
    for (const e of L) {
      if (!e.pool || (e.k !== 'lamp' && e.k !== 'spill')) continue;
      if (e.k === 'spill') { const R = e.r * 1.8 + 8; if (vis(e.gx, e.gy, R)) spr(POOL_COL, e.gx, e.gy, R, 0.5 * on(e), 0.42); continue; }
      const R = 24 + e.r * 3.5; if (!vis(e.gx, e.gy, R)) continue;
      spr(POOL_COL, e.gx, e.gy, R, 0.75 * on(e), 0.5);
    }
    ctx.restore(); return;
  }
  // the warm glow of the lit city, cell by cell
  const haze = hazeTex(HAZE_COL), HR = AMB_G * 1.75, hk = 0.16 * clamp(1.3 - pz / 3.2, 0.42, 1);   // an atmosphere seen from afar: thinner close to
  for (const c of R.amb) if (vis(c.x, c.y, HR)) img(haze, c.x, c.y, HR, hk * Math.min(1.4, Math.sqrt(c.w / 2.5)) * on(c), 0.8);
  // lit windows shine a little past their frames (a television flickers)
  if (pz > 0.9) {
    const wa = clamp((pz - 0.9) / 0.8, 0, 1);
    for (let i = 0; i < R.wins.length; i++) {
      const e = R.wins[i], Rw = e.r * 2.3 + 1.6; if (!vis(e.x, e.y, Rw)) continue;
      let a = (e.dim ? 0.16 : 0.32) * wa * on(e);
      if (e.cool) a *= 0.72 + 0.28 * Math.sin(t * 9 + i * 2.7) * Math.sin(t * 3.1 + i);
      spr(e.col, e.x, e.y, Rw, a);
    }
  }
  const glint = pz > 1.05, star = glint ? starTex() : null;
  for (let i = 0; i < L.length; i++) {
    const e = L[i];
    if (e.k === 'tree' || e.k === 'bloom' || e.k === 'spill') continue;
    const a = on(e); if (a <= 0) continue;
    const col = e.k === 'lamp' ? LAMP_COL : e.col || LAMP_COL;
    if (e.hid) { if (e.rx == null) continue; }                              // behind something: only its reflection, if any, shows
    if (e.rx != null && vis(e.rx, e.ry + 10, 14)) {                        // a broken column of light on the water
      for (let k = 0; k < 7; k++) {
        const w = (4 - k * 0.45) * (0.75 + 0.35 * Math.sin(t * 2.6 + k * 1.9 + e.x)), dx = Math.sin(t * 1.7 + k * 1.3 + e.y) * 0.9;
        ctx.globalAlpha = 0.5 * a * (1 - k / 7.5); ctx.fillStyle = col;
        ctx.fillRect(tx + (e.rx + dx - w / 2) * pz, ty + (e.ry + k * 2.4) * pz, w * pz, Math.max(1, 0.9 * pz));
      }
    }
    if (e.hid) continue;
    const R = e.k === 'lamp' ? 10 + e.r * 4.8 : 3.5 + e.r * 3.6; if (!vis(e.x, e.y, R * 1.3)) continue;
    spr(col, e.x, e.y, R, (e.k === 'lamp' ? 0.95 : 0.68) * a);
    if (pz > 1.2) spr('#FFF7DE', e.x, e.y, Math.max(1.4, e.r * 1.3), 0.6 * a);
    if (glint && ((e.k === 'lamp' && h1(i * 31 + 7) < 0.5) || (e.k === 'lantern' && e.r >= 2.6))) {   // some lamps and the lit landmarks glint
      const tw = 0.7 + 0.3 * Math.sin(t * (1.1 + h1(i) * 0.8) + i * 1.7);
      img(star, e.x, e.y, (e.k === 'lamp' ? 5 + e.r * 1.6 : 2.5 + e.r * 1.6) * clamp(pz / 2.5, 0.75, 1.25), 0.5 * a * tw);
    }
    // dust turning slowly in the light
    const nd = e.k === 'lamp' ? 3 : e.r > 1.4 ? 1 : 0;
    for (let j = 0; j < nd && pz > 1.4; j++) {
      const s0 = h2(i * 7 + j, 611), s1 = h2(i * 7 + j, 612), P = 9 + 7 * s0, ang = TAU * (t / P + s1), rad = R * (0.35 + 0.45 * s0);
      const x = e.x + Math.cos(ang) * rad, y = e.y + R * 0.25 + Math.sin(ang * 0.7 + s1 * 5) * rad * 0.6 - ((t / (P * 1.7) + s0) % 1) * R * 0.5;
      img(glowTex(DUST_COL), x, y, 0.9 + 0.8 * s1, 0.75 * a * (0.5 + 0.5 * Math.sin(t * 2.2 + s0 * 40)));
    }
  }
  // head lamps, tail lights, a lantern carried; a car's beams on the road ahead
  const beam = beamTex();
  for (const A of ACTS) {
    const ls = actorLights(A.dl); if (!ls) continue;
    const st = A.st, s = (st.s == null ? 1 : st.s) * A.grow, front = A.slot < 1e9 ? A.slot - 0.5 : null;   // the first object drawn over this actor
    const hidden = (x, y) => front != null && R.covered(x, y, front);
    for (const l of ls) { const x = st.sx + l.x * s, y = st.sy + l.y * s, Rl = 2.5 + l.r * 2.6 * s; if (vis(x, y, Rl) && !hidden(x, y)) spr(l.col, x, y, Rl, 0.6 * Math.min(1, 5 / l.r)); }
    if (st.ang != null && ls.some((l) => l.head || l.col === '#D0483A')) {
      const ca = Math.cos(st.ang), sa = Math.sin(st.ang), dx = (ca - sa) * AX, dy = (ca + sa) * AY, n = Math.hypot(dx, dy) || 1;
      const ux = dx / n, uy = dy / n, len = 22 * s, wid = 9 * s, fx = st.sx + ux * 9 * s, fy = st.sy + uy * 4 * s;
      if (vis(fx + ux * len / 2, fy + uy * len / 2, len) && !hidden(fx, fy)) {
        ctx.globalAlpha = 0.5; ctx.setTransform(LIGHT_K * ux * pz, LIGHT_K * uy * pz, -LIGHT_K * uy * pz, LIGHT_K * ux * pz, LIGHT_K * (tx + fx * pz), LIGHT_K * (ty + fy * pz));
        ctx.drawImage(beam, 0, -wid / 2, len, wid); ctx.setTransform(LIGHT_K, 0, 0, LIGHT_K, 0, 0);
      }
    }
  }
  // motes rising over leaves, flowers and lawns (some hang and blink, like fireflies)
  const core = clamp(0.8 * pz, 1, 3.2) / pz;                                // a mote is a point of light a pixel or three across
  const lod = clamp((pz - 0.6) / 1.8, 0.3, 1), halo = pz > 1.5;            // fewer motes, and no soft glow round each, far out
  for (let i = 0; i < L.length; i++) {
    const e = L[i]; if (e.k !== 'tree' && e.k !== 'bloom') continue;
    if (!vis(e.x, e.y, e.r * 2.4)) continue;
    const a0 = on(e);
    if (e.k === 'tree') spr(e.col || AURA_COL, e.x, e.y, e.r * 1.65, 0.24 * a0);
    const n = Math.max(1, Math.round(clamp(Math.round(e.r / (e.k === 'tree' ? 3.2 : e.lawn ? 3 : 4)), 2, 10) * lod));
    for (let j = 0; j < n; j++) {
      const s0 = h2(i * 13 + j, 501), s1 = h2(i * 13 + j, 502), s2 = h2(i * 13 + j, 503), big = s0 > 0.84 ? 1.8 : 1;
      let x, y, a;
      if (s1 < 0.3) {                                                       // a firefly: wanders round one spot and blinks
        x = e.x + (s2 - 0.5) * 2 * e.r + Math.sin(t * (0.6 + s0) + s1 * 20) * 0.4 * e.r;
        y = e.y + (s0 - 0.6) * e.r + Math.sin(t * (0.9 + s2) + s0 * 15) * 0.3 * e.r;
        a = Math.pow(Math.max(0, Math.sin(t * (0.9 + s2 * 0.8) + s0 * 50)), 3) * a0;
      } else {                                                              // rising from the leaves and fading
        const P = 6 + 7 * s0, u = (((t / P + s1) % 1) + 1) % 1;
        x = e.x + (s2 - 0.5) * 1.9 * e.r + Math.sin(t * (0.45 + s0 * 0.5) + s1 * 9) * 0.4 * e.r;
        y = e.y + e.r * (e.k === 'tree' ? 0.3 : 0.1) - u * e.r * 1.9 + Math.sin(t * 0.8 + s2 * 7) * 0.12 * e.r;
        a = smooth(u / 0.18) * (1 - smooth((u - 0.6) / 0.4)) * (0.55 + 0.45 * Math.sin(t * (1.5 + 2 * s1) + s0 * 30)) * a0;
      }
      const mc = e.col && s0 < 0.6 ? e.col : MOTE_COL[(s2 * 4) | 0];
      if (halo || big > 1) spr(mc, x, y, core * 11 * big, 0.2 * a);
      spr(mc, x, y, core * 4.5 * big, a);
    }
  }
  ctx.restore();
}
/* ---------- the air of a season (SCENE.air[LOOK.season]) ----------
   fall: the kinds of g.emit record that let things go (petals from a cherry in bloom, leaves from a turned tree): each
   emitter drops a few in turn, every one swaying and turning on its way from the crown to the ground under it.
   snow: flakes over the whole view in three depths that drift with the camera (a number: how thick).
   glint: sparkles of the sun on water, by day. (cover, the snow lying on things, is laid when the city is built: 30_world.)
   All a pure function of t, drawn over the finished frame. */
function airPrep() {
  if (R.air) return R.air;
  const cfg = (typeof SCENE !== 'undefined' && SCENE.air && SCENE.air[LOOK.season]) || null, A = { cfg, em: [], glints: [] };
  if (cfg && cfg.fall) { const kinds = new Set(cfg.fall); for (const t of SF.live) for (const ob of t.statics) if (ob.emits) for (const e of ob.emits) if (kinds.has(e.k)) A.em.push(Object.assign({ t }, e)); }
  if (cfg && cfg.glint) {
    const S = nightSet();
    for (const t of SF.live) for (const ob of t.statics) {
      if (!ob.ground) continue;
      for (const d of ob.list) {
        if (d.k !== K_FILL || typeof d.c !== 'string' || !S.water.has(d.c.toLowerCase())) continue;
        const p = d.p; let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (let i = 0; i < p.length; i += 2) { x0 = Math.min(x0, p[i]); x1 = Math.max(x1, p[i]); y0 = Math.min(y0, p[i + 1]); y1 = Math.max(y1, p[i + 1]); }
        const n = Math.min(120, Math.floor(Math.abs(polyArea(p)) / 180)), rr = RNG(Math.round(x0 * 7 + y0 * 13));
        for (let k = 0, tries = 0; k < n && tries < n * 6; tries++) { const x = x0 + (x1 - x0) * rr(), y = y0 + (y1 - y0) * rr(); if (!pointInPoly(x, y, p)) continue; A.glints.push({ x, y, t, ph: rr() * TAU, w: 0.9 + rr() * 1.4, s: 0.7 + rr() * 0.8 }); k++; }
      }
    }
  }
  return (R.air = A);
}
function drawAir(ctx, v, t) {
  const A = airPrep(), cfg = A.cfg; if (!cfg) return;
  const pz = v.pz, tx = v.tx, ty = v.ty, vr = v.rect, night = LOOK.night;
  ctx.save(); ctx.globalCompositeOperation = 'source-over';
  if (A.em.length) {                                                        // petals, leaves
    ctx.setTransform(pz, 0, 0, pz, tx, ty);
    for (let i = 0; i < A.em.length; i++) {
      const e = A.em[i]; if (e.t._st !== 3 || e.x < vr[0] - 40 || e.x > vr[2] + 40 || e.y < vr[1] - 60 || e.gy > vr[3] + 80) continue;
      const pet = e.k === 'petal', drift = pet ? 26 : 14;                   // petals ride the wind further than leaves
      for (let j = 0; j < e.n; j++) {
        const s0 = h2(i * 31 + j, 601), s1 = h2(i * 31 + j, 602), s2 = h2(i * 31 + j, 603), P = (pet ? 7 : 5.5) + 4 * s0, u = (((t / P + s1) % 1) + 1) % 1;
        const sx = e.x + (s2 - 0.5) * 1.5 * e.r, sy = e.y + (s0 - 0.5) * 0.7 * e.r, ex = e.gx + (s2 - 0.3) * 2.4 * e.r + drift, ey = e.gy + (s1 - 0.3) * 0.9 * e.r;
        const x = lerp(sx, ex, u) + Math.sin(t * 1.7 + s0 * 20) * 2.4 * Math.min(1, u * 4), y = lerp(sy, ey, u);
        const a = smooth(u / 0.08) * (1 - smooth((u - 0.85) / 0.15)); if (a <= 0.01) continue;
        const col = e.cols[(i + j) % e.cols.length], w = (pet ? 1.2 : 1.5) * (0.25 + 0.75 * Math.abs(Math.cos(t * 2.6 + s1 * 30))), h = pet ? 0.7 : 0.75, an = s2 * Math.PI + t * 0.7, ca = Math.cos(an), sa = Math.sin(an);
        ctx.globalAlpha = a; ctx.fillStyle = night ? nightColour(col) : col;
        ctx.beginPath(); ctx.moveTo(x - ca * w, y - sa * w); ctx.lineTo(x - sa * h, y + ca * h); ctx.lineTo(x + ca * w, y + sa * w); ctx.lineTo(x + sa * h, y - ca * h); ctx.fill();
        if (!night) { ctx.globalAlpha = a * 0.5; ctx.strokeStyle = shade(col, 0.45); ctx.lineWidth = 0.22; ctx.stroke(); }   // a hair of ink round it
      }
    }
  }
  if (cfg.glint && !night && A.glints.length) {                             // the sun on water
    ctx.setTransform(pz, 0, 0, pz, tx, ty); ctx.fillStyle = '#FFFFFF';
    for (const q of A.glints) {
      if (q.t._st !== 3 || q.x < vr[0] || q.x > vr[2] || q.y < vr[1] || q.y > vr[3]) continue;
      const b = Math.pow(Math.max(0, Math.sin(t * q.w + q.ph)), 10); if (b < 0.06) continue;
      const L = q.s * (0.8 + 1.4 * b), T = 0.16; ctx.globalAlpha = Math.min(1, b * 1.2);
      ctx.fillRect(q.x - L, q.y - T, 2 * L, 2 * T); ctx.fillRect(q.x - T * 0.8, q.y - L * 0.6, T * 1.6, L * 1.2);
    }
  }
  if (cfg.snow) {                                                           // snow over everything, in three depths
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const W = v.cw, H = v.ch, k = Math.min(W / 1920, H / 1080), dens = cfg.snow;
    for (const [par, size, n, speed, alpha] of [[0.25, 1.25, 5, 34, 0.55], [0.55, 1.9, 4, 52, 0.75], [1.0, 2.8, 2, 80, 0.92]]) {
      const cell = 150 * k, ox = tx * par * 0.35, oy = ty * par * 0.35, N = Math.max(1, Math.round(n * dens));
      const rim = new Path2D(), body = new Path2D();
      const c0 = Math.floor((-cell - ox) / cell), c1 = Math.ceil((W + cell - ox) / cell);
      for (let ci = c0; ci <= c1; ci++) for (let q = 0; q < N; q++) {
        const s0 = h2(ci * 977 + q * 31 + size * 1000, 701), s1 = h2(ci * 977 + q * 31 + size * 1000, 702), fall = speed * k * (0.8 + 0.4 * s0);
        const y0 = s1 * cell + fall * t + oy, m0 = Math.floor((-cell - y0) / cell), m1 = Math.ceil((H + cell - y0) / cell);
        for (let m = m0; m <= m1; m++) {
          const y = y0 + m * cell, s2 = h2(ci * 7919 + m * 104729 + q, 703 + size * 10), x = ci * cell + s2 * cell + ox + Math.sin(t * (0.6 + s0) + s2 * 9 + m) * 6 * k * par;
          if (x < -10 || x > W + 10 || y < -10 || y > H + 10) continue;
          const r = size * k * (0.7 + 0.5 * h2(ci + m * 13, 704 + q));
          rim.moveTo(x + r + 0.6 * k, y); rim.arc(x, y, r + 0.6 * k, 0, TAU); body.moveTo(x + r, y); body.arc(x, y, r, 0, TAU);
        }
      }
      ctx.globalAlpha = alpha * (night ? 0.35 : 0.6); ctx.fillStyle = night ? '#0E1222' : '#8492A6'; ctx.fill(rim);
      ctx.globalAlpha = alpha * (night ? 0.85 : 1); ctx.fillStyle = night ? '#E2E9F4' : '#FFFFFF'; ctx.fill(body);
    }
  }
  ctx.restore();
}
const ACTS = [];
/* Draw the city at time t (seconds) through view v.
   o.n: film frame (float) that decides which tiles are built; o.allLive: everything is finished;
   o.phase: boil phase for this shot; o.fade: 0..1 blend to cream. */
SF.draw = function (ctx, v, t, o) {
  o = o || {}; R.drawStamp = R.stamp;
  const n = o.n == null ? t * FPS : o.n, pz = v.pz, tx = v.tx, ty = v.ty;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  // paper, locked to the world
  const night = LOOK.night;
  if (!R.paperPat) R.paperPat = ctx.createPattern(R.tex.paper, 'repeat');
  if (night && !R.paperPatN) R.paperPatN = ctx.createPattern(R.tex.paperN, 'repeat');
  const pox = ((tx % 512) + 512) % 512, poy = ((ty % 512) + 512) % 512;
  ctx.save(); ctx.translate(pox - 512, poy - 512); ctx.fillStyle = night ? R.paperPatN : R.paperPat; ctx.fillRect(0, 0, v.cw + 1024, v.ch + 1024); ctx.restore();
  if (v.clip) { ctx.save(); ctx.beginPath(); ctx.rect(v.clip[0], v.clip[1], v.clip[2], v.clip[3]); ctx.clip(); }
  const variant = (((Math.floor(7 * t) + (o.phase | 0)) % BOIL_N) + BOIL_N) % BOIL_N;
  // tile states
  const tiles = SF.live, sts = new Array(tiles.length);
  for (let i = 0; i < tiles.length; i++) { const tl = tiles[i]; if (!o.allLive && tl.rim >= 0 && tl.doneAt == null && n >= tl.rim) initCons(tl, v); sts[i] = bbHit(tl.bb, v.rect) ? tileState(tl, n, o.allLive) : -1; tl._st = sts[i]; }
  // actors: where they are now, and the first thing that stands in front of each
  ACTS.length = 0;
  const vr = v.rect;
  for (const a of SF.actors) {
    const tl = a.tile; let grow = 1;
    if (a.cast && !o.allLive && (tl.rim >= 0 || tl.unfold)) { if (n < tl.castAt) continue; if (a.grow !== false) grow = 0.3 + 0.7 * smooth((n - tl.castAt) / 11); }
    const st = actorState(a, t); if (!st) continue;
    if (a.pb) { const s0 = (st.s == null ? 1 : st.s) * grow; if (!bbHit([st.sx + a.pb[0] * s0, st.sy + a.pb[1] * s0, st.sx + a.pb[2] * s0, st.sy + a.pb[3] * s0], vr)) continue; }   // off screen whatever its pose
    const dl = actorDL(a, st), s = (st.s == null ? 1 : st.s) * grow;
    const r = [st.sx + dl.bb[0] * s, st.sy + dl.bb[1] * s, st.sx + dl.bb[2] * s, st.sy + dl.bb[3] * s];
    if (!bbHit(r, vr)) continue;
    let slot = 1e9, floor = -1;                               // floor: the last thing behind it that it overlaps (it must be drawn after)
    if (a.layer !== 'top') {
      for (const ob of a.cand) {
        if (ob.gi >= slot) break;
        if (ob.noHide || ob.tile._st !== 3 || !bbHit(ob.bb, r)) continue;
        if (objInFrontOfPoint(ob, st.wx, st.wy, st.z)) { slot = ob.gi; break; }
        floor = ob.gi;
      }
      for (let i = 0; i < tiles.length; i++) {              // tiles still under construction act as one block
        if (sts[i] !== 1 && sts[i] !== 2) continue;
        const tl2 = tiles[i], g0 = tl2.statics.length ? tl2.statics[0].gi - 0.5 : 1e9;
        if (g0 < slot && bbHit(tl2.bbNoCast, r) && st.wx < tl2.fp[2] && st.wy < tl2.fp[3]) slot = g0;
      }
    } else slot = 2e9 + tl.order;
    ACTS.push({ a, st, dl, slot, floor, key: st.wx + st.wy + (a.bias || 0), grow, r });
  }
  // SCENE.slotChain: a person is drawn no later than any nearer person they overlap on screen. Without it a near person
  // whose slot comes early (something stands in front of them) is drawn before a far one with nothing in front of them,
  // and the far one lands on top.
  if (typeof SCENE !== 'undefined' && SCENE.slotChain) {
    const by = ACTS.slice().sort((p, q) => q.key - p.key);
    for (let i = 1; i < by.length; i++) {
      const B = by[i]; if (B.slot >= 2e9) continue;
      for (let j = 0; j < i; j++) { const A = by[j]; if (A.slot < B.slot && bbHit(A.r, B.r)) B.slot = Math.max(A.slot, B.floor + 0.5); }   // never under what stands behind it
    }
  }
  ACTS.sort((p, q) => p.slot - q.slot || p.key - q.key);
  if (ACTS.some((A) => A.st.ext)) footOrder(ACTS);
  let ai = 0;
  // exploring: the few ms for new pose bitmaps start here, not before the frame's bookkeeping. Half go to poses as they are
  // drawn (the first in depth order), half to everybody on screen in turn (prewarmPoses), so nobody waits for ever
  if (v.lazy) { const t0 = performance.now(), ms = v.bmpMs || 4; R.bmpUntil = t0 + (v.lazy === 'budget' ? ms / 2 : ms); R.warmUntil = t0 + ms; }
  const flushActors = (gi) => { while (ai < ACTS.length && ACTS[ai].slot <= gi) { if (!SF.noActors) drawActor(ctx, v, ACTS[ai]); ai++; } };
  const blit = (cv, x, y, exact, k) => {
    if (exact) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(cv, x + tx, y + ty); }
    else { ctx.setTransform(k, 0, 0, k, tx, ty); ctx.drawImage(cv, x, y); }
  };
  // Once nothing is under construction: every tile's base (its ground and the things that never hide an actor) first,
  // then all sprites and actors in the global depth order. Drawn tile by tile, an actor whose first sprite in front
  // belongs to an earlier tile (a car behind a street pole: the streets tile comes first) was painted over by every
  // later tile's ground and buildings, and a pole's top by the ground behind it. A base object never overlaps an
  // earlier sprite (the closure in initWorld promotes it), so the two passes change nothing else.
  if (!sts.some((s) => s === 1 || s === 2)) {
    const bs = new Array(tiles.length);
    for (let i = 0; i < tiles.length; i++) {
      if (sts[i] <= 0) continue;
      const b = bestBake(tiles[i], v);
      if (!b || !b.base) continue;
      const k = v.pz / b.pz, exact = Math.abs(k - 1) < 1e-6; bs[i] = { b, k, exact };
      blit(b.base.cv, b.base.x, b.base.y, exact, k);
      ctx.setTransform(pz, 0, 0, pz, tx, ty); drawBoil(ctx, v, b.boil, variant);
    }
    if (night) drawLight(ctx, v, t, o, 'ground');              // pools of lamplight lie on the ground, under people and buildings
    for (let i = 0; i < tiles.length; i++) {
      const q = bs[i]; if (!q) continue;
      for (const sp of q.b.sprites) {
        flushActors(sp.ob.gi);
        blit(sp.cv, sp.x, sp.y, q.exact, q.k);
        if (sp.boil) { ctx.setTransform(pz, 0, 0, pz, tx, ty); drawBoil(ctx, v, sp.boil, variant); }
      }
    }
  } else for (let i = 0; i < tiles.length; i++) {
    const tl = tiles[i], s = sts[i];
    if (s <= 0) continue;
    if (s === 1 || s === 2) { flushActors(tl.statics.length ? tl.statics[0].gi - 0.5 : -1); drawCons(ctx, tl, v, n, o.fresh); continue; }
    const b = bestBake(tl, v);
    if (!b || !b.base) continue;
    const k = v.pz / b.pz, exact = Math.abs(k - 1) < 1e-6;
    if (exact) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(b.base.cv, b.base.x + tx, b.base.y + ty); }
    else { ctx.setTransform(k, 0, 0, k, tx, ty); ctx.drawImage(b.base.cv, b.base.x, b.base.y); }
    ctx.setTransform(pz, 0, 0, pz, tx, ty); drawBoil(ctx, v, b.boil, variant);
    for (const sp of b.sprites) {
      flushActors(sp.ob.gi);
      if (exact) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(sp.cv, sp.x + tx, sp.y + ty); }
      else { ctx.setTransform(k, 0, 0, k, tx, ty); ctx.drawImage(sp.cv, sp.x, sp.y); }
      if (sp.boil) { ctx.setTransform(pz, 0, 0, pz, tx, ty); drawBoil(ctx, v, sp.boil, variant); }
    }
  }
  flushActors(3e9);
  if (v.lazy === 'budget') prewarmPoses(v, t);
  if (night) drawLightAir(ctx, v, t, o);
  if (typeof SCENE !== 'undefined' && SCENE.air && SCENE.air[LOOK.season]) drawAir(ctx, v, t);   // petals, leaves, snow, glints
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (v.clip) ctx.restore();
  // the ending: the whole frame, paper tooth included, goes to a flat warm cream
  if (o.fade > 0) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = clamp(o.fade, 0, 1); ctx.fillStyle = night ? 'rgb(' + NIGHT.paper.join(',') + ')' : 'rgb(242,237,228)'; ctx.fillRect(0, 0, v.cw, v.ch); ctx.globalAlpha = 1; }
};
