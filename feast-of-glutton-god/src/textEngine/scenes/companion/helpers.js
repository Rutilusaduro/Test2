import { registerPool } from '../../engine.js';

/** Register setup / beat / coda sub-pools + composed milestone skeleton. */
export function registerCompanionMilestone(companionId, tier, { setup, beat, coda }) {
  const base = `companion.${companionId}.t${tier}`;
  registerPool(`${base}.setup`, [{ when: {}, text: setup }]);
  registerPool(`${base}.beat`, [{ when: {}, text: beat }]);
  registerPool(`${base}.coda`, [{ when: {}, text: coda }]);
  registerPool(base, [{
    when: {},
    text: [`{${base}.setup} {${base}.beat} {${base}.coda}`],
  }]);
}
