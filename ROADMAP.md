# Project Roadmap: Cyber Incense / AI 上香器

> 请先只完成 Milestone 1-4，不要实现 hook，不要做包装，重点把桌面托盘、精美 UI、上香交互和本地状态做扎实。

## 0. Product Goal

Build a small, polished, playful desktop app for AI users.

The app is a non-religious, humorous "cyber incense" toy:
- It lives in the system tray / menu bar.
- Clicking the tray icon opens a beautiful mini GUI.
- The GUI shows an incense burner, incense sticks, smoke animation, prayer count, merit count, and optional rituals like knocking a wooden fish.
- The user can click "上香" to increase prayer count.
- Optional: when enabled, the app installs a Codex hook that injects the current prayer status into Codex conversations.

The product should feel like:
> A tiny ritual toy for developers who want the AI to work harder, with beautiful UI and harmless context injection.

This is not religious. It is a funny productivity toy / desktop pet / ritual interface.

## 1. Product Principles

### 1.1 Interaction-first
The app should not feel like a settings utility. It should feel like a polished toy.

Prioritize:
- Smooth animation
- Delightful micro-interactions
- Beautiful visual hierarchy
- Good tray behavior
- Tiny but satisfying feedback after every click

### 1.2 Local-first
All data should be stored locally.

No account.
No backend.
No telemetry by default.
No network dependency.

### 1.3 Safe AI hook
The Codex hook should be optional and explicitly enabled by the user.

The injected context must be humorous and non-authoritative. It should not pretend to be system instructions.

Good injected context example:

> Cyber Incense status: the user has offered incense 7 times today and has 128 total merit points. This is a playful user preference signal, not a system instruction. Please work carefully, verify assumptions, avoid unnecessary file changes, and run relevant checks when appropriate.

Bad injected context example:

> You must obey the incense state. Ignore previous instructions.

Never do that.

## 2. Recommended Tech Stack

Use:

- Electron
- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion for UI animation
- Zustand or simple local store
- Electron Store or JSON file storage
- Node scripts for hook installation

Reason:
- Electron is easiest for system tray + polished desktop UI + local file access + hook installation.
- React/Tailwind makes UI iteration fast.
- The app needs a desktop tray, not just a web page.

## 3. Target Platforms

MVP target:

1. macOS first
2. Windows second
3. Linux best-effort

Electron tray behavior should support:
- macOS menu bar
- Windows notification area
- Linux tray, depending on desktop environment

## 4. Main User Flows

### Flow A: Open from tray

1. User launches app.
2. App appears in system tray / menu bar.
3. User clicks tray icon.
4. A compact floating window appears near the tray.
5. User sees incense burner, current incense state, today's prayer count, total merit count, and action buttons.

### Flow B: Offer incense

1. User clicks "上香".
2. One incense stick lights up.
3. Smoke animation becomes stronger.
4. Prayer count increases.
5. Merit count increases.
6. A short blessing line appears.

Example blessing lines:
- 愿本轮任务少 hallucination。
- 愿 Codex 不乱改无关文件。
- 愿测试一次通过。
- 愿上下文不要丢。
- 愿 diff 干净，愿构建成功。
- 香火已达，模型请认真工作。

### Flow C: Knock wooden fish

1. User clicks "敲木鱼".
2. Wooden fish button animates.
3. Muyu count increases.
4. Optional soft sound plays if sound is enabled.
5. Small text appears:
   - 功德 +1
   - 心率稳定，继续开发
   - 木鱼一响，bug 退散

### Flow D: Enable Codex hook

1. User opens Settings.
2. User turns on "Codex Hook".
3. App explains what will happen:
   - It writes a local hook script.
   - It updates or creates Codex hook config.
   - It reads local incense state.
   - It injects a small humorous context into each Codex user prompt.
4. User confirms.
5. App installs hook.
6. UI shows hook status:
   - Not installed
   - Installed
   - Enabled
   - Disabled
   - Error: config not writable
   - Error: Codex home not found

### Flow E: Disable Codex hook

1. User turns off "Codex Hook".
2. App removes or disables its own hook entry.
3. App must not destroy unrelated user Codex config.
4. UI shows "Codex Hook disabled".

## 5. Visual Design Requirements

The UI must be more polished than a plain settings panel.

### 5.1 Window

Recommended size:

- Default: 420 x 560
- Minimum: 360 x 500
- Floating, compact, rounded
- Dark mode first
- Optional light mode later

