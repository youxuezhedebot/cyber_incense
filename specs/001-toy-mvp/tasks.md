# Tasks: Cyber Incense Toy MVP

**Input**: Design documents from `/specs/001-toy-mvp/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: No automated tests were explicitly requested for this feature. Validation tasks use typecheck, build, and quickstart/manual checks.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files.
- **[Story]**: Which user story the task supports.
- Every implementation task names exact target paths.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the desktop project and renderer build pipeline.

- [ ] T001 Create `package.json` with Electron, React, Vite, TypeScript, Tailwind CSS, Framer Motion, lucide-react, and development scripts.
- [ ] T002 [P] Create TypeScript configs in `tsconfig.json` and `tsconfig.node.json`.
- [ ] T003 [P] Create Vite config in `vite.config.ts`.
- [ ] T004 [P] Create Tailwind/PostCSS configs in `tailwind.config.js` and `postcss.config.js`.
- [ ] T005 Create renderer entry files `index.html`, `src/main.tsx`, `src/App.tsx`, and `src/styles/globals.css`.
- [ ] T006 Create asset placeholders `assets/tray-icon.png` and `assets/tray-icon-lit.png`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared types, preload boundary, and Electron app shell used by all stories.

**CRITICAL**: No user story work should begin until this phase is complete.

- [ ] T007 Create shared ritual state types in `src/types/incense.ts`.
- [ ] T008 Create path helpers for app-owned state locations in `electron/paths.ts`.
- [ ] T009 Create safe local state defaults and normalization helpers in `electron/localStore.ts`.
- [ ] T010 Create Electron preload API surface in `electron/preload.ts`.
- [ ] T011 Create IPC registration shell in `electron/ipc.ts`.
- [ ] T012 Create main process startup shell in `electron/main.ts`.
- [ ] T013 Create browser window lifecycle helper in `electron/window.ts`.

**Checkpoint**: Project can typecheck enough for feature work to start.

---

## Phase 3: User Story 1 - Open the Tray Toy (Priority: P1)

**Goal**: User can launch the app, see the tray/menu-bar entry, open/hide the window, and quit explicitly.

**Independent Test**: Launch the app, click tray, close window, reopen from tray, then quit from tray.

### Implementation for User Story 1

- [ ] T014 [US1] Implement tray creation, click toggle, and context menu in `electron/tray.ts`.
- [ ] T015 [US1] Wire `electron/main.ts` to create the tray and window without showing duplicate windows.
- [ ] T016 [US1] Implement close-to-hide behavior in `electron/window.ts`.
- [ ] T017 [US1] Add initial app shell layout in `src/App.tsx`.
- [ ] T018 [P] [US1] Create stats display component in `src/components/StatsPanel.tsx`.
- [ ] T019 [P] [US1] Create basic action row component in `src/components/RitualActions.tsx`.
- [ ] T020 [US1] Validate US1 manually using `/specs/001-toy-mvp/quickstart.md`.

**Checkpoint**: Tray app behavior is independently demoable.

---

## Phase 4: User Story 2 - Offer Incense (Priority: P1)

**Goal**: User clicks "上香" and immediately sees updated counts, blessing text, and incense feedback.

**Independent Test**: Open the window, click "上香" once, and verify count, blessing, and visual response.

### Implementation for User Story 2

- [ ] T021 [US2] Implement `offerIncense` state transition in `electron/localStore.ts`.
- [ ] T022 [US2] Register `getState`, `offerIncense`, and `stateChanged` IPC behavior in `electron/ipc.ts`.
- [ ] T023 [US2] Expose typed renderer API from `electron/preload.ts`.
- [ ] T024 [US2] Create renderer state hook/store in `src/store/incenseStore.ts`.
- [ ] T025 [P] [US2] Create blessing banner component in `src/components/BlessingBanner.tsx`.
- [ ] T026 [P] [US2] Create incense burner component in `src/components/IncenseBurner.tsx`.
- [ ] T027 [P] [US2] Create smoke layer component in `src/components/SmokeLayer.tsx`.
- [ ] T028 [US2] Compose burner, smoke, glow, and counts in `src/components/IncenseScene.tsx`.
- [ ] T029 [US2] Connect "上香" button in `src/components/RitualActions.tsx` to renderer store action.
- [ ] T030 [US2] Connect tray "上香" menu item in `electron/tray.ts` to the same main-process state transition.
- [ ] T031 [US2] Validate US2 manually using `/specs/001-toy-mvp/quickstart.md`.

**Checkpoint**: Core "上香" loop is independently demoable.

---

## Phase 5: User Story 3 - Keep Local Counts (Priority: P2)

**Goal**: Counts persist across restarts and daily count resets only on a new local date.

**Independent Test**: Offer incense, restart, verify persistence, simulate a new date, verify daily reset.

### Implementation for User Story 3

- [ ] T032 [US3] Implement state file read/write at `~/.cyber-incense/state.json` in `electron/localStore.ts`.
- [ ] T033 [US3] Implement current-local-date comparison and daily reset in `electron/localStore.ts`.
- [ ] T034 [US3] Ensure app startup loads normalized persisted state in `electron/main.ts`.
- [ ] T035 [US3] Ensure renderer initial load displays persisted state through `src/store/incenseStore.ts`.
- [ ] T036 [US3] Validate restart persistence and daily reset using `/specs/001-toy-mvp/quickstart.md`.

**Checkpoint**: Local continuity is independently demoable.

---

## Phase 6: User Story 4 - Recover from Local State Problems (Priority: P3)

**Goal**: Missing or corrupted state never crashes the app.

**Independent Test**: Delete or corrupt state file, relaunch, and verify default state.

### Implementation for User Story 4

- [ ] T037 [US4] Implement missing-file default creation in `electron/localStore.ts`.
- [ ] T038 [US4] Implement corrupted JSON recovery and optional backup naming in `electron/localStore.ts`.
- [ ] T039 [US4] Surface safe default state to renderer after recovery in `electron/ipc.ts`.
- [ ] T040 [US4] Validate missing and corrupted state recovery using `/specs/001-toy-mvp/quickstart.md`.

**Checkpoint**: Recovery behavior is independently demoable.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final verification for Spec 001 and guardrails against scope creep.

- [ ] T041 Run `npm run typecheck` and fix any type errors in project source files.
- [ ] T042 Run `npm run build` and fix any production build errors.
- [ ] T043 Run `npm run dev` and complete all manual checks in `specs/001-toy-mvp/quickstart.md`.
- [ ] T044 Confirm no Cyber Incense hook files or Codex configuration changes exist under `~/.codex`.
- [ ] T045 Update [ROADMAP.md](../../ROADMAP.md) if any Spec 001 scope assumptions changed.

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 Setup has no dependencies.
- Phase 2 Foundational depends on Phase 1 and blocks all user stories.
- US1 and US2 are both P1; implement US1 first because it creates the app surface for US2.
- US3 depends on the state transition from US2.
- US4 depends on the persistence layer from US3.
- Final polish depends on desired stories being complete.

### User Story Dependencies

- **US1 Open the Tray Toy**: after Foundational.
- **US2 Offer Incense**: after Foundational; easiest after US1.
- **US3 Keep Local Counts**: after US2.
- **US4 Recover from Local State Problems**: after US3.

### Parallel Opportunities

- T002-T004 can run in parallel.
- T018 and T019 can run in parallel.
- T025-T027 can run in parallel.
- Manual validation tasks must run after their story implementation tasks.

## Implementation Strategy

### MVP First

1. Complete Setup and Foundational phases.
2. Complete US1 tray behavior.
3. Complete US2 "上香" loop.
4. Stop and validate the tray toy manually.

### Incremental Delivery

1. Add persistence with US3.
2. Add recovery with US4.
3. Run final typecheck/build/manual checks.
