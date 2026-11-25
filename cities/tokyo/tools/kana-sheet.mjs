// Review sheet for Tokyo's Japanese stroke table (cities/tokyo/src/37_kana.js).
//   node cities/tokyo/tools/kana-sheet.mjs                 out/kana/chars.png (every character, large) + out/kana/words.png
//   node cities/tokyo/tools/kana-sheet.mjs --ref           also out/kana/chars-ref.png: each character over a pale system
//                                                          font glyph (Hiragino Sans) to check structure against
//   node cities/tokyo/tools/kana-sheet.mjs --only=電気 --cell=200   out/kana/zoom.png: just those characters, larger
// Missing characters (a word uses one the table lacks) are listed on stdout.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const here = path.dirname(fileURLToPath(import.meta.url));
process.env.PLAYWRIGHT_FROM = process.env.PLAYWRIGHT_FROM || path.join(here, '../../../film');
const { playwright } = await import('../../../skill/inkcity/scripts/_pw.mjs');

const args = Object.fromEntries(process.argv.slice(2).map((a) => { const m = a.match(/^--([^=]+)(?:=(.*))?$/); return m ? [m[1], m[2] == null ? true : m[2]] : [a, true]; }));
const src = fs.readFileSync(path.join(here, '../src/37_kana.js'), 'utf8');
const JP = new Function(src + '\n;return JP;')();
const out = path.join(here, '../out/kana');
fs.mkdirSync(out, { recursive: true });

// the words the signs use (keep in step with the header of 37_kana.js)
const KATA = 'ラーメン カメラ ゲーム テレビ アニメ パソコン カラオケ ホテル コーヒー セール タバコ ホビー タクシー パン ビール メイド'.split(' ');
const HIRA = 'ゆ そば うどん おでん だんご たいやき'.split(' ');
const KANJI = '電気 中古 渋谷 本 寿司 焼鳥 酒 居酒屋 喫茶 甘味 和菓子 食堂 牛丼 雷門 浅草 祭 大吉 魚 築地 東京駅 東京 湯 薬 米 肉 花 茶 山 金 天 小 中 口 出 店'.split(' ');
const missing = [...new Set([...KATA, ...HIRA, ...KANJI].join(''))].filter((c) => !JP[c]);
console.log(Object.keys(JP).length + ' characters in JP; missing from the words: ' + (missing.length ? missing.join(' ') : 'none'));

