// Offline check of the traffic timetable: no two vehicles overlap, and no vehicle touches a pedestrian on a crosswalk.
// usage: node tools/traffic_check.mjs   (loads src/35_scene.js + src/37_traffic.js in a sandbox)
import fs from 'fs'; import vm from 'vm'; import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url)), src = (f) => fs.readFileSync(path.join(dir, '..', 'src', f), 'utf8');
const ctx = { console, Math, Float32Array, module: undefined }; vm.createContext(ctx);
const t0 = Date.now();
vm.runInContext(src('35_scene.js') + '\n' + src('37_traffic.js') + '\nthis.SCENE = SCENE; this.NYT = NYT;', ctx);
const N = ctx.NYT; console.log('sim', Date.now() - t0, 'ms;', N.tracks.length, 'tracks;', N.LANES.length, 'lanes');
const HW = { cab: 2.45, cabv: 2.45, car: 2.55, black: 2.6, bus: 2.6, truck: 2.6, fire: 2.7, bike: 0.7 };
const M = -0.05; let worst = 1e9, bad = 0, pedBad = 0, maxCopies = 0;
const per = N.PER * 2;
for (const tr of N.tracks) maxCopies = Math.max(maxCopies, N.copies(tr));
for (let t = 0; t < per; t += 0.05) {
  const boxes = [];
  for (const tr of N.tracks) for (let m = 0; m < N.copies(tr); m++) {
    const p = N.at(tr, m, t); if (!p) continue;
    const hl = p.len / 2, hw = HW[p.type], ax = Math.abs(Math.cos(p.ang)) > 0.5;
    boxes.push({ x0: p.x - (ax ? hl : hw), x1: p.x + (ax ? hl : hw), y0: p.y - (ax ? hw : hl), y1: p.y + (ax ? hw : hl), id: tr.uid + '/' + m, type: p.type });
  }
  for (let a = 0; a < boxes.length; a++) for (let b = a + 1; b < boxes.length; b++) {
    const A = boxes[a], B = boxes[b];
    const ox = Math.min(A.x1, B.x1) - Math.max(A.x0, B.x0), oy = Math.min(A.y1, B.y1) - Math.max(A.y0, B.y0);
    if (ox > -M && oy > -M) { bad++; if (bad < 8) console.log('overlap t=' + t.toFixed(2), A.type, A.id, B.type, B.id, ox.toFixed(2), oy.toFixed(2), JSON.stringify([A.x0.toFixed(1), A.y0.toFixed(1)]), JSON.stringify([B.x0.toFixed(1), B.y0.toFixed(1)])); }
  }
  if (N.peds) for (const p of N.peds(t)) for (const B of boxes) if (p.x > B.x0 - 0.6 && p.x < B.x1 + 0.6 && p.y > B.y0 - 0.6 && p.y < B.y1 + 0.6) { pedBad++; if (pedBad < 6) console.log('ped hit t=' + t.toFixed(2), B.type, B.id, p.x.toFixed(1), p.y.toFixed(1)); }
}
const D = N.tracks.map((t) => t.D); console.log('durations', Math.min(...D).toFixed(1), '..', Math.max(...D).toFixed(1), 's; max copies', maxCopies);
console.log(bad || pedBad ? 'FAIL: ' + bad + ' vehicle overlaps, ' + pedBad + ' pedestrian hits' : 'OK: no overlaps over ' + per + ' s');
