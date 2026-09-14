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
import { nomadFactoryBlueTubes } from './nomad-factory'

export type { CatalogEntry, PluginType } from './types'
export { COLLECTION_NAMES } from './types'

export const catalog: CatalogEntry[] = [
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
].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))

export const allTypes: PluginType[] = Array.from(
  new Set(catalog.flatMap((e) => e.types)),
).sort((a, b) => a.localeCompare(b))

export const allVendors: string[] = Array.from(
  new Set(catalog.map((e) => e.vendor)),
).sort((a, b) => a.localeCompare(b))

export const allCollections: string[] = Array.from(
  new Set(catalog.flatMap((e) => e.collections)),
).sort((a, b) => a.localeCompare(b))
