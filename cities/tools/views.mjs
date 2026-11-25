// Stills of a city: the wide view and every place's shot (its own camera, 40 frames in), from the dev page.
//   node cities/tools/views.mjs <slug> <out-dir> [query] [view,view,...]
// query: extra page query, e.g. '&night' or '&season=autumn'. Views: names of SCENE.shots (and 'wide'); default all.
// Also writes <out-dir>/sheet.jpg (all views, 4 across). Page errors are printed and exit with code 1.
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
const here = path.dirname(fileURLToPath(import.meta.url));
process.env.PLAYWRIGHT_FROM = process.env.PLAYWRIGHT_FROM || path.join(here, '../../film');
const { playwright } = await import('../../skill/inkcity/scripts/_pw.mjs');
const [slug, outDir, q = '', only = ''] = process.argv.slice(2);
const city = path.join(here, '..', slug || '');
if (!slug || !outDir || !fs.existsSync(path.join(city, 'dev.html'))) { console.error('usage: node cities/tools/views.mjs <slug> <out-dir> [query] [views]'); process.exit(2); }
fs.mkdirSync(outDir, { recursive: true });
const FF = process.env.FFMPEG || '/opt/homebrew/bin/ffmpeg';
const { chromium } = playwright();
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--allow-file-access-from-files'] });
let bad = 0;
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto('file://' + path.join(city, 'dev.html') + '?f=0' + q);
  await page.waitForFunction('window.__ready || window.__err', null, { timeout: 180000 });
  const err = await page.evaluate(() => window.__err || '');
  if (err || errs.length) { console.log('PAGE ERRORS:', err, errs.join(' | ')); bad = 1; }
  let views = await page.evaluate(() => {
    const v = [{ name: 'wide', n: Math.min(1300, SCENE.frames - 30), cam: SF.wide }];
    for (const s of SCENE.shots) if (s.z > 1.5 && s.name !== 'centre') v.push({ name: s.name, n: s.a + 40, cam: { z: s.z, cx: s.cx, cy: s.cy } });
    return v;
  });
  if (only) { const w = only.split(','); views = views.filter((v) => w.includes(v.name)); }
  const files = [];
  for (const v of views) {
    const u = await page.evaluate(async (v) => { SF.seek(v.n, v.cam); return SF.app.cv.toDataURL('image/png'); }, v);
    const f = path.join(outDir, v.name + '.png'); fs.writeFileSync(f, Buffer.from(u.slice(22), 'base64')); files.push(f);
  }
  if (errs.length) { console.log('PAGE ERRORS:', errs.join(' | ')); bad = 1; }
  if (files.length > 1) {
    const cols = Math.min(4, files.length), rows = Math.ceil(files.length / cols);
    const args = []; for (const f of files) args.push('-i', f);
    const fl = files.map((_, i) => `[${i}:v]scale=640:-1[s${i}]`).join(';') + ';' + files.map((_, i) => `[s${i}]`).join('') + `xstack=inputs=${files.length}:layout=` + files.map((_, i) => `${(i % cols) * 640}_${Math.floor(i / cols) * 360}`).join('|') + (files.length < cols * rows ? ':fill=white' : '');
    execFileSync(FF, ['-v', 'error', '-y', ...args, '-filter_complex', fl, '-q:v', '3', path.join(outDir, 'sheet.jpg')]);
  }
  console.log(views.length, 'views in', outDir);
} finally { await browser.close(); }
process.exit(bad);
