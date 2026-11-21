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
  mkTextures(); R.paperPat = null; R.grainPat = null; R.warmCtx = null;
  for (const c of ABMP.list) c.dl.bmp.delete(c.key);
  ABMP.list.length = 0; ABMP.px = 0;
  for (const a of SF.actors) a.lastB = null;
  for (const A of ATLS) { A.pages.length = 0; atlasReset(A); }
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
  const paper = mkCanvas(N, N), grain = mkCanvas(N, N);
  const pc = paper.getContext('2d'), gc = grain.getContext('2d');
  const pd = pc.createImageData(N, N), gd = gc.createImageData(N, N);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const i = (y * N + x) * 4;
    const fine = pn(x / 2.2, y / 2.2, Math.round(N / 2.2), 5) - 0.5, mid = pn(x / 8, y / 8, N / 8, 6) - 0.5, big = pn(x / 64, y / 64, N / 64, 7) - 0.5;
    const speck = h2(x * 7919 + y, 8);
    let v = fine * 3.4 + mid * 3.0 + big * 2.2;
    if (speck > 0.9965) v -= 5 + 6 * h2(x, y); else if (speck < 0.002) v += 3;
    pd.data[i] = clamp(240.5 + v, 0, 255); pd.data[i + 1] = clamp(238 + v * 0.95, 0, 255); pd.data[i + 2] = clamp(228 + v * 1.05, 0, 255); pd.data[i + 3] = 255;
    const g = fine * 1.5 + mid * 1.1 + (pn(x / 3.3, y / 1.4, Math.round(N / 3.3), 9) - 0.5) * 0.9;     // paint grain, signed
    if (g > 0) { gd.data[i] = 255; gd.data[i + 1] = 252; gd.data[i + 2] = 244; gd.data[i + 3] = clamp(g * 15, 0, 255); }
    else { gd.data[i] = 70; gd.data[i + 1] = 58; gd.data[i + 2] = 44; gd.data[i + 3] = clamp(-g * 15, 0, 255); }
  }
  pc.putImageData(pd, 0, 0); gc.putImageData(gd, 0, 0);
  R.tex = { paper, grain, N };
}

/* ---------- views ---------- */
/* cam = {z, cx, cy}: zoom relative to the wide view and centre in wide px.
   The picture is composed for 1920x1080 and fitted to the canvas. */
