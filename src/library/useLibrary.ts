import { useCallback, useEffect, useRef, useState } from 'react'
import {
  emptyLibrary,
  MAX_RECENT,
  type DefaultSlotId,
  type PluginJournalEntry,
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

  const setDefault = useCallback((slotId: DefaultSlotId, pluginId: string | null) => {
    setLibrary((current) => {
      const defaults = { ...current.defaults }
      if (!pluginId) delete defaults[slotId]
      else defaults[slotId] = pluginId
      return { ...current, defaults }
    })
  }, [])

  const assignDefaultSlot = useCallback(
    (pluginId: string, slotId: DefaultSlotId | null) => {
      setLibrary((current) => {
        const defaults = { ...current.defaults }
        for (const [slot, id] of Object.entries(defaults)) {
          if (id === pluginId) delete defaults[slot as DefaultSlotId]
        }
        if (slotId) defaults[slotId] = pluginId
        return { ...current, defaults }
      })
    },
    [],
  )

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
    touchRecent,
  }
}
