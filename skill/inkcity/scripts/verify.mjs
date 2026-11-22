// The film's contract, checked on frozen frames. usage: node verify.mjs <page.html>
// 1 seek determinism: a frame gives the same pixels whatever was drawn before it (so recording frame by frame works)
// 2 every cut is hard: the frames either side of a cut differ far more than neighbours inside a shot
// 3 cast entrances: the living layer pops in on its frame
// 4 the ending: the fade reaches a faint ghost and the hold frames repeat exactly
// Prints PASS/FAIL per check; exits 1 on any failure.
import { withBrowser, url, pageArg } from './_pw.mjs';
const page_ = pageArg();
let fails = 0; const ok = (c, msg) => { console.log((c ? 'PASS ' : 'FAIL ') + msg); if (!c) fails++; };
await withBrowser(async (browser) => {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(url(page_, 'f=0'));
  await page.waitForFunction('window.__ready || window.__err', null, { timeout: 120000 });
  const S = await page.evaluate(`({ frames: SCENE.frames, hold: SCENE.hold == null ? SCENE.frames - 1 : SCENE.hold, fade: SCENE.fade || null, cuts: SCENE.shots.slice(1).map((s) => s.a),
    cast: SF.live.filter((t) => t.rim >= 0).map((t) => [t.name, t.castAt]), err: window.__err || '' })`);
  if (S.err) ok(false, 'page errors: ' + S.err);
  await page.evaluate(`window.H = (n) => { SF.seek(n); const d = SF.app.ctx.getImageData(0, 0, 1920, 1080).data; let h = 2166136261; for (let i = 0; i < d.length; i++) { h ^= d[i]; h = Math.imul(h, 16777619); } return h >>> 0; };
    window.D = (a, b) => { SF.seek(a); const x = SF.app.ctx.getImageData(0, 0, 1920, 1080).data; SF.seek(b); const y = SF.app.ctx.getImageData(0, 0, 1920, 1080).data; let n = 0; for (let i = 0; i < x.length; i += 4) if (Math.abs(x[i] - y[i]) + Math.abs(x[i + 1] - y[i + 1]) + Math.abs(x[i + 2] - y[i + 2]) > 24) n++; return n; };
    window.CON = (n) => { SF.seek(n); const P = SF.look && SF.look.night ? SF.paper() : [242, 237, 228], d = SF.app.ctx.getImageData(0, 0, 1920, 1080).data; let s = 0, c = 0; for (let i = 0; i < d.length; i += 4 * 7) { s += Math.abs(d[i] - P[0]) + Math.abs(d[i + 1] - P[1]) + Math.abs(d[i + 2] - P[2]); c++; } return s / c; };`);
  // 1) seeks in a scrambled order, every frame visited at least twice
  const pick = [15, 45, 90, ...S.cuts.map((a) => a + 20), S.hold];
  const order = []; for (let r = 0; r < 2; r++) for (let i = 0; i < pick.length; i++) order.push(pick[(i * 7 + r * 3) % pick.length]);
  // keep each frame's first image, so a mismatch can say where the two renders differ
  await page.evaluate(`window.FIRST = {}; window.WHERE = (n) => { const a = FIRST[n]; SF.seek(n); const b = SF.app.ctx.getImageData(0, 0, 1920, 1080).data; let c = 0, mx = 0, bb = [1e9, 1e9, -1, -1];
    for (let i = 0; i < a.length; i += 4) { const d = Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]); if (d) { c++; mx = Math.max(mx, d); const k = i / 4, x = k % 1920, y = (k / 1920) | 0; bb = [Math.min(bb[0], x), Math.min(bb[1], y), Math.max(bb[2], x), Math.max(bb[3], y)]; } }
    return { px: c, maxDiff: mx, box: bb, tiles: SF.live.filter((t) => t._st >= 0).map((t) => t.name + ':' + ['empty', 'building', 'painted', 'live'][t._st]).join(' ') }; };`);
  const seen = {}; let bad = 0;
  for (const n of order) {
    const h = await page.evaluate('H(' + n + ')');
    if (seen[n] == null) await page.evaluate('FIRST[' + n + '] = SF.app.ctx.getImageData(0, 0, 1920, 1080).data.slice()');
    else if (seen[n] !== h) { bad++; console.log('  not repeatable: frame', n, JSON.stringify(await page.evaluate('WHERE(' + n + ')'))); }
    seen[n] = h;
  }
  ok(bad === 0, 'seek determinism (' + order.length + ' seeks in scrambled order)');
  // 2) hard cuts
  for (const c of S.cuts) {
    const cut = await page.evaluate('D(' + (c - 1) + ',' + c + ')'), inside = await page.evaluate('D(' + c + ',' + (c + 1) + ')');
    ok(cut > 150000 && cut > 4 * inside, 'cut at f' + c + ': ' + cut + ' px change across it, ' + inside + ' inside the shot');
  }
  // 3) cast entrances (informational: how much changes on the entrance frame vs the frame before)
  for (const [name, at] of S.cast) if (at > 1 && at < S.frames) console.log('info cast of ' + name + ' at f' + at + ': ' + (await page.evaluate('D(' + (at - 1) + ',' + at + ')')) + ' px vs ' + (await page.evaluate('D(' + (at - 2) + ',' + (at - 1) + ')')) + ' the frame before');
  // 4) the ending
  if (S.fade) {
    const a = S.fade[0], c0 = await page.evaluate('CON(' + a + ')'), end = await page.evaluate('CON(' + S.hold + ')');
    ok(end / c0 < 0.12, 'fade from f' + a + ': ' + (end / c0 * 100).toFixed(1) + '% of the contrast left at the hold frame');
  }
  if (S.hold < S.frames - 1) ok((await page.evaluate('D(' + S.hold + ',' + (S.frames - 1) + ')')) === 0, 'frames after f' + S.hold + ' repeat it exactly');
  ok(errs.length === 0, 'no page errors' + (errs.length ? ': ' + errs.join(' | ') : ''));
});
console.log(fails ? fails + ' check(s) failed' : 'all checks passed');
process.exit(fails ? 1 : 0);
