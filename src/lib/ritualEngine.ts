import type { IncenseState } from "../types/incense.js";
import type {
  AshBed,
  AshFragment,
  BurnerState,
  HitTrace,
  IncenseHistoryEvent,
  IncenseSpec,
  IncenseStickState,
  MuyuState,
  MuyuTraceHistoryEvent,
  RitualEngineState,
  RitualSaveData,
  RitualSnapshot,
  RitualSpecConfig,
  Shockwave,
  SmokeParticle,
  SparkParticle,
  Vec2
} from "../types/ritualSimulation.js";
import { clamp, DEFAULT_ASH_BED, distance, normalizePoint } from "./ritualGeometry.js";
import { hashSeed, randomRange, seededRandom, stableId } from "./ritualRandom.js";

const MAX_PERSISTED_INCENSE_EVENTS = 160;
const MAX_PERSISTED_MUYU_EVENTS = 120;
const MAX_BURNED_STUBS = 220;

export type CreateRitualEngineInput = {
  now: number;
  appState: IncenseState;
  saveData?: RitualSaveData;
  config?: Partial<RitualSpecConfig>;
};

export const DEFAULT_RITUAL_CONFIG: RitualSpecConfig = {
  incenseTheme: {
    burnerShape: "round",
    material: "bronze",
    ashColor: "#d6c5ad",
    rimPattern: "cloud"
  },
  incenseTypes: {
    default: {
      id: "default",
      name: "Default Incense",
      length: 0.46,
      thickness: 0.006,
      burnDurationSec: 10,
      smokeStrength: 1,
      ashRate: 1,
      stickColor: "#8b3f25",
      emberColor: "#ff6a2a"
    }
  },
  muyu: {
    shape: "classic",
    woodType: "dark",
    decaySec: 120,
    maxTraceCount: 24
  },
  ashBed: DEFAULT_ASH_BED,
  lod: {
    maxVisibleActiveSticks: 60,
    maxVisibleBurnedStubs: 44,
    maxSmokeParticles: 48,
    maxSparkParticles: 24,
    maxMuyuTraces: 24
  }
};

export function createRitualEngine(input: CreateRitualEngineInput): RitualEngine {
  return new RitualEngine(input);
}

export function createIncenseHistoryEvent(
  totalOffered: number,
  now: number,
  existingEvents: IncenseHistoryEvent[] = []
): IncenseHistoryEvent {
  const seed = hashSeed(`incense-${totalOffered}-${Math.round(now)}`);
  const draft: IncenseHistoryEvent = {
    id: stableId("incense", seed, now),
    typeId: "default",
    createdAt: now,
    seed
  };

  return hydrateIncensePlacement(draft, existingEvents);
}

export function createMuyuTraceHistoryEvent(point: Vec2 | undefined, hitCount: number, now: number): MuyuTraceHistoryEvent {
  const normalized = normalizePoint(point ?? { x: 0.5, y: 0.5 });
  const seed = hashSeed(`muyu-${hitCount}-${normalized.x.toFixed(4)}-${normalized.y.toFixed(4)}-${Math.round(now)}`);
  const strength = computeHitStrength(normalized, hitCount);

  return {
    id: stableId("muyu", seed, now),
    createdAt: now,
    x: normalized.x,
    y: normalized.y,
    strength,
    seed
  };
}

export function normalizeRitualSaveData(input: unknown, appState: Pick<IncenseState, "todayPrayerCount" | "muyuCount">): RitualSaveData {
  const source = isRecord(input) ? input : {};
  const incenseHistory = Array.isArray(source.incenseHistory)
    ? source.incenseHistory.map(normalizeIncenseHistoryEvent).filter(isDefined).slice(-MAX_PERSISTED_INCENSE_EVENTS)
    : [];
  const muyuTraceHistory = Array.isArray(source.muyuTraceHistory)
    ? source.muyuTraceHistory.map(normalizeMuyuTraceHistoryEvent).filter(isDefined).slice(-MAX_PERSISTED_MUYU_EVENTS)
    : [];

  return {
    totalOffered: normalizeCount(source.totalOffered, appState.todayPrayerCount),
    incenseHistory: hydrateIncensePlacements(incenseHistory),
    muyuHitCount: normalizeCount(source.muyuHitCount, appState.muyuCount),
    muyuTraceHistory
  };
}

