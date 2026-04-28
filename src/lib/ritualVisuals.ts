import type { IncenseState, IncenseVisualSummary, MuyuVisualSummary } from "../types/incense.js";

export function getIncenseVisualSummary(state: IncenseState | null): IncenseVisualSummary {
  const count = state?.todayPrayerCount ?? 0;
  const maxVisibleAshMarks = state?.visuals.maxVisibleAshMarks ?? 18;
  const activeSticks = 0;
  const visibleAshMarks = Math.min(maxVisibleAshMarks, Math.max(0, count));
  const overflowAshCount = Math.max(0, count - visibleAshMarks);
  const ashIntensity = Math.min(1, count / 30);

  return {
    activeSticks,
    visibleAshMarks,
    overflowAshCount,
    ashIntensity
  };
}

export function getMuyuVisualSummary(state: IncenseState | null): MuyuVisualSummary {
  const count = state?.muyuCount ?? 0;
  const maxVisibleMuyuMarks = state?.visuals.maxVisibleMuyuMarks ?? 16;
  const visibleMarks = Math.min(maxVisibleMuyuMarks, count);
  const overflowKnockCount = Math.max(0, count - visibleMarks);
  const resonanceLevel = Math.min(1, count / 36);

  return {
    visibleMarks,
    overflowKnockCount,
    resonanceLevel
  };
}

export function createVisualCycleId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
