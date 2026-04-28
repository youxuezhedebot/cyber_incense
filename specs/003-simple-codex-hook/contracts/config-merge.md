# Contract: Codex Config Merge

## Files

User-level Codex config files:

```text
~/.codex/hooks.json
~/.codex/config.toml
```

App-owned hook runtime:

```text
~/.cyber-incense/hooks/codex-user-prompt-submit.js
```

## `hooks.json` Merge

Cyber Incense adds one `UserPromptSubmit` command hook.

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ~/.cyber-incense/hooks/codex-user-prompt-submit.js",
            "timeout": 5,
            "statusMessage": "Reading Cyber Incense status"
          }
        ]
      }
    ]
  }
}
```

### Rules

- If `hooks.json` is missing, create it.
- If `hooks.json` exists, parse and preserve unrelated content.
- If `UserPromptSubmit` exists, add Cyber Incense only if its command is absent.
- If `hooks.json` is invalid JSON, stop and report an error.
- Disable removes only hook handlers whose command references `cyber-incense/hooks/codex-user-prompt-submit.js`.

## `config.toml` Feature Flag

Required state:

```toml
[features]
codex_hooks = true
```

### Rules

- If `config.toml` is missing, create it with the required feature section.
- If `[features]` exists and `codex_hooks` exists, set it to `true`.
- If `[features]` exists and `codex_hooks` is missing, add it inside the section.
- If `[features]` is missing, append a section.
- Preserve unrelated content and comments as much as possible.

## Backups

Before modifying existing files, create:

```text
~/.codex/hooks.json.bak.cyber-incense
~/.codex/config.toml.bak.cyber-incense
```

If backup creation fails, do not modify the source file.
