'use strict';
/* the page: film clock, hard cuts, recording mode, explore mode. */

const SHOTS = SCENE.shots, WIDE = SCENE.wide, FILM_FRAMES = SCENE.frames;
const LAST = FILM_FRAMES - 1, HOLD = SCENE.hold == null ? LAST : SCENE.hold;
const FADE_A = SCENE.fade ? SCENE.fade[0] : 1e9, FADE_N = SCENE.fade ? SCENE.fade[1] : 1;
const BOUNDS = Object.assign({ z: [0.9, 10], cx: [120, 1800], cy: [120, 1060] }, SCENE.bounds || {});
function shotEnd(i) { return i + 1 < SHOTS.length ? SHOTS[i + 1].a : FILM_FRAMES; }
function shotAt(n) { let s = 0; for (let i = 0; i < SHOTS.length; i++) if (n >= SHOTS[i].a) s = i; return s; }
/* the film's clock stops on HOLD: later frames hold it exactly */
function filmT(n) { return Math.min(n, HOLD) / FPS; }
function fadeAt(n) { const m = Math.min(n, HOLD); return m <= FADE_A ? 0 : Math.min(1, (m - FADE_A) / FADE_N); }
function boilPhase(i) { const b = SCENE.boil || [0, 2, 5, 1, 4, 3]; return b[i % b.length]; }

const APP = SF.app = {
  mode: 'film', rec: false, frozen: null, t0: 0, t: 0, paused: false, pauseAt: 0, cam: Object.assign({}, WIDE),
  shot: -1, fadeUp: 0, lastInput: -1e9, stats: [], dirtyZoom: 0, started: false,
};

