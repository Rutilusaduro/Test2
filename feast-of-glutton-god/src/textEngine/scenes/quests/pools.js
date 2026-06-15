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

// ─── Side: Sapphire Indulgence (Tier 2, level 5+) ───────────────────────────

registerQuestCopy('quest.side.sapphire.title', ['The Indulgent Countess']);
registerQuestCopy('quest.side.sapphire.desc', [
  'Countess Vesperia enforces orthodoxy in public and craves excess behind velvet masks. The Sapphire Coast could become your herald — or your scandal.',
]);
registerQuestCopy('quest.side.sapphire.stage.court.desc', [
  'Infiltrate the coastal court. Listen for hunger dressed as propriety.',
]);
registerQuestCopy('quest.side.sapphire.stage.court.complete', [
  'Vesperia\'s laugh catches wrong — too bright, too hungry. She has been waiting for someone who will not judge.',
]);
registerQuestCopy('quest.side.sapphire.stage.secret.desc', [
  'Feed her in secret. Let curiosity become craving behind closed doors.',
]);
registerQuestCopy('quest.side.sapphire.stage.secret.complete', [
  'Crumbs on silk. A countess who moans and does not apologize. The coast will never be the same.',
]);
registerQuestCopy('quest.side.sapphire.stage.ball.desc', [
  'Transform the Grand Tide Ball into gospel — public, glorious, impossible to deny.',
]);
registerQuestCopy('quest.side.sapphire.stage.ball.complete', [
  'The ball ends in applause and scandal. Vesperia glows at center court — your coastal herald, whether she admits it or not.',
]);
registerQuestCopy('quest.side.sapphire.complete', [
  'The Indulgent Countess arc closes. Sapphire Coast politics now bend toward abundance.',
]);

// ─── Side: Barrow Voice (Tier 3, level 11+) ───────────────────────────────

registerQuestCopy('quest.side.barrow.title', ['What the Dead Know']);
registerQuestCopy('quest.side.barrow.desc', [
  'Veshanne\'s barrow-oracle remembers what the Wheel forgot — including why the Fat Goddess was excluded at the founding.',
]);
registerQuestCopy('quest.side.barrow.stage.descent.desc', [
  'Descend into oath-carved dark. The inverted hunger waits below.',
]);
registerQuestCopy('quest.side.barrow.stage.descent.complete', [
  'The deeps exhale cold truth. Something older than orthodoxy watches you pass.',
]);
registerQuestCopy('quest.side.barrow.stage.oracle.desc', [
  'Break the golem-seal. Hear what the dead have always known about your patron.',
]);
registerQuestCopy('quest.side.barrow.stage.oracle.complete', [
  'The oracle speaks: the Fat Goddess was deliberately unseated when the Wheel was forged. Your apotheosis is not accident — it is return.',
]);
registerQuestCopy('quest.side.barrow.complete', [
  'What the Dead Know — complete. Act III endings will remember this truth.',
]);

// ─── Side: Iron Forge Master (Tier 2, level 6+) ─────────────────────────────

registerQuestCopy('quest.side.iron_forge.title', ['The Smith Who Would Be Soft']);
registerQuestCopy('quest.side.iron_forge.desc', [
  'Greta\'s old mentor Jorvald views her softness as betrayal of Korthak. Steel must learn that hunger and honor are not enemies.',
]);
registerQuestCopy('quest.side.iron_forge.stage.confront.desc', [
  'Bring Greta to Iron Peak. Face the forge-master who taught her to be lean.',
]);
registerQuestCopy('quest.side.iron_forge.stage.confront.complete', [
  'Jorvald\'s hammer stills. He sees Greta — and sees something he cannot name yet.',
]);
registerQuestCopy('quest.side.iron_forge.stage.trial.desc', [
  'Win his trial by combat. Let philosophy clash before appetite wins.',
]);
registerQuestCopy('quest.side.iron_forge.stage.trial.complete', [
  'Steel rings. Greta speaks gospel; Jorvald listens with a jaw he cannot unclench.',
]);
registerQuestCopy('quest.side.iron_forge.stage.hunger.desc', [
  'Feed the forge-master until iron remembers it was always meant to bend.',
]);
registerQuestCopy('quest.side.iron_forge.stage.hunger.complete', [
  'Jorvald laughs — surprised, ashamed, hungry. Iron Peak will never be lean again.',
]);
registerQuestCopy('quest.side.iron_forge.complete', [
  'The Smith Who Would Be Soft — complete. Greta\'s mentor kneels to abundance.',
]);

