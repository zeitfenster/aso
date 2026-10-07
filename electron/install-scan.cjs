const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const MAX_DEPTH = 4;
const MAX_NAMES = 8000;
const MAX_NAME = 240;

function homeDir() {
  try {
    return os.homedir();
  } catch {
    return '';
  }
}

function pluginSearchPaths(platform = process.platform) {
  const home = homeDir();
  if (platform === 'darwin') {
    return {
      vst3: [
        '/Library/Audio/Plug-Ins/VST3',
        path.join(home, 'Library/Audio/Plug-Ins/VST3'),
      ],
      vst2: [
        '/Library/Audio/Plug-Ins/VST',
        path.join(home, 'Library/Audio/Plug-Ins/VST'),
      ],
      au: [
        '/Library/Audio/Plug-Ins/Components',
        path.join(home, 'Library/Audio/Plug-Ins/Components'),
      ],
      apps: ['/Applications', path.join(home, 'Applications')],
    };
  }
  if (platform === 'win32') {
    const pf = process.env.ProgramFiles || 'C:\\Program Files';
    const pf86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)';
    const local = process.env.LOCALAPPDATA || path.join(home, 'AppData', 'Local');
    return {
      vst3: [
        path.join(pf, 'Common Files', 'VST3'),
        path.join(pf86, 'Common Files', 'VST3'),
      ],
      vst2: [
        path.join(pf, 'Steinberg', 'VstPlugins'),
        path.join(pf86, 'Steinberg', 'VstPlugins'),
        path.join(pf, 'VSTPlugins'),
        path.join(pf86, 'VSTPlugins'),
      ],
      au: [],
      apps: [pf, pf86, path.join(local, 'Programs')],
    };
  }
  return { vst3: [], vst2: [], au: [], apps: [] };
}

function stripExt(name, ext) {
  if (name.toLowerCase().endsWith(ext)) return name.slice(0, -ext.length);
  return name;
}

function pushName(acc, name) {
  const trimmed = String(name || '').trim().slice(0, MAX_NAME);
  if (!trimmed || acc.length >= MAX_NAMES) return;
  acc.push(trimmed);
}

function collectPlugins(dir, extensions, acc, depth, seen) {
  if (depth > MAX_DEPTH || acc.length >= MAX_NAMES) return;
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (acc.length >= MAX_NAMES) return;
    const name = entry.name;
    if (!name || name.startsWith('.')) continue;
    const lower = name.toLowerCase();
    const matched = extensions.find((ext) => lower.endsWith(ext));
    if (matched) {
      pushName(acc, stripExt(name, matched));
      continue;
    }
    if (!entry.isDirectory()) continue;
    if (/\.(vst3|vst|component|app|dll)$/i.test(name)) continue;
    const full = path.join(dir, name);
    let real;
    try {
      real = fs.realpathSync(full);
    } catch {
      continue;
    }
    if (seen.has(real)) continue;
    seen.add(real);
    collectPlugins(full, extensions, acc, depth + 1, seen);
  }
}

function collectApps(dir, acc, seen) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (acc.length >= MAX_NAMES) return;
    const name = entry.name;
    if (!name || name.startsWith('.')) continue;
    if (name.toLowerCase().endsWith('.app')) {
      pushName(acc, stripExt(name, '.app'));
      continue;
    }
    if (!entry.isDirectory()) continue;
    if (/\.(app|vst3|vst|component)$/i.test(name)) continue;
    const full = path.join(dir, name);
    let real;
    try {
      real = fs.realpathSync(full);
    } catch {
      continue;
    }
    if (seen.has(real)) continue;
    seen.add(real);
    // One extra level for vendor folders like /Applications/Native Instruments/
    let nested;
    try {
      nested = fs.readdirSync(full, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const child of nested) {
      if (acc.length >= MAX_NAMES) return;
      if (child.name.toLowerCase().endsWith('.app')) {
        pushName(acc, stripExt(child.name, '.app'));
      }
    }
  }
}

function uniqueSorted(values) {
  return Array.from(new Set(values)).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: 'base' }),
  );
}

function scanInstalled() {
  const paths = pluginSearchPaths();
  const vst3 = [];
  const vst2 = [];
  const au = [];
  const apps = [];
  const seen = new Set();
  const vst3Exts =
    process.platform === 'win32' ? ['.vst3'] : ['.vst3'];
  const vst2Exts =
    process.platform === 'win32' ? ['.dll', '.vst'] : ['.vst'];

  for (const dir of paths.vst3) collectPlugins(dir, vst3Exts, vst3, 0, seen);
  for (const dir of paths.vst2) collectPlugins(dir, vst2Exts, vst2, 0, seen);
  for (const dir of paths.au) collectPlugins(dir, ['.component'], au, 0, seen);
  const appSeen = new Set();
  for (const dir of paths.apps) collectApps(dir, apps, appSeen);

  return {
    scannedAt: new Date().toISOString(),
    platform: process.platform,
    vst3: uniqueSorted(vst3),
    vst2: uniqueSorted(vst2),
    au: uniqueSorted(au),
    apps: uniqueSorted(apps),
  };
}

module.exports = { scanInstalled, pluginSearchPaths };
