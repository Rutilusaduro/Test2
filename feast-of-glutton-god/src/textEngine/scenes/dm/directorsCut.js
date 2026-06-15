import { registerPool } from '../../engine.js';

registerPool('dm.directors_cut', [
  { when: { directorsCutFork: 'vesperia_public' }, text: [
    'DM (Director\'s Cut): You fed Vesperia in public. In another timeline you fed her in secret — she blushed harder there.',
  ]},
  { when: { directorsCutFork: 'vesperia_secret' }, text: [
    'DM (Director\'s Cut): You chose velvet discretion. Elsewhere you fed her on the balcony and the coast still gossips.',
  ]},
  { when: { directorsCutFork: 'lyra_rival' }, text: [
    'DM (Director\'s Cut): Lyra walks as rival. In another save she walks as lover — same blade, softer aftermath.',
  ]},
  { when: { directorsCutFork: 'lyra_lover' }, text: [
    'DM (Director\'s Cut): You claimed Lyra\'s heart. Elsewhere you claimed only her defeat — pride lasts until pastry.',
  ]},
  { when: { directorsCutFork: 'lean_saint_convert' }, text: [
    'DM (Director\'s Cut): You broke the Lean Saint by force. Another pilgrim converted her slowly — famine wept longer.',
  ]},
  { when: { directorsCutFork: 'right_hand' }, text: [
    'DM (Director\'s Cut): Right Hand ending — manifest halved. Elsewhere you ascended together; HP pools shared like dessert.',
  ]},
  { when: { directorsCutFork: 'co_ascendant' }, text: [
    'DM (Director\'s Cut): Co-Ascendant path — shared vitality. In another crown you devoured alone; cosmic foes feared earlier.',
  ]},
  { when: { directorsCutFork: 'devouring' }, text: [
    'DM (Director\'s Cut): Devouring crown — corruption seeds early. Elsewhere you converted continents gently. Slower. Softer.',
  ]},
  { when: { directorsCutFork: 'elara_romance' }, text: [
    'DM (Director\'s Cut): Elara\'s night of abundance. Another timeline kept her inn merely holy — you chose more intimate scripture.',
  ]},
  { when: { directorsCutFork: 'greta_forge' }, text: [
    'DM (Director\'s Cut): Greta\'s forge trial passed. Elsewhere Korthak\'s titan fell first — different metal, same softness.',
  ]},
  { when: { directorsCutFork: 'church_redemption' }, text: [
    'DM (Director\'s Cut): You redeemed hostility with feast. Another route broke crackdowns with dominance — both end in seconds.',
  ]},
  { when: { directorsCutFork: 'wheel_splinter' }, text: [
    'DM (Director\'s Cut): You splintered one gate forever. Elsewhere you solved every puzzle — same road, more paperwork.',
  ]},
  { when: { directorsCutFork: 'companion_echo' }, text: [
    'DM (Director\'s Cut): This pilgrimage carries a companion echo. The last you walked alone longer — tables were quieter.',
  ]},
  { when: { directorsCutFork: 'spell_remnant' }, text: [
    'DM (Director\'s Cut): A spell remnant lingers from your last feast-life. Elsewhere you began spell-poor and learned hunger fresh.',
  ]},
  { when: { directorsCutFork: 'eternal_hall' }, text: [
    'DM (Director\'s Cut): You unlocked the Eternal Hall. In a stingier timeline you stopped at Act III — the tables still waited.',
  ]},
  { when: { directorsCutFork: 'blooming_war' }, text: [
    'DM (Director\'s Cut): Gods converted in the blooming war. Another pilgrim broke heralds first — same vestibule, louder entrance.',
  ]},
  { when: { directorsCutFork: 'prestige_talent' }, text: [
    'DM (Director\'s Cut): You picked feast momentum first. Elsewhere cosmic satiety — AP from heresy, devotion from habit.',
  ]},
  { when: { directorsCutFork: 'no_conversion_ending' }, text: [
    'DM (Director\'s Cut): Lean heresy run — zero cosmic conversions. The Wheel still lost; you simply refused dessert from gods.',
  ]},
  { when: { directorsCutFork: 'dream_echo' }, text: [
    'DM (Director\'s Cut): You faced the dream echo. Another self might have fed it until mirror became menu.',
  ]},
  { when: { directorsCutFork: 'tarn_pact' }, text: [
    'DM (Director\'s Cut): Tarn\'s neutral pact signed. Elsewhere the guild audited you into friendship — contracts taste better with jam.',
  ]},
  { when: { directorsCutFork: 'generic' }, text: [
    'DM (Director\'s Cut): Somewhere else you chose differently. The Fat Goddess keeps all timelines on one menu.',
    'DM (Director\'s Cut): Branch ghosts stir — not regret, just appetite for paths not walked.',
  ]},
]);
