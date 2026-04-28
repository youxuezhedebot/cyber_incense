# Feature Specification: Stateful Ritual Rendering Engine

**Feature Branch**: `005-stateful-ritual-rendering`  
**Created**: 2026-04-27  
**Status**: Draft  
**Input**: User description: "Ele provides a cross-platform drawing surface such as Canvas, Skia, CustomPainter, WebGL Surface, or similar. Do not make the incense burner and wooden fish ordinary buttons. Build them as a small state simulation, layered rendering, and interaction-event component."

## Context

Spec 004 establishes the floating ritual surface and object-first experience. The current implementation uses React/SVG components, Framer Motion animation, local counters, and visual summaries for incense and wooden fish counts.

Spec 005 upgrades that visual layer into a renderer-agnostic ritual simulation:

```txt
Incense/Muyu Component
├─ State Engine       state engine for incense, ash, smoke, hit traces, animation
├─ Interaction Layer  taps, long press, combo, hit strength
├─ Renderer Adapter   Canvas / Skia / WebGL / SVG style drawing backends
└─ Spec Config        themes, materials, incense types, wooden fish types, decay rules
```

The core rule is:

```txt
Interaction events only mutate state
The state engine advances time
The renderer only draws current state
```

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Render Ritual Objects From Simulation State (Priority: P1)

The user sees incense burner and wooden fish objects whose visual form is derived from runtime state rather than fixed button art.

**Why this priority**: This is the foundation for believable incense placement, burn progress, ash buildup, wooden fish dents, and future renderer portability.

**Independent Test**: Open the ritual surface, interact with incense and wooden fish, and verify the same counters produce deterministic visual state after refresh or restart.

**Acceptance Scenarios**:

1. **Given** the ritual surface is visible, **When** no interaction is active, **Then** the renderer draws the incense burner and wooden fish from state objects, not from one static button image.
2. **Given** the user clicks the incense burner, **When** the event is handled, **Then** the interaction layer records an incense event and the engine creates or updates incense state.
3. **Given** time advances, **When** the render loop ticks, **Then** burn progress, smoke, ash, traces, and motion are updated by the engine before drawing.
4. **Given** the renderer backend changes, **When** the same normalized state is rendered, **Then** object placement and visual lifecycle remain semantically equivalent.

---

### User Story 2 - Offer Incense With Placement, Burn, Smoke, And Ash (Priority: P1)

The user clicks the burner and sees a new incense stick enter an ash bed, ignite, burn down, shed ash, emit smoke, and contribute to accumulated ash.

**Why this priority**: Incense is the primary ritual action. It should feel like a small material simulation, not just a count increment.

**Independent Test**: Reset today's count, offer incense several times, leave the surface running, and verify stable placement, burn shortening, ember movement, smoke, ash fragments, and ash-bed accumulation.

**Acceptance Scenarios**:

1. **Given** the burner has no incense today, **When** the surface opens, **Then** the ash bed is calm and no active sticks are rendered.
2. **Given** the user taps the burner, **When** a stick is created, **Then** its base is placed inside the normalized ash-bed ellipse.
3. **Given** multiple active sticks exist, **When** a new stick is placed, **Then** deterministic random slot selection and minimum-distance scoring prevent a chaotic pileup.
4. **Given** a stick is burning, **When** time advances, **Then** visible length decreases, ember position moves toward the base, and smoke appears near the ember.
5. **Given** burn progress crosses ash thresholds, **When** ash is generated, **Then** falling ash fragments or ash mass update the ash bed.
6. **Given** a stick finishes burning, **When** the engine settles it, **Then** it moves out of active sticks and contributes to burned stubs or aggregate ash state.

---

### User Story 3 - Knock Wooden Fish With Spring Motion And Decaying Traces (Priority: P1)

The user clicks the wooden fish and sees elastic knock motion, short shockwaves, and hit traces that fade into the wood grain.

**Why this priority**: Wooden fish should have its own tactile language, distinct from incense smoke and ash.

**Independent Test**: Click near the center, click near the edge, and click rapidly. Verify hit strength, rotation, spring response, trace size, and trace fade vary in a believable way.

**Acceptance Scenarios**:

