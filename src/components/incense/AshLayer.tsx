import type { AshFragment } from "../../types/ritualSimulation";
import { toIncenseSvgPoint } from "./IncenseStick";

type AshLayerProps = {
  count: number;
  intensity: number;
  ashVisualHeight?: number;
  fragments?: AshFragment[];
};

const ASH_POINTS = [
  [123, 210, 0],
  [139, 207, -8],
  [157, 211, 7],
  [176, 207, -3],
  [195, 211, 10],
  [132, 216, 6],
  [150, 218, -5],
  [169, 217, 2],
  [187, 216, -7],
  [116, 216, -12],
  [205, 216, 12],
  [140, 212, 4],
  [161, 214, -4],
  [182, 213, 8],
  [197, 207, -8],
  [127, 206, 9],
  [151, 219, 12],
  [183, 219, -11]
];

export function AshLayer({ count, intensity, ashVisualHeight = intensity, fragments = [] }: AshLayerProps) {
  const ashLift = ashVisualHeight * 5;

  return (
    <g aria-hidden="true">
      <ellipse
        cx="160"
        cy={211 - ashLift}
        rx={44 + intensity * 9 + ashVisualHeight * 12}
        ry={6 + intensity * 3 + ashVisualHeight * 4}
        fill="#b8ada0"
        opacity={0.16 + intensity * 0.18 + ashVisualHeight * 0.1}
      />
      <ellipse
        cx="160"
        cy={208 - ashLift * 0.85}
        rx={24 + ashVisualHeight * 22}
        ry={3 + ashVisualHeight * 4}
        fill="#e4d5c5"
        opacity={0.1 + ashVisualHeight * 0.2}
      />
      {ASH_POINTS.slice(0, count).map(([x, y, rotate], index) => (
        <g key={`${x}-${y}`} transform={`rotate(${rotate} ${x} ${y})`}>
          <rect
            x={x - 5}
            y={y - 1}
            width={8 + (index % 3)}
            height="2.2"
            rx="1"
            fill={index % 2 === 0 ? "#d8c8b6" : "#8d8278"}
            opacity={0.45 + Math.min(0.4, intensity)}
          />
        </g>
      ))}
      {fragments.map((fragment) => {
        const point = toIncenseSvgPoint(fragment);
        const t = Math.min(1, fragment.age / fragment.life);

        return (
          <rect
            key={fragment.id}
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
      })}
    </g>
  );
}
