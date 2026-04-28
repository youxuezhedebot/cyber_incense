import { promises as fs } from "node:fs";
import path from "node:path";
import { pickIncenseBlessing, pickMuyuMessage } from "../src/lib/blessings.js";
import { deriveBlessingLevel } from "../src/lib/levels.js";
import { createIncenseHistoryEvent, createMuyuTraceHistoryEvent, normalizeRitualSaveData, truncateRitualSaveData } from "../src/lib/ritualEngine.js";
import type {
  ExportStateResult,
  IncenseActionResult,
  IncenseState,
  RitualWindowSettings,
  SettingsUpdate,
  VisualSettingsUpdate,
  WindowSettingsUpdate,
  WoodenFishActionResult
} from "../src/types/incense.js";
import type { Vec2 } from "../src/types/ritualSimulation.js";
import { getStateDir, getStatePath } from "./paths.js";

const STATE_VERSION = 1;
const DEFAULT_INCENSE_BURN_DURATION_MS = 90_000;
const DEFAULT_MUYU_TRACE_DECAY_MS = 120_000;
const LEGACY_INCENSE_BURN_DURATION_MS = 10_000;

type AnyRecord = Record<string, unknown>;

let stateQueue: Promise<unknown> = Promise.resolve();

export function getLocalDay(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function createDefaultState(date = new Date()): IncenseState {
  return {
    version: STATE_VERSION,
    today: getLocalDay(date),
    todayPrayerCount: 0,
    totalPrayerCount: 0,
    muyuCount: 0,
    lastPrayerAt: null,
    lastMuyuAt: null,
    blessingLevel: "初燃",
    codexHook: {
      enabled: false,
      installedAt: null,
      lastCheckedAt: null
    },
    settings: {
      soundEnabled: false,
      launchAtLogin: false,
      theme: "dark",
      compactMode: false
    },
    window: {
      alwaysOnTop: false,
      activeObject: "incense",
      ritualSurfacePosition: {
        x: null,
        y: null
      }
    },
    visuals: {
      incenseBurnDurationMs: DEFAULT_INCENSE_BURN_DURATION_MS,
      muyuTraceDecayMs: DEFAULT_MUYU_TRACE_DECAY_MS,
      maxActiveIncense: 3,
      maxVisibleAshMarks: 18,
      maxVisibleMuyuMarks: 16
    },
    ritual: {
      totalOffered: 0,
      incenseHistory: [],
      muyuHitCount: 0,
      muyuTraceHistory: []
    }
  };
}

export async function loadState(): Promise<IncenseState> {
  const fallback = createDefaultState();
  const raw = await readStateFile();

  if (raw === null) {
    await persistState(fallback);
    return fallback;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    const normalized = normalizeState(parsed);
    if (JSON.stringify(parsed) !== JSON.stringify(normalized)) {
      await persistState(normalized);
    }
    return normalized;
  } catch (error) {
    await backupCorruptedState(raw);
    await persistState(fallback);
    return fallback;
  }
}

export async function offerIncense(): Promise<IncenseActionResult> {
  return enqueueStateMutation(async () => {
    const previous = await loadState();
    const offeredAt = new Date().toISOString();
    const offeredAtMs = Date.now();
    const todayPrayerCount = previous.todayPrayerCount + 1;
    const totalPrayerCount = previous.totalPrayerCount + 1;
    const ritual = truncateRitualSaveData({
      ...previous.ritual,
      totalOffered: todayPrayerCount,
      incenseHistory: [
        ...previous.ritual.incenseHistory,
        createIncenseHistoryEvent(previous.todayPrayerCount, offeredAtMs, previous.ritual.incenseHistory)
      ]
    });
    const state: IncenseState = {
      ...previous,
      today: getLocalDay(),
      todayPrayerCount,
      totalPrayerCount,
      lastPrayerAt: offeredAt,
      blessingLevel: deriveBlessingLevel(todayPrayerCount),
      ritual,
      codexHook: {
        enabled: false,
        installedAt: null,
        lastCheckedAt: null
      }
    };

    await persistState(state);

    return {
      state,
      blessing: pickIncenseBlessing(state)
    };
  });
}

export async function knockMuyu(point?: Vec2): Promise<WoodenFishActionResult> {
  return enqueueStateMutation(async () => {
    const previous = await loadState();
    const hitAtMs = Date.now();
    const muyuCount = previous.muyuCount + 1;
    const ritual = truncateRitualSaveData({
      ...previous.ritual,
      muyuHitCount: muyuCount,
      muyuTraceHistory: [...previous.ritual.muyuTraceHistory, createMuyuTraceHistoryEvent(point, previous.muyuCount, hitAtMs)]
    });
    const state: IncenseState = {
      ...previous,
      muyuCount,
      lastMuyuAt: new Date().toISOString(),
      ritual,
      codexHook: {
        enabled: false,
        installedAt: null,
        lastCheckedAt: null
      }
    };

    await persistState(state);

    return {
      state,
      message: pickMuyuMessage(state),
      meritDelta: 1
    };
  });
}

export async function updateSettings(update: SettingsUpdate): Promise<IncenseState> {
  return enqueueStateMutation(async () => {
    const previous = await loadState();
    const patch = isRecord(update) ? update : {};
    const state: IncenseState = {
      ...previous,
      settings: {
        ...previous.settings,
        soundEnabled:
          typeof patch.soundEnabled === "boolean" ? patch.soundEnabled : previous.settings.soundEnabled,
        compactMode: typeof patch.compactMode === "boolean" ? patch.compactMode : previous.settings.compactMode,
        theme: "dark",
        launchAtLogin: false
      },
      codexHook: {
        enabled: false,
        installedAt: null,
        lastCheckedAt: null
      }
    };

    await persistState(state);
    return state;
  });
}

export async function updateWindowSettings(update: WindowSettingsUpdate): Promise<IncenseState> {
  return enqueueStateMutation(async () => {
    const previous = await loadState();
    const patch = isRecord(update) ? update : {};
    const state: IncenseState = {
      ...previous,
      window: {
        ...previous.window,
        alwaysOnTop:
          typeof patch.alwaysOnTop === "boolean" ? patch.alwaysOnTop : previous.window.alwaysOnTop,
        activeObject: normalizeRitualObjectKind(patch.activeObject, previous.window.activeObject)
      },
      codexHook: {
        enabled: false,
        installedAt: null,
        lastCheckedAt: null
      }
    };

    await persistState(state);
    return state;
  });
}

export async function updateVisualSettings(update: VisualSettingsUpdate): Promise<IncenseState> {
  return enqueueStateMutation(async () => {
    const previous = await loadState();
    const patch = isRecord(update) ? update : {};
    const state: IncenseState = {
      ...previous,
      visuals: {
        ...previous.visuals,
        incenseBurnDurationMs: normalizeBoundedNumber(
          patch.incenseBurnDurationMs,
          previous.visuals.incenseBurnDurationMs,
          30_000,
          600_000
        ),
        muyuTraceDecayMs: normalizeBoundedNumber(
          patch.muyuTraceDecayMs,
          previous.visuals.muyuTraceDecayMs,
          15_000,
          300_000
        )
      },
      codexHook: {
        enabled: false,
        installedAt: null,
        lastCheckedAt: null
      }
    };

    await persistState(state);
    return state;
  });
}

export async function updateRitualSurfacePosition(x: number, y: number): Promise<IncenseState> {
  return enqueueStateMutation(async () => {
    const previous = await loadState();
    const state: IncenseState = {
      ...previous,
      window: {
        ...previous.window,
        ritualSurfacePosition: {
          x: Math.round(x),
          y: Math.round(y)
        }
      }
    };

    await persistState(state);
    return state;
  });
}

export async function resetToday(): Promise<IncenseState> {
  return enqueueStateMutation(async () => {
    const previous = await loadState();
    const state: IncenseState = {
      ...previous,
      today: getLocalDay(),
      todayPrayerCount: 0,
      lastPrayerAt: null,
      blessingLevel: deriveBlessingLevel(0),
      ritual: {
        ...previous.ritual,
        totalOffered: 0,
        incenseHistory: []
      },
      codexHook: {
        enabled: false,
        installedAt: null,
        lastCheckedAt: null
      }
    };

    await persistState(state);
    return state;
  });
}

export async function resetAll(): Promise<IncenseState> {
  return enqueueStateMutation(async () => {
    const state = createDefaultState();
    await persistState(state);
    return state;
  });
}

export async function exportState(): Promise<ExportStateResult> {
  const state = await loadState();
  return {
    json: `${JSON.stringify(state, null, 2)}\n`,
    exportedAt: new Date().toISOString()
  };
}

export function normalizeState(input: unknown, date = new Date()): IncenseState {
  const defaults = createDefaultState(date);
  const source = isRecord(input) ? input : {};
  const today = normalizeDate(source.today, defaults.today);
  const isNewDay = today !== defaults.today;
  const todayPrayerCount = isNewDay ? 0 : normalizeCount(source.todayPrayerCount);
  const totalPrayerCount = normalizeCount(source.totalPrayerCount);
  const muyuCount = normalizeCount(source.muyuCount);
  const settings = isRecord(source.settings) ? source.settings : {};
  const windowSettings = isRecord(source.window) ? source.window : {};
  const ritualSurfacePosition = isRecord(windowSettings.ritualSurfacePosition) ? windowSettings.ritualSurfacePosition : {};
  const visuals = isRecord(source.visuals) ? source.visuals : {};
  const rawRitual = isNewDay
    ? {
        ...(isRecord(source.ritual) ? source.ritual : {}),
        totalOffered: 0,
        incenseHistory: []
      }
    : source.ritual;
  const ritual = normalizeRitualSaveData(rawRitual, { todayPrayerCount, muyuCount });

  return {
    version: STATE_VERSION,
    today: defaults.today,
    todayPrayerCount,
    totalPrayerCount,
    muyuCount,
    lastPrayerAt: normalizeNullableString(source.lastPrayerAt),
    lastMuyuAt: normalizeNullableString(source.lastMuyuAt),
    blessingLevel: deriveBlessingLevel(todayPrayerCount),
    codexHook: {
      enabled: false,
      installedAt: null,
      lastCheckedAt: null
    },
    settings: {
      soundEnabled: normalizeBoolean(settings.soundEnabled, defaults.settings.soundEnabled),
      launchAtLogin: normalizeBoolean(settings.launchAtLogin, defaults.settings.launchAtLogin),
      theme: "dark",
      compactMode: normalizeBoolean(settings.compactMode, defaults.settings.compactMode)
    },
    window: {
      alwaysOnTop: normalizeBoolean(windowSettings.alwaysOnTop, defaults.window.alwaysOnTop),
      activeObject: normalizeRitualObjectKind(windowSettings.activeObject, defaults.window.activeObject),
      ritualSurfacePosition: {
        x: normalizeNullableCoordinate(ritualSurfacePosition.x),
        y: normalizeNullableCoordinate(ritualSurfacePosition.y)
      }
    },
    visuals: {
      incenseBurnDurationMs: normalizeIncenseBurnDuration(
        visuals.incenseBurnDurationMs,
        defaults.visuals.incenseBurnDurationMs
      ),
      muyuTraceDecayMs: normalizeBoundedNumber(
        visuals.muyuTraceDecayMs,
        defaults.visuals.muyuTraceDecayMs,
        15_000,
        300_000
      ),
      maxActiveIncense: normalizeBoundedNumber(visuals.maxActiveIncense, defaults.visuals.maxActiveIncense, 1, 6),
      maxVisibleAshMarks: normalizeBoundedNumber(
        visuals.maxVisibleAshMarks,
        defaults.visuals.maxVisibleAshMarks,
        4,
        40
      ),
      maxVisibleMuyuMarks: normalizeBoundedNumber(
        visuals.maxVisibleMuyuMarks,
        defaults.visuals.maxVisibleMuyuMarks,
        4,
        32
      )
    },
    ritual: {
      ...ritual,
      totalOffered: todayPrayerCount,
      muyuHitCount: muyuCount
    }
  };
}

export async function getWindowSettings(): Promise<RitualWindowSettings> {
  const state = await loadState();
  return state.window;
}

async function readStateFile(): Promise<string | null> {
  try {
    return await fs.readFile(getStatePath(), "utf8");
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code !== "ENOENT") {
      console.warn("[cyber-incense] Falling back to default state:", nodeError.message);
    }
    return null;
  }
}

