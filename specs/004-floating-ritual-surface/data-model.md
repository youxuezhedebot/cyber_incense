# Data Model: Floating Ritual Surface

## IncenseState Extensions

Spec 004 extends the state introduced by earlier specs. Existing counters remain the durable source of truth.

```ts
type IncenseState = {
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
};
```

## RitualWindowSettings

```ts
type RitualWindowSettings = {
  alwaysOnTop: boolean;
  ritualSurfacePosition: {
    x: number | null;
    y: number | null;
  };
};
```

### Rules

- `alwaysOnTop` defaults to `false`.
- `ritualSurfacePosition` is optional and best-effort.
- Missing fields from Spec 001/002 are filled from defaults.
- Toggling `alwaysOnTop` must not reset ritual counters.

## RitualVisualSettings

```ts
type RitualVisualSettings = {
  incenseBurnDurationMs: number;
  maxActiveIncense: number;
  maxVisibleAshMarks: number;
  maxVisibleMuyuMarks: number;
};
```

### Rules

- Burn duration should default to a short toy-friendly value, such as 8000-15000 ms.
- Counts remain valid even if visual caps are lower than actual count.
- Unknown or invalid visual settings normalize to defaults.

## IncenseVisualCycle

Runtime renderer representation of a newly offered incense stick.

```ts
type IncenseVisualCycle = {
  id: string;
  startedAt: string;
  phase: "spawning" | "igniting" | "placing" | "burning" | "ashing" | "complete";
  burnEndsAt: string;
};
```

### Rules

- Created after a successful `offerIncense`.
- Not required to persist one object per offering.
- When complete, it contributes to the rendered ash/completed-offering representation.
- If the app restarts mid-cycle, the renderer may settle that cycle into completed visual state based on persisted counts.

## IncenseVisualSummary

Derived visual representation for today's incense count.

```ts
type IncenseVisualSummary = {
  activeSticks: number;
  visibleAshMarks: number;
  overflowAshCount: number;
  ashIntensity: number;
};
```

### Rules

- `activeSticks` is capped by `maxActiveIncense`.
- `visibleAshMarks` is capped by `maxVisibleAshMarks`.
- `overflowAshCount` preserves the hidden remainder for secondary display/tooltips.
- `ashIntensity` is normalized between `0` and `1`.

## MuyuVisualSummary

Derived visual representation for wooden fish count.

```ts
type MuyuVisualSummary = {
  visibleMarks: number;
  overflowKnockCount: number;
  resonanceLevel: number;
};
```

### Rules

- Uses `muyuCount` as source of truth.
- Visual marks are capped by `maxVisibleMuyuMarks`.
- `resonanceLevel` is normalized between `0` and `1`.
- Visual style must not reuse incense ash/stick graphics.

## Settings Update

Spec 004 expands settings updates:

```ts
type WindowSettingsUpdate = {
  alwaysOnTop?: boolean;
};
```

### Rules

- Unsupported keys are ignored.
- Updates persist immediately.
- If the ritual surface exists, updates apply immediately to the existing window.
- Codex hook state remains disabled/unchanged by this feature.
