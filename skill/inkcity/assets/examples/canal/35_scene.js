'use strict';
/* The film script: a canal town of three places strung along one canal (the church campo upstream, the café square
   in the middle, the market quay and boatyard downstream). 32 s at 30 fps:
   the town draws itself in the wide view (the canal first, then each place in a wave, its people popping in) and lives
   for a few seconds; then hard cuts: the church and its wedding, the café square, a gondola sliding under the white
   bridge, a close-up at a café table, the market; back to the wide view, which fades to a ghost and holds.
   Wide px: the 1920x1080 frame of the whole world at zoom 1. A shot is a zoom and the wide-px point at its centre. */
const SCENE = {
  title: 'Canal town',
  frames: 950,                          // f0..f949
  hold: 948,                            // the clock stops here; later frames repeat it exactly
  fade: [925, 24],                      // hold - a = n - 1: a faint ghost is left
  wide: { z: 1.22, cx: 960, cy: 545 },
  shots: [
    { a: 0, z: 1.22, cx: 960, cy: 545, name: 'build' },
    { a: 210, z: 3.2, cx: 690, cy: 322, name: 'church' },
    { a: 330, z: 4.0, cx: 975, cy: 560, name: 'cafe' },
    { a: 440, z: 6.6, cx: 1008, cy: 612, name: 'bridge' },
    { a: 570, z: 9.5, cx: 944, cy: 532, name: 'closeup' },
    { a: 670, z: 3.3, cx: 1282, cy: 738, name: 'market' },
    { a: 790, z: 1.22, cx: 960, cy: 545, name: 'wide' },
  ],
  boil: [0, 2, 5, 1, 4, 3, 2],
  visit: ['church', 'cafe', 'market', 'bridge'],
  dive: { cafe: 'closeup' },             // clicking the café again sits you down at the front table
  bounds: { z: [1.0, 12], cx: [300, 1620], cy: [150, 950] },
};
/* where each boat is along its lane at t = 0 (u from the lane's start). Lane +x: x = -158 + (s0 + 3.0 t) mod 316;
   lane -x: x = 158 - (s0 + 2.9 t) mod 316. g2 passes the church bridge in the church shot (t 9); g1's bow is about to
   come out from under the café bridge (x 14) as the bridge shot starts (t 14.7) and its gondolier comes out as it ends;
   the rowing boat crosses the café shot (t 12.8), the transport boat the market shot (t 24.3). The two lanes never
   meet, and boats in one lane keep their distance (g1 - g2 = 85 u, c1 - r1 = 177 u). */
const BOAT = { g1: 124, g2: 39, c1: 295.4, r1: 118.8 };
