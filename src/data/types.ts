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
}

export const COLLECTION_NAMES = [
  'Arturia FX Collection',
  'Arturia V Collection 7',
  'Native Instruments Komplete 13 Standard',
  'Plugin Alliance',
  'Soundtoys Bundle v5.3',
  'Waves Horizon',
  'Waves Restoration',
] as const

export type CollectionName = (typeof COLLECTION_NAMES)[number] | string
