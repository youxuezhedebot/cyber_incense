# Contract: Toy MVP IPC API

Renderer code can access only this narrow API exposed through the Electron preload bridge.

## `getState`

Returns the normalized local ritual state.

```ts
getState(): Promise<IncenseState>
```

### Success

- Returns default state if no prior state exists.
- Returns normalized state if stored state exists.
- Applies daily reset before returning.

### Failure Handling

- Corrupted or unreadable state recovers to defaults.
- The promise should resolve with safe state rather than crash the renderer.

## `offerIncense`

Performs one "上香" action.

```ts
offerIncense(): Promise<IncenseActionResult>
```

### Success

- Increments today's incense count.
- Increments total merit.
- Updates `lastPrayerAt`.
- Recomputes blessing level.
- Persists state.
- Returns updated state and selected blessing.

### Failure Handling

- If stored state is corrupted, recover to defaults and then apply the action.
- The action should not modify any Codex hook files or config.

## `onStateChanged`

Subscribes to state changes emitted by the main process.

```ts
onStateChanged(callback: (state: IncenseState) => void): () => void
```

### Behavior

- Invoked after state-changing actions from either window UI or tray menu.
- Returns an unsubscribe function.

## Types

```ts
type IncenseState = {
  version: 1;
  today: string;
  todayPrayerCount: number;
  totalPrayerCount: number;
  muyuCount: number;
  lastPrayerAt: string | null;
  lastMuyuAt: string | null;
  blessingLevel: "初燃" | "稳定" | "香火渐盛" | "香火鼎盛" | "功德圆满";
  codexHook: {
    enabled: false;
    installedAt: string | null;
    lastCheckedAt: string | null;
  };
  settings: {
    soundEnabled: boolean;
    launchAtLogin: boolean;
    theme: "dark";
    compactMode: boolean;
  };
};

type IncenseActionResult = {
  state: IncenseState;
  blessing: string;
};
```
