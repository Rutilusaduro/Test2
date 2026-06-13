# Feast of the Glutton God

An open-world text adventure RPG celebrating abundance, weight gain, and the awakening of **Gorgara the Everfull**.

## Quick Start

```bash
cd feast-of-glutton-god
npm install
npm run dev
```

Open the URL shown in the terminal (typically http://localhost:5173).

## Features

- **Modular Text Engine** — ported from the Professor Sim reference branch; slots, phrase pools, selectors, and context-driven prose adapt to size stage, relationship, corruption, body type, and location.
- **Four player classes** — Bard (Feast-Singer), Wizard (School of Overflow), Cleric (Domain of Plenty), Warlock (Pact of the Everfull).
- **12 size stages** — affecting stats, movement, combat tile occupancy, and all descriptive text.
- **Deep NPC interactions** — Talk, Flirt, Observe, Feed, Bless, Feast, class Special actions, Intimate, Corrupt, Recruit.
- **Six companions** — Mira, Lira, Sylvie, Thalia, Greta, Elara with persona-specific growth dialogue.
- **Grid tactical combat** — 10×10 turn-based battles with growth mid-fight, feeding, conversion, and Gorgara-flavored spells.
- **Five world regions** — Harvest's Hearth, Market Square, Fertile Heartlands, Gorgara's Cradle, Ancient Temple Ruins.
- **Save system** — localStorage persistence.

## Architecture

```
src/
  textEngine/     # Core resolver (engine.js, lexicon, modules, scenes)
  gameData/       # Stages, classes, spells, NPCs, combat, regions
  components/     # React UI
  hooks/          # NPC interaction orchestration
```

## Text Engine

All major descriptions route through `render(template, createContext({ subject, ref, globals }))`. Scene files under `src/textEngine/scenes/` register pools at import time. See the reference repo's `AUTHORING.md` for the content contract.
