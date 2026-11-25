// Close-ups of one tile for checking what stands in front of what: the tile cut into quarters, each filling a 1920 x 1080
// frame, at a few moments of the film (people move, so overlaps come and go).
//   node cities/tools/depth-views.mjs <slug> <tile> <out-dir> [frames=520,700,880] [query]
// Writes <tile>-<frame>-q<0..3>.png (quarters, left to right, top to bottom) and <tile>-<frame>-all.png.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const here = path.dirname(fileURLToPath(import.meta.url));
process.env.PLAYWRIGHT_FROM = process.env.PLAYWRIGHT_FROM || path.join(here, '../../film');
const { playwright } = await import('../../skill/inkcity/scripts/_pw.mjs');
const [slug, tile, out, fr = '520,700,880', q = ''] = process.argv.slice(2);
if (!slug || !tile || !out) { console.error('usage: node cities/tools/depth-views.mjs <slug> <tile> <out-dir> [frames] [query]'); process.exit(2); }
fs.mkdirSync(out, { recursive: true });
const { chromium } = playwright();
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--allow-file-access-from-files'] });
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto('file://' + path.join(here, '..', slug, 'dev.html') + '?f=0' + q);
  await page.waitForFunction('window.__ready || window.__err', null, { timeout: 180000 });
  const cams = await page.evaluate((name) => {
    const t = SF.tiles.find((x) => x.name === name); if (!t) return null;
    const [x0, y0, x1, y1] = t.bb, w = x1 - x0, h = y1 - y0, c = [];
    c.push({ k: 'all', z: Math.min(1920 / w, 1080 / h) * 0.95, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 });
    for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) c.push({ k: 'q' + (j * 2 + i), z: Math.min(1920 / (w / 2), 1080 / (h / 2)) * 0.9, cx: x0 + w * (0.25 + 0.5 * i), cy: y0 + h * (0.25 + 0.5 * j) });
    return c;
  }, tile);
  if (!cams) { console.error('no tile', tile); process.exit(2); }
  for (const n of fr.split(',').map(Number)) for (const c of cams) {
    const u = await page.evaluate(([n, c]) => { SF.seek(n, { z: c.z, cx: c.cx, cy: c.cy }); return SF.app.cv.toDataURL('image/png'); }, [n, c]);
    fs.writeFileSync(path.join(out, `${tile}-${n}-${c.k}.png`), Buffer.from(u.slice(22), 'base64'));
  }
  console.log('views in', out, errs.length ? 'PAGE ERRORS: ' + errs.join(' | ') : '');
} finally { await browser.close(); }
