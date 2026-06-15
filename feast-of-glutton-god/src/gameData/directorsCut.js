/**
 * Director's Cut — branch-ghost narration (Phase 10c).
 */
import { createContext, render } from '../textEngine/engine.js';
import { loadPilgrimageMeta } from './save.js';

const FORK_MAP = [
  { flag: 'lyra_romance', fork: 'lyra_lover' },
  { flag: 'lyra_ally', fork: 'lyra_rival' },
  { flag: 'duel_of_curves_complete', fork: 'lyra_rival' },
  { flag: 'apotheosis_right_hand', fork: 'right_hand' },
  { flag: 'apotheosis_co_ascendant', fork: 'co_ascendant' },
  { flag: 'apotheosis_devouring', fork: 'devouring' },
  { flag: 'elara_romance', fork: 'elara_romance' },
  { flag: 'blooming_war_complete', fork: 'blooming_war' },
  { flag: 'hostility_redemption_complete', fork: 'church_redemption' },
  { flag: 'pilgrimage_seeds_applied', fork: 'companion_echo' },
  { flag: 'eternal_hall_unlocked', fork: 'eternal_hall' },
  { flag: 'dream_echo_faced', fork: 'dream_echo' },
  { flag: 'tarn_neutral_pact', fork: 'tarn_pact' },
];

export function isDirectorsCutAvailable(game) {
  const meta = game?.pilgrimageMeta ?? loadPilgrimageMeta();
  return Boolean(
    game?.settings?.directorsCutEnabled
    && (meta.directorsCutUnlocked || game?.worldFlags?.main_act3_complete),
  );
}

export function pickDirectorsCutFork(game) {
  const sf = game?.player?.storyFlags ?? {};
  const wf = game?.worldFlags ?? {};
  for (const entry of FORK_MAP) {
    if (sf[entry.flag] || wf[entry.flag]) return entry.fork;
  }
  if ((wf.cosmic_conversions ?? 0) === 0 && wf.main_act3_complete) return 'no_conversion_ending';
  if ((wf.prestige_talents ?? []).length) return 'prestige_talent';
  return 'generic';
}

export function renderDirectorsCutLine(game, opts = {}) {
  if (!isDirectorsCutAvailable(game)) return '';
  const fork = opts.fork ?? pickDirectorsCutFork(game);
  const ctx = createContext({
    subject: game?.player,
    globals: {
      directorsCutFork: fork,
      region: game?.region,
    },
    seed: (game.day ?? 1) + fork.length,
  });
  return render('{dm.directors_cut}', ctx, { trace: opts.trace });
}

export function maybeRenderDirectorsCut(game, chance = 0.35) {
  if (!isDirectorsCutAvailable(game)) return '';
  if (Math.random() > chance) return '';
  return renderDirectorsCutLine(game);
}
