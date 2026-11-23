// The twelve tiles of the grid shot: each city page's own wide view, by day and at night (?night), the same frame, with
// the paper taken out so the twelve sit on one sheet that turns to night with them.
//   node tools/grid-images.mjs   -> public/clips/grid/<slug>-day.png and <slug>-night.png (624 x 352, shown at 312 x 176)
// The paper comes out by drawing the frame twice, once on black paper and once on white (the engine fills its paper from
// one pattern, R.tex.paper / paperN): what changes between the two is paper showing through, so
//   alpha = 1 - (white - black) / 255,   colour = black / alpha.
// Night glow over bare paper comes out as a pale, part-transparent light, which lies over the film's night paper as it
// lay over the page's.
import {chromium} from 'playwright';
import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
const FILM = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const CITIES = ['tokyo', 'paris', 'newyork', 'london', 'barcelona', 'venice', 'lisbon', 'istanbul', 'rio', 'beijing', 'hongkong', 'chongqing'];
const only = process.argv.slice(2);
const out = path.join(FILM, 'public/clips/grid');
await mkdir(out, {recursive: true});
const browser = await chromium.launch({channel: 'chrome', headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist']});
try {
  for (const slug of only.length ? only : CITIES) for (const night of [false, true]) {
    const page = await browser.newPage({viewport: {width: 1920, height: 1080}});
    await page.goto('file://' + path.resolve(FILM, `../cities/${slug}/index.html`) + '?f=0' + (night ? '&night' : ''));
    await page.waitForFunction('window.__ready', null, {timeout: 120000});
    const url = await page.evaluate(() => {
      const e = SF.extent(), cam = {z: Math.min(1920 * 0.94 / (e[2] - e[0]), 1080 * 0.9 / (e[3] - e[1])), cx: (e[0] + e[2]) / 2, cy: (e[1] + e[3]) / 2};
      const n = Math.min(1300, SCENE.frames - 60), W = 624, H = 352, R = SF.R, key = LOOK.night ? 'paperN' : 'paper';
      const draw = (v) => {
        const p = document.createElement('canvas'); p.width = p.height = 512; const px = p.getContext('2d');
        px.fillStyle = `rgb(${v},${v},${v})`; px.fillRect(0, 0, 512, 512);
        R.tex[key] = p; R.paperPat = null; R.paperPatN = null;
        SF.seek(n, cam);
        const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
        x.imageSmoothingQuality = 'high'; x.drawImage(SF.app.cv, 0, 0, 1920, 1080, 0, 0, W, H);
        return x.getImageData(0, 0, W, H);
      };
      const b = draw(0), w = draw(255), o = new ImageData(W, H);
      for (let i = 0; i < b.data.length; i += 4) {
        const a = 1 - ((w.data[i] - b.data[i]) + (w.data[i + 1] - b.data[i + 1]) + (w.data[i + 2] - b.data[i + 2])) / 765;
        if (a <= 0.004) continue;
        const k = Math.min(1, a);
        o.data[i] = Math.min(255, b.data[i] / k); o.data[i + 1] = Math.min(255, b.data[i + 1] / k); o.data[i + 2] = Math.min(255, b.data[i + 2] / k);
        o.data[i + 3] = Math.round(k * 255);
      }
      const c = document.createElement('canvas'); c.width = W; c.height = H; c.getContext('2d').putImageData(o, 0, 0);
      return c.toDataURL('image/png');
    });
    await writeFile(path.join(out, `${slug}-${night ? 'night' : 'day'}.png`), Buffer.from(url.slice(22), 'base64'));
    await page.close();
  }
  console.log((only.length || 12) + ' x 2 tiles in public/clips/grid');
} finally { await browser.close(); }
