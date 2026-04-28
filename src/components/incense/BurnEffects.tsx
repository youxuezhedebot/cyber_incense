import { motion } from "framer-motion";
import type { SmokeParticle, SparkParticle } from "../../types/ritualSimulation";
import { toIncenseSvgPoint } from "./IncenseStick";

type BurnEffectsProps = {
  activeCount: number;
  ashIntensity: number;
  smokeParticles?: SmokeParticle[];
  sparkParticles?: SparkParticle[];
};

const SMOKE_PATHS = [
  "M122 162 C100 137 143 112 118 84 C98 61 129 43 119 24",
  "M160 164 C181 139 140 114 167 85 C190 60 151 43 171 21",
  "M198 162 C176 136 217 113 194 84 C174 60 205 43 196 22"
];

export function BurnEffects({ activeCount, ashIntensity, smokeParticles = [], sparkParticles = [] }: BurnEffectsProps) {
  const active = activeCount > 0 || smokeParticles.length > 0 || sparkParticles.length > 0;
  const opacity = active ? 0.62 : Math.min(0.24, ashIntensity * 0.22);

  if (!active && ashIntensity <= 0) return null;

  return (
    <g aria-hidden="true" opacity={opacity}>
      {smokeParticles.length > 0
        ? smokeParticles.map((particle) => {
            const point = toIncenseSvgPoint(particle);
            const alpha = smokeAlpha(particle);
            const size = Math.max(5, particle.size * 720);
            const wobble = Math.sin(particle.phase + particle.age * 1.8) * size * 0.55;

            return (
              <path
                key={particle.id}
                d={`M${point.x.toFixed(1)} ${(point.y - 2).toFixed(1)} C${(point.x - size * 0.42).toFixed(1)} ${(
                  point.y -
                  size * 1.05
                ).toFixed(1)} ${(point.x + size * 0.58 + wobble).toFixed(1)} ${(point.y - size * 2.25).toFixed(1)} ${(
                  point.x +
                  wobble
                ).toFixed(1)} ${(point.y - size * 3.25).toFixed(1)}`}
                fill="none"
                stroke={particle.phase > Math.PI ? "#e8e1d7" : "#d7fff4"}
                strokeLinecap="round"
                strokeWidth={Math.max(0.7, size * 0.11)}
                opacity={alpha}
              />
            );
          })
        : activeCount === 0 && ashIntensity > 0
          ? SMOKE_PATHS.map((path, index) => (
            <motion.path
              key={path}
              d={path}
              fill="none"
              stroke={index === 1 ? "#ffe7b7" : "#91e5cf"}
              strokeLinecap="round"
              strokeWidth={active ? 2.3 : 1.2}
              initial={{ pathLength: 0.18, opacity: 0.2 }}
              animate={{
                pathLength: active ? [0.2, 1, 0.36] : [0.45, 0.7, 0.45],
                y: active ? [0, -9, 0] : [0, -3, 0],
                x: index % 2 === 0 ? [-1, 2, -1] : [1, -2, 1],
                opacity: active ? [0.3, 0.82, 0.34] : [0.16, 0.32, 0.16]
              }}
              transition={{
                duration: active ? 3.2 + index * 0.35 : 6.5 + index,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.2
              }}
            />
            ))
          : null}
      {sparkParticles.map((particle) => {
        const point = toIncenseSvgPoint(particle);
        const t = Math.min(1, particle.age / particle.life);

        return (
          <circle
            key={particle.id}
            cx={point.x}
            cy={point.y}
            r={Math.max(1.2, particle.size * 260)}
            fill="#ffca69"
            opacity={0.9 * (1 - t)}
          />
        );
      })}
    </g>
  );
}

function smokeAlpha(particle: SmokeParticle): number {
  const t = Math.min(1, particle.age / particle.life);
  return Math.sin(t * Math.PI) * 0.32;
}
