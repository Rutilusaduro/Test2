/**
 * Quest prose pools — titles, descriptions, stage updates, completions.
 * Shape: FULL SENTENCE per AUTHORING.md.
 */
import { registerPool } from '../../engine.js';

function registerQuestCopy(key, lines) {
  registerPool(key, [
    { when: {}, text: lines },
  ]);
}

// ─── Main: Act I — The Anomaly ───────────────────────────────────────────────

registerQuestCopy('quest.main.first_feast.title', ['The Anomaly']);
registerQuestCopy('quest.main.first_feast.desc', [
  'Harvest\'s Hearth faces an ordinary frontier crisis — raiders, failing harvest, frightened villagers. Solve it your way: by feeding. The earnest world will be baffled, then delighted; Lumen\'s diviners may register the first faint wrongness.',
  'Win the town through abundance, trivializing a "dread" mundane threat, and softening its stern noblewoman. The DM narrator watches with bemused affection.',
]);

registerQuestCopy('quest.main.first_feast.stage.stirring.desc', [
  'Speak with Elara at the inn. Raiders and lean harvests have the village pinched — they expect steel, not supper.',
]);
registerQuestCopy('quest.main.first_feast.stage.stirring.complete', [
  'Elara listens, puzzled and hopeful. The hearth stirs — your off-genre answer to a very normal problem.',
]);

registerQuestCopy('quest.main.first_feast.stage.circle.desc', [
  'Win the trust of Elara, Grikka, and Sylvie. Friendship or conversion — the village\'s circle bends toward fullness.',
]);
registerQuestCopy('quest.main.first_feast.stage.circle.complete', [
  'Laughter returns to kitchens. The town does not understand your methods; it enjoys the results.',
]);

registerQuestCopy('quest.main.first_feast.stage.dread.desc', [
  'Temple guardians are called a dread threat. Trivialize them — one-action OPM pacification on the mundane tier.',
]);
registerQuestCopy('quest.main.first_feast.stage.dread.complete', [
  'Dread becomes dessert. The village cheers; somewhere, a lantern gutters without wind — the first portent.',
]);

registerQuestCopy('quest.main.first_feast.stage.feast.desc', [
  'Host a grand communal feast and help at least four townsfolk advance two size stages. Local gag complete; regional heat not yet.',
]);
registerQuestCopy('quest.main.first_feast.stage.feast.complete', [
  'Tables groan. Bellies bloom. Harvest\'s Hearth sighs in collective satisfaction — a living testament to wrong-genre victory.',
]);

registerQuestCopy('quest.main.first_feast.stage.crown.desc', [
  'Lady Vesperia still clings to austerity. Break her resistance through feeding and growth until authority kneels to abundance.',
]);
registerQuestCopy('quest.main.first_feast.stage.crown.complete', [
  'The noblewoman\'s corset surrenders. Vesperia blushes and smiles — stern no longer, splendidly soft.',
]);

registerQuestCopy('quest.main.first_feast.ending.abundant', [
  'An Aura of Plenty settles over Harvest\'s Hearth. The first act ends as local gag — OP on the mundane, portents on the wind.',
]);
registerQuestCopy('quest.main.first_feast.ending.converted', [
  'Hearts convert faster than waistlines. The town bends; the Wheel has not yet struck back.',
]);
registerQuestCopy('quest.main.first_feast.complete.default', [
  'Act I complete — The Anomaly. The village will never be repressed again, and the gods have begun to notice.',
]);

// ─── Main: Act II — Heat ─────────────────────────────────────────────────────

registerQuestCopy('quest.main.overflowing_temple.title', ['Heat']);
registerQuestCopy('quest.main.overflowing_temple.desc', [
  'As you flip regions, the Inquisition of the Measured Hand mobilizes — checkpoints, purges, propaganda branding you heretic-anomaly. Divine Attention climbs; the gods act through mortals.',
  'Transform the ancient temple, face Church opposition, and survive the Lean Saint — the first foe that cannot be trivialized or fed.',
]);

