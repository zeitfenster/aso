const fs = require('node:fs');
const path = require('node:path');
const { app } = require('electron');

const MAX_NOTE = 4000;
const MAX_PRESETS = 24;
const MAX_PRESET_LEN = 160;
const MAX_RECENT = 12;

function libraryFilePath() {
  return path.join(app.getPath('userData'), 'library.json');
}

function clip(value, max) {
  if (typeof value !== 'string') return '';
  return value.slice(0, max);
}

function emptyLibrary() {
  return { version: 1, plugins: {}, defaults: {}, lastOpened: [] };
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
  const defaults = {};
  if (raw.defaults && typeof raw.defaults === 'object') {
    for (const [slot, pluginId] of Object.entries(raw.defaults)) {
      if (typeof slot === 'string' && typeof pluginId === 'string' && pluginId) {
        defaults[slot] = pluginId;
      }
    }
  }
  const lastOpened = Array.isArray(raw.lastOpened)
    ? raw.lastOpened.filter((id) => typeof id === 'string').slice(0, MAX_RECENT)
    : [];
  return { version: 1, plugins, defaults, lastOpened };
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
