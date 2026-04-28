# Research: Simple Codex Hook

## Decision 1: Use user-level Codex hooks first

**Decision**: Install Cyber Incense into the user-level Codex configuration rather than project-local hooks.

**Rationale**: Cyber Incense is a tray app and desktop toy, not a repository-specific policy. User-level config makes the integration available wherever the user runs Codex and avoids trust-state complexity for project-local `.codex/` directories.

**Alternatives considered**:

- Project-local hooks: rejected for this feature because the app is not project-specific.
- Managed enterprise hooks: out of scope and inappropriate for a personal toy.

## Decision 2: Use `UserPromptSubmit` only

**Decision**: Integrate only with Codex's `UserPromptSubmit` event.

**Rationale**: The feature only needs to add playful context before a prompt is processed. Other hooks are for tool checks, permission decisions, post-tool feedback, or stop behavior and would add unnecessary risk.

**Alternatives considered**:

- `SessionStart`: less accurate because incense state can change during a session.
- `PreToolUse` or `PermissionRequest`: rejected because this toy must not become a guardrail or policy engine.
- `Stop`: rejected because the toy must not continue or block turns.

## Decision 3: Output JSON `hookSpecificOutput.additionalContext`

**Decision**: The hook runtime prints JSON with `hookSpecificOutput.hookEventName = "UserPromptSubmit"` and `additionalContext`.

**Rationale**: Codex supports plain stdout and JSON for this event, but JSON is explicit and easier to validate. The output can be schema-tested before installation.

**Reference**: OpenAI Codex hooks documentation: <https://developers.openai.com/codex/hooks>

**Alternatives considered**:

- Plain text stdout: simpler, but less structured and harder to test.
- Prompt blocking output: rejected because the toy must fail open.

## Decision 4: Install hook runtime as plain JavaScript

**Decision**: Keep the installed hook runtime as plain JavaScript that Node can execute directly.

**Rationale**: Codex runs an external command. A plain JS runtime avoids requiring build artifacts or TypeScript loaders in the user's hook path.

**Alternatives considered**:

- TypeScript runtime: rejected because it would need transpilation or a loader.
- Shell script: less portable and harder to JSON-escape safely.

## Decision 5: Preserve Codex TOML with a targeted feature-flag updater

**Decision**: Update only the `[features] codex_hooks = true` setting with a targeted text updater.

**Rationale**: Full TOML parse/write tools can destroy comments and formatting. The required edit is narrow enough to handle safely with section-aware text logic and tests.

**Alternatives considered**:

- Full TOML rewrite: rejected because preserving user config matters.
- Refuse to update `config.toml`: rejected because hooks require the feature flag.

## Decision 6: Merge JSON hooks idempotently

**Decision**: Parse `~/.codex/hooks.json`, preserve unrelated entries, and append Cyber Incense only if its command is absent.

**Rationale**: Users may already have hooks. The integration must not overwrite them and must tolerate repeated enable attempts.

**Alternatives considered**:

- Overwrite `hooks.json`: rejected as unsafe.
- Inline hooks in `config.toml`: rejected because `hooks.json` is easier to merge and remove cleanly.

## Decision 7: Fail open everywhere

**Decision**: Missing/corrupted Cyber Incense state, disabled hook state, and runtime errors all produce no output and exit successfully.

**Rationale**: A humorous desktop toy must never block or degrade Codex.

**Alternatives considered**:

- Surface hook errors to Codex: rejected because it would distract from the user's real work.
