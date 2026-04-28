import { motion } from "framer-motion";

type IncenseBasinProps = {
  pulseId: number;
  ashIntensity: number;
  layer?: "base" | "front";
};

export function IncenseBasin({ pulseId, ashIntensity, layer = "base" }: IncenseBasinProps) {
  if (layer === "front") {
    return (
      <g aria-hidden="true">
        <path
          d="M76 211 C88 262 107 276 160 276 C213 276 232 262 244 211 C219 230 101 230 76 211 Z"
          fill="url(#basinOuter)"
          stroke="#ffc86c"
          strokeOpacity="0.36"
          strokeWidth="1.5"
        />
        <path d="M77 211 C103 230 217 230 243 211" fill="none" stroke="#ffd993" strokeOpacity="0.58" strokeWidth="2.4" />
        <path d="M102 237 C121 252 199 252 219 237" fill="none" stroke="#ffe7b7" strokeOpacity="0.22" strokeWidth="2" />
        <path d="M94 221 C121 233 199 233 226 221" fill="none" stroke="#91e5cf" strokeOpacity="0.18" strokeWidth="1.4" />
      </g>
    );
  }

  return (
    <g aria-hidden="true">
      <defs>
        <linearGradient id="basinOuter" x1="78" x2="242" y1="195" y2="260" gradientUnits="userSpaceOnUse">
          <stop stopColor="#362922" />
          <stop offset="0.24" stopColor="#8a5130" />
          <stop offset="0.55" stopColor="#d18d42" />
          <stop offset="1" stopColor="#211b18" />
        </linearGradient>
        <linearGradient id="basinLip" x1="83" x2="235" y1="195" y2="224" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2a211d" />
          <stop offset="0.46" stopColor="#f0b15d" />
          <stop offset="1" stopColor="#3d2b22" />
        </linearGradient>
        <filter id="basinGlow">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>

      <motion.ellipse
        key={pulseId}
        cx="160"
        cy="214"
        rx="88"
        ry="30"
        fill="#e68a2e"
        filter="url(#basinGlow)"
        initial={{ opacity: 0.08, scale: 0.86 }}
        animate={{ opacity: [0.12, 0.28, 0.12], scale: [0.92, 1.12, 0.98] }}
        transition={{ duration: 1.05, ease: "easeOut" }}
      />
      <ellipse cx="160" cy="218" rx="84" ry="23" fill="#14100e" opacity="0.96" />
      <path
        d="M76 211 C88 262 107 276 160 276 C213 276 232 262 244 211 Z"
        fill="url(#basinOuter)"
        stroke="#ffc86c"
        strokeOpacity="0.38"
        strokeWidth="1.5"
      />
      <ellipse cx="160" cy="211" rx="85" ry="25" fill="url(#basinLip)" stroke="#ffd993" strokeOpacity="0.5" strokeWidth="2" />
      <ellipse cx="160" cy="209" rx="65" ry="14" fill="#18120f" opacity="0.9" />
      <ellipse cx="160" cy="210" rx={48 + ashIntensity * 9} ry={7 + ashIntensity * 2} fill="#d6c5ad" opacity={0.06 + ashIntensity * 0.08} />
    </g>
  );
}
