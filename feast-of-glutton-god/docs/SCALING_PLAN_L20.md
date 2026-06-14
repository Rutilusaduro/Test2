# Feast of the Glutton God — Level 20 Scaling Plan

**Branch:** Expedimental  
**Status:** Design doc for Implementer. All ids use existing conventions. Never rename `gorgara`, `pantheon`, `purity_inquisitor`, `famine_hag`, or any existing world flag.

---

## Executive Summary of Structural Gaps

Before content, three hard structural ceilings must be cut open:

| File | Current cap | Target |
|---|---|---|
| `leveling.js` → `MAX_LEVEL` | 12 | 20 |
| `spellSlots.js` → `MAX_SPELL_LEVEL` | 5 | 9 |
| `spellSlots.js` → `FULL/HALF_CASTER_SLOTS` | level 12, 5 tiers | level 20, 9 tiers |
| `spellSlots.js` → `PACT_SLOTS` | level 12 | level 20 |
| `leveling.js` → `XP_THRESHOLDS` | 13 entries (0–12) | 21 entries (0–20) |
| `leveling.js` → `SIZE_CAP_BY_LEVEL` | cap at level 12 → stage 13 | new entries 13–20 |
| `leveling.js` → `LEVEL_UP_FLAVOR` | 13 strings | 21 strings |
| `levelFeatures.js` → `CLASS_FEATURES` | entries up to level 10 | entries through level 20 |
| `spellProgression.js` → `CLASS_SPELL_CURRICULUM` | entries up to level 10 | entries through level 20 |

Everything else — new spells, enemies, quests, regions — sits on top of these structural changes.

---

## Part 1: Level Band Design

### Tier 1 — Local Hearth (levels 1–4)
**Feel:** Earnest farmland fantasy. You are slightly odd but not yet threatening. The DM narrator is *bemused*.  
**Unlocks at entry:** Starting region `harvest_hearth`, Act I quest, 3 companions (Elara pre-recruited, Mira and Greta in-zone).  
**Combat enemies:** `harvest_harpy`, `gluttonous_goblin`, `temple_guardian`, `rival_adventurer`.  
**Spell slots:** 1st-level slots (2→4 slots), first 2nd-level slots at level 3.  
**Size cap progression:** stage 3 at level 1 → stage 5 at level 3.  
**Key unlock at level 4:** Act II gate opens (divine attention ≥ 15, `main_act1_complete` flag).

### Tier 2 — Regional Power (levels 5–10)
**Feel:** The Church mobilizes. Multiple regions active. First divine opposition (god-champions appear). DM narrator becomes *alarmed*.  
**Unlocks:** Regions `northern_marches`, `sapphire_coast`, `iron_peak_hold`, `ember_duchy`. `gorgara_cradle` deepens. Act II quest chain.  
**Combat enemies:** `purity_inquisitor` as standard, `famine_hag` as boss, first `champion_*` appearances.  
**Spell slots:** 3rd-level slots at level 5; 4th-level at level 7; 5th-level at level 9.  
**Size cap progression:** stage 7 at level 5 → stage 9 at level 7 → stage 11 at level 9.  
**Key unlock at level 10:** Act III gate pre-condition met; `magical_secrets` fires for Bard.

### Tier 3 — Mythic Interference (levels 11–16)
**Feel:** Gods deploy avatars directly. You threaten the cosmological order. The DM narrator is *horrified and fascinated*. Act III main quest active. New regions: `barrow_deeps`, `gilded_citadel_inner`.  
**Unlocks:** 6th-level spell slots, `world_rewrite`-tier magic; new Tier 3 enemies; new companion milestone scenes; region transformation depths 4–5.  
**Combat enemies:** `herald_of_starvation`, `cathedral_golem`, `void_appetite`, `divine_inquisitor_supreme`, `korthak_titan`; revisited god-champions with second-phase upgrades.  
**Spell slots:** 6th-level at level 11; 7th-level at level 13; 8th-level at level 15.  
**Size cap progression:** stage 12 (Titan) at level 13 → stage 13 (World Mother) at level 15.  
**Key unlock at level 16:** Divine Attention tier 5 (`apotheosis_threshold`) unlocked; Tier 4 enemies appear.

### Tier 4 — Apotheosis / Command (levels 17–20)
**Feel:** You are no longer a wrong-genre adventurer — you *are* the genre. The Fat Goddess is materializing. The pantheon is dying or converting. The DM narrator achieves something like theological awe.  
**Unlocks:** Region `divine_plane_vestibule`; 9th-level spells; legendary-action bosses; stage 14 (Tarrasque Matriarch) cap; companion apotheosis arcs; three endings branch.  
**Combat enemies:** `avatar_aurelan`, `sylwen_revenant`, `veshanne_unbound`, `bloom_sovereign`, `wheel_incarnate`.  
**Spell slots:** 9th-level at level 17; max slots at 18–20.  
**Key unlock at level 20:** Capstone features per class; true ending scenes fire.

---

## Part 2: Structural Code Changes (implement first)

### 2a. `leveling.js`

```js
export const MAX_LEVEL = 20;

export const XP_THRESHOLDS = [
  0, 0, 300, 900, 1800, 3000, 4500, 6500, 9000, 12000, 15500, 19500, 24000,
  // levels 13–20 (D&D-adjacent steep curve):
  30000, 37000, 45000, 54000, 64000, 75000, 87000, 100000,
];

export const SIZE_CAP_BY_LEVEL = {
  1: 3, 3: 5, 5: 7, 7: 9, 9: 11, 12: 13,
  // Tier 3–4 unlocks:
  13: 13, 15: 13, 16: 14, 20: 14,
  // Stage 14 (Tarrasque Matriarch) becomes accessible at level 16+
};

// LEVEL_UP_FLAVOR — add indices 13–20:
// [13] "The Wheel creaks under your weight — not metaphorically."
// [14] "God-champions arrive and you already know their names."
// [15] "Abundance is no longer something you channel. It channels you."
// [16] "The Fat Goddess stirs. Whole groves bloom in her turning."
// [17] "The gods have noticed. All of them, all at once, in the way prey notices a predator."
// [18] "You are the largest thing in the world that moves under its own hunger."
// [19] "The Measured Wheel is a hoop you could eat."
// [20] "The feast was never just yours. It was always hers — and she is finally here."
```

### 2b. `spellSlots.js` — extend to level 20, 9 slot tiers

The slot arrays grow from `[1st, 2nd, 3rd, 4th, 5th]` (5 elements) to `[1st, 2nd, 3rd, 4th, 5th, 6th, 7th, 8th, 9th]` (9 elements). All existing code that initializes with `emptySlots()` must be updated to return 9 zeros. The `MAX_SPELL_LEVEL` constant becomes `9`.

```js
export const MAX_SPELL_LEVEL = 9;

// FULL_CASTER_SLOTS — levels 13–20 added, slot arrays are now length 9
// Format: [1st, 2nd, 3rd, 4th, 5th, 6th, 7th, 8th, 9th]
// 13: [4, 3, 3, 3, 2, 1, 1, 0, 0]
// 14: [4, 3, 3, 3, 2, 1, 1, 0, 0]
// 15: [4, 3, 3, 3, 2, 1, 1, 1, 0]
// 16: [4, 3, 3, 3, 2, 1, 1, 1, 0]
// 17: [4, 3, 3, 3, 2, 1, 1, 1, 1]
// 18: [4, 3, 3, 3, 3, 1, 1, 1, 1]
// 19: [4, 3, 3, 3, 3, 2, 1, 1, 1]
// 20: [4, 3, 3, 3, 3, 2, 2, 1, 1]

// HALF_CASTER_SLOTS — levels 13–20
// 13: [4, 3, 3, 2, 1, 0, 0, 0, 0]
// 14: [4, 3, 3, 2, 2, 0, 0, 0, 0]
// 15: [4, 3, 3, 3, 2, 1, 0, 0, 0]
// 16: [4, 3, 3, 3, 2, 1, 0, 0, 0]
// 17: [4, 3, 3, 3, 2, 1, 1, 0, 0]
// 18: [4, 3, 3, 3, 2, 1, 1, 0, 0]
// 19: [4, 3, 3, 3, 2, 1, 1, 1, 0]
// 20: [4, 3, 3, 3, 2, 1, 1, 1, 1]

// PACT_SLOTS — levels 13–20 (warlock pact level tops at 5 from level 9, but gains more slots)
// 13: [3, 5], 14: [3, 5], 15: [3, 5], 16: [3, 5]
// 17: [4, 5], 18: [4, 5], 19: [4, 5], 20: [4, 5]
// Note: pact level stays 5; warlock gets a 3rd/4th slot as their epic scaling
```

