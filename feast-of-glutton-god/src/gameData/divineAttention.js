/**
 * Divine Attention — how loudly the Measured Wheel notices the off-genre anomaly.
 * Drives escalationTier for the DM narrator and gates Act II→III opposition (Prompt 3).
 */
import { renderPortentBeat } from '../textEngine/scenes/dm/portent.js';
import { renderGenreBeat } from '../textEngine/scenes/dm/genre.js';
import { renderVerityConfrontation, renderHeraldUltimatum } from '../textEngine/scenes/npc/antagonist.js';
import { addExperience, XP_SOURCES } from './leveling.js';
import { getEndingAttentionMultiplier } from './endingEcho.js';
import { getRegionHostility, getHostilityTier } from './regionHostility.js';

export const DIVINE_ATTENTION_TIERS = [
  { id: 0, min: 0, label: 'Unnoticed', escalationTier: 0, desc: 'The Wheel has not troubled itself with you yet.' },
  { id: 1, min: 20, label: 'Flicker on the Wheel', escalationTier: 1, desc: 'Lantern-oracles dream of appetite that should not fit.' },
  { id: 2, min: 45, label: 'Divine Unease', escalationTier: 2, desc: 'Omens multiply; the Church takes careful notes.' },
  { id: 3, min: 75, label: 'Pantheon Alarm', escalationTier: 3, desc: 'The gods know something is wrong with the story.' },
  { id: 4, min: 95, label: 'Cosmic Dread', escalationTier: 4, desc: 'Avatars stir; the Wheel considers extinction protocols.' },
  { id: 5, min: 115, label: 'Apotheosis Threshold', escalationTier: 5, desc: 'You are no longer an anomaly — you are a rival cosmology.' },
];

export const DIVINE_ATTENTION_AWARDS = {
  trivialize: 4,
  region_flip: 12,
  ascension_milestone: 15,
  hostility_spike: 6,
  growth_event: 8,
};

export const PORTENT_THRESHOLDS = {
  20: {
    id: 'omen_lantern',
    label: 'Lantern Omen',
    worldFlags: { omen_lantern: true, act2_gates_unlocked: true },
  },
  40: {
    id: 'inquisition_whispers',
    label: 'Inquisition Whispers',
    worldFlags: { inquisition_whispers: true },
  },
  55: {
    id: 'schism_rumor',
    label: 'Schism in the Church',
    worldFlags: { church_schism_rumor: true },
  },
  70: {
    id: 'refugee_tide',
    label: 'Refugee Tide',
    worldFlags: { refugee_tide: true },
  },
  85: {
    id: 'divine_council',
    label: 'Divine Council Convened',
    worldFlags: { divine_council: true, act3_gates_unlocked: true },
  },
  100: {
    id: 'apotheosis_threshold',
    label: 'Apotheosis Threshold',
    worldFlags: { apotheosis_threshold: true, unlock_divine_vestibule: true },
  },
  115: {
    id: 'goddess_present',
    label: 'Goddess Present',
    worldFlags: { goddess_present: true },
  },
};

export function ensureDivineAttentionState(game) {
  game.worldFlags = game.worldFlags || {};
  if (game.worldFlags.divineAttention == null) game.worldFlags.divineAttention = 0;
  if (!Array.isArray(game.worldFlags.portentLog)) game.worldFlags.portentLog = [];
  syncEscalationTier(game);
  return game.worldFlags;
}

export function getDivineAttention(game) {
  return game?.worldFlags?.divineAttention ?? 0;
}

export function getDivineAttentionTier(points = 0) {
  const n = Math.max(0, points);
  let current = DIVINE_ATTENTION_TIERS[0];
  for (const t of DIVINE_ATTENTION_TIERS) {
    if (n >= t.min) current = t;
  }
  const next = DIVINE_ATTENTION_TIERS.find((t) => t.min > n) ?? null;
  return { current, next, points: n };
}

export function getEscalationTier(points) {
  return getDivineAttentionTier(points).current.escalationTier;
}

export function syncEscalationTier(game) {
  if (!game?.worldFlags) return 0;
  const points = getDivineAttention(game);
  const { current } = getDivineAttentionTier(points);
  game.worldFlags.escalationTier = current.escalationTier;
  game.worldFlags.divineAttentionTier = current.id;
  return current.escalationTier;
}

