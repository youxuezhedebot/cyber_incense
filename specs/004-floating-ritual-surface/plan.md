# Implementation Plan: Floating Ritual Surface

**Branch**: `004-floating-ritual-surface` | **Date**: 2026-04-27 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `/specs/004-floating-ritual-surface/spec.md`

## Summary

Refactor Cyber Incense from a compact dashboard into a floating desktop ritual object. The main surface becomes a refined object-first view: default empty burner, animated incense placement/burn/ash lifecycle, distinct wooden fish visual object, and optional fixed-on-top behavior. Settings move to a separate settings window/view. This feature intentionally remains local-only and does not implement Codex hooks.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20+  
**Primary Dependencies**: Existing Electron, React, Vite, Tailwind CSS, Framer Motion, lucide-react stack  
**Storage**: Existing `~/.cyber-incense/state.json`, migrated in place with new visual/window settings  
**Testing**: TypeScript typecheck, production build, manual window pinning checks, manual rapid-action state checks, performance smoke  
**Target Platform**: macOS first; Windows and Linux best-effort for always-on-top semantics  
**Project Type**: Desktop app visual/window refactor  
**Performance Goals**: Interaction feedback within 300 ms; idle surface avoids heavy continuous animation; 10 rapid actions remain count-correct; high counts render via aggregation  
**Constraints**: Local-first, no telemetry, no backend, no Codex hook changes, no real religious iconography, settings separated from ritual surface  
**Scale/Scope**: Single-user floating desktop toy with two ritual objects and one local settings surface

## Constitution Check

No `.specify/memory/constitution.md` exists in this repository yet. Until a constitution is created, this plan applies the project constraints from [ROADMAP.md](../../ROADMAP.md):

- Interaction-first: PASS. This feature is centered on object feel, animation, and desktop presence.
- Local-first: PASS. Window preferences and visual state derive from local state only.
- Safe AI hook: PASS. Hook work remains explicitly out of scope.
- Config-safe: PASS. No Codex configuration is read or modified.
- Non-religious visual treatment: PASS. Visuals remain abstract, playful, and non-devotional.

Post-design re-check: PASS. The data model and contracts preserve local-only behavior and hook exclusion.

## Project Structure

### Documentation (this feature)

```text
specs/004-floating-ritual-surface/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── ritual-visual-state.md
│   └── window-settings-api.md
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
├── views/
│   ├── RitualSurfaceView.tsx
│   └── SettingsView.tsx
├── components/
│   ├── incense/
│   │   ├── AshLayer.tsx
│   │   ├── BurnEffects.tsx
│   │   ├── FloatingIncenseSurface.tsx
│   │   ├── IncenseBasin.tsx
│   │   ├── IncenseStick.tsx
│   │   └── IncenseTally.tsx
│   └── muyu/
│       ├── KnockEffect.tsx
│       ├── MuyuMarks.tsx
│       └── WoodenFishObject.tsx
├── lib/
│   ├── ritualVisuals.ts
│   └── windowMode.ts
├── store/
│   └── incenseStore.ts
└── types/
    └── incense.ts
```

**Structure Decision**: Keep Electron main process responsible for window behavior and filesystem state. Renderer chooses a surface view (`ritual` or `settings`) based on window launch context. The ritual view should be object-first; settings controls move to `SettingsView`.

## Complexity Tracking

No constitution violations or complexity exceptions are required for this feature.
