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

// ─── Main: The First Feast of the Fat Goddess ─────────────────────────────────────────

registerQuestCopy('quest.main.first_feast.title', ['The First Feast of the Fat Goddess']);
registerQuestCopy('quest.main.first_feast.desc', [
  'Harvest\'s Hearth has grown stagnant and repressed — bellies pinched, laughter muted. Awaken the Fat Goddess\'s first major node by befriending the town\'s influential women, hosting a communal feast, and softening its stern noblewoman.',
  'Spread abundance until the entire settlement visibly flourishes. Growth, feeding, blessing, and conversion are all paths to glory.',
]);

registerQuestCopy('quest.main.first_feast.stage.stirring.desc', [
  'Speak with Elara Warmbelly at the inn. The town\'s warmth has gone thin — someone must remind it how good fullness feels.',
]);
registerQuestCopy('quest.main.first_feast.stage.stirring.complete', [
  'Elara\'s eyes glisten with hope and hunger. The hearth stirs — the Fat Goddess\'s influence prickles at the edges of every loaf and every waistline.',
]);

registerQuestCopy('quest.main.first_feast.stage.circle.desc', [
  'Win the trust of three influential women: Elara the innkeeper, Grikka the feast-queen, and Sylvie the baker. Friendship or conversion — abundance accepts both.',
]);
registerQuestCopy('quest.main.first_feast.stage.circle.complete', [
  'The town\'s circle bends toward you. Laughter returns to kitchens and market stalls alike — softer, fuller, hungrier.',
]);

registerQuestCopy('quest.main.first_feast.stage.feast.desc', [
  'Host a grand communal feast and help at least four townsfolk advance two size stages through feeding, blessing, intimacy, or combat conversion.',
]);
registerQuestCopy('quest.main.first_feast.stage.feast.complete', [
  'Tables groan. Bellies bloom. The settlement sighs in collective satisfaction — a living testament to the Fat Goddess\'s gospel.',
]);

registerQuestCopy('quest.main.first_feast.stage.crown.desc', [
  'Lady Vesperia still clings to austerity and poise. Break her resistance through feeding, flattery, and glorious growth until authority kneels to abundance.',
]);
registerQuestCopy('quest.main.first_feast.stage.crown.complete', [
  'The noblewoman\'s corset surrenders. Vesperia blushes, moans, and smiles — stern no longer, splendidly soft.',
]);

registerQuestCopy('quest.main.first_feast.ending.abundant', [
  'An Aura of Plenty settles over Harvest\'s Hearth. Wheat fattens, folk glow, and the Fat Goddess\'s first feast echoes through the land. Your own limits swell in answer.',
]);
registerQuestCopy('quest.main.first_feast.ending.converted', [
  'Hearts convert faster than waistlines — yet both swell together. The town\'s authority bends, and a new region opens to your pilgrimage.',
]);
registerQuestCopy('quest.main.first_feast.complete.default', [
  'The First Feast of the Fat Goddess is complete. The town will never be repressed again — and neither will you.',
]);

// ─── Main: The Overflowing Temple ────────────────────────────────────────────

registerQuestCopy('quest.main.overflowing_temple.title', ['The Overflowing Temple']);
registerQuestCopy('quest.main.overflowing_temple.desc', [
  'An ancient temple of restraint and denial resists the Fat Goddess\'s awakening. Transform it into a sanctuary of indulgence — convert the priestess circle, bloom the halls with ritual abundance, and face ascetic warriors who would stop you.',
]);

registerQuestCopy('quest.main.overflowing_temple.stage.approach.desc', [
  'Sister Maribel knows the temple\'s fanatics. Learn their weaknesses, then reach the crumbling ruins where denial still holds power.',
]);
registerQuestCopy('quest.main.overflowing_temple.stage.approach.complete', [
  'Marble halls loom ahead, inscribed with fasting rites. You carry sweeter scripture in your hands and your hips.',
]);

