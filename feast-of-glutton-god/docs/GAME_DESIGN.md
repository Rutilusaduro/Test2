# Feast of the Glutton God — Game Design Document

## Premise

The ancient goddess **Gorgara the Everfull** is awakening. Her power causes irresistible, pleasurable growth. The player carries a divine spark and wanders a semi-open world spreading abundance — through conversation, feeding, blessing, feasts, and tactical combat where size is power.

**Tone:** Sensual, positive, empowering. No shame — only pleasure, beauty, and power.

## Core Systems

### Player Classes (4)
| Class | Subclass | Fantasy |
|-------|----------|---------|
| Bard | Feast-Singer | Songs that swell allies and charm enemies |
| Wizard | School of Overflow | Arcane caloric transmutation |
| Cleric | Domain of Plenty | Divine blessings and living altars |
| Warlock | Pact of the Everfull | Hunger pacts and essence drain |

### Size Stages (12)
Slight → Slim → Soft → Chubby → Plump → Heavy → Fat → Very Fat → Enormous → Colossal → Blob → Leviathan

- **Tiles:** 1×1 (stages 1–6), 2×2 (7–9), 3×3 (10+)
- **Movement:** Decreases as weight increases
- **HP:** +20–40% (mid), +60–100% (large), +150%+ (colossal)

### Abundance Points (AP)
Earned via combat, feeding, feasts, quests, rest. Spent on blessings, feasts, corruption, and surges.

### NPC Interaction Menu
1. Talk — dynamic, stage/relationship/corruption aware
2. Flirt / Compliment — charisma checks
3. Observe / Admire — rich modular descriptions
4. Feed — hand, magical, feast variants
5. Bless — minor/major/targeted (AP cost)
6. Invite to Feast — large growth event
7. Special — class-specific actions
8. Intimate — Lover+ relationship
9. Corrupt / Recruit — late-game options

### Combat
- 10×10 grid, turn-based
- Move → Attack / Spell / Feed → End Turn → Enemy AI
- Victory: kill, convert via overfeeding, or overwhelm with abundance
- Growth mid-combat grants HP and tactical tile control

### Companions (6)
Mira Silverstring, Lira Dawnwell, Sylvara Thorne, Thalia Blackfeast, Greta Ironpot, Elara Warmbelly — each with persona-specific growth dialogue in the text engine.

### Regions (5)
Harvest's Hearth, Grand Market Square, Fertile Heartlands, Gorgara's Cradle, Ancient Temple Ruins

### Enemies
Harvest Harpies, Vinebound Dryads, Gluttonous Goblins, Temple Guardians, Rival Adventurers, Purity Inquisitors, Famine Hag (boss)

## Modular Text Engine

Copied whole-cloth from the Professor Sim reference (`claude/wonderful-planck-4b085p`):

- **Core:** `engine.js`, `rng.js`, `pronouns.js`, `persona.js`
- **Domain:** `lexicon.js`, `modules.js`, `growthLexicon*`, `dimensions/weightGain.js`
- **Scenes:** NPC observe/feed/talk/flirt/bless/feast, growth events, combat beats

Every description adapts via `createContext({ subject, ref, globals })` → `ctx.d` dimensions (stage, corruption, relationship, bodyType, etc.).

## Endings & Post-Game (Roadmap)

- **Awakening Ending** — Gorgara fully rises; player becomes High Priestess of Plenty
- **Conversion Ending** — World converted through feasts
- **Rival Ending** — Defeat the Bloom Sovereign
- **New Game+** — Retain AP bonuses and persona unlocks

## Sample Scene (Growth via Feeding)

> Mira's eyes flutter half-closed as you press another honeyed pastry to her lips. She moans softly around it, cheeks flushed. You watch in real time as her previously flat stomach begins to push outward, rounding into a soft, warm little pot belly that fills your palm when you rest a hand on it.
>
> "Mmm… it feels so good," she whispers, voice husky. Her thighs thicken noticeably, pressing together, while her hips widen with a gentle creak of her belt. The lute string around her waist snaps. She giggles breathlessly. "Look what you're doing to me… I'm getting so soft already."

*(Generated at runtime via `{npc.feed.*}` + `{ge.*}` growth event pools.)*
