import type { AshBed, Vec2 } from "../types/ritualSimulation.js";

export const DEFAULT_ASH_BED: AshBed = {
  cx: 0.5,
  cy: 0.42,
  rx: 0.28,
  ry: 0.048
};

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function insideEllipse(x: number, y: number, bed: AshBed): boolean {
  const dx = (x - bed.cx) / bed.rx;
  const dy = (y - bed.cy) / bed.ry;
  return dx * dx + dy * dy <= 1;
}

export function normalizePoint(point: Vec2): Vec2 {
  return {
    x: clamp(point.x, 0, 1),
    y: clamp(point.y, 0, 1)
  };
}

export function distance(a: Vec2, b: Vec2): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}
