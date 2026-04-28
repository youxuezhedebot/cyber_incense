import { AnimatePresence, motion } from "framer-motion";
import { Hammer } from "lucide-react";
import type { MouseEvent } from "react";
import { useEffect, useMemo } from "react";
import { traceAlpha, traceRadius } from "../../lib/ritualEngine";
import { getMuyuVisualSummary } from "../../lib/ritualVisuals";
import type { IncenseState } from "../../types/incense";
import type { RitualSnapshot, Vec2 } from "../../types/ritualSimulation";
import { KnockEffect } from "./KnockEffect";
import { MuyuMarks } from "./MuyuMarks";

type WoodenFishObjectProps = {
  state: IncenseState | null;
  pulseId: number;
  snapshot: RitualSnapshot | null;
  onKnock: (point?: Vec2) => void;
};

export function WoodenFishObject({ state, pulseId, snapshot, onKnock }: WoodenFishObjectProps) {
  const summary = useMemo(() => getMuyuVisualSummary(state), [state]);
  const muyu = snapshot?.muyu;
  const resonance = summary.resonanceLevel;

  useEffect(() => {
    if (pulseId > 0 && state?.settings.soundEnabled) playSoftKnock();
  }, [pulseId, state?.settings.soundEnabled]);

  return (
    <div className="app-drag relative h-[260px] w-[320px] overflow-visible bg-transparent text-left" role="group" aria-label="悬浮木鱼">
      <KnockEffect pulseId={pulseId} />
      <AnimatePresence>
        {pulseId > 0 ? (
          <motion.span
            key={pulseId}
            className="pointer-events-none absolute right-8 top-5 rounded-full border border-mint-300/40 bg-mint-300/12 px-2 py-1 text-xs font-semibold text-mint-300"
            initial={{ opacity: 0, y: 12, scale: 0.82 }}
            animate={{ opacity: [0, 1, 1, 0], y: [4, -14, -24, -30], scale: [0.82, 1, 1, 0.94] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.05, ease: "easeOut" }}
          >
            +1
          </motion.span>
        ) : null}
      </AnimatePresence>

      <div className="pointer-events-none relative flex h-full items-center justify-center">
        <motion.div
          className="relative flex h-36 w-56 shrink-0 items-center justify-center drop-shadow-[0_22px_28px_rgba(0,0,0,0.42)]"
          animate={{
            x: (muyu?.offsetX ?? 0) * 320,
            y: (muyu?.offsetY ?? 0) * 220,
            rotate: ((muyu?.rotation ?? 0) * 180) / Math.PI,
            scaleX: muyu?.scaleX ?? 1,
            scaleY: muyu?.scaleY ?? 1
          }}
          transition={{ duration: 0.08, ease: "linear" }}
        >
          <div
            className="absolute h-28 w-52 rounded-[52%] border border-ember-300/35"
            style={{
              background:
                `radial-gradient(circle at 42% 36%, rgba(255,231,183,${0.2 + resonance * 0.1}), transparent 18%), ` +
                `radial-gradient(circle at 54% 52%, rgba(48,24,12,${0.1 + resonance * 0.22}), transparent 46%), ` +
                "linear-gradient(135deg, #8a5130, #3b2a22 64%, #1d1815)"
            }}
          />
          <div className="absolute h-7 w-24 rounded-full bg-black/36" />
          <div className="absolute bottom-5 h-3 w-44 rounded-full bg-black/24" />
          <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="true">
            {(muyu?.traces ?? []).map((trace) => {
              const alpha = traceAlpha(trace);
              const radius = traceRadius(trace);

              return (
                <g key={trace.id} transform={`rotate(${(trace.seed % 46) - 23} ${trace.x} ${trace.y})`}>
                  <ellipse
                    cx={trace.x}
                    cy={trace.y}
                    rx={radius * 1.25}
                    ry={radius * 0.58}
                    fill={`rgba(48, 24, 12, ${alpha * 0.32})`}
                  />
                  <path
                    d={`M ${(trace.x - radius * 0.7).toFixed(3)} ${trace.y.toFixed(3)} Q ${trace.x.toFixed(3)} ${(trace.y - radius * 0.45).toFixed(
                      3
                    )} ${(trace.x + radius * 0.74).toFixed(3)} ${trace.y.toFixed(3)}`}
                    fill="none"
                    stroke={`rgba(255, 230, 170, ${alpha * 0.42})`}
                    strokeWidth="0.006"
                    strokeLinecap="round"
                  />
                </g>
              );
            })}
            {(muyu?.shockwaves ?? []).map((wave) => {
              const t = Math.min(1, wave.age / wave.life);
              return (
                <ellipse
                  key={wave.id}
                  cx={wave.x}
                  cy={wave.y}
                  rx={(0.08 + t * 0.28) * wave.strength}
                  ry={(0.045 + t * 0.14) * wave.strength}
                  fill="none"
                  stroke={`rgba(145, 229, 207, ${(1 - t) * 0.58})`}
                  strokeWidth="0.008"
                />
              );
            })}
          </svg>
          <Hammer size={28} className="relative text-ember-100/58" />
        </motion.div>
      </div>
      <MuyuMarks count={summary.visibleMarks} overflow={summary.overflowKnockCount} resonanceLevel={summary.resonanceLevel} />
      <button
        type="button"
        className="no-drag absolute left-1/2 top-1/2 h-[116px] w-[226px] -translate-x-1/2 -translate-y-1/2 rounded-[52%] bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-mint-300"
        onClick={(event) => onKnock(getNormalizedPoint(event))}
        aria-label="敲木鱼"
        title="敲木鱼"
      />
    </div>
  );
}

function getNormalizedPoint(event: MouseEvent<HTMLButtonElement>): Vec2 {
  if (event.detail === 0) {
    return { x: 0.5, y: 0.5 };
  }

  const rect = event.currentTarget.getBoundingClientRect();
  return {
    x: Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)),
    y: Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height))
  };
}

function playSoftKnock(): void {
  try {
    const AudioContextClass = window.AudioContext ?? window.webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(164, now);
    oscillator.frequency.exponentialRampToValueAtTime(92, now + 0.14);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.1, now + 0.014);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.22);
    oscillator.addEventListener("ended", () => {
      void context.close();
    });
  } catch {
    // Sound is decorative and must fail open.
  }
}