registerQuestCopy('quest.main.overflowing_temple.stage.approach.desc', [
  'Sister Maribel wavers between Sylwen\'s measured vows and your fullness. Learn how the Church hunts you, then reach the temple ruins.',
]);
registerQuestCopy('quest.main.overflowing_temple.stage.approach.complete', [
  'Marble halls loom ahead. You carry sweeter scripture — and the Inquisition carries warrants.',
]);

registerQuestCopy('quest.main.overflowing_temple.stage.circle.desc', [
  'Convert Maribel and Rootmother Ash. Win the wavering priestess\'s devoted trust while the world heats around you.',
]);
registerQuestCopy('quest.main.overflowing_temple.stage.circle.complete', [
  'The inner circle softens. Holy hunger replaces hollow restraint — regional takeover accelerates.',
]);

registerQuestCopy('quest.main.overflowing_temple.stage.ritual.desc', [
  'Hold a feast within the temple and help Maribel bloom. Let the sanctuary swell while the Church sharpens its knives.',
]);
registerQuestCopy('quest.main.overflowing_temple.stage.ritual.complete', [
  'The temple blooms — vines heavy with fruit, halls warm with steam. Abundance consecrates every stone.',
]);

registerQuestCopy('quest.main.overflowing_temple.stage.warriors.desc', [
  'Inquisition patrols and temple guardians rush to stop you. Defeat or convert them — mortal tools of divine moderation.',
]);
registerQuestCopy('quest.main.overflowing_temple.stage.warriors.complete', [
  'Armor clatters. Mortal opposition breaks — but the gods are watching, and they are alarmed.',
]);

registerQuestCopy('quest.main.overflowing_temple.stage.lean_saint.desc', [
  'The pantheon sends the Lean Saint — Sylwen\'s scourge, cosmic tier, conversion-immune. A real fight. Win it, and the gods learn mortal tools will not suffice.',
]);
registerQuestCopy('quest.main.overflowing_temple.stage.lean_saint.complete', [
  'the Lean Saint falls. The DM\'s voice shakes — not with fear of you, but with respect for what comes next. Act II climax earned.',
]);

registerQuestCopy('quest.main.overflowing_temple.ending.mercy', [
  'You transform the temple with loving mercy. Sanctuary and new clerical gifts flow — the Church fractures, unable to stop you gently.',
]);
registerQuestCopy('quest.main.overflowing_temple.ending.dominance', [
  'You claim the temple through dominance. Its halls belong to appetite — and the Inquisition learns fear.',
]);
registerQuestCopy('quest.main.overflowing_temple.complete.default', [
  'Act II complete — Heat. Mortal opposition failed; cosmic escalation is inevitable.',
]);

// ─── Main: Act III — Apotheosis ──────────────────────────────────────────────

