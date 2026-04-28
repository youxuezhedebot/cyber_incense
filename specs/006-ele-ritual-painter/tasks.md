# Tasks: Ele Ritual Painter

**Input**: Design documents from `/specs/006-ele-ritual-painter/`  
**Prerequisites**: plan.md, spec.md, requirements checklist

**Tests**: Use `npm run typecheck`, `npm run build`, `npm run smoke:ritual-engine`, and focused manual visual checks. Add small helper tests or smoke scripts if the painter helpers become complex enough to validate outside the UI.

**Organization**: Tasks are grouped by implementation phase and user story. The first implementation target is an SVG/React painter adapter over the existing Spec 005 engine snapshot.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files.
- **[Story]**: Which user story the task supports.
- Each implementation task names likely target paths.

## Phase 1: Contract, Layout, And Theme

**Purpose**: Create the painter vocabulary without changing current UI behavior.

- [x] T001 [US1] Create painter runtime types in `src/types/ritualPainter.ts` for `Rect`, normalized projection helpers, backend capabilities, layer names, paint/theme shapes, cache keys, and debug metadata.
- [x] T002 [P] [US1] Add shared geometry helpers in `src/lib/ritualPainter/geometry.ts`, including `nx`, `ny`, `ns`, clamp helpers, ellipse hit testing, and logical-to-device pixel helpers.
- [x] T003 [P] [US1] Add ritual object layout helpers in `src/lib/ritualPainter/layout.ts` for burner rects, wooden fish rects, and minimum-size-safe hit regions.
- [x] T004 [P] [US1] Add default painter theme specs in `src/lib/ritualPainter/theme.ts` for burner, wooden fish, incense, ash, ember, smoke, sparks, traces, ripples, highlights, and shadows.
- [x] T005 [P] [US1] Add animation utilities in `src/lib/ritualPainter/animation.ts` for `clampDt`, `easeOutCubic`, `easeInOutCubic`, `easeOutBack`, `pulse01`, `quadBezier`, and `lerpPoint`.
- [x] T006 [US1] Add debug helper types/functions in `src/lib/ritualPainter/debug.ts` to expose layer order, dynamic item counts, and cache-key values for validation.

**Checkpoint**: Painter helpers compile independently and do not alter existing renderer output.

---

## Phase 2: SVG Painter Adapter Foundation

**Purpose**: Add the first adapter using current React/SVG infrastructure.

- [x] T007 [US1] Create `src/components/painter/SvgRitualPainterSurface.tsx` that accepts `state`, `snapshot`, `pulseId`, `muyuPulseId`, `onOffer`, and `onKnock`.
- [x] T008 [US1] Preserve current transparent floating-surface behavior, app drag/no-drag classes, accessible labels, and one-active-object rendering from `src/views/RitualSurfaceView.tsx`.
- [x] T009 [US1] Add SVG defs/id scoping helpers so gradients, filters, and clip paths from burner and wooden fish painters do not collide.
- [x] T010 [US4] Add a shared interaction router that maps pointer coordinates into normalized burner or wooden fish coordinates and ignores outside clicks.
- [x] T011 [US4] Wire the SVG painter surface to `offerIncense()` and `knockMuyu(point)` while preserving current IPC/store count ownership.
- [x] T012 [US1] Keep `src/hooks/useRitualEngine.ts` as the snapshot clock, but expose enough timing data for draw-only strike/insertion animation if needed.

**Checkpoint**: `RitualSurfaceView` can render through the new painter surface behind a small local switch or direct replacement without breaking actions.

---

## Phase 3: Wooden Fish Painter

**Goal**: Replace the simplified wooden fish visual with a layered painter implementation.

**Independent Test**: Click center, edge, and rapid points; verify body motion, trace location, ripple fade, mallet animation, and sound behavior.

- [x] T013 [P] [US2] Add wooden fish path builders in `src/lib/ritualPainter/muyuGeometry.ts`, including body path, mouth path, cushion path, carving strokes, wood-grain strokes, and knot placement.
- [x] T014 [US2] Create `src/components/painter/SvgMuyuPainter.tsx` with semantic layer order: shadow, cushion, body, wood grain, carving, mouth, traces, highlight, ripples/shockwaves, mallet.
- [x] T015 [US2] Use `snapshot.muyu.offsetX`, `offsetY`, `rotation`, `scaleX`, and `scaleY` to drive body transform instead of local component-only motion.
- [x] T016 [US2] Render `snapshot.muyu.traces` as seeded dent shapes with dark fill, light edge, early glow, and time-based alpha/radius.
- [x] T017 [US2] Render `snapshot.muyu.shockwaves` as rings above the body transform so ripples do not compress with the wooden fish.
- [x] T018 [US2] Add draw-only mallet state keyed by `muyuPulseId` and newest trace, including idle pose, curved strike path, impact point, and rebound.
- [x] T019 [US2] Preserve `playSoftKnock` fail-open behavior and existing sound setting from `src/components/muyu/WoodenFishObject.tsx`.
- [ ] T020 [US2] Replace or delegate `src/components/muyu/WoodenFishObject.tsx` to the new SVG painter once parity is reached.

**Checkpoint**: Wooden fish is path/material based, snapshot-driven, and still increments persisted `muyuCount` correctly.

---

## Phase 4: Incense Burner Painter

**Goal**: Move the current burner SVG into painter geometry and layer helpers.

**Independent Test**: Offer incense, observe insertion, burn shortening, ember movement, smoke source, ash fragments, ash-bed height, and front-rim occlusion.

