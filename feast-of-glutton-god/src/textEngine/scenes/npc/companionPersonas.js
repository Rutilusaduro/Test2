/**
 * Companion persona voices — world-natives drawn into the off-genre feast.
 * Keyed on characterId (numericId) + corruption tier; weight 4 convention in growth personas.
 */
import { registerPool } from '../../engine.js';

const W = 4;

// ── Companion talk beats (append via TALK_TEMPLATE) ──────────────

registerPool('npc.talk.companion', [
  // Mira — delighted bard
  { when: { characterId: 0, corruption: 0 }, weight: W, text: [
    'Mira plucks a nervous chord. "They used to tip me for harvest hymns. Now they tip me to stay — and eat."',
    '"I thought adventuring was all goblins and glory," she laughs. "Turns out it\'s also second dessert."',
  ]},
  { when: { characterId: 0, corruption: 1 }, weight: W, text: [
    '"Write me a verse about your hips," she grins. "The Reach isn\'t ready. I am."',
    'She hums while her waistband creaks — earnest stagecraft giving way to earnest appetite.',
  ]},
  { when: { characterId: 0, corruption: 2 }, weight: W, text: [
    '"Another chorus," she demands, patting her belly. "The Wheel can keep its moderation. I\'ll keep the encore."',
    'Mira treats fullness like applause — loud, deserved, and never enough.',
  ]},

  // Lira — conflicted Sylwen priestess
  { when: { characterId: 1, corruption: 0 }, weight: W, text: [
    'Lira folds her stole tight. "Sylwen teaches measured plenty. You teach… more." Her voice cracks on the last word.',
    '"I prayed for harvest," she whispers. "Not for this heat in my ribs when you look at me."',
  ]},
  { when: { characterId: 1, corruption: 1 }, weight: W, text: [
    '"If the grove saw me now…" She does not finish. Her hand rests on a belly that no longer feels like sin — only scary.',
    'She recites a Sylwen verse from memory, then blushes because her body answered the prayer wrong.',
  ]},
  { when: { characterId: 1, corruption: 2 }, weight: W, text: [
    '"I still love Her," Lira says of Sylwen — "but I love this too." Earnest tears, earnest hunger.',
    'Her priestess\'s poise is gone. What remains is softer, hungrier, and terribly sincere.',
  ]},

  // Sylvie — Lumen scholar
  { when: { characterId: 2, corruption: 0 }, weight: W, text: [
    'Sylvie taps her ledger. "Lumen\'s charts show an anomaly. I appear to be… part of the dataset."',
    '"For science," she says, too quickly, as crumbs fall on her notes.',
  ]},
  { when: { characterId: 2, corruption: 1 }, weight: W, text: [
    '"Hypothesis: caloric transfer scales with devotion." She pushes her spectacles up. "Results: promising."',
    'She cites court precedent for indulgence the way other wizards cite fireball.',
  ]},
  { when: { characterId: 2, corruption: 2 }, weight: W, text: [
    '"Peer review can wait." Sylvie closes the book on her lap — and opens her mouth for more.',
    'The Lumen Index was never meant to include waist measurements. She adds another column anyway.',
  ]},

  // Thalia — guild witch
  { when: { characterId: 3, corruption: 0 }, weight: W, text: [
    'Thalia counts souls like coin. "Tarn taught me contracts. Your patron taught me appetite. I prefer the interest."',
    '"The Veil is thin here," she murmurs. "So am I — for now."',
  ]},
  { when: { characterId: 3, corruption: 1 }, weight: W, text: [
    '"Every pact has terms." She smiles. "Mine include dessert."',
    'She moves like a factor who won the negotiation — hips included in the settlement.',
  ]},
  { when: { characterId: 3, corruption: 2 }, weight: W, text: [
    '"The guild would faint." Thalia laughs, vast and unrepentant. "Let them. I signed in butter."',
    'Hedge-witch, feast-queen, earnest blasphemer — she wears all three titles comfortably.',
  ]},

  // Greta — Korthak champion
  { when: { characterId: 4, corruption: 0 }, weight: W, text: [
    'Greta flexes. "Korthak likes lean steel. You like… this." She pats her gut, uncertain, intrigued.',
    '"I\'ve held the line at marches. Never held a belt this honest."',
  ]},
  { when: { characterId: 4, corruption: 1 }, weight: W, text: [
    '"Another round!" she bellows. "If war is discipline, feasting is the better drill sergeant."',
    'Forge-calluses on softening palms — she treats growth like a tournament bracket.',
  ]},
  { when: { characterId: 4, corruption: 2 }, weight: W, text: [
    '"Tell Korthak I\'m still strong." She grins, belly leading the charge. "Just… louder."',
    'Champion of the anvil, champion of the oven — she sees no contradiction, only victory.',
  ]},

  // Elara — frontier host
  { when: { characterId: 5, corruption: 0 }, weight: W, text: [
    'Elara wipes a counter that never stays clean. "Pilgrims need stew. You need… more stew. Same duty."',
    '"I\'m just keeping the hearth," she insists — earnest, maternal, already simmering.',
  ]},
  { when: { characterId: 5, corruption: 1 }, weight: W, text: [
    '"Sit. Eat." Her command is paladin-plain. "The road is hard. So is my cooking. Both help."',
    'She ladles portions the way others bless wounds — without fuss, without end.',
  ]},
  { when: { characterId: 5, corruption: 2 }, weight: W, text: [
    '"The Reach will eat well tonight." Elara\'s smile could warm a march in winter.',
    'Frontier host, feast matron — she still thinks she\'s only doing her job. The job is gospel now.',
  ]},

  { when: {}, text: [
    'She listens — a companion on the road, still learning what your feast means.',
    'The conversation turns to food, faith, and the widening Reach.',
    'Earnest words between travelers who are changing together.',
  ]},
]);

// ── Lira consent / resistance (softening showcase) ───────────────

registerPool('npc.companion.lira.resist', [
  { when: { characterId: 1, corruption: 0, consentState: 'forced' }, weight: W, text: [
    '"Please — Sylwen sees—" Lira\'s prayer breaks as fullness wins anyway. Her horror is real; so is the swell.',
    'She crosses herself with shaking fingers. The blessing does not stop her hips from answering you.',
  ]},
  { when: { characterId: 1, corruption: 0, gainDesireMin: 25 }, weight: W, text: [
    '"I shouldn\'t want this." Lira\'s whisper is earnest agony. "Tell me I\'m still Her priestess."',
    'Desire wars with doctrine — she leans in, then pulls back, then leans in again.',
  ]},
  { when: { characterId: 1, corruption: 1, gainDesireMin: 50 }, weight: W, text: [
    '"If this is blasphemy…" She exhales, trembling. "…then bless me harder."',
    'Consent arrives like harvest — slow, golden, undeniable.',
  ]},
  { when: {}, text: [
    'She breathes through the moment — conflicted, sincere, still hers.',
    'Doctrine and desire share the same bench for now.',
    'The Wheel was not built for feelings this honest.',
  ]},
]);
