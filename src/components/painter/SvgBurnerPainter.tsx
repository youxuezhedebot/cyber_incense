import { useId, useMemo } from "react";
import { getEmberPoint } from "../../lib/ritualEngine";
import {
  burnerPoint,
  createAshEllipse,
  createAshParticleMarks,
  createBurnerBodyPath,
  createBurnerFrontRimPath,
  createBurnerInnerRimPath,
  createBurnerOrnaments
} from "../../lib/ritualPainter/burnerGeometry";
import { clamp01, ns, nx, ny } from "../../lib/ritualPainter/geometry";
import { BURNER_VIEWBOX } from "../../lib/ritualPainter/layout";
import { DEFAULT_RITUAL_PAINTER_THEME } from "../../lib/ritualPainter/theme";
import { getIncenseVisualSummary } from "../../lib/ritualVisuals";
import type { IncenseState } from "../../types/incense";
import type { AshFragment, IncenseStickState, RitualSnapshot, SmokeParticle, SparkParticle, Vec2 } from "../../types/ritualSimulation";

type SvgBurnerPainterProps = {
  state: IncenseState | null;
  snapshot: RitualSnapshot | null;
  pulseId: number;
};

const RECT = BURNER_VIEWBOX;

export function SvgBurnerPainter({ state, snapshot, pulseId }: SvgBurnerPainterProps) {
  const id = useSvgId("burner");
  const theme = DEFAULT_RITUAL_PAINTER_THEME.burner;
  const bodyPath = useMemo(() => createBurnerBodyPath(RECT), []);
  const innerRimPath = useMemo(() => createBurnerInnerRimPath(RECT), []);
  const frontRimPath = useMemo(() => createBurnerFrontRimPath(RECT), []);
  const ornaments = useMemo(() => createBurnerOrnaments(RECT), []);
  const activeSticks = useMemo(() => [...(snapshot?.burner.activeSticks ?? [])].sort(compareStickDrawOrder), [snapshot?.burner.activeSticks]);
  const burnedStubs = useMemo(() => [...(snapshot?.burner.burnedStubs ?? [])].sort(compareStickDrawOrder), [snapshot?.burner.burnedStubs]);
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
  const ashEllipse = createAshEllipse(RECT, snapshot?.config.ashBed, ashVisualHeight);
  const ashParticleCount = Math.min(snapshot?.config.lod.maxVisibleBurnedStubs ?? 44, Math.max(summary.visibleAshMarks, 18 + Math.floor(ashMass * 8)));
  const ashMarks = useMemo(
    () => createAshParticleMarks(RECT, snapshot?.config.ashBed, ashParticleCount, ashVisualHeight),
    [ashParticleCount, ashVisualHeight, snapshot?.config.ashBed]
  );

  return (
    <div className="relative block h-[320px] w-[320px] overflow-visible bg-transparent text-left" role="group" aria-label="悬浮电子香炉">
      <svg
        className="pointer-events-none relative h-full w-full overflow-visible drop-shadow-[0_22px_28px_rgba(0,0,0,0.42)]"
        viewBox="0 0 320 286"
        role="img"
        aria-label="悬浮电子香炉"
      >
        <defs>
          <radialGradient id={`${id}-body-light`} cx="42%" cy="40%" r="64%">
            <stop stopColor={theme.bodyHighlight} />
            <stop offset="0.32" stopColor={theme.bodyLight} />
            <stop offset="0.70" stopColor={theme.bodyBase} />
            <stop offset="1" stopColor={theme.bodyDark} />
          </radialGradient>
          <linearGradient id={`${id}-front-rim`} x1="80" x2="240" y1="132" y2="160" gradientUnits="userSpaceOnUse">
            <stop stopColor={theme.bodyDark} />
            <stop offset="0.48" stopColor={theme.bodyBase} />
            <stop offset="1" stopColor="#2a1a10" />
          </linearGradient>
          <linearGradient id={`${id}-rim`} x1="88" x2="238" y1="124" y2="156" gradientUnits="userSpaceOnUse">
            <stop stopColor={theme.rimDark} />
            <stop offset="0.48" stopColor={theme.rimLight} />
            <stop offset="1" stopColor={theme.bodyDark} />
          </linearGradient>
          <linearGradient id={`${id}-ash`} x1="160" x2="160" y1="124" y2="150" gradientUnits="userSpaceOnUse">
            <stop stopColor={theme.ashLight} />
            <stop offset="0.52" stopColor={theme.ashBase} />
            <stop offset="1" stopColor={theme.ashDark} />
          </linearGradient>
          <radialGradient id={`${id}-ember`} cx="50%" cy="50%" r="50%">
            <stop stopColor="rgba(255,95,30,0.95)" />
            <stop offset="0.38" stopColor="rgba(255,110,35,0.35)" />
            <stop offset="1" stopColor="rgba(255,90,20,0)" />
          </radialGradient>
          <clipPath id={`${id}-body-clip`}>
            <path d={bodyPath} />
          </clipPath>
        </defs>

        <ellipse cx={nx(RECT, 0.5)} cy={ny(RECT, 0.76)} rx={ns(RECT, 0.34)} ry={ns(RECT, 0.055)} fill={theme.shadowColor} opacity="0.72" />
        <path
          d={`M ${nx(RECT, 0.205)} ${ny(RECT, 0.48)} C ${nx(RECT, 0.115)} ${ny(RECT, 0.455)} ${nx(RECT, 0.115)} ${ny(RECT, 0.565)} ${nx(RECT, 0.215)} ${ny(RECT, 0.535)}`}
          fill="none"
          stroke="rgba(91,50,25,0.76)"
          strokeWidth={ns(RECT, 0.022)}
          strokeLinecap="round"
        />
        <path
          d={`M ${nx(RECT, 0.795)} ${ny(RECT, 0.48)} C ${nx(RECT, 0.885)} ${ny(RECT, 0.455)} ${nx(RECT, 0.885)} ${ny(RECT, 0.565)} ${nx(RECT, 0.785)} ${ny(RECT, 0.535)}`}
          fill="none"
          stroke="rgba(91,50,25,0.76)"
          strokeWidth={ns(RECT, 0.022)}
          strokeLinecap="round"
        />
        <path d={bodyPath} fill={`url(#${id}-body-light)`} stroke="rgba(255,225,160,0.28)" strokeWidth="1.5" />

        <g clipPath={`url(#${id}-body-clip)`}>
          {ornaments.map((ornament, index) => (
            <path key={index} d={ornament.d} fill={theme.ornament} stroke="rgba(255,205,125,0.22)" strokeLinecap="round" strokeWidth="0.8" opacity={ornament.opacity} />
          ))}
          <ellipse cx={nx(RECT, 0.42)} cy={ny(RECT, 0.55)} rx={ns(RECT, 0.22)} ry={ns(RECT, 0.10)} fill="rgba(255,235,180,0.10)" />
        </g>

        <path d={innerRimPath} fill={`url(#${id}-rim)`} stroke="rgba(255,225,170,0.32)" strokeWidth="1.6" />
        <ellipse cx={ashEllipse.cx} cy={ashEllipse.cy + ashEllipse.ry * 0.08} rx={ashEllipse.rx * 1.04} ry={ashEllipse.ry * 1.22} fill="#130a05" opacity="0.86" />
        <ellipse cx={ashEllipse.cx} cy={ashEllipse.cy} rx={ashEllipse.rx} ry={ashEllipse.ry} fill={`url(#${id}-ash)`} opacity={0.72 + summary.ashIntensity * 0.22} />
        {ashMarks.map((mark, index) => (
          <circle
            key={index}
            cx={mark.x}
            cy={mark.y}
            r={mark.r}
            fill={mark.colorIndex === 0 ? theme.ashParticle : mark.colorIndex === 1 ? theme.ashLight : theme.ashDark}
            opacity={mark.opacity}
          />
        ))}

        {burnedStubs.map((stick) => (
          <Stub key={stick.id} stick={stick} />
        ))}
        {activeSticks.map((stick) => (
          <ActiveStick key={stick.id} stick={stick} now={snapshot?.now ?? Date.now()} emberGradientId={`${id}-ember`} />
        ))}
        {(snapshot?.burner.ashFragments ?? []).map((fragment) => (
          <AshFragmentMark key={fragment.id} fragment={fragment} />
        ))}
        {(snapshot?.burner.smokeParticles ?? []).map((particle) => (
          <SmokeCurve key={particle.id} particle={particle} />
        ))}
        {(snapshot?.burner.sparkParticles ?? []).map((particle) => (
          <Spark key={particle.id} particle={particle} />
        ))}

        <path d={frontRimPath} fill={`url(#${id}-front-rim)`} stroke="rgba(255,225,170,0.24)" strokeWidth="1.2" />
        <path
          d={`M ${nx(RECT, 0.33)} ${ny(RECT, 0.705)} C ${nx(RECT, 0.34)} ${ny(RECT, 0.78)} ${nx(RECT, 0.40)} ${ny(RECT, 0.78)} ${nx(RECT, 0.42)} ${ny(RECT, 0.705)}`}
          fill="#2d1a0d"
          opacity="0.82"
        />
        <path
          d={`M ${nx(RECT, 0.58)} ${ny(RECT, 0.705)} C ${nx(RECT, 0.60)} ${ny(RECT, 0.78)} ${nx(RECT, 0.66)} ${ny(RECT, 0.78)} ${nx(RECT, 0.67)} ${ny(RECT, 0.705)}`}
          fill="#2d1a0d"
          opacity="0.82"
        />
        <path d={`M ${nx(RECT, 0.34)} ${ny(RECT, 0.66)} C ${nx(RECT, 0.42)} ${ny(RECT, 0.70)} ${nx(RECT, 0.58)} ${ny(RECT, 0.70)} ${nx(RECT, 0.66)} ${ny(RECT, 0.66)}`} fill="none" stroke="rgba(255,231,183,0.18)" strokeWidth="1.4" />
        <IncenseTally overflowAshCount={summary.overflowAshCount} totalToday={state?.todayPrayerCount ?? 0} />
      </svg>
    </div>
  );
}

