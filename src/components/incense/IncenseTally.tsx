type IncenseTallyProps = {
  overflowAshCount: number;
  totalToday?: number;
};

export function IncenseTally({ overflowAshCount, totalToday }: IncenseTallyProps) {
  const density = Math.min(1, (totalToday ?? 0) / 120);
  const clusterCount = Math.min(8, Math.ceil(overflowAshCount / 12));

  return (
    <g aria-hidden="true">
      {density > 0.35 ? <path d="M93 207 C121 196 200 196 228 207" fill="none" stroke="#1b1512" strokeOpacity={density * 0.24} strokeWidth="5" /> : null}
      {overflowAshCount > 0
        ? Array.from({ length: clusterCount }).map((_, index) => (
            <circle
              key={index}
              cx={219 + index * 4}
              cy={232 - (index % 2) * 3}
              r={2.2 + density * 1.8}
              fill={index % 2 === 0 ? "#ffe7b7" : "#b8ada0"}
              opacity={0.22 + density * 0.22}
            />
          ))
        : null}
    </g>
  );
}