SF.boot = function () {
  const q = new URLSearchParams(location.search);
  // a seeked page is read back every frame (checks, recording): a read-optimised canvas from the start, so Chrome never
  // moves it from GPU to CPU halfway through, which would change how one frame rasterises
  const cv = document.getElementById('sf'), ctx = cv.getContext('2d', { alpha: false, willReadFrequently: q.has('f') });
  APP.cv = cv; APP.ctx = ctx; APP.q = q;
  APP.rec = q.has('film'); SF.noBoil = q.has('noboil'); SF.noActors = q.has('noactors'); SF.noBlit = q.has('noblit'); SF.noAtlas = q.has('noatlas'); APP.frozen = q.has('f') ? parseFloat(q.get('f')) : null;
  mkTextures();
  SF.initWorld(q.get('only') ? q.get('only').split(',') : null);
  const size = () => {
    if (APP.rec || APP.frozen != null) { cv.width = 1920; cv.height = 1080; cv.style.width = '1920px'; cv.style.height = '1080px'; }
    else {
      const dpr = Math.min(window.devicePixelRatio || 1, 2), w = window.innerWidth, h = window.innerHeight;
      const k = Math.min(1, 2880 / (w * dpr));
      cv.width = Math.round(w * dpr * k); cv.height = Math.round(h * dpr * k); cv.style.width = w + 'px'; cv.style.height = h + 'px';
    }
    R.paperPat = null; pinWide();
  };
  const pinWide = () => {
    // the wide bake is kept for good: the film starts and ends on it and it is the fallback while zooming
    const v = mkView(WIDE, cv.width, cv.height, true);
    for (const t of SF.live) {
      if (t.wide && Math.abs(t.wide.pz - v.pz) < 1e-6) continue;
      t.bakes = []; t.cons = null; t.doneAt = null;
      t.wide = bakeNow(t, { pz: v.pz, hw: v.hw, amp: v.amp, z: 1, rect: t.bb }, { pin: true });
    }
    if (!APP.rec && APP.mode !== 'explore') for (const t of SF.live) if (t.rim >= 0) initCons(t, v);
  };
  size();
  window.addEventListener('resize', () => { if (!APP.rec && APP.frozen == null) size(); });
  // a GPU reset (Chrome does one under memory pressure, on sleep/wake, on a display change) wipes every canvas: without
  // this the city stays black. Wait for the page canvas to come back, then rebuild every cache (tick calls APP.recover)
  cv.addEventListener('contextlost', () => { APP.gpuLost = true; R.lost = true; });
  cv.addEventListener('contextrestored', () => { APP.gpuLost = false; });
  APP.recover = () => {
    gpuReset(); pinWide();
    if (APP.mode === 'film') { APP.shot = -1; APP.prepped = -1; APP.prepQ = -1; }     // the cut re-bakes and re-packs the shot
  };
  if (APP.frozen != null) { renderFrozen(APP.frozen, q); return; }
  if (APP.rec) {
    cv.style.cursor = 'none';
    // plain paper while the first cut is prepared, then roll; later shots are prepared while the one before plays
    const v0 = mkView(WIDE, cv.width, cv.height, true);
    SF.draw(ctx, v0, 0, { n: -1 });
    setTimeout(() => {
      for (const t of SF.live) if (t.rim >= 0) initCons(t, v0);
      ensureBakes(mkView(SHOTS[1], cv.width, cv.height, true), true);
      // let the GPU meet every construction canvas and the build frames once, wait for it to finish, then cover it with paper again
      for (let n = 0; n < 200; n += 12) SF.draw(ctx, v0, n / FPS, { n, phase: 0 });
      for (const t of SF.live) if (t.cons) t.cons.n = 1e9;
      ctx.getImageData(0, 0, 1, 1);
      SF.draw(ctx, v0, 0, { n: -1 });
      window.__baked = true; setTimeout(startFilm, 400);
    }, 30);
  } else {
    bindInput();
    window.__baked = true;
    // SCENE.autoplay false: no tour on load; the finished city fades in and waits for the viewer.
    // SCENE.autoplay 'build': the city draws itself on the wide view (pen, then colour, then the people), and the
    // viewer takes over where the build ends, with no tour of the places. Either way R plays the whole tour, ?tour
    // forces it, ?film records it.
    if (SCENE.autoplay === false && !q.has('tour')) startExplore();
    else startFilm(SCENE.autoplay === 'build' && !q.has('tour'));
  }
  requestAnimationFrame(tick);
};
function startFilm(introOnly) {
  APP.glide = null; setTimeout(() => emit('film', { intro: !!(introOnly && SHOTS.length > 1) }), 0);
  APP.intro = introOnly && SHOTS.length > 1 ? SHOTS[1].a : 0;        // the frame where the build ends and the tour would begin
  APP.mode = 'film'; APP.paused = false; APP.started = true; APP.shot = -1; APP.fadeUp = 0; APP.stats = []; APP.lastT = null; APP.prepQ = -1; R.jobs.length = 0;
  const cv = APP.cv, v0 = mkView(WIDE, cv.width, cv.height, true);
  { for (const t of SF.live) if (t.rim >= 0) { initCons(t, v0); t.cons.n = 1e9; } }   // construction caches restart
  // pack the first shot's poses now, before the clock starts
  { const g = atlasPrepGen(ATLS[0], SHOTS[0], 0, shotEnd(0), cv.width, cv.height); let r; do { r = g.next(); } while (!r.done); APP.prepped = 0; SF.atlasOn = 0; }
  APP.t0 = performance.now() - (APP.q && APP.q.has('from') ? parseFloat(APP.q.get('from')) / FPS * 1000 : 0);
  APP.cv.style.cursor = APP.intro ? 'grab' : 'none';
  window.__done = false;
}
function startExplore() {
  APP.started = true; APP.paused = false; APP.t0 = performance.now(); APP.mode = 'film';
  toExplore(true);
  for (const tl of SF.live) if (tl.cons) { tl.cons.lines.width = 0; tl.cons.paint.width = 0; tl.cons.final.width = 0; tl.cons = null; }   // no build to show
}
function now() { return APP.paused ? APP.pauseAt : (performance.now() - APP.t0) / 1000; }

