# Forever Shaman Toolkit

Two small tools for a level 20 Dwarf Shaman in the WoW Forever beta:

- **Level 20 checklist** (`/checklist`): spells to train, the Call of Water totem quest, talents and totem bar setup.
- **Best-in-slot gear** (`/gear`): the best gear you can get at 20 for Enhancement, Elemental or Restoration, with sources, profession options, enchants and quest reward picks.

Each page is a single self-contained HTML file. Progress (ticks, build, professions) is saved in the visitor's own browser with `localStorage`, so every friend gets their own tracker and nothing is stored on a server.

## Structure

```
index.html            home page
checklist/index.html  level 20 checklist
gear/index.html       best-in-slot gear guide
favicon.svg
vercel.json           clean URLs (/checklist, /gear) and a couple of safe headers
```

## Run it locally

Any static file server works, for example:

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploy on Vercel

It's a static site with no build step.

1. In Vercel, choose **Add New → Project** and import this repository.
2. Leave **Framework Preset** on **Other**, with no build command and the root directory as the output.
3. Deploy. Every push to `main` redeploys automatically.

Data reflects the WoW Forever beta as of late September 2026 and can change before launch. Fan-made; not affiliated with Blizzard Entertainment.