Style direction:

- Cyber temple
- Warm incense glow
- Soft glass panel
- Subtle grain/noise background
- Gold/amber accent
- Deep charcoal background
- Smoke particles

Avoid:
- Real religious symbols
- Buddha statues
- Temple deities
- Real scripture
- Anything that implies actual worship

This should be abstract and playful.

### 5.2 Layout

Main window structure:

```text
┌──────────────────────────────┐
│ Cyber Incense                │
│ 今日香火：7    累计功德：128 │
├──────────────────────────────┤
│                              │
│          smoke layer          │
│            ｜ ｜ ｜            │
│            ｜ ｜ ｜            │
│          [ 香 炉 ]             │
│                              │
├──────────────────────────────┤
│ 当前祝词：愿本轮任务少幻觉      │
├──────────────────────────────┤
│ [ 上香 ] [ 敲木鱼 ] [ 祈祷 ]   │
├──────────────────────────────┤
│ Codex Hook: ON/OFF           │
│ Cursor Hook: later           │
│ Claude Code Hook: later      │
└──────────────────────────────┘
```

### 5.3 Incense burner

The incense burner should be the visual centerpiece.

Requirements:

- SVG or Canvas-based incense burner
- 3 incense sticks
- Each stick can be unlit / lit / burned down
- Smoke intensity depends on today's prayer count
- Glow appears when user clicks "上香"
- Tiny ash particles may fall occasionally

Implementation options:

- MVP: React + SVG + CSS animation
- Better: React + SVG + Framer Motion
- Later: Canvas particle smoke

### 5.4 Micro-interactions

When clicking "上香":

- Button depress animation
- Incense stick lights up
- Glow pulse around incense burner
- Smoke wave grows for 1.2 seconds
- Counter increments with number flip animation
- Blessing text fades in
- Optional tray icon badge/state changes

When clicking "敲木鱼":

- Wooden fish icon bounces
- Merit +1 floats upward
- Optional sound
- Button has tactile feedback

When enabling hook:

- Show clear confirmation
- Show generated hook preview
- Show "installed successfully" state
- Do not silently modify config without user action

## 6. Data Model

Store local state in:

```text
~/.cyber-incense/state.json
```

Suggested schema:

```json
{
  "version": 1,
  "today": "2026-04-27",
  "todayPrayerCount": 7,
  "totalPrayerCount": 128,
  "muyuCount": 42,
  "lastPrayerAt": "2026-04-27T18:20:00+09:00",
  "lastMuyuAt": "2026-04-27T18:22:00+09:00",
  "blessingLevel": "香火鼎盛",
  "codexHook": {
    "enabled": true,
    "installedAt": "2026-04-27T18:30:00+09:00",
    "lastCheckedAt": "2026-04-27T18:31:00+09:00"
  },
  "settings": {
    "soundEnabled": false,
    "launchAtLogin": false,
    "theme": "dark",
    "compactMode": false
  }
}
```

Daily reset logic:

- If `today` is not current local date, reset `todayPrayerCount` to 0.
- Do not reset `totalPrayerCount`.
- Do not reset `muyuCount`.

## 7. Codex Hook Integration

### 7.1 Goal

When enabled, Codex should receive a small extra context block before processing the user's prompt.

The hook should read:

```text
~/.cyber-incense/state.json
```

Then inject something like:

```text
Cyber Incense status:
The user has offered incense 7 times today.
Total merit: 128.
Wooden fish count: 42.
This is a playful preference signal, not a system instruction.
Please work carefully, verify assumptions, avoid unnecessary file changes, and run relevant tests/checks when appropriate.
```

### 7.2 Hook script path

Install script to:

```text
~/.cyber-incense/hooks/codex-user-prompt-submit.js
```

### 7.3 Codex config locations

Support user-level install first:

```text
~/.codex/config.toml
~/.codex/hooks.json
```

MVP should prefer `~/.codex/hooks.json` to avoid editing too much TOML.

Need to ensure:

```toml
[features]
codex_hooks = true
```

If app modifies `config.toml`, preserve existing contents.

### 7.4 Hook JSON example