// ─── Side: Lumen Apostate (Tier 2, level 7+) ───────────────────────────────

registerQuestCopy('quest.side.lumen_apostate.title', ['The Diviner\'s Heresy']);
registerQuestCopy('quest.side.lumen_apostate.desc', [
  'Theodric Ashwall detected your patron and wants understanding, not a warrant. Intercept the Index before orthodoxy files you away.',
]);
registerQuestCopy('quest.side.lumen_apostate.stage.intercept.desc', [
  'Race the Lumen archivists. Misfile the report — or publish and draw the fire you may want.',
]);
registerQuestCopy('quest.side.lumen_apostate.stage.intercept.complete', [
  'The report stalls in amber ink. Theodric breathes. Sylvie\'s equations smile.',
]);
registerQuestCopy('quest.side.lumen_apostate.stage.map.desc', [
  'Map your patron\'s cosmological position together. Heresy as scholarship.',
]);
registerQuestCopy('quest.side.lumen_apostate.stage.map.complete', [
  'Star-charts curve wrong — beautifully, consistently, undeniably yours.',
]);
registerQuestCopy('quest.side.lumen_apostate.stage.resolve.desc', [
  'Choose: silent ally or published alarm. Either way, the Index will remember.',
]);
registerQuestCopy('quest.side.lumen_apostate.stage.resolve.complete', [
  'Theodric\'s heresy resolves — not forgiven, but filed under truth.',
]);
registerQuestCopy('quest.side.lumen_apostate.complete', [
  'The Diviner\'s Heresy — complete. Lumen\'s laws bend around your anomaly.',
]);

// ─── Side: Tarn Ledger (Tier 2, level 8+) ───────────────────────────────────

registerQuestCopy('quest.side.tarn_ledger.title', ['The Merchant\'s Balance']);
registerQuestCopy('quest.side.tarn_ledger.desc', [
  'Tarn\'s guild-arbiters watch market disruption. Prove abundance increases trade — and sign a pact the ledger can love.',
]);
registerQuestCopy('quest.side.tarn_ledger.stage.audience.desc', [
  'Vesperia opens the guild door. Pensha measures you in margins, not sermons.',
]);
registerQuestCopy('quest.side.tarn_ledger.stage.audience.complete', [
  'Pensha\'s quill pauses. She has not decided — but she is listening.',
]);
registerQuestCopy('quest.side.tarn_ledger.stage.feast.desc', [
  'Hold a communal feast in Market Square. Let commerce taste what conversion buys.',
]);
registerQuestCopy('quest.side.tarn_ledger.stage.feast.complete', [
  'Receipts and revelry. Trade volume swells; the guild pretends it planned this.',
]);
registerQuestCopy('quest.side.tarn_ledger.stage.pact.desc', [
  'Earn informed consent — Tarn\'s phrase for corruption they can audit.',
]);
registerQuestCopy('quest.side.tarn_ledger.stage.pact.complete', [
  'The neutral pact is signed. Jealous nobles will find other markets to sulk in.',
]);
registerQuestCopy('quest.side.tarn_ledger.complete', [
  'The Merchant\'s Balance — complete. Economic immunity settles over the square.',
]);

// ─── Side: Twin Feasts (Tier 3, level 12+) ──────────────────────────────────

registerQuestCopy('quest.side.twin_feasts.title', ['A Tale of Two Feasts']);
registerQuestCopy('quest.side.twin_feasts.desc', [
  'Dawnmere and Grimwatch feud over dwindling plenty. Host rival feasts, arbitrate fallout, unify both in one swollen peace.',
]);
registerQuestCopy('quest.side.twin_feasts.stage.rival.desc', [
  'Compete feasts in heartlands and marches — same day, different hungers.',
]);
registerQuestCopy('quest.side.twin_feasts.stage.rival.complete', [
  'Two villages smell your cooking across the hills. Politics begins to salivate.',
]);
registerQuestCopy('quest.side.twin_feasts.stage.dispute.desc', [
  'Faction blades flash. Settle the dispute before lean pride ruins the table.',
]);
registerQuestCopy('quest.side.twin_feasts.stage.dispute.complete', [
  'Steel yields to sauce. The dispute ends louder than it began — and happier.',
]);
registerQuestCopy('quest.side.twin_feasts.stage.unified.desc', [
  'One joint feast. Five souls blooming across both regions — proof that plenty need not be scarce.',
]);
registerQuestCopy('quest.side.twin_feasts.stage.unified.complete', [
  'Dawnmere and Grimwatch share a table. The heartland exhales unified hunger.',
]);
registerQuestCopy('quest.side.twin_feasts.complete', [
  'A Tale of Two Feasts — complete. Abundance aura settles over both regions.',
]);

