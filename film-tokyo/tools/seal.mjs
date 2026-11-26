// The seal's characters, 東 and 京, taken from Tokyo's own stroke table (cities/tokyo/src/37_kana.js): the same
// hand-cut strokes the city's signs are written with. Writes src/seal.json.  Usage: node tools/seal.mjs
import fs from 'node:fs';
import vm from 'node:vm';
const src = fs.readFileSync(new URL('../../cities/tokyo/src/37_kana.js', import.meta.url), 'utf8');
const ctx = {}; vm.createContext(ctx); vm.runInContext(src + '\n;globalThis.__JP = JP;', ctx);
const out = Object.fromEntries(['東', '京'].map((c) => [c, ctx.__JP[c]]));
fs.writeFileSync(new URL('../src/seal.json', import.meta.url), JSON.stringify(out) + '\n');
console.log('src/seal.json', Object.keys(out).map((c) => c + ' ' + out[c].length + ' strokes').join(', '));
