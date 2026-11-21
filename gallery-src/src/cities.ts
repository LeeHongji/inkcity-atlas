export type City = {
  slug: string
  name: string
  local?: string          // the name in the city's own script, when it differs
  latin?: boolean         // local name in Latin letters (Venezia, Lisboa)
  fingerprint: string
  moment: string
  tag: string             // the moment, in two or three words, shown on the photo on hover
}

export const CITIES: City[] = [
  { slug: "tokyo", name: "Tokyo", local: "東京", tag: "Shibuya scramble",
    fingerprint: "The Yamanote loop on its brick viaduct, trains circling, izakaya in the arches.",
    moment: "Every light turns red and the whole crowd crosses at once, diagonals too." },
  { slug: "paris", name: "Paris", tag: "Place de l'Étoile",
    fingerprint: "The Seine and its quais, Haussmann limestone under zinc roofs, café terraces.",
    moment: "Twelve cars pour into the Étoile, weave round the Arc and never touch." },
  { slug: "newyork", name: "New York", tag: "Times Square",
    fingerprint: "The one-way grid, yellow cabs, bus lanes, fire escapes and water tanks.",
    moment: "The lights on Fifth turn green block by block ahead of a pack of cabs." },
  { slug: "london", name: "London", tag: "Tower Bridge",
    fingerprint: "The Thames between its embankments, red buses and black cabs keeping left.",
    moment: "Tower Bridge lifts for a tall ship while the traffic queues on both banks." },
  { slug: "barcelona", name: "Barcelona", tag: "Castellers",
    fingerprint: "The Eixample grid, every corner cut away into a small octagonal plaza.",
    moment: "Castellers build a human tower tier by tier, and the child at the top waves." },
  { slug: "venice", name: "Venice", local: "Venezia", latin: true, tag: "Acqua alta",
    fingerprint: "No cars at all: canals for streets, gondolas, vaporetti and delivery barges.",
    moment: "The tide floods San Marco and the raised walkways fill in single file." },
  { slug: "lisbon", name: "Lisbon", local: "Lisboa", latin: true, tag: "Tram 28",
    fingerprint: "Hills of tiled houses, wave-patterned squares and yellow trams grinding uphill.",
    moment: "Two number 28 trams squeeze past each other on the Alfama's single track." },
  { slug: "istanbul", name: "Istanbul", tag: "Galata Bridge",
    fingerprint: "The Golden Horn and the Bosphorus, ferries and gulls, domes, minarets and cats.",
    moment: "Anglers cast in a wave along the two-deck bridge as a ferry slides beneath." },
  { slug: "rio", name: "Rio de Janeiro", tag: "Sambadrome",
    fingerprint: "Sea, granite peaks and the black-and-white wave of the Copacabana promenade.",
    moment: "A samba school parades past the stands: floats, baianas and the drums." },
  { slug: "beijing", name: "Beijing", local: "北京", tag: "Tiananmen",
    fingerprint: "Hutong courtyards under golden ginkgo, wide avenues on the imperial axis.",
    moment: "The flag guard marches out of the gate and Chang'an Avenue stops for it." },
  { slug: "hongkong", name: "Hong Kong", local: "香港", tag: "Star Ferry",
    fingerprint: "Towers and neon on a harbour, double-decker trams keeping left along the shore.",
    moment: "One Star Ferry berths at Central just as the other casts off." },
  { slug: "chongqing", name: "Chongqing", local: "重庆", tag: "Liziba",
    fingerprint: "A city stacked on mountains, stairs and stilt houses where two rivers meet.",
    moment: "The monorail runs straight through a residential tower and out over the plaza." },
]
