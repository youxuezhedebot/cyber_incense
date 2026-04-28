# Data Model: Stateful Ritual Rendering Engine

Spec 005 introduces runtime simulation models. Existing persisted counters in `IncenseState` remain the durable source of truth for counts. New event history should be compact and reconstructable.

## Coordinate System

All ritual object internals use normalized coordinates:

```txt
x: 0..1
y: 0..1
```

Renderer adapters map normalized coordinates to pixels, paths, CSS/SVG values, Canvas units, or other drawing surfaces.

## Basic Geometry

```ts
type Vec2 = {
  x: number;
  y: number;
};

type AshBed = {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
};
```

Default ash bed:

```ts
const defaultAshBed: AshBed = {
  cx: 0.5,
  cy: 0.42,
  rx: 0.28,
  ry: 0.11
};
```

Ellipse membership:

```ts
function insideEllipse(x: number, y: number, bed: AshBed): boolean {
  const dx = (x - bed.cx) / bed.rx;
  const dy = (y - bed.cy) / bed.ry;
  return dx * dx + dy * dy <= 1;
}
```

## Theme And Spec Config

```ts
type IncenseTheme = {
  burnerShape: "round" | "square" | "lotus" | "bronze";
  material: "ceramic" | "bronze" | "stone" | "jade";
  ashColor: string;
  rimPattern: "cloud" | "lotus" | "plain" | "dragon";
};

type IncenseSpec = {
  id: string;
  name: string;
  length: number;
  thickness: number;
  burnDurationSec: number;
  smokeStrength: number;
  ashRate: number;
  stickColor: string;
  emberColor: string;
};

type MuyuSpec = {
  shape: "classic" | "round" | "lotus";
  woodType: "dark" | "light" | "redwood";
  decaySec: number;
  maxTraceCount: number;
};

type RitualSpecConfig = {
  incenseTheme: IncenseTheme;
  incenseTypes: Record<string, IncenseSpec>;
  muyu: MuyuSpec;
  ashBed: AshBed;
  lod: RitualLodConfig;
};

type RitualLodConfig = {
  maxVisibleActiveSticks: number;
  maxVisibleBurnedStubs: number;
  maxSmokeParticles: number;
  maxSparkParticles: number;
  maxMuyuTraces: number;
};
```

## Incense Stick

```ts
type IncenseStick = {
  id: string;
  seed: number;
  typeId: string;

  x: number;
  y: number;
  angle: number;
  depth: number;

  length: number;
  thickness: number;

  createdAt: number;
  burnDuration: number;

  burnProgress: number;
  nextAshProgress: number;

  ashMass: number;
  alive: boolean;
};
```

Rules:

- `angle` is stored in radians internally.
- `createdAt` should be comparable to the engine clock used during updates.
- `burnProgress` is normalized from `0` to `1`.
- `nextAshProgress` advances by a seeded random interval after each ash event.
- `alive = false` means the stick should not render as a full active stick.

## Burner State

```ts
type BurnerState = {
  totalOffered: number;
  activeSticks: IncenseStick[];
  burnedStubs: IncenseStick[];

  ashMass: number;
  ashHeightMap?: number[][];

  ashFragments: AshFragment[];
  smokeParticles: SmokeParticle[];
  sparkParticles: SparkParticle[];

  lastOfferTime: number | null;
};
```

## Incense Particles

```ts
type AshFragment = {
  id: string;
  seed: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  age: number;
  life: number;
  mass: number;
};

type SmokeParticle = {
  id: string;
  x: number;
  y: number;
  age: number;
  life: number;
  vx: number;
  vy: number;
  phase: number;
  size: number;
};

type SparkParticle = {
  id: string;
  x: number;
  y: number;
  age: number;
  life: number;
  vx: number;
  vy: number;
  size: number;
  seed: number;
};
```

Rules:

- Particles are runtime-only and not durable persisted state.
- Dead particles are removed when `age >= life`.
- Smoke alpha should fade in and out, for example `sin(t * PI) * maxAlpha`.

## Incense Placement

Create stick:

```ts
function createIncenseStick(state: BurnerState, now: number): IncenseStick;
```

Slot search:

```ts
function findSlotInAshBed(seed: number, existing: IncenseStick[], bed: AshBed): Vec2;
```

Expected behavior:

- Sample deterministic random points inside the ash-bed ellipse.
- Score candidates by distance from existing sticks and a small center bias.
- Use the best candidate from a fixed sample count such as 32.
- Result should be stable for the same seed and existing state.

## Incense Burn Helpers