- [x] T021 [P] [US3] Add burner path builders in `src/lib/ritualPainter/burnerGeometry.ts`, including body path, inner rim ellipse, front rim path, ornament strokes, ash ellipse, and normalized-to-SVG projection.
- [x] T022 [US3] Create `src/components/painter/SvgBurnerPainter.tsx` with semantic layer order: shadow, rear/body, ornaments, inner rim, ash bed, offer animation, sticks, stubs, ash fragments, smoke, front rim, highlight.
- [x] T023 [US3] Migrate basin body/rim gradients from `src/components/incense/IncenseBasin.tsx` into painter theme and SVG defs.
- [x] T024 [US3] Render `snapshot.burner.activeSticks` through painter projection helpers, using burn progress, angle, length, thickness, and current ember point.
- [x] T025 [US3] Render burned stubs from `snapshot.burner.burnedStubs` with aggregate-stub styling preserved.
- [x] T026 [US3] Replace fixed ash marks in `src/components/incense/AshLayer.tsx` with seeded ash-bed particles derived from ash mass, visual height, and LOD caps.
- [x] T027 [US3] Render `snapshot.burner.ashFragments` as short-lived settling particles using painter ash styles.
- [x] T028 [US3] Render `snapshot.burner.smokeParticles` as alpha-fading Bezier smoke curves that originate near particle/ember points.
- [x] T029 [US3] Render `snapshot.burner.sparkParticles` and ember glow with fallback styling for reduced backend capabilities.
- [x] T030 [US3] Add draw-only incoming-stick/insertion feedback keyed by `pulseId`, while keeping persisted incense placement deterministic through existing local store events.
- [x] T031 [US3] Sort visible sticks and stubs by y/depth before drawing when it improves burner occlusion.
- [ ] T032 [US3] Replace or delegate `src/components/incense/FloatingIncenseSurface.tsx` to the new SVG painter once parity is reached.

**Checkpoint**: Incense burner is painter-layered, state-driven, and visually equivalent or richer than the current component split.

---

## Phase 5: Caching, Fallbacks, And Performance

**Goal**: Make the painter ready for an Ele/Canvas backend without forcing that backend now.

- [x] T033 [P] [US5] Add cache-key helpers for rect size, pixel ratio, theme version, backend capabilities, and layer identity.
- [x] T034 [US5] Memoize static SVG path/layer data for wooden fish body, wood grain, carving, mouth, cushion, burner body, ornaments, rim, and highlights.
- [ ] T035 [US5] Mark dynamic layers explicitly so sticks, embers, smoke, sparks, ash fragments, traces, shockwaves, and strike/offer animation are never incorrectly reused.
- [ ] T036 [US5] Add reduced-capability style fallbacks for no blur, no shadow, no blend mode, and reduced motion.
- [ ] T037 [US5] Ensure all dynamic draw loops respect Spec 005 LOD values from `snapshot.config.lod`.
- [ ] T038 [US5] Validate idle rendering can keep the current slow tick behavior from `useRitualEngineSnapshot` and does not introduce unnecessary animation work.

**Checkpoint**: Painter adapter has a clear static/dynamic split and behaves acceptably in reduced visual capability modes.

---

## Phase 6: Integration And Cleanup

**Goal**: Switch the app to the painter adapter and retire duplicated visual code carefully.

- [x] T039 [US1] Update `src/views/RitualSurfaceView.tsx` to use `SvgRitualPainterSurface` as the primary renderer.
- [ ] T040 [US1] Keep old incense/muyu components temporarily if needed for comparison, or remove them only after parity is verified.
- [ ] T041 [US4] Verify burner clicks still call `offerIncense()` exactly once per accepted click.
- [ ] T042 [US4] Verify wooden fish clicks still call `knockMuyu(point)` with normalized coordinates and exactly one persisted count increment.
- [x] T043 [US1] Confirm null snapshot/startup state renders a safe placeholder or idle object without crashing.
- [ ] T044 [US5] Confirm minimum-size rendering has no text/object overlap and preserves hit targets.

**Checkpoint**: The user-facing ritual surface is powered by the painter adapter with no count or persistence regressions.

---

## Phase 7: Verification

- [x] T045 Run `npm run typecheck` and fix type errors in touched files.
- [x] T046 Run `npm run build` and fix production build errors.
- [x] T047 Run `npm run smoke:ritual-engine` and confirm Spec 005 engine behavior still passes.
- [ ] T048 Manually validate incense: empty state, first offer, rapid offers, burn progress, smoke, ash growth, completed stubs, and high-count aggregation.
- [ ] T049 Manually validate wooden fish: center hit, edge hit, rapid hits, trace decay, shockwave fade, mallet motion, and sound toggle.
- [ ] T050 Verify no Codex hook files or Codex configuration entries are created or modified.
- [ ] T051 Update [ROADMAP.md](../../ROADMAP.md) if Spec 006 changes implementation order or becomes part of the next milestone.

## Dependencies & Execution Order

- Phase 1 blocks all painter implementation.
- Phase 2 blocks object-specific painter integration.
- Wooden fish and burner painters can proceed in parallel after Phase 2.
- Caching and fallbacks should follow the stable SVG adapter API.
- Integration should happen only after at least one object reaches visual parity.
- Verification runs after the primary surface switches to the painter adapter.

## Parallel Opportunities

- T002 through T006 can run in parallel after T001 is sketched.
- T013 and T021 can run in parallel because wooden fish and burner geometry are separate.
- T014 through T020 and T022 through T032 can be split by object with minimal file overlap.
- T033 and T036 can run while object painters are being implemented, as long as cache/fallback APIs are agreed first.
