import type { CatalogEntry, PluginType } from './types'

const C = 'Nomad Factory Blue Tubes Effects Pack v4'

function nf(
  id: string,
  name: string,
  types: PluginType[],
  summary: string,
  sonicCharacter: string,
  bestFor: string,
  useCases: string[],
  tags: string[] = [],
): CatalogEntry {
  return {
    id,
    name,
    vendor: 'Nomad Factory',
    kind: 'plugin',
    types,
    collections: [C],
    summary,
    sonicCharacter,
    bestFor,
    useCases,
    tags: ['nomad-factory', 'blue-tubes', ...tags],
  }
}

/** Selectable plugins in Blue Tubes Effects Pack v4 (6 effects). */
export const nomadFactoryBlueTubes: CatalogEntry[] = [
  nf(
    'nf-ch2s',
    'Analog Chorus CH2S',
    ['Modulation'],
    'Vintage-style analog stereo chorus for thickening and widening with classic modulation movement.',
    'Warm, swirly, slightly saturated chorus—more “analog detune perfume” than pristine digital width.',
    'Synths, electric pianos, guitars, and vocals needing lush thickness.',
    [
      'Widen a mono saw pad into a Juno-adjacent bed.',
      'Add subtle chorus to a clean electric guitar.',
      'Thicken background vocals without a full reverb wash.',
    ],
    ['chorus'],
  ),
  nf(
    'nf-aph2s',
    'Analog Phaser APH2S',
    ['Modulation'],
    'Multi-stage analog-style phaser for classic sweeps and liquid midrange motion.',
    'Funky, liquid, vintage phaser color—can be subtle swirl or dramatic jet-ish sweeps.',
    'Keys, guitars, synths, and creative stereo animation.',
    [
      'Slow deep phaser on an electric piano.',
      'Tempo-ish rhythmic phase movement on a synth loop.',
      'Guitar psychedelic sweeps into a transition.',
    ],
    ['phaser'],
  ),
  nf(
    'nf-tle2s',
    'Oilcan Echo TLE2S',
    ['Delay'],
    'Recreation of vintage oilcan echo—dark, wobbling, mechanical delay character unlike bright digital repeats.',
    'Murky, wobbly, lo-fi echo with oily modulation and vintage special-FX charm.',
    'Dub/lo-fi echoes, guitar ambience, and character delays on vocals/synths.',
    [
      'Dark oilcan throws on a vocal ad-lib.',
      'Vintage echo on rockabilly or indie guitar.',
      'Lo-fi delay beds under a sparse arrangement.',
    ],
    ['echo', 'oilcan'],
  ),
  nf(
    'nf-st2s',
    'Stereo Imager ST2S',
    ['Utility', 'Mixing Suite'],
    'Analog-style stereo widener/imager for adjusting width and spatial presentation.',
    'Wider, slightly analog-flavored image enhancement—verify mono compatibility when pushing width.',
    'Buses, synths, and stereo sources that need controlled width.',
    [
      'Gently widen a stereo synth bus.',
      'Add size to a backing-vocal group.',
      'Tighten or expand image on an FX return.',
    ],
    ['imaging'],
  ),
  nf(
    'nf-dl3d',
    'Tempo Delay DL3D',
    ['Delay'],
    'Tempo-synchronized tube-flavored delay with a “3D” spatial echo design for rhythmic and dimensional repeats.',
    'Warm tube-ish echoes with tempo-locked rhythmic placement and dimensional stereo depth.',
    'Vocals, guitars, and synths needing musical synced delay.',
    [
      'Dotted-note vocal delays that sit behind a lead.',
      'Synced rhythmic delays on a synth hook.',
      'Create depth with stereo-spread delay taps.',
    ],
    ['delay', 'tempo'],
  ),
  nf(
    'nf-adr2s',
    'Valve Driver ADR2S',
    ['Saturation / Distortion'],
    'Tube-style saturation/overdrive processor for harmonic warmth through heavier drive.',
    'Warm valve glow into crunchy overdrive—musical harmonics rather than modern digital fuzz by default.',
    'Vocals, bass, guitars, drums, and buses needing analog drive.',
    [
      'Gentle tube saturation on a vocal.',
      'Drive a bass DI for midrange growl.',
      'Parallel valve grit on a drum bus.',
    ],
    ['saturation', 'tube'],
  ),
]
