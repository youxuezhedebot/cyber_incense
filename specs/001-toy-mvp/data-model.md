# Data Model: Cyber Incense Toy MVP

## IncenseState

Represents all local ritual state needed by the MVP and future-compatible defaults.

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

### Fields

- `version`: Schema version. MVP starts at `1`.
- `today`: Current local date in `YYYY-MM-DD`.
- `todayPrayerCount`: Number of incense offerings for `today`.
- `totalPrayerCount`: All-time incense offering count.
- `muyuCount`: Future-compatible wooden fish count. Default `0`; not exposed in Spec 001.
- `lastPrayerAt`: ISO timestamp for the latest "上香" action.
- `lastMuyuAt`: Future-compatible wooden fish timestamp. Default `null`.
- `blessingLevel`: Progress label derived from today's count.
- `codexHook`: Future-compatible hook state. Always disabled in Spec 001.
- `settings`: Future-compatible local settings.

### Validation Rules

- Negative counts are normalized to `0`.
- Unknown or missing fields are filled from defaults.
- Invalid `today` values are replaced by the current local date.
- If `today` differs from current local date, reset `todayPrayerCount` to `0` and preserve total counters.
- Corrupted JSON is replaced with default state and should not crash the app.

## BlessingLevel

```ts
type BlessingLevel =
  | "初燃"
  | "稳定"
  | "香火渐盛"
  | "香火鼎盛"
  | "功德圆满";
```

### Derivation

- `0`: 初燃
- `1-2`: 稳定
- `3-6`: 香火渐盛
- `7-14`: 香火鼎盛
- `15+`: 功德圆满

## CodexHookState

Included only for future compatibility. Spec 001 must keep it disabled.

```ts
type CodexHookState = {
  enabled: false;
  installedAt: string | null;
  lastCheckedAt: string | null;
};
```

## IncenseSettings

Included for future compatibility with Spec 002.

```ts
type IncenseSettings = {
  soundEnabled: boolean;
  launchAtLogin: boolean;
  theme: "dark";
  compactMode: boolean;
};
```

## IncenseActionResult

Return value for a successful "上香" action.

```ts
type IncenseActionResult = {
  state: IncenseState;
  blessing: string;
};
```

## State Transitions

### Load State

1. If no file exists, create default state.
2. If JSON parses, merge with defaults and validate.
3. If JSON is corrupted, recover with defaults.
4. Apply daily reset if needed.
5. Return normalized state.

### Offer Incense

1. Load normalized state.
2. Increment `todayPrayerCount`.
3. Increment `totalPrayerCount`.
4. Set `lastPrayerAt` to current local timestamp.
5. Recompute `blessingLevel`.
6. Pick a blessing line.
7. Persist state.
8. Return `IncenseActionResult`.
