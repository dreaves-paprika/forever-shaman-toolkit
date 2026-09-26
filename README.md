# Forever Shaman Toolkit

Small tools for a Dwarf Shaman in the WoW Forever beta:

- **Level-cap checklist** (`/checklist`): spells to train, the totem quests, talents and totem bar setup.
- **Best-in-slot gear** (`/gear`): the best gear you can get at the cap for Enhancement, Elemental or Restoration, with sources, profession options, enchants and quest reward picks. **Share my build** makes a read-only link to your picks.
- **Dungeon planner** (`/dungeons`): which dungeons to run for your build and in what order, the quests to pick up first, the upgrades in each one, and how to get there.
- **Party board** (`/party`): builds, checklist progress, totems and gear for friends who choose to join.

Each page is a single self-contained HTML file. Progress (ticks, build, professions, dungeons done) is saved in the visitor's own browser with `localStorage`, so every friend gets their own tracker. The gear guide and the dungeon planner share the same "have it" ticks.

There's also a private **stats page** (`/admin`) for the site owner. It shows who uses the toolkit and how far along they are, holds the level cap switch, and collects notes visitors send.

## Level 20 and level 30

The beta's cap is level 20, rising to 30 later. The checklist, gear guide and dungeon planner each hold both versions.

- The live cap is stored in the database and served by `/api/config` (cached at the edge for about a minute). While it's 20, visitors only see level 20.
- The owner switches it on `/admin` under **Level cap**. After that, visitors start on level 30 and can flip back to 20 at the top of each page.
- To look at the level 30 pages before switching, add `?preview=30` to a page's address (for example `/gear?preview=30`). The preview lasts for that browser tab; `?preview=off` ends it.

## Sharing and the party board

- **Share my build** on the gear guide copies a link like `/gear?share=1&lvl=20&spec=resto&profs=lw&have=…&by=Name`. It opens a read-only copy that never touches the viewer's own tracker.
- The **party board** only lists people who join it, from the board itself or with the checkbox under the name box. A card shows their name, build, checklist and gear progress, totems, professions and roughly when they were last on (rounded to the hour). Leaving, removing the name or choosing "Don't count me" takes them off. The owner can also take someone off from `/admin`.

## Notes to the admin

Every gear slot and dungeon card has a **Note to admin** button, and every page has a "Send a note to the admin" link at the bottom. Visitors pick a kind (a better option, something's wrong, or an idea), write the note and can add a name. The note records what it's about: the page, the slot or dungeon, the level and build, and the item currently picked there.

Notes show up in the **Notes from visitors** card on `/admin`. Mark each one "Looking into it" or "Done", reopen it, delete it, or copy the open ones as plain text to work through somewhere else.

Limits: 8 notes an hour from one browser, 60 an hour across the site, 1,000 kept in all, and a hidden field that catches simple bots. Browsers that chose "Don't count me" can still send notes; theirs aren't linked to a visitor.

## Structure

```
index.html              home page
checklist/index.html    level 20 and 30 checklist
gear/index.html         best-in-slot gear guide and shared builds
dungeons/index.html     dungeon planner
party/index.html        party board
admin/index.html        private stats page and level cap switch (needs ADMIN_KEY)
assets/site.js          live level cap, level choice and preview (shared by the pages)
assets/gear-data.js     items, sources and best-in-slot picks for both levels
assets/dungeon-data.js  dungeons, quests, travel and run order for both levels
assets/track.js         visit stats, the optional name box and party board joining
assets/notes.js         the "Note to admin" form
api/track.js            records visits, progress, names and party board joins
api/stats.js            stats for the admin page, plus its actions
api/config.js           the live level cap
api/party.js            the party board (only people who joined, only what they agreed to show)
api/note.js             takes notes for the admin
api/_lib.js             shared helpers (not a route)
favicon.svg
vercel.json             clean URLs and headers
```

## Visit stats

`assets/track.js` gives each browser a random ID in `localStorage`. It sends the page opened, a short progress summary (level, build, how many items ticked, totems, professions, which gear pieces are owned) and, if the visitor adds one, their name. The server adds rough location and device type from Vercel's request headers. IP addresses are not stored, and there are no cookies.

Each page has a note explaining this, a box for adding a name, and a **Don't count me** link. That link removes the visitor's record, takes them off the party board and stops counting that browser.

Data lives in an Upstash Redis database connected through the Vercel Marketplace. Daily activity is kept for 120 days.

Vercel Web Analytics also runs on the public pages for aggregate page views.

### Environment variables

| Name | What it's for |
|---|---|
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Added automatically when the Upstash database is connected to the project |
| `ADMIN_KEY` | The passphrase for `/admin`. Set it yourself in Vercel under Settings, Environment Variables |
| `STATS_TZ` | Optional. Time zone for "today" and the daily chart. Defaults to `America/Chicago` |

Environment variable changes take effect on the next deployment.

## Run it locally

The tools are static, so any static file server works:

```
python3 -m http.server 8000
```

Then open http://localhost:8000. The functions need `vercel dev` and the environment variables above; without them, the tools still work at level 20 and simply skip the stats and the party board.

## Deploy on Vercel

1. In Vercel, choose **Add New → Project** and import this repository.
2. Leave **Framework Preset** on **Other**, with no build command and the root directory as the output.
3. Deploy. Every push to `main` redeploys automatically.

Data reflects the WoW Forever beta as of late September 2026 and can change before launch. Fan-made; not affiliated with Blizzard Entertainment.