export function truncateRitualSaveData(saveData: RitualSaveData): RitualSaveData {
  return {
    totalOffered: Math.max(0, Math.floor(saveData.totalOffered)),
    incenseHistory: hydrateIncensePlacements(saveData.incenseHistory.slice(-MAX_PERSISTED_INCENSE_EVENTS)),
    muyuHitCount: Math.max(0, Math.floor(saveData.muyuHitCount)),
    muyuTraceHistory: saveData.muyuTraceHistory.slice(-MAX_PERSISTED_MUYU_EVENTS)
  };
}

export function findSlotInAshBed(seed: number, existing: IncenseStickState[], bed: AshBed = DEFAULT_ASH_BED): Vec2 {
  let best = { x: bed.cx, y: bed.cy };
  let bestScore = -Infinity;

  for (let index = 0; index < 32; index += 1) {
    const r1 = seededRandom(seed + index * 17);
    const r2 = seededRandom(seed + index * 31);
    const angle = r1 * Math.PI * 2;
    const radius = Math.sqrt(r2);
    const candidate = {
      x: bed.cx + Math.cos(angle) * bed.rx * radius,
      y: bed.cy + Math.sin(angle) * bed.ry * radius
    };

    const minDist =
      existing.length === 0 ? 1 : existing.reduce((current, stick) => Math.min(current, distance(candidate, stick)), Infinity);
    const centerBias = 1 - Math.abs(candidate.y - bed.cy);
    const score = minDist + centerBias * 0.05;

    if (score > bestScore) {
      bestScore = score;
      best = candidate;
    }
  }

  return best;
}

export function getVisibleStickLimit(total: number): number {
  if (total <= 20) return total;
  if (total <= 100) return 40;
  return 60;
}

export function getAshVisualHeight(ashMass: number): number {
  return Math.min(1, Math.sqrt(Math.max(0, ashMass)) * 0.08);
}

export function getRemainingLength(stick: IncenseStickState): number {
  return stick.length * (1 - stick.burnProgress);
}

export function getEmberPoint(stick: IncenseStickState): Vec2 {
  const remain = getRemainingLength(stick);

  return {
    x: stick.x + Math.sin(stick.angle) * remain,
    y: stick.y - Math.cos(stick.angle) * remain
  };
}

export function computeHitStrength(point: Vec2, hitCount: number): number {
  const normalized = normalizePoint(point);
  const dx = normalized.x - 0.5;
  const dy = normalized.y - 0.5;
  const d = Math.sqrt(dx * dx + dy * dy);
  const centerFactor = 1 - Math.min(1, d / 0.45);
  const comboFactor = Math.min(1.5, 1 + hitCount * 0.01);

  return 0.6 + centerFactor * 0.4 * comboFactor;
}

export function traceAlpha(trace: HitTrace): number {
  const t = clamp(trace.age / trace.life, 0, 1);
  return Math.pow(1 - t, 1.8);
}

export function traceRadius(trace: HitTrace): number {
  const t = clamp(trace.age / trace.life, 0, 1);
  return trace.radius * (1 - t * 0.12);
}

export class RitualEngine {
  private state: RitualEngineState;
  private now: number;

  constructor(input: CreateRitualEngineInput) {
    this.now = input.now;
    const config = mergeConfig(input.appState, input.config);
    const saveData = normalizeRitualSaveData(input.saveData ?? input.appState.ritual, input.appState);

    this.state = {
      config,
      burner: restoreBurnerState(input.appState, saveData, config, input.now),
      muyu: restoreMuyuState(input.appState, saveData, config, input.now)
    };
  }

  update(dt: number, now: number): void {
    const safeDt = clamp(dt, 0, 0.033);
    this.now = now;
    updateBurner(this.state.burner, this.state.config, safeDt, now);
    updateMuyu(this.state.muyu, this.state.config, safeDt);
  }

