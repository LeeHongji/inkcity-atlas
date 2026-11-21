// Screenshot the gallery page at real pixels. usage: node site/tools/snap.mjs <out.png> [width] [height] [dpr] [selector to scroll to] [hover selector]
import { withBrowser, sleep } from '../../skill/inkcity/scripts/_pw.mjs';
import path from 'path';
const [out, W = 1440, H = 900, dpr = 2, sel, hover] = process.argv.slice(2);
await withBrowser(async (b) => {
  const ctx = await b.newContext({ viewport: { width: +W, height: +H }, deviceScaleFactor: +dpr });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto('file://' + path.resolve('index.html')); await sleep(500);
  await p.evaluate(() => Promise.all([...document.images].map((i) => { i.loading = 'eager'; return i.decode().catch(() => 0); })));
  if (sel) await p.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'start' }), sel);
  if (hover) { await p.hover(hover); await sleep(700); }
  await sleep(300); await p.screenshot({ path: out });
  console.log(out, errs.length ? 'ERR ' + errs.join(' | ') : 'no page errors');
});
