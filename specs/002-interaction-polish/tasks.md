# Tasks: Cyber Incense Interaction Polish

**Input**: Design documents from `/specs/002-interaction-polish/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: No automated tests were explicitly requested for this feature. Validation tasks use typecheck, build, and quickstart/manual checks.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files.
- **[Story]**: Which user story the task supports.
- Every implementation task names exact target paths.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare shared files and assets for polish work.

- [ ] T001 Create shared copy and level helpers in `src/lib/blessings.ts` and `src/lib/levels.ts`.
- [ ] T002 [P] Create reusable UI controls in `src/components/IconButton.tsx` and `src/components/ToggleRow.tsx`.
- [ ] T003 [P] Add sound asset placeholder or generated soft sound at `assets/sounds/muyu-soft.mp3`.
- [ ] T004 Update shared state types in `src/types/incense.ts` for settings, wooden fish action results, and export results.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add main-process actions and renderer store support required by all polish stories.

**CRITICAL**: No user story work should begin until this phase is complete.

- [ ] T005 Extend `electron/localStore.ts` with `knockMuyu`, `updateSettings`, `resetToday`, `resetAll`, and `exportState` transitions.
- [ ] T006 Extend `electron/ipc.ts` with handlers for polished ritual actions, settings updates, reset, and export.
- [ ] T007 Extend `electron/preload.ts` with typed renderer APIs for Spec 002 actions.
- [ ] T008 Extend `src/store/incenseStore.ts` with wooden fish, settings, reset, export, and action-feedback state.
- [ ] T009 Ensure `electron/localStore.ts` migrates missing Spec 002 fields without breaking existing Spec 001 state.

**Checkpoint**: Renderer can call all new actions through the preload bridge.

---

## Phase 3: User Story 1 - Enjoy a More Satisfying Incense Action (Priority: P1)

**Goal**: "上香" feels smooth, immediate, and stable during repeated use.

**Independent Test**: Click "上香" once and rapidly 10 times; counts remain correct and layout remains stable.

### Implementation for User Story 1

- [ ] T010 [US1] Refine smoke timing and intensity behavior in `src/components/SmokeLayer.tsx`.
- [ ] T011 [US1] Refine burner glow and lit-stick feedback in `src/components/IncenseBurner.tsx`.
- [ ] T012 [US1] Add action pulse coordination in `src/components/IncenseScene.tsx`.
- [ ] T013 [US1] Add animated count/blessing updates in `src/components/StatsPanel.tsx` and `src/components/BlessingBanner.tsx`.
- [ ] T014 [US1] Stabilize button dimensions and pressed states in `src/components/RitualActions.tsx`.
- [ ] T015 [US1] Add responsive minimum-window styling in `src/styles/globals.css`.
- [ ] T016 [US1] Validate rapid "上香" behavior with `specs/002-interaction-polish/quickstart.md`.

**Checkpoint**: Polished incense action is independently demoable.

---

## Phase 4: User Story 2 - Knock the Wooden Fish (Priority: P1)

**Goal**: User can perform a second ritual with persisted wooden fish count and satisfying feedback.

**Independent Test**: Click "敲木鱼", verify count/message, restart, and verify count persists.

### Implementation for User Story 2

- [ ] T017 [P] [US2] Create wooden fish visual/control in `src/components/WoodenFish.tsx`.
- [ ] T018 [P] [US2] Create floating merit feedback in `src/components/FloatingMerit.tsx`.
- [ ] T019 [US2] Add "敲木鱼" control to `src/components/RitualActions.tsx`.
- [ ] T020 [US2] Connect `knockMuyu` action in `src/store/incenseStore.ts`.
- [ ] T021 [US2] Display wooden fish count in `src/components/StatsPanel.tsx`.
- [ ] T022 [US2] Add wooden fish tray menu action in `electron/tray.ts`.
- [ ] T023 [US2] Validate wooden fish persistence with `specs/002-interaction-polish/quickstart.md`.

**Checkpoint**: Wooden fish ritual is independently demoable.

---

## Phase 5: User Story 3 - Control Sound and Settings (Priority: P2)

**Goal**: User can control sound/settings, reset local state, and export JSON.

**Independent Test**: Toggle sound, reset today, reset all, and export state from settings.

### Implementation for User Story 3

- [ ] T024 [US3] Create compact settings panel in `src/components/SettingsPanel.tsx`.
- [ ] T025 [US3] Add sound toggle behavior in `src/components/SettingsPanel.tsx`.
- [ ] T026 [US3] Add optional wooden fish sound playback in `src/components/WoodenFish.tsx`.
- [ ] T027 [US3] Add compact mode toggle behavior in `src/components/SettingsPanel.tsx` and `src/App.tsx`.
- [ ] T028 [US3] Add reset-today confirmation and action in `src/components/SettingsPanel.tsx`.
- [ ] T029 [US3] Add reset-all confirmation and action in `src/components/SettingsPanel.tsx`.
- [ ] T030 [US3] Add export-state action in `src/components/SettingsPanel.tsx`.
- [ ] T031 [US3] Implement native or JSON-return export behavior in `electron/ipc.ts`.
- [ ] T032 [US3] Validate settings, sound, reset, and export with `specs/002-interaction-polish/quickstart.md`.

**Checkpoint**: Settings controls are independently demoable.

---

## Phase 6: User Story 4 - Understand Ritual Progress (Priority: P3)

**Goal**: User sees clear progress levels and varied short copy over repeated use.

**Independent Test**: Cross level thresholds and verify label/copy updates.

### Implementation for User Story 4

- [ ] T033 [US4] Implement blessing level thresholds in `src/lib/levels.ts`.
- [ ] T034 [US4] Implement incense blessing and wooden fish message pools in `src/lib/blessings.ts`.
- [ ] T035 [US4] Use level labels in `src/components/StatsPanel.tsx`.
- [ ] T036 [US4] Use varied copy in `src/components/BlessingBanner.tsx` and `src/components/WoodenFish.tsx`.
- [ ] T037 [US4] Confirm long copy truncation/wrapping in `src/styles/globals.css`.
- [ ] T038 [US4] Validate level/copy behavior with `specs/002-interaction-polish/quickstart.md`.

**Checkpoint**: Progress feedback is independently demoable.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final verification for Spec 002 and guardrails against hook scope creep.

- [ ] T039 Run `npm run typecheck` and fix type errors in touched files.
- [ ] T040 Run `npm run build` and fix production build errors.
- [ ] T041 Run `npm run dev` and complete all manual checks in `specs/002-interaction-polish/quickstart.md`.
- [ ] T042 Confirm no Cyber Incense hook files or Codex configuration changes exist under `~/.codex`.
- [ ] T043 Update [ROADMAP.md](../../ROADMAP.md) if Spec 002 scope changed.

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 Setup has no dependencies beyond completed Spec 001.
- Phase 2 Foundational depends on Phase 1 and blocks all user stories.
- US1 and US2 are both P1 and can proceed after Foundational.
- US3 depends on settings/store support from Foundational and can integrate with US2 sound.
- US4 depends on copy/level helpers and can proceed after US1/US2 are stable.

### User Story Dependencies

- **US1 Incense Polish**: after Foundational.
- **US2 Wooden Fish**: after Foundational.
- **US3 Settings**: after Foundational; sound playback depends on US2 visual/control.
- **US4 Progress**: after copy/level helpers exist; integrates into US1/US2 displays.

### Parallel Opportunities

- T001-T004 can run in parallel except type updates should be reviewed before store work.
- T010-T015 can be split by component.
- T017 and T018 can run in parallel.
- T024-T031 should be mostly sequential because settings actions share one panel.

## Implementation Strategy

### MVP First

1. Complete Setup and Foundational phases.
2. Complete US1 and US2.
3. Stop and validate repeated ritual use.

### Incremental Delivery

1. Add settings and export/reset controls.
2. Add copy/level polish.
3. Run final typecheck/build/manual checks.