  offerIncense(now: number): IncenseStickState {
    const event = createIncenseHistoryEvent(this.state.burner.totalOffered, now);
    const stick = createIncenseStick(event, this.state.burner, this.state.config, now, 0);

    this.state.burner.totalOffered += 1;
    this.state.burner.activeSticks.push(stick);
    this.state.burner.lastOfferTime = now;
    emitSparkParticles(this.state.burner, stick, this.state.config, now);
    return stick;
  }

  hitMuyu(point: Vec2, now: number): HitTrace {
    const event = createMuyuTraceHistoryEvent(point, this.state.muyu.hitCount, now);
    const trace = createHitTrace(event, now, this.state.config);

    this.state.muyu.hitCount += 1;
    this.state.muyu.traces.push(trace);
    this.state.muyu.shockwaves.push(createShockwave(event));
    applyMuyuImpulse(this.state.muyu, trace, trace.strength);
    return trace;
  }

  getSnapshot(): RitualSnapshot {
    const burner = this.state.burner;
    const muyu = this.state.muyu;

    return {
      now: this.now,
      config: this.state.config,
      burner: {
        ...burner,
        activeSticks: stableVisibleSticks(burner.activeSticks, burner.totalOffered).map(copyStick),
        burnedStubs: selectVisibleBurnedStubs(burner.burnedStubs, this.state.config.lod.maxVisibleBurnedStubs).map(copyStick),
        ashFragments: burner.ashFragments.map((fragment) => ({ ...fragment })),
        smokeParticles: burner.smokeParticles.map((particle) => ({ ...particle })),
        sparkParticles: burner.sparkParticles.map((particle) => ({ ...particle })),
        ashVisualHeight: getAshVisualHeight(burner.ashMass),
        visibleStickLimit: getVisibleStickLimit(burner.totalOffered)
      },
      muyu: {
        ...muyu,
        traces: muyu.traces.slice(-this.state.config.lod.maxMuyuTraces).map((trace) => ({ ...trace })),
        shockwaves: muyu.shockwaves.map((wave) => ({ ...wave })),
        spring: { ...muyu.spring },
        damageMap: muyu.damageMap?.map((row) => [...row])
      }
    };
  }

  toSaveData(): RitualSaveData {
    return truncateRitualSaveData({
      totalOffered: this.state.burner.totalOffered,
      incenseHistory: this.state.burner.activeSticks
        .concat(this.state.burner.burnedStubs)
        .filter((stick) => !stick.id.startsWith("aggregate-stub-"))
        .map((stick) => ({
          id: stick.id,
          typeId: stick.typeId,
          createdAt: stick.createdAt,
          seed: stick.seed,
          x: stick.x,
          y: stick.y,
          angle: stick.angle,
          depth: stick.depth,
          length: stick.length,
          thickness: stick.thickness
        })),
      muyuHitCount: this.state.muyu.hitCount,
      muyuTraceHistory: this.state.muyu.traces.map((trace) => ({
        id: trace.id,
        createdAt: trace.createdAt,
        x: trace.x,
        y: trace.y,
        strength: trace.strength,
        seed: trace.seed
      }))
    });
  }

  hasActiveRuntime(): boolean {
    const { burner, muyu } = this.state;

    return (
      burner.activeSticks.length > 0 ||
      burner.ashFragments.length > 0 ||
      burner.smokeParticles.length > 0 ||
      burner.sparkParticles.length > 0 ||
      muyu.traces.length > 0 ||
      muyu.shockwaves.length > 0 ||
      Math.abs(muyu.offsetY) > 0.001 ||
      Math.abs(muyu.rotation) > 0.001 ||
      Math.abs(muyu.spring.x) > 0.001 ||
      Math.abs(muyu.spring.v) > 0.001
    );
  }
}

