# Research: Stateful Ritual Rendering Engine

## Decision 1: Start With Lightweight 2D, Keep 2.5D As A Later Mode

**Decision**: Implement the first pass as a lightweight 2D renderer over normalized simulation state.

**Rationale**: The current app already uses React/SVG and Framer Motion. A lightweight 2D implementation can reuse the existing visual surface while introducing the engine boundary. It is lower risk than jumping directly to WebGL, normal maps, or damage textures.

**Alternatives Considered**:

- Full WebGL or Skia immediately: better fidelity, higher complexity, harder to validate in the current Electron/React code.
- Keep component-local animation only: fastest short term, but it keeps incense and wooden fish behavior hard to persist, test, or port.

## Decision 2: Use Deterministic Seeded Randomness

**Decision**: All incense placement, trace variation, smoke phase, and representative sampling should be derived from seeds.

**Rationale**: The same ritual history should restore to the same meaningful visual arrangement. Seeded randomness keeps the scene natural without making refreshes visually jump.

**Alternatives Considered**:

- Pure `Math.random()`: simple, but unstable across refresh and restart.
- Fully regular placement: stable, but artificial and button-like.

## Decision 3: Persist Events, Not Particles

**Decision**: Durable save data stores counters, event history, timestamps, and seeds. Runtime particles remain ephemeral.

**Rationale**: Smoke, sparks, shockwaves, and ash fragments are display effects. Persisting every particle creates large, fragile state and makes cross-platform restore harder.

**Alternatives Considered**:

- Save complete runtime engine state: easier to resume a frame, but brittle across schema changes.
- Save only counters: compact, but cannot restore burn progress or recent traces with enough fidelity.

## Decision 4: Keep Renderer Adapter Small

**Decision**: The renderer adapter should expose only primitives needed by the current lightweight 2D design: transforms, paths, ellipses, lines, circles, alpha, gradients, and layer ordering.

**Rationale**: A broad abstraction would be speculative. Spec 005 needs a real engine first and can grow the adapter as additional backends appear.

**Alternatives Considered**:

- Build a full retained-mode scene graph: powerful, but unnecessary for the first milestone.
- Keep direct SVG only: pragmatic, but weakens portability and testability of core simulation state.

## Decision 5: Treat Existing Counters As Source Of Truth

**Decision**: `todayPrayerCount`, `totalPrayerCount`, and `muyuCount` remain authoritative for count correctness. Engine history and snapshots explain visuals, not accounting.

**Rationale**: Existing IPC/store behavior is already count-oriented and local-first. Spec 005 should deepen visuals without risking data loss or breaking reset/export flows.

**Alternatives Considered**:

- Make engine events the only truth: cleaner long term, but more migration risk.
- Keep only summaries: less work, but not enough for burn/restore behavior.

## Decision 6: Use LOD Before High Fidelity

**Decision**: High-count readability is solved through caps, stable sampling, ash/stub aggregation, and trace decay before adding expensive visual effects.

**Rationale**: A pinned desktop toy should feel light during long sessions. LOD gives more value than richer shaders if the scene is already overloaded.

**Alternatives Considered**:

- Render all history: visually literal, but slow and unreadable.
- Hide old history entirely: performant, but loses the sense of accumulated ritual action.
