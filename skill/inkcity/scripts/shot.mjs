// Render frozen frames to PNG. usage: node shot.mjs <page.html> <out.png> "<query>" [<out.png> "<query>" ...]
// queries: f=N (a film frame, its shot's camera) | f=N&cam=z,cx,cy (any camera, wide px) | &live (everything built, actors at f/30 s)
// | &only=name1,name2 (just these tiles; the 'streets' tile always stays)
import { withBrowser, url, pageArg } from './_pw.mjs';
const page_ = pageArg(), pairs = process.argv.slice(3);
await withBrowser(async (browser) => {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.log('pageerror:', e.message));
  for (let i = 0; i + 1 < pairs.length; i += 2) {
    const t0 = Date.now();
    await page.goto(url(page_, pairs[i + 1]));
    await page.waitForFunction('window.__ready || window.__err', null, { timeout: 120000 });
    const err = await page.evaluate('window.__err || ""'); if (err) console.log('ERR', err);
    await page.screenshot({ path: pairs[i] });
    console.log(pairs[i], (Date.now() - t0) + 'ms');
  }
});
