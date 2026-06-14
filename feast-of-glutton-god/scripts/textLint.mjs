#!/usr/bin/env node
/**
 * Text-engine lint harness — static checks + render sweeps.
 * See docs/TUNING.md and docs/AUTHORING.md.
 */
import { pathToFileURL } from 'url';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Load engine + all scene pools
await import(pathToFileURL(path.join(ROOT, 'src/textEngine/scenes/index.js')).href);

const {
  _registryEntries,
  _knownSelectors,
  _dimensionNames,
  createContext,
  render,
} = await import(pathToFileURL(path.join(ROOT, 'src/textEngine/engine.js')).href);

const { ENEMY_TYPES } = await import(pathToFileURL(path.join(ROOT, 'src/gameData/enemies.js')).href);
const { APPEARANCE_BY_TYPE } = await import(pathToFileURL(path.join(ROOT, 'src/textEngine/scenes/dm/enemyAppearance.js')).href);
const { REGIONS } = await import(pathToFileURL(path.join(ROOT, 'src/gameData/regions.js')).href);
const {
  renderCombatIntro,
  renderCombatOutro,
  getEnemySizeBand,
} = await import(pathToFileURL(path.join(ROOT, 'src/textEngine/scenes/dm/combat.js')).href);
const { renderCastFeedback } = await import(pathToFileURL(path.join(ROOT, 'src/textEngine/scenes/dm/cast.js')).href);
const { renderRegionHostilityBeat } = await import(pathToFileURL(path.join(ROOT, 'src/textEngine/scenes/dm/region.js')).href);
const { renderFavorWarning, renderSpecialCooldown } = await import(pathToFileURL(path.join(ROOT, 'src/textEngine/scenes/dm/favor.js')).href);
const { renderIndulge } = await import(pathToFileURL(path.join(ROOT, 'src/textEngine/scenes/player/indulge.js')).href);

const MAX_VARIANT_CHARS = 200;
const errors = [];
const warnings = [];

const ARTIFACTS = [
  /you both know why/i,
  /\. That is /,
  /It is not (really )?a question/i,
  /Neither of you mentions it/i,
  /\{[a-zA-Z0-9_.:]+\}/,
];

const MOCK_PLAYER = {
  name: 'Chosen of the Fat Goddess',
  lbs: 195,
  corruption: 40,
  bodyType: 'hourglass',
  pronouns: 'they',
};

function isKnownSelector(key) {
  const known = _knownSelectors();
  if (known.has(key)) return true;
  if (key.endsWith('Min') || key.endsWith('Max')) {
    const base = key.slice(0, -3);
    return known.has(base) || _dimensionNames().includes(base);
  }
  return _dimensionNames().includes(key);
}

function collectTexts(variant) {
  const t = variant.text;
  if (typeof t === 'string') return [t];
  if (Array.isArray(t)) return t.filter((x) => typeof x === 'string');
  return [];
}

const DM_POOL_PREFIXES = ['dm.combat.', 'dm.cast.', 'dm.region.', 'dm.favor.', 'dm.special.', 'npc.satiation.', 'npc.growth.', 'npc.bless.forced', 'npc.refusal', 'npc.special.', 'player.indulge.'];
const STRICT_POOL = (key) => DM_POOL_PREFIXES.some((p) => key.startsWith(p));

// ── static: pool variant length + when keys (combat DM pools) ──

for (const [poolKey, variants] of _registryEntries()) {
  if (!STRICT_POOL(poolKey)) continue;
  for (const variant of variants) {
    for (const text of collectTexts(variant)) {
      if (text.length > MAX_VARIANT_CHARS) {
        errors.push(`[length] ${poolKey}: variant ${text.length} chars (> ${MAX_VARIANT_CHARS})`);
      }
    }
    if (variant.when) {
      for (const key of Object.keys(variant.when)) {
        if (!isKnownSelector(key)) {
          errors.push(`[selector] ${poolKey}: unknown when key "${key}"`);
        }
      }
    }
  }

  const wildcards = variants.filter((v) => !v.when || Object.keys(v.when).length === 0);
  const wildcardTexts = wildcards.flatMap(collectTexts).filter((t) => t.trim().length > 0);
  if (wildcardTexts.length < 3) {
    errors.push(`[wildcard] ${poolKey}: needs ≥3 wildcard texts (has ${wildcardTexts.length})`);
  }
}

