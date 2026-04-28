# Tasks: Stateful Ritual Rendering Engine

**Input**: Design documents from `/specs/005-stateful-ritual-rendering/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Add focused engine smoke tests if the project test harness exists. Otherwise validate with typecheck, build, deterministic scripts, and manual quickstart checks.

**Organization**: Tasks are grouped by story and implementation phase so the engine can be introduced without rewriting every visual component at once.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files.
- **[Story]**: Which user story the task supports.
- Every implementation task names likely target paths.

## Phase 1: Setup And Types

**Purpose**: Add runtime simulation types and helper boundaries.

- [x] T001 Create simulation runtime types in `src/types/ritualSimulation.ts`.
- [x] T002 [P] Add normalized geometry helpers in `src/lib/ritualGeometry.ts`.
- [x] T003 [P] Add deterministic hash/random helpers in `src/lib/ritualRandom.ts`.
- [x] T004 Extend visual settings types in `src/types/incense.ts` only if new configurable caps or durations are needed.
- [x] T005 Add default ritual simulation config in `src/lib/ritualEngine.ts`.

---

## Phase 2: Foundational Engine

**Purpose**: Introduce engine ownership of state update and interaction handling.

**CRITICAL**: Rendering components should not migrate until the engine can produce stable snapshots.

- [x] T006 Create `RitualEngine` in `src/lib/ritualEngine.ts` with `update`, `offerIncense`, `hitMuyu`, `getSnapshot`, and `toSaveData`.
- [x] T007 Implement engine initialization from existing `IncenseState`.
- [x] T008 Implement safe `dt` clamping and runtime particle cleanup.
- [x] T009 Add deterministic smoke-test script or unit coverage for seeded random output.
- [x] T010 Validate that creating an engine does not mutate existing persisted app state.

**Checkpoint**: A developer can create an engine, advance time, and inspect a read-only snapshot.

---

## Phase 3: User Story 1 - Render Ritual Objects From Simulation State (Priority: P1)

**Goal**: Existing object components can consume engine snapshots.

**Independent Test**: Open the ritual surface, interact with both objects, and verify state-driven redraws.

- [x] T011 [US1] Add a renderer-local engine lifecycle hook in `src/views/RitualSurfaceView.tsx` or a new `src/lib/useRitualEngine.ts`.
- [x] T012 [US1] Wire animation frame updates to `engine.update(dt, now)` with idle-friendly behavior.
- [x] T013 [US1] Pass engine snapshots into incense and wooden fish components.
- [x] T014 [US1] Keep click targets accessible and mapped to normalized object coordinates.
- [x] T015 [US1] Ensure existing IPC actions remain count-authoritative while engine visuals respond immediately.

**Checkpoint**: Ritual objects are drawn from engine snapshots, not only from pulse ids.

---

## Phase 4: User Story 2 - Incense Simulation (Priority: P1)

**Goal**: Incense placement, burn progress, ash, smoke, and LOD are engine-driven.

**Independent Test**: Reset count, offer multiple sticks, observe stable placement, burning, smoke, and ash accumulation.

- [x] T016 [P] [US2] Implement ash-bed ellipse helpers in `src/lib/ritualGeometry.ts`.
- [x] T017 [US2] Implement `createIncenseStick` and seeded slot search in `src/lib/ritualEngine.ts`.
- [x] T018 [US2] Implement burn progress and ember point updates.
- [x] T019 [US2] Implement ash threshold generation and ash mass accumulation.
- [x] T020 [US2] Implement smoke and spark particle creation near ember points.
- [x] T021 [US2] Implement visible-stick LOD and stable sampling.
- [x] T022 [US2] Update `src/components/incense/FloatingIncenseSurface.tsx` to render engine stick/ash/smoke state.
- [x] T023 [US2] Preserve or adapt existing `IncenseBasin`, `IncenseStick`, `AshLayer`, and `BurnEffects` components to the new state shape.
- [x] T024 [US2] Validate rapid incense clicks and completed burn aggregation.

**Checkpoint**: Incense lifecycle is independently demoable from state.

---

## Phase 5: User Story 3 - Wooden Fish Simulation (Priority: P1)

**Goal**: Wooden fish knocks produce spring motion, traces, shockwaves, and optional damage.

**Independent Test**: Click center, edge, and rapid combos; verify strength and trace differences.

- [x] T025 [P] [US3] Implement `computeHitStrength`, `applyMuyuImpulse`, and spring update in `src/lib/ritualEngine.ts`.
- [x] T026 [US3] Implement hit trace creation, aging, alpha, radius, and removal.
- [x] T027 [US3] Implement shockwave creation and decay.
- [ ] T028 [US3] Add optional damage map helpers behind config or internal feature gates.
- [x] T029 [US3] Update `src/components/muyu/WoodenFishObject.tsx` to render snapshot motion, traces, and shockwaves.
- [x] T030 [US3] Preserve existing fail-open sound behavior and settings toggle.
- [x] T031 [US3] Validate trace cap, fade, and rapid-hit behavior.

**Checkpoint**: Wooden fish object has its own tactile simulation.

---

## Phase 6: User Story 4 - LOD And High Counts (Priority: P2)

**Goal**: High counts remain readable and performant.

**Independent Test**: Simulate high counts and verify capped draw counts.

- [x] T032 [US4] Implement `getVisibleStickLimit` and stable visible-stick sampling.
- [x] T033 [US4] Map hidden incense history into ash height, stub density, soot, or aggregate marks.
- [x] T034 [US4] Cap smoke, sparks, ash fragments, traces, and shockwaves.
- [x] T035 [US4] Extend `src/lib/ritualVisuals.ts` or replace internals with engine snapshot summaries.
- [ ] T036 [US4] Add high-count manual validation notes to `quickstart.md` if behavior changes.

**Checkpoint**: 100+ counts are represented without unbounded nodes or visual clutter.

---

## Phase 7: User Story 5 - Persistence And Restore (Priority: P2)

**Goal**: Restore coherent visual state from durable event history.

**Independent Test**: Quit mid-burn and reopen.

- [x] T037 [US5] Define persisted `RitualSaveData` location and migration behavior.
- [x] T038 [US5] Extend `electron/localStore.ts` normalization only after save shape is finalized.
- [x] T039 [US5] Reconstruct active burns from `createdAt`, `seed`, and configured duration.
- [x] T040 [US5] Reconstruct surviving wooden fish traces from hit history and elapsed time.
- [x] T041 [US5] Ensure transient particles are not persisted.
- [x] T042 [US5] Validate Spec 004 count-only migration.

**Checkpoint**: Restart restore works without storing particles.

---

## Phase 8: Polish And Verification

- [x] T043 Run `npm run typecheck` and fix type errors in touched files.
- [x] T044 Run `npm run build` and fix production build errors.
- [ ] T045 Run `npm run dev` and complete manual checks in `specs/005-stateful-ritual-rendering/quickstart.md`.
- [ ] T046 Verify no Codex hook files or Codex configuration entries are created or modified.
- [ ] T047 Update [ROADMAP.md](../../ROADMAP.md) if Spec 005 changes implementation order.

## Dependencies & Execution Order

- Phase 1 blocks all implementation.
- Phase 2 blocks renderer migration.
- Incense and wooden fish simulations can proceed in parallel after the foundational engine exists.
- Persistence should follow stable runtime behavior.
- High-count LOD should be validated before final visual polish.

## Parallel Opportunities

- T002 and T003 can run in parallel.
- T016 and T025 can run in parallel after foundational engine setup.
- Component adaptation for incense and wooden fish can be split if their write scopes are kept separate.
- Quickstart/manual validation can be prepared while implementation is underway.
