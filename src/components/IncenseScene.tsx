import { IncenseBurner } from "./IncenseBurner";
import { SmokeLayer } from "./SmokeLayer";

type IncenseSceneProps = {
  todayPrayerCount: number;
  pulseId: number;
  compact?: boolean;
};

export function IncenseScene({ todayPrayerCount, pulseId, compact = false }: IncenseSceneProps) {
  const litCount = Math.min(3, todayPrayerCount);
  const intensity = Math.min(1, todayPrayerCount / 12);

  return (
    <section
      className={`no-drag relative ${compact ? "min-h-[178px]" : "min-h-[224px]"} overflow-hidden rounded-lg border border-white/8 bg-[#151210] shadow-panel`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(145,229,207,0.08),rgba(230,138,46,0.08)_55%,rgba(0,0,0,0.08))]" />
      <div className="absolute inset-0 opacity-[0.11] [background-image:linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:28px_28px]" />
      <SmokeLayer intensity={0.2 + intensity * 0.8} pulseId={pulseId} compact={compact} />
      <IncenseBurner litCount={litCount} pulseId={pulseId} compact={compact} />
    </section>
  );
}