// ── render sweeps ──────────────────────────────────────────────

const ENEMY_IDS = Object.keys(ENEMY_TYPES);
const REGION_IDS = REGIONS.map((r) => r.id);
const SIZE_BANDS = ['light', 'rounded', 'heavy', 'vast'];
const VICTORY_TYPES = ['win', 'converted', 'defeat'];

function assertCleanRender(label, text) {
  if (!text || !text.trim()) {
    errors.push(`[empty] ${label}: empty render`);
    return;
  }
  for (const pattern of ARTIFACTS) {
    if (pattern.test(text)) {
      errors.push(`[artifact] ${label}: matched ${pattern}`);
    }
  }
}

function appearanceKeywords(enemyId) {
  const lines = APPEARANCE_BY_TYPE[enemyId];
  const nameWords = (ENEMY_TYPES[enemyId]?.name ?? '')
    .toLowerCase()
    .replace(/^the /, '')
    .split(/\s+/)
    .filter((w) => w.length > 3);
  const idParts = enemyId.split('_').filter((p) => p.length > 3);
  const fromAppearance = lines
    ? (lines.join(' ').toLowerCase().match(/\b[a-z]{4,}\b/g) ?? []).slice(0, 10)
    : [];
  return [...new Set([...nameWords, ...idParts, ...fromAppearance])];
}

function sweepCombatIntro(iterations = 200) {
  let bespokeHits = new Set();
  for (let i = 0; i < iterations; i++) {
    const enemyType = ENEMY_IDS[i % ENEMY_IDS.length];
    const region = REGION_IDS[i % REGION_IDS.length];
    const count = (i % 3 === 0) ? 2 : 1;
    const template = ENEMY_TYPES[enemyType];
    const enemies = Array.from({ length: count }, (_, idx) => ({
      name: `${template.name} ${idx + 1}`,
      type: enemyType,
      lbs: template.startLbs,
      startLbs: template.startLbs,
      role: template.role,
      pronouns: 'they',
    }));
    const game = { player: MOCK_PLAYER, region };
    const combat = { enemies, regionId: region };
    const text = renderCombatIntro(game, combat, { seed: `intro_${i}` });
    assertCleanRender(`dm.combat.intro #${i}`, text);
    for (const id of ENEMY_IDS) {
      if (text.includes(ENEMY_TYPES[id].name.split(' ')[0]) || text.toLowerCase().includes(id.split('_')[0])) {
        bespokeHits.add(id);
      }
    }
    const words = appearanceKeywords(enemyType);
    if (words.some((w) => text.toLowerCase().includes(w))) bespokeHits.add(enemyType);
  }
  for (const id of ENEMY_IDS) {
    if (!bespokeHits.has(id)) {
      warnings.push(`[coverage] dm.combat.intro: no bespoke appearance signal for ${id} in sweep`);
    }
  }
}

function sweepCombatOutro(iterations = 200) {
  for (let i = 0; i < iterations; i++) {
    const enemyType = ENEMY_IDS[i % ENEMY_IDS.length];
    const region = REGION_IDS[i % REGION_IDS.length];
    const victory = VICTORY_TYPES[i % VICTORY_TYPES.length];
    const template = ENEMY_TYPES[enemyType];
    const wrapup = {
      victory: victory === 'defeat' ? 'lose' : victory,
      region,
      enemies: [{
        name: template.name,
        type: enemyType,
        startStage: 1,
        endStage: victory === 'defeat' ? 1 : 5,
        lbs: template.startLbs + (victory === 'defeat' ? 0 : 90),
        converted: victory === 'converted',
        killed: victory === 'win',
        pronouns: 'they',
      }],
      allies: [{ name: MOCK_PLAYER.name, lbs: MOCK_PLAYER.lbs, isPlayer: true }],
    };
    const game = { player: MOCK_PLAYER, region, party: [] };
    const text = renderCombatOutro(game, wrapup, { seed: `outro_${i}` });
    assertCleanRender(`dm.combat.outro #${i}`, text);
  }

  // pronoun agreement smoke test
  const pronounEnemy = {
    name: 'Test Foe',
    type: 'harvest_harpy',
    startStage: 2,
    endStage: 5,
    lbs: 220,
    converted: true,
    pronouns: 'they',
  };
  const wrapup = {
    victory: 'converted',
    region: 'harvest_hearth',
    enemies: [pronounEnemy],
    allies: [{ name: MOCK_PLAYER.name, lbs: MOCK_PLAYER.lbs }],
  };
  const pronounText = renderCombatOutro({ player: MOCK_PLAYER, region: 'harvest_hearth' }, wrapup, { seed: 'they_test' });
  if (/\b(she|her)\b/i.test(pronounText) && !/\bthey\b/i.test(pronounText)) {
    errors.push('[pronoun] dm.combat.outro: they/them subject rendered with she/her');
  }
}

