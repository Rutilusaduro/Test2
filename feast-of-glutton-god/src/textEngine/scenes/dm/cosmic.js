import { registerPool, createContext, render } from '../../engine.js';
import { getEnemyTypeDef } from '../../../gameData/enemies.js';

// ── dm.cosmic.intro — cosmic-tier boss intros (FULL SENTENCE) ────
registerPool('dm.cosmic.intro', [
  { when: { enemyType: 'famine_hag', escalationTierMin: 2 }, text: [
    '★ The air thins. the Lean Saint unfolds — Sylwen\'s sanctioned scourge, famine made flesh, and the first foe in your story that will not be fed.',
    '★ She is not a raid boss for your genre. the Lean Saint is divine law with ribs showing — conversion will not come easy, if it comes at all.',
    '★ the Lean Saint steps from measured shadow. The DM\'s voice drops: this is where the earnest world stops laughing.',
  ]},
  { when: { enemyType: 'famine_hag' }, text: [
    '★ the Lean Saint arrives — rail-thin malice wrapped in Church sanction. Trivialize will not touch her.',
    '★ Famine given a face and a blessing. the Lean Saint hunts your excess like a heresy with teeth.',
    '★ She smells of empty ovens and holy hatred. the Lean Saint — cosmic tier, conversion-immune, very real.',
  ]},
  { when: { enemyType: 'champion_aurelan' }, text: [
    '★ Aurelan\'s Scale-Bearer descends — law and crown braided into one armored answer to your joke.',
    '★ The high king\'s champion burns with measured justice. Steel remembers oaths; your curves do not frighten her yet.',
    '★ God-champion of law — the Wheel sends its first personal reply.',
  ]},
  { when: { enemyType: 'champion_sylwen' }, text: [
    '★ Sylwen\'s Warden rises — harvest plenty weaponized, tragic foil to the Fat Goddess you feed.',
    '★ Right-sized meals made militant. Sylwen\'s champion weeps for the world you are breaking, and fights anyway.',
    '★ Measured plenty given spears. The goddess of the harvest sends her regret in armor.',
  ]},
  { when: { enemyType: 'champion_korthak' }, text: [
    '★ Korthak\'s War-Saint charges — lean valor blessed at the frontier, sent to prove mortal steel still matters.',
    '★ Border-forge faith in plate mail. The war-god\'s champion is all discipline and denial.',
    '★ Frontier sainthood with a spear. Korthak answers your abundance with drilled fury.',
  ]},
  { when: { enemyType: 'champion_veshanne' }, text: [
    '★ Veshanne\'s Barrow-Voice speaks — death and balance given a body that refuses your gospel.',
    '★ Fate weighs you both. Veshanne\'s champion smells of tomb-dust and terrible patience.',
    '★ The keeper of endings sends an ending for your feast — measured, cold, divine.',
  ]},
  { when: { enemyType: 'champion_lumen' }, text: [
    '★ Lumen\'s Lantern Ascetic kindles — star-charts and denial spells woven against your off-genre anomaly.',
    '★ The god who first saw the wrongness sends his answer. Divination becomes blade.',
    '★ Lantern-light hardens into law. Lumen\'s champion reads your fate and does not like the ending.',
  ]},
  { when: { enemyType: 'champion_tarn' }, text: [
    '★ Tarn\'s Scale-Herald arrives — contracts and fair measure turned weapon against limitless feast.',
    '★ Merchant law made champion. Tarn\'s herald tallies what you owe the Wheel.',
    '★ Trade-god justice in motion. Every step counts against your abundance.',
  ]},
  { when: { enemyType: 'wheel_avatar' }, text: [
    '★ The Avatar of the Measured Wheel manifests — six domains braided, radiant, furious, one shared fist.',
    '★ The pantheon speaks in one voice now. The avatar is law, harvest, war, death, knowledge, and trade — aimed at you.',
    '★ Apotheosis weather breaks overhead. The Wheel\'s avatar is what happens when gods stop sending mortals.',
  ]},
  { when: { enemyType: 'pantheon_last_stand' }, text: [
    '★ The Wheel\'s Last Stand — the final shape of a pantheon that knows it is being eaten.',
    '★ Gods and fear and law collapse into one desperate radiance. This is the boss fight the genre promised.',
    '★ The Measured Wheel makes its last argument in steel and starlight. Win, and the divine plane is yours to devour.',
  ]},
  { when: { threatTier: 'cosmic', escalationTierMin: 3 }, text: [
    '★ Cosmic opposition — the earnest world\'s ceiling. Growth resists; favor drains; the DM sounds awed and afraid.',
    '★ Divine-tier violence. The Wheel fights back with real mechanics now, not village panic.',
    '★ Act III energy crackles. A cosmic foe — not fodder, not feed, not a gag.',
  ]},
  { when: { threatTier: 'cosmic' }, text: [
    '★ The fight changes register — cosmic tier, conversion-resistant, favor-hungry.',
    '★ A god-sent obstacle. The narrator stops smirking; the Wheel does not.',
    '★ Cosmic menace takes the field. This one demands tactics, not appetite alone.',
  ]},
  { when: {}, text: [
    '★ Something vast stirs — divine attention made steel.',
    '★ The Wheel answers. The feast hesitates, then burns hotter.',
    '★ Cosmic opposition — the story escalates whether the world is ready or not.',
  ]},
]);

