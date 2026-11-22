"""Writes plan.json's sound cues and their action beats. Times come from the shot code: a caption is written at
16 characters a second for a lettered name and 30 for a hand note (src/shots/common.jsx), and the sounds below
start where those writes start. syncOffset is each file's audible onset (scripts/sfx_landmarks.py).
Usage: python3 audio/cues.py   (then run mix_audio.py)
"""
import json
from pathlib import Path

FILM = Path(__file__).resolve().parent.parent
plan = json.loads((FILM / 'plan.json').read_text())
S = {s['id']: s for s in plan['shots']}
ON = {'pen-065': .060, 'pen-080': .056, 'pen-090': .058, 'pen-105': .068, 'pen-110': .062, 'pen-130': .062, 'pen-140': .054, 'pen-150': .076,
      'pen-build-long': .285, 'pen-build-mid': .115, 'pen-build-short': .068, 'pen-loop': .089,
      'paper-slap': 0.0, 'tap-0': 0.0, 'tap-1': 0.0, 'tap-2': 0.0, 'click': .001, 'typing': .001}
actions = {k: [] for k in S}; cues = []

def cue(shot, aid, t, f, gain, what, req=True, duck=None):
    s = S[shot]
    actions[shot].append({'id': aid, 'at': round(t - s['start'], 3), 'action': what, 'soundRequired': req})
    c = {'at': round(t - ON[f], 3), 'syncOffset': ON[f], 'actionId': aid, 'file': f'assets/sfx/{f}.wav', 'gain': gain, 'role': 'sfx', 'kind': f}
    if duck: c['duck'] = duck
    cues.append(c)

PEN = lambda d: {'db': 1.5, 'attack': 0.08, 'hold': round(d * 0.7, 2), 'release': 0.35}   # the music barely moves for a pen
BED = lambda h: {'db': 2, 'attack': 0.2, 'hold': h, 'release': 0.5}
W = 1.5                                                                                      # writing gain
cue('open', 'open-lines', 0.6, 'pen-build-long', 1.3, 'Tokyo construction lines sweep across the paper', True, BED(2.6))
cue('open', 'open-title', 0.9, 'pen-105', 1.0, '"inkcity Atlas" is lettered on', True, PEN(1.0))
cue('open', 'open-sub', 2.07, 'pen-065', 1.0, '"twelve cities, drawn alive." is written on', False, PEN(0.65))
cue('tokyo', 'tokyo-cut', 4.8, 'paper-slap', 1.6, 'Hard cut; the taped label is pressed down')
cue('tokyo', 'tokyo-name', 4.85, 'pen-110', W, 'Label: "Tokyo", "the scramble crossing"', False, PEN(1.1))
cue('paris', 'paris-cut', 7.85, 'pen-140', W, 'Hard cut; label: "Paris", "round the Arc, never touching"', True, PEN(1.36))
cue('london', 'london-cut', 10.25, 'pen-105', W, 'Hard cut; label: "London", "Tower Bridge lifts"', True, PEN(1.05))
cue('venice', 'venice-cut', 13.25, 'pen-080', W, 'Hard cut; label: "Venice", "acqua alta"', True, PEN(0.8))
cue('barcelona', 'barcelona-build', 15.6, 'pen-build-short', 1.5, 'The plaza draws itself at the moment camera', True, BED(0.6))
cue('barcelona', 'barcelona-name', 15.75, 'pen-110', W, 'Label: "Barcelona", "a human tower"', False, PEN(1.08))
cue('chongqing', 'chongqing-cut', 18.65, 'pen-130', W, 'Hard cut; label: "Chongqing", "through the building"', True, PEN(1.3))
cue('guide', 'guide-place', 24.2, 'click', 1.8, 'Click "The Hutongs" in the guidebook; the camera glides in')
cue('guide', 'guide-label', 24.7, 'pen-150', 0.9, 'Label: "Every place has a story."', False, PEN(1.5))
cue('guide', 'guide-look', 26.4, 'click', 2.4, 'Click "A family round a table of dumplings"')
cue('guide', 'guide-loop', 27.2, 'pen-loop', 0.8, 'The red pen loop is drawn round the family', True, PEN(0.7))
for i in range(12):
    cue('twelve', 'twelve-drop' if i == 0 else f'twelve-drop-{i + 1}', 29.7 + 0.15 * i, f'tap-{i % 3}', round(1.7 - 0.045 * i, 3),
        f'Polaroid {i + 1} of 12 lands on the desk', i == 0, {'db': 2, 'attack': 0.02, 'hold': 0.08, 'release': 0.15})
cue('twelve', 'twelve-head', 31.4, 'pen-090', W, '"Twelve cities." is lettered on', False, PEN(0.9))
cue('twelve', 'twelve-note', 32.375, 'pen-140', W * 0.8, '"each one a single page that works offline" is written on', False, PEN(1.35))
cue('skill', 'skill-head', 34.4, 'pen-080', W, '"Draw your own city." is lettered on', False, PEN(0.8))
cue('skill', 'skill-type', 35.15, 'typing', 4.0, 'The prompt is typed into the card')
cue('skill', 'skill-type-2', 35.75, 'typing', 3.6, 'Typing continues', False)
cue('skill', 'skill-build', 36.1, 'pen-build-mid', 1.4, "The skill's starter town draws itself", True, BED(1.4))
cue('end', 'end-card', 39.1, 'pen-080', W, 'End card: "inkcity Atlas" is lettered on', True, PEN(0.8))
cue('end', 'end-url', 40.01, 'pen-080', 0.8, 'The address is written on', False, PEN(0.8))

for k, s in S.items(): s['actions'] = actions[k]
plan['audio']['cues'] = sorted(cues, key=lambda c: c['at'])
(FILM / 'plan.json').write_text(json.dumps(plan, ensure_ascii=False, indent=2))
print(len(cues), 'cues')