function renderFrozen(f, q) {
  const cv = APP.cv, ctx = APP.ctx;
  let cam = SHOTS[shotAt(f)];
  if (q.get('cam')) { const c = q.get('cam').split(',').map(Number); cam = { z: c[0], cx: c[1], cy: c[2] }; }
  const live = q.has('live');
  const v = mkView(cam, cv.width, cv.height, true);
  ensureBakes(v, true);
  SF.draw(ctx, v, live ? f / FPS : filmT(f), { n: f, allLive: live, phase: boilPhase(shotAt(f)), fade: live ? 0 : fadeAt(f), fresh: true });
  window.__ready = true;
  /* for the checks: draw any frame, in any order */
  SF.seek = function (n, camOverride) {
    const c2 = camOverride || SHOTS[shotAt(n)], v2 = mkView(c2, cv.width, cv.height, true);
    ensureBakes(v2, true);
    SF.draw(ctx, v2, live ? n / FPS : filmT(n), { n, allLive: live, phase: boilPhase(shotAt(n)), fade: live ? 0 : fadeAt(n), fresh: true });
    reap(true);                                             // no animation loop here: free evicted canvases now
  };
}

function tick() {
  requestAnimationFrame(tick);
  if (!APP.started || APP.gpuLost) return;
  if (R.lost) APP.recover();
  if (APP.mode === 'film') reap(); else reap(false, 4, 16e6);   // film: one evicted canvas per frame; exploring: a time budget
  const cv = APP.cv, ctx = APP.ctx;
  const t = now();
  if (APP.mode === 'film') {
    let n = t * FPS;
    if (APP.intro && n >= APP.intro) { toExplore('intro'); return; }    // the build is drawn: hand the city over
    if (n >= LAST) {
      n = LAST;
      if (!window.__done) { window.__done = true; window.__endWall = (performance.now() - APP.t0) / 1000; }
      if (!APP.rec && t * FPS > LAST + 12) { toExplore(true); return; }      // a short hold on the ghost, then the city comes back
    }
    const si = shotAt(n), cam = SHOTS[si];
    APP.filmCam = cam;
    const v = mkView(cam, cv.width, cv.height, true);
    if (si !== APP.shot) {
      APP.shot = si; const c0 = performance.now(); finishJobs(); ensureBakes(v, true); evict(); APP.cutMs = performance.now() - c0;
      if (APP.prepped !== si) { const g = atlasPrepGen(ATLS[si % 2], SHOTS[si], SHOTS[si].a, shotEnd(si), cv.width, cv.height); let r; do { r = g.next(); } while (!r.done); }
      SF.atlasOn = si % 2; APP.prepped = si;
      if (si >= 1) for (const tl of SF.live) if (tl.cons) { tl.cons.lines.width = 0; tl.cons.paint.width = 0; tl.cons.final.width = 0; tl.cons = null; }   // the build is over
    }
    // get the next shot ready while this one plays (not when only the build plays: explore follows, on the wide view)
    const w0 = performance.now();
    if (si + 1 < SHOTS.length && !APP.intro) {
      const nv = mkView(SHOTS[si + 1], cv.width, cv.height, true); ensureBakes(nv, false);
      if (APP.prepQ !== si + 1) { APP.prepQ = si + 1; const nx = si + 1; R.jobs.push({ key: 'atlas' + nx, gen: atlasPrepGen(ATLS[nx % 2], SHOTS[nx], SHOTS[nx].a, shotEnd(nx), cv.width, cv.height), fn: () => { APP.prepped = nx; } }); }
      APP.queueMs = performance.now() - w0;
      if (R.jobs.length) runJobs(clamp(12 - (APP.drawMs || 6), 2, 7));
    }
    const w1 = performance.now();
    SF.draw(ctx, v, Math.min(t, filmT(n)), { n: Math.min(n, HOLD), phase: boilPhase(si), fade: fadeAt(n) });
    const w2 = performance.now(); APP.drawMs = w2 - w1;
    if (APP.q.has('log')) {
      if (APP.lastT != null) APP.stats.push(w2 - APP.lastT); APP.lastT = w2; window.__stats = APP.stats;
      if (!window.__work) window.__work = [];
      window.__work.push([Math.round(n), +(w1 - w0).toFixed(1), +(w2 - w1).toFixed(1), +(APP.cutMs || 0).toFixed(1), +(APP.queueMs || 0).toFixed(1), (R.lastSteps || []).join('+')]); APP.cutMs = 0; APP.queueMs = 0;
    }
    return;
  }
  // explore
  if (APP.glide) stepGlide();
  const v = mkView(APP.cam, cv.width, cv.height, false);
  const settled = performance.now() - APP.dirtyZoom > 90;
  // people and cars: while the zoom moves, stand-ins scaled from bitmaps they already have; once it rests, a few ms of
  // exact bitmaps per frame until all are sharp again (rasterising every visible pose at once stalled the zoom)
  v.lazy = settled ? 'budget' : 'moving'; R.bmpUntil = performance.now() + 4; R.bmpPending = false;
  // background bakes get the time this frame has left, not a fixed 26 ms
  if (settled) { exploreBakes(v); runJobs(R.jobs.length ? clamp(12 - (APP.drawMs || 5), 3, 9) : 0, 2.5e6); }
  let fade = 0;
  if (APP.fadeUp > 0) { const k = (performance.now() - APP.fadeUp) / 1000; fade = k >= 1 ? 0 : (23 / 24) * (1 - smooth(k)); if (k >= 1) APP.fadeUp = 0; }
  const d0 = performance.now();
  SF.draw(ctx, v, t, { allLive: true, phase: APP.phase | 0, fade });
  APP.drawMs = performance.now() - d0;
  drawUI(ctx, cv);
}
function exploreBakes(v) {
  // drop bakes queued for views we have left (another zoom, a tile no longer on screen): they only cost time and GPU
  R.jobs = R.jobs.filter((j) => j.fn || !j.t || (Math.abs(+j.key.split('|')[1] - v.pz) < 1e-4 && bbHit(j.t.bb, v.rect)));
  for (const t of SF.live) {
    if (!bbHit(t.bb, v.rect) || findBake(t, v)) continue;
    const area = (t.bb[2] - t.bb[0]) * (t.bb[3] - t.bb[1]) * v.pz * v.pz;
    if (area <= 4e6) bakeLater(t, { pz: v.pz, hw: v.hw, amp: v.amp, z: v.z, rect: t.bb }, {});
    else bakeLater(t, v, { margin: 0.25 });
  }
}