function ActiveStick({ stick, now, emberGradientId }: { stick: IncenseStickState; now: number; emberGradientId: string }) {
  const theme = DEFAULT_RITUAL_PAINTER_THEME.burner;
  const base = burnerPoint(RECT, stick);
  const ember = burnerPoint(RECT, getEmberPoint(stick));
  const angle = Math.atan2(ember.y - base.y, ember.x - base.x);
  const capLength = Math.max(6, stick.thickness * 900);
  const coalEnd = {
    x: ember.x - Math.cos(angle) * capLength,
    y: ember.y - Math.sin(angle) * capLength
  };
  const ageMs = Math.max(0, now - stick.createdAt);
  const insertProgress = Math.min(1, ageMs / 620);
  const opacity = Math.min(1, 0.2 + insertProgress * 0.8) * Math.max(0.12, 1 - stick.burnProgress * 0.55);
  const yOffset = (1 - insertProgress) * -68;
  const width = Math.max(1.6, stick.thickness * 360);
  const glow = 1 - clamp01(stick.burnProgress);

  return (
    <g opacity={opacity} transform={`translate(0 ${yOffset.toFixed(2)})`}>
      <line x1={base.x} y1={base.y} x2={coalEnd.x} y2={coalEnd.y} stroke={theme.incenseBody} strokeLinecap="round" strokeWidth={width} />
      <line
        x1={base.x + Math.cos(angle + Math.PI / 2) * width * 0.32}
        y1={base.y + Math.sin(angle + Math.PI / 2) * width * 0.32}
        x2={coalEnd.x + Math.cos(angle + Math.PI / 2) * width * 0.32}
        y2={coalEnd.y + Math.sin(angle + Math.PI / 2) * width * 0.32}
        stroke={theme.incenseDark}
        strokeLinecap="round"
        strokeWidth={Math.max(0.6, width * 0.26)}
        opacity="0.58"
      />
      <line x1={coalEnd.x} y1={coalEnd.y} x2={ember.x} y2={ember.y} stroke={theme.incenseCoal} strokeLinecap="round" strokeWidth={width * 1.05} opacity="0.9" />
      <circle cx={ember.x} cy={ember.y} r={Math.max(7, width * 4.8)} fill={`url(#${emberGradientId})`} opacity={0.5 + glow * 0.18} />
      <circle cx={ember.x} cy={ember.y} r={Math.max(1.6, width * 0.95)} fill={theme.incenseEmber} opacity={0.86 + glow * 0.1} />
    </g>
  );
}

