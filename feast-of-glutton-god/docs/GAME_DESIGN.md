# Feast of the Glutton God — Game Design Document

## Premise

The world is an **earnest, traditional high-fantasy setting** — kingdoms, dungeons, a real pantheon, classic plots played completely straight. **You are the anomaly:** a native of the Aurelan Reach who **knowingly serves and feeds an obscure patron, the Fat Goddess** — the Hunger Beyond the Measured Wheel — without realizing this makes you a being from the *wrong genre*.

You spread abundance because it is simply who you are. The world reacts with mounting alarm. You are trivially overpowered against everything mundane (a dragon just gets *fed*); only the cosmic and divine tier pushes back. Through your actions your patron **materializes into godhood and consumes the gods' own plane**, and the pantheon turns against you. The campaign ends in **triumphant apotheosis**.

**Tone lanes (keep separate):**
- **World** — earnest fantasy; NPCs never wink at the absurdity.
- **DM narrator** — wry genre-comedy; the only voice that perceives the clash, scaling from bemused (Act I) to alarmed (Act II) to awed/terrified (Act III).
- **Abundance content** — sensual, positive, empowering; growth as pleasure and power.
- **Cosmic arc** — epic divine conflict.

## Golden Rules (content authoring)

1. **Reflavor data/prose, do NOT rename code symbols.** Keep identifiers like `gorgara`, `abundance`, `purity`, `famine_hag` intact; change only **player-facing strings**.
2. **NPCs never wink.** The world is 100% earnest; only the **DM narrator** may register the genre clash.
3. **Keep every existing mechanic** (fattening, 15 stages, growth, spells, combat, relationships).
4. **All player-facing text** goes through the modular text engine (`registerPool`), never hardcoded in components when avoidable.
5. **Every character is an unambiguous adult.**

## The Measured Wheel (homebrew pantheon)

The orthodox pantheon of the Aurelan Reach — gods of **balance and moderation** for whom limitless excess is anathema. Lore data: `src/gameData/pantheon.js`.

| God | Domain | Role in story |
|-----|--------|---------------|
| **Aurelan** | Law, kingship | Leads divine opposition; the Church crowns his authority |
| **Sylwen** | Harvest, measured plenty | Tragic foil — the Fat Goddess is her blasphemous excess |
| **Korthak** | War, valor | Northern marches and frontier holds |
| **Veshanne** | Death, fate, balance | Barrows, oaths, the dead god's dungeon |
| **Lumen** | Knowledge, magic | Diviners who first detect the anomaly |
| **Tarn** | Trade, roads | Neutral merchant law; courtable |

**the Fat Goddess** — reframed as **the Hunger Beyond the Wheel**, a patron from outside this cosmology whom the player knowingly feeds into existence. Not one of the Wheel; a heresy the player carries.

## Opposition (player-facing names)

- **Inquisitor of the Measured Hand** — militant arm of the orthodox Church enforcing divine moderation (`purity_inquisitor` id unchanged).
- **the Lean Saint (Sylwen's Scourge)** — sanctioned divine instrument; famine as answer to gluttony (`famine_hag` id unchanged).

## Core Systems

### Player Classes (4)
| Class | Subclass | Fantasy |
|-------|----------|---------|
| Bard | Feast-Singer | Songs that swell allies and charm enemies |
| Wizard | School of Overflow | Arcane caloric transmutation |
| Cleric | Domain of Plenty | Divine blessings and living altars |
| Warlock | Pact of the Fat Goddess | Hunger pacts and essence drain |

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

### Regions (10)
Harvest's Hearth, Grand Market Square, Fertile Heartlands, Shrine of the Thin Veil, Ancient Temple Ruins, Northern Marches, Sapphire Coast, Iron Peak Hold, Ember Duchy, Gilded Citadel

Each region reads as **straight high fantasy** on the surface; your patron's abundance is the overlay you spread.

### Three-Act Spine
1. **Act I — Harvest's Hearth:** Befriend locals, host communal feast, soften Lady Vesperia.
2. **Act II — The Overflowing Temple:** Convert priestess circle, ritual feast, face ascetic guardians.
3. **Act III — Coronation of Abundance:** Grow to Leviathan scale, defeat famine spirits, coronation endings.

## Modular Text Engine

- **Core:** `engine.js`, `rng.js`, `pronouns.js`, `persona.js`
- **Domain:** `lexicon.js`, `modules.js`, `growthLexicon*`, `dimensions/weightGain.js`
- **Scenes:** NPC observe/feed/talk/flirt/bless/feast, growth events, combat beats, DM genre-clash (`scenes/dm/genre.js`)

Every description adapts via `createContext({ subject, ref, globals })` → `ctx.d` dimensions (stage, corruption, relationship, bodyType, escalationTier, etc.).

## Endings (Roadmap)

- **Triumphant Apotheosis** — the Fat Goddess fully manifests; you become her living avatar; the Wheel breaks
- **Conversion Ending** — The realm converted through feasts; orthodoxy routed
- **Rival Ending** — Defeat the Bloom Sovereign / divine antithesis
- **New Game+** — Retain AP bonuses and persona unlocks

## Sample Scene (Growth via Feeding)

> Mira's eyes flutter half-closed as you press another honeyed pastry to her lips. She moans softly around it, cheeks flushed. You watch in real time as her previously flat stomach begins to push outward, rounding into a soft, warm little pot belly that fills your palm when you rest a hand on it.
>
> "Mmm… it feels so good," she whispers, voice husky. Her thighs thicken noticeably, pressing together, while her hips widen with a gentle creak of her belt. The lute string around her waist snaps. She giggles breathlessly. "Look what you're doing to me… I'm getting so soft already."

*(Generated at runtime via `{npc.feed.*}` + `{ge.*}` growth event pools.)*