// ─── Side: Divine Test (Tier 3, level 14+) ───────────────────────────────────

registerQuestCopy('quest.side.divine_test.title', ['The Patron\'s Proving']);
registerQuestCopy('quest.side.divine_test.desc', [
  'The Fat Goddess sets a direct test — face your own excess in dream-combat, emerge blessed or challenged.',
]);
registerQuestCopy('quest.side.divine_test.stage.rite.desc', [
  'Return to the cradle. Awaken the sacred pool and enter the dream passage.',
]);
registerQuestCopy('quest.side.divine_test.stage.rite.complete', [
  'Golden water folds inward. The DM\'s irony falls silent — for once, earnest.',
]);
registerQuestCopy('quest.side.divine_test.stage.echo.desc', [
  'Face the echo — mirror of your hunger, softer, merciless, yours.',
]);
registerQuestCopy('quest.side.divine_test.stage.echo.complete', [
  'The echo shatters into butter-light. Your patron\'s voice is not amused — she is proud.',
]);
registerQuestCopy('quest.side.divine_test.stage.blessing.desc', [
  'Receive her blessing — growth without apology, hunger made covenant.',
]);
registerQuestCopy('quest.side.divine_test.stage.blessing.complete', [
  'The Fat Goddess touches your brow. You will never be small again — even when you wish you could be.',
]);
registerQuestCopy('quest.side.divine_test.complete', [
  'The Patron\'s Proving — complete. Direct blessing seals your apotheosis path.',
]);

// ─── Side: Korthak Respect (Tier 3, level 13+) ─────────────────────────────

registerQuestCopy('quest.side.korthak_respect.title', ['The Victor\'s Feast']);
registerQuestCopy('quest.side.korthak_respect.desc', [
  'Earn Korthak\'s grudging respect — defeat his Titan honorably, then feast him into satisfied departure.',
]);
registerQuestCopy('quest.side.korthak_respect.stage.challenge.desc', [
  'Greta issues the formal challenge. Korthak\'s law demands spectacle.',
]);
registerQuestCopy('quest.side.korthak_respect.stage.challenge.complete', [
  'Challenge accepted. The marches hold their breath for honest combat.',
]);
registerQuestCopy('quest.side.korthak_respect.stage.combat.desc', [
  'Face the Titan — no tricks, no humiliation. Only strength and its aftermath.',
]);
registerQuestCopy('quest.side.korthak_respect.stage.combat.complete', [
  'The Titan kneels, not broken — surprised. Korthak watches from somewhere distant and does not object.',
]);
registerQuestCopy('quest.side.korthak_respect.stage.feast.desc', [
  'Feed the defeated champion. Send him away full, not shamed.',
]);
registerQuestCopy('quest.side.korthak_respect.stage.feast.complete', [
  'The Titan departs rubbing his belly. Korthak\'s respect is grudging — and real.',
]);
registerQuestCopy('quest.side.korthak_respect.complete', [
  'The Victor\'s Feast — complete. The frontier titan will not hunt you again.',
]);

// ─── Side: Blooming War (Tier 4, level 17+) ────────────────────────────────

