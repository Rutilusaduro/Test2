import { registerPool, createContext, render } from '../../engine.js';

// ── dm.gag.trivialize — OPM gag beats (FULL SENTENCE) ───────────
// Earnest world treats the threat seriously; the outcome is absurd bliss.
registerPool('dm.gag.trivialize', [
  { when: { enemyType: 'purity_inquisitor', region: 'gilded_citadel' }, text: [
    'The Inquisitor levels her blade — then you offer dessert. Genre rules file a formal complaint.',
    'Measured Hand, unmeasured appetite: she ends the fight rounder than her oath ever allowed.',
    'The capital expected a crisis. You brought a pastry tray and won without raising your voice.',
  ]},
  { when: { enemyType: 'purity_inquisitor' }, text: [
    'Steel flashes for heresy — then softness wins. The Wheel was not consulted; neither was she.',
    'An Inquisitor of the Measured Hand, measured now in generous curves and confused gratitude.',
    'She came to end your excess. You ended her resistance with one indulgent, impossible bite.',
  ]},
  { when: { enemyType: 'temple_guardian' }, text: [
    'The guardian plants her spear — you plant a feast in her hands. Duty dissolves into dessert.',
    'Ancient halls expected a siege. You delivered a banquet and called it combat.',
    'Stoic armor, softer middle: the barrow\'s defender forgets why she was angry.',
  ]},
  { when: { enemyType: 'rival_adventurer' }, text: [
    'She swore you would regret this path — then moans through a third helping and surrenders.',
    'Rival adventurer, rival appetite: pride lasts until the pastry does not.',
    'The duel was meant to be epic. It was — for her waistline.',
  ]},
  { when: { enemyType: 'lyra_champion' }, text: [
    'Lyra trained for gods — you trained her appetite. Champion plate creaks; pride submits.',
    'Champion of Measure, measured in pastries now. The Church will need a new poster.',
    'Mythic rival, mythic softness — Lyra\'s blade clatters; her blush does not.',
  ]},
  { when: { enemyType: 'lyra_apostate' }, text: [
    'Cosmic apostate Lyra surrenders at the threshold — law, blade, and corset all undone.',
    'She chose excess. You chose seconds. The Wheel files this under "expected."',
    'Last duel, last curve — Lyra blooms where measure failed, moaning through apostasy.',
  ]},
  { when: { enemyType: 'harvest_harpy' }, text: [
    'Wings beat, claws flash — then crumbs win. The farmyard terror becomes a farmyard regular.',
    'She shrieked menace. You answered with honey. The genre shifted mid-screech.',
    'A harpy of the marches, humbled by hospitality she cannot refuse.',
  ]},
  { when: { enemyType: 'vinebound_dryad' }, text: [
    'Living vines tighten — then loosen around a fuller belly. Nature chooses abundance.',
    'The dryad meant to bind you. You bound her instead, with seconds.',
    'Fertility magic meets your patron\'s appetite. The vines surrender cheerfully.',
  ]},
  { when: { enemyType: 'gluttonous_goblin' }, text: [
    'Even the goblin blinks — out-gluttoned at last. Respect is edible.',
    'She thought she was the hungry one. Cute mistake.',
    'Green skin, greener envy: you eat better than monsters now.',
  ]},
  { when: { enemyType: 'velvet_succubus' }, text: [
    'The succubus offers sin — you offer seconds. Genre rules blush and leave the room.',
    'Temptation meant to drain you instead swells her — horns dipping, tail curling, moan sincere.',
    'Velvet skin, velvet victory: she ends the fight rounder than her contract allowed.',
  ]},
  { when: { enemyType: 'crimson_vampire' }, text: [
    'The countess hisses — then sighs as crumbs win. Undead elegance, very alive appetite.',
    'She came for blood. You brought dessert. The night belongs to abundance.',
    'Fangs flash, then falter. Crimson pride melts into plush, grateful curves.',
  ]},
  { when: { enemyType: 'cathedral_golem' }, text: [
    'Stone softens where you touch — law-construct becoming idol. Aurelan was not consulted.',
    'Marble curves creak into surrender. Even geometry learns to jiggle.',
  ]},
  { when: { enemyType: 'korthak_titan' }, text: [
    'The titan expected war. You served feast. Frontier honor never tasted so soft.',
    'Siege-scale mass, banquet-scale aftermath — she blushes through the harness.',
  ]},
  { when: { escalationTierMin: 2 }, text: [
    'Another dread foe, another snack. The gods are taking notes; you are taking seconds.',
    'The Wheel groans. You pat your belly. Fair exchange.',
    'Mundane terror meets off-genre fullness — comedy writes itself.',
  ]},
  { when: {}, text: [
    'The fight ends not with a scream but a satisfied sigh. The world stays earnest; you do not.',
    'What was meant to stop you instead stops resisting — softer, fuller, happier.',
    'One action, one feast, one foe converted. The dungeon blinks and accepts it.',
    'You trivialized the threat the way only the wrong genre can: with pleasure.',
  ]},
]);

export function renderTrivializeGag(game, combat, enemy, opts = {}) {
  const enemyType = enemy?.typeId || enemy?.type || enemy?.id;
  const ctx = createContext({
    subject: game?.player,
    globals: {
      region: combat?.regionId ?? game?.region,
      enemyType,
      enemyId: enemyType,
      escalationTier: game?.worldFlags?.escalationTier ?? 0,
      ...(opts.globals ?? {}),
    },
    seed: opts.seed,
  });
  return render('{dm.gag.trivialize}', ctx, { trace: opts.trace });
}
