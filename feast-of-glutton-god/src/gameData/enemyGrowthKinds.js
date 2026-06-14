/**
 * Species / archetype keys for physique-specific growth prose.
 * Distinct from bodyType (pear, athletic…) — describes *what* is swelling
 * (harpy wings vs dryad vines vs golem stone vs dragon hoard-belly).
 */
import { getStage } from './stages.js';

/** @type {Record<string, string>} enemy typeId → growthKind */
export const ENEMY_GROWTH_KIND = {
  harvest_harpy: 'harpy',
  vinebound_dryad: 'dryad',
  gluttonous_goblin: 'goblin',
  temple_guardian: 'armored_knight',
  rival_adventurer: 'adventurer',
  purity_inquisitor: 'inquisitor',
  famine_hag: 'famine_wraith',
  champion_aurelan: 'divine_champion',
  champion_sylwen: 'divine_champion',
  champion_korthak: 'divine_champion',
  champion_veshanne: 'divine_champion',
  champion_lumen: 'divine_champion',
  champion_tarn: 'divine_champion',
  wheel_avatar: 'divine_wheel',
  pantheon_last_stand: 'divine_wheel',
  wheel_incarnate: 'divine_wheel',
  ascetic_monk: 'ascetic',
  lean_pilgrim: 'ascetic',
  living_feast_spirit: 'spirit',
  measure_priest: 'ascetic',
  jealous_noble: 'noble',
  famine_cultist: 'cultist',
  herald_of_starvation: 'divine_herald',
  void_appetite: 'hunger_void',
  cathedral_golem: 'stone_golem',
  divine_inquisitor_supreme: 'inquisitor_elite',
  korthak_titan: 'war_titan',
  dream_echo: 'mirror_self',
  avatar_aurelan: 'divine_avatar_law',
  sylwen_revenant: 'divine_avatar_grief',
  veshanne_unbound: 'divine_avatar_death',
  bloom_sovereign: 'rival_goddess',
  velvet_succubus: 'succubus',
  crimson_vampire: 'vampire',
};

/** NPC role → growthKind when not an enemy type */
const ROLE_GROWTH_KIND = {
  dryad: 'dryad',
};

/** Player size-stage → mythic physique kind (dragon-scale growth prose) */
const PLAYER_STAGE_GROWTH_KIND = [
  { minStage: 14, kind: 'tarrasque' },
  { minStage: 12, kind: 'titan' },
  { minStage: 7, kind: 'dragon' },
];

export function getEnemyGrowthKind(typeId) {
  if (!typeId) return null;
  return ENEMY_GROWTH_KIND[typeId] ?? null;
}

/**
 * Resolve species growth kind for any character (enemy, NPC, player).
 * @param {object} character
 * @returns {string|null}
 */
export function resolveGrowthKind(character) {
  if (!character) return null;
  if (character.growthKind) return character.growthKind;

  const typeId = character.typeId || character.type || character.id;
  const fromEnemy = getEnemyGrowthKind(typeId);
  if (fromEnemy) return fromEnemy;

  if (character.role && ROLE_GROWTH_KIND[character.role]) {
    return ROLE_GROWTH_KIND[character.role];
  }

  if (character.isPlayer || character.id === 'player') {
    const stageId = getStage(character.lbs ?? 0).id;
    for (const { minStage, kind } of PLAYER_STAGE_GROWTH_KIND) {
      if (stageId >= minStage) return kind;
    }
  }

  return null;
}
