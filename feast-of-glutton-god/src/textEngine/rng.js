// ═══════════════════════════════════════════════════════════════
// RNG — a tiny, zero-dependency seedable PRNG for deterministic renders.
// makeRng(seed) returns a stateful () => float in [0,1). A context built
// with a seed (createContext({ seed })) carries one of these so a *fresh*
// context with the same seed reproduces the exact render sequence — enabling
// saves/replays and deterministic tests — while a reused context keeps
// advancing (so repeated renders still vary).
// ═══════════════════════════════════════════════════════════════

// FNV-1a string hash → 32-bit seed, so string seeds ("week6-madeline") work.
function hashStr(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// mulberry32 — fast, decent-quality 32-bit PRNG.
export function makeRng(seed) {
  let a = typeof seed === 'string' ? hashStr(seed) : (Number(seed) >>> 0);
  if (a === 0) a = 0x9e3779b9; // avoid the degenerate all-zero state
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── recency memory ────────────────────────────────────────────
// A per-pool ring buffer of recently emitted final strings. The engine uses
// it to bias away from lines a player just saw (anti-repetition). Pass an
// instance as createContext({ history: true }) to persist across renders.

export function createHistory() { return new Map(); }

export function recordHistory(map, key, text, cap = 4) {
  if (!map || !key || !text) return;
  let arr = map.get(key);
  if (!arr) { arr = []; map.set(key, arr); }
  // de-dupe so the window holds the last `cap` *distinct* lines
  const i = arr.indexOf(text);
  if (i !== -1) arr.splice(i, 1);
  arr.push(text);
  while (arr.length > cap) arr.shift();
}
