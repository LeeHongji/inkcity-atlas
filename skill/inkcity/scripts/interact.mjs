// Explore smoothness: frame intervals, draw and background-job time while zooming and dragging (DPR 2 by default).
// usage: node interact.mjs <page.html> [dpr] [label]   (VW / VH set the window, e.g. VW=2560 VH=1440 for a big screen)
// Aim: every phase p95 <= ~20 ms and no frame over 34 ms on a 1920x1080 window; a few after a zoom settles on a 5K canvas.
import { withBrowser, url, pageArg } from './_pw.mjs';
const pg = pageArg(), [dpr, label] = process.argv.slice(3);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await withBrowser(async (browser) => {
  const page = await browser.newPage({ viewport: { width: +(process.env.VW || 1920), height: +(process.env.VH || 1080) }, deviceScaleFactor: +(dpr || 2) });
  await page.goto(url(pg, ''));
  await sleep(1500);
  await page.mouse.move(960, 540); await page.mouse.down(); await page.mouse.up();   // into explore
  await sleep(2500);
  await page.evaluate(`(() => { window.__F = []; let last = performance.now(); const raf = () => { const t = performance.now(); window.__F.push(t - last); last = t; requestAnimationFrame(raf); }; requestAnimationFrame(raf);
    const D = SF.draw; window.__D = []; SF.draw = function () { const t = performance.now(); const r = D.apply(this, arguments); window.__D.push(performance.now() - t); return r; };
    const J = window.runJobs; window.__J = []; window.runJobs = function (ms) { const t = performance.now(); const r = J(ms); window.__J.push(performance.now() - t); return r; }; })()`);
  const phase = async (name, fn) => {
    await page.evaluate('window.__F.length = 0; window.__D.length = 0; window.__J.length = 0;');
    await fn();
    const r = await page.evaluate(`(() => { const s = (a) => { const b = a.slice().sort((x, y) => x - y), q = (p) => b.length ? +b[Math.min(b.length - 1, Math.floor(p * b.length))].toFixed(1) : 0; return { n: b.length, mean: b.length ? +(b.reduce((x, y) => x + y, 0) / b.length).toFixed(1) : 0, p50: q(0.5), p95: q(0.95), max: q(1) }; };
      const F = window.__F; return JSON.stringify({ frames: s(F), over20: F.filter((x) => x > 20).length, over34: F.filter((x) => x > 34).length, draw: s(window.__D), jobs: s(window.__J), dead: SF.R.dead.length, abmp: +(ABMP.px / 1e6).toFixed(1), bakes: +(SF.R.pixels / 1e6).toFixed(1), q: SF.R.jobs.length }); })()`);
    console.log((label || '') + ' ' + name.padEnd(10), r);
  };
  const drag = async (dx, dy, steps) => { await page.mouse.move(960, 540); await page.mouse.down(); for (let s = 1; s <= steps; s++) { await page.mouse.move(960 + dx * s / steps, 540 + dy * s / steps); await sleep(16); } await page.mouse.up(); };
  await phase('idle-wide', async () => { await sleep(1500); });
  await phase('zoom-in', async () => { await page.mouse.move(900, 500); for (let i = 0; i < 14; i++) { await page.mouse.wheel(0, -100); await sleep(40); } await sleep(300); });
  await phase('drag', async () => { await drag(700, 250, 60); await drag(-900, -200, 60); await drag(500, -300, 60); });
  await phase('idle-z3', async () => { await sleep(1500); });
  await phase('zoom-deep', async () => { for (let i = 0; i < 12; i++) { await page.mouse.wheel(0, -100); await sleep(40); } await sleep(300); });
  await phase('drag-deep', async () => { await drag(600, 300, 60); await drag(-700, -100, 60); });
  await phase('zoom-out', async () => { for (let i = 0; i < 26; i++) { await page.mouse.wheel(0, 100); await sleep(40); } await sleep(300); });
  await phase('drag-wide', async () => { await drag(400, 200, 60); await drag(-400, -200, 60); });
});
