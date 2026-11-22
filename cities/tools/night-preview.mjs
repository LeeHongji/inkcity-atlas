// The README's day-to-night animation and the night thumbnails.
//   node cities/tools/night-preview.mjs anim <slug> <out.webp>   a city at its wide view turning from day to night, as the
//                                                                 page does it: the day fades, the lamps come on in a wave
//   node cities/tools/night-preview.mjs thumbs <out-dir>          every city's wide view at night, 640 x 360 JPEG
// Frames come from the city's own page in ?f=0 mode; cwebp and webpmux (libwebp) make the animated WebP.
import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
const here = path.dirname(fileURLToPath(import.meta.url));
process.env.PLAYWRIGHT_FROM = process.env.PLAYWRIGHT_FROM || path.join(here, '../../film');
const { playwright } = await import('../../skill/inkcity/scripts/_pw.mjs');
const CITIES = ['tokyo', 'paris', 'newyork', 'london', 'barcelona', 'venice', 'lisbon', 'istanbul', 'rio', 'beijing', 'hongkong', 'chongqing'];
const [mode, a1, a2] = process.argv.slice(2);
const { chromium } = playwright();
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
const open = async (slug, night) => {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('file://' + path.join(here, '..', slug, 'index.html') + '?f=0' + (night ? '&night' : ''));
  await page.waitForFunction('window.__ready', null, { timeout: 120000 });
  return page;
};
try {
  if (mode === 'thumbs') {
    fs.mkdirSync(a1, { recursive: true });
    for (const slug of CITIES) {
      const page = await open(slug, true);
      const url = await page.evaluate(() => {
        SF.seek(Math.min(1300, SCENE.frames - 30), SF.wide);
        const c = document.createElement('canvas'); c.width = 640; c.height = 360; const x = c.getContext('2d');
        x.imageSmoothingQuality = 'high'; x.drawImage(SF.app.cv, 0, 0, 640, 360); return c.toDataURL('image/jpeg', 0.86);
      });
      fs.writeFileSync(path.join(a1, slug + '.jpg'), Buffer.from(url.slice(23), 'base64'));
      await page.close(); console.log(slug);
    }
  } else if (mode === 'anim') {
    const slug = a1, out = path.resolve(a2), tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'night-anim-'));
    const page = await open(slug, false);
    const FR = 12, HOLD_DAY = 0.8, SWITCH = 2.2, HOLD_NIGHT = 2.6, n0 = await page.evaluate(() => Math.min(1300, SCENE.frames - 140));
    const total = Math.round((HOLD_DAY + SWITCH + HOLD_NIGHT) * FR);
    // the page's own switch, replayed on a fixed clock: the last day frame stays on top and fades, lightT drives the wave
    await page.evaluate(([n0]) => {
      window.__cam = SF.wide; SF.seek(n0, SF.wide);
      const d = document.createElement('canvas'); d.width = 1920; d.height = 1080; d.getContext('2d').drawImage(SF.app.cv, 0, 0); window.__day = d;
    }, [n0]);
    for (let k = 0; k < total; k++) {
      const s = k / FR, n = n0 + s * 30, lt = s - HOLD_DAY;
      const url = await page.evaluate(([n, lt]) => {
        const cv = SF.app.cv, ctx = SF.app.ctx;
        if (lt < 0) { SF.seek(Math.round(n), window.__cam); }
        else {
          if (!LOOK.night) SF.setLook({ night: true });
          const v = mkView(window.__cam, cv.width, cv.height, true); ensureBakes(v, true);
          SF.draw(ctx, v, n / FPS, { allLive: true, phase: 0, lightT: lt });
          const a = 1 - smooth((lt - 0.12) / 0.95);
          if (a > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; ctx.drawImage(window.__day, 0, 0); ctx.restore(); }
        }
        const c = document.createElement('canvas'); c.width = 960; c.height = 540; const x = c.getContext('2d');
        x.imageSmoothingQuality = 'high'; x.drawImage(cv, 0, 0, 960, 540); return c.toDataURL('image/png');
      }, [n, lt]);
      fs.writeFileSync(path.join(tmp, String(k).padStart(4, '0') + '.png'), Buffer.from(url.slice(22), 'base64'));
    }
    // each frame with one quantiser for the whole picture (several segments leave visible steps in the dark paper),
    // then the frames joined into one looping animation
    const frames = fs.readdirSync(tmp).filter((f) => f.endsWith('.png')).sort().map((f) => path.join(tmp, f)), args = ['-loop', '0'];
    for (const f of frames) {
      const w = f.replace(/\.png$/, '.webp');
      execFileSync('cwebp', ['-quiet', '-q', String(process.env.WEBP_Q || 74), '-m', '6', '-segments', '1', '-sns', '0', '-f', '20', '-sharp_yuv', f, '-o', w]);
      args.push('-frame', w, '+' + Math.round(1000 / FR) + '+0+0+0-b');
    }
    execFileSync('webpmux', [...args, '-o', out]);
    fs.rmSync(tmp, { recursive: true, force: true });
    console.log(out, (fs.statSync(out).size / 1048576).toFixed(2) + ' MB');
  } else { console.error('usage: night-preview.mjs anim <slug> <out.webp> | thumbs <out-dir>'); process.exitCode = 2; }
} finally { await browser.close(); }
