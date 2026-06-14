/**
 * Combat spell targeting — range rings, target validation, multi-target beams.
 */
import { getStage, getTileSize } from './stages.js';

export const TARGET_KIND = {
  SELF: 'self',
  TOUCH_ENEMY: 'touch_enemy',
  RANGED_ENEMY: 'ranged_enemy',
  RANGED_ALLY: 'ranged_ally',
  AOE_CENTER: 'aoe_center',
  AOE_AUTO_ENEMIES: 'aoe_auto_enemies',
  AOE_AUTO_ALL: 'aoe_auto_all',
  MULTI_ENEMY: 'multi_enemy',
};

/** Per-spell overrides; everything else is derived from effect tags. */
const SPELL_TARGET_OVERRIDES = {
  gentle_plump: { kind: TARGET_KIND.TOUCH_ENEMY, range: 1 },
  indulgent_touch: { kind: TARGET_KIND.TOUCH_ENEMY, range: 1 },
  swell_kiss: { kind: TARGET_KIND.TOUCH_ENEMY, range: 1 },
  softening_ray: { kind: TARGET_KIND.MULTI_ENEMY, range: 6, maxTargets: 3 },
  gorgaras_spark: { kind: TARGET_KIND.RANGED_ENEMY, range: 6 },
  feast_song: { kind: TARGET_KIND.RANGED_ENEMY, range: 6 },
  prayer_full_belly: { kind: TARGET_KIND.RANGED_ALLY, range: 6 },
  matrons_blessing: { kind: TARGET_KIND.RANGED_ALLY, range: 6 },
  divine_plump: { kind: TARGET_KIND.RANGED_ALLY, range: 6 },
  hunger_pact: { kind: TARGET_KIND.SELF, range: 0 },
  essence_drain: { kind: TARGET_KIND.RANGED_ENEMY, range: 6 },
};

export function getCasterAnchor(unit) {
  const size = getTileSize(getStage(unit.lbs).id);
  return {
    x: unit.x + (size - 1) / 2,
    y: unit.y + (size - 1) / 2,
  };
}

function tileDistance(ax, ay, bx, by) {
  return Math.hypot(ax - bx, ay - by);
}

export function deriveSpellTargeting(spell) {
  if (!spell) return { kind: TARGET_KIND.RANGED_ENEMY, range: 6, maxTargets: 1, radius: 0 };
  const override = SPELL_TARGET_OVERRIDES[spell.id];
  if (override) return { maxTargets: 1, radius: 0, ...override };

  const eff = spell.effect || {};
  if (eff.selfGrowth && !eff.growth && !eff.drain && !eff.aoe) {
    return { kind: TARGET_KIND.SELF, range: 0, maxTargets: 1, radius: 0 };
  }
  if (eff.party && eff.aoe) {
    return { kind: TARGET_KIND.AOE_AUTO_ALL, range: 6, maxTargets: 99, radius: 0, alliesOnly: true };
  }
  if (eff.aoe && !eff.party) {
    if (eff.feed || spell.id === 'banquet_mist') {
      return { kind: TARGET_KIND.AOE_CENTER, range: 5, maxTargets: 99, radius: 2 };
    }
    return { kind: TARGET_KIND.AOE_AUTO_ALL, range: 6, maxTargets: 99, radius: 0 };
  }
  if (eff.heal || (eff.growth && eff.buff)) {
    return { kind: TARGET_KIND.RANGED_ALLY, range: 6, maxTargets: 1, radius: 0 };
  }
  if (eff.feed) {
    return { kind: TARGET_KIND.TOUCH_ENEMY, range: 1, maxTargets: 1, radius: 0 };
  }
  if (spell.slotLevel === 0) {
    return { kind: TARGET_KIND.RANGED_ENEMY, range: 6, maxTargets: 1, radius: 0 };
  }
  return { kind: TARGET_KIND.RANGED_ENEMY, range: 6, maxTargets: 1, radius: 0 };
}

export function getSpellRangeTiles(combat, caster, targeting) {
  if (!caster || targeting.kind === TARGET_KIND.SELF) return [];
  const anchor = getCasterAnchor(caster);
  const range = targeting.range ?? 6;
  const tiles = [];
  for (let x = 0; x < combat.gridSize; x++) {
    for (let y = 0; y < combat.gridSize; y++) {
      const dist = tileDistance(anchor.x, anchor.y, x + 0.5, y + 0.5);
      if (dist <= range) tiles.push({ x, y });
    }
  }
  return tiles;
}

