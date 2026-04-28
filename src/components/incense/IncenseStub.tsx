import type { IncenseStickState } from "../../types/ritualSimulation";
import { toIncenseSvgPoint } from "./IncenseStick";

type IncenseStubProps = {
  stick: IncenseStickState;
};

export function IncenseStub({ stick }: IncenseStubProps) {
  const base = toIncenseSvgPoint(stick);
  const length = 7 + (stick.seed % 7);
  const lean = Math.sin(stick.angle) * length * 0.8;
  const top = {
    x: base.x + lean,
    y: base.y - length
  };
  const width = Math.max(1.4, stick.thickness * 280);

  return (
    <g aria-hidden="true" opacity="0.58">
      <line
        x1={base.x}
        y1={base.y + 1}
        x2={top.x}
        y2={top.y}
        stroke={stick.id.startsWith("aggregate-stub-") ? "#6c5041" : "#7a3b24"}
        strokeLinecap="round"
        strokeWidth={width}
      />
      <circle cx={top.x} cy={top.y} r={Math.max(1.1, width * 0.75)} fill="#d8c8b6" opacity="0.5" />
    </g>
  );
}