registerQuestCopy('quest.main.coronation.title', ['Apotheosis']);
registerQuestCopy('quest.main.coronation.desc', [
  'At Shrine of the Thin Veil — the wound in the Wheel — your feeding has fattened the Fat Goddess toward materialization. She breaches the divine plane; the pantheon intervenes directly.',
  'Reach apotheotic size, anchor her ascension, and break the Wheel\'s Last Stand. Triumphant takeover awaits.',
]);
registerQuestCopy('quest.main.coronation.stage.cradle.desc', [
  'Seek Thalia where the Thin Veil breathes hunger. Earn her trust before the gods arrive in person.',
]);
registerQuestCopy('quest.main.coronation.stage.cradle.complete', [
  'Thalia\'s eyes burn with pact-fire. "They are coming," she whispers. "Make them dinner."',
]);
registerQuestCopy('quest.main.coronation.stage.spread.desc', [
  'Anchor the breach — grow three souls at the cradle, host a communal feast. Let abundance become climate at the wound in the Wheel.',
]);
registerQuestCopy('quest.main.coronation.stage.spread.complete', [
  'The cradle swells with shared appetite. Reality thins; your patron presses against the divine plane.',
]);
registerQuestCopy('quest.main.coronation.stage.materialization.desc', [
  'Ascend to Tarrasque Matriarch size and witness the Matriarch\'s shadow. Stage 14 anchors her ascension — replacementGoddess stirs.',
]);
registerQuestCopy('quest.main.coronation.stage.materialization.complete', [
  'You stand vast enough to be a throne. the Fat Goddess materializes — hungry, real, and ready to devour the Wheel.',
]);
registerQuestCopy('quest.main.coronation.stage.pantheon.desc', [
  'Break the Wheel\'s Last Stand — the pantheon\'s final confrontation. Cosmic-tier boss design; no trivializing, no easy feeding.',
]);
registerQuestCopy('quest.main.coronation.stage.pantheon.complete', [
  'The Last Stand shatters. Triumphant takeover — the gods\' plane is yours to consume. Choose how you reign.',
]);
registerQuestCopy('quest.main.coronation.ending.right_hand', [
  '★ Right Hand of the Fat Goddess — enthroned herald and consort. The Reach is hers; you rule at her side, awed and adored.',
]);
registerQuestCopy('quest.main.coronation.ending.co_ascendant', [
  '★ Co-Ascendant — you rise alongside her. Two hungers, one apotheosis; the Wheel digested together.',
]);
registerQuestCopy('quest.main.coronation.ending.devouring', [
  '★ The Devouring — you savor the pantheon\'s fall personally. Triumphant villainy from heaven\'s perspective.',
]);
registerQuestCopy('quest.main.coronation.complete.default', [
  'Act III complete — Apotheosis. The earnest world ends; the eternal feast begins. Command mode awaits the enthroned.',
]);

// ─── Divine opposition chain ───────────────────────────────────────────────────

registerQuestCopy('quest.divine.omen.title', ['Lantern Omen']);
registerQuestCopy('quest.divine.omen.desc', [
  'Brother Cael of Lumen\'s temple reads a blank hunger on the star-charts. Hear his warning — the first divine response to your anomaly.',
]);
registerQuestCopy('quest.divine.omen.stage.read.desc', [
  'Seek the diviner in the Gilded Citadel. Learn what the lantern omen means for a native who feeds the wrong god.',
]);
registerQuestCopy('quest.divine.omen.stage.read.complete', [
  'Cael\'s hands tremble on the charts. "You are not in the story we were told," he says — and the Wheel creaks.',
]);
registerQuestCopy('quest.divine.omen.complete', [
  'The omen is heeded. Divine Attention has a face now — yours, reflected in Lumen\'s frightened lantern-light.',
]);

registerQuestCopy('quest.divine.inquisition.title', ['The Measured Hand Strikes']);
registerQuestCopy('quest.divine.inquisition.desc', [
  'The Inquisition mobilizes — checkpoints, purges, Sister Verity\'s indictment. Survive the crackdown and break a patrol.',
]);
registerQuestCopy('quest.divine.inquisition.stage.crackdown.desc', [
  'Reach the Ember Duchy, defeat Inquisition patrols, and face Verity\'s measured wrath.',
]);
registerQuestCopy('quest.divine.inquisition.stage.crackdown.complete', [
  'You survive the crackdown. Propaganda calls you heretic-anomaly; the folk you fed call you salvation.',
]);
registerQuestCopy('quest.divine.inquisition.complete', [
  'The Measured Hand strikes and bruises its knuckles. Mortal opposition escalates — divine opposition follows.',
]);

registerQuestCopy('quest.divine.sylwen.title', ['Sylwen\'s Tragic Foil']);
registerQuestCopy('quest.divine.sylwen.desc', [
  'Sister Maribel embodies Sylwen\'s tragedy — measured plenty against your limitless excess. Hear her lament before the Lean Saint falls.',
]);
registerQuestCopy('quest.divine.sylwen.stage.tears.desc', [
  'Sit with Maribel\'s conflict. She loves Sylwen; she loves fullness too. The Church schism runs through her tears.',
]);
registerQuestCopy('quest.divine.sylwen.stage.tears.complete', [
  'Maribel weeps and smiles. "She sent the Lean Saint," she whispers. "I prayed it would be enough." It will not.',
]);
registerQuestCopy('quest.divine.sylwen.complete', [
  'Sylwen\'s foil confronted. Tragedy deepens the genre clash — earnest faith against your hungry apotheosis.',
]);

