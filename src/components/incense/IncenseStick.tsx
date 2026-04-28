import { getEmberPoint } from "../../lib/ritualEngine";
import type { IncenseStickState } from "../../types/ritualSimulation";

type IncenseStickProps = {
  stick: IncenseStickState;
  now: number;
};

export function IncenseStick({ stick, now }: IncenseStickProps) {
  const base = toIncenseSvgPoint(stick);
  const ember = toIncenseSvgPoint(getEmberPoint(stick));
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
  const glow = 1 - Math.min(1, stick.burnProgress);

  return (
    <g aria-hidden="true" opacity={opacity} transform={`translate(0 ${yOffset.toFixed(2)})`}>
      <line
        x1={base.x}
        y1={base.y}
        x2={coalEnd.x}
        y2={coalEnd.y}
        stroke="#6f2b1c"
        strokeLinecap="round"
        strokeWidth={width}
      />
      <line
        x1={base.x + Math.cos(angle + Math.PI / 2) * width * 0.32}
        y1={base.y + Math.sin(angle + Math.PI / 2) * width * 0.32}
        x2={coalEnd.x + Math.cos(angle + Math.PI / 2) * width * 0.32}
        y2={coalEnd.y + Math.sin(angle + Math.PI / 2) * width * 0.32}
        stroke="#1f1612"
        strokeLinecap="round"
        strokeWidth={Math.max(0.6, width * 0.26)}
        opacity="0.58"
      />
      <line
        x1={coalEnd.x}
        y1={coalEnd.y}
        x2={ember.x}
        y2={ember.y}
        stroke="#2b1b14"
        strokeLinecap="round"
        strokeWidth={width * 1.05}
        opacity="0.9"
      />
      <line
        x1={coalEnd.x + Math.cos(angle + Math.PI / 2) * width * 0.18}
        y1={coalEnd.y + Math.sin(angle + Math.PI / 2) * width * 0.18}
        x2={ember.x + Math.cos(angle + Math.PI / 2) * width * 0.18}
        y2={ember.y + Math.sin(angle + Math.PI / 2) * width * 0.18}
        stroke="#c8b8a8"
        strokeLinecap="round"
        strokeWidth={Math.max(0.5, width * 0.22)}
        opacity="0.42"
      />
      <circle cx={ember.x} cy={ember.y} r={Math.max(1.6, width * 0.95)} fill="#ff7b2f" opacity={0.86 + glow * 0.1} />
      <circle cx={ember.x} cy={ember.y} r={Math.max(3.2, width * 1.8)} fill="#ffbf68" opacity={0.18 + glow * 0.16} />
      <circle cx={ember.x} cy={ember.y} r={Math.max(7, width * 4.8)} fill="#e66f2e" opacity={0.07 + glow * 0.08} />
    </g>
  );
}

export function toIncenseSvgPoint(point: { x: number; y: number }): { x: number; y: number } {
  return {
    x: 160 + (point.x - 0.5) * 230,
    y: 210 + (point.y - 0.42) * 290
  };
}