/* ---------- explore mode ---------- */
function toExplore(fromEnd) {
  if (APP.mode === 'explore' || APP.rec) return;
  const n = now() * FPS;
  const intro = fromEnd === 'intro'; APP.intro = 0;
  APP.mode = 'explore'; SF.atlasOn = -1; R.jobs = R.jobs.filter((j) => !j.fn);
  APP.cam = fromEnd ? Object.assign({}, WIDE) : Object.assign({}, SHOTS[shotAt(Math.min(n, LAST))]);
  APP.phase = boilPhase(shotAt(Math.min(n, LAST)));
  // after the build the city is already on screen, so no fade; after the tour it comes back from the ghost
  APP.fadeUp = intro ? 0 : fromEnd ? performance.now() : (fadeAt(n) > 0 ? performance.now() : 0);
  for (const tl of SF.live) if (tl.cons) { tl.cons.lines.width = 0; tl.cons.paint.width = 0; tl.cons.final.width = 0; tl.cons = null; }   // the build is over
  APP.cv.style.cursor = 'grab'; APP.lastInput = performance.now();
  emit('explore', { intro, fromEnd: !!fromEnd });
}
function clampCam(c) {
  c.z = clamp(c.z, BOUNDS.z[0], BOUNDS.z[1]);
  c.cx = clamp(c.cx, BOUNDS.cx[0], BOUNDS.cx[1]); c.cy = clamp(c.cy, BOUNDS.cy[0], BOUNDS.cy[1]);
}
function cutTo(cam) { APP.cam = { z: cam.z, cx: cam.cx, cy: cam.cy }; clampCam(APP.cam); APP.dirtyZoom = 0; APP.phase = (APP.phase + 1) % 6; }
const VISIT = SCENE.visit || SHOTS.filter((q) => q.z > 1.5).map((q) => q.name).slice(0, 9);
function shotByName(nm) { return SHOTS.find((s) => s.name === nm); }
function visitWorld(wx, wy) {
  // which place is under this wide-px point?
  const g = unprj(wx, wy);
  let best = null, bd = 1e9;
  for (const t of SF.live) {
    if (t.name === 'streets' || t.o.shared) continue;                // shared ground (a sea, a canal) is not a place to visit
    const inside = Math.abs(g[0] - t.cx) <= t.half + 4 && Math.abs(g[1] - t.cy) <= t.half + 4;
    const d = Math.hypot(wx - (t.bb[0] + t.bb[2]) / 2, wy - (t.bb[1] + t.bb[3]) / 2);
    if ((inside || (wx > t.bb[0] && wx < t.bb[2] && wy > t.bb[1] && wy < t.bb[3])) && d < bd) { bd = d; best = t; }
  }
  if (!best) return;
  const s = shotByName(best.name);
  const dive = SCENE.dive && SCENE.dive[best.name];
  if (s && dive) { const at = Math.abs(APP.cam.z - s.z) < 0.01 && Math.abs(APP.cam.cx - s.cx) < 2; cutTo(at ? shotByName(dive) : s); return; }
  if (s) cutTo(s); else cutTo({ z: 4, cx: (best.bb[0] + best.bb[2]) / 2, cy: (best.bb[1] + best.bb[3]) / 2 });
}
function bindInput() {
  const cv = APP.cv;
  const ptrs = new Map(); let drag = null, pinch = null;
  const scale = () => { const s = Math.min(cv.width / 1920, cv.height / 1080); return { s, k: cv.width / cv.clientWidth }; };
  const toWide = (ex, ey) => { const { s, k } = scale(), pz = APP.cam.z * s; return [(ex * k - cv.width / 2) / pz + APP.cam.cx, (ey * k - cv.height / 2) / pz + APP.cam.cy]; };
  const touch = () => { APP.lastInput = performance.now(); APP.glide = null; if (APP.mode === 'film') toExplore(false); };
  const zoomAt = (ex, ey, f) => {
    const a = toWide(ex, ey); APP.cam.z = clamp(APP.cam.z * f, BOUNDS.z[0], BOUNDS.z[1]); const b = toWide(ex, ey);
    APP.cam.cx += a[0] - b[0]; APP.cam.cy += a[1] - b[1]; clampCam(APP.cam); APP.dirtyZoom = performance.now();
  };
  cv.addEventListener('pointerdown', (e) => {
    const wasFilm = APP.mode === 'film'; touch(); cv.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, [e.clientX, e.clientY]);
    if (ptrs.size === 1) { drag = { x: e.clientX, y: e.clientY, cx: APP.cam.cx, cy: APP.cam.cy, moved: wasFilm ? 99 : 0 }; cv.style.cursor = 'grabbing'; }
    if (ptrs.size === 2) { const p = Array.from(ptrs.values()); pinch = { d: Math.hypot(p[0][0] - p[1][0], p[0][1] - p[1][1]) }; drag = null; }
  });
  cv.addEventListener('pointermove', (e) => {
    if (APP.mode !== 'explore') return;                     // moving the mouse alone does not interrupt the film
    APP.lastInput = performance.now();
    if (!ptrs.has(e.pointerId)) return;
    ptrs.set(e.pointerId, [e.clientX, e.clientY]);
    if (pinch && ptrs.size === 2) {
      const p = Array.from(ptrs.values()), d = Math.hypot(p[0][0] - p[1][0], p[0][1] - p[1][1]);
      zoomAt((p[0][0] + p[1][0]) / 2, (p[0][1] + p[1][1]) / 2, d / pinch.d); pinch.d = d; return;
    }
    if (drag) {
      const { s, k } = scale(), pz = APP.cam.z * s;
      drag.moved = Math.max(drag.moved, Math.hypot(e.clientX - drag.x, e.clientY - drag.y));
      if (drag.moved > 4) { APP.cam.cx = drag.cx - (e.clientX - drag.x) * k / pz; APP.cam.cy = drag.cy - (e.clientY - drag.y) * k / pz; clampCam(APP.cam); }
    }
  });
  const up = (e) => {
    if (drag && drag.moved <= 4 && ptrs.size === 1 && APP.mode === 'explore') {
      if (!uiHit(e.clientX, e.clientY)) { const w = toWide(e.clientX, e.clientY); visitWorld(w[0], w[1]); }
    }
    ptrs.delete(e.pointerId); if (ptrs.size < 2) pinch = null; if (ptrs.size === 0) { drag = null; cv.style.cursor = APP.mode === 'explore' ? 'grab' : 'none'; }
  };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  cv.addEventListener('wheel', (e) => {
    e.preventDefault(); touch();
    const f = Math.exp(-e.deltaY * (e.ctrlKey ? 0.012 : 0.0022));
    zoomAt(e.clientX, e.clientY, f);
  }, { passive: false });
  window.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    if (k === 'r' || k === 'R') { replay_(); return; }
    touch();
    if (k === ' ') { e.preventDefault(); togglePause(); }
    else if (k === '0' || k === 'Escape') { if (SF.home) SF.glideTo(SF.home()); else cutTo(WIDE); }   // the page's guide may frame the city beside its panel
    else if (k >= '1' && k <= '9' && VISIT[+k - 1]) cutTo(shotByName(VISIT[+k - 1]));
  });
}
function togglePause() {
  if (APP.paused) { APP.t0 = performance.now() - APP.pauseAt * 1000; APP.paused = false; }
  else { APP.pauseAt = now(); APP.paused = true; }
}
function replay_() { ACT_DL.size; startFilm(); }