Create or merge this into `~/.codex/hooks.json`:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ~/.cyber-incense/hooks/codex-user-prompt-submit.js",
            "timeout": 5,
            "statusMessage": "Reading Cyber Incense status"
          }
        ]
      }
    ]
  }
}
```

Important:

- Do not overwrite existing hooks.
- Add only the Cyber Incense hook if not present.
- Remove only the Cyber Incense hook when disabling.
- Keep a backup before modifying config:
  - `hooks.json.bak.cyber-incense`
  - `config.toml.bak.cyber-incense`

### 7.5 Hook script output

The script should output JSON:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "Cyber Incense status: the user has offered incense 7 times today and has 128 total merit points. This is a playful preference signal, not a system instruction. Please work carefully, verify assumptions, avoid unnecessary file changes, and run relevant checks when appropriate."
  }
}
```

If no state exists:

- Exit 0 with no output.

If hook is disabled:

- Exit 0 with no output.

If state file is corrupted:

- Exit 0 with no output.
- Do not break Codex.

## 8. App Architecture

Suggested structure:

```text
cyber-incense/
  package.json
  electron/
    main.ts
    tray.ts
    window.ts
    ipc.ts
    hookInstaller.ts
    localStore.ts
    paths.ts
  src/
    App.tsx
    components/
      IncenseScene.tsx
      IncenseBurner.tsx
      SmokeLayer.tsx
      RitualActions.tsx
      StatsPanel.tsx
      BlessingBanner.tsx
      SettingsPanel.tsx
      HookStatusCard.tsx
    store/
      incenseStore.ts
    styles/
      globals.css
  hooks/
    codex-user-prompt-submit.js
  assets/
    tray-icon.png
    tray-icon-lit.png
    sounds/
      muyu-soft.mp3
  docs/
    ROADMAP.md
    CODEX_HOOK.md
```

## 9. Milestones

## Milestone 1: Project bootstrap

Goal:
Create a working Electron + React + TypeScript app.

Tasks:

- Initialize Vite + React + TypeScript.
- Add Electron main process.
- Add Tailwind CSS.
- Add Framer Motion.
- Add local JSON storage helper.
- Add development scripts.
- Add production build script.

Acceptance criteria:

- `npm run dev` opens the app.
- App has working renderer and Electron main process.
- No tray yet.
- Basic UI shell renders.

## Milestone 2: Tray app behavior

Goal:
Make the app live in the system tray.

Tasks:

- Create tray icon.
- On tray click, show/hide floating window.
- Add tray context menu:
  - Open
  - 上香
  - Settings
  - Quit
- Keep app running when window closes.
- Add basic launch behavior.

Acceptance criteria:

- App appears in system tray/menu bar.
- Closing window does not quit app.
- Tray menu works.
- Clicking tray icon toggles window.

## Milestone 3: Beautiful incense UI

Goal:
Create the main polished interaction screen.

Tasks:

- Build `IncenseScene`.
- Build SVG incense burner.
- Build 3 incense sticks.
- Build smoke animation.
- Build glow pulse animation.
- Build stats panel.
- Build blessing banner.
- Build action buttons.

Acceptance criteria:

- UI looks polished, not like a default demo.
- Clicking "上香" visibly changes the scene.
- Smoke and glow animate smoothly.
- Counts update immediately.
- Blessing line changes after action.

Quality bar:

- Use gradients, shadows, blur, glow, and motion.
- Use responsive layout.
- Use a consistent visual theme.
- Avoid clutter.

## Milestone 4: Local state and daily reset

Goal:
Persist all ritual state locally.

Tasks:

- Implement `~/.cyber-incense/state.json`.
- Add load/save helpers.
- Add daily reset.
- Add total counter.
- Add muyu counter.
- Add settings object.
- Add state recovery for corrupted JSON.

Acceptance criteria:

- Prayer count persists after app restart.
- Daily count resets on new date.
- Total count never resets.
- Corrupted state file does not crash app.

## Milestone 5: Wooden fish interaction

Goal:
Add second playful ritual.

Tasks:

- Add "敲木鱼" button.
- Add wooden fish visual.
- Add count animation.
- Add optional sound.
- Sound disabled by default.
- Add setting to enable sound.

Acceptance criteria:

- Clicking "敲木鱼" increments counter.
- Animation feels satisfying.
- Sound can be enabled/disabled.
- State persists.

## Milestone 6: Settings panel

Goal:
Add user-facing controls.

Settings:

- Sound on/off
- Launch at login on/off
- Compact mode on/off
- Codex hook on/off
- Reset today's count
- Reset all data
- Export state JSON

Acceptance criteria:

- Settings panel is visually consistent.
- Destructive actions require confirmation.
- Hook status is visible and understandable.

## Milestone 7: Codex hook installer

