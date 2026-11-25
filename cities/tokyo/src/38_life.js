'use strict';
/* Tokyo's life is the engine's life kit (engine/25_life.js: idle people, talking groups, photos, catch, chases, dog
   walks, pigeons), drawn with Tokyo's own people (TK.person: obi, a bride's hood, a priest's eboshi, randoseru, phones,
   fans, parasols). The tiles call it by its Tokyo names. */
K.lifePerson = TK.person;
Object.assign(TK, {
  ACTS: K.ACTS, day: K.day, doing: K.doing, idle: K.idle, group: K.group, photo: K.photo, chase: K.chase, toss: K.toss,
  dog2: K.dog2, dogWalk: K.dogWalk, pigeon2: K.pigeon2, pigeons: K.pigeons,
});