registerQuestCopy('quest.divine.champions.title', ['God-Champion Trials']);
registerQuestCopy('quest.divine.champions.desc', [
  'The pantheon sends god-champions — Aurelan\'s law, Lumen\'s denial, Korthak\'s valor. Cosmic-tier fights that resist your usual tricks.',
]);
registerQuestCopy('quest.divine.champions.stage.fall.desc', [
  'Defeat the Scale-Bearer of Aurelan and the Lantern Ascetic of Lumen. Optional: break the War-Saint of Korthak.',
]);
registerQuestCopy('quest.divine.champions.stage.fall.complete', [
  'Champions fall. The gods learn you cannot be swelled like a farm-girl raider. The avatar is next.',
]);
registerQuestCopy('quest.divine.champions.complete', [
  'God-champion trials complete. The Wheel has fewer swords — and more fear.',
]);

registerQuestCopy('quest.divine.council.title', ['The Divine Council Answers']);
registerQuestCopy('quest.divine.council.desc', [
  'The divine council convenes. Shatter the Avatar of the Measured Wheel before the Last Stand.',
]);
registerQuestCopy('quest.divine.council.stage.avatar.desc', [
  'Face the Wheel\'s shared avatar — six domains braided into one radiant executor. Real tactics required.',
]);
registerQuestCopy('quest.divine.council.stage.avatar.complete', [
  'The avatar shatters. Starlight rains. Act III\'s finale draws near — the enthroned feast waits.',
]);
registerQuestCopy('quest.divine.council.complete', [
  'The divine council answered — and lost. The pantheon has one shape left: desperation.',
]);

// ─── Side: The Baker's Indulgence ────────────────────────────────────────────

registerQuestCopy('quest.side.baker.title', ["The Baker's Indulgence"]);
registerQuestCopy('quest.side.baker.desc', [
  'Sylvie denies her own desires between shifts at the oven. Help her bake — and devour — increasingly decadent creations until she embraces how good indulgence feels.',
]);

registerQuestCopy('quest.side.baker.stage.cravings.desc', [
  'Spend time with Sylvie. Talk, flirt, and let her admit the cravings she hides behind flour-dusted modesty.',
]);
registerQuestCopy('quest.side.baker.stage.cravings.complete', [
  'Sylvie giggles through a mouthful of proofing dough. Shyness melts like butter — appetite remains.',
]);

registerQuestCopy('quest.side.baker.stage.decadent.desc', [
  'Feed her pastries rich enough to shame a noblewoman. Guide her through at least two size stages of joyful swelling.',
]);
registerQuestCopy('quest.side.baker.stage.decadent.complete', [
  'She licks frosting from her fingers without apology. The ovens are warm; Sylvie is warmer.',
]);

registerQuestCopy('quest.side.baker.stage.release.desc', [
  'Resolve her internal conflict in intimacy and mutual growth. Leave her happier, fuller, and unashamed.',
]);
registerQuestCopy('quest.side.baker.stage.release.complete', [
  'Steam, sugar, and sighs. Sylvie swells in your arms like perfect dough — soft, golden, radiant.',
]);

registerQuestCopy('quest.side.baker.ending.romance', [
  'Romance rises with her dough. Sylvie chooses abundance openly — and may choose you between every feast.',
]);
registerQuestCopy('quest.side.baker.complete.default', [
  'Sylvie\'s shy hunger becomes celebration. The market smells sweeter when she smiles, rounder and radiant.',
]);

// ─── Side: The Duel of Curves ────────────────────────────────────────────────

registerQuestCopy('quest.side.duel.title', ['The Duel of Curves']);
registerQuestCopy('quest.side.duel.desc', [
  'Lyra Swiftblade believes leanness is strength. Accept her duel — defeat her traditionally or overwhelm her with Growth Damage until she discovers how powerful softness can be.',
]);

