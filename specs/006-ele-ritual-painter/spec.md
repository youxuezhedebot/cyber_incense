# Feature Specification: Ele Ritual Painter

**Feature Branch**: `006-ele-ritual-painter`  
**Created**: 2026-04-28  
**Status**: Draft  
**Input**: User description: "Create a concrete UI drawing specification for Ele's cross-platform drawing layer. The goal is not a visual mockup, but painter-style pseudocode and requirements for how the wooden fish and incense burner are drawn, animated, cached, and updated from interaction state."

## Context

Spec 005 introduces the ritual simulation engine: incense placement, burn progress, ash, smoke, wooden fish springs, traces, shockwaves, durable event restore, and renderer-agnostic snapshots.

Spec 006 is the next layer down from that engine. It defines a high-fidelity painter target for Ele-like drawing backends:

```txt
RitualSnapshot from Spec 005
└─ Ele Ritual Painter
   ├─ RenderContext adapter     Path, gradients, shadows, transforms, clips
   ├─ Layered object painters   MuyuPainter and BurnerPainter
   ├─ Animation clock           frame dt, easing, transient draw-only animation
   ├─ Particle drawing          smoke curves, sparks, ash fragments, ripples
   └─ Static layer cache        material/body layers rebuilt on size/theme changes
```

The key rule remains:

```txt
Interaction events mutate ritual state
The engine advances time
The Ele painter draws the current snapshot without owning durable ritual data
```

This feature may be implemented in the current Electron/React app through a Canvas/SVG-compatible adapter first, but the requirements are written for an Ele-style cross-platform drawing surface such as Canvas, Skia, CustomPainter, or an equivalent 2D path renderer.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Draw Ritual Objects Through A Painter Contract (Priority: P1)

The developer can render the incense burner and wooden fish from a shared painter contract instead of hardcoding each visual only as DOM/SVG component markup.

**Why this priority**: The visual system needs a portable drawing language before it can move between Electron, mobile, or Ele host surfaces.

**Independent Test**: Feed a fixed `RitualSnapshot` into the painter at multiple rect sizes and verify object positions, layering, and animation states remain semantically equivalent.

**Acceptance Scenarios**:

1. **Given** a valid ritual snapshot, **When** the Ele painter renders it, **Then** the burner and wooden fish are drawn from normalized coordinates inside their assigned rects.
2. **Given** the drawing surface is resized, **When** the same snapshot is rendered again, **Then** the object proportions, hit areas, and particle origins scale without layout drift.
3. **Given** the backend supports paths, gradients, transforms, alpha, and clipping, **When** the painter renders, **Then** the objects are composed from drawing primitives rather than image assets.
4. **Given** the backend lacks blur, shadows, or advanced blend modes, **When** the painter renders, **Then** it uses a graceful fallback while preserving object shape and interaction feedback.

---

### User Story 2 - Render A Tactile Wooden Fish Object (Priority: P1)

The user clicks the wooden fish and sees a material, wood-grained object react with spring motion, a mallet strike, glow, ripples, and decaying dents.

**Why this priority**: The wooden fish should feel like a struck object, not a decorated counter.

**Independent Test**: Click the center, edge, and several rapid points. Verify hit strength changes compression, rotation, trace size, ripple radius, and mallet target while count correctness remains owned by existing state.

**Acceptance Scenarios**:

1. **Given** the wooden fish is idle, **When** it is rendered, **Then** the painter draws shadow, cushion, body, wood grain, carving, mouth, highlights, and idle mallet layers.
2. **Given** the user taps inside the wooden fish hit area, **When** the snapshot updates, **Then** the painter visibly compresses and rotates the body according to spring state.
3. **Given** a hit trace exists, **When** it is rendered, **Then** the trace appears as a darkened dent with a light edge and short-lived glow.
4. **Given** a shockwave or ripple exists, **When** time advances, **Then** concentric rings expand and fade without deforming with the body transform.
5. **Given** a strike animation is active, **When** the painter renders, **Then** the mallet follows a curved path toward the hit point and rebounds after impact.
6. **Given** traces age beyond their configured life, **When** the painter renders later frames, **Then** they fade and are removed without abrupt visual popping.

