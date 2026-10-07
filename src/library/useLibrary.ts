import { useCallback, useEffect, useRef, useState } from 'react'
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
  uniqueSlotId,
  uniqueStepId,
  type PluginJournalEntry,
  type SignalChainStep,
  type StepPlace,
  type UserLibrary,
} from './types'
import { isJournalEmpty, journalOf, loadLibrary, persistLibrary } from './storage'

const SAVE_MS = 400

export function useLibrary() {
  const [library, setLibrary] = useState<UserLibrary>(emptyLibrary)
  const [ready, setReady] = useState(false)
  const latest = useRef(library)
  latest.current = library

  useEffect(() => {
    let cancelled = false
    loadLibrary().then((loaded) => {
      if (cancelled) return
      setLibrary(loaded)
      latest.current = loaded
      setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!ready) return undefined
    const timer = window.setTimeout(() => {
      void persistLibrary(latest.current)
    }, SAVE_MS)
    return () => window.clearTimeout(timer)
  }, [library, ready])

  useEffect(() => {
    return () => {
      if (ready) void persistLibrary(latest.current)
    }
  }, [ready])

  const patchPlugin = useCallback(
    (pluginId: string, patch: Partial<PluginJournalEntry>) => {
      setLibrary((current) => {
        const previous = journalOf(current, pluginId)
        const nextEntry = { ...previous, ...patch }
        const plugins = { ...current.plugins }
        if (isJournalEmpty(nextEntry)) delete plugins[pluginId]
        else plugins[pluginId] = nextEntry
        return { ...current, plugins }
      })
    },
    [],
  )

  const toggleShortlist = useCallback((pluginId: string) => {
    setLibrary((current) => {
      const previous = journalOf(current, pluginId)
      const nextEntry = { ...previous, shortlisted: !previous.shortlisted }
      const plugins = { ...current.plugins }
      if (isJournalEmpty(nextEntry)) delete plugins[pluginId]
      else plugins[pluginId] = nextEntry
      return { ...current, plugins }
    })
  }, [])

  const setDefault = useCallback((slotId: string, pluginId: string | null) => {
    setLibrary((current) => {
      const defaults = { ...current.defaults }
      if (!pluginId) delete defaults[slotId]
      else defaults[slotId] = pluginId
      return { ...current, defaults }
    })
  }, [])

  const assignDefaultSlot = useCallback((pluginId: string, slotId: string | null) => {
    setLibrary((current) => {
      const defaults = { ...current.defaults }
      for (const [slot, id] of Object.entries(defaults)) {
        if (id === pluginId) delete defaults[slot]
      }
      if (slotId) defaults[slotId] = pluginId
      return { ...current, defaults }
    })
  }, [])

  const addSlot = useCallback((label: string) => {
    const trimmed = label.trim().slice(0, MAX_SLOT_LABEL)
    if (!trimmed) return
    setLibrary((current) => {
      if (current.defaultSlots.length >= MAX_SLOTS) return current
      const id = uniqueSlotId(
        trimmed,
        current.defaultSlots.map((slot) => slot.id),
      )
      return {
        ...current,
        defaultSlots: [...current.defaultSlots, { id, label: trimmed }],
      }
    })
  }, [])

  const renameSlot = useCallback((slotId: string, label: string) => {
    const trimmed = label.trim().slice(0, MAX_SLOT_LABEL)
    if (!trimmed) return
    setLibrary((current) => ({
      ...current,
      defaultSlots: current.defaultSlots.map((slot) =>
        slot.id === slotId ? { ...slot, label: trimmed } : slot,
      ),
    }))
  }, [])

  const removeSlot = useCallback((slotId: string) => {
    setLibrary((current) => {
      const defaults = { ...current.defaults }
      delete defaults[slotId]
      return {
        ...current,
        defaultSlots: current.defaultSlots.filter((slot) => slot.id !== slotId),
        defaults,
      }
    })
  }, [])

  const addChain = useCallback((label: string) => {
    const trimmed = label.trim().slice(0, MAX_CHAIN_LABEL)
    if (!trimmed) return
    setLibrary((current) => {
      if (current.chains.length >= MAX_CHAINS) return current
      const id = uniqueSlotId(
        trimmed,
        current.chains.map((chain) => chain.id),
      )
      return {
        ...current,
        chains: [
          ...current.chains,
          { id, label: trimmed, when: '', steps: [] },
        ],
      }
    })
  }, [])

  const renameChain = useCallback((chainId: string, label: string) => {
    const trimmed = label.trim().slice(0, MAX_CHAIN_LABEL)
    if (!trimmed) return
    setLibrary((current) => ({
      ...current,
      chains: current.chains.map((chain) =>
        chain.id === chainId ? { ...chain, label: trimmed } : chain,
      ),
    }))
  }, [])

  const setChainWhen = useCallback((chainId: string, when: string) => {
    const trimmed = when.slice(0, MAX_CHAIN_WHEN)
    setLibrary((current) => ({
      ...current,
      chains: current.chains.map((chain) =>
        chain.id === chainId ? { ...chain, when: trimmed } : chain,
      ),
    }))
  }, [])

  const removeChain = useCallback((chainId: string) => {
    setLibrary((current) => ({
      ...current,
      chains: current.chains.filter((chain) => chain.id !== chainId),
    }))
  }, [])

  const duplicateChain = useCallback((chainId: string) => {
    setLibrary((current) => {
      if (current.chains.length >= MAX_CHAINS) return current
      const source = current.chains.find((chain) => chain.id === chainId)
      if (!source) return current
      const label = `${source.label} copy`.slice(0, MAX_CHAIN_LABEL)
      const id = uniqueSlotId(
        label,
        current.chains.map((chain) => chain.id),
      )
      const used = new Set<string>()
      const steps = source.steps.map((step) => {
        const stepId = uniqueStepId(used)
        used.add(stepId)
        return { ...step, id: stepId }
      })
      return {
        ...current,
        chains: [...current.chains, { ...cloneChain(source), id, label, steps }],
      }
    })
  }, [])

  const addStep = useCallback((chainId: string, pluginId: string) => {
    if (!pluginId) return
    setLibrary((current) => ({
      ...current,
      chains: current.chains.map((chain) => {
        if (chain.id !== chainId || chain.steps.length >= MAX_CHAIN_STEPS) {
          return chain
        }
        return {
          ...chain,
          steps: [
            ...chain.steps,
            {
              id: uniqueStepId(chain.steps.map((step) => step.id)),
              pluginId,
              note: '',
            },
          ],
        }
      }),
    }))
  }, [])

  const updateStep = useCallback(
    (
      chainId: string,
      stepId: string,
      patch: { note?: string; place?: StepPlace | '' },
    ) => {
      setLibrary((current) => ({
        ...current,
        chains: current.chains.map((chain) => {
          if (chain.id !== chainId) return chain
          return {
            ...chain,
            steps: chain.steps.map((step) => {
              if (step.id !== stepId) return step
              const next: SignalChainStep = { ...step }
              if (patch.note != null) next.note = patch.note.slice(0, MAX_STEP_NOTE)
              if (patch.place === undefined) {
                /* keep */
              } else if (patch.place) {
                next.place = patch.place
              } else {
                delete next.place
              }
              return next
            }),
          }
        }),
      }))
    },
    [],
  )

  const moveStep = useCallback((chainId: string, stepId: string, direction: -1 | 1) => {
    setLibrary((current) => ({
      ...current,
      chains: current.chains.map((chain) => {
        if (chain.id !== chainId) return chain
        const index = chain.steps.findIndex((step) => step.id === stepId)
        const nextIndex = index + direction
        if (index < 0 || nextIndex < 0 || nextIndex >= chain.steps.length) {
          return chain
        }
        const steps = [...chain.steps]
        const [moved] = steps.splice(index, 1)
        steps.splice(nextIndex, 0, moved)
        return { ...chain, steps }
      }),
    }))
  }, [])

  const removeStep = useCallback((chainId: string, stepId: string) => {
    setLibrary((current) => ({
      ...current,
      chains: current.chains.map((chain) =>
        chain.id === chainId
          ? { ...chain, steps: chain.steps.filter((step) => step.id !== stepId) }
          : chain,
      ),
    }))
  }, [])

  const touchRecent = useCallback((pluginId: string) => {
    setLibrary((current) => {
      const lastOpened = [
        pluginId,
        ...current.lastOpened.filter((id) => id !== pluginId),
      ].slice(0, MAX_RECENT)
      return { ...current, lastOpened }
    })
  }, [])

  return {
    library,
    ready,
    patchPlugin,
    toggleShortlist,
    setDefault,
    assignDefaultSlot,
    addSlot,
    renameSlot,
    removeSlot,
    addChain,
    renameChain,
    setChainWhen,
    removeChain,
    duplicateChain,
    addStep,
    updateStep,
    moveStep,
    removeStep,
    touchRecent,
  }
}