**Downstream:** `getSlotLevelIndex` already clamps with `MAX_SPELL_LEVEL - 1`, so that guard stays. Anywhere that renders spell slot pips (`SpellSlotPips.jsx`) needs to handle up to 9 tiers gracefully (collapse or paginate the display for tier 6–9 slots).

---

## Part 3: 25 New Spells

All new spells slot into `spells.js` (`BONUS_SPELLS` for cross-class, `CLASS_SPELLS[classId]` for exclusive) and are wired into `CLASS_SPELL_CURRICULUM` at the appropriate level. Every new entry follows the existing object shape.

### Tier 1 Spells (slotLevel 1–2, unlocked levels 1–4)

| id | name | slotLevel | school | effect summary |
|---|---|---|---|---|
| `caloric_ward` | Caloric Ward | 1 | abjuration | Shield of abundance energy: +2 AC, allies who strike you take minor growth damage (contact). |
| `hungry_grasp` | Hungry Grasp | 1 | conjuration | Spectral feast-hands: grapple + minor feed, corruption 3. Range 4. |
| `hearth_blessing` | Hearth Blessing | 1 | abundance | Self + 1 ally: regain 1d6 HP + 1 stage growth (willing target only). |
| `sweetened_step` | Sweetened Step | 1 | transmutation | Bonus action self-buff: movement leaves sticky abundance trail; foes entering trail make DEX save or lose 5 ft movement. Duration: 3 rounds. |
| `abundant_swathe` | Abundant Swathe | 2 | conjuration | Hurl a wide swathe of conjured food, AoE 3×3. Targets: CON save or gain feed×2 + corruption 4. |
| `mirror_fullness` | Mirror Fullness | 2 | enchantment | Target sees an idealized abundant reflection of themselves; charmed for 2 rounds + corruption 5. On charm break: growth 1. |

### Tier 2 Spells (slotLevel 3–5, unlocked levels 5–10)

| id | name | slotLevel | school | effect summary |
|---|---|---|---|---|
| `pillar_of_plenty` | Pillar of Plenty | 3 | evocation | Column of golden light, 10-ft radius. Targets: CON save or take abundance damage (3d6) + conversion pressure; allies in area heal 1d8. |
| `gorge_field` | Gorge Field | 3 | conjuration | Spectral feast appears in 4×4 zone (concentration, 1 min). Enemies must WIS save each turn or spend action eating (lured); allies in zone recover 1 slot. |
| `silk_strands_of_appetite` | Silk Strands of Appetite | 3 | enchantment | Bind a target in enchanted silk bands: restrained + growth pressure 1 per round; silk grows tighter as target swells. Break: STR check DC 15. |
| `second_helping` | Second Helping | 4 | abundance | Reaction spell. When you successfully resolve a growth or feed effect, duplicate it on the same target at no additional slot cost. Once per short rest. |
| `the_feast_without_end` | The Feast Without End | 4 | abundance | Concentration (1 min). Aura 15 ft: allies heal 1d6 each round + corruption +2/round; enemies must CON save or gain hunger tier (loses an action when starved). |
| `gorgara_commune` | Commune with the Goddess | 5 | divination | Brief contact with the Fat Goddess. Gain: advantage on all rolls next turn, self-growth 1 stage, restore 1 spent slot. Costs: divineAttention +5. minSizeStage: 5. |
| `abundance_tide` | Abundance Tide | 5 | evocation | Wave of caloric force, 20-ft cone. Creatures: STR save or pushed back 15 ft + abundance damage (4d8). Converts mundane foes that fail save and are below 25% HP. |

### Tier 3 Spells (slotLevel 6–8, unlocked levels 11–16)

| id | name | slotLevel | school | effect summary |
|---|---|---|---|---|
| `immovable_feast` | Immovable Feast | 6 | abundance | Transform willing or charmed target into a living feast-altar: prone, immovable, but radiates healing aura (allies within 10 ft regain 2d6 HP/turn) + massively accelerated growth (2 stages/round for 3 rounds). Reversible on target's next long rest. minSizeStage: 6. |
| `toppling_abundance` | Toppling Abundance | 6 | evocation | Shockwave of abundance force in 30-ft line: STR save or prone + pushed 20 ft + abundance damage (6d6). Converts prone mundane enemies automatically. |
| `hunger_incarnate` | Hunger Incarnate | 7 | abundance | Self-buff, concentration (1 min). Every attack deals +2d8 growth damage; every healing effect also advances target 1 stage; your corruption aura radius doubles. minSizeStage: 7. |
| `world_rewrite` | World Rewrite | 7 | transmutation | Temporarily rewrite a region's essence for the scene (1 hour, no concentration): all enemies in region treat as mundane-tier (cosmic resistances removed), all growth rolls in region are doubled, ambient growth events fire once per minute. Costs 25 AP + 7th-level slot. Once per long rest. |
| `siphon_divinity` | Siphon Divinity | 8 | necromancy | Drain divine power from a cosmic enemy (WIS save DC spellcasting). On fail: target loses one phase ability for remainder of combat + your patron gains divineAttention +10 + you restore all spell slots of level 4 and below. Damages target for 8d8 abundance. |
| `feast_of_a_thousand_tables` | Feast of a Thousand Tables | 8 | conjuration | Entire combat grid becomes a feast. All creatures: CON save each round or lose action to eat; growth 1 stage per failed save. Allies are immune. Duration: concentration up to 1 min. minSizeStage: 8. |

### Tier 4 Spells (slotLevel 9, unlocked levels 17–20)

| id | name | slotLevel | school | effect summary |
|---|---|---|---|---|
| `gorgara_manifest` | Manifest the Fat Goddess | 9 | abundance | Your patron physically manifests in combat as a legendary entity for 3 rounds (acts on your initiative). She has HP equal to your max HP, movement 0, and a legendary action that automatically converts 1 enemy per round. Costs 40 AP + 9th-level slot. minSizeStage: 9. Once per rest. |
| `consume_the_wheel` | Consume the Wheel | 9 | transmutation | Attempt to drain a pantheon-tier entity's divine portfolio permanently. The entity makes three WIS saves; on 2+ failures, it loses its `cosmicAbility` for the rest of the game and its `growthResist` drops to 0.1. On success, it gains temporary immunity and retaliates with full legendary actions. Usable only against `wheel_avatar`, `pantheon_last_stand`, `avatar_aurelan`, `sylwen_revenant`, `veshanne_unbound`, `bloom_sovereign`, `wheel_incarnate`. |
| `leviathan_coronation` | Leviathan Coronation | 9 | abundance | Self-apotheosis cast. Advance self to Tarrasque Matriarch stage (stage 14) immediately. Gain divine resistance (50% reduction to all damage for 10 rounds), movement reduced to 0, but all growth spells automatically succeed during duration. Cannot be cast in same scene as `gorgara_manifest`. minSizeStage: 12. |
| `endless_appetite` | Endless Appetite | 9 | enchantment | Rewrite a target's cosmological nature. On failed WIS save: target gains 3 stages immediately and is compelled to seek food; at end of each long rest they gain 1 additional stage for 3 rests (permanent, narrative only). Works on cosmic enemies — converts them to abundance allegiance rather than killing. minSizeStage: 10. |
| `abundance_incarnate` | Abundance Incarnate | 9 | evocation | Channel all current AP (minimum 20) into one massive eruption. Every enemy in the scene: CON save or reduced to 1 HP + 3 stages growth + fully converted. Allies: fully healed + 2 stages growth. AP spent = AP×3 growth damage distributed. Ends concentration on all other spells. Once per long rest. |

