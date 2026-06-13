// ═══════════════════════════════════════════════════════════════
// MODULAR TEXT ENGINE — core resolver
// Templates contain slots like {module}, {module:arg}, {module|cap}.
// Modules are registered variant lists; each variant declares `when`
// selector conditions and the engine picks the most specific match.
// See docs/modular-text-system.md for the full reference.
//
// The core is game-agnostic: it imports nothing from ../gameData. The set of
// selector dimensions (ctx.d.*) is supplied at init via registerDimensions().
// The default weight-gain pack lives in dimensions/weightGain.js.
// ═══════════════════════════════════════════════════════════════

import { makeRng, createHistory, recordHistory } from './rng.js';

const DEV = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;
const warn = (...args) => { if (DEV) console.warn('[textEngine]', ...args); };

// ── helpers ───────────────────────────────────────────────────

// Active RNG for the current render. render() points this at the context's
// (optionally seeded) generator for the duration of the call, then restores
// it — so deep pick()/weightedPick() calls all draw from one stream without
// having to thread an rng argument through every module function.
let _rng = Math.random;

export function pick(arr) {
  return arr[Math.floor(_rng() * arr.length)];
}

// weightedPick([{item, w}, ...]) — picks an item with probability ∝ w.
export function weightedPick(entries) {
  let total = 0;
  for (const e of entries) total += e.w;
  if (total <= 0) return entries.length ? entries[0].item : undefined;
  let roll = _rng() * total;
  for (const e of entries) {
    roll -= e.w;
    if (roll <= 0) return e.item;
  }
  return entries[entries.length - 1].item;
}

const SEASONS = ["fall", "winter", "spring", "summer"];
export function getSeason(week) {
  return SEASONS[Math.floor((Math.max(1, week || 1) - 1) / 4) % 4];
}

// Relative size of subject vs a reference character, by lbs ratio.
export function relSize(subject, ref) {
  if (!subject || !ref || !ref.lbs) return null;
  const r = subject.lbs / ref.lbs;
  if (r < 0.6) return "much_smaller";
  if (r < 0.85) return "smaller";
  if (r <= 1.18) return "similar";
  if (r <= 1.67) return "larger";
  return "much_larger";
}

// Canonical weight-stage keys — one per WEIGHT_STAGES id (see stages.js).
// Slight(0) Slim(1) Soft(2) Chubby(3) Plump(4) Heavy(5) Fat(6)
// Very Fat(7) Enormous(8) Colossal(9) Blob(10) Leviathan(11)
export const STAGE_KEYS = [
  "slight", "slim", "soft", "chubby", "plump", "heavy",
  "fat", "veryFat", "enormous", "colossal", "blob", "leviathan",
];

export function stageBucket(stageId) {
  const id = Math.min(Math.max(0, stageId ?? 0), STAGE_KEYS.length - 1);
  return STAGE_KEYS[id];
}

export function groupStageBucket(group) {
  if (!group || !group.length) return "soft";
  const avg = group.reduce((a, s) => a + (dimOf(s, 'stage') ?? 0), 0) / group.length;
  return stageBucket(Math.round(avg));
}

// ── dimension registry ────────────────────────────────────────
// Selector dimensions (the values matched by `when` clauses, exposed on
// ctx.d) are registered, not hardcoded — so the engine stays game-agnostic
// and a host game supplies its own state model.
//
// registerDimensions(schema): schema is { name: { derive(subject, env), range? } }.
//   derive(subject, env) — env = { ref, skillEffects }. Returns the dimension
//     value (enum/number/boolean/null) read by `when: { name: ... }`.
//   range:true — documents that <name>Min / <name>Max selectors are meaningful
//     (the generic Min/Max handler in evalWhen works for any dimension regardless).
//
// See dimensions/weightGain.js for the default (weight-gain) pack.

const DIMENSIONS = new Map();

export function registerDimensions(schema) {
  for (const [name, def] of Object.entries(schema || {})) {
    if (typeof def?.derive !== 'function') { warn(`dimension "${name}" missing derive()`); continue; }
    DIMENSIONS.set(name, def);
  }
}

