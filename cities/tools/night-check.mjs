// Night pass check for one city (see cities/BRIEF-NIGHT.md).
//   node cities/tools/night-check.mjs <slug> base   save the day frames the night pass must not change
//   node cities/tools/night-check.mjs <slug>        1) the day frames again: each must be identical to its base
//                                                    2) the same views at night: out/night/<view>.png and sheet.jpg
//                                                    3) the lights the engine found, by kind
// Views: the wide view, and every place's shot (its own camera, 40 frames in). Frozen ?f=0 pages, 1920 x 1080.
// Playwright comes from film/node_modules (or PLAYWRIGHT_FROM).
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const here = path.dirname(fileURLToPath(import.meta.url));
process.env.PLAYWRIGHT_FROM = process.env.PLAYWRIGHT_FROM || path.join(here, '../../film');
const { playwright } = await import('../../skill/inkcity/scripts/_pw.mjs');
const [slug, mode] = process.argv.slice(2);
const city = path.join(here, '..', slug || '');
if (!slug || !fs.existsSync(path.join(city, 'dev.html'))) { console.error('usage: node cities/tools/night-check.mjs <slug> [base]'); process.exit(2); }
const out = path.join(city, 'out/night'), base = path.join(out, 'base');
fs.mkdirSync(base, { recursive: true });
const { chromium } = playwright();
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--allow-file-access-from-files'] });
let fails = 0;
try {
  const open = async (night) => {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    const errs = []; page.on('pageerror', (e) => errs.push(e.message));
    // NIGHT_BASE_PAGE: save the base from another page of this city (e.g. the last committed index.html)
    const pg = !night && mode === 'base' && process.env.NIGHT_BASE_PAGE ? path.resolve(process.env.NIGHT_BASE_PAGE) : path.join(city, 'dev.html');
    await page.goto('file://' + pg + '?f=0' + (night ? '&night' : ''));
    await page.waitForFunction('window.__ready || window.__err', null, { timeout: 120000 });
    const err = await page.evaluate(() => window.__err || '');
    if (err || errs.length) { console.log('PAGE ERRORS', err, errs.join(' | ')); fails++; }
    return page;
  };
  // the views: wide, then each place's shot
  const day = await open(false);
  const views = await day.evaluate(() => {
    const v = [{ name: 'wide', n: Math.min(1300, SCENE.frames - 30), cam: SF.wide }];
    for (const s of SCENE.shots) if (s.z > 1.5 && s.name !== 'centre') v.push({ name: s.name, n: s.a + 40, cam: { z: s.z, cx: s.cx, cy: s.cy } });
    return v;
  });
  if (mode === 'base') {
    for (const v of views) {
      const url = await day.evaluate(([n, cam]) => { SF.seek(n, cam); return SF.app.cv.toDataURL('image/png'); }, [v.n, v.cam]);
      fs.writeFileSync(path.join(base, v.name + '.png'), Buffer.from(url.slice(22), 'base64'));
    }
    console.log(slug + ': ' + views.length + ' day frames saved to ' + path.relative(process.cwd(), base));
  } else {
    // 1) the day must not change
    for (const v of views) {
      const f = path.join(base, v.name + '.png');
      if (!fs.existsSync(f)) { console.log('no base for ' + v.name + ': run with `base` first (before any edit)'); fails++; continue; }
      const diff = await day.evaluate(async ([n, cam, src]) => {
        SF.seek(n, cam);
        const img = new Image(); img.src = src; await img.decode();
        const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const x = c.getContext('2d'); x.drawImage(img, 0, 0);
        const a = x.getImageData(0, 0, c.width, c.height).data, b = SF.app.ctx.getImageData(0, 0, c.width, c.height).data;
        let d = 0; for (let i = 0; i < a.length; i += 4) if (a[i] !== b[i] || a[i + 1] !== b[i + 1] || a[i + 2] !== b[i + 2]) d++;
        return d;
      }, [v.n, v.cam, 'file://' + f]);
      console.log((diff ? 'FAIL ' : 'PASS ') + 'day ' + v.name + (diff ? ': ' + diff + ' pixels changed' : ': identical'));
      if (diff) fails++;
    }
    // 2) night: every view, and a contact sheet
    const night = await open(true);
    const files = [];
    for (const v of views) {
      const url = await night.evaluate(([n, cam]) => { SF.seek(n, cam); return SF.app.cv.toDataURL('image/png'); }, [v.n, v.cam]);
      const f = path.join(out, v.name + '.png'); fs.writeFileSync(f, Buffer.from(url.slice(22), 'base64')); files.push(f);
    }
    const sheet = await night.evaluate(async (srcs) => {
      const cols = 3, w = 640, h = 360, c = document.createElement('canvas'); c.width = cols * w; c.height = Math.ceil(srcs.length / cols) * h;
      const x = c.getContext('2d');
      for (let i = 0; i < srcs.length; i++) { const img = new Image(); img.src = srcs[i]; await img.decode(); x.drawImage(img, (i % cols) * w, Math.floor(i / cols) * h, w, h); }
      return c.toDataURL('image/jpeg', 0.88);
    }, files.map((f) => 'file://' + f));
    fs.writeFileSync(path.join(out, 'sheet.jpg'), Buffer.from(sheet.slice(23), 'base64'));
    // 3) what lights the engine found
    const counts = await night.evaluate(() => {
      const by = {}; for (const e of SF.R.lights || []) { const k = e.k + (e.rx != null ? '+water' : ''); by[k] = (by[k] || 0) + 1; }
      return { lights: (SF.R.lights || []).length, by, litWindows: (SF.R.wins || []).length, glowCells: (SF.R.amb || []).length };
    });
    console.log('night views: ' + path.relative(process.cwd(), out) + '/<view>.png and sheet.jpg (' + views.map((v) => v.name).join(', ') + ')');
    console.log('lights: ' + JSON.stringify(counts));
  }
} finally { await browser.close(); }
console.log(fails ? fails + ' problem(s)' : 'ok');
process.exit(fails ? 1 : 0);
