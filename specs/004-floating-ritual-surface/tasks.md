# Tasks: Floating Ritual Surface

**Input**: Design documents from `/specs/004-floating-ritual-surface/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: No automated tests were explicitly requested for this feature. Validation tasks use typecheck, build, manual window checks, state smoke checks, and quickstart/manual checks.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files.
- **[Story]**: Which user story the task supports.
- Every implementation task names exact target paths.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare view split, visual helpers, and state type extensions.

- [ ] T001 Update shared state types in `src/types/incense.ts` with `RitualWindowSettings`, `RitualVisualSettings`, and visual summary types.
- [ ] T002 Create visual derivation helpers in `src/lib/ritualVisuals.ts`.
- [ ] T003 Create window mode helpers in `src/lib/windowMode.ts`.
- [ ] T004 [P] Create `src/views/RitualSurfaceView.tsx`.
- [ ] T005 [P] Create `src/views/SettingsView.tsx`.
- [ ] T006 Update `src/App.tsx` to select ritual or settings view from launch context.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Split window behavior and migrate local state safely.

**CRITICAL**: No user story work should begin until this phase is complete.

- [ ] T007 Extend `electron/localStore.ts` defaults and normalization for `window` and `visuals`.
- [ ] T008 Extend `electron/ipcChannels.ts` with `getWindowSettings`, `updateWindowSettings`, and `openSettings`.
- [ ] T009 Extend `electron/ipc.ts` with window settings handlers and broadcasts.
- [ ] T010 Extend `electron/preload.ts` with typed renderer APIs from `contracts/window-settings-api.md`.
- [ ] T011 Refactor `electron/window.ts` to manage separate ritual and settings windows.
- [ ] T012 Update `electron/tray.ts` menu items for opening ritual surface, opening settings, and toggling fixed-on-top.
- [ ] T013 Extend `src/store/incenseStore.ts` with window/visual settings actions.
- [ ] T014 Validate migration from existing Spec 001/002 state.

**Checkpoint**: App can open a ritual window and a separate settings window without losing existing counters.

---

## Phase 3: User Story 1 - Use a Floating Ritual Object (Priority: P1)

**Goal**: Main surface feels like a floating desktop object and can be pinned above other windows.

**Independent Test**: Open ritual surface, toggle fixed-on-top, focus other windows, toggle off.

### Implementation for User Story 1

- [ ] T015 [US1] Make ritual surface frameless/compact/floating in `electron/window.ts`.
- [ ] T016 [US1] Apply `alwaysOnTop` immediately to the ritual surface in `electron/window.ts`.
- [ ] T017 [US1] Persist ritual surface position best-effort in `electron/window.ts` and `electron/localStore.ts`.
- [ ] T018 [US1] Build object-first shell in `src/views/RitualSurfaceView.tsx`.
- [ ] T019 [US1] Remove dashboard-style stats dominance from ritual surface in `src/views/RitualSurfaceView.tsx`.
- [ ] T020 [US1] Validate floating and fixed-on-top behavior with `specs/004-floating-ritual-surface/quickstart.md`.

**Checkpoint**: Floating pinned ritual object is independently demoable.

---

## Phase 4: User Story 2 - Offer Incense as a Visual Cycle (Priority: P1)

**Goal**: Incense count is represented through drawn incense and ash lifecycle.

**Independent Test**: Reset all, see empty burner, click "上香", watch ignite/place/burn/ash, then rapid click 10 times.

### Implementation for User Story 2

- [ ] T021 [P] [US2] Create refined burner basin in `src/components/incense/IncenseBasin.tsx`.
- [ ] T022 [P] [US2] Create incense stick lifecycle component in `src/components/incense/IncenseStick.tsx`.
- [ ] T023 [P] [US2] Create ash representation in `src/components/incense/AshLayer.tsx`.
- [ ] T024 [P] [US2] Create burn/spark/smoke effects in `src/components/incense/BurnEffects.tsx`.
- [ ] T025 [US2] Compose object surface in `src/components/incense/FloatingIncenseSurface.tsx`.
- [ ] T026 [US2] Create grouped visual count/tally in `src/components/incense/IncenseTally.tsx`.
- [ ] T027 [US2] Connect `offerIncense` to visual cycle creation in `src/views/RitualSurfaceView.tsx`.
- [ ] T028 [US2] Ensure default zero-count state renders no incense sticks.
- [ ] T029 [US2] Cap high count visuals using `src/lib/ritualVisuals.ts`.
- [ ] T030 [US2] Validate incense visual cycle with `specs/004-floating-ritual-surface/quickstart.md`.

**Checkpoint**: Incense lifecycle is independently demoable.

---

## Phase 5: User Story 3 - Use a Separate Settings Window (Priority: P1)

**Goal**: Settings controls are moved out of the ritual object.

**Independent Test**: Open settings separately, toggle preferences, verify ritual surface remains object-focused.

### Implementation for User Story 3

- [ ] T031 [US3] Move settings controls from `src/components/SettingsPanel.tsx` into `src/views/SettingsView.tsx`.
- [ ] T032 [US3] Add fixed-on-top toggle to `src/views/SettingsView.tsx`.
- [ ] T033 [US3] Keep reset today/reset all/export in `src/views/SettingsView.tsx`.
- [ ] T034 [US3] Add tray/menu affordance for settings in `electron/tray.ts`.
- [ ] T035 [US3] Remove embedded settings panel from `src/App.tsx` or `src/views/RitualSurfaceView.tsx`.
- [ ] T036 [US3] Validate separate settings behavior with `specs/004-floating-ritual-surface/quickstart.md`.

**Checkpoint**: Settings are independently demoable and visually separate.

---

## Phase 6: User Story 4 - Knock a Distinct Wooden Fish Object (Priority: P2)

**Goal**: Wooden fish uses its own object style, count marks, strike effect, and floating `+1`.

**Independent Test**: Click wooden fish repeatedly; count persists and visual style remains distinct from incense.

### Implementation for User Story 4

- [ ] T037 [P] [US4] Create wooden fish object in `src/components/muyu/WoodenFishObject.tsx`.
- [ ] T038 [P] [US4] Create strike/ripple effect in `src/components/muyu/KnockEffect.tsx`.
- [ ] T039 [P] [US4] Create count mark system in `src/components/muyu/MuyuMarks.tsx`.
- [ ] T040 [US4] Connect `knockMuyu` action and floating `+1` in `src/views/RitualSurfaceView.tsx`.
- [ ] T041 [US4] Cap high wooden fish count visuals using `src/lib/ritualVisuals.ts`.
- [ ] T042 [US4] Validate wooden fish visuals with `specs/004-floating-ritual-surface/quickstart.md`.

**Checkpoint**: Wooden fish object is independently demoable.

---

## Phase 7: User Story 5 - Keep the Floating Toy Lightweight (Priority: P2)

**Goal**: The floating surface stays smooth and low-distraction during work.

**Independent Test**: Idle, rapid actions, high counts, minimum size.

### Implementation for User Story 5

- [ ] T043 [US5] Pause or reduce nonessential idle animation in `src/components/incense/BurnEffects.tsx`.
- [ ] T044 [US5] Ensure visual nodes are capped and aggregated in `src/lib/ritualVisuals.ts`.
- [ ] T045 [US5] Stabilize dimensions and overflow in `src/styles/globals.css`.
- [ ] T046 [US5] Add manual high-count smoke test script or command notes in `specs/004-floating-ritual-surface/quickstart.md`.
- [ ] T047 [US5] Validate minimum-size and high-count behavior.

**Checkpoint**: Floating toy remains usable during long sessions.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final verification for Spec 004 and guardrails against hook scope creep.

- [ ] T048 Run `npm run typecheck` and fix type errors in touched files.
- [ ] T049 Run `npm run build` and fix production build errors.
- [ ] T050 Run `npm run dev` and complete manual checks in `specs/004-floating-ritual-surface/quickstart.md`.
- [ ] T051 Perform local state smoke checks for migration, rapid incense, rapid wooden fish, reset, and export.
- [ ] T052 Confirm no Cyber Incense hook files or Codex configuration changes exist under `~/.codex`.
- [ ] T053 Update [ROADMAP.md](../../ROADMAP.md) if Spec 004 scope assumptions change.

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 Setup has no dependencies beyond completed Specs 001 and 002.
- Phase 2 Foundational depends on Phase 1 and blocks all user stories.
- US1, US2, and US3 are P1 and should be implemented in that order: window shape first, incense object second, settings separation third.
- US4 depends on the ritual surface shell from US1.
- US5 depends on US2 and US4 visual systems.

### User Story Dependencies

- **US1 Floating Ritual Object**: after Foundational.
- **US2 Incense Visual Cycle**: after Foundational; easiest after US1 shell exists.
- **US3 Separate Settings**: after Foundational; can proceed in parallel with visual components once view split exists.
- **US4 Wooden Fish Object**: after US1 shell.
- **US5 Performance**: after US2/US4 visuals exist.

### Parallel Opportunities

- T004 and T005 can be created in parallel.
- T021-T024 can be split by visual component.
- T037-T039 can be split by wooden fish visual component.
- Manual validation tasks must run after their story implementation tasks.

## Implementation Strategy

### MVP First

1. Complete setup and foundational phases.
2. Implement floating ritual surface and always-on-top.
3. Implement refined incense lifecycle.
4. Separate settings into its own window.
5. Stop and validate the main experience before wooden fish polish.

### Incremental Delivery

1. Add wooden fish visual object.
2. Add high-count aggregation and idle performance tuning.
3. Run final typecheck/build/manual checks.