function mergeConfig(appState: IncenseState, override?: Partial<RitualSpecConfig>): RitualSpecConfig {
  const burnDurationSec = appState.visuals.incenseBurnDurationMs / 1000;
  const runtimeMuyuTraceCap = Math.max(appState.visuals.maxVisibleMuyuMarks * 3, DEFAULT_RITUAL_CONFIG.lod.maxMuyuTraces);
  const defaultIncense: IncenseSpec = {
    ...DEFAULT_RITUAL_CONFIG.incenseTypes.default,
    burnDurationSec
  };

  return {
    incenseTheme: {
      ...DEFAULT_RITUAL_CONFIG.incenseTheme,
      ...override?.incenseTheme
    },
    incenseTypes: {
      default: defaultIncense,
      ...override?.incenseTypes
    },
    muyu: {
      ...DEFAULT_RITUAL_CONFIG.muyu,
      decaySec: appState.visuals.muyuTraceDecayMs / 1000,
      maxTraceCount: runtimeMuyuTraceCap,
      ...override?.muyu
    },
    ashBed: {
      ...DEFAULT_RITUAL_CONFIG.ashBed,
      ...override?.ashBed
    },
    lod: {
      ...DEFAULT_RITUAL_CONFIG.lod,
      maxVisibleActiveSticks: Math.max(appState.visuals.maxActiveIncense, DEFAULT_RITUAL_CONFIG.lod.maxVisibleActiveSticks),
      maxMuyuTraces: runtimeMuyuTraceCap,
      ...override?.lod
    }
  };
}

function restoreBurnerState(appState: IncenseState, saveData: RitualSaveData, config: RitualSpecConfig, now: number): BurnerState {
  const burner: BurnerState = {
    totalOffered: appState.todayPrayerCount,
    activeSticks: [],
    burnedStubs: [],
    ashMass: 0,
    ashFragments: [],
    smokeParticles: [],
    sparkParticles: [],
    lastOfferTime: null
  };
  const events = saveData.incenseHistory.slice(-MAX_PERSISTED_INCENSE_EVENTS).sort((a, b) => a.createdAt - b.createdAt);
  const missingAggregatedOfferings = Math.max(0, appState.todayPrayerCount - events.length);
  const realPlacementHistory: IncenseStickState[] = [];

  burner.ashMass += missingAggregatedOfferings * 0.16;

  for (const event of events) {
    const hydratedEvent = hydrateIncensePlacement(event, realPlacementHistory.map(stickToHistoryEvent));
    const stick = createIncenseStick(hydratedEvent, { activeSticks: realPlacementHistory, burnedStubs: [] }, config, now, undefined);
    realPlacementHistory.push(stick);
    burner.lastOfferTime = Math.max(burner.lastOfferTime ?? 0, event.createdAt);

    if (stick.burnProgress >= 1) {
      burner.burnedStubs.push({
        ...stick,
        alive: false,
        burnProgress: 1,
        ashMass: stick.length * 0.8
      });
      burner.ashMass += stick.length * 0.8;
    } else {
      burner.activeSticks.push(stick);
      emitSparkParticles(burner, stick, config, now);
    }
  }

  const aggregatePlacementHistory: IncenseStickState[] = [];

  for (let index = 0; index < Math.min(missingAggregatedOfferings, config.lod.maxVisibleBurnedStubs); index += 1) {
    const seed = hashSeed(`aggregate-incense-${index}`);
    const event: IncenseHistoryEvent = {
      id: `aggregate-stub-${seed.toString(16)}`,
      typeId: "default",
      createdAt: now - (config.incenseTypes.default.burnDurationSec + 1 + index) * 1000,
      seed,
      ...createAggregatePlacement(seed, aggregatePlacementHistory)
    };
    const stub = createIncenseStick(event, { activeSticks: aggregatePlacementHistory, burnedStubs: [] }, config, now, 1);
    const aggregateStub = {
      ...stub,
      alive: false,
      burnProgress: 1,
      ashMass: stub.length * 0.8
    };

    aggregatePlacementHistory.push(aggregateStub);
    burner.burnedStubs.push(aggregateStub);
  }

  burner.burnedStubs = burner.burnedStubs.slice(-MAX_BURNED_STUBS);
  return burner;
}

function restoreMuyuState(appState: IncenseState, saveData: RitualSaveData, config: RitualSpecConfig, now: number): MuyuState {
  const traces = saveData.muyuTraceHistory
    .map((event) => createHitTrace(event, now, config))
    .filter((trace) => trace.age < trace.life)
    .slice(-config.lod.maxMuyuTraces);

  return {
    hitCount: appState.muyuCount,
    traces,
    shockwaves: [],
    impulse: 0,
    offsetX: 0,
    offsetY: 0,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    spring: {
      x: 0,
      v: 0
    }
  };
}

