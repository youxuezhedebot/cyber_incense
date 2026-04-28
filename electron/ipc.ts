import { BrowserWindow, ipcMain } from "electron";
import type {
  IncenseActionResult,
  IncenseState,
  SettingsUpdate,
  VisualSettingsUpdate,
  WindowSettingsUpdate,
  WoodenFishActionResult
} from "../src/types/incense.js";
import type { Vec2 } from "../src/types/ritualSimulation.js";
import { IPC_CHANNELS } from "./ipcChannels.js";
import {
  exportState,
  getWindowSettings,
  knockMuyu,
  loadState,
  offerIncense,
  resetAll,
  resetToday,
  updateSettings,
  updateVisualSettings,
  updateWindowSettings
} from "./localStore.js";
import { applyRitualAlwaysOnTop, showSettingsWindow } from "./window.js";

export function registerIncenseIpc(): void {
  ipcMain.handle(IPC_CHANNELS.getState, async () => loadState());
  ipcMain.handle(IPC_CHANNELS.getWindowSettings, async () => getWindowSettings());

  ipcMain.handle(IPC_CHANNELS.offerIncense, async () => {
    const result = await offerIncenseAndBroadcast();
    return result;
  });

  ipcMain.handle(IPC_CHANNELS.knockMuyu, async (_event, point?: Vec2) => {
    const result = await knockMuyuAndBroadcast(point);
    return result;
  });

  ipcMain.handle(IPC_CHANNELS.updateSettings, async (_event, update: SettingsUpdate) => {
    const state = await updateSettingsAndBroadcast(update);
    return state;
  });

  ipcMain.handle(IPC_CHANNELS.updateWindowSettings, async (_event, update: WindowSettingsUpdate) => {
    const state = await updateWindowSettingsAndBroadcast(update);
    return state;
  });

  ipcMain.handle(IPC_CHANNELS.updateVisualSettings, async (_event, update: VisualSettingsUpdate) => {
    const state = await updateVisualSettingsAndBroadcast(update);
    return state;
  });

  ipcMain.handle(IPC_CHANNELS.openSettings, async () => {
    showSettingsWindow();
  });

  ipcMain.handle(IPC_CHANNELS.resetToday, async () => {
    const state = await resetTodayAndBroadcast();
    return state;
  });

  ipcMain.handle(IPC_CHANNELS.resetAll, async () => {
    const state = await resetAllAndBroadcast();
    return state;
  });

  ipcMain.handle(IPC_CHANNELS.exportState, async () => exportState());
}

export async function offerIncenseAndBroadcast(): Promise<IncenseActionResult> {
  const result = await offerIncense();
  broadcastState(result.state);
  return result;
}

export async function knockMuyuAndBroadcast(point?: Vec2): Promise<WoodenFishActionResult> {
  const result = await knockMuyu(point);
  broadcastState(result.state);
  return result;
}

async function updateSettingsAndBroadcast(update: SettingsUpdate): Promise<IncenseState> {
  const state = await updateSettings(update);
  broadcastState(state);
  return state;
}

async function updateWindowSettingsAndBroadcast(update: WindowSettingsUpdate): Promise<IncenseState> {
  const state = await updateWindowSettings(update);
  applyRitualAlwaysOnTop(state.window.alwaysOnTop);
  broadcastState(state);
  return state;
}

async function updateVisualSettingsAndBroadcast(update: VisualSettingsUpdate): Promise<IncenseState> {
  const state = await updateVisualSettings(update);
  broadcastState(state);
  return state;
}

async function resetTodayAndBroadcast(): Promise<IncenseState> {
  const state = await resetToday();
  broadcastState(state);
  return state;
}

async function resetAllAndBroadcast(): Promise<IncenseState> {
  const state = await resetAll();
  applyRitualAlwaysOnTop(state.window.alwaysOnTop);
  broadcastState(state);
  return state;
}

export function broadcastState(state: IncenseState): void {
  for (const window of BrowserWindow.getAllWindows()) {
    if (!window.isDestroyed()) {
      window.webContents.send(IPC_CHANNELS.stateChanged, state);
    }
  }
}
