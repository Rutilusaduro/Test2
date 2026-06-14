import { registerSelectors } from '../engine.js';

registerSelectors(
  'location', 'interaction', 'playerClass', 'growthMethod', 'feedType',
  'pose', 'region', 'locale', 'causeType', 'featureId',
  'growthType', 'growthPerspective',
  'questId', 'questType', 'questTitle', 'endingId', 'stageId',
  'reactionType', 'landmarkRole', 'band', 'rumorWhat', 'hasRumor', 'rumorWho',
  'firstVisit', 'dmKind', 'hintKind', 'regionTransformLevel', 'enemyId', 'enemyCount', 'enemyPlural',
  'enemyType', 'enemySizeBand', 'victoryType', 'regionTransformation', 'sceneVariant',
  'outcomeKind', 'partySize', 'regionName', 'role', 'archetype',
  'spellSchool', 'castType', 'paidBy', 'failCause', 'spellName',
  'consentState', 'playerClass', 'severity', 'levelTier', 'growthKind',
  'hostilityTier', 'favorState', 'crackdown', 'action', 'escalationTier',
  'divineAttentionTier', 'portentId', 'threatTier', 'act', 'heraldId',
  'escalationTierMin', 'escalationTierMax', 'consentState', 'gainDesireMin',
  // player level — passed as globals.level in createContext; range variants auto-resolve
  'level', 'levelMin', 'levelMax',
  // spell-level selectors — for named high-level spell pools
  'spellId', 'spellSlotLevel', 'spellSlotLevelMin', 'spellSlotLevelMax',
  // companion tier band — mirrors level bands for companion-arc keying
  'companionTier',
  // growth quantity for level-up context
  'isMilestone',
);
