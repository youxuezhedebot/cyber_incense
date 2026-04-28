import { useMemo } from "react";
import { getIncenseVisualSummary } from "../../lib/ritualVisuals";
import type { IncenseState } from "../../types/incense";
import type { RitualSnapshot } from "../../types/ritualSimulation";
import { AshLayer } from "./AshLayer";
import { BurnEffects } from "./BurnEffects";
import { IncenseBasin } from "./IncenseBasin";
import { IncenseStick } from "./IncenseStick";
import { IncenseStub } from "./IncenseStub";
import { IncenseTally } from "./IncenseTally";

type FloatingIncenseSurfaceProps = {
  state: IncenseState | null;
  pulseId: number;
  snapshot: RitualSnapshot | null;
  onOffer: () => void;
};

export function FloatingIncenseSurface({ state, pulseId, snapshot, onOffer }: FloatingIncenseSurfaceProps) {
  const activeSticks = snapshot?.burner.activeSticks ?? [];
  const burnedStubs = snapshot?.burner.burnedStubs ?? [];
  const ashMass = snapshot?.burner.ashMass ?? 0;
  const ashVisualHeight = snapshot?.burner.ashVisualHeight ?? 0;
  const summary = useMemo(() => {
    const base = getIncenseVisualSummary(state);
    if (!state) return base;

    const completedCount = Math.max(0, state.todayPrayerCount - activeSticks.length);
    const visibleAshMarks = Math.min(state.visuals.maxVisibleAshMarks, completedCount);

    return {
      ...base,
      visibleAshMarks,
      overflowAshCount: Math.max(0, completedCount - visibleAshMarks),
      ashIntensity: Math.min(1, Math.max(completedCount / 30, ashMass / 8))
    };
  }, [activeSticks.length, ashMass, state]);

  return (
    <div
      className="app-drag relative block h-[320px] w-[320px] overflow-visible bg-transparent text-left"
      aria-label="悬浮电子香炉"
      role="group"
    >
      <svg
        className="pointer-events-none relative h-full w-full drop-shadow-[0_22px_28px_rgba(0,0,0,0.42)]"
        viewBox="0 0 320 286"
        role="img"
        aria-label="悬浮电子香炉"
      >
        <IncenseBasin pulseId={pulseId} ashIntensity={summary.ashIntensity} layer="base" />
        {activeSticks.map((stick) => (
          <IncenseStick key={stick.id} stick={stick} now={snapshot?.now ?? Date.now()} />
        ))}
        {burnedStubs.map((stick) => (
          <IncenseStub key={stick.id} stick={stick} />
        ))}
        <AshLayer
          count={summary.visibleAshMarks}
          intensity={summary.ashIntensity}
          ashVisualHeight={ashVisualHeight}
          fragments={snapshot?.burner.ashFragments}
        />
        <BurnEffects
          activeCount={activeSticks.length}
          ashIntensity={summary.ashIntensity}
          smokeParticles={snapshot?.burner.smokeParticles}
          sparkParticles={snapshot?.burner.sparkParticles}
        />
        <IncenseBasin pulseId={pulseId} ashIntensity={summary.ashIntensity} layer="front" />
        <IncenseTally overflowAshCount={summary.overflowAshCount} totalToday={state?.todayPrayerCount ?? 0} />
      </svg>
      <button
        type="button"
        className="no-drag absolute bottom-[42px] left-1/2 h-[92px] w-[194px] -translate-x-1/2 rounded-[50%] bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-mint-300"
        onClick={onOffer}
        aria-label="上香"
        title="上香"
      />
    </div>
  );
}
