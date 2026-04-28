# Tasks: Desktop Release Packaging

**Input**: Design documents from `/specs/007-desktop-release-packaging/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/release-workflow.md  

**Tests**: Use `npm run typecheck`, `npm run build`, `npm run smoke:ritual-engine`, local `dist:*` commands, and manual packaged-app smoke checks.

**Organization**: Tasks are grouped by release pipeline phase. The first implementation target is unsigned macOS and Windows packaging with GitHub Release upload.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files.
- **[Story]**: Which user story the task supports.
- Each task names likely target paths.

## Phase 1: Packaging Toolchain

**Purpose**: Add a minimal Electron packaging baseline without changing app runtime behavior.

- [x] T001 [US1] Add `electron-builder` as a dev dependency in `package.json` and update the lockfile.
- [x] T002 [US1] Add `electron-builder.yml` with app id, product name, output directory, artifact naming, included files, and unsigned-friendly defaults.
- [x] T003 [P] [US1] Inspect existing icon assets and `scripts/generate-icons.mjs`; create or document required `.icns`, `.ico`, and PNG icon outputs.
- [x] T004 [US1] Ensure packaged runtime uses compiled `dist/` renderer assets and compiled `dist-electron/` main/preload assets.
- [x] T005 [US4] Configure packaging excludes so specs, source files, tests, local caches, and development-only files are not bundled unnecessarily.

**Checkpoint**: Packaging config exists and production build output is a valid package input.

---

## Phase 2: Local Release Commands

**Purpose**: Provide repeatable developer commands for local artifacts.

- [x] T006 [US1] Add `dist`, `dist:mac`, `dist:win`, and `dist:dir` npm scripts in `package.json`.
- [x] T007 [US1] Run `npm run dist:dir` locally and confirm the unpacked app launches without the Vite dev server.
- [x] T008 [US1] Run `npm run dist:mac` on macOS and confirm DMG/ZIP artifacts are generated.
- [x] T009 [US2] Document that `npm run dist:win` should be validated on Windows or Windows CI rather than assumed from macOS.
- [x] T010 [US4] Verify missing signing credentials do not fail unsigned local packaging.

**Checkpoint**: A maintainer can produce a local macOS package from the repo root.

---

## Phase 3: GitHub Actions Release

**Purpose**: Publish downloadable artifacts from version tags.

- [x] T011 [US3] Create `.github/workflows/release.yml` with tag trigger `v*.*.*` and minimal `contents: write` permission.
- [x] T012 [US3] Add a macOS release job that runs `npm ci`, validation commands, and `npm run dist:mac`.
- [x] T013 [US3] Add a Windows release job that runs `npm ci`, validation commands, and `npm run dist:win`.
- [x] T014 [US3] Upload release artifacts from each platform job to the tag's GitHub Release.
- [x] T015 [US3] Upload package output as workflow artifacts for debugging when release upload fails.
- [x] T016 [US3] Ensure artifact glob patterns only match intended DMG/ZIP/EXE files.

**Checkpoint**: Pushing a version tag starts native platform packaging and release upload.

---

## Phase 4: Release Documentation

**Purpose**: Make release operation and early-user caveats clear.

- [x] T017 [US5] Add release docs at `docs/release.md` or equivalent, covering local macOS packaging, Windows packaging, CI tag release, and artifact locations.
- [x] T018 [US5] Document unsigned macOS Gatekeeper and Windows SmartScreen caveats without implying production signing is complete.
- [x] T019 [US5] Document the packaged-app smoke checklist: launch, tray, incense, wooden fish, settings, persistence, quit/relaunch.
- [x] T020 [US5] Add an early release notes template that states no Codex hook is installed or modified.
- [x] T021 [US4] Document future signing secret names and signing/notarization extension points without making them required.

**Checkpoint**: A maintainer can follow docs to create or verify a downloadable release.

---

## Phase 5: Verification

- [x] T022 Run `npm run typecheck` and fix type errors.
- [x] T023 Run `npm run smoke:ritual-engine` and confirm ritual engine behavior still passes.
- [x] T024 Run `npm run build` and confirm production build still passes.
- [ ] T025 Run local package command on macOS and smoke test the packaged app.
  - Local DMG/ZIP creation and packaged process launch were verified on macOS; full tray click / incense / wooden fish manual smoke remains.
- [ ] T026 Validate Windows packaging in GitHub Actions or on a Windows machine.
  - A Windows EXE was produced by local cross-build on macOS; install/run validation still belongs on Windows or CI.
- [x] T027 Confirm packaged app does not require `VITE_DEV_SERVER_URL`.
- [x] T028 Confirm no Codex hook files or Codex configuration entries are created or modified.
- [x] T029 Confirm release artifacts use the agreed artifact naming pattern.
- [x] T030 Update [ROADMAP.md](../../ROADMAP.md) if Spec 007 changes execution order.

## Dependencies & Execution Order

- Phase 1 blocks all packaging.
- Phase 2 depends on packaging config.
- Phase 3 can start after scripts are defined.
- Phase 4 can proceed in parallel with Phases 2 and 3.
- Phase 5 completes the spec.

## Parallel Opportunities

- T003 can run while T002 is drafted.
- T012 and T013 can be authored in parallel once the workflow skeleton exists.
- T017 through T021 can run in parallel with implementation.

## Notes

- Linux packaging is intentionally deferred unless it falls out cheaply from the selected toolchain.
- Code signing and notarization are extension points, not P1 blockers.
- Auto-update is out of scope.
