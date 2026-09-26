# Forever Shaman Toolkit

Two small tools for a level 20 Dwarf Shaman in the WoW Forever beta:

- **Level 20 checklist** (`/checklist`): spells to train, the Call of Water totem quest, talents and totem bar setup.
- **Best-in-slot gear** (`/gear`): the best gear you can get at 20 for Enhancement, Elemental or Restoration, with sources, profession options, enchants and quest reward picks.

Each page is a single self-contained HTML file. Progress (ticks, build, professions) is saved in the visitor's own browser with `localStorage`, so every friend gets their own tracker.

There's also a private **stats page** (`/admin`) for the site owner. It shows who uses the toolkit and how far along they are.

## Structure

```
index.html            home page
checklist/index.html  level 20 checklist
gear/index.html       best-in-slot gear guide
admin/index.html      private stats page (needs the ADMIN_KEY passphrase)
assets/track.js       visit stats and the optional "add your name" box
api/track.js          records visits (Vercel Function)
api/stats.js          returns stats to the admin page (Vercel Function)
api/_lib.js           shared helpers (not a route)
favicon.svg
vercel.json           clean URLs and headers
```

## Visit stats

`assets/track.js` gives each browser a random ID in `localStorage`. It sends the page opened, a short progress summary (build, how many items ticked, professions) and, if the visitor adds one, their name. The server adds rough location and device type from Vercel's request headers. IP addresses are not stored, and there are no cookies.

Each page has a note explaining this, a box for adding a name, and a **Don't count me** link. That link removes the visitor's record and stops counting that browser.

Data lives in an Upstash Redis database connected through the Vercel Marketplace. Daily activity is kept for 120 days.

Vercel Web Analytics also runs on the three public pages for aggregate page views.

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

Then open http://localhost:8000. The stats functions need `vercel dev` and the environment variables above; without them, the tools still work and simply skip the stats.

## Deploy on Vercel

1. In Vercel, choose **Add New → Project** and import this repository.
2. Leave **Framework Preset** on **Other**, with no build command and the root directory as the output.
3. Deploy. Every push to `main` redeploys automatically.

Data reflects the WoW Forever beta as of late September 2026 and can change before launch. Fan-made; not affiliated with Blizzard Entertainment.
