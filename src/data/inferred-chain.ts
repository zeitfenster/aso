import type { CatalogEntry, ChainPosition, PluginType } from './types'

const INSTRUMENT_TYPES: PluginType[] = [
  'Synth',
  'Keys / Piano',
  'Bass',
  'Drum Machine',
  'Sampler',
]

const SKIP_TYPES: PluginType[] = [
  'Host / DAW',
  'DJ Software',
  'Bundle / Collection',
  'Analysis / Metering',
  'Utility',
]

const INSERT_TYPES: PluginType[] = [
  'EQ',
  'Compressor',
  'Limiter',
  'Multiband Dynamics',
  'Saturation / Distortion',
  'Transient Shaper',
  'Filter',
  'Guitar Amp / FX',
  'Vocal Suite',
  'De-esser',
  'Pitch / Harmony',
  'Enhancer',
  'Restoration',
  'Mixing Suite',
  'Delay',
  'Modulation',
  'Creative FX',
]

const SEND_TYPES: PluginType[] = [
  'Reverb',
  'Delay',
  'Modulation',
  'Creative FX',
]

const BUS_TYPES: PluginType[] = ['Mixing Suite', 'Multiband Dynamics']

const MASTER_TYPES: PluginType[] = ['Mastering Suite']

function hasType(entry: Pick<CatalogEntry, 'types'>, pool: PluginType[]) {
  return entry.types.some((type) => pool.includes(type))
}

/**
 * Common-sense chain place from catalog type. Not a spec sheet.
 * Instruments, meters, hosts, and utilities stay unspecified.
 */
export function inferredChainPositions(
  entry: Pick<CatalogEntry, 'kind' | 'types'>,
): ChainPosition[] {
  if (entry.kind !== 'plugin') return []
  const onlySkip = entry.types.every(
    (type) => SKIP_TYPES.includes(type) || INSTRUMENT_TYPES.includes(type),
  )
  if (onlySkip) return []

  const positions = new Set<ChainPosition>()
  if (hasType(entry, INSERT_TYPES)) positions.add('Insert')
  if (hasType(entry, SEND_TYPES)) positions.add('Send')
  if (hasType(entry, BUS_TYPES)) positions.add('Bus')
  if (hasType(entry, MASTER_TYPES)) positions.add('Master')
  return Array.from(positions)
}
