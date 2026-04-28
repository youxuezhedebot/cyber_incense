# Data Model: Simple Codex Hook

## CodexHookState

Extends the state introduced in earlier specs.

```ts
type CodexHookState = {
  enabled: boolean;
  installedAt: string | null;
  lastCheckedAt: string | null;
};
```

### Rules

- Defaults to disabled.
- `enabled` becomes `true` only after user confirmation and successful install.
- `enabled` becomes `false` after disable or uninstall.
- `installedAt` is set after successful installation.
- `lastCheckedAt` updates when status is checked.

## HookStatus

User-visible status returned to the renderer.

```ts
type HookStatus =
  | { state: "not-installed" }
  | { state: "installed-disabled" }
  | { state: "enabled" }
  | { state: "error"; message: string };
```

### Rules

- `error.message` must be understandable to a non-expert user.
- Invalid Codex config should report an error and should not be overwritten.

## HookPreview

Representative context shown before enablement.

```ts
type HookPreview = {
  additionalContext: string;
  characterCount: number;
};
```

### Rules

- Must include playful/non-authoritative disclaimer.
- Must remain under 600 characters in normal use.
- Must not contain authoritative override language.

## HookContext

The actual context emitted by the runtime hook.

```ts
type HookContext = {
  hookSpecificOutput: {
    hookEventName: "UserPromptSubmit";
    additionalContext: string;
  };
};
```

### Rules

- Uses current Cyber Incense state.
- Includes today's incense count, total merit, and wooden fish count when available.
- Exits silently instead of emitting invalid JSON.

## CyberIncenseHookEntry

The app-owned hook entry inserted into Codex hooks config.

```ts
type CyberIncenseHookEntry = {
  type: "command";
  command: string;
  timeout: 5;
  statusMessage: "Reading Cyber Incense status";
};
```

### Rules

- Command references the installed Cyber Incense hook runtime.
- Idempotence is based on the hook command path.
- Disable removes only entries matching the Cyber Incense hook command.

## ConfigBackup

Backup metadata for user config files touched by the installer.

```ts
type ConfigBackup = {
  sourcePath: string;
  backupPath: string;
  createdAt: string;
};
```

### Rules

- Backup is created before first write to an existing file.
- Backup failure stops the install and reports an error.

## State Transitions

### Enable Hook

1. Build preview.
2. Require user confirmation.
3. Write hook runtime script.
4. Backup existing Codex config files.
5. Merge `hooks.json` idempotently.
6. Ensure `codex_hooks = true`.
7. Set `codexHook.enabled = true`.
8. Return enabled status.

### Disable Hook

1. Remove Cyber Incense hook entry or leave runtime silent.
2. Preserve unrelated hooks.
3. Set `codexHook.enabled = false`.
4. Return disabled status.

### Runtime Hook

1. Read Cyber Incense state.
2. If missing, corrupted, or disabled, exit with no output.
3. Emit valid `HookContext`.
4. Exit successfully.
