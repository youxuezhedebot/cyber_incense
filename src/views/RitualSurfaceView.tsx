import { SvgRitualPainterSurface } from "../components/painter/SvgRitualPainterSurface";
import { useRitualEngineSnapshot } from "../hooks/useRitualEngine";
import type { IncenseStore } from "../store/incenseStore";

type RitualSurfaceViewProps = {
  store: IncenseStore;
};

export function RitualSurfaceView({ store }: RitualSurfaceViewProps) {
  const { state, pulseId, muyuPulseId, offerIncense, knockMuyu } = store;
  const ritualSnapshot = useRitualEngineSnapshot(state);

  return (
    <main className="app-drag flex h-screen min-h-[260px] w-screen min-w-[260px] items-center justify-center overflow-hidden bg-transparent">
      <SvgRitualPainterSurface
        state={state}
        pulseId={pulseId}
        muyuPulseId={muyuPulseId}
        snapshot={ritualSnapshot}
        onOffer={offerIncense}
        onKnock={knockMuyu}
      />
    </main>
  );
}