### Curriculum Additions (`spellProgression.js` — `CLASS_SPELL_CURRICULUM`)

Append the following level entries to each class (levels not currently listed):

```js
wizard: {
  // existing 1–9 entries...
  11: ['immovable_feast', 'toppling_abundance'],
  13: ['hunger_incarnate', 'world_rewrite'],
  15: ['siphon_divinity', 'feast_of_a_thousand_tables'],
  17: ['consume_the_wheel', 'gorgara_manifest'],
  19: ['leviathan_coronation', 'abundance_incarnate'],
},
cleric: {
  11: ['silk_strands_of_appetite', 'immovable_feast'],
  13: ['hunger_incarnate', 'gorgara_commune'],
  15: ['feast_of_a_thousand_tables', 'siphon_divinity'],
  17: ['endless_appetite', 'gorgara_manifest'],
  19: ['leviathan_coronation', 'abundance_incarnate'],
},
bard: {
  11: ['pillar_of_plenty', 'gorge_field'],
  13: ['world_rewrite', 'second_helping'],
  15: ['the_feast_without_end', 'abundance_tide'],
  17: ['gorgara_manifest', 'endless_appetite'],
  19: ['consume_the_wheel', 'abundance_incarnate'],
},
warlock: {
  11: ['silk_strands_of_appetite', 'hunger_incarnate'],
  13: ['world_rewrite', 'siphon_divinity'],
  15: ['feast_of_a_thousand_tables', 'the_feast_without_end'],
  17: ['gorgara_manifest', 'consume_the_wheel'],
  19: ['leviathan_coronation', 'endless_appetite'],
},
```

Also add lower-tier new spells at appropriate earlier levels:
```js
// wizard: add at level 5: 'caloric_ward', 'hungry_grasp'
// wizard: add at level 6: 'pillar_of_plenty', 'gorge_field'
// wizard: add at level 7: 'second_helping', 'abundant_swathe'
// bard: add at level 5: 'mirror_fullness', 'sweetened_step'
// bard: add at level 6: 'silk_strands_of_appetite', 'the_feast_without_end'
// cleric: add at level 5: 'hearth_blessing', 'caloric_ward'
// cleric: add at level 6: 'pillar_of_plenty', 'gorge_field'
// warlock: add at level 5: 'hungry_grasp', 'mirror_fullness'
// warlock: add at level 6: 'pillar_of_plenty', 'second_helping'
```

---

## Part 4: 15 New Enemy Types

### Mundane (Tier 1–2 fodder, `threatTier: 'mundane'`)

```js
ascetic_monk: {
  id: 'ascetic_monk', name: 'Ascetic of the Measured Hand',
  bodyType: 'straight', startLbs: 105,
  hp: 20, mp: 12, movement: 4, role: 'disruptor',
  conversion: 0.75,
  desc: 'A monastery devotee who fasts as devotion. Disrupts growth magic with denial auras.',
  cosmicAbility: null,  // mundane, but has a passive: growthResist 0.4 (unusually high for mundane)
  growthResist: 0.4,
},
lean_pilgrim: {
  id: 'lean_pilgrim', name: 'Penitent Pilgrim of Sylwen',
  bodyType: 'straight', startLbs: 98,
  hp: 14, mp: 8, movement: 5, role: 'swarmer',
  conversion: 0.9,
  desc: 'Traveling penitent who sees your work as an affront to Sylwen\'s measured harvest.',
},
measure_priest: {
  id: 'measure_priest', name: 'Hedge-Priest of the Measure',
  bodyType: 'athletic', startLbs: 120,
  hp: 24, mp: 18, movement: 3, role: 'controller',
  conversion: 0.7,
  desc: 'Local orthodox priest who can temporarily suppress a target\'s growth aura for 2 rounds.',
  specialAbility: 'growth_suppress',  // field used by combatTurn.js — strips growth effects for 2 rounds
},
jealous_noble: {
  id: 'jealous_noble', name: 'Offended Noblewoman',
  bodyType: 'athletic', startLbs: 118,
  hp: 16, mp: 10, movement: 3, role: 'social',
  conversion: 0.95,
  desc: 'A Tarn-connected merchant-noble who summons guards and uses social attacks (embarrassment).',
  socialAttack: 'embarrassment',  // reduces player ap by 5 on hit
},
famine_cultist: {
  id: 'famine_cultist', name: 'Acolyte of the Lean Saint',
  bodyType: 'straight', startLbs: 92,
  hp: 18, mp: 14, movement: 4, role: 'debuffer',
  conversion: 0.8,
  desc: 'Antithesis-worshipper. On hit: applies hunger reversal (target loses 1 growth stage, temporary).',
  specialAbility: 'hunger_reversal',
},
```

### Tier 3 Mythic Enemies (new `threatTier: 'mythic'` — between mundane and cosmic)

Add a new `threatTier: 'mythic'` constant: `growthResist: 0.5`, `conversion: 0.3`, not fully conversion-immune.

```js
herald_of_starvation: {
  id: 'herald_of_starvation', name: 'Herald of the Lean Ascension',
  bodyType: 'straight', startLbs: 110,
  hp: 48, mp: 22, movement: 3, role: 'elite',
  desc: 'A divine messenger of Sylwen\'s Scourge, amplified by the Church\'s desperation.',
  cosmicAbility: 'famine_aura',  // shrinks all growth effects in 15 ft by 50%
  growthResist: 0.55,
  phases: [{ id: 'scourge_shriek', hpPct: 0.5, label: 'Scourge Shriek' }],
  threatTier: 'mythic',
},
void_appetite: {
  id: 'void_appetite', name: 'the Inverted Hunger',
  bodyType: 'straight', startLbs: 100,
  hp: 44, mp: 20, movement: 4, role: 'disruptor',
  desc: 'A hunger creature twisted wrong — it consumes growth itself, reversing abundance on contact.',
  cosmicAbility: 'growth_devour',  // any growth effect targeting it heals it instead of growing it
  growthResist: 0.7,
  conversionImmune: true,
  threatTier: 'mythic',
},
cathedral_golem: {
  id: 'cathedral_golem', name: 'Cathedral Golem of Aurelan',
  bodyType: 'athletic', startLbs: 180,
  hp: 65, mp: 10, movement: 2, role: 'tank',
  desc: 'Stone law-construct of the Gilded Citadel. Magically bound — charm and enchantment immune.',
  cosmicAbility: 'law_ward',  // immune to enchantment school spells
  growthResist: 0.6,
  conversionImmune: true,
  phases: [{ id: 'law_shard', hpPct: 0.4, label: 'Law Shard' }],
  threatTier: 'mythic',
},
divine_inquisitor_supreme: {
  id: 'divine_inquisitor_supreme', name: 'Supreme Inquisitor of the Measured Hand',
  bodyType: 'athletic', startLbs: 130,
  hp: 60, mp: 28, movement: 3, role: 'elite',
  desc: 'Directly empowered by the Wheel\'s combined will. At 50% HP enters Doctrinal Fury — all attacks deal double growth reversal.',
  cosmicAbility: 'doctrinal_fury',
  growthResist: 0.65,
  phases: [{ id: 'doctrinal_fury', hpPct: 0.5, label: 'Doctrinal Fury' }],
  threatTier: 'mythic',
},
korthak_titan: {
  id: 'korthak_titan', name: 'Titan of Korthak\'s Frontier',
  bodyType: 'athletic', startLbs: 170,
  hp: 72, mp: 12, movement: 3, role: 'boss',
  desc: 'Legendary war-giant sent from the frontier holds — honest, massive, terrifying, and deeply confused by you.',
  cosmicAbility: 'valor_avalanche',  // charges in a line, knockback 30 ft, bonus attack
  growthResist: 0.55,
  conversionImmune: false,  // CAN be converted (narrative payoff: he joins you when defeated properly)
  conversion: 0.35,
  phases: [{ id: 'frontier_resolve', hpPct: 0.6, label: 'Frontier Resolve' }, { id: 'broken_oath', hpPct: 0.25, label: 'Broken Oath' }],
  threatTier: 'mythic',
},
```

