import type { RitualSnapshot, Vec2 } from "./ritualSimulation.js";

export type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type Size = {
  w: number;
  h: number;
};

export type PainterBackendCapabilities = {
  blur: boolean;
  shadow: boolean;
  blendMode: boolean;
  gradients: boolean;
  reducedMotion: boolean;
};

export type PainterLayerName =
  | "background"
  | "muyu.shadow"
  | "muyu.cushion"
  | "muyu.body"
  | "muyu.grain"
  | "muyu.carving"
  | "muyu.mouth"
  | "muyu.traces"
  | "muyu.highlight"
  | "muyu.ripples"
  | "muyu.mallet"
  | "burner.shadow"
  | "burner.body"
  | "burner.ornaments"
  | "burner.innerRim"
  | "burner.ashBed"
  | "burner.offer"
  | "burner.sticks"
  | "burner.stubs"
  | "burner.ashFragments"
  | "burner.smoke"
  | "burner.frontRim"
  | "burner.highlight";

export type ColorStop = {
  offset: number;
  color: string;
};

export type ShadowSpec = {
  color: string;
  blur: number;
  offsetX?: number;
  offsetY?: number;
};

export type PainterDebugInfo = {
  layers: PainterLayerName[];
  dynamicItems: {
    activeSticks: number;
    burnedStubs: number;
    ashFragments: number;
    smokeParticles: number;
    sparkParticles: number;
    muyuTraces: number;
    muyuShockwaves: number;
  };
  cacheKeys: string[];
};

export type PainterCacheKeyInput = {
  rect: Rect;
  pixelRatio: number;
  themeVersion: string;
  capabilities: PainterBackendCapabilities;
  layer: PainterLayerName;
};

export type RitualPainterLayout = {
  root: Rect;
  burner: Rect;
  muyu: Rect;
};

export type InteractionTarget = "burner" | "muyu" | null;

export type RoutedInteraction = {
  target: InteractionTarget;
  local: Vec2 | null;
};

export type RitualPainterProps = {
  snapshot: RitualSnapshot | null;
  pulseId: number;
  muyuPulseId: number;
  onOffer: () => void;
  onKnock: (point?: Vec2) => void;
};

export type MuyuPainterStyle = {
  shadowColor: string;
  cushionBase: string;
  cushionDark: string;
  cushionPattern: string;
  woodDark: string;
  woodBase: string;
  woodLight: string;
  woodHighlight: string;
  mouthDark: string;
  mouthEdge: string;
  carvingDark: string;
  carvingLight: string;
  grainColor: string;
  hitGlow: string;
  rippleColor: string;
  traceDark: string;
  traceLight: string;
  malletHandle: string;
  malletHeadDark: string;
  malletHeadLight: string;
};

export type BurnerPainterStyle = {
  shadowColor: string;
  bodyDark: string;
  bodyBase: string;
  bodyLight: string;
  bodyHighlight: string;
  rimDark: string;
  rimLight: string;
  ashDark: string;
  ashBase: string;
  ashLight: string;
  ashParticle: string;
  incenseBody: string;
  incenseDark: string;
  incenseCoal: string;
  incenseEmber: string;
  incenseGlow: string;
  smokeWarm: string;
  smokeCool: string;
  spark: string;
  ornament: string;
};

export type RitualPainterTheme = {
  version: string;
  backgroundTop: string;
  backgroundBottom: string;
  muyu: MuyuPainterStyle;
  burner: BurnerPainterStyle;
};
