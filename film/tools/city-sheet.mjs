// Turns the city pictures from tools/city-images.mjs into JPEGs for X (under its 5 MB limit for a picture) and lays
// the twelve out on one 16:9 sheet in the Looseleaf hand, for a post that shows them all (a post holds four pictures).
//   node tools/city-sheet.mjs <png-dir> <out-dir>   -> <out-dir>/cities/NN-slug.jpg and <out-dir>/inkcity-atlas-twelve-cities.jpg
import {chromium} from 'playwright';
import {mkdir, readdir, writeFile, stat} from 'node:fs/promises';
import path from 'node:path';

const FILM = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const [src = path.join(FILM, 'renders/city-images'), out = path.join(FILM, 'renders/x')] = process.argv.slice(2).map(p => path.resolve(p));
const NAMES = {tokyo: 'Tokyo', paris: 'Paris', newyork: 'New York', london: 'London', barcelona: 'Barcelona', venice: 'Venice', lisbon: 'Lisbon',
  istanbul: 'Istanbul', rio: 'Rio de Janeiro', beijing: 'Beijing', hongkong: 'Hong Kong', chongqing: 'Chongqing'};
const LIMIT = 5 * 1024 * 1024;
const files = (await readdir(src)).filter(f => /^\d\d-[a-z]+\.png$/.test(f)).sort();
if (files.length !== 12) throw new Error(`expected 12 city pictures in ${src}, found ${files.length}`);
await mkdir(path.join(out, 'cities'), {recursive: true});
const font = f => 'file://' + path.join(FILM, 'public/fonts', f);
const url = f => 'file://' + path.join(src, f);

const browser = await chromium.launch({channel: 'chrome', headless: true, args: ['--allow-file-access-from-files']});
try {
  const page = await browser.newPage({viewport: {width: 3840, height: 2160}, deviceScaleFactor: 1});
  await page.goto('file://' + path.join(FILM, 'tools/'));
  // each picture: flattened onto the paper and saved as the best JPEG under the limit
  for (const f of files) {
    let q = 0.92, bytes;
    for (;;) {
      const b64 = await page.evaluate(async ([u, q]) => {
        const img = new Image(); img.src = u; await img.decode();
        const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
        const g = c.getContext('2d'); g.fillStyle = '#F0EEE4'; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0);
        return c.toDataURL('image/jpeg', q).slice(23);
      }, [url(f), q]);
      bytes = Buffer.from(b64, 'base64');
      if (bytes.length <= LIMIT * 0.95 || q < 0.7) break;
      q -= 0.04;
    }
    const dest = path.join(out, 'cities', f.replace('.png', '.jpg'));
    await writeFile(dest, bytes);
    console.log(path.basename(dest), (bytes.length / 1048576).toFixed(2) + ' MB', 'q' + q.toFixed(2));
  }
  // the sheet: the title lettered on, then the twelve four by three, each with its number and name
  const cells = files.map((f, i) => {
    const slug = f.slice(3, -4);
    return `<figure><div class="pic"><img src="${url(f)}"></div><figcaption><span class="no">No. ${String(i + 1).padStart(2, '0')}</span>${NAMES[slug]}</figcaption></figure>`;
  }).join('');
  await page.setContent(`<!doctype html><style>
    @font-face { font-family: "Kevin Sans"; src: url("${font('KevinSans-Regular.woff2')}"); font-weight: 400; }
    @font-face { font-family: "Kevin Sans"; src: url("${font('KevinSans-Bold.woff2')}"); font-weight: 700; }
    html, body { margin: 0; width: 3840px; height: 2160px; background: #F0EEE4; color: #2C271C; font-family: "Kevin Sans", sans-serif; }
    header { position: absolute; left: 150px; top: 92px; display: flex; align-items: baseline; gap: 56px; }
    h1 { margin: 0; font-size: 150px; font-weight: 700; line-height: 1; color: #df6b3c; text-shadow: 8px 7px 0 rgba(44,39,28,.88); letter-spacing: -.005em; }
    header p { margin: 0; font-size: 64px; color: #5E574A; }
    header p mark { background: linear-gradient(180deg, transparent 18%, #fbd63a 18%, #fbd63a 86%, transparent 86%); color: inherit; padding: 0 .12em; }
    main { position: absolute; left: 110px; top: 330px; display: grid; grid-template-columns: repeat(4, 880px); column-gap: 30px; row-gap: 26px; }
    figure { margin: 0; }
    .pic { width: 880px; height: 495px; overflow: hidden; }
    .pic img { width: 100%; height: 100%; display: block; transform: scale(1.06); }
    figcaption { margin-top: 4px; padding-left: 40px; font-size: 50px; font-weight: 700; line-height: 1.1; }
    .no { margin-right: 22px; font-size: 30px; font-weight: 400; color: #8C8576; letter-spacing: .04em; }
  </style><header><h1>inkcity Atlas</h1><p>twelve cities, <mark>drawn alive.</mark></p></header><main>${cells}</main>`);
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode())); });
  const sheet = path.join(out, 'inkcity-atlas-twelve-cities.jpg');
  await page.screenshot({path: sheet, type: 'jpeg', quality: 90});
  console.log(path.basename(sheet), ((await stat(sheet)).size / 1048576).toFixed(2) + ' MB');
} finally { await browser.close(); }
