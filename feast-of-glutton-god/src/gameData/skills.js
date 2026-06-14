/**
 * Skill definitions — each skill maps to a core stat.
 * Add new skills here; resolution logic stays in skillChecks.js.
 */
export const SKILLS = {
  overwhelm:       { id: "overwhelm",       stat: "str", label: "Overwhelm",       desc: "Force-feed, grapple, bodily dominance" },
  athletics:       { id: "athletics",       stat: "str", label: "Athletics",       desc: "Climb, shove, carry abundance" },
  seduce:          { id: "seduce",          stat: "cha", label: "Seduce",          desc: "Flirt, tempt, command attention" },
  perform:         { id: "perform",         stat: "cha", label: "Perform",         desc: "Songs, feasts, public display" },
  persuade:        { id: "persuade",        stat: "cha", label: "Persuade",        desc: "Convince, preach abundance" },
  endure_growth:   { id: "endure_growth",   stat: "con", label: "Endure Growth",   desc: "Withstand intense swelling pleasurably" },
  indulge:         { id: "indulge",         stat: "con", label: "Indulge",         desc: "Eat, feast, embrace fullness" },
  arcana:          { id: "arcana",          stat: "int", label: "Arcana",          desc: "Magical growth theory, overflow rituals" },
  insight:         { id: "insight",         stat: "wis", label: "Insight",         desc: "Read desires, sense the Fat Goddess's influence" },
  devotion:        { id: "devotion",        stat: "wis", label: "Devotion",        desc: "Channel divine abundance" },
  sneak:           { id: "sneak",           stat: "dex", label: "Sneak",           desc: "Move quietly despite one's size" },
  grace:           { id: "grace",           stat: "dex", label: "Grace",           desc: "Delicate movement, precise feeding" },
};

export function getSkill(id) {
  return SKILLS[id] || null;
}

/** Whether entity has proficiency in a skill (class list or explicit override). */
export function isSkillProficient(entity, skillId) {
  if (entity.skillProficiencies?.includes(skillId)) return true;
  if (entity.proficientSkills?.includes(skillId)) return true;
  const classId = entity.classId;
  if (!classId) return false;
  return (CLASS_SKILL_PROFICIENCIES[classId] || []).includes(skillId);
}

/** Default class skill proficiencies */
export const CLASS_SKILL_PROFICIENCIES = {
  bard:    ["perform", "seduce", "persuade", "grace"],
  wizard:  ["arcana", "insight"],
  cleric:  ["devotion", "insight", "persuade", "endure_growth"],
  warlock: ["seduce", "arcana", "indulge"],
};

/** DC guidelines by difficulty */
export const DC = {
  trivial: 5,
  easy: 8,
  medium: 12,
  hard: 15,
  formidable: 18,
  legendary: 22,
};

/**
 * Size-stage advantage/disadvantage per skill (stacks with explicit adv/dis only by cancellation rules).
 * advantageMin: gain advantage at this stage or higher
 * disadvantageMin: gain disadvantage at this stage or higher
 */
export const SKILL_SIZE_ROLL = {
  overwhelm:     { advantageMin: 6 },
  athletics:     { advantageMin: 7 },
  seduce:        { advantageMin: 4 },
  perform:       { advantageMin: 3 },
  persuade:      { advantageMin: 4 },
  endure_growth: { advantageMin: 5 },
  indulge:       { advantageMin: 3 },
  sneak:         { disadvantageMin: 5, advantageMax: 2 },
  grace:         { disadvantageMin: 7, advantageMax: 3 },
};