// Run a single registered dimension's derive — used by helpers such as
// groupStageBucket. Returns undefined when the dimension isn't registered.
export function dimOf(subject, name, env = {}) {
  const def = DIMENSIONS.get(name);
  return def ? def.derive(subject, env) : undefined;
}

// Introspection for the lint harness / type generation only.
export function _dimensionNames() { return [...DIMENSIONS.keys()]; }
export function _dimensionDefs() { return [...DIMENSIONS.entries()]; }

// ── context ───────────────────────────────────────────────────

function deriveFor(subject, ref, skillEffects) {
  if (!subject) return {};
  const env = { ref, skillEffects: skillEffects || {} };
  const d = {};
  for (const [name, def] of DIMENSIONS) d[name] = def.derive(subject, env);
  return d;
}

// createContext(raw) — normalizes inputs and derives the selector
// dimensions once. `subject` is the focal character; `ref` is the
// reference character for relative comparisons (size etc.).
// `seed` (number|string, optional) makes renders from a fresh context
// reproducible. `history` (true | a Map from createHistory) opts into
// cross-render anti-repetition so a player rarely sees the same line twice
// in a row; thread the same context (or its .history) through a session.
export function createContext(raw = {}) {
  const { subject = null, ref = null, group = null, week = 1, skillEffects = {}, globals = {} } = raw;
  return {
    subject, ref, group,
    week,
    season: raw.season || getSeason(week),
    skillEffects, globals,
    rng: raw.rng || (raw.seed != null ? makeRng(raw.seed) : Math.random),
    history: raw.history
      ? (raw.history instanceof Map ? raw.history : createHistory())
      : null,
    // `scene` is a tag set shared across a sequence of renders (intro →
    // reaction …). Beats mark tags (module opt `marks`); fragments gate on
    // them with when:{ saidBefore } / when:{ notYet } for cohesion and
    // don't-repeat-this-beat. Pass true for a fresh set, or an existing Set.
    scene: raw.scene
      ? (raw.scene instanceof Set ? raw.scene : new Set())
      : null,
    d: deriveFor(subject, ref, skillEffects),
  };
}

// Retarget a context onto another character (used by the :ref / :group args
// so {word.size:ref} describes the reference character instead of subject).
function retarget(ctx, who) {
  if (who === "ref" && ctx.ref) {
    return { ...ctx, subject: ctx.ref, ref: ctx.subject, d: deriveFor(ctx.ref, ctx.subject, ctx.skillEffects) };
  }
  if (who === "group" && ctx.group && ctx.group.length) {
    const proxy = ctx.group[0];
    return { ...ctx, subject: proxy, d: deriveFor(proxy, ctx.ref, ctx.skillEffects) };
  }
  return ctx;
}

// ── module registry ───────────────────────────────────────────

const REGISTRY = new Map();
const MODULE_OPTS = new Map();

// registerModule(key, variants, opts)
// variant: { when:{...}, priority?:int, weight?:number, text: string | fn(ctx) | array of those }
// opts.select: 'best' (default — most specific match wins, ties pool) or
//              'pool' (every matching variant is RNG-eligible, weighted by
//              specificity: w = (variant.weight ?? 1) * poolBase**score).
// opts.poolBase: steepness of the specificity weighting in pool mode (default 3).
export function registerModule(key, variants, opts = {}) {
  if (key === "join") { warn(`"join" is a reserved meta-slot and cannot be a module key`); return; }
  if (REGISTRY.has(key)) warn(`module "${key}" re-registered (overwriting)`);
  REGISTRY.set(key, Array.isArray(variants) ? variants : [variants]);
  MODULE_OPTS.set(key, opts);
}

// registerPool — registerModule in 'pool' selection mode.
// This is the default for all new content (see src/textEngine/AUTHORING.md):
// generic and specific variants stay co-eligible, with specific weighted heavier.
export function registerPool(key, variants, opts = {}) {
  registerModule(key, variants, { select: 'pool', ...opts });
}

