# Release Guide

Cyber Incense packages as a local-first Electron desktop app. Spec 007 supports early ad-hoc signed packages for macOS and unsigned packages for Windows.

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
```

The architecture suffix depends on the machine or CLI flags. To build multiple macOS architectures for a release:

```bash
npm run dist:mac:release
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

The `Desktop Packages` workflow has two modes:

- Branch / PR builds create downloadable workflow artifacts for validation.
- Version tags create or update a GitHub Release and attach the packaged assets.

For release:

1. Update `package.json` version if needed.
2. Commit the release changes.
3. Push a version tag:

```bash
git tag v0.1.0
git push origin v0.1.0
```

4. Wait for the "Release Desktop Packages" workflow.
5. Open the GitHub Release for the tag.
6. Confirm macOS `.dmg` and Windows `.exe` assets are attached.

For PR validation, open the workflow run and download artifacts named:

```txt
cyber-incense-macos
cyber-incense-windows
```

## Packaged-App Smoke Checklist

- App launches without `npm run dev`.
- Tray or menu bar icon appears.
- Clicking the tray icon opens the ritual surface.
- 上香 increments state and shows incense/smoke/ash feedback.
- 木鱼 increments state and shows trace/shockwave feedback.
- Settings open from the tray.
- Visual duration settings persist after quit and relaunch.
- Quitting from the tray exits the app.

## Early Build Signing

The default macOS package is ad-hoc signed. This keeps the app bundle structurally valid, but it is not the same as Apple Developer ID signing and notarization.

Expected caveats:

- macOS Gatekeeper may warn or reject the app after download because ad-hoc builds are not notarized.
- Windows may show SmartScreen warnings because the app has no signing reputation.

For a trusted local test build only, install the app and remove the quarantine attribute:

```bash
xattr -dr com.apple.quarantine "/Applications/Cyber Incense.app"
```

This is acceptable for early tester builds. Public distribution should use Apple Developer ID signing and notarization before a broader release. Apple describes this distribution path in [Signing Mac Software with Developer ID](https://developer.apple.com/developer-id/) and [Notarizing macOS software before distribution](https://developer.apple.com/documentation/security/notarizing-macos-software-before-distribution).

## Future Signing

The package config intentionally keeps formal signing optional. Default macOS scripts use ad-hoc signing:

```bash
npm run dist:mac
npm run dist:mac:release
```

When Apple signing credentials are available, use:

```bash
npm run dist:mac:signed
npm run dist:mac:release:signed
```

GitHub Actions will automatically use the signed scripts for non-PR builds when both a Developer ID certificate and notarization credentials are configured.

Required GitHub secrets for certificate import:

- `MACOS_CSC_LINK`
- `MACOS_CSC_KEY_PASSWORD`

Then configure one notarization credential set supported by electron-builder:

- `APPLE_API_KEY`, `APPLE_API_KEY_ID`, `APPLE_API_ISSUER`
- or `APPLE_ID`, `APPLE_APP_SPECIFIC_PASSWORD`, `APPLE_TEAM_ID`
- or `APPLE_KEYCHAIN`, `APPLE_KEYCHAIN_PROFILE`

Future hardening can also add:

- Windows Authenticode certificate.
- Timestamp server configuration.

Missing signing credentials must not break ad-hoc early packaging.

## Scope Boundary

Packaging does not install, enable, disable, or modify any Codex hook. Ritual state remains local to the packaged app.
