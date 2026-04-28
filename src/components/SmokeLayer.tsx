import { motion } from "framer-motion";

type SmokeLayerProps = {
  intensity: number;
  pulseId: number;
  compact?: boolean;
};

const SMOKE_PATHS = [
  "M118 156 C94 132 137 111 113 84 C93 62 122 44 112 24",
  "M154 160 C176 134 133 111 160 82 C184 56 145 41 164 20",
  "M191 156 C168 131 211 112 188 83 C168 59 199 44 190 23",
  "M139 163 C125 142 160 126 143 100 C129 78 153 64 147 45",
  "M175 165 C193 144 160 126 178 99 C195 74 170 63 182 42"
];

export function SmokeLayer({ intensity, pulseId, compact = false }: SmokeLayerProps) {
  const opacity = Math.min(0.78, 0.18 + intensity * 0.54);

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 304 280" aria-hidden="true">
      <motion.g
        key={pulseId}
        initial={{ scale: 0.95, opacity: opacity * 0.45, y: compact ? 8 : 2 }}
        animate={{ scale: [1, 1.035, 1], opacity, y: compact ? [4, -3, 0] : [0, -7, 0] }}
        transition={{ duration: 1.05, ease: "easeOut" }}
      >
        {SMOKE_PATHS.map((path, index) => (
          <motion.path
            key={path}
            d={path}
            fill="none"
            stroke={index % 2 === 0 ? "#91e5cf" : "#ffe8b6"}
            strokeLinecap="round"
            strokeWidth={1.8 + intensity * 2}
            opacity={opacity - index * 0.08}
            animate={{
              pathLength: [0.22, 1, 0.34],
              y: [-1, -8, -1],
              x: index % 2 === 0 ? [-1, 3, -1] : [1, -3, 1]
            }}
            transition={{
              duration: (compact ? 3.6 : 4.2) + index * 0.38,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.26
            }}
          />
        ))}
      </motion.g>
    </svg>
  );
}
