const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
  takeScreenshot: async () => {
    return await ipcInvoke("take-screenshot");
  },

  getActiveWindow: async () => {
    return await ipcInvoke("get-active-window");
  },
  getBounds: () => ipcInvoke("get-bounds"),
  resizeWindow: async (width: number, height: number) => {
    return await ipcInvoke("resize-window", { width, height });
  },
  on: (channel: any, func: (...args: unknown[]) => void) => {
    const subscription = (_event: Electron.IpcRendererEvent, ...args: unknown[]) => func(...args);
    electron.ipcRenderer.on(channel, subscription);

    return () => {
      electron.ipcRenderer.removeListener(channel, subscription);
    };
  },
  startUpdate: () => ipcInvoke("start-update"),
  quitAndInstall: () => ipcInvoke("quit-and-install"),
} satisfies Window["electron"]);

const ipcInvoke = <Key extends keyof EventPayloadMapping>(key: Key, payload?: any): EventPayloadMapping[Key] =>
  electron.ipcRenderer.invoke(key, payload);
