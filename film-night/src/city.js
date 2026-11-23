// The real city pages, used as renderers. Each runs in a hidden same-origin iframe in ?f=0 mode (and ?night for its
// night), where SF.seek(n, cam) draws film frame n at any camera from nothing (the call the skill's record.mjs makes).
// A shot copies the middle 1080 x 1080 of that 1920 x 1080 canvas into its own square canvas.
const pool = new Map();
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
export const key = (slug, night) => slug + (night ? ':night' : ':day');
const page = (slug, night) => `/atlas/cities/${slug}/index.html?f=0${night ? '&night' : ''}`;

export function load(slug, night) {
  const k = key(slug, night);
  let c = pool.get(k);
  if (c) return c.ready;
  const f = document.createElement('iframe');
  f.setAttribute('aria-hidden', 'true'); f.tabIndex = -1;
  f.style.cssText = 'position:fixed;left:0;top:0;width:1920px;height:1080px;border:0;opacity:0;pointer-events:none;z-index:-1';
  f.src = page(slug, night);
  document.body.appendChild(f);
  c = { f, win: null };
  c.ready = (async () => {
    for (let i = 0; i < 2400; i++) {
      const w = f.contentWindow;
      if (w && w.__ready && w.SF && w.SF.seek) {
        // the page's own frame at night with its light-up clock (lightT, seconds since night fell): the wave of lamps
        if (night) w.eval('window.__drawLit = function (n, cam, lt) { const cv = SF.app.cv, v = mkView(cam, cv.width, cv.height, true); ensureBakes(v, true); SF.draw(SF.app.ctx, v, n / FPS, { allLive: true, phase: boilPhase(shotAt(n)), lightT: lt }); reap(true); };');
        c.win = w; return c;
      }
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

/** Draw film frame n of a city at camera cam into ctx (the middle square of the page's frame).
    o.night: the night page; o.lightT: draw the night as it falls (seconds since the switch); o.alpha: over what is there. */
export async function paint(slug, n, cam, ctx, o = {}) {
  const c = await load(slug, !!o.night);
  if (o.lightT != null) c.win.__drawLit(n, cam, o.lightT);
  else c.win.SF.seek(Math.max(0, Math.round(n)), cam || undefined);
  ctx.save(); ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
  ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(c.win.SF.app.cv, 420, 0, 1080, 1080, 0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.restore();
}

/** A shot's camera by name, from the page's own film script. */
export async function shotCam(slug, name, night) {
  const c = await load(slug, !!night);
  const s = c.win.eval('SHOTS').find((q) => q.name === name);
  if (!s) throw new Error(`${slug}: no shot ${name}`);
  return { z: s.z, cx: s.cx, cy: s.cy, a: s.a };
}
