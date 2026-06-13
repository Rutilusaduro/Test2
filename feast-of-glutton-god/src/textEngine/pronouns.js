// ═══════════════════════════════════════════════════════════════
// PRONOUN & AGREEMENT ENGINE
// Derives pronouns from the subject (or group) instead of baking "she/her"
// into prose, so the same content reads correctly for she / he / they / it
// casts and for plural groups. This is what lets the engine leave the
// single-female-cast assumption behind when it's exported.
//
//   {they} {them} {their} {theirs} {themself}   (+ capitalized {They} …)
//   {verb:strain}   → "strains" (sing.) / "strain" (plural/they/group)
//   {plural:seam}   → "seam" (sing.) / "seams" (plural/group)
//
// Pronouns come from subject.pronouns (or subject.gender): 'she' | 'he' |
// 'they' | 'it', or a custom { subj,obj,pos,posPro,refl,plural } object. A
// ctx.group of >1 forces plural agreement. With nothing specified the default
// pack is used (configurable via setDefaultPronoun; 'she' out of the box for
// this game, so already-written all-female content renders identically).
// ═══════════════════════════════════════════════════════════════
import { registerModule } from './engine.js';

const PACKS = {
  she:  { subj: 'she',  obj: 'her',  pos: 'her',   posPro: 'hers',   refl: 'herself',  plural: false },
  he:   { subj: 'he',   obj: 'him',  pos: 'his',   posPro: 'his',    refl: 'himself',  plural: false },
  they: { subj: 'they', obj: 'them', pos: 'their', posPro: 'theirs', refl: 'themself', plural: true  },
  it:   { subj: 'it',   obj: 'it',   pos: 'its',   posPro: 'its',    refl: 'itself',   plural: false },
};
// A real group of people: plural agreement and "themselves".
const GROUP_PACK = { subj: 'they', obj: 'them', pos: 'their', posPro: 'theirs', refl: 'themselves', plural: true };

let DEFAULT_KEY = 'she';
export function setDefaultPronoun(key) { if (PACKS[key]) DEFAULT_KEY = key; }

function packForCtx(ctx) {
  if (ctx?.group && ctx.group.length > 1) return GROUP_PACK;
  const p = ctx?.subject && (ctx.subject.pronouns || ctx.subject.gender);
  if (typeof p === 'string' && PACKS[p]) return PACKS[p];
  if (p && typeof p === 'object') return { ...PACKS.they, ...p };
  return PACKS[DEFAULT_KEY];
}

// ── verb / noun agreement ─────────────────────────────────────

const IRREGULAR = { be: 'is', have: 'has', do: 'does', go: 'goes', say: 'says' };

function conjugate(lemma, plural) {
  if (!lemma) return '';
  if (plural) return lemma;                       // base form: "they strain"
  if (IRREGULAR[lemma]) return IRREGULAR[lemma];
  if (/(s|sh|ch|x|z)$/.test(lemma)) return lemma + 'es';
  if (/[^aeiou]y$/.test(lemma)) return lemma.slice(0, -1) + 'ies';
  if (/[^aeiou]o$/.test(lemma)) return lemma + 'es';
  return lemma + 's';
}

function pluralizeNoun(word, plural) {
  if (!plural || !word) return word;
  if (/(s|sh|ch|x|z)$/.test(word)) return word + 'es';
  if (/[^aeiou]y$/.test(word)) return word.slice(0, -1) + 'ies';
  return word + 's';
}

// ── registration ──────────────────────────────────────────────

const FORMS = { they: 'subj', them: 'obj', their: 'pos', theirs: 'posPro', themself: 'refl' };
for (const [slot, field] of Object.entries(FORMS)) {
  const lower = (ctx) => packForCtx(ctx)[field];
  registerModule(slot, [{ when: {}, text: [lower] }]);
  const Cap = slot[0].toUpperCase() + slot.slice(1);
  registerModule(Cap, [{ when: {}, text: [(ctx) => {
    const v = lower(ctx);
    return v ? v[0].toUpperCase() + v.slice(1) : v;
  }] }]);
}

// {verb:lemma} / {plural:noun} read the slot arg (ctx.arg) and agree with the
// subject's number.
registerModule('verb', [{ when: {}, text: [(ctx) => conjugate(ctx.arg, packForCtx(ctx).plural)] }]);
registerModule('plural', [{ when: {}, text: [(ctx) => pluralizeNoun(ctx.arg, packForCtx(ctx).plural)] }]);
