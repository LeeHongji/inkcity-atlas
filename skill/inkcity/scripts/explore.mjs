// Drive explore mode with real input (DPR 2) and report the state after each step. usage: node explore.mjs <page.html> [outDir]
// Checks: interrupting the build, wheel zoom and the time until every visible tile is sharp, drag, zoom limits, keys 0-9 / Esc,
// clicking a place (twice: a dive if the scene has one), Space pause, R replay, interrupting the tour. Screenshots go to outDir.
import fs from 'fs'; import path from 'path';
import { withBrowser, url, pageArg, sleep } from './_pw.mjs';
const page_ = pageArg(), out = process.argv[3] || path.join(path.dirname(path.resolve(page_)), 'out');
fs.mkdirSync(out, { recursive: true });
await withBrowser(async (browser) => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(url(page_));
  await page.waitForFunction('window.__baked', null, { timeout: 120000 });
  const st = async (label) => { const s = await page.evaluate(`(() => { const a = SF.app, n0 = (a.paused ? a.pauseAt : (performance.now() - a.t0) / 1000) * 30, c = a.mode === 'film' ? SHOTS[shotAt(Math.min(n0, FILM_FRAMES - 1))] : a.cam, v = mkView(c, a.cv.width, a.cv.height, false); return { mode: a.mode, n: Math.round((a.paused ? a.pauseAt : (performance.now() - a.t0) / 1000) * 30), cam: [+c.z.toFixed(3), Math.round(c.cx), Math.round(c.cy)], paused: a.paused, jobs: SF.R.jobs.length, sharp: SF.live.filter((t) => t.name !== 'streets' && bbHit(t.bb, v.rect)).map((t) => t.name + ':' + (findBake(t, v) ? 1 : 0)).join(' ') }; })()`); console.log(label.padEnd(24), JSON.stringify(s)); return s; };
  // the place to click: the first one with a dive, else the first visit key
  const S = await page.evaluate(`(() => { const vis = SCENE.visit || [], name = vis.find((q) => SCENE.dive && SCENE.dive[q]) || vis[0], t = SF.live.find((q) => q.name === name);
    return { visit: vis, name, dive: SCENE.dive && SCENE.dive[name], centre: t ? [(t.bb[0] + t.bb[2]) / 2, (t.bb[1] + t.bb[3]) / 2] : null }; })()`);
  const screenOf = (w) => page.evaluate(`(() => { const a = SF.app, c = a.cam, s = Math.min(a.cv.width / 1920, a.cv.height / 1080), pz = c.z * s, k = a.cv.width / a.cv.clientWidth; return [((${w[0]} - c.cx) * pz + a.cv.width / 2) / k, ((${w[1]} - c.cy) * pz + a.cv.height / 2) / k]; })()`);
  const auto = await page.evaluate('SCENE.autoplay !== false');
  await sleep(1500); const s0 = await st(auto ? 'film @1.5s (build)' : 'opened (autoplay off)');
  if (!auto) console.log('  opens straight into explore:', s0.mode === 'explore');
  await page.mouse.move(700, 450); await sleep(100); const m = await st('after mouse move'); if (auto) console.log('  mouse move alone keeps the film:', m.mode === 'film');
  await page.mouse.move(760, 430);
  for (let i = 0; i < 10; i++) { await page.mouse.wheel(0, -120); await sleep(30); }
  await st('right after wheel in'); const t0 = Date.now();
  await page.waitForFunction(`(() => { const a = SF.app, v = mkView(a.cam, a.cv.width, a.cv.height, false); return SF.R.jobs.length === 0 && SF.live.every((t) => !bbHit(t.bb, v.rect) || findBake(t, v)); })()`, null, { timeout: 15000 }).catch(() => console.log('  not sharp after 15 s'));
  console.log('  sharp after', Date.now() - t0, 'ms'); await page.screenshot({ path: path.join(out, 'explore_zoomed.png') });
  await page.mouse.move(700, 450); await page.mouse.down(); await page.mouse.move(520, 380, { steps: 8 }); await page.mouse.up(); await sleep(300); await st('after drag');
  for (let i = 0; i < 60; i++) await page.mouse.wheel(0, -200); await sleep(100); await st('max zoom');
  for (let i = 0; i < 90; i++) await page.mouse.wheel(0, 200); await sleep(100); await st('min zoom');
  for (const k of ['1', '2', '0', 'Escape']) { await page.keyboard.press(k); await sleep(60); await st('key ' + k); }
  if (S.centre) {
    // click that place twice: once to frame it, again (on the frame's centre, which is that place) to dive
    await page.keyboard.press('0'); await sleep(300);
    const xy = await screenOf(S.centre);
    await page.mouse.click(xy[0], xy[1]); await sleep(80); const c1 = await st('click ' + S.name);
    await page.mouse.click(720, 450); await sleep(80); const c2 = await st('click again');
    if (S.dive) console.log('  dive to ' + S.dive + ':', JSON.stringify(c1.cam) !== JSON.stringify(c2.cam) ? 'yes' : 'NO');
  }
  await page.keyboard.press(' '); await sleep(300); const a = await st('Space (pause)'); await sleep(500); const b = await st('still paused'); console.log('  time frozen:', a.n === b.n);
  await page.keyboard.press(' '); await sleep(200); await st('Space (resume)');
  await page.keyboard.press('r'); await sleep(400); await st('R (replay)');
  await page.evaluate('SF.app.t0 -= 6000'); await sleep(300); await st('film, later'); await page.keyboard.press('ArrowLeft'); await sleep(100); await st('key interrupts the film');
  await page.screenshot({ path: path.join(out, 'explore_end.png') });
  console.log('errors:', errs.length ? errs.join(' | ') : 'none');
});
