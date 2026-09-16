const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('asoApi', {
  platform: process.platform,
  getAppVersion: () => ipcRenderer.invoke('app:getVersion'),
  getWindowAppearance: () => ipcRenderer.invoke('window:getAppearance'),
  setWindowAppearance: (payload) =>
    ipcRenderer.invoke('window:setAppearance', payload),
  onMenuCommand: (callback) => {
    const listener = (_event, payload) => callback(payload);
    ipcRenderer.on('menu:command', listener);
    return () => ipcRenderer.removeListener('menu:command', listener);
  },
});
