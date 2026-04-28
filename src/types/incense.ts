import type { RitualSaveData, Vec2 } from "./ritualSimulation.js";

export type BlessingLevel = "初燃" | "稳定" | "香火渐盛" | "香火鼎盛" | "功德圆满";

export type CodexHookState = {
  enabled: false;
  installedAt: string | null;
  lastCheckedAt: string | null;
};

export type IncenseSettings = {
  soundEnabled: boolean;
  launchAtLogin: boolean;
  theme: "dark";
  compactMode: boolean;
};

export type RitualObjectKind = "incense" | "muyu";

export type RitualWindowSettings = {
  alwaysOnTop: boolean;
  activeObject: RitualObjectKind;
  ritualSurfacePosition: {
    x: number | null;
    y: number | null;
  };
};

export type RitualVisualSettings = {
  incenseBurnDurationMs: number;
  muyuTraceDecayMs: number;
  maxActiveIncense: number;
  maxVisibleAshMarks: number;
  maxVisibleMuyuMarks: number;
};

export type IncenseState = {
  version: 1;
  today: string;
  todayPrayerCount: number;
  totalPrayerCount: number;
  muyuCount: number;
  lastPrayerAt: string | null;
  lastMuyuAt: string | null;
  blessingLevel: BlessingLevel;
  codexHook: CodexHookState;
  settings: IncenseSettings;
  window: RitualWindowSettings;
  visuals: RitualVisualSettings;
  ritual: RitualSaveData;
};

export type IncenseActionResult = {
  state: IncenseState;
  blessing: string;
};

export type WoodenFishActionResult = {
  state: IncenseState;
  message: string;
  meritDelta: number;
};

export type SettingsUpdate = Partial<Pick<IncenseSettings, "soundEnabled" | "compactMode">>;

export type WindowSettingsUpdate = Partial<Pick<RitualWindowSettings, "alwaysOnTop" | "activeObject">>;

export type VisualSettingsUpdate = Partial<Pick<RitualVisualSettings, "incenseBurnDurationMs" | "muyuTraceDecayMs">>;

export type ExportStateResult = {
  json: string;
  exportedAt: string;
};

export type IncenseVisualCycle = {
  id: string;
  startedAt: string;
  phase: "spawning" | "igniting" | "placing" | "burning" | "ashing" | "complete";
  burnEndsAt: string;
};

export type IncenseVisualSummary = {
  activeSticks: number;
  visibleAshMarks: number;
  overflowAshCount: number;
  ashIntensity: number;
};

export type MuyuVisualSummary = {
  visibleMarks: number;
  overflowKnockCount: number;
  resonanceLevel: number;
};

export type CyberIncenseAPI = {
  getState: () => Promise<IncenseState>;
  getWindowSettings: () => Promise<RitualWindowSettings>;
  offerIncense: () => Promise<IncenseActionResult>;
  knockMuyu: (point?: Vec2) => Promise<WoodenFishActionResult>;
  updateSettings: (update: SettingsUpdate) => Promise<IncenseState>;
  updateWindowSettings: (update: WindowSettingsUpdate) => Promise<IncenseState>;
  updateVisualSettings: (update: VisualSettingsUpdate) => Promise<IncenseState>;
  openSettings: () => Promise<void>;
  resetToday: () => Promise<IncenseState>;
  resetAll: () => Promise<IncenseState>;
  exportState: () => Promise<ExportStateResult>;
  onStateChanged: (callback: (state: IncenseState) => void) => () => void;
};