// ── dm.cosmic.outro — cosmic victory beats (FULL SENTENCE) ───────
registerPool('dm.cosmic.outro', [
  { when: { enemyType: 'famine_hag', victoryType: 'win' }, text: [
    '★ the Lean Saint falls — not converted, but broken. The gods learn mortal tools will not suffice.',
    '★ Famine collapses before feast. the Lean Saint\'s defeat echoes in every temple of the Reach.',
    '★ You did not feed her. You survived her. The pantheon takes note, and fear follows.',
  ]},
  { when: { enemyType: 'pantheon_last_stand', victoryType: 'win' }, text: [
    '★ The Wheel\'s Last Stand shatters — triumphant takeover. The divine plane buckles; your patron purrs like thunder.',
    '★ Apotheosis complete in violence and glory. The Measured Wheel is a meal now.',
    '★ You win the story the gods thought they owned. The Reach will never be measured again.',
  ]},
  { when: { enemyType: 'wheel_avatar', victoryType: 'win' }, text: [
    '★ The avatar dissolves — six domains unbraided, screaming. One step closer to enthroned feast.',
    '★ Shared god-fist broken. The Wheel\'s avatar leaves only light and the taste of victory.',
    '★ Avatar shattered. The pantheon has fewer answers left.',
  ]},
  { when: { victoryType: 'win', threatTier: 'cosmic' }, text: [
    '★ Cosmic foe defeated — not trivialized, earned. Divine attention trembles.',
    '★ The Wheel bleeds starlight. Your abundance was the correct genre after all.',
    '★ Victory against the gods\' own champions. The DM exhales, reverent and terrified.',
  ]},
  { when: {}, text: [
    '★ The cosmic threat fades — the tale remembers who broke the Wheel.',
    '★ Divine opposition falters. Your feast continues, louder now.',
    '★ The gods learn your name in a new register: not heresy — apotheosis.',
  ]},
]);

// ── dm.cosmic.ending — apotheosis ending codas (FULL SENTENCE) ───
registerPool('dm.cosmic.ending', [
  { when: { endingId: 'apotheosis_right_hand' }, text: [
    '★ Right Hand — enthroned herald and consort. You rule beside the Fat Goddess; the Reach fattens in your shared shadow.',
    '★ Her voice in your mouth, your hand on her infinite curve. The world kneels to the herald who fed a god into being.',
    '★ Triumphant takeover: you as her right hand, the Wheel\'s corpse still warm beneath the feast tables.',
  ]},
  { when: { endingId: 'apotheosis_co_ascendant' }, text: [
    '★ Co-Ascendant — you rise alongside her, two hungers braided into one divine error the cosmos cannot undo.',
    '★ Not servant, not snack — partner in apotheosis. The Fat Goddess and her native carrier ascend together.',
    '★ The gods fall; you do not merely serve the feast — you become it, beside her.',
  ]},
  { when: { endingId: 'apotheosis_devouring' }, text: [
    '★ The Devouring — the pantheon\'s fall is a meal you savor personally. Every god a course; every law a seasoning.',
    '★ Triumphant villainy from heaven\'s perspective: you ate the Wheel and smiled.',
    '★ Apotheosis as consumption — the Measured Wheel digested, the Reach remade in glutton glory.',
  ]},
  { when: {}, text: [
    '★ Apotheosis — the earnest world ends; the feast eternal begins.',
    '★ Triumphant takeover written in flesh and faith. The narrator bows.',
    '★ The Wheel is broken. Long live the Fat Goddess — and you, who fed her here.',
  ]},
]);

export function renderCosmicIntro(game, combat, opts = {}) {
  const primary = combat.enemies?.[0];
  if (!primary) return '';
  const enemyType = primary.typeId || primary.type || primary.id;
  const def = getEnemyTypeDef(enemyType);
  const ctx = createContext({
    subject: primary,
    ref: game.player,
    globals: {
      enemyType,
      threatTier: def?.threatTier ?? 'mundane',
      escalationTier: game?.worldFlags?.escalationTier ?? 0,
      region: combat.regionId ?? game.region,
      sceneVariant: 'cosmic_intro',
      ...(opts.globals ?? {}),
    },
    seed: opts.seed,
  });
  return render('{dm.cosmic.intro}', ctx, { trace: opts.trace });
}

export function renderCosmicOutro(game, wrapup, opts = {}) {
  const enemy = wrapup.enemies?.[0];
  const enemyType = enemy?.type ?? enemy?.typeId;
  const def = getEnemyTypeDef(enemyType);
  const ctx = createContext({
    subject: game.player,
    ref: game.player,
    globals: {
      enemyType,
      threatTier: def?.threatTier ?? 'mundane',
      victoryType: wrapup.victory === 'converted' ? 'converted' : 'win',
      escalationTier: game?.worldFlags?.escalationTier ?? 0,
      endingId: opts.endingId ?? null,
      ...(opts.globals ?? {}),
    },
    seed: opts.seed,
  });
  return render('{dm.cosmic.outro}', ctx, { trace: opts.trace });
}

export function renderApotheosisEnding(game, endingId, opts = {}) {
  const ctx = createContext({
    subject: game.player,
    globals: {
      endingId,
      escalationTier: game?.worldFlags?.escalationTier ?? 3,
      region: game.region,
      ...(opts.globals ?? {}),
    },
    seed: opts.seed,
  });
  return render('{dm.cosmic.ending}', ctx, { trace: opts.trace });
}
