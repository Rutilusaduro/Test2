# Text Engine Authoring Guide

> **Feast of the Glutton God:** All narrative text edits must follow this file and `docs/TUNING.md` (flag-batch loop + Style Ledger). Canonical exemplar scenes in this repo: `src/textEngine/scenes/npc/` and `src/textEngine/scenes/growthEvent/`.
>
> **Audience: you, the LLM (or human) about to write game prose.** Read this whole file before writing or editing ANY narrative text. The engine reference is `docs/modular-text-system.md`; this file is the content contract. The canonical exemplar files to copy are `src/textEngine/scenes/weighIn/` and `src/textEngine/scenes/talkEncourage.js`.
>
> Companions: `MIGRATION.md` (process for converting legacy prose into this form) · `TUNING.md` (the flag-batch editing loop + the **Style Ledger** of banned constructions — new prose must respect the ledger too).

## 0. Prime directive

**Never register a monolithic paragraph as a variant.** If a text you are about to write is longer than ~200 characters, it is a *skeleton* candidate: break it into a skeleton template plus fragment slots. The whole point of this system is that fragments mix and match combinatorially — one 4-fragment sentence with 5 options per slot yields 625 readable sentences; one handwritten paragraph yields 1. `npm run text:lint` enforces this (error at >200 chars in pool modules).

The second rule: **the player rereads this prose hundreds of times.** Variety, personality, and state-reactivity are the product. A line that ignores the girl's mood, body type, or hunger when those should obviously change it is a bug.

## 1. Mental model

Two layers, always:

1. **Skeletons** — short sentence templates containing slots, registered as the *beat* module (e.g. `wi.arrival`). A beat has 3-6 skeleton shapes so sentence rhythm varies, not just word choice.
2. **Fragments** — small pools of words/clauses/dialogue beats that fill the slots (e.g. `wi.moveVerb`, `wi.bodyClause`). Each fragment variant declares `when` selectors; the engine picks among ALL matching variants, weighted toward specificity.

```js
import { registerPool } from '../engine.js';

registerPool("wi.arrival", [
  { when: {}, text: [
    "{subject.name} {wi.pace} {wi.moveVerb} {wi.doorway}{join:wi.bodyClause,wi.faceClause|prefix:, }.",
    "{subject.name} {wi.moveVerb} in{join:wi.bodyClause,wi.soundClause|prefix:, }.",
  ]},
]);

registerPool("wi.bodyClause", [
  { when: {}, text: ["", "", "her steps unhurried"] },                       // weighted-empty: clause often omitted
  { when: { bodyType: ["pear", "hourglass"], stageMin: 6 }, text: [
    "her wide hips catching briefly in the door",
    "her hips brushing both sides of the frame",
  ]},
  { when: { bodyType: "topHeavy", stageMin: 6 }, text: [
    "her heavy bust arriving a beat before she does",
  ]},
]);
```

### `registerPool` vs `registerModule`

- **`registerPool` — the default for ALL new content.** Every matching variant stays RNG-eligible; weight = `(variant.weight ?? 1) * 3^specificity`. A 2-condition variant beats a wildcard 9:1, so specific flavor usually wins but generic lines surface as spice (~10-25%).
- **`registerModule` ('best' mode) — legacy/suppressive.** Most specific match wins outright. Use ONLY when less-specific variants must be *impossible*, not just rare (e.g. `talk.coda` registers an empty wildcard so the coda is silent unless a corruption register fires).
- `weight` raises/lowers a variant's share (`weight: 4` on persona variants keeps the girl's own voice dominant; `weight: 0` parks a draft).
- `priority` in pool mode is a **hard gate**: only max-priority matches survive. Use rarely and document why in a comment.

### Consequence of pooling: generic fragments must be tone-neutral

There are no NOT-conditions. A wildcard fragment can fire while the girl is in withdrawal, grieving, or ecstatic — so wildcard texts must read correctly under ANY state ("she crosses the room" ✓, "she bounces in cheerfully" ✗ — key that one on `mood`).

## 2. Grammar-shape contracts

Every fragment pool has ONE grammatical shape. Mixing shapes inside a pool breaks every skeleton that uses it. Declare the shape in a comment above each pool.