/** Prepend higher-priority variants without replacing the base module pool. */
export function registerModuleVariants(key, variants) {
  const extra = Array.isArray(variants) ? variants : [variants];
  const existing = REGISTRY.get(key) || [];
  REGISTRY.set(key, [...extra, ...existing]);
}

export function hasModule(key) { return REGISTRY.has(key); }

// Structural selector keys the engine handles itself (not subject-derived
// dimensions). The lint harness unions this with the registered dimension
// names to validate `when:` clauses. KEEP IN SYNC with evalWhen's switch.
const KNOWN_SELECTORS = new Set([
  // engine-structural
  "season", "skill", "weekMin", "weekMax", "saidBefore", "notYet",
  "studentId", "bigScale", "limitRemoved",
  // stage / week ranges (stage is also a dimension)
  "stageMin", "stageMax",
  // game globals consulted by evalWhen (a different game would replace these)
  "devourMin", "devourMax", "fullnessMin", "fullnessMax",
  "hungerTierMin", "hungerTierMax", "addictionLevelMin", "addictionLevelMax",
  "fixationTierMin", "fixationTierMax", "obsessionTierMin", "obsessionTierMax",
  "dependenceTierMin", "dependenceTierMax", "shameTierMin", "shameTierMax",
  "equippedWaist", "bodyState", "campusFattening", "campusTierMin", "campusTierMax",
  "weightBand", "nodeId", "targetType", "role", "deviceId", "modeId",
  "isMalfunction", "malfunctionTier", "hasAttachment", "furnitureComfortLow",
  "equippedHead", "gainLbsMin", "equippedCountMin",
  "deviceDependenceTierMin", "deviceDependenceTier", "deviceDependenceMin",
  "growthZone", "startStageMin", "startStageMax", "endStageMin", "endStageMax",
  "endStage", "stagesJumpedMin",
]);
// Games declare their free-form ctx.globals selector keys (brand, streamVoice…)
// so the linter accepts them while still flagging genuine typos.
const EXTRA_SELECTORS = new Set();
export function registerSelectors(...names) {
  for (const n of names.flat()) if (n) EXTRA_SELECTORS.add(n);
}
export function _knownSelectors() { return new Set([...KNOWN_SELECTORS, ...EXTRA_SELECTORS]); }

// Introspection for the lint harness / DebugPanel only — not for game code.
export function _registryEntries() { return [...REGISTRY.entries()]; }
export function _moduleOpts(key) { return MODULE_OPTS.get(key) || {}; }

// ── selector resolution ───────────────────────────────────────

// scene-memory predicate helper: want=true → every tag present; want=false →
// every tag absent. A null scene reads as "nothing said yet".
function sceneAll(scene, v, want) {
  const tags = Array.isArray(v) ? v : [v];
  for (const t of tags) if (!!(scene && scene.has(t)) !== want) return false;
  return true;
}