---

### User Story 3 - Render A Living Incense Burner Object (Priority: P1)

The user offers incense and sees a burner with material depth, rim occlusion, ash accumulation, inserted sticks, glowing embers, smoke curves, sparks, and falling ash.

**Why this priority**: Incense is the primary interaction and should communicate elapsed time and accumulated offerings through visible material change.

**Independent Test**: Offer incense, let it burn, and inspect rendering at several burn-progress values. Verify insertion, ember position, smoke source, ash fragments, and ash-bed height track snapshot state.

**Acceptance Scenarios**:

1. **Given** the burner is idle, **When** it is rendered, **Then** the painter draws shadow, rear/body, ornaments, inner rim, ash bed, front rim, and highlights in stable layer order.
2. **Given** an offer animation is active, **When** the painter renders, **Then** a stick travels from above the burner into a deterministic ash-bed target with a small insertion flash.
3. **Given** a stick is active, **When** burn progress increases, **Then** the visible stick length shortens and the ember point moves toward the base.
4. **Given** the ember exists, **When** smoke particles are present, **Then** smoke is drawn as soft Bezier curves starting near the ember instead of as only circular blobs.
5. **Given** ash fragments exist, **When** time advances, **Then** they fall or settle toward the ash bed and contribute to the accumulated ash visual.
6. **Given** the front rim is drawn, **When** sticks intersect the basin, **Then** the front rim occludes lower stick portions so the incense appears inserted into the burner.

---

### User Story 4 - Route Pointer Events To State Before Drawing (Priority: P1)

The user can click the visual objects directly, and the event routing maps screen coordinates to normalized ritual coordinates before invoking existing actions.

**Why this priority**: The painter must remain interactive. Visual fidelity is only useful if hit testing and state updates stay correct.

**Independent Test**: Click inside and outside each object at different sizes. Verify only valid object areas trigger the correct incense or wooden fish action, and the next frame reflects the new state.

**Acceptance Scenarios**:

1. **Given** a pointer event lands inside the burner interactive ellipse, **When** it is routed, **Then** the burner offer action is triggered with a normalized local point.
2. **Given** a pointer event lands inside the wooden fish interactive ellipse, **When** it is routed, **Then** the wooden fish knock action is triggered with a normalized local point.
3. **Given** a pointer event lands outside both interactive areas, **When** it is routed, **Then** no ritual action fires.
4. **Given** an action has been accepted by the app state or local engine, **When** the next frame renders, **Then** new particles, traces, insertion animation, or spring motion appear within 300 ms.

---

### User Story 5 - Keep The Painter Fast And Cacheable (Priority: P2)

The user can leave the ritual surface open without high CPU usage, even with many historical offerings or knocks.

**Why this priority**: A floating toy must be pleasant during normal work. Material richness should not imply unbounded draw calls.

**Independent Test**: Render idle, active, rapid-click, and high-count snapshots while tracking draw call counts, active particles, cache rebuilds, and frame stability.

**Acceptance Scenarios**:

1. **Given** no transient animation is active, **When** the painter is idle, **Then** static layers are reused and the frame loop can pause or reduce work.
2. **Given** the theme or object rect changes, **When** the painter renders next, **Then** static caches are rebuilt exactly for the affected object layers.
3. **Given** high incense or wooden fish counts, **When** the painter renders, **Then** visible particles, sticks, ash marks, and traces respect LOD caps from the snapshot/config.
4. **Given** multiple transient animations overlap, **When** the painter renders, **Then** it maintains readable layering and avoids unbounded particle creation.

### Edge Cases

