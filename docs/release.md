# Release Guide

Cyber Incense packages as a local-first Electron desktop app. Spec 007 supports early unsigned packages for macOS and Windows.

## Local macOS Build

```bash
npm ci
npm run typecheck
npm run smoke:ritual-engine
npm run dist:mac
```

Expected output:

```txt
release/
  Cyber-Incense-0.1.0-mac-arm64.dmg
  Cyber-Incense-0.1.0-mac-arm64.zip
```

The architecture suffix depends on the machine or CLI flags. To build multiple macOS architectures in CI:

```bash
npm run dist:mac:ci
```

## Local Windows Build

Run on Windows:

```powershell
npm ci
npm run typecheck
npm run smoke:ritual-engine
npm run dist:win
```

Expected output:

```txt
release/
  Cyber-Incense-0.1.0-win-x64.exe
```

## Fast Unpacked Smoke

```bash
npm run dist:dir
```

Launch the app from the generated unpacked output directory. This is faster than creating a DMG or installer and verifies that the app does not need the Vite dev server.

## GitHub Release

1. Update `package.json` version if needed.
2. Commit the release changes.
3. Push a version tag:

```bash
git tag v0.1.0
git push origin v0.1.0
```

4. Wait for the "Release Desktop Packages" workflow.
5. Open the GitHub Release for the tag.
6. Confirm macOS `.dmg` / `.zip` and Windows `.exe` assets are attached.

## Packaged-App Smoke Checklist

- App launches without `npm run dev`.
- Tray or menu bar icon appears.
- Clicking the tray icon opens the ritual surface.
- 上香 increments state and shows incense/smoke/ash feedback.
- 木鱼 increments state and shows trace/shockwave feedback.
- Settings open from the tray.
- Visual duration settings persist after quit and relaunch.
- Quitting from the tray exits the app.

## Unsigned Early Builds

The first desktop packages are unsigned unless a release explicitly says otherwise.

Expected caveats:

- macOS may show Gatekeeper warnings after download.
- Windows may show SmartScreen warnings because the app has no signing reputation.

This is acceptable for early tester builds. Public distribution should add signing before a broader release.

## Future Signing

The package config intentionally keeps signing optional. Future hardening can add:

- Apple Developer ID certificate.
- Apple notarization credentials and team id.
- Windows Authenticode certificate.
- Timestamp server configuration.

Missing signing credentials must not break unsigned early packaging.

## Scope Boundary

Packaging does not install, enable, disable, or modify any Codex hook. Ritual state remains local to the packaged app.
