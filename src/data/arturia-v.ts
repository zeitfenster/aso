import type { CatalogEntry, PluginType } from './types'

const C = 'Arturia V Collection 7'

function inst(
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
    vendor: 'Arturia',
    kind: 'plugin',
    types,
    collections: [C],
    summary,
    sonicCharacter,
    bestFor,
    useCases,
    tags: ['arturia', 'v-collection-7', ...tags],
  }
}

export const arturiaVCollection: CatalogEntry[] = [
  inst('arturia-analog-lab', 'Analog Lab', ['Synth', 'Keys / Piano'], 'Preset library host that browses and plays sounds across the V Collection ecosystem with simplified controls.', 'Depends on the underlying instrument preset—from analog grit to keys and organs.', 'Fast sketching and live preset browsing without opening every individual instrument.', ['Find a pad/lead quickly during songwriting.', 'Build live setlists from curated presets.', 'Start an idea in Analog Lab, then open the full instrument to deep-edit.'], ['preset-host']),
  inst('arturia-mini-v', 'Mini V', ['Synth'], 'Minimoog Model D emulation—monophonic subtractive icon.', 'Fat, growling, classic Moog bass/lead with ladder-filter warmth.', 'Basslines, leads, and vintage analog mono duties.', ['Resonant acid-ish basslines.', 'Expressive pitch-bent leads.', 'Unison-style stacked mono layers for modern weight.']),
  inst('arturia-modular-v', 'Modular V', ['Synth'], 'Moog modular system recreation with patchable modules for deep analog-style synthesis.', 'Huge, experimental, vintage modular—from polite to wild.', 'Sound design, evolving textures, and classic modular learning.', ['Patch complex modulation for evolving beds.', 'Recreate classic modular bass/lead patches.', 'Design FX bursts and transitions.']),
  inst('arturia-arp-2600-v', 'ARP 2600 V', ['Synth'], 'Semi-modular ARP 2600 emulation with classic patchbay workflow.', 'Punchy, slightly aggressive East Coast analog with distinctive ARP tone.', 'Leads, basses, FX, and educational semi-modular patching.', ['Classic 2600 lead tones.', 'Synced sample-and-hold FX beds.', 'Drum-like analog hits from noise+filter.']),
  inst('arturia-cs-80-v', 'CS-80 V', ['Synth'], 'Yamaha CS-80 recreation famous for expressive polyphonic analog sound (think Vangelis-adjacent territory).', 'Lush, emotional, wide analog poly with rich filters and performance controls.', 'Cinematic themes, expressive leads, and lush 70s/80s poly sounds.', ['Ribbon-style expressive leads.', 'Huge poly brass/pad hybrids.', 'Film-score inspired themes.']),
  inst('arturia-jup-8-v', 'Jup-8 V', ['Synth'], 'Roland Jupiter-8 emulation—premier early-80s analog polysynth.', 'Sparkling, wide, luxurious analog poly; excellent arps and pads.', 'Pop/electronic hooks, lush pads, and vintage poly comps.', ['Bright Jupiter plucks and arps.', 'Wide chorus-like pads.', 'Classic early-80s brass patches.']),
  inst('arturia-prophet-v', 'Prophet V', ['Synth'], 'Combines Prophet-5 style analog poly with Prophet-VS vector synthesis engines.', 'Warm Sequential analog and morphing VS digital/vector character in one instrument.', 'Pads, comps, and evolving vector textures.', ['Classic Prophet-5 poly comps.', 'Vector morph pads.', 'Hybrid analog/digital layers.']),
  inst('arturia-matrix-12-v', 'Matrix-12 V', ['Synth'], 'Oberheim Matrix-12 emulation with deep modulation matrix.', 'Classy Oberheim analog richness with sophisticated movement.', 'Evolving pads, complex polys, and modulated textures.', ['Slow evolving cinematic pads.', 'Oberheim-style brass.', 'Complex LFO-driven rhythmic polys.']),
  inst('arturia-sem-v', 'SEM V', ['Synth'], 'Oberheim SEM-based instrument (multi-voice SEM character).', 'Creamy Oberheim tone—smooth filters and vintage American analog.', 'Pads, soft leads, and classic Oberheim textures.', ['SEM saw pads.', 'Dual-SEM style thicknesses.', 'Vintage soft leads.']),
  inst('arturia-solina-v', 'Solina V', ['Synth'], 'ARP Solina string ensemble recreation.', 'Lush, chorused vintage string-ensemble perfume.', 'Soft string beds, 70s pop, and nostalgic pads.', ['Instant Solina strings under a ballad.', 'Layer with piano for vintage ballad thickness.', 'Slow-attack ensemble pads.']),
  inst('arturia-buchla-easel-v', 'Buchla Easel V', ['Synth'], 'Buchla Music Easel emulation—West Coast synthesis workflows.', 'Organic, bongo-ish plucks, complex LOUD/timbral West Coast textures.', 'Experimental sound design and alternative synthesis aesthetics.', ['West Coast plucks and tones.', 'Complex envelope-driven textures.', 'Non-Moog experimental leads/FX.']),
  inst('arturia-synthi-v', 'Synthi V', ['Synth'], 'EMS Synthi AKS-inspired instrument with pin-matrix patching.', 'British experimental vintage—quirky, raw, and FX-capable.', 'Experimental electronics, FX, and vintage sci-fi tones.', ['Pin-matrix FX beds.', 'Odd leads and noise textures.', 'Tape-era experimental electronics vibes.']),
  inst('arturia-cz-v', 'CZ V', ['Synth'], 'Casio CZ phase-distortion synth recreation.', 'Bright 80s digital PD tones—bells, basses, and glassy digital colors.', 'Retro digital synth-pop and phase-distortion timbres.', ['CZ bass patches for electro.', 'Glassy bells and mallets.', '80s digital poly comps.']),
  inst('arturia-dx7-v', 'DX7 V', ['Synth'], 'Yamaha DX7 FM synthesizer emulation.', 'Classic FM: electric pianos, bells, basses, and crystalline digital tones.', '80s EPs, FM basses, and iconic digital presets.', ['DX electric piano comps.', 'Percussive FM basses.', 'Bell/mallet ear-candy layers.']),
  inst('arturia-synclavier-v', 'Synclavier V', ['Synth'], 'Synclavier-inspired FM/additive workstation recreation.', 'High-end early digital: complex, glassy, and sophisticated.', 'Cinematic digital textures and boutique FM/additive design.', ['Additive bells and airy pads.', 'Complex evolving digital beds.', 'Boutique early-digital leads.']),
  inst('arturia-cmi-v', 'CMI V', ['Synth', 'Sampler'], 'Fairlight CMI-inspired sampling/synthesis instrument.', 'Iconic early digital sampler character—gritty bit depth and historic presets.', 'Retro sampling aesthetics and Fairlight-era textures.', ['Fairlight-ish choir/orchestra hits.', 'Lo-fi digital sample playback vibe.', '80s experimental sample synth parts.']),
  inst('arturia-mellotron-v', 'Mellotron V', ['Keys / Piano', 'Sampler'], 'Mellotron tape keyboard recreation with classic tape banks and user sample options.', 'Wobbly tape choirs/strings/flutes—haunting and imperfect by design.', 'Psych, indie, progressive, and cinematic tape textures.', ['Tape choir pads.', 'Flute/string Mellotron hooks.', 'Load custom samples through tape playback character.']),
  inst('arturia-piano-v', 'Piano V', ['Keys / Piano'], 'Modeled acoustic piano instrument with multiple piano types and mechanical detail.', 'From intimate uprights to concert grands—physical modeling flexibility.', 'Songwriting piano parts and realistic keys without huge sample libraries.', ['Ballad grand piano.', 'Upright indie piano tones.', 'Layer with synths for hybrid keys.']),
  inst('arturia-stage-73-v', 'Stage-73 V', ['Keys / Piano'], 'Fender Rhodes-style Stage/Suitcase electric piano emulation.', 'Bell-top EP sparkle, tines, and classic electric piano thump.', 'Soul, jazz, neo-soul, and pop EP comps.', ['Rhodes comps under vocals.', 'Suitcase EP with amp/fx chain.', 'Muted EP rhythms for neo-soul.']),
  inst('arturia-wurli-v', 'Wurli V', ['Keys / Piano'], 'Wurlitzer electric piano recreation.', 'Barkier, reedier EP bite than a Rhodes—rawer and funkier.', 'Indie, rock, and soul keys with attitude.', ['Wurli hooks for indie rock.', 'Driven EP with grit.', 'Soft ballad Wurli with tremolo.']),
  inst('arturia-clavinet-v', 'Clavinet V', ['Keys / Piano'], 'Hohner Clavinet recreation for funk rhythmic keys.', 'Percussive, funky, midrange “chicken scratch” clavi tone.', 'Funk rhythms, disco, and percussive keyboard parts.', ['Clav funk patterns with mute.', 'Layer with bass for disco beds.', 'Wah/filtered clav special FX.']),
  inst('arturia-b-3-v', 'B-3 V', ['Keys / Piano'], 'Hammond B-3 organ emulation with drawbars and rotary options.', 'Gospel/jazz/rock organ growl, key click, and rotary swirl.', 'Organ beds, solos, and classic rock/soul keys.', ['Gospel organ pads.', 'Rock organ solos with rotary speed stops.', 'Jazz combo organ comps.']),
  inst('arturia-farfisa-v', 'Farfisa V', ['Keys / Piano'], 'Farfisa combo organ recreation.', 'Buzzy, 60s combo-organ charm—thinner and more garage than a B-3.', 'Retro pop, garage, and psychedelic keys.', ['60s organ hooks.', 'Garage-rock organ stabs.', 'Layer with drums for period cues.']),
  inst('arturia-vox-continental-v', 'VOX Continental V', ['Keys / Piano'], 'Vox Continental combo organ recreation.', 'Bright, reedy British Invasion organ character.', 'Beat/mod-era keys and retro pop textures.', ['Vox organ riffs for 60s pastiche.', 'Soft Continental pads with vibrato.', 'Layer with Mellotron for psych beds.']),
]
