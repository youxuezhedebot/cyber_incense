import { app } from "electron";
import { registerIncenseIpc } from "./ipc.js";
import { loadState } from "./localStore.js";
import { createAppTray } from "./tray.js";
import { createRitualWindow, markAppQuitting, showRitualWindow } from "./window.js";

const gotSingleInstanceLock = app.requestSingleInstanceLock();

if (!gotSingleInstanceLock) {
  app.quit();
} else {
  app.setName("Cyber Incense");

  app.on("second-instance", () => {
    showRitualWindow();
  });

  app.on("before-quit", () => {
    markAppQuitting();
  });

  app.on("window-all-closed", () => {
    // Tray-first app: closing the ritual window should leave the process alive.
  });

  void app.whenReady().then(async () => {
    registerIncenseIpc();
    await loadState();
    createRitualWindow();
    createAppTray();
  });

  app.on("activate", () => {
    showRitualWindow();
  });
}
