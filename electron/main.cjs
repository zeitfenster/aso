// Cursor shells often set ELECTRON_RUN_AS_NODE=1. In that mode the Electron
// binary runs as Node and require('electron') returns a path string — crash.
if (process.env.ELECTRON_RUN_AS_NODE) {
  console.error(
    '[aso] ELECTRON_RUN_AS_NODE is set. Launch with: npm run electron:dev (or npm run start).',
  );
  process.exit(1);
}

const electron = require('electron');
if (!electron || typeof electron !== 'object' || !electron.app) {
  console.error(
    '[aso] require("electron") did not return the Electron API. ' +
      'Unset ELECTRON_RUN_AS_NODE and relaunch via npm run electron:dev.',
  );
  process.exit(1);
}

const { app, BrowserWindow, ipcMain, Menu, nativeImage, screen } = electron;
const path = require('node:path');
const fs = require('node:fs');
const {
  getWindowAppearance,
  setWindowAppearance,
  setWindowState,
  getInstallScan,
  setInstallScan,
  WINDOW_SCALES,
  MIN_WINDOW_WIDTH,
  MIN_WINDOW_HEIGHT,
} = require('./settings.cjs');
const { getLibrary, setLibrary } = require('./library.cjs');
const { scanInstalled } = require('./install-scan.cjs');

const isDev = process.env.ELECTRON_DEV === '1';
const isMac = process.platform === 'darwin';

function getMainWindow() {
  return (
    BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0] || null
  );
}

function sendMenuCommand(action, payload = {}) {
  const win = getMainWindow();
  if (!win || win.isDestroyed()) return;
  win.webContents.send('menu:command', { action, ...payload });
}

function getAppIconImage() {
  const pngPath = path.join(__dirname, '..', 'assets', 'aso-mark.png');
  if (!fs.existsSync(pngPath)) return null;
  try {
    const image = nativeImage.createFromPath(pngPath);
    return image.isEmpty() ? null : image;
  } catch {
    return null;
  }
}

function buildApplicationMenu() {
  const template = [
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: 'about' },
              { type: 'separator' },
              {
                label: 'Preferences…',
                accelerator: 'CmdOrCtrl+,',
                click: () => sendMenuCommand('preferences'),
              },
              { type: 'separator' },
              { role: 'services' },
              { type: 'separator' },
              { role: 'hide' },
              { role: 'hideOthers' },
              { role: 'unhide' },
              { type: 'separator' },
              { role: 'quit' },
            ],
          },
        ]
      : []),
    {
      label: 'File',
      submenu: [
        ...(!isMac
          ? [
              {
                label: 'Preferences…',
                accelerator: 'CmdOrCtrl+,',
                click: () => sendMenuCommand('preferences'),
              },
              { type: 'separator' },
            ]
          : []),
        isMac ? { role: 'close' } : { role: 'quit' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        {
          label: 'Actual Size',
          accelerator: 'CmdOrCtrl+0',
          click: () => applySavedScale(100),
        },
        {
          label: 'Zoom In',
          accelerator: 'CmdOrCtrl+Plus',
          click: () => stepSavedScale(1),
        },
        {
          label: 'Zoom Out',
          accelerator: 'CmdOrCtrl+-',
          click: () => stepSavedScale(-1),
        },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac
          ? [{ type: 'separator' }, { role: 'front' }]
          : [{ role: 'close' }]),
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function debounce(fn, ms) {
  let timer = null;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn(...args);
    }, ms);
  };
}

function clampBoundsToDisplay(bounds) {
  const display = screen.getDisplayMatching(bounds);
  const area = display.workArea;
  const width = Math.min(
    Math.max(bounds.width, MIN_WINDOW_WIDTH),
    Math.max(MIN_WINDOW_WIDTH, area.width),
  );
  const height = Math.min(
    Math.max(bounds.height, MIN_WINDOW_HEIGHT),
    Math.max(MIN_WINDOW_HEIGHT, area.height),
  );
  const maxX = area.x + Math.max(0, area.width - width);
  const maxY = area.y + Math.max(0, area.height - height);
  const x = Math.min(Math.max(bounds.x, area.x), maxX);
  const y = Math.min(Math.max(bounds.y, area.y), maxY);
  return { x, y, width, height };
}

function persistWindowState(win) {
  if (!win || win.isDestroyed()) return;
  const maximized = win.isMaximized();
  if (win.isMinimized()) {
    setWindowState({ maximized });
    return;
  }
  if (maximized || win.isFullScreen()) {
    setWindowState({ maximized: true });
    return;
  }
  setWindowState({ bounds: win.getBounds(), maximized: false });
}

const persistWindowStateSoon = debounce(persistWindowState, 250);

function applyZoom(win, scale) {
  if (!win || win.isDestroyed()) return;
  try {
    win.webContents.setZoomFactor(scale / 100);
  } catch (err) {
    console.error('[aso] setZoomFactor failed:', err?.message || err);
  }
}