| Shape | Rules | Example |
|---|---|---|
| **ADVERBIAL** | lowercase, no punctuation | `without hurry`, `with single-minded momentum` |
| **VERB PHRASE** | lowercase, follows a subject, no punctuation | `waddles`, `angles sideways through` |
| **PARTICIPLE CLAUSE** | lowercase, no leading cap, no trailing period; reads after a comma | `her wide hips catching briefly in the door` |
| **FULL SENTENCE** | Capitalized, ends with `.` (or `!?`) | `The dial holds at {subject.lbs}.` |
| **DIALOGUE BEAT** | Full sentence(s) containing a quote + attribution | `"Coach would lose his mind. I don't care," she says.` |

### Idioms

- **Optional clause group:** `{join:wi.bodyClause,wi.faceClause|prefix:, }` — resolves both, drops empties, glues survivors with `, ` + final `and`, and only emits the leading `, ` if anything survived. This is THE way to stack body/mood clauses onto a sentence.
- **Optional single slot:** `{wi.moodTag|prefix: }` — leading space only when non-empty.
- **Sometimes-omit:** put `""` entries in the wildcard pool (each `""` is one share of the RNG). Two empties + one text ≈ 33% emission at wildcard.
- **Weight callout:** `{subject.lbs}` (rounded number), `{subject.name}`, `{subject.first}`.
- **Smoothing gotcha:** the smoothing pass capitalizes after `. ` and at string start, but NOT after `\n\n` — fragments that open a paragraph must be authored capitalized or piped through `|cap`.
- Never name a module `join` (reserved). Never use `{` or `}` in prose (write `{{` for a literal brace).

## 3. Selector cookbook

All keys combine (AND within a variant; value arrays are OR). Unlisted keys are looked up on `ctx.d` directly.

| Key | Values |
|---|---|
| `stage` / `stageMin`+`stageMax` | 0 Slight · 1 Slim · 2 Soft · 3 Chubby · 4 Plump · 5 Heavy · 6 Fat · 7 Very Fat · 8 Enormous · 9 Colossal · 10 Blob · 11 Leviathan. Bands used by weigh-in content: light ≤2, rounded 3-5, heavy 6-8, vast 9+ |
| `attitude` / `attitudeMin`+`attitudeMax` | **the portable "how they feel about gaining" axis** — 0 reluctant · 1 ambivalent · 2 eager (· 3 devoted). **New content should key on `attitude`.** |
| `corruption` | legacy alias of `attitude` (same tier): 0 Hesitant · 1 Conflicted · 2 Broken In. Existing scenes keep using it. |
| `relationship` | 0 Acquaintance · 1 Close · 2 Intimate · 3 Devoted |
| `mood` | happy, focused, excited, content, tired, stressed, warm, observant, cheerful, bemused, curious, nervous (new moods may appear — ALWAYS provide a wildcard) |
| `bodyType` | pear, apple, hourglass, athletic, straight, rotund, voluptuous, mom_bod, fertility_goddess, topHeavy (+ `default` row convention in lexicon) |
| `archetype` | cheerleader, bookworm, influencer, athlete, artsy, gamer, sorority, overachiever, quiet, transfer, culinary, nursing, psych, eced, farm_girl, predator, pharmacy_grad, explorer |
| `hungerTierMin/Max` | 0 Normal · 1 Increased · 2 High · 3 Craving · 4 Starving |
| `addictionLevelMin/Max` | 0 None · 1 Mild · 2 Moderate · 3 Severe · 4 Dependent |
| `inWithdrawal` | true/false — shaky, irritable, food-fixated register |
| `fullnessMin/Max` | fullness ÷ stomachCapacity (can exceed 1) |
| `studentId` | value or array — see roster below |
| `lastCompound` | pharmacist drug last applied: appetite_stimulant, mild_pleasure, metabolic_slowdown, weight_gain_potion, strong_appetite, high_pleasure, digestion_supplement, craving_inducer, sensitivity_serum, intentional_addiction, loyalty_enhancer, rapid_expansion, addiction_cure, cult_appetite, cult_pleasure, dependency_maintenance |
| `season` | fall, winter, spring, summer (4-week cycles) |
| `campusFattening` / `campusTierMin/Max` | school-wide softening flag / tier 0-3 |
| `bigScale` | true when the industrial scale is in play (say "display", not "dial") |
| `skill` | one skillEffects flag name, truthy check |
| `relSize` / `refStage` | vs `ctx.ref`: much_smaller, smaller, similar, larger, much_larger |
| `startStageMin/Max` · `endStageMin/Max` · `endStage` | growth-event stage span (from `globals.startStage`/`endStage`); `endStage` is an exact match for the per-stage crossing lexicon |
| `stagesJumpedMin` | growth-event: number of stages crossed in one event |
| `causeType` | growth-event cause: device_use, device_malfunction, weekly_tick, digest_stageup, feature |
| `featureId` | growth-event feature source: stream, compound, cultivator, contest |
| `growthMethod` | device growthProfile method: feed, bloat, infuse, serum, radiation, gas, sculpt, stimulate, limit_break |
| `growthIntensity` | gradual, steady, rapid, violent (device-risk register lives here) |
| `sensation` | pressure, fullness, warmth, pleasure, stretch |
| `locale` | growth-event setting: lab, dorm, stream_setup, dining_hall, kitchen, office, campus |
| `outfitHint` | growth-event garment override: casual, revealing, branded, contest (overrides archetype garment) |
| `isPermanent` / `limitRemoved` | growth-event: gain is permanent / the student's growth ceiling was removed |
| `saidBefore` / `notYet` | scene-memory predicates — a tag (or array) that has / hasn't been marked this scene. Pair with `priority` to hard-gate callback vs cold-intro fragments. See §7. |

