import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useMemo } from "react";
import { traceAlpha, traceRadius } from "../../lib/ritualEngine";
import { easeOutCubic } from "../../lib/ritualPainter/animation";
import { clamp01, ns, nx, ny } from "../../lib/ritualPainter/geometry";
import { MUYU_VIEWBOX } from "../../lib/ritualPainter/layout";
import {
  createMuyuBodyPath,
  createMuyuCarvingPaths,
  createMuyuCushionPath,
  createMuyuMouthEdgePath,
  createMuyuMouthPath,
  createWoodGrainPaths,
  createWoodKnots,
  muyuPoint
} from "../../lib/ritualPainter/muyuGeometry";
import { DEFAULT_RITUAL_PAINTER_THEME } from "../../lib/ritualPainter/theme";
import { getMuyuVisualSummary } from "../../lib/ritualVisuals";
import type { IncenseState } from "../../types/incense";
import type { RitualSnapshot, Vec2 } from "../../types/ritualSimulation";
import { MuyuMarks } from "../muyu/MuyuMarks";

type SvgMuyuPainterProps = {
  state: IncenseState | null;
  snapshot: RitualSnapshot | null;
  pulseId: number;
};

const RECT = MUYU_VIEWBOX;

export function SvgMuyuPainter({ state, snapshot, pulseId }: SvgMuyuPainterProps) {
  const id = useSvgId("muyu");
  const summary = useMemo(() => getMuyuVisualSummary(state), [state]);
  const theme = DEFAULT_RITUAL_PAINTER_THEME.muyu;
  const bodyPath = useMemo(() => createMuyuBodyPath(RECT), []);
  const mouthPath = useMemo(() => createMuyuMouthPath(RECT), []);
  const mouthEdgePath = useMemo(() => createMuyuMouthEdgePath(RECT), []);
  const cushionPath = useMemo(() => createMuyuCushionPath(RECT), []);
  const grainPaths = useMemo(() => createWoodGrainPaths(RECT), []);
  const knots = useMemo(() => createWoodKnots(RECT), []);
  const carvingPaths = useMemo(() => createMuyuCarvingPaths(RECT), []);
  const muyu = snapshot?.muyu;
  const latestTrace = muyu?.traces.at(-1);
  const bodyCenter = { x: nx(RECT, 0.5), y: ny(RECT, 0.52) };
  const transform = [
    `translate(${(muyu?.offsetX ?? 0) * RECT.w} ${(muyu?.offsetY ?? 0) * RECT.h})`,
    `translate(${bodyCenter.x} ${bodyCenter.y})`,
    `rotate(${(((muyu?.rotation ?? 0) * 180) / Math.PI).toFixed(3)})`,
    `scale(${(muyu?.scaleX ?? 1).toFixed(4)} ${(muyu?.scaleY ?? 1).toFixed(4)})`,
    `translate(${-bodyCenter.x} ${-bodyCenter.y})`
  ].join(" ");

  useEffect(() => {
    if (pulseId > 0 && state?.settings.soundEnabled) playSoftKnock();
  }, [pulseId, state?.settings.soundEnabled]);

  return (
    <div className="relative h-[260px] w-[320px] overflow-visible bg-transparent text-left" role="group" aria-label="悬浮木鱼">
      <svg className="pointer-events-none relative h-full w-full overflow-visible drop-shadow-[0_22px_28px_rgba(0,0,0,0.42)]" viewBox="0 0 320 260">
        <defs>
          <radialGradient id={`${id}-body`} cx="42%" cy="30%" r="72%">
            <stop offset="0" stopColor={theme.woodHighlight} />
            <stop offset="0.24" stopColor={theme.woodLight} />
            <stop offset="0.58" stopColor={theme.woodBase} />
            <stop offset="1" stopColor={theme.woodDark} />
          </radialGradient>
          <linearGradient id={`${id}-cushion`} x1="0" x2="0" y1="160" y2="222" gradientUnits="userSpaceOnUse">
            <stop stopColor="#31251d" />
            <stop offset="0.55" stopColor={theme.cushionBase} />
            <stop offset="1" stopColor={theme.cushionDark} />
          </linearGradient>
          <linearGradient id={`${id}-mouth`} x1="130" x2="260" y1="132" y2="164" gradientUnits="userSpaceOnUse">
            <stop stopColor="#020100" />
            <stop offset="0.6" stopColor={theme.mouthDark} />
            <stop offset="1" stopColor="#1c0d05" />
          </linearGradient>
          <radialGradient id={`${id}-highlight`} cx="42%" cy="30%" r="34%">
            <stop stopColor="rgba(255,235,180,0.36)" />
            <stop offset="0.48" stopColor="rgba(255,220,150,0.12)" />
            <stop offset="1" stopColor="rgba(255,220,150,0)" />
          </radialGradient>
          <clipPath id={`${id}-body-clip`}>
            <path d={bodyPath} />
          </clipPath>
        </defs>

        <ellipse cx={nx(RECT, 0.5)} cy={ny(RECT, 0.82)} rx={ns(RECT, 0.38)} ry={ns(RECT, 0.075)} fill={theme.shadowColor} opacity="0.7" />

        <g transform={transform}>
          <path d={cushionPath} fill={`url(#${id}-cushion)`} />
          <CushionPattern />
          <path d={bodyPath} fill={`url(#${id}-body)`} stroke="rgba(255,215,150,0.22)" strokeWidth={ns(RECT, 0.004)} />

          <g clipPath={`url(#${id}-body-clip)`}>
            {grainPaths.map((path, index) => (
              <path
                key={index}
                d={path.d}
                fill="none"
                stroke={theme.grainColor}
                strokeLinecap="round"
                strokeWidth={path.strokeWidth}
                opacity={path.opacity}
              />
            ))}
            {knots.map((knot, index) => (
              <g key={index} transform={`rotate(${knot.rotate ?? 0} ${knot.cx} ${knot.cy})`}>
                <ellipse cx={knot.cx} cy={knot.cy} rx={knot.rx} ry={knot.ry} fill="none" stroke="rgba(70,28,8,0.38)" strokeWidth={ns(RECT, 0.002)} />
                <ellipse cx={knot.cx} cy={knot.cy} rx={knot.rx * 0.55} ry={knot.ry * 0.45} fill="none" stroke="rgba(255,210,130,0.20)" strokeWidth={ns(RECT, 0.0015)} />
              </g>
            ))}
            {carvingPaths.map((path, index) => (
              <g key={index}>
                <path d={path.d} fill="none" stroke={theme.carvingDark} strokeLinecap="round" strokeWidth={path.strokeWidth} opacity={path.opacity} />
                <path d={path.d} fill="none" stroke={theme.carvingLight} strokeLinecap="round" strokeWidth={Math.max(0.8, path.strokeWidth * 0.34)} opacity="0.55" />
              </g>
            ))}
            {(muyu?.traces ?? []).map((trace) => {
              const alpha = traceAlpha(trace);
              const radius = traceRadius(trace);
              const point = muyuPoint(RECT, trace);
              const rotation = ((trace.seed % 17) - 8);
              const t = clamp01(trace.age / trace.life);
              const dentRx = ns(RECT, radius * 0.74);
              const dentRy = ns(RECT, radius * 0.34);
              const glowFactor = t < 0.18 ? Math.pow(1 - t / 0.18, 1.6) : 0;

              return (
                <g key={trace.id} transform={`rotate(${rotation} ${point.x} ${point.y})`}>
                  <ellipse cx={point.x} cy={point.y + dentRy * 0.12} rx={dentRx * 1.22} ry={dentRy * 1.15} fill="rgba(42,18,7,0.22)" opacity={alpha * 0.18} />
                  <ellipse cx={point.x} cy={point.y + dentRy * 0.12} rx={dentRx} ry={dentRy} fill={theme.traceDark} opacity={alpha * 0.24} />
                  <ellipse
                    cx={point.x - dentRx * 0.12}
                    cy={point.y - dentRy * 0.10}
                    rx={dentRx * 0.42}
                    ry={dentRy * 0.22}
                    fill="rgba(255,218,150,0.18)"
                    opacity={alpha * 0.12}
                  />
                  <path
                    d={`M ${point.x - dentRx * 0.58} ${point.y - dentRy * 0.02} C ${point.x - dentRx * 0.18} ${point.y - dentRy * 0.18} ${
                      point.x + dentRx * 0.18
                    } ${point.y + dentRy * 0.18} ${point.x + dentRx * 0.54} ${point.y + dentRy * 0.02}`}
                    fill="none"
                    stroke="rgba(64,28,9,0.35)"
                    strokeLinecap="round"
                    strokeWidth={ns(RECT, 0.0014)}
                    opacity={alpha * 0.16}
                  />
                  {glowFactor > 0 ? (
                    <>
                      <circle cx={point.x} cy={point.y} r={ns(RECT, (0.04 + 0.04 * trace.strength) * (1 + (1 - glowFactor) * 0.5))} fill={theme.hitGlow} opacity={glowFactor * 0.12} />
                      <circle cx={point.x} cy={point.y} r={ns(RECT, 0.016 * trace.strength)} fill="rgba(255,235,190,1)" opacity={glowFactor * 0.22} />
                    </>
                  ) : null}
                </g>
              );
            })}
          </g>

          <path d={mouthPath} fill={`url(#${id}-mouth)`} />
          <path d={mouthEdgePath} fill="none" stroke={theme.mouthEdge} strokeLinecap="round" strokeWidth={ns(RECT, 0.004)} opacity="0.62" />
          <ellipse cx={nx(RECT, 0.45)} cy={ny(RECT, 0.34)} rx={ns(RECT, 0.23)} ry={ns(RECT, 0.12)} fill={`url(#${id}-highlight)`} />
        </g>

        {(muyu?.shockwaves ?? []).map((wave) => {
          const t = clamp01(wave.age / wave.life);
          const point = muyuPoint(RECT, wave);
          const eased = easeOutCubic(t);

          return (
            <g key={wave.id} opacity={Math.pow(1 - t, 1.5)}>
              {[0, 1, 2].map((index) => (
                <ellipse
                  key={index}
                  cx={point.x}
                  cy={point.y}
                  rx={ns(RECT, (0.05 + eased * 0.24) * wave.strength * (1 + index * 0.22))}
                  ry={ns(RECT, (0.028 + eased * 0.12) * wave.strength * (1 + index * 0.18))}
                  fill="none"
                  stroke={theme.rippleColor}
                  strokeWidth={ns(RECT, 0.004)}
                  opacity={0.52 - index * 0.13}
                />
              ))}
            </g>
          );
        })}

        <Mallet pulseId={pulseId} hit={latestTrace ? muyuPoint(RECT, latestTrace) : null} />
      </svg>

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

      <MuyuMarks count={summary.visibleMarks} overflow={summary.overflowKnockCount} resonanceLevel={summary.resonanceLevel} />
    </div>
  );
}