registerQuestCopy('quest.side.duel.stage.challenge.desc', [
  'Trade words with the proud warrior. Study her athletic frame — soon to learn the virtues of curve.',
]);
registerQuestCopy('quest.side.duel.stage.challenge.complete', [
  'Lyra\'s jaw sets. The duel is inevitable — and you can already imagine how she\'ll look when it ends.',
]);

registerQuestCopy('quest.side.duel.stage.duel.desc', [
  'Fight Lyra in the market square. Win through steel or swelling — Growth Damage is a valid sermon.',
]);
registerQuestCopy('quest.side.duel.stage.duel.complete', [
  'Lyra pants, stunned — lean lines yielding to new softness. Victory tastes like cream and conquest.',
]);

registerQuestCopy('quest.side.duel.stage.after.desc', [
  'Help her process — and enjoy — her new size. Feed her until pride becomes pleasure.',
]);
registerQuestCopy('quest.side.duel.stage.after.complete', [
  'Lyra flexes a softer arm and laughs in disbelief. Strength remains — it simply jiggles now.',
]);

registerQuestCopy('quest.side.duel.ending.lover', [
  'Respect and desire intertwine. Lyra becomes lover or devoted ally — either way, she trains in your shadow, softer every week.',
]);
registerQuestCopy('quest.side.duel.ending.rival', [
  'Lyra respects the power that reshaped her. A worthy rival — and a splendid sight in sparring gear straining at the seams.',
]);
registerQuestCopy('quest.side.duel.complete.default', [
  'The Duel of Curves concludes. The training grounds welcome a warrior who finally understands abundance.',
]);

// ─── Side: A Night of Shared Abundance ───────────────────────────────────────

registerQuestCopy('quest.side.night.title', ['A Night of Shared Abundance']);
registerQuestCopy('quest.side.night.desc', [
  'Elara has been quietly struggling with desire and body image. She asks for a private evening focused purely on indulgence and mutual growth.',
]);

registerQuestCopy('quest.side.night.stage.invite.desc', [
  'Deepen trust with your companion innkeeper. Accept her vulnerable invitation.',
]);
registerQuestCopy('quest.side.night.stage.invite.complete', [
  'Elara\'s voice drops to a whisper. Tonight, she wants only fullness and honesty — with you.',
]);

registerQuestCopy('quest.side.night.stage.evening.desc', [
  'Share a private feast. Feed each other until the kitchen steam mirrors your rising heat.',
]);
registerQuestCopy('quest.side.night.stage.evening.complete', [
  'Plates empty. Bellies round. Elara sighs against your shoulder — content, curious, craving more.',
]);

registerQuestCopy('quest.side.night.stage.mutual.desc', [
  'Intimacy and mutual growth. Help her reach a new size stage comfortably, joyfully, together.',
]);
registerQuestCopy('quest.side.night.stage.mutual.complete', [
  'Candlelight on new curves. Elara\'s laughter is low and lush — a bond deepened in pleasure.',
]);

registerQuestCopy('quest.side.night.complete.default', [
  'A Night of Shared Abundance lingers in memory and waistlines alike. Elara glows — and so do you.',
]);

// ─── Side: The Reluctant Noblewoman ──────────────────────────────────────────

registerQuestCopy('quest.side.noblewoman.title', ['The Reluctant Noblewoman']);
registerQuestCopy('quest.side.noblewoman.desc', [
  'Lady Vesperia sneers at common indulgence — yet watches your hips when she thinks you don\'t notice. Change her mind, and her figure, through escalating encounters.',
]);

registerQuestCopy('quest.side.noblewoman.stage.gates.desc', [
  'Gain access through charm and flattery. Crack the mask of haughty poise.',
]);
registerQuestCopy('quest.side.noblewoman.stage.gates.complete', [
  'A noble blush betrays her. The gates of the estate open — hunger peers through, curious and furious.',
]);