function Stub({ stick }: { stick: IncenseStickState }) {
  const base = burnerPoint(RECT, stick);
  const length = 7 + (stick.seed % 7);
  const lean = Math.sin(stick.angle) * length * 0.8;
  const top = { x: base.x + lean, y: base.y - length };
  const width = Math.max(1.4, stick.thickness * 280);

  return (
    <g opacity="0.58">
      <line x1={base.x} y1={base.y + 1} x2={top.x} y2={top.y} stroke={stick.id.startsWith("aggregate-stub-") ? "#6c5041" : "#7a3b24"} strokeLinecap="round" strokeWidth={width} />
      <circle cx={top.x} cy={top.y} r={Math.max(1.1, width * 0.75)} fill="#d8c8b6" opacity="0.5" />
    </g>
  );
}

function AshFragmentMark({ fragment }: { fragment: AshFragment }) {
  const point = burnerPoint(RECT, fragment);
  const t = clamp01(fragment.age / fragment.life);

  return (
    <rect
      x={point.x - 3}
      y={point.y - 1.2}
      width={5 + (fragment.seed % 4)}
      height="2"
      rx="1"
      fill={fragment.seed % 2 === 0 ? "#d9c9b8" : "#9a8f84"}
      opacity={0.65 * (1 - t)}
      transform={`rotate(${(fragment.seed % 31) - 15} ${point.x} ${point.y})`}
    />
  );
}