// Returns {match:boolean, score:number} for one variant's `when` clause.
function evalWhen(when, ctx) {
  if (!when || Object.keys(when).length === 0) return { match: true, score: 0 };
  const d = ctx.d || {};
  let score = 0;
  let rangeCounted = false;

  for (const [k, v] of Object.entries(when)) {
    let ok;
    switch (k) {
      case "stageMin": ok = d.stage != null && d.stage >= v; break;
      case "stageMax": ok = d.stage != null && d.stage <= v; break;
      case "season": ok = Array.isArray(v) ? v.includes(ctx.season) : ctx.season === v; break;
      case "skill": ok = !!(ctx.skillEffects && ctx.skillEffects[v]); break;
      case "weekMin": ok = ctx.week >= v; break;
      case "weekMax": ok = ctx.week <= v; break;
      case "devourMin": ok = (d.devourCount ?? 0) >= v; break;
      case "devourMax": ok = (d.devourCount ?? 0) <= v; break;
      case "fullnessMin": ok = (d.fullnessRatio ?? 0) >= v; break;
      case "fullnessMax": ok = (d.fullnessRatio ?? 0) <= v; break;
      case "hungerTierMin": ok = (d.hungerTier ?? 0) >= v; break;
      case "hungerTierMax": ok = (d.hungerTier ?? 0) <= v; break;
      case "addictionLevelMin": ok = (d.addictionLevel ?? 0) >= v; break;
      case "addictionLevelMax": ok = (d.addictionLevel ?? 0) <= v; break;
      case "fixationTierMin": ok = (d.fixationTier ?? 0) >= v; break;
      case "fixationTierMax": ok = (d.fixationTier ?? 0) <= v; break;
      case "obsessionTierMin": ok = (d.obsessionTier ?? 0) >= v; break;
      case "obsessionTierMax": ok = (d.obsessionTier ?? 0) <= v; break;
      case "dependenceTierMin": ok = (d.dependenceTier ?? 0) >= v; break;
      case "dependenceTierMax": ok = (d.dependenceTier ?? 0) <= v; break;
      case "shameTierMin": ok = (d.shameTier ?? 0) >= v; break;
      case "shameTierMax": ok = (d.shameTier ?? 0) <= v; break;
      case "equippedWaist": ok = d.equippedWaist === v; break;
      case "bodyState": ok = d.bodyState === v; break;
      case "campusFattening": ok = !!ctx.globals?.campusFattening === !!v; break;
      case "campusTierMin": ok = (ctx.globals?.campusTier ?? 0) >= v; break;
      case "campusTierMax": ok = (ctx.globals?.campusTier ?? 0) <= v; break;
      case "weightBand": ok = ctx.globals?.weightBand === v; break;
      case "nodeId": ok = ctx.globals?.nodeId === v; break;
      case "targetType": ok = ctx.globals?.targetType === v; break;
      case "role": ok = ctx.globals?.role === v; break;
      case "deviceId": ok = ctx.globals?.deviceId === v; break;
      case "modeId": ok = ctx.globals?.modeId === v; break;
      case "isMalfunction": ok = !!ctx.globals?.isMalfunction === !!v; break;
      case "malfunctionTier": ok = ctx.globals?.malfunctionTier === v; break;
      case "hasAttachment": ok = ctx.globals?.hasAttachment === v; break;
      case "furnitureComfortLow": ok = !!ctx.globals?.furnitureComfortLow === !!v; break;
      case "equippedHead": ok = d.equippedHead === v || ctx.globals?.equippedHead === v; break;
      case "gainLbsMin": ok = (ctx.globals?.gainLbs ?? 0) >= v; break;
      case "equippedCountMin": ok = (ctx.globals?.equippedCountMin ?? 0) >= v; break;
      case "deviceDependenceTierMin": ok = (ctx.globals?.deviceDependenceTier ?? 0) >= v; break;
      case "deviceDependenceTier": ok = (ctx.globals?.deviceDependenceTier ?? 0) === v; break;
      case "deviceDependenceMin": ok = (ctx.globals?.deviceDependence ?? 0) >= v; break;
      case "growthZone": ok = ctx.globals?.growthZone === v; break;
      case "startStageMin": ok = (ctx.globals?.startStage ?? d.stage ?? 0) >= v; break;
      case "startStageMax": ok = (ctx.globals?.startStage ?? d.stage ?? 0) <= v; break;
      case "endStageMin": ok = (ctx.globals?.endStage ?? d.stage ?? 0) >= v; break;
      case "endStageMax": ok = (ctx.globals?.endStage ?? d.stage ?? 0) <= v; break;
      case "endStage": ok = (ctx.globals?.endStage ?? d.stage) === v; break;
      case "stagesJumpedMin": ok = (ctx.globals?.stagesJumped ?? 0) >= v; break;
      case "limitRemoved": ok = !!ctx.subject?.limitRemoved === !!v; break;
      case "studentId": {
        const actual = d.studentId ?? ctx.globals?.studentId;
        ok = Array.isArray(v) ? v.includes(actual) : actual === v;
        break;
      }
      case "bigScale": ok = !!ctx.globals?.bigScale === !!v; break;
      // scene-memory predicates (cohesion / don't-repeat-this-beat):
      // saidBefore matches when every listed tag has been marked this scene;
      // notYet matches when none have.
      case "saidBefore": ok = sceneAll(ctx.scene, v, true); break;
      case "notYet": ok = sceneAll(ctx.scene, v, false); break;
      default: {
        // Generic <dim>Min / <dim>Max for any registered/global dimension not
        // special-cased above (e.g. attitudeMin). Strip the suffix, compare.
        if (k.endsWith("Min") && (d[k.slice(0, -3)] != null || ctx.globals?.[k.slice(0, -3)] != null)) {
          ok = (d[k.slice(0, -3)] ?? ctx.globals?.[k.slice(0, -3)] ?? 0) >= v;
        } else if (k.endsWith("Max") && (d[k.slice(0, -3)] != null || ctx.globals?.[k.slice(0, -3)] != null)) {
          ok = (d[k.slice(0, -3)] ?? ctx.globals?.[k.slice(0, -3)] ?? 0) <= v;
        } else {
          // dimension on ctx.d, else ctx.globals (network/campus device keys)
          const actual = d[k] ?? ctx.globals?.[k];
          ok = Array.isArray(v) ? v.includes(actual) : actual === v;
        }
      }
    }
    if (!ok) return { match: false, score: 0 };
    if (k === "stageMin" || k === "stageMax" || k === "weekMin" || k === "weekMax") {
      if (!rangeCounted) { score += 1; rangeCounted = true; }
    } else {
      score += 1;
    }
  }
  return { match: true, score };
}

