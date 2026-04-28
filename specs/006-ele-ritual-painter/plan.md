# Implementation Plan: Ele Ritual Painter

**Branch**: `006-ele-ritual-painter` | **Date**: 2026-04-28 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `/specs/006-ele-ritual-painter/spec.md`

## Summary

Introduce a painter contract for the ritual surface so the incense burner and wooden fish can be rendered through Ele-style drawing primitives instead of being locked to hand-written React/SVG markup.

The implementation should be incremental. The first backend is the current Electron/React/SVG surface, wrapped behind painter-oriented layout, theme, animation, and layer helpers. A future Canvas/Skia/Ele adapter can implement the same contract without changing the ritual engine or durable state.

## Current Code Snapshot

The repository already has the state side of this feature:

- `src/lib/ritualEngine.ts`: Owns incense placement, burn progress, smoke/spark/ash particles, wooden fish traces, shockwaves, springs, snapshot creation, and save-data normalization.
- `src/types/ritualSimulation.ts`: Defines `RitualSnapshot`, `BurnerState`, `MuyuState`, `IncenseStickState`, particles, traces, and config.
- `src/hooks/useRitualEngine.ts`: Creates the renderer-local engine, clamps `dt`, updates snapshots through `requestAnimationFrame`, and slows idle ticks.
- `src/views/RitualSurfaceView.tsx`: Chooses between incense and wooden fish object surfaces based on `state.window.activeObject`.
- `src/components/incense/FloatingIncenseSurface.tsx`: Renders snapshot-driven active sticks, burned stubs, ash, smoke, sparks, and basin layers through SVG components.
- `src/components/incense/IncenseBasin.tsx`: Contains the current basin/rim SVG paths and gradients.
- `src/components/incense/IncenseStick.tsx`: Maps normalized incense points into the SVG viewBox and draws active sticks/embers.
- `src/components/incense/AshLayer.tsx`: Draws ash bed marks and ash fragments.
- `src/components/incense/BurnEffects.tsx`: Draws smoke Bezier paths and spark particles.
- `src/components/muyu/WoodenFishObject.tsx`: Renders spring motion, hit traces, shockwaves, sound feedback, and current simplified body.
- `src/store/incenseStore.ts`, `electron/ipc.ts`, `electron/localStore.ts`: Keep persisted counts and ritual history authoritative.

Spec 006 should preserve this shape. The painter must consume snapshots and events; it should not move durable count ownership into the renderer.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18, Electron renderer  
**Primary Rendering Target**: Existing SVG/React implementation as the first painter adapter  
**Future Rendering Targets**: Canvas, Skia, Ele, or equivalent 2D path backends  
**State Source**: Existing Spec 005 `RitualSnapshot` and persisted `IncenseState`  
**Testing**: TypeScript typecheck, production build, `smoke:ritual-engine`, focused painter helper tests or scripts where practical, manual visual QA  
**Performance Goal**: Feedback within 300 ms; capped dynamic detail; idle redraw reduced or paused  
**Constraints**: Local-first, no network, no Codex hook changes, no real religious iconography, no required bitmap assets

## Constitution Check

No `.specify/memory/constitution.md` exists in this repository yet. Until a constitution is created, this plan applies the project constraints from [ROADMAP.md](../../ROADMAP.md):

- Interaction-first: PASS. The painter exists to make object interactions more tactile and state-visible.
- Local-first: PASS. It consumes local engine snapshots and does not introduce services.
- Safe AI hook: PASS. Hook work remains explicitly out of scope.
- Config-safe: PASS. No Codex configuration is read or modified.
- Non-religious visual treatment: PASS. The painter uses abstract burner/wooden-fish-inspired toy visuals without scripture, deities, or worship claims.

Post-design re-check: PASS. The first implementation stays inside renderer/UI modules and does not change persistence ownership.

## Project Structure

### Documentation (this feature)

```text
specs/006-ele-ritual-painter/
├── plan.md
├── spec.md
├── tasks.md
└── checklists/
    └── requirements.md
```

### Proposed Source Code

```text
src/
├── lib/
│   └── ritualPainter/
│       ├── animation.ts
│       ├── burnerGeometry.ts
│       ├── debug.ts
│       ├── geometry.ts
│       ├── layout.ts
│       ├── muyuGeometry.ts
│       └── theme.ts
├── types/
│   └── ritualPainter.ts
└── components/
    └── painter/
        ├── SvgBurnerPainter.tsx
        ├── SvgMuyuPainter.tsx
        └── SvgRitualPainterSurface.tsx
```

