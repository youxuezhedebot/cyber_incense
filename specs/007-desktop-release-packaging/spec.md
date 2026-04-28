# Feature Specification: Desktop Release Packaging

**Feature Branch**: `007-desktop-release-packaging`  
**Created**: 2026-04-28  
**Status**: Draft  
**Input**: User request: "接下来如果要把这个打成 dmg 或者 exe 之类的应该怎么处理呢？希望最好是能有个包直接下载运行，可以使用 github ci 之类的？"

## Context

Cyber Incense is currently a local Electron + React app with tray behavior, local state, ritual rendering, settings, and smoke tests. The app can be built from source with `npm run build`, but it does not yet produce user-downloadable desktop installers.

Spec 007 turns the app into a releaseable desktop product:

```txt
Source checkout
├─ npm run build              compile renderer + Electron main/preload
├─ npm run dist:*             package installable desktop artifacts
└─ GitHub Actions tag build   attach DMG/EXE artifacts to a GitHub Release
```

The first release target is pragmatic: unsigned macOS and Windows packages that a developer or early tester can download and run. Code signing, Apple notarization, Windows EV signing, auto-update, and store distribution are explicitly treated as future hardening, not blockers for the first downloadable release.

This feature MUST NOT install or modify Codex hooks. Packaging only distributes the desktop app.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Build A Local macOS Package (Priority: P1)

A developer on macOS can create a local `.dmg` package and launch the packaged Cyber Incense app without running the Vite dev server.

**Why this priority**: The project is being developed on macOS, and a DMG is the fastest way to validate a real desktop artifact.

**Independent Test**: Run the packaging command on macOS, open the generated DMG/app, launch it, and verify tray behavior plus the ritual surface without `npm run dev`.

**Acceptance Scenarios**:

1. **Given** dependencies are installed, **When** the developer runs the macOS distribution command, **Then** a DMG and/or zipped app artifact is created under the configured release output directory.
2. **Given** the packaged app is launched, **When** the tray/menu bar icon is clicked, **Then** the floating ritual surface opens.
3. **Given** the packaged app is running, **When** the user offers incense and knocks the wooden fish, **Then** persisted counts and visual state work without a dev server.
4. **Given** the app is unsigned, **When** macOS Gatekeeper warns the user, **Then** release notes or docs clearly describe the expected early-access workaround and signing status.

---

### User Story 2 - Build A Local Windows Installer (Priority: P1)

A developer or CI runner on Windows can create an `.exe` installer for Cyber Incense.

**Why this priority**: The requested downloadable package includes EXE-style distribution, and Windows users should not have to build from source.

**Independent Test**: Run the Windows packaging command on a Windows runner, install the generated EXE, launch Cyber Incense, and verify tray behavior plus persisted ritual state.

**Acceptance Scenarios**:

1. **Given** dependencies are installed on Windows, **When** the developer runs the Windows distribution command, **Then** an installer `.exe` artifact is created.
2. **Given** the installer completes, **When** the app is launched from the Start menu or installed location, **Then** the tray icon appears and can open the ritual surface.
3. **Given** Windows SmartScreen warns about an unsigned app, **When** the user reads release notes, **Then** the unsigned status is clearly explained.

---

### User Story 3 - Publish Downloadable GitHub Release Artifacts (Priority: P1)

The maintainer can push a version tag and receive a GitHub Release containing macOS and Windows artifacts.

**Why this priority**: The desired user experience is "download a package and run it" without manual artifact sharing.

**Independent Test**: Push a test tag, wait for CI, and verify the GitHub Release contains named artifacts for macOS and Windows.

**Acceptance Scenarios**:

1. **Given** a tag matching the release pattern is pushed, **When** GitHub Actions starts, **Then** macOS and Windows packaging jobs run.
2. **Given** packaging succeeds, **When** the release job completes, **Then** artifacts are attached to the tag's GitHub Release.
3. **Given** a user opens the GitHub Release page, **When** they inspect assets, **Then** artifact names clearly include app name, version, platform, and architecture.
4. **Given** one platform job fails, **When** CI reports status, **Then** logs expose the failing packaging step and no silent partial release is presented as fully successful.

---

### User Story 4 - Keep Packaging Reproducible And Safe (Priority: P2)

Developers can understand exactly what goes into a release artifact, and packaging does not change unrelated user data or developer configuration.

**Why this priority**: Desktop packaging touches app identity, icons, native metadata, and CI credentials; it needs guardrails.

**Independent Test**: Inspect packaging config and release logs. Confirm package inputs are local build output and project assets only.

**Acceptance Scenarios**:

1. **Given** packaging config is reviewed, **When** included files are listed, **Then** only required runtime files, compiled Electron output, renderer output, package metadata, and assets are included.
2. **Given** a release build runs, **When** it completes, **Then** source files, tests, specs, and local developer state are not bundled unless explicitly required.
3. **Given** no signing secrets are configured, **When** packaging runs, **Then** unsigned artifacts are still produced without failing for missing certificates.
4. **Given** signing secrets are configured later, **When** packaging runs, **Then** the config has a clear extension point for signed/notarized artifacts.

---

### User Story 5 - Document Release Operations (Priority: P2)

The maintainer has concise commands for local packaging, tag release, artifact verification, and first-run caveats.

**Why this priority**: Release mechanics are easy to forget, and early users need clear expectations about unsigned packages.

**Independent Test**: Follow `quickstart.md` from a clean checkout and produce either a local package or a CI release.

**Acceptance Scenarios**:

