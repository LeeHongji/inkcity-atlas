"""Original score for the inkcity Atlas film: 43.2 s, 100 BPM (a beat is 0.6 s), F major.
A sketchbook sound: felt piano, marimba, plucked strings, an upright-ish bass, glockenspiel for the twelve
Polaroids, and the lightest drums (shaker, a wooden knock, a soft kick). Harmony changes on the film's cuts,
so each city lands on its own chord. Synthesised with numpy from a fixed seed: no samples, no recordings.
Usage: python3 audio/score.py   -> assets/music.wav (48 kHz, 24-bit stereo)
"""
import numpy as np, wave
from pathlib import Path
from scipy.signal import butter, sosfilt, fftconvolve

SR, DUR, BEAT = 48000, 43.2, 0.6
N = int(SR * DUR)
rng = np.random.default_rng(1121)
OUT = Path(__file__).resolve().parent.parent / 'assets' / 'music.wav'
bus = {k: np.zeros((2, N)) for k in ('keys', 'mallet', 'pluck', 'bass', 'drums', 'glock')}

def hz(m): return 440.0 * 2 ** ((m - 69) / 12)
def lp(x, f, o=2): return sosfilt(butter(o, f, btype='low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, btype='high', fs=SR, output='sos'), x)
def bp(x, a, b, o=2): return sosfilt(butter(o, [a, b], btype='band', fs=SR, output='sos'), x)
def put(b, t, x, pan=0.0, gain=1.0):
    i = int(round(t * SR)); x = x[: max(0, N - i)]
    if i >= N or not len(x): return
    l, r = np.sqrt((1 - pan) / 2), np.sqrt((1 + pan) / 2)
    bus[b][0, i:i + len(x)] += x * l * gain; bus[b][1, i:i + len(x)] += x * r * gain

def felt(m, dur, vel=1.0):
    """Felt piano: soft hammer, partials that die faster as they climb, a muted thump."""
    n = int((dur + 1.2) * SR); k = np.arange(n) / SR; f = hz(m); x = np.zeros(n)
    for p in range(1, 9):
        fp = f * p * np.sqrt(1 + 0.00025 * p * p)
        if fp > 9000: break
        x += np.sin(2 * np.pi * fp * k + rng.uniform(0, 6.28)) * (1 / p ** 1.4) * np.exp(-k * (0.9 + 0.75 * p) * (f / 260) ** 0.3)
    x *= np.minimum(1, k / 0.007)
    rel = np.clip((dur + 0.35 - k) / 0.35, 0, 1); x *= rel
    thump = lp(rng.standard_normal(n), 300) * np.exp(-k / 0.02) * 0.15
    return (x + thump) * vel

def marimba(m, vel=1.0):
    n = int(1.0 * SR); k = np.arange(n) / SR; f = hz(m)
    x = np.sin(2 * np.pi * f * k) * np.exp(-k / 0.42) + 0.5 * np.sin(2 * np.pi * f * 3.93 * k) * np.exp(-k / 0.06) + 0.18 * np.sin(2 * np.pi * f * 9.2 * k) * np.exp(-k / 0.02)
    mallet = bp(rng.standard_normal(n), 800, 3000) * np.exp(-k / 0.004) * 0.25
    return (x * np.minimum(1, k / 0.002) + mallet) * vel

def pluck(m, vel=1.0, dur=1.6, bright=0.5):
    """Plucked string (Karplus-Strong), the melody voice."""
    f = hz(m); L = max(2, int(round(SR / f))); n = int(dur * SR)
    burst = lp(rng.standard_normal(L), 1500 + 5000 * bright)
    y = np.zeros(n); y[:L] = burst
    g = 0.996 ** (440 / f)
    for i in range(L, n):                      # averaging comb: the string
        y[i] = g * 0.5 * (y[i - L] + y[i - L - 1])
    k = np.arange(n) / SR
    return y / (np.max(np.abs(y)) + 1e-9) * np.minimum(1, (dur - k) / 0.1).clip(0) * vel

def bass(m, dur, vel=1.0):
    n = int((dur + 0.1) * SR); k = np.arange(n) / SR; f = hz(m)
    x = (np.sin(2 * np.pi * f * k) + 0.35 * np.sin(4 * np.pi * f * k) * np.exp(-k * 5) + 0.12 * np.sin(6 * np.pi * f * k) * np.exp(-k * 9))
    env = np.minimum(1, k / 0.006) * np.exp(-k * 2.2) * np.clip((dur + 0.08 - k) / 0.08, 0, 1)
    return lp(x * env, 900) * vel

def glock(m, vel=1.0):
    n = int(1.6 * SR); k = np.arange(n) / SR; f = hz(m)
    x = np.sin(2 * np.pi * f * k) * np.exp(-k / 0.7) + 0.4 * np.sin(2 * np.pi * f * 2.76 * k) * np.exp(-k / 0.18) + 0.2 * np.sin(2 * np.pi * f * 5.4 * k) * np.exp(-k / 0.05)
    return x * np.minimum(1, k / 0.001) * vel

def shaker(vel=1.0):
    n = int(0.09 * SR); k = np.arange(n) / SR
    return bp(rng.standard_normal(n), 4500, 11000) * np.minimum(1, k / 0.01) * np.exp(-k / 0.025) * vel
def knock(vel=1.0):
    n = int(0.15 * SR); k = np.arange(n) / SR
    return (bp(rng.standard_normal(n), 1400, 2600, 3) * np.exp(-k / 0.018) * 2 + np.sin(2 * np.pi * 820 * k) * np.exp(-k / 0.03) * 0.5) * vel
def kick(vel=1.0):
    n = int(0.3 * SR); k = np.arange(n) / SR
    f = 62 + 70 * np.exp(-k / 0.03)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-k / 0.12) * vel

# ---------- harmony: (time, chord as MIDI notes, bass root) ----------
CH = {   # piano voicings, MIDI
    'Fmaj7': [53, 57, 60, 64], 'Fadd9': [53, 57, 60, 67], 'Dm9': [50, 53, 57, 60, 64], 'Am7': [57, 60, 64, 67],
    'Bbmaj7': [58, 62, 65, 69], 'C': [60, 64, 67, 72], 'Dm7': [57, 60, 62, 65], 'Gm7': [55, 58, 62, 65],
    'C/E': [52, 55, 60, 64], 'C7sus': [60, 65, 67, 70], 'Fmaj9': [41, 48, 57, 64, 67],
}
ROOT = {'Fmaj7': 41, 'Fadd9': 41, 'Dm9': 50, 'Am7': 45, 'Bbmaj7': 46, 'C': 48, 'Dm7': 50, 'Gm7': 43, 'C/E': 40, 'C7sus': 48, 'Fmaj9': 41}
PLAN = [  # the cuts are in plan.json; every city gets its own chord
    (0.0, 'Fmaj7'), (2.4, 'Dm9'),
    (4.8, 'Fadd9'), (7.8, 'Am7'), (10.2, 'Bbmaj7'), (13.2, 'C'), (15.6, 'Dm7'), (18.6, 'Bbmaj7'), (20.4, 'C7sus'),
    (21.0, 'Fmaj7'), (23.4, 'Gm7'), (25.8, 'Am7'), (28.2, 'Bbmaj7'), (28.8, 'C7sus'),
    (29.4, 'Fadd9'), (30.6, 'C/E'), (31.8, 'Dm7'), (33.0, 'Bbmaj7'),
    (34.2, 'Bbmaj7'), (35.4, 'C'), (36.6, 'Am7'), (37.8, 'Dm7'), (38.4, 'Gm7'), (38.7, 'C7sus'),
    (39.0, 'Fmaj9'),
]
def chord_at(t):
    c = PLAN[0][1]
    for a, name in PLAN:
        if t >= a - 1e-6: c = name
    return c
spans = [(a, (PLAN[i + 1][0] if i + 1 < len(PLAN) else DUR), name) for i, (a, name) in enumerate(PLAN)]

# ---------- sections ----------
INTRO, MONT, GUIDE, TWELVE, SKILL, END = (0, 4.8), (4.8, 21.0), (21.0, 29.4), (29.4, 34.2), (34.2, 39.0), (39.0, DUR)
def within(t, s): return s[0] - 1e-6 <= t < s[1] - 1e-6

# felt piano: every chord, rolled; softer in the guide, held at the end
for a, b, name in spans:
    vel = 0.42 if within(a, GUIDE) else 0.55 if within(a, INTRO) else 0.5
    for i, m in enumerate(CH[name]):
        put('keys', a + i * 0.018, felt(m, (b - a) if name != 'Fmaj9' else 3.6, vel * (1 - 0.06 * i)), pan=-0.3 + 0.2 * i)

# bass: from the montage on; roots on the beat, a fifth on the "and" of 2, long notes in the guide, a walk into the end
for a, b, name in spans:
    if a < 4.8 or a >= 39.0: continue
    r = ROOT[name]
    if within(a, GUIDE):
        put('bass', a, bass(r, b - a - 0.05, 0.8)); continue
    t = a
    while t < b - 1e-6:
        beat = round(t / BEAT) % 4
        put('bass', t, bass(r + (7 if beat == 2 else 12 if beat == 3 and b - a > 1.5 else 0), BEAT * 0.9, 0.85 if beat == 0 else 0.7))
        t += BEAT
for i, m in enumerate([50, 52, 53, 55, 57, 58, 59, 60]):       # 37.8 -> 39.0 walk up, landing on F
    put('bass', 37.8 + i * 0.15, bass(m, 0.14, 0.6))
put('bass', 39.0, bass(41, 3.4, 1.0))

# marimba: eighth-note arpeggios from 2.4 s; quarter notes in the guide; a roll on the last chord
PAT = [0, 2, 1, 3, 2, 1, 3, 2]
t = 2.4
while t < 39.0 - 1e-6:
    name = chord_at(t); notes = sorted(CH[name]); step = int(round(t / (BEAT / 2)))
    if within(t, GUIDE):
        if step % 2 == 0: put('mallet', t, marimba(notes[PAT[step % 8] % len(notes)] + 12, 0.32), pan=0.25)
    else:
        put('mallet', t, marimba(notes[PAT[step % 8] % len(notes)] + 12, 0.42 if step % 2 == 0 else 0.3), pan=0.3 if step % 2 else -0.1)
    t += BEAT / 2
for i, m in enumerate([65, 69, 72, 76, 79, 81]):
    put('mallet', 39.0 + i * 0.05, marimba(m, 0.35), pan=-0.4 + 0.16 * i)

# plucked melody: a short figure on each city (lands on the cut), sparse in the guide
FIG = {'Fadd9': [77, 79, 81], 'Am7': [76, 79, 81], 'Bbmaj7': [77, 81, 82], 'C': [79, 76, 72], 'Dm7': [77, 74, 81], 'C7sus': [77, 79],
       'Fmaj7': [81, 79], 'Gm7': [82, 77], 'C/E': [79, 76]}
for a, b, name in spans:
    if not (within(a, MONT) or within(a, TWELVE) or within(a, SKILL) or within(a, GUIDE)) or name not in FIG: continue
    fig = FIG[name]
    if within(a, GUIDE):
        put('pluck', a + BEAT, pluck(fig[0], 0.5, 2.0, 0.35), pan=0.2); continue
    for i, m in enumerate(fig):
        if a + i * BEAT < b - 0.05: put('pluck', a + i * BEAT * (0.5 if within(a, MONT) else 1), pluck(m, 0.75 if i == 0 else 0.5, 1.4, 0.55), pan=0.15)
put('pluck', 39.0, pluck(84, 0.6, 3.0, 0.4), pan=0.1)

# glockenspiel: one note per Polaroid as it lands (29.7 + 0.15 i), climbing F major; a sparkle on the end
for i, m in enumerate([77, 79, 81, 84, 86, 88, 89, 91, 93, 96, 98, 100]):
    put('glock', 29.7 + i * 0.15, glock(m, 0.55 - 0.015 * i), pan=-0.5 + i / 11)
put('glock', 39.0, glock(89, 0.45)); put('glock', 39.3, glock(96, 0.3))

# drums: montage, twelve and skill only; shaker sixteenths, knock on 2 and 4, a soft kick on 1 and 3
t = 4.8
while t < 39.0 - 1e-6:
    if not within(t, GUIDE):
        s16 = int(round(t / (BEAT / 4))); beat = (s16 // 4) % 4
        put('drums', t, shaker(0.5 if s16 % 4 == 2 else 0.3 if s16 % 2 == 0 else 0.18), pan=0.35)
        if s16 % 4 == 0 and beat in (1, 3): put('drums', t, knock(0.55), pan=-0.15)
        if s16 % 4 == 0 and beat in (0, 2): put('drums', t, kick(0.5))
    t += BEAT / 4

# ---------- mix ----------
GAIN = {'keys': 0.55, 'mallet': 0.58, 'pluck': 0.5, 'bass': 0.36, 'drums': 0.38, 'glock': 0.34}
dry = sum(bus[k] * g for k, g in GAIN.items())
dry[0] = hp(dry[0], 55); dry[1] = hp(dry[1], 55)   # keep the low end light: this is a sketchbook, not a club
# a small room: decaying, decorrelated noise as the impulse response
ir_n = int(1.8 * SR); k = np.arange(ir_n) / SR
irL = lp(rng.standard_normal(ir_n), 6000) * np.exp(-k / 0.45); irR = lp(rng.standard_normal(ir_n), 6000) * np.exp(-k / 0.45)
send = (bus['keys'] * 0.6 + bus['mallet'] * 0.5 + bus['pluck'] * 0.7 + bus['glock'] * 0.8)
wetL = fftconvolve(send[0], irL)[:N]; wetR = fftconvolve(send[1], irR)[:N]
wet = np.stack([wetL, wetR]); wet *= 0.22 / (np.max(np.abs(wet)) + 1e-9) * np.max(np.abs(dry))
mix = dry + wet
tail = np.arange(N) / SR; mix *= np.clip((DUR - tail) / 1.0, 0, 1)        # the last second fades out
mix /= np.max(np.abs(mix)) + 1e-9; mix *= 10 ** (-3 / 20)
OUT.parent.mkdir(parents=True, exist_ok=True)
pcm = (np.clip(mix.T, -1, 1) * 8388607).astype('<i4')
with wave.open(str(OUT), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(3); w.setframerate(SR)
    w.writeframes(pcm.reshape(-1).view('<u1').reshape(-1, 4)[:, :3].tobytes())   # 24-bit little-endian
print('wrote', OUT, f'{DUR} s')