function createIncenseStick(
  event: IncenseHistoryEvent,
  state: Pick<BurnerState, "activeSticks" | "burnedStubs">,
  config: RitualSpecConfig,
  now: number,
  initialProgress: number | undefined
): IncenseStickState {
  const seed = event.seed;
  const type = config.incenseTypes[event.typeId] ?? config.incenseTypes.default;
  const existing = state.activeSticks.concat(state.burnedStubs);
  const pos = findSlotInAshBed(seed, existing, config.ashBed);
  const ageProgress = clamp((now - event.createdAt) / 1000 / type.burnDurationSec, 0, 1);
  const burnProgress = initialProgress ?? ageProgress;

  return {
    id: event.id,
    seed,
    typeId: event.typeId,
    x: isFiniteNumber(event.x) ? event.x : pos.x,
    y: isFiniteNumber(event.y) ? event.y : pos.y,
    angle: isFiniteNumber(event.angle) ? event.angle : (randomRange(seed + 1, -8, 8) * Math.PI) / 180,
    depth: isFiniteNumber(event.depth) ? event.depth : randomRange(seed + 2, 0.35, 0.75),
    length: isFiniteNumber(event.length) ? event.length : randomRange(seed + 3, type.length * 0.92, type.length * 1.1),
    thickness: isFiniteNumber(event.thickness) ? event.thickness : randomRange(seed + 4, type.thickness * 0.82, type.thickness * 1.18),
    createdAt: event.createdAt,
    burnDuration: type.burnDurationSec,
    burnProgress,
    nextAshProgress: burnProgress > 0 ? Math.min(0.95, burnProgress + randomRange(seed + 5, 0.04, 0.1)) : 0.08,
    ashMass: 0,
    alive: burnProgress < 1
  };
}

function updateBurner(state: BurnerState, config: RitualSpecConfig, dt: number, now: number): void {
  for (const stick of state.activeSticks) {
    const age = (now - stick.createdAt) / 1000;
    stick.burnProgress = clamp(age / stick.burnDuration, 0, 1);
    updateIncenseAsh(state, stick, dt, now);
    updateIncenseSmoke(state, stick, config, dt, now);

    if (stick.burnProgress >= 1) {
      stick.alive = false;
      state.burnedStubs.push({
        ...stick,
        ashMass: stick.length * 0.8
      });
      state.ashMass += stick.length * 0.8;
    }
  }

  state.activeSticks = state.activeSticks.filter((stick) => stick.alive);
  state.burnedStubs = state.burnedStubs.slice(-MAX_BURNED_STUBS);
  updateAshFragments(state.ashFragments, dt);
  updateSmokeParticles(state.smokeParticles, dt);
  updateSparkParticles(state.sparkParticles, dt);
  capParticles(state, config);
}

function updateIncenseAsh(state: BurnerState, stick: IncenseStickState, _dt: number, now: number): void {
  let guard = 0;

  while (stick.burnProgress >= stick.nextAshProgress && stick.nextAshProgress < 0.98 && guard < 3) {
    const ember = getEmberPoint(stick);
    const seed = hashSeed(`${stick.id}-ash-${stick.nextAshProgress.toFixed(3)}`);

    state.ashFragments.push({
      id: stableId("ash", seed, now),
      seed,
      x: ember.x,
      y: ember.y,
      targetX: stick.x + randomRange(seed + 1, -0.04, 0.04),
      targetY: stick.y + randomRange(seed + 2, -0.02, 0.02),
      age: 0,
      life: randomRange(seed + 3, 0.8, 1.4),
      mass: 0.02
    });

    stick.ashMass += 0.02;
    state.ashMass += 0.02;
    stick.nextAshProgress += randomRange(seed + 4, 0.06, 0.13);
    guard += 1;
  }
}

