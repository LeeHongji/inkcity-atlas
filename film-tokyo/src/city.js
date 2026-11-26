// The real Tokyo page, used as the renderer. Each variant runs in a hidden same-origin iframe in ?f=0 mode, where
// SF.seek(n, cam) draws film frame n at any camera from nothing (the call the skill's record.mjs makes). A shot copies
// the middle 1080 x 1080 of that 1920 x 1080 canvas into its own square canvas.
//   spring: the city's own season (the plain page);  summer, autumn, winter: ?season=
const pool = new Map();
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const VARIANT = {spring: '', summer: '&season=summer', autumn: '&season=autumn', winter: '&season=winter'};
export const key = (v) => 'tokyo:' + v;
const page = (v) => `/atlas/cities/tokyo/index.html?f=0${VARIANT[v]}`;
const X0 = 420;   // the middle square of the page's 1920-wide frame
/* Inside each page: free every canvas it keeps on the GPU at once (bakes, actor bitmaps, pose atlases) and forget them
   (engine/80_render.js gpuReset only drops the references, and the GPU memory waits for the garbage collector). A long
   run of new zooms otherwise fills the GPU until Chrome drops the page's canvases: blank bakes, and poses read from
   wiped atlases. __lost: the page saw its canvases dropped. */
const PURGE = `window.__purge = function () {
  const z = (cv) => { if (cv) { cv.width = 0; cv.height = 0; } };
  const bake = (b) => { if (!b) return; if (b.base) z(b.base.cv); for (const s of b.sprites || []) z(s.cv); };
  for (const t of SF.live) { for (const b of t.bakes || []) bake(b); bake(t.wide); }
  for (const c of ABMP.list) z(c.cv);
  for (const pg of POSEPG.pages) z(pg.cv);
  for (const A of ATLS) for (const pg of A.pages) z(pg.cv);
  reap(true); gpuReset();
}; window.__lost = () => R.lost;`;

export function load(v) {
  const k = key(v);
  let c = pool.get(k);
  if (c) return c.ready;
  const f = document.createElement('iframe');
  f.setAttribute('aria-hidden', 'true'); f.tabIndex = -1;
  f.style.cssText = 'position:fixed;left:0;top:0;width:1920px;height:1080px;border:0;opacity:0;pointer-events:none;z-index:-1';
  f.src = page(v);
  document.body.appendChild(f);
  c = {f, win: null};
  c.ready = (async () => {
    for (let i = 0; i < 2400; i++) {
      const w = f.contentWindow;
      if (w && w.__ready && w.SF && w.SF.seek) { w.eval(PURGE); c.win = w; return c; }
      await wait(50);
    }
    throw new Error('city page did not load: ' + k);
  })();
  pool.set(k, c);
  return c.ready;
}

/** Drop every page not in `keep` (a Set of keys). */
export function release(keep) {
  for (const [k, c] of pool) if (!keep.has(k)) { c.f.remove(); pool.delete(k); }
}

/** A world point [x, y, z] in wide px (the page's own projection, SF.prj). */
export async function prj(p) { const c = await load('spring'); return c.win.SF.prj(p[0], p[1], p[2] || 0); }

/** A camera {z, cx, cy} looking at world point p. */
export async function camAt(p, z) { const [cx, cy] = await prj(p); return {z, cx, cy}; }

/** Free page v's GPU caches (at a shot's first frame, and on a camera move's new zoom step at a low zoom). */
export async function purge(v) { const c = await load(v); c.win.__purge(); }
const purged = new Map();                       // shot id -> the film time it last purged at
export async function purgeOnce(v, id, t) { if (purged.get(id + v) === t) return; purged.set(id + v, t); await purge(v); }

/* page frame n at camera cam, drawn again from clean caches if the page saw its canvases dropped */
function seekSafe(c, n, cam) {
  c.win.SF.seek(Math.max(0, Math.round(n)), cam);
  if (c.win.__lost()) { c.win.__purge(); c.win.SF.seek(Math.max(0, Math.round(n)), cam); }
}

/** Draw page frame n of variant v at camera cam into ctx (the middle square of the page's frame). o.alpha: over what is there. */
export async function paint(v, n, cam, ctx, o = {}) {
  const c = await load(v);
  seekSafe(c, n, cam);
  ctx.save(); ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
  ctx.drawImage(c.win.SF.app.cv, X0, 0, 1080, 1080, 0, 0, 1080, 1080);
  ctx.restore();
}

