import { Menu, Tray, app, nativeImage } from "electron";
import path from "node:path";
import { broadcastState, knockMuyuAndBroadcast, offerIncenseAndBroadcast } from "./ipc.js";
import { loadState, updateWindowSettings } from "./localStore.js";
import { applyRitualAlwaysOnTop, markAppQuitting, showRitualWindow, showSettingsWindow, toggleRitualWindow } from "./window.js";

let tray: Tray | null = null;
let trayPulseTimer: NodeJS.Timeout | null = null;

export function createAppTray(): Tray {
  if (tray) return tray;

  tray = new Tray(createTrayImage(false));
  tray.setToolTip("Cyber Incense");
  tray.setContextMenu(createTrayMenu());
  tray.on("click", () => toggleRitualWindow(tray?.getBounds()));
  tray.on("right-click", () => tray?.popUpContextMenu());

  return tray;
}

function createTrayMenu(): Menu {
  return Menu.buildFromTemplate([
    { label: "Cyber Incense", enabled: false },
    { type: "separator" },
    {
      label: "打开 / 隐藏",
      click: () => toggleRitualWindow(tray?.getBounds())
    },
    {
      label: "上香",
      click: () => {
        void offerFromTray();
      }
    },
    {
      label: "敲木鱼",
      click: () => {
        void knockMuyuFromTray();
      }
    },
    {
      label: "设置",
      click: () => showSettingsWindow()
    },
    {
      label: "固定在最前面 / 取消",
      click: () => {
        void toggleAlwaysOnTopFromTray();
      }
    },
    { type: "separator" },
    {
      label: "Quit",
      accelerator: "CommandOrControl+Q",
      click: () => {
        markAppQuitting();
        app.quit();
      }
    }
  ]);
}

async function offerFromTray(): Promise<void> {
  const state = await updateWindowSettings({ activeObject: "incense" });
  broadcastState(state);
  await offerIncenseAndBroadcast();
  pulseTrayIcon();
  showRitualWindow(tray?.getBounds());
}

async function knockMuyuFromTray(): Promise<void> {
  const state = await updateWindowSettings({ activeObject: "muyu" });
  broadcastState(state);
  await knockMuyuAndBroadcast();
  pulseTrayIcon();
  showRitualWindow(tray?.getBounds());
}

async function toggleAlwaysOnTopFromTray(): Promise<void> {
  const previous = await loadState();
  const state = await updateWindowSettings({ alwaysOnTop: !previous.window.alwaysOnTop });
  applyRitualAlwaysOnTop(state.window.alwaysOnTop);
  broadcastState(state);
}

function pulseTrayIcon(): void {
  if (!tray) return;
  tray.setImage(createTrayImage(true));

  if (trayPulseTimer) clearTimeout(trayPulseTimer);
  trayPulseTimer = setTimeout(() => {
    tray?.setImage(createTrayImage(false));
  }, 900);
}

function createTrayImage(lit: boolean): Electron.NativeImage {
  const fileName = lit ? "tray-icon-lit.png" : "tray-icon.png";
  const imagePath = path.join(app.getAppPath(), "assets", fileName);
  const image = nativeImage.createFromPath(imagePath).resize({ width: 18, height: 18 });

  if (!image.isEmpty()) {
    return image;
  }

  return nativeImage.createFromDataURL(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII="
  );
}
