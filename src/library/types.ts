export type DefaultSlot = {
  id: string
  label: string
}

export const SEED_SLOTS: DefaultSlot[] = [
  { id: 'vocal-compressor', label: 'Vocal compressor' },
  { id: 'vocal-eq', label: 'Vocal EQ' },
  { id: 'vocal-plate', label: 'Vocal plate' },
  { id: 'snare-compressor', label: 'Snare compressor' },
  { id: 'drum-bus', label: 'Drum bus glue' },
  { id: 'mix-bus-glue', label: 'Mix bus glue' },
  { id: 'mix-bus-eq', label: 'Mix bus EQ' },
  { id: 'surgical-eq', label: 'Surgical EQ' },
  { id: 'master-limiter', label: 'Master limiter' },
]

export const MAX_RECENT = 12
export const MAX_SLOTS = 40
export const MAX_SLOT_LABEL = 48
export const MAX_CHAINS = 40
export const MAX_CHAIN_LABEL = 64
export const MAX_CHAIN_WHEN = 400
export const MAX_CHAIN_STEPS = 24
export const MAX_STEP_NOTE = 160
export const STEP_PLACES = ['Insert', 'Send', 'Bus', 'Master'] as const
export type StepPlace = (typeof STEP_PLACES)[number]

export type SignalChainStep = {
  id: string
  pluginId: string
  note: string
  place?: StepPlace
}

export type SignalChain = {
  id: string
  label: string
  when: string
  steps: SignalChainStep[]
}

export const SEED_CHAINS: SignalChain[] = [
  { id: 'pop-vocal', label: 'Pop vocal', when: '', steps: [] },
  { id: 'drum-bus', label: 'Drum bus', when: '', steps: [] },
  { id: 'master', label: 'Master', when: '', steps: [] },
]

export type PluginJournalEntry = {
  notes: string
  reachForWhen: string
  presets: string[]
  shortlisted: boolean
}

export type UserLibrary = {
  version: 1
  plugins: Record<string, PluginJournalEntry>
  defaultSlots: DefaultSlot[]
  defaults: Record<string, string>
  chains: SignalChain[]
  lastOpened: string[]
}

export function emptyJournal(): PluginJournalEntry {
  return { notes: '', reachForWhen: '', presets: [], shortlisted: false }
}

export function emptyLibrary(): UserLibrary {
  return {
    version: 1,
    plugins: {},
    defaultSlots: SEED_SLOTS.map((slot) => ({ ...slot })),
    defaults: {},
    chains: SEED_CHAINS.map(cloneChain),
    lastOpened: [],
  }
}

export function cloneChain(chain: SignalChain): SignalChain {
  return {
    ...chain,
    steps: chain.steps.map((step) => ({ ...step })),
  }
}

export function slugifySlot(label: string) {
  const base = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
  return base || 'slot'
}

export function uniqueSlotId(label: string, existing: Iterable<string>) {
  const used = new Set(existing)
  const base = slugifySlot(label)
  if (!used.has(base)) return base
  let n = 2
  while (used.has(`${base}-${n}`)) n += 1
  return `${base}-${n}`
}

export function slotLabel(library: UserLibrary, id: string) {
  return library.defaultSlots.find((slot) => slot.id === id)?.label ?? id
}

export function journalHaystack(entry: PluginJournalEntry | undefined) {
  if (!entry) return []
  return [entry.notes, entry.reachForWhen, ...entry.presets]
}

export function defaultSlotFor(library: UserLibrary, pluginId: string) {
  for (const [slot, id] of Object.entries(library.defaults)) {
    if (id === pluginId) return slot
  }
  return null
}

export function chainsForPlugin(library: UserLibrary, pluginId: string) {
  return library.chains.filter((chain) =>
    chain.steps.some((step) => step.pluginId === pluginId),
  )
}

export function chainHaystack(library: UserLibrary, pluginId: string) {
  const extra: string[] = []
  for (const chain of chainsForPlugin(library, pluginId)) {
    extra.push(chain.label, chain.when)
    for (const step of chain.steps) {
      if (step.pluginId === pluginId) extra.push(step.note)
    }
  }
  return extra
}

export function uniqueStepId(existing: Iterable<string>) {
  const used = new Set(existing)
  let n = 1
  while (used.has(`step-${n}`)) n += 1
  return `step-${n}`
}
