import type { Rect } from "../../types/ritualPainter.js";
import type { Vec2 } from "../../types/ritualSimulation.js";
import { seededRandom } from "../ritualRandom.js";
import { ns, nx, ny } from "./geometry.js";

export type SvgStrokePath = {
  d: string;
  strokeWidth: number;
  opacity: number;
};

export type SvgEllipse = {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rotate?: number;
  opacity?: number;
};

export function createMuyuBodyPath(rect: Rect): string {
  return [
    `M ${nx(rect, 0.15)} ${ny(rect, 0.62)}`,
    `C ${nx(rect, 0.17)} ${ny(rect, 0.42)} ${nx(rect, 0.30)} ${ny(rect, 0.22)} ${nx(rect, 0.52)} ${ny(rect, 0.20)}`,
    `C ${nx(rect, 0.73)} ${ny(rect, 0.18)} ${nx(rect, 0.88)} ${ny(rect, 0.36)} ${nx(rect, 0.87)} ${ny(rect, 0.58)}`,
    `C ${nx(rect, 0.85)} ${ny(rect, 0.76)} ${nx(rect, 0.67)} ${ny(rect, 0.83)} ${nx(rect, 0.45)} ${ny(rect, 0.80)}`,
    `C ${nx(rect, 0.26)} ${ny(rect, 0.78)} ${nx(rect, 0.13)} ${ny(rect, 0.70)} ${nx(rect, 0.15)} ${ny(rect, 0.62)}`,
    "Z"
  ].join(" ");
}

export function createMuyuMouthPath(rect: Rect): string {
  return [
    `M ${nx(rect, 0.43)} ${ny(rect, 0.57)}`,
    `C ${nx(rect, 0.53)} ${ny(rect, 0.52)} ${nx(rect, 0.72)} ${ny(rect, 0.50)} ${nx(rect, 0.86)} ${ny(rect, 0.49)}`,
    `C ${nx(rect, 0.84)} ${ny(rect, 0.54)} ${nx(rect, 0.68)} ${ny(rect, 0.58)} ${nx(rect, 0.48)} ${ny(rect, 0.63)}`,
    `C ${nx(rect, 0.44)} ${ny(rect, 0.64)} ${nx(rect, 0.41)} ${ny(rect, 0.61)} ${nx(rect, 0.43)} ${ny(rect, 0.57)}`,
    "Z"
  ].join(" ");
}

export function createMuyuMouthEdgePath(rect: Rect): string {
  return [
    `M ${nx(rect, 0.43)} ${ny(rect, 0.56)}`,
    `C ${nx(rect, 0.55)} ${ny(rect, 0.51)} ${nx(rect, 0.74)} ${ny(rect, 0.49)} ${nx(rect, 0.86)} ${ny(rect, 0.48)}`
  ].join(" ");
}

export function createMuyuCushionPath(rect: Rect): string {
  const x = nx(rect, 0.18);
  const y = ny(rect, 0.65);
  const w = rect.w * 0.64;
  const h = rect.h * 0.16;

  return [
    `M ${x + w * 0.08} ${y + h * 0.45}`,
    `C ${x + w * 0.12} ${y + h * 0.05} ${x + w * 0.88} ${y + h * 0.05} ${x + w * 0.92} ${y + h * 0.45}`,
    `C ${x + w * 1.0} ${y + h * 0.95} ${x} ${y + h * 0.95} ${x + w * 0.08} ${y + h * 0.45}`,
    "Z"
  ].join(" ");
}

export function createWoodGrainPaths(rect: Rect, count = 26): SvgStrokePath[] {
  return Array.from({ length: count }).map((_, index) => {
    const t = count <= 1 ? 0 : index / (count - 1);
    const yy = ny(rect, 0.30 + t * 0.40);
    const startX = nx(rect, 0.20);
    const endX = nx(rect, 0.82);
    const amp = ns(rect, 0.006 + 0.004 * seededRandom(index * 13 + 11));
    const phase = seededRandom(index * 97 + 7) * Math.PI * 2;

    return {
      d: [
        `M ${startX} ${yy}`,
        `C ${nx(rect, 0.34)} ${yy + Math.sin(phase) * amp} ${nx(rect, 0.48)} ${yy - Math.cos(phase) * amp} ${nx(rect, 0.62)} ${
          yy + Math.sin(phase + 1.5) * amp
        }`,
        `C ${nx(rect, 0.70)} ${yy + Math.sin(phase + 2.2) * amp} ${nx(rect, 0.77)} ${yy - Math.cos(phase + 0.7) * amp} ${endX} ${
          yy + Math.sin(phase + 3.1) * amp
        }`
      ].join(" "),
      strokeWidth: ns(rect, 0.0015 + seededRandom(index * 5 + 3) * 0.0015),
      opacity: 0.28 + seededRandom(index + 1) * 0.22
    };
  });
}

export function createWoodKnots(rect: Rect): SvgEllipse[] {
  return [
    { cx: nx(rect, 0.36), cy: ny(rect, 0.43), rx: ns(rect, 0.038), ry: ns(rect, 0.025), rotate: -8 },
    { cx: nx(rect, 0.64), cy: ny(rect, 0.36), rx: ns(rect, 0.027), ry: ns(rect, 0.018), rotate: 11 },
    { cx: nx(rect, 0.55), cy: ny(rect, 0.59), rx: ns(rect, 0.023), ry: ns(rect, 0.015), rotate: 6 }
  ];
}

export function createMuyuCarvingPaths(rect: Rect): SvgStrokePath[] {
  const baseX = 0.34;
  const baseY = 0.38;

  return Array.from({ length: 7 }).map((_, index) => {
    const a = index * 0.72;
    const r = 0.035 + index * 0.008;

    return {
      d: [
        `M ${nx(rect, baseX + Math.cos(a) * r * 0.4)} ${ny(rect, baseY + Math.sin(a) * r * 0.25)}`,
        `C ${nx(rect, baseX + Math.cos(a + 0.7) * r)} ${ny(rect, baseY + Math.sin(a + 0.7) * r * 0.65)} ${nx(
          rect,
          baseX + Math.cos(a + 1.8) * r * 1.5
        )} ${ny(rect, baseY + Math.sin(a + 1.8) * r)} ${nx(rect, baseX + Math.cos(a + 2.9) * r * 0.6)} ${ny(
          rect,
          baseY + Math.sin(a + 2.9) * r * 0.8
        )}`
      ].join(" "),
      strokeWidth: ns(rect, 0.004),
      opacity: 0.65
    };
  });
}

export function muyuPoint(rect: Rect, point: Vec2): Vec2 {
  return {
    x: nx(rect, point.x),
    y: ny(rect, point.y)
  };
}
