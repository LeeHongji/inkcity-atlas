'use strict';
SF.tile('kit', 0, 0, {}, function (T) {
  T.ground(function (g) { K.slab(g, 37, { top: BC.ground }); });
  T.obj([-30, -10, 0, 0], (g) => { K.box(g, -30, -10, 0, 0, 0, 9, { t: '#C9B7A0', l: BC.red, r: shade(BC.red, 0.12) }, { w: 1 }); });
  T.obj([5, -10, 35, 0], (g) => { K.box(g, 5, -10, 35, 0, 0, 9, { t: '#C9B7A0', l: BC.red, r: shade(BC.red, 0.12) }, { w: 1 }); K.box(g, 5, -10, 35, 0, 0, 1.0, { t: '#C9C3B5', l: '#D7D1C3', r: '#BDB7A9' }, { w: 0.6, boil: false, nohid: true }); });
  T.obj([5, 10, 35, 20], (g) => { K.box(g, 5, 10, 35, 20, 0, 9, { t: '#C9B7A0', l: BC.red, r: shade(BC.red, 0.12) }, { w: 1 }); BJ.rail(g, 5.3, 10.3, 34.7, 19.7, 9, { h: 1.0, back: true }); });
});
