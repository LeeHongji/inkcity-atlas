// Pictures of every city for posting: the whole city drawn by its own page in ?f=0 mode at 2x (3840 x 2160),
// after the build with its people out. 16:9, the shape X shows uncropped on its own and in a four-picture grid.
// Writes PNGs; tools/city-sheet.mjs turns them into JPEGs for X and lays out the twelve-city sheet.
//   node tools/city-images.mjs <out-dir>
import {chromium} from 'playwright';
import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';

const FILM = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const out = path.resolve(process.argv[2] || path.join(FILM, 'renders/city-images'));
const SLUGS = ['tokyo', 'paris', 'newyork', 'london', 'barcelona', 'venice', 'lisbon', 'istanbul', 'rio', 'beijing', 'hongkong', 'chongqing'];
const LIFE = 75;                                   // frames after the build hands over: the people are out and about

await mkdir(out, {recursive: true});
const browser = await chromium.launch({channel: 'chrome', headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist']});
try {
  for (const [i, slug] of SLUGS.entries()) {
    const page = await browser.newPage({viewport: {width: 1920, height: 1080}});
    const errs = []; page.on('pageerror', e => errs.push(e.message));
    await page.goto('file://' + path.resolve(FILM, `../cities/${slug}/index.html`) + '?f=0');
    await page.waitForFunction('window.__ready', null, {timeout: 120000});
    const shots = await page.evaluate(life => {
      const cv = SF.app.cv; cv.width = 3840; cv.height = 2160;          // the engine composes for 1920 x 1080 and fits the canvas
      const e = SF.extent(), ew = e[2] - e[0], eh = e[3] - e[1], cx = (e[0] + e[2]) / 2, cy = (e[1] + e[3]) / 2;
      const n = Math.round((SHOTS[1] ? SHOTS[1].a : 180) + life);
      SF.seek(n, {z: Math.min(1920 * 0.92 / ew, 1080 * 0.88 / eh), cx, cy});   // the whole city with a margin of paper
      return {n, wide: cv.toDataURL('image/png').slice(22)};
    }, LIFE);
    const name = `${String(i + 1).padStart(2, '0')}-${slug}`;
    await writeFile(path.join(out, `${name}.png`), Buffer.from(shots.wide, 'base64'));
    await page.close();
    console.log(`${name}: frame ${shots.n}${errs.length ? '  ERRORS ' + errs.join(' | ') : ''}`);
  }
} finally { await browser.close(); }