function updateIncenseSmoke(
  state: BurnerState,
  stick: IncenseStickState,
  config: RitualSpecConfig,
  dt: number,
  now: number
): void {
  const type = config.incenseTypes[stick.typeId] ?? config.incenseTypes.default;
  const tick = Math.floor(now / 140);
  const chance = Math.min(0.9, dt * 9 * type.smokeStrength);
  const seed = hashSeed(`${stick.id}-smoke-${tick}`);

  if (
    state.smokeParticles.length >= config.lod.maxSmokeParticles ||
    seededRandom(stick.seed + tick) > chance ||
    state.smokeParticles.some((particle) => particle.id.startsWith(`smoke-${seed.toString(16)}-`))
  ) {
    return;
  }

  const ember = getEmberPoint(stick);

  state.smokeParticles.push({
    id: stableId("smoke", seed, now),
    x: ember.x + randomRange(seed + 1, -0.006, 0.006),
    y: ember.y + randomRange(seed + 2, -0.006, 0.006),
    age: 0,
    life: randomRange(seed + 3, 1.8, 3.8),
    vx: randomRange(seed + 4, -0.018, 0.018),
    vy: randomRange(seed + 5, -0.07, -0.035),
    phase: randomRange(seed + 6, 0, Math.PI * 2),
    size: randomRange(seed + 7, 0.008, 0.018)
  });
}

function emitSparkParticles(state: BurnerState, stick: IncenseStickState, config: RitualSpecConfig, now: number): void {
  if (state.sparkParticles.length >= config.lod.maxSparkParticles) return;

  const ember = getEmberPoint(stick);
  const count = Math.min(4, config.lod.maxSparkParticles - state.sparkParticles.length);

  for (let index = 0; index < count; index += 1) {
    const seed = hashSeed(`${stick.id}-spark-${index}-${Math.round(now)}`);
    state.sparkParticles.push({
      id: stableId("spark", seed, now + index),
      x: ember.x,
      y: ember.y,
      age: 0,
      life: randomRange(seed + 1, 0.35, 0.8),
      vx: randomRange(seed + 2, -0.035, 0.035),
      vy: randomRange(seed + 3, -0.045, 0.006),
      size: randomRange(seed + 4, 0.005, 0.011),
      seed
    });
  }
}

function updateAshFragments(fragments: AshFragment[], dt: number): void {
  for (const fragment of fragments) {
    fragment.age += dt;
    const t = clamp(fragment.age / fragment.life, 0, 1);
    fragment.x += (fragment.targetX - fragment.x) * (0.08 + t * 0.18);
    fragment.y += (fragment.targetY - fragment.y) * (0.08 + t * 0.18);
  }

  removeDead(fragments);
}

function updateSmokeParticles(particles: SmokeParticle[], dt: number): void {
  for (const particle of particles) {
    particle.age += dt;
    particle.x += particle.vx * dt + Math.sin(particle.phase + particle.age * 2) * 0.0008;
    particle.y += particle.vy * dt;
    particle.size *= 1.002;
  }

  removeDead(particles);
}

function updateSparkParticles(particles: SparkParticle[], dt: number): void {
  for (const particle of particles) {
    particle.age += dt;
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
  }

  removeDead(particles);
}

function updateMuyu(state: MuyuState, config: RitualSpecConfig, dt: number): void {
  for (const trace of state.traces) {
    trace.age += dt;
  }

  for (const wave of state.shockwaves) {
    wave.age += dt;
  }

  state.traces = state.traces.filter((trace) => trace.age < trace.life).slice(-config.lod.maxMuyuTraces);
  state.shockwaves = state.shockwaves.filter((wave) => wave.age < wave.life);

  updateSpring(state.spring, 0, dt);
  const decay = Math.exp(-dt * 8);
  state.offsetX *= decay;
  state.offsetY *= decay;
  state.rotation *= Math.exp(-dt * 9);
  state.impulse *= Math.exp(-dt * 7);
  state.scaleX = 1 + state.spring.x * 0.015;
  state.scaleY = 1 - state.spring.x * 0.025;
}

function createHitTrace(event: MuyuTraceHistoryEvent, now: number, config: RitualSpecConfig): HitTrace {
  const age = Math.max(0, (now - event.createdAt) / 1000);
  const life = config.muyu.decaySec + event.strength * 5;

  return {
    id: event.id,
    x: event.x,
    y: event.y,
    strength: event.strength,
    radius: 0.04 + event.strength * 0.03,
    createdAt: event.createdAt,
    age,
    life,
    seed: event.seed
  };
}