1. **Given** the user taps the wooden fish, **When** the event is handled, **Then** `muyuCount` increases and a hit trace is added at the normalized point.
2. **Given** the hit point is near the center, **When** strength is computed, **Then** the trace and sound/visual impact are stronger than an edge hit.
3. **Given** the hit point is off-center, **When** the wooden fish reacts, **Then** the object rotates or offsets subtly in the direction implied by the strike.
4. **Given** traces age, **When** time advances, **Then** their opacity and radius decay without abrupt disappearance.
5. **Given** high-fidelity mode is enabled later, **When** hits occur, **Then** the damage map can darken and recover local wood areas without changing the public interaction contract.

---

### User Story 4 - Keep High Counts Readable With LOD Aggregation (Priority: P2)

The user can accumulate many offerings or knocks without the surface becoming visually noisy or slow.

**Why this priority**: The toy should remain usable over long sessions. Rendering every historical stick or trace is not sustainable.

**Independent Test**: Simulate 10, 50, 100, and 500 incense offerings and wooden fish knocks; verify frame rate, readability, and visual count meaning remain stable.

**Acceptance Scenarios**:

1. **Given** total incense count is 1 to 20, **When** the burner renders, **Then** individual sticks and marks may be drawn directly.
2. **Given** total incense count is 20 to 100, **When** the burner renders, **Then** visible sticks are capped and the remainder contributes to ash height, stub density, or soot.
3. **Given** total incense count is above 100, **When** the burner renders, **Then** aggregate ash, representative sticks, and dense residual marks communicate scale without unbounded draw calls.
4. **Given** wooden fish traces exceed their visible cap, **When** the object renders, **Then** older or less important traces are sampled, aggregated, or faded.

---

### User Story 5 - Restore Ritual State From Durable Events (Priority: P2)

The user can close or restart the app and see a coherent ritual state restored from durable core history rather than saved particles.

**Why this priority**: Particles and transient animation state are expensive and fragile to persist. Core events make cross-platform restore stable.

**Independent Test**: Offer incense, knock the wooden fish, quit during burn, reopen, and verify active/completed state is derived from saved event history and elapsed time.

**Acceptance Scenarios**:

1. **Given** the app persists state, **When** it writes ritual data, **Then** it saves counters and core event history, not every smoke particle.
2. **Given** the app restarts, **When** event history is restored, **Then** incense burn progress, completed ash, and surviving wooden fish traces are recalculated from timestamps and seeds.
3. **Given** saved data came from Spec 004, **When** Spec 005 normalization runs, **Then** it creates compatible default simulation settings without losing counts.

### Edge Cases

- The user taps incense rapidly while existing sticks are still in insertion or burn phases.
- The user changes active object while particles or hit traces are alive.
- The app sleeps or is suspended for a long time, then resumes.
- `performance.now()` and persisted wall-clock timestamps drift or reset across process restarts.
- Very high counts require aggregation and stable sampling.
- The renderer backend lacks filters, blur, glow, or offscreen caching.
- The ritual surface is very small, so normalized geometry must still fit without overlap.
- Audio playback fails or is disabled while visual hit strength still works.
- The local state lacks Spec 005 simulation settings.
- A future high-fidelity mode is unavailable on low-end devices and must fall back to lightweight 2D.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST separate ritual interaction, time-based state simulation, and rendering responsibilities.
- **FR-002**: The system MUST represent incense burner and wooden fish as stateful ritual objects, not ordinary visual buttons.
- **FR-003**: The system MUST use normalized internal coordinates for ritual geometry so renderers can target different drawing surfaces.
- **FR-004**: The system MUST define a renderer adapter boundary that can support Canvas, Skia, WebGL, SVG, or equivalent backends.
- **FR-005**: The system MUST provide a lightweight 2D rendering specification as the first implementation target.
- **FR-006**: The system SHOULD keep a high-fidelity 2.5D specification as an optional later upgrade with offscreen caching, particles, lighting, and damage maps.
- **FR-007**: The system MUST support configurable incense themes, incense specs, wooden fish specs, and decay rules.
- **FR-008**: The burner renderer MUST draw the burner in layers: shadow, rear/body, ornaments, inner rim, ash bed, sticks, sparks/smoke, front rim, highlights.
- **FR-009**: Incense bases MUST be placed inside a defined ash-bed ellipse.
- **FR-010**: Incense placement MUST use deterministic seeded randomness with minimum-distance scoring so visuals remain stable and natural.
- **FR-011**: Each active incense stick MUST track seed, type, position, angle, depth, length, thickness, creation time, burn duration, burn progress, ash thresholds, ash mass, and alive state.
- **FR-012**: The engine MUST update incense burn progress from elapsed time.
- **FR-013**: The renderer MUST draw active incense from base point to ember point using current burn progress.
- **FR-014**: The engine MUST emit or update smoke near live ember points while incense is active.
- **FR-015**: The engine MUST convert burn progress thresholds into ash fragments, ash mass, or ash-bed height changes.
- **FR-016**: Completed incense MUST stop rendering as full active sticks and MUST contribute to burned stubs, ash mass, or aggregate count visuals.
- **FR-017**: The system MUST cap visible incense and ash details using LOD rules while preserving count correctness.
- **FR-018**: Wooden fish state MUST track hit count, traces, shockwaves, impulse/motion values, scale, rotation, and optional damage map.
- **FR-019**: Wooden fish tap handling MUST compute hit strength from tap position and recent interaction intensity.
- **FR-020**: Wooden fish motion MUST use an elastic or spring-like update, not only an immediate static scale change.
- **FR-021**: Wooden fish traces MUST age and fade using time-based decay.
- **FR-022**: Wooden fish trace rendering MUST vary by seed so repeated hits do not look identical.
- **FR-023**: The system MUST persist durable ritual data as counters, core incense history, wooden fish hit history, timestamps, and seeds.
- **FR-024**: The system MUST NOT persist every runtime particle as durable state.
- **FR-025**: The system MUST restore ritual visual state from saved durable history and elapsed time.
- **FR-026**: The system MUST remain local-first and MUST NOT require network services.
- **FR-027**: The system MUST avoid real religious iconography, deities, scripture, or claims of actual worship.
- **FR-028**: The system MUST NOT install, enable, disable, or modify any Codex hook or Codex configuration in this feature.