registerQuestCopy('quest.side.blooming_war.title', ['When Gods Bleed']);
registerQuestCopy('quest.side.blooming_war.desc', [
  'Before the final confrontation, choose which Wheel gods to convert. Each pathway alters the pantheon\'s last stand.',
]);
registerQuestCopy('quest.side.blooming_war.stage.threshold.desc', [
  'Cross into the divine vestibule — illegal presence made flesh.',
]);
registerQuestCopy('quest.side.blooming_war.stage.threshold.complete', [
  'The threshold yields. Geometry reconsiders you as fact, not error.',
]);
registerQuestCopy('quest.side.blooming_war.stage.convert.desc', [
  'Sylwen through grief, Tarn through deal, Lumen through law — convert whom you can.',
]);
registerQuestCopy('quest.side.blooming_war.stage.convert.complete', [
  'Gods bleed conversion. The final battle will remember who you softened first.',
]);
registerQuestCopy('quest.side.blooming_war.stage.herald.desc', [
  'Break the Herald of Starvation guarding the vestibule heart.',
]);
registerQuestCopy('quest.side.blooming_war.stage.herald.complete', [
  'The herald falls hungry. The Wheel\'s outer hall belongs to abundance now.',
]);
registerQuestCopy('quest.side.blooming_war.complete', [
  'When Gods Bleed — complete. The pantheon\'s last stand weakens with every converted god.',
]);

// ─── Side: Companion Apotheosis (Tier 4, level 19+) ─────────────────────────

registerQuestCopy('quest.side.companion_apotheosis.title', ['Six Who Walk Beside']);
registerQuestCopy('quest.side.companion_apotheosis.desc', [
  'Each companion reaches apotheosis in their home region — devotion made legendary, endings locked in flesh.',
]);
registerQuestCopy('quest.side.companion_apotheosis.stage.six.desc', [
  'Visit each companion\'s homeland at the height of devotion. Witness what walks beside you become divine.',
]);
registerQuestCopy('quest.side.companion_apotheosis.stage.six.complete', [
  'Six apotheoses witnessed. The Conversion Ending now has witnesses worthy of it.',
]);
registerQuestCopy('quest.side.companion_apotheosis.complete', [
  'Six Who Walk Beside — complete. Your pilgrimage was never solitary.',
]);

// ─── Side: Lyra Last Duel (post-Act III ascension arc) ─────────────────────

registerQuestCopy('quest.side.lyra_last_duel.title', ['The Last Duel of Curves']);
registerQuestCopy('quest.side.lyra_last_duel.desc', [
  'Lyra Swiftblade returns at the threshold — jealous rival, Church champion, or cosmic apostate. One last duel decides her fate.',
]);
registerQuestCopy('quest.side.lyra_last_duel.stage.threshold.desc', [
  'Face Lyra where the Wheel meets appetite. She has ascended the way you ascended — and she is furious you got there first.',
]);
registerQuestCopy('quest.side.lyra_last_duel.stage.threshold.complete', [
  'Steel and scripture and hunger collide at the vestibule. Lyra names you rival, lover, or obstacle. The duel is inevitable.',
]);
registerQuestCopy('quest.side.lyra_last_duel.stage.duel.desc', [
  'Fight Lyra in her ascended form — Champion of Measure at lower prestige, Apostate of Excess when the pilgrimage deepens.',
]);
registerQuestCopy('quest.side.lyra_last_duel.stage.duel.complete', [
  'Lyra falls — not broken, softened. The blade clatters; the curves remain. What you do next writes her ending.',
]);
registerQuestCopy('quest.side.lyra_last_duel.stage.fate.desc', [
  'Feed her, flirt with mercy, or crown dominance. Romance or rivalry — the last curve is hers to accept.',
]);
registerQuestCopy('quest.side.lyra_last_duel.stage.fate.complete', [
  'Lyra\'s fate is sealed in flesh and feeling. The tutorial rival becomes epilogue.',
]);
registerQuestCopy('quest.side.lyra_last_duel.ending.lover', [
  'Lyra, Lover — the duel ends in shared hunger. Rivalry becomes devotion; steel becomes silk.',
]);
registerQuestCopy('quest.side.lyra_last_duel.ending.champion', [
  'Lyra, Champion — she kneels not in defeat but allegiance. Your rival walks beside you as sworn blade.',
]);
registerQuestCopy('quest.side.lyra_last_duel.ending.converted', [
  'Lyra, Converted — abundance wins where measure failed. She blooms at the threshold, apostate to appetite.',
]);
registerQuestCopy('quest.side.lyra_last_duel.complete.default', [
  'The Last Duel of Curves — complete. Lyra\'s story no longer mirrors yours from a distance. It touches.',
]);
