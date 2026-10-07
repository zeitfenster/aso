import type { PluginSubtype } from './types'

/**
 * Vendor architecture only (named circuit, modeled unit, or explicit multi-mode).
 * Missing id = unspecified. Do not infer from reviews, “best for”, or forum lore.
 *
 * While testing, approve these labels (and only these). Track roles / clean-vs-colored
 * are not assigned yet.
 */
export const SUBTYPE_ASSIGNMENTS: Record<string, PluginSubtype[]> = {
  // --- Compressors ---
  'arturia-comp-fet-76': ['FET'],
  'waves-cla-76': ['FET'],
  'pa-mc77': ['FET'],
  'psp-fetpressor': ['FET'],

  'waves-cla-2a': ['Opto'],
  'waves-cla-3a': ['Opto'],
  'pa-bx-opto': ['Opto'],
  'pa-opticom-xla-3': ['Opto'],
  'pa-optomax': ['Opto'],

  'arturia-comp-vca-65': ['VCA / bus'],
  'waves-api-2500': ['VCA / bus'],
  'ni-solid-bus-comp': ['VCA / bus'],
  'psp-busspressor': ['VCA / bus'],
  'pa-bx-townhouse-buss': ['VCA / bus'],

  'arturia-comp-diode-609': ['Diode bridge'],
  'pa-254e': ['Diode bridge'],
  'pa-354e': ['Diode bridge'],
  'waves-v-comp': ['Diode bridge'],

  'arturia-comp-tube-sta': ['Vari-Mu'],
  'waves-puigchild': ['Vari-Mu'],
  'pa-iron': ['Vari-Mu'],
  'pa-v76u73': ['Vari-Mu'],

  'waves-c1': ['Digital / clean'],
  'psp-mastercomp': ['Digital / clean'],
  'psp-impressor': ['Digital / clean'],
  'ni-solid-dynamics': ['Digital / clean'],

  'fabfilter-pro-c-2': ['Multi-mode'],
  'fabfilter-pro-c-3': ['Multi-mode'],
  'fabfilter-pro-ds': ['Multi-mode'],
  'waves-h-comp': ['Multi-mode'],
  'waves-renaissance-compressor': ['Multi-mode'],
  'pa-mastering-compressor': ['Multi-mode'],
  'pa-tcl-2': ['Multi-mode'],
  'pa-magnum-k': ['Multi-mode'],

  'pa-bx-clipper': ['Clipper'],

  // --- EQ ---
  'fabfilter-pro-q-3': ['Surgical parametric', 'Dynamic EQ'],
  'fabfilter-pro-q-4': ['Surgical parametric', 'Dynamic EQ'],
  'waves-q10': ['Surgical parametric'],
  'waves-emo-q4': ['Surgical parametric'],
  'ni-solid-eq': ['Surgical parametric'],
  'pa-bx-digital-v2': ['Surgical parametric'],
  'pa-bx-digital-v3': ['Surgical parametric'],
  'pa-hg-q': ['Surgical parametric', 'Tube'],
  'pa-eq-200': ['Surgical parametric'],
  'pa-nseq-2': ['Surgical parametric'],
  'psp-masterq2': ['Surgical parametric'],
  'pa-bx-dyneq-v2': ['Dynamic EQ'],

  'psp-consoleq': ['Console / channel'],
  'waves-v-eq3': ['Console / channel'],
  'waves-v-eq4': ['Console / channel'],
  'arturia-pre-1973': ['Console / channel'],
  'arturia-pre-trida': ['Console / channel'],
  'arturia-pre-v76': ['Console / channel', 'Tube'],
  'arturia-eq-sitral-295': ['Console / channel'],
  'soundtoys-sie-q': ['Console / channel'],
  'waves-kramer-hls': ['Console / channel'],
  'pa-bx-2098-eq': ['Console / channel'],
  'pa-bx-console-focusrite-sc': ['Console / channel'],
  'pa-bx-console-n': ['Console / channel'],
  'pa-bx-console-ssl-4000-e': ['Console / channel'],
  'pa-bx-console-ssl-4000-g': ['Console / channel'],
  'pa-channelx': ['Console / channel'],
  'pa-vss-2': ['Console / channel', 'VCA / bus'],

  'waves-puigtec': ['Passive / Pultec'],
  'psp-nobleq': ['Passive / Pultec'],
  'pa-passeq': ['Passive / Pultec'],

  'pa-bax-eq': ['Tilt / Baxandall'],
  'pa-niveau-filter': ['Tilt / Baxandall'],

  'waves-linear-phase-eq': ['Linear-phase'],

  // --- Reverb ---
  'arturia-rev-plate-140': ['Plate'],
  'soundtoys-little-plate': ['Plate'],
  'waves-abbey-road-reverb-plates': ['Plate'],

  'waves-abbey-road-chambers': ['Room / chamber'],
  'pa-bx-rooms': ['Room / chamber'],
  'waves-trueverb': ['Room / chamber'],

  'arturia-rev-spring-636': ['Spring'],
  'psp-springbox': ['Spring'],

  'fabfilter-pro-r': ['Algorithmic mix'],
  'fabfilter-pro-r-2': ['Algorithmic mix'],
  'exponential-audio-phoenixverb': ['Algorithmic mix'],
  'pa-bm60': ['Algorithmic mix'],
  'waves-renaissance-reverb': ['Algorithmic mix'],

  'waves-h-reverb': ['Multi-mode'],
  'arturia-rev-lx-24': ['Multi-mode'],
  'relab-lx480-dual-reverb': ['Multi-mode'],
  'relab-lx480-essential': ['Multi-mode'],
  'psp-easyverb': ['Multi-mode'],
  'nf-liquid-verb-iii': ['Multi-mode'],

  'eventide-blackhole': ['Creative / infinite'],
  'arturia-efx-ambient': ['Creative / infinite'],
  'arturia-rev-intensity': ['Creative / infinite'],
  'ni-raum': ['Creative / infinite'],
  'psp-pianoverb2': ['Creative / infinite'],

  'waves-ir-l': ['Convolution'],

  // --- Delay ---
  'arturia-delay-tape-201': ['Tape'],

  'audio-damage-dubstation-2': ['BBD / analog'],
  'arturia-delay-brigade': ['BBD / analog'],
  'pa-std-1': ['BBD / analog'],
  'nf-tle2s': ['BBD / analog'],
  'psp-bbdelay': ['BBD / analog'],

  'waves-supertap': ['Digital / multi-tap'],
  'psp-608md': ['Digital / multi-tap'],
  'soundtoys-primaltap': ['Digital / multi-tap'],
  'soundtoys-little-primaltap': ['Digital / multi-tap'],

  'arturia-efx-fragments': ['Granular / reverse'],
  'soundtoys-crystallizer': ['Granular / reverse'],

  'soundtoys-echoboy': ['Multi-mode'],
  'soundtoys-echoboy-jr': ['Multi-mode'],
  'waves-h-delay': ['Multi-mode'],
  'fabfilter-timeless-3': ['Multi-mode'],
  'pa-bx-pulsar': ['Multi-mode'],
  'ni-replika': ['Multi-mode'],
  'waves-cla-echosphere': ['Multi-mode'],
  'psp-stompdelay': ['Multi-mode'],

  // --- Saturation ---
  'arturia-dist-tube-culture': ['Tube'],
  'soundtoys-radiator': ['Tube'],
  'soundtoys-little-radiator': ['Tube'],
  'pa-hg-2': ['Tube'],
  'pa-twintube': ['Tube'],
  'psp-binamp': ['Tube'],
  'nf-adr2s': ['Tube'],

  'arturia-tape-j-37': ['Tape machine'],
  'arturia-tape-mello-fi': ['Tape machine'],
  'waves-kramer-master-tape': ['Tape machine'],

  'waves-nls': ['Console summing'],
  'ni-bite': ['Bitcrush / digital'],

  'soundtoys-decapitator': ['Multi-mode'],
  'fabfilter-saturn-2': ['Multi-mode'],
  'arturia-dist-coldfire': ['Multi-mode'],
  'pa-karacter': ['Multi-mode'],
  'pa-bx-saturator-v2': ['Multi-mode'],
  'pa-the-oven': ['Multi-mode'],
  'pa-vsm-3': ['Multi-mode'],
  'psp-vintagewarmer2': ['Multi-mode'],

  // --- Synths ---
  'arturia-mini-v': ['Subtractive analog'],
  'arturia-modular-v': ['Subtractive analog'],
  'arturia-arp-2600-v': ['Subtractive analog'],
  'arturia-cs-80-v': ['Subtractive analog'],
  'arturia-jup-8-v': ['Subtractive analog'],
  'arturia-matrix-12-v': ['Subtractive analog'],
  'arturia-sem-v': ['Subtractive analog'],
  'ni-monark': ['Subtractive analog'],
  'uad-moog-minimoog': ['Subtractive analog', 'Ladder'],
  'ni-super-8': ['Subtractive analog'],
  'fabfilter-twin-3': ['Subtractive analog'],
  'korg-polysix-v2': ['Subtractive analog'],
  'pa-knifonium': ['Subtractive analog'],

  'arturia-dx7-v': ['FM'],
  'ni-fm8': ['FM'],
  'arturia-cz-v': ['Phase distortion'],
  'ni-massive': ['Wavetable'],
  'ni-massive-x': ['Wavetable'],
  'ni-reaktor-prism': ['Additive / modal'],
  'arturia-buchla-easel-v': ['West Coast / modular'],
  'arturia-synthi-v': ['West Coast / modular'],

  'arturia-prophet-v': ['Multi-mode'],
  'arturia-synclavier-v': ['Multi-mode'],
  'arturia-analog-lab': ['Multi-mode'],
  'ni-reaktor-6': ['Multi-mode'],
  'ni-absynth-5': ['Multi-mode'],
  'rob-papen-albino-3-legend': ['Multi-mode'],
  'spectrasonics-omnisphere-3': ['Multi-mode'],
  'wave-alchemy-bassynth': ['Multi-mode'],

  'ni-kontakt-6': ['Sampling / ROMpler'],
  'arturia-cmi-v': ['Sampling / ROMpler'],
  'ni-form': ['Sampling / ROMpler'],
  'spectrasonics-trilian': ['Sampling / ROMpler'],
  'spectrasonics-keyscape': ['Multi-mode'],
  'ni-session-strings-2': ['Sampling / ROMpler'],
  'ni-session-horns': ['Sampling / ROMpler'],
  'ni-session-guitarist-strummed-acoustic': ['Sampling / ROMpler'],
  'ni-session-guitarist-electric-sunburst': ['Sampling / ROMpler'],
  'ni-scarbee-mm-bass': ['Sampling / ROMpler'],
  'ni-scarbee-rickenbacker-bass': ['Sampling / ROMpler'],
  'ni-kinetic-metal': ['Sampling / ROMpler'],
  'ni-discovery-world': ['Sampling / ROMpler'],
  'ni-play-analog-dreams': ['Sampling / ROMpler'],
  'ni-play-cloud-supply': ['Sampling / ROMpler'],
  'ni-play-ethereal-earth': ['Sampling / ROMpler'],
  'ni-play-lo-fi-glow': ['Sampling / ROMpler'],
  'ni-play-modular-icons': ['Sampling / ROMpler'],
  'ni-retro-machines-mk2': ['Sampling / ROMpler'],

  // --- Keys ---
  'arturia-solina-v': ['String ensemble'],
  'arturia-piano-v': ['Acoustic piano'],
  'ni-noire': ['Acoustic piano'],
  'ni-the-gentleman': ['Acoustic piano'],
  'ni-the-grandeur': ['Acoustic piano'],
  'ni-the-maverick': ['Acoustic piano'],
  'ni-the-giant': ['Acoustic piano'],
  'ni-una-corda': ['Acoustic piano'],
  'arturia-stage-73-v': ['Electric piano'],
  'arturia-wurli-v': ['Electric piano'],
  'ni-scarbee-mark-i': ['Electric piano'],
  'ni-scarbee-a200': ['Electric piano'],
  'waves-electric-grand-80': ['Electric piano'],
  'arturia-b-3-v': ['Organ'],
  'arturia-farfisa-v': ['Organ'],
  'arturia-vox-continental-v': ['Organ'],
  'ni-vintage-organs': ['Organ'],
  'arturia-mellotron-v': ['Mellotron / tape keys'],
  'arturia-clavinet-v': ['Clavinet'],
  'ni-scarbee-clavinet': ['Clavinet'],
  'ni-play-hybrid-keys': ['Multi-mode'],

  // --- Modulation / filter ---
  'arturia-chorus-jun-6': ['Chorus'],
  'arturia-chorus-dimension-d': ['Chorus'],
  'nf-ch2s': ['Chorus'],
  'ni-choral': ['Chorus'],
  'pa-bx-bluechorus2': ['Chorus'],

  'arturia-flanger-bl-20': ['Flanger'],
  'ni-flair': ['Flanger'],
  'waves-metaflanger': ['Flanger'],
  'minimal-audio-poly-flanger': ['Flanger'],

  'arturia-phaser-bi-tron': ['Phaser'],
  'soundtoys-phasemistress': ['Phaser'],
  'nf-aph2s': ['Phaser'],
  'nf-liquid-phase-iii': ['Phaser'],
  'ni-phasis': ['Phaser'],

  'soundtoys-tremolator': ['Tremolo'],
  'arturia-rotary-cls-222': ['Rotary'],
  'psp-lotary2': ['Rotary'],
  'soundtoys-panman': ['Auto-pan'],

  'nf-liquid-mod-iii': ['Multi-mode'],
  'psp-285': ['Multi-mode'],
  'waves-mondomod': ['Multi-mode'],
  'fabfilter-volcano-3': ['Multi-mode'],

  'arturia-filter-mini': ['Ladder'],

  // --- Suites that are explicitly multi-processor ---
  'izotope-nectar-3': ['Multi-mode'],
  'izotope-neutron-3-advanced': ['Multi-mode'],
  'izotope-ozone-9-advanced': ['Multi-mode'],
}
