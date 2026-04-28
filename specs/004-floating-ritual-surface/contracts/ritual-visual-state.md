# Contract: Ritual Visual State

This contract describes renderer-facing visual derivation and action results for the floating ritual surface.

## `offerIncense`

Existing API remains the state transition for one incense offering.

```ts
offerIncense(): Promise<IncenseActionResult>
```

### Spec 004 Visual Behavior

- Renderer creates one `IncenseVisualCycle` after success.
- Count is persisted immediately by the main process.
- Visual cycle animates independently and settles into ash/completed marks.
- Rapid calls must produce correct final persisted counts.

## `knockMuyu`

Existing API remains the state transition for one wooden fish knock.

```ts
knockMuyu(): Promise<WoodenFishActionResult>
```

### Spec 004 Visual Behavior

- Renderer creates one strike/ripple effect after success.
- Renderer shows floating `+1`.
- Wooden fish visual summary updates from `muyuCount`.

## Derived Visual Helpers

Renderer code should derive visual summaries from normalized state:

```ts
getIncenseVisualSummary(state: IncenseState): IncenseVisualSummary
getMuyuVisualSummary(state: IncenseState): MuyuVisualSummary
```

## Types

```ts
type IncenseVisualCycle = {
  id: string;
  startedAt: string;
  phase: "spawning" | "igniting" | "placing" | "burning" | "ashing" | "complete";
  burnEndsAt: string;
};

type IncenseVisualSummary = {
  activeSticks: number;
  visibleAshMarks: number;
  overflowAshCount: number;
  ashIntensity: number;
};

type MuyuVisualSummary = {
  visibleMarks: number;
  overflowKnockCount: number;
  resonanceLevel: number;
};
```

## Constraints

- Visual summaries must cap visible elements.
- Visual summaries must remain deterministic from `IncenseState`.
- Count correctness comes from persisted state, not from animation completion.
- Animation failures must not roll back ritual counters.