/* A camera move (a pull-back or a dive). A new zoom every frame makes the page bake the whole city and draw every pose
   again, every frame: seconds a frame at a low zoom, and the GPU memory runs out. So the page draws on a ladder of
   zooms from A.z to B.z, steps of at most 5% (both ends exactly on it), at the step just below the frame's zoom, and
   the film scales that up by under 5% to the exact zoom. Frames on one step reuse its bakes and poses. */
export function ladder(A, B, rmax = 1.05) {
  const L = Math.log(B.z / A.z), N = Math.max(1, Math.ceil(Math.abs(L) / Math.log(rmax)));
  return (z) => {
    const k = Math.floor(N * Math.log(z / A.z) / L * Math.sign(L) + 1e-6) * Math.sign(L);   // steps from A towards B, rounded towards the smaller zoom
    const zq = A.z * Math.exp(L * k / N);
    return zq > z * (1 + 1e-9) ? A.z * Math.exp(L * (k - Math.sign(L)) / N) : zq;
  };
}
export async function paintMove(v, n, cam, ctx, step) {
  const c = await load(v), zq = Math.min(cam.z, step(cam.z));
  // a new step below zoom 2 bakes most of the city again: free the last step's canvases first
  if (zq < 2 && c.lastZq !== undefined && Math.abs(zq - c.lastZq) > 1e-9) c.win.__purge();
  c.lastZq = zq;
  seekSafe(c, n, {z: zq, cx: cam.cx, cy: cam.cy});
  const sw = 1080 * zq / cam.z;
  ctx.save(); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(c.win.SF.app.cv, 960 - sw / 2, 540 - sw / 2, sw, sw, 0, 0, 1080, 1080);
  ctx.restore();
}

/* The season wipe, as the page does it when S is pressed (engine/90_app.js, drawWipe): the new season is drawn, and the
   old season's last frame is kept where the brush has not reached yet. The edge runs across the frame at right angles
   to the sweep, ragged with two octaves of noise and feathered in three steps, over WIPE_S seconds. */
export const WIPE_S = 1.3;
export async function paintWipe(vOld, nOld, vNew, n, cam, ctx, k) {
  await paint(vNew, n, cam, ctx);
  if (k >= WIPE_S) return;
  const c = await load(vOld), w = c.win;
  seekSafe(c, nOld, cam);
  const W = 1920, H = 1080, u = Math.max(0, k) / WIPE_S, e = u < 0.5 ? 2 * u * u : 1 - 2 * (1 - u) * (1 - u);
  const nx = 0.83, ny = 0.56, span = W * nx + H * ny, A = 0.045 * span, F = 0.06 * span, sc = W / 1920;
  const s0 = -W * ny, s1 = H * nx, cc = -A - F + (span + 2 * A + 2 * F) * e;
  const edge = (off) => {
    const p = new Path2D(), N = 48;
    for (let i = 0; i <= N; i++) {
      const t = s0 + (s1 - s0) * i / N, d = cc + off + A * (w.vnoise(t / (150 * sc), 71) + 0.45 * w.vnoise(t / (40 * sc), 72));
      const x = d * nx - t * ny - X0, y = d * ny + t * nx; if (i) p.lineTo(x, y); else p.moveTo(x, y);
    }
    const far = cc + off + span * 2;
    p.lineTo(far * nx - s1 * ny - X0, far * ny + s1 * nx); p.lineTo(far * nx - s0 * ny - X0, far * ny + s0 * nx); p.closePath();
    return p;
  };
  for (const [off, a] of [[0, 1 / 3], [F / 2, 1 / 2], [F, 1]]) {
    ctx.save(); ctx.clip(edge(off)); ctx.globalAlpha = a;
    ctx.drawImage(w.SF.app.cv, X0, 0, 1080, 1080, 0, 0, 1080, 1080);
    ctx.restore();
  }
}

/** A zoom from camera A to camera B at eased progress u (0..1): the zoom goes evenly in log scale, and the centre moves
    so that the target comes towards the middle as the view closes in on it (as a wheel zoom on a point feels). */
export function zoomCam(A, B, u) {
  const z = A.z * Math.pow(B.z / A.z, u);
  const w = Math.abs(1 / A.z - 1 / B.z) < 1e-9 ? u : (1 / A.z - 1 / z) / (1 / A.z - 1 / B.z);
  return {z, cx: A.cx + (B.cx - A.cx) * w, cy: A.cy + (B.cy - A.cy) * w};
}
