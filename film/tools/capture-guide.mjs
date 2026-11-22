// Captures the guide shot from the real Beijing page with its real overlay, on a controlled clock.
// The page's requestAnimationFrame, performance.now, Date.now and timers run on a fake clock from the first script,
// and every CSS animation/transition is paused and set from that clock, so each screenshot is exactly 1/30 s later
// and a rerun gives the same frames. The clicks are real mouse events on the guidebook.
//   node tools/capture-guide.mjs            -> public/clips/guide/0000.jpg ... and public/clips/guide.json
//   STILLS=0,96,200 node tools/capture-guide.mjs   -> only those frames, to evidence/guide-stills/
import {chromium} from 'playwright';
import {mkdir, rm, writeFile} from 'node:fs/promises';
import path from 'node:path';

const FILM = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const PAGE = 'file://' + path.resolve(FILM, '../cities/beijing/index.html');
const FPS = 30, FRAMES = 252;                     // 8.4 s, the guide shot in plan.json
const LEAD = 14;                                  // frames before the build hands over to explore
// what happens, in clip frames (shot-local seconds x 30)
const PLACE = {at: 96, text: 'The Hutongs'};
const LOOK = {at: 162, text: 'A family round a table'};
const SCROLL = {from: 128, to: 152};             // the panel scrolls down to its "Look for" list (a wheel, eased)
const STILLS = process.env.STILLS ? process.env.STILLS.split(',').map(Number) : null;

const INIT = `(() => {
  const realNow = performance.now.bind(performance), realDate = Date.now;
  let fake = 0; const base = realDate();
  performance.now = () => fake;
  Date.now = () => base + fake;
  let rq = [], rid = 0;
  window.requestAnimationFrame = cb => { rq.push({id: ++rid, cb}); return rid; };
  window.cancelAnimationFrame = id => { rq = rq.filter(r => r.id !== id); };
  let tq = [], tid = 0;
  const add = (cb, ms, args, every) => { const id = ++tid; tq.push({id, due: fake + Math.max(0, +ms || 0), cb, args, every}); return id; };
  window.setTimeout = (cb, ms, ...args) => add(cb, ms, args, 0);
  window.setInterval = (cb, ms, ...args) => add(cb, ms, args, Math.max(1, +ms || 1));
  window.clearTimeout = window.clearInterval = id => { tq = tq.filter(t => t.id !== id); };
  let s = 7; Math.random = () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const seen = new WeakMap();
  window.__cap = {
    frame(dt) {
      const end = fake + dt * 1000;
      for (;;) {                                   // timers in due order, including ones they schedule
        tq.sort((a, b) => a.due - b.due || a.id - b.id);
        const t = tq[0]; if (!t || t.due > end) break;
        fake = Math.max(fake, t.due);
        if (t.every) t.due += t.every; else tq.shift();
        try { typeof t.cb === 'function' ? t.cb(...t.args) : (0, eval)(t.cb); } catch (e) { console.error(e); }
      }
      fake = end;
      const c = rq; rq = [];
      for (const r of c) { try { r.cb(fake); } catch (e) { console.error(e); } }
    },
    animations() {                                 // CSS animations and transitions follow the fake clock
      for (const a of document.getAnimations()) {
        if (!seen.has(a)) { seen.set(a, fake); a.pause(); }
        a.currentTime = fake - seen.get(a);
      }
    },
    get now() { return fake; },
  };
})();`;

