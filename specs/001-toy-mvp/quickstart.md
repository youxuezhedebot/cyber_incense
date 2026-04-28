# Quickstart: Cyber Incense Toy MVP

## Prerequisites

- Node.js 20+
- npm
- macOS for first-pass tray validation

## Install

```bash
npm install
```

## Run in Development

```bash
npm run dev
```

Expected result:

- App starts.
- A tray/menu-bar item appears.
- Clicking the tray item opens the Cyber Incense window.

## Build

```bash
npm run typecheck
npm run build
```

## Manual Validation

1. Launch with `npm run dev`.
2. Confirm the tray/menu-bar entry is visible.
3. Click the tray entry and confirm the compact window opens.
4. Close the window and confirm the app remains running.
5. Reopen from tray.
6. Click "上香".
7. Confirm today's count and total merit increase.
8. Confirm smoke/glow/blessing feedback appears within 1 second.
9. Quit from the tray menu.
10. Relaunch and confirm counts persist.

## State File Validation

Inspect the local state file:

```bash
cat ~/.cyber-incense/state.json
```

Confirm it contains today's date, `todayPrayerCount`, `totalPrayerCount`, and disabled `codexHook` state.

## Recovery Validation

1. Quit the app.
2. Replace the state file with invalid JSON:

```bash
printf '{broken' > ~/.cyber-incense/state.json
```

3. Relaunch the app.
4. Confirm the app opens with default state and does not crash.

## Hook Safety Validation

Spec 001 must not touch Codex hooks. After development, confirm no Cyber Incense files were added under Codex config:

```bash
find ~/.codex -maxdepth 2 -iname '*cyber*' -print 2>/dev/null
```
