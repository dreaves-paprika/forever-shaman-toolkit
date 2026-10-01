/* Shaman Forever TL;DR: gear data shared by the gear guide, the dungeon planner and the party board.
   Item stats come from Wowhead's Forever database; see the gear guide's notes and sources. */
(() => {
"use strict";

const PROFS = [["lw", "Leatherworking"], ["tail", "Tailoring"], ["eng", "Engineering"], ["ench", "Enchanting"]];
const PROF_NAME = { lw: "Leatherworking", tail: "Tailoring", eng: "Engineering", ench: "Enchanting" };

/* Item data: stats are Wowhead Forever tooltip values. w = [min, max, speed, dps].
   fac marks an item that only comes from a faction-locked quest turn-in ("h" for Horde); items with no fac
   drop from a boss or vendor with no faction lock, even where only one faction can reach them today.
   rc restricts an item to specific races (site race keys), for the handful that are race-gated in Forever. */
const ITEMS = {
  smite: { n: "Smite's Mighty Hammer", id: 7230, q: "r", t: "Two-hand mace", w: [55, 83, "3.50", "19.7"], s: { str: 11, agi: 4 }, src: { k: "dm", by: "Mr. Smite" } },
  rockslicer: { n: "Rockslicer", id: 872, q: "r", t: "Two-hand axe", w: [52, 78, "3.30", "19.7"], s: { str: 10 }, src: { k: "dm", by: "Rhahk'Zor" } },
  nightreaver: { n: "Night Reaver", id: 1318, q: "r", t: "Two-hand axe", w: [52, 78, "3.30", "19.7"], s: {}, fx: ["Chance on hit: 67–101 Shadow damage"], src: { k: "boe", by: "Drops from Shadowfang Keep trash" } },
  defhood: { n: "Defender's Leather Hood", id: 252447, q: "r", t: "Leather", s: { str: 8, sta: 10 }, src: { k: "lw", skill: 100 } },
  shadowgog: { n: "Shadow Goggles", id: 4373, q: "u", t: "Cloth", s: { int: 5, spi: 6 }, src: { k: "eng", skill: 120 } },
  kaleido: { n: "Snake Eye Kaleidoscope", id: 273088, q: "r", t: "Neck", s: { str: 1, agi: 1, sta: 1, int: 1, spi: 1 }, fx: ["+1 all resistances"], src: { k: "wc", by: "Lady Anacondra" } },
  erudite: { n: "Erudite's Amulet", id: 277204, q: "r", t: "Neck", s: { agi: 4, sta: 6 }, src: { k: "lib" } },
  collar: { n: "Sorcerer Collar", id: 273457, q: "r", t: "Neck", s: { int: 2, spi: 2 }, src: { k: "sfk", by: "Rethilgore" } },
  pendant: { n: "Scholarly Pendant", id: 277203, q: "r", t: "Neck", s: { sta: 6, spi: 4 }, src: { k: "lib" } },
  locket: { n: "Tarnished Locket", id: 279870, q: "r", t: "Neck", s: { sta: 5, spi: 4 }, src: { k: "rolq", quest: "Remember That I Love You", how: "It starts from a Blood-Stained Letter inside and ends with Orphan Matron Nightingale in Stormwind" } },
  magmantle: { n: "Magician's Mantle", id: 12998, q: "r", t: "Cloth", s: { int: 9, sp: 5 }, src: { k: "boe", by: "A world drop from level 20 to 30 mobs, so the Auction House is the quickest way to get it" } },
  talbar: { n: "Talbar Mantle", id: 10657, q: "r", t: "Cloth", s: { sta: 3, int: 6, mp5: 2 }, src: { k: "wcq", quest: "In Nightmares", how: "Mutanus the Devourer drops the Glowing Shard. Falla Sagewind, on the hill above the cave, sends you by way of Sputtervalve in Ratchet to Mathrengyl Bearwalker in Darnassus" } },
  rws: { n: "Reinforced Woolen Shoulders", id: 4315, q: "u", t: "Cloth", s: { int: 4, sp: 5 }, src: { k: "boe", by: "Tailors make them" } },
  shroud: { n: "Grave Shroud", id: 279865, q: "r", t: "Cloak", s: { str: 3, agi: 2, sta: 5 }, src: { k: "rolq", quest: { a: "Abominable Creatures", h: "Unending Torment" }, how: { a: "Captain Truman gives it inside the dungeon", h: "Master Apothecary Faranell in Undercity’s Apothecarium wants the Abominable Head that The Baron drops inside" } } },
  catacomb: { n: "Catacomb Cloak", id: 279899, q: "r", t: "Cloak", s: { sta: 3, ap: 6 }, fx: ["+4 attack power against Humanoids"], src: { k: "hotq", quest: "An Ancient Grudge", how: "It starts inside the dungeon" } },
  hwcloak: { n: "Heavy Woolen Cloak", id: 4311, q: "u", t: "Cloak", s: { spi: 4, sp: 4 }, src: { k: "boe", by: "Tailors make it" } },
  prelacy: { n: "Prelacy Cape", id: 7004, q: "r", t: "Cloak", s: { spi: 6, heal: 11, dmg: 4 }, src: { k: "bfdq", quest: "Researching the Corruption", how: "Gershala Nightwhisper in Auberdine wants 8 Corrupt Brain Stems from inside the dungeon" } },
  aotf: { n: "Armor of the Fang", id: 6473, q: "r", t: "Leather", set: true, s: { str: 6, sta: 4, spi: 7 }, src: { k: "wc", by: "Lord Pythas" } },
  gloomshroud: { n: "Gloomshroud Armor", id: 1489, q: "r", t: "Leather", s: { str: 5, sta: 8, spi: 8 }, src: { k: "boe", by: "Drops from Shadowfang Keep trash" } },
  abomskin: { n: "Leftover Abomination Skin", id: 271206, q: "r", t: "Cloth", s: { spi: 7, sp: 7 }, src: { k: "rol", by: "The Baron" } },
  whelptunic: { n: "Black Whelp Tunic", id: 20575, q: "u", t: "Leather", s: { int: 5, sp: 3 }, src: { k: "boe", by: "Leatherworkers make it" } },
  corsair: { n: "Corsair's Overshirt", id: 5202, q: "r", t: "Cloth", s: { sta: 5, spi: 8, heal: 10, dmg: 3 }, src: { k: "dm", by: "Edwin VanCleef" } },
  apron: { n: "Bloody Apron", id: 6226, q: "r", t: "Cloth", s: { sta: 9, heal: 13, dmg: 3, hp5: 7 }, src: { k: "sfk", by: "Razorclaw the Butcher" } },
  moccasin: { n: "Robe of the Moccasin", id: 6465, q: "r", t: "Cloth", s: { str: 3, spi: 10, heal: 9, dmg: 3 }, src: { k: "wc", by: "Lord Cobrahn" } },
  mindthrust: { n: "Mindthrust Bracers", id: 1974, q: "r", t: "Cloth", s: { sta: 1, int: 5, mp5: 3 }, src: { k: "boe", by: "Drops from Shadowfang Keep trash" } },
  bravo: { n: "Bravo's Armbands", id: 270015, q: "r", t: "Leather", s: { str: 2, agi: 4, spi: 4 }, src: { k: "dmq", quest: "Underground Assault", how: "Shoni the Shilent, Stormwind" } },
  aetherwisp: { n: "Aetherwisp Bracers", id: 271096, q: "r", t: "Cloth", s: { sta: 3, sp: 3 }, src: { k: "hot", by: "Faldrim Anvilmar" } },
  gotf: { n: "Gloves of the Fang", id: 10413, q: "r", t: "Leather", set: true, s: { str: 4, agi: 6 }, src: { k: "boe", by: "Druids of the Fang drop them in Wailing Caverns" } },
  goldfleck: { n: "Gold-flecked Gloves", id: 5195, q: "r", t: "Cloth", s: { str: 7 }, fx: ["+5 Fire resistance"], src: { k: "dm", by: "Sneed" } },
  stormgloves: { n: "Stormrider's Leather Gloves", id: 252498, q: "r", t: "Leather", s: { sta: 3, int: 4, sp: 5 }, src: { k: "lw", skill: 75 } },
  serpgloves: { n: "Serpent Gloves", id: 5970, q: "r", t: "Cloth", s: { agi: 6, sp: 6 }, src: { k: "wc", by: "Lord Serpentis" } },
  prigloves: { n: "Pristine Gloves", id: 253913, q: "r", t: "Cloth", s: { sta: 4, int: 3, heal: 11, dmg: 4 }, src: { k: "tail", skill: 75 } },
  wisgloves: { n: "Wisdom's Leather Gloves", id: 252499, q: "r", t: "Leather", s: { sta: 3, int: 4, heal: 9, dmg: 3 }, src: { k: "lw", skill: 75 } },
  bdbelt: { n: "Blackened Defias Belt", id: 10403, q: "r", t: "Leather", s: { ap: 18 }, src: { k: "dm", by: "Captain Greenskin" } },
  stormbelt: { n: "Stormrider's Leather Belt", id: 252432, q: "r", t: "Leather", s: { sta: 3, int: 4, sp: 4 }, src: { k: "lw", skill: 60 } },
  prisash: { n: "Pristine Sash", id: 253925, q: "r", t: "Cloth", s: { sta: 5, int: 4, heal: 10, dmg: 3 }, src: { k: "tail", skill: 85 } },
  wisbelt: { n: "Wisdom's Leather Belt", id: 252433, q: "r", t: "Leather", s: { sta: 3, int: 4, heal: 8, dmg: 2 }, src: { k: "lw", skill: 60 } },
  hillbelt: { n: "Hillman's Belt", id: 4250, q: "u", t: "Leather", s: { sta: 4, sp: 4 }, src: { k: "boe", by: "Leatherworkers make it" } },
  slither: { n: "Slither Cord", id: 273089, q: "r", t: "Cloth", s: { mp5: 3 }, fx: ["Use: break free of anything that holds you in place (30 min cooldown)"], src: { k: "wc", by: "Lord Pythas" } },
  lotf: { n: "Leggings of the Fang", id: 10410, q: "r", t: "Leather", set: true, s: { str: 5, agi: 9, sta: 4 }, src: { k: "wc", by: "Lord Cobrahn" } },
  deepgrave: { n: "Deepgrave Trousers", id: 279900, q: "r", t: "Leather", s: { str: 7, agi: 3, spi: 3 }, src: { k: "hotq", quest: "An Ancient Grudge", how: "It starts inside the dungeon" } },
  dreamer: { n: "Dreamer's Leggings", id: 270016, q: "r", t: "Leather", s: { int: 11, sp: 4 }, src: { k: "dmq", quest: "Underground Assault", how: "Shoni the Shilent, Stormwind" } },
  ogre: { n: "Ogre Loincloth", id: 273289, q: "r", t: "Cloth", s: { str: 4, sta: 6, heal: 18, dmg: 6 }, src: { k: "dm", by: "Rhahk'Zor" } },
  totboots: { n: "Totemic Leather Boots", id: 252442, q: "r", t: "Leather", s: { str: 5, sta: 4, sp: 5 }, src: { k: "lw", skill: 85 } },
  spidersilk: { n: "Spidersilk Boots", id: 4320, q: "r", t: "Cloth", s: { sta: 4, int: 4, sp: 7 }, src: { k: "boe", by: "Tailors make them" } },
  stormboots: { n: "Stormrider's Leather Boots", id: 252443, q: "r", t: "Leather", s: { sta: 4, int: 5, sp: 6 }, src: { k: "lw", skill: 85 } },
  footpads: { n: "Footpads of the Fang", id: 10411, q: "r", t: "Leather", set: true, s: { agi: 6, sta: 6 }, src: { k: "wc", by: "Lord Serpentis" } },
  wisboots: { n: "Wisdom's Leather Boots", id: 252444, q: "r", t: "Leather", s: { sta: 4, int: 5, heal: 10, dmg: 3 }, src: { k: "lw", skill: 85 } },
  priboots: { n: "Pristine Boots", id: 253889, q: "r", t: "Cloth", s: { sta: 4, int: 3, heal: 8, dmg: 3 }, src: { k: "tail", skill: 60 } },
  firstmate: { n: "First Mate Band", id: 284715, q: "r", t: "Ring", s: { str: 6, sta: 2 }, src: { k: "dm", by: "Mr. Smite" } },
  lavish: { n: "Lavishly Jeweled Ring", id: 1156, q: "r", t: "Ring", s: { agi: 2, int: 6 }, src: { k: "dm", by: "Gilnid" } },
  mcr: { n: "Minor Channeling Ring", id: 1449, q: "u", t: "Ring", s: { int: 2, sp: 4 }, src: { k: "zq", quest: "WANTED: Chok'sul", how: "The poster is in Thelsamar, Loch Modan. Chok'sul is an elite ogre in Mo'grosh Stronghold, and the ring comes with every reward choice" } },
  blackpearl: { n: "Black Pearl Ring", id: 6332, q: "r", t: "Ring", s: { sta: 2, int: 2, spi: 6 }, src: { k: "rare", by: "Lady Vespira, a rare naga in Darkshore" } },
  recomb: { n: "Minor Recombobulator", id: 4381, q: "u", t: "Trinket", s: {}, fx: ["Use: restores 203–338 health and 96–160 mana and removes Polymorph (5 min cooldown, 10 charges)"], src: { k: "eng", skill: 140 } },
  spyglass: { n: "Lookie's Spyglass", id: 273298, q: "r", t: "Trinket", s: { spi: 1 }, src: { k: "dm", by: "Cookie" } },
  driftwood: { n: "Polished Driftwood Icon", id: 249398, q: "r", t: "Totem", s: {}, fx: ["8% of your mana regen keeps going while you cast"], src: { k: "ench", skill: 130 } },
  scepter: { n: "Scepter of the Abandoned", id: 271216, q: "r", t: "One-hand mace", w: [17, 33, "2.60", "9.6"], s: { str: 5, sp: 24 }, src: { k: "rol", by: "The Abandoned" } },
  buzzer: { n: "Buzzer Blade", id: 2169, q: "r", t: "Dagger", w: [9, 18, "1.50", "9.0"], s: { sp: 22 }, fx: ["+9 spell damage against Elementals"], src: { k: "dm", by: "Sneed's Shredder" } },
  coldspire: { n: "Coldspire Staff", id: 271215, q: "r", t: "Staff", w: [43, 66, "3.60", "15.1"], s: { spi: 13, sp: 26 }, src: { k: "rol", by: "Rath'mael" } },
  tome: { n: "Dwarven Tome", id: 279898, q: "r", t: "Off hand", s: { spi: 2, sp: 4 }, src: { k: "hotq", quest: "Important Heirlooms", how: "Thom Filch, Ironforge" } },
  seedcloud: { n: "Seedcloud Buckler", id: 6630, q: "r", t: "Shield", s: { sp: 4 }, fx: ["547 armor", "+5 Nature resistance"], src: { k: "wc", by: "Verdan the Everliving" } },
  tothood: { n: "Totemic Leather Hood", id: 252448, q: "r", t: "Leather", s: { sta: 10, sp: 8 }, src: { k: "lw", skill: 100 } },
  circlet: { n: "Pristine Circlet", id: 253949, q: "r", t: "Cloth", s: { sta: 10, heal: 17, dmg: 6 }, src: { k: "tail", skill: 100 } },
  wishood: { n: "Wisdom's Leather Hood", id: 252507, q: "r", t: "Leather", s: { sta: 10, heal: 17, dmg: 5 }, src: { k: "lw", skill: 100 } },
  westfall: { n: "Staff of Westfall", id: 2042, q: "r", t: "Staff", w: [36, 55, "3.00", "15.2"], s: { int: 5, spi: 6, heal: 48, dmg: 16 }, src: { k: "dmq", quest: "The Defias Brotherhood", how: "The chain starts with Gryan Stoutmantle at Sentinel Hill and ends with Edwin VanCleef" } },
  taskmaster: { n: "Taskmaster Axe", id: 5194, q: "r", t: "Two-hand axe", w: [31, 48, "2.70", "14.6"], s: { sta: 8, spi: 8, heal: 45, dmg: 15 }, src: { k: "dm", by: "Sneed" } },
  livingroot: { n: "Living Root", id: 6631, q: "r", t: "Staff", w: [34, 51, "2.90", "14.7"], s: { sta: 2, spi: 5, heal: 45, dmg: 15 }, src: { k: "wc", by: "Verdan the Everliving" } },
  tunicwf: { n: "Tunic of Westfall", id: 2041, q: "r", t: "Leather", s: { agi: 11, sta: 5 } },
  tombgloves: { n: "Tomb Robber's Gloves", id: 280096, q: "r", t: "Cloth", s: { sta: 3, int: 6 } },
  kimbra: { n: "Kimbra Boots", id: 6191, q: "u", t: "Cloth", s: { int: 4, spi: 3 } },
  evocator: { n: "Evocator's Blade", id: 2567, q: "r", t: "Dagger", s: { int: 2, spi: 5, sp: 28 } },
  blessedseer: { n: "Staff of the Blessed Seer", id: 2271, q: "r", t: "Staff", s: { sta: 9, spi: 10, sp: 28 } },
  drozem: { n: "Dro'zem's Tunic", id: 277213, q: "r", t: "Cloth", s: { int: 9, sp: 10 } },
  fillegs: { n: "Filigreed Pristine Leggings", id: 253937, q: "r", t: "Cloth", s: { sta: 5, int: 6, spi: 4, heal: 17, dmg: 6 } },
  stormarmor: { n: "Stormrider's Leather Armor", id: 252492, q: "r", t: "Leather", s: { sta: 3, int: 5, spi: 3, sp: 8 } },
  packleader: { n: "Mark of the Pack Leader", id: 285331, q: "r", t: "Neck", s: { str: 5, int: 5 }, src: { k: "rare", by: "Humar the Pridelord, a rare lion in the Barrens" } },
  /* level 30 (required level 21–30); lvl is the level needed to wear it */
  corpse: { n: "Corpsemaker", id: 6687, q: "r", t: "Two-hand axe", w: [88, 132, "3.80", "28.9"], s: {str: 15, sta: 8}, src: { k: "rfk", by: "Overlord Ramtusk" }, lvl: 29 },
  pummeler: { n: "Manual Crowd Pummeler", id: 9449, q: "r", t: "Two-hand mace", w: [46, 70, "2.00", "29.0"], s: {str: 16, agi: 5}, fx: ["Use: Increases your attack speed by 50% for 30 sec. (3 Min Cooldown) — 3 Charges"], src: { k: "gnomer", by: "Crowd Pummeler 9-60" }, lvl: 29 },
  cobalt: { n: "Cobalt Crusher", id: 7730, q: "r", t: "Two-hand mace", w: [74, 111, "3.20", "28.9"], s: {}, fx: ["Chance on hit: Blasts a target for 127 to 139 Frost damage."], src: { k: "boe", by: "Drops from Scarlet Monastery trash" }, lvl: 29 },
  pipehammer: { n: "Mechanic's Pipehammer", id: 9604, q: "r", t: "Two-hand mace", w: [59, 90, "2.80", "26.6"], s: {int: 5, sp: 19}, src: { k: "gnomerq", quest: "Data Rescue", how: "Master Mechanic Castpipe in Tinker Town, Ironforge, wants a Prismatic Punch Card made at the four punch-card machines inside" }, lvl: 25 },
  headbasher: { n: "Headbasher", id: 1264, q: "r", t: "Two-hand mace", w: [43, 66, "2.30", "23.7"], s: {str: 10, sta: 5, int: 9}, src: { k: "stocksq", quest: "The Fury Runs Deep", how: "Motley Garmason at Dun Modr, Wetlands, after The Dark Iron War. Bring back Kam Deepfury’s head" }, lvl: 22 },
  defhelm: { n: "Defender's Leather Helm", id: 252455, q: "r", t: "Leather", s: {str: 12, sta: 13}, src: { k: "lw", skill: 130, pat: "Nobody has confirmed where the pattern comes from yet." }, lvl: 25 },
  whisperwind: { n: "Whisperwind Headdress", id: 6688, q: "r", t: "Leather", s: {sta: 6, int: 10, spi: 10}, src: { k: "rfk", by: "Earthcaller Halmgar", rare: true }, lvl: 27 },
  cowl: { n: "Enchanter's Cowl", id: 4322, q: "u", t: "Cloth", s: {int: 10, sp: 5}, src: { k: "boe", by: "Tailors make it" }, lvl: 28 },
  ghostshard: { n: "Ghostshard Talisman", id: 7731, q: "r", t: "Neck", s: {sta: 9, ap: 14}, src: { k: "smgy", by: "Azshir the Sleepless", rare: true }, lvl: 30 },
  dsmantle: { n: "Death Speaker Mantle", id: 6685, q: "r", t: "Cloth", s: {int: 11, sp: 5}, src: { k: "rfk", by: "Death Speaker Jargba" }, lvl: 27 },
  batwing: { n: "Batwing Mantle", id: 6697, q: "r", t: "Cloth", s: {agi: 3, int: 11, spi: 5}, src: { k: "rfk", by: "Blind Hunter", rare: true }, lvl: 29 },
  bloodmage: { n: "Bloodmage Mantle", id: 7684, q: "r", t: "Cloth", s: {int: 9, sp: 9, hp5: 9}, src: { k: "smgy", by: "Bloodmage Thalnos" }, lvl: 30 },
  wolfcape: { n: "Wolfmaster Cape", id: 6314, q: "r", t: "Cloak", s: {sta: 3, ap: 10}, src: { k: "sfk", by: "Wolf Master Nandos" }, lvl: 22 },
  totunic: { n: "Totemic Leather Tunic", id: 252451, q: "r", t: "Leather", s: {str: 8, sta: 6, int: 5, sp: 6}, src: { k: "lw", skill: 110, pat: "Pattern from Daniel Stitchsong at Three Corners, Redridge, for 30 Merchant’s Favor." }, lvl: 22 },
  raptorbane: { n: "Raptorbane Armor", id: 3566, q: "u", t: "Leather", s: {sta: 3, ap: 16}, src: { k: "zq", quest: "Ormer’s Revenge", how: "The last step of Ormer Ironbraid’s raptor chain at Whelgar’s Excavation Site, Wetlands" }, lvl: 22 },
  harness: { n: "Blackrock Harness", id: 273805, q: "r", t: "Leather", s: {sta: 8, ap: 14}, src: { k: "stocks", by: "Targorr the Dread" }, lvl: 21 },
  serrakis: { n: "Bands of Serra'kis", id: 6902, q: "r", t: "Leather", s: {str: 6, sta: 3}, src: { k: "bfd", by: "Old Serra’kis" }, lvl: 22 },
  earthengloves: { n: "Heavy Earthen Gloves", id: 7359, q: "u", t: "Leather", s: {ap: 16}, src: { k: "boe", by: "Leatherworkers make them" }, lvl: 24 },
  townclerk: { n: "Town Clerk's Mittens", id: 270029, q: "r", t: "Cloth", s: {int: 11, sp: 4}, src: { k: "stocksq", quest: "Crime and Punishment", how: "Councilman Millstipe in Darkshire, Duskwood, wants Dextren Ward’s hand" }, lvl: 22 },
  prowlerbelt: { n: "Prowler's Leather Belt", id: 252459, q: "r", t: "Leather", s: {str: 9, agi: 6, sta: 6, int: 4}, src: { k: "lw", skill: 150, pat: "Pattern sold for 20 silver by Granny Finespindle in Ironforge (confirmed for the Skycaller’s belt; the others are expected to be the same)." }, lvl: 30 },
  ferine: { n: "Ferine Leggings", id: 6690, q: "r", t: "Leather", s: {int: 12, ap: 26}, src: { k: "rfk", by: "Agathelos the Raging" }, lvl: 29 },
  totlegs: { n: "Totemic Leather Leggings", id: 252458, q: "r", t: "Leather", s: {str: 9, sta: 7, int: 6, sp: 7}, src: { k: "lw", skill: 125, pat: "Pattern from Daniel Stitchsong at Three Corners, Redridge, for 30 Merchant’s Favor." }, lvl: 25 },
  acidic: { n: "Acidic Walkers", id: 9454, q: "r", t: "Cloth", s: {int: 8, spi: 4, sp: 4}, fx: ["+5 Nature Resistance"], src: { k: "gnomer", by: "Viscous Fallout" }, lvl: 27 },
  silverseal: { n: "Silverlaine's Family Seal", id: 6321, q: "r", t: "Ring", s: {str: 5, sta: 2}, fx: ["Movement speed increased by 2% in Tirisfal Glades, Silverpine Forest, and Shadowfang Keep."], src: { k: "sfk", by: "Baron Silverlaine" }, lvl: 21 },
  ironeye: { n: "Ironspine's Eye", id: 7686, q: "r", t: "Ring", s: {str: 4, agi: 9}, src: { k: "smgy", by: "Ironspine", rare: true }, lvl: 30 },
  snakehoop: { n: "Snake Hoop", id: 6750, q: "r", t: "Ring", s: {int: 7, spi: 7}, src: { k: "rfkq", quest: "Willix the Importer", how: "Willix starts it inside the dungeon; escort him out" }, lvl: 22 },
  worgenbane: { n: "Worgenbane Talisman", id: 273643, q: "r", t: "Trinket", s: {mp5: 2}, fx: ["Use: Stuns target Worgen for 4 sec. (5 Min Cooldown)"], src: { k: "sfk", by: "Commander Springvale" }, lvl: 21 },
  roogug: { n: "Roogug's Severed Head", id: 274152, q: "r", t: "Trinket", s: {spi: 6}, fx: ["Use: Raise the severed head of Roogug, Horrifying and Silencing all Swine within 15 yards for 5 sec. (5 Min Cooldown)"], src: { k: "rfk", by: "Roogug" }, lvl: 25 },
  swinetusk: { n: "Swinetusk Shank", id: 6691, q: "r", t: "Dagger", w: [16, 30, "1.50", "15.3"], s: {sta: 6, spi: 4, sp: 40}, src: { k: "rfk", by: "Agathelos the Raging" }, lvl: 30 },
  crested: { n: "Crested Scepter", id: 3414, q: "r", t: "One-hand mace", w: [22, 41, "2.60", "12.1"], s: {sta: 6, int: 2, sp: 32}, src: { k: "boe", by: "Drops from Blackfathom Deeps trash" }, lvl: 24 },
  hydrocane: { n: "Hydrocane", id: 9452, q: "r", t: "Staff", w: [44, 67, "2.80", "19.8"], s: {sp: 36}, fx: ["+15 Frost Resistance", "Underwater Breath lasts 50% longer than normal."], src: { k: "gnomer", by: "Viscous Fallout" }, lvl: 27 },
  orbmystic: { n: "Orb of Mystic Insight", id: 249394, q: "r", t: "Off hand", s: {int: 6, sp: 7}, src: { k: "ench", skill: 140, pat: "Formula from Alynsia at Three Corners, Redridge, for 45 Merchant’s Favor." }, lvl: 25 },
  orbsouls: { n: "Orb of Souls", id: 249395, q: "r", t: "Off hand", s: {spi: 6, heal: 13, dmg: 4}, src: { k: "ench", skill: 140, pat: "Formula from Alynsia at Three Corners, Redridge, for 45 Merchant’s Favor." }, lvl: 25 },
  glimmer: { n: "Glimmering Staff", id: 249392, q: "r", t: "Staff", w: [32, 49, "2.20", "18.4"], s: {sta: 11, int: 11, sp: 34}, src: { k: "ench", skill: 140, pat: "Formula from Alynsia at Three Corners, Redridge, for 45 Merchant’s Favor." }, lvl: 25 },
  tothelm: { n: "Totemic Leather Helm", id: 252456, q: "r", t: "Leather", s: {sta: 13, sp: 11}, src: { k: "lw", skill: 130, pat: "Nobody has confirmed where the pattern comes from yet." }, lvl: 25 },
  embalmed: { n: "Embalmed Shroud", id: 7691, q: "r", t: "Cloth", s: {sta: 7, spi: 12, heal: 24, dmg: 8}, src: { k: "smgy", by: "Fallen Champion", rare: true }, lvl: 30 },
  explorers: { n: "Explorers' League Commendation", id: 7746, q: "r", t: "Neck", s: {sta: 9, spi: 9}, src: { k: "smq", quest: "Mythology of the Titans", how: "Librarian Mae Paledust in Ironforge’s Hall of Explorers wants the book from the Scarlet Monastery Library" }, lvl: 28 },
  repaircape: { n: "Repairman's Cape", id: 9605, q: "r", t: "Cloak", s: {int: 4, spi: 7, heal: 9, dmg: 3}, src: { k: "gnomerq", quest: "Data Rescue", how: "Master Mechanic Castpipe in Tinker Town, Ironforge, wants a Prismatic Punch Card made at the four punch-card machines inside" }, lvl: 25 },
  redwool: { n: "Red Wool Cloak", id: 273825, q: "r", t: "Cloak", s: {heal: 9, dmg: 3, mp5: 3}, src: { k: "stocks", by: "Bazil Thredd" }, lvl: 26 },
  stormtunic: { n: "Stormrider's Leather Tunic", id: 252510, q: "r", t: "Leather", s: {sta: 6, int: 6, spi: 5, sp: 9}, src: { k: "lw", skill: 110, pat: "Pattern from Daniel Stitchsong at Three Corners, Redridge, for 30 Merchant’s Favor." }, lvl: 22 },
  treebark: { n: "Tree Bark Jacket", id: 1486, q: "r", t: "Cloth", s: {sp: 12}, fx: ["+60 Bonus Armor"], src: { k: "boe", by: "Drops from Blackfathom Deeps trash" }, lvl: 21 },
  dsrobes: { n: "Death Speaker Robes", id: 6682, q: "r", t: "Cloth", s: {sta: 4, int: 11, heal: 19, dmg: 6}, src: { k: "rfk", by: "Death Speaker Jargba" }, lvl: 26 },
  pristgown: { n: "Pristine Gown", id: 253961, q: "r", t: "Cloth", s: {sta: 6, int: 7, spi: 4, heal: 19, dmg: 7}, src: { k: "tail", skill: 110, pat: "Pattern from Mivin Shadowweave at Three Corners, Redridge, for 30 Merchant’s Favor." }, lvl: 22 },
  oilrag: { n: "Spidertank Oilrag", id: 9448, q: "r", t: "Cloth", s: {sp: 8, mp5: 3}, src: { k: "gnomer", by: "Electrocutioner 6000" }, lvl: 29 },
  skybelt: { n: "Skycaller's Leather Belt", id: 252522, q: "r", t: "Leather", s: {sta: 6, int: 6, spi: 4, sp: 10}, src: { k: "lw", skill: 150, pat: "Pattern sold for 20 silver by Granny Finespindle in Ironforge (confirmed for the Skycaller’s belt; the others are expected to be the same)." }, lvl: 30 },
  moss: { n: "Moss Cinch", id: 6911, q: "r", t: "Leather", s: {sta: 5, dmg: 12}, src: { k: "bfd", by: "Aku’mai" }, lvl: 25 },
  arugalbelt: { n: "Belt of Arugal", id: 6392, q: "r", t: "Cloth", s: {agi: 2, int: 3, spi: 5, sp: 9}, src: { k: "sfk", by: "Archmage Arugal" }, lvl: 23 },
  gazedreamer: { n: "Gaze Dreamer Pants", id: 6903, q: "r", t: "Cloth", s: {spi: 9, sp: 12}, src: { k: "bfd", by: "Twilight Lord Kelris" }, lvl: 23 },
  leech: { n: "Leech Pants", id: 6910, q: "r", t: "Cloth", s: {sta: 5, sp: 5, mp5: 5, hp5: 5}, src: { k: "bfd", by: "Aku’mai" }, lvl: 24 },
  forlorn: { n: "Ring of Forlorn Spirits", id: 2043, q: "u", t: "Ring", s: {sta: 2, sp: 8}, src: { k: "zq", quest: "The Legend of Stalvan", how: "The end of a long Duskwood chain that starts in Darkshire" }, lvl: 22 },
  darkhorde: { n: "Dark Horde Band", id: 273806, q: "r", t: "Ring", s: {sta: 6, sp: 6}, src: { k: "stocks", by: "Targorr the Dread" }, lvl: 21 },
  dsscepter: { n: "Death Speaker Scepter", id: 2816, q: "r", t: "One-hand mace", w: [28, 52, "2.80", "14.3"], s: {heal: 68, hp5: 12}, src: { k: "rfk", by: "Death Speaker Jargba" }, lvl: 28 },
  friar: { n: "Staff of the Friar", id: 3415, q: "r", t: "Staff", w: [33, 50, "2.60", "16.0"], s: {sta: 4, int: 3, spi: 12, heal: 52, dmg: 17}, src: { k: "boe", by: "Drops from Blackfathom Deeps trash" }, lvl: 21 },
  odo: { n: "Odo's Ley Staff", id: 6318, q: "r", t: "Staff", w: [37, 56, "2.90", "16.0"], s: {spi: 12, heal: 52, dmg: 17}, src: { k: "sfk", by: "Odo the Blindwatcher" }, lvl: 21 },
  civinad: { n: "Civinad Robes", id: 9623, q: "r", t: "Cloth", s: {sta: 7, spi: 12, heal: 25, dmg: 8}, src: { k: "gnomerq", quest: { a: "The Grand Betrayal", h: "Rig Wars" }, how: { a: "High Tinker Mekkatorque in Tinker Town, Ironforge, wants Mekgineer Thermaplugg dead", h: "Nogg in Orgrimmar’s Valley of Honor wants the Rig Blueprints from Thermaplugg’s safe. Pick it up from level 25" } }, lvl: 25 },
  wistunic: { n: "Wisdom's Leather Tunic", id: 252511, q: "r", t: "Leather", s: {sta: 5, int: 6, spi: 6, heal: 18, dmg: 6}, src: { k: "lw", skill: 110, pat: "Pattern from Daniel Stitchsong at Three Corners, Redridge, for 30 Merchant’s Favor." }, lvl: 22 },
  robesarugal: { n: "Robes of Arugal", id: 6324, q: "r", t: "Cloth", s: {sta: 5, spi: 6, heal: 18, dmg: 6}, fx: ["+8 Shadow Resistance"], src: { k: "sfk", by: "Archmage Arugal" }, lvl: 23 },
  bridgebreaker: { n: "Bridgebreaker Bindings", id: 273808, q: "r", t: "Cloth", s: {heal: 9, dmg: 2}, fx: ["+7 Fire Resistance"], src: { k: "stocks", by: "Kam Deepfury" }, lvl: 24 },
  nagagloves: { n: "Naga Battle Gloves", id: 888, q: "r", t: "Leather", s: {str: 4, sta: 4, heal: 14, dmg: 4}, src: { k: "bfd", by: "Lady Sarevess" }, lvl: 22 },
  menderbelt: { n: "Mender's Leather Belt", id: 252523, q: "r", t: "Leather", s: {sta: 4, int: 6, spi: 6, heal: 19, dmg: 6}, src: { k: "lw", skill: 150, pat: "Pattern sold for 20 silver by Granny Finespindle in Ironforge (confirmed for the Skycaller’s belt; the others are expected to be the same)." }, lvl: 30 },
  pristlegs: { n: "Pristine Leggings", id: 253987, q: "r", t: "Cloth", s: {sta: 7, int: 7, spi: 5, heal: 21, dmg: 6}, src: { k: "tail", skill: 125, pat: "Pattern from Mivin Shadowweave at Three Corners, Redridge, for 30 Merchant’s Favor." }, lvl: 25 },
  wislegs: { n: "Wisdom's Leather Leggings", id: 252519, q: "r", t: "Leather", s: {sta: 6, int: 7, spi: 7, heal: 20, dmg: 6}, src: { k: "lw", skill: 125, pat: "Pattern from Daniel Stitchsong at Three Corners, Redridge, for 30 Merchant’s Favor." }, lvl: 25 },
  gnomebot: { n: "Gnomebot Operating Boots", id: 9450, q: "r", t: "Leather", s: {sta: 12, heal: 10, dmg: 3}, src: { k: "gnomer", by: "Crowd Pummeler 9-60" }, lvl: 29 },
  lagnut: { n: "Electrocutioner Lagnut", id: 9447, q: "r", t: "Ring", s: {sta: 4, spi: 7, heal: 8, dmg: 2}, src: { k: "gnomer", by: "Electrocutioner 6000" }, lvl: 29 },
  filcirclet: { n: "Filigreed Pristine Circlet", id: 253975, q: "r", t: "Cloth", s: {sta: 12, heal: 21, dmg: 8}, src: { k: "tail", skill: 125, pat: "Nobody has confirmed where the pattern comes from yet." }, lvl: 25 },
  wishelm: { n: "Wisdom's Leather Helm", id: 252515, q: "r", t: "Leather", s: {sta: 13, heal: 20, dmg: 6}, src: { k: "lw", skill: 130, pat: "Nobody has confirmed where the pattern comes from yet." }, lvl: 25 },
  skum: { n: "Skum's Bucket", id: 273137, q: "r", t: "Off hand", s: {sta: 3, heal: 9, dmg: 2}, fx: ["Use: restores 803 mana over 24 sec while you sit (10 min cooldown)"], src: { k: "wc", by: "Skum" }, lvl: 17 },
  wolfclaw: { n: "Wolfclaw Gloves", id: 1978, q: "r", t: "Leather", s: {str: 5, agi: 6, sta: 6}, src: { k: "boe", by: "Drops from Razorfen Kraul trash" }, lvl: 22 },
  slaghammer: { n: "Slaghammer", id: 1976, q: "r", t: "Two-hand mace", w: [53, 80, "2.80", "23.8"], s: {str: 11, sta: 10}, src: { k: "boe", by: "Drops from Razorfen Kraul trash" }, lvl: 24 },
  scorn: { n: "Scorn's Icy Choker", id: 23169, q: "r", t: "Neck", s: {sta: 5, int: 6, sp: 7}, src: { k: "unk", by: "Scorn, a Scourge Invasion boss in Classic" }, lvl: 30 },
  demogirdle: { n: "Demolition Girdle", id: 273807, q: "r", t: "Leather", s: {str: 8, dmg: 9}, src: { k: "unk", by: "Probably Kam Deepfury in the Stockade" }, lvl: 24 },
  rack: { n: "Repurposed Rack", id: 273811, q: "r", t: "Shield", s: {str: 6, sp: 6}, fx: ["14 Block"], src: { k: "unk", by: "Probably Hamhock in the Stockade" }, lvl: 25 },
  shovel: { n: "Graverobber's Shovel", id: 273817, q: "r", t: "Two-hand mace", w: [68, 102, "3.70", "23.0"], s: {sta: 10, ap: 12}, fx: ["+12 Attack Power, doubled against Undead targets.", "Use: Dig up a grave. Usable at Raven Hill Cemetery and Scarlet Monastery Graveyard. (2 Min Cooldown) — 20 Charges"], src: { k: "unk", by: "Unknown" }, lvl: 23 },
  magistrate: { n: "Magistrate's Pantaloons", id: 270036, q: "r", t: "Cloth", s: {int: 14, sp: 5}, src: { k: "unk", by: "A new quest reward; the quest isn’t known yet" }, lvl: 30 },
  ladimore: { n: "Ladimore Heirloom Ring", id: 270051, q: "u", t: "Ring", s: {int: 6, sp: 4}, src: { k: "unk", by: "Probably the Mor’Ladim chain in Duskwood" }, lvl: 30 },
  abomlegs: { n: "Abomination Skin Leggings", id: 23173, q: "r", t: "Cloth", s: {sta: 7, int: 8, sp: 9}, src: { k: "unk", by: "Sever, a Scourge Invasion boss in Classic" }, lvl: 20 },
  /* Horde items, from R2 research. fac marks a faction-locked quest reward; items with no fac are neutral drops. */
  hammerbone: { n: "Hammerbone", id: 270018, q: "r", t: "Two-hand mace", w: [55, 84, "3.40", "20.4"], s: { str: 10, sta: 7 }, src: { k: "wcq", quest: "Leaders of the Fang", how: "Nara Wildmane in Thunder Bluff wants the gems of Cobrahn, Anacondra, Pythas and Serpentis from inside Wailing Caverns" }, fac: "h" },
  axeorg: { n: "Axe of Orgrimmar", id: 15424, q: "u", t: "Two-hand axe", w: [42, 64, "3.30", "16.1"], s: { str: 5, sta: 5 }, src: { k: "rfcq", quest: "Hidden Enemies", how: "Thrall’s chain in Orgrimmar; kill Bazzalan and Jergosh the Invoker in Ragefire Chasm" }, fac: "h" },
  bloodwrap: { n: "Bloodied Chestwraps", id: 271212, q: "r", t: "Leather", s: { agi: 9, sta: 4, int: 4 }, src: { k: "rol", by: "Viktor the Vile, a hidden boss" }, lvl: 17 },
  witherbite: { n: "Witherbite Bracers", id: 271202, q: "r", t: "Leather", s: { agi: 4, int: 3, spi: 3 }, src: { k: "rol", by: "Witherfang" }, lvl: 15 },
  bandfist: { n: "Band of the Fist", id: 17694, q: "r", t: "Ring", s: { str: 4, agi: 4, spi: 6 }, src: { k: "bfdq", quest: "Allegiance to the Old Gods", how: "A Damp Note inside Blackfathom Deeps goes to Je'neu Sancrea at Zoram'gar Outpost, who wants Lorgus Jett dead" }, fac: "h", lvl: 17 },
  stitcher: { n: "The Stitcher", id: 279874, q: "r", t: "One-hand mace", w: [17, 33, "2.40", "10.4"], s: { sta: 6, heal: 48, dmg: 16 }, src: { k: "rolq", quest: "Light’s Justice", how: "Morbin Lightbane in Undercity’s Royal Quarter wants 25 Intact Limbs from the dead inside Ruins of Lordaeron" }, fac: "h" },
  mirrorrath: { n: "Mirror of Rath'mael", id: 271213, q: "r", t: "Shield", s: { str: 4, sta: 4, int: 3 }, fx: ["547 armor", "11 block"], src: { k: "rol", by: "Rath'mael" }, lvl: 19 },
  windeffigy: { n: "Windcarved Effigy", id: 263412, q: "c", t: "Totem", s: {}, fx: ["Reduces the mana cost of Lightning Bolt by 5"], src: { k: "zqh", quest: "Meddlesome Mages", how: "Illaya Amberwind in Shen'Dar Village, Zephras Isle - the Windshaper Skyborne starting zone. Kill 6 High Order Apprentices north of the village" }, fac: "h", rc: ["skyborne"] },
  totemring: { n: "Totemic Clan Ring", id: 5313, q: "u", t: "Ring", s: { int: 3, spi: 3 }, src: { k: "zqh", quest: "Revenge of Gann", how: "Gann Stonespire, who patrols near Bael Modan in the Barrens, gives you an Explosive Stick to destroy a flying machine on a tower there" }, fac: "h" },
  sacredband: { n: "Sacred Band", id: 6669, q: "u", t: "Ring", s: { spi: 4, sp: 2 }, src: { k: "zqh", quest: "The Den", how: "Deep inside Stonetalon’s Talon Den; needs four keys (Gatekeeper’s, Claw, Barrow, Sleepers’) and a level 29–30 elite escort" }, fac: "h" },
  barkshell: { n: "Barkshell Tunic", id: 5316, q: "u", t: "Leather", s: { sta: 4, sp: 8 }, src: { k: "zqh", quest: "Betrayal from Within", how: "Part 2 of a Barrens chain: Mangletooth starts it in a crate near the Taurajo flight path, and Thork at the Crossroads finishes it once you bring back Lok’s skull" }, fac: "h", lvl: 25 },
  encroach: { n: "Encroacher's Claim", id: 277286, q: "r", t: "Two-hand axe", w: [52, 78, "3.30", "19.7"], s: { str: 6, spi: 9 }, src: { k: "zqh", quest: "Wrongly Blamed, Justly Corrected", how: "Grunt Logmar at Camp Taurajo wants Alliance scouts dealt with at the Barrens/Dustwallow Marsh border" }, fac: "h" },
  giantmedal: { n: "Giantstone Medallion", id: 281321, q: "u", t: "Neck", s: { spi: 10 }, src: { k: "unk", by: "Not confirmed - new in Forever, no source found yet" } },
  tabitha: { n: "Tabitha's Cuffs", id: 251486, q: "r", t: "Cloth", s: { sta: 3, int: 6 }, src: { k: "rolq", quest: "A Frightened Request", how: "Tabitha Heartweaver at the Sepulcher, Silverpine Forest, wants to know what happened to Edward in the ruins" }, fac: "h" },
  blight: { n: "Blight Gloves", id: 279877, q: "r", t: "Cloth", s: { int: 7, spi: 5 }, fx: ["+3 Nature resistance"], src: { k: "rolq", quest: "The New Plague", how: "Theodore Griffs in Undercity’s Apothecarium wants a toxic strain from Witherfang" }, fac: "h" },
  jutebraid: { n: "Jutebraid Gloves", id: 10654, q: "u", t: "Cloth", s: { int: 5, sp: 6 }, src: { k: "zqh", quest: "Horde Presence", how: "Kadrak at Mor'shan Rampart sends you after Rynthariel the Keymaster, a level 29 elite in Stonetalon’s Talon Den" }, fac: "h" },
  chestnut: { n: "Chestnut Mantle", id: 17695, q: "r", t: "Cloth", s: { sta: 4, sp: 7 }, src: { k: "bfdq", quest: "Allegiance to the Old Gods", how: "Same quest as Band of the Fist: a Damp Note inside goes to Je'neu Sancrea at Zoram'gar Outpost" }, fac: "h" },
  ghastly: { n: "Ghastly Trousers", id: 15449, q: "r", t: "Cloth", s: { sta: 4, int: 5, mp5: 2 }, src: { k: "rfcq", quest: "The Power to Destroy...", how: "Varimathras in Undercity wants two books that drop inside Ragefire Chasm" }, fac: "h" },
  featherbead: { n: "Featherbead Bracers", id: 15452, q: "r", t: "Cloth", s: { int: 5 }, src: { k: "rfcq", quest: "Returning the Lost Satchel", how: "Find Maur Grimtotem’s body inside Ragefire Chasm and bring his satchel to Rahauro in Thunder Bluff" }, fac: "h" },
  apothecary: { n: "Apothecary Gloves", id: 10919, q: "u", t: "Cloth", s: { sp: 4 }, src: { k: "wcq", quest: "Serpentbloom", how: "Apothecary Zamah in the Pools of Vision under Thunder Bluff wants 10 Serpentbloom from inside Wailing Caverns" }, fac: "h" },
  searing: { n: "Searing Dagger", id: 273003, q: "r", t: "Dagger", w: [9, 17, "1.60", "8.1"], s: { sp: 18 }, fx: ["Your harmful spells sear the target for 2-4 Fire damage"], src: { k: "rfc", by: "Bazzalan" }, fac: "h" },
  vial: { n: "Expended Apothecary Vial", id: 281294, q: "u", t: "Off hand", s: { int: 3, spi: 3 }, src: { k: "zqh", quest: "Valuable Vantages", how: "Deathstalker Masoj in the Barrens sends you to work in Hillsbrad" }, fac: "h" },
  omega: { n: "Omega Orb", id: 7749, q: "r", t: "Off hand", s: { sp: 8, mp5: 3 }, src: { k: "smq", quest: "Compendium of the Fallen", how: "Sage Truthseeker in Thunder Bluff wants the book from the Scarlet Monastery Library; not offered to Undead" }, fac: "h", rc: ["orc", "troll"] },
  crescent: { n: "Crescent Staff", id: 6505, q: "r", t: "Staff", w: [35, 53, "2.90", "15.2"], s: { agi: 7, sta: 7, spi: 7, sp: 26 }, src: { k: "wcq", quest: "Leaders of the Fang", how: "Nara Wildmane in Thunder Bluff wants the gems of the four Fanglords inside Wailing Caverns" }, fac: "h" },
  orgstaff: { n: "Staff of Orgrimmar", id: 15444, q: "r", t: "Staff", w: [42, 64, "3.30", "16.1"], s: { int: 4, spi: 5, sp: 18, mp5: 2 }, src: { k: "rfcq", quest: "Hidden Enemies", how: "Thrall’s chain in Orgrimmar; kill Bazzalan and Jergosh the Invoker" }, fac: "h" },
  rotlegs: { n: "Rotmender's Leggings", id: 271207, q: "r", t: "Cloth", s: { sta: 5, int: 8, spi: 5 }, src: { k: "rol", by: "The Abandoned, a hidden boss you summon at a statue" } },
  tuskwrap: { n: "Tuskwrap Belt", id: 271210, q: "r", t: "Cloth", s: { sta: 5, int: 5 }, src: { k: "rol", by: "Bjork" } },
  feyscale: { n: "Feyscale Cloak", id: 6632, q: "r", t: "Cloak", s: { sta: 5, sp: 3 }, src: { k: "wc", by: "the Deviate Faerie Dragon, a rare spawn" } },
  thresher: { n: "Glowing Thresher Cape", id: 6901, q: "r", t: "Cloak", s: { spi: 8, heal: 6, dmg: 2 }, src: { k: "bfd", by: "Old Serra'kis" } },
  evocation: { n: "Robe of Evocation", id: 14150, q: "r", t: "Cloth", s: { sta: 4, int: 4, spi: 5 }, src: { k: "rfc", by: "Jergosh the Invoker" }, fac: "h" },
  adjudicator: { n: "High Robe of the Adjudicator", id: 3461, q: "u", t: "Cloth", s: { int: 2, sp: 8 }, src: { k: "zqh", quest: "Assault on Fenris Isle", how: "High Executor Hadrec at the Sepulcher wants Thule Ravenclaw dead, a level 24 elite on Fenris Isle" }, fac: "h" },
  gnarled: { n: "Gnarled Necromancer's Staff", id: 251534, q: "r", t: "Staff", w: [34, 51, "2.80", "15.2"], s: { int: 10, sp: 26 }, fx: ["Movement speed +2% in Silverpine Forest and Hillsbrad Foothills"], src: { k: "rolq", quest: "The Wrath of Rath'mael", how: "Deathguard Kristof southeast of Brill wants Rath'mael dead" }, fac: "h" },
  deepfathom: { n: "Deep Fathom Ring", id: 6463, q: "r", t: "Ring", s: { sta: 3, spi: 5 }, fx: ["+1 spell penetration"], src: { k: "wc", by: "Mutanus the Devourer" } },
  tattered: { n: "Tattered Mittens", id: 270030, q: "r", t: "Cloth", s: { sta: 8, spi: 6, heal: 10, dmg: 3 }, src: { k: "sfkq", quest: "The Book of Ur", how: "Keeper Bel'dugur in Undercity’s Apothecarium wants the book from Fenrus the Devourer’s room" }, fac: "h" }
};

const SRC = {
  dm: { chip: "Deadmines", group: "dm" },
  dmq: { chip: "Deadmines quest", group: "dm" },
  wc: { chip: "Wailing Caverns", group: "wc" },
  wcq: { chip: "Wailing Caverns quest", group: "wc" },
  hot: { chip: "Hall of Thanes", group: "hot" },
  hotq: { chip: "Hall of Thanes quest", group: "hot" },
  rol: { chip: "Ruins of Lordaeron", group: "rol" },
  rolq: { chip: "Ruins of Lordaeron quest", group: "rol" },
  sfk: { chip: "Shadowfang Keep", group: "sfk" },
  sfkq: { chip: "Shadowfang Keep quest", group: "sfk" },
  bfd: { chip: "Blackfathom Deeps", group: "bfd" },
  bfdq: { chip: "Blackfathom Deeps quest", group: "bfd", stretch: 20 },
  stocks: { chip: "The Stockade", group: "stocks" },
  stocksq: { chip: "Stockade quest", group: "stocks" },
  gnomer: { chip: "Gnomeregan", group: "gnomer" },
  gnomerq: { chip: "Gnomeregan quest", group: "gnomer" },
  rfk: { chip: "Razorfen Kraul", group: "rfk" },
  rfkq: { chip: "Razorfen Kraul quest", group: "rfk" },
  rfc: { chip: "Ragefire Chasm", group: "rfc" },
  rfcq: { chip: "Ragefire Chasm quest", group: "rfc" },
  smgy: { chip: "SM Graveyard", group: "smgy" },
  smq: { chip: "SM Library quest", group: "smlib" },
  zq: { chip: "Quest", group: "world" },
  zqh: { chip: "Horde quest", group: "world" },
  lib: { chip: "Library quest", group: "world" },
  boe: { chip: "Auction House", group: "ah" },
  rare: { chip: "Rare spawn", group: "ah" },
  unk: { chip: "Not confirmed", group: "world" },
  lw: { chip: "Leatherworking", group: "craft", prof: true },
  tail: { chip: "Tailoring", group: "craft", prof: true },
  eng: { chip: "Engineering", group: "craft", prof: true },
  ench: { chip: "Enchanting", group: "craft", prof: true }
};

const GROUPS = [
  { key: "hot", title: "Hall of Thanes", where: "Old Ironforge, beneath the High Seat." },
  { key: "dm", title: "Deadmines", where: "Moonbrook, Westfall." },
  { key: "wc", title: "Wailing Caverns", where: { a: "The Barrens. Take the boat from Menethil Harbor to Theramore and run west.", h: "The Barrens, southwest of the Crossroads. An easy ride east from Mulgore through Camp Taurajo, or south from Orgrimmar — no boat needed." } },
  { key: "rfc", title: "Ragefire Chasm", where: { a: "Orgrimmar’s Cleft of Shadow — deep in Horde territory.", h: "Orgrimmar’s Cleft of Shadow." } },
  { key: "rol", title: "Ruins of Lordaeron", where: { a: "Tirisfal Glades 71.6, 11.4, above Undercity. Alliance can enter, but it’s a long trek through Horde land.", h: "Tirisfal Glades, above Undercity — your own back yard. From Orgrimmar, take the zeppelin from Durotar to Tirisfal and walk south to the ruins." } },
  { key: "sfk", title: "Shadowfang Keep", where: { 20: { a: "Silverpine Forest. Only the first two bosses and the trash drop gear you can wear at 20.", h: "Silverpine Forest. Only the first two bosses and the trash drop gear you can wear at 20. Reach it via the Durotar zeppelin to Tirisfal, then south — friendly Horde land the whole way." }, 30: { a: "Silverpine Forest, on the hill above Pyrewood Village.", h: "Silverpine Forest, on the hill above Pyrewood Village. Reach it via the Durotar zeppelin to Tirisfal, then south." } } },
  { key: "bfd", title: "Blackfathom Deeps", where: { 20: { a: "Zoram Strand, Ashenvale. Tuned a few levels above 20.", h: "Zoram Strand, Ashenvale. Ride north through the Barrens to Zoram'gar Outpost, clear of Alliance Astranaar. Tuned a few levels above 20." }, 30: { a: "Zoram Strand, Ashenvale. Take the boat from Menethil Harbor to Auberdine and run south.", h: "Zoram Strand, Ashenvale. Ride north through the Barrens to Zoram'gar Outpost, on the coast." } } },
  { key: "stocks", title: "The Stockade", where: "Stormwind’s Mage Quarter canal. Two of its quests start in Darkshire and Dun Modr." },
  { key: "gnomer", title: "Gnomeregan", where: { a: "Dun Morogh, west of Kharanos. Its quests start in Tinker Town, Ironforge.", h: "Dun Morogh, west of Kharanos — deep in Alliance land. Take Rig Wars and Chief Engineer Scooty from Nogg and Sovik in Orgrimmar’s Valley of Honor first, then Booty Bay for Scooty’s transporter once Gnomer-gooooone! is done." } },
  { key: "rfk", title: "Razorfen Kraul", where: { a: "The far south of the Barrens, just north of the Great Lift. A long trip: boat to Theramore, then west and south.", h: "The far south of the Barrens, just north of the Great Lift. An easy ride south from Orgrimmar or the Crossroads — no boat needed, unlike Alliance’s trip through Theramore." } },
  { key: "smgy", title: "Scarlet Monastery Graveyard", where: { a: "Northeast Tirisfal Glades, deep in Horde land. Travel with your group.", h: "Northeast Tirisfal Glades. Reach it via the Durotar zeppelin, same route as Ruins of Lordaeron." } },
  { key: "smlib", title: "Scarlet Monastery Library", where: "Same courtyard as the Graveyard, tuned a little above 30." },
  { key: "world", title: "Quests in the world", where: "" },
  { key: "ah", title: "Auction House", where: "Bind on Equip, so you can buy them or farm them." },
  { key: "craft", title: "Your professions", where: { 20: { a: "Patterns come from Three Corners, Redridge.", h: "Patterns come from Durotar Supply and Logistics, west of the Crossroads, the Barrens." }, 30: { a: "Tunic and leggings patterns come from Three Corners, Redridge; the level 30 belt patterns from Ironforge.", h: "Tunic and leggings patterns come from Durotar Supply and Logistics. Nobody's confirmed the Horde vendor for the level 30 belt patterns yet — check your leatherworking trainer." } } }
];

const WEIGHT = {
  enh: { str: 2, int: 1.1, ap: 1, sp: 0.3, dmg: 0.3, agi: 0.25, mp5: 0.3, spi: 0.1, sta: 0.1, hp5: 0.1 },
  ele: { sp: 1, dmg: 1, mp5: 0.8, int: 0.5, spi: 0.2, sta: 0.1, agi: 0.02 },
  resto: { sp: 1, heal: 1, mp5: 1.2, int: 0.5, spi: 0.4, sta: 0.1, hp5: 0.1 }
};

const RING_STOPGAP = "Minor Channeling Ring comes with every choice. Kimbra Boots’ Intellect helps until you have your real boots.";

const SPECS20 = {
  enh: {
    label: "Enhancement", short: "Enh", el: "earth", use: "Solo questing", unit: "attack power",
    talents: [["Thundering Strikes", "5/5"], ["Mental Dexterity", "3/3", true], ["Improved Ghost Wolf", "2/2"], ["Shamanistic Focus", "1/1"]],
    blurb: [
      "Mental Dexterity turns each point of Intellect into 1 attack power, so some caster gear is right for you. Strength is worth 2 attack power. Agility only adds crit at this level, so it counts for little.",
      "Your weapon matters most: 14 attack power equals 1 point of weapon DPS."
    ],
    weights: [["Strength", 2], ["Intellect", 1.1], ["Attack power", 1], ["Spell power", 0.3], ["Agility", 0.25]],
    set: { name: "Embrace of the Viper", pieces: ["aotf", "lotf", "gotf"], bonus: "2 pieces: +10 Intellect. 3 pieces: +10 attack power. Together that’s about 20 attack power for you, more than any single item except your weapon." },
    slots: {
      a: [
        { key: "weapon", label: "Two-hand", opts: ["smite"],
          why: { smite: "The hardest-hitting two-hander you can get, and a mace, so Mace Specialization adds 1% crit. Train Two-Handed Maces from Buliwyf Stonehand in Ironforge’s Hall of Arms first." },
          alts: [["rockslicer", "Same run, first boss. Almost as strong, but an axe."], ["nightreaver", "Its Shadow bolt proc closes most of the gap."]] },
        { key: "head", label: "Head", opts: ["defhood:lw", "shadowgog:eng"], none: "Nothing with stats drops or comes from a quest at level 20.",
          why: { defhood: "Your biggest crafted upgrade. If you buy one pattern, buy this one.", shadowgog: "Engineers only. For you, its Intellect is attack power." } },
        { key: "neck", label: "Neck", opts: ["kaleido"],
          why: { kaleido: "A point of every stat adds up to about 3.5 attack power. The Necklace – Strength enchant adds more than the necklace itself." },
          alts: [["erudite", "The Library reward you can earn solo. Take it over the Spirit pendant."]] },
        { key: "shoulder", label: "Shoulders", opts: ["magmantle"],
          why: { magmantle: "Cloth, but its 9 Intellect is 9 attack power for you, and the spell power feeds your shocks. It’s a Bind on Equip world drop, so watch the Auction House rather than farming it." },
          alts: [["talbar", "The quest reward to wear until you find the mantle. Its mana regen keeps your shocks going."], ["rws", "No dungeon run needed. A little behind."]] },
        { key: "back", label: "Back", opts: ["shroud"],
          why: { shroud: "Strength and Agility. The same quest offers a ring; take the cloak." },
          alts: [["catacomb", "Within a point of Grave Shroud, and ahead of it against humanoids, so wear it in the Deadmines, Shadowfang Keep and the Hall of Thanes. Much closer to home, too."]] },
        { key: "chest", label: "Chest", opts: ["aotf"],
          why: { aotf: "Viper set piece. See the set bonus above." },
          alts: [["gloomshroud", "The best chest if you skip the set."]] },
        { key: "wrist", label: "Wrist", opts: ["mindthrust"],
          why: { mindthrust: "Caster bracers that suit you: 5 Intellect is 5 attack power, plus mana regen." },
          alts: [["bravo", "About a point behind."]] },
        { key: "hands", label: "Hands", opts: ["gotf"],
          why: { gotf: "Viper set piece. Check the Auction House before you farm it." },
          alts: [["goldfleck", "Stronger on its own. Take it if Footpads of the Fang are your third set piece instead."]] },
        { key: "waist", label: "Waist", opts: ["bdbelt"],
          why: { bdbelt: "18 attack power, the biggest single piece on this list after your weapon." } },
        { key: "legs", label: "Legs", opts: ["lotf"],
          why: { lotf: "Viper set piece." },
          alts: [["deepgrave", "The best legs outside the set."]] },
        { key: "feet", label: "Feet", opts: ["totboots:lw", "spidersilk"],
          why: { totboots: "Strength, plus spell power for your shocks.", spidersilk: "Cloth caster boots, but for you Intellect is attack power, and the spell power boosts your shocks." },
          alts: [["footpads", "A fourth set piece. The 4-piece bonus only helps at low health."]] },
        { key: "ring", label: "Ring", pair: true, opts: ["firstmate", "lavish"],
          why: { firstmate: "6 Strength is 12 attack power. Same boss as the hammer.", lavish: "6 Intellect is 6 attack power for you." } },
        { key: "trinket", label: "Trinket", pair: true, opts: ["recomb:eng", "spyglass"], none: "No other trinket at level 20 has stats.",
          why: { recomb: "Engineers only. An emergency heal and a mana top-up.", spyglass: "Just 1 Spirit, but it beats an empty slot." } },
        { key: "relic", label: "Relic", opts: ["driftwood:ench"], none: "Alliance shamans can’t get a relic at 20 without Enchanting.",
          why: { driftwood: "Keeps 8% of your mana regen going while you cast." } }
      ],
      h: [
        { key: "weapon", label: "Two-hand", opts: ["hammerbone"],
          why: { hammerbone: "20.4 DPS, +10 Strength and +7 Stamina — a hair ahead of Smite’s Mighty Hammer, and you don’t need to set foot in Alliance territory. Leaders of the Fang is a Wailing Caverns quest from Nara Wildmane in Thunder Bluff." },
          alts: [["axeorg", "Weaker (16.1 DPS) but comes from Hidden Enemies, the very first quest chain you’ll do in Orgrimmar — a fine stopgap until you clear Wailing Caverns."], ["slaghammer", "Str11+Sta10 off Razorfen Kraul trash, but that dungeon is tuned for 29+, so it’s really a level 30 pickup."]] },
        { key: "head", label: "Head", opts: ["defhood:lw", "shadowgog:eng"], none: "Nothing with stats drops or comes from a quest at level 20, same as Alliance.",
          why: { defhood: "Your biggest crafted upgrade, and Pawani at the Horde Merchant’s Favor camp sells the same pattern Three Corners does.", shadowgog: "Engineers only. For you, its Intellect is attack power." } },
        { key: "neck", label: "Neck", opts: ["kaleido"],
          why: { kaleido: "A point of every stat adds up to about 3.5 attack power, from Lady Anacondra in Wailing Caverns — right next to the Crossroads for you." },
          alts: [["erudite", "The Library reward you can earn solo, from Owen Thadd in Undercity."], ["packleader", "5 Strength and 5 Intellect beats everything else here if you catch Humar the Pridelord up, a rare lion in the Barrens with a long respawn."]] },
        { key: "shoulder", label: "Shoulders", opts: ["magmantle"],
          why: { magmantle: "Cloth, but its 9 Intellect is 9 attack power for you, and the spell power feeds your shocks. It’s a Bind on Equip world drop with no faction lock, so watch the Auction House rather than farming it." },
          alts: [["talbar", "The quest reward to wear until you find the mantle. Turn the shard in to Hamuul Runetotem in Thunder Bluff."], ["rws", "No dungeon run needed. A little behind."]] },
        { key: "back", label: "Back", opts: ["shroud"],
          why: { shroud: "Strength and Agility, from Ruins of Lordaeron — your own dungeon. Take it from Unending Torment (Master Apothecary Faranell, Undercity), the Horde twin of the Alliance’s Abominable Creatures; same reward list." } },
        { key: "chest", label: "Chest", opts: ["aotf"],
          why: { aotf: "Viper set piece from Lord Pythas in Wailing Caverns — no faction lock, and WC is right next to the Crossroads. See the Alliance guide’s set bonus notes above." },
          alts: [["gloomshroud", "The best chest if you skip the set, from Shadowfang Keep trash — reachable south of the Sepulcher."], ["bloodwrap", "9 Agility, 4 Stamina and 4 Intellect from Viktor the Vile, a hidden Ruins of Lordaeron boss, if you’d rather skip Wailing Caverns."]] },
        { key: "wrist", label: "Wrist", opts: ["mindthrust"],
          why: { mindthrust: "Caster bracers that suit you: 5 Intellect is 5 attack power, plus mana regen. Bind on Equip from Shadowfang Keep trash." },
          alts: [["witherbite", "4 Agility, 3 Intellect and 3 Spirit from Witherfang in Ruins of Lordaeron, about a point behind."]] },
        { key: "hands", label: "Hands", opts: ["gotf"],
          why: { gotf: "Viper set piece, Wailing Caverns. Check the Auction House before you farm it." },
          alts: [["jutebraid", "5 Intellect is 5 attack power, plus 6 spell power for your shocks, from Horde Presence — but that quest ends at a level 29 elite in Stonetalon, so it’s really a stretch pick even at 20."]] },
        { key: "waist", label: "Waist", opts: ["hillbelt"], none: "No Strength or attack power belt is realistically open to you at 20 — Blackened Defias Belt needs the Deadmines, deep in Alliance land.",
          why: { hillbelt: "4 spell power, from any leatherworker. Not exciting, but it’s the best you’ll find without a trip to Alliance territory." } },
        { key: "legs", label: "Legs", opts: ["lotf"],
          why: { lotf: "Viper set piece, from Lord Cobrahn in Wailing Caverns." } },
        { key: "feet", label: "Feet", opts: ["totboots:lw", "spidersilk"],
          why: { totboots: "Strength, plus spell power for your shocks.", spidersilk: "Cloth caster boots, but for you Intellect is attack power, and the spell power boosts your shocks." },
          alts: [["footpads", "A fourth Viper set piece, from Lord Serpentis in Wailing Caverns. The 4-piece bonus only helps at low health."]] },
        { key: "ring", label: "Ring", pair: true, opts: ["blackpearl", "deepfathom"], none: "Neither Strength/Agility ring at 20 (First Mate Band, Lavishly Jeweled Ring) is realistic — both are Deadmines drops.",
          why: { blackpearl: "6 Spirit and 2 Intellect isn’t exciting for Enhancement, but it beats an empty slot. A rare spawn in Darkshore, so check the Auction House.", deepfathom: "5 Spirit and 3 Stamina from Mutanus, Wailing Caverns’ last boss — the same fallback Ele and Resto use." },
          alts: [["bandfist", "4 Strength, 4 Agility and 6 Spirit from Allegiance to the Old Gods in Blackfathom Deeps — a real Enhancement ring at last, if your group can reach Zoram’gar Outpost."]] },
        { key: "trinket", label: "Trinket", pair: true, opts: ["recomb:eng"], none: "No trinket a Horde shaman can easily reach at 20 has stats — Lookie’s Spyglass needs the Deadmines.",
          why: { recomb: "Engineers only. An emergency heal and a mana top-up." } },
        { key: "relic", label: "Relic", opts: ["driftwood:ench"], none: "Like Alliance, you can’t get a relic at 20 without Enchanting — unless you’re Windshaper Skyborne (see the notes below).",
          why: { driftwood: "Keeps 8% of your mana regen going while you cast." } }
      ]
    },
    favor: { a: "Buy the Defender’s Leather Hood pattern first. It’s your biggest crafted upgrade. Totemic Leather Boots come next.", h: "Buy the Defender’s Leather Hood pattern first, from Pawani at Durotar Supply and Logistics, west of the Crossroads. Totemic Leather Boots come next." }
  },
  ele: {
    label: "Elemental", short: "Ele", el: "fire", use: "Caster damage", unit: "spell power",
    talents: [["Concussion", "5/5", true], ["Call of Flame", "3/3", true], ["Elemental Warding", "2/3"], ["Elemental Focus", "1/1"]],
    blurb: [
      "Concussion and Call of Flame multiply whatever your spells hit for, so spell power beats everything else.",
      "Intellect gives mana and a little crit. mp5 keeps you casting between drinks."
    ],
    weights: [["Spell power", 1], ["mp5", 0.8], ["Intellect", 0.5], ["Spirit", 0.2], ["Stamina", 0.1]],
    slots: {
      a: [
        { key: "mh", label: "Main hand", opts: ["scepter"],
          why: { scepter: "The most spell power on any one-hander you can get, and a mace, so Mace Specialization adds 1% spell crit." },
          alts: [["buzzer", "2 less spell power, and a dagger, but 9 more against elementals."], ["coldspire", "A staff that matches the scepter and tome together once you count its 13 Spirit. The mace pair keeps the crit."]] },
        { key: "oh", label: "Off hand", opts: ["tome"],
          why: { tome: "Choose it over the gloves when you finish the quest." },
          alts: [["seedcloud", "Same spell power plus a shield’s armor, handy when soloing."], ["skum", "A healer’s frill, but its Use is a free drink: 803 mana over 24 seconds, once every 10 minutes."]] },
        { key: "head", label: "Head", opts: ["tothood:lw", "circlet:tail", "shadowgog:eng"], none: "Nothing with stats drops or comes from a quest at level 20.",
          why: { tothood: "8 spell power. If you buy one pattern, buy this one.", circlet: "6 spell damage and 10 Stamina.", shadowgog: "Engineers only. Intellect and Spirit." } },
        { key: "neck", label: "Neck", opts: ["pendant"],
          why: { pendant: "No necklace at 20 has spell power. This one adds Stamina and Spirit; the Necklace – Spell Power enchant (+6) does more." },
          alts: [["collar", "Equal value, from Shadowfang Keep’s first boss."]] },
        { key: "shoulder", label: "Shoulders", opts: ["magmantle"],
          why: { magmantle: "5 spell power and 9 Intellect, the most of any shoulders at 20. It’s a Bind on Equip world drop, so watch the Auction House rather than farming it." },
          alts: [["rws", "The same spell power with less Intellect, from any tailor."], ["talbar", "More mana regen, less spell power."]] },
        { key: "back", label: "Back", opts: ["hwcloak"],
          why: { hwcloak: "4 spell power and 4 Spirit, from any tailor." },
          alts: [["prelacy", "Slightly better, but it needs a Blackfathom Deeps quest."]] },
        { key: "chest", label: "Chest", opts: ["abomskin"],
          why: { abomskin: "7 spell power and 7 Spirit." },
          alts: [["whelptunic", "A stand-in you can buy."]] },
        { key: "wrist", label: "Wrist", opts: ["mindthrust"],
          why: { mindthrust: "5 Intellect and 3 mp5." },
          alts: [["aetherwisp", "3 spell power, if you’d rather have damage now."]] },
        { key: "hands", label: "Hands", opts: ["stormgloves:lw", "serpgloves"],
          why: { stormgloves: "5 spell power and 4 Intellect.", serpgloves: "6 spell power. The Agility does nothing for you." } },
        { key: "waist", label: "Waist", opts: ["stormbelt:lw", "prisash:tail", "hillbelt"],
          why: { stormbelt: "4 spell power and 4 Intellect.", prisash: "3 spell damage and 4 Intellect.", hillbelt: "4 spell power, from any leatherworker." } },
        { key: "legs", label: "Legs", opts: ["dreamer"],
          why: { dreamer: "11 Intellect and 4 spell power. Pick it from the quest’s rewards." } },
        { key: "feet", label: "Feet", opts: ["spidersilk", "stormboots:lw"],
          why: { spidersilk: "7 spell power, more than any leatherworking boot, and Bind on Equip, so any tailor can make them for you.", stormboots: "6 spell power and 5 Intellect, half a point behind, if you’d rather craft your own." } },
        { key: "ring", label: "Ring", pair: true, opts: ["mcr", "lavish"],
          why: { mcr: "4 spell power. Bring a friend for the elite ogre.", lavish: "6 Intellect." },
          alts: [["blackpearl", "Spirit instead of Intellect."]] },
        { key: "trinket", label: "Trinket", pair: true, opts: ["recomb:eng", "spyglass"], none: "No other trinket at level 20 has stats.",
          why: { recomb: "Engineers only. An emergency heal and a mana top-up.", spyglass: "Just 1 Spirit, but it beats an empty slot." } },
        { key: "relic", label: "Relic", opts: ["driftwood:ench"], none: "Alliance shamans can’t get a relic at 20 without Enchanting.",
          why: { driftwood: "Keeps 8% of your mana regen going while you cast." } }
      ],
      h: [
        { key: "mh", label: "Main hand", opts: ["scepter"],
          why: { scepter: "The most spell power on any one-hander you can get, and a mace, so Mace Specialization adds 1% spell crit. The Abandoned is a hidden boss you summon at a statue inside Ruins of Lordaeron — your own dungeon, so this is even easier for you than for Alliance." },
          alts: [["searing", "18 spell power and a small Fire burn from Bazzalan in Ragefire Chasm — right in Orgrimmar, a good early pick before you reach Ruins of Lordaeron."], ["gnarled", "Or skip the off hand: this staff from The Wrath of Rath’mael (26 spell power, 10 Intellect) edges out the scepter and Seedcloud Buckler together."], ["coldspire", "26 spell power and 13 Spirit from Rath’mael himself, repeatable every run. It matches the scepter and buckler together."]] },
        { key: "oh", label: "Off hand", opts: ["seedcloud"],
          why: { seedcloud: "Same spell power as the Dwarven Tome plus a shield’s armor — and unlike the Tome, Verdan the Everliving in Wailing Caverns has no faction lock, so this is your primary, not just a soloing pick." },
          alts: [["skum", "Weaker (no spell power) but its use effect refills 803 mana while you sit, from Skum, also in Wailing Caverns."], ["mirrorrath", "Strength, Stamina, Intellect, 547 armor and 11 block from Rath’mael — no spell power, but sturdy if you’re soloing."]] },
        { key: "head", label: "Head", opts: ["tothood:lw", "circlet:tail", "shadowgog:eng"], none: "Nothing with stats drops or comes from a quest at level 20.",
          why: { tothood: "8 spell power. If you buy one pattern, buy this one.", circlet: "6 spell damage and 10 Stamina.", shadowgog: "Engineers only. Intellect and Spirit." } },
        { key: "neck", label: "Neck", opts: ["pendant"],
          why: { pendant: "No necklace at 20 has spell power. Stamina and Spirit, for ten library books handed to Owen Thadd in Undercity." },
          alts: [["collar", "2 Intellect and 2 Spirit, from Shadowfang Keep’s first boss — reachable south of the Sepulcher."]] },
        { key: "shoulder", label: "Shoulders", opts: ["magmantle"],
          why: { magmantle: "5 spell power and 9 Intellect, the most of any shoulders at 20. It’s a Bind on Equip world drop with no faction lock, so watch the Auction House rather than farming it." },
          alts: [["rws", "The same spell power with less Intellect, from any tailor."], ["talbar", "6 Intellect and 2 mp5 from the Wailing Caverns shard quest, handed in at Thunder Bluff."]] },
        { key: "back", label: "Back", opts: ["hwcloak"],
          why: { hwcloak: "4 spell power and 4 Spirit, from any tailor. No Horde-reachable cloak beats it at 20." },
          alts: [["feyscale", "3 spell power and 5 Stamina from a rare dragon in Wailing Caverns, if you’d rather not craft one."]] },
        { key: "chest", label: "Chest", opts: ["abomskin"],
          why: { abomskin: "7 spell power and 7 Spirit from The Baron, right in Ruins of Lordaeron — your own back yard." },
          alts: [["whelptunic", "A stand-in you can buy, no dungeon needed."], ["moccasin", "10 Spirit and 3 spell damage from Lord Cobrahn in Wailing Caverns."]] },
        { key: "wrist", label: "Wrist", opts: ["mindthrust"],
          why: { mindthrust: "5 Intellect and 3 mp5, from Shadowfang Keep trash." },
          alts: [["tabitha", "6 Intellect from A Frightened Request at the Sepulcher, if you’d rather quest than farm trash."], ["featherbead", "5 Intellect from Ragefire Chasm’s lost satchel quest."]] },
        { key: "hands", label: "Hands", opts: ["stormgloves:lw", "serpgloves"],
          why: { stormgloves: "5 spell power and 4 Intellect.", serpgloves: "6 spell power from Lord Serpentis in Wailing Caverns. The Agility does nothing for you." },
          alts: [["blight", "7 Intellect and 5 Spirit from The New Plague in Undercity."], ["apothecary", "4 spell power from Serpentbloom, also turned in at Thunder Bluff."]] },
        { key: "waist", label: "Waist", opts: ["stormbelt:lw", "prisash:tail", "hillbelt"],
          why: { stormbelt: "4 spell power and 4 Intellect.", prisash: "3 spell damage and 4 Intellect.", hillbelt: "4 spell power, from any leatherworker." } },
        { key: "legs", label: "Legs", opts: ["rotlegs"],
          why: { rotlegs: "8 Intellect and 5 Spirit from The Abandoned, the same hidden boss as your weapon — Underground Assault’s Dreamer’s Leggings need the Deadmines, so this is your real best-in-slot." },
          alts: [["ghastly", "5 Intellect and 2 mp5 from The Power to Destroy... in Ragefire Chasm."]] },
        { key: "feet", label: "Feet", opts: ["spidersilk", "stormboots:lw"],
          why: { spidersilk: "7 spell power, more than any leatherworking boot, and Bind on Equip, so any tailor can make them for you.", stormboots: "6 spell power and 5 Intellect, half a point behind, if you’d rather craft your own." } },
        { key: "ring", label: "Ring", pair: true, opts: ["blackpearl", "deepfathom"],
          why: { blackpearl: "6 Spirit and 2 Intellect. Bind on Equip from a Darkshore rare, so check the Auction House.", deepfathom: "5 Spirit and 3 Stamina from Mutanus, Wailing Caverns’ last boss." },
          alts: [["totemring", "3 Intellect and 3 Spirit from Revenge of Gann in the Barrens, once you’re high enough to wear it (its own item level suggests closer to 25)."]] },
        { key: "trinket", label: "Trinket", pair: true, opts: ["recomb:eng"], none: "No trinket a Horde shaman can easily reach at 20 has stats.",
          why: { recomb: "Engineers only. An emergency heal and a mana top-up." } },
        { key: "relic", label: "Relic", opts: ["driftwood:ench"], none: "Same as Alliance: no relic at 20 without Enchanting, unless you’re Windshaper Skyborne (see the notes below).",
          why: { driftwood: "Keeps 8% of your mana regen going while you cast." } }
      ]
    },
    favor: { a: "Buy the Totemic Leather Hood pattern first, or the Pristine Circlet if you tailor. The belt and gloves patterns add only a point or two each.", h: "Buy the Totemic Leather Hood pattern first from Pawani, or the Pristine Circlet from Jim’bek — both at Durotar Supply and Logistics, west of the Crossroads. The belt and gloves patterns add only a point or two each." }
  },
  resto: {
    label: "Restoration", short: "Resto", el: "water", use: "Dungeon healing", unit: "healing",
    talents: [["Improved Healing Wave", "5/5"], ["Mindfulness", "3/3", true], ["Tidal Focus", "2/5"], ["Water Shield", "1/1"]],
    blurb: [
      "Healing power comes first. Mindfulness keeps half your Spirit regen going while you cast, so Spirit counts for more than usual.",
      "Point for point, mp5 is worth a little more than healing, but gear carries far more healing, so healing items still win."
    ],
    weights: [["mp5", 1.2], ["Healing", 1], ["Intellect", 0.5], ["Spirit", 0.4], ["Stamina", 0.1]],
    slots: {
      a: [
        { key: "weapon", label: "Two-hand", opts: ["westfall"],
          why: { westfall: "+48 healing, the most on any weapon at 20. Choose it over the tunic when you finish the chain." },
          alts: [["taskmaster", "+45 healing, from the same run."], ["livingroot", "+45 healing."]] },
        { key: "head", label: "Head", opts: ["circlet:tail", "wishood:lw", "shadowgog:eng"], none: "Nothing with stats drops or comes from a quest at level 20.",
          why: { circlet: "+17 healing and 10 Stamina.", wishood: "+17 healing and 10 Stamina, a dead heat with the circlet. If you buy one pattern, buy this one.", shadowgog: "Engineers only. Intellect and Spirit." } },
        { key: "neck", label: "Neck", opts: ["pendant"],
          why: { pendant: "Stamina and Spirit. The Necklace – Healing Power enchant (+11 healing) does more than any necklace." },
          alts: [["locket", "One less Stamina."]] },
        { key: "shoulder", label: "Shoulders", opts: ["magmantle"],
          why: { magmantle: "5 spell power and 9 Intellect, the most of any shoulders at 20. It’s a Bind on Equip world drop, so watch the Auction House rather than farming it." },
          alts: [["rws", "The same spell power with less Intellect, from any tailor."], ["talbar", "More mana regen, less healing."]] },
        { key: "back", label: "Back", opts: ["prelacy"],
          why: { prelacy: "+11 healing and 6 Spirit. Your one stretch item: the quest sends you into Blackfathom Deeps, which is tuned a few levels higher." },
          alts: [["hwcloak", "Wear it until you get the cape."]] },
        { key: "chest", label: "Chest", opts: ["apron"],
          why: { apron: "+13 healing, 9 Stamina and 7 health per 5. It drops from Shadowfang Keep’s second boss, so you don’t need to push deep." },
          alts: [["corsair", "+10 healing and 8 Spirit, about a point behind, from the last boss in the Deadmines."], ["moccasin", "A little behind."]] },
        { key: "wrist", label: "Wrist", opts: ["mindthrust"],
          why: { mindthrust: "5 Intellect and 3 mp5." },
          alts: [["aetherwisp", "3 spell power instead."]] },
        { key: "hands", label: "Hands", opts: ["prigloves:tail", "wisgloves:lw", "serpgloves"],
          why: { prigloves: "+11 healing.", wisgloves: "+9 healing and 4 Intellect.", serpgloves: "6 spell power, the best you can do without a profession." } },
        { key: "waist", label: "Waist", opts: ["prisash:tail", "wisbelt:lw", "hillbelt"],
          why: { prisash: "+10 healing and 4 Intellect.", wisbelt: "+8 healing and 4 Intellect.", hillbelt: "4 spell power, from any leatherworker." },
          alts: [["slither", "3 mp5 and a way out of roots."]] },
        { key: "legs", label: "Legs", opts: ["ogre"],
          why: { ogre: "+18 healing from the first boss in the Deadmines." },
          alts: [["dreamer", "A quest reward to wear until it drops."]] },
        { key: "feet", label: "Feet", opts: ["wisboots:lw", "priboots:tail", "spidersilk"],
          why: { wisboots: "+10 healing and 5 Intellect.", priboots: "+8 healing and 3 Intellect, a cheap pattern at Tailoring 60.", spidersilk: "7 spell power, and Bind on Equip, so any tailor can make them for you." } },
        { key: "ring", label: "Ring", pair: true, opts: ["mcr", "blackpearl", "lavish"],
          why: { mcr: "4 spell power. Bring a friend for the elite ogre.", blackpearl: "6 Spirit. It’s Bind on Equip, so check the Auction House too.", lavish: "6 Intellect." } },
        { key: "trinket", label: "Trinket", pair: true, opts: ["recomb:eng", "spyglass"], none: "No other trinket at level 20 has stats.",
          why: { recomb: "Engineers only. An emergency heal and a mana top-up.", spyglass: "Just 1 Spirit, but it beats an empty slot." } },
        { key: "relic", label: "Relic", opts: ["driftwood:ench"], none: "Alliance shamans can’t get a relic at 20 without Enchanting.",
          why: { driftwood: "Keeps another 8% of your mana regen going while you cast." } }
      ],
      h: [
        { key: "mh", label: "Main hand", opts: ["stitcher"],
          why: { stitcher: "+48 healing and +16 spell damage on a one-hand mace — Light’s Justice is a Ruins of Lordaeron quest from Morbin Lightbane in Undercity. Pairing it with an off hand beats any single two-hand staff." },
          alts: [["odo", "+52 healing on its own from Odo the Blindwatcher, if you’d rather use one weapon and skip Ruins of Lordaeron — Shadowfang Keep is reachable south of the Sepulcher."], ["friar", "The same +52 healing from Blackfathom Deeps trash, a stretch dungeon for Horde but worth checking the Auction House for."]] },
        { key: "oh", label: "Off hand", opts: ["skum"],
          why: { skum: "+9 healing from Skum, Wailing Caverns’ second boss — stack it with The Stitcher for +57 healing total, more than any single weapon at 20." },
          alts: [["mirrorrath", "No healing, but 547 armor and 11 block from Rath’mael if you’re tanking solo content."]] },
        { key: "head", label: "Head", opts: ["circlet:tail", "wishood:lw", "shadowgog:eng"], none: "Nothing with stats drops or comes from a quest at level 20.",
          why: { circlet: "+17 healing and 10 Stamina.", wishood: "+17 healing and 10 Stamina, a dead heat with the circlet. If you buy one pattern, buy this one.", shadowgog: "Engineers only. Intellect and Spirit." } },
        { key: "neck", label: "Neck", opts: ["pendant"],
          why: { pendant: "Stamina and Spirit. The Necklace – Healing Power enchant (+11 healing) does more than any necklace." },
          alts: [["collar", "2 Intellect and 2 Spirit, from Shadowfang Keep’s first boss."]] },
        { key: "shoulder", label: "Shoulders", opts: ["magmantle"],
          why: { magmantle: "5 spell power and 9 Intellect, the most of any shoulders at 20. It’s a Bind on Equip world drop with no faction lock, so watch the Auction House rather than farming it." },
          alts: [["rws", "The same spell power with less Intellect, from any tailor."], ["talbar", "More mana regen, less healing, from the Wailing Caverns shard quest."]] },
        { key: "back", label: "Back", opts: ["hwcloak"],
          why: { hwcloak: "4 spell power and 4 Spirit, from any tailor. Prelacy Cape needs a Blackfathom Deeps quest that’s Alliance-only." },
          alts: [["thresher", "8 Spirit and 2 spell damage from Old Serra’kis in Blackfathom Deeps, if your group can reach Zoram’gar Outpost."]] },
        { key: "chest", label: "Chest", opts: ["apron"],
          why: { apron: "+13 healing, 9 Stamina and 7 hp5 from Razorclaw the Butcher, Shadowfang Keep’s second boss — a point ahead of Corsair’s Overshirt, which needs the Deadmines anyway." },
          alts: [["moccasin", "+9 healing and 10 Spirit from Lord Cobrahn in Wailing Caverns."]] },
        { key: "wrist", label: "Wrist", opts: ["mindthrust"],
          why: { mindthrust: "5 Intellect and 3 mp5." },
          alts: [["tabitha", "6 Intellect from A Frightened Request, if you’d rather quest."]] },
        { key: "hands", label: "Hands", opts: ["prigloves:tail", "wisgloves:lw", "serpgloves"],
          why: { prigloves: "+11 healing.", wisgloves: "+9 healing and 4 Intellect.", serpgloves: "6 spell power, the best you can do without a profession." } },
        { key: "waist", label: "Waist", opts: ["prisash:tail", "wisbelt:lw", "hillbelt"],
          why: { prisash: "+10 healing and 4 Intellect.", wisbelt: "+8 healing and 4 Intellect.", hillbelt: "4 spell power, from any leatherworker." } },
        { key: "legs", label: "Legs", opts: ["rotlegs"], none: "Ogre Loincloth (+18 healing) needs the Deadmines, so this is a real step down from Alliance’s pick.",
          why: { rotlegs: "8 Intellect and 5 Spirit from The Abandoned in Ruins of Lordaeron — no direct healing, but the best Horde-reachable legs until Wisdom’s Leather Leggings at 30." } },
        { key: "feet", label: "Feet", opts: ["wisboots:lw", "priboots:tail", "spidersilk"],
          why: { wisboots: "+10 healing and 5 Intellect.", priboots: "+8 healing and 3 Intellect, a cheap pattern at Tailoring 60.", spidersilk: "7 spell power, and Bind on Equip, so any tailor can make them for you." } },
        { key: "ring", label: "Ring", pair: true, opts: ["blackpearl", "deepfathom"],
          why: { blackpearl: "6 Spirit. It’s Bind on Equip, so check the Auction House.", deepfathom: "5 Spirit and 3 Stamina from Mutanus." },
          alts: [["totemring", "3 Intellect and 3 Spirit from Revenge of Gann, once you’re close to 25."]] },
        { key: "trinket", label: "Trinket", pair: true, opts: ["recomb:eng"], none: "No trinket a Horde shaman can easily reach at 20 has stats.",
          why: { recomb: "Engineers only. An emergency heal and a mana top-up." } },
        { key: "relic", label: "Relic", opts: ["driftwood:ench"], none: "Same as Alliance: no relic at 20 without Enchanting, unless you’re Windshaper Skyborne (see the notes below).",
          why: { driftwood: "Keeps another 8% of your mana regen going while you cast." } }
      ]
    },
    favor: { a: "Buy the hood pattern first: Wisdom’s Leather Hood, or the Pristine Circlet if you tailor. The gloves and belt come next.", h: "Buy the hood pattern first: Wisdom’s Leather Hood from Pawani, or the Pristine Circlet from Jim’bek — both at Durotar Supply and Logistics, west of the Crossroads. The gloves and belt come next." }
  }
};

const QUEST_CHOICES20 = [
  { q: "The Defias Brotherhood", where: "Deadmines chain · Gryan Stoutmantle, Sentinel Hill", fac: "a",
    pick: { enh: ["tunicwf", "A stopgap chest. The staff does nothing for you."], ele: ["westfall", "A decent stand-in until you have the scepter and tome."], resto: ["westfall", "Your best-in-slot weapon."] } },
  { q: "Underground Assault", where: "Deadmines · Shoni the Shilent, Stormwind", fac: "a",
    pick: { enh: ["bravo", "Backup bracers. Your legs come from the Viper set."], ele: ["dreamer", "Your best-in-slot legs."], resto: ["dreamer", "Legs to wear until Ogre Loincloth drops."] } },
  { q: "Important Heirlooms", where: "Hall of Thanes · Thom Filch, Ironforge", fac: "a",
    pick: { enh: ["tombgloves", "6 Intellect is 6 attack power until you have Gloves of the Fang."], ele: ["tome", "Your best-in-slot off hand."], resto: ["tombgloves", "The tome needs a one-hander, and you use a staff."] } },
  { q: "An Ancient Grudge", where: "Hall of Thanes · starts inside", fac: "a",
    pick: { enh: ["catacomb", "Your cloak against humanoids, even once you have Grave Shroud."], ele: [null, "Either. Both rewards are melee pieces."], resto: [null, "Either. Both rewards are melee pieces."] } },
  { q: "Abominable Creatures", where: "Ruins of Lordaeron · starts inside", fac: "a",
    pick: { enh: ["shroud", "Your best-in-slot cloak."], ele: [null, "Either. Neither helps a caster much."], resto: [null, "Either. Neither helps a caster much."] } },
  { q: "Researching the Corruption", where: "Blackfathom Deeps · Gershala Nightwhisper, Auberdine", fac: "a",
    pick: { enh: [null, "Either. Neither does much for you."], ele: ["prelacy", "A small upgrade over Heavy Woolen Cloak."], resto: ["prelacy", "Your best-in-slot cloak."] } },
  { q: "WANTED: Chok'sul", where: "Loch Modan · poster in Thelsamar · an elite with two bodyguards, so bring a group", fac: "a",
    pick: { enh: ["kimbra", RING_STOPGAP], ele: ["kimbra", RING_STOPGAP], resto: ["kimbra", RING_STOPGAP] } },
  { q: "Hidden Enemies", where: "Ragefire Chasm · Thrall, Orgrimmar", fac: "h",
    pick: { enh: ["axeorg", "A two-hand axe to carry you to Hammerbone; the other rewards (Kris, Hammer) are one-handers you don’t need."], ele: ["orgstaff", "18 spell power and 2 mp5 if you’d rather use a staff and skip the off hand early."], resto: ["orgstaff", "Wear it until Death Speaker Scepter or The Stitcher drop; the other rewards are melee gear."] } },
  { q: "The Power to Destroy...", where: "Ragefire Chasm · Varimathras, Undercity", fac: "h",
    pick: { enh: [null, "Neither reward suits you."], ele: ["ghastly", "The only cloth choice."], resto: ["ghastly", "5 Intellect and 2 mp5 until something better drops."] } },
  { q: "Returning the Lost Satchel", where: "Ragefire Chasm · Rahauro, Thunder Bluff", fac: "h",
    pick: { enh: [null, "Neither reward suits you."], ele: ["featherbead", "5 Intellect, the only cloth choice."], resto: ["featherbead", "The only cloth choice."] } },
  { q: "The Wrath of Rath'mael", where: "Ruins of Lordaeron · Deathguard Kristof, southeast of Brill", fac: "h",
    pick: { enh: [null, "Neither reward is for you — go kill Overlord Ramtusk in Razorfen Kraul for Hammerbone’s upgrade instead."], ele: ["gnarled", "Your best-in-slot weapon if you’d rather skip the off hand."], resto: [null, "Neither reward heals — stay on The Stitcher plus Skum’s Bucket."] } },
  { q: "A Frightened Request", where: "Ruins of Lordaeron · Tabitha Heartweaver, the Sepulcher", fac: "h",
    pick: { enh: [null, "Neither reward is for you."], ele: ["tabitha", "6 Intellect beats the dagger reward for a caster."], resto: ["tabitha", "6 Intellect until something better drops."] } },
  { q: "The New Plague", where: "Ruins of Lordaeron · Theodore Griffs, Undercity", fac: "h",
    pick: { enh: [null, "Neither reward is for you."], ele: ["blight", "7 Intellect and 5 Spirit; the other reward is a sword."], resto: ["blight", "7 Intellect and 5 Spirit."] } },
  { q: "Light’s Justice", where: "Ruins of Lordaeron · Morbin Lightbane, Undercity", fac: "h",
    pick: { enh: [null, "Neither reward is for you."], ele: [null, "The Stitcher is all healing — Elemental gets nothing here."], resto: ["stitcher", "Your best-in-slot weapon."] } },
  { q: "The Book of Ur", where: "Shadowfang Keep · Keeper Bel'dugur, Undercity", fac: "h",
    pick: { enh: [null, "Neither reward is for you."], ele: [null, "Tattered Mittens are healing-only — take Serpent Gloves instead."], resto: ["tattered", "Spirit and spell damage from Fenrus the Devourer’s room."] } },
  { q: "Allegiance to the Old Gods", where: "Blackfathom Deeps · Je'neu Sancrea, Zoram'gar Outpost", fac: "h",
    pick: { enh: ["bandfist", "Strength, Agility and Spirit — your first real Enhancement ring."], ele: ["chestnut", "7 spell power. Backup shoulders now that Magician’s Mantle is the pick, but still the better choice here."], resto: ["chestnut", "7 spell power, backup shoulders behind Magician’s Mantle."] } },
  { q: "Assault on Fenris Isle", where: "Silverpine Forest · High Executor Hadrec, the Sepulcher", fac: "h",
    pick: { enh: [null, "Spell power doesn’t help you."], ele: ["adjudicator", "8 spell power, nearly as good as Leftover Abomination Skin — but Thule Ravenclaw is a level 24 elite, so bring help."], resto: [null, "No healing here — keep Corsair’s Overshirt’s stand-in."] } }
];

const WILDCARDS20 = [
  { k: "evocator", note: "Clearly beats the Scepter of the Abandoned for Elemental, and keeps the tome. A Bind on Equip drop that Wowhead traces to the satyrs in Blackfathom Deeps, so it’s scarce; watch the Auction House." },
  { k: "blessedseer", note: "Beats Elemental’s scepter and tome together. Same source as the blade, a scarce Bind on Equip drop from Blackfathom Deeps, so watch the Auction House." },
  { k: "fillegs", note: "Would beat Ogre Loincloth for Restoration. Tailoring 100; beta data files put the pattern on Verdan the Everliving in Wailing Caverns, but nobody has confirmed a drop." },
  { k: "stormarmor", note: "Would beat Elemental’s chest. Leatherworking 80, but nobody has found where the pattern comes from." },
  { k: "drozem", note: "Would beat Elemental’s chest easily. Reported to drop from Dro’zem the Blasphemous, a level 23 rare elite in Redridge. Not confirmed." },
  { k: "packleader", note: "Worth about 15 attack power to Enhancement. Reported to drop from Humar the Pridelord, a level 23 rare elite in the Barrens whose respawn takes hours. Not confirmed." }
];
const WILDCARDS20H = [
  { k: "packleader", note: "5 Strength and 5 Intellect from Humar the Pridelord, a rare lion in the Barrens with a long respawn — the best neck on this list if you catch him up." },
  { k: "windeffigy", note: "The only non-Enchanting relic a Horde shaman can get — but Meddlesome Mages is on Zephras Isle, the Windshaper Skyborne starting zone (levels 1–12). Orc, Tauren and Troll shamans almost certainly can’t reach it; even Windshaper Skyborne would need to hang onto it well past their starting zone." },
  { k: "mirrorrath", note: "A shield with Strength, Stamina, Intellect, 547 armor and 11 block from Rath’mael — no spell power or healing, but useful if you’re soloing on Ele or Resto." },
  { k: "sacredband", note: "4 Spirit and 2 spell power, but The Den is buried inside Stonetalon’s Talon Den behind four keys and a level 29-30 elite escort. Not realistic at 20 — see the level 30 wildcards instead." },
  { k: "giantmedal", note: "10 Spirit, new in Forever. Nobody has found its source yet." },
  { k: "evocator", note: "Clearly beats the Scepter of the Abandoned for Elemental. A Bind on Equip drop that Wowhead traces to the satyrs in Blackfathom Deeps, so it’s scarce; watch the Auction House." },
  { k: "blessedseer", note: "Beats Elemental’s scepter and buckler together. Same source as the blade, a scarce Bind on Equip drop from Blackfathom Deeps, so watch the Auction House." },
  { k: "fillegs", note: "Would beat Rotmender’s Leggings for Restoration by a wide margin. Tailoring 100; beta data files put the pattern on Verdan the Everliving in Wailing Caverns, but nobody has confirmed a drop." },
  { k: "stormarmor", note: "Would beat Elemental’s chest. Leatherworking 80, but nobody has found where the pattern comes from." },
  { k: "encroach", note: "A two-hand axe (19.7 DPS, Str6+Spi9) from a short Barrens quest at the Dustwallow border — no confirmed required level, so it might land at 20 or 30." }
];

const LEFT_OUT20 = [
  ["Raene's Cleansing, Ashenvale", "The last step is a level 30 quest that needs an elite’s skull.", "Glacial Stone, Ring of Pure Silver"],
  ["Morganth, Redridge", "Level 27 elite.", "Rose Mantle, Demonhide Bracers"],
  ["WANTED: Incinerator Gar'im, Redridge", "Level 25 elite.", "Disjointed Shoes, Incinerator's Boots"],
  ["Gerenzo Wrenchwhistle, Stonetalon", "Level 27 target.", "Draftsman Boots, Engineer's Cloak"],
  ["Blackfathom Villainy", "Ends at a level 27 boss.", "Dark Ritual Leggings, Cultist's Armguards, Arctic Buckler"],
  ["Twilight Falls, Blackfathom Deeps", "Level 25 content.", "Nimbus Boots, Heartwood Girdle"],
  ["Gnomeregan quests", "The dungeon is tuned for levels 26 to 36, and its quests are level 30.", "Shilly Mitts, Operator's Gloves, Technician's Bracers, Fairywing Mantle"],
  ["Bride of the Embalmer and Morbent Fel, Duskwood", "Level 30+ elites.", "Mantle of Honor, Night Watch Pantaloons, Crest of Darkshire"],
  ["Seal of Wrynn chain", "Three steps are level 31 quests, and one runs through the Stockade.", "Seal of Wrynn"],
  ["Greater Friend of the Library", "It needs 20 books, and several sit in level 35+ zones.", "Philanthropist's Ring"],
  ["Nightveiled Rotheap, Wetlands", "Level 31 to 32 elite.", "Malignant Root"],
  ["Ragefire Chasm", "Its entrance is inside Orgrimmar.", "Trogg Scepter, Searing Dagger"],
  ["The Stockade, later Shadowfang Keep bosses, Blackfathom Deeps bosses", "Their drops need level 21 or higher.", "Arced War Axe, Silverlaine's Family Seal, Blackrock Harness, Tree Bark Jacket"],
  ["Leatherworking and tailoring pants, robes and tunics", "Where to get the patterns isn’t confirmed. The Filigreed Pristine Leggings and Stormrider’s Leather Armor patterns are listed under wildcards above.", "Totemic, Stormrider's and Wisdom's Leather Pants; Totemic Leather Armor; Filigreed Pristine Gown"],
  ["Horde-only quests", "Alliance characters can’t take them.", "Windcarved Effigy (a shaman relic), Encroacher's Claim, Hammerbone, Forsaken Greataxe"],
  ["Off-hand weapons", "Shamans can’t dual wield in the beta.", "Shoni's Disarming Tool"]
];
const LEFT_OUT20H = [
  ["The Deadmines", "Deep in Alliance territory, with no Horde quests at all.", "Smite's Mighty Hammer, Rockslicer, Blackened Defias Belt, First Mate Band, Lavishly Jeweled Ring, Corsair's Overshirt, Ogre Loincloth, Staff of Westfall, Taskmaster Axe, Dreamer's Leggings, Bravo's Armbands, Lookie's Spyglass"],
  ["Hall of Thanes", "Under Ironforge; Horde can’t realistically get in even though a couple of its quests (Important Heirlooms, An Ancient Grudge) are technically faction-neutral text.", "Dwarven Tome, Aetherwisp Bracers, Tomb Robber's Gloves, Catacomb Cloak, Deepgrave Trousers"],
  ["The Stockade", "Inside Stormwind, and it has no Horde quests at all.", "Dark Horde Band, Town Clerk's Mittens, Headbasher"],
  ["WANTED: Chok'sul", "A Loch Modan quest deep in Alliance land.", "Minor Channeling Ring, Kimbra Boots"],
  ["The Legend of Stalvan chain", "Duskwood is Alliance territory with no Horde version.", "Ring of Forlorn Spirits"],
  ["Later Shadowfang Keep and Blackfathom Deeps bosses", "Their drops need level 21 or higher.", "Arced War Axe, Silverlaine's Family Seal, Tree Bark Jacket"],
  ["Leatherworking and tailoring pants, robes and tunics", "Where to get the patterns isn’t confirmed. The Filigreed Pristine Leggings and Stormrider’s Leather Armor patterns are listed under wildcards above.", "Totemic, Stormrider's and Wisdom's Leather Pants; Totemic Leather Armor; Filigreed Pristine Gown"],
  ["Off-hand weapons", "Shamans can’t dual wield in the beta, same as Alliance."]
];

const SOURCES = [
  { name: "Mental Dexterity (talent tooltip)", site: "Wowhead", url: "https://www.wowhead.com/forever/spell=415140/mental-dexterity" },
  { name: "Every dungeon quest in WoW Forever", site: "Wowhead", url: "https://www.wowhead.com/forever/guide/dungeons/every-dungeon-quest-location" },
  { name: "Hall of Thanes walkthrough", site: "Wowhead", url: "https://www.wowhead.com/forever/news/the-hall-of-thanes-new-dungeon-walkthrough-for-wow-forever-382991" },
  { name: "Level 20 Enhancement overview", site: "Wowhead", url: "https://www.wowhead.com/forever/guide/classes/shaman/enhancement/level-20-dps-overview" },
  { name: "Raene's Cleansing (quest)", site: "Wowhead", url: "https://www.wowhead.com/forever/quest=1046/raenes-cleansing" },
  { name: "Humar the Pridelord (rare)", site: "Wowhead", url: "https://www.wowhead.com/forever/npc=5828/humar-the-pridelord" },
  { name: "Pattern: Mystic Medium Armor Kit", site: "Wowhead", url: "https://www.wowhead.com/forever/item=252783/pattern-mystic-medium-armor-kit" },
  { name: "Shaman best in slot", site: "ForeverChanges", url: "https://foreverchanges.pro/bis/shaman" },
  { name: "Merchant’s Favor vendors and prices", site: "ForeverChanges", url: "https://foreverchanges.pro/merchants-favor" },
  { name: "Rares and their drops", site: "ForeverChanges", url: "https://foreverchanges.pro/rares" },
  { name: "Merchant’s Favor crates", site: "WoWSoD Pro", url: "https://wowsod.pro/articles/wow-forever-merchants-favor" },
  { name: "Dungeon loot tables", site: "wowtbc.gg", url: "https://wowtbc.gg/warcraftforever/loot-tables/dungeons/" },
  { name: "Mental Dexterity ranks", site: "wowforevertalents", url: "https://wowforevertalents.com/shaman/talents/mental-dexterity/" },
  { name: "Shaman guide and stat values", site: "Warcraft Tavern", url: "https://www.warcrafttavern.com/forever/guides/shaman/" },
  { name: "New leatherworking patterns", site: "Warcraft Tavern", url: "https://www.warcrafttavern.com/forever/news/new-leatherworking-patterns-for-world-of-warcraft-forever/" },
  { name: "New enchanting formulas", site: "Warcraft Tavern", url: "https://www.warcrafttavern.com/forever/news/new-enchanting-formulas-for-world-of-warcraft-forever/" },
  { name: "Every new enchant in WoW Forever", site: "Blizzard Watch", url: "https://blizzardwatch.com/2026/09/21/every-new-enchant-world-warcraft-forever/" },
  { name: "Bracer – Lesser Intellect (Forever values)", site: "Wowhead", url: "https://www.wowhead.com/forever/spell=13622/enchant-bracer-lesser-intellect" },
  { name: "Formula: Enchant Weapon – Insight", site: "Wowhead", url: "https://www.wowhead.com/forever/item=249479" },
  { name: "Ruins of Lordaeron access", site: "wowhandbook", url: "https://wowhandbook.com/zones/dungeons/ruins-of-lordaeron/" },
  { name: "Raene's Cleansing quest chain", site: "Warcraft Wiki", url: "https://warcraft.wiki.gg/wiki/Raene%27s_Cleansing_quest_chain" },
  { name: "Dungeon loot tables (Forever)", site: "zockify", url: "https://www.zockify.com/forever/dungeons/" },
  { name: "Excavation Site: Wetlands", site: "wowhandbook", url: "https://wowhandbook.com/zones/dungeons/excavation-site-wetlands/" },
  { name: "Dungeon pages", site: "ForeverChanges", url: "https://foreverchanges.pro/dungeons" },
  { name: "Elemental Shaman BiS List", site: "wowtbc.gg", url: "https://wowtbc.gg/warcraftforever/bis-list/elemental-shaman/" },
  { name: "Enhancement Shaman BiS List", site: "wowtbc.gg", url: "https://wowtbc.gg/warcraftforever/bis-list/enhancement-shaman/" },
  { name: "Restoration Shaman BiS List", site: "wowtbc.gg", url: "https://wowtbc.gg/warcraftforever/bis-list/restoration-shaman/" },
  { name: "Hammerbone", site: "Wowhead Forever", url: "https://www.wowhead.com/forever/item=270018/hammerbone" },
  { name: "Windcarved Effigy", site: "Wowhead Forever", url: "https://www.wowhead.com/forever/item=263412/windcarved-effigy" },
  { name: "WoW Forever: Meet the New Skyborne (Windshaper / Zephras Isle)", site: "Blizzard News", url: "https://news.blizzard.com/en-us/article/24302071/wow-forever-meet-the-new-skyborne" }
];

const STAT_ORDER = [["str", "Str"], ["agi", "Agi"], ["sta", "Sta"], ["int", "Int"], ["spi", "Spi"], ["ap", "attack power"], ["sp", "spell power"], ["heal", "healing"], ["dmg", "spell damage"], ["mp5", "mp5"], ["hp5", "hp5"]];

const TRINKET30 = { key: "trinket", label: "Trinket", pair: true, opts: ["recomb:eng", "worgenbane", "roogug"], none: "No trinket at 30 adds much.",
  why: { recomb: "Engineers only. An emergency heal and a mana top-up.", worgenbane: "Just 2 mp5, but it beats an empty slot.", roogug: "Just 6 Spirit, but it beats an empty slot." } };
const RELIC30 = { key: "relic", label: "Relic", opts: ["driftwood:ench"], none: "No new relic comes out between levels 21 and 30.",
  why: { driftwood: "Still the only relic you can get. It keeps 8% of your mana regen going while you cast." } };

const SPECS30 = {
  enh: {
    label: "Enhancement", short: "Enh", el: "earth", use: "Solo questing", unit: "attack power",
    talents: [["Thundering Strikes", "5/5"], ["Mental Dexterity", "3/3", true], ["Elemental Weapons", "3/3"], ["Stormstrike", "1/1"], ["Flurry", "5/5", true]],
    blurb: [
      "Mental Dexterity still turns each point of Intellect into 1 attack power, so caster gear keeps showing up on your list. Strength is worth 2 attack power.",
      "Your two-hander matters more than ever. Windfury Weapon and Stormstrike both hit with it, and slow, hard-hitting weapons get the most out of them. 14 attack power equals 1 point of weapon DPS."
    ],
    weights: [["Strength", 2], ["Intellect", 1.1], ["Attack power", 1], ["Spell power", 0.3], ["Agility", 0.25]],
    slots: {
      a: [
        { key: "weapon", label: "Two-hand", opts: ["corpse"],
          why: { corpse: "The hardest-hitting slow two-hander at 30. Slow weapons get more from Windfury Weapon and Stormstrike. It’s an axe, so train Two-Handed Axes from Buliwyf Stonehand in Ironforge." },
          alts: [["pummeler", "Same damage per second, and a mace, so Mace Specialization adds 1% crit. It swings fast, so each Windfury hit is smaller. Its three charges of +50% attack speed help on tough pulls."], ["cobalt", "A slow mace with a Frost damage proc. Bind on Equip, so check the Auction House."], ["pipehammer", "An easy Gnomeregan quest reward to carry you until the axe drops."], ["headbasher", "An earlier stand-in from a Stockade quest: 10 Strength and 9 Intellect."]] },
        { key: "head", label: "Head", opts: ["defhelm:lw", "whisperwind"],
          why: { defhelm: "12 Strength is 24 attack power, your best hat by far. Nobody has confirmed where the pattern is sold yet, so wear the level 20 Defender’s Leather Hood until you find it.", whisperwind: "10 Intellect is 10 attack power for you. It drops from Earthcaller Halmgar, a rare that isn’t there every run." },
          alts: [["cowl", "About the same, and you can buy it. Tailors make it."]] },
        { key: "neck", label: "Neck", opts: ["ghostshard"],
          why: { ghostshard: "14 attack power. It drops from Azshir the Sleepless, a rare that doesn’t spawn every run." },
          alts: [["kaleido", "Your level 20 necklace, until the rare shows up."]] },
        { key: "shoulder", label: "Shoulders", opts: ["dsmantle"],
          why: { dsmantle: "Cloth, but 11 Intellect is 11 attack power for you." },
          alts: [["bloodmage", "About the same, from Scarlet Monastery’s Graveyard."], ["batwing", "About the same, from a rare in Razorfen Kraul."]] },
        { key: "back", label: "Back", opts: ["wolfcape"],
          why: { wolfcape: "10 attack power, from the wolf master in Shadowfang Keep." },
          alts: [["shroud", "Your level 20 cloak."]] },
        { key: "chest", label: "Chest", opts: ["totunic:lw", "raptorbane"],
          why: { totunic: "Strength, Intellect and spell power for your shocks. Your best crafted piece at this level.", raptorbane: "16 attack power, from a Wetlands quest chain you can do solo." },
          alts: [["harness", "14 attack power and more Stamina, from the Stockade’s first boss."]] },
        { key: "wrist", label: "Wrist", opts: ["serrakis"],
          why: { serrakis: "6 Strength is 12 attack power." },
          alts: [["mindthrust", "Your level 20 bracers: 5 Intellect is 5 attack power."]] },
        { key: "hands", label: "Hands", opts: ["earthengloves"],
          why: { earthengloves: "16 attack power. Bind on Equip, so buy them from a leatherworker or the Auction House." },
          alts: [["goldfleck", "Your level 20 gloves, nearly as good."], ["townclerk", "11 Intellect is 11 attack power, from a Stockade quest."]] },
        { key: "waist", label: "Waist", opts: ["prowlerbelt:lw", "bdbelt"],
          why: { prowlerbelt: "Strength, Agility and Intellect add up to about 25 attack power. It needs level 30 to wear.", bdbelt: "Your level 20 belt is still the best you can get without Leatherworking." } },
        { key: "legs", label: "Legs", opts: ["ferine", "totlegs:lw"],
          why: { ferine: "26 attack power plus 12 Intellect: the biggest upgrade on this list after your weapon.", totlegs: "Strength, Intellect and spell power. Wear them until Ferine Leggings drop." } },
        { key: "feet", label: "Feet", opts: ["totboots:lw", "acidic"],
          why: { totboots: "Your level 20 crafted boots are still the best for you.", acidic: "Cloth, but 8 Intellect is 8 attack power." },
          alts: [["spidersilk", "A little behind. Tailors make them."]] },
        { key: "ring", label: "Ring", pair: true, opts: ["firstmate", "silverseal"],
          why: { firstmate: "Your level 20 ring is still one of the two best: 6 Strength is 12 attack power.", silverseal: "5 Strength is 10 attack power." },
          alts: [["ironeye", "About the same as the seal, from a rare in the Graveyard."], ["snakehoop", "7 Intellect is 7 attack power, from a Razorfen Kraul quest."]] },
        TRINKET30,
        RELIC30
      ],
      h: [
        { key: "weapon", label: "Two-hand", opts: ["corpse"],
          why: { corpse: "The hardest-hitting slow two-hander at 30, from Overlord Ramtusk in Razorfen Kraul — a straight ride south through the Barrens for you, where Alliance has to sail to Theramore and sneak past Camp Taurajo." },
          alts: [["pummeler", "Same DPS, a mace, swings fast. Reach Gnomeregan via Rig Wars and Scooty’s transporter in Booty Bay."], ["cobalt", "A slow mace with a Frost proc, Bind on Equip from Scarlet Monastery trash — easy from Undercity."], ["slaghammer", "An earlier Razorfen Kraul trash pickup: Str11+Sta10."], ["hammerbone", "Your level 20 weapon, still solid until Corpsemaker drops."]] },
        { key: "head", label: "Head", opts: ["defhelm:lw", "whisperwind"],
          why: { defhelm: "12 Strength is 24 attack power, your best hat by far. Pawani should sell the same pattern once someone confirms where it’s sold — wear your level 20 Defender’s Leather Hood until then.", whisperwind: "10 Intellect is 10 attack power for you. Drops from Earthcaller Halmgar, a rare in Razorfen Kraul that isn’t there every run." },
          alts: [["cowl", "About the same, and you can buy it. Tailors make it."]] },
        { key: "neck", label: "Neck", opts: ["ghostshard"],
          why: { ghostshard: "14 attack power. Azshir the Sleepless, a Scarlet Monastery Graveyard rare, drops it — a straight ride from Undercity, unlike Alliance’s trek past Tarren Mill." },
          alts: [["kaleido", "Your level 20 necklace, until the rare shows up."], ["packleader", "5 Strength and 5 Intellect, if Humar the Pridelord is up."]] },
        { key: "shoulder", label: "Shoulders", opts: ["dsmantle"],
          why: { dsmantle: "Cloth, but 11 Intellect is 11 attack power for you, from Death Speaker Jargba in Razorfen Kraul." },
          alts: [["bloodmage", "About the same, from Scarlet Monastery’s Graveyard."], ["batwing", "About the same, from a rare in Razorfen Kraul."]] },
        { key: "back", label: "Back", opts: ["wolfcape"],
          why: { wolfcape: "10 attack power, from Wolf Master Nandos in Shadowfang Keep — reachable south of the Sepulcher, no boat trip needed." },
          alts: [["shroud", "Your level 20 cloak, from Unending Torment."]] },
        { key: "chest", label: "Chest", opts: ["totunic:lw", "bloodwrap"],
          why: { totunic: "Strength, Intellect and spell power for your shocks. Your best crafted piece at this level.", bloodwrap: "9 Agility, 4 Stamina and 4 Intellect from Viktor the Vile, a hidden Ruins of Lordaeron boss — a real Horde-only option if you skip Leatherworking." },
          alts: [["barkshell", "8 spell power isn’t much use for Enhancement, but it’s a leather robe from a Barrens quest (Betrayal from Within) if nothing else has dropped."]] },
        { key: "wrist", label: "Wrist", opts: ["serrakis"],
          why: { serrakis: "6 Strength is 12 attack power, from Old Serra’kis in Blackfathom Deeps — reachable via the Horde’s Zoram’gar Outpost." },
          alts: [["mindthrust", "Your level 20 bracers: 5 Intellect is 5 attack power."], ["witherbite", "4 Agility, 3 Intellect and 3 Spirit from Witherfang in Ruins of Lordaeron."]] },
        { key: "hands", label: "Hands", opts: ["earthengloves", "jutebraid"],
          why: { earthengloves: "16 attack power. Bind on Equip, so buy them from a leatherworker or the Auction House.", jutebraid: "5 Intellect and 6 spell power add up to about 11.5 attack power for you, from Horde Presence in Stonetalon." },
          alts: [["wolfclaw", "Str5+Agi6+Sta6 from Razorfen Kraul trash, a little behind."]] },
        { key: "waist", label: "Waist", opts: ["prowlerbelt:lw", "hillbelt"],
          why: { prowlerbelt: "Strength, Agility and Intellect add up to about 25 attack power. It needs level 30 to wear.", hillbelt: "Your level 20 belt is still the best you can get without Leatherworking. Bind on Equip, so buy it from a leatherworker or the Auction House." } },
        { key: "legs", label: "Legs", opts: ["ferine", "totlegs:lw"],
          why: { ferine: "26 attack power plus 12 Intellect: the biggest upgrade on this list after your weapon, from Agathelos the Raging in Razorfen Kraul.", totlegs: "Strength, Intellect and spell power. Wear them until Ferine Leggings drop." } },
        { key: "feet", label: "Feet", opts: ["totboots:lw", "acidic"],
          why: { totboots: "Your level 20 crafted boots are still the best for you.", acidic: "Cloth, but 8 Intellect is 8 attack power, from Viscous Fallout in Gnomeregan." },
          alts: [["spidersilk", "A little behind. Tailors make them."]] },
        { key: "ring", label: "Ring", pair: true, opts: ["silverseal", "bandfist"],
          why: { silverseal: "5 Strength is 10 attack power, from Baron Silverlaine in Shadowfang Keep — no faction lock.", bandfist: "4 Strength, 4 Agility and 6 Spirit from Allegiance to the Old Gods in Blackfathom Deeps." },
          alts: [["ironeye", "About the same as the seal, from a rare in the Graveyard."], ["snakehoop", "7 Intellect is 7 attack power, from Willix the Importer in Razorfen Kraul."]] },
        TRINKET30,
        RELIC30
      ]
    },
    favor: { a: "Buy the Totemic Leather Tunic pattern first (30 Favor). The Totemic Leather Leggings pattern (30 Favor) tides you over until Ferine Leggings drop. The Prowler’s belt pattern costs 20 silver in Ironforge.", h: "Buy the Totemic Leather Tunic pattern first (30 Favor) from Pawani at Durotar Supply and Logistics. The Totemic Leather Leggings pattern (30 Favor) tides you over until Ferine Leggings drop. Nobody’s confirmed the Horde vendor for the Prowler’s belt pattern yet — check your leatherworking trainer." }
  },
  ele: {
    label: "Elemental", short: "Ele", el: "fire", use: "Caster damage", unit: "spell power",
    talents: [["Convection", "5/5"], ["Concussion", "5/5", true], ["Elemental Focus", "1/1"], ["Elemental Alacrity", "3/3", true], ["Call of Thunder", "1/1"], ["Eye of the Storm", "3/3"]],
    blurb: [
      "Spell power still beats everything else. Elemental Alacrity makes Lightning Bolt faster, which also spends mana faster, so Intellect and mp5 matter a little more than at 20.",
      "Your best pieces are spread over five dungeons, so grab the quests on this page before each run."
    ],
    weights: [["Spell power", 1], ["mp5", 0.8], ["Intellect", 0.5], ["Spirit", 0.2], ["Stamina", 0.1]],
    slots: {
      a: [
        { key: "mh", label: "Main hand", opts: ["swinetusk"],
          why: { swinetusk: "40 spell power, far more than any other one-hander at 30. It’s a dagger, so you lose Mace Specialization’s 1% crit, but the spell power more than makes up for it." },
          alts: [["crested", "32 spell power on a mace. Bind on Equip, so check the Auction House."], ["hydrocane", "A staff with 36 spell power, if you’d rather use a two-hander."]] },
        { key: "oh", label: "Off hand", opts: ["orbmystic:ench", "tome"],
          why: { orbmystic: "Enchanters only. 7 spell power and 6 Intellect.", tome: "Your level 20 off hand is still the best you can get without Enchanting." },
          alts: [["seedcloud", "Same spell power as the tome, plus a shield’s armor."]] },
        { key: "head", label: "Head", opts: ["tothelm:lw", "embalmed"],
          why: { tothelm: "11 spell power and 13 Stamina. Nobody has confirmed where the pattern is sold yet.", embalmed: "8 spell damage, 12 Spirit and 7 Stamina. It drops from the Fallen Champion, a rare in the Graveyard that isn’t there every run." },
          alts: [["cowl", "10 Intellect and 5 spell power, and you can buy it. Tailors make it."]] },
        { key: "neck", label: "Neck", opts: ["explorers"],
          why: { explorers: "No necklace at 30 has spell power. This one adds Stamina and Spirit. The Necklace – Spell Power enchant (+6) does more." },
          alts: [["pendant", "Your level 20 necklace, if you skip the Library."]] },
        { key: "shoulder", label: "Shoulders", opts: ["bloodmage"],
          why: { bloodmage: "9 spell power and 9 Intellect, from the Graveyard’s last boss." },
          alts: [["dsmantle", "More Intellect, less spell power."]] },
        { key: "back", label: "Back", opts: ["repaircape"],
          why: { repaircape: "Choose it over the Pipehammer when you finish Data Rescue." },
          alts: [["redwool", "Mana regen and a little damage, from the Stockade."], ["prelacy", "Your level 20 cloak."]] },
        { key: "chest", label: "Chest", opts: ["stormtunic:lw", "treebark", "pristgown:tail"],
          why: { stormtunic: "9 spell power, 6 Intellect and 5 Spirit.", treebark: "12 spell power and extra armor. Bind on Equip, so check the Auction House.", pristgown: "7 spell damage and 7 Intellect." },
          alts: [["dsrobes", "6 spell damage and 11 Intellect, from Razorfen Kraul."]] },
        { key: "wrist", label: "Wrist", opts: ["oilrag"],
          why: { oilrag: "8 spell power and 3 mp5." },
          alts: [["mindthrust", "Your level 20 bracers."]] },
        { key: "hands", label: "Hands", opts: ["townclerk"],
          why: { townclerk: "11 Intellect and 4 spell power, from a Stockade quest you pick up in Darkshire." },
          alts: [["serpgloves", "Your level 20 gloves: 6 spell power."]] },
        { key: "waist", label: "Waist", opts: ["skybelt:lw", "moss"],
          why: { skybelt: "10 spell power, 6 Intellect and 4 Spirit. It needs level 30 to wear.", moss: "12 spell damage, from Blackfathom Deeps’ last boss." },
          alts: [["arugalbelt", "9 spell power, from Shadowfang Keep’s last boss."]] },
        { key: "legs", label: "Legs", opts: ["gazedreamer"],
          why: { gazedreamer: "12 spell power and 9 Spirit." },
          alts: [["leech", "5 spell power and 5 mp5, from the same dungeon."], ["dreamer", "Your level 20 legs."]] },
        { key: "feet", label: "Feet", opts: ["spidersilk"],
          why: { spidersilk: "Your level 20 boots are still the best: 7 spell power." },
          alts: [["acidic", "4 spell power and 8 Intellect."]] },
        { key: "ring", label: "Ring", pair: true, opts: ["forlorn", "darkhorde"],
          why: { forlorn: "8 spell power, at the end of Duskwood’s Stalvan story.", darkhorde: "6 spell power and 6 Stamina, from the Stockade’s first boss." },
          alts: [["mcr", "Your level 20 ring."], ["snakehoop", "Intellect and Spirit instead."]] },
        TRINKET30,
        RELIC30
      ],
      h: [
        { key: "mh", label: "Main hand", opts: ["swinetusk"],
          why: { swinetusk: "40 spell power, far more than any other one-hander at 30 — and Agathelos the Raging is in Razorfen Kraul, a straight ride south for you instead of Alliance’s trek past Camp Taurajo." },
          alts: [["crested", "32 spell power on a mace. Bind on Equip, so check the Auction House."], ["hydrocane", "A staff with 36 spell power from Gnomeregan, if you’d rather use a two-hander."], ["searing", "Your level 20 dagger, until Swinetusk drops."]] },
        { key: "oh", label: "Off hand", opts: ["orbmystic:ench", "seedcloud"],
          why: { orbmystic: "Enchanters only. 7 spell power and 6 Intellect.", seedcloud: "Your level 20 off hand is still the best you can get without Enchanting." },
          alts: [["omega", "8 spell power and 3 mp5 from Compendium of the Fallen, a Scarlet Monastery Library quest — Orcs and Trolls only, and it’s a stretch above 30."], ["vial", "3 Intellect and 3 Spirit from Valuable Vantages, a Barrens quest."]] },
        { key: "head", label: "Head", opts: ["tothelm:lw", "embalmed"],
          why: { tothelm: "11 spell power and 13 Stamina. Nobody has confirmed where the pattern is sold yet.", embalmed: "8 spell damage, 12 Spirit and 7 Stamina. Drops from the Fallen Champion, a Scarlet Monastery Graveyard rare that isn’t there every run — an easy ride from Undercity." },
          alts: [["cowl", "10 Intellect and 5 spell power, and you can buy it. Tailors make it."]] },
        { key: "neck", label: "Neck", opts: ["pendant"], none: "Explorers' League Commendation needs a Scarlet Monastery Library quest that’s Alliance-only (Mythology of the Titans).",
          why: { pendant: "Your level 20 necklace is still your best bet — Stamina and Spirit, no faction-locked upgrade at 30." },
          alts: [["giantmedal", "10 Spirit, new in Forever, but nobody has found where it comes from yet."]] },
        { key: "shoulder", label: "Shoulders", opts: ["bloodmage"],
          why: { bloodmage: "9 spell power and 9 Intellect, from the Graveyard’s last boss — a ride from Undercity." },
          alts: [["dsmantle", "More Intellect, less spell power, from Razorfen Kraul."]] },
        { key: "back", label: "Back", opts: ["thresher"],
          why: { thresher: "8 Spirit and 2 spell damage from Old Serra’kis in Blackfathom Deeps — a little better than the plain cloak, if your group can reach Zoram’gar Outpost." },
          alts: [["hwcloak", "Your level 20 cloak, if Blackfathom Deeps is out of reach. Repairman’s Cape needs Alliance-only Data Rescue."]] },
        { key: "chest", label: "Chest", opts: ["stormtunic:lw", "civinad", "treebark"],
          why: { stormtunic: "9 spell power, 6 Intellect and 5 Spirit.", civinad: "8 spell damage and 12 Spirit — take Rig Wars from Nogg in Orgrimmar’s Valley of Honor instead of Alliance’s Grand Betrayal; same reward.", treebark: "12 spell power and extra armor. Bind on Equip from Blackfathom Deeps trash." },
          alts: [["dsrobes", "6 spell damage and 11 Intellect, from Razorfen Kraul."], ["barkshell", "8 spell power from Betrayal from Within, a Barrens quest — a fine early filler before your other options drop."]] },
        { key: "wrist", label: "Wrist", opts: ["oilrag"],
          why: { oilrag: "8 spell power and 3 mp5, from Electrocutioner 6000 in Gnomeregan." },
          alts: [["mindthrust", "Your level 20 bracers."]] },
        { key: "hands", label: "Hands", opts: ["jutebraid"],
          why: { jutebraid: "6 spell power and 5 Intellect, your best-in-slot, from Horde Presence in Stonetalon." },
          alts: [["serpgloves", "Your level 20 gloves: 6 spell power, if Horde Presence’s elite target is too much solo."]] },
        { key: "waist", label: "Waist", opts: ["skybelt:lw", "moss"],
          why: { skybelt: "10 spell power, 6 Intellect and 4 Spirit. It needs level 30 to wear.", moss: "12 spell damage, from Aku’mai, Blackfathom Deeps’ last boss." },
          alts: [["arugalbelt", "9 spell power, from Shadowfang Keep’s last boss."]] },
        { key: "legs", label: "Legs", opts: ["gazedreamer"],
          why: { gazedreamer: "12 spell power and 9 Spirit, from Twilight Lord Kelris in Blackfathom Deeps." },
          alts: [["leech", "5 spell power and 5 mp5, from the same dungeon."], ["rotlegs", "Your level 20 legs."]] },
        { key: "feet", label: "Feet", opts: ["spidersilk"],
          why: { spidersilk: "Your level 20 boots are still the best: 7 spell power." },
          alts: [["acidic", "4 spell power and 8 Intellect, from Gnomeregan."]] },
        { key: "ring", label: "Ring", pair: true, opts: ["snakehoop", "lagnut"],
          why: { snakehoop: "7 Intellect and 7 Spirit from Willix the Importer, an escort inside Razorfen Kraul — both factions can take it.", lagnut: "7 Spirit and 2 spell damage from Electrocutioner 6000 in Gnomeregan." },
          alts: [["totemring", "3 Intellect and 3 Spirit from Revenge of Gann, if you’d rather quest than farm."], ["blackpearl", "Your level 20 ring."]] },
        TRINKET30,
        RELIC30
      ]
    },
    favor: { a: "Leatherworkers: buy the Stormrider’s Leather Tunic pattern (30 Favor), then the Skycaller’s belt pattern (20 silver in Ironforge). Enchanters: the Orb of Mystic Insight formula (45 Favor).", h: "Leatherworkers: buy the Stormrider’s Leather Tunic pattern (30 Favor) from Pawani, then check your trainer for the Skycaller’s belt pattern — nobody’s confirmed the Horde vendor yet. Enchanters: the Orb of Mystic Insight formula (45 Favor) from Beneris." }
  },
  resto: {
    label: "Restoration", short: "Resto", el: "water", use: "Dungeon healing", unit: "healing",
    talents: [["Improved Healing Wave", "5/5"], ["Mindfulness", "3/3", true], ["Water Shield", "1/1"], ["Ancestral Healing", "3/3"], ["Mana Tide Totem", "1/1", true], ["Nature’s Swiftness", "1/1"]],
    blurb: [
      "Healing power still comes first. Mindfulness keeps half your Spirit regen going while you cast, and Water Shield and Mana Tide Totem pay mana back, so Spirit and mp5 count for more than usual.",
      "At 30 a one-hander and an off hand beat any staff. Death Speaker Scepter alone has more healing than the best staff you can get."
    ],
    weights: [["mp5", 1.2], ["Healing", 1], ["Intellect", 0.5], ["Spirit", 0.4], ["Stamina", 0.1]],
    slots: {
      a: [
        { key: "mh", label: "Main hand", opts: ["dsscepter"],
          why: { dsscepter: "+68 healing, the most on any weapon at 30. It’s a mace, so Mace Specialization adds 1% crit to your heals." },
          alts: [["friar", "A staff with +52 healing to use until the scepter drops. Bind on Equip, so check the Auction House."], ["odo", "The same healing as the Friar’s staff, from Shadowfang Keep."]] },
        { key: "oh", label: "Off hand", opts: ["orbsouls:ench", "skum"],
          why: { orbsouls: "Enchanters only. +13 healing and 6 Spirit.", skum: "+9 healing, from a Wailing Caverns boss you can farm at 20." },
          alts: [["seedcloud", "A shield with 4 spell power, if you want the armor."]] },
        { key: "head", label: "Head", opts: ["embalmed", "filcirclet:tail", "wishelm:lw"],
          why: { embalmed: "+24 healing and 12 Spirit, better than any crafted hat. It drops from the Fallen Champion, a rare in the Graveyard that isn’t there every run.", filcirclet: "+21 healing. Nobody has confirmed where the pattern comes from yet.", wishelm: "+20 healing. Nobody has confirmed where the pattern comes from yet." } },
        { key: "neck", label: "Neck", opts: ["explorers"],
          why: { explorers: "Stamina and Spirit. The Necklace – Healing Power enchant (+11 healing) does more than any necklace." },
          alts: [["pendant", "Your level 20 necklace, if you skip the Library."]] },
        { key: "shoulder", label: "Shoulders", opts: ["bloodmage"],
          why: { bloodmage: "9 spell power and 9 Intellect, from the Graveyard’s last boss." },
          alts: [["dsmantle", "More Intellect, less healing."]] },
        { key: "back", label: "Back", opts: ["repaircape"],
          why: { repaircape: "+9 healing and 7 Spirit. Choose it over the Pipehammer when you finish Data Rescue." },
          alts: [["prelacy", "Your level 20 cloak, almost as good."], ["redwool", "Mana regen instead of Spirit."]] },
        { key: "chest", label: "Chest", opts: ["civinad", "pristgown:tail", "wistunic:lw"],
          why: { civinad: "+25 healing and 12 Spirit, for killing Gnomeregan’s last boss.", pristgown: "+19 healing and 7 Intellect.", wistunic: "+18 healing, 6 Intellect and 6 Spirit." },
          alts: [["dsrobes", "+19 healing and 11 Intellect, from Razorfen Kraul."]] },
        { key: "wrist", label: "Wrist", opts: ["oilrag"],
          why: { oilrag: "8 spell power and 3 mp5." },
          alts: [["bridgebreaker", "+9 healing, from the Stockade."]] },
        { key: "hands", label: "Hands", opts: ["nagagloves", "prigloves:tail", "wisgloves:lw"],
          why: { nagagloves: "+14 healing, from Blackfathom Deeps’ second boss.", prigloves: "Your level 20 crafted gloves, a little behind.", wisgloves: "Your level 20 crafted gloves, a little behind." } },
        { key: "waist", label: "Waist", opts: ["menderbelt:lw", "arugalbelt"],
          why: { menderbelt: "+19 healing plus Intellect and Spirit. It needs level 30 to wear.", arugalbelt: "9 spell power, 5 Spirit and 3 Intellect, from Shadowfang Keep’s last boss." },
          alts: [["slither", "3 mp5 and a way out of roots."]] },
        { key: "legs", label: "Legs", opts: ["pristlegs:tail", "wislegs:lw", "ogre"],
          why: { pristlegs: "+21 healing, 7 Intellect and 5 Spirit.", wislegs: "+20 healing, 7 Intellect and 7 Spirit.", ogre: "Your level 20 legs are still the best you can get without a profession." },
          alts: [["gazedreamer", "12 spell power and 9 Spirit, from Blackfathom Deeps."]] },
        { key: "feet", label: "Feet", opts: ["wisboots:lw", "gnomebot"],
          why: { wisboots: "Your level 20 crafted boots are still the best.", gnomebot: "+10 healing and 12 Stamina." },
          alts: [["acidic", "Intellect and Spirit instead."], ["spidersilk", "7 spell power."]] },
        { key: "ring", label: "Ring", pair: true, opts: ["lagnut", "forlorn"],
          why: { lagnut: "+8 healing and 7 Spirit.", forlorn: "8 spell power, at the end of Duskwood’s Stalvan story." },
          alts: [["darkhorde", "6 spell power and 6 Stamina."], ["snakehoop", "Intellect and Spirit."]] },
        TRINKET30,
        RELIC30
      ],
      h: [
        { key: "mh", label: "Main hand", opts: ["dsscepter"],
          why: { dsscepter: "+68 healing, the most on any weapon at 30 — Death Speaker Jargba is in Razorfen Kraul, an easy ride south of the Crossroads for you." },
          alts: [["friar", "A staff with +52 healing to use until the scepter drops, if you’d rather skip Razorfen Kraul early. Bind on Equip, so check the Auction House."], ["odo", "The same +52 healing, from Shadowfang Keep — closer to home than Blackfathom Deeps."], ["stitcher", "Your level 20 weapon, still solid paired with Skum’s Bucket."]] },
        { key: "oh", label: "Off hand", opts: ["orbsouls:ench", "skum"],
          why: { orbsouls: "Enchanters only. +13 healing and 6 Spirit.", skum: "+9 healing, from a Wailing Caverns boss you can farm at 20." },
          alts: [["mirrorrath", "No healing, but 547 armor and 11 block from Rath’mael if you want the survivability."]] },
        { key: "head", label: "Head", opts: ["embalmed", "filcirclet:tail", "wishelm:lw"],
          why: { embalmed: "+24 healing and 12 Spirit, better than any crafted hat. Drops from the Fallen Champion in the Graveyard, an easy ride from Undercity.", filcirclet: "+21 healing. Nobody has confirmed where the pattern comes from yet.", wishelm: "+20 healing. Nobody has confirmed where the pattern comes from yet." } },
        { key: "neck", label: "Neck", opts: ["pendant"], none: "Explorers' League Commendation needs the Alliance-only Mythology of the Titans quest.",
          why: { pendant: "Stamina and Spirit. The Necklace – Healing Power enchant (+11 healing) does more than any necklace." } },
        { key: "shoulder", label: "Shoulders", opts: ["bloodmage"],
          why: { bloodmage: "9 spell power and 9 Intellect, from the Graveyard’s last boss." },
          alts: [["dsmantle", "More Intellect, less healing, from Razorfen Kraul."]] },
        { key: "back", label: "Back", opts: ["thresher"],
          why: { thresher: "+6 healing and 8 Spirit from Old Serra’kis in Blackfathom Deeps — better than the plain Heavy Woolen Cloak, if you can reach Zoram’gar Outpost." },
          alts: [["hwcloak", "Your level 20 filler, no faction-locked upgrade needed here."]] },
        { key: "chest", label: "Chest", opts: ["civinad", "pristgown:tail", "wistunic:lw"],
          why: { civinad: "+25 healing and 12 Spirit — take Rig Wars in Orgrimmar instead of Alliance’s Grand Betrayal; same reward.", pristgown: "+19 healing and 7 Intellect.", wistunic: "+18 healing, 6 Intellect and 6 Spirit." },
          alts: [["dsrobes", "+19 healing and 11 Intellect, from Razorfen Kraul."]] },
        { key: "wrist", label: "Wrist", opts: ["oilrag"],
          why: { oilrag: "8 spell power and 3 mp5." },
          alts: [["tabitha", "6 Intellect from your level 20 Ruins of Lordaeron quest, if nothing else has dropped."]] },
        { key: "hands", label: "Hands", opts: ["nagagloves", "prigloves:tail", "wisgloves:lw"],
          why: { nagagloves: "+14 healing, from Blackfathom Deeps’ second boss.", prigloves: "Your level 20 crafted gloves, a little behind.", wisgloves: "Your level 20 crafted gloves, a little behind." },
          alts: [["tattered", "Spirit and 3 spell damage from The Book of Ur in Shadowfang Keep, if Blackfathom Deeps is out of reach."]] },
        { key: "waist", label: "Waist", opts: ["menderbelt:lw", "arugalbelt"],
          why: { menderbelt: "+19 healing plus Intellect and Spirit. It needs level 30 to wear.", arugalbelt: "9 spell power, 5 Spirit and 3 Intellect, from Shadowfang Keep’s last boss." } },
        { key: "legs", label: "Legs", opts: ["pristlegs:tail", "wislegs:lw", "rotlegs"],
          why: { pristlegs: "+21 healing, 7 Intellect and 5 Spirit.", wislegs: "+20 healing, 7 Intellect and 7 Spirit.", rotlegs: "Your level 20 legs are still the best you can get without a profession — Ogre Loincloth needs the Deadmines." },
          alts: [["gazedreamer", "12 spell power and 9 Spirit, from Blackfathom Deeps."]] },
        { key: "feet", label: "Feet", opts: ["wisboots:lw", "gnomebot"],
          why: { wisboots: "Your level 20 crafted boots are still the best.", gnomebot: "+10 healing and 12 Stamina, from Crowd Pummeler 9-60 in Gnomeregan." },
          alts: [["spidersilk", "7 spell power."]] },
        { key: "ring", label: "Ring", pair: true, opts: ["lagnut", "snakehoop"],
          why: { lagnut: "+8 healing and 7 Spirit, from Electrocutioner 6000 in Gnomeregan.", snakehoop: "Intellect and Spirit from Willix the Importer, both factions." },
          alts: [["blackpearl", "Your level 20 ring."], ["totemring", "Intellect and Spirit from Revenge of Gann."]] },
        TRINKET30,
        RELIC30
      ]
    },
    favor: { a: "Tailors: buy the Pristine Leggings pattern first (30 Favor). Leatherworkers: Wisdom’s Leather Leggings (30 Favor), then the Mender’s belt pattern (20 silver in Ironforge). Enchanters: the Orb of Souls formula (45 Favor).", h: "Tailors: buy the Pristine Leggings pattern first (30 Favor) from Jim’bek. Leatherworkers: Wisdom’s Leather Leggings (30 Favor) from Pawani, then check your trainer for the Mender’s belt pattern — nobody’s confirmed the Horde vendor yet. Enchanters: the Orb of Souls formula (45 Favor) from Beneris." }
  }
};

const QUEST_CHOICES30 = [
  { q: "Data Rescue", where: "Gnomeregan · Master Mechanic Castpipe, Tinker Town, Ironforge", fac: "a",
    pick: { enh: ["pipehammer", "A strong two-hander to carry you until Corpsemaker drops."], ele: ["repaircape", "Your best-in-slot cloak."], resto: ["repaircape", "Your best-in-slot cloak."] } },
  { q: "The Grand Betrayal", where: "Gnomeregan · High Tinker Mekkatorque, Tinker Town, Ironforge", fac: "a",
    pick: { enh: [null, "Either. The leather legs are mostly Agility, and Ferine Leggings beat them."], ele: ["civinad", "A decent robe while you wait for your best chest."], resto: ["civinad", "Your best-in-slot chest."] } },
  { q: "The Fury Runs Deep", where: "Stockade · Motley Garmason, Dun Modr, Wetlands", fac: "a",
    pick: { enh: ["headbasher", "A good early two-hander: 10 Strength and 9 Intellect."], ele: [null, "Either. Neither helps a caster much."], resto: [null, "Either. Neither helps a caster much."] } },
  { q: "Crime and Punishment", where: "Stockade · Councilman Millstipe, Darkshire, Duskwood", fac: "a",
    pick: { enh: ["townclerk", "11 Intellect is 11 attack power for you."], ele: ["townclerk", "Your best-in-slot gloves."], resto: ["townclerk", "11 Intellect and 4 spell power."] } },
  { q: "The Legend of Stalvan", where: "Duskwood · a long chain that starts in Darkshire", fac: "a",
    pick: { enh: ["forlorn", "The other choice is an axe you can’t use well."], ele: ["forlorn", "Your best-in-slot ring."], resto: ["forlorn", "Your best-in-slot ring."] } },
  { q: "Willix the Importer", where: "Razorfen Kraul · starts inside", fac: "both",
    pick: { enh: ["snakehoop", "7 Intellect is 7 attack power for you."], ele: ["snakehoop", "Intellect and Spirit."], resto: ["snakehoop", "Intellect and Spirit."] } },
  { q: "Rig Wars", where: "Gnomeregan · Nogg, Valley of Honor, Orgrimmar", fac: "h",
    pick: { enh: [null, "Leather legs, mostly Agility; Ferine Leggings beat them."], ele: ["civinad", "Your best-in-slot chest, through a different quest than Alliance but the same reward."], resto: ["civinad", "Your best-in-slot chest, same reward as Alliance’s Grand Betrayal."] } },
  { q: "Compendium of the Fallen", where: "Scarlet Monastery Library · Sage Truthseeker, Thunder Bluff (not for Undead)", fac: "h",
    pick: { enh: [null, "An off-hand orb, no use to a two-hander."], ele: ["omega", "8 spell power and 3 mp5, but Orcs and Trolls only, and the Library is a stretch above 30."], resto: [null, "No healing on this one."] } },
  { q: "Horde Presence", where: "Stonetalon Mountains · Kadrak, Mor’shan Rampart", fac: "h",
    pick: { enh: ["jutebraid", "5 Intellect is 5 attack power, plus 6 spell power for your shocks."], ele: ["jutebraid", "Your best-in-slot gloves at 30."], resto: [null, "The healing gloves from Blackfathom Deeps or your crafted ones beat it."] } },
  { q: "Revenge of Gann", where: "The Barrens · Gann Stonespire, near Bael Modan", fac: "h",
    pick: { enh: [null, "Intellect and Spirit don’t help you much."], ele: ["totemring", "Intellect and Spirit, a fine ring once you’re close to 25."], resto: ["totemring", "Intellect and Spirit for your Mindfulness regen."] } },
  { q: "Betrayal from Within", where: "The Barrens (part 2) · Thork, the Crossroads", fac: "h",
    pick: { enh: [null, "Spell power doesn’t help you."], ele: ["barkshell", "8 spell power, a leather robe with real caster stats."], resto: [null, "No healing here — keep questing toward Civinad Robes."] } },
  { q: "Wrongly Blamed, Justly Corrected", where: "Barrens/Dustwallow border · Grunt Logmar, Camp Taurajo", fac: "h",
    pick: { enh: ["encroach", "A two-hand axe close to Hammerbone if Corpsemaker hasn’t dropped yet."], ele: [null, "It’s a melee axe."], resto: [null, "It’s a melee axe."] } }
];

const WILDCARDS30 = [
  { k: "scorn", note: "Would be the best caster necklace at 30, but it dropped from a Classic event boss that may not exist in Forever." },
  { k: "abomlegs", note: "Would beat Elemental’s legs. Same problem: its Classic source was an event boss." },
  { k: "demogirdle", note: "8 Strength and 9 spell damage. Wowhead has the item but no source; it’s probably from Kam Deepfury in the Stockade." },
  { k: "rack", note: "A shield with Strength and spell power. Probably from Hamhock in the Stockade. Not confirmed." },
  { k: "shovel", note: "A slow two-hander whose attack power doubles against undead. Nobody knows where it comes from yet." },
  { k: "magistrate", note: "14 Intellect and 5 spell power. A new quest reward; the quest isn’t known yet." },
  { k: "ladimore", note: "Probably from the Mor’Ladim chain in Duskwood. Not confirmed." },
  { k: "packleader", note: "Worth about 15 attack power to Enhancement. Reported to drop from Humar the Pridelord, a rare elite in the Barrens. Not confirmed." },
  { k: "evocator", note: "A Bind on Equip world drop with 28 spell power. Nobody has mapped where it drops in Forever yet." }
];
const WILDCARDS30H = [
  { k: "sacredband", note: "Still buried in The Den’s four-key Talon Den escort in Stonetalon — treat it as aspirational, not a real level 30 target." },
  { k: "totemring", note: "Its own item level (25) suggests you may need to be closer to 25–28 to wear it comfortably." },
  { k: "scorn", note: "Same problem as Alliance: it dropped from a Classic event boss that may not exist in Forever." },
  { k: "abomlegs", note: "Same as Alliance: a Classic event-boss item that may not exist in Forever." },
  { k: "rack", note: "A shield with Strength and spell power, probably from Hamhock in the Stockade — which is inside Stormwind, so not realistic for Horde even if it existed for Alliance." },
  { k: "demogirdle", note: "8 Strength and 9 spell damage, probably from the Stockade too — same problem." },
  { k: "magistrate", note: "14 Intellect and 5 spell power legs, new in Forever. Nobody knows where they come from yet, for either faction." }
];

const LEFT_OUT30 = [
  ["Excavation Site and City of Dalaran", "Both new dungeons open with the level 30 cap, but nobody has published their loot yet.", ""],
  ["Scarlet Monastery Library and Armory bosses", "Their drops need level 31 or higher.", "Loksey's Training Stick, Hypnotic Blade, Ravager"],
  ["Gnomeregan’s last boss", "Thermaplugg’s drops need level 31 or higher. His quest reward is still worth it.", "Thermaplugg's Central Core, Charged Gear"],
  ["Other items above level 30", "Blizzard keeps the beta at 30.", "Orb of the Forgotten Seer, Windweaver Staff, Staff of Jordan, Bonebiter"],
  ["Mail armor", "Shamans can’t wear mail until 40 in Forever.", "Half-Eaten Boots, Ogre Grips, Caverndeep Trudgers, Pugilist Bracers"],
  ["The Crone of the Kraul", "The quest may not exist in Forever; Wowhead’s dungeon quest list leaves it out.", "Marbled Buckler"],
  ["Leatherworking 175+ patterns", "They need level 35 to wear.", "Skycaller's, Mender's and Prowler's gloves, shoulders and bracers"],
  ["Ragefire Chasm", "Its entrance is inside Orgrimmar.", "Subterranean Cape, Chasm Walkers"],
  ["Items only on Classic loot lists", "They aren’t in Wowhead’s Forever database.", "Heart of Agamaggan, Wind Spirit Staff, Emissary Cuffs"]
];
const LEFT_OUT30H = [
  ["Excavation Site: Wetlands", "Opens at 30 but sits in Alliance-held Wetlands with no Horde quests and no published loot yet.", ""],
  ["City of Dalaran", "Opens at 30; nobody has published its loot for either faction yet.", ""],
  ["Ormer’s Revenge (Raptorbane Armor)", "Whelgar’s Excavation Site is deep in the Alliance-held Wetlands.", "Raptorbane Armor"],
  ["The Fury Runs Deep / Crime and Punishment", "Both are Stockade quests, inside Stormwind.", "Headbasher, Town Clerk's Mittens"],
  ["The Legend of Stalvan / Mythology of the Titans", "Duskwood and the Alliance side of the Scarlet Monastery Library quest.", "Ring of Forlorn Spirits, Explorers' League Commendation"],
  ["The Den (Talon Den, Stonetalon)", "Needs four keys and a level 29-30 elite escort — too hard to call realistic best-in-slot.", "Sacred Band"],
  ["Scorn's Icy Choker, Abomination Skin Leggings, Repurposed Rack, Demolition Girdle, Ladimore Heirloom Ring", "Same as Alliance: unconfirmed Classic event-boss or Stockade sources.", ""]
];

/* ---------- per-level text ---------- */
const LEVELS = {
  20: {
    lvl: 20, title: "Level 20 Shaman BiS", points: 11,
    lede: "The best gear you can get at the beta’s level 20 cap, picked for your talent build and faction.",
    checklistName: "level 20 checklist",
    specs: SPECS20, choices: QUEST_CHOICES20, wild: { a: WILDCARDS20, h: WILDCARDS20H }, left: { a: LEFT_OUT20, h: LEFT_OUT20H },
    none: "Nothing available at level 20.",
    gearIntro: "The best item for each slot that a level 20 {spec} shaman can get right now, with a fallback. Tick your professions to see what they unlock. Item names link to Wowhead.",
    whereIntro: "Your list for this build, grouped by where it comes from. Most of it is three dungeon runs and a trip to the Auction House.",
    favor: {
      a: ["Leatherworking and tailoring set patterns cost 30 Favor each. The Polished Driftwood Icon and the new weapon enchants cost 45, and the necklace enchants 120."],
      h: ["Pawani at Durotar Supply and Logistics (west of the Crossroads, the Barrens) sells the leatherworking patterns for the same 30 Favor Three Corners charges: buy Defender’s Leather Hood first if you’re Enhancement, or Wisdom’s Leather Hood or Pristine Circlet (from Jim’bek, tailoring) if you’re Resto or Ele. Beneris, in the same camp, sells the Polished Driftwood Icon for 45 Favor once you’re an Enchanter."]
    },
    leftIntro: "These show up on other lists, but you can’t realistically get them at level 20 right now.",
    about: [
      "Stats and sources come from Wowhead’s Forever database and community loot tables. Every Alliance pick and fallback was re-checked against Wowhead item by item on September 30, 2026.",
      "Every item here needs level 20 or lower, and every quest can be picked up at 20 or lower.",
      "Where Wowhead’s tooltip and its raw data differ by a point of spell power, this page shows the tooltip.",
      "The stat values are this page’s own rough estimates, used to rank items. Real value shifts with the rest of your gear.",
      "The beta cap is due to rise to 30. Beta characters are wiped when the beta ends."
    ]
  },
  30: {
    lvl: 30, title: "Level 30 Shaman BiS", points: 21,
    lede: "The best gear you can get at the beta’s level 30 cap, picked for your talent build and faction.",
    checklistName: "level 30 checklist",
    specs: SPECS30, choices: QUEST_CHOICES30, wild: { a: WILDCARDS30, h: WILDCARDS30H }, left: { a: LEFT_OUT30, h: LEFT_OUT30H },
    none: "Nothing available at level 30.",
    gearIntro: "The best item for each slot that a level 30 {spec} shaman can get, with a fallback. Tick your professions to see what they unlock. Item names link to Wowhead.",
    whereIntro: "Your list for this build, grouped by where it comes from. The dungeon planner puts these runs in order.",
    favor: {
      a: ["Tunic and leggings patterns for the leatherworking and tailoring sets cost 30 Favor each. Enchanting’s orbs and staves cost 45, and the necklace enchants 120.",
        "The level 30 leatherworking belts need skill 150. Their patterns cost 20 silver from Granny Finespindle in Ironforge, not Favor."],
      h: ["Leatherworkers: buy the Totemic Leather Tunic pattern first (Enhancement) or Stormrider’s/Wisdom’s Leather Tunic (Ele/Resto), 30 Favor from Pawani. Enchanters: Beneris sells Orb of Mystic Insight and Orb of Souls for 45 Favor each, same as Alliance.",
        "The level 30 leatherworking belt patterns (Prowler’s, Skycaller’s, Mender’s) cost 20 silver from a vendor on the Alliance side (Granny Finespindle in Ironforge) — nobody has confirmed the matching Horde vendor yet, so check your own leatherworking trainer."]
    },
    leftIntro: "These show up on other lists, but you can’t realistically get them at level 30.",
    about: [
      "Stats and sources come from Wowhead’s Forever database and community loot tables, checked in late September 2026, before the cap went up. Expect a few changes once people run these dungeons.",
      "Every item here needs level 30 or lower, and every quest can be picked up at 30 or lower.",
      "Boss names for items that are new in Forever come from community loot tables, because Wowhead doesn’t list a source for them yet.",
      "Where Wowhead’s tooltip and its raw data differ by a point of spell power, this page shows the tooltip.",
      "The stat values are this page’s own rough estimates, used to rank items. Real value shifts with the rest of your gear.",
      "The beta stays at 30 until it ends on October 21. Beta characters are wiped when it ends."
    ]
  }
};

/* ---------- shared logic ---------- */
/* ---------- enchants and armor kits, per slot ----------
   Forever raised many Classic enchants, so these are Forever's own values, checked on Wowhead's Forever
   database in late September 2026. Skill levels are the Classic ones Wowhead still lists. Vendor NPCs
   for kits differ by faction; the recipe itself and its numbers don't.
   An item holds one enchant or one kit, so each slot gets one pick, plus easier or stronger options. */
const EN = {
  impact2hL: { name: "2H Weapon – Lesser Impact", fx: "+5 weapon damage", how: "Enchanter skill 145. Minor Impact (+4, skill 100) is the cheap step down." },
  impact2h: { name: "2H Weapon – Impact", fx: "+6 weapon damage", how: "Enchanter skill 200. Lesser Impact (+5, skill 145) is nearly as good." },
  str2hL: { name: "2H Weapon – Lesser Strength", fx: "+15 Strength", how: "Skill 220. New in Forever, but nobody has confirmed where the formula comes from yet.", tag: "New in Forever" },
  int2hL: { name: "2H Weapon – Lesser Intellect", fx: "+5 Intellect", how: "Enchanter skill 100, from a vendor formula." },
  revelation: { name: "Weapon – Revelation", fx: "When a spell fails to crit, a chance your next spell crits", how: "Skill 140 and a 45-Favor formula from the Merchant’s Favor vendors.", tag: "New in Forever" },
  insight: { name: "Weapon – Insight", fx: "A chance on each cast to double your Spirit for 10 seconds", how: "Skill 140 and a 45-Favor formula. The extra Spirit only restores mana while you aren’t casting, so try it before you pay for it.", tag: "New in Forever" },
  neckStr: { name: "Necklace – Strength", fx: "+5 Strength", how: "Skill 210 and a 120-Favor formula, and the materials are costly.", tag: "New in Forever" },
  neckSp: { name: "Necklace – Spell Power", fx: "+6 spell power", how: "Skill 210 and a 120-Favor formula, and the materials are costly.", tag: "New in Forever" },
  neckHeal: { name: "Necklace – Healing Power", fx: "+11 healing and +4 spell damage", how: "Skill 210 and a 120-Favor formula, and the materials are costly.", tag: "New in Forever" },
  cloakAgi: { name: "Cloak – Minor Agility", fx: "+3 Agility", how: "Skill 110. Small but cheap. Forever raised it to match Lesser Agility." },
  chestStats: { name: "Chest – Minor Stats", fx: "+2 to every stat", how: "Skill 150. Forever made it match Lesser Stats (skill 200), so ask for the cheaper one." },
  chestInt: { name: "Chest – Greater Intellect", fx: "+6 Intellect", how: "Skill 185. Forever turned the old mana enchants into Intellect." },
  bracerStr: { name: "Bracer – Strength", fx: "+5 Strength", how: "Skill 180." },
  bracerStrL: { name: "Bracer – Lesser Strength", fx: "+4 Strength", how: "Skill 140." },
  bracerHealL: { name: "Bracer – Lesser Healing Power", fx: "+16 healing and +6 spell damage", how: "Skill 205. The formula is new in Forever and sold in Desolace.", tag: "New in Forever" },
  bracerHealMin: { name: "Bracer – Minor Healing Power", fx: "+8 healing and +3 spell damage", how: "Skill 90. New in Forever, but where its formula comes from isn’t known yet." },
  bracerIntL: { name: "Bracer – Lesser Intellect", fx: "+5 Intellect", how: "Skill 150. Forever gives it the same +5 as Bracer – Intellect (skill 210), which may get patched." },
  glovesStr: { name: "Gloves – Strength", fx: "+7 Strength", how: "Skill 225, as high as an enchanter can go before level 35." },
  kitForceM: { name: "Forceful Medium Armor Kit", fx: "+4 attack power and +16 armor", how: { a: "Leatherworking 80, from a vendor pattern in Ironforge. Kits trade, so anyone can buy one. Needs level 15. One beta bug report says it adds ranged attack power instead of melee, so try one kit before you buy four.", h: "Leatherworking 80. The leatherworking suppliers in the capitals sell the pattern, and kits trade, so anyone can buy one. Needs level 15. One beta bug report says it adds ranged attack power instead of melee, so try one kit before you buy four." }, tag: "Kit" },
  kitForceH: { name: "Forceful Heavy Armor Kit", fx: "+6 attack power and +24 armor", how: { a: "Leatherworking 135, pattern from Saenorion in Darnassus. Kits trade. Needs level 30. Wowhead doesn’t show its numbers yet, so they come from one site.", h: "Leatherworking 135. The known pattern vendor is Saenorion in Darnassus, so look for kits on the Auction House. Needs level 30. Wowhead doesn’t show its numbers yet, so they come from one site." }, tag: "Kit" },
  kitMysticM: { name: "Mystic Medium Armor Kit", fx: "+2 spell power and +16 armor", how: { a: "Leatherworking 80, from a vendor pattern in Ironforge. Kits trade, so anyone can buy one. Needs level 15.", h: "Leatherworking 80. The leatherworking suppliers in the capitals sell the pattern, and kits trade, so anyone can buy one. Needs level 15." }, tag: "Kit" },
  kitMysticH: { name: "Mystic Heavy Armor Kit", fx: "+4 spell power and +24 armor", how: { a: "Leatherworking 135, pattern from Saenorion in Darnassus. Kits trade. Needs level 30. Wowhead doesn’t show its numbers yet, so they come from one site.", h: "Leatherworking 135. The known pattern vendor is Saenorion in Darnassus, so look for kits on the Auction House. Needs level 30. Wowhead doesn’t show its numbers yet, so they come from one site." }, tag: "Kit" }
};
const NO_CLOAK = "No cloak enchant helps a caster at this level.";
const NO_HELD = "Off-hand items that aren’t shields can’t be enchanted.";
// For each slot: the pick, then [option, label, short note] entries, or a note when nothing is worth it.
// The plan is the same for both factions; only EN's "how" text (the vendor) varies by fac.
const ENCH_PLAN = {
  20: {
    enh: {
      weapon: { pick: "impact2hL", alts: [["str2hL", "Stronger, if you find it"]] },
      neck: { pick: "neckStr" },
      back: { pick: "cloakAgi" },
      chest: { pick: "chestStats", alts: [["kitForceM", "Easier"]] },
      wrist: { pick: "bracerStr", alts: [["bracerStrL", "Easier"]] },
      hands: { pick: "glovesStr", alts: [["kitForceM", "Until then"]] },
      legs: { pick: "kitForceM" },
      feet: { pick: "kitForceM" }
    },
    ele: {
      mh: { pick: "revelation" },
      oh: { none: NO_HELD },
      neck: { pick: "neckSp" },
      back: { none: NO_CLOAK },
      chest: { pick: "chestInt", alts: [["kitMysticM", "Easier", "Nearly as good."]] },
      wrist: { pick: "bracerHealL", alts: [["bracerIntL", "Easier"]] },
      hands: { pick: "kitMysticM" },
      legs: { pick: "kitMysticM" },
      feet: { pick: "kitMysticM" }
    },
    resto: {
      weapon: { pick: "int2hL", alts: [["insight", "Worth a try"]] },
      neck: { pick: "neckHeal" },
      back: { none: NO_CLOAK },
      chest: { pick: "chestInt", alts: [["kitMysticM", "Easier", "Nearly as good."]] },
      wrist: { pick: "bracerHealL", alts: [["bracerHealMin", "Easier"], ["bracerIntL", "Or"]] },
      hands: { pick: "kitMysticM" },
      legs: { pick: "kitMysticM" },
      feet: { pick: "kitMysticM" }
    }
  },
  30: {
    enh: {
      weapon: { pick: "impact2h", alts: [["str2hL", "Stronger, if you find it"]] },
      neck: { pick: "neckStr" },
      back: { pick: "cloakAgi" },
      chest: { pick: "chestStats", alts: [["kitForceH", "Easier"]] },
      wrist: { pick: "bracerStr", alts: [["bracerStrL", "Easier"]] },
      hands: { pick: "glovesStr", alts: [["kitForceH", "Until then"]] },
      legs: { pick: "kitForceH" },
      feet: { pick: "kitForceH" }
    },
    ele: {
      mh: { pick: "revelation" },
      oh: { none: NO_HELD },
      neck: { pick: "neckSp" },
      back: { none: NO_CLOAK },
      chest: { pick: "kitMysticH", alts: [["chestInt", "Or", "Close behind the kit."]] },
      wrist: { pick: "bracerHealL", alts: [["bracerIntL", "Easier"]] },
      hands: { pick: "kitMysticH" },
      legs: { pick: "kitMysticH" },
      feet: { pick: "kitMysticH" }
    },
    resto: {
      mh: { pick: "insight" },
      oh: { none: NO_HELD },
      neck: { pick: "neckHeal" },
      back: { none: NO_CLOAK },
      chest: { pick: "kitMysticH", alts: [["chestInt", "Or", "Close behind the kit."]] },
      wrist: { pick: "bracerHealL", alts: [["bracerHealMin", "Easier"], ["bracerIntL", "Or"]] },
      hands: { pick: "kitMysticH" },
      legs: { pick: "kitMysticH" },
      feet: { pick: "kitMysticH" }
    }
  }
};
function enchEntry(key, fac) {
  const e = EN[key];
  if (!e) return null;
  return Object.assign({}, e, { key: key, how: e.how && typeof e.how === "object" ? (e.how[fac] || e.how.a) : (e.how || "") });
}
// The enchant or kit for one slot: { pick, alts } or { none }, or null for slots nothing can go on.
function enchFor(lvl, specKey, slotKey, fac) {
  const plan = ((ENCH_PLAN[lvl] || ENCH_PLAN[20])[specKey] || {})[slotKey];
  if (!plan) return null;
  if (plan.none) return { none: plan.none };
  return {
    pick: enchEntry(plan.pick, fac),
    alts: (plan.alts || []).map((a) => Object.assign(enchEntry(a[0], fac), { label: a[1], note: a[2] || "" }))
  };
}
// The same picks as a shopping list: one entry per enchant, with the slots it goes on.
function enchGroups(lvl, specKey, fac) {
  const groups = [];
  const byKey = {};
  LEVELS[lvl].specs[specKey].slots[fac === "h" ? "h" : "a"].forEach((slot) => {
    const e = enchFor(lvl, specKey, slot.key, fac);
    if (!e || !e.pick) return;
    // Slots share an entry only when their options match too.
    const id = [e.pick.key].concat(e.alts.map((a) => a.key + ":" + a.label)).join("|");
    let g = byKey[id];
    if (!g) { g = byKey[id] = { pick: e.pick, alts: e.alts, slots: [], keys: [] }; groups.push(g); }
    g.slots.push(slot.label);
    g.keys.push(slot.key);
  });
  return groups;
}

function parseOpt(o) {
  const i = o.indexOf(":");
  return i < 0 ? { k: o, p: null } : { k: o.slice(0, i), p: o.slice(i + 1) };
}
function raceOK(k, race) {
  const it = ITEMS[k];
  return !it || !it.rc || !race || it.rc.indexOf(race) >= 0;
}
function isAvail(o, profs, race) { return (!o.p || profs.has(o.p)) && raceOK(o.k, race); }
// One row per gear slot (two for rings and trinkets): the pick, better options a profession would unlock, and fallbacks.
function computeRows(lvl, specKey, profs, fac, race) {
  const spec = LEVELS[lvl].specs[specKey];
  const slots = spec.slots[fac === "h" ? "h" : "a"];
  const rows = [];
  slots.forEach((slot) => {
    const opts = slot.opts.map(parseOpt);
    const avail = opts.filter((o) => isAvail(o, profs, race));
    const n = slot.pair ? 2 : 1;
    const picks = avail.slice(0, n).map((o) => o.k);
    let cut = opts.length;
    if (picks.length === n) cut = opts.findIndex((o) => o.k === picks[n - 1]);
    const ups = opts.slice(0, cut).filter((o) => o.p && !profs.has(o.p) && raceOK(o.k, race));
    const alts = [];
    avail.slice(n).forEach((o) => alts.push([o.k, (slot.why && slot.why[o.k]) || ""]));
    (slot.alts || []).forEach((a) => {
      if (picks.indexOf(a[0]) === -1 && !alts.some((x) => x[0] === a[0]) && raceOK(a[0], race)) alts.push(a);
    });
    for (let i = 0; i < n; i++) {
      rows.push({
        slot: slot,
        rid: "row-" + slot.key + (slot.pair ? "-" + (i + 1) : ""),
        label: slot.label + (slot.pair ? " " + (i + 1) : ""),
        item: picks[i] || null,
        ups: i === n - 1 ? ups : [],
        alts: i === n - 1 ? alts : []
      });
    }
  });
  return rows;
}
function whereText(g, lvl, fac) {
  let w = g.where;
  if (typeof w === "string") return w;
  if (w && (w[20] || w[30])) w = w[lvl] || w[20];
  if (typeof w === "string") return w;
  return (w && (w[fac] || w.a)) || "";
}
function choicesFor(lvl, fac, race) {
  return LEVELS[lvl].choices.filter((c) => c.fac === "both" || c.fac === fac);
}

window.GEAR_DATA = {
  PROFS: PROFS, PROF_NAME: PROF_NAME, ITEMS: ITEMS, SRC: SRC, GROUPS: GROUPS, WEIGHT: WEIGHT, SOURCES: SOURCES, STAT_ORDER: STAT_ORDER,
  LEVELS: LEVELS, parseOpt: parseOpt, isAvail: isAvail, computeRows: computeRows, whereText: whereText, choicesFor: choicesFor, raceOK: raceOK,
  ENCH: EN, ENCH_PLAN: ENCH_PLAN, enchFor: enchFor, enchGroups: enchGroups
};
})();
