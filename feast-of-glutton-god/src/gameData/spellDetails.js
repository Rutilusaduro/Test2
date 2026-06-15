/**
 * Spell detail formatting — shared by character sheet, combat, and level-up UI.
 */
import { getSpell, getSpellForCast, getSpellEnvironmentTags, isRitualSpell, getRitualApCost } from './spells.js';
import { isGrowthThemedSpell } from './spellLearning.js';
import { deriveSpellTargeting, getTargetingHint } from './spellTargeting.js';
import { previewCastCost } from './spellSlots.js';

const SCHOOL_LABELS = {
  abundance: 'Abundance',
  transmutation: 'Transmutation',
  enchantment: 'Enchantment',
  conjuration: 'Conjuration',
  evocation: 'Evocation',
  divination: 'Divination',
  necromancy: 'Necromancy',
};

const BUFF_LABELS = {
  indulgence: 'Indulgence (growth potency)',
  spellpower: 'Spellpower',
  altar: 'Feast-shrine immobility',
};

const ENV_LABELS = {
  fertile: 'Fertile ground',
  ritual: 'Ritual circle',
  charm: 'Charm atmosphere',
  soften: 'Softens terrain',
  slick: 'Slick footing',
  swell: 'Swells bodies nearby',
  crush: 'Crushing pressure',
};

function formatDice(dice) {
  if (!dice?.count || !dice?.sides) return null;
  return `${dice.count}d${dice.sides}`;
}

function formatDamageType(type) {
  if (!type) return 'damage';
  return type.replace(/_/g, ' ');
}

function formatEffectLines(spell) {
  const eff = spell?.effect || {};
  const lines = [];

  if (eff.damage) {
    const d = eff.damage;
    const dice = formatDice(d.dice);
    let line = dice
      ? `${dice} ${formatDamageType(d.damageType)}`
      : `${formatDamageType(d.damageType)} damage`;
    if (d.spellAttack) line += ' · spell attack roll';
    else if (d.save) {
      line += ` · ${d.save.toUpperCase()} save`;
      if (d.halfOnSuccess) line += ' (half damage on success)';
    }
    if (d.melee) line += ' · melee touch';
    else if (d.range != null) line += ` · range ${d.range} tiles`;
    if (d.aoe) line += ` · ${d.radius ?? 2}-tile area`;
    if (d.growthConversion) {
      line += ` · ~${Math.round(d.growthConversion * 100)}% of damage becomes growth`;
    }
    if (d.corruptionOnHit) line += ` · +${d.corruptionOnHit} corruption on hit`;
    lines.push(line);
  }

  if (eff.growth) {
    lines.push(`+${eff.growth} growth stage${eff.growth > 1 ? 's' : ''} on target`);
  }
  if (eff.selfGrowth) {
    lines.push(`+${eff.selfGrowth} growth stage${eff.selfGrowth > 1 ? 's' : ''} on yourself`);
  }
  if (eff.feed) {
    lines.push(`Force-feed${eff.feed > 1 ? ` (${eff.feed} bites)` : ''} — combat feed + growth`);
  }
  if (eff.corruption) {
    lines.push(`+${eff.corruption} corruption`);
  }
  if (eff.charm) {
    lines.push('Charms target — lowers resistance to indulgence');
  }
  if (eff.heal) {
    lines.push(`Heal ${eff.heal} HP`);
  }
  if (eff.drain) {
    lines.push(`Drain ${eff.drain} stage${eff.drain > 1 ? 's' : ''} from foe → growth on you`);
  }
  if (eff.buff) {
    lines.push(`Buff: ${BUFF_LABELS[eff.buff] || eff.buff}`);
  }
  if (eff.aoe && !eff.damage?.aoe) {
    lines.push(eff.party ? 'Area: whole party' : 'Area: battlefield-wide');
  }
  if (eff.party && !eff.aoe) {
    lines.push('Affects all allies');
  }

  return lines;
}

function formatCostLabel(player, spell, overflow = false) {
  const preview = previewCastCost(player, getSpellForCast(spell, overflow), { overflow });
  const slotLevel = spell.slotLevel ?? 0;

  if (slotLevel === 0) return 'Cantrip — no slot';

  if (preview.ok) {
    if (preview.method === 'slot') {
      const lvl = overflow && spell.overflow
        ? slotLevel + (spell.overflow.slotBonus ?? 1)
        : slotLevel;
      return `Spell slot (level ${lvl})`;
    }
    if (preview.method === 'resonance') return 'Divine resonance (no slot spent)';
    if (preview.method === 'ap') {
      return `${preview.apSpent ?? spell.apCost ?? '?'} AP`;
    }
  }

  const parts = [`Level ${slotLevel} slot`];
  if (spell.apCost) parts.push(`or ${spell.apCost} AP`);
  return parts.join(' · ');
}

function formatStaticCost(spell) {
  const slotLevel = spell.slotLevel ?? 0;
  if (slotLevel === 0) return 'Cantrip';
  const parts = [`Uses level ${slotLevel} slot`];
  if (spell.apCost) parts.push(`${spell.apCost} AP if no slot`);
  if (spell.overflow?.apCost) parts.push(`${spell.overflow.apCost} AP overflow`);
  return parts.join(' · ');
}

/**
 * @param {object|string} spellOrId
 * @param {object} [player]
 * @param {{ overflow?: boolean }} [opts]
 */
export function buildSpellDetail(spellOrId, player = null, opts = {}) {
  const base = typeof spellOrId === 'string' ? getSpell(spellOrId) : spellOrId;
  if (!base) return null;

  const overflow = Boolean(opts.overflow);
  const spell = getSpellForCast(base, overflow);
  const targeting = deriveSpellTargeting(spell);
  const envTags = getSpellEnvironmentTags(spell);

  const rangeBits = [];
  if (targeting.range > 0) rangeBits.push(`${targeting.range} tiles`);
  if (targeting.radius > 0) rangeBits.push(`${targeting.radius}-tile radius`);

  return {
    id: base.id,
    name: spell.name,
    desc: spell.desc,
    school: SCHOOL_LABELS[spell.school] || spell.school || 'Unknown',
    slotLevel: spell.slotLevel ?? 0,
    actionType: spell.actionType === 'bonus' ? 'Bonus Action' : 'Action',
    growth: isGrowthThemedSpell(spell),
    mechanics: formatEffectLines(spell),
    targeting: getTargetingHint(spell, targeting),
    rangeSummary: rangeBits.length ? rangeBits.join(' · ') : 'Self',
    cost: player ? formatCostLabel(player, base, overflow) : formatStaticCost(base),
    canCast: player ? previewCastCost(player, spell, { overflow }).ok : null,
    ritual: isRitualSpell(spell),
    ritualAp: isRitualSpell(spell) ? getRitualApCost(spell) : null,
    minSizeStage: spell.minSizeStage ?? null,
    environment: envTags.map((t) => ENV_LABELS[t] || t),
    overflow: base.overflow
      ? {
          name: base.overflow.name || `${base.name} (Overflow)`,
          desc: 'Heightened cast — stronger effect, higher cost.',
          apCost: base.overflow.apCost,
        }
      : null,
  };
}
