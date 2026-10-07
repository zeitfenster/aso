const fs = require('node:fs');
const path = require('node:path');
const { app } = require('electron');

const MAX_NOTE = 4000;
const MAX_PRESETS = 24;
const MAX_PRESET_LEN = 160;
const MAX_RECENT = 12;
const MAX_SLOTS = 40;
const MAX_SLOT_LABEL = 48;
const MAX_CHAINS = 40;
const MAX_CHAIN_LABEL = 64;
const MAX_CHAIN_WHEN = 400;
const MAX_CHAIN_STEPS = 24;
const MAX_STEP_NOTE = 160;
const STEP_PLACES = ['Insert', 'Send', 'Bus', 'Master'];

const SEED_SLOTS = [
  { id: 'vocal-compressor', label: 'Vocal compressor' },
  { id: 'vocal-eq', label: 'Vocal EQ' },
  { id: 'vocal-plate', label: 'Vocal plate' },
  { id: 'snare-compressor', label: 'Snare compressor' },
  { id: 'drum-bus', label: 'Drum bus glue' },
  { id: 'mix-bus-glue', label: 'Mix bus glue' },
  { id: 'mix-bus-eq', label: 'Mix bus EQ' },
  { id: 'surgical-eq', label: 'Surgical EQ' },
  { id: 'master-limiter', label: 'Master limiter' },
];

const SEED_CHAINS = [
  { id: 'pop-vocal', label: 'Pop vocal', when: '', steps: [] },
  { id: 'drum-bus', label: 'Drum bus', when: '', steps: [] },
  { id: 'master', label: 'Master', when: '', steps: [] },
];

function libraryFilePath() {
  return path.join(app.getPath('userData'), 'library.json');
}

function clip(value, max) {
  if (typeof value !== 'string') return '';
  return value.slice(0, max);
}

function slugifySlot(label) {
  const base = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  return base || 'slot';
}

function uniqueSlotId(label, used) {
  const base = slugifySlot(label);
  if (!used.has(base)) return base;
  let n = 2;
  while (used.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

function emptyLibrary() {
  return {
    version: 1,
    plugins: {},
    defaultSlots: SEED_SLOTS.map((slot) => ({ ...slot })),
    defaults: {},
    chains: SEED_CHAINS.map((chain) => ({
      ...chain,
      steps: chain.steps.map((step) => ({ ...step })),
    })),
    lastOpened: [],
  };
}

function sanitizeSlots(raw) {
  if (!Array.isArray(raw)) return null;
  const slots = [];
  const used = new Set();
  for (const item of raw) {
    if (slots.length >= MAX_SLOTS) break;
    if (!item || typeof item !== 'object') continue;
    const label = clip(String(item.label || '').trim(), MAX_SLOT_LABEL);
    if (!label) continue;
    const wanted =
      typeof item.id === 'string' && item.id.trim()
        ? item.id.trim().slice(0, 48)
        : uniqueSlotId(label, used);
    const id = used.has(wanted) ? uniqueSlotId(label, used) : wanted;
    used.add(id);
    slots.push({ id, label });
  }
  return slots;
}

function uniqueStepId(used) {
  let n = 1;
  while (used.has(`step-${n}`)) n += 1;
  return `step-${n}`;
}

function sanitizeSteps(raw) {
  if (!Array.isArray(raw)) return [];
  const steps = [];
  const used = new Set();
  for (const item of raw) {
    if (steps.length >= MAX_CHAIN_STEPS) break;
    if (!item || typeof item !== 'object') continue;
    const pluginId =
      typeof item.pluginId === 'string' ? item.pluginId.trim().slice(0, 80) : '';
    if (!pluginId) continue;
    const wanted =
      typeof item.id === 'string' && item.id.trim()
        ? item.id.trim().slice(0, 48)
        : uniqueStepId(used);
    const id = used.has(wanted) ? uniqueStepId(used) : wanted;
    used.add(id);
    const step = {
      id,
      pluginId,
      note: clip(String(item.note || '').trim(), MAX_STEP_NOTE),
    };
    if (STEP_PLACES.includes(item.place)) step.place = item.place;
    steps.push(step);
  }
  return steps;
}

function sanitizeChains(raw) {
  if (!Array.isArray(raw)) return null;
  const chains = [];
  const used = new Set();
  for (const item of raw) {
    if (chains.length >= MAX_CHAINS) break;
    if (!item || typeof item !== 'object') continue;
    const label = clip(String(item.label || '').trim(), MAX_CHAIN_LABEL);
    if (!label) continue;
    const wanted =
      typeof item.id === 'string' && item.id.trim()
        ? item.id.trim().slice(0, 48)
        : uniqueSlotId(label, used);
    const id = used.has(wanted) ? uniqueSlotId(label, used) : wanted;
    used.add(id);
    chains.push({
      id,
      label,
      when: clip(String(item.when || '').trim(), MAX_CHAIN_WHEN),
      steps: sanitizeSteps(item.steps),
    });
  }
  return chains;
}

function sanitizeLibrary(raw) {
  const base = emptyLibrary();
  if (!raw || typeof raw !== 'object') return base;
  const plugins = {};
  if (raw.plugins && typeof raw.plugins === 'object') {
    for (const [id, entry] of Object.entries(raw.plugins)) {
      if (typeof id !== 'string' || !entry || typeof entry !== 'object') continue;
      const presets = Array.isArray(entry.presets)
        ? entry.presets
            .filter((item) => typeof item === 'string')
            .map((item) => clip(item.trim(), MAX_PRESET_LEN))
            .filter(Boolean)
            .slice(0, MAX_PRESETS)
        : [];
      plugins[id] = {
        notes: clip(entry.notes, MAX_NOTE),
        reachForWhen: clip(entry.reachForWhen, MAX_NOTE),
        presets,
        shortlisted: Boolean(entry.shortlisted),
      };
    }
  }
  const parsedSlots = sanitizeSlots(raw.defaultSlots);
  const defaultSlots =
    parsedSlots === null ? SEED_SLOTS.map((slot) => ({ ...slot })) : parsedSlots;
  const slotIds = new Set(defaultSlots.map((slot) => slot.id));
  const defaults = {};
  if (raw.defaults && typeof raw.defaults === 'object') {
    for (const [slot, pluginId] of Object.entries(raw.defaults)) {
      if (slotIds.has(slot) && typeof pluginId === 'string' && pluginId) {
        defaults[slot] = pluginId;
      }
    }
  }
  const lastOpened = Array.isArray(raw.lastOpened)
    ? raw.lastOpened.filter((id) => typeof id === 'string').slice(0, MAX_RECENT)
    : [];
  const parsedChains = sanitizeChains(raw.chains);
  const chains =
    parsedChains === null
      ? SEED_CHAINS.map((chain) => ({
          ...chain,
          steps: chain.steps.map((step) => ({ ...step })),
        }))
      : parsedChains;
  return { version: 1, plugins, defaultSlots, defaults, chains, lastOpened };
}

function getLibrary() {
  try {
    const raw = fs.readFileSync(libraryFilePath(), 'utf8');
    return sanitizeLibrary(JSON.parse(raw));
  } catch {
    return emptyLibrary();
  }
}

function setLibrary(payload) {
  const next = sanitizeLibrary(payload);
  fs.writeFileSync(libraryFilePath(), `${JSON.stringify(next, null, 2)}\n`, 'utf8');
  return next;
}

module.exports = { getLibrary, setLibrary };