- The painter receives a null or partially hydrated snapshot during app startup.
- The drawing backend lacks blur, shadow, text, or non-normal blend modes.
- The ritual surface is smaller than the designed 320 px object size.
- The app resumes after sleep and a large elapsed time has passed.
- The user clicks rapidly while offer animations, smoke, traces, and shockwaves overlap.
- A theme change occurs while static layers are cached.
- Particle counts hit configured caps.
- The backend coordinate system uses device pixels while the app hit tests in logical pixels.
- Reduced-motion or low-power mode is enabled.
- Existing Spec 005 runtime state contains aggregate historical incense rather than individual active sticks.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST define an Ele-compatible render context boundary with primitives for save/restore, translate, rotate, scale, alpha, clip path, paths, ellipses, circles, lines, text, linear gradients, and radial gradients.
- **FR-002**: The painter MUST use normalized coordinates internally and map them through object rect helpers equivalent to `nx`, `ny`, and `ns`.
- **FR-003**: The painter MUST consume `RitualSnapshot` or a compatible read-only snapshot from Spec 005 and MUST NOT become the durable source of ritual counts or history.
- **FR-004**: The painter MUST split rendering into a root `RitualPainter`, `BurnerPainter`, `MuyuPainter`, animation utilities, particle drawing utilities, theme specs, and cache records or equivalent modules.
- **FR-005**: The root painter MUST assign separate normalized rects for burner and wooden fish surfaces and preserve their interactive areas at all supported sizes.
- **FR-006**: Pointer routing MUST convert screen or surface coordinates into normalized local object coordinates before invoking incense or wooden fish actions.
- **FR-007**: The painter MUST support deterministic seeded variation for wood grain, knots, ash particles, ornament placement, trace shape, and smoke phase so redraws do not flicker.
- **FR-008**: The painter MUST provide theme specs for wooden fish materials, burner materials, incense sticks, ash, ember, smoke, sparks, traces, ripples, highlights, and shadows.
- **FR-009**: The painter MUST degrade gracefully when blur, shadow, or blend modes are unavailable by replacing them with opacity, color, or simpler layered strokes.
- **FR-010**: The painter MUST avoid required bitmap assets for the wooden fish, burner, ash, smoke, ripples, and mallet.
- **FR-011**: The painter MUST avoid real religious iconography, deities, scripture, or claims of actual worship.
- **FR-012**: The painter MUST NOT install, enable, disable, or modify any Codex hook or Codex configuration in this feature.

### Wooden Fish Requirements

- **FR-013**: The wooden fish painter MUST draw layers in this semantic order: shadow, cushion, body dark/base gradient, wood grain, carved ornament, mouth/opening, hit traces, highlight, ripples/shockwaves, mallet.
- **FR-014**: The wooden fish body MUST be drawn as a custom path with organic shape and a dark mouth/opening path, not as only a plain ellipse.
- **FR-015**: Wood grain MUST be clipped to the body path and MUST be stable across frames for a given size/theme.
- **FR-016**: Carving or ornamental strokes SHOULD be clipped to the body path and remain subtle enough not to dominate hit traces.
- **FR-017**: Body motion MUST use snapshot spring/motion values to drive compression, vertical offset, and slight rotation.
- **FR-018**: Hit traces MUST render as decaying dents with dark fill, light edge, optional early glow, seeded rotation/shape variance, and time-based alpha.
- **FR-019**: Ripples or shockwaves MUST render above the object and MUST NOT be transformed by the same body compression transform.
- **FR-020**: The mallet MUST render in idle and active states. During active strike, it MUST move toward the hit point along a curved path and rebound using eased timing.

### Incense Burner Requirements

- **FR-021**: The burner painter MUST draw layers in this semantic order: shadow, rear/body, body gradient/material, ornaments, inner rim, ash bed, offer animations, active sticks, burned stubs, ash fragments, smoke, front rim, highlights.
- **FR-022**: The burner body MUST be drawn as a custom path with a separate front rim path that can occlude lower incense portions.
- **FR-023**: The ash bed MUST be based on the configured normalized ash-bed ellipse and MUST reflect ash mass or snapshot ash visual height.
- **FR-024**: Ash-bed particles MUST be seeded or derived from stable aggregate state so the surface does not shimmer while idle.
- **FR-025**: Active incense MUST render from base point to current ember point using burn progress, angle, length, thickness, and insertion progress if available.
- **FR-026**: Ember rendering MUST include a small hot core and a larger flickering glow when backend capabilities allow it.
- **FR-027**: Smoke MUST render as alpha-fading Bezier curves whose start point follows the ember or smoke particle source.
- **FR-028**: Ash fragments MUST render as short-lived particles that move toward the ash bed or settle visually before removal.
- **FR-029**: Offer animations MUST render a temporary incoming stick before or while the engine creates the active stick, and MUST visually acknowledge insertion with a flash or ash disturbance.
- **FR-030**: Stick, stub, ash, smoke, and spark drawing MUST respect LOD caps and sorted depth so high counts remain readable.