async function persistState(state: IncenseState): Promise<void> {
  try {
    await fs.mkdir(getStateDir(), { recursive: true });
    const target = getStatePath();
    const temp = `${target}.tmp`;
    await fs.writeFile(temp, `${JSON.stringify(state, null, 2)}\n`, "utf8");
    await fs.rename(temp, target);
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    console.warn("[cyber-incense] Unable to persist local state:", nodeError.message);
  }
}

async function backupCorruptedState(raw: string): Promise<void> {
  try {
    await fs.mkdir(getStateDir(), { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupPath = path.join(getStateDir(), `state.corrupt.${timestamp}.json`);
    await fs.writeFile(backupPath, raw, "utf8");
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    console.warn("[cyber-incense] Unable to back up corrupted state:", nodeError.message);
  }
}

function normalizeDate(value: unknown, fallback: string): string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : fallback;
}

function normalizeCount(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return Math.max(0, Math.floor(value));
}

function normalizeNullableString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function normalizeBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function normalizeRitualObjectKind(value: unknown, fallback: "incense" | "muyu"): "incense" | "muyu" {
  return value === "incense" || value === "muyu" ? value : fallback;
}

function normalizeNullableCoordinate(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return Math.round(value);
}

function normalizeBoundedNumber(value: unknown, fallback: number, min: number, max: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value)));
}

function normalizeIncenseBurnDuration(value: unknown, fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  if (Math.round(value) === LEGACY_INCENSE_BURN_DURATION_MS) return fallback;
  return Math.min(600_000, Math.max(30_000, Math.round(value)));
}

function isRecord(value: unknown): value is AnyRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function enqueueStateMutation<T>(operation: () => Promise<T>): Promise<T> {
  const queued = stateQueue.then(operation, operation);
  stateQueue = queued.catch(() => undefined);
  return queued;
}
