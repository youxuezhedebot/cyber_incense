# Contract: Release Workflow

This contract defines the expected developer commands, package configuration behavior, and GitHub Actions release behavior for Spec 007.

## NPM Script Contract

The implementation MUST expose these scripts or equivalent names documented in `quickstart.md`:

```json
{
  "scripts": {
    "dist": "npm run build && electron-builder",
    "dist:mac": "npm run build && electron-builder --mac",
    "dist:win": "npm run build && electron-builder --win",
    "dist:dir": "npm run build && electron-builder --dir"
  }
}
```

Rules:

- `dist:*` commands MUST use production build output.
- `dist:*` commands MUST NOT require the Vite dev server.
- Missing signing credentials MUST NOT fail local unsigned packaging.
- `dist:dir` SHOULD be available for fast smoke checks without installer creation.

## Packaging Config Contract

The package config MUST define:

```yaml
appId: com.cyberincense.app
productName: Cyber Incense
directories:
  output: release
files:
  - dist/**
  - dist-electron/**
  - package.json
  - assets/**
artifactName: "${productName}-${version}-${os}-${arch}.${ext}"
mac:
  target:
    - dmg
    - zip
win:
  target:
    - nsis
```

Implementation may adjust names and paths to match the actual repo, but it MUST preserve these semantics:

- Include compiled renderer assets.
- Include compiled Electron main/preload assets.
- Include runtime package metadata.
- Include required app/installer icons.
- Exclude source-only and spec-only files from packaged runtime output.

## GitHub Actions Contract

The release workflow MUST:

```yaml
on:
  push:
    tags:
      - "v*.*.*"

permissions:
  contents: write
```

It MUST have native platform jobs:

```txt
macos-latest   -> npm ci -> validation -> dist:mac -> upload release assets
windows-latest -> npm ci -> validation -> dist:win -> upload release assets
```

Validation means at least:

```txt
npm run typecheck
npm run smoke:ritual-engine
npm run build
```

Packaging commands MAY include `npm run build` internally, but CI logs SHOULD still make validation steps visible.

## Artifact Contract

Release assets MUST be named with:

```txt
Cyber-Incense-{version}-{platform}-{arch}.{ext}
```

Examples:

```txt
Cyber-Incense-0.1.0-mac-arm64.dmg
Cyber-Incense-0.1.0-mac-x64.dmg
Cyber-Incense-0.1.0-win-x64.exe
```

Universal macOS builds are allowed if configured:

```txt
Cyber-Incense-0.1.0-mac-universal.dmg
```

## Release Notes Contract

Each early release MUST mention:

- The app is an early desktop build.
- macOS and Windows artifacts are unsigned unless signing is explicitly enabled.
- Gatekeeper or SmartScreen warnings are expected for unsigned builds.
- The app stores ritual state locally.
- No Codex hook is installed by the package.

## Failure Contract

If packaging fails:

- CI MUST fail visibly.
- Logs MUST include the failing platform and command.
- Partial artifacts SHOULD remain available as CI artifacts for debugging, but the GitHub Release SHOULD NOT be described as fully successful.