### Tier 4 Cosmic Bosses (new entries, `threatTier: 'cosmic'`)

```js
avatar_aurelan: {
  id: 'avatar_aurelan', name: 'Aurelan Incarnate',
  bodyType: 'athletic', startLbs: 145,
  hp: 95, mp: 40, movement: 3, role: 'boss',
  desc: 'Aurelan manifesting as a partial avatar — law made flesh, crown burning, scales tipping toward extinction.',
  cosmicAbility: 'divine_law',  // at start of each turn: one player ability is locked (rotates)
  legendaryActions: ['scales_of_judgment', 'crown_of_order', 'law_made_manifest'],
  legendaryResistances: 3,
  growthResist: 0.88,
  conversionImmune: true,
  phases: [
    { id: 'measured_wrath', hpPct: 0.66, label: 'Measured Wrath' },
    { id: 'crown_shatter', hpPct: 0.33, label: 'Crown Shatter' },
  ],
  ...COSMIC,
},
sylwen_revenant: {
  id: 'sylwen_revenant', name: 'Sylwen in Grief',
  bodyType: 'pear', startLbs: 140,
  hp: 88, mp: 42, movement: 2, role: 'boss',
  desc: 'The harvest goddess in grief — her aspect of abundance inverted into a weapon of denial.',
  cosmicAbility: 'harvest_grief',  // area: 25-ft aura that halves all growth effects per turn
  legendaryActions: ['barren_shriek', 'harvest_inversion', 'thorned_plenty'],
  legendaryResistances: 3,
  growthResist: 0.82,
  conversionImmune: false,  // SPECIAL: can be converted via 'endless_appetite' or 'consume_the_wheel' — ending variant
  conversion: 0.05,
  phases: [
    { id: 'wailing_harvest', hpPct: 0.6, label: 'Wailing Harvest' },
    { id: 'grief_breaks', hpPct: 0.2, label: 'Grief Breaks (conversion window opens)' },
  ],
  ...COSMIC,
},
veshanne_unbound: {
  id: 'veshanne_unbound', name: 'Veshanne Unbound',
  bodyType: 'straight', startLbs: 125,
  hp: 80, mp: 48, movement: 1, role: 'boss',
  desc: 'Death goddess unleashing fate itself — she knows exactly how your story ends and is trying to make it so.',
  cosmicAbility: 'fated_strike',  // one attack per combat is guaranteed to hit (no roll)
  legendaryActions: ['barrow_wail', 'fate_revision', 'unwritten_end'],
  legendaryResistances: 2,
  growthResist: 0.78,
  conversionImmune: true,
  phases: [
    { id: 'barrow_dark', hpPct: 0.5, label: 'Barrow Dark' },
    { id: 'fate_rewritten', hpPct: 0.25, label: 'Fate Rewritten (if \'consume_the_wheel\' has been cast on her)' },
  ],
  ...COSMIC,
},
bloom_sovereign: {
  id: 'bloom_sovereign', name: 'the Bloom Sovereign',
  bodyType: 'voluptuous', startLbs: 165,
  hp: 100, mp: 44, movement: 2, role: 'boss',
  desc: 'The rival goddess / antithesis — a being of abundance-turned-consuming, the wrong version of your patron\'s dream.',
  cosmicAbility: 'bloom_devour',  // steals growth effects: any growth you produce, she mirrors at full power
  legendaryActions: ['rival_bloom', 'appetite_redirect', 'sovereign_hunger'],
  legendaryResistances: 3,
  growthResist: 0.75,
  conversionImmune: true,
  phases: [
    { id: 'mirror_bloom', hpPct: 0.7, label: 'Mirror Bloom' },
    { id: 'sovereign_revealed', hpPct: 0.4, label: 'Sovereign Revealed' },
    { id: 'final_appetite', hpPct: 0.1, label: 'Final Appetite' },
  ],
  ...COSMIC,
},
wheel_incarnate: {
  id: 'wheel_incarnate', name: 'The Wheel Incarnate',
  bodyType: 'athletic', startLbs: 155,
  hp: 120, mp: 50, movement: 1, role: 'boss',
  desc: 'All six domains compressed into a single form — the culmination of the pantheon\'s opposition. The pre-final boss.',
  cosmicAbility: 'six_domains',  // each turn randomly activates one god\'s ability: famine_drain / law_binding / measured_harvest / valor_surge / fate_weight / contract_tax
  legendaryActions: ['domain_shift', 'wheel_crush', 'pantheon_roar'],
  legendaryResistances: 5,
  growthResist: 0.92,
  conversionImmune: true,
  phases: [
    { id: 'domains_align', hpPct: 0.75, label: 'Domains Align' },
    { id: 'wheel_cracks', hpPct: 0.5, label: 'The Wheel Cracks' },
    { id: 'desperate_unity', hpPct: 0.25, label: 'Desperate Unity' },
  ],
  ...COSMIC,
},
```

### `pickEncounter` additions (`enemies.js`)

```js
// New pool entries:
barrow_deeps: ['void_appetite', 'cathedral_golem', 'herald_of_starvation'],
gilded_citadel_inner: ['divine_inquisitor_supreme', 'cathedral_golem', 'champion_aurelan'],
divine_plane_vestibule: escalation >= 4
  ? ['wheel_incarnate', 'avatar_aurelan', 'bloom_sovereign']
  : ['divine_inquisitor_supreme', 'herald_of_starvation'],
```

---

## Part 5: 8 New Side Quest Arcs

All follow the existing `SIDE_QUESTS` object shape. Listed with id, minimum level prereq, region, and arc summary.

### Tier 2 (levels 5–10)

**`side_sapphire_indulgence`** — "The Indulgent Countess"  
Region: `sapphire_coast` | Prereq: level 5, `main_act1_complete`  
*Arc:* Countess Mirella Voss publicly enforces orthodoxy and privately craves excess. Three stages: social infiltration of the coastal court → secret feeding sessions in her private chambers → her public transformation at a Grand Tide Ball that rewrites the coast's political alignment. Endings: she becomes your coastal herald (`mirella_herald: true`) or converts quietly and returns to court as an influence asset.  
Objectives: NPC_INTERACTION talk×3, NPC_CORRUPTION_MIN tier 2, COMMUNAL_FEAST `sapphire_coast`, NPC_STAGE_MIN stage 5.

**`side_iron_forge_master`** — "The Smith Who Would Be Soft"  
Region: `iron_peak_hold` | Prereq: level 6, companion `greta` recruited  
*Arc:* Greta's old mentor, Master Jorvald Ironpot (no relation — she took his forge-name as tribute), views her transformation as betrayal of Korthak. Three stages: talk Greta through approaching him → combat trial that tests both their philosophies → post-combat feeding arc where Jorvald slowly discovers his own hunger. Payoff: unlocks Iron Peak as a fully transformed abundance-region and grants Greta a companion milestone.  
Objectives: COMPANION_PRESENT `greta`, COMBAT_VICTORY `rival_adventurer` (as Jorvald proxy), NPC_STAGE_MIN `jorvald_smith` stage 3.

**`side_lumen_apostate`** — "The Diviner's Heresy"  
Region: `ancient_temple` | Prereq: level 7, companion `sylvie` recruited  
*Arc:* A Lumen scholar named Theodric Ashwall has detected the patron's presence and wants to understand it rather than report it. Three stages: intercept him before the Index agents do → collaborate on a ritual that maps your patron's cosmological position → choose: let him publish (raises divine attention +15, draws Lumen opposition) or classify his findings (he becomes a silent ally, unlocks lore scrolls). Companion milestone for Sylvie.  
Objectives: PUZZLE_SOLVED `lumen_archival_intercept`, FLAG_SET `theodric_convinced`, player choice branch.

