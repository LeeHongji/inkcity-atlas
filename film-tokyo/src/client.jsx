import './fake-api.js';
import React from 'react';
import {createRoot} from 'react-dom/client';
import {flushSync} from 'react-dom';
import {Film} from './film.jsx';
import {seek, frame, master} from './engine.js';
import {SHOT_BUILDERS, pagesAt} from './shots/index.js';
import {release} from './city.js';
import {InkProvider} from '@/lib/ink/react/provider';
import plan from '../plan.json';
// If the product uses motion/framer-motion, make its micro-animations jump to the end state:
//   import {MotionGlobalConfig} from 'motion/react'; MotionGlobalConfig.skipAnimations = true;

const root = createRoot(document.getElementById('film-root'));
flushSync(() => root.render(<InkProvider tier="lo" motion="reduced"><Film /></InkProvider>));
// keep only the Tokyo pages the shots around t draw from (each is a whole city engine)
const keepFor = t => new Set(plan.shots.filter(s => t >= s.start - 0.8 && t < Math.max(s.end, s.keep || 0) + 0.8).flatMap(s => pagesAt(s.id, t)));
window.seek = async t => { release(keepFor(t)); return seek(t); };
window.__master = master;
window.__filmReady = (async () => {
  await document.fonts.ready;
  await new Promise(r => setTimeout(r, 800));   // fixture fetches and effects settle
  await frame(); await frame();
  // Builders run after layout exists: they can measure real component positions.
  // Builders may be async. Only await real Promises: a GSAP timeline is thenable and a paused one
  // never resolves, so `tl => tl.set(...)` returning the timeline must not be awaited.
  for (const build of Object.values(SHOT_BUILDERS)) { const r = build(master); if (r instanceof Promise) await r; }
  await window.seek(0);
})();
let t0 = null, req = null;
window.playFilm = () => { cancelAnimationFrame(req); t0 = null; const loop = async now => { t0 ??= now; await window.seek((now - t0) / 1000); req = requestAnimationFrame(loop); }; req = requestAnimationFrame(loop); };
window.stopFilm = () => cancelAnimationFrame(req);
