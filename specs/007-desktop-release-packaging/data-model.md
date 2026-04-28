# Data Model: Desktop Release Packaging

This feature mostly adds build-time configuration rather than runtime app state. The following entities describe the expected release metadata and workflow contracts.

## Entity: ReleaseConfig

Represents the static desktop packaging configuration.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `productName` | string | yes | Human-readable app name shown by installers and OS UI. |
| `appId` | string | yes | Reverse-DNS app identifier, e.g. `com.cyberincense.app`. |
| `directories.output` | string | yes | Build artifact output directory, e.g. `release/`. |
| `files` | string[] | yes | Runtime files included in the packaged app. |
| `artifactName` | string | yes | Pattern containing product, version, platform, and arch. |
| `mac.target` | string[] | yes | macOS target list, expected `dmg` and optionally `zip`. |
| `win.target` | string[] | yes | Windows target list, expected `nsis`. |
| `publish` | object | optional | GitHub release publishing configuration or disabled local default. |

## Entity: ArtifactSpec

Represents an output file users can download.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string | yes | Final artifact filename. |
| `version` | semver | yes | App version from `package.json` and release tag. |
| `platform` | `mac` \| `win` \| `linux` | yes | Target platform. |
| `arch` | `x64` \| `arm64` \| `universal` | yes | Target CPU architecture. |
| `format` | `dmg` \| `zip` \| `exe` \| `AppImage` | yes | Installer or archive format. |
| `signed` | boolean | yes | Whether code signing was applied. |
| `path` | string | yes | Local CI path before upload. |

## Entity: ReleaseWorkflow

Represents the GitHub Actions release automation.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `trigger` | string | yes | Tag trigger pattern, expected `v*.*.*`. |
| `nodeVersion` | string | yes | Node version used by CI. |
| `jobs` | object[] | yes | Platform build jobs. |
| `permissions.contents` | `read` \| `write` | yes | Must allow release asset upload. |
| `artifactGlobs` | string[] | yes | File patterns attached to the release. |

## Entity: SigningConfig

Represents optional future signing data. Spec 007 must work when all fields are absent.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `mac.identity` | string | no | Apple Developer ID identity. |
| `mac.notarize` | boolean | no | Whether notarization is enabled. |
| `mac.teamId` | string | no | Apple team id. |
| `windows.certificate` | secret ref | no | Windows signing certificate source. |
| `windows.timestampServer` | string | no | Timestamp server URL. |

## Entity: PackageSmokeResult

Represents manual validation of a packaged app.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `artifact` | string | yes | Artifact path or release URL. |
| `launched` | boolean | yes | App launched successfully. |
| `trayVisible` | boolean | yes | Tray/menu bar icon appeared. |
| `ritualSurfaceOpened` | boolean | yes | Main ritual UI opened. |
| `incenseWorked` | boolean | yes | 上香 action updated count and visuals. |
| `muyuWorked` | boolean | yes | 木鱼 action updated count and visuals. |
| `settingsPersisted` | boolean | yes | Visual settings persisted across relaunch. |
| `notes` | string | no | Caveats, OS warnings, or failures. |

## State Transitions

```txt
Source Ready
  -> Validated
  -> Built
  -> Packaged
  -> Smoke Tested
  -> Uploaded
  -> Released
```

Invalid transitions:

- `Source Ready -> Released` without build and package steps.
- `Packaged -> Released` without artifact upload.
- `Unsigned -> Signed` unless signing credentials and verification are explicitly configured.