1. **Given** a developer reads the quickstart, **When** they follow macOS packaging steps, **Then** they can find the generated artifact and launch it.
2. **Given** a maintainer wants a GitHub release, **When** they follow the tag steps, **Then** the release workflow is triggered.
3. **Given** a user downloads an early unsigned artifact, **When** they read release notes, **Then** Gatekeeper/SmartScreen caveats are visible and non-alarming.

## Edge Cases

- The app icon assets are missing, too small, or not in `.icns` / `.ico` format.
- `package.json` version does not match the pushed tag.
- A CI run starts from a dirty or non-release branch.
- macOS packaging succeeds but the packaged app cannot find `dist/` renderer assets.
- Windows packaging succeeds but the app starts without tray icon or fails to persist local state.
- Native dependencies or Electron cache downloads fail on CI.
- Artifact upload succeeds for one platform but fails for another.
- A release tag is pushed twice or a draft release already exists.
- Unsigned macOS app is quarantined after download.
- Windows SmartScreen blocks first launch because there is no signing reputation.
- The app is run from a path containing spaces or non-ASCII characters.
- GitHub Actions token permissions are restricted.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST add a desktop packaging toolchain suitable for Electron apps and MUST integrate it with the existing Vite/Electron build output.
- **FR-002**: The system MUST provide npm scripts for at least macOS packaging and Windows packaging.
- **FR-003**: The packaging command MUST run or depend on the existing production build before creating installers.
- **FR-004**: The package config MUST define stable app identity metadata, including product name, app id, artifact name pattern, output directory, and platform targets.
- **FR-005**: macOS packaging MUST produce a DMG or zipped app artifact suitable for GitHub Release download.
- **FR-006**: Windows packaging MUST produce an installer EXE suitable for GitHub Release download.
- **FR-007**: Generated artifact names MUST include product name, version, platform, and architecture.
- **FR-008**: The packaged app MUST launch using compiled local renderer assets, not `VITE_DEV_SERVER_URL`.
- **FR-009**: The packaged app MUST preserve tray/menu bar behavior, ritual surface opening, settings, local persistence, incense offering, and wooden fish knocking.
- **FR-010**: The package MUST include required app icon assets for macOS, Windows, tray usage, and installer display where supported.
- **FR-011**: The package config MUST exclude unnecessary development-only files from runtime artifacts.
- **FR-012**: Packaging MUST NOT install, enable, disable, or modify Codex hooks or Codex configuration.

### GitHub Release Requirements

- **FR-013**: The system MUST add a GitHub Actions workflow that builds release artifacts when a version tag is pushed.
- **FR-014**: The workflow MUST build macOS artifacts on a macOS runner and Windows artifacts on a Windows runner.
- **FR-015**: The workflow MUST install dependencies from the lockfile and run the production build before packaging.
- **FR-016**: The workflow MUST upload platform artifacts to the corresponding GitHub Release.
- **FR-017**: The workflow MUST expose build logs for typecheck, renderer build, Electron build, and packaging steps.
- **FR-018**: The workflow MUST use only the default GitHub token for unsigned early releases unless signing is explicitly added later.
- **FR-019**: Release workflow permissions MUST be scoped to the minimum required for reading contents and writing release artifacts.

### Signing And Trust Requirements

- **FR-020**: The first implementation MAY produce unsigned artifacts, but the unsigned status MUST be documented in quickstart or release notes.
- **FR-021**: The packaging config SHOULD leave a clear path for future macOS code signing and notarization.
- **FR-022**: The packaging config SHOULD leave a clear path for future Windows code signing.
- **FR-023**: Missing signing credentials MUST NOT fail unsigned early-release packaging.
- **FR-024**: Release docs MUST explain that unsigned artifacts may trigger macOS Gatekeeper or Windows SmartScreen warnings.

### Verification Requirements

- **FR-025**: `npm run typecheck` MUST pass before a release package is considered valid.
- **FR-026**: `npm run build` MUST pass before a release package is considered valid.
- **FR-027**: `npm run smoke:ritual-engine` MUST pass before a release package is considered valid.
- **FR-028**: A local packaged-app smoke check MUST verify launch, tray interaction, incense, wooden fish, settings, and local persistence.
- **FR-029**: CI release jobs SHOULD upload raw build artifacts for debugging if release upload fails.

## Success Criteria *(mandatory)*

- **SC-001**: A maintainer can run one documented command on macOS and produce a launchable DMG or zipped app.
- **SC-002**: A GitHub version tag produces a Release with macOS and Windows downloadable artifacts.
- **SC-003**: A non-developer tester can download an artifact, launch the app, offer incense, knock the wooden fish, adjust settings, quit, relaunch, and see state persist.
- **SC-004**: Release docs clearly identify unsigned-package caveats and the future signing path.
- **SC-005**: Packaging changes do not alter Codex hook state, local ritual state format, or renderer behavior in development mode.

## Assumptions

- The first release is for early testers, so unsigned packages are acceptable if caveats are explicit.
- macOS artifacts are built on GitHub-hosted macOS runners; Windows artifacts are built on GitHub-hosted Windows runners.
- Linux packages are useful later but are not required for Spec 007 P1 completion.
- The existing icon generation script can be reused or extended if platform icon formats are incomplete.
- Auto-update is out of scope for this spec.

## Out Of Scope

- Apple Developer ID signing and notarization as a required release gate.
- Windows Authenticode or EV code signing as a required release gate.
- Auto-update feeds.
- App Store, Microsoft Store, Homebrew, Winget, Chocolatey, or Linux package registry distribution.
- Codex hook implementation or installer behavior.
- Backend services, telemetry, accounts, or cloud sync.
