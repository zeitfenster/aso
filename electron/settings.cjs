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

const MAX_INSTALL_NAMES = 8000;
const MAX_INSTALL_NAME = 240;

function sanitizeNameList(raw) {
  if (!Array.isArray(raw)) return [];
  const names = [];
  const used = new Set();
  for (const item of raw) {
    if (names.length >= MAX_INSTALL_NAMES) break;
    if (typeof item !== 'string') continue;
    const name = item.trim().slice(0, MAX_INSTALL_NAME);
    if (!name) continue;
    const key = name.toLowerCase();
    if (used.has(key)) continue;
    used.add(key);
    names.push(name);
  }
  return names;
}

function sanitizeInstallScan(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const scannedAt =
    typeof raw.scannedAt === 'string' && raw.scannedAt.trim()
      ? raw.scannedAt.trim().slice(0, 40)
      : '';
  if (!scannedAt) return null;
  return {
    scannedAt,
    platform:
      typeof raw.platform === 'string' && raw.platform.trim()
        ? raw.platform.trim().slice(0, 32)
        : process.platform,
    vst3: sanitizeNameList(raw.vst3),
    vst2: sanitizeNameList(raw.vst2),
    au: sanitizeNameList(raw.au),
    apps: sanitizeNameList(raw.apps),
  };
}

function getInstallScan() {
  return sanitizeInstallScan(readSettings().installScan);
}

function setInstallScan(payload) {
  const settings = readSettings();
  const next = sanitizeInstallScan(payload);
  if (next) settings.installScan = next;
  else delete settings.installScan;
  writeSettings(settings);
  return next;
}

const MIN_WINDOW_WIDTH = 1100;
const MIN_WINDOW_HEIGHT = 700;

const WINDOW_RESOLUTIONS = [
  { id: '1600x900', width: 1600, height: 900, label: '1600 × 900' },
  { id: '1920x1080', width: 1920, height: 1080, label: '1920 × 1080' },
  { id: '1920x1200', width: 1920, height: 1200, label: '1920 × 1200' },
  { id: '2560x1440', width: 2560, height: 1440, label: '2560 × 1440' },
];

const WINDOW_SCALES = [
  { id: 80, label: '80%' },
  { id: 90, label: '90%' },
  { id: 100, label: '100%' },
  { id: 110, label: '110%' },
  { id: 120, label: '120%' },
  { id: 125, label: '125%' },
  { id: 135, label: '135%' },
  { id: 150, label: '150%' },
  { id: 175, label: '175%' },
  { id: 200, label: '200%' },
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

function parseBounds(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const x = Number(raw.x);
  const y = Number(raw.y);
  const width = Number(raw.width);
  const height = Number(raw.height);
  if (![x, y, width, height].every(Number.isFinite)) return null;
  return {
    x: Math.round(x),
    y: Math.round(y),
    width: Math.max(MIN_WINDOW_WIDTH, Math.round(width)),
    height: Math.max(MIN_WINDOW_HEIGHT, Math.round(height)),
  };
}

function resolutionForSize(width, height) {
  return (
    WINDOW_RESOLUTIONS.find((r) => r.width === width && r.height === height) ||
    null
  );
}

function getWindowAppearance() {
  const settings = readSettings();
  const preset = parseResolutionId(settings.windowResolution);
  const scale = parseScaleId(settings.windowScale);
  const bounds = parseBounds(settings.windowBounds);
  const width = bounds?.width ?? preset.width;
  const height = bounds?.height ?? preset.height;
  const matched = resolutionForSize(width, height);
  const resolution = matched?.id || 'custom';
  const resolutions =
    resolution === 'custom'
      ? [
          {
            id: 'custom',
            width,
            height,
            label: `Custom — ${width} × ${height}`,
          },
          ...WINDOW_RESOLUTIONS,
        ]
      : WINDOW_RESOLUTIONS;

  return {
    resolution,
    width,
    height,
    x: bounds?.x,
    y: bounds?.y,
    maximized: Boolean(settings.windowMaximized),
    scale,
    resolutions,
    scales: WINDOW_SCALES,
  };
}

function setWindowAppearance({ resolution, scale } = {}) {
  const settings = readSettings();
  if (resolution != null && resolution !== 'custom') {
    const preset = parseResolutionId(resolution);
    settings.windowResolution = preset.id;
    const current = parseBounds(settings.windowBounds);
    if (current) {
      settings.windowBounds = {
        ...current,
        width: preset.width,
        height: preset.height,
      };
    }
    settings.windowMaximized = false;
  }
  if (scale != null) {
    settings.windowScale = parseScaleId(scale);
  }
  writeSettings(settings);
  return getWindowAppearance();
}

function setWindowState({ bounds, maximized } = {}) {
  const settings = readSettings();
  const parsed = parseBounds(bounds);
  if (parsed) {
    settings.windowBounds = parsed;
    const matched = resolutionForSize(parsed.width, parsed.height);
    if (matched) settings.windowResolution = matched.id;
  }
  if (typeof maximized === 'boolean') {
    settings.windowMaximized = maximized;
  }
  writeSettings(settings);
  return getWindowAppearance();
}

module.exports = {
  getWindowAppearance,
  setWindowAppearance,
  setWindowState,
  getInstallScan,
  setInstallScan,
  WINDOW_RESOLUTIONS,
  WINDOW_SCALES,
  MIN_WINDOW_WIDTH,
  MIN_WINDOW_HEIGHT,
};
