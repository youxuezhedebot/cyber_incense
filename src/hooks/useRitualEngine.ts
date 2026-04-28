import { useEffect, useState } from "react";
import { createRitualEngine } from "../lib/ritualEngine";
import type { IncenseState } from "../types/incense";
import type { RitualSnapshot } from "../types/ritualSimulation";

export function useRitualEngineSnapshot(state: IncenseState | null): RitualSnapshot | null {
  const [snapshot, setSnapshot] = useState<RitualSnapshot | null>(null);

  useEffect(() => {
    if (!state) {
      setSnapshot(null);
      return undefined;
    }

    const engine = createRitualEngine({
      now: Date.now(),
      appState: state
    });
    let cancelled = false;
    let animationId = 0;
    let timerId = 0;
    let lastFrame = performance.now();

    const queueNextFrame = (delayMs: number) => {
      timerId = window.setTimeout(() => {
        animationId = window.requestAnimationFrame(tick);
      }, delayMs);
    };

    const tick = (frameTime: number) => {
      if (cancelled) return;

      const dt = Math.min(0.033, Math.max(0, (frameTime - lastFrame) / 1000));
      lastFrame = frameTime;
      engine.update(dt, Date.now());
      setSnapshot(engine.getSnapshot());
      queueNextFrame(engine.hasActiveRuntime() ? 16 : 250);
    };

    setSnapshot(engine.getSnapshot());
    animationId = window.requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(animationId);
      window.clearTimeout(timerId);
    };
  }, [state]);

  return snapshot;
}
