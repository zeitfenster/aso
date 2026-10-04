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

const L = 'Nomad Factory Liquid Bundle III'

function liq(
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
    collections: [L],
    summary,
    sonicCharacter,
    bestFor,
    useCases,
    notes: 'Included in Nomad Factory Liquid Bundle III (current line, v3.0.1).',
    tags: ['nomad-factory', 'liquid-bundle-iii', ...tags],
  }
}

/** Selectable plugins in Liquid Bundle III (6 effects). */
export const nomadFactoryLiquid: CatalogEntry[] = [
  liq(
    'nf-liquid-compressor-iii',
    'Liquid Compressor III',
    ['Compressor'],
    'Vintage-inspired analog-style compressor modernized on Nomad’s current Plugivery framework, with simple musical dynamics rather than a mastering-grade toolkit.',
    'Warm, slightly colored compression with analog-leaning glue—more “console-ish squeeze” than invisible clean leveling.',
    'Vocals, bass, drums, and buses that want vintage-flavored dynamics.',
    [
      'Gentle vocal compression with analog-ish weight.',
      'Glue a drum bus without a sterile digital clamp.',
      'Level a bass DI while adding a little vintage density.',
    ],
    ['compressor'],
  ),
  liq(
    'nf-liquid-delays-iii',
    'Liquid Delays III',
    ['Delay'],
    'Vintage-inspired delay for warm, analog-leaning echoes rather than pristine digital slapbacks.',
    'Darker, slightly saturated repeats with old-studio echo character—musical trails more than hi-fi ping-pong precision.',
    'Vocals, guitars, and synths needing character delay.',
    [
      'Warm vocal throws that sit behind a lead.',
      'Analog-ish guitar echo instead of a bright digital delay.',
      'Lo-fi delay beds under a sparse arrangement.',
    ],
    ['delay'],
  ),
  liq(
    'nf-liquid-gate-iii',
    'Liquid Gate III',
    ['Utility'],
    'Vintage-inspired gate/expander with threshold, attack, hold, release, and a sidechain filter. Gate mode hard-cuts below threshold; expander mode reduces more gently.',
    'Cleanup and rhythmic chopping with analog-leaning behavior rather than a sterile digital gate.',
    'Tightening drums, reducing noise on tracks, and gated special FX.',
    [
      'Gate a roomy snare or tom track.',
      'Expand away hiss on a quiet vocal or guitar take.',
      'Create classic gated-drum decay on a room mic.',
    ],
    ['gate', 'expander'],
  ),
  liq(
    'nf-liquid-mod-iii',
    'Liquid Mod III',
    ['Modulation'],
    'Vintage chorus, flanger, and vibrato in one modulator, with depth, rate, feedback, stereo width, and tempo sync.',
    'Silky chorus, spacious flange, and expressive vibrato—classic analog-modulation perfume rather than a sterile digital doubler.',
    'Guitars, vocals, keys, and synths that need movement and width.',
    [
      'Subtle chorus on a clean guitar or vocal.',
      'Tempo-synced flanger sweeps on a synth loop.',
      'Vibrato on an electric piano or lead for vintage motion.',
    ],
    ['chorus', 'flanger', 'vibrato'],
  ),
  liq(
    'nf-liquid-phase-iii',
    'Liquid Phase III',
    ['Modulation'],
    'Vintage-inspired phaser with 4-, 8-, and 12-stage modes, plus speed, depth, manual offset, and stereo spread.',
    'Warm 70s/80s swirl—from gentle midrange motion to resonant jet-ish sweeps. Manual mode can freeze the phase for static filter color.',
    'Keys, guitars, synths, and drums wanting classic phaser movement.',
    [
      'Slow 8-stage swirl on an electric piano.',
      '12-stage resonant sweeps into a transition.',
      'Freeze Manual offset for a static “phased” guitar tone.',
    ],
    ['phaser'],
  ),
  liq(
    'nf-liquid-verb-iii',
    'Liquid Verb III',
    ['Reverb'],
    'Vintage-inspired reverb with Room, Hall, and Plate algorithms, plus pre-delay, decay, damping, filters, and stereo width.',
    'Warm, musical hardware-adjacent spaces rather than a clinical algorithmic hall—rooms and plates with analog-leaning blur.',
    'Vocals, instruments, and mix sends that want classic studio depth.',
    [
      'Short plate on a vocal return.',
      'Room on drums without a huge modern wash.',
      'Hall bed under keys or a ballad vocal.',
    ],
    ['reverb'],
  ),
]
