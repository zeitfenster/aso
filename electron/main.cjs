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

const { app, BrowserWindow, ipcMain, Menu, nativeImage } = electron;
const path = require('node:path');
const fs = require('node:fs');
const { getWindowAppearance, setWindowAppearance } = require('./settings.cjs');

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
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
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

function createWindow() {
  const appearance = getWindowAppearance();
  const icon = getAppIconImage();
  const win = new BrowserWindow({
    width: appearance.width,
    height: appearance.height,
    minWidth: 1100,
    minHeight: 700,
    title: 'Audio Software Overview',
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

  win.center();

  const reveal = () => {
    if (win.isDestroyed() || win.isVisible()) return;
    try {
      win.webContents.setZoomFactor(appearance.scale / 100);
    } catch {
      // ignore
    }
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

function applyAppearanceToWindow(win, appearance) {
  if (!win || win.isDestroyed()) return;
  try {
    win.setSize(appearance.width, appearance.height);
    win.center();
  } catch (err) {
    console.error('[aso] setSize failed:', err?.message || err);
  }
  try {
    win.webContents.setZoomFactor(appearance.scale / 100);
  } catch (err) {
    console.error('[aso] setZoomFactor failed:', err?.message || err);
  }
}

function applyDockIcon() {
  if (process.platform !== 'darwin' || !app.dock) return;
  const image = getAppIconImage();
  if (image) app.dock.setIcon(image);
}

if (isMac) {
  app.setName('Audio Software Overview');
}

app.setAboutPanelOptions({
  applicationName: 'Audio Software Overview',
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

ipcMain.handle('app:getVersion', () => app.getVersion());

ipcMain.handle('window:getAppearance', () => {
  return { ok: true, ...getWindowAppearance() };
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
  applyAppearanceToWindow(win, appearance);
  return { ok: true, ...appearance };
});
