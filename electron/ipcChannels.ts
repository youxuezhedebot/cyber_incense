export const IPC_CHANNELS = {
  getState: "incense:getState",
  getWindowSettings: "incense:getWindowSettings",
  offerIncense: "incense:offerIncense",
  knockMuyu: "incense:knockMuyu",
  updateSettings: "incense:updateSettings",
  updateWindowSettings: "incense:updateWindowSettings",
  updateVisualSettings: "incense:updateVisualSettings",
  openSettings: "incense:openSettings",
  resetToday: "incense:resetToday",
  resetAll: "incense:resetAll",
  exportState: "incense:exportState",
  stateChanged: "incense:stateChanged"
} as const;
