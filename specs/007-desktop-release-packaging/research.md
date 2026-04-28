# Research: Desktop Release Packaging

## Decision 1: Use electron-builder For First Packaging Pass

**Decision**: Use `electron-builder` as the packaging toolchain.

**Rationale**:

- It supports Electron apps with Vite-style build output.
- It can produce macOS DMG/ZIP and Windows NSIS EXE installers from one config model.
- It has established GitHub release publishing support and can also be used with explicit workflow upload steps.
- It keeps the implementation small compared with adopting a larger scaffolding framework.

**Alternatives considered**:

- **Electron Forge**: Good project lifecycle framework, but adopting it now would add more structure than needed.
- **Custom electron-packager scripts**: Simpler at first, but installer creation, artifact naming, and future signing become more manual.
- **Platform-native packaging only**: Too fragmented for the current project stage.

## Decision 2: Build On Native GitHub Runners

**Decision**: Build macOS artifacts on `macos-latest` and Windows artifacts on `windows-latest`.

**Rationale**:

- macOS DMG creation is most reliable on macOS.
- Windows installer creation is most reliable on Windows.
- Native runners avoid cross-build assumptions, Wine dependencies, and platform-specific surprises.

**Alternatives considered**:

- **Build all artifacts on macOS**: Possible for some Windows targets, but adds fragile cross-build setup.
- **Build all artifacts on Linux**: Not a good fit for macOS DMG and Windows installer expectations.

## Decision 3: Unsigned Early Releases Are Acceptable

**Decision**: The first packaging spec allows unsigned DMG/EXE artifacts.

**Rationale**:

- The user asked for a downloadable package, not public production distribution.
- Signing introduces paid developer accounts, certificates, secret management, notarization, and reputation requirements.
- Early testers can validate the app experience before signing investment.

**Required guardrail**: Docs and release notes must clearly say the package is unsigned and may trigger Gatekeeper or SmartScreen warnings.

## Decision 4: Tag-Driven GitHub Releases

**Decision**: Trigger release packaging from tags like `v0.1.0`.

**Rationale**:

- Tags create an explicit release boundary.
- The artifact version can match `package.json`.
- Release artifacts can be attached to a stable GitHub Release URL.

**Alternative considered**:

- **Build artifacts on every push**: Useful for CI artifacts, but noisy for user-facing downloads.

## Decision 5: Keep Auto-Update Out Of Scope

**Decision**: Do not implement Electron auto-update in Spec 007.

**Rationale**:

- Auto-update typically depends on signing and release feed stability.
- The immediate user need is a downloadable package.
- Adding update behavior before release basics are stable increases test surface.
