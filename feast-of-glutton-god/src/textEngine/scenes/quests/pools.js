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

// ─── Main: The Everfull Awakening ─────────────────────────────────────────────

registerQuestCopy('quest.main.awakening.title', ['The Everfull Awakening']);
registerQuestCopy('quest.main.awakening.desc', [
  'Gorgara stirs beneath the heartlands. Sister Maribel hears the goddess in the wheat — help her spread the gospel of glorious abundance.',
  'A sacred hunger awakens in Fertile Heartlands. The world will grow softer, fuller, and more divine.',
]);

registerQuestCopy('quest.main.awakening.stage.hear.desc', [
  'Speak with Sister Maribel at the harvest shrine. Learn what the Everfull demands of her chosen.',
]);
registerQuestCopy('quest.main.awakening.stage.hear.complete', [
  'Maribel\'s voice trembles with holy hunger. The call of Gorgara rings in your bones — beautiful, inevitable, hungry.',
]);

registerQuestCopy('quest.main.awakening.stage.spread.desc', [
  'Bless Maribel with abundance. Feed Grikka\'s feast-queen greed. Win the sister\'s trust until friendship blooms.',
]);
registerQuestCopy('quest.main.awakening.stage.spread.complete', [
  'The heartlands ripple with new softness — wheat heavy, bellies heavier, laughter warmer. The gospel takes root.',
]);

registerQuestCopy('quest.main.awakening.stage.cradle.desc', [
  'Journey to Gorgara\'s Cradle when the path opens. Offer Maribel a major blessing to awaken the sacred grotto.',
]);
registerQuestCopy('quest.main.awakening.stage.cradle.complete', [
  'Golden light pulses from the cradle. The goddess breathes — and the world inhales with her, ready to swell.',
]);

registerQuestCopy('quest.main.awakening.ending.abundant', [
  'Abundance cascades across the land. Fields fatten, folk blush, and Gorgara\'s smile warms every horizon. You are her beloved herald.',
]);
registerQuestCopy('quest.main.awakening.ending.converted', [
  'Hearts convert faster than waistlines — yet both swell together. The cradle awakens to a chorus of hungry, happy devotion.',
]);
registerQuestCopy('quest.main.awakening.complete.default', [
  'The first act of the Everfull\'s awakening is complete. Greater feasts await — and greater sizes.',
]);

// ─── Side: Flour and Fullness ────────────────────────────────────────────────

registerQuestCopy('quest.side.sylvie.title', ['Flour and Fullness']);
registerQuestCopy('quest.side.sylvie.desc', [
  'Sylvie, the shy baker\'s daughter, sneaks tastes of her own pastries. Help her admit she wants more — of food, of softness, of you.',
]);

registerQuestCopy('quest.side.sylvie.stage.shy.desc', [
  'Talk with Sylvie among the ovens. Flirt gently until flour-dusted cheeks flush with something sweeter than shame.',
]);
registerQuestCopy('quest.side.sylvie.stage.shy.complete', [
  'Sylvie giggles through a mouthful of proofing dough. Shyness melts like butter — appetite remains.',
]);

registerQuestCopy('quest.side.sylvie.stage.sweet.desc', [
  'Feed Sylvie until the bakery smells like desire. Win her trust as her uniform grows snug.',
]);
registerQuestCopy('quest.side.sylvie.stage.sweet.complete', [
  'She licks frosting from her fingers without apology. The ovens are warm; Sylvie is warmer.',
]);

registerQuestCopy('quest.side.sylvie.stage.oven.desc', [
  'Share intimacy among rising bread. Help Sylvie cross into chubby honesty — beautiful, wanted, full.',
]);
registerQuestCopy('quest.side.sylvie.stage.oven.complete', [
  'Steam, sugar, and sighs. Sylvie swells in your arms like perfect dough — soft, golden, yours.',
]);

registerQuestCopy('quest.side.sylvie.ending.romance', [
  'Romance rises with her dough. Sylvie chooses abundance openly — and chooses you between every feast.',
]);
registerQuestCopy('quest.side.sylvie.complete.default', [
  'Sylvie\'s shy hunger becomes celebration. The market smells sweeter when she smiles, rounder and radiant.',
]);

// ─── Side: The Noble Mask ────────────────────────────────────────────────────

registerQuestCopy('quest.side.vesperia.title', ['The Noble Mask']);
registerQuestCopy('quest.side.vesperia.desc', [
  'Lady Vesperia sneers at your gospel — yet watches your hips when she thinks you don\'t notice. Crack the mask.',
]);

registerQuestCopy('quest.side.vesperia.stage.haughty.desc', [
  'Engage Vesperia in conversation. Whisper Gorgara\'s truth until poise falters.',
]);
registerQuestCopy('quest.side.vesperia.stage.haughty.complete', [
  'A noble blush betrays her. The mask slips — hunger peers through, curious and furious.',
]);

registerQuestCopy('quest.side.vesperia.stage.cracked.desc', [
  'Feed Vesperia until haughtiness melts. Nurture curiosity into eager, jiggling enthusiasm.',
]);
registerQuestCopy('quest.side.vesperia.stage.cracked.complete', [
  'Vesperia moans behind a handkerchief and does not wipe the crumbs away. Conversion tastes like cake.',
]);
registerQuestCopy('quest.side.vesperia.complete.default', [
  'The noblewoman kneels to abundance — gracefully, greedily, gloriously. The square will gossip; she will glow.',
]);

// ─── Generic quest beats ─────────────────────────────────────────────────────

registerPool('quest.start', [
  { when: { questType: 'main' }, text: [
    '★ Main Quest begun — the world will remember this abundance.',
    'A sacred thread of story unfurls. Gorgara watches, pleased.',
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
    'Another step toward glorious fullness. Gorgara approves.',
  ]},
]);

registerPool('quest.complete', [
  { when: {}, text: [
    'Quest complete! Celebration ripples through flesh and friendship alike.',
    'The feast closes with sighs of satisfaction — and hunger for more.',
  ]},
]);
