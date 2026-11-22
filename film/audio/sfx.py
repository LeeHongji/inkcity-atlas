"""Sound effects for the inkcity Atlas film, synthesised from seeded noise (no samples, no recordings).
A soft pen gliding on paper (smooth, no grain), a pen sketching construction lines, the red pen loop, a paper label slapped down and a
Polaroid landing on a desk. The click and typing sounds are the video skill's own originals (assets/sfx).
Usage: python3 audio/sfx.py   -> assets/sfx/*.wav (48 kHz, 16-bit mono)
"""
import numpy as np, wave
from pathlib import Path
from scipy.signal import butter, sosfilt

SR = 48000
OUT = Path(__file__).resolve().parent.parent / 'assets' / 'sfx'
OUT.mkdir(parents=True, exist_ok=True)

def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], btype='band', fs=SR, output='sos'), x)
def lp(x, hi, order=2):
    return sosfilt(butter(order, hi, btype='low', fs=SR, output='sos'), x)
def save(name, x, peak_db=-12.0):
    x = np.asarray(x, dtype=np.float64)
    x = x / (np.max(np.abs(x)) + 1e-12) * 10 ** (peak_db / 20)
    fade = min(len(x), int(0.004 * SR)); x[-fade:] *= np.linspace(1, 0, fade)
    with wave.open(str(OUT / name), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype('<i2').tobytes())
    print(f'{name:22s} {len(x) / SR:5.2f} s')

def soft_noise(rng, n):
    """Pinkish noise (white noise through gentle low-passes): no single bright band to rasp."""
    x = rng.standard_normal(n)
    return lp(x, 2600, 1) * 0.7 + lp(x, 900, 1) * 0.5

def glide(rng, n, lo=500, hi=3200):
    """A soft-tip pen gliding on smooth paper: a warm, airy hiss with no grain or tooth."""
    body = bp(soft_noise(rng, n), lo, hi, 2)
    air = bp(rng.standard_normal(n), hi, 6500, 1) * 0.12
    return body + air

def smooth_env(rng, dur, stroke=(0.16, 0.34), overlap=0.45, floor=0.32):
    """Strokes as overlapping raised-cosine swells: pressure rises and falls, the pen never snaps off the page."""
    n = int(dur * SR); env = np.zeros(n); t = 0.0
    while t < dur:
        L = rng.uniform(*stroke); a, b = int(t * SR), min(n, int((t + L) * SR))
        if b > a:
            w = np.hanning(int(L * SR))[: b - a]; w = np.pad(w, (0, b - a - len(w))) * rng.uniform(0.75, 1.0)
            env[a:b] = np.maximum(env[a:b], w)
        t += L * (1 - overlap)
    k = np.arange(n) / SR
    env = floor + (1 - floor) * lp(env, 12, 2)                     # slow, round pressure changes only
    return env * np.clip(k / 0.06, 0, 1) ** 2 * np.clip((dur - k) / 0.14, 0, 1) ** 2   # eased in and out

def writing(seed, dur):
    """Handwriting: one continuous glide with a gentle swell per stroke."""
    rng = np.random.default_rng(seed)
    return glide(rng, int(dur * SR)) * smooth_env(rng, dur)

def sketching(seed, dur, fade_in=0.35, fade_out=0.5):
    """Construction lines: a quieter, wider wash of long light strokes."""
    rng = np.random.default_rng(seed); n = int(dur * SR); k = np.arange(n) / SR
    x = glide(rng, n, 400, 2400) * smooth_env(rng, dur, (0.3, 0.6), 0.5, 0.45)
    return x * np.clip(k / fade_in, 0, 1) ** 2 * np.clip((dur - k) / fade_out, 0, 1) ** 2

def loop(seed, dur=0.75):
    """The red pen circling: one unbroken stroke that swells round the curve."""
    rng = np.random.default_rng(seed); n = int(dur * SR); k = np.arange(n) / SR
    env = np.sin(np.pi * np.clip(k / dur, 0, 1)) ** 0.8 * (0.85 + 0.15 * np.sin(2 * np.pi * 1.3 * k))
    return glide(rng, n, 550, 3000) * env

def slap(seed):
    """A taped paper label pressed down: a soft papery puff and a dull knock."""
    rng = np.random.default_rng(seed); n = int(0.28 * SR); k = np.arange(n) / SR
    puff = lp(rng.standard_normal(n), 2600) * np.exp(-k / 0.035)
    knock = np.sin(2 * np.pi * 140 * k) * np.exp(-k / 0.05)
    return puff + 0.6 * knock

def tap(seed, pitch):
    """A Polaroid landing flat on a desk: a light card snap over a short wooden tock."""
    rng = np.random.default_rng(seed); n = int(0.22 * SR); k = np.arange(n) / SR
    snap = bp(rng.standard_normal(n), 1200, 5200) * np.exp(-k / 0.012)
    tock = np.sin(2 * np.pi * pitch * k) * np.exp(-k / 0.045)
    return 0.8 * snap + tock

# one writing sound per caption, as long as the words take to write (shot times in plan.json)
for i, dur in enumerate([0.65, 0.8, 0.9, 1.05, 1.1, 1.3, 1.4, 1.5]):
    save(f'pen-{int(dur * 100):03d}.wav', writing(60 + i, dur), -14)
save('pen-build-long.wav', sketching(21, 3.4), -17)   # the opening build
save('pen-build-short.wav', sketching(22, 1.0, 0.08, 0.25), -16)
save('pen-build-mid.wav', sketching(23, 1.9, 0.12, 0.4), -16)
save('pen-loop.wav', loop(31), -13)
save('paper-slap.wav', slap(41), -12)
for i, p in enumerate([190, 205, 178]):
    save(f'tap-{i}.wav', tap(50 + i, p), -12)
