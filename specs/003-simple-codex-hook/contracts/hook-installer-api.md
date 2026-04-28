# Contract: Hook Installer Renderer API

These APIs extend the renderer preload contract and are implemented by Electron main process code.

## `getCodexHookStatus`

Returns current user-visible hook status.

```ts
getCodexHookStatus(): Promise<HookStatus>
```

### Success

- Returns whether Cyber Incense is not installed, installed-disabled, or enabled.
- Updates `lastCheckedAt` when possible.

### Failure Handling

- Returns `{ state: "error", message }` for unreadable or invalid config.
- Does not mutate Codex config.

## `previewCodexHookContext`

Returns the context the hook would provide based on current ritual state.

```ts
previewCodexHookContext(): Promise<HookPreview>
```

### Success

- Returns short non-authoritative Cyber Incense context.
- Does not install or enable anything.

## `enableCodexHook`

Installs and enables the Cyber Incense Codex hook after renderer-side confirmation.

```ts
enableCodexHook(): Promise<HookStatus>
```

### Success

- Writes hook runtime script.
- Backs up existing Codex config files before edits.
- Merges hook config idempotently.
- Enables Codex hook feature flag.
- Updates local Cyber Incense hook state.

### Failure Handling

- Returns error status.
- Does not overwrite invalid config.
- Does not create duplicate hook entries.

## `disableCodexHook`

Disables Cyber Incense hook behavior.

```ts
disableCodexHook(): Promise<HookStatus>
```

### Success

- Removes only Cyber Incense hook entries or leaves runtime silent.
- Preserves unrelated Codex hooks.
- Updates local Cyber Incense hook state.

## Types

```ts
type HookStatus =
  | { state: "not-installed" }
  | { state: "installed-disabled" }
  | { state: "enabled" }
  | { state: "error"; message: string };

type HookPreview = {
  additionalContext: string;
  characterCount: number;
};
```