function applyAppearanceToWindow(win, appearance, { resize = false } = {}) {
  if (!win || win.isDestroyed()) return;
  if (resize) {
    try {
      if (win.isMaximized()) win.unmaximize();
      const current = win.getBounds();
      const next = clampBoundsToDisplay({
        x: current.x,
        y: current.y,
        width: appearance.width,
        height: appearance.height,
      });
      win.setBounds(next);
      persistWindowState(win);
    } catch (err) {
      console.error('[aso] setBounds failed:', err?.message || err);
    }
  }
  applyZoom(win, appearance.scale);
}

function applySavedScale(scale) {
  const appearance = setWindowAppearance({ scale });
  applyAppearanceToWindow(getMainWindow(), appearance);
}

function stepSavedScale(direction) {
  const current = getWindowAppearance().scale;
  const ids = WINDOW_SCALES.map((option) => option.id);
  const index = ids.indexOf(current);
  const nextIndex = Math.max(
    0,
    Math.min(ids.length - 1, (index === -1 ? ids.indexOf(100) : index) + direction),
  );
  applySavedScale(ids[nextIndex]);
}

function createWindow() {
  const appearance = getWindowAppearance();
  const hasPosition =
    Number.isFinite(appearance.x) && Number.isFinite(appearance.y);
  const bounds = clampBoundsToDisplay({
    x: hasPosition ? appearance.x : 0,
    y: hasPosition ? appearance.y : 0,
    width: appearance.width,
    height: appearance.height,
  });
  const icon = getAppIconImage();
  const win = new BrowserWindow({
    width: bounds.width,
    height: bounds.height,
    minWidth: MIN_WINDOW_WIDTH,
    minHeight: MIN_WINDOW_HEIGHT,
    ...(hasPosition ? { x: bounds.x, y: bounds.y } : {}),
    title: 'ASO',
    backgroundColor: '#121314',
    ...(icon ? { icon } : {}),
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      zoomFactor: appearance.scale / 100,
    },
  });

  if (!hasPosition) win.center();
  else win.setBounds(bounds);

  win.on('resize', () => persistWindowStateSoon(win));
  win.on('move', () => persistWindowStateSoon(win));
  win.on('maximize', () => persistWindowState(win));
  win.on('unmaximize', () => persistWindowState(win));
  win.on('close', () => persistWindowState(win));

  if (appearance.maximized) {
    win.once('ready-to-show', () => {
      if (!win.isDestroyed()) win.maximize();
    });
  }

  const reveal = () => {
    if (win.isDestroyed() || win.isVisible()) return;
    applyZoom(win, appearance.scale);
    win.show();
    win.focus();
  };

  win.once('ready-to-show', reveal);
  setTimeout(reveal, 4000);

  win.webContents.on('did-fail-load', (_e, code, desc, url) => {
    console.error('[aso] did-fail-load', code, desc, url);
    reveal();
  });

  if (isDev) {
    win.loadURL('http://127.0.0.1:5174').catch((err) => {
      console.error('[aso] loadURL failed:', err?.message || err);
      reveal();
    });
  } else {
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }
}

function applyDockIcon() {
  if (process.platform !== 'darwin' || !app.dock) return;
  const image = getAppIconImage();
  if (image) app.dock.setIcon(image);
}

if (isMac) {
  app.setName('ASO');
}

app.setAboutPanelOptions({
  applicationName: 'ASO',
  applicationVersion: app.getVersion(),
  copyright: 'Copyright © Nikos',
});

app.whenReady().then(() => {
  applyDockIcon();
  buildApplicationMenu();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  persistWindowState(getMainWindow());
});

ipcMain.handle('app:getVersion', () => app.getVersion());

ipcMain.handle('window:getAppearance', () => {
  return { ok: true, ...getWindowAppearance() };
});

ipcMain.handle('library:get', () => {
  return { ok: true, library: getLibrary() };
});

ipcMain.handle('library:set', (_event, payload) => {
  return { ok: true, library: setLibrary(payload) };
});

ipcMain.handle('install:get', () => {
  return { ok: true, scan: getInstallScan() };
});

ipcMain.handle('install:scan', () => {
  const scan = scanInstalled();
  return { ok: true, scan: setInstallScan(scan) };
});

ipcMain.handle('window:setAppearance', (event, payload) => {
  const appearance = setWindowAppearance({
    resolution: payload?.resolution,
    scale: payload?.scale,
  });
  const senderWin = BrowserWindow.fromWebContents(event.sender);
  const win =
    senderWin ||
    BrowserWindow.getFocusedWindow() ||
    BrowserWindow.getAllWindows()[0] ||
    null;
  applyAppearanceToWindow(win, appearance, {
    resize: Boolean(payload?.resolution) && payload.resolution !== 'custom',
  });
  return { ok: true, ...appearance };
});