function CushionPattern() {
  const theme = DEFAULT_RITUAL_PAINTER_THEME.muyu;

  return (
    <g opacity="0.48">
      {Array.from({ length: 9 }).map((_, index) => {
        const px = nx(RECT, 0.26 + index * 0.06);
        const py = ny(RECT, 0.704 + 0.012 * Math.sin(index));

        return (
          <g key={index}>
            <circle cx={px} cy={py} r={ns(RECT, 0.012)} fill="none" stroke={theme.cushionPattern} strokeWidth={ns(RECT, 0.002)} />
            <line x1={px - ns(RECT, 0.012)} y1={py} x2={px + ns(RECT, 0.012)} y2={py} stroke={theme.cushionPattern} strokeWidth={ns(RECT, 0.0015)} />
          </g>
        );
      })}
    </g>
  );
}

function Mallet({ pulseId, hit }: { pulseId: number; hit: Vec2 | null }) {
  const theme = DEFAULT_RITUAL_PAINTER_THEME.muyu;
  const anchor = { x: 318, y: 24 };
  const restHead = { x: 230, y: 68 };
  const restRotate = 6;
  const target = hit ?? restHead;
  const lift = { x: 286, y: 42 };
  const rebound = { x: 276, y: 54 };
  const handleLength = 64;

  const angleAt = (p: Vec2): number => Math.atan2(anchor.y - p.y, anchor.x - p.x) * (180 / Math.PI);
  const angleTarget = angleAt(target);
  const angleLift = angleAt(lift);
  const angleRebound = angleAt(rebound);

  return (
    <g>
      <defs>
        <radialGradient id="muyu-mallet-head" cx="38%" cy="32%" r="70%">
          <stop stopColor={theme.malletHeadLight} />
          <stop offset="0.5" stopColor="#8a4d24" />
          <stop offset="1" stopColor={theme.malletHeadDark} />
        </radialGradient>
      </defs>
      {pulseId > 0 ? (
        <motion.g
          key={pulseId}
          initial={{ x: restHead.x, y: restHead.y, rotate: restRotate }}
          animate={{
            x: [restHead.x, lift.x, target.x, rebound.x, restHead.x],
            y: [restHead.y, lift.y, target.y, rebound.y, restHead.y],
            rotate: [restRotate, angleLift + 4, angleTarget - 4, angleRebound, restRotate]
          }}
          transition={{ duration: 0.58, times: [0, 0.24, 0.50, 0.68, 1], ease: "easeInOut" }}
        >
          <MalletShape handleLength={handleLength} />
        </motion.g>
      ) : (
        <g transform={`translate(${restHead.x} ${restHead.y}) rotate(${restRotate})`} opacity="0.78">
          <MalletShape handleLength={handleLength} />
        </g>
      )}
    </g>
  );
}

function MalletShape({ handleLength }: { handleLength: number }) {
  const theme = DEFAULT_RITUAL_PAINTER_THEME.muyu;
  // Local frame: head sits at origin (the strike point); handle extends in +x
  // toward the hand. Group rotation aligns +x with the hand direction.
  return (
    <g>
      <line x1="-6" y1="0" x2={handleLength} y2="0" stroke={theme.malletHandle} strokeWidth="9" strokeLinecap="round" />
      <line x1="2" y1="-2.4" x2={handleLength - 4} y2="-2.4" stroke="rgba(255,210,140,0.30)" strokeWidth="2.4" strokeLinecap="round" />
      <ellipse cx="0" cy="0" rx="16" ry="13" fill="url(#muyu-mallet-head)" stroke="rgba(255,220,150,0.30)" strokeWidth="1" />
      <ellipse cx="-5" cy="-4" rx="7" ry="3.4" fill="rgba(255,224,166,0.28)" />
      <ellipse cx="6" cy="5" rx="4.5" ry="2.6" fill="rgba(35,14,6,0.26)" />
    </g>
  );
}

function useSvgId(prefix: string): string {
  return `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
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