### Key Entities

- **Ritual Engine**: Owns incense and wooden fish runtime state, updates time, and exposes interaction methods.
- **Interaction Layer**: Converts pointer/tap/long-press/combo events into normalized state mutations.
- **Renderer Adapter**: Draws paths, ellipses, lines, particles, gradients, alpha, and transforms for the current backend.
- **Burner State**: Active incense, burned stubs, ash mass, ash height map, smoke particles, spark particles, and offering totals.
- **Incense Stick**: One active or burned incense unit with deterministic seed, placement, burn progress, and ash metadata.
- **Ash Bed**: Normalized ellipse that constrains insertion and ash rendering.
- **Muyu State**: Hit count, trace history, shockwaves, impulse/motion, and optional damage map.
- **Hit Trace**: Time-decaying visual mark created by one wooden fish hit.
- **Spec Config**: Themes, materials, incense specs, wooden fish specs, LOD limits, and decay constants.
- **Save Data**: Durable event/counter history used to reconstruct runtime state.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can instantiate `RitualEngine`, call `offerIncense`, advance time, and observe deterministic incense burn state.
- **SC-002**: A developer can call `hitMuyu` with different normalized points and observe different strength, trace, and motion output.
- **SC-003**: A user sees incense interaction feedback within 300 ms of tapping the burner.
- **SC-004**: Active incense visibly shortens over its configured burn duration.
- **SC-005**: Ash mass or ash-bed visuals increase after completed burns.
- **SC-006**: Smoke particles or smoke curves appear only while relevant incense is active or recently active.
- **SC-007**: Wooden fish knock feedback appears within 300 ms and settles within a short elastic response window.
- **SC-008**: Hit traces remain visible briefly, decay smoothly, and are removed after their configured life.
- **SC-009**: With 100 or more incense offerings, draw counts remain capped and the surface remains readable.
- **SC-010**: A saved ritual state can be restored after restart without saving transient particles.
- **SC-011**: Existing Spec 004 counters can migrate into Spec 005 state defaults without data loss.
- **SC-012**: Typecheck and production build pass after implementation.

## Assumptions

- The current Electron/React app remains the first host implementation.
- Spec 005 may start with an SVG/React or Canvas-style adapter, as long as the engine boundary remains renderer-agnostic.
- Burn durations may remain toy-friendly rather than real-time incense durations.
- Existing local counters remain the source of truth for count correctness.
- High-fidelity 2.5D features are staged after the lightweight 2D engine works.
- Codex hook work remains governed by Spec 003 and is out of scope here.
