# Quickstart: Floating Ritual Surface

## Prerequisites

- Specs 001 and 002 are implemented.
- `npm install` has been run.
- macOS is available for first-pass always-on-top validation.

## Run

```bash
npm run dev
```

## Validate Floating Surface

1. Open Cyber Incense from the tray.
2. Confirm the main window feels like a compact floating ritual object, not a settings/dashboard panel.
3. Open settings from tray or a small surface control.
4. Enable fixed-on-top.
5. Focus another normal app window and confirm the ritual surface stays above it.
6. Disable fixed-on-top and confirm normal focus behavior returns.

## Validate Separate Settings

1. Open the ritual surface.
2. Open settings.
3. Confirm settings appear separately from the ritual object.
4. Confirm reset/export/toggle controls are not embedded in the main ritual surface.

## Validate Incense Visual Cycle

1. Reset all data from settings.
2. Open the ritual surface and confirm there are no incense sticks.
3. Click "上香".
4. Confirm a new incense stick appears, ignites, and is placed into the burner.
5. Wait for the burn duration.
6. Confirm the stick burns out and ash/completed marks change.
7. Click "上香" 10 times rapidly.
8. Confirm persisted counts are correct and the visual remains readable.

## Validate Wooden Fish Visuals

1. Click the wooden fish once.
2. Confirm a strike/ripple effect appears.
3. Confirm a floating `+1` appears.
4. Click several times and confirm visual marks or resonance change.
5. Quit and relaunch.
6. Confirm wooden fish visual state is restored from count.

## Validate Performance

1. Leave the ritual surface idle for several minutes.
2. Confirm idle animation is subtle and CPU is not obviously elevated.
3. Perform rapid alternating incense and wooden fish actions.
4. Confirm no layout jump or overlapping text/control failures.

## Hook Safety Validation

Spec 004 must not touch Codex hooks:

```bash
find ~/.codex -maxdepth 2 -iname '*cyber*' -print 2>/dev/null
```

No Cyber Incense hook files or config entries should be created by Spec 004.
