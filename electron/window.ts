import { BrowserWindow, app, screen, type Rectangle } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadState, updateRitualSurfacePosition } from "./localStore.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let ritualWindow: BrowserWindow | null = null;
let settingsWindow: BrowserWindow | null = null;
let isQuitting = false;
let positionSaveTimer: NodeJS.Timeout | null = null;
let hasStoredRitualPosition = false;

export function createRitualWindow(): BrowserWindow {
  if (ritualWindow && !ritualWindow.isDestroyed()) {
    return ritualWindow;
  }

  ritualWindow = new BrowserWindow({
    width: 340,
    height: 360,
    minWidth: 260,
    minHeight: 260,
    show: false,
    resizable: false,
    fullscreenable: false,
    frame: false,
    hasShadow: false,
    transparent: true,
    title: "Cyber Incense Ritual",
    backgroundColor: "#00000000",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  void loadState().then((state) => {
    hasStoredRitualPosition =
      state.window.ritualSurfacePosition.x !== null && state.window.ritualSurfacePosition.y !== null;
    applyRitualAlwaysOnTop(state.window.alwaysOnTop);
    restoreRitualPosition(state.window.ritualSurfacePosition);
  });

  ritualWindow.on("close", (event) => {
    if (!isQuitting) {
      event.preventDefault();
      ritualWindow?.hide();
    }
  });

  ritualWindow.on("closed", () => {
    ritualWindow = null;
  });

  ritualWindow.on("moved", scheduleRitualPositionSave);

  void loadRenderer(ritualWindow, "ritual");
  return ritualWindow;
}

export function createSettingsWindow(): BrowserWindow {
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    return settingsWindow;
  }

  settingsWindow = new BrowserWindow({
    width: 430,
    height: 620,
    minWidth: 380,
    minHeight: 520,
    show: false,
    resizable: true,
    fullscreenable: false,
    title: "Cyber Incense Settings",
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
    backgroundColor: "#10100f",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  settingsWindow.on("close", (event) => {
    if (!isQuitting) {
      event.preventDefault();
      settingsWindow?.hide();
    }
  });

  settingsWindow.on("closed", () => {
    settingsWindow = null;
  });

  void loadRenderer(settingsWindow, "settings");
  return settingsWindow;
}

export function showRitualWindow(trayBounds?: Rectangle): void {
  const window = createRitualWindow();
  if (!hasSavedRitualPosition()) {
    positionWindow(window, trayBounds);
  }
  window.show();
  window.focus();
}

export function toggleRitualWindow(trayBounds?: Rectangle): void {
  const window = createRitualWindow();
  if (window.isVisible()) {
    window.hide();
    return;
  }

  showRitualWindow(trayBounds);
}

export function showSettingsWindow(): void {
  const window = createSettingsWindow();
  window.show();
  window.focus();
}

export function applyRitualAlwaysOnTop(alwaysOnTop: boolean): void {
  if (!ritualWindow || ritualWindow.isDestroyed()) return;
  ritualWindow.setAlwaysOnTop(alwaysOnTop, alwaysOnTop ? "floating" : "normal");
  ritualWindow.setVisibleOnAllWorkspaces(alwaysOnTop, { visibleOnFullScreen: false });
}

export function markAppQuitting(): void {
  isQuitting = true;
}

async function loadRenderer(window: BrowserWindow, view: "ritual" | "settings"): Promise<void> {
  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  if (devServerUrl) {
    await window.loadURL(`${devServerUrl}?view=${view}`);
    return;
  }

  await window.loadFile(path.join(app.getAppPath(), "dist", "index.html"), {
    query: { view }
  });
}

function positionWindow(window: BrowserWindow, trayBounds?: Rectangle): void {
  if (!trayBounds) return;

  const display = screen.getDisplayNearestPoint({
    x: Math.round(trayBounds.x),
    y: Math.round(trayBounds.y)
  });
  const workArea = display.workArea;
  const [width, height] = window.getSize();
  const desiredX = Math.round(trayBounds.x + trayBounds.width / 2 - width / 2);
  const desiredY =
    trayBounds.y < workArea.y + workArea.height / 2
      ? Math.round(trayBounds.y + trayBounds.height + 8)
      : Math.round(trayBounds.y - height - 8);

  const x = clamp(desiredX, workArea.x, workArea.x + workArea.width - width);
  const y = clamp(desiredY, workArea.y, workArea.y + workArea.height - height);
  window.setPosition(x, y, false);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function restoreRitualPosition(position: { x: number | null; y: number | null }): void {
  if (!ritualWindow || position.x === null || position.y === null) return;
  const display = screen.getDisplayNearestPoint({ x: position.x, y: position.y });
  const workArea = display.workArea;
  const [width, height] = ritualWindow.getSize();
  const x = clamp(position.x, workArea.x, workArea.x + workArea.width - width);
  const y = clamp(position.y, workArea.y, workArea.y + workArea.height - height);
  ritualWindow.setPosition(x, y, false);
}

function hasSavedRitualPosition(): boolean {
  return hasStoredRitualPosition;
}

function scheduleRitualPositionSave(): void {
  if (!ritualWindow || ritualWindow.isDestroyed()) return;
  if (positionSaveTimer) clearTimeout(positionSaveTimer);

  positionSaveTimer = setTimeout(() => {
    if (!ritualWindow || ritualWindow.isDestroyed()) return;
    const [x, y] = ritualWindow.getPosition();
    hasStoredRitualPosition = true;
    void updateRitualSurfacePosition(x, y);
  }, 350);
}