const keys = args.only ? String(args.only).match(/ー\||./gu) : Object.keys(JP);
const page = `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:#F0EEE4}canvas{display:block}</style><body><canvas id="c"></canvas>`;
const { chromium } = playwright();
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const tab = await browser.newPage({ deviceScaleFactor: 1 });
  await tab.setContent(page);
  const render = (job) => tab.evaluate((job) => {
    const { JP, kind } = job, cv = document.getElementById('c'), cx = cv.getContext('2d');
    const INK = '#2A2622', PAPER = '#F0EEE4';
    const glyph = (ch, x, y, S, lw) => {             // one character in an S x S square, top-left at (x, y)
      const gl = JP[ch]; if (!gl) { cx.fillStyle = '#C9463E'; cx.font = (S * 0.14) + 'px sans-serif'; cx.fillText('?', x + 2, y + S * 0.14); return; }
      cx.strokeStyle = INK; cx.lineWidth = lw; cx.lineCap = 'round'; cx.lineJoin = 'round';
      for (const s of gl) { cx.beginPath(); cx.moveTo(x + s[0] * S / 10, y + s[1] * S / 10); for (let i = 2; i < s.length; i += 2) cx.lineTo(x + s[i] * S / 10, y + s[i + 1] * S / 10); cx.stroke(); }
    };
    if (kind === 'chars') {
      const { keys, S, ref } = job, pad = Math.round(S * 0.22), lab = Math.max(12, Math.round(S * 0.13)), cw = (ref ? 2 * S + pad : S) + pad * 2, ch = S + pad * 2 + lab;
      const cols = Math.max(1, Math.min(keys.length, Math.floor(1800 / cw))), rows = Math.ceil(keys.length / cols);
      cv.width = cols * cw; cv.height = rows * ch; cx.fillStyle = PAPER; cx.fillRect(0, 0, cv.width, cv.height);
      keys.forEach((k, i) => {
        const x = (i % cols) * cw + pad, y = Math.floor(i / cols) * ch + pad;
        cx.strokeStyle = 'rgba(42,38,34,0.12)'; cx.lineWidth = 1; cx.strokeRect(x + 0.5, y + 0.5, S, S);
        cx.beginPath(); cx.moveTo(x + S / 2, y); cx.lineTo(x + S / 2, y + S); cx.moveTo(x, y + S / 2); cx.lineTo(x + S, y + S / 2); cx.strokeStyle = 'rgba(42,38,34,0.05)'; cx.stroke();
        if (ref) {                                      // the system font's glyph: pale under the strokes, and beside them
          const ch0 = k[0]; cx.font = '200 ' + S + 'px "Hiragino Sans", "Hiragino Kaku Gothic ProN"'; cx.textBaseline = 'middle'; cx.textAlign = 'center';
          for (const [dx, col] of [[0, 'rgba(201,70,62,0.28)'], [S + pad, 'rgba(201,70,62,0.9)']]) {
            cx.fillStyle = col;
            if (k === 'ー|') { cx.save(); cx.translate(x + dx + S / 2, y + S / 2); cx.rotate(Math.PI / 2); cx.fillText('ー', 0, 0); cx.restore(); } else cx.fillText(ch0, x + dx + S / 2, y + S / 2 + S * 0.02);
          }
          cx.strokeStyle = 'rgba(42,38,34,0.12)'; cx.lineWidth = 1; cx.strokeRect(x + S + pad + 0.5, y + 0.5, S, S);
          if (S >= 300) {                               // a unit grid on the reference, to read coordinates off
            cx.strokeStyle = 'rgba(42,38,34,0.10)'; cx.fillStyle = 'rgba(42,38,34,0.45)'; cx.font = Math.round(S / 34) + 'px Menlo, monospace';
            for (let u = 1; u < 10; u++) {
              cx.beginPath(); cx.moveTo(x + S + pad + u * S / 10, y); cx.lineTo(x + S + pad + u * S / 10, y + S); cx.moveTo(x + S + pad, y + u * S / 10); cx.lineTo(x + 2 * S + pad, y + u * S / 10); cx.stroke();
              cx.fillText(u, x + S + pad + u * S / 10 + 2, y + S / 30); cx.fillText(u, x + S + pad + 2, y + u * S / 10 - 2);
            }
          }
          cx.textAlign = 'left'; cx.textBaseline = 'alphabetic';
        }
        glyph(k, x, y, S, Math.max(2, S * 0.052));
        cx.fillStyle = '#6F6656'; cx.font = lab + 'px ui-monospace, Menlo, monospace';
        const cp = [...k].map((c) => c === '|' ? '|' : 'U+' + c.codePointAt(0).toString(16).toUpperCase()).join('');
        cx.fillText(k + ' ' + cp + ' ' + (JP[k] ? JP[k].length : 0), x, y + S + pad * 0.55 + lab * 0.8);
      });
    } else {                                            // words: each on a line; katakana words also in columns
      const { lines, cols: vcols, S } = job, adv = S * 1.12, gap = S * 0.6, pad = S * 0.5;
      const lineW = Math.max(...lines.map((w) => [...w].length)) * adv;
      const colH = Math.max(...vcols.map((w) => w.length)) * adv;
      const perRow = Math.ceil(lines.length / 2);
      const W = Math.max(pad * 2 + 2 * (lineW + gap), pad * 2 + vcols.length * adv * 1.1), H = pad * 2 + perRow * (S + gap * 0.5) + gap + colH;
      cv.width = Math.ceil(W); cv.height = Math.ceil(H); cx.fillStyle = PAPER; cx.fillRect(0, 0, cv.width, cv.height);
      const lw = Math.max(2, S * 0.06);
      lines.forEach((w, i) => { const x0 = pad + Math.floor(i / perRow) * (lineW + gap), y0 = pad + (i % perRow) * (S + gap * 0.5); [...w].forEach((c, j) => glyph(c, x0 + j * adv, y0, S, lw)); });
      const top = pad + perRow * (S + gap * 0.5) + gap * 0.5;
      vcols.forEach((w, i) => { const x0 = pad + i * adv * 1.1; w.forEach((c, j) => glyph(c, x0, top + j * adv, S, lw)); });
    }
    return cv.toDataURL('image/png');
  }, job);
  const save = (name, url) => { fs.writeFileSync(path.join(out, name), Buffer.from(url.slice(22), 'base64')); console.log('wrote ' + path.relative(process.cwd(), path.join(out, name))); };
  const S = parseInt(args.cell || '96', 10);
  if (args.only) save('zoom.png', await render({ JP, kind: 'chars', keys, S, ref: !!args.ref }));
  else {
    save('chars.png', await render({ JP, kind: 'chars', keys, S, ref: false }));
    if (args.ref) save('chars-ref.png', await render({ JP, kind: 'chars', keys, S, ref: true }));
    const vert = KATA.map((w) => [...w].map((c) => c === 'ー' ? 'ー|' : c));
    save('words.png', await render({ JP, kind: 'words', lines: [...KATA, ...HIRA, ...KANJI], cols: vert, S: Math.round(S * 0.6) }));
  }
} finally { await browser.close(); }
