/**
 * Class & subclass features granted on level up.
 */
export const CLASS_FEATURES = {
  bard: {
    2: [{ id: 'jack_of_all_trades', name: 'Jack of All Trades', desc: 'Add half proficiency to non-proficient checks — abundance touches everything you try.' }],
    3: [{ id: 'expertise', name: 'Expertise', desc: 'Double proficiency in Perform and Seduce — your art swells hearts and hips alike.' }],
    5: [{ id: 'font_of_inspiration', name: 'Font of Inspiration', desc: 'Inspire allies with renewed appetite and courage.' }],
    10: [{ id: 'magical_secrets', name: 'Magical Secrets', desc: 'Learn growth spells from other classes — gospel knows no school.' }],
    14: [{ id: 'peerless_performance', name: 'Peerless Performance', desc: 'Your masterpieces turn every room into an altar of appetite and surrender.' }],
    18: [{ id: 'endless_encore', name: 'Endless Encore', desc: 'Abundance magic lingers around your songs, carrying the feast long after the final note.' }],
    20: [{ id: 'symphony_of_plenty', name: 'Symphony of Plenty', desc: 'You embody the consummate hymn of indulgence — each performance feels mythic.' }],
  },
  wizard: {
    2: [{ id: 'arcane_recovery', name: 'Arcane Recovery', desc: 'Recover spent slots during a short rest by meditating on caloric theory.' }],
    3: [{ id: 'overflow_mastery', name: 'Overflow Mastery', desc: 'Overflow casts cost less AP and swell targets more reliably.' }],
    5: [{ id: 'growth_formula', name: 'Growth Formula', desc: 'Copy growth spells from scrolls and feast-rituals at reduced cost.' }],
    11: [{ id: 'saturated_thesis', name: 'Saturated Thesis', desc: 'Your research pierces into sixth-circle abundance; even high magic yields to your caloric geometry.' }],
    14: [{ id: 'living_equation', name: 'Living Equation', desc: 'You solve flesh and force alike as one sensual theorem — transmutations answer faster and cleaner.' }],
    18: [{ id: 'spell_mastery', name: 'Spell Mastery', desc: 'Lower circles of abundance come to heel; your bread-and-butter miracles feel instinctive.' }],
    20: [{ id: 'archmage_of_plenty', name: 'Archmage of Plenty', desc: 'At the summit of arcane indulgence, your spellbook reads like scripture.' }],
  },
  cleric: {
    2: [{ id: 'channel_divinity', name: 'Channel Divinity', desc: 'Invoke the Fat Goddess to create a feast that triggers growth in the faithful.' }],
    5: [{ id: 'destroy_repression', name: 'Destroy Repression', desc: 'Turn undead or puritanical foes with waves of divine indulgence.' }],
    6: [{ id: 'domain_feature', name: 'Domain Feature', desc: 'Your domain\'s abundance intensifies — communal growth rituals strengthen.' }],
    11: [{ id: 'high_liturgy', name: 'High Liturgy of Plenty', desc: 'Your prayers reach the goddess in full-throated splendor; sacred growth answers more readily.' }],
    14: [{ id: 'anointed_abundance', name: 'Anointed Abundance', desc: 'Your blessings linger on bodies and places alike, making devotion feel tangible.' }],
    18: [{ id: 'greater_channel_divinity', name: 'Greater Channel Divinity', desc: 'When you call for a feast, the miracle arrives with sovereign force.' }],
    20: [{ id: 'vessel_of_gorgara', name: 'Vessel of Gorgara', desc: 'The Fat Goddess crowns you as a near-perfect vessel of sacred fullness.' }],
  },
  warlock: {
    2: [{ id: 'eldritch_invocations', name: 'Eldritch Invocations', desc: 'Choose a hunger invocation — at-will growth or passive abundance.' }],
    3: [{ id: 'pact_boon', name: 'Pact Boon', desc: 'Your patron grants a bottomless gift — extra growth on pact spells.' }],
    5: [{ id: 'hunger_mantle', name: 'Hunger Mantle', desc: 'Aura of appetite weakens enemy resistance to conversion.' }],
    11: [{ id: 'mystic_arcanum', name: 'Mystic Arcanum', desc: 'Your patron entrusts you with once-impossible hunger secrets beyond mortal slotcraft.' }],
    14: [{ id: 'patrons_embrace', name: "Patron's Embrace", desc: 'The pact settles deeper into your body, making each invocation feel intimate and inevitable.' }],
    18: [{ id: 'eldritch_saturation', name: 'Eldritch Saturation', desc: 'Pact magic suffuses your frame — even silence hums with gluttonous promise.' }],
    20: [{ id: 'eldritch_apotheosis', name: 'Eldritch Apotheosis', desc: 'At the pact\'s summit, you are less servant than avatar of hunger.' }],
  },
};