```ts
function getRemainingLength(stick: IncenseStick): number {
  return stick.length * (1 - stick.burnProgress);
}

function getEmberPoint(stick: IncenseStick): Vec2 {
  const remain = getRemainingLength(stick);

  return {
    x: stick.x + Math.sin(stick.angle) * remain,
    y: stick.y - Math.cos(stick.angle) * remain
  };
}

function getAshVisualHeight(ashMass: number): number {
  return Math.min(1, Math.sqrt(ashMass) * 0.08);
}
```

## LOD Rules

```ts
function getVisibleStickLimit(total: number): number {
  if (total <= 20) return total;
  if (total <= 100) return 40;
  return 60;
}
```

Rules:

- `1..20` offerings may render individual sticks clearly.
- `20..100` offerings render representative sticks and convert remainder into stubs, ash, soot, or density.
- `100+` offerings use aggregate ash height, representative sticks, residual marks, and stable sampling.

## Wooden Fish State

```ts
type MuyuState = {
  hitCount: number;

  traces: HitTrace[];
  shockwaves: Shockwave[];

  impulse: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
  scaleX: number;
  scaleY: number;

  spring: SpringState;
  damageMap?: number[][];
};

type HitTrace = {
  id: string;
  x: number;
  y: number;
  strength: number;
  radius: number;
  createdAt: number;
  age: number;
  life: number;
  seed: number;
};

type Shockwave = {
  id: string;
  x: number;
  y: number;
  strength: number;
  age: number;
  life: number;
  seed: number;
};

type SpringState = {
  x: number;
  v: number;
};
```

## Wooden Fish Hit Logic

```ts
function computeHitStrength(point: Vec2, state: MuyuState): number {
  const center = { x: 0.5, y: 0.5 };
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  const d = Math.sqrt(dx * dx + dy * dy);

  const centerFactor = 1 - Math.min(1, d / 0.45);
  const comboFactor = Math.min(1.5, 1 + state.hitCount * 0.01);

  return 0.6 + centerFactor * 0.4 * comboFactor;
}
```

```ts
function applyMuyuImpulse(state: MuyuState, point: Vec2, strength: number): void {
  const dx = point.x - 0.5;

  state.impulse += strength;
  state.offsetY += strength * 0.01;
  state.rotation += dx * strength * 0.04;
  state.scaleX = 1 + strength * 0.015;
  state.scaleY = 1 - strength * 0.025;
}
```

## Spring Update

```ts
function updateSpring(s: SpringState, target: number, dt: number): void {
  const stiffness = 180;
  const damping = 22;

  const force = (target - s.x) * stiffness;
  const damp = -s.v * damping;

  s.v += (force + damp) * dt;
  s.x += s.v * dt;
}
```

## Trace Decay

```ts
function traceAlpha(trace: HitTrace): number {
  const t = trace.age / trace.life;
  return Math.pow(1 - t, 1.8);
}

function traceRadius(trace: HitTrace): number {
  const t = trace.age / trace.life;
  return trace.radius * (1 + t * 0.25);
}
```

## Optional Damage Map

```ts
type DamageMap = number[][];
```

Rules:

- Suggested resolution is `64 x 64`.
- A hit writes a Gaussian kernel at normalized hit coordinates.
- Each update fades damage by an exponential decay such as `exp(-dt / 12)`.
- Rendering can darken or reduce local gloss where damage is higher.

## Ritual Engine

```ts
type RitualEngineState = {
  burner: BurnerState;
  muyu: MuyuState;
  config: RitualSpecConfig;
};

class RitualEngine {
  state: RitualEngineState;

  update(dt: number, now: number): void;
  offerIncense(now: number): IncenseStick;
  hitMuyu(point: Vec2, now: number): HitTrace;
  getSnapshot(): RitualEngineState;
}
```

Rules:

- `dt` should be clamped, for example to `0.033`, to avoid huge single-frame jumps.
- The engine can use wall-clock timestamps for persisted restore and monotonic frame time for animation.
- Renderer components should treat snapshots as read-only.

## Durable Save Data

```ts
type RitualSaveData = {
  totalOffered: number;

  incenseHistory: {
    id: string;
    typeId: string;
    createdAt: number;
    seed: number;
  }[];

  muyuHitCount: number;

  muyuTraceHistory: {
    createdAt: number;
    x: number;
    y: number;
    strength: number;
    seed: number;
  }[];
};
```

Rules:

- Save core events and seeds.
- Do not save particles.
- Reconstruct burn progress and still-visible traces from elapsed time.
- Existing Spec 004 count-only state can initialize aggregate ash and hit count without full event history.
