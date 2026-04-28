# Quickstart: Desktop Release Packaging

## Local macOS Package

From the repo root:

```bash
npm ci
npm run typecheck
npm run smoke:ritual-engine
npm run dist:mac
```

Expected output:

```txt
release/
  Cyber-Incense-<version>-mac-<arch>.dmg
```

Open the generated app or DMG, then verify:

- Tray/menu bar icon appears.
- Clicking the icon opens the ritual surface.
- 上香 works and smoke/ash update.
- 木鱼 works and traces/shockwaves update.
- Settings changes persist after quit and relaunch.

Unsigned early builds may require macOS first-run approval.

## Local Windows Package

On Windows:

```powershell
npm ci
npm run typecheck
npm run smoke:ritual-engine
npm run dist:win
```

Expected output:

```txt
release/
  Cyber-Incense-<version>-win-<arch>.exe
```

Install and launch the app, then run the same packaged-app smoke checklist.

Unsigned early builds may trigger Windows SmartScreen.

## Fast Package Smoke Without Installer

For quicker validation:

```bash
npm run dist:dir
```

Launch the unpacked app from the generated output directory and verify it does not require `npm run dev`.

## GitHub Release

1. Ensure `package.json` version is correct.
2. Create and push a matching version tag:

```bash
git tag v0.1.0
git push origin v0.1.0
```

3. Wait for the GitHub Actions release workflow.
4. Open the GitHub Release for the tag.
5. Confirm macOS and Windows artifacts are attached.
6. Download at least one artifact and run the packaged-app smoke checklist.

## Early Release Notes Template

```md
Cyber Incense <version>

This is an early desktop build.

Downloads:
- macOS DMG
- Windows installer EXE

Notes:
- These packages are unsigned unless the release explicitly says otherwise.
- macOS Gatekeeper or Windows SmartScreen may warn on first launch.
- Ritual state is stored locally on your machine.
- This package does not install or modify any Codex hook.
```
