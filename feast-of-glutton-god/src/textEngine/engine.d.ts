// Type definitions for the modular text engine (authored in plain JS).
// Gives editors autocomplete for render/createContext, variant shapes, and
// the dimension/selector APIs. Not a compile step — purely for tooling.

/** A game character/entity. The engine only reads it; shape is game-defined. */
export interface Subject {
  name?: string;
  lbs?: number;
  /** 'she' | 'he' | 'they' | 'it' or a custom pronoun pack. Defaults to the
   *  configured default (see setDefaultPronoun). */
  pronouns?: PronounKey | PronounPack;
  gender?: PronounKey;
  [k: string]: unknown;
}

export type PronounKey = 'she' | 'he' | 'they' | 'it';
export interface PronounPack {
  subj: string; obj: string; pos: string; posPro: string; refl: string; plural: boolean;
}

/** Selector conditions. Keys are dimensions (stage, attitude, mood, bodyType…),
 *  their <name>Min/<name>Max range forms, engine-structural keys (season, skill,
 *  weekMin/Max, saidBefore, notYet), or declared globals. Empty {} = wildcard. */
export interface WhenClause { [selector: string]: unknown; }

export type VariantText =
  | string
  | ((ctx: Context) => string)
  | Array<string | ((ctx: Context) => string)>;

export interface Variant {
  when?: WhenClause;
  /** Hard gate in pool mode; score tie-breaker in best mode. */
  priority?: number;
  /** Relative share within its match group. */
  weight?: number;
  text: VariantText;
}

export interface ModuleOpts {
  /** 'best' (most-specific wins) or 'pool' (all matches RNG-eligible). */
  select?: 'best' | 'pool';
  /** Specificity steepness in pool mode (default 3). */
  poolBase?: number;
  /** Scene-memory tags marked when this module emits (cohesion). */
  marks?: string | string[];
}

export interface Context {
  subject: Subject | null;
  ref: Subject | null;
  group: Subject[] | null;
  week: number;
  season: string;
  skillEffects: Record<string, unknown>;
  globals: Record<string, unknown>;
  rng: () => number;
  history: Map<string, string[]> | null;
  scene: Set<string> | null;
  /** Derived selector dimensions. */
  d: Record<string, unknown>;
}

export interface CreateContextInput {
  subject?: Subject | null;
  ref?: Subject | null;
  group?: Subject[] | null;
  week?: number;
  season?: string;
  skillEffects?: Record<string, unknown>;
  globals?: Record<string, unknown>;
  /** Seed (number|string) for reproducible renders from a fresh context. */
  seed?: number | string;
  rng?: () => number;
  /** true for a fresh recency buffer, or a shared Map to persist across renders. */
  history?: boolean | Map<string, string[]>;
  /** true for a fresh scene tag set, or a shared Set across a render sequence. */
  scene?: boolean | Set<string>;
}

export interface RenderOpts {
  /** Collect { key, text, leaf, depth } per resolved slot (dev tooling). */
  trace?: Array<{ key: string; text: string; leaf: boolean; depth: number }>;
  /** Skip the smoothing pass. */
  noSmooth?: boolean;
}

export interface DimensionDef {
  derive: (subject: Subject, env: { ref: Subject | null; skillEffects: Record<string, unknown> }) => unknown;
  /** Documents that <name>Min/<name>Max selectors are meaningful. */
  range?: boolean;
}

// ── core API ──────────────────────────────────────────────────
export function render(template: string, ctx: Context, opts?: RenderOpts): string;
export function createContext(raw?: CreateContextInput): Context;

export function registerModule(key: string, variants: Variant | Variant[], opts?: ModuleOpts): void;
export function registerPool(key: string, variants: Variant | Variant[], opts?: ModuleOpts): void;
export function registerModuleVariants(key: string, variants: Variant | Variant[]): void;
export function hasModule(key: string): boolean;

export function registerDimensions(schema: Record<string, DimensionDef>): void;
export function dimOf(subject: Subject, name: string, env?: object): unknown;
export function registerSelectors(...names: Array<string | string[]>): void;

// ── rng / utilities ───────────────────────────────────────────
export function makeRng(seed: number | string): () => number;
export function createHistory(): Map<string, string[]>;
export function pick<T>(arr: T[]): T;
export function weightedPick<T>(entries: Array<{ item: T; w: number }>): T;
export function getSeason(week: number): string;
export function relSize(subject: Subject, ref: Subject): string | null;
export function stageBucket(stageId: number): string;
export function groupStageBucket(group: Subject[]): string;
export const STAGE_KEYS: string[];

// ── introspection (tooling only) ──────────────────────────────
export function _registryEntries(): Array<[string, Variant[]]>;
export function _moduleOpts(key: string): ModuleOpts;
export function _knownSelectors(): Set<string>;
export function _dimensionNames(): string[];
export function _dimensionDefs(): Array<[string, DimensionDef]>;
