"""Add the accented letters the Atlas needs to Kevin Sans (MIT): Japanese macrons (ā ē ī ō ū), Turkish ş ğ İ Ç Ş Ğ.
Each new letter is the font's own base letter plus a mark lifted from the font itself (a comma-form cedilla from the comma, the dot
from i, the macron from a shrunk hyphen, the breve from a turned parenthesis), so the hand stays the same.
usage: python3 tools/extend-font.py   (rewrites src/styles/fonts/KevinSans-{Regular,Bold}.woff2 from fonts-orig/)"""
import os, shutil
from fontTools.ttLib import TTFont
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, 'src/styles/fonts-orig'); DST = os.path.join(ROOT, 'src/styles/fonts')

def contours(gs, name):
    r = RecordingPen(); gs[name].draw(r); out, cur = [], []
    for op in r.value:
        cur.append(op)
        if op[0] in ('closePath', 'endPath'): out.append(cur); cur = []
    return out
def key(c): return tuple(c[0][1][0]) if c and c[0][1] else None
def bounds_of(gs, cs):
    b = BoundsPen(gs)
    for c in cs:
        for op, args in c: getattr(b, op)(*args)
    return b.bounds
def replay(pen, cs):
    for c in cs:
        for op, args in c: getattr(pen, op)(*args)

def build(path_in, path_out):
    f = TTFont(path_in); gs = f.getGlyphSet(); cm = f.getBestCmap(); g = lambda ch: cm[ord(ch)]
    ups = f['OS/2'].sCapHeight or 700; xh = f['OS/2'].sxHeight or 500
    # marks
    # by position: the cedilla is what hangs below the baseline, the dot is what floats above the x-height
    dot = [c for c in contours(gs, g('i')) if bounds_of(gs, [c])[1] > xh * 0.85]
    def mark_from(ch, scale, rot):
        cs = contours(gs, g(ch)); bx = bounds_of(gs, cs); cx, cy = (bx[0] + bx[2]) / 2, (bx[1] + bx[3]) / 2
        import math
        c_, s_ = math.cos(rot) * scale, math.sin(rot) * scale
        rec = RecordingPen(); tp = TransformPen(rec, (c_, s_, -s_, c_, -cx * c_ + cy * s_, -cx * s_ - cy * c_)); replay(tp, cs)
        out, cur = [], []
        for op in rec.value:
            cur.append(op)
            if op[0] in ('closePath', 'endPath'): out.append(cur); cur = []
        return out
    macron = mark_from('-', 1.0, 0)
    cedilla = mark_from(',', 0.85, 0)                     # ç's own cedilla is fused to its c: the comma form, as Turkish often writes it
    breve = mark_from('(', 0.42, 1.5708)
    acute_top = lambda base: bounds_of(gs, contours(gs, base))[3]
    new = {}
    def add(ch, base_ch, mark, where):
        base = g(base_ch); bb = bounds_of(gs, contours(gs, base)); mb = bounds_of(gs, mark)
        mw, mh = mb[2] - mb[0], mb[3] - mb[1]; bxc = (bb[0] + bb[2]) / 2
        if where == 'above':
            gap = 70; dx = bxc - (mb[0] + mb[2]) / 2; dy = bb[3] + gap - mb[1]
            if mw > (bb[2] - bb[0]) * 0.95 and base_ch in 'aeiouıAEIOU':           # a macron no wider than the letter
                pass
        else:                                                                       # below: the cedilla hangs from the baseline
            dx = bxc - (mb[0] + mb[2]) / 2; dy = 0 - mb[3] + 40
        pen = TTGlyphPen(gs); replay(pen, contours(gs, base)); replay(TransformPen(pen, (1, 0, 0, 1, dx, dy)), mark)
        new[ch] = (pen.glyph(), f['hmtx'][base])
    for ch, b in zip('āēīōūĀĒĪŌŪ', 'aeıouAEIOU'): add(ch, b, macron, 'above')
    add('ğ', 'g', breve, 'above'); add('Ğ', 'G', breve, 'above')
    add('ş', 's', cedilla, 'below'); add('Ş', 'S', cedilla, 'below'); add('Ç', 'C', cedilla, 'below')
    add('İ', 'I', dot, 'above')
    order = f.getGlyphOrder()
    for ch, (glyph, mtx) in new.items():
        name = 'uni%04X' % ord(ch)
        if name in order: continue
        order.append(name); f['glyf'][name] = glyph; f['hmtx'][name] = mtx
        for t in f['cmap'].tables:
            if t.isUnicode(): t.cmap[ord(ch)] = name
    f.setGlyphOrder(order); f['maxp'].numGlyphs = len(order)
    f.flavor = 'woff2'; f.save(path_out)
    print(os.path.basename(path_out), 'added', ''.join(new))

if not os.path.isdir(SRC): shutil.copytree(DST, SRC)
for w in ('Regular', 'Bold'): build(os.path.join(SRC, f'KevinSans-{w}.woff2'), os.path.join(DST, f'KevinSans-{w}.woff2'))