export function getDivineAttentionProgress(game) {
  ensureDivineAttentionState(game);
  const points = getDivineAttention(game);
  const { current, next } = getDivineAttentionTier(points);
  if (!next) return { points, current, next: null, pct: 100 };
  const span = next.min - current.min;
  const into = points - current.min;
  return {
    points,
    current,
    next,
    pct: Math.min(100, Math.round((into / span) * 100)),
  };
}

export function getLastPortent(game) {
  const log = game?.worldFlags?.portentLog;
  if (!Array.isArray(log) || !log.length) return null;
  return log[log.length - 1];
}

function checkPortentEvents(game, oldPoints, newPoints) {
  const triggered = [];
  for (const [threshold, def] of Object.entries(PORTENT_THRESHOLDS)) {
    const pts = Number(threshold);
    if (oldPoints >= pts || newPoints < pts) continue;
    const flagKey = `portent_${def.id}`;
    if (game.worldFlags[flagKey]) continue;

    game.worldFlags[flagKey] = true;
    for (const [k, v] of Object.entries(def.worldFlags ?? {})) {
      game.worldFlags[k] = v;
    }

    const message = renderPortentBeat(game, def.id);
    const entry = {
      id: def.id,
      label: def.label,
      message,
      day: game.day ?? 1,
      threshold: pts,
    };
    game.worldFlags.portentLog.push(entry);
    game.worldFlags.lastPortent = def.id;
    triggered.push({ def, entry, message });

    if (game.player) {
      const { levelUps, amount } = addExperience(
        game.player,
        XP_SOURCES.divine_attention_milestone,
        'divine_attention_milestone',
      );
      if (amount > 0) {
        entry.message = `${message}\n\n+${amount} XP — the Wheel marks another threshold.`;
        if (levelUps?.length) {
          game.lastLevelUpMessage = levelUps.map((lu) => lu.narrative || `Level ${lu.level}!`).join('\n\n---\n\n');
          game.lastLevelUpResult = levelUps[levelUps.length - 1];
        }
      }
    }

    if (def.id === 'inquisition_whispers' && !game.worldFlags.verity_act2_seen) {
      game.worldFlags.verity_act2_seen = true;
      const verityBeat = renderVerityConfrontation(game, { act: 2 });
      if (verityBeat) entry.message = `${message}\n\n${verityBeat}`;
    }
    if (def.id === 'schism_rumor' && !game.worldFlags.sylwen_herald_seen) {
      game.worldFlags.sylwen_herald_seen = true;
      const heraldBeat = renderHeraldUltimatum(game, 'sylwen');
      if (heraldBeat) entry.message = `${entry.message}\n\n${heraldBeat}`;
    }
  }
  return triggered;
}

export function raiseDivineAttention(game, source, amountOverride) {
  ensureDivineAttentionState(game);
  const raw = amountOverride ?? DIVINE_ATTENTION_AWARDS[source] ?? 0;
  const base = Math.max(0, Math.round(raw * getEndingAttentionMultiplier(game)));
  if (base <= 0) {
    return { gained: 0, total: getDivineAttention(game), portents: [], tierUp: false };
  }

  const oldPoints = getDivineAttention(game);
  const oldTier = getDivineAttentionTier(oldPoints).current.id;
  game.worldFlags.divineAttention = oldPoints + base;
  const total = game.worldFlags.divineAttention;
  const newTier = getDivineAttentionTier(total).current.id;
  syncEscalationTier(game);

  const portents = checkPortentEvents(game, oldPoints, total);

  let antagonistBeat = null;
  let genreBeat = null;
  if (newTier > oldTier) {
    antagonistBeat = renderVerityConfrontation(game);
    genreBeat = renderGenreBeat(game, 'escalation', {
      escalationTier: getDivineAttentionTier(total).current.escalationTier,
    });
  }

  return {
    gained: base,
    total,
    source,
    tierUp: newTier > oldTier,
    tier: getDivineAttentionTier(total).current,
    portents,
    portent: portents[0] ?? null,
    antagonistBeat,
    genreBeat,
  };
}

/** Feed regional hostility into divine heat when tension rises. */
export function raiseDivineAttentionFromHostility(game, regionId) {
  if (!game || !regionId) return null;
  const level = getRegionHostility(game, regionId);
  const tier = getHostilityTier(level);
  if (tier.id < 1) return null;
  const amount = Math.min(12, 2 + tier.id * 2);
  return raiseDivineAttention(game, 'hostility_spike', amount);
}
