import type { PainterCacheKeyInput, PainterDebugInfo, PainterLayerName } from "../../types/ritualPainter.js";
import type { RitualSnapshot } from "../../types/ritualSimulation.js";
import { rectKey } from "./geometry.js";

export function createPainterDebugInfo(
  snapshot: RitualSnapshot | null,
  layers: PainterLayerName[],
  cacheKeys: string[] = []
): PainterDebugInfo {
  return {
    layers,
    dynamicItems: {
      activeSticks: snapshot?.burner.activeSticks.length ?? 0,
      burnedStubs: snapshot?.burner.burnedStubs.length ?? 0,
      ashFragments: snapshot?.burner.ashFragments.length ?? 0,
      smokeParticles: snapshot?.burner.smokeParticles.length ?? 0,
      sparkParticles: snapshot?.burner.sparkParticles.length ?? 0,
      muyuTraces: snapshot?.muyu.traces.length ?? 0,
      muyuShockwaves: snapshot?.muyu.shockwaves.length ?? 0
    },
    cacheKeys
  };
}

export function createLayerCacheKey(input: PainterCacheKeyInput): string {
  const caps = [
    input.capabilities.blur ? "blur" : "no-blur",
    input.capabilities.shadow ? "shadow" : "no-shadow",
    input.capabilities.blendMode ? "blend" : "no-blend",
    input.capabilities.gradients ? "grad" : "no-grad",
    input.capabilities.reducedMotion ? "reduced" : "motion"
  ].join(",");

  return `${input.layer}|${rectKey(input.rect)}|${input.pixelRatio.toFixed(2)}|${input.themeVersion}|${caps}`;
}
