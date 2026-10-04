import type { PluginSubtype } from './types'

/**
 * Common-sense architecture where the vendor does not name a single circuit.
 * Shown in the UI as Inferred — not a spec sheet. Prefer leaving a plugin
 * unspecified over a weak guess (meters, tuners, hosts, imagers, riders).
 */
export const INFERRED_SUBTYPES: Record<string, PluginSubtype[]> = {
  // --- Compressors / dynamics ---
  'ni-supercharger': ['Tube'],
  'pa-alpha-compressor': ['Digital / clean'],
  'pa-alpha-compressor-v2': ['Digital / clean'],
  'waves-renaissance-axx': ['Digital / clean'],
  'waves-mv2': ['Digital / clean'],
  'waves-maxxvolume': ['Digital / clean'],
  'soundtoys-devil-loc': ['Multi-mode'],
  'soundtoys-devil-loc-deluxe': ['Multi-mode'],
  'arturia-mix-drums': ['Multi-mode'],
  'arturia-bus-force': ['Multi-mode'],
  'waves-audiotrack': ['Console / channel'],
  'waves-renaissance-channel': ['Console / channel'],
  'waves-eddie-kramer-drum-channel': ['Console / channel'],
  'waves-renaissance-vox': ['Multi-mode'],
  'pa-bx-masterdesk': ['Multi-mode'],
  'pa-dsm-v3': ['Multi-mode'],

  // --- Limiters ---
  'fabfilter-pro-l-2': ['Multi-mode'],
  'psp-xenon': ['Digital / clean'],
  'psp-twin-l': ['Multi-mode'],
  'waves-l1': ['Digital / clean'],
  'waves-l2': ['Digital / clean'],
  'waves-l3': ['Multi-mode'],
  'waves-l3-multimaximizer': ['Multi-mode'],
  'waves-l3-ll-ultramaximizer': ['Digital / clean'],
  'waves-l3-ll-multimaximizer': ['Multi-mode'],
  'pa-bx-limiter-true-peak': ['Digital / clean'],
  'arturia-bus-peak': ['Digital / clean'],

  // --- EQ ---
  'waves-renaissance-equalizer': ['Surgical parametric'],
  'pa-eq2': ['Surgical parametric'],
  'pa-eq4': ['Surgical parametric'],
  'pa-eq232d': ['Surgical parametric'],
  'pa-museq': ['Surgical parametric'],
  'fabfilter-pro-mb': ['Digital / clean'],
  'waves-c4': ['Digital / clean'],
  'waves-linear-phase-mb': ['Linear-phase'],
  'pa-eq825': ['Tube'],

  // --- Delay / pitch delay ---
  'arturia-delay-eternity': ['Multi-mode'],
  'psp-echo': ['BBD / analog'],
  'nf-dl3d': ['Digital / multi-tap'],
  'nf-liquid-delays-iii': ['BBD / analog'],
  'pa-bx-delay-2500': ['Multi-mode'],
  'eventide-quadravox': ['Digital / multi-tap'],

  // --- Filter / modulation ---
  'arturia-filter-sem': ['Multi-mode'],
  'arturia-filter-m12': ['Multi-mode'],
  'soundtoys-filterfreak': ['Multi-mode'],
  'psp-stompfilter': ['Multi-mode'],
  'ni-driver': ['Multi-mode'],
  'waves-metafilter': ['Multi-mode'],
  'arturia-efx-motions': ['Multi-mode'],
  'arturia-efx-refract': ['Multi-mode'],
  'ni-freak': ['Multi-mode'],
  'psp-hertzrider2': ['Multi-mode'],
  'waves-doubler': ['Chorus'],

  // --- Saturation ---
  'psp-saturator': ['Multi-mode'],
  'arturia-dist-opamp-21': ['Multi-mode'],
  'waves-oneknob-driver': ['Multi-mode'],
  'waves-greg-wells-tonecentric': ['Multi-mode'],
  'waves-cobalt-saphira': ['Multi-mode'],
  'ni-dirt': ['Multi-mode'],
  'pa-bx-xl-v2': ['Multi-mode'],

  // --- Synths / sample instruments ---
  'ni-reaktor-spark': ['Multi-mode'],
  'ni-rounds': ['Multi-mode'],
  'ni-kontour': ['Multi-mode'],
  'ni-trk-01': ['Multi-mode'],
  'algonaut-atlas-2': ['Sampling / ROMpler'],
  'ni-battery-3': ['Sampling / ROMpler'],
  'ni-battery-4': ['Sampling / ROMpler'],
  'ni-polyplex': ['Sampling / ROMpler'],
  'ni-drumlab': ['Sampling / ROMpler'],
  'ni-studio-drummer': ['Sampling / ROMpler'],
  'ni-abbey-road-60s-drummer': ['Sampling / ROMpler'],
  'ni-play-butch-vig-drums': ['Sampling / ROMpler'],
  'wave-alchemy-drumvolution': ['Sampling / ROMpler'],
  'wave-alchemy-revolution': ['Sampling / ROMpler'],
  'wave-alchemy-triaz': ['Sampling / ROMpler'],

  // --- Amp sims ---
  'ni-guitar-rig-6': ['Amp sim'],
  'waves-gtr3-amps': ['Amp sim'],
  'waves-gtr3-stomps': ['Amp sim'],
  'waves-gtr3-toolrack': ['Amp sim'],
  'waves-cla-guitars': ['Amp sim'],
  'pa-bx-rockrack-v3-player': ['Amp sim'],

  // --- Creative multi FX ---
  'soundtoys-effect-rack': ['Multi-mode'],
  'izotope-stutter-edit-2': ['Multi-mode'],
  'ni-the-finger': ['Multi-mode'],
  'pa-byome': ['Multi-mode'],
  'pa-splat': ['Multi-mode'],
  'pa-stage': ['Multi-mode'],
  'pa-triad': ['Multi-mode'],
}
