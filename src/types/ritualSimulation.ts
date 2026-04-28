export type Vec2 = {
  x: number;
  y: number;
};

export type AshBed = {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
};

export type IncenseTheme = {
  burnerShape: "round" | "square" | "lotus" | "bronze";
  material: "ceramic" | "bronze" | "stone" | "jade";
  ashColor: string;
  rimPattern: "cloud" | "lotus" | "plain" | "dragon";
};

export type IncenseSpec = {
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

export type MuyuSpec = {
  shape: "classic" | "round" | "lotus";
  woodType: "dark" | "light" | "redwood";
  decaySec: number;
  maxTraceCount: number;
};

export type RitualLodConfig = {
  maxVisibleActiveSticks: number;
  maxVisibleBurnedStubs: number;
  maxSmokeParticles: number;
  maxSparkParticles: number;
  maxMuyuTraces: number;
};

export type RitualSpecConfig = {
  incenseTheme: IncenseTheme;
  incenseTypes: Record<string, IncenseSpec>;
  muyu: MuyuSpec;
  ashBed: AshBed;
  lod: RitualLodConfig;
};

export type IncenseHistoryEvent = {
  id: string;
  typeId: string;
  createdAt: number;
  seed: number;
  x?: number;
  y?: number;
  angle?: number;
  depth?: number;
  length?: number;
  thickness?: number;
};

export type MuyuTraceHistoryEvent = {
  id: string;
  createdAt: number;
  x: number;
  y: number;
  strength: number;
  seed: number;
};

export type RitualSaveData = {
  totalOffered: number;
  incenseHistory: IncenseHistoryEvent[];
  muyuHitCount: number;
  muyuTraceHistory: MuyuTraceHistoryEvent[];
};

export type IncenseStickState = {
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

export type AshFragment = {
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

export type SmokeParticle = {
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

export type SparkParticle = {
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

export type BurnerState = {
  totalOffered: number;
  activeSticks: IncenseStickState[];
  burnedStubs: IncenseStickState[];
  ashMass: number;
  ashHeightMap?: number[][];
  ashFragments: AshFragment[];
  smokeParticles: SmokeParticle[];
  sparkParticles: SparkParticle[];
  lastOfferTime: number | null;
};

export type SpringState = {
  x: number;
  v: number;
};

export type HitTrace = {
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

export type Shockwave = {
  id: string;
  x: number;
  y: number;
  strength: number;
  age: number;
  life: number;
  seed: number;
};

export type MuyuState = {
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

export type RitualEngineState = {
  burner: BurnerState;
  muyu: MuyuState;
  config: RitualSpecConfig;
};

export type RitualSnapshot = RitualEngineState & {
  now: number;
  burner: BurnerState & {
    ashVisualHeight: number;
    visibleStickLimit: number;
  };
};
