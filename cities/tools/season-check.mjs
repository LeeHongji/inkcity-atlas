// Seasons check for one city.
//   node cities/tools/season-check.mjs <slug> base        save the city's own season, by day and at night, before any edit
//   node cities/tools/season-check.mjs <slug> [season]    1) the city's own season by day and at night: identical to the base
//                                                          2) built again: another season, then its own again, on one page:
//                                                             identical to the base (a rebuild leaves nothing behind)
//                                                          3) the season (default: every other one the city has), by day
//                                                             and at night: out/season/<season>/<view>.png, sheet.jpg
//                                                          4) frame timings of the rebuild (S key path) on a live page
// Views: the wide view, and every place's shot (its own camera, 40 frames in). Frozen ?f=0 pages, 1920 x 1080.
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
const here = path.dirname(fileURLToPath(import.meta.url));
process.env.PLAYWRIGHT_FROM = process.env.PLAYWRIGHT_FROM || path.join(here, '../../film');
const { playwright } = await import('../../skill/inkcity/scripts/_pw.mjs');
const [slug, arg] = process.argv.slice(2);
const city = path.join(here, '..', slug || '');
if (!slug || !fs.existsSync(path.join(city, 'dev.html'))) { console.error('usage: node cities/tools/season-check.mjs <slug> [base|season]'); process.exit(2); }
const out = path.join(city, 'out/season'), base = path.join(out, 'base');
fs.mkdirSync(base, { recursive: true });
const FF = process.env.FFMPEG || '/opt/homebrew/bin/ffmpeg';
const { chromium } = playwright();
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--allow-file-access-from-files'] });
let fails = 0;
const open = async (q) => {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto('file://' + path.join(city, 'dev.html') + '?f=0' + q);
  await page.waitForFunction('window.__ready || window.__err', null, { timeout: 120000 });
  const err = await page.evaluate(() => window.__err || '');
  if (err || errs.length) { console.log('PAGE ERRORS', q, err, errs.join(' | ')); fails++; }
  return page;
};
const grab = (page, v) => page.evaluate(async (v) => { SF.seek(v.n, v.cam); return SF.app.cv.toDataURL('image/png'); }, v);
const png = (u) => Buffer.from(u.slice(22), 'base64');
try {
  const p0 = await open('');
  const views = await p0.evaluate(() => {
    const v = [{ name: 'wide', n: Math.min(1300, SCENE.frames - 30), cam: SF.wide }];
    for (const s of SCENE.shots) if (s.z > 1.5 && s.name !== 'centre') v.push({ name: s.name, n: s.a + 40, cam: { z: s.z, cx: s.cx, cy: s.cy } });
    return v;
  });
  const info = await p0.evaluate(() => ({ own: SCENE.season || null, seasons: SCENE.seasons || [] }));
  if (arg === 'base') {
    for (const night of [false, true]) {
      const p = night ? await open('&night') : p0;
      for (const v of views) fs.writeFileSync(path.join(base, (night ? 'night-' : 'day-') + v.name + '.png'), png(await grab(p, v)));
      if (night) await p.close();
    }
    console.log('base saved:', views.length * 2, 'frames in', path.relative(process.cwd(), base));
  } else {
    const same = (label, a, file) => {
      const ok = fs.existsSync(file) && Buffer.compare(png(a), fs.readFileSync(file)) === 0;
      if (!ok) { fails++; fs.writeFileSync(file.replace(/\.png$/, '.now.png'), png(a)); }
      return ok;
    };
    // 1) the city's own season, untouched
    for (const night of [false, true]) {
      const p = night ? await open('&night') : p0, bad = [];
      for (const v of views) if (!same('', await grab(p, v), path.join(base, (night ? 'night-' : 'day-') + v.name + '.png'))) bad.push(v.name);
      console.log((night ? 'night' : 'day  '), 'own season vs base:', bad.length ? 'FAIL ' + bad.join(' ') : 'PASS (' + views.length + ' views identical)');
      if (night) await p.close();
    }
    const others = arg ? [arg] : info.seasons.filter((s) => s !== info.own);
    // 2) built again: other seasons and back
    if (others.length) {
      const p = await open('&night'), bad = [];
      for (const s of others) await p.evaluate((s) => SF.setLook({ season: s }), s);
      await p.evaluate((s) => SF.setLook({ season: s }), info.own);
      for (const v of views) if (!same('', await grab(p, v), path.join(base, 'night-' + v.name + '.png'))) bad.push(v.name);
      console.log('night after', others.join(', '), 'and back:', bad.length ? 'FAIL ' + bad.join(' ') : 'PASS (identical to a fresh page)');
      await p.close();
    }
    // 3) each other season, by day and at night
    for (const s of others) {
      const dir = path.join(out, s); fs.mkdirSync(dir, { recursive: true });
      for (const night of [false, true]) {
        const p = await open('&season=' + s + (night ? '&night' : ''));
        for (const v of views) fs.writeFileSync(path.join(dir, (night ? 'night-' : 'day-') + v.name + '.png'), png(await grab(p, v)));
        await p.close();
      }
      const list = views.flatMap((v) => ['day-' + v.name, 'night-' + v.name]);
      const args = ['-y', '-loglevel', 'error']; for (const n of list) args.push('-i', path.join(dir, n + '.png'));
      const cols = 2, rows = Math.ceil(list.length / cols);
      args.push('-filter_complex', list.map((_, i) => `[${i}]scale=960:540[s${i}]`).join(';') + ';' + list.map((_, i) => `[s${i}]`).join('') + `xstack=inputs=${list.length}:layout=` + list.map((_, i) => `${(i % cols) * 960}_${Math.floor(i / cols) * 540}`).join('|') + `[o]`, '-map', '[o]', '-q:v', '3', path.join(dir, 'sheet.jpg'));
      if (rows) execFileSync(FF, args);
      console.log(s + ':', views.length * 2, 'frames and sheet.jpg in', path.relative(process.cwd(), dir));
    }
    // 4) the switch on a live page: how long the rebuild takes
    if (others.length) {
      const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
      await page.goto('file://' + path.join(city, 'dev.html'));
      await page.waitForFunction('window.__baked', null, { timeout: 120000 });
      await page.waitForTimeout(4000);
      const ms = await page.evaluate((s) => { const t = performance.now(); SF.setLook({ season: s }); return performance.now() - t; }, others[0]);
      const frames = await page.evaluate(() => new Promise((res) => { const d = [], t0 = performance.now(); let l = t0; const f = (n) => { d.push(n - l); l = n; if (n - t0 < 2000) requestAnimationFrame(f); else res(d); }; requestAnimationFrame(f); }));
      frames.sort((a, b) => a - b);
      console.log(`switch to ${others[0]}: rebuild ${ms.toFixed(0)} ms, then wipe frames p95 ${frames[Math.floor(frames.length * 0.95)].toFixed(1)} ms, max ${frames[frames.length - 1].toFixed(1)} ms`);
      await page.close();
    }
  }
} finally { await browser.close(); }
if (fails) { console.log(fails, 'check(s) failed'); process.exit(1); }
