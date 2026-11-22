import React from 'react';
import {shot, onDrive} from '../engine.js';
import {useShotState} from '../film-store.js';
import {paint} from '../city.js';
import {IndexCard} from '@/components/ui/index-card';
import {Highlight} from '@/components/ui/highlight';
import {Lettering} from '@/components/ui/lettering';
import {W, write, lift, cut, PenArrow, drawArrow} from './common.jsx';

// The skill's own starter town (skill/inkcity/assets/starter), the page a new scene starts from.
// Placed right of centre so the card has the left half.
export const TOWN_CAM = {z: 1.7, cx: 700, cy: 560};
const PROMPT = 'Draw my home town as a living hand-inked map.';
const TYPE = [0.95, 2.05];                                  // shot-local seconds the prompt is typed over
// the town: drawn over 1.9..3.7 s (frames 0..118), then it lives on toward its own ghost fade (frames 575..598)
const B0 = 1.9, B1 = 3.7, NB = 118, LIVE = 536;   // LIVE: the ghost fade (575) starts 0.2 s into the end card
export const townFrame = l => l < B0 ? 0 : l < B1 ? (l - B0) / (B1 - B0) * NB : LIVE + (l - B1) * 30;

function Prompt() {
  const n = useShotState(l => Math.max(0, Math.min(PROMPT.length, Math.floor((l - TYPE[0]) / (TYPE[1] - TYPE[0]) * PROMPT.length))));
  return <div className="sk-prompt"><span className="sk-caret-mark">›</span> <span>{PROMPT.slice(0, n)}</span><i className="sk-caret" /></div>;
}

export function SkillView() {
  return <div className="skill">
    <canvas id="skill-cv" className="full" width="1920" height="1080" />
    <div className="sk-card-wrap" id="sk-card">
      <IndexCard seed="skill-card" tilt={-1.2} className="sk-card">
        <p className="sk-kicker">the skill behind the atlas</p>
        <Lettering as="h2" tone="grass" wobble={0.5} seed="draw-own" className="sk-h"><W id="sk-a">Draw your own city.</W></Lettering>
        <Prompt />
        <p className="sk-foot">inkcity · a skill for Claude Code · MIT</p>
      </IndexCard>
    </div>
    <PenArrow id="sk-arrow" from={[930, 700]} to={[1040, 640]} seed="town" />
  </div>;
}

export function buildSkill(tl) {
  const s = shot('skill'), dur = s.end - s.start;
  onDrive('skill', l => (l < 0 || l > dur) ? null : paint('starter', townFrame(l), TOWN_CAM, document.getElementById('skill-cv').getContext('2d')));
  cut(tl, s);
  tl.fromTo('#sk-card', {opacity: 0, y: 30, rotate: 1.5}, {opacity: 1, y: 0, rotate: 0, duration: 0.35, ease: 'power3.out', immediateRender: true}, s.start);
  write(tl, '#sk-a', s.start + 0.2, 24);
  drawArrow(tl, 'sk-arrow', s.start + B0 - 0.1, 0.35);
}

/* ---------- the end card: the same town goes on living and fades to a ghost underneath ---------- */
export function EndView() {
  return <div className="end">
    <canvas id="end-cv" className="full" width="1920" height="1080" />
    <div className="end-card">
      <Lettering as="h1" tone="marker" wobble={0.6} seed="title" className="end-name"><W id="end-a">inkcity Atlas</W></Lettering>
      <p className="end-url"><span id="end-url" className="w"><Highlight tone="yellow" seed="end-url">leehongji.github.io/inkcity-atlas</Highlight></span></p>
      <p className="end-repo" id="end-repo">github.com/LeeHongji/inkcity-atlas</p>
      <p className="end-en"><W id="end-en">open source, MIT</W></p>
    </div>
  </div>;
}

export function buildEnd(tl) {
  const s = shot('end'), dur = s.end - s.start, skillDur = shot('skill').end - shot('skill').start;
  onDrive('end', l => (l < 0 || l > dur) ? null : paint('starter', townFrame(skillDur + l), TOWN_CAM, document.getElementById('end-cv').getContext('2d')));
  cut(tl, s);
  let t = write(tl, '#end-a', s.start + 0.1, 16);
  t = write(tl, '#end-url', t + 0.1, 40);
  lift(tl, '#end-repo', t, 0.4);
  write(tl, '#end-en', t + 0.35, 24);
}
