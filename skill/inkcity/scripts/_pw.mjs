// Shared by the check scripts: find Playwright, launch headless Chrome with the GPU on, one browser at a time.
import { createRequire } from 'module';
import fs from 'fs'; import path from 'path'; import os from 'os'; import { fileURLToPath } from 'url';
const here = path.dirname(fileURLToPath(import.meta.url));
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export function playwright() {
  for (const base of [process.env.PLAYWRIGHT_FROM, process.cwd(), here].filter(Boolean)) {
    try { return createRequire(path.join(path.resolve(base), 'x.js'))('playwright'); } catch (e) {}
  }
  throw new Error('Playwright not found. Run `npm i -D playwright` in the project, or set PLAYWRIGHT_FROM to a folder whose node_modules has it.');
}
export async function launch() {
  const { chromium } = playwright();
  const def = process.platform === 'darwin' ? '--use-angle=metal --enable-gpu --ignore-gpu-blocklist' : '--enable-gpu --ignore-gpu-blocklist';
  const args = (process.env.CHROME_ARGS || def).split(/\s+/).filter(Boolean);
  try { return await chromium.launch({ channel: process.env.CHROME_CHANNEL || 'chrome', headless: true, args }); }
  catch (e) { return await chromium.launch({ headless: true, args }); }            // Playwright's own Chromium
}
// several scripts may run at once; real-time timing is only honest with one browser running
const LOCK = path.join(os.tmpdir(), 'inkcity-browser.lock');
export async function withBrowser(fn) {
  for (let i = 0; ; i++) {
    try { fs.mkdirSync(LOCK); break; } catch (e) { try { if (Date.now() - fs.statSync(LOCK).mtimeMs > 120000) fs.rmdirSync(LOCK); } catch (e2) {} if (i > 2400) throw new Error('lock timeout'); await sleep(250); }
  }
  const keep = setInterval(() => { try { fs.utimesSync(LOCK, new Date(), new Date()); } catch (e) {} }, 20000);
  let browser;
  try { browser = await launch(); return await fn(browser); }
  finally { clearInterval(keep); if (browser) await browser.close(); try { fs.rmdirSync(LOCK); } catch (e) {} }
}
// PAGE_Q adds to every page's query (PAGE_Q=night runs a check at night)
export const url = (page, q) => { const all = [q, process.env.PAGE_Q].filter(Boolean).join('&'); return 'file://' + path.resolve(page) + (all ? '?' + all : ''); };
export function pageArg() {
  const p = process.argv[2];
  if (!p || !fs.existsSync(p)) { console.error('usage: node ' + path.basename(process.argv[1]) + ' <page.html> ...'); process.exit(2); }
  return p;
}
