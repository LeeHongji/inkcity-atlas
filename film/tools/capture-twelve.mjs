// Draws the twelve Polaroid photos of the "twelve" shot ahead of time, one city at a time: twelve live engines in
// one tab run out of memory. Each city page in ?f=0 mode draws film frame n at its own opening camera (SF.seek),
// cropped a little as the gallery does and scaled into the photo, for every frame of the shot.
//   node tools/capture-twelve.mjs  -> public/clips/twelve/<slug>/0000.jpg ... and public/clips/twelve.json
import {chromium} from 'playwright';
import {mkdir, rm, writeFile, readFile} from 'node:fs/promises';
import path from 'node:path';

const FILM = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const plan = JSON.parse(await readFile(path.join(FILM, 'plan.json'), 'utf8'));
const shot = plan.shots.find(s => s.id === 'twelve');
const FRAMES = Math.round((shot.end - shot.start) * plan.fps);
const SLUGS = ['tokyo', 'paris', 'newyork', 'london', 'barcelona', 'venice', 'lisbon', 'istanbul', 'rio', 'beijing', 'hongkong', 'chongqing'];
const IMG = [272, 170];                                    // the photo on screen (16:10), 1:1 in the film
const ZOOM = 1.12;                                         // crop the paper margins a little, as the gallery does
// all twelve draw themselves together: the build (frames 0..175) over 0.45..3.3 s, then life at 1x
const frameAt = l => l < 0.45 ? 0 : l < 3.3 ? (l - 0.45) / 2.85 * 175 : 175 + (l - 3.3) * 30;

const out = path.join(FILM, 'public/clips/twelve');
await rm(out, {recursive: true, force: true});
const browser = await chromium.launch({channel: 'chrome', headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist']});
try {
  for (const slug of SLUGS) {
    const t0 = Date.now();
    await mkdir(path.join(out, slug), {recursive: true});
    const page = await browser.newPage({viewport: {width: 1920, height: 1080}, deviceScaleFactor: 1});
    const errs = []; page.on('pageerror', e => errs.push(e.message));
    await page.goto('file://' + path.resolve(FILM, `../cities/${slug}/index.html`) + '?f=0');
    await page.waitForFunction('window.__ready', null, {timeout: 120000});
    for (let i = 0; i < FRAMES; i++) {
      const b64 = await page.evaluate(([n, W, H, Z]) => {
        const s0 = SHOTS[0];                               // the page's own opening camera
        SF.seek(Math.round(n), {z: s0.z, cx: s0.cx, cy: s0.cy});
        const c = window.__photo || (window.__photo = Object.assign(document.createElement('canvas'), {width: W, height: H}));
        const g = c.getContext('2d'); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
        const sw = 1920 / Z, sh = sw * H / W;
        g.drawImage(SF.app.cv, (1920 - sw) / 2, (1080 - sh) / 2 + 10, sw, sh, 0, 0, W, H);
        return c.toDataURL('image/jpeg', 0.93).slice(23);
      }, [frameAt(i / plan.fps), IMG[0], IMG[1], ZOOM]);
      await writeFile(path.join(out, slug, String(i).padStart(4, '0') + '.jpg'), Buffer.from(b64, 'base64'));
    }
    await page.close();
    console.log(`${slug}: ${FRAMES} frames in ${((Date.now() - t0) / 1000).toFixed(0)} s${errs.length ? '  ERRORS ' + errs.join(' | ') : ''}`);
  }
  await writeFile(path.join(FILM, 'public/clips/twelve.json'), JSON.stringify({fps: plan.fps, frames: FRAMES, size: IMG, slugs: SLUGS}, null, 1));
} finally { await browser.close(); }