function mkView(cam, cw, ch, fit) {
  const s = Math.min(cw / 1920, ch / 1080), pz = cam.z * s;
  const v = { cam, cw, ch, s, z: cam.z, pz, tx: Math.round(cw / 2 - cam.cx * pz), ty: Math.round(ch / 2 - cam.cy * pz) };
  v.hw = lineW(cam.z) / (2 * cam.z);                         // main contour half-width, wide px
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
  ctx.translate(ox - 512, oy - 512); ctx.fillStyle = ctx.createPattern(R.tex.grain, 'repeat'); ctx.fillRect(0, 0, w + 1024, h + 1024);
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
        let p = by.get(d.col); if (!p) { p = new Path2D(); by.set(d.col, p); }
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
    const j = R.jobs[0], ts = performance.now(), r = j.gen.next(), dt = performance.now() - ts;
    if (window.__slowJobs) R.lastSteps.push(+dt.toFixed(1));
    if (dt > 6 && window.__slowJobs) window.__slowJobs.push([Math.round(SF.app && SF.app.t0 ? (performance.now() - SF.app.t0) / 1000 * 30 : -1), j.key || (j.t ? 'bake:' + j.t.name : '?'), +dt.toFixed(1), r.value == null ? '' : String(r.value)]);
    if (r.done) { R.jobs.shift(); if (j.fn) { j.fn(r.value); continue; } if (!j.t.bakes) j.t.bakes = []; if (j.pin) r.value.pin = true; j.t.bakes.push(r.value); evict(); }
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
  if (d.k === K_SEGS) { ctx.strokeStyle = d.col; ctx.lineWidth = Math.max(0.35 * hw, d.wt * hw * 2); ctx.beginPath(); ctx.moveTo(p[i], p[i + 1]); ctx.lineTo(p[i + 2], p[i + 3]); ctx.stroke(); }
  else { ctx.fillStyle = d.c; ctx.beginPath(); ctx.moveTo(p[i], p[i + 1]); ctx.lineTo(p[i + 2], p[i + 3]); ctx.lineTo(p[i + 4], p[i + 5]); ctx.closePath(); ctx.fill(); }
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
function compiled(dl, hw) {
  const k = Math.round(hw * 4096);
  let c = dl.comp.get(k);
  if (c) return c;
  // group the display list into Path2Ds; keep painter's order
  c = []; let cur = null;
  const need = (m, col, lw) => { if (cur && cur.m === m && cur.col === col && cur.lw === lw) return cur.p; cur = { m, col, lw, p: new Path2D() }; c.push(cur); return cur.p; };
  for (const d of dl.cmds) {
    if (d.co) continue;
    switch (d.k) {
      case K_FILL: { const p = need(0, d.c, 0), a = d.p; p.moveTo(a[0], a[1]); for (let i = 2; i < a.length; i += 2) p.lineTo(a[i], a[i + 1]); p.closePath(); break; }
      case K_RIB: ribPath(need(0, d.col, 0), d, hw, null, -1, 0); break;
      case K_STROKE: { const p = need(1, d.col, Math.max(0.35 * hw, d.wt * hw * 2)), a = d.p; p.moveTo(a[0], a[1]); for (let i = 2; i < a.length; i += 2) p.lineTo(a[i], a[i + 1]); break; }
      case K_DISC: { const p = need(0, d.c, 0); p.moveTo(d.x + d.r, d.y); p.arc(d.x, d.y, d.r, 0, TAU); p.closePath(); break; }
      case K_RING: { const p = need(1, d.col, Math.max(0.35 * hw, d.wt * hw * 2)); p.moveTo(d.x + d.r, d.y); p.arc(d.x, d.y, d.r, 0, TAU); break; }
      case K_SEGS: { const p = need(1, d.col, Math.max(0.35 * hw, d.wt * hw * 2)), a = d.p; for (let i = 0; i < a.length; i += 4) { p.moveTo(a[i], a[i + 1]); p.lineTo(a[i + 2], a[i + 3]); } break; }
      case K_TRIS: { const p = need(0, d.c, 0), a = d.p; for (let i = 0; i < a.length; i += 6) { p.moveTo(a[i], a[i + 1]); p.lineTo(a[i + 2], a[i + 3]); p.lineTo(a[i + 4], a[i + 5]); p.closePath(); } break; }
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
    const bb = dl.bb, ox = Math.floor(bb[0] * sc) - 2, oy = Math.floor(bb[1] * sc) - 2, w = Math.ceil(bb[2] * sc) + 2 - ox, h = Math.ceil(bb[3] * sc) + 2 - oy;
    const cv = mkCanvas(w, h), cx = cv.getContext('2d');
    cx.setTransform(sc, 0, 0, sc, -ox, -oy); cx.lineCap = 'round'; cx.lineJoin = 'round';
    for (const g of compiled(dl, hw)) { if (g.m === 0) { cx.fillStyle = g.col; cx.fill(g.p); } else { cx.strokeStyle = g.col; cx.lineWidth = g.lw; cx.stroke(g.p); } }
    b = { cv, ax: 0, ay: 0, w, h, ox, oy, px: w * h, used: ++R.stamp, dl, key, sc }; dl.bmp.set(key, b); ABMP.list.push(b); ABMP.px += b.px;
    if (ABMP.px > ABMP.budget) { ABMP.list.sort((p, q) => p.used - q.used); const cut = ABMP.list.splice(0, ABMP.list.length >> 2).filter((c) => c !== b); for (const c of cut) { c.dl.bmp.delete(c.key); ABMP.px -= c.px; c.cv.width = 0; } }
  }
  b.used = ++R.stamp;
  return b;
}
const ABMP = { list: [], px: 0, budget: 32e6 };
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
      const tl = act.tile; if (act.cast && tl.rim >= 0 && n < tl.castAt + 12) continue;
      const st = actorState(act, t); if (!st) continue;
      const dl = actorDL(act, st), ss = st.s == null ? 1 : st.s;
      if (!bbHit([st.sx + dl.bb[0] * ss, st.sy + dl.bb[1] * ss, st.sx + dl.bb[2] * ss, st.sy + dl.bb[3] * ss], v.rect)) continue;
      atlasPut(A, dl, v.pz * ss, v.hw);
      if (performance.now() - last > 1.5) { yield 'pose'; last = performance.now(); }     // slices by time: a pose can cost a lot at x9
    }
  }
}
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
      // frame or two (a step of a walk), or, the first time we see it, its vector drawing
      const lb = A.a.lastB;
      if (lb && lb.cv.width) b = lb;
      else { const c = compiled(A.dl, v.hw); ctx.setTransform(sc, 0, 0, sc, v.tx + st.sx * v.pz, v.ty + st.sy * v.pz); for (const g of c) { if (g.m === 0) { ctx.fillStyle = g.col; ctx.fill(g.p); } else { ctx.strokeStyle = g.col; ctx.lineWidth = g.lw; ctx.stroke(g.p); } } if (st.alpha != null) ctx.globalAlpha = 1; return; }
    } else if (!ab && b.sc != null && Math.abs(b.sc - sc) < 1e-6) A.a.lastB = b;
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
  if (!R.paperPat) R.paperPat = ctx.createPattern(R.tex.paper, 'repeat');
  const pox = ((tx % 512) + 512) % 512, poy = ((ty % 512) + 512) % 512;
  ctx.save(); ctx.translate(pox - 512, poy - 512); ctx.fillStyle = R.paperPat; ctx.fillRect(0, 0, v.cw + 1024, v.ch + 1024); ctx.restore();
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
    if (a.cast && !o.allLive && tl.rim >= 0) { if (n < tl.castAt) continue; if (a.grow !== false) grow = 0.3 + 0.7 * smooth((n - tl.castAt) / 11); }
    const st = actorState(a, t); if (!st) continue;
    const dl = actorDL(a, st), s = (st.s == null ? 1 : st.s) * grow;
    const r = [st.sx + dl.bb[0] * s, st.sy + dl.bb[1] * s, st.sx + dl.bb[2] * s, st.sy + dl.bb[3] * s];
    if (!bbHit(r, vr)) continue;
    let slot = 1e9;
    if (a.layer !== 'top') {
      for (const ob of a.cand) {
        if (ob.gi >= slot) break;
        if (ob.tile._st !== 3 || !bbHit(ob.bb, r)) continue;
        if (objInFrontOfPoint(ob, st.wx, st.wy, st.z)) { slot = ob.gi; break; }
      }
      for (let i = 0; i < tiles.length; i++) {              // tiles still under construction act as one block
        if (sts[i] !== 1 && sts[i] !== 2) continue;
        const tl2 = tiles[i], g0 = tl2.statics.length ? tl2.statics[0].gi - 0.5 : 1e9;
        if (g0 < slot && bbHit(tl2.bbNoCast, r) && st.wx < tl2.fp[2] && st.wy < tl2.fp[3]) slot = g0;
      }
    } else slot = 2e9 + tl.order;
    ACTS.push({ a, st, dl, slot, key: st.wx + st.wy + (a.bias || 0), grow });
  }
  ACTS.sort((p, q) => p.slot - q.slot || p.key - q.key);
  let ai = 0;
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
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (v.clip) ctx.restore();
  // the ending: the whole frame, paper tooth included, goes to a flat warm cream
  if (o.fade > 0) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = clamp(o.fade, 0, 1); ctx.fillStyle = 'rgb(242,237,228)'; ctx.fillRect(0, 0, v.cw, v.ch); ctx.globalAlpha = 1; }
};
