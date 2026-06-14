# Feast of the Glutton God — Smut Quality Guidelines by Tone Lane

> This document is the binding smut-craft reference for the four narrative tone lanes active
> in this game. Read it alongside `AUTHORING.md` (prose mechanics) and `TUNING.md` (Style
> Ledger). When these guidelines and a Style Ledger entry conflict, the Ledger wins for
> prose-construction bans; these guidelines win for *what to write* in each lane.

---

## The Four Tone Lanes

| Lane | Voice register | NPC winking? | Heat default | Key selector |
|---|---|---|---|---|
| **Earnest World** | Sincere, grounded, no irony | Never | Suggestive–warm | `act`, `relationship` |
| **Wry DM** | Dry narration, aware of genre | Narrator only | Charged–teasing | `escalationTier`, `level` |
| **Sensual Abundance** | Worshipful, body-centered, slow burn | Never | Sensual–explicit | `stage`, `corruption` |
| **Epic Cosmic** | Mythic scale, reverential awe | Never | Awe over heat | `endStage`, `threatTier` |

**The firm rule on NPC winking:** NPCs never acknowledge the genre, break the fourth wall,
or signal they know they are in a fetish game. Only the DM narrator voice (the wry lane)
carries meta-awareness. Earnest, sensual, and cosmic NPCs exist inside the fiction.

---

## Lane 1 — Earnest World

**What it is.** The baseline register. Characters, regions, and quests behave as if the world
is real and the strange magic of abundance is simply how things work here. The Aurelan Reach
has its own politics, faiths, and social fabric. NPCs who soften do so with genuine feeling —
curiosity, reluctance, warmth, desire — not as archetypes serving a fetish premise.

**Smut in this lane:**
- Heat should arise from *character dynamics*, not from genre conventions. Elara feeds pilgrims
  because she believes in hospitality; the eroticism is in her belief, not in the feeding-fetish
  frame.
- Descriptions favor indirect sensation: warmth, weight, the give of a new curve under a hand,
  the altered acoustics of a fuller room. These are concrete but not clinical.
- Dialogue stays in-register. A reluctant character doesn't declare arousal; a comfortable
  character might reach for warmth, proximity, the slow satisfaction of feeling full.
- **Avoid:** "she was getting so fat and she loved it" (framing, not experience); explicit
  anatomy labels; the narrative winking at its own kink. Stay inside the world.
- **Target heat:** Suggestive to warm. Full explicit is possible at `relationship 4–5` + `corruption 2`,
  but should arrive through accumulation, not shortcut.

**Sample register** (earned, not announced):
> *She wipes her hands on her apron, touches the swell of her belly with the same matter-of-fact
> tenderness she gives the bread loaves, and says nothing — which says everything.*

---

## Lane 2 — Wry DM

**What it is.** The DM (the narrator, never the NPCs) has dry affection for the game's genre
premise. He acknowledges the off-genre logic with a raised eyebrow and then plays it perfectly
straight. The humor is in his tone, not in his ridicule — he loves this world, and the comedy
comes from watching a growth-and-abundance plot displace the expected dread-fantasy narrative.

**Smut in this lane:**
- Heat exists but is delivered at a *slight remove* — the DM is describing events, not enacting
  them. His voice is appreciative but always a step outside the frame.
- The wry register is **not** an excuse for crude jokes, deflation, or undermining the player's
  desire. The DM smirks; he never sneers.
- This lane is where size-cap announcements, milestone narration, and cosmic-tier boss intros
  live. The ★ prefix marks DM-voice prose.
- **Avoid:** Sarcasm that reads as contempt; anatomically explicit content (leave that to the
  sensual lane); anything that makes the player feel foolish for caring.
- **Target heat:** Charged to teasing. The DM acknowledges what's happening without dwelling
  on it graphically. He is the witness, not the participant.

**Sample register** (wry, never sneering):
> *★ The DM notes that the village militia — theoretically your dread first obstacle — is
> now sitting at your table eating dessert. The DM approves. The militia approves louder.*

---

## Lane 3 — Sensual Abundance

**What it is.** The explicit erotic register. Worshipful, unhurried, body-centered. The voice
treats fat, weight, softness, and growth as beautiful and powerful — the genre's erotic subject
is size itself, and this lane renders it with the care you'd give a love scene.

**Smut in this lane:**
- **Slow down on growth events.** The electricity of the genre is *change*: the seam that gives,
  the threshold crossed, the number that climbs. Let growth arrive in stages within the prose —
  first the sensation, then the evidence, then the aftermath.
- **Worship the body specifically.** Don't report size; render it. The spread of a belly over a
  lap, the warmth that pools between thighs, the way a body sways after it stops moving, the
  bass note of new mass in a floorboard. Concrete, sensory, reverential.
- **Attitude shapes every line.** The same growth beat reads completely differently at
  `corruption 0` (tension, resistance, the body's pull against the mind's protest) vs
  `corruption 2` (open, loud, dominant). Write both. Both are erotic.