registerQuestCopy('quest.main.overflowing_temple.stage.circle.desc', [
  'Convert Maribel and Rootmother Ash through personal growth encounters. Win the high priestess\'s devoted trust.',
]);
registerQuestCopy('quest.main.overflowing_temple.stage.circle.complete', [
  'The inner circle softens. Vows of denial melt into moans of pleasure — holy hunger replaces hollow restraint.',
]);

registerQuestCopy('quest.main.overflowing_temple.stage.ritual.desc', [
  'Hold a feast within the temple and help Maribel bloom to plump abundance. Let the sanctuary swell with visible, divine indulgence.',
]);
registerQuestCopy('quest.main.overflowing_temple.stage.ritual.complete', [
  'The temple blooms — vines heavy with fruit, halls warm with steam and sighs. Abundance consecrates every stone.',
]);

registerQuestCopy('quest.main.overflowing_temple.stage.warriors.desc', [
  'Ascetic guardians rush to stop the ritual. Defeat or convert them — Growth Damage and conventional valor both serve the Fat Goddess.',
]);
registerQuestCopy('quest.main.overflowing_temple.stage.warriors.complete', [
  'Armor clatters. The last ascetic kneels — converted or conquered — and the sanctuary is yours to fill.',
]);

registerQuestCopy('quest.main.overflowing_temple.ending.mercy', [
  'You transform the temple with loving mercy. It becomes a sanctuary where indulgence is worship, and new clerical and warlock gifts flow to the faithful.',
]);
registerQuestCopy('quest.main.overflowing_temple.ending.dominance', [
  'You claim the temple through glorious dominance. Its halls belong to appetite now — and so do powerful new spells for Cleric and Warlock.',
]);
registerQuestCopy('quest.main.overflowing_temple.complete.default', [
  'The Overflowing Temple stands transformed. Denial is memory; abundance is eternal.',
]);

// ─── Main: Coronation of Abundance (Act III) ─────────────────────────────────

registerQuestCopy('quest.main.coronation.title', ["Coronation of Abundance"]);
registerQuestCopy('quest.main.coronation.desc', [
  'At Shrine of the Thin Veil, Thalia whispers of a final rite — crown your abundance and awaken the goddess fully.',
  'The world has been softened. Now it must be transformed. Your body, your gospel, your feast become legend.',
]);
registerQuestCopy('quest.main.coronation.stage.cradle.desc', [
  'Seek Thalia Blackfeast where the cradle breathes hunger. Earn her intimate trust before the rite begins.',
]);
registerQuestCopy('quest.main.coronation.stage.cradle.complete', [
  'Thalia\'s eyes burn with pact-fire and want. "You are ready," she purrs. "Let us make a god of your softness."',
]);
registerQuestCopy('quest.main.coronation.stage.spread.desc', [
  'Spread overflow through the cradle — grow three souls, host a communal feast, let abundance become climate.',
]);
registerQuestCopy('quest.main.coronation.stage.spread.complete', [
  'The cradle swells with shared appetite. Steam, moans, and jiggling flesh sanctify the land.',
]);
registerQuestCopy('quest.main.coronation.stage.coronation.desc', [
  'Ascend to enormous size and break the famine spirits that cling to old hunger. Crown yourself in flesh and faith.',
]);
registerQuestCopy('quest.main.coronation.stage.coronation.complete', [
  'You stand vast and radiant — a living throne of abundance. the Fat Goddess\'s voice thunders: "More."',
]);
registerQuestCopy('quest.main.coronation.ending.avatar', [
  '★ Avatar of the Fat Goddess — you are the goddess made walkable, kissable, infinitely feastable.',
]);
registerQuestCopy('quest.main.coronation.ending.herald', [
  '★ Herald of the Eternal Feast — your gospel converts nations; your body is the scripture.',
]);
registerQuestCopy('quest.main.coronation.complete.default', [
  'Act III complete. The world will never be thin again — and every soul is grateful.',
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
  'The region has turned against your reckless growth. Hold a feast, mend bonds, and face the purity hunters — then mercy may reopen what crackdown sealed.',
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