**Structure Decision**: Keep the current engine and IPC/store files stable. Add painter-facing type and helper modules in `src/types` and `src/lib/ritualPainter`, then introduce React/SVG adapter components under `src/components/painter`. Existing incense and wooden fish components can either delegate to the new adapter or be replaced once parity is reached.

## Implementation Phases

### Phase 1: Painter Contract And Shared Helpers

- Define `Rect`, normalized coordinate helpers, paint/style types, backend capability flags, layer names, and debug metadata.
- Add object layout helpers for burner and wooden fish rects.
- Add shared hit-test helpers for the burner ash/body ellipse and wooden fish body ellipse.
- Add centralized easing, pulse, Bezier, and `dt` clamp utilities.
- Add default painter theme specs that mirror the current warm bronze/wood/mint visual language.

### Phase 2: SVG Adapter Foundation

- Create a React/SVG-backed painter surface that accepts `IncenseState`, `RitualSnapshot`, pulse ids, and action callbacks.
- Preserve current host behavior: one active object at a time, transparent floating window, accessible click target, and app drag/no-drag behavior.
- Keep existing `useRitualEngineSnapshot` as the clock initially; only extract timing if the painter needs local draw-only animation.
- Add a small debug surface or utility that can report layer order, dynamic item counts, and cache keys.

### Phase 3: Wooden Fish Painter

- Replace the simplified `div`/rounded-ellipse body with path-based body and mouth geometry.
- Draw material layers in painter order: shadow, cushion, body gradient, wood grain, carving, mouth, hit traces, highlight, ripples, mallet.
- Reuse Spec 005 `muyu` snapshot values for spring offset, scale, rotation, traces, and shockwaves.
- Add draw-only mallet animation keyed by `muyuPulseId` and the newest trace when available.
- Preserve fail-open sound behavior and existing `knockMuyu(point)` state flow.

### Phase 4: Incense Burner Painter

- Move current basin path/gradient semantics into burner geometry/theme helpers.
- Draw body, rim, ash bed, sticks, stubs, ash fragments, smoke curves, sparks, front rim, and highlights through the SVG painter adapter.
- Reuse current `toIncenseSvgPoint` behavior initially, but hide it behind painter projection helpers.
- Preserve existing count-authoritative `offerIncense()` IPC flow. The interaction router may compute a normalized click point for painter feedback, even if persisted incense placement remains deterministic and not click-point-based.
- Sort visible sticks/stubs by depth or y-position before drawing where it improves occlusion.

### Phase 5: Static Layer Caching And Fallbacks

- Add cache key helpers for rect size, pixel ratio, theme, and backend capabilities.
- For SVG, use memoized path/layer data first; future Canvas/Ele backends can map the same cache records to offscreen layers.
- Mark dynamic layers explicitly: active sticks, burn progress, particles, traces, shockwaves, insertion/strike animation.
- Add reduced-capability fallbacks for blur, shadow, and blend modes.

### Phase 6: Validation And Migration

- Run typecheck, production build, and the existing engine smoke script.
- Manually validate incense and wooden fish surfaces at normal and minimum window sizes.
- Validate rapid clicks, high counts, restart/restore, and idle redraw behavior.
- Remove or simplify old SVG components only after painter adapter parity is reached.

## Risks And Mitigations

- **Risk**: Rewriting visuals all at once could regress the current working ritual surface.  
  **Mitigation**: Introduce new painter components in parallel and switch `RitualSurfaceView` only after parity checks.

- **Risk**: The painter contract could become too abstract before a second backend exists.  
  **Mitigation**: Keep the first contract limited to primitives actually needed by burner and wooden fish layers.

- **Risk**: Renderer-local draw animation could double count or conflict with persisted state.  
  **Mitigation**: Keep durable changes in IPC/local store and use painter animation only for visual interpolation.

- **Risk**: SVG cannot represent true offscreen caching the same way Canvas/Skia can.  
  **Mitigation**: Treat SVG memoization as the first cache strategy and keep cache records backend-neutral.

## Complexity Tracking

No complexity exceptions are required. The planned path adds a painter layer without changing the persistence model, IPC contract for counts, or Spec 005 engine ownership.
