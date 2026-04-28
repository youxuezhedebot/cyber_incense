import type { Rect } from "../../types/ritualPainter.js";
import type { AshBed, Vec2 } from "../../types/ritualSimulation.js";
import { seededRandom } from "../ritualRandom.js";
import { ns, nx, ny } from "./geometry.js";

export type AshParticleMark = {
  x: number;
  y: number;
  r: number;
  opacity: number;
  colorIndex: number;
};

export type BurnerOrnament = {
  d: string;
  opacity: number;
};

export function createBurnerBodyPath(rect: Rect): string {
  return [
    `M ${nx(rect, 0.20)} ${ny(rect, 0.46)}`,
    `C ${nx(rect, 0.16)} ${ny(rect, 0.58)} ${nx(rect, 0.24)} ${ny(rect, 0.70)} ${nx(rect, 0.50)} ${ny(rect, 0.72)}`,
    `C ${nx(rect, 0.76)} ${ny(rect, 0.70)} ${nx(rect, 0.84)} ${ny(rect, 0.58)} ${nx(rect, 0.80)} ${ny(rect, 0.46)}`,
    `C ${nx(rect, 0.70)} ${ny(rect, 0.52)} ${nx(rect, 0.30)} ${ny(rect, 0.52)} ${nx(rect, 0.20)} ${ny(rect, 0.46)}`,
    "Z"
  ].join(" ");
}

export function createBurnerFrontRimPath(rect: Rect): string {
  return [
    `M ${nx(rect, 0.23)} ${ny(rect, 0.47)}`,
    `C ${nx(rect, 0.34)} ${ny(rect, 0.52)} ${nx(rect, 0.66)} ${ny(rect, 0.52)} ${nx(rect, 0.77)} ${ny(rect, 0.47)}`,
    `L ${nx(rect, 0.75)} ${ny(rect, 0.51)}`,
    `C ${nx(rect, 0.65)} ${ny(rect, 0.55)} ${nx(rect, 0.35)} ${ny(rect, 0.55)} ${nx(rect, 0.25)} ${ny(rect, 0.51)}`,
    "Z"
  ].join(" ");
}

export function createBurnerInnerRimPath(rect: Rect): string {
  return [
    `M ${nx(rect, 0.20)} ${ny(rect, 0.46)}`,
    `C ${nx(rect, 0.32)} ${ny(rect, 0.38)} ${nx(rect, 0.68)} ${ny(rect, 0.38)} ${nx(rect, 0.80)} ${ny(rect, 0.46)}`,
    `C ${nx(rect, 0.68)} ${ny(rect, 0.52)} ${nx(rect, 0.32)} ${ny(rect, 0.52)} ${nx(rect, 0.20)} ${ny(rect, 0.46)}`,
    "Z"
  ].join(" ");
}

export function createBurnerOrnaments(rect: Rect): BurnerOrnament[] {
  return Array.from({ length: 5 }).map((_, index) => {
    const cx = 0.30 + index * 0.10;
    const cy = 0.62;

    return {
      d: [
        `M ${nx(rect, cx - 0.030)} ${ny(rect, cy)}`,
        `C ${nx(rect, cx - 0.018)} ${ny(rect, cy - 0.018)} ${nx(rect, cx + 0.018)} ${ny(rect, cy - 0.018)} ${nx(rect, cx + 0.030)} ${ny(rect, cy)}`,
        `C ${nx(rect, cx + 0.018)} ${ny(rect, cy + 0.012)} ${nx(rect, cx - 0.018)} ${ny(rect, cy + 0.012)} ${nx(rect, cx - 0.030)} ${ny(rect, cy)}`,
        "Z"
      ].join(" "),
      opacity: 0.42 + (index === 2 ? 0.08 : Math.abs(index - 2) === 1 ? 0.04 : 0)
    };
  });
}

export function burnerPoint(rect: Rect, point: Vec2): Vec2 {
  return {
    x: nx(rect, 0.5) + (point.x - 0.5) * rect.w * 0.66,
    y: ny(rect, 0.46) + (point.y - 0.42) * rect.h * 0.78
  };
}

export function createAshEllipse(rect: Rect, bed: AshBed | undefined, ashVisualHeight = 0): { cx: number; cy: number; rx: number; ry: number } {
  const source = bed ?? { cx: 0.5, cy: 0.42, rx: 0.28, ry: 0.048 };
  const center = burnerPoint(rect, { x: source.cx, y: source.cy });

  return {
    cx: center.x,
    cy: center.y - ns(rect, ashVisualHeight * 0.018),
    rx: rect.w * source.rx * 0.66 * (1 + ashVisualHeight * 0.18),
    ry: rect.h * source.ry * 0.78 * (1 + ashVisualHeight * 0.45)
  };
}

export function createAshParticleMarks(
  rect: Rect,
  bed: AshBed | undefined,
  count: number,
  ashVisualHeight: number
): AshParticleMark[] {
  const ellipse = createAshEllipse(rect, bed, ashVisualHeight);

  return Array.from({ length: count }).map((_, index) => {
    const seed = index * 991 + 41;
    const a = seededRandom(seed) * Math.PI * 2;
    const r = Math.sqrt(seededRandom(seed + 1));

    return {
      x: ellipse.cx + Math.cos(a) * ellipse.rx * r,
      y: ellipse.cy + Math.sin(a) * ellipse.ry * r,
      r: ns(rect, 0.0024 + seededRandom(seed + 2) * 0.003),
      opacity: 0.24 + seededRandom(seed + 3) * 0.42,
      colorIndex: seed % 3
    };
  });
}
