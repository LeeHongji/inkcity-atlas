import React from 'react';
import {shot, onDrive} from '../engine.js';
import {paint, paintWipe, paintMove, ladder, purgeOnce, camAt, zoomCam, WIPE_S} from '../city.js';
import {cut, inOut} from './common.jsx';

/* Every picture is the real Tokyo page drawing its own frames (src/city.js). Cameras are world points [x, y, z] (the
   guide's own anchors where it has them, cities/tokyo/src/guide.js) and zooms; the page redraws at every zoom, so a
   pull-back or a push-in stays sharp all the way. */

// the whole map on its paper, the title's corner left clear
export const WIDE = {at: [0, 0, 0], z: 0.54, dy: 26};
// 1 · the Shibuya scramble at the middle of the map, the crowds stepping out, then all the way back to the whole city
export const SCRAMBLE = {at: [0, 2, 0], z: 6.5};
export const OPEN_N0 = 1100;             // the page's Shibuya shot: the green man comes on 0.3 s in (every 21 s, shibuya.js)
export const PULL_T = [1.2, 4.2];
export const cityN = (t) => OPEN_N0 + t * 30;   // the open and the dive run on one clock: one continuous take
// 2 · the dive into Tokyo Tower, then the landmarks; 3 · the fine work; 4 · the life (one page shot each, at frame n0)
export const TOWER = {at: [-106, -106, 46], z: 2.35};
export const SPOTS = [
  {id: 'station', at: [-18, -112, 10], z: [3.45, 3.7], n0: 330},
  {id: 'sensoji', at: [-12, 104, 12], z: [3.2, 3.42], n0: 830},
  {id: 'tsukiji', at: [88, 66, 8], z: [7.5, 8.1], n0: 640},
  {id: 'signs', at: [100, -106, 12], z: [6.4, 7.0], n0: 430},
  {id: 'sumo', at: [8, 206, 3], z: [6.4, 6.8], n0: 700},
  {id: 'incense', at: [2, 83, 4], z: [8.2, 8.6], n0: 820},
  {id: 'cosplay', at: [105, -95, 3], z: [7.8, 8.2], n0: 460},
  {id: 'wedding', at: [-104, -22, 3], z: [7.8, 8.2], n0: 545},
  {id: 'beach', at: [209, 22, 2], z: [7.2, 7.6], n0: 700},
];
// 5 · the seasons on the Sumida: the page's own wipe, pressed at these film times
export const SUMIDA = {at: [-102, 102, 0], z: 3.7};
export const SEASONS = ['spring', 'summer', 'autumn', 'winter'];
export const WIPES = [18.6, 20.4, 22.2];
export const SEASON_N0 = 900;            // the Sumida's own shot in the page's tour
// 6 · back out to the whole city in the snow, a little smaller and lower so the end card has the top of the frame
export const CLOSE_T = [24.6, 26.4];
export const END_CAM = {at: [0, 0, 0], z: 0.5, dy: 260};

const camOf = async (c) => { const k = await camAt(c.at, c.z); return {z: k.z, cx: k.cx, cy: k.cy - (c.dy || 0)}; };
const ctxOf = (id) => document.getElementById('cv-' + id).getContext('2d');
const Canvas = ({id}) => <canvas id={'cv-' + id} className="full" width="1080" height="1080" />;

// ---------- 1 · open: the scramble, then the whole city ----------
export function OpenView() { return <div className="city"><Canvas id="open" /></div>; }
export async function buildOpen(tl) {
  const s = shot('open'), A = await camOf(SCRAMBLE), B = await camOf(WIDE), step = ladder(A, B);
  onDrive('open', (l) => {
    if (l < 0 || l > s.end - s.start) return null;
    const t = s.start + l, u = inOut((t - PULL_T[0]) / (PULL_T[1] - PULL_T[0]));
    return paintMove('spring', cityN(t), zoomCam(A, B, u), ctxOf('open'), step);
  });
  cut(tl, s);
}

// ---------- 2 · the dive into the tower ----------
export function DiveView() { return <div className="city"><Canvas id="dive" /></div>; }
export async function buildDive(tl) {
  const s = shot('dive'), A = await camOf(WIDE), B = await camAt(TOWER.at, TOWER.z), dur = s.end - s.start, step = ladder(A, B);
  onDrive('dive', (l) => (l < 0 || l > dur) ? null : paintMove('spring', cityN(s.start + l), zoomCam(A, B, inOut(l / dur)), ctxOf('dive'), step));
  cut(tl, s);
}

// ---------- 3, 4 · one page shot each, a slow push ----------
export function spotView(m) { return function SpotView() { return <div className="city"><Canvas id={m.id} /></div>; }; }
export function spotBuilder(m) {
  return async (tl) => {
    const s = shot(m.id), dur = s.end - s.start, A = await camAt(m.at, m.z[0]), B = await camAt(m.at, m.z[1]), step = ladder(A, B, 1.02);
    onDrive(m.id, async (l) => {
      if (l < 0 || l > dur) return null;
      await purgeOnce('spring', m.id, s.start);                                   // a clean page for each close-up
      return paintMove('spring', m.n0 + l * 30, zoomCam(A, B, l / dur), ctxOf(m.id), step);
    });
    cut(tl, s);
  };
}

// ---------- 5 · the year on the Sumida ----------
export const seasonAt = (t) => WIPES.filter((w) => t >= w).length;          // index of the season being brushed on (or shown)
export const seasonN = (t) => SEASON_N0 + (t - shot('seasons').start) * 30;  // the Sumida runs on one clock to the end
export function SeasonsView() { return <div className="city"><Canvas id="seasons" /></div>; }
export async function buildSeasons(tl) {
  const s = shot('seasons'), dur = s.end - s.start, cam = await camAt(SUMIDA.at, SUMIDA.z);
  onDrive('seasons', (l) => {
    if (l < 0 || l > dur) return null;
    const t = s.start + l, i = seasonAt(t), ctx = ctxOf('seasons');
    if (i === 0) return paint('spring', seasonN(t), cam, ctx);
    const w = WIPES[i - 1], k = t - w;
    if (k >= WIPE_S) return paint(SEASONS[i], seasonN(t), cam, ctx);
    return paintWipe(SEASONS[i - 1], seasonN(w), SEASONS[i], seasonN(t), cam, ctx, k);   // the old season's last frame, frozen as the page keeps it
  });
  cut(tl, s);
}

// ---------- 6 · back out to the whole city in the snow; it stays, alive, under the end card ----------
export function CloseView() { return <div className="city"><Canvas id="close" /></div>; }
export async function buildClose(tl) {
  const s = shot('close'), A = await camAt(SUMIDA.at, SUMIDA.z), B = await camOf(END_CAM), step = ladder(A, B);
  onDrive('close', (l) => {
    if (l < 0) return null;
    const t = s.start + l, u = inOut((t - CLOSE_T[0]) / (CLOSE_T[1] - CLOSE_T[0]));
    return paintMove('winter', seasonN(t), zoomCam(A, B, u), ctxOf('close'), step);
  });
  cut(tl, s, s.start, 30);
}