export const SUBCLASS_FEATURES = {
  feast_singer: { 3: [{ id: 'song_abundance', name: 'Song of Abundance', desc: 'Performances grant allies temporary growth surge.' }] },
  indulgence: { 6: [{ id: 'feeding_performance', name: 'Feeding Performance', desc: 'Feeding during performance doubles growth on willing targets.' }] },
  sirens_call: { 6: [{ id: 'sirens_lure', name: "Siren's Lure", desc: 'Charm spells also apply seduction growth pressure.' }] },
  overflowing_heart: { 6: [{ id: 'shared_fullness', name: 'Shared Fullness', desc: 'Healing allies also grants them one stage of joyful growth.' }] },
  school_overflow: { 2: [{ id: 'arcane_plumpness', name: 'Arcane Plumpness', desc: 'Cantrips deal bonus Growth Damage at high size stages.' }] },
  expanding_form: { 6: [{ id: 'lasting_transfiguration', name: 'Lasting Transfiguration', desc: 'Growth spells last longer and resist dispelling.' }] },
  arcane_gluttony: { 6: [{ id: 'spell_devour', name: 'Spell Devour', desc: 'Countering magic fuels your own growth.' }] },
  domain_plenty: { 1: [{ id: 'bonus_proficiency', name: 'Bonus Proficiency', desc: 'Proficiency in cook\'s utensils and Indulge.' }] },
  eternal_feast: { 6: [{ id: 'ritual_banquet', name: 'Ritual Banquet', desc: 'Communal feasts during rest grant bonus spell recovery.' }] },
  mother_abundance: { 6: [{ id: 'matrons_embrace', name: "Matron's Embrace", desc: 'Allies within aura gain Con save advantage vs forced shrinking.' }] },
  pact_everfull: { 1: [{ id: 'hunger_blast', name: 'Hunger Blast', desc: 'Eldritch Blast variant deals Growth Damage.' }] },
  devouring_shadow: { 6: [{ id: 'shadow_drain', name: 'Shadow Drain', desc: 'Drain spells redistribute mass to you or allies.' }] },
  honeyed_tongue: { 6: [{ id: 'honeyed_contract', name: 'Honeyed Contract', desc: 'Social victories can bind targets to willing growth.' }] },
};

/** Post-Act III prestige talents — chosen via PrestigeModal, not level gates. */
export const PRESTIGE_TALENTS = {
  feast_momentum: {
    id: 'feast_momentum',
    name: 'Feast Momentum',
    desc: 'First communal feast each day grants +2 devotion party-wide.',
  },
  cosmic_satiety: {
    id: 'cosmic_satiety',
    name: 'Cosmic Satiety',
    desc: 'Cosmic conversion grants +25 AP once per rest.',
  },
  wheel_splinter: {
    id: 'wheel_splinter',
    name: 'Wheel Splinter',
    desc: 'Permanently ignore one region connection gate.',
  },
};

export function getFeaturesForLevel(classId, subclassId, level) {
  const classFeats = CLASS_FEATURES[classId]?.[level] ?? [];
  const subFeats = SUBCLASS_FEATURES[subclassId]?.[level] ?? [];
  return [...classFeats, ...subFeats];
}
