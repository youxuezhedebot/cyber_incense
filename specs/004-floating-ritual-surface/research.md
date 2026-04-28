# Research: Floating Ritual Surface

## Decision 1: Split ritual and settings into separate Electron windows/views

**Decision**: Keep one renderer bundle, but load it in separate Electron windows with explicit view context: `ritual` for the floating object and `settings` for configuration.

**Rationale**: The user specifically wants settings separated from the current page. Separate windows preserve the floating object illusion and allow settings to be normal, readable, and less visually constrained.

**Alternatives considered**:

- Collapsible settings inside the ritual surface: rejected because it caused the current problem.
- A route-only settings view in the same window: acceptable as fallback, but weaker because it replaces or clutters the object.
- Native menu-only settings: too hidden for reset/export and future hook preview.

## Decision 2: Use Electron always-on-top for the fixed ritual surface

**Decision**: Implement fixed-on-top using Electron window APIs and persist the preference in local state.

**Rationale**: Pinning is window behavior, not renderer state. Electron exposes direct support and lets the tray/settings controls update the existing ritual window immediately.

**Alternatives considered**:

- CSS-only pinning: impossible outside the renderer.
- Recreating the window on every toggle: more disruptive and can lose position.

## Decision 3: Derive visual count from persisted counters plus lightweight runtime cycles

**Decision**: Persist durable counters and user preferences, but keep individual active burn animations lightweight in renderer memory. On restart, reconstruct the stable completed visual state from counts.

**Rationale**: Persisting every animation object would bloat state and create migration complexity. The important persistent truth is counts; visual cycles can be reconstructed or settled safely.

**Alternatives considered**:

- Persist every incense stick lifecycle: rejected because high counts and partial burns can grow unbounded.
- Show only numeric counts: rejected by the feature.

## Decision 4: Aggregate high visual counts

**Decision**: Show active incense sticks up to a small cap, completed ash/tally marks up to a readable cap, and aggregate overflow into mound intensity, grouped strokes, or compact labels.

**Rationale**: Rendering one object per ritual forever would become unreadable and wasteful. The product needs the feeling of accumulation without unlimited DOM/SVG nodes.

**Alternatives considered**:

- Infinite scroll/history of offerings: too dashboard-like.
- Canvas particle-only count: less inspectable and harder to tune in this pass.

## Decision 5: Keep SVG + Framer Motion for this refactor

**Decision**: Continue using SVG and Framer Motion for the refined burner, incense, ash, and wooden fish effects.

**Rationale**: The app already uses this stack. SVG is inspectable, crisp at small sizes, and adequate for object-level animation. Framer Motion handles event-driven transitions without a custom render loop.

**Alternatives considered**:

- Canvas: viable later for smoke/particles, but heavier to implement and test now.
- Raster images: less flexible for count-driven changes and stateful burn progress.

## Decision 6: Wooden fish uses separate visual grammar

**Decision**: Wooden fish count should be shown through impact rings, small strike marks, dents, glow notches, or bead-like marks rather than ash/incense marks.

**Rationale**: The user explicitly called out that wood fish is a different style even if the logic is similar. Visual distinction prevents the app from feeling like duplicated counters.

**Alternatives considered**:

- Reusing the same ash/tally system: rejected because it blurs the two rituals.
