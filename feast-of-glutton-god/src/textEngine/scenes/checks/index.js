/**
 * Check crit/fumble prose pools — barrel import registers all pools at startup.
 */
import './statCrit.js';
import './statFumble.js';
import './skillCrit.js';
import './skillFumble.js';
import './combatPools.js';

import { createContext, render } from '../../engine.js';
import { toTextContext } from '../../../gameData/skillChecks.js';
import '../../modules.js';
import '../../lexicon.js';

/**
 * Render prose for a skill check or combat roll result.
 * @param {object} checkResult - From resolveSkillCheck / resolveCombatSave / attack roll
 * @param {object} subject - Acting character (ctx.subject)
 * @param {object} [ref] - Target / other party (ctx.ref)
 * @param {object} [opts]
 */
export function renderCheckProse(checkResult, subject, ref = null, opts = {}) {
  const textKey = checkResult.textKey ?? checkResult.checkTextKey;
  if (!textKey) return '';

  const ctx = createContext({
    subject,
    ref,
    globals: {
      ...toTextContext(checkResult),
      ...(opts.globals ?? {}),
    },
    seed: opts.seed,
    history: opts.history,
  });

  return render(`{${textKey}}`, ctx, { trace: opts.trace });
}

export { STAGE_BANDS, REL_BANDS, registerCheckPool, registerCheckPoolAliases } from './helpers.js';