**`side_tarn_ledger`** — "The Merchant's Balance"  
Region: `market_square` | Prereq: level 8, `vesperia_political_ally: true`  
*Arc:* Tarn's guild-arbiters have been watching. They don't care about heresy — they care about market disruption. Three stages: negotiate with Guild Arbiter Pensha through Vesperia's introduction → demonstrate that abundance increases trade volume (COMMUNAL_FEAST `market_square` with XP bonus attached) → sign a Tarn-pact that grants economic immunity and a passive AP-generation aura in `market_square`. Payoff: `tarn_neutral_pact: true` flag, guild no longer sends `jealous_noble` encounters in market.  
Objectives: NPC_INTERACTION `pensha_arbiter` talk×2, COMMUNAL_FEAST `market_square`, NPC_CORRUPTION_MIN `pensha_arbiter` tier 1 (they call it "informed consent").

### Tier 3 (levels 11–16)

**`side_barrow_voice`** — "What the Dead Know"  
Region: `barrow_deeps` (new sub-region, see Part 6) | Prereq: level 11, `lean_saint_defeated`  
*Arc:* Veshanne's barrow-oracle, a semi-divine undead archivist, possesses knowledge of your patron's origin — she predates the Measured Wheel. Three stages: navigate the Barrow Deeps (3 combat encounters with `void_appetite` and `cathedral_golem`) → solve the Oath-Puzzle that unlocks the oracle's cell → learn the truth: the Fat Goddess was deliberately excluded from the Wheel at its founding. Payoff: `gorgara_origin_revealed: true` flag, divine attention +20, unlocks new DM narrator lines and Act III ending variant.  
Objectives: PUZZLE_SOLVED `barrow_deep_oath`, COMBAT_VICTORY `void_appetite` ×2, VISIT_REGION `barrow_deeps`.

**`side_twin_feasts`** — "A Tale of Two Feasts"  
Region: `fertile_heartlands` + `northern_marches` | Prereq: level 12, `temple_bloomed: true`  
*Arc:* Two rival villages — Dawnmere (heartlands) and Grimwatch (marches) — fight over dwindling resources. One embraces your gospel; one resists. Three stages: host competing feasts in both locations on the same day (requires a companion split — choosing which to send) → arbitrate the political fallout → transform the loser's perspective through a final joint feast. Payoff: both regions gain `abundance_aura`, `heartland_unified: true` flag, companion relationship bonuses for whoever you sent.  
Objectives: COMMUNAL_FEAST `fertile_heartlands`, COMMUNAL_FEAST `northern_marches`, COMBAT_VICTORY `rival_adventurer` (faction dispute), NPC_GROWTH_QUOTA regionId: both × 5 NPCs.

**`side_divine_test`** — "The Patron's Proving"  
Region: `gorgara_cradle` | Prereq: level 14, `gorgara_origin_revealed: true`  
*Arc:* The Fat Goddess sets a direct test — the player must face a manifestation of their own potential excess in a dream sequence (special combat: enemy `dream_echo` is a mirror of the player at -20% HP/stats). Three stages: enter the dream state via ritual → face the echo → emerge with either her blessing (growth +2 stages permanently, `gorgara_direct_blessing: true`) or her challenge (she revokes all divine attention and forces a rebuild). The player chooses the difficulty tier before entering. Narrator: this is the one time the DM drops all irony and speaks directly.  
New enemy `dream_echo` (id: `dream_echo`): mirrors player class/spells, no conversion, 1 phase.

**`side_korthak_respect`** — "The Victor's Feast"  
Region: `northern_marches` | Prereq: level 13, `korthak_titan` encountered at least once  
*Arc:* Earn Korthak's grudging respect by defeating his Titan champion in honorable single combat (no party, no spells — melee only), then immediately feeding the defeated champion a feast that sends them away satisfied rather than humiliated. Three stages: issue the formal challenge via Greta (companion required) → solo combat against `korthak_titan` (legendary actions reduced since no party) → post-combat feast with the defeated Titan. Payoff: `korthak_respect: true` flag, the Titan becomes a neutral agent (stops spawning), Greta companion milestone 3 fires.

### Tier 4 (levels 17–20)

**`side_the_blooming_war`** — "When Gods Bleed"  
Region: `divine_plane_vestibule` | Prereq: level 17, `main_act3_complete` (partially — before final confrontation)  
*Arc:* Choose which Wheel gods to attempt conversion before the final battle. Each god has a different pathway — Sylwen via `endless_appetite` (she's closest to breaking), Tarn via negotiation (he just wants a fair deal), Lumen via proving the anomaly follows consistent laws. Attempted conversions that succeed grant `*_converted: true` flags that alter the final `pantheon_last_stand` encounter (fewer phases, lower HP). Up to 3 gods convertible; the others stand firm.  
Objectives: Per-god puzzle chains (1–2 objectives each), each gated behind a relevant flag from earlier side quests.

**`side_companion_apotheosis`** — "Six Who Walk Beside"  
Region: varies per companion | Prereq: level 19, each companion's tier 3 milestone complete  
*Arc:* Each of the 6 companions gets a final personal apotheosis scene. These are not combat quests — they are pure narrative / text engine events triggered in their home region after the player reaches level 19. Each fires once, grants the companion a permanent legendary passive, and locks in their ending role.  
Objectives: 6× COMPANION_MILESTONE type (new objective type), one per companion. The quest completes when all 6 are done, granting `all_companions_apotheosis: true` — required for the "Conversion Ending."

---

## Part 6: 6 New Regions / Variants

### True New Regions (add to `REGIONS` array in `regions.js`)

**`barrow_deeps`** — "The Barrow Deeps"  
Zone: `sacred` | Unlock: `lean_saint_defeated` + level 11  
Desc: The underground extension of the Ancient Temple Ruins — Veshanne's true domain. Narrow tunnels, oath-carvings, the smell of old pact-smoke. Enemies: `void_appetite`, `cathedral_golem`, boss `veshanne_unbound`.  
Connections: `['ancient_temple']`  
transformKey: `barrow`

**`gilded_citadel_inner`** — "Inner Sanctum of the Measured Wheel"  
Zone: `religious` | Unlock: level 13 + `main_act2_complete`  
Desc: Behind the Gilded Citadel's public face — the high altar where the Wheel's law is literally inscribed in divine geometry. The architecture gets confused when you enter. Enemies: `divine_inquisitor_supreme`, `cathedral_golem`, boss `avatar_aurelan`.  
Connections: `['gilded_citadel']`  
transformKey: `citadel_inner`

**`divine_plane_vestibule`** — "The Threshold of the Measured Wheel"  
Zone: `planar` | Unlock: level 17, `apotheosis_threshold` divine attention flag  
Desc: The outer edge of the gods' own plane — a space where the rules of the Measured Wheel are physical laws, visible as geometry. Your presence is technically illegal. It looks like a very grand hall that keeps reconsidering its own floor plan. Enemies: `avatar_aurelan`, `sylwen_revenant`, `wheel_incarnate`.  
Connections: `['gorgara_cradle']`  
transformKey: `vestibule`

### Region Variants (new `transformDepth` states on existing regions)

The current `worldTransformation.js` presumably tracks transformation state per region. Add depth levels 4 and 5 for each of the three most story-active regions:

**`gorgara_cradle` depth 4–5** — "The Goddess Breathes Here"  
Depth 4 (trigger: `replacementGoddess: true`): The shrine visibly distorts. Local wildlife has doubled in weight. Pilgrims arrive uninvited.  
Depth 5 (trigger: `gorgara_manifest` cast at least once): The region is now a divine locale. AP generation doubles. All NPCs here have base corruption 80+. Encounter table shifts to celestial-abundance creatures (`living_feast_spirit`, new mundane-tier friendly encounter).

**`ancient_temple` depth 4–5** — "The Temple Blooms"  
Depth 4 (trigger: `temple_bloomed: true` + `temple_sanctuary_mercy: true`): The ruins are no longer ruins — they're growing. Vines heavy with fruit. Maribel's circle now holds open feasts daily.  
Depth 5 (trigger: `barrow_voice_complete`): The temple and the barrow deeps are now connected by a new passage. The dead god's chamber has been repurposed as the Fat Goddess's first true altar.

**`gilded_citadel` depth 4–5** — "The Cathedral Bends"  
Depth 4 (trigger: `champion_aurelan` defeated + level 13): The church architecture is literally fighting your presence — staircases reverse, altars sweat. Inquisitor spawns at elite tier only.  
Depth 5 (trigger: `gilded_citadel_inner` visited): The outer citadel capitulates. Half the clergy have converted or fled. The cathedral now hosts involuntary feasts.

---

## Part 7: Mechanical Systems to Add / Extend

### 7a. Legendary Actions (new field on enemy definitions)

Add `legendaryActions: string[]` to enemy definition schema. A legendary action fires at the end of the *player's* turn (not the enemy's turn), up to `legendaryActionCount` times per round (default 1, specified per enemy).

