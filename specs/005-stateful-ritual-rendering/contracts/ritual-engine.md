# Contract: Ritual Engine And Renderer Adapter

This contract defines the public boundary between interaction code, simulation state, and drawing code.

## Engine Construction

```ts
type CreateRitualEngineInput = {
  now: number;
  appState: IncenseState;
  saveData?: RitualSaveData;
  config?: Partial<RitualSpecConfig>;
};

function createRitualEngine(input: CreateRitualEngineInput): RitualEngine;
```

Rules:

- Missing config values are filled from defaults.
- Missing save data is reconstructed from existing count state.
- Construction must not mutate `appState`.

## Engine Methods

```ts
type RitualEngine = {
  update(dt: number, now: number): void;
  offerIncense(now: number): IncenseStick;
  hitMuyu(point: Vec2, now: number): HitTrace;
  getSnapshot(): RitualSnapshot;
  toSaveData(now: number): RitualSaveData;
};
```

Rules:

- `update` advances runtime state only.
- `offerIncense` creates one incense event and returns the created stick.
- `hitMuyu` creates one hit trace and returns it.
- `getSnapshot` returns data the renderer can read without mutating.
- `toSaveData` excludes transient particles.

## Snapshot

```ts
type RitualSnapshot = {
  burner: {
    totalOffered: number;
    activeSticks: IncenseStick[];
    burnedStubs: IncenseStick[];
    ashMass: number;
    ashVisualHeight: number;
    ashFragments: AshFragment[];
    smokeParticles: SmokeParticle[];
    sparkParticles: SparkParticle[];
    visibleStickLimit: number;
  };
  muyu: {
    hitCount: number;
    traces: HitTrace[];
    shockwaves: Shockwave[];
    offsetX: number;
    offsetY: number;
    rotation: number;
    scaleX: number;
    scaleY: number;
    damageMap?: number[][];
  };
  config: RitualSpecConfig;
};
```

Rules:

- Snapshot arrays should already be capped or ready for stable sampling.
- Renderer code must not depend on private engine internals.

## Renderer Adapter

```ts
type RenderContext = {
  width: number;
  height: number;
  pixelRatio: number;
};

type RendererAdapter = {
  clear(): void;
  save(): void;
  restore(): void;
  translate(x: number, y: number): void;
  rotate(angle: number): void;
  scale(x: number, y: number): void;

  drawPath(path: RitualPath, style: DrawStyle): void;
  drawEllipse(input: EllipseDrawInput): void;
  drawLine(from: Vec2, to: Vec2, style: LineStyle): void;
  drawCircle(center: Vec2, input: CircleDrawInput): void;
  drawArc(input: ArcDrawInput): void;
};
```

Minimum style support:

```ts
type DrawStyle = {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  alpha?: number;
  gradientId?: string;
  shadow?: ShadowStyle;
};

type LineStyle = {
  width: number;
  color: string;
  alpha?: number;
  glow?: boolean;
};
```

Rules:

- Adapters may approximate unsupported effects.
- Layer order is controlled by renderer functions, not by adapter sorting.
- Normalized coordinates are converted before or inside adapter calls, but conversion must be consistent.

## Interaction Contract

```ts
type RitualPointerEvent = {
  kind: "tap" | "longPress" | "move";
  object: "burner" | "muyu";
  point: Vec2;
  now: number;
  pressure?: number;
};
```

Rules:

- Burner taps call `offerIncense`.
- Wooden fish taps call `hitMuyu`.
- Long press and pressure can be added later without changing renderer state ownership.

## Rendering Functions

```ts
function renderBurner(ctx: RendererAdapter, snapshot: RitualSnapshot): void;
function renderMuyu(ctx: RendererAdapter, snapshot: RitualSnapshot): void;
```

Burner layer order:

```txt
1. ground shadow
2. burner rear outline
3. burner body
4. body ornaments
5. inner rim
6. ash bed
7. active sticks and stubs
8. sparks and smoke
9. front rim occlusion
10. foreground highlights
```

Wooden fish layer order:

```txt
1. ground shadow
2. dark body base
3. body outline
4. wood gradient and grain
5. mouth / center seam
6. carved lines
7. hit traces or damage
8. highlights
9. shockwaves
```
