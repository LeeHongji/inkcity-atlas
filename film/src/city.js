// The real city pages, used as renderers. Each runs in a hidden same-origin iframe in ?f=0 mode, where
// SF.seek(n, cam) draws film frame n at any camera, from nothing (the call the skill's record.mjs makes).
// A shot copies that canvas into its own <canvas>, so one page can feed several shots and sizes.
import {SQ} from './format.js';
const pool = new Map();
const wait = ms => new Promise(r => setTimeout(r, ms));
const page = slug => slug === 'starter' ? '/starter.html?f=0' : `/atlas/cities/${slug}/index.html?f=0`;

export function load(slug) {
  let c = pool.get(slug);
  if (c) return c.ready;
  const f = document.createElement('iframe');
  f.setAttribute('aria-hidden', 'true'); f.tabIndex = -1;
  f.style.cssText = 'position:fixed;left:0;top:0;width:1920px;height:1080px;border:0;opacity:0;pointer-events:none;z-index:-1';
  f.src = page(slug);
  document.body.appendChild(f);
  c = {f, win: null};
  c.ready = (async () => {
    for (let i = 0; i < 2400; i++) {
      const w = f.contentWindow;
      if (w && w.__ready && w.SF && w.SF.seek) { c.win = w; return c; }
      await wait(50);
    }
    throw new Error('city page did not load: ' + slug);
  })();
  pool.set(slug, c);
  return c.ready;
}

/** Drop every page not in `keep` (a Set of slugs): twelve engines at once is the most this film holds. */
export function release(keep) {
  for (const [slug, c] of pool) if (!keep.has(slug)) { c.f.remove(); pool.delete(slug); }
}

/** The page's own scene data (SHOTS, SCENE, SF) once loaded. */
export const page$ = slug => pool.get(slug)?.win || null;

/** Draw film frame n of a city at camera cam ({z,cx,cy} in wide px; null = the film's own camera) into ctx.
    The square cut takes the middle 1080 x 1080 of the picture, so the camera's centre stays the frame's centre. */
export async function paint(slug, n, cam, ctx, dx = 0, dy = 0, dw = ctx.canvas.width, dh = ctx.canvas.height, sx = SQ ? 420 : 0, sy = 0, sw = SQ ? 1080 : 1920, sh = 1080) {
  const c = await load(slug);
  c.win.SF.seek(Math.max(0, Math.round(n)), cam || undefined);
  ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(c.win.SF.app.cv, sx, sy, sw, sh, dx, dy, dw, dh);
}

/** A shot's camera by name, from the page's own film script. */
export async function shotCam(slug, name) {
  const c = await load(slug);
  const s = c.win.eval('SHOTS').find(s => s.name === name);
  if (!s) throw new Error(`${slug}: no shot ${name}`);
  return {z: s.z, cx: s.cx, cy: s.cy};
}

/** Wide px of a world point (the guide's `at`), and where it lands on screen for a camera. */
export async function screenOf(slug, at, cam) {
  const c = await load(slug);
  const [wx, wy] = c.win.SF.prj(at[0], at[1], at[2] || 0);
  return [(wx - cam.cx) * cam.z + 960, (wy - cam.cy) * cam.z + 540];
}
