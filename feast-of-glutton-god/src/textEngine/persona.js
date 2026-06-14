// ═══════════════════════════════════════════════════════════════
// PERSONA FRAMEWORK
// A character's *voice* — how they react to gaining — is unique to a game, so
// the engine ships the machinery, not the cast. definePersona() formalizes the
// registerModuleVariants pattern the weigh-in/talk scenes use by hand: it
// attaches weighted, character-keyed variants to shared fragment slots so a
// girl's own lines dominate without silencing the shared pools.
//
//   definePersona({
//     id: 2,                       // matches characterId / numericId
//     weight: 4,                   // share vs shared fragments (default 4)
//     when: { stageMin: 2 },       // optional gate applied to every line
//     voice: {
//       'enc.owned': [             // plain strings → one pooled variant
//         'No filter. Just me, and more of me every week.',
//         'This is the feast now. This is the gospel.',
//       ],
//       'wi.reply': [              // objects → their own gated variants
//         { when: { attitude: [2] }, text: ['Weigh me. I want the number.'] },
//       ],
//     },
//   });
//
// See PERSONAS.md for the full authoring guide.
// ═══════════════════════════════════════════════════════════════
import { registerModuleVariants } from './engine.js';

export function definePersona(spec = {}) {
  const { id, weight = 4, when: baseWhen = {}, voice = {} } = spec;
  if (id == null) { throw new Error('definePersona: spec.id is required'); }

  for (const [slot, raw] of Object.entries(voice)) {
    const entries = Array.isArray(raw) ? raw : [raw];
    const variants = [];
    const plain = [];

    for (const e of entries) {
      if (typeof e === 'string' || typeof e === 'function') {
        plain.push(e);
      } else if (e && typeof e === 'object') {
        variants.push({
          weight,
          ...e,
          when: { characterId: id, ...baseWhen, ...(e.when || {}) },
        });
      }
    }
    if (plain.length) {
      variants.push({ when: { characterId: id, ...baseWhen }, weight, text: plain });
    }
    if (variants.length) registerModuleVariants(slot, variants);
  }
}