const out = path.join(FILM, STILLS ? 'evidence/guide-stills' : 'public/clips/guide');
if (!STILLS) await rm(out, {recursive: true, force: true});
await mkdir(out, {recursive: true});
const browser = await chromium.launch({channel: 'chrome', headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist']});
try {
  // 1280 x 720 CSS px at 1.5x: the real layout, its text at video scale (15.5 px -> 23 px), drawn natively at 1920 x 1080
  const ctx = await browser.newContext({viewport: {width: 1280, height: 720}, deviceScaleFactor: 1.5});
  const page = await ctx.newPage(); const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.addInitScript(INIT);
  await page.goto(PAGE, {waitUntil: 'load'});
  const step = () => page.evaluate(dt => { __cap.frame(dt); __cap.animations(); }, 1 / FPS);
  // run the page's own clock until the city has drawn itself and is LEAD frames from handing over
  let pumped = 0;
  for (;;) {
    await step(); pumped++;
    const st = await page.evaluate(() => window.SF && SF.app && SF.app.started && typeof SHOTS !== 'undefined'
      ? {n: (performance.now() - SF.app.t0) / 1000 * 30, intro: SF.app.intro || SHOTS[1].a, mode: SF.view().mode} : null);
    if (st && (st.mode === 'explore' || st.n >= st.intro - LEAD)) { console.log('handover in', (st.intro - st.n).toFixed(1), 'frames; pumped', pumped); break; }
    if (pumped > 3000) throw new Error('the build never finished');
  }
  const centre = text => page.evaluate(t => {
    const el = [...document.querySelectorAll('#ink-guide-book button, #ink-guide-book a, #ink-guide-book li, #ink-guide-book label')]
      .find(e => e.textContent.replace(/\s+/g, ' ').includes(t));
    if (!el) return null; const r = el.getBoundingClientRect(); return {x: r.left + Math.min(60, r.width / 2), y: r.top + r.height / 2, w: r.width, h: r.height};
  }, text);
  const events = [];
  const last = STILLS ? Math.max(...STILLS) : FRAMES - 1;
  let scroll = null;
  for (let i = 0; i <= last; i++) {
    if (i === SCROLL.from) scroll = await page.evaluate(t => {   // the panel's scroll box and how far the look-for item needs it to go
      const el = [...document.querySelectorAll('#ink-guide-book button, #ink-guide-book li, #ink-guide-book label')].find(e => e.textContent.replace(/\s+/g, ' ').includes(t));
      let box = el && el.parentElement; while (box && !(box.scrollHeight > box.clientHeight + 4 && /auto|scroll/.test(getComputedStyle(box).overflowY))) box = box.parentElement;
      if (!box) return null; box.id = box.id || 'film-scrollbox';
      const r = el.getBoundingClientRect(), b = box.getBoundingClientRect();
      return {id: box.id, from: box.scrollTop, to: Math.min(box.scrollHeight - box.clientHeight, box.scrollTop + r.bottom - b.bottom + 24)};
    }, LOOK.text);
    if (scroll && i > SCROLL.from && i <= SCROLL.to) {
      const k = (i - SCROLL.from) / (SCROLL.to - SCROLL.from), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      await page.evaluate(([id, y]) => { document.getElementById(id).scrollTop = y; }, [scroll.id, scroll.from + (scroll.to - scroll.from) * e]);
    }
    for (const act of [PLACE, LOOK]) if (i === act.at) {
      const c = await centre(act.text);
      if (!c) throw new Error('guidebook item not found: ' + act.text);
      await page.mouse.move(c.x, c.y); await page.mouse.down(); await page.mouse.up();
      events.push({frame: i, text: act.text, x: c.x * 1.5, y: c.y * 1.5});
    }
    await step();
    if (!STILLS || STILLS.includes(i)) await page.screenshot({path: path.join(out, String(i).padStart(4, '0') + '.jpg'), type: 'jpeg', quality: 92});
  }
  if (!scroll) throw new Error('no scroll box found for the look-for list');
  if (!STILLS) await writeFile(path.join(FILM, 'public/clips/guide.json'), JSON.stringify({fps: FPS, frames: FRAMES, size: [1920, 1080], scroll: SCROLL, events}, null, 1));
  console.log(STILLS ? 'stills ' + STILLS.join(',') : FRAMES + ' frames', JSON.stringify(events), errs.length ? 'ERRORS ' + errs.join(' | ') : 'no page errors');
} finally { await browser.close(); }