- **Explicit is earned, not default.** Move through suggestion → charged → sensual → explicit
  as `relationship` and `corruption` rise. At `relationship 0–1`, implication; at 4–5 + 2,
  the prose can be fully explicit about desire and act.
- **No clinical language.** Body parts are described by sensation and movement, not anatomical
  label. "Her belly" is fine; "adipose tissue" is not. "Between her thighs" is fine; medical
  nomenclature is not.
- **Avoid:** Health-consequence framing (no cardiac symptoms, no pain as distress, no atrophy);
  shame that isn't consensual and affectionate; degradation without warmth underneath.
- **Target heat:** Sensual to explicitly sexual, graduated by `relationship` + `corruption`.

**Sample register** (mid-heat, `relationship 2`, `corruption 1`):
> *She takes your hand and guides it to her waist — or where her waist was; it gives under your
> fingers now, soft and warm and deep, a new country she is still learning the borders of. "Tell
> me it's beautiful," she says. It's not a question. She just wants to hear you say it.*

**Stage-coverage rule (non-negotiable in this lane):** Any pool touching physical description must
have variants for every applicable stage. A belly description that works at stage 2 reads wrong
at stage 9. Use `stageMin`/`stageMax` bands; give the highest stages their own poetry.

---

## Lane 4 — Epic Cosmic

**What it is.** The apotheotic register. At mythic-and-above stages, growth has crossed the
threshold from personal experience to world event. The erotic subject is *vastness and divinity*:
the player as an aspect of the Fat Goddess, size as theological argument, the Wheel's fear as
a form of reverence. Heat in this lane lives in *scale and power*, not in personal intimacy.

**Smut in this lane:**
- **Scale is the desire object.** What arouses here is the fact of being enormous — the landmark
  quality, the geography of flesh, the way the world rearranges its priorities around your mass.
  Render it with the language of weather and architecture, not biology.
- **Awe over heat.** This lane is less "I want to touch her" and more "I cannot believe this
  exists." The erotic current is reverence — the same feeling pilgrims bring to shrines.
- **The DM's voice returns here in cosmic mode** — not wry anymore but genuinely moved.
  Use ★ markers for cosmic beats. The narrator's smirk has become a held breath.
- **Antagonist opposition doubles as desire by inversion.** The Lean Saint, the god-champions,
  the Wheel's avatar — their horror at the player's size is a form of recognition, and
  recognition is erotic. Write their fear as tribute.
- **Avoid:** Personal-scale intimacy language at stages 10+ (it reads wrong at room-filling
  sizes); medical atrophy framing (always); any implication that vastness is burdensome
  rather than magnificent.
- **Target heat:** Awe-charged. Explicit content at cosmic scale should feel mythic, not
  pornographic — the eroticism is in power and scale, the way a thunderstorm is erotic.

**Sample register** (stage 12, full cosmic register):
> *The city didn't choose to become her devotional. It simply ran out of other options — and
> discovered, in the running out, that it had always wanted this. To circle her. To be shaped
> by her shadow. To leave honeycakes at the edge of her reach and call it prayer.*

---

## Cross-Lane Rules

1. **Lanes are cumulative, not exclusive.** A growth event at stage 8 with `corruption 2` and
   `escalationTier 2` is all three active lanes simultaneously. Write sensual abundance for the
   body, wry DM for the narrative acknowledgment, cosmic for the scale — let them layer.

2. **Match the lane to the selector, not the scene.** A companion talk pool uses the earnest lane
   even if the player is stage 14. A milestone narration uses the wry DM lane. A stage-crossing
   prose at endStage 12 uses cosmic. Don't borrow register from the wrong pool.

3. **Escalation is a dial, not a switch.** Heat builds from `relationship 0` (earnest) through
   `relationship 3` (sensual) to `relationship 5` (sensual/explicit). The tone lanes don't
   change with heat; their register applies at every heat level. An earnest scene can be explicit;
   it just keeps its sincerity. A cosmic scene can be charged; it keeps its scale.

4. **The Style Ledger bans apply in all lanes.** No banned constructions anywhere. The Ledger
   supersedes lane defaults for individual banned phrases and patterns.

---

## Quick Reference — What Goes Where

| Content | Lane | Key pools |
|---|---|---|
| NPC dialogue (any relationship) | Earnest world | `npc.talk.*`, `npc.feed.*`, `npc.flirt.*` |
| Growth event sensation prose | Sensual abundance | `grow.crossing`, `growth.stage_up.*` |
| Stage crossing physical (epic tiers) | Cosmic + sensual | `grow.crossing` (endStage 10–14) |
| Milestone narration | Wry DM → cosmic | `levelup.milestone` |
| Boss intros (god-champions) | Wry DM / cosmic | `dm.cosmic.intro` |
| Named spell cast prose | Sensual + epic DM | `spell.cast.*`, `dm.cast.invoke` |
| Companion tier softening lines | Earnest world | `npc.companion.softeningTier` |
| Apotheosis endings | Cosmic | `dm.cosmic.ending` |
| Overworld spell afterglow | Sensual | `overworld.spell.afterglow` |
