"""Sound effects for "Press N", synthesised from seeded noise and sines (no samples, no recordings), all soft and smooth:
the keycap pressed (a muted thock), the day dropping away (a soft low swoop), the lamps coming on (glockenspiel notes
climbing E-flat major pentatonic), a caption glowing on (an airy shimmer), a city cut in (a warm bulb-on tick).
Usage: python3 audio/sfx.py   -> assets/sfx/*.wav (48 kHz, 16-bit mono)
"""
import numpy as np, wave
from pathlib import Path
from scipy.signal import butter, sosfilt

SR = 48000
OUT = Path(__file__).resolve().parent.parent / 'assets' / 'sfx'
OUT.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(2211)
def lp(x, f, o=2): return sosfilt(butter(o, f, btype='low', fs=SR, output='sos'), x)
def bp(x, a, b, o=2): return sosfilt(butter(o, [a, b], btype='band', fs=SR, output='sos'), x)
def hz(m): return 440.0 * 2 ** ((m - 69) / 12)
def save(name, x, peak_db=-12.0):
    x = np.asarray(x, dtype=np.float64); x = x / (np.max(np.abs(x)) + 1e-12) * 10 ** (peak_db / 20)
    fade = min(len(x), int(0.006 * SR)); x[-fade:] *= np.linspace(1, 0, fade)
    with wave.open(str(OUT / name), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(x, -1, 1) * 32767).astype('<i2').tobytes())
    print(f'{name:16s} {len(x) / SR:5.2f} s')

def key():
    """A keycap going down and coming up: a muted thock (low body, a soft felt click), then a lighter return."""
    n = int(0.36 * SR); k = np.arange(n) / SR
    body = np.sin(2 * np.pi * 170 * k) * np.exp(-k / 0.03) + 0.5 * np.sin(2 * np.pi * 340 * k) * np.exp(-k / 0.015)
    click = lp(bp(rng.standard_normal(n), 1500, 4200), 5000) * np.exp(-k / 0.004) * 0.6
    up_t = 0.12; u = np.clip(k - up_t, 0, None); on = (k >= up_t)
    up = (np.sin(2 * np.pi * 230 * u) * np.exp(-u / 0.018) * 0.35 + bp(rng.standard_normal(n), 1800, 4000) * np.exp(-u / 0.003) * 0.25) * on
    return (body + click + up) * np.minimum(1, k / 0.0015)

def drop():
    """The day dropping away: a soft low swoop, a filtered breath falling under a sine gliding down."""
    d = 0.9; n = int(d * SR); k = np.arange(n) / SR
    f = 230 * np.exp(-k * 1.1); tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.5
    air = lp(rng.standard_normal(n), 900) * 0.6
    env = np.minimum(1, k / 0.06) ** 2 * np.exp(-k / 0.35)
    return (tone + air) * env

def tink(m):
    """One lamp: a small glockenspiel note, soft mallet, long ring."""
    n = int(1.6 * SR); k = np.arange(n) / SR; f = hz(m)
    x = np.sin(2 * np.pi * f * k) * np.exp(-k / 0.75) + 0.35 * np.sin(2 * np.pi * f * 2.76 * k) * np.exp(-k / 0.16) + 0.12 * np.sin(2 * np.pi * f * 5.4 * k) * np.exp(-k / 0.05)
    return x * np.minimum(1, k / 0.002)

def shimmer():
    """Words glowing on: an airy rise and a few high bell partials, no grain."""
    d = 1.2; n = int(d * SR); k = np.arange(n) / SR
    air = bp(rng.standard_normal(n), 3000, 9000, 2) * 0.25
    env = np.sin(np.pi * np.clip(k / d, 0, 1)) ** 1.5
    bells = sum(np.sin(2 * np.pi * hz(m) * k + rng.uniform(0, 6)) * np.exp(-np.clip(k - dt, 0, None) / 0.5) * (k >= dt) * a
                for m, dt, a in [(87, 0.08, 0.5), (91, 0.16, 0.4), (94, 0.24, 0.35), (99, 0.32, 0.25)])
    return lp(air * env + bells * 0.5, 9000) * np.minimum(1, k / 0.01)

def light(m):
    """A city cut in: a bulb coming on, a warm low thump under a short bright tick, pitched to the chord."""
    n = int(0.7 * SR); k = np.arange(n) / SR
    thump = np.sin(2 * np.pi * hz(m - 24) * k) * np.exp(-k / 0.08) * 0.7
    tick = np.sin(2 * np.pi * hz(m) * k) * np.exp(-k / 0.22) * 0.5 + np.sin(2 * np.pi * hz(m) * 3 * k) * np.exp(-k / 0.04) * 0.15
    hiss = bp(rng.standard_normal(n), 2500, 7000) * np.exp(-k / 0.006) * 0.2
    return (thump + tick + hiss) * np.minimum(1, k / 0.002)

save('key.wav', key(), -10)
save('drop.wav', drop(), -14)
for i, m in enumerate([75, 77, 79, 82, 84, 87, 89, 91]):    # E-flat major pentatonic, climbing
    save(f'tink-{i}.wav', tink(m), -15)
save('shimmer.wav', shimmer(), -16)
for i, m in enumerate([75, 79, 82, 84]):
    save(f'light-{i}.wav', light(m), -14)