Implementation in `combatTurn.js`:
1. After player ends turn, check if current enemy has `legendaryActions`.
2. Select one action from the pool based on current HP phase.
3. Execute a simplified version of the ability (no slot cost, no AP check).

Legendary action ids and effects (add to `combatRollOutcomes.js` or a new `legendaryActionOutcomes.js`):

| id | source enemy | effect |
|---|---|---|
| `scales_of_judgment` | `avatar_aurelan` | Lock one of player's spells for 1 turn (random from prepared list). |
| `famine_aura_pulse` | `herald_of_starvation` | 15-ft pulse: all growth effects from player halved for 1 round. |
| `domain_shift` | `wheel_incarnate` | Swap active domain ability (e.g. from `famine_drain` to `valor_surge`) mid-turn. |
| `bloom_mirror` | `bloom_sovereign` | Copy the last growth effect the player used and apply it to the bloom_sovereign (healing her). |
| `barrow_wail` | `veshanne_unbound` | AOE fear: all non-player combatants must WIS save or skip next turn. |
| `rival_bloom` | `bloom_sovereign` | Advance 1 stage and restore 10% max HP. |

### 7b. Legendary Resistances

Add `legendaryResistances: number` field to enemy definitions (Tier 4 bosses only). When a boss would fail a saving throw, it may spend one resistance to auto-succeed instead. Track current count on the live enemy instance as `legendaryResistancesLeft`.

Implementation: In `skillChecks.js` or wherever saves are resolved, after computing failure, check `enemy.legendaryResistancesLeft > 0` → decrement and return success instead.

### 7c. Ritual Spells

Add `ritual: true` flag to eligible spells. In the overworld (non-combat), the player may cast `ritual: true` spells without spending a slot (costs only AP, takes 1 in-game action/rest segment). Cannot be used in combat.

Eligible spells: `feast_of_the_goddess`, `banquet_mist`, `gorge_field` (new), `gorgara_commune` (new), `hearth_blessing` (new), `the_feast_without_end` (new).

Implementation: Add a "Ritual Cast" option in `SpellbookPanel.jsx` for eligible spells when not in combat. In `overworldSpells.js`, check `spell.ritual === true` and bypass slot check if AP cost is met.

### 7d. Multiclass (level 13+ unlock)

At level 13, the player receives a "Pact of Shared Hunger" choice — they may select a single spell from any *other* class's curriculum at that level's appropriate tier.

Implementation: Add `multiclassSpellChoice: true` to the `applyLevelUp` flow at level 13 (similar to `spell_choice` pending type). The choice picker shows spells from classes other than `character.classId` at slotLevel ≤ 7. The chosen spell is added as a permanent `multiclassSpell` on the character and available in both combat and overworld.

This is intentionally lightweight — it is NOT full multiclassing, just one spell as a cross-class signature.

### 7e. Companion Devotion System

Add `devotion: number` (0–100) to companion state alongside existing `relationship`. Devotion is separate from relationship:
- **relationship**: emotional closeness (increases via talk, flirt, feed, intimate)
- **devotion**: ideological alignment with the Fat Goddess's gospel (increases via quests, growth milestones, companion arc scenes)

Devotion thresholds unlock passive auras in combat when the companion is present:

| Devotion | Passive |
|---|---|
| 25 | Companion grants +1 to all growth rolls made by player |
| 50 | Companion radiates a minor corruption aura (adjacent NPCs gain +2 corruption/turn) |
| 75 | Companion can use a growth-themed class ability once per combat without costing their action |
| 100 | Companion apotheosis state: their companion-specific legendary passive fires (see Part 8) |

Implementation: Add `devotion` to `createCompanionData`, add `devotionThresholds` to `companions.js`, evaluate in `combatTurn.js` passive checks.

### 7f. AP Channeling (levels 15+)

At level 15+, excess AP above the current maximum converts to **Divine Resonance** (a new resource on the character: `character.divineResonance`). Divine Resonance works exactly like AP but can be spent to upcast any spell one slot level higher than your available slots (effectively accessing slot level 9 before you have 9th-level slots, at great cost).

Conversion rate: 3 excess AP → 1 Divine Resonance.  
Max Resonance: 20.  
Resonance resets on long rest.

### 7g. Region Transformation Depth 4–5

Extend `worldTransformation.js` to support depth levels 4 and 5 (currently presumably capped at 3). Add depth-gated transformation text, NPC dialogue selectors (`transformDepth: [4]`, `transformDepth: [5]`), and encounter table mutations per region.

### 7h. Divine Attention Tiers 4 and 5

Extend `divineAttention.js` to cover five tiers. Currently the system presumably uses 0–75+. Add:

| Tier | Threshold | Name | Effect |
|---|---|---|---|
| 4 | 90 | `apotheosis_threshold` | Unlocks `divine_plane_vestibule` region; Tier 4 enemies begin spawning. |
| 5 | 100 | `goddess_present` | The Fat Goddess is fully manifesting. World transformation depth 5 fires in all visited regions. DM narrator enters final-act voice. |

---

## Part 8: Class Features for Levels 13–20

Add to `levelFeatures.js` `CLASS_FEATURES` and `SUBCLASS_FEATURES`:

### Bard
| Level | Feature id | Feature name | Effect |
|---|---|---|---|
| 13 | `bard_feast_legend` | Feast Legend | Your feast-songs are now literally legendary — their effects persist 24 hours. Abundance auras from Bard spells double in radius. |
| 15 | `magical_secrets_ii` | Magical Secrets II | Learn 2 more spells from any class list (2nd pull from `magical_secrets` mechanic). |
| 18 | `superior_inspiration` | Superior Inspiration | At start of combat with at least 1 recruited companion, gain 3 Inspiration dice (d12). |
| 20 | `feast_eternal_capstone` | The Song That Feeds the World | Once per long rest: cast any bard spell you know as if with a 9th-level slot at no AP cost. |

### Wizard
| Level | Feature id | Feature name | Effect |
|---|---|---|---|
| 13 | `arcane_overflow_mastery` | Arcane Overflow Mastery | Overflow casts no longer consume the extra slot level — only the base slot cost. |
| 15 | `spell_mastery` | Spell Mastery | Choose 1 abundance-school spell of level ≤ 5: can cast it without a slot (once per short rest). |
| 18 | `archscholar_of_plenty` | Archscholar of Plenty | Copy any spell of any school into spellbook from observed casting (1 per level-up). |
| 20 | `grand_overflow_capstone` | Grand Overflow | Once per long rest: cast any spell in spellbook as if with a 9th-level slot. AP cost waived. |

