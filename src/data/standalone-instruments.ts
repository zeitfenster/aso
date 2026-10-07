import type { CatalogEntry } from './types'

export const standaloneInstruments: CatalogEntry[] = [
  {
    id: 'algonaut-atlas-2',
    name: 'Atlas 2',
    vendor: 'Algonaut',
    kind: 'plugin',
    types: ['Drum Machine', 'Sampler'],
    collections: [],
    summary:
      'Intelligent drum machine/sampler that auto-analyzes and maps drum samples onto a playable pad grid, with kit browsing and pattern tools.',
    sonicCharacter:
      'Depends entirely on your sample library—Atlas is a workflow engine more than a fixed “sound.” It shines when feeding it characterful one-shots.',
    bestFor:
      'Building custom kits fast from large sample folders and sketching beats without manual mapping.',
    useCases: [
      'Drop a folder of kicks/snares and let Atlas auto-sort them onto pads.',
      'Design hybrid kits mixing acoustic and electronic one-shots.',
      'Sketch patterns, then export MIDI or bounce audio into Ableton clips.',
    ],
    tags: ['drums', 'sampler', 'workflow'],
  },
  {
    id: 'korg-polysix-v2',
    name: 'Polysix V2',
    vendor: 'Korg',
    kind: 'plugin',
    types: ['Synth'],
    collections: [],
    summary:
      'Software recreation of Korg’s early-80s six-voice analog polysynth, known for lush chorus and simple subtractive architecture.',
    sonicCharacter:
      'Warm, slightly soft analog pads and comps; the built-in ensemble/chorus is a big part of the classic Polysix perfume.',
    bestFor:
      'Retro pads, soft polysynth leads, and new-wave / synth-pop textures.',
    useCases: [
      'Lush chorus pads under a vocal or guitar.',
      'Simple square/saw comps for 80s-inspired grooves.',
      'Soft leads that sit behind brighter modern synths.',
    ],
    tags: ['analog', 'pad', 'chorus', 'vintage'],
  },
  {
    id: 'ni-battery-3',
    name: 'Battery 3',
    vendor: 'Native Instruments',
    kind: 'plugin',
    types: ['Drum Machine', 'Sampler'],
    collections: [],
    summary:
      'Cell-based drum sampler for mapping one-shots, kits, and electronic/acoustic kits with per-cell editing and effects.',
    sonicCharacter:
      'Punchy production drums; Battery itself is relatively clean—kits determine whether you get acoustic realism or electronic smack.',
    bestFor:
      'Playing and editing drum kits, electronic percussion, and sampled groove kits.',
    useCases: [
      'Load a kit and sequence beats from MIDI clips in Ableton.',
      'Replace weak sampled hits with layered cells.',
      'Design electronic kits with per-pad envelopes, filters, and saturation.',
    ],
    notes:
      'Older major version than Battery 4 (often found in later Komplete editions). Still fully usable as a drum host.',
    tags: ['drums', 'sampler', 'ni'],
  },
  {
    id: 'rob-papen-albino-3-legend',
    name: 'Albino 3 Legend',
    vendor: 'Rob Papen',
    kind: 'plugin',
    types: ['Synth'],
    collections: [],
    summary:
      'Hybrid synthesizer known for huge preset libraries spanning pads, leads, basses, and sequenced textures—popular in electronic and cinematic pop production.',
    sonicCharacter:
      'Polished, wide, and often quite “designed”—from silky pads to aggressive digital leads. Can be pristine or gritty depending on the preset path.',
    bestFor:
      'Fast sound design via presets, electronic beds, and character leads/basses.',
    useCases: [
      'Grab evolving pads for progressive/house breakdowns.',
      'Design mono basses with unison and filter movement.',
      'Layer a bright Albino lead over a warmer analog synth for modern pop.',
    ],
    tags: ['hybrid-synth', 'presets', 'electronic'],
  },
  {
    id: 'spectrasonics-keyscape',
    name: 'Keyscape',
    vendor: 'Spectrasonics',
    kind: 'plugin',
    types: ['Keys / Piano'],
    collections: [],
    summary:
      'Deeply sampled keyboard collection: acoustic pianos, electric pianos, clavinets, harpsichords, and rare vintage keys with hybrid modeling options.',
    sonicCharacter:
      'Highly detailed, playable, and “recorded instrument” realism—from intimate uprights to lush cinematic grands and funky EPs.',
    bestFor:
      'Songwriting keys, soul/R&B electric pianos, and premium piano parts without leaving the box.',
    useCases: [
      'Rhodes/Wurli comps for neo-soul and ballads.',
      'Cinematic grand piano beds with subtle ambience.',
      'Clavinet funk rhythms or hybrid Keyscape patches layered into Omnisphere.',
    ],
    tags: ['piano', 'ep', 'keys', 'spectrasonics'],
  },
  {
    id: 'spectrasonics-omnisphere-3',
    name: 'Omnisphere 3',
    vendor: 'Spectrasonics',
    kind: 'plugin',
    types: ['Synth', 'Sampler'],
    collections: [],
    summary:
      'Flagship soft synth / hybrid instrument: massive library of synths, found-sound textures, granular tools, and deep modulation for sound design and composition.',
    sonicCharacter:
      'From pristine cinematic atmospheres to filthy basses and arps—Omnisphere’s character is “studio-finished” and hugely versatile rather than one fixed timbre.',
    bestFor:
      'Pads, atmospheres, hybrid scoring, electronic sound design, and go-to preset browsing.',
    useCases: [
      'Build evolving intro atmospheres with granular layers.',
      'Design tempo-synced arps and pulses for electronic tracks.',
      'Layer Omnisphere textures under Keyscape pianos for filmic songs.',
    ],
    tags: ['synth', 'sound-design', 'cinematic', 'spectrasonics'],
  },
  {
    id: 'spectrasonics-trilian',
    name: 'Trilian',
    vendor: 'Spectrasonics',
    kind: 'plugin',
    types: ['Bass'],
    collections: [],
    summary:
      'Dedicated bass instrument covering acoustic, electric, and synth basses with articulation control and deep editing—designed to lock with Omnisphere/Keyscape.',
    sonicCharacter:
      'Full-bodied, mix-ready low end: round uprights, articulate fingerstyle DI, slap, and synth subs with a polished Spectrasonics sheen.',
    bestFor:
      'Bass beds for pop, soul, cinematic, and electronic productions.',
    useCases: [
      'Fingerstyle electric bass under a live-feel band arrangement.',
      'Synth sub + mid bass stacks for EDM/hip-hop.',
      'Upright bass for jazz/neo-classical cues.',
    ],
    tags: ['bass', 'spectrasonics'],
  },
  {
    id: 'wave-alchemy-bassynth',
    name: 'Bassynth',
    vendor: 'Wave Alchemy',
    kind: 'plugin',
    types: ['Bass', 'Synth'],
    collections: [],
    summary:
      'Hybrid bass engine (Kontakt Player) combining multi-samples, wavetables, and layered organic/synth sources for modern low-end design.',
    sonicCharacter:
      'Forward, designed, and often quite bold—organic bass guitar grit blended with digital/wavetable weight rather than vintage-only authenticity.',
    bestFor:
      'Contemporary electronic, hybrid, and cinematic bass patches.',
    useCases: [
      'Layer dirty 808-style subs with processed electric bass midrange.',
      'Morph between acoustic and synth bass with the X/Y pad.',
      'Build unique trailer/hybrid low-end beds.',
    ],
    notes: 'Runs via free Kontakt Player (full Kontakt not required).',
    tags: ['bass', 'kontakt', 'wave-alchemy'],
  },
  {
    id: 'wave-alchemy-drumvolution',
    name: 'Drumvolution',
    vendor: 'Wave Alchemy',
    kind: 'plugin',
    types: ['Drum Machine', 'Sampler'],
    collections: [],
    summary:
      'Creative electronic drum engine (Kontakt Player) with deep layering, macros, sequencing, and a modern designed drum library.',
    sonicCharacter:
      'Punchy, processed, contemporary electronic drums—more “sound-designed kit” than raw vintage machine.',
    bestFor:
      'Electronic beats, hybrid percussion, and kit design beyond classic 808/909 fare.',
    useCases: [
      'Build polyrhythmic electronic kits with macro morphing.',
      'Design dark, Massive-Attack-adjacent drum beds.',
      'Export MIDI patterns into Ableton for further arrangement.',
    ],
    notes: 'Runs via free Kontakt Player. Overlaps conceptually with Triaz (native successor-style workflow).',
    tags: ['drums', 'kontakt', 'wave-alchemy'],
  },
  {
    id: 'wave-alchemy-revolution',
    name: 'Revolution',
    vendor: 'Wave Alchemy',
    kind: 'plugin',
    types: ['Drum Machine', 'Sampler'],
    collections: [],
    summary:
      'Vintage drum-machine focused instrument (Kontakt Player) sampling classic machines (808/909/606/etc. style modules) with modern mixing/modulation tools.',
    sonicCharacter:
      'Authentic machine smack with optional tape/lo-fi and studio polish—from raw analog thump to mix-ready electronic drums.',
    bestFor:
      'Classic electronic drums, house/techno kits, and modular mix-and-match machine layers.',
    useCases: [
      'Build an RV-808 + RV-909 hybrid kit.',
      'Add swing and per-step modulation for humanized machine grooves.',
      'Process classic machines through Revolution’s onboard EQ/comp/distortion.',
    ],
    notes: 'Runs via free Kontakt Player.',
    tags: ['drums', '808', '909', 'kontakt', 'wave-alchemy'],
  },
  {
    id: 'wave-alchemy-triaz',
    name: 'Triaz',
    vendor: 'Wave Alchemy',
    kind: 'plugin',
    types: ['Drum Machine', 'Sampler'],
    collections: [],
    summary:
      'Native drum production plugin with polyrhythmic sequencing, deep layering, mixing tools, large preset/sample library, and fast kit building.',
    sonicCharacter:
      'Modern, punchy, and highly editable—genre-flexible electronic drums with a production-ready finish.',
    bestFor:
      'End-to-end beat making when you want sampling, sequencing, and mixing in one drum plugin.',
    useCases: [
      'Start from a genre preset and reshape hits with per-step modulation.',
      'Layer and tag your own one-shots into custom kits.',
      'Design complex polyrhythmic patterns without a traditional piano-roll grind.',
    ],
    tags: ['drums', 'native-plugin', 'wave-alchemy'],
  },
  {
    id: 'uad-moog-minimoog',
    name: 'Moog Minimoog',
    vendor: 'Universal Audio',
    kind: 'plugin',
    types: ['Synth'],
    collections: [],
    summary:
      'UAD native Model D emulation developed with Moog Music: oscillators, ladder filter, nonlinearities, and pitch-tracking quirks of the original mono analog, plus period-correct mods (extra LFO, sample-and-hold, note priority, legato, velocity).',
    sonicCharacter:
      'Fat, growling Moog bass and lead with midrange punch, sumptuous low end, and the grit of driving the ladder into itself—the classic Minimoog perfume rather than a polite analog clone.',
    bestFor:
      'Mono analog basses, expressive leads, and anything that should sound like a Minimoog in the mix.',
    useCases: [
      'Resonant 16th-note basslines that still read on a small speaker.',
      'Pitch-bent lead over a sparse beat.',
      'Loop output-to-input style drive for aggressive mono layers.',
    ],
    notes:
      'Runs native (no Apollo required). Also known as UAD Minimoog; authorized via UA Connect / iLok.',
    tags: ['uad', 'moog', 'minimoog', 'analog', 'ladder'],
    installHints: ['UAD Moog Minimoog', 'UAD Minimoog', 'Minimoog'],
  },
  {
    id: 'fabfilter-twin-3',
    name: 'Twin 3',
    vendor: 'FabFilter',
    kind: 'plugin',
    types: ['Synth'],
    collections: [],
    summary:
      'Virtual-analog subtractive synth with up to four analog-modeled oscillators (drift, hard sync, ring mod), four nonlinear self-oscillating filters (Volcano-style shapes/slopes), arpeggiator, six FX, 64-voice polyphony/unison, and drag-and-drop modulation including XY.',
    sonicCharacter:
      'Phat vintage-analog oscillators with filter grit from smooth rolls to screaming self-oscillation—more “programmable analog poly” than a single hardware clone. FX and modulation push it into designed electronic territory.',
    bestFor:
      'Analog-style basses, leads, pads, and unison stabs when you want FabFilter’s filter/modulation workflow on an instrument.',
    useCases: [
      'Unison saw bass with filter envelope and a little drift.',
      'Resonant lead using self-oscillating filters and polyphonic portamento.',
      'Pad with chorus/reverb in the onboard FX and slow XY filter movement.',
    ],
    tags: ['synth', 'analog', 'fabfilter', 'subtractive'],
  },
]
