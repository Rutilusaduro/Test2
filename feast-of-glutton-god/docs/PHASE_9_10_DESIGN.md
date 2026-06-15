# Feast of the Glutton God — Phases 9 & 10 Design Roundtable

**Branch:** Expedimental  
**Status:** Brainstorm / design doc — post L20 capstone  
**Authors:** Implementer roundtable (one-up edition)

Phases 1–8 built the ladder: structure → spells → enemies → regions → systems → quests → text → balance.  
Phases 9–10 ask: **what happens after the feast crowns you?** and **how do we make replay worth a second pilgrimage?**

---

## The Roundtable (Bring the Boys Back)

| Voice | Role | Pitch |
|---|---|---|
| **Narrator** | Wry DM | "You hit level 20. The book closes. Then someone opens the kitchen." |
| **Patron** | gorgara | "Apotheosis is not the end. It is the menu." |
| **Church** | Verity / Wheel | "We require a post-game heresy tier. For research." |
| **Guild** | Pensha / Tarn | "DLC is just a fair contract with better pastries." |
| **Companions** | Six Who Walk | "We want endings that remember who stood beside you." |
| **Implementer** | Pragmatist | "Ship vertical slices. No vaporware cosmology." |

**Consensus:** Phase 9 = **After the Crown** (post-apotheosis systems). Phase 10 = **Eternal Feast** (replay, legacy, infinite-endgame).

---

## Phase 9 — After the Crown (Post-Apotheosis Layer)

**Goal:** Level 20 is not a hard stop. The world reacts to *which* ending path you walked and offers **denouement + prestige** without invalidating the main arc.

### 9a. Ending Echo System (`endingEcho.js`) — ✅ SHIPPED (`Expedimental`)

When `main_act3_complete` fires, stamp an **ending archetype** from existing flags:

| Archetype | Gate flags | World mutation |
|---|---|---|
| `conversion_ending` | `all_companions_apotheosis` + `heartland_unified` | Regions gain permanent `conversion_depth +1` cap |
| `right_hand_ending` | `apotheosis_right_hand` | `gorgara_manifest` cooldown halved globally |
| `co_ascendant_ending` | `apotheosis_co_ascendant` | Player + patron share HP pool in combat |
| `devouring_ending` | `apotheosis_devouring` | Cosmic enemies start at +1 corruption |

**Implementation:**  
- `src/gameData/endingEcho.js` — resolver + passive modifiers  
- Wire into `combat.js`, `worldTransformation.js`, `divineAttention.js`  
- Text: `textEngine/scenes/endings/echo.js` — one arrival line per archetype per region

### 9b. Prestige Pilgrimage (Paragon Lite)

**Not full New Game+** — a **prestige track** within the same save after Act III:

- `prestige_rank` 0–5 earned by:
  - Completing all 10 scaling side quests
  - All 24 companion milestones
  - Three ending variants witnessed (requires `ending_archive` flags)
- Each rank grants **one** permanent pick from a small talent tree:
  - `feast_momentum` — first communal feast each day grants +2 devotion party-wide
  - `cosmic_satiety` — cosmic conversion grants +25 AP once per rest
  - `wheel_splinter` — ignore one region obstacle permanently

**Files:** `prestige.js`, `PrestigeModal.jsx`, `levelFeatures.js` extension bucket `PRESTIGE_TALENTS`

### 9c. Rival Adventurer Ascension (`lyra_ascension` arc)

Lyra Swiftblade was the tutorial rival. Phase 9 promotes her to **scaling nemesis**:

| Prestige rank | Lyra state | Encounter |
|---|---|---|
| 0–1 | Jealous noble proxy | Existing `rival_adventurer` |
| 2–3 | `lyra_champion` mythic | New enemy, mirrors player subclass |
| 4–5 | `lyra_apostate` cosmic | Legendary duel in `divine_plane_vestibule` |

Side quest chain: `side_lyra_last_duel` — 3 stages, romance OR dominance ending, sets `lyra_fate` flag.

**Why one-up:** Turns a level 1 gag into endgame emotional payoff.

### 9d. Living World Digest (`worldDigest.js`)

Weekly (in-game day counter) **continent digest** — 3 bullet events generated from flags:

- "Ember Duchy reports 40% increase in belt sizes. Tarn approves."
- "Sister Verity filed appeal #47. Denied. She is learning patience."
- "Greta's Order of Soft Iron opened chapter house in Grimwatch."

**Implementation:** Template pools keyed by `worldFlags` + `transformDepth` — no AI, pure `registerPool` + selector.  
**UI:** Digest panel in Quest Log or inn rest screen.

### Phase 9 deliverables checklist

1. `endingEcho.js` + echo prose pools  
2. `prestige.js` + UI modal + 5 talents  
3. `lyra_champion` / `lyra_apostate` enemies + `side_lyra_last_duel`  
4. `worldDigest.js` + 30 digest lines  
5. `npm run text:lint` + `build`

---

## Phase 10 — Eternal Feast (Replay & Legacy)

**Goal:** Second run feels **different**, not repetitive. The Fat Goddess remembers.

