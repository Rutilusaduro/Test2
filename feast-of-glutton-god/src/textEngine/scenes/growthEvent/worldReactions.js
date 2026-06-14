// ═══════════════════════════════════════════════════════════════
// WORLD GROWTH REACTIONS — concrete, locale-specific environmental prose.
// No size stage names; physical consequences only.
// ═══════════════════════════════════════════════════════════════
import { registerPool, createContext, render } from '../../engine.js';

registerPool('wr.primary', [
  { when: {}, text: [''] },

  // ── village inn / tavern ─────────────────────────────────────
  { when: { locale: 'village_inn', endStageMin: 4, endStageMax: 6 }, weight: 3, text: [
    'Floorboards groan under {subject.first}; a mug rattles off the nearest table and shatters against the hearth.',
    'Patrons scoot their stools back as {they} swell — the bar rail bows outward with a protesting creak.',
  ] },
  { when: { locale: 'village_inn', endStageMin: 7, endStageMax: 8 }, weight: 3, text: [
    'Tables overturn as {subject.first} expands; ale sloshes across planks while regulars scramble over benches.',
    '{subject.first} fills the taproom aisle — shoulders brush rafters, and the hanging lantern swings wild on its chain.',
  ] },
  { when: { locale: 'village_inn', endStageMin: 9, endStageMax: 10 }, weight: 3, text: [
    'The common room buckles around {subject.first}: floor joists crack, bottles rain from shattered shelves, and the whole bar counter splinters under {their} settling weight.',
    'Soft flesh spills between support posts; patrons are gently — then not-so-gently — pushed aside by expanding curves until the inn feels rearranged around one body.',
  ] },
  { when: { locale: 'village_inn', role: 'innkeeper', endStageMin: 11 }, weight: 4, text: [
    '{subject.first} crushes the entire bar beneath {them} — floorboards collapse, kegs burst, and the building groans as if the hearth itself were being smothered.',
    'The innkeeper\'s growth collapses the taproom: roof timbers crack, bottles shatter in waves, and patrons clamber over plush hills of body to reach the door.',
  ] },
  { when: { locale: 'village_inn', endStageMin: 11 }, weight: 3, text: [
    'The Harvest Hearth inn buckles — walls crack, the chimney coughs dust, and what was a cozy room is now a crater of splintered wood cradling impossible softness.',
    'Roof beams snap; the whole building lists as {subject.first} settles in place, too vast for any tavern ever built.',
  ] },
  { when: { locale: 'village_inn', endStageMin: 13 }, weight: 2, text: [
    'The village inn is gone under {subject.first} — only rafters and a smoking chimney remain above rolling flesh that has swallowed the square.',
  ] },

  // ── crowded market ─────────────────────────────────────────────
  { when: { locale: 'crowded_market', endStageMin: 4, endStageMax: 6 }, weight: 3, text: [
    'A fruit stall tilts as {subject.first} swells; apples roll through the dust while the vendor yelps and grabs {their} awning pole.',
    'Canvas awnings snap taut above {them}; shoppers press back against crates, whispering at the sudden theft of alley space.',
  ] },
  { when: { locale: 'crowded_market', endStageMin: 7, endStageMax: 9 }, weight: 3, text: [
    'Stalls collapse in sequence — canvas tears, wooden frames splinter, and the market lane becomes a canyon walled by {subject.first}\'s hips.',
    'Merchants shout as carts are pinned beneath expanding softness; coins scatter across cobbles crushed under new weight.',
  ] },
  { when: { locale: 'crowded_market', endStageMin: 10 }, weight: 3, text: [
    'The market square reshapes around {subject.first}: fountain stones crack, the central plaza flagstones sink, and hawkers flee before the swell buries their booths.',
    'Half the square vanishes under plush immensity — awnings, barrels, and bread baskets flattened into the cobbles.',
  ] },

  // ── narrow frontier lane / alley ───────────────────────────────
  { when: { locale: 'frontier_road', endStageMin: 9, endStageMax: 10 }, weight: 3, text: [
    '{subject.first} wedges between timber buildings — stone foundations groan, plaster cracks, and townsfolk climb crates to peer over {their} shoulder.',
    'The narrow lane pinches {them} on both sides; walls spiderweb with fractures where soft flesh insists on more room.',
  ] },
  { when: { locale: 'frontier_road', endStageMin: 11 }, weight: 3, text: [
    '{subject.first} is stuck between buildings at last — rooflines buckle outward, shutters pop, and the lane becomes impassable except over and around {them}.',
    'Stone walls crack under lateral pressure; someone drops a rope ladder from a second-story window to cross above the swell.',
  ] },

  // ── coastal manor / noble parlor ───────────────────────────────
  { when: { locale: 'coastal_manor', endStageMin: 5, endStageMax: 7 }, weight: 3, text: [
    'Parlor chairs splinter beneath {subject.first}; gilt mirrors tilt as floorboards complain under aristocratic softness.',
    'A servant drops a silver tray — {they} no longer fit the settee, and the doorway already looks like a cruel joke.',
  ] },
  { when: { locale: 'coastal_manor', endStageMin: 8, endStageMax: 10 }, weight: 3, text: [
    'Doorways become useless arches; servants wheel food on carts because {subject.first} cannot reach the dining table anymore.',
    'Furniture breaks in waves — chaise longues snap, velvet curtains tear on widening hips, and the manor\'s polished floors scar under impossible weight.',
  ] },
  { when: { locale: 'coastal_manor', endStageMin: 11 }, weight: 3, text: [
    'The manor\'s west wing buckles — ballroom chandeliers swing, plaster rains from the ceiling, and nobles flee through gardens as {subject.first} fills the hall.',
    '{subject.first} cannot leave the parlor without taking the wall with {them}; servants camp in the corridor with wagons of pastries.',
  ] },

  // ── marble hall / temple ruins ─────────────────────────────────
  { when: { locale: 'marble_hall', endStageMin: 6, endStageMax: 8 }, weight: 3, text: [
    'Ancient pillars shiver as {subject.first} swells between them; dust sifts from the coffered ceiling in golden drifts.',
    'Marble tiles crack under concentrated weight; the echo of growth rolls through hollow halls like a second prayer.',
  ] },
  { when: { locale: 'marble_hall', endStageMin: 9, endStageMax: 11 }, weight: 3, text: [
    'A column splits with a sound like thunder; {subject.first} spills across the sanctum floor, altar stones grinding beneath plush immensity.',
    'Faded murals peel as walls flex; the temple was built for gods, but not quite for this much living abundance.',
  ] },
  { when: { locale: 'marble_hall', endStageMin: 12 }, weight: 2, text: [
    'The ruin becomes a cradle — roofless marble frames {subject.first} like a shrine, and pilgrims will swear the stone warmed under {their} weight.',
  ] },

  // ── sacred grotto ──────────────────────────────────────────────
  { when: { locale: 'sacred_grotto', endStageMin: 5, endStageMax: 8 }, weight: 3, text: [
    'Stalactites drip faster as heat rises from {subject.first}; the grotto pool ripples outward, lapping stone that has never seen such curves.',
    'Bioluminescent moss brightens along the walls — the cradle seems to approve, humming faintly as space shrinks.',
  ] },
  { when: { locale: 'sacred_grotto', endStageMin: 9, endStageMax: 11 }, weight: 3, text: [
    'The grotto mouth narrows to a joke; {subject.first} fills the ritual circle until standing stones lean inward, grinding softly.',
    'Underground water reroutes around {them}; fissures open in the ceiling and moonlight stripes the swell like consecration.',
  ] },
  { when: { locale: 'sacred_grotto', endStageMin: 13 }, weight: 2, text: [
    'The cradle can hold no more — stone splits, spring water geysers between rolls of flesh, and the whole hill seems to breathe with {subject.first}.',
  ] },

  // ── stone hall / forge hold ────────────────────────────────────
  { when: { locale: 'stone_hall', endStageMin: 6, endStageMax: 8 }, weight: 3, text: [
    'Forge heat meets softer heat — iron tongs clatter as {subject.first} swells; an anvil stool collapses under {them} without complaint.',
    'Ale benches crack in the hall; miners cheer anyway, raising mugs to the girl reshaping their stone room.',
  ] },
  { when: { locale: 'stone_hall', endStageMin: 9, endStageMax: 11 }, weight: 3, text: [
    'The hold\'s great doors warp on their hinges; {subject.first} presses against granite walls that have held armies and now hold something gentler and larger.',
    'Smoke vents clog; the forge banked itself when the floor began to sag under divine appetite made flesh.',
  ] },

  // ── ducal court ────────────────────────────────────────────────
  { when: { locale: 'ducal_court', endStageMin: 6, endStageMax: 8 }, weight: 3, text: [
    'Courtiers scatter as {subject.first} swells across polished marble; the throne dais creaks when {they} lean — even iron gilding has limits.',
    'Heralds stumble over trailing velvet; the duchess\'s guards form a wider circle, unsure whether to protect or worship.',
  ] },
  { when: { locale: 'ducal_court', endStageMin: 9, endStageMax: 12 }, weight: 3, text: [
    'Banners sag from rafters brushed by shoulders; the court abandons protocol and simply stares as {subject.first} becomes the room\'s new architecture.',
    'Throne room fountains crack; diplomats forget their treaties and count the new geography of curves instead.',
  ] },

  // ── grand cathedral ─────────────────────────────────────────────
  { when: { locale: 'grand_cathedral', endStageMin: 7, endStageMax: 9 }, weight: 3, text: [
    'Stained glass rattles in lead frames as {subject.first} grows down the nave; choir stalls splinter when {they} settle.',
    'Candle banks topple in rows; wax rivers thread between flagstones already groaning under sacred weight.',
  ] },
  { when: { locale: 'grand_cathedral', endStageMin: 10, endStageMax: 12 }, weight: 3, text: [
    'The nave becomes a canyon of flesh and prayer — pillars crack, the organ wheezes dust, and acolytes flee through side chapels.',
    '{subject.first} blocks the altar from three aisles away; incense smoke coils around curves that outscale any saint carved in stone.',
  ] },
  { when: { locale: 'grand_cathedral', endStageMin: 13 }, weight: 2, text: [
    'The citadel cathedral buckles — spires tilt, bells toll once and jam, and the faithful kneel in the square at a size that rewrites scripture.',
  ] },

  // ── open field ─────────────────────────────────────────────────
  { when: { locale: 'open_field', endStageMin: 6, endStageMax: 8 }, weight: 2, text: [
    'Wheat flattens in a widening circle; birds lift from the furrows as {subject.first} casts a new hill shadow across the heartlands.',
    'Fence posts lean outward where {they} kneel — earth dimples, soft and obedient, under gathering weight.',
  ] },
  { when: { locale: 'open_field', endStageMin: 9, endStageMax: 11 }, weight: 2, text: [
    'A irrigation ditch reroutes around {subject.first}; farmers gape as the horizon acquires a new, breathing landmark.',
    'The dirt path vanishes beneath {them}; wagon wheels leave fresh tracks through fields rather than fight the swell.',
  ] },
  { when: { locale: 'open_field', endStageMin: 12 }, weight: 2, text: [
    'From the road, {subject.first} is the heartland — vineyards curve around {their} outline, and travelers pray at a shrine that used to be a hay bale.',
  ] },

  // ── generic fallback by scale ──────────────────────────────────
  { when: { endStageMin: 4, endStageMax: 5 }, text: [
    'Something in the room complains — wood creaks, fabric strains, and {subject.first} takes up space that was not allocated.',
    'A chair leg splinters; {they} hardly notice, already larger than the moment before.',
  ] },
  { when: { endStageMin: 6, endStageMax: 7 }, text: [
    'Furniture gives up in stages; doorframes look narrower than they did at breakfast.',
    'Floorboards crack under concentrated softness; dust sifts from the ceiling like embarrassed confetti.',
  ] },
  { when: { endStageMin: 8, endStageMax: 9 }, text: [
    'Walls feel closer; the architecture was not consulted before {subject.first} outgrew it.',
    'People press to the edges of the room — not from fear, but because there is simply nowhere left to stand.',
  ] },
  { when: { endStageMin: 10, endStageMax: 11 }, text: [
    'The building groans as if reconsidering its life choices; {subject.first} has become its primary occupant and its primary load.',
    'Movement is a negotiation now — every doorway a theory, every hall a memory.',
  ] },
  { when: { endStageMin: 12 }, text: [
    'The landscape rearranges: foundations crack, crowds gather at a safe distance, and {subject.first} is no longer a person in a place — {they} are the place.',
    'What was a room, a square, a grove — is now a cradle of flesh and consequence, and the world is still catching up.',
  ] },
]);

