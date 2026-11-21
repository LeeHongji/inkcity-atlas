"""A data card for a real landmark: what it is made of and how its parts are proportioned, from open data.

usage: python3 landmark.py "<name>" [--qid Q243] [--target 60] [--radius 90] [--out refs] [--photos 4]

Sources (all read-only, cached in <out>/.cache so each landmark is fetched once):
  Wikidata  height, architect, style, material, inception, coordinates, image
  OSM       building / building:part ways near the coordinates (Simple 3D Buildings tags: height, min_height,
            roof:shape, roof:height, building:colour, roof:colour, building:material) with their footprints
  Commons   a few photos with licences, to look at once before drawing

The card gives proportions and structure, not geometry to import: in an inkcity scene a person is ~6 u (1 u ~ 0.28 m)
and landmarks are drawn 10-20x shorter than true scale. --target is the height in u you mean to draw the tallest
part; every height and footprint is also given at that scale. Uses only the Python standard library.
The public Overpass servers are often busy: the script tries three of them with backoff and still writes the card
(without the OSM table) if all fail; run it again later to fill it in."""
import json, math, os, re, sys, time, hashlib, urllib.parse, urllib.request

UA = 'inkcity-landmark/0.2 (hand-drawn map illustrations; low volume, cached)'
OVERPASS = ['https://overpass-api.de/api/interpreter', 'https://overpass.private.coffee/api/interpreter',
            'https://overpass.kumi.systems/api/interpreter']


def args():
    a = sys.argv[1:]
    if not a or a[0].startswith('-'): sys.exit(__doc__)
    o = {'name': a[0], 'qid': None, 'target': None, 'radius': 90, 'out': 'refs', 'photos': 4}
    i = 1
    while i < len(a):
        k = a[i].lstrip('-'); v = a[i + 1]; i += 2
        o[k] = float(v) if k in ('target', 'radius') else int(v) if k == 'photos' else v
    return o


def get(url, data=None, cache=None, tries=1, label=''):
    if cache and os.path.exists(cache):
        return json.load(open(cache))
    last = None
    for t in range(tries):
        try:
            req = urllib.request.Request(url, data=data, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=60) as r:
                d = json.loads(r.read().decode('utf-8'))
            if cache:
                json.dump(d, open(cache, 'w'))
            return d
        except Exception as e:  # busy server, timeout, non-JSON error page
            last = e
            if t < tries - 1: time.sleep(4 * 2 ** t)
    raise RuntimeError('%s failed: %s' % (label or url[:60], last))


def wd_api(params, cache):
    return get('https://www.wikidata.org/w/api.php?' + urllib.parse.urlencode(dict(params, format='json')), cache=cache, tries=3, label='wikidata')


def claim_vals(ent, p):
    out = []
    for c in ent.get('claims', {}).get(p, []):
        v = c.get('mainsnak', {}).get('datavalue', {}).get('value')
        if v is not None: out.append(v)
    return out