registerQuestCopy('quest.side.noblewoman.stage.escalate.desc', [
  'Feed Vesperia in secret. Whisper gospel past her pride until curiosity becomes craving.',
]);
registerQuestCopy('quest.side.noblewoman.stage.escalate.complete', [
  'Vesperia moans behind a handkerchief and does not wipe the crumbs away. Conversion tastes like cake.',
]);

registerQuestCopy('quest.side.noblewoman.stage.transform.desc', [
  'Bless her with decadent abundance. Guide a dramatic, pleasurable transformation worthy of gossip and glory.',
]);
registerQuestCopy('quest.side.noblewoman.stage.transform.complete', [
  'The noblewoman kneels to abundance — gracefully, greedily, gloriously. Silk strains; poise surrenders.',
]);

registerQuestCopy('quest.side.noblewoman.complete.default', [
  'Vesperia becomes a softer ally with political reach. The square will gossip; she will glow.',
]);

// ─── Generic quest beats ─────────────────────────────────────────────────────

registerPool('quest.start', [
  { when: { questType: 'main' }, text: [
    '★ Main Quest begun — the world will remember this abundance.',
    'A sacred thread of story unfurls. the Fat Goddess watches, pleased.',
  ]},
  { when: { questType: 'side' }, text: [
    'Side quest accepted — a personal feast of connection awaits.',
    'A smaller story, intimate and hungry. Perfection in miniature.',
  ]},
  { when: {}, text: ['A new quest begins — may it end softer than it started.'] },
]);

registerPool('quest.stage_complete', [
  { when: {}, text: [
    'Quest stage complete — abundance accumulates like honey.',
    'Another step toward glorious fullness. the Fat Goddess approves.',
  ]},
]);

registerPool('quest.complete', [
  { when: {}, text: [
    'Quest complete! Celebration ripples through flesh and friendship alike.',
    'The feast closes with sighs of satisfaction — and hunger for more.',
  ]},
]);

registerQuestCopy('quest.side.paths.title', ['Paths of Abundance']);
registerQuestCopy('quest.side.paths.desc', [
  'Elara whispers of strange obstacles across the land — doors that demand cleverness, ravines that hunger for growth. She believes you can solve them all with abundance, not violence.',
]);
registerQuestCopy('quest.side.paths.stage.discover.desc', [
  'Find a regional mystery and examine it. Then solve it — by spell, skill, size, bond, or any delicious combination.',
]);
registerQuestCopy('quest.side.paths.stage.discover.complete', [
  'Elara claps her flour-dusted hands. "See? The world bends to those who think with their bellies *and* their brilliance."',
]);
registerQuestCopy('quest.side.paths.stage.master.desc', [
  'Solve three mysteries across the regions. Each one teaches the land that abundance is clever, sensual, and unstoppable.',
]);
registerQuestCopy('quest.side.paths.stage.master.complete', [
  'Word spreads: the Chosen solves problems the way the Fat Goddess intended — with pleasure, growth, and glorious ingenuity.',
]);
registerQuestCopy('quest.side.paths.complete', [
  'Paths of Abundance complete. You are a problem-solver of divine appetite — and the world is softer for it.',
]);

// ─── Side: Hostility Redemption ───────────────────────────────────────────────

registerQuestCopy('quest.side.redemption.title', ['Amends to the Hearth']);
registerQuestCopy('quest.side.redemption.desc', [
  'Prove fullness can be consensual again: feast communally, speak gently, and survive the Inquisition hunters — then mercy may reopen what crackdown sealed.',
]);
registerQuestCopy('quest.side.redemption.stage.earn.desc', [
  'Prove abundance can be consensual again: feast communally, speak gently, and survive the inquisitors who hunt you.',
]);
registerQuestCopy('quest.side.redemption.stage.earn.complete', [
  'Suspicion eases — not forgiven entirely, but willing to listen. One more step toward clearing the crackdown.',
]);
registerQuestCopy('quest.side.redemption.complete', [
  'Amends accepted. Larders unlock, patrols thin, and the region remembers that your gift can be tender again.',
]);