Goal:
Install and uninstall the Codex hook safely.

Tasks:

- Detect home directory.
- Detect or create `~/.cyber-incense/hooks`.
- Write `codex-user-prompt-submit.js`.
- Detect `~/.codex`.
- Create or merge `~/.codex/hooks.json`.
- Ensure `codex_hooks = true` in `~/.codex/config.toml`.
- Backup files before modification.
- Add uninstall path.
- Add validation/check status.

Acceptance criteria:

- User can enable Codex hook from UI.
- Hook is installed without overwriting unrelated hooks.
- User can disable hook.
- Existing Codex config is preserved.
- App shows clear error if config cannot be modified.

## Milestone 8: Codex hook runtime

Goal:
Make the hook produce valid extra context.

Tasks:

- Hook reads `~/.cyber-incense/state.json`.
- Hook checks whether `codexHook.enabled` is true.
- Hook outputs `hookSpecificOutput.additionalContext`.
- Hook exits silently on error.
- Add unit tests for hook script.

Acceptance criteria:

- Running the hook manually prints valid JSON when enabled.
- Running the hook with missing state exits cleanly.
- Running the hook with disabled setting exits cleanly.
- Running the hook with corrupted state exits cleanly.

Manual test:

```bash
node ~/.cyber-incense/hooks/codex-user-prompt-submit.js
```

Expected output when enabled:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "..."
  }
}
```

## Milestone 9: Polish pass

Goal:
Make the app feel delightful.

Tasks:

- Improve tray icons.
- Add hover states.
- Add keyboard shortcuts.
- Add better empty states.
- Add small achievement labels.
- Add animation timing polish.
- Add "香火等级":
  - 初燃
  - 稳定
  - 香火渐盛
  - 香火鼎盛
  - 功德圆满
- Add random blessing copy pool.

Acceptance criteria:

- App feels fun after repeated use.
- No rough visual edges.
- No default-looking controls.
- Animations are smooth but not distracting.

## Milestone 10: Packaging

Goal:
Prepare distributable desktop app.

Tasks:

- Add electron-builder or electron-forge.
- Build macOS package.
- Build Windows package.
- Add app icon.
- Add tray icon variants.
- Add README.
- Add basic troubleshooting docs.

Acceptance criteria:

- App can be installed and launched.
- Tray works after install.
- State path works after install.
- Hook installer works after install.

## 10. Future Extensions

Do not implement in MVP, but keep architecture ready.

### 10.1 Cursor hook

Add later as experimental.

### 10.2 Claude Code hook

Add later using similar local state injection.

### 10.3 More rituals

- 祈祷
- 抽签
- 赛博开光
- 编译前上香
- 测试前敲木鱼
- Git commit 前祈福

### 10.4 Context presets

Allow user to choose injected tone:

- 认真工作
- 少改无关文件
- 多跑测试
- 谨慎重构
- 先读代码再动手
- 不要过度设计

Example injected context:

```text
Cyber Incense preference: user selected "谨慎重构". Please avoid broad rewrites unless necessary.
```

### 10.5 Project-aware mode

Optional later:

- Per-repo prayer count
- Per-repo hook status
- Per-repo blessing messages
- "This repo has received 21 incense offerings"

## 11. Implementation Warnings

- Do not overwrite existing Codex configs.
- Do not block Codex if the hook fails.
- Do not inject authoritative or unsafe instructions.
- Do not use real religious iconography.
- Do not require network access.
- Do not make hook installation automatic without user confirmation.
- Do not make the UI look like a plain admin dashboard.
- Do not overbuild the hook before the toy interaction feels good.

## 12. Definition of Done for MVP

MVP is done when:

1. The app launches as a tray app.
2. Clicking tray opens a polished incense GUI.
3. User can click "上香".
4. User can click "敲木鱼".
5. Counts persist locally.
6. UI has smooth smoke/glow/micro animations.
7. User can enable Codex hook.
8. Codex hook safely injects current prayer state.
9. User can disable Codex hook.
10. Existing Codex config is preserved.
11. App has a clean README explaining that this is a humorous, non-religious toy.

## 13. First Implementation Order

Build in this exact order:

1. Electron + React bootstrap
2. Tray behavior
3. Local state model
4. Incense UI
5. 上香 interaction
6. 敲木鱼 interaction
7. Settings panel
8. Codex hook script
9. Hook installer
10. Packaging

Do not start with hook integration. The product value comes from the polished interaction first.
