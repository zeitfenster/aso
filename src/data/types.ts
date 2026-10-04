export type EntryKind = 'plugin' | 'package' | 'host' | 'application'

export type PluginType =
  | 'Host / DAW'
  | 'DJ Software'
  | 'Synth'
  | 'Keys / Piano'
  | 'Bass'
  | 'Drum Machine'
  | 'Sampler'
  | 'EQ'
  | 'Compressor'
  | 'Limiter'
  | 'Multiband Dynamics'
  | 'Reverb'
  | 'Delay'
  | 'Saturation / Distortion'
  | 'Modulation'
  | 'Pitch / Harmony'
  | 'Enhancer'
  | 'Vocal Suite'
  | 'Mixing Suite'
  | 'Mastering Suite'
  | 'Creative FX'
  | 'Restoration'
  | 'Analysis / Metering'
  | 'Guitar Amp / FX'
  | 'Transient Shaper'
  | 'Filter'
  | 'Utility'
  | 'Bundle / Collection'

/**
 * Architecture / circuit class from the vendor or a named hardware model.
 * Empty on an entry means unspecified — not a guess from reviews.
 */
export const PLUGIN_SUBTYPES = [
  'FET',
  'Opto',
  'VCA / bus',
  'Vari-Mu',
  'Diode bridge',
  'Digital / clean',
  'Clipper',
  'Surgical parametric',
  'Dynamic EQ',
  'Console / channel',
  'Passive / Pultec',
  'Tilt / Baxandall',
  'Linear-phase',
  'Plate',
  'Hall',
  'Room / chamber',
  'Spring',
  'Algorithmic mix',
  'Creative / infinite',
  'Convolution',
  'Tape',
  'BBD / analog',
  'Digital / multi-tap',
  'Granular / reverse',
  'Tube',
  'Tape machine',
  'Console summing',
  'Bitcrush / digital',
  'Subtractive analog',
  'FM',
  'Wavetable',
  'Phase distortion',
  'Additive / modal',
  'West Coast / modular',
  'Sampling / ROMpler',
  'Acoustic piano',
  'Electric piano',
  'Organ',
  'String ensemble',
  'Mellotron / tape keys',
  'Clavinet',
  'Chorus',
  'Flanger',
  'Phaser',
  'Tremolo',
  'Rotary',
  'Auto-pan',
  'Ladder',
  'Amp sim',
  'Multi-mode',
] as const

export type PluginSubtype = (typeof PLUGIN_SUBTYPES)[number]

/** How the subtype was assigned. Empty subtypes have no origin. */
export type SubtypeOrigin = 'vendor' | 'inferred'

export interface CatalogEntry {
  id: string
  name: string
  vendor: string
  kind: EntryKind
  types: PluginType[]
  /** Parent packages/collections this selectable plugin belongs to */
  collections: string[]
  summary: string
  sonicCharacter: string
  bestFor: string
  useCases: string[]
  notes?: string
  tags: string[]
  /** Architecture class. Omitted/empty = unspecified. */
  subtypes?: PluginSubtype[]
  /** vendor = named circuit/model. inferred = common classification, not a spec. */
  subtypeOrigin?: SubtypeOrigin
}

export const COLLECTION_NAMES = [
  'Arturia FX Collection',
  'Arturia V Collection 7',
  'Native Instruments Komplete 13 Standard',
  'Nomad Factory Liquid Bundle III',
  'Plugin Alliance',
  'PSP 25th Anniversary Bundle',
  'Soundtoys Bundle v5.3',
  'Waves Horizon',
  'Waves Restoration',
] as const

export type CollectionName = (typeof COLLECTION_NAMES)[number] | string