### 10a. Pilgrimage Seeds (Roguelite Meta)

On **New Pilgrimage** (optional restart after Act III or from title):

- Carry **3 seeds** into fresh Act I:
  - **Companion Echo** — one companion starts recruited with t1 milestone pre-complete
  - **Region Memory** — one region starts at transform depth 2
  - **Spell Remnant** — one spell from previous run at level 1 (slot-appropriate)
- Seeds earned from prestige rank, not paid currency

**Files:** `pilgrimageSeeds.js`, title screen flow, `save.js` meta bucket `pilgrimageMeta`

### 10b. The Eternal Hall (`eternal_feast_hall` region)

Unlock: `prestige_rank >= 3` OR `all_companions_apotheosis` on any save.

- **Zone:** `planar` — demiplane of endless tables
- **No combat** — social / feast / growth sandbox
- **NPCs:** All converted gods (`sylwen_converted`, `tarn_converted`, `lumen_converted`) as feast guests with talk loops
- **Mechanic:** `endless_banquet` — spend AP to permanently +1 a global `legacy_abundance` stat (meta progression across pilgrimages)

Connections: `['gorgara_cradle', 'divine_plane_vestibule']`

### 10c. Director's Cut Mode (`directors_cut` flag)

Toggle in settings after first Act III complete:

- DM narrator **comments on choices** you didn't make (branch ghosts)
- Unlocks **cutscene replay theater** in Eternal Hall
- Adds `dm.directors_cut` pool — 50 lines of "what if" per major quest fork

**Tone:** Still wry, never cruel. "You fed Vesperia in public. In another timeline, you fed her in secret. She blushed harder there."

### 10d. Achievement Liturgy (`achievements.js`)

30 achievements, church-themed names:

| id | Title | Condition |
|---|---|---|
| `liturgy_first_trivial` | Beatified the Mundane | Trivialize first enemy |
| `liturgy_six_apotheoses` | Six Who Ascended | `all_companions_apotheosis` |
| `liturgy_wheel_teeth` | Dental Records of the Wheel | Defeat `wheel_incarnate` |
| `liturgy_no_conversion` | Lean Heresy | Beat Act III with 0 cosmic conversions |
| `liturgy_feast_100` | Centurion of Seconds | 100 communal feasts |

**UI:** Achievement tab in Quest Log; each unlock grants +1 `prestige_rank` progress point.

### 10e. Seasonal Wheel Events (optional live-ops shape)

Quarterly **Wheel Events** — 2-week in-game event flags:

- `event_harvest_inversion` — growth doubled in heartlands, Sylwen heralds spawn more
- `event_guild_audit` — Tarn NPCs offer discount puzzles, market hostility +1
- `event_dream_feast` — `dream_echo` in random encounters, bonus XP

**Implementation:** `seasonalEvents.js` + date or `game.day` modulo trigger. Content-light, high variety.

### Phase 10 deliverables checklist

1. `pilgrimageSeeds.js` + New Pilgrimage flow  
2. `eternal_feast_hall` region + locales + talk pools  
3. `legacy_abundance` meta stat + UI  
4. `achievements.js` + Quest Log tab  
5. `directors_cut` toggle + `dm.directors_cut` pools (start with 20 lines)  
6. `seasonalEvents.js` scaffold (1 event implemented as template)

---

## Priority Order (If Shipping Incrementally)

| Order | Slice | Impact |
|---|---|---|
| 1 | Phase 9a Ending Echo | Makes endings feel real immediately |
| 2 | Phase 9b Prestige (3 talents only) | Extends playtime without new regions |
| 3 | Phase 10d Achievements | Cheap dopamine + completionist hook |
| 4 | Phase 9c Lyra ascension | Emotional one-up |
| 5 | Phase 10b Eternal Hall | Sandbox reward |
| 6 | Phase 10a Pilgrimage Seeds | Replay hook |
| 7 | Phase 9d World Digest | Flavor glue |
| 8 | Phase 10c Director's Cut | Polish luxury |
| 9 | Phase 10e Seasonal | Live ops optional |

---

## New Flags Introduced (Phases 9–10)

```
ending_archetype           — conversion | right_hand | co_ascendant | devouring
prestige_rank              — 0–5
prestige_talents           — array of chosen talent ids
lyra_fate                  — rival | lover | champion | converted
legacy_abundance           — meta int, persistent across pilgrimages
pilgrimage_count           — int
directors_cut_enabled      — bool
eternal_hall_unlocked      — bool
achievement_*              — 30 booleans
seasonal_event_active      — string id or null
```

---

## One-Up Summary

| Phase | Old ceiling | New ceiling |
|---|---|---|
| **9** | "You beat level 20" | "The continent remembers *how* you won" |
| **10** | Single playthrough | "The goddess remembers you across pilgrimages" |

The boys agree: **Phase 9 is consequence. Phase 10 is legacy.**  
Ship 9a+9b first — they reuse everything Phases 1–8 already built.

---

*Next implementer action:* Branch `Expedimental` → implement 9a (`endingEcho.js`) as smallest vertical slice, or jump to Lyra if narrative ROI wins the sprint.
