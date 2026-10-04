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
import { pspAnniversaryBundle } from './psp-audioware'
import { SUBTYPE_ASSIGNMENTS } from './subtype-assignments'
import { INFERRED_SUBTYPES } from './inferred-subtypes'

export type { CatalogEntry, PluginSubtype, PluginType, SubtypeOrigin } from './types'
export { COLLECTION_NAMES, PLUGIN_SUBTYPES } from './types'

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

export const catalog: CatalogEntry[] = catalogSource
  .map((entry) => {
    const vendor = SUBTYPE_ASSIGNMENTS[entry.id]
    const inferred = INFERRED_SUBTYPES[entry.id]
    if (vendor) {
      return { ...entry, subtypes: vendor, subtypeOrigin: 'vendor' as const }
    }
    if (inferred) {
      return { ...entry, subtypes: inferred, subtypeOrigin: 'inferred' as const }
    }
    return { ...entry, subtypes: [], subtypeOrigin: undefined }
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
