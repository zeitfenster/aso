import {
  DEFAULT_SLOTS,
  emptyLibrary,
  MAX_RECENT,
  type DefaultSlotId,
  type PluginJournalEntry,
  type UserLibrary,
} from './types'

const STORAGE_KEY = 'aso-library-v1'
const MAX_NOTE = 4000
const MAX_PRESETS = 24
const MAX_PRESET_LEN = 160

const SLOT_IDS = new Set(DEFAULT_SLOTS.map((slot) => slot.id))

function clip(value: unknown, max: number) {
  if (typeof value !== 'string') return ''
  return value.slice(0, max)
}

export function sanitizeLibrary(raw: unknown): UserLibrary {
  const base = emptyLibrary()
  if (!raw || typeof raw !== 'object') return base
  const source = raw as Partial<UserLibrary>
  const plugins: UserLibrary['plugins'] = {}
  if (source.plugins && typeof source.plugins === 'object') {
    for (const [id, entry] of Object.entries(source.plugins)) {
      if (!entry || typeof entry !== 'object') continue
      const presets = Array.isArray(entry.presets)
        ? entry.presets
            .filter((item): item is string => typeof item === 'string')
            .map((item) => clip(item.trim(), MAX_PRESET_LEN))
            .filter(Boolean)
            .slice(0, MAX_PRESETS)
        : []
      plugins[id] = {
        notes: clip(entry.notes, MAX_NOTE),
        reachForWhen: clip(entry.reachForWhen, MAX_NOTE),
        presets,
        shortlisted: Boolean(entry.shortlisted),
      }
    }
  }
  const defaults: UserLibrary['defaults'] = {}
  if (source.defaults && typeof source.defaults === 'object') {
    for (const [slot, pluginId] of Object.entries(source.defaults)) {
      if (
        SLOT_IDS.has(slot as DefaultSlotId) &&
        typeof pluginId === 'string' &&
        pluginId
      ) {
        defaults[slot as DefaultSlotId] = pluginId
      }
    }
  }
  const lastOpened = Array.isArray(source.lastOpened)
    ? source.lastOpened.filter((id): id is string => typeof id === 'string').slice(0, MAX_RECENT)
    : []
  return { version: 1, plugins, defaults, lastOpened }
}

export async function loadLibrary(): Promise<UserLibrary> {
  try {
    if (window.asoApi?.getLibrary) {
      const result = await window.asoApi.getLibrary()
      if (result?.ok && result.library) {
        const fromDisk = sanitizeLibrary(result.library)
        const hasData =
          Object.keys(fromDisk.plugins).length > 0 ||
          Object.keys(fromDisk.defaults).length > 0 ||
          fromDisk.lastOpened.length > 0
        if (hasData) return fromDisk
      }
    }
  } catch {
    /* fall through */
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return sanitizeLibrary(JSON.parse(stored))
  } catch {
    /* ignore */
  }
  return emptyLibrary()
}

export async function persistLibrary(library: UserLibrary): Promise<void> {
  const next = sanitizeLibrary(library)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    /* ignore */
  }
  try {
    await window.asoApi?.setLibrary?.(next)
  } catch {
    /* ignore */
  }
}

export function journalOf(
  library: UserLibrary,
  pluginId: string,
): PluginJournalEntry {
  return library.plugins[pluginId] ?? {
    notes: '',
    reachForWhen: '',
    presets: [],
    shortlisted: false,
  }
}

export function isJournalEmpty(entry: PluginJournalEntry) {
  return (
    !entry.shortlisted &&
    !entry.notes.trim() &&
    !entry.reachForWhen.trim() &&
    entry.presets.length === 0
  )
}
