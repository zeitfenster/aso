import type { CatalogEntry } from './types'

/**
 * Curated “if you were reaching for this, also try”. Ids must exist in the catalog.
 * Lookup is bidirectional in similarEntries().
 */
export const INSTEAD_OF: Record<string, string[]> = {
  'waves-cla-76': ['arturia-comp-fet-76', 'psp-fetpressor', 'pa-mc77'],
  'arturia-comp-fet-76': ['waves-cla-76', 'psp-fetpressor'],
  'psp-fetpressor': ['waves-cla-76', 'arturia-comp-fet-76'],
  'fabfilter-pro-c-2': ['fabfilter-pro-c-3'],
  'fabfilter-pro-c-3': ['fabfilter-pro-c-2'],
  'fabfilter-pro-q-3': ['fabfilter-pro-q-4'],
  'fabfilter-pro-q-4': ['fabfilter-pro-q-3'],
  'fabfilter-pro-l-2': ['pa-bx-limiter-true-peak', 'psp-xenon'],
  'pa-bx-limiter-true-peak': ['fabfilter-pro-l-2', 'psp-xenon'],
  'pa-bx-masterdesk': ['pa-bx-masterdesk-true-peak'],
  'pa-bx-masterdesk-true-peak': ['pa-bx-masterdesk'],
  'soundtoys-echoboy': ['fabfilter-timeless-3', 'pa-bx-pulsar', 'psp-bbdelay'],
  'fabfilter-timeless-3': ['soundtoys-echoboy', 'pa-bx-pulsar'],
  'pa-bx-pulsar': ['soundtoys-echoboy', 'fabfilter-timeless-3'],
  'psp-echo': ['psp-bbdelay', 'arturia-delay-brigade'],
  'psp-bbdelay': ['psp-echo', 'arturia-delay-brigade', 'soundtoys-echoboy'],
  'waves-h-reverb': ['fabfilter-pro-r', 'relab-lx480-dual-reverb'],
  'fabfilter-pro-r': ['waves-h-reverb', 'fabfilter-pro-r-2'],
  'fabfilter-pro-r-2': ['fabfilter-pro-r', 'waves-h-reverb'],
  'psp-busspressor': ['pa-bx-townhouse-buss', 'ni-solid-bus-comp'],
  'pa-bx-townhouse-buss': ['psp-busspressor', 'ni-solid-bus-comp'],
  'waves-deesser': ['waves-renaissance-deesser', 'waves-sibilance', 'fabfilter-pro-ds'],
  'waves-renaissance-deesser': ['waves-deesser', 'waves-sibilance', 'fabfilter-pro-ds'],
  'waves-sibilance': ['waves-deesser', 'waves-renaissance-deesser', 'fabfilter-pro-ds'],
  'fabfilter-pro-ds': ['waves-sibilance', 'waves-deesser', 'waves-renaissance-deesser'],
  'soundtoys-decapitator': ['fabfilter-saturn-2', 'arturia-dist-coldfire'],
  'fabfilter-saturn-2': ['soundtoys-decapitator', 'arturia-dist-coldfire'],
  'arturia-dist-coldfire': ['fabfilter-saturn-2', 'soundtoys-decapitator'],
  'fabfilter-twin-3': ['ni-super-8'],
  'ni-super-8': ['fabfilter-twin-3'],
  'pa-hg-2': ['pa-hg-q'],
  'pa-hg-q': ['pa-hg-2'],
  'uad-moog-minimoog': ['arturia-mini-v', 'ni-monark'],
  'arturia-mini-v': ['uad-moog-minimoog', 'ni-monark'],
  'ni-monark': ['uad-moog-minimoog', 'arturia-mini-v'],
}

const SIMILAR_LIMIT = 5

export function similarEntries(
  entry: CatalogEntry,
  catalog: CatalogEntry[],
  limit = SIMILAR_LIMIT,
): { curated: CatalogEntry[]; computed: CatalogEntry[] } {
  const byId = new Map(catalog.map((item) => [item.id, item]))
  const curatedIds = INSTEAD_OF[entry.id] ?? []
  const curated = curatedIds
    .map((id) => byId.get(id))
    .filter((item): item is CatalogEntry => Boolean(item))

  const taken = new Set([entry.id, ...curated.map((item) => item.id)])
  const types = new Set(entry.types)
  const subtypes = new Set(entry.subtypes ?? [])
  const positions = new Set(entry.chainPositions ?? [])

  const computed = catalog
    .filter((other) => !taken.has(other.id))
    .map((other) => {
      const typeOverlap = other.types.filter((type) => types.has(type)).length
      if (typeOverlap === 0) return null
      const subtypeOverlap = (other.subtypes ?? []).filter((subtype) =>
        subtypes.has(subtype),
      ).length
      const chainOverlap = (other.chainPositions ?? []).filter((position) =>
        positions.has(position),
      ).length
      const score =
        typeOverlap * 4 +
        subtypeOverlap * 6 +
        chainOverlap * 2 +
        (other.vendor === entry.vendor ? 1 : 0)
      return { other, score }
    })
    .filter((item): item is { other: CatalogEntry; score: number } => Boolean(item))
    .sort(
      (a, b) =>
        b.score - a.score || a.other.name.localeCompare(b.other.name),
    )
    .slice(0, Math.max(0, limit - curated.length))
    .map((item) => item.other)

  return { curated, computed }
}
