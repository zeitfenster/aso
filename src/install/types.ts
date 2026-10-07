export const INSTALL_STATUSES = ['installed', 'missing', 'unknown'] as const
export type InstallStatus = (typeof INSTALL_STATUSES)[number]

export type InstallReason = 'waves-shell' | 'kontakt-library' | 'not-scanned'

export type FormatFlags = {
  vst2: boolean
  vst3: boolean
  au: boolean
  app: boolean
}

export type InstallInfo = {
  status: InstallStatus
  formats: FormatFlags
  reason?: InstallReason
}

export type InstallSnapshot = {
  scannedAt: string
  platform: string
  vst2: string[]
  vst3: string[]
  au: string[]
  apps: string[]
}

export function emptyFormats(): FormatFlags {
  return { vst2: false, vst3: false, au: false, app: false }
}

export function unscannedInfo(): InstallInfo {
  return { status: 'unknown', formats: emptyFormats(), reason: 'not-scanned' }
}
