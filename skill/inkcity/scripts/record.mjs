// Render every film frame exactly (seek, not real time) and encode an mp4. usage: node record.mjs <page.html> [out.mp4] [first] [last]
// Needs ffmpeg (FFMPEG=/path/to/ffmpeg if it is not on PATH). H.264, yuv420p, 1920x1080, 30 fps.
import { spawn } from 'child_process'; import path from 'path';
import { withBrowser, url, pageArg } from './_pw.mjs';
const page_ = pageArg(), out = process.argv[3] || path.join(path.dirname(path.resolve(page_)), 'film.mp4');
await withBrowser(async (browser) => {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.log('pageerror:', e.message));
  await page.goto(url(page_, 'f=0'));
  await page.waitForFunction('window.__ready', null, { timeout: 120000 });
  const a = parseInt(process.argv[4] || '0', 10), b = parseInt(process.argv[5] || String((await page.evaluate('SCENE.frames')) - 1), 10);
  const ff = spawn(process.env.FFMPEG || 'ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'png', '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '14', '-preset', 'slow', '-r', '30', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let n = a; n <= b; n++) {
    const b64 = await page.evaluate(`(() => { SF.seek(${n}); return SF.app.cv.toDataURL('image/png').slice(22); })()`);
    if (!ff.stdin.write(Buffer.from(b64, 'base64'))) await new Promise((r) => ff.stdin.once('drain', r));
    if (n % 100 === 0) console.log('frame', n, ((Date.now() - t0) / 1000).toFixed(0) + 's');
  }
  ff.stdin.end(); await new Promise((r) => ff.on('close', r));
  console.log('wrote', out, b - a + 1, 'frames');
});
