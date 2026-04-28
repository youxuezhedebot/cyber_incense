import { contextBridge, ipcRenderer } from "electron";
import type { CyberIncenseAPI, IncenseState } from "../src/types/incense.js";
import { IPC_CHANNELS } from "./ipcChannels.js";

const api: CyberIncenseAPI = {
  getState: () => ipcRenderer.invoke(IPC_CHANNELS.getState),
  getWindowSettings: () => ipcRenderer.invoke(IPC_CHANNELS.getWindowSettings),
  offerIncense: () => ipcRenderer.invoke(IPC_CHANNELS.offerIncense),
  knockMuyu: (point) => ipcRenderer.invoke(IPC_CHANNELS.knockMuyu, point),
  updateSettings: (update) => ipcRenderer.invoke(IPC_CHANNELS.updateSettings, update),
  updateWindowSettings: (update) => ipcRenderer.invoke(IPC_CHANNELS.updateWindowSettings, update),
  updateVisualSettings: (update) => ipcRenderer.invoke(IPC_CHANNELS.updateVisualSettings, update),
  openSettings: () => ipcRenderer.invoke(IPC_CHANNELS.openSettings),
  resetToday: () => ipcRenderer.invoke(IPC_CHANNELS.resetToday),
  resetAll: () => ipcRenderer.invoke(IPC_CHANNELS.resetAll),
  exportState: () => ipcRenderer.invoke(IPC_CHANNELS.exportState),
  onStateChanged: (callback: (state: IncenseState) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, state: IncenseState) => callback(state);
    ipcRenderer.on(IPC_CHANNELS.stateChanged, listener);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.stateChanged, listener);
  }
};

contextBridge.exposeInMainWorld("cyberIncense", api);
