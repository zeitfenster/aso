import { useCallback, useEffect, useMemo, useState } from 'react'
import { catalog } from '../data'
import { matchCatalog } from './match'
import { unscannedInfo, type InstallSnapshot } from './types'

function readSnapshot(raw: unknown): InstallSnapshot | null {
  if (!raw || typeof raw !== 'object') return null
  const source = raw as Partial<InstallSnapshot>
  if (typeof source.scannedAt !== 'string' || !source.scannedAt) return null
  return {
    scannedAt: source.scannedAt,
    platform: typeof source.platform === 'string' ? source.platform : '',
    vst2: Array.isArray(source.vst2) ? source.vst2.filter((item) => typeof item === 'string') : [],
    vst3: Array.isArray(source.vst3) ? source.vst3.filter((item) => typeof item === 'string') : [],
    au: Array.isArray(source.au) ? source.au.filter((item) => typeof item === 'string') : [],
    apps: Array.isArray(source.apps) ? source.apps.filter((item) => typeof item === 'string') : [],
  }
}

export function useInstallScan() {
  const [snapshot, setSnapshot] = useState<InstallSnapshot | null>(null)
  const [scanning, setScanning] = useState(false)
  const available = typeof window !== 'undefined' && Boolean(window.asoApi?.scanInstall)

  const loadCache = useCallback(async () => {
    try {
      const result = await window.asoApi?.getInstallScan?.()
      if (result?.ok) {
        const cached = readSnapshot(result.scan)
        if (cached) setSnapshot(cached)
        return cached
      }
    } catch {
      /* ignore */
    }
    return null
  }, [])

  const rescan = useCallback(async () => {
    if (!window.asoApi?.scanInstall) return
    setScanning(true)
    try {
      const result = await window.asoApi.scanInstall()
      if (result?.ok) {
        const next = readSnapshot(result.scan)
        if (next) setSnapshot(next)
      }
    } finally {
      setScanning(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    loadCache().then((cached) => {
      if (cancelled || cached || !window.asoApi?.scanInstall) return
      void rescan()
    })
    return () => {
      cancelled = true
    }
  }, [loadCache, rescan])

  const statusById = useMemo(
    () => matchCatalog(catalog, snapshot),
    [snapshot],
  )

  const infoFor = useCallback(
    (id: string) => statusById.get(id) ?? unscannedInfo(),
    [statusById],
  )

  return { snapshot, scanning, available, rescan, infoFor }
}
