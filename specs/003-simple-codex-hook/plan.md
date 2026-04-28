# Implementation Plan: Simple Codex Hook

**Branch**: `003-simple-codex-hook` | **Date**: 2026-04-27 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `/specs/003-simple-codex-hook/spec.md`

## Summary

Add a reversible, explicit opt-in Codex hook integration that reads Cyber Incense local state and contributes a short playful status note to Codex user-prompt turns. The integration must preserve unrelated Codex configuration, create backups before edits, avoid duplicate hook entries, and fail open when state or config is unavailable.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20+; installed hook runtime as plain JavaScript  
**Primary Dependencies**: Existing Electron/React app stack; Vitest for config and hook runtime tests  
**Storage**: Existing `~/.cyber-incense/state.json`; hook script under `~/.cyber-incense/hooks/`; user-level Codex config under `~/.codex/`  
**Testing**: Unit tests for hook runtime, hook output schema, config merge/idempotence, disable behavior, and fail-open cases; typecheck/build/manual hook execution  
**Target Platform**: macOS first; user-level Codex config paths shared with Linux; Windows follow-up may need path adjustments  
**Project Type**: Desktop app integration with local developer-tool configuration  
**Performance Goals**: Hook runtime exits in under 1 second for normal local state; context output stays under 600 characters  
**Constraints**: Disabled by default, explicit confirmation, no prompt blocking, no authoritative instructions, preserve unrelated config, fail open, no telemetry/network  
**Scale/Scope**: Single-user local Codex hook integration for the `UserPromptSubmit` event only

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

No `.specify/memory/constitution.md` exists in this repository yet. Until a constitution is created, this plan applies the project constraints from [ROADMAP.md](../../ROADMAP.md):

- Interaction-first: PASS. Hook settings are secondary and require preview/confirmation.
- Local-first: PASS. Integration reads/writes only local app and Codex config files.
- Safe AI hook: PASS. Context is playful, non-authoritative, and fail-open.
- Config-safe: PASS. Merge, backup, idempotence, and uninstall are explicit requirements.
- Non-religious visual treatment: PASS. Hook text is humorous and avoids real religious claims.

Post-design re-check: PASS. Contracts and tasks preserve explicit opt-in, safe output, backups, and fail-open behavior.

## Project Structure

### Documentation (this feature)

```text
specs/003-simple-codex-hook/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── config-merge.md
│   ├── hook-installer-api.md
│   └── hook-output.schema.json
├── checklists/
│   └── requirements.md
├── spec.md
└── tasks.md
```

### Source Code (repository root)

```text
electron/
├── codexConfig.ts
├── hookInstaller.ts
├── ipc.ts
├── localStore.ts
└── paths.ts
hooks/
└── codex-user-prompt-submit.js
src/
├── components/
│   ├── HookStatusCard.tsx
│   └── SettingsPanel.tsx
├── lib/
│   └── hookPreview.ts
├── store/
│   └── incenseStore.ts
└── types/
    └── incense.ts
tests/
└── unit/
    ├── codexConfig.test.ts
    ├── hookInstaller.test.ts
    ├── hookPreview.test.ts
    └── hookRuntime.test.ts
```

**Structure Decision**: Keep hook installation logic in Electron main process modules, hook runtime as plain JavaScript for direct Node execution, and UI controls in the existing settings panel.

## Complexity Tracking

No constitution violations or complexity exceptions are required for this feature.