function resolveChosen(variant, ctx) {
  const t = variant.text;
  const chosen = Array.isArray(t) ? pick(t) : t;
  return typeof chosen === "function" ? (chosen(ctx) ?? "") : (chosen ?? "");
}

function selectVariant(key, ctx) {
  const variants = REGISTRY.get(key);
  if (!variants) { warn(`unknown module "${key}"`); return ""; }
  const opts = MODULE_OPTS.get(key) || {};

  if (opts.select === 'pool') {
    // Pool mode: every matching variant is RNG-eligible, weighted toward
    // specificity. Priority is a hard gate here (the escape hatch for
    // deliberately suppressing everything below).
    const matches = [];
    let maxPriority = -Infinity;
    for (const variant of variants) {
      const { match, score } = evalWhen(variant.when, ctx);
      if (!match) continue;
      const priority = variant.priority || 0;
      if (priority > maxPriority) maxPriority = priority;
      matches.push({ variant, score, priority });
    }
    const eligible = matches.filter((m) => m.priority === maxPriority);
    if (!eligible.length) return "";
    const base = opts.poolBase ?? 3;
    const entries = eligible
      .map((m) => ({ item: m.variant, w: (m.variant.weight ?? 1) * Math.pow(base, m.score) }))
      .filter((e) => e.w > 0);
    if (!entries.length) return "";
    return resolveChosen(weightedPick(entries), ctx);
  }

  // 'best' mode (default): most specific match wins; priority breaks score
  // ties; texts of the surviving tied variants pool flat (weighted only if
  // an author sets variant.weight — otherwise identical to a uniform pick).
  let best = [], bestScore = -1, bestPriority = -Infinity;
  for (const variant of variants) {
    const { match, score } = evalWhen(variant.when, ctx);
    if (!match) continue;
    const priority = variant.priority || 0;
    if (score > bestScore || (score === bestScore && priority > bestPriority)) {
      best = [variant]; bestScore = score; bestPriority = priority;
    } else if (score === bestScore && priority === bestPriority) {
      best.push(variant);
    }
  }
  if (!best.length) return "";

  const entries = [];
  for (const variant of best) {
    const w = variant.weight ?? 1;
    if (w <= 0) continue;
    const t = variant.text;
    if (Array.isArray(t)) for (const text of t) entries.push({ item: text, w });
    else entries.push({ item: t, w });
  }
  if (!entries.length) return "";
  const chosen = weightedPick(entries);
  return typeof chosen === "function" ? (chosen(ctx) ?? "") : (chosen ?? "");
}

