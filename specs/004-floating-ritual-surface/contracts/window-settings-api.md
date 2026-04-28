# Contract: Window and Settings API

These APIs extend the existing renderer preload contract for Spec 004.

## `getWindowSettings`

Returns normalized window settings.

```ts
getWindowSettings(): Promise<RitualWindowSettings>
```

### Success

- Returns defaults for missing settings.
- Does not mutate ritual counters.

## `updateWindowSettings`

Updates supported window settings.

```ts
updateWindowSettings(update: WindowSettingsUpdate): Promise<IncenseState>
```

### Success

- Persists supported settings.
- Applies `alwaysOnTop` immediately to the ritual surface when it exists.
- Broadcasts updated state to open renderer windows.

### Failure Handling

- Unsupported keys are ignored.
- If applying window state fails, persisted ritual counters are not modified.

## `openSettings`

Opens or focuses the separate settings surface.

```ts
openSettings(): Promise<void>
```

### Behavior

- Does not replace the ritual surface.
- Does not embed settings into the ritual object.
- If settings are already open, focuses the existing settings surface.

## Types

```ts
type RitualWindowSettings = {
  alwaysOnTop: boolean;
  ritualSurfacePosition: {
    x: number | null;
    y: number | null;
  };
};

type WindowSettingsUpdate = {
  alwaysOnTop?: boolean;
};
```
