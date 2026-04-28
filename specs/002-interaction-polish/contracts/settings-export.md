# Contract: Settings, Reset, and Export

These APIs extend the Spec 001 renderer preload contract.

## `updateSettings`

Updates supported local settings.

```ts
updateSettings(update: SettingsUpdate): Promise<IncenseState>
```

### Success

- Persists supported settings.
- Returns normalized updated state.

### Failure Handling

- Ignores unsupported keys.
- Does not change counters unless a reset action is called.

## `resetToday`

Resets today's incense count after user confirmation in the renderer.

```ts
resetToday(): Promise<IncenseState>
```

### Success

- Sets `todayPrayerCount` to `0`.
- Preserves `totalPrayerCount`.
- Preserves `muyuCount`.

## `resetAll`

Resets local ritual state after user confirmation in the renderer.

```ts
resetAll(): Promise<IncenseState>
```

### Success

- Restores default state.
- Keeps hook state disabled.
- Does not modify Codex configuration.

## `exportState`

Exports current normalized state as JSON.

```ts
exportState(): Promise<ExportStateResult>
```

### Success

- Returns valid JSON or writes valid JSON through a native save flow.
- Does not mutate state.

### Failure Handling

- User cancellation is not an error state.
- Export failure does not modify ritual state.

## Types

```ts
type SettingsUpdate = {
  soundEnabled?: boolean;
  compactMode?: boolean;
};

type ExportStateResult = {
  json: string;
  exportedAt: string;
};
```