### Animation And Performance Requirements

- **FR-031**: The animation clock MUST clamp unusually large `dt` values before updating transient painter animation.
- **FR-032**: Time-based easing MUST be centralized so strike, insertion, glow, ripple, and smoke animations remain consistent.
- **FR-033**: Static wooden fish layers SHOULD be cacheable: cushion, body, wood grain, carving, mouth, and static highlight.
- **FR-034**: Static burner layers SHOULD be cacheable: body, ornaments, rim geometry, and static highlight.
- **FR-035**: Static caches MUST be invalidated when rect size, pixel ratio, theme, or backend capability changes.
- **FR-036**: Dynamic layers MUST remain uncached or separately refreshed when they depend on current particles, traces, burn progress, springs, or active offer/strike animations.
- **FR-037**: The painter MUST expose enough debug or test hooks to verify layer order, cache invalidation, and particle counts without relying on visual inspection alone.

### Key Entities

- **Ele Render Context**: Cross-platform drawing facade for paths, gradients, transforms, clipping, alpha, shadows, and basic text.
- **Ritual Painter**: Root renderer that lays out burner and wooden fish rects, delegates drawing, and routes pointer events.
- **Muyu Painter**: Wooden fish object renderer responsible for material layers, body transform, traces, ripples, and mallet drawing.
- **Burner Painter**: Incense burner object renderer responsible for body, rim, ash, incense sticks, smoke, sparks, ash fragments, and offer animation.
- **Theme Spec**: Colors, material stops, stroke strengths, blur/shadow fallback rules, and style tokens for both objects.
- **Animation Clock**: Frame timing helper that clamps `dt`, computes progress, and drives draw-only transient animation.
- **Layer Cache**: Offscreen or retained static drawing layer keyed by rect, pixel ratio, theme, and backend capability.
- **Particle Draw State**: Ephemeral smoke, spark, ash, ripple, and glow drawing state derived from the engine snapshot or transient painter animation.
- **Interaction Router**: Hit-test layer that maps surface coordinates to normalized burner or wooden fish events.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Rendering the same snapshot at two different sizes preserves normalized burner, wooden fish, ash-bed, ember, and hit-trace positions within visually equivalent proportions.
- **SC-002**: A wooden fish tap produces visible body reaction, ripple/trace feedback, and mallet movement within 300 ms.
- **SC-003**: Wooden fish strike feedback settles or fades smoothly within its configured animation windows, with no abrupt trace disappearance before configured life expires.
- **SC-004**: Offering incense produces visible incoming-stick or insertion feedback within 300 ms.
- **SC-005**: An active incense stick visibly shortens as burn progress increases, and smoke originates near the current ember point.
- **SC-006**: Ash mass or ash visual height increases after completed burns or emitted ash thresholds.
- **SC-007**: With 100 or more offerings and 100 or more wooden fish hits, rendered detail remains capped and readable.
- **SC-008**: Static layer cache rebuilds occur only after size, theme, pixel ratio, or backend capability changes.
- **SC-009**: The painter can render with a reduced backend that lacks blur/shadow/blend modes while preserving object identity and interaction feedback.
- **SC-010**: Typecheck and production build pass after implementation.

## Assumptions

- Spec 005's engine and snapshot model remain the source of ritual simulation truth.
- The first implementation may adapt the current React/SVG renderer before moving to a dedicated Ele canvas backend.
- Burn durations may remain toy-friendly rather than real-world incense durations.
- The painter may include small accessibility labels or host-level click targets, but visible numeric counters remain secondary to material state.
- Static caches are an optimization, not a replacement for correct dynamic drawing.
- Future WebGL or full 3D rendering is out of scope for this spec unless it implements the same painter semantics.
