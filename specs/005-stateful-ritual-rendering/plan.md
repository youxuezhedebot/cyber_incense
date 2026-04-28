# Implementation Plan: Stateful Ritual Rendering Engine

**Branch**: `005-stateful-ritual-rendering` | **Date**: 2026-04-27 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `/specs/005-stateful-ritual-rendering/spec.md`

## Summary

Introduce a shared ritual simulation engine for incense and wooden fish visuals. The engine owns normalized state, deterministic random placement, burn progress, ash accumulation, smoke/spark particles, wooden fish hit traces, and spring-like motion. React components become renderer/adapters that draw state instead of owning the core simulation.

This spec is the next visual depth layer after Spec 004. It keeps the existing floating surface and local storage, but replaces fixed visual summaries with a small "state simulation + layered rendering + interaction event" model.

## Current Code Snapshot

The repository currently has:

- `src/components/incense/FloatingIncenseSurface.tsx`: React/SVG composition for burner, active sticks, ash, burn effects, and click target.
- `src/components/muyu/WoodenFishObject.tsx`: React/Framer Motion wooden fish visual with `+1`, knock effect, basic sound, and click target.
- `src/lib/ritualVisuals.ts`: derived count summaries with caps and intensity values.
- `src/types/incense.ts`: persisted app state, visual settings, window settings, and simple visual summary types.
- `src/store/incenseStore.ts`: renderer store that calls Electron preload APIs and manages pulse ids.

Spec 005 should preserve this user-facing shape while moving durable visual logic into reusable engine modules.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20+  
**Primary Dependencies**: Existing Electron, React, Vite, Tailwind CSS, Framer Motion, lucide-react stack  
**Possible Rendering Backends**: Existing SVG/React first, Canvas/Skia/WebGL-compatible adapter later  
**Storage**: Existing local JSON state with added simulation settings and optional compact event history  
**Testing**: TypeScript typecheck, production build, deterministic engine unit/smoke checks, manual interaction QA  
**Target Platform**: macOS first; Windows and Linux best-effort through Electron  
**Performance Goals**: Interaction feedback within 300 ms; capped visible sticks/traces; idle animation does not run unnecessary work  
**Constraints**: Local-first, no telemetry, no backend, no Codex hook changes, no real religious iconography  
**Scale/Scope**: Single-user desktop toy with hundreds of ritual events aggregated into readable visual state

## Constitution Check

No `.specify/memory/constitution.md` exists in this repository yet. Until a constitution is created, this plan applies the project constraints from [ROADMAP.md](../../ROADMAP.md):

- Interaction-first: PASS. The feature is entirely about richer object interaction and animation.
- Local-first: PASS. Runtime state derives from local counters and local event history.
- Safe AI hook: PASS. Hook work remains explicitly out of scope.
- Config-safe: PASS. No Codex configuration is read or modified.
- Non-religious visual treatment: PASS. The style remains playful and abstract.

Post-design re-check: PASS. The data model keeps rendering local, deterministic, and independent from hook behavior.

## Project Structure

### Documentation (this feature)

```text
specs/005-stateful-ritual-rendering/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ritual-engine.md
├── checklists/
│   └── requirements.md
├── spec.md
└── tasks.md
```

### Proposed Source Code

```text
src/
├── lib/
│   ├── ritualEngine.ts
│   ├── ritualGeometry.ts
│   ├── ritualRandom.ts
│   └── ritualVisuals.ts
├── types/
│   ├── incense.ts
│   └── ritualSimulation.ts
└── components/
    ├── incense/
    │   ├── FloatingIncenseSurface.tsx
    │   └── ...
    └── muyu/
        ├── WoodenFishObject.tsx
        └── ...
```

**Structure Decision**: Keep Electron and persistent count APIs unchanged at first. Add a renderer-local ritual engine in `src/lib` and typed runtime models in `src/types`. Migrate existing components incrementally so the visual behavior can be validated without changing window or IPC scope.

## Implementation Phases

### Phase 1: Engine Foundation

- Add normalized geometry helpers.
- Add deterministic random/hash helpers.
- Add ritual simulation types.
- Add `RitualEngine` with `update`, `offerIncense`, and `hitMuyu` methods.
- Add engine initialization from existing `IncenseState`.

### Phase 2: Incense Simulation

- Implement ash-bed ellipse placement.
- Implement seeded slot search and depth sorting.
- Implement burn progress, ember point, ash thresholds, smoke particles, and spark particles.
- Implement LOD visible-stick selection and aggregate ash mapping.

### Phase 3: Wooden Fish Simulation

- Implement hit strength from point and combo.
- Implement spring/impulse state.
- Implement traces, shockwaves, trace alpha/radius decay, and optional damage-map hooks.
- Keep existing sound toggle behavior decorative and fail-open.

### Phase 4: Renderer Adapter

- Define adapter drawing primitives.
- Update existing React/SVG components to render from engine snapshots.
- Keep direct click targets accessible and stable.
- Preserve current visual language while making state ownership explicit.

### Phase 5: Persistence And Restore

- Add optional durable event history or compact visual history.
- Normalize Spec 004 state into Spec 005 defaults.
- Recompute active burns and remaining traces from timestamps and seeds.
- Avoid saving transient particles.

### Phase 6: Validation And Polish

- Add deterministic engine smoke tests or scripts.
- Run typecheck and build.
- Manually validate rapid taps, high counts, restart restore, and minimum-size readability.

## Complexity Tracking

No complexity exceptions are required. The main risk is overbuilding the renderer abstraction before the first adapter is useful; implementation should keep the adapter boundary small and only cover primitives needed by the lightweight 2D version.
