# Implementation Plan: Cyber Incense Toy MVP

**Branch**: `001-toy-mvp` | **Date**: 2026-04-27 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `/specs/001-toy-mvp/spec.md`

## Summary

Build the first usable Cyber Incense desktop toy: an Electron tray app with a compact React window, a visible incense scene, a working "上香" action, and local JSON persistence. This feature intentionally excludes Codex hooks, packaging, wooden fish, sound, and full settings polish.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20+  
**Primary Dependencies**: Electron, React, Vite, Tailwind CSS, Framer Motion, lucide-react, concurrently  
**Storage**: Local JSON file at `~/.cyber-incense/state.json`  
**Testing**: TypeScript typecheck, production build, Electron manual smoke test, manual state-file validation  
**Target Platform**: macOS first; Windows and Linux tray behavior best-effort later  
**Project Type**: Desktop app  
**Performance Goals**: App window opens from tray within 5 seconds; "上香" feedback appears within 1 second; animations target smooth 60 fps on typical desktop hardware  
**Constraints**: Offline-first, no accounts, no telemetry, no backend, no Codex hook changes, no real religious iconography  
**Scale/Scope**: Single-user local desktop toy with one ritual action and one persisted state file

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

No `.specify/memory/constitution.md` exists in this repository yet. Until a constitution is created, this plan applies the project constraints from [ROADMAP.md](../../ROADMAP.md):

- Interaction-first: PASS. The first feature centers tray behavior and the "上香" toy loop.
- Local-first: PASS. State is local JSON only; no network or accounts.
- Safe AI hook: PASS. Hook work is explicitly out of scope for this feature.
- Config-safe: PASS. No Codex configuration is read or modified in this feature.
- Non-religious visual treatment: PASS. Real religious iconography is forbidden.

Post-design re-check: PASS. Research, data model, contracts, and quickstart preserve these constraints.

## Project Structure

### Documentation (this feature)

```text
specs/001-toy-mvp/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── ipc-api.md
│   └── state.schema.json
├── checklists/
│   └── requirements.md
├── spec.md
└── tasks.md
```

### Source Code (repository root)

```text
package.json
index.html
vite.config.ts
tsconfig.json
tsconfig.node.json
tailwind.config.js
postcss.config.js
electron/
├── main.ts
├── preload.ts
├── ipc.ts
├── localStore.ts
├── paths.ts
├── tray.ts
└── window.ts
src/
├── App.tsx
├── main.tsx
├── components/
│   ├── BlessingBanner.tsx
│   ├── IncenseBurner.tsx
│   ├── IncenseScene.tsx
│   ├── RitualActions.tsx
│   ├── SmokeLayer.tsx
│   └── StatsPanel.tsx
├── store/
│   └── incenseStore.ts
├── styles/
│   └── globals.css
└── types/
    └── incense.ts
assets/
├── tray-icon.png
└── tray-icon-lit.png
```

**Structure Decision**: Use a single Electron desktop project at repository root. The Electron main process owns tray/window/filesystem behavior, while the React renderer owns the toy UI.

## Complexity Tracking

No constitution violations or complexity exceptions are required for this feature.