function SmokeCurve({ particle }: { particle: SmokeParticle }) {
  const theme = DEFAULT_RITUAL_PAINTER_THEME.burner;
  const point = burnerPoint(RECT, particle);
  const t = clamp01(particle.age / particle.life);
  const alpha = Math.sin(t * Math.PI) * 0.32;
  const size = Math.max(5, particle.size * 720);
  const wobble = Math.sin(particle.phase + particle.age * 1.8) * size * 0.55;
  const y1 = Math.max(10, point.y - size * 1.05);
  const y2 = Math.max(6, point.y - size * 2.25);
  const y3 = Math.max(4, point.y - size * 3.25);

  return (
    <path
      d={`M${point.x.toFixed(1)} ${(point.y - 2).toFixed(1)} C${(point.x - size * 0.42).toFixed(1)} ${y1.toFixed(1)} ${(
        point.x +
        size * 0.58 +
        wobble
      ).toFixed(1)} ${y2.toFixed(1)} ${(point.x + wobble).toFixed(1)} ${y3.toFixed(1)}`}
      fill="none"
      stroke={particle.phase > Math.PI ? theme.smokeWarm : theme.smokeCool}
      strokeLinecap="round"
      strokeWidth={Math.max(0.7, size * 0.11)}
      opacity={alpha}
    />
  );
}

function Spark({ particle }: { particle: SparkParticle }) {
  const point = burnerPoint(RECT, particle);
  const t = clamp01(particle.age / particle.life);

  return <circle cx={point.x} cy={point.y} r={Math.max(1.2, particle.size * 260)} fill="#ffca69" opacity={0.9 * (1 - t)} />;
}

function IncenseTally({ overflowAshCount, totalToday }: { overflowAshCount: number; totalToday: number }) {
  if (overflowAshCount <= 0 && totalToday <= 0) return null;

  return (
    <g opacity="0.72">
      <text x="160" y="282" textAnchor="middle" fill="#91e5cf" fontSize="11" fontWeight="700">
        {overflowAshCount > 0 ? `+${overflowAshCount}` : totalToday}
      </text>
    </g>
  );
}

function compareStickDrawOrder(a: IncenseStickState, b: IncenseStickState): number {
  return a.depth - b.depth || a.y - b.y || a.id.localeCompare(b.id);
}

function useSvgId(prefix: string): string {
  return `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
}