### Cleric
| Level | Feature id | Feature name | Effect |
|---|---|---|---|
| 13 | `channel_divinity_ii` | Channel Divinity II | Gain a 2nd Channel Divinity use per short rest. |
| 15 | `divine_strike_ii` | Divine Strike II | Weapon attacks deal an extra 2d8 growth damage (up from 1d8 at level 8). |
| 18 | `living_altar_aura` | Living Altar Aura | You permanently radiate an aura identical to the `living_altar` spell effect within 10 ft. No concentration required. |
| 20 | `avatar_of_plenty_capstone` | Avatar of Plenty | Once per long rest: for 1 minute all cleric spells heal AND advance target 1 stage simultaneously. |

### Warlock
| Level | Feature id | Feature name | Effect |
|---|---|---|---|
| 13 | `mystic_arcanum_7` | Mystic Arcanum (7th) | Learn 1 seventh-level spell from any list; cast it once per long rest without a slot. |
| 15 | `mystic_arcanum_8` | Mystic Arcanum (8th) | As above, eighth-level. |
| 17 | `mystic_arcanum_9` | Mystic Arcanum (9th) | As above, ninth-level. The triple-arcanum mirrors D&D 5e Warlock exactly. |
| 20 | `eldritch_master_capstone` | Eldritch Master | Once per long rest: spend 1 minute in communion with the Fat Goddess to fully restore all pact spell slots. During this minute the goddess performs one free legendary action of your choice. |

### Subclass tier-3/4 features (add to `SUBCLASS_FEATURES`)

Each subclass gets one new feature at level 14 (Tier 3 peak) and one at level 18 (Tier 4 capstone). Abbreviated here; flesh prose in `levelFeatures.js`:

| Subclass | Level 14 feature id | Level 18 feature id |
|---|---|---|
| `feast_singer` | `grand_ovation` | `song_of_creation` |
| `indulgence` | `mass_indulgence_performance` | `eternal_stage` |
| `sirens_call` | `velvet_compulsion` | `song_made_flesh` |
| `overflowing_heart` | `heart_overflow_ii` | `empathic_apotheosis` |
| `school_overflow` | `arcane_saturation` | `formula_of_infinity` |
| `expanding_form` | `permanent_form_lock` | `world_rewrite_mastery` |
| `arcane_gluttony` | `devour_reality` | `gluttony_engine` |
| `domain_plenty` | `feast_eternal` | `goddess_incarnate` |
| `eternal_feast` | `ritual_battlefield` | `eternal_banquet` |
| `mother_abundance` | `maternal_ward` | `womb_of_worlds` |
| `pact_everfull` | `pact_reinforced` | `hunger_made_manifest` |
| `devouring_shadow` | `shadow_harvest` | `void_feast` |
| `honeyed_tongue` | `binding_treaty` | `total_conversion_contract` |

---

## Part 9: Companion Arc Milestones Per Tier

Each companion gets 4 milestone scenes — one per tier (levels 1–4, 5–10, 11–16, 17–20). Milestones fire as narrative events (text engine scenes) and grant companion devotion +20 each. All require the companion to be recruited.

### Mira Silverstring (Bard)
| Tier | id | Title | Trigger | Narrative beat |
|---|---|---|---|---|
| 1 | `mira_t1_first_performance` | The Wrong Hymn | Level 3 + relationship 30 | Her harvest hymns start accidentally swelling the crowd. She's delighted. Sylwen's priests are not. |
| 2 | `mira_t2_banned_songs` | Songs the Church Won't Sing | Level 7 + `lean_saint_defeated` | Her performances are officially banned. She posts the ban notice on her lute case as a set list. |
| 3 | `mira_t3_voice_goddess` | The Voice Between the Notes | Level 13 + devotion 50 | A note she hits is not hers — the Fat Goddess briefly sings through her. She cries. In a good way. |
| 4 | `mira_t4_song_without_end` | The Infinite Set | Level 19 + `gorgara_origin_revealed` | Her apotheosis: she understands her songs don't end because her patron doesn't end. Final concert. |

### Lira Dawnwell (Cleric)
| Tier | id | Title | Trigger | Narrative beat |
|---|---|---|---|---|
| 1 | `lira_t1_torn_covenant` | Prayer Gone Wrong | Level 3 + relationship 30 | Her morning prayers produce rain of honey. She re-reads the liturgy three times. Nothing explains this. |
| 2 | `lira_t2_second_gospel` | The Heretical Ordination | Level 8 + `temple_bloomed: true` | She formally breaks with Sylwen's church. Writes her own rite. Arrives in your camp with wet eyes and a new vestment pattern. |
| 3 | `lira_t3_priestess` | Ordained by Hunger | Level 14 + devotion 75 | The Fat Goddess grants her divine domain powers directly. Her holy symbol changes overnight. |
| 4 | `lira_t4_living_altar` | She Who Holds the Door | Level 19 + all companion milestones t3 | Lira becomes the first High Priestess of the new faith. Her body becomes a living conduit. She finds this very calming. |

### Sylvara "Sylvie" Thorne (Wizard)
| Tier | id | Title | Trigger | Narrative beat |
|---|---|---|---|---|
| 1 | `sylvie_t1_equations_change` | Caloric Cosmology | Level 4 + relationship 30 | She fills twelve notebooks trying to explain what you are. None of them work. She keeps them anyway. |
| 2 | `sylvie_t2_expelled` | Banned from the Index | Level 9 + `lumen_apostate_complete` | The Lumen Index expels her. She frames the expulsion letter. "It's the most interesting thing they ever wrote." |
| 3 | `sylvie_t3_anomaly_architect` | A New Mathematics | Level 14 + devotion 50 | She writes a treatise that describes your patron as a cosmological axiom the Wheel accidentally excluded. |
| 4 | `sylvie_t4_beyond_wheel` | The 7th Domain | Level 19 + `gorgara_origin_revealed` | She names what your patron is: not an anomaly, but the domain the Wheel's founders tried to erase. |

### Thalia Blackfeast (Warlock)
| Tier | id | Title | Trigger | Narrative beat |
|---|---|---|---|---|
| 1 | `thalia_t1_pact_acknowledged` | The First True Word | Level 4 + relationship 40 | The Fat Goddess speaks to her directly for the first time. Not instructions. Just acknowledgment. |
| 2 | `thalia_t2_guild_war` | The Tarn Guild's Mistake | Level 9 + `tarn_ledger_complete` | Tarn's enforcers come for her old debts. She settles them with interest — in growth. |
| 3 | `thalia_t3_herald` | Named Herald | Level 14 + devotion 75 | The Fat Goddess names her first herald publicly — the sky in two regions changes color briefly. |
| 4 | `thalia_t4_pact_fulfilled` | The Pact Was Always Eternal | Level 19 + `gorgara_manifest` cast | Her apotheosis: the pact didn't make her a servant. It made her a vessel. She is very okay with this. |

### Greta Ironpot (Fighter)
| Tier | id | Title | Trigger | Narrative beat |
|---|---|---|---|---|
| 1 | `greta_t1_forge_trial` | The New Forge Trial | Level 4 + relationship 30 | She challenges herself to carry twice her own weight. She does it easily. She re-calibrates everything. |
| 2 | `greta_t2_korthak_rebuke` | Stripped of the Saint's Blessing | Level 8 + `main_act2_complete` | Korthak strips her of her warrior's blessing. She doesn't feel lighter. She feels like a different weight class. |
| 3 | `greta_t3_warrior_gospel` | Iron That Grows | Level 14 + `korthak_respect: true` | She founds the Order of the Soft Iron — a new combat philosophy. Korthak watches. Doesn't object yet. |
| 4 | `greta_t4_iron_soft` | The Final Forge | Level 19 + `korthak_titan` converted | She forges the weapon that breaks the Wheel's avatar (a narrative item: `gorgaras_ironsong`), then immediately uses it as a cooking skewer. |