// ── filters ───────────────────────────────────────────────────

function applyFilters(text, filters) {
  let out = text;
  for (const f of filters) {
    if (f === "cap") out = out ? out.charAt(0).toUpperCase() + out.slice(1) : out;
    else if (f === "lower") out = out.toLowerCase();
    else if (f === "a") out = out ? (/^[aeiou]/i.test(out) ? "an " : "a ") + out : out;
    else if (f.startsWith("prefix:")) out = out ? f.slice(7) + out : out;
    else if (f.startsWith("suffix:")) out = out ? out + f.slice(7) : out;
    else warn(`unknown filter "${f}"`);
  }
  return out;
}

// ── template resolution ───────────────────────────────────────

// {name}, {name:arg}, {name|filter}, {name:arg|filter|filter:x}
const SLOT_RE = /\{([a-zA-Z][\w.]*)(?::([^|}]*))?((?:\|[^}]*)?)\}/g;
const ESCAPE_TOKEN = ""; // private-use char, never in prose

const MAX_DEPTH = 5;

// Identity-ish slots that don't make a fragment a composite: pronoun/agreement
// slots are surface inflection (like {subject.lbs}), so a pool of phrases that
// only vary by pronoun is still a leaf for tracing + anti-repetition purposes.
const IDENTITY_SLOTS = new Set([
  "they", "them", "their", "theirs", "themself",
  "They", "Them", "Their", "Theirs", "Themself",
  "verb", "plural",
]);

// ── anti-repetition memory ────────────────────────────────────
// `mem` rides through one render: mem.intra is a per-render Map(key → Set of
// lowercased leaf emissions); mem.history (optional, from ctx.history) is the
// cross-render ring buffer. recentSet() unions both so resolveSlot can retry a
// leaf fragment that would repeat a line just shown — killing both "soft
// frame … soft frame" inside one paragraph and the same line twice in a row.

function recentSet(mem, name) {
  const s = new Set(mem.intra.get(name));
  const h = mem.history && mem.history.get(name);
  if (h) for (const x of h) s.add(x);
  return s;
}

function recordUse(mem, name, low, leaf) {
  if (!leaf || !low) return;
  let s = mem.intra.get(name);
  if (!s) { s = new Set(); mem.intra.set(name, s); }
  s.add(low);
  if (mem.history) recordHistory(mem.history, name, low);
}

// Per-slot recursive resolution: nested slots inside a module's output
// resolve with the SLOT's context, so {char.desc:ref} keeps describing
// the ref all the way down into its {word.*} slots.
// Resolve one slot: pick the variant, recurse into its slots, and
// (when tracing) record { key, text, leaf, depth }. A "leaf" is a
// fragment whose raw variant text contained no further slots —
// the granularity the Dialogue Lab annotates at, and the granularity at
// which anti-repetition operates.
const REPEAT_TRIES = 6; // re-roll budget for a leaf colliding with recent output

function resolveSlot(name, slotCtx, depth, trace, mem) {
  const recent = mem ? recentSet(mem, name) : null;
  const maxTries = recent && recent.size ? REPEAT_TRIES : 1;
  let out = "", leaf = true;
  for (let t = 0; t < maxTries; t++) {
    const raw = String(selectVariant(name, slotCtx));
    // Leaf = no nested content slots. subject.* identity slots ({subject.lbs}
    // inside a sentence) don't make a fragment composite — the sentence is
    // still the natural annotation unit.
    leaf = true;
    SLOT_RE.lastIndex = 0;
    let m;
    while ((m = SLOT_RE.exec(raw))) {
      if (!m[1].startsWith("subject.") && !IDENTITY_SLOTS.has(m[1])) { leaf = false; break; }
    }
    out = resolveText(raw, slotCtx, depth + 1, trace, mem);
    const k = out.trim().toLowerCase();
    // Only retry leaf fragments that collide with a recent emission; bail
    // immediately for composites, empties, or first-time/non-colliding picks.
    if (!leaf || !k || !recent || !recent.has(k)) break;
  }
  const trimmed = out.trim();
  if (trimmed) {
    if (mem) recordUse(mem, name, trimmed.toLowerCase(), leaf);
    if (trace) trace.push({ key: name, text: trimmed, leaf, depth });
    // Beat-marking: once a slot actually emits, record its module's `marks`
    // tags into the shared scene so later fragments (this render or a later
    // one sharing the scene) can gate on saidBefore / notYet.
    const marks = MODULE_OPTS.get(name)?.marks;
    if (marks && slotCtx.scene) {
      for (const t of (Array.isArray(marks) ? marks : [marks])) slotCtx.scene.add(t);
    }
  }
  return out;
}

