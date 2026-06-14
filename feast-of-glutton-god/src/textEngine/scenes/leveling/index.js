import './pools.js';

import { createContext, render } from '../../engine.js';
import '../../modules.js';

function getLevelTier(level = 1) {
  if (level >= 17) return 'apotheosis';
  if (level >= 11) return 'mythic';
  if (level >= 5) return 'heroic';
  return 'aspirant';
}

export function renderLevelUpText(key, player, options = {}) {
  const ctx = createContext({
    subject: player,
    globals: {
      level: options.level ?? player?.level,
      levelTier: options.levelTier ?? getLevelTier(options.level ?? player?.level),
      classId: player?.classId,
      subclassId: player?.subclassId,
      growthLevelUp: options.growthLevelUp ?? false,
      growthSpell: options.growthSpell ?? false,
      ...(options.globals ?? {}),
    },
  });
  return render(`{${key}}`, ctx, { trace: options.trace });
}

export function buildLevelUpMessage(player, levelUpResult) {
  const parts = [];
  const celebration = renderLevelUpText('levelup.celebration', player, {
    level: levelUpResult.level,
    growthLevelUp: levelUpResult.growthLevelUp,
  });
  if (celebration) parts.push(celebration);

  const tierFlavor = renderLevelUpText('levelup.tier', player, {
    level: levelUpResult.level,
  });
  if (tierFlavor) parts.push(tierFlavor);

  const classFlavor = renderLevelUpText(`levelup.${player.classId}`, player, {
    level: levelUpResult.level,
  });
  if (classFlavor) parts.push(classFlavor);

  if (levelUpResult.asi) {
    parts.push(renderLevelUpText('levelup.asi', player, { level: levelUpResult.level }));
  }

  if (levelUpResult.sizeCapIncreased) {
    parts.push(renderLevelUpText('levelup.size_cap', player, { level: levelUpResult.level }));
  }

  if (levelUpResult.autoGrantedSpells?.length) {
    const growthSpell = levelUpResult.autoGrantedSpells.some((s) => s.growth);
    parts.push(renderLevelUpText('levelup.spell_learned', player, { growthSpell }));
    parts.push(levelUpResult.autoGrantedSpells.map((s) => `• ${s.name}`).join('\n'));
  }

  if (levelUpResult.features?.length) {
    parts.push(renderLevelUpText('levelup.feature', player));
    parts.push(levelUpResult.features.map((f) => `• ${f.name}: ${f.desc}`).join('\n'));
  }

  return parts.filter(Boolean).join('\n\n');
}
