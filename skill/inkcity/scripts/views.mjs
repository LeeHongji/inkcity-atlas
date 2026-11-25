// Stills of a scene: the wide view and every place's shot (its own camera, 40 frames in), and a contact sheet.
// usage: node views.mjs <page.html> <out-dir> [query] [view,view,...]
//   query: extra page query ('night', 'season=winter'); views: names of SCENE.shots (and 'wide'), default all.
// Writes <out-dir>/<view>.png and sheet.jpg (if ffmpeg is on PATH or FFMPEG is set). Exits 1 on page errors.
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { withBrowser, url, pageArg } from './_pw.mjs';
const page_ = pageArg(), [outDir, q = '', only = ''] = process.argv.slice(3);
if (!outDir) { console.error('usage: node views.mjs <page.html> <out-dir> [query] [views]'); process.exit(2); }
fs.mkdirSync(outDir, { recursive: true });
let bad = 0;
await withBrowser(async (browser) => {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(url(page_, ['f=0', q].filter(Boolean).join('&')));
  await page.waitForFunction('window.__ready || window.__err', null, { timeout: 180000 });
  const err = await page.evaluate(() => window.__err || '');
  let views = await page.evaluate(() => {
    const v = [{ name: 'wide', n: Math.min(Math.round(SCENE.frames * 0.85), SCENE.frames - 30), cam: SF.wide }];
    for (const s of SCENE.shots) if (s.z > 1.5 * SF.wide.z && s.name !== 'wide') v.push({ name: s.name, n: s.a + 40, cam: { z: s.z, cx: s.cx, cy: s.cy } });
    return v;
  });
  if (only) { const w = only.split(','); views = views.filter((v) => w.includes(v.name)); }
  const files = [];
  for (const v of views) {
    const u = await page.evaluate((v) => { SF.seek(v.n, v.cam); return SF.app.cv.toDataURL('image/png'); }, v);
    const f = path.join(outDir, v.name + '.png'); fs.writeFileSync(f, Buffer.from(u.slice(22), 'base64')); files.push(f);
  }
  if (err || errs.length) { console.log('PAGE ERRORS:', err, errs.join(' | ')); bad = 1; }
  const FF = process.env.FFMPEG || 'ffmpeg';
  if (files.length > 1) try {
    const cols = Math.min(4, files.length), args = []; for (const f of files) args.push('-i', f);
    const fl = files.map((_, i) => `[${i}:v]scale=640:-1[s${i}]`).join(';') + ';' + files.map((_, i) => `[s${i}]`).join('') + `xstack=inputs=${files.length}:layout=` + files.map((_, i) => `${(i % cols) * 640}_${Math.floor(i / cols) * 360}`).join('|') + ':fill=white';
    execFileSync(FF, ['-v', 'error', '-y', ...args, '-filter_complex', fl, '-q:v', '3', path.join(outDir, 'sheet.jpg')]);
  } catch (e) { console.log('(no sheet: ffmpeg not found or failed)'); }
  console.log(views.length, 'views in', outDir);
});
process.exit(bad);
