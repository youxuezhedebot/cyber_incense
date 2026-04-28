import type { MouseEvent } from "react";
import { routeInteraction } from "../../lib/ritualPainter/layout";
import type { IncenseState } from "../../types/incense";
import type { RitualSnapshot, Vec2 } from "../../types/ritualSimulation";
import { SvgBurnerPainter } from "./SvgBurnerPainter";
import { SvgMuyuPainter } from "./SvgMuyuPainter";

type SvgRitualPainterSurfaceProps = {
  state: IncenseState | null;
  snapshot: RitualSnapshot | null;
  pulseId: number;
  muyuPulseId: number;
  onOffer: () => void;
  onKnock: (point?: Vec2) => void;
};

export function SvgRitualPainterSurface({ state, snapshot, pulseId, muyuPulseId, onOffer, onKnock }: SvgRitualPainterSurfaceProps) {
  const activeObject = state?.window.activeObject ?? "incense";
  const isMuyu = activeObject === "muyu";
  const hitAreaClassName = isMuyu
    ? "no-drag absolute left-[14%] top-[22%] h-[56%] w-[72%] rounded-[52%] bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-mint-300"
    : "no-drag absolute left-[18%] top-[32%] h-[48%] w-[64%] rounded-[44%] bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-mint-300";

  return (
    <div className={`app-drag relative overflow-visible bg-transparent ${isMuyu ? "h-[260px] w-[320px]" : "h-[320px] w-[320px]"}`}>
      {isMuyu ? <SvgMuyuPainter state={state} snapshot={snapshot} pulseId={muyuPulseId} /> : <SvgBurnerPainter state={state} snapshot={snapshot} pulseId={pulseId} />}
      <button
        type="button"
        className={hitAreaClassName}
        onClick={(event) => {
          const routed = getRoutedInteraction(event, activeObject, snapshot);

          if (routed.target === "burner") {
            onOffer();
          } else if (routed.target === "muyu") {
            onKnock(routed.local ?? undefined);
          }
        }}
        aria-label={isMuyu ? "敲木鱼" : "上香"}
        title={isMuyu ? "敲木鱼" : "上香"}
      />
    </div>
  );
}

function getRoutedInteraction(event: MouseEvent<HTMLButtonElement>, activeObject: "incense" | "muyu", snapshot: RitualSnapshot | null) {
  if (event.detail === 0) {
    return activeObject === "muyu"
      ? { target: "muyu" as const, local: { x: 0.5, y: 0.5 } }
      : { target: "burner" as const, local: { x: 0.5, y: 0.58 } };
  }

  const rect = (event.currentTarget.parentElement ?? event.currentTarget).getBoundingClientRect();
  const point = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };

  return routeInteraction(point, { x: 0, y: 0, w: rect.width, h: rect.height }, activeObject, snapshot);
}
