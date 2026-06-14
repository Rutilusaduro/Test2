// ═══════════════════════════════════════════════════════════════
// COMPANION SOFTENING TIERS — level-banded growth observation lines
// Key: npc.companion.softeningTier
//
// Keyed on characterId + levelMin/levelMax (player's level) + corruption.
// weight: 4 convention keeps persona voices dominant.
//
// Implementer wiring:
//   1. Add to TALK_TEMPLATE in npc/talk.js:
//      export const TALK_TEMPLATE = '{npc.talk.greeting} {npc.talk.companion}' +
//        ' {npc.companion.softeningTier} {npc.talk.antagonist} {npc.talk.topic}';
//   2. Pass player level in renderTalk globals:
//      globals: { ..., level: player?.level ?? 1 }
//
// Tier bands: 1-4 (mortal), 5-10 (heroic), 11-16 (mythic), 17-20 (epic/cosmic).
// Shape: DIALOGUE BEAT (attribution + quoted reaction to companion's own growth).
// ═══════════════════════════════════════════════════════════════
import { registerPool } from '../../engine.js';

const W = 4;

registerPool('npc.companion.softeningTier', [

  // ══ MIRA SILVERSTRING (characterId: 0) — Bard, delighted performer ══

  // Tier 1-4 — first blush, playful surprise
  { when: { characterId: 0, levelMin: 1, levelMax: 4, corruption: 0 }, weight: W, text: [
    `Mira tugs her blouse hem and raises an eyebrow. "My tailor is going to have opinions. Many, many opinions."`,
    `She catches herself humming during meals now — harvest hymns that sound suspiciously like invitation.`,
  ]},
  { when: { characterId: 0, levelMin: 1, levelMax: 4, corruption: 1 }, weight: W, text: [
    `"The audience claps louder when I'm rounder," Mira says, as if this is news and not the point. "I'm doing research."`,
    `She pats a belly she didn't have three weeks ago with an expression of pure professional pride.`,
  ]},

  // Tier 5-10 — comfortable softness, stage-keyed confidence
  { when: { characterId: 0, levelMin: 5, levelMax: 10, corruption: 0 }, weight: W, text: [
    `"I've started writing new material," Mira confesses, "about this." She gestures at herself — hips, waist, the whole abundant enterprise.`,
    `Mira leans against a doorframe she used to walk through without thinking. "The Reach has good acoustics," she says. "So does this hallway, now."`,
  ]},
  { when: { characterId: 0, levelMin: 5, levelMax: 10, corruption: [1, 2] }, weight: W, text: [
    `"I wrote a ballad about my hips," Mira announces. "It went viral in four taverns. The tips were magnificent."`,
    `Her performances run longer now — she says it's because the material keeps expanding. She's not wrong, technically.`,
  ]},

  // Tier 11-16 — heroic softness; she's becoming the subject of songs, not just the singer
  { when: { characterId: 0, levelMin: 11, levelMax: 16, corruption: [1, 2] }, weight: W, text: [
    `"Three bards tried to write songs about me this fortnight," Mira says. "None of them used enough adjectives." She is drafting a correction.`,
    `The applause follows her into rooms she hasn't entered yet. She has stopped pretending this is surprising.`,
  ]},
  { when: { characterId: 0, levelMin: 11, levelMax: 16, corruption: 0 }, weight: W, text: [
    `Mira hums as she walks — a slow, satisfied melody that fills the corridor before she does. By a narrow margin.`,
    `"The road songs," she says, "used to be about leaving. Now they're about arriving." She pats her waist with something like awe.`,
  ]},

  // Tier 17-20 — epic/cosmic; she is the living archive of the feast
  { when: { characterId: 0, levelMin: 17, levelMax: 20 }, weight: W, text: [
    `Mira's voice has gained a harmonic — warm, low, the frequency of full rooms. She thinks it's technique. It is more than technique.`,
    `"I'm not sure I'm still a bard," she says thoughtfully. "I think I'm becoming a venue." She doesn't sound dismayed.`,
  ]},

  // ══ LIRA DAWNWELL (characterId: 1) — Cleric, conflicted priestess ══

  // Tier 1-4 — devotional crisis, earnest terror + pull
  { when: { characterId: 1, levelMin: 1, levelMax: 4, corruption: 0 }, weight: W, text: [
    `Lira touches the soft new curve of her belly and prays a verse from Sylwen before remembering which god she's been fed by. She says both.`,
    `"I keep testing myself," she admits quietly. "Weighing my old faith against this. The scales tip differently every morning."`,
  ]},
  { when: { characterId: 1, levelMin: 1, levelMax: 4, corruption: 1 }, weight: W, text: [
    `"Sylwen's measure is a ration," Lira says. "Not a ceiling." She sounds like she is convincing herself, which means the argument is nearly won.`,
    `She folds her vestments around a figure they were not designed for — her hands steadier than her expression.`,
  ]},

  // Tier 5-10 — acclimation arc; finding theology in fullness
  { when: { characterId: 1, levelMin: 5, levelMax: 10, corruption: 1 }, weight: W, text: [
    `"I've stopped apologizing to Sylwen," Lira says. "I've started asking her what she thinks of the new me." There's a pause. "She hasn't answered yet."`,
    `Her divine aura has widened with her hips — she's blessing food without meaning to now, and the blessings are richer than before.`,
  ]},
  { when: { characterId: 1, levelMin: 5, levelMax: 10, corruption: 2 }, weight: W, text: [
    `"Full prayer," Lira says. Not 'my prayer' or 'Sylwen's prayer' — full prayer, as if the two have merged. She smiles like a woman who has stopped fighting and won.`,
    `She catches herself humming harvest hymns while she eats — the same ones from before, but slower, and warmer, and entirely sincere.`,
  ]},

  // Tier 11-16 — devotional synthesis; both gods in her at once
  { when: { characterId: 1, levelMin: 11, levelMax: 16, corruption: [1, 2] }, weight: W, text: [
    `"I think," Lira says carefully, "that Sylwen always meant for harvest to feel like this. I think she's watching and I think she is pleased."`,
    `Her vestments are recut now — she asked the tailor herself, and she gave specifications without trembling.`,
  ]},
  { when: { characterId: 1, levelMin: 11, levelMax: 16, corruption: 0 }, weight: W, text: [
    `"I still grieve the old certainty," she admits. "But I love what replaced it." Lira's grief and hunger occupy the same breath without contradiction.`,
    `Her hands on the holy symbol are soft now — palms plush, grip gentle. The prayer is the same; the body saying it is not.`,
  ]},

  // Tier 17-20 — apotheotic; she is the living schism
  { when: { characterId: 1, levelMin: 17, levelMax: 20 }, weight: W, text: [
    `"Two gods love me," Lira says, with the quiet authority of someone who has checked and confirmed. "I love them back in different registers."`,
    `Her divine aura extends twenty feet now. Pilgrims stop to feel it and sometimes cry. She offers them bread. They always take it.`,
  ]},

  // ══ SYLVARA "SYLVIE" THORNE (characterId: 2) — Wizard, scholar ══

  // Tier 1-4 — data-gathering phase; clinical distance eroding
  { when: { characterId: 2, levelMin: 1, levelMax: 4, corruption: 0 }, weight: W, text: [
    `Sylvie adds a new column to her research notes: "sample variance — self." She underlines it twice before closing the ledger.`,
    `"For science," she repeats, and now it sounds less like a justification and more like a research grant.`,
  ]},
  { when: { characterId: 2, levelMin: 1, levelMax: 4, corruption: 1 }, weight: W, text: [
    `She annotates her own waist measurements in the margin alongside control variables. The handwriting is unusually careful.`,
    `"Hypothesis: desire scales with caloric intake. Results:" — she taps a curve she didn't have at the study's start — "confirmed."`,
  ]},

  // Tier 5-10 — participant-observer; she's fully in the dataset
  { when: { characterId: 2, levelMin: 5, levelMax: 10, corruption: 1 }, weight: W, text: [
    `Sylvie adjusts her spectacles around a face that is rounder than it was when she bought them. "I've had to update my methodology three times," she says. "The subject keeps expanding."`,
    `She's begun scheduling 'empirical sessions' — which is what she calls eating until her belt unbuckles — with academic rigor and personal enthusiasm.`,
  ]},
  { when: { characterId: 2, levelMin: 5, levelMax: 10, corruption: 2 }, weight: W, text: [
    `"The Lumen Index," Sylvie says, setting down a ledger now annotated with jam, "does not account for variables this delightful."`,
    `She closes her notes on her lap — which is more substantial than it was, and provides an excellent desk. She has noted this.`,
  ]},

  // Tier 11-16 — her scholarship becomes the gospel's intellectual arm
  { when: { characterId: 2, levelMin: 11, levelMax: 16, corruption: [1, 2] }, weight: W, text: [
    `Sylvie has published. Three papers. Lumen cited one as dangerous heresy; the other two they haven't read yet, which she finds funnier.`,
    `"The math was always right," she says, resting a hand on a belly that confirms several of her theorems. "I just didn't know what it was for."`,
  ]},
  { when: { characterId: 2, levelMin: 11, levelMax: 16, corruption: 0 }, weight: W, text: [
    `She still flinches before she eats — a small, scholarly hesitation — and then does not stop. "Old data," she says, by way of explanation.`,
    `Her voice has gained the quality of authority that very round women sometimes have: settled, warm, entirely certain of its own weight.`,
  ]},

  // Tier 17-20 — living theorem; she is the proof
  { when: { characterId: 2, levelMin: 17, levelMax: 20 }, weight: W, text: [
    `"I am my own best evidence," Sylvie says, and means it in the most affectionate possible way. The notebook is nearly full.`,
    `She's stopped taking measurements. "The index beyond this point," she explains, "is gesture — not number." She demonstrates with both arms.`,
  ]},

  // ══ THALIA BLACKFEAST (characterId: 3) — Warlock, dominant factor ══

  // Tier 1-4 — she was always going to end up here; first acknowledgment
  { when: { characterId: 3, levelMin: 1, levelMax: 4, corruption: [1, 2] }, weight: W, text: [
    `Thalia reviews the pact's terms with the expression of someone who wrote the clause they're now benefiting from. Which she did.`,
    `"The guild taught me leverage," she says. "The patron taught me appetite. This—" she smooths her blouse "—is the compound interest."`,
  ]},
  { when: { characterId: 3, levelMin: 1, levelMax: 4, corruption: 0 }, weight: W, text: [
    `Thalia moves like a woman waiting for the other shoe to drop — except she's the one who threw the shoe, and she knows exactly where it lands.`,
    `"I signed in butter," she reminds you. She's not complaining. She's documenting.`,
  ]},

  // Tier 5-10 — the pact is paying out exactly as negotiated
  { when: { characterId: 3, levelMin: 5, levelMax: 10, corruption: [1, 2] }, weight: W, text: [
    `"Every pact has terms," Thalia says. "Mine include a renegotiation clause at stage four." She smiles; the renegotiation went her way.`,
    `She counts her new mass with the satisfaction of a factor tallying a good quarter — methodical, pleased, and not remotely surprised.`,
  ]},
  { when: { characterId: 3, levelMin: 5, levelMax: 10, corruption: 0 }, weight: W, text: [
    `Thalia's hedge-witch poise has deepened with her figure — she moves more slowly and more certainly, as if she's decided to take up space as a vocation.`,
    `"The Thin Veil called it wrongness," she says. "The Fat Goddess calls it investment. I know which account is earning."`,
  ]},

  // Tier 11-16 — she is running the feast now; dominant arc cresting
  { when: { characterId: 3, levelMin: 11, levelMax: 16, corruption: 2 }, weight: W, text: [
    `"I've upgraded to a larger chair," Thalia says. "It's a business expense." She sits in it like a throne, which is how she sat in the last one too.`,
    `The pact has made her wealthy in ways that don't fit ledgers. She keeps trying to write them down anyway, out of professional habit.`,
  ]},
  { when: { characterId: 3, levelMin: 11, levelMax: 16, corruption: [0, 1] }, weight: W, text: [
    `Thalia's authority has a new register — still crisply contractual, but warm now, heavy with the gravity of a woman who has truly taken root.`,
    `"The guild would draft a new clause for this," she says. "I already did. It's in the appendix. It is very favorable."`,
  ]},

  // Tier 17-20 — she is the Thin Veil's new anchor; vast and dominant
  { when: { characterId: 3, levelMin: 17, levelMax: 20 }, weight: W, text: [
    `"I'm renegotiating with the patron again," Thalia says. "This time I'm holding the pen." She is not joking. She has the pen.`,
    `The Thin Veil resonates differently near her now — not a wound in the world but a door, and she is holding it open from the inside.`,
  ]},

  // ══ GRETA IRONPOT (characterId: 4) — Fighter, champion of Korthak ══

  // Tier 1-4 — treating growth like a tournament bracket
  { when: { characterId: 4, levelMin: 1, levelMax: 4, corruption: 0 }, weight: W, text: [
    `Greta flexes — the muscle is still there; there's just more around it. "New armor fits weird," she says. "I've stopped minding."`,
    `She approaches meals the way she approaches sparring: with a plan, a pace, and a goal she fully intends to hit.`,
  ]},
  { when: { characterId: 4, levelMin: 1, levelMax: 4, corruption: 1 }, weight: W, text: [
    `"Korthak likes iron," Greta says, patting her rounded gut. "This is just a different kind." She seems convinced. She's right.`,
    `She's started timing her meals with the same discipline she applies to drills. "Personal best," she reports, and means it affectionately.`,
  ]},

  // Tier 5-10 — forge trial ongoing; she's winning it
  { when: { characterId: 4, levelMin: 5, levelMax: 10, corruption: [1, 2] }, weight: W, text: [
    `"Another round!" Greta bellows, and it echoes differently than it did — lower, richer, the acoustics of a fuller hall. She grins at the resonance.`,
    `She benchmarks herself against her stage-one self with the competitive attention she used to reserve for border raiders. The margin is considerable.`,
  ]},
  { when: { characterId: 4, levelMin: 5, levelMax: 10, corruption: 0 }, weight: W, text: [
    `Greta runs her hands over her belly with the assessing expression of a smith checking work. "Solid," she concludes, and moves on.`,
    `The frontier called for lean hard things; she carries them still. They're just deeper now, wrapped in something warmer.`,
  ]},

  // Tier 11-16 — champion of both forge and feast; no contradiction
  { when: { characterId: 4, levelMin: 11, levelMax: 16, corruption: [1, 2] }, weight: W, text: [
    `"Korthak's trials are about endurance," Greta announces. "Feast endurance counts." Her guild has been informed; two members are reconsidering.`,
    `She swings a weapon that should be too heavy for her and doesn't miss. The weight behind the swing has simply changed distribution.`,
  ]},
  { when: { characterId: 4, levelMin: 11, levelMax: 16, corruption: 0 }, weight: W, text: [
    `"I'm still the strongest person in the room," Greta says, looking around a room she fills more than she used to. It remains true.`,
    `The forge-calluses are still there — she runs a thumb over one with the fondness of an old friend. Everything else is newer. All of it is hers.`,
  ]},

  // Tier 17-20 — living argument; her body is the sermon
  { when: { characterId: 4, levelMin: 17, levelMax: 20 }, weight: W, text: [
    `"Tell Korthak I'm still strong," Greta says, belly leading her into the room by a full half-second. "Just louder." No further argument is offered.`,
    `She has outlasted every opponent who thought size and strength were separate categories. She is now the primary counter-evidence.`,
  ]},

  // ══ ELARA WARMBELLY (characterId: 5) — Paladin, frontier host ══

  // Tier 1-4 — she thinks she's just being hospitable
  { when: { characterId: 5, levelMin: 1, levelMax: 4, corruption: 0 }, weight: W, text: [
    `"The portions are bigger because the road is longer," Elara explains, and absolutely believes this.`,
    `She's moved her apron hooks twice this season. "Expanded the kitchen," she says — meaning, correctly, several things.`,
  ]},
  { when: { characterId: 5, levelMin: 1, levelMax: 4, corruption: 1 }, weight: W, text: [
    `Elara doubles the bread recipe and then doesn't bother halving it when there are fewer guests. "Waste not," she murmurs, eating the difference.`,
    `"Sit. Eat." Her command has the weight of someone who has been heeding it herself, and thoroughly.`,
  ]},

  // Tier 5-10 — the hospitality is becoming doctrine
  { when: { characterId: 5, levelMin: 5, levelMax: 10, corruption: 0 }, weight: W, text: [
    `Elara's inn has a waiting list now. She chalks it up to the soup, which has always been good. She is not wrong about the soup.`,
    `"The hearth knows everyone's name," she says, patting the stonework affectionately. "So do I." Her arms, spreading wide, prove the point.`,
  ]},
  { when: { characterId: 5, levelMin: 5, levelMax: 10, corruption: [1, 2] }, weight: W, text: [
    `"I used to think the road demanded lean provisions," Elara says. "The road was wrong." She ladles a third helping as practical theology.`,
    `She sings while she cooks — not harvest hymns but something slower and warmer, a melody she can't name that the patrons hum all week.`,
  ]},

  // Tier 11-16 — frontier matriarch; the inn is a pilgrimage site
  { when: { characterId: 5, levelMin: 11, levelMax: 16, corruption: [0, 1] }, weight: W, text: [
    `The inn has been expanded twice. "Just practicalities," Elara says. She means infrastructure. She also means herself, without quite realizing it.`,
    `Pilgrims arrive asking for her specifically. She feeds them and gives them no credit: "I'm just keeping the hearth," she insists. The hearth is legendary.`,
  ]},
  { when: { characterId: 5, levelMin: 11, levelMax: 16, corruption: 2 }, weight: W, text: [
    `"The Reach will eat well tonight," Elara says, and looks briefly awed by what she's become — then rolls up her sleeves and gets back to it.`,
    `She doesn't think of herself as a saint. Saints, in her understanding, don't eat this much. She is reassessing the category.`,
  ]},

  // Tier 17-20 — she is the hearth; the gospel made warm stone
  { when: { characterId: 5, levelMin: 17, levelMax: 20 }, weight: W, text: [
    `Elara's inn has become a temple, though she still calls it an inn. She replenishes the bread before it runs out — a minor miracle she doesn't notice.`,
    `"The road is hard," she says, voice warm as the oven behind her. "So I feed who I can." She has been feeding everyone, for a very long time.`,
  ]},

  // ── Wildcard fallback — generic companion observation ──────────
  { when: {}, text: [
    `She is softer than she was when you met — and steadier, and more entirely herself.`,
    `The road has changed her. She seems to think that's the point.`,
    `Whatever she used to guard against, she has stopped. The result is this: more of her, warmer, and sure.`,
  ]},
]);
