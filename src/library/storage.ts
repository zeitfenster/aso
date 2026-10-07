import {
  cloneChain,
  emptyLibrary,
  MAX_CHAIN_LABEL,
  MAX_CHAIN_STEPS,
  MAX_CHAIN_WHEN,
  MAX_CHAINS,
  MAX_RECENT,
  MAX_SLOT_LABEL,
  MAX_SLOTS,
  MAX_STEP_NOTE,
  SEED_CHAINS,
  SEED_SLOTS,
  STEP_PLACES,
  uniqueSlotId,
  uniqueStepId,
  type DefaultSlot,
  type PluginJournalEntry,
  type SignalChain,
  type SignalChainStep,
  type StepPlace,
  type UserLibrary,
} from './types'

const STORAGE_KEY = 'aso-library-v1'
const MAX_NOTE = 4000
const MAX_PRESETS = 24
const MAX_PRESET_LEN = 160

function clip(value: unknown, max: number) {
  if (typeof value !== 'string') return ''
  return value.slice(0, max)
}

function sanitizeSlots(raw: unknown): DefaultSlot[] | null {
  if (!Array.isArray(raw)) return null
  const slots: DefaultSlot[] = []
  const used = new Set<string>()
  for (const item of raw) {
    if (slots.length >= MAX_SLOTS) break
    if (!item || typeof item !== 'object') continue
    const source = item as { id?: unknown; label?: unknown }
    const label = clip(String(source.label ?? '').trim(), MAX_SLOT_LABEL)
    if (!label) continue
    const wanted =
      typeof source.id === 'string' && source.id.trim()
        ? source.id.trim().slice(0, 48)
        : uniqueSlotId(label, used)
    const id = used.has(wanted) ? uniqueSlotId(label, used) : wanted
    used.add(id)
    slots.push({ id, label })
  }
  return slots
}

function isStepPlace(value: unknown): value is StepPlace {
  return STEP_PLACES.some((place) => place === value)
}

function sanitizeSteps(raw: unknown): SignalChainStep[] {
  if (!Array.isArray(raw)) return []
  const steps: SignalChainStep[] = []
  const used = new Set<string>()
  for (const item of raw) {
    if (steps.length >= MAX_CHAIN_STEPS) break
    if (!item || typeof item !== 'object') continue
    const source = item as {
      id?: unknown
      pluginId?: unknown
      note?: unknown
      place?: unknown
    }
    const pluginId =
      typeof source.pluginId === 'string' ? source.pluginId.trim().slice(0, 80) : ''
    if (!pluginId) continue
    const wanted =
      typeof source.id === 'string' && source.id.trim()
        ? source.id.trim().slice(0, 48)
        : uniqueStepId(used)
    const id = used.has(wanted) ? uniqueStepId(used) : wanted
    used.add(id)
    const step: SignalChainStep = {
      id,
      pluginId,
      note: clip(String(source.note ?? '').trim(), MAX_STEP_NOTE),
    }
    if (isStepPlace(source.place)) step.place = source.place
    steps.push(step)
  }
  return steps
}

function sanitizeChains(raw: unknown): SignalChain[] | null {
  if (!Array.isArray(raw)) return null
  const chains: SignalChain[] = []
  const used = new Set<string>()
  for (const item of raw) {
    if (chains.length >= MAX_CHAINS) break
    if (!item || typeof item !== 'object') continue
    const source = item as {
      id?: unknown
      label?: unknown
      when?: unknown
      steps?: unknown
    }
    const label = clip(String(source.label ?? '').trim(), MAX_CHAIN_LABEL)
    if (!label) continue
    const wanted =
      typeof source.id === 'string' && source.id.trim()
        ? source.id.trim().slice(0, 48)
        : uniqueSlotId(label, used)
    const id = used.has(wanted) ? uniqueSlotId(label, used) : wanted
    used.add(id)
    chains.push({
      id,
      label,
      when: clip(String(source.when ?? '').trim(), MAX_CHAIN_WHEN),
      steps: sanitizeSteps(source.steps),
    })
  }
  return chains
}

export function sanitizeLibrary(raw: unknown): UserLibrary {
  const base = emptyLibrary()
  if (!raw || typeof raw !== 'object') return base
  const source = raw as Partial<UserLibrary> & {
    defaultSlots?: unknown
    chains?: unknown
  }
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

  const parsedSlots = sanitizeSlots(source.defaultSlots)
  const defaultSlots =
    parsedSlots === null
      ? SEED_SLOTS.map((slot) => ({ ...slot }))
      : parsedSlots
  const slotIds = new Set(defaultSlots.map((slot) => slot.id))

  const defaults: UserLibrary['defaults'] = {}
  if (source.defaults && typeof source.defaults === 'object') {
    for (const [slot, pluginId] of Object.entries(source.defaults)) {
      if (slotIds.has(slot) && typeof pluginId === 'string' && pluginId) {
        defaults[slot] = pluginId
      }
    }
  }
  const lastOpened = Array.isArray(source.lastOpened)
    ? source.lastOpened.filter((id): id is string => typeof id === 'string').slice(0, MAX_RECENT)
    : []
  const parsedChains = sanitizeChains(source.chains)
  const chains =
    parsedChains === null
      ? SEED_CHAINS.map((chain) => cloneChain(chain))
      : parsedChains
  return { version: 1, plugins, defaultSlots, defaults, chains, lastOpened }
}

function libraryHasUserData(library: UserLibrary) {
  return (
    Object.keys(library.plugins).length > 0 ||
    Object.keys(library.defaults).length > 0 ||
    library.lastOpened.length > 0 ||
    library.defaultSlots.length !== SEED_SLOTS.length ||
    library.defaultSlots.some(
      (slot, index) =>
        slot.id !== SEED_SLOTS[index]?.id || slot.label !== SEED_SLOTS[index]?.label,
    ) ||
    library.chains.length !== SEED_CHAINS.length ||
    library.chains.some((chain, index) => {
      const seed = SEED_CHAINS[index]
      return (
        !seed ||
        chain.id !== seed.id ||
        chain.label !== seed.label ||
        chain.when !== seed.when ||
        chain.steps.length > 0
      )
    })
  )
}

export async function loadLibrary(): Promise<UserLibrary> {
  try {
    if (window.asoApi?.getLibrary) {
      const result = await window.asoApi.getLibrary()
      if (result?.ok && result.library) {
        const fromDisk = sanitizeLibrary(result.library)
        if (libraryHasUserData(fromDisk)) return fromDisk
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
