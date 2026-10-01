/* Forever Shaman Toolkit: dungeon data for the planner. From Wowhead's Forever dungeon quest guide,
   community loot tables and dungeon guides, checked in late September 2026. */
(() => {
"use strict";

const DUNGEONS = {
 "hot": {
  "key": "hot",
  "name": "The Hall of Thanes",
  "short": "Hall of Thanes",
  "levels": "13–18",
  "zone": "Ironforge (Old Ironforge)",
  "entrance": {
   "zone": "Ironforge",
   "x": "44.5",
   "y": "49.4",
   "note": ""
  },
  "travel": "You’re home. Walk to the High Seat, Magni’s throne room. Facing it from the Great Forge, take the cobwebbed corridor on the left down into Old Ironforge and follow the path to the lava bridge.",
  "bosses": [
   "Faldrim Anvilmar",
   "Magmatus",
   "Plunder",
   "Durgen Dirgehammer"
  ],
  "forever": "New in Forever: the dwarven royal crypt under Ironforge, built as an Alliance starter dungeon.",
  "quests": [
   {
    "id": 96403,
    "name": "Important Heirlooms",
    "giver": "Thom Filch",
    "where": {
     "zone": "Ironforge (Old Ironforge, entrance bridge)",
     "x": "32.6",
     "y": "44.6"
    },
    "min": 10,
    "chain": "",
    "task": "Loot 8 Dwarven Heirlooms from urns, chests and tables inside (many in the last room behind Durgen's vault).",
    "rewards": [
     "Dwarven Tome",
     "Tomb Robber's Gloves"
    ],
    "note": ""
   },
   {
    "id": 96394,
    "name": "The Restless Dead",
    "giver": "Afadra Dunwall",
    "where": {
     "zone": "Ironforge (Old Ironforge, above the entrance gate)",
     "x": "33.2",
     "y": "47.6"
    },
    "min": 10,
    "chain": "",
    "task": "Kill 15 Enraged Apparitions and 10 Tormented Souls, and put Faldrim Anvilmar's spirit to rest.",
    "rewards": [
     "Dusty Belt",
     "Cryptwalker Bracers"
    ],
    "note": ""
   },
   {
    "id": 96393,
    "name": "Old Ironforge Incursion",
    "giver": "Earthseer Farsen",
    "where": {
     "zone": "Dun Morogh (camp over Gol'Bolar Quarry)",
     "x": "64.8",
     "y": "58.4"
    },
    "min": 9,
    "chain": "1 step before: kill Dark Iron Spies around Dun Morogh 77, 60 until the Dark Iron Map drops (about 10 kills). It starts Underground Map (96391); hand it to Earthseer Farsen to get this quest.",
    "task": "Kill Durgen Dirgehammer (last boss) and bring his head to King Magni Bronzebeard in the Ironforge throne room (~39, 56).",
    "rewards": [
     "Calibrated Blunderbuss",
     "Ironforge Greathammer",
     "Deepblaze"
    ],
    "note": "First get the Dark Iron Map: kill Dark Iron Spies around Dun Morogh 77, 60 (about ten kills), which starts Underground Map."
   },
   {
    "id": 96395,
    "name": "An Ancient Grudge",
    "giver": "Ghostly Attendant",
    "where": {
     "zone": "Inside Hall of Thanes (Anvilmar's Rest, west wing)",
     "x": null,
     "y": null
    },
    "min": 10,
    "chain": "Starts inside the dungeon.",
    "task": "Defeat Faldrim Anvilmar (first boss) and return to the Ghostly Attendant.",
    "rewards": [
     "Catacomb Cloak",
     "Deepgrave Trousers"
    ],
    "note": ""
   },
   {
    "id": 98423,
    "name": "The Treaty of Understanding",
    "giver": "Treaty of Understanding (tablet you pick up in the final vault, Reliquary of Kings)",
    "where": {
     "zone": "Inside Hall of Thanes",
     "x": null,
     "y": null
    },
    "min": 9,
    "chain": "Starts inside the dungeon.",
    "task": "Bring the Treaty to King Magni Bronzebeard in Ironforge.",
    "rewards": [],
    "note": ""
   }
  ],
  "cap": 20
 },
 "rfc": {
  "key": "rfc",
  "name": "Ragefire Chasm",
  "short": "Ragefire Chasm",
  "levels": "15–25",
  "zone": "Orgrimmar",
  "entrance": {
   "zone": "Orgrimmar",
   "x": "53.0",
   "y": "48.9",
   "note": ""
  },
  "travel": "Not practical for Alliance: the entrance is inside Orgrimmar.",
  "bosses": [
   "Oggleflint",
   "Taragaman the Hungerer",
   "Jergosh the Invoker",
   "Bazzalan"
  ],
  "forever": "",
  "quests": [],
  "cap": 20
 },
 "dm": {
  "key": "dm",
  "name": "The Deadmines",
  "short": "Deadmines",
  "levels": "15–25",
  "zone": "Westfall",
  "entrance": {
   "zone": "Westfall",
   "x": "42.6",
   "y": "72.2",
   "note": ""
  },
  "travel": "Take the Deeprun Tram from Tinkertown to Stormwind. Fly to Sentinel Hill (Westfall) if you have it; otherwise walk west through Elwynn Forest into Westfall. From Sentinel Hill ride southwest to the ruined town of Moonbrook and go into the stone building on the west edge of town.",
  "bosses": [
   "Rhahk'Zor",
   "Sneed's Shredder and Sneed",
   "Gilnid",
   "Mr. Smite",
   "Captain Greenskin",
   "Edwin VanCleef",
   "Cookie (optional)"
  ],
  "forever": "Forever adds a new Westfall chain from Alba Fairmoon that ends inside with Destruction in Deadmines.",
  "quests": [
   {
    "id": 166,
    "name": "The Defias Brotherhood",
    "giver": "Gryan Stoutmantle",
    "where": {
     "zone": "Westfall (Sentinel Hill)",
     "x": "56.3",
     "y": "47.5"
    },
    "min": 14,
    "chain": "Starts with The Defias Brotherhood from Gryan; 6 steps before this one, ending with The Defias Traitor escort into Moonbrook.",
    "task": "Kill Edwin VanCleef and bring his head to Gryan.",
    "rewards": [
     "Chausses of Westfall",
     "Tunic of Westfall",
     "Staff of Westfall"
    ],
    "note": ""
   },
   {
    "id": 214,
    "name": "Red Silk Bandanas",
    "giver": "Scout Riell",
    "where": {
     "zone": "Westfall (top of Sentinel Hill tower)",
     "x": "56.6",
     "y": "47.3"
    },
    "min": 14,
    "chain": "Opens after The Defias Traitor (step 6 of the Defias chain).",
    "task": "Collect 10 Red Silk Bandanas from Defias in the Deadmines.",
    "rewards": [
     "Solid Shortblade",
     "Scrimshaw Dagger",
     "Piercing Axe",
     "Monastic Hammer"
    ],
    "note": ""
   },
   {
    "id": 168,
    "name": "Collecting Memories",
    "giver": "Wilder Thistlenettle",
    "where": {
     "zone": "Stormwind City (Dwarven District)",
     "x": "65.2",
     "y": "21.6"
    },
    "min": 14,
    "chain": "",
    "task": "Collect 4 Miners' Union Cards from the undead miners in the mine before the instance portal.",
    "rewards": [
     "Tunneler's Boots",
     "Dusty Mining Gloves",
     "Worn Miner's Waistcord"
    ],
    "note": ""
   },
   {
    "id": 167,
    "name": "Oh Brother...",
    "giver": "Wilder Thistlenettle",
    "where": {
     "zone": "Stormwind City (Dwarven District)",
     "x": "65.2",
     "y": "21.6"
    },
    "min": 15,
    "chain": "",
    "task": "Take Foreman Thistlenettle's Explorers' League Badge from Foreman Thistlenettle (undead, in the mine outside the portal).",
    "rewards": [
     "Miner's Revenge",
     "Miner's Workgloves",
     "Miner's Workboots"
    ],
    "note": ""
   },
   {
    "id": 2040,
    "name": "Underground Assault",
    "giver": "Shoni the Shilent",
    "where": {
     "zone": "Stormwind City (Dwarven District)",
     "x": "55.6",
     "y": "12.6"
    },
    "min": 15,
    "chain": "",
    "task": "Loot the Gnoam Sprecklesprocket from Sneed's Shredder.",
    "rewards": [
     "Polar Gauntlets",
     "Sable Wand",
     "Bravo's Armbands",
     "Dreamer's Leggings"
    ],
    "note": ""
   },
   {
    "id": 373,
    "name": "The Unsent Letter",
    "giver": "Unsent Letter (drops from Edwin VanCleef)",
    "where": {
     "zone": "Inside The Deadmines",
     "x": null,
     "y": null
    },
    "min": 16,
    "chain": "Starts from VanCleef's drop.",
    "task": "Take the letter to Baros Alexston at City Hall, Cathedral Square, Stormwind (49.0, 30.2).",
    "rewards": [],
    "note": ""
   },
   {
    "id": 92753,
    "name": "Destruction in Deadmines",
    "giver": "Alba Fairmoon",
    "where": {
     "zone": "Westfall (Sentinel Hill)",
     "x": "52.4",
     "y": "53.0"
    },
    "min": 9,
    "chain": "New Forever chain. Starts with Testing the Wells from Alba; 9 steps before this one: Testing the Wells, Murloc Gills, The State of the Mines, Moonbrook Espionage, Explosive Consultation, A Dynamite Plan, Detonation at a Distance (2 parts), Explosive Consultation (2).",
    "task": "Plant the Extra-Destructive Explosives by the forge hidden in the Deadmines, then meet Alba at the Deadmines exit in the hills behind Moonbrook (38.6, 83.6) and use the detonator (Destruction in Deadmines (2)).",
    "rewards": [],
    "note": "The last step of Alba Fairmoon’s new Westfall chain. No item reward."
   }
  ],
  "cap": 20
 },
 "wc": {
  "key": "wc",
  "name": "Wailing Caverns",
  "short": "Wailing Caverns",
  "levels": "17–27",
  "zone": "The Barrens",
  "entrance": {
   "zone": "The Barrens",
   "x": "46.0",
   "y": "36.3",
   "note": ""
  },
  "travel": "A long trip into Horde land. Take the boat from Menethil Harbor to Theramore, follow the road west into the Barrens, then head north. The cave is in the mound southwest of the Crossroads, a Horde town, so go around it. Ratchet, a neutral town on the coast, has a flight path.",
  "bosses": [
   "Lady Anacondra",
   "Lord Cobrahn",
   "Kresh",
   "Lord Pythas",
   "Skum",
   "Lord Serpentis",
   "Verdan the Everliving",
   "Mutanus the Devourer"
  ],
  "forever": "",
  "quests": [
   {
    "id": 6981,
    "name": "The Glowing Shard, then In Nightmares",
    "giver": "Glowing Shard (drops from Mutanus the Devourer)",
    "where": {
     "zone": "Inside Wailing Caverns",
     "x": null,
     "y": null
    },
    "min": 15,
    "chain": "Starts from Mutanus's drop. Show the shard to Sputtervalve in Ratchet (63.0, 37.2), then take it to Falla Sagewind on the mountain above WC (48.2, 32.8); she gives In Nightmares (3370).",
    "task": "Bring the Nightmare Shard to Mathrengyl Bearwalker, Cenarion Enclave, Darnassus (~35, 8).",
    "rewards": [
     "Talbar Mantle",
     "Quagmire Galoshes"
    ],
    "note": "Show the shard to Sputtervalve in Ratchet, then take it to Falla Sagewind on the mountain above the cave. She sends you to Darnassus."
   },
   {
    "id": 959,
    "name": "Trouble at the Docks",
    "giver": "Crane Operator Bigglefuzz",
    "where": {
     "zone": "The Barrens (Ratchet)",
     "x": "63.0",
     "y": "37.4"
    },
    "min": 14,
    "chain": "",
    "task": "Get the 99-Year-Old Port from Mad Magglish, a stealthed goblin in the outer caves before the portal.",
    "rewards": [],
    "note": ""
   },
   {
    "id": 1491,
    "name": "Smart Drinks",
    "giver": "Mebok Mizzyrix",
    "where": {
     "zone": "The Barrens (Ratchet)",
     "x": "62.4",
     "y": "37.6"
    },
    "min": 13,
    "chain": "Do Raptor Horns (same NPC) first.",
    "task": "Collect 6 Wailing Essence from ectoplasms in WC.",
    "rewards": [],
    "note": ""
   },
   {
    "id": 1486,
    "name": "Deviate Hides",
    "giver": "Nalpak",
    "where": {
     "zone": "The Barrens (on top of the WC mound)",
     "x": "46.0",
     "y": "35.7"
    },
    "min": 13,
    "chain": "",
    "task": "Collect 20 Deviate Hides from deviate beasts in and around WC.",
    "rewards": [
     "Slick Deviate Leggings",
     "Deviate Hide Pack"
    ],
    "note": ""
   },
   {
    "id": 1487,
    "name": "Deviate Eradication",
    "giver": "Ebru",
    "where": {
     "zone": "The Barrens (on top of the WC mound)",
     "x": "46.0",
     "y": "35.7"
    },
    "min": 15,
    "chain": "",
    "task": "Kill 7 each of Deviate Ravagers, Vipers, Shamblers and Dreadfangs inside.",
    "rewards": [
     "Pattern: Deviate Scale Belt",
     "Sizzle Stick",
     "Dagmire Gauntlets"
    ],
    "note": ""
   }
  ],
  "cap": 20
 },
 "sfk": {
  "key": "sfk",
  "name": "Shadowfang Keep",
  "short": "Shadowfang Keep",
  "levels": "22–30",
  "zone": "Silverpine Forest",
  "entrance": {
   "zone": "Silverpine Forest",
   "x": "44.7",
   "y": "67.8",
   "note": ""
  },
  "travel": "Get to Southshore in Hillsbrad (fly, or ride north from Menethil over Thandol Span through Arathi Highlands), then run west into Silverpine Forest. The keep is on the hill above Pyrewood Village. It’s Horde land, so stay clear of The Sepulcher.",
  "bosses": [
   "Rethilgore",
   "Razorclaw the Butcher",
   "Baron Silverlaine",
   "Commander Springvale",
   "Odo the Blindwatcher",
   "Fenrus the Devourer",
   "Wolf Master Nandos",
   "Archmage Arugal"
  ],
  "forever": "Shadowfang Keep has no Alliance quests.",
  "quests": [],
  "cap": 20
 },
 "rol": {
  "key": "rol",
  "name": "Ruins of Lordaeron",
  "short": "Ruins of Lordaeron",
  "levels": "15–20",
  "zone": "Tirisfal Glades",
  "entrance": {
   "zone": "Tirisfal Glades",
   "x": "71.6",
   "y": "11.4",
   "note": "Rough coordinates."
  },
  "travel": "A long trek through Horde land. From Southshore run west into Silverpine Forest, then north into Tirisfal Glades and east to the ruins above Undercity. Horde guards are around, so travel with your group.",
  "bosses": [
   "Witherfang",
   "The Baron",
   "The Abandoned (hidden)",
   "Bjork",
   "Rath'mael",
   "Viktor the Vile (hidden)",
   "Lordaeron Captain (rare)"
  ],
  "forever": "New in Forever, in the ruins above Undercity. Two bosses are hidden: The Abandoned (summoned at a statue) and Viktor the Vile (at a campfire).",
  "quests": [
   {
    "id": 95250,
    "name": "Abominable Creatures",
    "giver": "Captain Truman",
    "where": {
     "zone": "Inside Ruins of Lordaeron (just past the entrance)",
     "x": null,
     "y": null
    },
    "min": 16,
    "chain": "",
    "task": "Kill The Baron and bring the Head of the Baron back to Captain Truman.",
    "rewards": [
     "Monstrous Cleaver",
     "Grave Shroud",
     "Slain Baron's Signet"
    ],
    "note": ""
   },
   {
    "id": 95195,
    "name": "Bloodied Insignia",
    "giver": "Bloodied Insignia (item found inside)",
    "where": {
     "zone": "Inside Ruins of Lordaeron",
     "x": null,
     "y": null
    },
    "min": 16,
    "chain": "Starts inside the dungeon.",
    "task": "Collect 10 Bloodied Insignias and bring them to General Marcus Jonathan, Stormwind (Trade District, ~64.6, 75.8).",
    "rewards": [
     "Duty Bound Leggings",
     "Remembrance Armor"
    ],
    "note": ""
   },
   {
    "id": 95189,
    "name": "Crest of Lordaeron",
    "giver": "Crest of Lordaeron (item that spawns in different spots inside)",
    "where": {
     "zone": "Inside Ruins of Lordaeron",
     "x": null,
     "y": null
    },
    "min": 16,
    "chain": "Starts inside the dungeon.",
    "task": "Bring the Crest to Lady Dena Kennedy, Royal Gallery, Stormwind Keep.",
    "rewards": [
     "Small Sack of Gems"
    ],
    "note": ""
   },
   {
    "id": 92415,
    "name": "Remember That I Love You",
    "giver": "Blood-Stained Letter (item in the graveyard area deep inside, near a boss)",
    "where": {
     "zone": "Inside Ruins of Lordaeron",
     "x": null,
     "y": null
    },
    "min": 15,
    "chain": "Starts inside the dungeon.",
    "task": "Bring the letter to Orphan Matron Nightingale in front of Stormwind Cathedral (Cathedral Square, ~47.0, 38.0).",
    "rewards": [],
    "note": ""
   }
  ],
  "cap": 20
 },
 "bfd": {
  "key": "bfd",
  "name": "Blackfathom Deeps",
  "short": "Blackfathom Deeps",
  "levels": "22–32",
  "zone": "Ashenvale",
  "entrance": {
   "zone": "Ashenvale",
   "x": "14.5",
   "y": "14.6",
   "note": ""
  },
  "travel": "Take the boat from Menethil Harbor to Auberdine in Darkshore, then run south along the coast into Ashenvale’s Zoram Strand. Or fly to Astranaar and head west to the beach. Swim down through the pool into the cave.",
  "bosses": [
   "Ghamoo-ra",
   "Lady Sarevess",
   "Gelihast",
   "Lorgus Jett",
   "Old Serra'kis",
   "Twilight Lord Kelris",
   "Aku'mai"
  ],
  "forever": "",
  "quests": [
   {
    "id": 971,
    "name": "Knowledge in the Deeps",
    "giver": "Gerrig Bonegrip",
    "where": {
     "zone": "Ironforge (Forlorn Cavern)",
     "x": "50.8",
     "y": "5.6"
    },
    "min": 10,
    "chain": "",
    "task": "Get the Lorgalis Manuscript from a chest underwater near Ghamoo-ra's area.",
    "rewards": [
     "Sustaining Ring"
    ],
    "note": ""
   },
   {
    "id": 1275,
    "name": "Researching the Corruption",
    "giver": "Gershala Nightwhisper",
    "where": {
     "zone": "Darkshore (Auberdine)",
     "x": "38.3",
     "y": "43.0"
    },
    "min": 18,
    "chain": "wowforevertalent lists The Corruption Abroad as the step before;",
    "task": "Collect 8 Corrupted Brain Stems from the naga and satyrs in and around BFD.",
    "rewards": [
     "Beetle Clasps",
     "Prelacy Cape",
     "Staghide Armguards"
    ],
    "note": ""
   },
   {
    "id": 1198,
    "name": "In Search of Thaelrid",
    "giver": "Dawnwatcher Shaedlass",
    "where": {
     "zone": "Darnassus (Craftsmen's Terrace, upper floor)",
     "x": "55.4",
     "y": "25.0"
    },
    "min": 18,
    "chain": "",
    "task": "Find Argent Guard Thaelrid inside BFD.",
    "rewards": [],
    "note": ""
   },
   {
    "id": 1200,
    "name": "Blackfathom Villainy",
    "giver": "Argent Guard Thaelrid",
    "where": {
     "zone": "Inside Blackfathom Deeps (cave southwest of Ghamoo-ra)",
     "x": null,
     "y": null
    },
    "min": 18,
    "chain": "After In Search of Thaelrid (1 step before); can also be shared.",
    "task": "Bring the head of Twilight Lord Kelris to Dawnwatcher Selgorm, Craftsmen's Terrace, Darnassus (~55.4, 23.8).",
    "rewards": [
     "Gravestone Scepter",
     "Arctic Buckler",
     "Dark Ritual Leggings",
     "Cultist's Armguards"
    ],
    "note": ""
   },
   {
    "id": 1199,
    "name": "Twilight Falls",
    "giver": "Argent Guard Manados",
    "where": {
     "zone": "Darnassus (Craftsmen's Terrace)",
     "x": "55.2",
     "y": "24.0"
    },
    "min": 20,
    "chain": "",
    "task": "Collect 10 Twilight Pendants from Twilight's Hammer cultists inside.",
    "rewards": [
     "Nimbus Boots",
     "Heartwood Girdle",
     "Silvered Gauntlets"
    ],
    "note": ""
   }
  ],
  "cap": 20
 },
 "stocks": {
  "key": "stocks",
  "name": "The Stockade",
  "short": "The Stockade",
  "levels": "22–32",
  "zone": "Stormwind City",
  "entrance": {
   "zone": "Stormwind City",
   "x": "41.2",
   "y": "58.0",
   "note": ""
  },
  "travel": "Take the Deeprun Tram from Tinkertown to Stormwind and walk to the canal by the Mage Quarter. Two of its quests start in Darkshire (Duskwood) and Dun Modr (Wetlands), so pick those up on the way.",
  "bosses": [
   "Targorr the Dread",
   "Kam Deepfury",
   "Hamhock",
   "Dextren Ward",
   "Bazil Thredd",
   "Bruegal Ironknuckle (rare)"
  ],
  "forever": "",
  "quests": [
   {
    "id": 387,
    "name": "Quell the Uprising",
    "giver": "Warden Thelwater",
    "where": {
     "zone": "Stormwind City (outside the Stockade)",
     "x": "41.2",
     "y": "58.0"
    },
    "min": 22,
    "chain": "",
    "task": "Kill 10 Defias Prisoners, 8 Defias Convicts and 8 Defias Insurgents.",
    "rewards": [],
    "note": ""
   },
   {
    "id": 388,
    "name": "The Color of Blood",
    "giver": "Nikova Raskol",
    "where": {
     "zone": "Stormwind City (patrols Old Town)",
     "x": null,
     "y": null
    },
    "min": 22,
    "chain": "",
    "task": "Collect 10 Red Wool Bandanas from Defias inside.",
    "rewards": [],
    "note": ""
   },
   {
    "id": 377,
    "name": "Crime and Punishment",
    "giver": "Councilman Millstipe",
    "where": {
     "zone": "Duskwood (Darkshire)",
     "x": "72.0",
     "y": "47.8"
    },
    "min": 22,
    "chain": "",
    "task": "Bring back the Hand of Dextren Ward.",
    "rewards": [
     "Ambassador's Boots",
     "Darkshire Mail Leggings",
     "Town Clerk's Mittens"
    ],
    "note": ""
   },
   {
    "id": 386,
    "name": "What Comes Around...",
    "giver": "Guard Berton",
    "where": {
     "zone": "Redridge Mountains (Lakeshire)",
     "x": "26.6",
     "y": "46.8"
    },
    "min": 22,
    "chain": "",
    "task": "Bring back the Head of Targorr the Dread.",
    "rewards": [
     "Lucine Longsword",
     "Hardened Root Staff",
     "Ursine Hammer"
    ],
    "note": ""
   },
   {
    "id": 378,
    "name": "The Fury Runs Deep",
    "giver": "Motley Garmason",
    "where": {
     "zone": "Wetlands (Dun Modr)",
     "x": "49.6",
     "y": "18.2"
    },
    "min": 22,
    "chain": "Do The Dark Iron War (same NPC) first (1 step before).",
    "task": "Bring back the Head of Kam Deepfury.",
    "rewards": [
     "Belt of Vindication",
     "Headbasher"
    ],
    "note": ""
   },
   {
    "id": 391,
    "name": "The Stockade Riots",
    "giver": "Warden Thelwater",
    "where": {
     "zone": "Stormwind City (outside the Stockade)",
     "x": "41.2",
     "y": "58.0"
    },
    "min": 16,
    "chain": "Starts with The Unsent Letter (drops from Edwin VanCleef in the Deadmines), then Bazil Thredd; 2 steps before this one.",
    "task": "Kill Bazil Thredd and bring his head to Warden Thelwater.",
    "rewards": [],
    "note": ""
   }
  ],
  "cap": 20
 },
 "exsite": {
  "key": "exsite",
  "name": "Excavation Site: Wetlands",
  "short": "Excavation Site",
  "levels": "24–29",
  "zone": "Wetlands",
  "entrance": {
   "zone": "Wetlands",
   "x": "38.5",
   "y": "47.0",
   "note": "Coordinates from one site; not confirmed yet."
  },
  "travel": "Fly to Menethil Harbor, or run from Ironforge through Loch Modan and the Dun Algaz tunnel into the Wetlands. Head for Whelgar’s Excavation Site; the dungeon is up the hill above the dig.",
  "bosses": [
   "Saltspine",
   "Shadetooth",
   "Highland Horror",
   "Relic Guardian"
  ],
  "forever": "New in Forever and opens with the level 30 cap. Nobody has published its quests or loot yet.",
  "quests": [],
  "cap": 30
 },
 "gnomer": {
  "key": "gnomer",
  "name": "Gnomeregan",
  "short": "Gnomeregan",
  "levels": "26–36",
  "zone": "Dun Morogh",
  "entrance": {
   "zone": "Dun Morogh",
   "x": "24.0",
   "y": "40.0",
   "note": ""
  },
  "travel": "Ride west from Ironforge past Kharanos, cross the frozen lake and pass Brewnall Village to the gnome building with the lift. Ride it down and cross the outer area to the entrance. The front way needs no key.",
  "bosses": [
   "Grubbis",
   "Viscous Fallout",
   "Electrocutioner 6000",
   "Crowd Pummeler 9-60",
   "Mekgineer Thermaplugg"
  ],
  "forever": "",
  "quests": [
   {
    "id": 2922,
    "name": "Save Techbot's Brain!",
    "giver": "Tinkmaster Overspark",
    "where": {
     "zone": "Ironforge (Tinkertown)",
     "x": "69.5",
     "y": "50.3"
    },
    "min": 20,
    "chain": "Optional lead-in: Tinkmaster Overspark (2923) from Brother Sarno in Stormwind.",
    "task": "Get Techbot's Memory Core from Techbot in the outer area before the portal.",
    "rewards": [],
    "note": ""
   },
   {
    "id": 2928,
    "name": "Gyrodrillmatic Excavationators",
    "giver": "Shoni the Shilent",
    "where": {
     "zone": "Stormwind City (Dwarven District)",
     "x": "55.6",
     "y": "12.6"
    },
    "min": 20,
    "chain": "",
    "task": "Collect 24 Robo-mechanical Guts from the machines inside.",
    "rewards": [
     "Shoni's Disarming Tool",
     "Shilly Mitts",
     "Operator's Gloves"
    ],
    "note": ""
   },
   {
    "id": 2926,
    "name": "Gnogaine",
    "giver": "Ozzie Togglevolt",
    "where": {
     "zone": "Dun Morogh (Kharanos)",
     "x": "45.9",
     "y": "49.4"
    },
    "min": 20,
    "chain": "Lead-in: The Day After (2927) from Gnoarn in Tinkertown (~69.2, 50.5).",
    "task": "Use the Leaden Collection Phial on Irradiated Pillagers/Invaders in the outer area until it's full.",
    "rewards": [],
    "note": ""
   },
   {
    "id": 2962,
    "name": "The Only Cure is More Green Glow",
    "giver": "Ozzie Togglevolt",
    "where": {
     "zone": "Dun Morogh (Kharanos)",
     "x": "45.9",
     "y": "49.4"
    },
    "min": 20,
    "chain": "After Gnogaine (1 step before).",
    "task": "Collect High Potency Radioactive Fallout from Irradiated Slimes/Horrors inside.",
    "rewards": [],
    "note": ""
   },
   {
    "id": 2924,
    "name": "Essential Artificials",
    "giver": "Klockmort Spannerspan",
    "where": {
     "zone": "Ironforge (Tinkertown)",
     "x": "67.9",
     "y": "46.1"
    },
    "min": 24,
    "chain": "",
    "task": "Collect 12 Essential Artificials from the machines inside.",
    "rewards": [],
    "note": ""
   },
   {
    "id": 2930,
    "name": "Data Rescue",
    "giver": "Master Mechanic Castpipe",
    "where": {
     "zone": "Ironforge (Tinkertown)",
     "x": "69.8",
     "y": "48.1"
    },
    "min": 25,
    "chain": "",
    "task": "Make a Prismatic Punch Card at the four Matrix Punchograph machines inside.",
    "rewards": [
     "Repairman's Cape",
     "Mechanic's Pipehammer"
    ],
    "note": ""
   },
   {
    "id": 2929,
    "name": "The Grand Betrayal",
    "giver": "High Tinker Mekkatorque",
    "where": {
     "zone": "Ironforge (Tinkertown)",
     "x": "68.8",
     "y": "49.0"
    },
    "min": 25,
    "chain": "",
    "task": "Kill Mekgineer Thermaplugg.",
    "rewards": [
     "Civinad Robes",
     "Triprunner Dungarees",
     "Dual Reinforced Leggings"
    ],
    "note": ""
   },
   {
    "id": 2904,
    "name": "A Fine Mess",
    "giver": "Kernobee",
    "where": {
     "zone": "Inside Gnomeregan (after the Clean Zone)",
     "x": null,
     "y": null
    },
    "min": 20,
    "chain": "Starts inside the dungeon.",
    "task": "Escort Kernobee to the Clockwerk Run exit, then report to Scooty in Booty Bay (27.6, 77.4).",
    "rewards": [
     "Fire-welded Bracers",
     "Fairywing Mantle",
     "Technician's Bracers"
    ],
    "note": ""
   },
   {
    "id": 2945,
    "name": "Grime-Encrusted Ring",
    "giver": "Grime-Encrusted Ring (drops from Dark Iron Agents inside)",
    "where": {
     "zone": "Inside Gnomeregan",
     "x": null,
     "y": null
    },
    "min": 28,
    "chain": "Clean it in the Sparklematic 5200 (Clean Zone), then Return of the Ring (2947) and Gnome Improvement (2948) with Talvash del Kissel, Mystic Ward, Ironforge (~36.4, 3.6).",
    "task": "Clean the ring, return it to Talvash, and bring him a Silver Bar, a Moss Agate and some silver.",
    "rewards": [
     "Talvash's Gold Ring"
    ],
    "note": ""
   }
  ],
  "cap": 20
 },
 "rfk": {
  "key": "rfk",
  "name": "Razorfen Kraul",
  "short": "Razorfen Kraul",
  "levels": "29–38",
  "zone": "The Barrens",
  "entrance": {
   "zone": "The Barrens",
   "x": "42.3",
   "y": "89.9",
   "note": ""
  },
  "travel": "Take the boat from Menethil to Theramore, go west through Dustwallow Marsh to the Barrens’ main road and turn south. Pass the Horde town of Camp Taurajo (go around it). The bramble mound is at the far south, just north of the Great Lift.",
  "bosses": [
   "Roogug",
   "Aggem Thorncurse",
   "Death Speaker Jargba",
   "Overlord Ramtusk",
   "Agathelos the Raging",
   "Charlga Razorflank"
  ],
  "forever": "Its entrance and drops need a group of 29 or higher; a level 30 group is right at the low end.",
  "quests": [
   {
    "id": 1221,
    "name": "Blueleaf Tubers",
    "giver": "Mebok Mizzyrix",
    "where": {
     "zone": "The Barrens (Ratchet)",
     "x": "62.4",
     "y": "37.6"
    },
    "min": 20,
    "chain": "",
    "task": "Use the gopher he gives you to dig up 6 Blueleaf Tubers inside RFK.",
    "rewards": [
     "A Small Container of Gems"
    ],
    "note": ""
   },
   {
    "id": 1144,
    "name": "Willix the Importer",
    "giver": "Willix the Importer",
    "where": {
     "zone": "Inside Razorfen Kraul",
     "x": null,
     "y": null
    },
    "min": 22,
    "chain": "Starts inside the dungeon.",
    "task": "Escort Willix out to the dungeon entrance.",
    "rewards": [
     "Monkey Ring",
     "Snake Hoop",
     "Tiger Band"
    ],
    "note": "Rewards: pick Snake Hoop."
   },
   {
    "id": 1142,
    "name": "Mortality Wanes",
    "giver": "Heralath Fallowbrook",
    "where": {
     "zone": "Inside Razorfen Kraul (dying elf in a hut)",
     "x": null,
     "y": null
    },
    "min": 25,
    "chain": "Starts inside the dungeon.",
    "task": "Find Treshala's Pendant (random drop inside) and take it to Treshala Fallowbrook, Tradesmen's Terrace, Darnassus (69.6, 67.6).",
    "rewards": [
     "Mourning Shawl",
     "Lancer Boots"
    ],
    "note": "Its Classic rewards aren’t in Forever’s item data yet."
   },
   {
    "id": 1101,
    "name": "The Crone of the Kraul",
    "giver": "Falfindel Waywarder",
    "where": {
     "zone": "Feralas (Thalanaar)",
     "x": "89.6",
     "y": "46.6"
    },
    "min": 29,
    "chain": "1 step before: Lonebrow's Journal, from a corpse at the bottom of the Great Lift in Thousand Needles.",
    "task": "Bring Razorflank's Medallion from Charlga Razorflank.",
    "rewards": [
     "Berylline Pads",
     "Stonefist Girdle",
     "Marbled Buckler"
    ],
    "note": "Wowhead’s Forever quest list leaves this one out, so it may not exist in Forever."
   }
  ],
  "cap": 20
 },
 "smgy": {
  "key": "smgy",
  "name": "Scarlet Monastery: Graveyard",
  "short": "SM Graveyard",
  "levels": "26–36",
  "zone": "Tirisfal Glades",
  "entrance": {
   "zone": "Tirisfal Glades",
   "x": "85.1",
   "y": "31.4",
   "note": ""
  },
  "travel": "Get to Southshore, then head north past the Horde town of Tarren Mill into the Western Plaguelands and west into Tirisfal Glades. The Monastery is in the northeast of the zone. It’s deep in Horde land, so go with your group.",
  "bosses": [
   "Interrogator Vishas",
   "Bloodmage Thalnos"
  ],
  "forever": "Two of its best drops come from rares that aren’t there every run: Azshir the Sleepless and the Fallen Champion.",
  "quests": [],
  "cap": 20
 },
 "dalaran": {
  "key": "dalaran",
  "name": "City of Dalaran",
  "short": "City of Dalaran",
  "levels": "28–33",
  "zone": "Alterac Mountains",
  "entrance": {
   "zone": "Alterac Mountains",
   "x": "19.4",
   "y": "85.6",
   "note": "Coordinates from one site; not confirmed yet."
  },
  "travel": "Get to Southshore, then head northwest along the road into the Alterac foothills to the ruins of Dalaran beside Lordamere Lake.",
  "bosses": [
   "Arcane Anomaly",
   "Fel Ancient",
   "Mana Devourer",
   "Mana Elemental",
   "Unstable Sentinel",
   "Shade of the Archmage",
   "Lyn the Ignored",
   "Atrexis the Grave Knight",
   "Mana Wraith"
  ],
  "forever": "New in Forever and opens with the level 30 cap. Nine bosses and lots of spellcasters. Nobody has published its loot yet.",
  "quests": [],
  "cap": 30
 },
 "smlib": {
  "key": "smlib",
  "name": "Scarlet Monastery: Library",
  "short": "SM Library",
  "levels": "29–39",
  "zone": "Tirisfal Glades",
  "entrance": {
   "zone": "Tirisfal Glades",
   "x": "85.1",
   "y": "31.4",
   "note": ""
  },
  "travel": "Same courtyard as the Graveyard; the Library door is next to it.",
  "bosses": [
   "Houndmaster Loksey",
   "Arcanist Doan"
  ],
  "forever": "",
  "quests": [
   {
    "id": 1050,
    "name": "Mythology of the Titans",
    "giver": "Librarian Mae Paledust",
    "where": {
     "zone": "Ironforge (Hall of Explorers)",
     "x": "75.0",
     "y": "12.5"
    },
    "min": 28,
    "chain": "",
    "task": "Find the book Mythology of the Titans in the Library wing and bring it back.",
    "rewards": [
     "Explorers' League Commendation"
    ],
    "note": ""
   }
  ],
  "cap": 20
 }
};

const PLANS = {
  20: {
    enh: [
      { key: "hot", why: "A warm-up right under Ironforge. Its quests give Catacomb Cloak and Deepgrave Trousers, solid stand-ins until you finish the rest." },
      { key: "dm", why: "Your weapon lives here: Smite’s Mighty Hammer, plus First Mate Band and Blackened Defias Belt. Start The Defias Brotherhood chain at Sentinel Hill before your first run." },
      { key: "wc", why: "Three Viper set pieces and Snake Eye Kaleidoscope. The Glowing Shard from the last boss starts the quest for Talbar Mantle, your shoulders until a Magician’s Mantle turns up on the Auction House." },
      { key: "rol", opt: true, why: "Only for Abominable Creatures and its Grave Shroud cloak. It’s a long trek through Horde land." },
      { key: "sfk", opt: true, why: "Trash drops Night Reaver and Gloomshroud Armor. They’re Bind on Equip, so check the Auction House first." }
    ],
    ele: [
      { key: "hot", why: "Important Heirlooms gives the Dwarven Tome, your best off hand." },
      { key: "dm", why: "Underground Assault gives Dreamer’s Leggings, your best legs, and Gilnid drops Lavishly Jeweled Ring." },
      { key: "rol", why: "Your weapon and chest: Scepter of the Abandoned from a hidden boss and Leftover Abomination Skin. It’s a long trek through Horde land, so go with your group." },
      { key: "wc", opt: true, why: "Serpent Gloves if you don’t craft, and Seedcloud Buckler as a backup off hand." },
      { key: "sfk", opt: true, why: "Trash drops Mindthrust Bracers. Check the Auction House first." },
      { key: "bfd", opt: true, why: "Researching the Corruption gives Prelacy Cape, a small upgrade. Tuned a few levels above 20." }
    ],
    resto: [
      { key: "dm", why: "Three of your best pieces: Ogre Loincloth, Lookie’s Spyglass and the Staff of Westfall from The Defias Brotherhood chain, plus Corsair’s Overshirt, a chest within a point of your best. Start that chain at Sentinel Hill first." },
      { key: "wc", why: "Serpent Gloves if you don’t craft, plus good backups: Living Root, Robe of the Moccasin and Talbar Mantle." },
      { key: "sfk", opt: true, why: "Bloody Apron, your best chest, from Razorclaw the Butcher, the second boss. It’s only a hair ahead of Corsair’s Overshirt, so go when your group is heading there anyway. The trash drops Mindthrust Bracers; check the Auction House first." },
      { key: "bfd", why: "Only for Researching the Corruption and its Prelacy Cape, your best cloak. Tuned a few levels above 20, so go once your group has gear from the first two." },
      { key: "hot", opt: true, why: "An easy warm-up under Ironforge to practice healing." }
    ],
    skip: [
      { key: "rfc", why: "Its entrance is inside Orgrimmar." }
    ]
  },
  30: {
    enh: [
      { key: "stocks", why: "The Fury Runs Deep gives Headbasher, a strong early two-hander, and Crime and Punishment gives Town Clerk’s Mittens. Pick up both quests on the way." },
      { key: "sfk", why: "Wolfmaster Cape and Silverlaine’s Family Seal." },
      { key: "bfd", why: "Bands of Serra’kis from Old Serra’kis." },
      { key: "gnomer", why: "Data Rescue gives Mechanic’s Pipehammer to carry you. Crowd Pummeler 9-60 drops the Manual Crowd Pummeler, and Viscous Fallout the Acidic Walkers." },
      { key: "rfk", why: "The big one: Corpsemaker, Ferine Leggings and Death Speaker Mantle. It’s the longest trip and the hardest dungeon, so save it for last." },
      { key: "smgy", opt: true, why: "Ghostshard Talisman, if Azshir the Sleepless is up. He isn’t there every run." },
      { key: "exsite", opt: true, why: "New at 30 and close to home. Nobody has published its loot yet, so it’s a gamble." }
    ],
    ele: [
      { key: "stocks", why: "Crime and Punishment gives Town Clerk’s Mittens, and the first boss drops Dark Horde Band." },
      { key: "bfd", why: "Gaze Dreamer Pants and Moss Cinch, plus Tree Bark Jacket from the trash." },
      { key: "gnomer", why: "Spidertank Oilrag, and Data Rescue for Repairman’s Cape." },
      { key: "smgy", why: "Bloodmage Mantle, plus the Embalmed Shroud if the Fallen Champion is up." },
      { key: "rfk", why: "Swinetusk Shank, your weapon, from Agathelos." },
      { key: "smlib", opt: true, why: "Only for the Mythology of the Titans book and its necklace. Tuned a little above 30." },
      { key: "exsite", opt: true, why: "New at 30 and close to home. Nobody has published its loot yet." }
    ],
    resto: [
      { key: "gnomer", why: "Your jackpot: Civinad Robes and Repairman’s Cape from the quests, plus Spidertank Oilrag, Electrocutioner Lagnut and Gnomebot Operating Boots." },
      { key: "bfd", why: "Naga Battle Gloves from Lady Sarevess." },
      { key: "sfk", why: "Belt of Arugal from the last boss, and Odo’s Ley Staff as a backup weapon." },
      { key: "smgy", why: "Bloodmage Mantle, plus the Embalmed Shroud if the Fallen Champion is up." },
      { key: "rfk", why: "Death Speaker Scepter, your weapon, from Death Speaker Jargba." },
      { key: "wc", opt: true, why: "Skum’s Bucket, your off hand, from a level 20 boss. Quick to farm at 30." },
      { key: "smlib", opt: true, why: "Only for the Mythology of the Titans book and its necklace. Tuned a little above 30." },
      { key: "exsite", opt: true, why: "New at 30 and close to home. Nobody has published its loot yet." }
    ],
    skip: [
      { key: "dalaran", why: "New at 30, but tuned for 28 to 33 and nobody has published its loot yet." },
      { key: "rfc", why: "Its entrance is inside Orgrimmar." }
    ]
  }
};

const SOURCES = [
  { name: "Every dungeon quest in WoW Forever", site: "Wowhead", url: "https://www.wowhead.com/forever/guide/dungeons/every-dungeon-quest-location" },
  { name: "Dungeon loot tables", site: "wowtbc.gg", url: "https://wowtbc.gg/warcraftforever/loot-tables/dungeons/" },
  { name: "Dungeon guides", site: "zockify", url: "https://www.zockify.com/forever/dungeons/" },
  { name: "Quest accept levels", site: "wowforevertalent", url: "https://wowforevertalent.com/quests" },
  { name: "Hall of Thanes walkthrough", site: "Wowhead", url: "https://www.wowhead.com/forever/news/the-hall-of-thanes-new-dungeon-walkthrough-for-wow-forever-382991" },
  { name: "Ruins of Lordaeron guide", site: "Icy Veins", url: "https://www.icy-veins.com/wow-forever/ruins-of-lordaeron-guide" },
  { name: "Excavation Site: Wetlands", site: "wowhandbook", url: "https://wowhandbook.com/zones/dungeons/excavation-site-wetlands/" },
  { name: "City of Dalaran", site: "WoW Eternity", url: "https://woweternity.com/forever/dungeons/city-of-dalaran" },
  { name: "New ship routes in Forever", site: "Wowhead", url: "https://www.wowhead.com/forever/news/three-new-ship-routes-debuting-in-forever-382891" }
];

window.DUNGEON_DATA = { DUNGEONS: DUNGEONS, PLANS: PLANS, SOURCES: SOURCES };
})();
