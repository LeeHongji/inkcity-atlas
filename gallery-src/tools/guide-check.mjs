// Check a city's guide on the real page: skip the build, shoot the wide view with its margin notes, then open every
// place and every "look for" item through the guidebook itself and shoot each one.
// usage (from the city folder): node ../../gallery-src/tools/guide-check.mjs [outDir] [--only=place1,place2] [--wide]
//   env PLAYWRIGHT_FROM as for the skill's scripts; GUIDE_PAGE another page of the city with its query
//   (e.g. 'dev.html?season=autumn': the guidebook is then checked with that season's words). Uses the shared browser lock.
import { withBrowser, sleep } from '../../skill/inkcity/scripts/_pw.mjs';
import fs from 'fs'; import path from 'path';
const args = process.argv.slice(2), out = args.find((a) => !a.startsWith('--')) || 'out/guide';
const only = (args.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean), wideOnly = args.includes('--wide');
const W = +(process.env.VW || 1920), H = +(process.env.VH || 1080);
fs.mkdirSync(out, { recursive: true });
const sharp = `(() => { const a = SF.app, v = mkView(a.cam, a.cv.width, a.cv.height, false); return !a.glide && SF.R.jobs.length === 0 && SF.live.every((t) => !bbHit(t.bb, v.rect) || findBake(t, v)); })()`;
await withBrowser(async (b) => {
  const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const page = await ctx.newPage(); const errs = [];
  page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  const PAGE = (process.env.GUIDE_PAGE || 'index.html').split('?');
  await page.goto('file://' + path.resolve(PAGE[0]) + (PAGE[1] ? '?' + PAGE[1] : ''));
  await page.waitForFunction('window.SF && SF.app && SF.app.started', null, { timeout: 20000 });
  if (!(await page.evaluate('!!window.GUIDE && !!document.getElementById("ink-guide")'))) { console.log('NO GUIDE on this page (is guide.js loaded and window.GUIDE set?)'); return; }
  await page.mouse.click(5, H - 5); await sleep(300);                 // a press skips the build
  await page.keyboard.press('0'); await sleep(200);
  const settle = async () => { await page.waitForFunction(sharp, null, { timeout: 15000 }).catch(() => console.log('  (not sharp after 15 s)')); await sleep(900); };
  await settle(); await sleep(700);                                  // the notes lay themselves out on the settled view
  await page.screenshot({ path: path.join(out, '00_wide.png') }); console.log(path.join(out, '00_wide.png'));
  if (wideOnly) { console.log(errs.length ? 'ERRORS: ' + errs.join(' | ') : 'no page errors'); return; }
  // the words the guidebook shows: its season's, where the season replaces a place's story or list
  const g = await page.evaluate(() => { const g = JSON.parse(JSON.stringify(window.GUIDE)), s = SF.look && SF.look.season, o = s && g.seasons && g.seasons[s] && g.seasons[s].places; if (o) g.places = g.places.map((p) => (o[p.shot] ? Object.assign({}, p, o[p.shot]) : p)); return g; });
  for (let i = 0; i < g.places.length; i++) {
    const p = g.places[i]; if (only.length && !only.includes(p.shot)) continue;
    // back to the list, then click the place by its title
    const back = page.getByRole('button', { name: '← all places' }); if (await back.count()) { await back.first().click(); await sleep(400); }
    await page.locator('#ink-guide-book').getByRole('button', { name: new RegExp(p.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) }).first().click();
    await sleep(300); await settle();
    const f = path.join(out, `${String(i + 1).padStart(2, '0')}_${p.shot}.png`); await page.screenshot({ path: f }); console.log(f);
    for (let k = 0; k < p.look.length; k++) {
      await page.locator('#ink-guide-book').getByRole('button', { name: p.look[k].text }).first().click();
      await sleep(300); await settle();
      const f2 = path.join(out, `${String(i + 1).padStart(2, '0')}_${p.shot}_look${k + 1}.png`); await page.screenshot({ path: f2 }); console.log(f2);
    }
  }
  if (!only.length) {
    const back = page.getByRole('button', { name: '← all places' }); if (await back.count()) { await back.first().click(); await sleep(400); }
    await page.getByRole('button', { name: /The moment/ }).first().click(); await sleep(300);
    await page.getByRole('button', { name: /Watch it/ }).first().click(); await sleep(300); await settle(); await sleep(2500);
    const f = path.join(out, '99_moment.png'); await page.screenshot({ path: f }); console.log(f);
  }
  console.log(errs.length ? 'ERRORS: ' + errs.join(' | ') : 'no page errors');
});