/* ---------- the two pen-drawn icons ---------- */
const UI = { dl: null, r: 26 };
function uiIcons() {
  if (UI.dl) return UI.dl;
  const mk = (fn) => { const g = new G('ui' + fn.name); g.boilP = 0; fn(g); return { cmds: g.cmds, comp: new Map() }; };
  const arc = (r, a0, a1, n) => { const p = []; for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; p.push([Math.cos(a) * r, Math.sin(a) * r]); } return p; };
  UI.dl = {
    replay: mk(function replay(g) { g.line2(arc(8, 0.75, 5.5, 24), { w: 1, taper: 0.3, ext: 0 }); const a = 5.5, e = [8 * Math.cos(a), 8 * Math.sin(a)], t = [-Math.sin(a), Math.cos(a)], n = [Math.cos(a), Math.sin(a)]; g.line2([[e[0] - t[0] * 3.4 + n[0] * 3.2, e[1] - t[1] * 3.4 + n[1] * 3.2], [e[0] + t[0] * 1.6, e[1] + t[1] * 1.6], [e[0] - t[0] * 3.4 - n[0] * 3.2, e[1] - t[1] * 3.4 - n[1] * 3.2]], { w: 1, ext: 0 }); }),
    pause: mk(function pause(g) { g.line2([[-3.4, -7], [-3.6, 7]], { w: 1.25 }); g.line2([[3.6, -7], [3.4, 7]], { w: 1.25 }); }),
    play: mk(function play(g) { g.outline2([[-4, -7.5], [7, 0], [-4, 7.5]], { w: 1 }); }),
  };
  return UI.dl;
}
function uiPos() { const cv = APP.cv, k = cv.width / cv.clientWidth; return { k, a: [34 * k, cv.height - 34 * k], b: [78 * k, cv.height - 34 * k] }; }
function uiHit(ex, ey) {
  if (SF.ui === false) return false;
  const p = uiPos(), x = ex * p.k, y = ey * p.k, r = 20 * p.k;
  if (Math.hypot(x - p.a[0], y - p.a[1]) < r) { replay_(); return true; }
  if (Math.hypot(x - p.b[0], y - p.b[1]) < r) { togglePause(); return true; }
  return false;
}
function drawUI(ctx, cv) {
  if (SF.ui === false) return;                               // the page's guide draws its own controls
  const idle = (performance.now() - APP.lastInput) / 1000, a = APP.paused ? 1 : clamp(1.6 - (idle - 2.5) / 0.8, 0, 1);
  if (a <= 0) return;
  const ic = uiIcons(), p = uiPos(), s = 1.7 * p.k;
  ctx.globalAlpha = 0.8 * a;
  for (const [dl, pos] of [[ic.replay, p.a], [APP.paused ? ic.play : ic.pause, p.b]]) {
    ctx.setTransform(s, 0, 0, s, pos[0], pos[1]);
    for (const g of compiled(dl, 0.75)) { if (g.m === 0) { ctx.fillStyle = g.col; ctx.fill(g.p); } else { ctx.strokeStyle = g.col; ctx.lineWidth = g.lw; ctx.stroke(g.p); } }
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
}

/* ---------- for the page's guide (a DOM overlay): read the view, move the camera, hear the mode change ----------
   Cameras are in wide px (the 1920 x 1080 frame at zoom 1); SF.prj turns a world point into wide px. */
window.SF = SF;                                              // a top-level const is not a window property
const EV = {};
function emit(k, a) { for (const f of EV[k] || []) { try { f(a); } catch (e) { console.error(e); } } }
SF.on = (k, f) => { (EV[k] = EV[k] || []).push(f); };
SF.prj = (x, y, z) => prj(x, y, z || 0);
SF.wide = WIDE; SF.shots = SHOTS; SF.visit = VISIT; SF.bounds = BOUNDS;
SF.shot = (name) => shotByName(name);
SF.zMin = () => BOUNDS.z[0];
/* the camera on screen now, and how wide px map to CSS px */
SF.view = function () {
  const cv = APP.cv, cam = APP.mode === 'explore' ? APP.cam : (APP.filmCam || WIDE);
  const k = cv.width / cv.clientWidth, pz = cam.z * Math.min(cv.width / 1920, cv.height / 1080) / k;
  return { mode: APP.mode, z: cam.z, cx: cam.cx, cy: cam.cy, pz, w: cv.clientWidth, h: cv.clientHeight, paused: !!APP.paused, gliding: !!APP.glide };
};
SF.toScreen = function (wx, wy, v) { v = v || SF.view(); return [(wx - v.cx) * v.pz + v.w / 2, (wy - v.cy) * v.pz + v.h / 2]; };
/* the map's extent in wide px (every tile, satellites included) */
SF.boxes = () => SF.live.map((t) => t.bb.slice());              // every tile's and satellite's wide-px box
SF.extent = function () { let a = [1e9, 1e9, -1e9, -1e9]; for (const t of SF.live) { a[0] = Math.min(a[0], t.bb[0]); a[1] = Math.min(a[1], t.bb[1]); a[2] = Math.max(a[2], t.bb[2]); a[3] = Math.max(a[3], t.bb[3]); } return a; };
/* glide the explore camera to a camera {z, cx, cy}, a shot's name, or WIDE; it pulls back on long trips */
SF.glideTo = function (to, ms) {
  if (typeof to === 'string') to = shotByName(to) || WIDE;
  if (APP.mode !== 'explore') toExplore(false);
  const b = { z: to.z, cx: to.cx, cy: to.cy }; clampCam(b);
  const a = { z: APP.cam.z, cx: APP.cam.cx, cy: APP.cam.cy }, d = Math.hypot(b.cx - a.cx, b.cy - a.cy);
  const fit = 1920 * 0.7 / Math.max(1, d), lo = Math.min(a.z, b.z), dip = Math.max(0, Math.log(lo / Math.max(fit, WIDE.z)));
  APP.glide = { a, b, dip, t0: performance.now(), ms: ms || clamp(700 + d * 0.5 + dip * 260, 700, 1600) };
  APP.lastInput = performance.now();
};
function stepGlide() {
  const g = APP.glide, t = clamp((performance.now() - g.t0) / g.ms, 0, 1), e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const lz = Math.log(g.a.z) + (Math.log(g.b.z) - Math.log(g.a.z)) * e - g.dip * Math.sin(Math.PI * e);
  APP.cam = { z: Math.exp(lz), cx: g.a.cx + (g.b.cx - g.a.cx) * e, cy: g.a.cy + (g.b.cy - g.a.cy) * e };
  APP.dirtyZoom = performance.now(); APP.lastInput = performance.now();
  if (t >= 1) { APP.cam = Object.assign({}, g.b); APP.glide = null; APP.phase = (APP.phase + 1) % 6; emit('arrive', Object.assign({}, g.b)); }
}
SF.pause = () => { if (!APP.paused) togglePause(); };
SF.resume = () => { if (APP.paused) togglePause(); };
SF.togglePause = () => togglePause();
SF.replay = () => replay_();
