# Quickstart: Stateful Ritual Rendering Engine

Use this checklist to validate Spec 005 after implementation.

## 1. Install And Build

```bash
npm install
npm run typecheck
npm run smoke:ritual-engine
npm run build
```

Expected:

- TypeScript passes.
- Ritual engine smoke check reports one active stick and one wooden fish trace.
- Production build succeeds.
- No Codex hook files or Codex configuration changes are made.

## 2. Run The App

```bash
npm run dev
```

Expected:

- The ritual surface opens normally from the app/tray flow.
- Existing settings and floating surface behavior from Spec 004 still work.

## 3. Validate Incense Simulation

1. Reset today's count from settings.
2. Open the ritual surface.
3. Confirm the burner starts without active incense sticks.
4. Click the burner once.
5. Confirm visual feedback appears within 300 ms.
6. Watch the stick enter, ignite, burn down, and produce smoke or ember effects.
7. Wait for burn completion.
8. Confirm active stick state settles into ash, stub, or aggregate visual state.

Expected:

- The stick base is inside the ash-bed ellipse.
- The ember moves as burn progress advances.
- Smoke appears near the ember.
- Ash mass or ash height increases after burn completion.

## 4. Validate Deterministic Placement

1. Offer several incense sticks.
2. Note relative positions.
3. Refresh or restart if persistence for event history is implemented.
4. Confirm restored positions are stable for the same saved seeds.

Expected:

- Placement looks natural but not chaotic.
- Sticks do not all line up mechanically.
- Refresh does not randomly reshuffle durable visual history.

## 5. Validate Wooden Fish Simulation

1. Click near the center of the wooden fish.
2. Click near an edge.
3. Click several times rapidly.

Expected:

- Center hits create stronger traces or visual response than edge hits.
- Off-center hits introduce subtle rotation or offset.
- Traces vary by seed and fade smoothly.
- Shockwaves or strike feedback settle quickly.
- Sound remains optional and fail-open.

## 6. Validate High Counts

Simulate or manually create high counts:

- 10 incense offerings
- 50 incense offerings
- 100+ incense offerings
- 100+ wooden fish knocks

Expected:

- Visible sticks/traces are capped.
- Hidden counts are represented by ash height, stubs, soot, density, or aggregate marks.
- The surface remains readable at minimum size.
- No unbounded particle growth is visible.

## 7. Validate Restore

1. Offer incense.
2. Quit while an incense stick is still burning.
3. Reopen the app.

Expected:

- Runtime particles are not directly restored.
- Burn progress, ash state, and still-valid traces are reconstructed from timestamps and seeds.
- Existing counters remain correct.

## 8. Regression Checks

- Settings still open separately.
- Fixed-on-top still works.
- Reset today and reset all still work.
- Exported JSON remains parseable.
- Wooden fish count and incense count stay correct during rapid interaction.