function createShockwave(event: MuyuTraceHistoryEvent): Shockwave {
  return {
    id: `${event.id}-wave`,
    x: event.x,
    y: event.y,
    strength: event.strength,
    age: 0,
    life: 0.55,
    seed: event.seed
  };
}

function applyMuyuImpulse(state: MuyuState, trace: HitTrace, strength: number): void {
  const dx = trace.x - 0.5;
  const dy = trace.y - 0.5;

  state.impulse += strength;
  state.offsetX += dx * strength * 0.016;
  state.offsetY += (0.008 + dy * 0.01) * strength;
  state.rotation += dx * strength * 0.06;
  state.spring.v += strength * 16;
}

function updateSpring(spring: { x: number; v: number }, target: number, dt: number): void {
  const stiffness = 180;
  const damping = 22;
  const force = (target - spring.x) * stiffness;
  const damp = -spring.v * damping;

  spring.v += (force + damp) * dt;
  spring.x += spring.v * dt;
}

function stableVisibleSticks(sticks: IncenseStickState[], total: number): IncenseStickState[] {
  const limit = getVisibleStickLimit(total);
  if (sticks.length <= limit) return [...sticks].sort(compareStickDepth);

  return [...sticks]
    .sort((a, b) => seededRandom(a.seed) - seededRandom(b.seed))
    .slice(0, limit)
    .sort(compareStickDepth);
}

function selectVisibleBurnedStubs(stubs: IncenseStickState[], limit: number): IncenseStickState[] {
  if (stubs.length <= limit) return [...stubs].sort(compareStickDepth);

  const aggregate = stubs
    .filter((stick) => stick.id.startsWith("aggregate-stub-"))
    .sort((a, b) => a.id.localeCompare(b.id));
  const real = stubs
    .filter((stick) => !stick.id.startsWith("aggregate-stub-"))
    .sort((a, b) => a.createdAt - b.createdAt || a.id.localeCompare(b.id));
  const aggregateLimit = Math.min(aggregate.length, Math.ceil(limit * 0.55));
  const realLimit = Math.max(0, limit - aggregateLimit);

  return real.slice(0, realLimit).concat(aggregate.slice(0, aggregateLimit)).sort(compareStickDepth);
}

function compareStickDepth(a: IncenseStickState, b: IncenseStickState): number {
  return a.depth - b.depth || a.y - b.y;
}

function capParticles(state: BurnerState, config: RitualSpecConfig): void {
  state.smokeParticles = state.smokeParticles.slice(-config.lod.maxSmokeParticles);
  state.sparkParticles = state.sparkParticles.slice(-config.lod.maxSparkParticles);
  state.ashFragments = state.ashFragments.slice(-config.lod.maxVisibleBurnedStubs);
}

function removeDead(items: Array<{ age: number; life: number }>): void {
  for (let index = items.length - 1; index >= 0; index -= 1) {
    if (items[index].age >= items[index].life) {
      items.splice(index, 1);
    }
  }
}

function copyStick(stick: IncenseStickState): IncenseStickState {
  return { ...stick };
}

function hydrateIncensePlacements(events: IncenseHistoryEvent[]): IncenseHistoryEvent[] {
  const hydrated: IncenseHistoryEvent[] = [];

  for (const event of [...events].sort((a, b) => a.createdAt - b.createdAt || a.id.localeCompare(b.id))) {
    hydrated.push(hydrateIncensePlacement(event, hydrated));
  }

  return hydrated;
}

function hydrateIncensePlacement(event: IncenseHistoryEvent, existingEvents: IncenseHistoryEvent[]): IncenseHistoryEvent {
  if (
    isFiniteNumber(event.x) &&
    isFiniteNumber(event.y) &&
    isFiniteNumber(event.angle) &&
    isFiniteNumber(event.depth) &&
    isFiniteNumber(event.length) &&
    isFiniteNumber(event.thickness)
  ) {
    return event;
  }

  const existing = existingEvents.map(historyEventToPlacementStick);
  const placement = createAggregatePlacement(event.seed, existing);

  return {
    ...event,
    ...placement
  };
}

