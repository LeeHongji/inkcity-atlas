// Close-ups for checking what stands in front of what: one tile cut into quarters, each filling a 1920 x 1080 frame, at
// a few moments of the film (people move, so overlaps come and go). See references/depth.md.
// usage: node depth-views.mjs <page.html> <tile> <out-dir> [frames=a,b,c] [query]
// Writes <tile>-<frame>-all.png and <tile>-<frame>-q0..q3.png (quarters left to right, top to bottom).
import fs from 'fs';
import path from 'path';
import { withBrowser, url, pageArg } from './_pw.mjs';
const page_ = pageArg(), [tile, out, fr = '', q = ''] = process.argv.slice(3);
if (!tile || !out) { console.error('usage: node depth-views.mjs <page.html> <tile> <out-dir> [frames] [query]'); process.exit(2); }
fs.mkdirSync(out, { recursive: true });
await withBrowser(async (browser) => {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(url(page_, ['f=0', q].filter(Boolean).join('&')));
  await page.waitForFunction('window.__ready || window.__err', null, { timeout: 180000 });
  const info = await page.evaluate((name) => {
    const t = SF.tiles.find((x) => x.name === name); if (!t) return null;
    const [x0, y0, x1, y1] = t.bb, w = x1 - x0, h = y1 - y0, c = [{ k: 'all', z: Math.min(1920 / w, 1080 / h) * 0.95, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 }];
    for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) c.push({ k: 'q' + (j * 2 + i), z: Math.min(1920 / (w / 2), 1080 / (h / 2)) * 0.9, cx: x0 + w * (0.25 + 0.5 * i), cy: y0 + h * (0.25 + 0.5 * j) });
    const F = SCENE.frames, last = (SCENE.fade ? SCENE.fade[0] : F) - 10;
    return { cams: c, frames: [Math.round(last * 0.55), Math.round(last * 0.72), Math.round(last * 0.9)] };
  }, tile);
  if (!info) { console.error('no tile named', tile); process.exit(2); }
  const frames = fr ? fr.split(',').map(Number) : info.frames;
  for (const n of frames) for (const c of info.cams) {
    const u = await page.evaluate(([n, c]) => { SF.seek(n, { z: c.z, cx: c.cx, cy: c.cy }); return SF.app.cv.toDataURL('image/png'); }, [n, c]);
    fs.writeFileSync(path.join(out, `${tile}-${n}-${c.k}.png`), Buffer.from(u.slice(22), 'base64'));
  }
  console.log(frames.length * info.cams.length, 'views in', out, errs.length ? 'PAGE ERRORS: ' + errs.join(' | ') : '');
});
