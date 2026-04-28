# Data Model: Cyber Incense Interaction Polish

## IncenseState Extensions

Spec 002 uses the state introduced by Spec 001 and actively exposes `muyuCount`, `lastMuyuAt`, and `settings`.

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
};
```

## IncenseSettings

```ts
type IncenseSettings = {
  soundEnabled: boolean;
  launchAtLogin: boolean;
  theme: "dark";
  compactMode: boolean;
};
```

### Rules

- `soundEnabled` defaults to `false`.
- `compactMode` defaults to `false`.
- `launchAtLogin` remains present but may stay disabled/unimplemented in this feature if not surfaced.
- `theme` remains `"dark"`.

## WoodenFishActionResult

```ts
type WoodenFishActionResult = {
  state: IncenseState;
  message: string;
  meritDelta: number;
};
```

### Rules

- `muyuCount` increments by `1`.
- `lastMuyuAt` is set to current timestamp.
- `meritDelta` is `1`.
- The feedback message is short enough for the compact window.

## SettingsUpdate

```ts
type SettingsUpdate = Partial<Pick<IncenseSettings, "soundEnabled" | "compactMode">>;
```

### Rules

- Unknown settings keys are ignored.
- Updates persist immediately.
- Updates do not reset ritual counters.

## ResetTodayResult

```ts
type ResetTodayResult = {
  state: IncenseState;
  resetFields: ["todayPrayerCount"];
};
```

### Rules

- Sets `todayPrayerCount` to `0`.
- Preserves `totalPrayerCount`.
- Preserves `muyuCount`.
- Keeps `today` as the current local date.

## ResetAllResult

```ts
type ResetAllResult = {
  state: IncenseState;
};
```

### Rules

- Restores default counters and settings.
- Keeps `codexHook.enabled` false.
- Does not modify Codex files or config.

## ExportStateResult

```ts
type ExportStateResult = {
  json: string;
  exportedAt: string;
};
```

### Rules

- JSON must parse successfully.
- JSON represents normalized current state.
- Export failure should not change state.

## Blessing Copy Pools

### Incense Blessings

Short developer-themed lines after "上香".

### Wooden Fish Messages

Short calming or humorous lines after "敲木鱼".

### Level Labels

- 初燃
- 稳定
- 香火渐盛
- 香火鼎盛
- 功德圆满