function resolveText(text, ctx, depth, trace, mem) {
  if (depth >= MAX_DEPTH) {
    SLOT_RE.lastIndex = 0;
    if (SLOT_RE.test(text)) {
      warn("max recursion depth reached; stripping unresolved slots");
      SLOT_RE.lastIndex = 0;
      text = text.replace(SLOT_RE, "");
    }
    return text;
  }
  SLOT_RE.lastIndex = 0;
  return text.replace(SLOT_RE, (_, name, arg, filterStr) => {
    const filters = filterStr ? filterStr.split("|").filter(Boolean) : [];

    // {join:a,b,c|...} — reserved meta-slot: resolve each listed module,
    // drop empties, and glue the survivors with commas + a final "and".
    // Pair with |prefix:/|suffix: to make the whole clause group optional.
    // (The arg slot carries the key list, so no :ref retargeting inside.)
    if (name === "join") {
      const parts = (arg || "")
        .split(",").map((k) => k.trim()).filter(Boolean)
        .map((k) => resolveSlot(k, ctx, depth, trace, mem).trim())
        .filter(Boolean);
      const out = parts.length <= 1 ? (parts[0] || "")
        : parts.length === 2 ? `${parts[0]} and ${parts[1]}`
        : `${parts.slice(0, -1).join(", ")}, and ${parts[parts.length - 1]}`;
      return applyFilters(out, filters);
    }

    let slotCtx = ctx;
    if (arg === "ref" || arg === "group") slotCtx = retarget(ctx, arg);
    else if (arg) slotCtx = { ...ctx, arg }; // pass-through arg for module fns
    return applyFilters(resolveSlot(name, slotCtx, depth, trace, mem), filters);
  });
}

function smooth(text) {
  return text
    .replace(/ {2,}/g, " ")            // collapse runs of spaces
    .replace(/ ([.,!?;:])/g, "$1")     // space before punctuation
    .replace(/\.{2,}/g, ".")           // ".." artifacts (preserve "…")
    .replace(/(^|[.!?] )([a-z])/g, (_, lead, ch) => lead + ch.toUpperCase())
    .trim();
}

// render(template, ctx, opts) — the single public entry point.
// Never throws: unknown modules emit "" with a dev warning.
// opts.trace: pass an array to collect { key, text, leaf, depth }
// for every slot resolved (dev tooling — see DialogueLab).
// Draws from ctx.rng (seeded if the context was built with a seed) and runs
// anti-repetition over ctx.history when present.
export function render(template, ctx, opts = {}) {
  const prevRng = _rng;
  _rng = (ctx && ctx.rng) || Math.random;
  const mem = { intra: new Map(), history: (ctx && ctx.history) || null };
  try {
    let text = String(template).replace(/\{\{/g, ESCAPE_TOKEN);
    text = resolveText(text, ctx, 0, opts.trace || null, mem);
    text = text.replace(new RegExp(ESCAPE_TOKEN, "g"), "{");
    return opts.noSmooth ? text : smooth(text);
  } finally {
    _rng = prevRng;
  }
}

// Re-export RNG/history helpers so callers can build seeded contexts and
// session histories without reaching into the internal module.
export { makeRng, createHistory } from './rng.js';
