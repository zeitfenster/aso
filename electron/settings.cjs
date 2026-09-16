const fs = require('node:fs');
const path = require('node:path');
const { app } = require('electron');

function settingsFilePath() {
  return path.join(app.getPath('userData'), 'settings.json');
}

function readSettings() {
  try {
    const raw = fs.readFileSync(settingsFilePath(), 'utf8');
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeSettings(next) {
  fs.writeFileSync(settingsFilePath(), `${JSON.stringify(next, null, 2)}\n`, 'utf8');
}

const WINDOW_RESOLUTIONS = [
  { id: '1600x900', width: 1600, height: 900, label: '1600 × 900' },
  { id: '1920x1080', width: 1920, height: 1080, label: '1920 × 1080' },
  { id: '1920x1200', width: 1920, height: 1200, label: '1920 × 1200' },
  { id: '2560x1440', width: 2560, height: 1440, label: '2560 × 1440' },
];

const WINDOW_SCALES = [
  { id: 100, label: '100%' },
  { id: 120, label: '120%' },
  { id: 135, label: '135%' },
];

const DEFAULT_WINDOW_RESOLUTION = '1600x900';
const DEFAULT_WINDOW_SCALE = 100;

function parseResolutionId(id) {
  const match = WINDOW_RESOLUTIONS.find((r) => r.id === id);
  return (
    match ||
    WINDOW_RESOLUTIONS.find((r) => r.id === DEFAULT_WINDOW_RESOLUTION)
  );
}

function parseScaleId(value) {
  const n = Number(value);
  const match = WINDOW_SCALES.find((s) => s.id === n);
  return match ? match.id : DEFAULT_WINDOW_SCALE;
}

function getWindowAppearance() {
  const settings = readSettings();
  const resolution = parseResolutionId(settings.windowResolution);
  const scale = parseScaleId(settings.windowScale);
  return {
    resolution: resolution.id,
    width: resolution.width,
    height: resolution.height,
    scale,
    resolutions: WINDOW_RESOLUTIONS,
    scales: WINDOW_SCALES,
  };
}

function setWindowAppearance({ resolution, scale } = {}) {
  const settings = readSettings();
  if (resolution != null) {
    settings.windowResolution = parseResolutionId(resolution).id;
  }
  if (scale != null) {
    settings.windowScale = parseScaleId(scale);
  }
  writeSettings(settings);
  return getWindowAppearance();
}

module.exports = {
  getWindowAppearance,
  setWindowAppearance,
  WINDOW_RESOLUTIONS,
  WINDOW_SCALES,
};