def main():
    o = args(); out = o['out']; cdir = os.path.join(out, '.cache'); os.makedirs(cdir, exist_ok=True)
    slug = re.sub(r'[^a-z0-9]+', '-', o['name'].lower()).strip('-') or 'landmark'
    ck = lambda tag: os.path.join(cdir, slug + '.' + tag + '.json')

    # ---- Wikidata ----
    qid = o['qid']
    if not qid:
        s = wd_api({'action': 'wbsearchentities', 'search': o['name'], 'language': 'en', 'limit': 1}, ck('wdsearch'))
        if not s.get('search'): sys.exit('no Wikidata item for ' + o['name'] + ' (pass --qid)')
        qid = s['search'][0]['id']
    ent = wd_api({'action': 'wbgetentities', 'ids': qid, 'props': 'labels|descriptions|claims|sitelinks', 'languages': 'en|ja|zh|fr'}, ck('wd'))['entities'][qid]
    label = ent.get('labels', {}).get('en', {}).get('value', o['name'])
    desc = ent.get('descriptions', {}).get('en', {}).get('value', '')
    coord = claim_vals(ent, 'P625')
    height = [float(v['amount']) for v in claim_vals(ent, 'P2048')]
    refs = {p: [v['id'] for v in claim_vals(ent, p) if isinstance(v, dict) and 'id' in v] for p in ('P149', 'P84', 'P186', 'P31')}
    ids = sorted({i for l in refs.values() for i in l})
    names = {}
    if ids:
        e2 = wd_api({'action': 'wbgetentities', 'ids': '|'.join(ids[:50]), 'props': 'labels', 'languages': 'en'}, ck('wdlabels'))['entities']
        names = {k: v.get('labels', {}).get('en', {}).get('value', k) for k, v in e2.items()}
    lab = lambda p: ', '.join(names.get(i, i) for i in refs[p]) or '-'
    inception = ', '.join(v.get('time', '')[1:5] for v in claim_vals(ent, 'P571')) or '-'
    other = {k: ent.get('labels', {}).get(k, {}).get('value') for k in ('ja', 'zh', 'fr')}

    # ---- OSM parts ----
    parts, osm_note = [], ''
    if coord:
        lat, lon = coord[0]['latitude'], coord[0]['longitude']
        r = o['radius']
        q = ('[out:json][timeout:40];(way(around:%d,%f,%f)["building:part"];way(around:%d,%f,%f)[building];'
             'relation(around:%d,%f,%f)[building];);out tags geom;') % (r, lat, lon, r, lat, lon, r, lat, lon)
        cache = os.path.join(cdir, slug + '.osm.' + hashlib.md5(q.encode()).hexdigest()[:8] + '.json')
        d = None
        for ep in OVERPASS:
            try:
                d = get(ep, data=urllib.parse.urlencode({'data': q}).encode(), cache=cache, tries=2, label=ep.split('/')[2]); break
            except Exception as e:
                osm_note = str(e)
        if d is not None:
            osm_note = ''
            ky = 111320.0; kx = ky * math.cos(math.radians(lat))
            for el in d.get('elements', []):
                t = el.get('tags', {}); g = el.get('geometry') or []
                if el['type'] == 'relation':
                    g = [p for m in el.get('members', []) if m.get('role') == 'outer' for p in (m.get('geometry') or [])]
                pts = [((p['lon'] - lon) * kx, (p['lat'] - lat) * ky) for p in g if p]
                if len(pts) < 3: continue
                L, W, ang = min_rect(pts)
                cx = sum(p[0] for p in pts) / len(pts); cy = sum(p[1] for p in pts) / len(pts)
                num = lambda k: _num(t.get(k))
                h = num('height') or (num('building:levels') * 3.2 if num('building:levels') else None)
                parts.append({'name': t.get('name:en') or t.get('name') or '', 'kind': t.get('building:part') and ('part:' + t['building:part']) or ('building:' + t.get('building', 'yes')),
                              'h': h, 'min': num('min_height') or 0, 'roof': t.get('roof:shape', ''), 'roofh': num('roof:height'),
                              'col': t.get('building:colour', ''), 'rcol': t.get('roof:colour', ''), 'mat': t.get('building:material', '') or t.get('roof:material', ''),
                              'L': L, 'W': W, 'ang': ang, 'dx': cx, 'dy': cy, 'levels': t.get('building:levels', '')})
            parts.sort(key=lambda p: -(p['h'] or 0))
    else:
        osm_note = 'no coordinates on Wikidata'

    # ---- Commons photos ----
    photos = []
    try:
        pr = {'action': 'query', 'format': 'json', 'generator': 'search', 'gsrsearch': label + ' filetype:bitmap', 'gsrnamespace': 6,
              'gsrlimit': o['photos'], 'prop': 'imageinfo', 'iiprop': 'url|extmetadata', 'iiextmetadatafilter': 'LicenseShortName|Artist'}
        c = get('https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(pr), cache=ck('commons'), tries=2, label='commons')
        for p in sorted(c.get('query', {}).get('pages', {}).values(), key=lambda p: p.get('index', 0)):
            ii = p['imageinfo'][0]; m = ii.get('extmetadata', {})
            artist = re.sub('<[^>]+>', '', m.get('Artist', {}).get('value', ''))[:60]
            photos.append((p['title'][5:], m.get('LicenseShortName', {}).get('value', '?'), artist, ii.get('descriptionurl', ii['url'])))
    except Exception as e:
        photos.append(('(Commons search failed: %s)' % e, '', '', ''))

    # ---- the card ----
    top = max([p['h'] or 0 for p in parts] + height + [0])
    f = (o['target'] / top) if (o['target'] and top) else None
    U = lambda m: ('%.1f' % (m * f)) if (f and m is not None) else ''
    lines = ['# %s' % label, '', '%s. Wikidata [%s](https://www.wikidata.org/wiki/%s).' % (desc[:1].upper() + desc[1:] if desc else '', qid, qid), '']
    if any(other.values()): lines += ['Names: ' + ' · '.join('%s %s' % (k, v) for k, v in other.items() if v), '']
    lines += ['| fact | value |', '|---|---|', '| height | %s |' % (', '.join('%g m' % h for h in height) or '-'),
              '| style | %s |' % lab('P149'), '| architect | %s |' % lab('P84'), '| material | %s |' % lab('P186'),
              '| built | %s |' % inception, '| kind | %s |' % lab('P31'), '']
    if f: lines += ['Drawn with the tallest part at **%g u**: 1 m = %.3f u (true scale would be ~3.6 u per m).' % (o['target'], f), '']
    if parts:
        lines += ['## Parts from OpenStreetMap (within %d m, tallest first)' % o['radius'], '',
                  'Footprint: long × short side of the smallest box around it, its heading (deg from east, counter-clockwise), '
                  'and its centre offset east/north of the landmark point.', '',
                  '| part | kind | top m | base m | roof | colours | material | footprint m | heading | offset m | top u | footprint u |',
                  '|---|---|---|---|---|---|---|---|---|---|---|---|']
        for p in parts[:40]:
            roof = p['roof'] + (' %gm' % p['roofh'] if p['roofh'] else '')
            cols = ' / '.join(x for x in (p['col'], p['rcol']) if x)
            lines.append('| %s | %s | %s | %s | %s | %s | %s | %.0f × %.0f | %.0f | %+.0f, %+.0f | %s | %s |' % (
                p['name'][:28], p['kind'], '%g' % p['h'] if p['h'] else '?', '%g' % p['min'] if p['min'] else '0', roof, cols, p['mat'],
                p['L'], p['W'], p['ang'], p['dx'], p['dy'], U(p['h']), ('%s × %s' % (U(p['L']), U(p['W']))) if f else ''))
        if len(parts) > 40: lines.append('| … %d more | | | | | | | | | | | |' % (len(parts) - 40))
        lines.append('')
    else:
        lines += ['## Parts from OpenStreetMap', '', 'Not available: %s. Run again later.' % (osm_note or 'no mapped buildings near the point'), '']
    lines += ['## Photos to look at once (Wikimedia Commons)', '']
    for t, lic, art, url in photos:
        lines.append('- [%s](%s) · %s%s' % (t, url, lic, (' · ' + art) if art else '') if url else '- ' + t)
    lines += ['', 'Use for proportions, structure and colour; draw from understanding, never trace a photo.', '']
    path = os.path.join(out, slug + '.md'); open(path, 'w').write('\n'.join(lines))
    print(path, '·', label, '·', '%d OSM parts' % len(parts) if parts else 'no OSM parts (%s)' % (osm_note or 'none mapped')[:80])


def _num(v):
    if v is None: return None
    m = re.match(r'\s*([0-9.]+)', str(v))
    return float(m.group(1)) if m else None


def min_rect(pts):
    """long side, short side and heading (deg) of the smallest-area rectangle around the points"""
    hull = convex_hull(pts); best = None
    for i in range(len(hull)):
        (x0, y0), (x1, y1) = hull[i], hull[(i + 1) % len(hull)]
        a = math.atan2(y1 - y0, x1 - x0); c, s = math.cos(a), math.sin(a)
        us = [x * c + y * s for x, y in hull]; vs = [-x * s + y * c for x, y in hull]
        w, h = max(us) - min(us), max(vs) - min(vs)
        if best is None or w * h < best[0]: best = (w * h, w, h, a)
    _, w, h, a = best
    if h > w: w, h, a = h, w, a + math.pi / 2
    return w, h, math.degrees(a) % 180


def convex_hull(pts):
    p = sorted(set(pts))
    if len(p) < 3: return p
    cr = lambda o, a, b: (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
    lo, up = [], []
    for q in p:
        while len(lo) >= 2 and cr(lo[-2], lo[-1], q) <= 0: lo.pop()
        lo.append(q)
    for q in reversed(p):
        while len(up) >= 2 and cr(up[-2], up[-1], q) <= 0: up.pop()
        up.append(q)
    return lo[:-1] + up[:-1]


if __name__ == '__main__':
    main()
