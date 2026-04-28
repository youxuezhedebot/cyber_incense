import type { Rect, Size } from "../../types/ritualPainter.js";
import type { AshBed, Vec2 } from "../../types/ritualSimulation.js";

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function clamp01(value: number): number {
  return clamp(value, 0, 1);
}

export function nx(rect: Rect, x: number): number {
  return rect.x + rect.w * x;
}

export function ny(rect: Rect, y: number): number {
  return rect.y + rect.h * y;
}

export function ns(rect: Rect, s: number): number {
  return Math.min(rect.w, rect.h) * s;
}

export function normalizePointInRect(point: Vec2, rect: Rect): Vec2 {
  return {
    x: clamp01((point.x - rect.x) / rect.w),
    y: clamp01((point.y - rect.y) / rect.h)
  };
}

export function pointInRect(point: Vec2, rect: Rect): boolean {
  return point.x >= rect.x && point.x <= rect.x + rect.w && point.y >= rect.y && point.y <= rect.y + rect.h;
}

export function pointInEllipse(point: Vec2, center: Vec2, radius: Vec2): boolean {
  const dx = (point.x - center.x) / radius.x;
  const dy = (point.y - center.y) / radius.y;
  return dx * dx + dy * dy <= 1;
}

export function pointInAshBed(point: Vec2, bed: AshBed): boolean {
  return pointInEllipse(point, { x: bed.cx, y: bed.cy }, { x: bed.rx, y: bed.ry });
}

export function logicalToDeviceRect(rect: Rect, pixelRatio: number): Rect {
  return {
    x: Math.round(rect.x * pixelRatio),
    y: Math.round(rect.y * pixelRatio),
    w: Math.round(rect.w * pixelRatio),
    h: Math.round(rect.h * pixelRatio)
  };
}

export function rectFromSize(size: Size): Rect {
  return { x: 0, y: 0, w: size.w, h: size.h };
}

export function rectKey(rect: Rect): string {
  return `${round(rect.x)}:${round(rect.y)}:${round(rect.w)}:${round(rect.h)}`;
}

export function toSvgPoint(rect: Rect, point: Vec2): Vec2 {
  return {
    x: nx(rect, point.x),
    y: ny(rect, point.y)
  };
}

function round(value: number): string {
  return value.toFixed(2);
}
