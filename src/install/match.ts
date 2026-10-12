import type { CatalogEntry } from '../data/types'
import {
  unscannedInfo,
  type FormatFlags,
  type InstallInfo,
  type InstallSnapshot,
} from './types'

export function normalizeStem(value: string): string {
  return value
    .replace(/\.(vst3|vst|component|dll|app)$/i, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const SKU_TOKENS = new Set([
  'advanced',
  'standard',
  'suite',
  'elements',
  'complete',
  'deluxe',
])

function tokens(value: string): string[] {
  return normalizeStem(value)
    .split(' ')
    .filter(Boolean)
    .map((token) => (/^v\d+$/.test(token) ? 'v' : token))
    .filter((token) => !SKU_TOKENS.has(token))
}

function containsSequence(hay: string[], needle: string[]): boolean {
  if (needle.length === 0) return false
  for (let i = 0; i <= hay.length - needle.length; i += 1) {
    if (needle.every((token, offset) => hay[i + offset] === token)) return true
  }
  return false
}

function leftoverTokens(hay: string[], needle: string[]): string[] {
  for (let i = 0; i <= hay.length - needle.length; i += 1) {
    if (needle.every((token, offset) => hay[i + offset] === token)) {
      return [...hay.slice(0, i), ...hay.slice(i + needle.length)]
    }
  }
  return hay
}

function isVersionToken(token: string): boolean {
  return /^\d+$/.test(token) || /^v\d*$/.test(token)
}

export function stemMatches(installed: string, candidate: string): boolean {
  const needle = tokens(candidate)
  if (needle.length === 0) return false
  const hay = tokens(installed)
  if (hay.length === 0) return false
  const joined = needle.join(' ')
  if (hay.join(' ') === joined) return true
  if (joined.length < 3 && needle.length === 1) return false
  if (!containsSequence(hay, needle)) return false
  const leftover = leftoverTokens(hay, needle)
  const extraVersion = leftover.some(isVersionToken)
  const needleHasVersion = needle.some(isVersionToken)
  // "Serum" must not count as installed when the file is "Serum 2".
  if (extraVersion && !needleHasVersion) return false
  return true
}

function listHasCandidate(names: string[], candidates: string[]): boolean {
  return names.some((name) =>
    candidates.some((candidate) => stemMatches(name, candidate)),
  )
}

function pluginCandidates(entry: CatalogEntry): string[] {
  const values = [entry.name, `${entry.vendor} ${entry.name}`, ...(entry.installHints ?? [])]
  const unique: string[] = []
  const seen = new Set<string>()
  for (const value of values) {
    const key = normalizeStem(value)
    if (!key || seen.has(key)) continue
    seen.add(key)
    unique.push(value)
  }
  return unique
}

function hasWaveShell(snapshot: InstallSnapshot): boolean {
  const names = [...snapshot.vst2, ...snapshot.vst3, ...snapshot.au]
  return names.some((name) => normalizeStem(name).includes('waveshell'))
}

function isKontaktLibrary(entry: CatalogEntry): boolean {
  if (entry.tags.some((tag) => tag.toLowerCase() === 'kontakt')) return true
  return /kontakt player/i.test(entry.notes ?? '')
}

function formatsFrom(
  snapshot: InstallSnapshot,
  candidates: string[],
  includeApps: boolean,
): FormatFlags {
  return {
    vst2: listHasCandidate(snapshot.vst2, candidates),
    vst3: listHasCandidate(snapshot.vst3, candidates),
    au: listHasCandidate(snapshot.au, candidates),
    app: includeApps ? listHasCandidate(snapshot.apps, candidates) : false,
  }
}

function anyFormat(formats: FormatFlags): boolean {
  return formats.vst2 || formats.vst3 || formats.au || formats.app
}

export function matchEntry(
  entry: CatalogEntry,
  snapshot: InstallSnapshot | null,
): InstallInfo {
  if (!snapshot) return unscannedInfo()

  const isApp = entry.kind === 'host' || entry.kind === 'application'
  const candidates = pluginCandidates(entry)
  const formats = formatsFrom(snapshot, candidates, isApp)

  if (anyFormat(formats)) {
    return { status: 'installed', formats }
  }

  if (isApp) {
    return { status: 'missing', formats }
  }

  if (entry.vendor === 'Waves' && hasWaveShell(snapshot)) {
    return { status: 'unknown', formats, reason: 'waves-shell' }
  }

  if (isKontaktLibrary(entry)) {
    return { status: 'unknown', formats, reason: 'kontakt-library' }
  }

  return { status: 'missing', formats }
}

export function matchCatalog(
  catalog: CatalogEntry[],
  snapshot: InstallSnapshot | null,
): Map<string, InstallInfo> {
  const byId = new Map<string, InstallInfo>()
  for (const entry of catalog) {
    byId.set(entry.id, matchEntry(entry, snapshot))
  }
  return byId
}

export const INSTALL_FILTERS = [
  'Installed',
  'Missing',
  'Unknown',
  'Waves',
  'Kontakt',
] as const

export type InstallFilterId = (typeof INSTALL_FILTERS)[number]

export function installFilterId(info: InstallInfo): InstallFilterId {
  if (info.status === 'installed') return 'Installed'
  if (info.status === 'missing') return 'Missing'
  if (info.reason === 'waves-shell') return 'Waves'
  if (info.reason === 'kontakt-library') return 'Kontakt'
  return 'Unknown'
}

export function matchesInstallFilter(info: InstallInfo, filter: string): boolean {
  if (!filter || filter === 'All') return true
  return installFilterId(info) === filter
}

export function isHiddenByInstallPrefs(
  info: InstallInfo,
  hideWaves: boolean,
  hideKontakt: boolean,
  installFilter: string,
): boolean {
  if (info.reason === 'waves-shell' && hideWaves && installFilter !== 'Waves') {
    return true
  }
  if (
    info.reason === 'kontakt-library' &&
    hideKontakt &&
    installFilter !== 'Kontakt'
  ) {
    return true
  }
  return false
}

export function installLabel(info: InstallInfo): string {
  if (info.status === 'installed') return 'On disk'
  if (info.status === 'missing') return 'Missing'
  if (info.reason === 'waves-shell') return 'Waves shell'
  if (info.reason === 'kontakt-library') return 'Kontakt library'
  if (info.reason === 'not-scanned') return 'Not scanned'
  return 'Unknown'
}

export function installReasonText(info: InstallInfo): string | null {
  if (info.status !== 'unknown') return null
  if (info.reason === 'waves-shell') {
    return 'WaveShell is installed, but individual Waves plugins are not separate files.'
  }
  if (info.reason === 'kontakt-library') {
    return 'This is a Kontakt library, not a standalone .vst3 / AU file.'
  }
  if (info.reason === 'not-scanned') {
    return 'Scan this Mac from the desktop app to check VST2, VST3, and AU folders.'
  }
  return 'Could not tell from plugin folders.'
}
