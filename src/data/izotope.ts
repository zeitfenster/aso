import type { CatalogEntry } from './types'

export const izotopeEntries: CatalogEntry[] = [
  {
    id: 'izotope-nectar-3',
    name: 'Nectar 3',
    vendor: 'iZotope',
    kind: 'plugin',
    types: ['Vocal Suite', 'EQ', 'Compressor', 'De-esser', 'Pitch / Harmony'],
    collections: [],
    summary:
      'All-in-one vocal production suite: EQ, compression, de-essing, harmony, pitch helpers, saturation, and more in a module-based chain.',
    sonicCharacter:
      'Modern, polished “radio vocal” toolkit—can be transparent or obviously processed depending on modules and assistants.',
    bestFor:
      'Building complete vocal chains quickly, especially pop/electronic vocals.',
    useCases: [
      'Assistant-assisted starting point for a lead vocal chain.',
      'Add harmony voices and width without leaving one plugin.',
      'De-ess + compress + EQ a spoken or sung vocal in one rack.',
    ],
    tags: ['vocal', 'izotope'],
  },
  {
    id: 'izotope-neutron-3-advanced',
    name: 'Neutron 3 Advanced',
    vendor: 'iZotope',
    kind: 'plugin',
    types: ['Mixing Suite', 'EQ', 'Compressor', 'Multiband Dynamics', 'Enhancer'],
    collections: [],
    summary:
      'Intelligent mixing suite with Track Assistant, Masking Meter, EQ, compressors, exciter, transient shaper, and inter-plugin communication.',
    sonicCharacter:
      'Clean, modern, analysis-driven processing—great for clarity and balance more than vintage coloration.',
    bestFor:
      'Mixing buses/tracks with guidance, unmasking competing instruments, and consistent modern mixes.',
    useCases: [
      'Use Masking Meter between kick and bass to carve conflicts.',
      'Start a guitar bus chain with Track Assistant, then refine by ear.',
      'Transient-shape drums while EQing harsh cymbals dynamically.',
    ],
    tags: ['mixing', 'izotope', 'assistant'],
  },
  {
    id: 'izotope-ozone-9-advanced',
    name: 'Ozone 9 Advanced',
    vendor: 'iZotope',
    kind: 'plugin',
    types: ['Mastering Suite', 'EQ', 'Compressor', 'Limiter', 'Enhancer'],
    collections: [],
    summary:
      'End-to-end mastering suite: EQ, dynamics, imagers, maximizers, Match EQ, and Master Assistant for finishing stereo mixes.',
    sonicCharacter:
      'Polished commercial loudness and tonal balance; can stay subtle or become brightly “mastered” if Assistants are trusted blindly.',
    bestFor:
      'Mastering inside Ableton or bouncing stems to a mastering session.',
    useCases: [
      'Run Master Assistant, then manually tame low-end and limiter ceiling.',
      'Match EQ a reference track’s tonal curve as a starting point.',
      'Use Maximizer for streaming-aware loudness with true peak limiting.',
    ],
    tags: ['mastering', 'izotope'],
  },
  {
    id: 'izotope-rx-7-standard',
    name: 'RX 7 Standard',
    vendor: 'iZotope',
    kind: 'application',
    types: ['Restoration', 'Utility'],
    collections: [],
    summary:
      'Industry-standard audio repair toolkit (editor + modules) for denoising, declicking, dereverbing helpers, spectral editing, and dialogue/music cleanup.',
    sonicCharacter:
      'Surgical and transparent when used carefully; over-processing can sound smoothed or slightly phasey—best as a repair tool, not a flavor FX.',
    bestFor:
      'Cleaning vocals, removing noises, rescuing recordings, and prep before creative mixing.',
    useCases: [
      'Remove headphone bleed or AC hum from a vocal take.',
      'Spectrally erase a chair squeak from an otherwise perfect performance.',
      'Batch denoise interview/podcast audio before editing in WaveLab or Ableton.',
    ],
    tags: ['restoration', 'rx', 'izotope'],
    installHints: ['RX 7 Audio Editor', 'iZotope RX 7'],
  },
  {
    id: 'izotope-stutter-edit-2',
    name: 'Stutter Edit 2',
    vendor: 'iZotope',
    kind: 'plugin',
    types: ['Creative FX'],
    collections: [],
    summary:
      'Gesture-based glitch/stutter effect for rhythmic buffer edits, gating, filtering, and performance FX—famous from BT-oriented electronic production.',
    sonicCharacter:
      'Chopped, glitchy, high-energy electronic motion—intentionally artificial and rhythmic rather than subtle.',
    bestFor:
      'Build-ups, drops, transitions, and live electronic performance effects.',
    useCases: [
      'Map gestures to a MIDI keyboard for live fill stutters.',
      'Create rising glitch edits into a drop.',
      'Transform static pads into rhythmic buffer patterns.',
    ],
    tags: ['glitch', 'performance', 'izotope'],
  },
]
