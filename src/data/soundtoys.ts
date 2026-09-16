import type { CatalogEntry, PluginType } from './types'

const C = 'Soundtoys Bundle v5.3'

function st(
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
    vendor: 'Soundtoys',
    kind: 'plugin',
    types,
    collections: [C],
    summary,
    sonicCharacter,
    bestFor,
    useCases,
    tags: ['soundtoys', 'soundtoys-5.3', ...tags],
  }
}

/** Soundtoys V5.3 license set (21 plugins): original 5 + Sie-Q + EchoBoy Jr. + Little Plate. */
export const soundtoysBundle: CatalogEntry[] = [
  st('soundtoys-effect-rack', 'Effect Rack', ['Creative FX'], 'Host rack that chains multiple Soundtoys effects in one plugin with shared mixing and presets.', 'Whatever chain you build—Effect Rack is the workflow hub for stacked Soundtoys color.', 'Complex multi-effect chains and recallable vocal/instrument “secret sauce” racks.', ['Build a vocal delay+widen+saturate rack.', 'Save drum smash chains combining Decapitator and Devil-Loc.', 'Perform multi-FX transitions from one device.']),
  st('soundtoys-decapitator', 'Decapitator', ['Saturation / Distortion'], 'Hardware-modeled saturator/distortion with multiple styles and a Punish mode for hard drive.', 'From subtle analog warmth to shredded distortion—versatile and musical.', 'Everyday saturation on vocals, drums, bass, and buses.', ['Warm a vocal gently on style A/E.', 'Punish a parallel drum bus.', 'Add harmonics to a thin synth.']),
  st('soundtoys-echoboy', 'EchoBoy', ['Delay'], 'Studio-standard delay modeling dozens of echo flavors (tape, analog, digital, etc.) with deep tone shaping.', 'Extremely flexible: pristine digital, dusty tape, or dark analog repeats.', 'Vocals, guitars, synths—any musical echo duty.', ['Tempo-sync dotted delays on vocals.', 'Tape slap on guitars.', 'Dub feedback experiments with tone control.']),
  st('soundtoys-echoboy-jr', 'EchoBoy Jr.', ['Delay'], 'Streamlined EchoBoy with essential echo styles and faster workflow.', 'Same Soundtoys delay DNA in a simpler, lighter UI.', 'Quick delays when full EchoBoy is more than you need.', ['Fast vocal slapback.', 'Simple rhythmic delays on synths.', 'Lightweight delay returns in big sessions.']),
  st('soundtoys-little-plate', 'Little Plate', ['Reverb'], 'Elegant plate reverb inspired by classic electromechanical plates, including infinite decay tricks.', 'Lush, blooming plate sheen—can go from short glam to endless wash.', 'Vocals, snares, and stylish plate spaces.', ['Lead vocal plate.', 'Infinite plate special FX.', 'Snare dens with plate character.']),
  st('soundtoys-sie-q', 'Sie-Q', ['EQ'], 'German broadcast-inspired EQ with drive for fast, musical tone shaping.', 'Open highs, smooth lows, slightly colorful driven EQ.', 'Quick tonal sweetening on vocals and instruments.', ['Add airy top to vocals.', 'Drive mids for presence.', 'Gentle low lift on buses.']),
  st('soundtoys-filterfreak', 'FilterFreak', ['Filter', 'Modulation', 'Creative FX'], 'Analog-modeled resonant filter with deep rhythmic LFO options (plus dual FilterFreak 2 variant in the set).', 'Fat, resonant analog filter moves—musical or aggressive.', 'Filter sweeps, rhythmic filter grooves, and synth/drum animation.', ['Tempo-synced filter pumping on loops.', 'Resonant sweeps into drops.', 'Dual-filter (FilterFreak 2) stereo adventures.']),
  st('soundtoys-phasemistress', 'PhaseMistress', ['Modulation'], 'Rich analog-style phaser with deep modulation presets and tempo sync.', 'Thick, syrupy, vintage phaser color.', 'Keys, guitars, vocals, and creative stereo motion.', ['Slow phaser on electric piano.', 'Rhythmic phase chops on pads.', 'Guitar psychedelic sweeps.']),
  st('soundtoys-tremolator', 'Tremolator', ['Modulation'], 'Tremolo/gate rhythmic tool inspired by guitar amps and beyond, with pattern sequencing.', 'Choppy to silky amplitude motion—can feel vintage amp or modern gated.', 'Rhythmic vocals, guitars, pads, and sidechain-like patterns.', ['Guitar tremolo parts.', 'Gated pad rhythms.', 'Vocal chop patterns without editing clips.']),
  st('soundtoys-panman', 'PanMan', ['Modulation', 'Creative FX'], 'Rhythmic auto-panner with classic and modern panning tricks plus analog color.', 'Motion-focused stereo animation with optional grit.', 'Mixing interest, trance-style pans, and creative width.', ['Tempo pans on hi-hats.', 'Wide rhythmic movement on FX.', 'Subtle analog-colored auto-pan on pads.']),
  st('soundtoys-crystallizer', 'Crystallizer', ['Pitch / Harmony', 'Delay', 'Creative FX'], 'Granular pitch-shifting reverse echo based on Eventide-ish crystal echo concepts.', 'Shimmery, reverse-grain, magical pitched trails.', 'Sound design, vocal special FX, and ambient guitar/synth textures.', ['Crystal echoes on vocal ends.', 'Reverse-grain guitar ambience.', 'Pitch-shifted granular delays on pads.']),
  st('soundtoys-microshift', 'MicroShift', ['Pitch / Harmony', 'Modulation'], 'Classic studio micro-pitch widening for super-wide vocals and instruments.', 'Wide, glossy doubled width without a full reverb wash.', 'Background vocals, synths, and mono-to-stereo thickening.', ['Widen stacked BVs.', 'Stereo-ize a mono synth.', 'Subtle width on acoustic images.']),
  st('soundtoys-little-microshift', 'Little MicroShift', ['Pitch / Harmony', 'Modulation'], 'Simplified MicroShift for fast widening presets.', 'Same wide micro-pitch family in a smaller plugin.', 'Quick vocal/synth width.', ['One-knob BV widening.', 'Fast synth stereo makeover.', 'Lightweight width on buses.']),
  st('soundtoys-little-alterboy', 'Little AlterBoy', ['Pitch / Harmony', 'Creative FX'], 'Real-time pitch and formant shifter with hard-tune robot modes.', 'From natural transposition to hard robotic vocoder-ish character.', 'Vocal FX, gender/formant play, and creative hooks.', ['Octave-down vocal special FX.', 'Hard-tune robotic hooks.', 'Formant shifts for character voices.']),
  st('soundtoys-radiator', 'Radiator', ['Saturation / Distortion', 'EQ'], 'Altec 1567A-inspired tube mixer saturation and EQ color.', 'Warm, vibey tube drive with musical mid emphasis.', 'Vocals, drums, buses, and analog “radio” thickness.', ['Tube drive on a vocal.', 'Warm a drum bus.', 'Add vintage mixer color to samples.']),
  st('soundtoys-little-radiator', 'Little Radiator', ['Saturation / Distortion'], 'Smaller Radiator for quick tube heat.', 'Same tube warmth family, fewer controls.', 'Fast analog heat when you do not need full Radiator EQ.', ['Quick vocal warmth.', 'Subtle drum saturation.', 'Heat on loops.']),
  st('soundtoys-primaltap', 'PrimalTap', ['Delay', 'Creative FX'], 'Classic dual delay inspired by early digital hardware with Freeze for lo-fi loops.', 'Vintage digital delay artifacts, dark echoes, and freeze weirdness.', 'Special FX delays, lo-fi loops, and experimental echoes.', ['Freeze a vocal snippet into a bed.', 'Dual rhythmic delays on synths.', 'Lo-fi pitch-warped delay FX.']),
  st('soundtoys-little-primaltap', 'Little PrimalTap', ['Delay'], 'Compact PrimalTap for essential vintage digital delay flavors.', 'Same early-digital delay vibe, simplified.', 'Quick vintage delays and lightweight FX.', ['Short vintage slap.', 'Simple dual echoes.', 'Lo-fi delay throws.']),
  st('soundtoys-devil-loc', 'Devil-Loc', ['Compressor', 'Saturation / Distortion'], 'Aggressive leveling/crush inspired by classic brick-smashing limiters—compact version.', 'Heavy, pumping, dirty smash.', 'Parallel drum crush and aggressive leveling.', ['Parallel devil crush on drums.', 'Destroy a loop for industrial texture.', 'Create pumping room-mic style smash.']),
  st('soundtoys-devil-loc-deluxe', 'Devil-Loc Deluxe', ['Compressor', 'Saturation / Distortion'], 'Fuller Devil-Loc with more control over crush, darkness, and release behavior.', 'Pounding, dark, aggressive compression/saturation hybrid.', 'Drum rooms, parallel buses, and extreme dynamics FX.', ['Classic crushed drum room sound.', 'Parallel bus destruction.', 'Industrial vocal grit.']),
]
