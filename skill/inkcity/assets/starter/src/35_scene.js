'use strict';
/* The film script: shots, length, the ending, keys. Everything place-specific about the page lives here and in
   src/tiles/; the engine files (00..30, 80, 90) are the same for every scene.
   Wide px: the 1920x1080 frame of the whole world at zoom 1 (prj() maps world u to them). A shot is a zoom and the
   wide-px point at the centre of the frame. */
const SCENE = {
  title: 'Town',
  frames: 600,                         // f0..f599 at 30 fps: a 20 s film
  hold: 598,                           // the clock stops on this frame; later frames repeat it exactly
  fade: [575, 24],                     // the town fades to a pale ghost (1/24 of its ink) from frame a; hold - a = n - 1
  wide: { z: 1.85, cx: 960, cy: 585 }, // the establishing view the film starts and ends on
  shots: [
    { a: 0, z: 1.85, cx: 960, cy: 585, name: 'build' },      // the town draws itself
    { a: 150, z: 4.2, cx: 818, cy: 500, name: 'plaza' },      // names that match a tile are where a click on it goes
    { a: 270, z: 9, cx: 826, cy: 520, name: 'fountain' },     // a close-up: people read as people here
    { a: 360, z: 4.2, cx: 1104, cy: 666, name: 'park' },
    { a: 480, z: 1.85, cx: 960, cy: 585, name: 'wide' },
  ],
  boil: [0, 2, 5, 1, 4],               // which of the six line drawings each shot shows
  visit: ['plaza', 'park'],            // keys 1..9
  dive: { plaza: 'fountain' },         // a click on a place you are already framing goes in closer
  bounds: { z: [1.6, 12], cx: [480, 1440], cy: [330, 860] },
};
