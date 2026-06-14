/**
 * Subclasses — one per class at creation; grants features, bonus spells, and special actions.
 */
export const SUBCLASSES = [
  // ─── Bard ───────────────────────────────────────────────────────────────────
  {
    id: 'feast_singer',
    classId: 'bard',
    name: 'College of the Feast-Singer',
    desc: 'Weave songs of abundance. Performances swell allies and charm enemies into hungry surrender.',
    isDefault: true,
    features: ['Song of Abundance', 'Inspiring Feast'],
    bonusSpellIds: [],
    specialAction: 'feast_singer',
  },
  {
    id: 'indulgence',
    classId: 'bard',
    name: 'College of Indulgence',
    desc: 'Turn audiences into devoted, softer followers through feeding performances and decadent spectacle.',
    features: ['Feeding Performance', 'Audience Appetite'],
    bonusSpellIds: ['feast_of_the_goddess'],
    specialAction: 'indulgence',
  },
  {
    id: 'sirens_call',
    classId: 'bard',
    name: "College of the Siren's Call",
    desc: 'Hypnotic song and voice that seduces targets into willing, sensual growth.',
    features: ['Siren\'s Lure', 'Velvet Command'],
    bonusSpellIds: ['overflowing_charm'],
    specialAction: 'sirens_call',
  },
  {
    id: 'overflowing_heart',
    classId: 'bard',
    name: 'College of the Overflowing Heart',
    desc: 'Emotional, empathetic growth — heal and swell allies through shared pleasure and vulnerability.',
    features: ['Shared Fullness', 'Empathic Surge'],
    bonusSpellIds: ['eternal_indulgence'],
    specialAction: 'overflowing_heart',
  },

  // ─── Wizard ─────────────────────────────────────────────────────────────────
  {
    id: 'school_overflow',
    classId: 'wizard',
    name: 'School of Overflow',
    desc: 'Core growth magic — manipulate caloric density, size stages, and arcane abundance.',
    isDefault: true,
    features: ['Arcane Plumpness', 'Overflow Sense'],
    bonusSpellIds: [],
    specialAction: 'school_overflow',
  },
  {
    id: 'expanding_form',
    classId: 'wizard',
    name: 'School of the Expanding Form',
    desc: 'Permanent and long-term body modification. Specializes in lasting size advancement.',
    features: ['Lasting Transfiguration', 'Form Anchor'],
    bonusSpellIds: ['form_of_abundance'],
    specialAction: 'expanding_form',
  },
  {
    id: 'arcane_gluttony',
    classId: 'wizard',
    name: 'School of Arcane Gluttony',
    desc: 'Devour enemy magic to fuel personal growth. Twist spells into hungry growth versions.',
    features: ['Spell Devour', 'Gluttonous Counterspell'],
    bonusSpellIds: ['glutinous_surge'],
    specialAction: 'arcane_gluttony',
  },

  // ─── Cleric ─────────────────────────────────────────────────────────────────
  {
    id: 'domain_plenty',
    classId: 'cleric',
    name: 'Domain of Plenty',
    desc: 'Channel the Fat Goddess\'s divine abundance. Bless, heal, and swell the faithful.',
    isDefault: true,
    features: ['Channel Divinity: Feast', 'Blessing of the Full Belly'],
    bonusSpellIds: [],
    specialAction: 'domain_plenty',
  },
  {
    id: 'eternal_feast',
    classId: 'cleric',
    name: 'Domain of the Eternal Feast',
    desc: 'Communal growth rituals that turn battlefields into banquets of glorious conversion.',
    features: ['Ritual Banquet', 'Battlefield Bounty'],
    bonusSpellIds: ['feast_of_the_goddess'],
    specialAction: 'eternal_feast',
  },
  {
    id: 'mother_abundance',
    classId: 'cleric',
    name: 'Domain of the Mother of Abundance',
    desc: 'Maternal, nurturing growth — protect allies while slowly, lovingly expanding them.',
    features: ['Matron\'s Embrace', 'Sheltering Softness'],
    bonusSpellIds: ['abundant_berry'],
    specialAction: 'mother_abundance',
  },

  // ─── Warlock ────────────────────────────────────────────────────────────────
  {
    id: 'pact_everfull',
    classId: 'warlock',
    name: 'Pact of the Fat Goddess',
    desc: 'Patron fragment of the Fat Goddess. Eldritch growth blasts and hunger-fueled power.',
    isDefault: true,
    features: ['Hunger Blast', 'Pact Boon: Bottomless'],
    bonusSpellIds: [],
    specialAction: 'pact_everfull',
  },
  {
    id: 'devouring_shadow',
    classId: 'warlock',
    name: 'Pact of the Devouring Shadow',
    desc: 'Darker, seductive growth that drains mass and redistributes it with hungry elegance.',
    features: ['Shadow Drain', 'Redistributed Curves'],
    bonusSpellIds: ['weight_of_desire'],
    specialAction: 'devouring_shadow',
  },
  {
    id: 'honeyed_tongue',
    classId: 'warlock',
    name: 'Pact of the Honeyed Tongue',
    desc: 'Sweet words and binding deals that make targets willingly grow for you.',
    features: ['Honeyed Contract', 'Willing Appetite'],
    bonusSpellIds: ['overflowing_charm'],
    specialAction: 'honeyed_tongue',
  },
];

export function getSubclass(id) {
  return SUBCLASSES.find((s) => s.id === id) || null;
}

export function getSubclassesForClass(classId) {
  return SUBCLASSES.filter((s) => s.classId === classId);
}

export function getDefaultSubclassId(classId) {
  const list = getSubclassesForClass(classId);
  return list.find((s) => s.isDefault)?.id || list[0]?.id;
}
