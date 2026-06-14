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
  { when: { enemyId: 'purity_inquisitor' }, text: [
    'Fanatical paladins in white trim advance — hard bodies, harder stares. Incense and judgment roll off them in equal measure.',
    'Purity inquisitors arrive like a cold front: lean, armored, convinced your softness is sin made flesh.',
  ]},
  { when: { enemyId: 'famine_hag' }, text: [
    'An ancient famine hag unfolds from the shadows — rail-thin, cruel, hungry in the worst way. The air chills; your belly protests anyway.',
    'She is all angles and malice: the famine hag, a boss of eternal hunger who hates what the Fat Goddess is doing to the world.',
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
