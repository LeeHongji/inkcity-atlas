'use strict';
/* Tokyo's guide: the words the page's guidebook shows (see gallery-src/src/guide/types.ts for the shape).
   Points are world coordinates [x, y, z]: a tile's local point plus the tile's centre. */
window.GUIDE = {
  city: 'Tokyo', local: '東京', lang: 'ja',
  intro: 'Edo became Tokyo, the "eastern capital", in 1868. Fourteen million people live here, yet the city still runs on small things: trains to the second, corner shrines, neighbourhood baths. Round it all runs the Yamanote line, a loop since 1925.',
  notes: [
    { at: [-210, -21, 30], dx: -147, dy: 104, w: 160, text: 'Mount Fuji, about 100 km away, shows from the city on clear winter mornings.' },
    { at: [-106, -106, 70], dx: -61, dy: -54, w: 225, text: 'Tokyo Tower, 333 m, painted orange and white for passing aircraft.' },
    { at: [73, -209, 90], dx: -54, dy: -117, w: 220, text: 'Tokyo Skytree: at 634 m, the tallest tower in the world.' },
    { at: [152, -152, 7], dx: 59, dy: 100, w: 245, text: 'The Yamanote line circles the centre. A full lap takes about an hour, and a train comes every few minutes.' },
    { at: [208, 8, 2], dx: 172, dy: 95, w: 250, text: 'Odaiba began as cannon forts against the "black ships" in 1853. The Rainbow Bridge leads there now.' },
    { at: [8, 208, 6], dx: -117, dy: -150, w: 180, text: 'Ryōgoku: sumō\'s home, with three grand tournaments a year.' },
  ],
  places: [
    { shot: 'tower', title: 'Tokyo Tower', local: '東京タワー',
      story: 'Built in 1958 for the television age, Tokyo Tower was meant to outdo the Eiffel Tower it resembles, and at 333 m it did. Its orange and white bands are a safety colour for aircraft, repainted every few years by hand.\n\nAt its feet stands Zōjō-ji, the family temple of the Tokugawa shoguns. Its great red gate dates from 1622 and survived the fires and the bombing that levelled most of old Edo.',
      look: [
        { at: [-106, -106, 43], z: 4.2, r: 9, text: 'The main deck, two fifths of the way up.' },
        { at: [-74, -84, 4], z: 6, r: 7, text: 'Zōjō-ji\'s great red gate.' },
        { at: [-124, -74, 1], z: 6.5, r: 8, text: 'Rows of little jizō in red bonnets, their pinwheels spinning: parents remember lost children here.' },
      ] },
    { shot: 'station', title: 'Tokyo Station', local: '東京駅',
      story: 'The red-brick Marunouchi building opened in 1914, designed by Tatsuno Kingo. Its domes burned in the air raids of 1945 and were rebuilt plainer; in 2012 they were restored exactly as first drawn.\n\nBehind the brick, more than three thousand trains a day come and go, from the Yamanote loop to the shinkansen. In front, a ginkgo avenue runs straight to the Imperial Palace.',
      look: [
        { at: [-26, -127.5, 30], z: 5.5, r: 6, text: 'A restored dome, with its little lantern on top.' },
        { at: [-17.2, -101, 1], z: 6, r: 8, text: 'The taxi rank of tall dark cabs.' },
        { at: [0, -78, 3], z: 5.5, r: 9, text: 'The ginkgo avenue. The ginkgo is Tokyo\'s tree.' },
      ] },
    { shot: 'akiba', title: 'Akihabara', local: '秋葉原',
      story: 'After the war, stalls under the railway sold radio parts to people rebuilding their lives. The stalls became an electronics town, and the electronics town became the capital of games, manga and anime.\n\nOn Sundays the main street closes to cars and becomes a "pedestrian paradise": cosplayers pose, maids hand out flyers for cafés, and the shops climb floor after floor.',
      look: [
        { at: [83.5, -105.5, 3], z: 6.5, r: 9, text: 'The crane-game arcade, its claw moving.' },
        { at: [100, -85, 2], z: 7, r: 6, text: 'A wall of capsule-toy machines.' },
        { at: [100, -108, 14], z: 4.6, r: 11, text: 'Signboards hung down every facade.' },
      ] },
    { shot: 'shitamachi', title: 'Shitamachi', local: '下町',
      story: '"The low city": the old Edo of merchants and craftsmen, below the hills where the samurai lived. Its lanes are narrow, its houses two storeys of wood, and its life happens in the street.\n\nFew homes here once had a bath, so every block had its sentō. Neighbours still meet there in the evening, under the tall chimney and the indigo curtain at the door.',
      look: [
        { at: [122, -14, 5], z: 6, r: 9, text: 'The sentō, its chimney breathing steam.' },
        { at: [75, -10, 10], z: 7, r: 6, text: 'A futon airing over a balcony rail.' },
        { at: [118, 18, 1], z: 6, r: 10, text: 'The playground, and the kids in yellow caps walking home.' },
      ] },
    { shot: 'tsukiji', title: 'Tsukiji Outer Market', local: '築地',
      story: 'For eighty years Tsukiji was the world\'s busiest fish market. In 2018 the wholesale market moved to Toyosu, but the outer market stayed: some four hundred little shops selling knives, dried fish, tea and breakfast.\n\nThe turret trucks still zip through the lanes, standing drivers at the wheel, and the queue for tamagoyaki, a sweet rolled omelette, starts early.',
      look: [
        { at: [73, 111, 2], z: 7.5, r: 6, text: 'The standing sushi counter. The chef faces you.' },
        { at: [91, 113, 2], z: 7.5, r: 6, text: 'The queue at the tamagoyaki window.' },
      ] },
    { shot: 'sensoji', title: 'Sensō-ji', local: '浅草寺',
      story: 'In the year 628, the story goes, two fishermen pulled a small golden statue of Kannon out of the Sumida in their net. The temple built for it is Tokyo\'s oldest.\n\nVisitors pass under the Thunder Gate and its giant red lantern, guarded by the gods of wind and thunder, then along Nakamise, one of Japan\'s oldest shopping streets. At the incense burner they waft the smoke over themselves: it is said to heal.',
      look: [
        { at: [2, 129.8, 8], z: 6.5, r: 6, text: 'The giant red lantern of the Thunder Gate.' },
        { at: [2, 114, 2], z: 6, r: 9, text: 'Nakamise\'s little stalls.' },
        { at: [2, 81.8, 3], z: 7, r: 5, text: 'The incense burner and its smoke.' },
        { at: [-26, 88, 14], z: 4.6, r: 9, text: 'The five-storey pagoda.' },
      ] },
    { shot: 'sumida', title: 'The Sumida River', local: '隅田川',
      story: 'In the 1700s the shogun Yoshimune planted cherry trees along the Sumida so that ordinary people would have somewhere to enjoy the spring. They still come: a blue tarp laid down at dawn to hold a place, then bento, beer and songs until dark.\n\nThe yakatabune, low pleasure boats with paper windows and red lanterns, have carried parties along the river since the Edo period.',
      look: [
        { at: [-83, 97, 4], z: 6, r: 8, text: 'The red arch bridge.' },
        { at: [-100, 97, -1], z: 5.5, r: 10, text: 'A yakatabune gliding under the bridge.' },
        { at: [-114, 74, 8], z: 5, r: 12, text: 'Lanterns strung between the cherry trees.' },
      ] },
    { shot: 'meiji', title: 'Meiji Jingū', local: '明治神宮',
      story: 'The shrine was built in 1920 for Emperor Meiji and Empress Shōken. Its forest was planted by hand, about a hundred thousand trees given from all over Japan, and a century later it has become a real wood in the middle of the city.\n\nBrewers give the shrine barrels of sake, stacked along the path. On the gravel a wedding procession walks slowly behind the priests, the bride under a red parasol, while on Yoyogi\'s lawn the rockabilly dancers twist on Sunday afternoons.',
      look: [
        { at: [-99, -14, 2], z: 6.5, r: 8, text: 'The wedding under the red parasol.' },
        { at: [-122, 24, 4], z: 7, r: 6, text: 'The wall of sake barrels.' },
        { at: [-112, 8, 10], z: 6, r: 6, text: 'The great wooden torii.' },
        { at: [-78, 10, 1], z: 6.5, r: 6, text: 'Rockabilly dancers on the lawn.' },
      ] },
    { shot: 'shibuya', title: 'Shibuya Crossing', local: '渋谷',
      story: 'When the lights change here, every car stops and the people cross at once, in every direction, the diagonals too. On a busy evening thousands cross in under a minute, and somehow nobody collides.\n\nBy the station sits Hachikō, the Akita dog who came to meet his master\'s train every day for nearly ten years after the professor had died. He is the city\'s favourite meeting point.',
      look: [
        { at: [-16.5, 19, 4], z: 7.5, r: 5, text: 'Hachikō on his plinth.' },
        { at: [-15, -15, 18], z: 4.5, r: 10, text: 'QFRONT\'s giant screen: a beckoning cat, a singer, an advert, in turn.' },
        { at: [-23.8, 13, 3], z: 7, r: 6, text: 'The kōban, the neighbourhood police box.' },
      ] },
  ],
  moment: { shot: 'shibuya', title: 'The Shibuya scramble',
    text: 'Road by road the cars get their green. Then every car light turns red at once, and the crowds waiting at all four corners step out together, straight across and corner to corner, a few hundred people in a few seconds.',
    when: 'It happens every 21 seconds here: watch the corners fill.' },
  // the other seasons (press S): what to look for changes where the season does
  seasons: {
    summer: { places: {
      station: { look: [
        { at: [-26, -127.5, 30], z: 5.5, r: 6, text: 'A restored dome, with its little lantern on top.' },
        { at: [-17.2, -101, 1], z: 6, r: 8, text: 'The taxi rank of tall dark cabs.' },
        { at: [0, -78, 3], z: 5.5, r: 9, text: 'The ginkgo avenue in full summer leaf. The ginkgo is Tokyo\'s tree.' },
      ] },
      shitamachi: { look: [
        { at: [122, -14, 5], z: 6, r: 9, text: 'The sentō, its chimney breathing steam.' },
        { at: [78, -10, 2], z: 7.5, r: 5, text: 'Morning glories climbing from the pots on the step, a bamboo blind over the window.' },
        { at: [75, -10, 10], z: 7, r: 6, text: 'A futon airing over a balcony rail.' },
        { at: [118, 18, 1], z: 6, r: 10, text: 'The playground, busy in the summer holidays.' },
      ] },
      sumida: {
        story: 'Japan\'s oldest fireworks began here in 1733, under the shogun Yoshimune, who also planted the cherry trees on these banks. On the last Saturday of July some twenty thousand shells go up over the Sumida from barges near Asakusa, and about a million people watch, half of them in yukata. The best places on the banks are held with tarps from noon.\n\nThe yakatabune, low pleasure boats with paper windows and red lanterns, have carried parties along the river since the Edo period.',
        look: [
          { at: [-104, 115, 0.5], z: 6.5, r: 8, text: 'Tarps laid out since noon, holding places for the fireworks.' },
          { at: [-113, 128.5, 6], z: 7, r: 7, text: 'Shaved ice under the flag that says 氷, "ice".' },
          { at: [-83, 97, 4], z: 6, r: 8, text: 'The red arch bridge.' },
          { at: [-106, 97, 28], z: 3.6, r: 16, text: 'At seven the fireworks begin over the river: switch to night to see them.' },
        ] },
    } },
    winter: { places: {
      station: { look: [
        { at: [-26, -127.5, 30], z: 5.5, r: 6, text: 'A restored dome, with its little lantern on top.' },
        { at: [-17.2, -101, 1], z: 6, r: 8, text: 'The taxi rank of tall dark cabs.' },
        { at: [0, -78, 3], z: 5.5, r: 9, text: 'The ginkgo avenue, bare in January. The ginkgo is Tokyo\'s tree.' },
      ] },
      shitamachi: { look: [
        { at: [122, -7, 2], z: 7, r: 7, text: 'Kadomatsu of pine and bamboo at the sentō door, and straw shimekazari over the doors: New Year decorations, up until the 7th.' },
        { at: [122, -14, 5], z: 6, r: 9, text: 'The sentō, its chimney breathing steam.' },
        { at: [87, 17, 5], z: 7, r: 6, text: 'A persimmon\'s last fruit, left on the bare branches.' },
        { at: [118, 31, 2], z: 7, r: 6, text: 'A small snowman in the playground.' },
      ] },
      sensoji: { look: [
        { at: [2, 129.8, 8], z: 6.5, r: 6, text: 'The giant red lantern of the Thunder Gate.' },
        { at: [2, 114, 2], z: 6, r: 9, text: 'Nakamise in the first week of January, busy with the year\'s first visits.' },
        { at: [2, 81.8, 3], z: 7, r: 5, text: 'The incense burner and its smoke.' },
        { at: [-26, 88, 14], z: 4.6, r: 9, text: 'The five-storey pagoda.' },
      ] },
      sumida: { look: [
        { at: [-83, 97, 4], z: 6, r: 8, text: 'The red arch bridge.' },
        { at: [-96, 98.6, -1], z: 6.5, r: 9, text: 'Black-headed gulls, Tokyo\'s own bird, wintering on the river.' },
        { at: [-100, 97, -1], z: 5.5, r: 10, text: 'A yakatabune gliding under the bridge.' },
      ] },
      meiji: {
        story: 'The shrine was built in 1920 for Emperor Meiji and Empress Shōken. Its forest was planted by hand, about a hundred thousand trees given from all over Japan, and a century later it has become a real wood in the middle of the city.\n\nNo shrine in Japan has more visitors at the New Year: about three million come in the first three days of January for hatsumode, the year\'s first prayer, and they keep coming through the first week. Snow is rare in central Tokyo, a few days a winter, but it does come: on 6 January 2022 ten centimetres fell, and the shrines were white for the New Year visits.',
        look: [
          { at: [-112, -21, 2], z: 6.5, r: 8, text: 'Hatsumode: waiting a turn to pray at the hall.' },
          { at: [-122, 24, 4], z: 7, r: 6, text: 'The wall of sake barrels.' },
          { at: [-112, 8, 10], z: 6, r: 6, text: 'The great wooden torii.' },
          { at: [-75.6, 28.2, 3], z: 7, r: 6, text: 'A snowman on Yoyogi\'s lawn.' },
          { at: [-78, 10, 1], z: 6.5, r: 6, text: 'Rockabilly dancers on the lawn.' },
        ] },
    } },
    autumn: { places: {
      tower: { look: [
        { at: [-106, -106, 43], z: 4.2, r: 9, text: 'The main deck, two fifths of the way up.' },
        { at: [-74, -84, 4], z: 6, r: 7, text: 'Zōjō-ji\'s great red gate.' },
        { at: [-95, -67, 5], z: 6, r: 8, text: 'Shiba Park\'s maples, turning. They are at their best in early December.' },
        { at: [-124, -74, 1], z: 6.5, r: 8, text: 'Rows of little jizō in red bonnets, their pinwheels spinning: parents remember lost children here.' },
      ] },
      station: { look: [
        { at: [-26, -127.5, 30], z: 5.5, r: 6, text: 'A restored dome, with its little lantern on top.' },
        { at: [-17.2, -101, 1], z: 6, r: 8, text: 'The taxi rank of tall dark cabs.' },
        { at: [0, -78, 3], z: 5.5, r: 9, text: 'The ginkgo avenue at the end of November, gold overhead and underfoot. The ginkgo is Tokyo\'s tree.' },
      ] },
      shitamachi: { look: [
        { at: [122, -14, 5], z: 6, r: 9, text: 'The sentō, its chimney breathing steam.' },
        { at: [75, -10, 10], z: 7, r: 6, text: 'A futon airing over a balcony rail.' },
        { at: [87, 17, 5], z: 6.5, r: 7, text: 'A persimmon in a garden, its fruit left on the branches.' },
        { at: [118, 18, 1], z: 6, r: 10, text: 'The playground, and the kids in yellow caps walking home.' },
      ] },
      sumida: { look: [
        { at: [-83, 97, 4], z: 6, r: 8, text: 'The red arch bridge.' },
        { at: [-100, 97, -1], z: 5.5, r: 10, text: 'A yakatabune gliding under the bridge.' },
        { at: [-100, 66, 8], z: 5, r: 12, text: 'The cherry trees in late autumn: their leaves turned rust, half of them already down.' },
      ] },
      meiji: { look: [
        { at: [-99, -14, 2], z: 6.5, r: 8, text: 'The wedding under the red parasol.' },
        { at: [-99, -13.6, 2], z: 7.5, r: 5, text: 'A Shichi-Go-San visit: the girl of seven holds her bag of chitose-ame, "thousand-year candy".' },
        { at: [-122, 24, 4], z: 7, r: 6, text: 'The wall of sake barrels.' },
        { at: [-112, 8, 10], z: 6, r: 6, text: 'The great wooden torii.' },
        { at: [-78, 10, 1], z: 6.5, r: 6, text: 'Rockabilly dancers on the lawn.' },
      ] },
    } },
  },
};
