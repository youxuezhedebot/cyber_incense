# Implementation Plan: Cyber Incense Interaction Polish

**Branch**: `002-interaction-polish` | **Date**: 2026-04-27 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `/specs/002-interaction-polish/spec.md`

## Summary

Polish the working Cyber Incense toy by improving action feedback, adding the wooden fish ritual, adding opt-in sound and local settings, supporting reset/export actions, and enriching blessing levels/copy. This feature builds on Spec 001 and still excludes Codex hook installation or Codex configuration changes.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20+  
**Primary Dependencies**: Existing Electron, React, Vite, Tailwind CSS, Framer Motion, lucide-react stack from Spec 001  
**Storage**: Existing local JSON file at `~/.cyber-incense/state.json`, migrated in place with missing-field defaults  
**Testing**: TypeScript typecheck, production build, manual rapid-action checks, manual reset/export checks  
**Target Platform**: macOS first; Windows and Linux best-effort for tray behavior later  
**Project Type**: Desktop app enhancement  
**Performance Goals**: Ritual action feedback visible within 1 second; 10 rapid actions do not break layout or counts; minimum window remains readable  
**Constraints**: No hook installation, no Codex config edits, sound disabled by default, no real religious iconography, offline-first  
**Scale/Scope**: Single-user local desktop toy with two ritual actions and a compact settings surface

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

No `.specify/memory/constitution.md` exists in this repository yet. Until a constitution is created, this plan applies the project constraints from [ROADMAP.md](../../ROADMAP.md):

- Interaction-first: PASS. This feature is entirely about motion, feedback, and repeat use.
- Local-first: PASS. Settings, counters, and exports are local only.
- Safe AI hook: PASS. Hook installation remains out of scope.
- Config-safe: PASS. No Codex configuration is read or modified.
- Non-religious visual treatment: PASS. Copy and visuals remain abstract and humorous.

Post-design re-check: PASS. Contracts and tasks preserve hook exclusion and local-only behavior.

## Project Structure

### Documentation (this feature)

```text
specs/002-interaction-polish/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── ritual-actions.md
│   └── settings-export.md
├── checklists/
│   └── requirements.md
├── spec.md
└── tasks.md
```

### Source Code (repository root)

```text
electron/
├── ipc.ts
├── localStore.ts
├── tray.ts
└── window.ts
src/
├── App.tsx
├── components/
│   ├── BlessingBanner.tsx
│   ├── FloatingMerit.tsx
│   ├── IconButton.tsx
│   ├── IncenseScene.tsx
│   ├── RitualActions.tsx
│   ├── SettingsPanel.tsx
│   ├── ToggleRow.tsx
│   └── WoodenFish.tsx
├── lib/
│   ├── blessings.ts
│   └── levels.ts
├── store/
│   └── incenseStore.ts
├── styles/
│   └── globals.css
└── types/
    └── incense.ts
assets/
├── tray-icon-lit.png
└── sounds/
    └── muyu-soft.mp3
```

**Structure Decision**: Extend the existing Electron/React desktop app from Spec 001. Keep filesystem writes in Electron main process and keep UI polish in renderer components.

## Complexity Tracking

No constitution violations or complexity exceptions are required for this feature.
