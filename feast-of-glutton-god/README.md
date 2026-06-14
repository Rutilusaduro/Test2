# Feast of the Glutton God

An open-world text adventure RPG celebrating abundance, weight gain, and the awakening of **the Fat Goddess**.

## Quick Start

```bash
cd feast-of-glutton-god
npm install
npm run dev
```

Open the URL shown in the terminal (typically http://localhost:5173).

## GitHub Pages

The game deploys automatically on pushes to `main`, or manually via **Actions → Deploy Feast of the Glutton God to GitHub Pages → Run workflow**.

**One-time repo setup:**

1. Open **Settings → Pages**
2. Under **Build and deployment**, set **Source** to **GitHub Actions**

After a successful deploy, the game is live at:

**https://rutilusaduro.github.io/Test2/**

Local preview of the Pages build:

```bash
npm run build:pages
npm run preview:pages
```

## Features

- **Modular Text Engine** — ported from the Professor Sim reference branch; slots, phrase pools, selectors, and context-driven prose adapt to size stage, relationship, corruption, body type, and location.
- **Four player classes** — Bard (Feast-Singer), Wizard (School of Overflow), Cleric (Domain of Plenty), Warlock (Pact of the Fat Goddess).
- **12 size stages** — affecting stats, movement, combat tile occupancy, and all descriptive text.
- **Deep NPC interactions** — Talk, Flirt, Observe, Feed, Bless, Feast, class Special actions, Intimate, Corrupt, Recruit.
- **Six companions** — Mira, Lira, Sylvie, Thalia, Greta, Elara with persona-specific growth dialogue.
- **Grid tactical combat** — 10×10 turn-based battles with growth mid-fight, feeding, conversion, and Fat Goddess-flavored spells.
- **Five world regions** — Harvest's Hearth, Market Square, Fertile Heartlands, Shrine of the Thin Veil, Ancient Temple Ruins.
- **Save system** — localStorage persistence.

## Debug Tools

While playing (world or combat), use the floating buttons at bottom-right:

- **Debug** — Text Engine tab with Dialogue Lab (roll 5 random prose samples, flag individual text nodes, copy tuning notes) and a 6-combo observe/feed sweep. Game Cheats tab for AP, weight stages, region jumps.
- **Bug** — Quick bug log with auto-captured context (screen, region, combat state, last rendered text). Notes persist in localStorage. Copy all notes for pasting into issues.

NPC interactions also have an inline **Log bug** button. Console playground: `window.__textEngine` exposes `render`, `createContext`, etc.


```
src/
  textEngine/     # Core resolver (engine.js, lexicon, modules, scenes)
  gameData/       # Stages, classes, spells, NPCs, combat, regions
  components/     # React UI
  hooks/          # NPC interaction orchestration
```

## Text Engine

All major descriptions route through `render(template, createContext({ subject, ref, globals }))`. Scene files under `src/textEngine/scenes/` register pools at import time. See the reference repo's `AUTHORING.md` for the content contract.
