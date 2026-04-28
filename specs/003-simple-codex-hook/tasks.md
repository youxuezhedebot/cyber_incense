# Tasks: Simple Codex Hook

**Input**: Design documents from `/specs/003-simple-codex-hook/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Automated tests are included because this feature modifies user Codex configuration and must prove idempotence, preservation, and fail-open behavior.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files.
- **[Story]**: Which user story the task supports.
- Every implementation task names exact target paths.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare hook-specific files, tests, and shared types.

- [ ] T001 Add Vitest test tooling and scripts to `package.json` and `vite.config.ts`.
- [ ] T002 Create hook runtime source file `hooks/codex-user-prompt-submit.js`.
- [ ] T003 Create hook UI component shell in `src/components/HookStatusCard.tsx`.
- [ ] T004 [P] Extend hook-related types in `src/types/incense.ts`.
- [ ] T005 [P] Create hook preview helper shell in `src/lib/hookPreview.ts`.
- [ ] T006 [P] Create unit test directory `tests/unit/`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add config/path helpers and IPC shells required by all hook stories.

**CRITICAL**: No user story work should begin until this phase is complete.

- [ ] T007 Add Cyber Incense hook and Codex config path helpers in `electron/paths.ts`.
- [ ] T008 Create Codex hooks/config merge helper shell in `electron/codexConfig.ts`.
- [ ] T009 Create hook installer service shell in `electron/hookInstaller.ts`.
- [ ] T010 Extend `electron/localStore.ts` with hook state enable/disable/check updates.
- [ ] T011 Extend `electron/ipc.ts` and `electron/preload.ts` with hook status, preview, enable, and disable channels.
- [ ] T012 Extend `src/store/incenseStore.ts` with hook status and actions.

**Checkpoint**: Hook feature has typed shells but does not modify config yet.

---

## Phase 3: User Story 1 - Preview and Enable the Codex Hook (Priority: P1)

**Goal**: User can preview hook context, confirm enablement, and see enabled status.

**Independent Test**: Preview from settings, confirm enablement, and verify enabled status.

### Tests for User Story 1

- [ ] T013 [P] [US1] Add preview text tests in `tests/unit/hookPreview.test.ts`.
- [ ] T014 [P] [US1] Add hooks.json merge idempotence tests in `tests/unit/codexConfig.test.ts`.
- [ ] T015 [P] [US1] Add config.toml feature-flag update tests in `tests/unit/codexConfig.test.ts`.

### Implementation for User Story 1

- [ ] T016 [US1] Implement non-authoritative preview text in `src/lib/hookPreview.ts`.
- [ ] T017 [US1] Implement hooks.json merge and idempotence in `electron/codexConfig.ts`.
- [ ] T018 [US1] Implement config.toml feature flag updater in `electron/codexConfig.ts`.
- [ ] T019 [US1] Implement backup creation before config edits in `electron/codexConfig.ts`.
- [ ] T020 [US1] Implement hook runtime installation in `electron/hookInstaller.ts`.
- [ ] T021 [US1] Implement `enableCodexHook` orchestration in `electron/hookInstaller.ts`.
- [ ] T022 [US1] Build hook preview/confirmation UI in `src/components/HookStatusCard.tsx`.
- [ ] T023 [US1] Mount hook card in `src/components/SettingsPanel.tsx`.
- [ ] T024 [US1] Validate enable flow with `specs/003-simple-codex-hook/quickstart.md`.

**Checkpoint**: Hook enablement is independently demoable and idempotent.

---

## Phase 4: User Story 2 - Inject Playful Context into Codex (Priority: P1)

**Goal**: Enabled hook emits valid short additional context for `UserPromptSubmit`.

**Independent Test**: Enable hook, run runtime script manually, and inspect valid JSON output.

### Tests for User Story 2

- [ ] T025 [P] [US2] Add valid enabled-state runtime output tests in `tests/unit/hookRuntime.test.ts`.
- [ ] T026 [P] [US2] Add hook output schema validation tests in `tests/unit/hookRuntime.test.ts`.
- [ ] T027 [P] [US2] Add authoritative-language rejection tests in `tests/unit/hookPreview.test.ts`.

### Implementation for User Story 2

- [ ] T028 [US2] Implement state reading and enabled-state check in `hooks/codex-user-prompt-submit.js`.
- [ ] T029 [US2] Implement short context generation in `hooks/codex-user-prompt-submit.js`.
- [ ] T030 [US2] Ensure emitted JSON matches `specs/003-simple-codex-hook/contracts/hook-output.schema.json`.
- [ ] T031 [US2] Ensure context includes incense count, total merit, wooden fish count, and non-authoritative disclaimer.
- [ ] T032 [US2] Validate runtime manually with `node ~/.cyber-incense/hooks/codex-user-prompt-submit.js`.

**Checkpoint**: Hook runtime output is independently verifiable.

---

## Phase 5: User Story 3 - Disable the Codex Hook Safely (Priority: P2)

**Goal**: User can disable Cyber Incense without removing unrelated Codex hooks.

**Independent Test**: Enable, disable, verify Cyber Incense stops contributing context and unrelated config remains.

### Tests for User Story 3

- [ ] T033 [P] [US3] Add disable-only-cyber-incense tests in `tests/unit/codexConfig.test.ts`.
- [ ] T034 [P] [US3] Add unrelated-hook preservation tests in `tests/unit/codexConfig.test.ts`.
- [ ] T035 [P] [US3] Add installer disable orchestration tests in `tests/unit/hookInstaller.test.ts`.

### Implementation for User Story 3

- [ ] T036 [US3] Implement Cyber Incense hook removal helper in `electron/codexConfig.ts`.
- [ ] T037 [US3] Implement `disableCodexHook` orchestration in `electron/hookInstaller.ts`.
- [ ] T038 [US3] Update `electron/localStore.ts` to set `codexHook.enabled` false on disable.
- [ ] T039 [US3] Wire disable action in `src/components/HookStatusCard.tsx`.
- [ ] T040 [US3] Validate disable flow with `specs/003-simple-codex-hook/quickstart.md`.

**Checkpoint**: Disable is independently demoable and preserves unrelated hooks.

---

## Phase 6: User Story 4 - Fail Open on Hook Problems (Priority: P2)

**Goal**: Missing, corrupted, or disabled Cyber Incense state never blocks Codex.

**Independent Test**: Run hook runtime with missing, corrupted, and disabled state; confirm successful silent exit.

### Tests for User Story 4

- [ ] T041 [P] [US4] Add missing-state silent-exit test in `tests/unit/hookRuntime.test.ts`.
- [ ] T042 [P] [US4] Add corrupted-state silent-exit test in `tests/unit/hookRuntime.test.ts`.
- [ ] T043 [P] [US4] Add disabled-state silent-exit test in `tests/unit/hookRuntime.test.ts`.
- [ ] T044 [P] [US4] Add invalid Codex config no-overwrite test in `tests/unit/codexConfig.test.ts`.

### Implementation for User Story 4

- [ ] T045 [US4] Harden `hooks/codex-user-prompt-submit.js` with catch-all silent failure behavior.
- [ ] T046 [US4] Harden `electron/codexConfig.ts` to reject invalid JSON without overwriting it.
- [ ] T047 [US4] Return user-understandable config errors from `electron/hookInstaller.ts`.
- [ ] T048 [US4] Display hook error states in `src/components/HookStatusCard.tsx`.
- [ ] T049 [US4] Validate fail-open cases with `specs/003-simple-codex-hook/quickstart.md`.

**Checkpoint**: Failure behavior is independently verifiable.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final verification for Spec 003 and safety checks.

- [ ] T050 Run `npm run test -- --run tests/unit/hookRuntime.test.ts tests/unit/codexConfig.test.ts tests/unit/hookInstaller.test.ts tests/unit/hookPreview.test.ts`.
- [ ] T051 Run `npm run typecheck` and fix type errors in touched files.
- [ ] T052 Run `npm run build` and fix production build errors.
- [ ] T053 Run `npm run dev` and complete all manual checks in `specs/003-simple-codex-hook/quickstart.md`.
- [ ] T054 Inspect `~/.codex/hooks.json` before and after disable to confirm unrelated hooks remain.
- [ ] T055 Update [ROADMAP.md](../../ROADMAP.md) if hook scope or safety behavior changed.

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 Setup has no dependencies beyond completed Specs 001 and 002.
- Phase 2 Foundational depends on Setup and blocks all hook stories.
- US1 and US2 are both P1; US1 installer work should land before full manual US2 runtime validation.
- US3 depends on hook merge/install behavior from US1.
- US4 hardening depends on runtime/config helpers from US1-US3.

### User Story Dependencies

- **US1 Preview and Enable**: after Foundational.
- **US2 Inject Context**: after Foundational; manual install validation depends on US1.
- **US3 Disable Safely**: after US1.
- **US4 Fail Open**: after runtime and config helpers exist.

### Parallel Opportunities

- T004-T006 can run in parallel.
- T013-T015 can run in parallel before US1 implementation.
- T025-T027 can run in parallel before US2 implementation.
- T033-T035 can run in parallel before US3 implementation.
- T041-T044 can run in parallel before US4 implementation.

## Implementation Strategy

### MVP First

1. Complete Setup and Foundational phases.
2. Implement US1 enable flow with tests.
3. Implement US2 runtime output with tests.
4. Stop and validate manual hook output.

### Incremental Delivery

1. Add safe disable.
2. Add fail-open hardening.
3. Run full tests, typecheck, build, and manual quickstart.
