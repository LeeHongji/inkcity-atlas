// Shoot a city's guide at several viewport sizes: the home view, then one place with a look-for circle.
// usage (from the city folder): node ../../gallery-src/tools/guide-sizes.mjs <outDir> [sizes, e.g. 1920x1080,390x844]
import { withBrowser, sleep } from '../../skill/inkcity/scripts/_pw.mjs';
import fs from 'fs'; import path from 'path';
const out = process.argv[2] || 'out/sizes', list = (process.argv[3] || '1920x1080,1440x900,1280x720,2560x1440,1024x768,768x1024,390x844,844x390').split(',');
fs.mkdirSync(out, { recursive: true });
const sharp = `(() => { const a = SF.app, v = mkView(a.cam, a.cv.width, a.cv.height, false); return !a.glide && SF.R.jobs.length === 0 && SF.live.every((t) => !bbHit(t.bb, v.rect) || findBake(t, v)); })()`;
await withBrowser(async (b) => {
  for (const s of list) {
    const [W, H] = s.split('x').map(Number), mobile = W < 760 || H < 500;
    const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
    const page = await ctx.newPage(); const errs = []; page.on('pageerror', (e) => errs.push(e.message));
    await page.goto('file://' + path.resolve('index.html')); await page.waitForFunction('window.SF && SF.app && SF.app.started', null, { timeout: 20000 });
    await page.mouse.click(W - 3, 3); await sleep(1800);
    await page.waitForFunction(sharp, null, { timeout: 15000 }).catch(() => {}); await sleep(1100);
    await page.screenshot({ path: path.join(out, `${s}_home.png`) });
    // open the guidebook if it is folded, pick the second place and its first look-for item
    const openB = page.getByRole('button', { name: /guidebook/i }); if (await openB.count()) { await openB.first().click().catch(() => {}); await sleep(500); }
    const g = await page.evaluate('window.GUIDE'); const p = g.places[1];
    await page.locator('#ink-guide-book').getByRole('button', { name: new RegExp(p.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) }).first().click().catch((e) => errs.push('place: ' + e.message.split('\n')[0]));
    await sleep(400); await page.waitForFunction(sharp, null, { timeout: 15000 }).catch(() => {}); await sleep(600);
    await page.screenshot({ path: path.join(out, `${s}_place.png`) });
    await page.locator('#ink-guide-book').getByRole('button', { name: p.look[0].text }).first().click().catch((e) => errs.push('look: ' + e.message.split('\n')[0]));
    await sleep(400); await page.waitForFunction(sharp, null, { timeout: 15000 }).catch(() => {}); await sleep(900);
    await page.screenshot({ path: path.join(out, `${s}_look.png`) });
    console.log(s, errs.length ? 'ERR ' + errs.join(' | ') : 'ok');
    await ctx.close();
  }
});
