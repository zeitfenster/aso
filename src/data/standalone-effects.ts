import type { CatalogEntry } from './types'

export const standaloneEffects: CatalogEntry[] = [
  {
    id: 'audio-damage-dubstation-2',
    name: 'Dubstation 2',
    vendor: 'Audio Damage',
    kind: 'plugin',
    types: ['Delay'],
    collections: [],
    summary:
      'Modern take on classic bucket-brigade / dub delay, with filtering, feedback character, and tempo-friendly controls for echoes that feel hardware-adjacent.',
    sonicCharacter:
      'Dark, smeary, dubby repeats—less hi-fi digital slap, more filtered analog-style echo trails.',
    bestFor:
      'Dub echoes, reggae/dub techno delays, and smeared rhythmic space on drums/vocals/synths.',
    useCases: [
      'Filtered feedback delays on rimshots and sparsely arranged dub drums.',
      'Throw delay on vocal ad-libs into a dubby return.',
      'Create decaying synth ostinato echoes that get darker each repeat.',
    ],
    tags: ['delay', 'dub', 'bbd'],
  },
  {
    id: 'eventide-blackhole',
    name: 'Blackhole',
    vendor: 'Eventide',
    kind: 'plugin',
    types: ['Reverb', 'Creative FX'],
    collections: [],
    summary:
      'Otherworldly algorithmic reverb capable of huge, gravity-defying spaces far beyond realistic rooms—iconic for ambient and cinematic sound design.',
    sonicCharacter:
      'Vast, lush, sometimes infinite; can be beautiful and enveloping or intentionally unnatural and sci-fi.',
    bestFor:
      'Ambient washes, cinematic tails, transitions, and transforming ordinary sounds into space.',
    useCases: [
      'Infinite tails on pads and risers for ambient/electronic intros.',
      'Freeze-style special FX hits for trailers and transitions.',
      'Subtle (carefully mixed) widening on vocals or leads for dream-pop.',
    ],
    tags: ['reverb', 'ambient', 'eventide'],
  },
  {
    id: 'eventide-quadravox',
    name: 'Quadravox',
    vendor: 'Eventide',
    kind: 'plugin',
    types: ['Pitch / Harmony', 'Delay', 'Creative FX'],
    collections: [],
    summary:
      'Four-voice diatonic pitch-shifting delay/harmonizer for creating intelligent harmonies, rhythmic pitched echoes, and Eventide-style special FX.',
    sonicCharacter:
      'Musical, slightly processed pitch character typical of Eventide harmonizers—can be pristine choral stacks or quirky pitched delays.',
    bestFor:
      'Vocal harmonies, guitar textures, and melodic special effects.',
    useCases: [
      'Add diatonic harmony stacks under a lead vocal.',
      'Create rhythmic pitched delays on synth hooks.',
      'Design guitar ambient layers with interval-shifted repeats.',
    ],
    tags: ['harmony', 'pitch', 'eventide'],
  },
  {
    id: 'exponential-audio-phoenixverb',
    name: 'PhoenixVerb',
    vendor: 'Exponential Audio',
    kind: 'plugin',
    types: ['Reverb'],
    collections: [],
    summary:
      'Clean, high-quality algorithmic reverb oriented toward natural spaces and musical mixing—often praised for clarity and controllable early/late energy.',
    sonicCharacter:
      'Clear, elegant, and relatively neutral compared with lush “effect” verbs—rooms and halls that don’t instantly smear the source.',
    bestFor:
      'Mix reverbs for vocals, acoustic instruments, and naturalistic spaces.',
    useCases: [
      'Vocal hall that stays intelligible in a dense mix.',
      'Drum room ambience without muddying the kick.',
      'Orchestral/cinematic placement when you want realism over wash.',
    ],
    tags: ['reverb', 'mix', 'exponential'],
  },
  {
    id: 'fabfilter-pro-c-2',
    name: 'Pro-C 2',
    vendor: 'FabFilter',
    kind: 'plugin',
    types: ['Compressor'],
    collections: [],
    summary:
      'Versatile compressor with multiple styles (Clean, Classic, Opto, Vocal, Mastering, Bus, Punch, Pumping), sidechain EQ, and excellent metering.',
    sonicCharacter:
      'Can be transparent or colored depending on style—overall precise and modern with very controllable gain reduction behavior.',
    bestFor:
      'Everyday compression on vocals, buses, drums, and instruments.',
    useCases: [
      'Vocal leveling with Vocal style and lookahead.',
      'Bus glue with Bus style and gentle ratios.',
      'Sidechain pumping for electronic grooves.',
    ],
    tags: ['dynamics', 'fabfilter', 'compressor'],
  },
  {
    id: 'fabfilter-pro-c-3',
    name: 'Pro-C 3',
    vendor: 'FabFilter',
    kind: 'plugin',
    types: ['Compressor'],
    collections: [],
    summary:
      'Next-generation FabFilter compressor expanding on Pro-C 2 with updated workflow/features while keeping the multi-style, visually guided approach.',
    sonicCharacter:
      'Same FabFilter precision: from invisible leveling to stylistic pump—choose character via compression style rather than a single fixed tone.',
    bestFor:
      'Primary compressor when you want the newest Pro-C feature set in Ableton.',
    useCases: [
      'Replace Pro-C 2 on vocal chains if you prefer the newer UI/features.',
      'Program-dependent control on drums and mix buses.',
      'Surgical dynamic control with sidechain filtering.',
    ],
    notes: 'You also own Pro-C 2—keep both until you standardize a preferred version per template.',
    tags: ['dynamics', 'fabfilter', 'compressor'],
  },
  {
    id: 'fabfilter-pro-l-2',
    name: 'Pro-L 2',
    vendor: 'FabFilter',
    kind: 'plugin',
    types: ['Limiter', 'Mastering Suite'],
    collections: [],
    summary:
      'Transparent-to-loud true-peak limiter with multiple algorithms, extensive metering, and surround options—industry standard for mastering and loud buses.',
    sonicCharacter:
      'Mostly clean punch and level; algorithm choice shifts how hard it “grabs.” Rarely adds obvious color unless pushed hard.',
    bestFor:
      'Master bus limiting, competitive loudness, and safe true-peak control for streaming.',
    useCases: [
      'Final limiter on a mix bus before export.',
      'True-peak safety limiting for Spotify/Apple delivery.',
      'Aggressive electronic limiting with Punch/Aggressive-style algorithms when appropriate.',
    ],
    tags: ['limiter', 'mastering', 'fabfilter'],
  },
  {
    id: 'fabfilter-pro-mb',
    name: 'Pro-MB',
    vendor: 'FabFilter',
    kind: 'plugin',
    types: ['Multiband Dynamics'],
    collections: [],
    summary:
      'Flexible multiband dynamics processor for compression, expansion, and dynamic EQ-like control with freely placeable bands and excellent visualization.',
    sonicCharacter:
      'Surgical and clean by default; can become creative when bands are pushed. Feels precise rather than vintage.',
    bestFor:
      'Problem-solving dynamics, de-harshing, mix bus multiband control, and creative frequency-dependent pumping.',
    useCases: [
      'Tame harsh 3–5 kHz on vocals only when they get loud.',
      'Control low-end rumble on a master without static EQ cuts.',
      'Expand lifeless room mics or tighten boomy acoustic guitars.',
    ],
    tags: ['multiband', 'dynamics', 'fabfilter'],
  },
  {
    id: 'fabfilter-pro-q-3',
    name: 'Pro-Q 3',
    vendor: 'FabFilter',
    kind: 'plugin',
    types: ['EQ'],
    collections: [],
    summary:
      'Surgical and musical equalizer with dynamic EQ bands, mid/side, linear phase modes, and spectrum analysis—long-time mix engineer favorite.',
    sonicCharacter:
      'Extremely clean and transparent; dynamic mode adds smart control without an obvious “EQ color.”',
    bestFor:
      'Mixing EQ, resonance cleanup, and mastering-friendly tonal balance.',
    useCases: [
      'Dynamic notch on a resonant vocal frequency.',
      'Mid/side widening via gentle high-shelf on the sides.',
      'Surgical mud cleanup around 200–400 Hz on guitars.',
    ],
    tags: ['eq', 'fabfilter'],
  },
  {
    id: 'fabfilter-pro-q-4',
    name: 'Pro-Q 4',
    vendor: 'FabFilter',
    kind: 'plugin',
    types: ['EQ'],
    collections: [],
    summary:
      'Latest Pro-Q generation with refined workflow and feature updates while preserving the clean, spectrum-guided EQ approach of Pro-Q 3.',
    sonicCharacter:
      'Neutral, precise, modern—color comes from decisions, not from a vintage curve imprint.',
    bestFor:
      'Default EQ across tracks and buses when you want the newest Pro-Q toolset.',
    useCases: [
      'Primary channel EQ in Ableton templates.',
      'Dynamic EQ problem-solving on harsh synths.',
      'Master-bus tonal fine-tuning in linear phase if needed.',
    ],
    notes: 'You also own Pro-Q 3—useful to keep while migrating sessions/presets.',
    tags: ['eq', 'fabfilter'],
  },
  {
    id: 'fabfilter-pro-r',
    name: 'Pro-R',
    vendor: 'FabFilter',
    kind: 'plugin',
    types: ['Reverb'],
    collections: [],
    summary:
      'Musical algorithmic reverb designed for mixing, with Decay Rate EQ and space controls that feel more like mixing than architecture modeling.',
    sonicCharacter:
      'Clean, modern, and surprisingly natural for an algorithmic verb—less “digital sheen” than older bright verbs when set carefully.',
    bestFor:
      'Everyday vocal/instrument reverbs and mix spaces.',
    useCases: [
      'Short vocal plate-like spaces that stay clear.',
      'Longer ambient tails with Decay Rate EQ rolling off mud.',
      'Drum ambience returns in electronic and pop mixes.',
    ],
    tags: ['reverb', 'fabfilter'],
  },
  {
    id: 'fabfilter-pro-r-2',
    name: 'Pro-R 2',
    vendor: 'FabFilter',
    kind: 'plugin',
    types: ['Reverb'],
    collections: [],
    summary:
      'Updated Pro-R with richer algorithm/feature set for more flexible spaces while keeping FabFilter’s mix-oriented reverb workflow.',
    sonicCharacter:
      'Lush yet controllable modern reverb—can go from tight rooms to lush halls without becoming instantly washy if decay EQ is used.',
    bestFor:
      'Primary mix reverb if you prefer the newer Pro-R generation.',
    useCases: [
      'Upgrade vocal return chains from Pro-R to Pro-R 2.',
      'Design genre-specific spaces with character controls.',
      'Create send reverbs that carve low-end out of the tail.',
    ],
    notes: 'You also own original Pro-R.',
    tags: ['reverb', 'fabfilter'],
  },
  {
    id: 'fabfilter-volcano-3',
    name: 'Volcano 3',
    vendor: 'FabFilter',
    kind: 'plugin',
    types: ['Filter', 'Modulation'],
    collections: [],
    summary:
      'Creative analog-modeled filter with up to four non-linear, self-oscillating filters, per-filter drive, flexible serial/parallel/M-S routing, and deep XLFO/envelope/MIDI modulation.',
    sonicCharacter:
      'Gritty, creamy vintage cutoff character—from smooth musical rolls to screaming self-oscillation and driven saturation, depending on style, peak, and drive.',
    bestFor:
      'Filter sweeps, analog-style tone-shaping, and modulated filter FX on synths, drums, vocals, and transitions.',
    useCases: [
      'Resonant low-pass sweeps on a synth or loop into a drop.',
      'Parallel driven filters for stereo/M-S analog color on a bus.',
      'Envelope-follow a vocal or drum to auto-wah or rhythmic filter movement.',
    ],
    tags: ['filter', 'fabfilter', 'modulation'],
  },
  {
    id: 'fabfilter-timeless-3',
    name: 'Timeless 3',
    vendor: 'FabFilter',
    kind: 'plugin',
    types: ['Delay', 'Creative FX'],
    collections: [],
    summary:
      'Vintage-style tape delay with two programmable delay lines, up to 16 taps, analog-sounding filters, Drive/Lo-Fi/Diffuse/Dynamics/Pitch effects, freeze, ping-pong, and deep drag-and-drop modulation.',
    sonicCharacter:
      'From warm analog-ish slapbacks and tape wow to smeared, crushed, or pitch-shifted echo machines—everyday delay that can turn into sound design when modulation and feedback are pushed.',
    bestFor:
      'Vocal/instrument delays, tape-style throws, and creative modulated echo FX.',
    useCases: [
      'Dotted vocal delay with envelope-follower ducking so repeats sit behind the dry word.',
      'Tape-mode delay-time moves for pitchy throw FX.',
      'Diffuse + freeze for infinite, washy delay textures on a synth or transition.',
    ],
    tags: ['delay', 'fabfilter', 'tape'],
  },
  {
    id: 'minimal-audio-poly-flanger',
    name: 'Poly Flanger',
    vendor: 'Minimal Audio',
    kind: 'plugin',
    types: ['Modulation', 'Creative FX'],
    collections: [],
    summary:
      'Scale-aware polyphonic flanger/comb resonator with up to eight voices that can snap to a key, stack chord voicings, and move as arpeggiated harmonic patterns instead of generic jet sweeps.',
    sonicCharacter:
      'From classic metallic flange to in-key harmonic shimmer: Classic (full harmonics), Hollow (odd-harmonic grit), and Vapor (diffused, reverb-like smear). Can become chord-like, harp-like, or glitchy when voices and feedback are pushed.',
    bestFor:
      'Musical flanging on synths, vocals, and guitars, plus harmonic texture design that stays in key.',
    useCases: [
      'Snap voices to the song’s scale for in-key flange on a pad or vocal.',
      'Stack eight voices into panned chord-like comb resonances on a synth.',
      'Use Vapor style for smeared ambient motion instead of a sharp jet sweep.',
    ],
    tags: ['flanger', 'modulation', 'minimal-audio'],
  },
  {
    id: 'relab-lx480-dual-reverb',
    name: 'LX480 Dual Reverb',
    vendor: 'Relab Development',
    kind: 'plugin',
    types: ['Reverb'],
    collections: [],
    summary:
      'Detailed emulation of the Lexicon 480L lineage with dual-engine routing—aimed at the classic “expensive studio Lexicon” sound.',
    sonicCharacter:
      'Lush, classy, slightly dark-to-golden Lexicon tails; the dual engine enables complex wide spaces and classic multi-algorithm tricks.',
    bestFor:
      'Premium vocal/plate-hall vibes, 80s/90s studio polish, and lush mix returns.',
    useCases: [
      'Lead vocal Lexicon-style hall on a stereo return.',
      'Dual-engine width for pads and snare dens.',
      'Cinematic tails that feel vintage-digital rather than convolution-real.',
    ],
    tags: ['reverb', 'lexicon', 'relab'],
  },
  {
    id: 'relab-lx480-essential',
    name: 'LX480 Essential',
    vendor: 'Relab Development',
    kind: 'plugin',
    types: ['Reverb'],
    collections: [],
    summary:
      'Streamlined Relab take on the LX480 sound—core Lexicon-inspired algorithms with a simpler feature set than Dual Reverb.',
    sonicCharacter:
      'Same family as Dual: lush Lexicon-esque reflections with a classic studio sheen, fewer routing gymnastics.',
    bestFor:
      'Quick classic Lexicon-style sends when you do not need dual-engine complexity.',
    useCases: [
      'Fast vocal reverb presets in the LX480 tradition.',
      'Snare dens and drum rooms with vintage digital character.',
      'Lightweight alternative to Dual Reverb on resource-sensitive sessions.',
    ],
    tags: ['reverb', 'lexicon', 'relab'],
  },
  {
    id: 'slate-fg-36a',
    name: 'FG-36A',
    vendor: 'Slate Digital',
    kind: 'plugin',
    types: ['Enhancer'],
    collections: [],
    summary:
      'Two-knob vintage exciter (Intensity / Output) modeled on a 1960s rack unit, hosted in Slate’s Virtual Mix Rack. Adds high-end shimmer and sparkle without a conventional EQ boost.',
    sonicCharacter:
      'Classic exciter sheen—air and presence on the top while the low end stays put. Easy to get fizzy or harsh if Intensity is pushed.',
    bestFor:
      'Vocals, hats, acoustic tops, and 808s/instruments that need high-end life without thinning the bottom.',
    useCases: [
      'Add sparkle to a dull vocal without a harsh high shelf.',
      'Brighten hats or overheads while leaving kick/bass alone.',
      'A little Intensity on an 808 or synth to lift the top without boosting sub.',
    ],
    notes: 'Runs as a module inside Slate Digital Virtual Mix Rack.',
    tags: ['exciter', 'slate', 'vmr'],
  },
]
