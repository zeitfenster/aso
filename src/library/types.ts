export const DEFAULT_SLOTS = [
  { id: 'vocal-compressor', label: 'Vocal compressor' },
  { id: 'vocal-eq', label: 'Vocal EQ' },
  { id: 'vocal-plate', label: 'Vocal plate' },
  { id: 'snare-compressor', label: 'Snare compressor' },
  { id: 'drum-bus', label: 'Drum bus glue' },
  { id: 'mix-bus-glue', label: 'Mix bus glue' },
  { id: 'mix-bus-eq', label: 'Mix bus EQ' },
  { id: 'surgical-eq', label: 'Surgical EQ' },
  { id: 'master-limiter', label: 'Master limiter' },
] as const

export type DefaultSlotId = (typeof DEFAULT_SLOTS)[number]['id']

export type PluginJournalEntry = {
  notes: string
  reachForWhen: string
  presets: string[]
  shortlisted: boolean
}

export type UserLibrary = {
  version: 1
  plugins: Record<string, PluginJournalEntry>
  defaults: Partial<Record<DefaultSlotId, string>>
  lastOpened: string[]
}

export const MAX_RECENT = 12

export function emptyJournal(): PluginJournalEntry {
  return { notes: '', reachForWhen: '', presets: [], shortlisted: false }
}

export function emptyLibrary(): UserLibrary {
  return { version: 1, plugins: {}, defaults: {}, lastOpened: [] }
}

export function slotLabel(id: string) {
  return DEFAULT_SLOTS.find((slot) => slot.id === id)?.label ?? id
}

export function journalHaystack(entry: PluginJournalEntry | undefined) {
  if (!entry) return []
  return [entry.notes, entry.reachForWhen, ...entry.presets]
}

export function defaultSlotFor(library: UserLibrary, pluginId: string) {
  for (const [slot, id] of Object.entries(library.defaults)) {
    if (id === pluginId) return slot as DefaultSlotId
  }
  return null
}