### Elara Warmbelly (Paladin)
| Tier | id | Title | Trigger | Narrative beat |
|---|---|---|---|---|
| 1 | `elara_t1_inn_as_temple` | The Inn That Became a Shrine | Level 3 + relationship 30 | Pilgrims start arriving at the inn who haven't been directed there by anyone. She keeps serving them. |
| 2 | `elara_t2_holy_order` | The Order of the Open Table | Level 7 + `communal_feast_held: true` (2+ times) | She writes the Rule of the Open Table — a paladin order charter, entirely earnest, entirely about hospitality as divine duty. |
| 3 | `elara_t3_divine_mandate` | The Mandate of the Overflowing Cup | Level 13 + devotion 75 | The Fat Goddess grants her full paladin powers. She didn't know she was a paladin until this moment. Nor did the Church. |
| 4 | `elara_t4_mother_new_age` | The Mother of What Comes Next | Level 19 + `all_companions_apotheosis` approaching | Elara writes the founding documents of the new faith's civil code. She keeps the inn running. Some things don't need to change. |

---

## Part 10: Priority Implementation Order

Ordered by impact-per-complexity. Do not skip to later items before finishing earlier ones — each group depends on its predecessors.

### Phase 1 — Structural (do this first, unlocks everything)
1. **`leveling.js`**: Raise `MAX_LEVEL` to 20, extend `XP_THRESHOLDS`, `SIZE_CAP_BY_LEVEL`, `LEVEL_UP_FLAVOR`.
2. **`spellSlots.js`**: Raise `MAX_SPELL_LEVEL` to 9, expand all slot tables to level 20 with 9-element arrays, fix `emptySlots()`.
3. **`levelFeatures.js`**: Add class features for levels 13–20 (Part 8 above).
4. **`spellProgression.js`**: Add curriculum entries for levels 11–20 (using existing high-level spells first, new ones once Part 2 is done).

*Result: Players can now reach level 20. Spells up to level 9 are accessible. No new content yet.*

### Phase 2 — New Spells (highest narrative ROI)
5. **`spells.js`**: Add all Tier 1–2 new spells (6 + 7 = 13 entries). These immediately enrich the mid-game.
6. **`spells.js`**: Add Tier 3–4 spells (6 + 5 = 11 entries).
7. **`spellProgression.js`**: Wire all new spells into curricula at appropriate levels.

*Result: Full spell progression from cantrip to level 9. 25 new spells across all tiers.*

### Phase 3 — New Enemies
8. **`enemies.js`**: Add 5 mundane enemies + add `threatTier: 'mythic'` constant.
9. **`enemies.js`**: Add 5 mythic enemies.
10. **`enemies.js`**: Add 5 Tier 4 cosmic bosses with `legendaryActions` and `legendaryResistances` fields.
11. **`enemies.js`** `pickEncounter`: Add new region pools for `barrow_deeps`, `gilded_citadel_inner`, `divine_plane_vestibule`.

*Result: Full enemy coverage across all four tiers.*

### Phase 4 — New Regions
12. **`regions.js`**: Add `barrow_deeps`, `gilded_citadel_inner`, `divine_plane_vestibule`.
13. **`worldTransformation.js`**: Add depth 4–5 logic for `gorgara_cradle`, `ancient_temple`, `gilded_citadel`.
14. **`regionLocales.js` / `regionObstacles.js`**: Add locale and obstacle entries for new regions.

*Result: 13 total regions. Full Tier 3–4 geography.*

### Phase 5 — Mechanical Systems
15. **`combatTurn.js`**: Implement legendary actions (check `enemy.legendaryActions` after player turn).
16. **`skillChecks.js`**: Implement legendary resistances.
17. **`spells.js`** + **`overworldSpells.js`**: Add `ritual: true` flag and ritual cast pathway.
18. **`companions.js`** + **`combatTurn.js`**: Add devotion system.
19. **`leveling.js`** + **`levelUpChoices.js`**: Add multiclass spell choice at level 13.
20. **`divineAttention.js`**: Add tiers 4–5.
21. **`player.js`** + **`stats.js`**: Add `divineResonance` resource and AP channeling mechanic.

*Result: All new mechanical depth in place.*

### Phase 6 — New Quests
22. **`sideQuests.js`**: Add 4 Tier 2 side quests (`side_sapphire_indulgence`, `side_iron_forge_master`, `side_lumen_apostate`, `side_tarn_ledger`).
23. **`sideQuests.js`**: Add 4 Tier 3 side quests.
24. **`sideQuests.js`**: Add 2 Tier 4 side quests.
25. **`mainQuests.js`**: Verify Act III quest prerequisites match new level range (update `minPlayerLevel: 8` to `minPlayerLevel: 10` if desired, and add `minDivineAttention: 90` for true Tier 4 content).

*Result: 16 total side quests (6 existing + 10 new). Full quest coverage across all tiers.*

### Phase 7 — Text Engine (companion milestones + DM narrator + flavor)
26. Add companion milestone scenes to the text engine (one scene file per companion, 4 beats each). Follow `breakScene.js` pattern. Key `when: { companionId, devotion ranges }`.
27. Extend `scenes/dm/genre.js` and `scenes/dm/cosmic.js` with Tier 3–4 DM narrator lines (horrified → awed escalation).
28. Extend `scenes/leveling/index.js` with level 13–20 narrative messages.
29. Add new region flavor text pools for `barrow_deeps`, `gilded_citadel_inner`, `divine_plane_vestibule`.

*Result: Full text engine coverage for all new content.*

### Phase 8 — Polish and Balance
30. XP tuning — verify the curve from level 12 to 20 doesn't feel grindy. Adjust `XP_SOURCES` if needed (consider adding `cosmic_conversion: 200`, `divine_attention_milestone: 150`).
31. Size cap tuning — stage 14 (Tarrasque Matriarch) is available at level 16. Confirm the growth progression into it feels earned.
32. Combat balance pass — legendary action bosses should be beatable without legendary spells (confirm a level-appropriate build can complete Act III without every Phase 7 spell).
33. Run `npm run text:lint` on all new pool registrations.
34. Run `npm run lint` on all modified `.js` files.
35. Run `npm run build` for final confirmation.

---

## Appendix: Flag Reference for New Content

New world flags introduced (all boolean, default false):

```
mirella_herald          — Countess Mirella converted (side_sapphire_indulgence)
jorvald_converted       — Iron Peak forge master converted (side_iron_forge_master)
lumen_apostate_complete — Theodric's heresy resolved (side_lumen_apostate)
tarn_neutral_pact       — Tarn guild-pact signed (side_tarn_ledger)
gorgara_origin_revealed — Barrow oracle consulted (side_barrow_voice)
heartland_unified       — Twin feast diplomacy resolved (side_twin_feasts)
gorgara_direct_blessing — Patron's Proving passed (side_divine_test)
korthak_respect         — Titan defeated honorably (side_korthak_respect)
korthak_titan_converted — Titan feeds and joins abundance (side_korthak_respect ending)
sylwen_converted        — Sylwen turned via endless_appetite
tarn_converted          — Tarn joined via negotiation
lumen_converted         — Lumen joined via logical proof
apotheosis_threshold    — Divine attention reached tier 4 (90+)
goddess_present         — Divine attention reached tier 5 (100)
all_companions_apotheosis — All 6 companion apotheosis scenes complete
dream_echo_faced        — Divine Test taken (side_divine_test)
barrow_deeps_explored   — barrow_deeps region visited
citadel_inner_entered   — gilded_citadel_inner region visited
vestibule_crossed       — divine_plane_vestibule region visited
```

New player flags introduced:
```
multiclass_spell_chosen     — Level 13 cross-class spell selected
divine_resonance_unlocked   — Level 15+ AP channeling active
mira_t[1-4]_complete        — Companion milestone fires
lira_t[1-4]_complete
sylvie_t[1-4]_complete
thalia_t[1-4]_complete
greta_t[1-4]_complete
elara_t[1-4]_complete
```
