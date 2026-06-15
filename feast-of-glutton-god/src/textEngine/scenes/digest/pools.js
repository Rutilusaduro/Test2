import { registerPool } from '../../engine.js';

registerPool('world.digest.header', [
  { text: [
    '★ Continent Digest — Week {digestWeek} of the Aurelan Reach',
    '★ Living World Bulletin — feast-week {digestWeek}',
    '★ The Reach Reports — weekly abundance digest, #{digestWeek}',
  ]},
]);

registerPool('world.digest', [
  { when: { digestTopic: 'ember_belts' }, text: [
    'Ember Duchy reports a 40% increase in belt sizes. Tarn approves — in writing, with pastry.',
    'Ducal tailors strike for hazard pay. Tarn\'s guild posts quarterly growth projections beside tax ledgers.',
  ]},
  { when: { digestTopic: 'verity_appeal' }, text: [
    'Sister Verity filed appeal #47. Denied. She is learning patience — and portion control, reluctantly.',
    'The Church appeals board notes Verity\'s handwriting shaking. They blame seasonal humidity, not your gospel.',
  ]},
  { when: { digestTopic: 'greta_order' }, text: [
    'Greta\'s Order of Soft Iron opened a chapter house in Grimwatch. Recruitment requires appetite, not armor size.',
    'Frontier smiths petition Korthak for softer anvils. Greta signs the decree with a grin and a grease-stained thumb.',
  ]},
  { when: { digestTopic: 'sylwen_harvest' }, text: [
    'Sylwen\'s harvest priests debate whether abundance counts as blasphemy if yields improve. The debate ends at second breakfast.',
    'Heartland granaries overflow. Sylwen\'s wardens file the surplus under "theological inconvenience."',
  ]},
  { when: { digestTopic: 'lumen_index' }, text: [
    'The Lumen Index adds a forbidden footnote: caloric cosmology. Three archivists resign; two stay for the catering.',
    'Star-charts in the Citadel now include a wandering mass where your patron should not appear. Lumen calls it data.',
  ]},
  { when: { digestTopic: 'church_crackdown' }, text: [
    'Church hardliners schedule a crackdown. Half the inquisitors arrive late — distracted by public feasts.',
    'Measured Hand patrols double in the capital. Waistlines in the patrol do not shrink. Morale improves anyway.',
  ]},
  { when: { digestTopic: 'heartland_feast' }, text: [
    'The heartlands host unified harvest courts. Enemies share bread; belts surrender in bipartisan fashion.',
    'Heartland unity declared — not by treaty, but by communal tables long enough to seat rival dukes.',
  ]},
  { when: { digestTopic: 'lyra_rivalry' }, text: [
    'Lyra Swiftblade loses another duel of curves in tavern gossip. She denies enjoying the rematches. No one believes her.',
    'Market Square bookmakers offer odds on Lyra\'s next belt notch. She threatens libel; the odds shorten.',
  ]},
  { when: { digestTopic: 'lyra_ascended' }, text: [
    'Lyra Swiftblade spotted at the divine threshold — champion steel, apostate curves, or lover\'s blush, depending on the witness.',
    'The Reach buzzes: your old rival ascended. Bards already sell two endings and one pastry tie-in.',
  ]},
  { when: { digestTopic: 'cosmic_attention' }, text: [
    'Cosmic attention spikes continent-wide. The Wheel schedules emergency meetings. Catering is excellent.',
    'Pantheon observers note your Act III crown. Aurelan\'s scales tilt toward "interesting problem."',
  ]},
  { when: { digestTopic: 'companion_apotheosis' }, text: [
    'Six companion apotheoses witnessed. Pilgrimage sites multiply; innkeepers raise rates and waistlines together.',
    'The Church canonizes nothing — yet roadside shrines to your walking saints appear anyway.',
  ]},
  { when: { digestTopic: 'blooming_war' }, text: [
    'Converted gods hold summit at the vestibule. Sylwen, Tarn, and Lumen argue dessert precedence. Abundance mediates.',
    'When Gods Bleed echoes — pantheon hardliners lose another ally to your banquet diplomacy.',
  ]},
  { when: { digestTopic: 'prestige_pilgrim' }, text: [
    'Post-crown pilgrims chart your scaling quests like scripture. Completionists frighten local bakeries.',
    'Prestige pilgrims arrive asking which talent you picked first. The continent treats your save file like hagiography.',
  ]},
  { when: { digestTopic: 'eternal_hall' }, text: [
    'Rumors spread of an Eternal Feast Hall — demiplane tables without end. Cartographers mark it "probably dessert."',
    'Planar scholars confirm a hall where converted gods dine endlessly. Reservations impossible; appetite mandatory.',
  ]},
  { when: { digestTopic: 'coast_velvet' }, text: [
    'Sapphire salons loosen corset law. Velvet masks hide smiles that weren\'t there last season.',
    'Coastal nobility publishes a etiquette guide: how to compliment swelling without sounding sincere. It fails.',
  ]},
  { when: { digestTopic: 'citadel_bend' }, text: [
    'Gilded Citadel architecture bends — staircases sigh, domes blush. Aurelan\'s law develops stretch marks.',
    'Cathedral geometry files complaint with the Wheel. Geometry loses; pastry wins.',
  ]},
  { when: { digestTopic: 'cradle_bloom' }, text: [
    'Shrine of the Thin Veil blooms — pilgrims leave heavier, happier, heretical.',
    'The cradle grotto steams with answered hunger. Even earnest farmers dream in cream.',
  ]},
  { when: { digestTopic: 'marches_forge' }, text: [
    'Northern forges retool for wider armor. Korthak\'s saints bless the anvils — quietly, with seconds.',
    'Frontier militias report morale up, discipline down, trouser expenses alarming.',
  ]},
  { when: { digestTopic: 'market_abundance' }, text: [
    'Grand Market Square declares feast tax holidays. Guild ledgers fatten faster than merchants.',
    'Spice routes redirect toward confection. Tarn smiles — this is what indexes are for.',
  ]},
  { when: { digestTopic: 'barrow_whispers' }, text: [
    'Barrow Deeps exhale warmth. Veshanne\'s oath-stone develops appetite — geologists concerned, bakers thrilled.',
    'Undead below report improved mood. Necromancers blame your regional aura; necromancers also eat more.',
  ]},
  { when: { digestTopic: 'vestibule_illegal' }, text: [
    'Illegal presence noted on the divine threshold. Wheel security increases. Security also snacks.',
    'Vestibule guards file incident reports in triplicate. Incident: your existence. Status: ongoing.',
  ]},
  { when: { digestTopic: 'dream_echo' }, text: [
    'Dream echoes multiply in tavern sleep. Locals wake softer, confused, requesting breakfast twice.',
    'Scholars classify a new phenomenon: mirror-hunger REM. Inns stock larger pillows.',
  ]},
  { when: { digestTopic: 'wheel_incarnate' }, text: [
    'Wheel Incarnate defeated — dental records filed under cosmic hazard. Church morale complicated.',
    'The Wheel loses a tooth and a metaphor. Pilgrims celebrate with layered cake.',
  ]},
  { when: { digestTopic: 'guild_audit' }, text: [
    'Tarn Guild audits abundance spread. Finds deficit of restraint, surplus of profit. Audit passes.',
    'Guild factors negotiate dessert clauses into standard contracts. Lawyers gain weight, bill hourly.',
  ]},
  { when: { digestTopic: 'inn_shrine' }, text: [
    'Elara\'s inn listed as unofficial shrine. Pilgrims queue for stew and salvation in equal measure.',
    'Roadside inns adopt "open table" policy. The Church fumes; travelers do not.',
  ]},
  { when: { digestTopic: 'seasonal_harvest' }, text: [
    '★ Harvest Inversion — heartland growth doubled, Sylwen heralds spawn in inconvenient places.',
    'Seasonal Wheel event: crops swell, pilgrims swell, hymnals rewritten for wider margins.',
  ]},
  { when: { digestTopic: 'seasonal_dream' }, text: [
    '★ Dream Feast season — echoes walk the roads; XP tastes like frosting.',
    'Seasonal Wheel event: dream-echo encounters rise. Tavern owners install reinforced chairs.',
  ]},
  { when: { digestTopic: 'pilgrimage_legend' }, text: [
    'Second pilgrimage legends circulate. The Fat Goddess remembers prior feasts; so do innkeepers\' ledgers.',
    'Repeat pilgrims arrive with seeds of memory. The Reach braces — politely, with appetizers.',
  ]},
  { when: { digestTopic: 'legacy_abundance' }, text: [
    'Legacy abundance ripples across pilgrimages — meta-feast stat climbs; reality softens a fraction more.',
    'Scholars detect cumulative banquet residue between timelines. Your past selves left crumbs everywhere.',
  ]},
  { when: { digestTopic: 'generic_abundance' }, text: [
    'Abundance spreads quietly — another village loosens belts, another oven stays lit past curfew.',
    'The Reach grows softer by degrees. No decree required; only appetite, patience, and pastry.',
    'Farmers report excellent yields and suspiciously happy livestock. Sylwen\'s priests take notes.',
    'A traveling bard swaps famine ballads for feast hymns. Audiences demand encores and desserts.',
    'Roadside shrines to fullness appear without architects. Pilgrims leave offerings of butter.',
  ]},
]);