> Selector keys are linted: `npm run text:lint` flags any `when:` key that isn't a registered dimension, a `<dim>Min/<dim>Max` range, an engine-structural key, or a declared global — so typos like `coruption` are caught. Free-form `ctx.globals` keys are declared in `dimensions/gameSelectors.js` via `registerSelectors(...)`.

### Student roster + voice cheat-sheet

| id | Name | Archetype | Body | Voice in one line |
|---|---|---|---|---|
| 0 | Brittany | cheerleader | pear | Competitor reframing gain as winning; "I'm keeping score." |
| 1 | Madeline | bookworm | straight | Academic self-study; datasets, hypotheses; "I am the result." |
| 2 | Kylie | influencer | hourglass | Everything is content; brand, engagement, "no filter. Just me." |
| 3 | Serena | athlete | athletic | Split-times and discipline redirected; "New event. No weight class." |
| 4 | Fiona | artsy | straight | Sees herself as composition/canvas; reverent, unhurried. |
| 5 | Destiny | gamer | apple | Dry gamer idiom; builds, patch notes, "new high score." |
| 6 | Tiffany | sorority | hourglass | Bubbly chapter-president; "More is more, babe." |
| 7 | Priya | overachiever | straight | KPIs and frameworks; gain as overperformance. |
| 8 | Maya | quiet | pear | Few words, all load-bearing; "More." / "Home." |
| 9 | Chloe | transfer | apple | Dry Dublin wit; American portions as field research; "my mam will have words." |
| 10 | Reneé | culinary | rotund | Chef's sensory vocabulary; body as kitchen/recipe. |
| 11 | Kaylee | nursing | fertility_goddess | Clinical warmth turned on herself; "aggressive self-care." |
| 12 | Nadia | psych | voluptuous | Analyst watching you watch her; names the dynamic out loud. |
| 13 | Daisy | eced | mom_bod | Southern warmth, endearments; "bless it", feeding as kindness. |
| 14 | Mary Jane | farm_girl | hourglass | Country abundance; harvest/hay-scale imagery. |
| 15 | Lilith | predator | hourglass | Sparse, unsettling, amused; never explains; "Soon." |
| 16 | Sophia | pharmacy_grad | pear | Anxious precision; wellness-research framing, double-checked numbers. |
| 17 | Indiana Bones | explorer | straight | Roguish archaeology bravado; everything is an expedition. |

## 4. Per-girl persona conventions

- Persona variants live in a dedicated `personas.js` next to the scene (see `scenes/weighIn/personas.js`), registered into the SAME slot keys — they extend the shared pool, they don't replace it. Prefer **`definePersona`** (see `PERSONAS.md`) over hand-written `registerModuleVariants` for new casts.
- Key on `characterId` (the portable alias of `studentId`) + `attitude` + wide `stageMin/stageMax` ranges so several lines co-pool, and set `weight: 4` so the character's own voice dominates without silencing shared fragments.
- **Dialogue is sacred:** when migrating handwritten lines, keep quoted speech verbatim — the voice lives in the quotes. Narration around quotes may be genericized.
- Aim for ≥2 dialogue beats per character per attitude tier in any slot that carries personality.
- **The full how-to for authoring a cast is `PERSONAS.md`.**

