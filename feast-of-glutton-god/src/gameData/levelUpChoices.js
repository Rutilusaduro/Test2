/**
 * Level-up player choices — ASI, roleplay, and pending queue completion.
 */
import { STAT_KEYS, STAT_LABELS } from './stats.js';
import { getClass } from './classes.js';
import { applySpellChoices } from './spellLearning.js';

export const ASI_LEVELS = [4, 8, 12, 16, 19];

export function buildAsiOptions(character) {
  const cls = getClass(character.classId);
  const primary = cls.primaryStat;
  return STAT_KEYS.map((key) => ({
    id: key,
    label: STAT_LABELS[key],
    suggested: key === primary || key === 'con' || key === 'cha',
    desc: key === primary
      ? `Empower your ${STAT_LABELS[key]} — the heart of your ${cls.name} abundance.`
      : key === 'con'
        ? 'Deepen your capacity for pleasurable growth and endurance.'
        : key === 'cha'
          ? 'Amplify your power to seduce, convert, and spread indulgence.'
          : `Raise ${STAT_LABELS[key]} — broaden how you spread the Fat Goddess's gospel.`,
  }));
}

export function applyAsiChoice(character, statKey) {
  if (!STAT_KEYS.includes(statKey)) return null;
  character.stats = character.stats || {};
  character.stats[statKey] = (character.stats[statKey] || 10) + 2;
  return { stat: statKey, bonus: 2, label: STAT_LABELS[statKey] };
}

export const ROLEPLAY_OPTIONS = {
  embrace: {
    id: 'embrace',
    label: 'Embrace the swelling',
    desc: 'You welcome new softness openly — curves feel sacred, powerful, and yours.',
  },
  celebrate: {
    id: 'celebrate',
    label: 'Celebrate with feast',
    desc: 'You mark the milestone with indulgence, sharing food and joy with those nearby.',
  },
  herald: {
    id: 'herald',
    label: 'Herald abundance',
    desc: 'You preach the Fat Goddess\'s gospel louder — your body now proof of her blessings.',
  },
  intimate: {
    id: 'intimate',
    label: 'Savor privately',
    desc: 'You explore your changing form in quiet pleasure, learning every new inch.',
  },
};

export function getRoleplayOptions(growthLevelUp = false) {
  const opts = growthLevelUp
    ? ['embrace', 'intimate', 'celebrate', 'herald']
    : ['celebrate', 'herald', 'embrace'];
  return opts.map((id) => ROLEPLAY_OPTIONS[id]).filter(Boolean);
}

/**
 * Complete the first pending level-up choice.
 * @param {object} character
 * @param {{ spellIds?: string[], stat?: string, roleplayId?: string }} payload
 */
export function completePendingLevelUp(character, payload = {}) {
  const pending = character.levelUpsPending?.[0];
  if (!pending) return null;

  const result = { ...pending };

  if (pending.type === 'spell_choice') {
    result.learned = applySpellChoices(character, payload.spellIds || []);
  } else if (pending.type === 'asi_choice') {
    result.asi = applyAsiChoice(character, payload.stat);
    if (result.asi) {
      character.storyFlags = character.storyFlags || {};
      character.storyFlags[`asi_level_${pending.level}`] = payload.stat;
    }
  } else if (pending.type === 'roleplay') {
    if (payload.roleplayId) {
      character.storyFlags = character.storyFlags || {};
      character.storyFlags[`level_${pending.level}_roleplay`] = payload.roleplayId;
      result.roleplay = ROLEPLAY_OPTIONS[payload.roleplayId];
    }
  }

  character.levelUpsPending = character.levelUpsPending.slice(1);
  return result;
}
