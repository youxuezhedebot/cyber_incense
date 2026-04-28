# Contract: Polished Ritual Actions

These APIs extend the Spec 001 renderer preload contract.

## `knockMuyu`

Performs one wooden fish ritual action.

```ts
knockMuyu(): Promise<WoodenFishActionResult>
```

### Success

- Increments `muyuCount`.
- Updates `lastMuyuAt`.
- Persists state.
- Returns updated state, feedback message, and merit delta.

### Failure Handling

- If sound playback is unavailable, the action still succeeds.
- If stored state is corrupted, recover to defaults and then apply the action.
- Must not modify any Codex hook files or configuration.

## `onStateChanged`

Existing subscription from Spec 001 also emits state after `knockMuyu`, settings changes, resets, and imports/exports that affect state.

```ts
onStateChanged(callback: (state: IncenseState) => void): () => void
```

## Types

```ts
type WoodenFishActionResult = {
  state: IncenseState;
  message: string;
  meritDelta: number;
};
```