export function findUnitAtCell(combat, x, y) {
  for (const a of combat.allies) {
    if (a.hp <= 0) continue;
    const s = getTileSize(getStage(a.lbs).id);
    if (x >= a.x && x < a.x + s && y >= a.y && y < a.y + s) return { unit: a, team: 'ally' };
  }
  for (const e of combat.enemies) {
    if (e.hp <= 0 || e.converted) continue;
    const s = getTileSize(getStage(e.lbs).id);
    if (x >= e.x && x < e.x + s && y >= e.y && y < e.y + s) return { unit: e, team: 'enemy' };
  }
  return null;
}

function unitInRange(caster, unit, range) {
  const anchor = getCasterAnchor(caster);
  const size = getTileSize(getStage(unit.lbs).id);
  const ux = unit.x + (size - 1) / 2;
  const uy = unit.y + (size - 1) / 2;
  return tileDistance(anchor.x, anchor.y, ux, uy) <= range;
}

export function isUnitValidSpellTarget(caster, unit, team, targeting) {
  if (!unit || unit.hp <= 0) return false;
  if (team === 'enemy' && unit.converted) return false;

  switch (targeting.kind) {
    case TARGET_KIND.TOUCH_ENEMY:
      return team === 'enemy' && unitInRange(caster, unit, targeting.range ?? 1);
    case TARGET_KIND.RANGED_ENEMY:
      return team === 'enemy' && unitInRange(caster, unit, targeting.range ?? 6);
    case TARGET_KIND.RANGED_ALLY:
      return team === 'ally' && unitInRange(caster, unit, targeting.range ?? 6);
    case TARGET_KIND.MULTI_ENEMY:
      return team === 'enemy' && unitInRange(caster, unit, targeting.range ?? 6);
    default:
      return false;
  }
}

export function getUnitsInAoE(combat, centerX, centerY, radius, filter = null) {
  const hits = [];
  const all = [
    ...combat.allies.filter((a) => a.hp > 0).map((u) => ({ unit: u, team: 'ally' })),
    ...combat.enemies.filter((e) => e.hp > 0 && !e.converted).map((u) => ({ unit: u, team: 'enemy' })),
  ];
  for (const entry of all) {
    const size = getTileSize(getStage(entry.unit.lbs).id);
    const ux = entry.unit.x + (size - 1) / 2;
    const uy = entry.unit.y + (size - 1) / 2;
    if (tileDistance(centerX + 0.5, centerY + 0.5, ux, uy) <= radius) {
      if (!filter || filter(entry.unit, entry.team)) hits.push(entry.unit);
    }
  }
  return hits;
}

export function resolveAutoTargets(combat, caster, spell, targeting) {
  const eff = spell.effect || {};
  if (targeting.kind === TARGET_KIND.SELF) return [caster];
  if (targeting.kind === TARGET_KIND.AOE_AUTO_ALL) {
    if (eff.party) {
      return combat.allies.filter((a) => a.hp > 0);
    }
    return [
      ...combat.enemies.filter((e) => e.hp > 0 && !e.converted),
      ...combat.allies.filter((a) => a.hp > 0),
    ].filter((u) => unitInRange(caster, u, targeting.range ?? 6));
  }
  if (targeting.kind === TARGET_KIND.AOE_AUTO_ENEMIES) {
    return combat.enemies.filter(
      (e) => e.hp > 0 && !e.converted && unitInRange(caster, e, targeting.range ?? 6),
    );
  }
  return [];
}

export function targetingNeedsInput(targeting) {
  return ![
    TARGET_KIND.SELF,
    TARGET_KIND.AOE_AUTO_ALL,
    TARGET_KIND.AOE_AUTO_ENEMIES,
  ].includes(targeting.kind);
}

export function getTargetingHint(spell, targeting) {
  switch (targeting.kind) {
    case TARGET_KIND.SELF:
      return `Cast ${spell.name} on yourself.`;
    case TARGET_KIND.TOUCH_ENEMY:
      return `Tap an enemy within melee reach.`;
    case TARGET_KIND.RANGED_ENEMY:
      return `Tap an enemy within the gold ring.`;
    case TARGET_KIND.RANGED_ALLY:
      return `Tap an ally within the gold ring.`;
    case TARGET_KIND.AOE_CENTER:
      return `Tap a point within range — the blast swells everyone nearby.`;
    case TARGET_KIND.MULTI_ENEMY:
      return `Tap up to ${targeting.maxTargets ?? 3} enemies in range, then Cast.`;
    case TARGET_KIND.AOE_AUTO_ALL:
      return `Cast ${spell.name} — the whole battlefield ripples.`;
    default:
      return `Select a target for ${spell.name}.`;
  }
}
