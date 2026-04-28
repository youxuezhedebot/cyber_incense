import type { PainterBackendCapabilities, RitualPainterTheme } from "../../types/ritualPainter.js";

export const DEFAULT_PAINTER_CAPABILITIES: PainterBackendCapabilities = {
  blur: true,
  shadow: true,
  blendMode: true,
  gradients: true,
  reducedMotion: false
};

export const DEFAULT_RITUAL_PAINTER_THEME: RitualPainterTheme = {
  version: "warm-bronze-wood-v1",
  backgroundTop: "#191410",
  backgroundBottom: "#120e0b",
  muyu: {
    shadowColor: "rgba(0,0,0,0.45)",
    cushionBase: "#1e1a17",
    cushionDark: "#0f0d0b",
    cushionPattern: "#9b6a32",
    woodDark: "#4a2410",
    woodBase: "#8a4a20",
    woodLight: "#d2924e",
    woodHighlight: "#f0bf78",
    mouthDark: "#090604",
    mouthEdge: "#c47a35",
    carvingDark: "rgba(45,20,8,0.72)",
    carvingLight: "rgba(255,210,130,0.35)",
    grainColor: "rgba(55,24,8,0.42)",
    hitGlow: "rgba(255,175,70,1)",
    rippleColor: "rgba(145,229,207,1)",
    traceDark: "rgba(55,25,8,0.35)",
    traceLight: "rgba(255,220,150,0.38)",
    malletHandle: "#7a421e",
    malletHeadDark: "#3d1d0c",
    malletHeadLight: "#d99a58"
  },
  burner: {
    shadowColor: "rgba(0,0,0,0.45)",
    bodyDark: "#39210f",
    bodyBase: "#8a5228",
    bodyLight: "#c88945",
    bodyHighlight: "#f0c27a",
    rimDark: "#241207",
    rimLight: "#e0a25a",
    ashDark: "#5d5a55",
    ashBase: "#aaa39a",
    ashLight: "#ddd7cc",
    ashParticle: "#f0eadf",
    incenseBody: "#8b2e1b",
    incenseDark: "#421108",
    incenseCoal: "#2b1b14",
    incenseEmber: "#ff5b22",
    incenseGlow: "rgba(255,110,35,1)",
    smokeWarm: "#e8e1d7",
    smokeCool: "#d7fff4",
    spark: "rgba(255,190,80,1)",
    ornament: "rgba(255,205,125,0.32)"
  }
};

export function supportsSoftEffects(capabilities: PainterBackendCapabilities): boolean {
  return capabilities.blur && capabilities.shadow && capabilities.blendMode;
}
