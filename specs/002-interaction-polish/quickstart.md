# Quickstart: Cyber Incense Interaction Polish

## Prerequisites

- Spec 001 Toy MVP is implemented and working.
- `npm install` has been run.

## Run

```bash
npm run dev
```

## Validate Incense Polish

1. Open the app from the tray.
2. Click "上香" once.
3. Confirm the glow, smoke, count, and blessing feedback are immediate.
4. Click "上香" 10 times rapidly.
5. Confirm counts are correct and layout does not jump or overlap.

## Validate Wooden Fish

1. Click "敲木鱼".
2. Confirm wooden fish count increases.
3. Confirm a short feedback message or `功德 +1` effect appears.
4. Quit and relaunch.
5. Confirm wooden fish count persists.

## Validate Sound

1. Confirm sound is off by default.
2. Enable sound in settings.
3. Click "敲木鱼".
4. Confirm a short soft sound may play.
5. Disable sound.
6. Confirm no sound plays.

## Validate Settings

1. Open settings.
2. Toggle compact mode and confirm the UI remains usable.
3. Reset today's count and confirm total merit remains.
4. Reset all data and confirm counters return to defaults.
5. Export state and confirm the exported content is valid JSON.

## Validate Hook Safety

This feature must not install hooks:

```bash
find ~/.codex -maxdepth 2 -iname '*cyber*' -print 2>/dev/null
```

No Cyber Incense hook files or config entries should be created by Spec 002.