## 5. Authoring a new scene (checklist)

1. New file under `src/textEngine/scenes/` (or a folder for multi-file scenes). Register scene-local modules at import time; export template constants + a `renderX()` wrapper. Namespace keys (`wi.*`, `enc.*`, `<feature>.*`).
2. Add the file to `src/textEngine/scenes/index.js` (the barrel — lint and DebugPanel sweep it).
3. Every pool: a `when: {}` wildcard variant (lint errors otherwise), ≥3 wildcard texts, one grammar shape, a shape comment.
4. Decide which axes the scene should react to (stage? bodyType? mood? hunger? per-girl?) and write keyed variants for the top 2-3 axes minimum.
5. `npm run text:lint` — must be clean for your keys. Then `npm run lint`.
6. Eyeball renders: DebugPanel sweep buttons, or `node --input-type=module -e "import './src/textEngine/scenes/index.js'; import { createContext, render } from './src/textEngine/engine.js'; ..."`.

## 6. Anti-patterns

- **Monolith variant** — a paragraph as `text`. Decompose. (Lint error in pools.)
- **Missing wildcard** — module goes silent/crashes coverage in unforeseen states. (Lint error in pools.)
- **Shape mixing** — a full sentence inside a participle-clause pool mangles every skeleton downstream.
- **Slot overreach** — a `wi.bodyClause` that also describes her face does the neighbor slot's job; combined output reads twice-described.
- **Tone-loaded generics** — wildcard fragments with strong affect undercut mood/withdrawal-keyed contexts.
- **Re-registering a key** — overwrites silently in prod (dev warns). Check the namespace before naming.
- **Paraphrasing mined dialogue** — kills the character voice that playtesters already know.
- **`gameHelpers.rnd` vs `pick`** — `rnd(a,b)` is an int range, `pick(arr)` picks from an array. Never mix.
- **Anything in the TUNING.md Style Ledger** — banned constructions discovered through live tuning ("Statement. That is X.", knowing-narrator winks, gain-excuse lines below stage 2, double-described phenomena, pace/verb contradictions…). The ledger grows; check it before writing.

## 7. Engine runtime features

These are properties of the resolver you author *against*. All are opt-in via `createContext`.

- **Pronouns & agreement** — never hard-code "she/her". Use `{they} {them} {their} {theirs} {themself}` (+ capitalized `{They}…`), `{verb:lemma}` ("strains"/"strain"), and `{plural:noun}`. They agree with `subject.pronouns` (`'she'|'he'|'they'|'it'` or a custom pack), or plural when `ctx.group` has >1. Default pack is `she`, so existing single-cast content is unaffected. Set the default with `setDefaultPronoun(key)`.
- **Seeded / reproducible renders** — `createContext({ seed })` (number or string) makes a *fresh* context render deterministically (saves, replays, tests). A reused context keeps advancing, so repeated renders still vary.
- **Anti-repetition** — `createContext({ history })` (pass `true` for a fresh buffer, or a shared `Map` across a session) biases away from lines just shown. Intra-render dedup is automatic (a pool used twice in one sentence won't echo itself). It's soft, so small pools still emit.
- **Scene memory (cohesion)** — `createContext({ scene })` (pass `true` or a shared `Set` across a render sequence). A beat marks tags via the module opt `{ marks: 'belly' }` once it emits; fragments gate on `when:{ saidBefore: 'belly' }` (callback) or `when:{ notYet: 'belly' }` (cold intro). Pair memory-keyed variants with `priority: 1` to hard-gate them over the wildcard.
- **Dimensions are registered, not hard-coded** — the selector model lives in `dimensions/weightGain.js` (`registerDimensions`). The engine core imports nothing from `../gameData`. Any registered dimension automatically gets `<name>Min/<name>Max` range selectors. A different game ships its own pack; see `index.js` for the core/domain boundary and `PERSONAS.md` for authoring a cast.
- **Tooling** — `node scripts/scaffoldScene.mjs <key>` stubs a new scene; `engine.d.ts` gives editor autocomplete; `node scripts/textEngineSmoke.mjs` and `node scripts/exportProof.mjs` assert the runtime guarantees above.
