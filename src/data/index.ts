import type { CatalogEntry, PluginType } from './types'
import { hostsAndApps } from './hosts'
import { standaloneInstruments } from './standalone-instruments'
import { standaloneEffects } from './standalone-effects'
import { izotopeEntries } from './izotope'
import { arturiaFx } from './arturia-fx'
import { arturiaVCollection } from './arturia-v'
import { soundtoysBundle } from './soundtoys'
import { wavesNamed, wavesHorizon } from './waves'
import { pluginAlliance } from './plugin-alliance'
import { komplete13 } from './komplete'
import { nomadFactoryBlueTubes, nomadFactoryLiquid } from './nomad-factory'
import { pspAnniversaryBundle, pspStandalone } from './psp-audioware'
import { SUBTYPE_ASSIGNMENTS } from './subtype-assignments'
import { INFERRED_SUBTYPES } from './inferred-subtypes'
import { CHAIN_ASSIGNMENTS } from './chain-assignments'
import { inferredChainPositions } from './inferred-chain'
import { INSTEAD_OF } from './similar'

export type { CatalogEntry, ChainPosition, PluginSubtype, PluginType, SubtypeOrigin } from './types'
export { CHAIN_POSITIONS, COLLECTION_NAMES, PLUGIN_SUBTYPES } from './types'

const catalogSource: CatalogEntry[] = [
  ...hostsAndApps,
  ...standaloneInstruments,
  ...standaloneEffects,
  ...izotopeEntries,
  ...arturiaFx,
  ...arturiaVCollection,
  ...soundtoysBundle,
  ...wavesNamed,
  ...wavesHorizon,
  ...pluginAlliance,
  ...komplete13,
  ...nomadFactoryBlueTubes,
  ...nomadFactoryLiquid,
  ...pspAnniversaryBundle,
  ...pspStandalone,
]

const catalogIds = new Set(catalogSource.map((entry) => entry.id))
for (const id of Object.keys(SUBTYPE_ASSIGNMENTS)) {
  if (!catalogIds.has(id)) {
    throw new Error(`Unknown catalog id in subtype assignments: ${id}`)
  }
}
for (const id of Object.keys(INFERRED_SUBTYPES)) {
  if (!catalogIds.has(id)) {
    throw new Error(`Unknown catalog id in inferred subtypes: ${id}`)
  }
  if (SUBTYPE_ASSIGNMENTS[id]) {
    throw new Error(`Inferred subtype overlaps vendor assignment: ${id}`)
  }
}

for (const id of Object.keys(CHAIN_ASSIGNMENTS)) {
  if (!catalogIds.has(id)) {
    throw new Error(`Unknown catalog id in chain assignments: ${id}`)
  }
}
for (const [id, others] of Object.entries(INSTEAD_OF)) {
  if (!catalogIds.has(id)) {
    throw new Error(`Unknown catalog id in similar map: ${id}`)
  }
  for (const other of others) {
    if (!catalogIds.has(other)) {
      throw new Error(`Unknown similar target ${other} from ${id}`)
    }
  }
}

export const catalog: CatalogEntry[] = catalogSource
  .map((entry) => {
    const vendor = SUBTYPE_ASSIGNMENTS[entry.id]
    const inferred = INFERRED_SUBTYPES[entry.id]
    const chainVendor = CHAIN_ASSIGNMENTS[entry.id]
    const chainInferred = inferredChainPositions(entry)
    const withSubtypes = vendor
      ? { ...entry, subtypes: vendor, subtypeOrigin: 'vendor' as const }
      : inferred
        ? { ...entry, subtypes: inferred, subtypeOrigin: 'inferred' as const }
        : { ...entry, subtypes: [], subtypeOrigin: undefined }
    if (chainVendor) {
      return {
        ...withSubtypes,
        chainPositions: chainVendor,
        chainOrigin: 'vendor' as const,
      }
    }
    if (chainInferred.length > 0) {
      return {
        ...withSubtypes,
        chainPositions: chainInferred,
        chainOrigin: 'inferred' as const,
      }
    }
    return { ...withSubtypes, chainPositions: [], chainOrigin: undefined }
  })
  .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))

export const allTypes: PluginType[] = Array.from(
  new Set(catalog.flatMap((e) => e.types)),
).sort((a, b) => a.localeCompare(b))

export const allVendors: string[] = Array.from(
  new Set(catalog.map((e) => e.vendor)),
).sort((a, b) => a.localeCompare(b))

export const allCollections: string[] = Array.from(
  new Set(catalog.flatMap((e) => e.collections)),
).sort((a, b) => a.localeCompare(b))
