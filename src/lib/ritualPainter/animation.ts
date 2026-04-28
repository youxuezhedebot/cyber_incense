import type { Vec2 } from "../../types/ritualSimulation.js";
import { clamp01 } from "./geometry.js";

export function clampDt(dt: number): number {
  return Math.min(0.033, Math.max(0, dt));
}

export function easeOutCubic(t: number): number {
  t = clamp01(t);
  return 1 - Math.pow(1 - t, 3);
}

export function easeInOutCubic(t: number): number {
  t = clamp01(t);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOutBack(t: number): number {
  t = clamp01(t);
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

export function pulse01(t: number): number {
  return Math.sin(clamp01(t) * Math.PI);
}

export function quadBezier(a: Vec2, b: Vec2, c: Vec2, t: number): Vec2 {
  const inv = 1 - clamp01(t);
  const p = 1 - inv;

  return {
    x: inv * inv * a.x + 2 * inv * p * b.x + p * p * c.x,
    y: inv * inv * a.y + 2 * inv * p * b.y + p * p * c.y
  };
}

export function lerpPoint(a: Vec2, b: Vec2, t: number): Vec2 {
  t = clamp01(t);
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t
  };
}
