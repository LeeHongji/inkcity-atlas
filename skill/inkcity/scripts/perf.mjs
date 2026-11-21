// Play the film in real time (recording mode, 1920x1080) and report frame pacing. usage: node perf.mjs <page.html> [extra query]
// Good: mean ~16.7 ms, p95 under ~20 ms, no frame over 34 ms after the first few, and endWall ~ frames/30 s.
// work.heavy lists frames whose background work (bakes, pose packing) + drawing went over 14 ms: [frame, jobs ms, draw ms, cut ms];
// slowSteps lists single background steps over 6 ms: [frame, job, ms, what] (what: slice | obj | grain+warm | boil | sprite | pose).
// A heavy frame with no slow step is usually a garbage-collection pause or load from other processes: measure again.
import { withBrowser, url, pageArg, sleep } from './_pw.mjs';
const page_ = pageArg(), extra = process.argv[3] || '';
await withBrowser(async (browser) => {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.log('pageerror:', e.message));
  const t0 = Date.now();
  await page.addInitScript('window.__slowJobs = []');                      // the engine logs background steps over 6 ms here
  await page.goto(url(page_, 'film&log' + (extra ? '&' + extra : '')));
  await page.waitForFunction('window.__baked', null, { timeout: 120000 });
  const frames = await page.evaluate('SCENE.frames');
  console.log('ready after', Date.now() - t0, 'ms;', frames, 'frames');
  await page.waitForFunction('window.__done', null, { timeout: (frames / 30 + 30) * 1000 }).catch(() => console.log('did not reach the end in time'));
  await sleep(300);
  const r = await page.evaluate(`(() => { const s = (window.__stats || []).slice(2); const a = s.slice().sort((x, y) => x - y); const q = (p) => a[Math.min(a.length - 1, Math.floor(p * a.length))];
    const worst = []; let t = 0; for (let i = 0; i < s.length; i++) { t += s[i]; if (s[i] > 34) worst.push([Math.round((t / 1000) * 30), Math.round(s[i])]); }
    const w = (window.__work || []).filter((r) => r[0] < SCENE.frames); const tot = w.map((r) => r[1] + r[2] + r[3]).sort((x, y) => x - y); const q2 = (p) => tot[Math.min(tot.length - 1, Math.floor(p * tot.length))];
    return { frames: s.length, mean: +(s.reduce((x, y) => x + y, 0) / s.length).toFixed(2), p50: +q(0.5).toFixed(1), p95: +q(0.95).toFixed(1), p99: +q(0.99).toFixed(1), max: +a[a.length - 1].toFixed(1), over34: worst.length, worst: worst.slice(0, 20),
      endWall: window.__endWall, err: window.__err || '', work: { p50: q2(0.5), p95: q2(0.95), max: tot[tot.length - 1], heavy: w.filter((r) => r[1] + r[2] + r[3] > 14).slice(0, 20) }, slowSteps: (window.__slowJobs || []).slice(0, 20) }; })()`);
  console.log(JSON.stringify(r));
});
