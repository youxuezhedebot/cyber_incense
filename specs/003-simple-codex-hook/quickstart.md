# Quickstart: Simple Codex Hook

## Prerequisites

- Specs 001 and 002 are implemented.
- Codex is installed and has access to user-level configuration.
- Node.js is available for the hook command.

## Run Tests

```bash
npm run test -- --run tests/unit/hookRuntime.test.ts tests/unit/codexConfig.test.ts tests/unit/hookInstaller.test.ts tests/unit/hookPreview.test.ts
npm run typecheck
npm run build
```

## Enable Hook Manually from App

1. Run the app:

```bash
npm run dev
```

2. Open settings.
3. Open the Codex Hook card.
4. Review the context preview.
5. Confirm enablement.
6. Verify the UI shows enabled status.

## Validate Installed Files

```bash
ls -la ~/.cyber-incense/hooks
test -f ~/.cyber-incense/hooks/codex-user-prompt-submit.js
test -f ~/.codex/hooks.json
test -f ~/.codex/config.toml
```

If `hooks.json` or `config.toml` existed before enabling, verify backups exist:

```bash
ls -la ~/.codex/*.bak.cyber-incense 2>/dev/null
```

## Validate Hook Runtime

Run:

```bash
node ~/.cyber-incense/hooks/codex-user-prompt-submit.js
```

Expected when enabled:

- Prints valid JSON.
- JSON contains `hookSpecificOutput.hookEventName` equal to `UserPromptSubmit`.
- JSON contains `hookSpecificOutput.additionalContext`.
- Additional context says it is playful and not a system instruction.

Expected when disabled:

- Prints nothing.
- Exits successfully.

## Disable Hook

1. Open settings.
2. Disable Codex Hook.
3. Confirm Cyber Incense reports disabled status.
4. Run the hook manually again and confirm no output.
5. Inspect existing Codex hooks and confirm unrelated entries remain.

## Failure Validation

1. Temporarily move `~/.cyber-incense/state.json`.
2. Run the hook script.
3. Confirm no output and successful exit.
4. Restore state.
5. Temporarily corrupt state.
6. Run the hook script.
7. Confirm no output and successful exit.
