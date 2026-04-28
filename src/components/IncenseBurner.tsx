import { motion } from "framer-motion";

type IncenseBurnerProps = {
  litCount: number;
  pulseId: number;
  compact?: boolean;
};

const STICKS = [
  { x: 132, angle: -6 },
  { x: 152, angle: 0 },
  { x: 172, angle: 6 }
];

export function IncenseBurner({ litCount, pulseId, compact = false }: IncenseBurnerProps) {
  return (
    <svg className="relative z-10 h-full w-full" viewBox="0 0 304 280" role="img" aria-label="抽象电子香炉">
      <defs>
        <linearGradient id="burnerBody" x1="86" x2="220" y1="198" y2="248" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5a3424" />
          <stop offset="0.48" stopColor="#d8923f" />
          <stop offset="1" stopColor="#3a2922" />
        </linearGradient>
        <linearGradient id="stickGradient" x1="0" x2="0" y1="90" y2="205" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f6bd67" />
          <stop offset="1" stopColor="#6d4432" />
        </linearGradient>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>

      <motion.ellipse
        key={pulseId}
        cx="152"
        cy="204"
        rx="84"
        ry="28"
        fill="#e68a2e"
        opacity="0.22"
        filter="url(#softGlow)"
        initial={{ scale: 0.76, opacity: 0.08 }}
        animate={{ scale: compact ? [0.86, 1.05, 0.94] : [0.92, 1.16, 0.98], opacity: [0.18, 0.42, 0.18] }}
        transition={{ duration: 0.95, ease: "easeOut" }}
      />

      {STICKS.map((stick, index) => {
        const lit = litCount > index;
        return (
          <g key={stick.x} transform={`rotate(${stick.angle} ${stick.x} 205)`}>
            <rect x={stick.x - 2} y="88" width="4" height="119" rx="2" fill="url(#stickGradient)" />
            <rect x={stick.x + 2.8} y="96" width="1.4" height="108" rx="0.7" fill="#2a211d" opacity="0.7" />
            <motion.circle
              key={`${pulseId}-${stick.x}-${lit}`}
              cx={stick.x}
              cy="86"
              r={lit ? 5.5 : 2.5}
              fill={lit ? "#ffc564" : "#8a6a4e"}
              initial={lit ? { scale: 0.85, opacity: 0.7 } : undefined}
              animate={lit ? { opacity: [0.82, 1, 0.82], scale: [1, 1.18, 1] } : { opacity: 0.55 }}
              transition={lit ? { duration: 1.25, repeat: Infinity, ease: "easeInOut" } : undefined}
            />
            {lit ? <circle cx={stick.x} cy="86" r="12" fill="#e68a2e" opacity="0.16" filter="url(#softGlow)" /> : null}
          </g>
        );
      })}

      <ellipse cx="152" cy="207" rx="74" ry="18" fill="#211a16" />
      <path
        d="M80 204 C91 249 105 260 152 260 C199 260 213 249 224 204 Z"
        fill="url(#burnerBody)"
        stroke="#f8bd65"
        strokeOpacity="0.45"
        strokeWidth="1.5"
      />
      <ellipse cx="152" cy="204" rx="74" ry="21" fill="#6f442d" stroke="#f8bd65" strokeOpacity="0.65" strokeWidth="2" />
      <ellipse cx="152" cy="202" rx="55" ry="11" fill="#181311" opacity="0.88" />
      <path d="M104 229 C121 243 183 243 201 229" fill="none" stroke="#ffe8b6" strokeOpacity="0.26" strokeWidth="2" />
      <circle cx="108" cy="213" r="2" fill="#91e5cf" opacity="0.85" />
      <circle cx="198" cy="216" r="2" fill="#91e5cf" opacity="0.72" />
    </svg>
  );
}
