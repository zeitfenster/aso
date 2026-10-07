import type { ChainPosition } from './types'

/**
 * Named product purpose: bus compressor, console channel, mastering desk.
 * Missing id is filled by inferredChainPositions or left unspecified.
 */
export const CHAIN_ASSIGNMENTS: Record<string, ChainPosition[]> = {
  'psp-busspressor': ['Bus'],
  'pa-bx-townhouse-buss': ['Bus'],
  'waves-api-2500': ['Bus'],
  'arturia-comp-vca-65': ['Bus'],
  'ni-solid-bus-comp': ['Bus'],
  'pa-vss-2': ['Insert', 'Bus'],

  'pa-bx-console-focusrite-sc': ['Insert'],
  'pa-bx-console-n': ['Insert'],
  'pa-bx-console-ssl-4000-e': ['Insert'],
  'pa-bx-console-ssl-4000-g': ['Insert'],
  'pa-channelx': ['Insert'],
  'waves-renaissance-channel': ['Insert'],
  'waves-audiotrack': ['Insert'],
  'waves-eddie-kramer-drum-channel': ['Insert'],

  'pa-bx-masterdesk': ['Master'],
  'pa-bx-masterdesk-true-peak': ['Master'],
  'izotope-ozone-9-advanced': ['Master'],
  'pa-bx-limiter-true-peak': ['Master'],
  'fabfilter-pro-l-2': ['Master'],
  'psp-xenon': ['Master'],
}