registerPool('wr.crowd', [
  { when: {}, text: [''] },
  { when: { crowdCountMin: 2, endStageMin: 9 }, weight: 3, text: [
    'Another vast presence already shares the space — walls strain between two growing bodies, and the air feels thick with competing softness.',
    'The ground shudders twice: {subject.first} is not alone here, and the architecture must answer to more than one impossible size.',
  ] },
  { when: { crowdCountMin: 2, endStageMin: 11 }, weight: 3, text: [
    'Two immensities crowd the same district — streets buckle, onlookers flee, and the city will need new maps by morning.',
    'Someone else already blocks the horizon; as {subject.first} swells, the two of you become a weather system of flesh and splintering stone.',
  ] },
  { when: { crowdCountMin: 3, endStageMin: 10 }, weight: 4, text: [
    'The square is a tangle of giants — each growth shoves the last, and buildings surrender in every direction at once.',
    'Three vast bodies in one place: the world does not have protocol for this, only cracking timber and awed screaming.',
  ] },
]);

/**
 * Render locale-aware world reaction prose for a growth event.
 */
export function renderWorldGrowthReaction(character, params = {}) {
  if (!character || (params.stagesJumped ?? 0) < 1) return '';
  const endStage = params.endStage ?? 0;
  if (endStage < 4) return '';

  const globals = {
    startStage: params.startStage ?? 0,
    endStage,
    stagesJumped: params.stagesJumped ?? 1,
    locale: params.locale ?? 'generic_room',
    regionId: params.regionId ?? null,
    crowdCount: params.crowdCount ?? 0,
    crowdStages: params.crowdStages ?? [],
    week: params.week ?? 1,
  };

  const ctx = createContext({ subject: character, week: globals.week, globals });
  const parts = [];

  const primary = render('{wr.primary}', ctx).trim();
  if (primary) parts.push(primary);

  if (globals.crowdCount >= 2 && endStage >= 9) {
    const crowd = render('{wr.crowd}', ctx).trim();
    if (crowd) parts.push(crowd);
  }

  return parts.join('\n\n');
}
