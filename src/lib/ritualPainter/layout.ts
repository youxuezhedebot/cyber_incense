import type { Rect, RitualPainterLayout, RoutedInteraction } from "../../types/ritualPainter.js";
import type { RitualObjectKind } from "../../types/incense.js";
import type { RitualSnapshot, Vec2 } from "../../types/ritualSimulation.js";
import { normalizePointInRect, pointInEllipse, pointInRect } from "./geometry.js";

export const SVG_VIEWBOX: Rect = { x: 0, y: 0, w: 320, h: 286 };
export const BURNER_VIEWBOX: Rect = { x: 0, y: 0, w: 320, h: 286 };
export const MUYU_VIEWBOX: Rect = { x: 0, y: 0, w: 320, h: 260 };

export function createRitualPainterLayout(root: Rect): RitualPainterLayout {
  return {
    root,
    burner: { x: root.x, y: root.y, w: root.w, h: root.h },
    muyu: { x: root.x, y: root.y, w: root.w, h: root.h }
  };
}

export function routeInteraction(
  point: Vec2,
  root: Rect,
  activeObject: RitualObjectKind,
  snapshot: RitualSnapshot | null
): RoutedInteraction {
  const layout = createRitualPainterLayout(root);

  if (activeObject === "muyu") {
    if (!pointInRect(point, layout.muyu)) return { target: null, local: null };
    const local = normalizePointInRect(point, layout.muyu);
    return isInsideMuyuInteractiveArea(local) ? { target: "muyu", local } : { target: null, local: null };
  }

  if (!pointInRect(point, layout.burner)) return { target: null, local: null };
  const local = normalizePointInRect(point, layout.burner);
  return isInsideBurnerInteractiveArea(local, snapshot) ? { target: "burner", local } : { target: null, local: null };
}

export function isInsideMuyuInteractiveArea(point: Vec2): boolean {
  if (pointInEllipse(point, { x: 0.65, y: 0.555 }, { x: 0.21, y: 0.06 })) return false;
  return pointInEllipse(point, { x: 0.52, y: 0.51 }, { x: 0.36, y: 0.25 });
}

export function isInsideBurnerInteractiveArea(point: Vec2, snapshot: RitualSnapshot | null): boolean {
  const bed = snapshot?.config.ashBed;
  if (bed && pointInEllipse(point, { x: bed.cx, y: bed.cy + 0.14 }, { x: bed.rx * 1.45, y: bed.ry * 4.0 })) {
    return true;
  }

  return pointInEllipse(point, { x: 0.5, y: 0.62 }, { x: 0.34, y: 0.22 });
}
