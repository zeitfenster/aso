import type { CatalogEntry } from './types'

export const hostsAndApps: CatalogEntry[] = [
  {
    id: 'ableton-live-12',
    name: 'Ableton Live 12',
    vendor: 'Ableton',
    kind: 'host',
    types: ['Host / DAW'],
    collections: [],
    summary:
      'Full DAW and creative production environment focused on clip-based composition, session improvisation, and deep MIDI/audio warping. Hosts your VST/AU plugins and includes Ableton’s built-in instruments and effects.',
    sonicCharacter:
      'Neutral host with a fast, musical workflow. Stock devices lean clean and modern; character mostly comes from the third-party plugins you load.',
    bestFor:
      'Songwriting, electronic production, live performance setups, and day-to-day mixing inside one session.',
    useCases: [
      'Build arrangements in Session View, then arrange to Arrangement View for a finished track.',
      'Host FabFilter, Soundtoys, Omnisphere, and other third-party plugins on tracks and return chains.',
      'Perform or sketch ideas with clip launching, follow actions, and Push/controller integration.',
    ],
    tags: ['daw', 'host', 'ableton'],
  },
  {
    id: 'ni-traktor-pro-4',
    name: 'Traktor Pro 4',
    vendor: 'Native Instruments',
    kind: 'application',
    types: ['DJ Software'],
    collections: [],
    summary:
      'Professional DJ software for beatmatching, stems, remix decks, and club/live performance with NI and MIDI controllers.',
    sonicCharacter:
      'Clean club-oriented playback engine with flexible FX; vibe depends on your library and which Traktor effects you engage.',
    bestFor:
      'DJ sets, hybrid live/DJ shows, and preparing Ableton-adjacent performance workflows.',
    useCases: [
      'Four-deck club sets with sync, hotcues, and looping.',
      'Stem separation for on-the-fly vocal/instrumental mashups.',
      'Hardware control with Traktor-compatible controllers and mixer integration.',
    ],
    tags: ['dj', 'performance', 'traktor'],
  },
  {
    id: 'ni-traktor-scratch-pro-2-mk2',
    name: 'Traktor Scratch Pro 2 MK2',
    vendor: 'Native Instruments',
    kind: 'application',
    types: ['DJ Software'],
    collections: [],
    summary:
      'Earlier Traktor Scratch generation focused on DVS (digital vinyl) control with timecode vinyl/CDs and Scratch Pro hardware workflows.',
    sonicCharacter:
      'Same core Traktor playback feel as its era—functional club sound, with Scratch emphasizing turntable/CDJ tactile control.',
    bestFor:
      'Timecode vinyl/CDJ workflows and legacy Scratch Pro MK2 setups.',
    useCases: [
      'Control digital tracks from vinyl or CDJ via timecode.',
      'Maintain a classic two-deck Scratch mixer workflow.',
      'Bridge older Scratch hardware into a modern library until migrating fully to Traktor Pro 4.',
    ],
    notes:
      'Legacy product relative to Traktor Pro 4; useful if you still rely on Scratch Pro 2 MK2 hardware/DVS.',
    tags: ['dj', 'dvs', 'scratch', 'legacy'],
  },
  {
    id: 'steinberg-wavelab-elements-10',
    name: 'WaveLab Elements 10',
    vendor: 'Steinberg',
    kind: 'application',
    types: ['Host / DAW', 'Mastering Suite', 'Analysis / Metering'],
    collections: [],
    summary:
      'Entry-level WaveLab editor for stereo mastering, audio editing, restoration-oriented cleanup, and batch processing—lighter than full WaveLab Pro.',
    sonicCharacter:
      'Transparent editorial/mastering host. Sound comes from the processors you apply; the app itself is analysis- and workflow-forward.',
    bestFor:
      'Finalizing stereo mixes, podcast/audio editing, and light mastering outside Ableton.',
    useCases: [
      'Trim, fade, normalize, and export masters with metering.',
      'Run restoration or EQ/limiting chains on finished stereo files.',
      'Batch-process multiple renders for distribution formats.',
    ],
    notes: 'Listed on your inventory as “Wavelav”; catalogued as WaveLab Elements 10.',
    tags: ['editor', 'mastering', 'wavelab'],
  },
]
