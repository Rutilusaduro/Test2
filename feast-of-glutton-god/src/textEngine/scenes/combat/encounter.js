import { registerPool, createContext, render } from '../../engine.js';
import '../../modules.js';

registerPool('combat.encounter', [
  { when: { enemyId: 'gluttonous_goblin' }, text: [
    'You round a bend and find {enemyCount} gluttonous goblin{enemyPlural} sprawled across the road — green skin, padded hips, and bellies that jiggle with every greedy breath. They smell like honeyed stew and bad intentions.',
    'The DM sets the scene: {enemyCount} curvy goblin{enemyPlural} in the {regionName}, bellies already round, eyes already hungry. They grin like you walked in carrying dessert.',
  ]},
  { when: { enemyId: 'harvest_harpy' }, text: [
    'Winged farm-girls circle above — feathered accents, athletic curves, talons clicking. They swoop low to size you up, laughter sharp as wind through wheat.',
    'Harvest harpies block the sky over {regionName}: lean-waisted for now, but their eyes promise they know exactly how good swelling feels.',
  ]},
  { when: { enemyId: 'vinebound_dryad' }, text: [
    'Living vines coil around a dryad whose hips already swell with fertility magic. She rises from the undergrowth, pear-soft and territorial, petals stuck to damp skin.',
    'A vinebound dryad emerges in {regionName} — nature spirit and appetite braided together. Her belly rounds beneath woven leaves; the grove watches.',
  ]},
  { when: { enemyId: 'temple_guardian' }, text: [
    'Armored priestess-knights stand in formation, stoic and still slim — for now. Their halos are purity; their gauntlets are iron. The temple air tastes like incense and warning.',
    'Temple guardians hold the hall: disciplined bodies, unyielding posture, eyes that measure you as corruption walking on two legs.',
  ]},
  { when: { enemyId: 'rival_adventurer' }, text: [
    'A rival adventurer steps into your path — proud, athletic, furious at what you are becoming. "I won\'t let abundance win," she says, though her gaze lingers on your curves.',
    'Steel meets appetite: a slim rival blocks the way in {regionName}, jaw set, hips narrow, envy barely hidden behind bravado.',
  ]},
  { when: { enemyId: 'lyra_champion' }, text: [
    'Lyra Swiftblade stands crowned in Church steel — mythic champion, mirror of your path, thighs disciplined and eyes blazing. "I trained for gods," she says. "I will not lose to dessert."',
    'Your oldest rival ascended. Lyra Swiftblade, Champion of Measure, blocks the {regionName} with blade high and waist still narrow — for now.',
  ]},
  { when: { enemyId: 'lyra_apostate' }, text: [
    'Lyra waits on the Wheel\'s threshold — voluptuous, cosmic, apostate to excess. Blade in one hand, pastry in the other. "One last duel," she breathes. "Winner feeds the loser."',
    'Lyra Swiftblade, Apostate of Excess — curves crowned, law broken beautifully. The vestibule holds its breath.',
  ]},
  { when: { enemyId: 'purity_inquisitor' }, text: [
    'Inquisitors of the Measured Hand advance in white trim — lean, armored, sincerely convinced your fullness is catastrophe.',
    'Church steel blocks the road in {regionName}: incense, warrants, and horror that does not wink.',
  ]},
  { when: { enemyId: 'famine_hag' }, text: [
    'the Lean Saint unfolds — Sylwen\'s scourge, famine blessed and sent. The air thins; your belly protests anyway, nipples aching at her terrible elegance.',
    'She is all angles and holy hatred: the Lean Saint, rail-thin beauty that should never swell — and yet your magic makes her shiver.',
  ]},
  { when: { enemyId: 'velvet_succubus' }, text: [
    'Shrine-mist curls into a velvet succubus — horns, tail, lacework straining over hourglass curves. She smiles like consent and corruption share a bed.',
    'A patron-leak temptation steps through the thin veil in {regionName}: infernal hips rolling, breasts spilling, voice promising ruinous, willing pleasure.',
  ]},
  { when: { enemyId: 'crimson_vampire' }, text: [
    'A crimson countess drifts from shadow — pale throat offered, corset laced, fangs peeking. Cold skin already warming where your abundance touches the air.',
    'Undead nobility blocks the moon in {regionName}: pear-pale curves, velvet cape parting, hunger older than the Church and far more intimate.',
  ]},
  { when: { enemyId: 'cathedral_golem' }, text: [
    'Marble grinds alive — cathedral golem mass reshaping, sacred reliefs stretching over curves that should not exist in stone. Law made voluptuous, terrifying, edible.',
  ]},
  { when: { enemyId: 'korthak_titan' }, text: [
    'A frontier titan fills the field — war-plate straining over siege-tower thighs, honest fury softening into honest feast-day curiosity.',
  ]},
  { when: { enemyId: 'void_appetite' }, text: [
    'the Inverted Hunger resolves wrong — absence bulging into slick, obscene curves where emptiness used to be. Appetite eating appetite.',
  ]},
  { when: { enemyId: 'avatar_aurelan' }, text: [
    'Aurelan Incarnate manifests — law-goddess curves burning with crown-light, scales tipping as her belly rounds despite cosmic restraint.',
  ]},
  { when: { enemyId: 'bloom_sovereign' }, text: [
    'the Bloom Sovereign rises — rival goddess voluptuous, mirror-hunger devouring light, every curve a theft of your patron\'s dream.',
  ]},
  { when: {}, text: [
    'Combat finds you in {regionName} — foes ahead, abundance in the air, and the DM whispers that this will get messy in the best way.',
    'The battlefield takes shape: enemies waiting, your magic warm in your hands, the feast about to begin in earnest.',
  ]},
]);

export function renderCombatEncounterIntro(game, enemies, opts = {}) {
  const primary = enemies?.[0];
  const enemyId = primary?.typeId ?? primary?.id ?? 'unknown';
  const count = enemies?.filter((e) => e.hp > 0).length ?? 1;
  const ctx = createContext({
    subject: game?.player,
    globals: {
      enemyId,
      enemyName: primary?.name ?? 'foe',
      enemyCount: count,
      enemyPlural: count === 1 ? '' : 's',
      region: opts.regionId ?? game?.region,
      regionName: opts.regionName,
      enemyRole: primary?.role,
      enemyStage: primary?.lbs != null ? Math.round(primary.lbs) : null,
    },
    seed: opts.seed,
  });
  return render('{combat.encounter}', ctx, { trace: opts.trace });
}