function createAggregatePlacement(seed: number, existing: IncenseStickState[]): Required<Pick<IncenseHistoryEvent, "x" | "y" | "angle" | "depth" | "length" | "thickness">> {
  const pos = findSlotInAshBed(seed, existing, DEFAULT_RITUAL_CONFIG.ashBed);
  const type = DEFAULT_RITUAL_CONFIG.incenseTypes.default;

  return {
    x: pos.x,
    y: pos.y,
    angle: (randomRange(seed + 1, -8, 8) * Math.PI) / 180,
    depth: randomRange(seed + 2, 0.35, 0.75),
    length: randomRange(seed + 3, type.length * 0.92, type.length * 1.1),
    thickness: randomRange(seed + 4, type.thickness * 0.82, type.thickness * 1.18)
  };
}

function stickToHistoryEvent(stick: IncenseStickState): IncenseHistoryEvent {
  return {
    id: stick.id,
    typeId: stick.typeId,
    createdAt: stick.createdAt,
    seed: stick.seed,
    x: stick.x,
    y: stick.y,
    angle: stick.angle,
    depth: stick.depth,
    length: stick.length,
    thickness: stick.thickness
  };
}

function historyEventToPlacementStick(event: IncenseHistoryEvent): IncenseStickState {
  const placement = createAggregatePlacement(event.seed, []);

  return {
    id: event.id,
    seed: event.seed,
    typeId: event.typeId,
    x: isFiniteNumber(event.x) ? event.x : placement.x,
    y: isFiniteNumber(event.y) ? event.y : placement.y,
    angle: isFiniteNumber(event.angle) ? event.angle : placement.angle,
    depth: isFiniteNumber(event.depth) ? event.depth : placement.depth,
    length: isFiniteNumber(event.length) ? event.length : placement.length,
    thickness: isFiniteNumber(event.thickness) ? event.thickness : placement.thickness,
    createdAt: event.createdAt,
    burnDuration: DEFAULT_RITUAL_CONFIG.incenseTypes.default.burnDurationSec,
    burnProgress: 1,
    nextAshProgress: 1,
    ashMass: 0,
    alive: false
  };
}

function normalizeIncenseHistoryEvent(value: unknown): IncenseHistoryEvent | null {
  if (!isRecord(value)) return null;
  const seed = normalizeSeed(value.seed);
  const createdAt = normalizeTimestamp(value.createdAt);

  if (seed === null || createdAt === null) return null;

  return {
    id: typeof value.id === "string" ? value.id : stableId("incense", seed, createdAt),
    typeId: typeof value.typeId === "string" ? value.typeId : "default",
    createdAt,
    seed,
    x: normalizeOptionalNumber(value.x),
    y: normalizeOptionalNumber(value.y),
    angle: normalizeOptionalNumber(value.angle),
    depth: normalizeOptionalNumber(value.depth),
    length: normalizeOptionalNumber(value.length),
    thickness: normalizeOptionalNumber(value.thickness)
  };
}

function normalizeMuyuTraceHistoryEvent(value: unknown): MuyuTraceHistoryEvent | null {
  if (!isRecord(value)) return null;
  const seed = normalizeSeed(value.seed);
  const createdAt = normalizeTimestamp(value.createdAt);

  if (seed === null || createdAt === null) return null;

  const point = normalizePoint({
    x: typeof value.x === "number" ? value.x : 0.5,
    y: typeof value.y === "number" ? value.y : 0.5
  });

  return {
    id: typeof value.id === "string" ? value.id : stableId("muyu", seed, createdAt),
    createdAt,
    x: point.x,
    y: point.y,
    strength: typeof value.strength === "number" && Number.isFinite(value.strength) ? clamp(value.strength, 0.3, 2) : 1,
    seed
  };
}

function normalizeSeed(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return value >>> 0;
}

function normalizeTimestamp(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return Math.max(0, value);
}

function normalizeOptionalNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function normalizeCount(value: unknown, fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return Math.max(0, Math.floor(fallback));
  return Math.max(0, Math.floor(value));
}

function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
