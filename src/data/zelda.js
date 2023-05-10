const platforms = {
  nes: "Nintendo Entertainment System",
  gb: "Game Boy",
  snes: "Super Nintendo Entertainment System",
  n64: "Nintendo 64",
  gba: "Game Boy Advance",
  gcn: "Nintendo GameCube",
  wii: "Nintendo Wii",
  nds: "Nintendo DS",
  n3ds: "Nintendo 3DS",
  nsw: "Nintendo Switch",
};

export const types = {
  main: "MAIN",
  fourSwords: "FOUR_SWORDS",
  ds: "DS",
};

// Figuring out a data structure that makes sense here
export const allGames = [
  {
    id: "LOZ",
    name: "The Legend of Zelda",
    shareName: "The Legend of Zelda",
    type: types.main,
    emoji: `🧝🏻`,
  },
  {
    id: "AOL",
    name: "Zelda II: The Adventure of Link",
    shareName: "Zelda II",
    type: types.main,
    emoji: `🛌`,
  },
  {
    id: "LTTP",
    name: "The Legend of Zelda: A Link to the Past",
    shareName: "A Link to the Past",
    type: types.main,
    emoji: `🐓`,
  },
  {
    id: "LA",
    name: "The Legend of Zelda: Link's Awakening",
    shareName: "Link's Awakening",
    type: types.main,
    emoji: `🐟`,
  },
  {
    id: "OOT",
    name: "The Legend of Zelda: Ocarina of Time",
    shareName: "Ocarina of Time",
    type: types.main,
    emoji: "🪈",
  },
  {
    id: "MM",
    name: "The Legend of Zelda: Majora's Mask",
    shareName: "Majora's Mask",
    type: types.main,
    emoji: `🎭`,
  },
  {
    id: "OOA",
    name: "The Legend of Zelda: Oracle of Ages",
    shareName: "Oracle of Ages",
    type: types.main,
    emoji: `⏱️`,
  },
  {
    id: "OOS",
    name: "The Legend of Zelda: Oracle of Seasons",
    shareName: "Oracle of Seasons",
    type: types.main,
    emoji: `🍂`,
  },
  {
    id: "FS",
    name: "The Legend of Zelda: Four Swords",
    shareName: "Four Swords",
    type: types.fourSwords,
    emoji: `⚔️`,
  },
  {
    id: "WW",
    name: "The Legend of Zelda: The Wind Waker",
    shareName: "Wind Waker",
    type: types.main,
    emoji: `⛵️`,
  },
  {
    id: "FSA",
    name: "The Legend of Zelda: Four Swords Adventures",
    shareName: "Four Swords Adventures",
    type: types.fourSwords,
    emoji: `👨‍👨‍👦‍👦`,
  },
  {
    id: "MC",
    name: "The Legend of Zelda: The Minish Cap",
    shareName: "Minish Cap",
    type: types.main,
    emoji: `🔍`,
  },
  {
    id: "TP",
    name: "The Legend of Zelda: Twilight Princess",
    shareName: "Twilight Princess",
    type: types.main,
    emoji: `🐺`,
  },
  {
    id: "PH",
    name: "The Legend of Zelda: Phantom Hourglass",
    shareName: "Phantom Hourglass",
    type: types.ds,
    emoji: `⏳`,
  },
  {
    id: "ST",
    name: "The Legend of Zelda: Spirit Tracks",
    shareName: "ST",
    type: types.ds,
    emoji: `🚂`,
  },
  {
    id: "SS",
    name: "The Legend of Zelda: Skyward Sword",
    shareName: "Skyward Sword",
    type: types.main,
    emoji: `🦩`,
  },
  {
    id: "ALBW",
    name: "The Legend of Zelda: A Link Between Worlds",
    shareName: "A Link Between Worlds",
    type: types.main,
    emoji: `🐇`,
  },
  {
    id: "TFH",
    name: "The Legend of Zelda: Tri Force Heroes",
    shareName: "Tri Force Heroes",
    type: types.fourSwords,
    emoji: `👨‍👦‍👦`,
  },
  {
    id: "BOTW",
    name: "The Legend of Zelda: Breath of the Wild",
    shareName: "Breath of the Wild",
    type: types.main,
    emoji: `🏔️`,
  },
  {
    id: "TOTK",
    name: "The Legend of Zelda: Tears of the Kingdom",
    shareName: "Tears of the Kingdom",
    type: types.main,
    emoji: `🥹`,
  },
];