const SPELL_SCHOOLS = ['abundance', 'enchantment', 'transmutation', 'evocation', 'conjuration'];
const CAST_TYPES = ['action', 'bonus'];
const PAID_BY = ['slot', 'ap', 'cantrip'];
const FAIL_CAUSES = ['no_resource', 'no_action', 'no_bonus'];
const CAST_KINDS = ['invoke', 'fizzle', 'noaction', 'nobonus'];

function sweepCastFeedback(iterations = 150) {
  for (let i = 0; i < iterations; i++) {
    const kind = CAST_KINDS[i % CAST_KINDS.length];
    const school = SPELL_SCHOOLS[i % SPELL_SCHOOLS.length];
    const castType = CAST_TYPES[i % CAST_TYPES.length];
    const paidBy = PAID_BY[i % PAID_BY.length];
    const failCause = FAIL_CAUSES[i % FAIL_CAUSES.length];
    const spell = { name: 'Sweep Spell', school, actionType: castType };
    const text = renderCastFeedback(kind, MOCK_PLAYER, spell, {
      paidBy,
      failCause: kind === 'fizzle' ? failCause : undefined,
      cost: { ok: true, method: paidBy === 'cantrip' ? 'cantrip' : paidBy },
      seed: `cast_${i}`,
    });
    assertCleanRender(`dm.cast.${kind} #${i}`, text);
  }
}

function sweepRepercussions(iterations = 200) {
  const HOSTILITY_TIERS = [0, 1, 2, 3];
  const FAVOR_STATES = ['flush', 'low', 'empty'];
  const STAGES = [2, 5, 8, 11];
  for (let i = 0; i < iterations; i++) {
    const region = REGION_IDS[i % REGION_IDS.length];
    const hostilityTier = HOSTILITY_TIERS[i % HOSTILITY_TIERS.length];
    const crackdown = hostilityTier >= 3;
    const game = { player: MOCK_PLAYER, region };
    const regionText = renderRegionHostilityBeat(game, region, { hostilityTier, crackdown, seed: `region_${i}` });
    assertCleanRender(`dm.region #${i}`, regionText);

    const favorState = FAVOR_STATES[i % FAVOR_STATES.length];
    const favorText = renderFavorWarning(MOCK_PLAYER, game, { favorState, action: 'growth', seed: `favor_${i}` });
    assertCleanRender(`dm.favor #${i}`, favorText);

    const stage = STAGES[i % STAGES.length];
    const indulgeText = renderIndulge({ ...MOCK_PLAYER, lbs: 120 + stage * 40 }, game, { stage, seed: `indulge_${i}` });
    assertCleanRender(`player.indulge #${i}`, indulgeText);
  }

  const cooldownText = renderSpecialCooldown(
    { name: 'Test NPC', archetype: 'performer', pronouns: 'they' },
    MOCK_PLAYER,
    { region: 'harvest_hearth' },
  );
  assertCleanRender('dm.special.cooldown', cooldownText);
}

const SWEEPS = [
  { name: 'dm.combat.intro', run: sweepCombatIntro },
  { name: 'dm.combat.outro', run: sweepCombatOutro },
  { name: 'dm.cast', run: sweepCastFeedback },
  { name: 'repercussions', run: sweepRepercussions },
];

for (const sweep of SWEEPS) {
  try {
    sweep.run(sweep.name === 'dm.cast' ? 150 : 200);
  } catch (err) {
    errors.push(`[sweep] ${sweep.name}: ${err.message}`);
  }
}

// ── report ─────────────────────────────────────────────────────

if (warnings.length) {
  console.warn(`text:lint warnings (${warnings.length}):`);
  for (const w of warnings) console.warn(`  ${w}`);
}

if (errors.length) {
  console.error(`text:lint FAILED (${errors.length} errors):`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}

console.log(`text:lint OK — ${_registryEntries().length} pools, ${SWEEPS.length} sweeps`);
