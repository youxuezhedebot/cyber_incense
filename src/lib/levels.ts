import type { BlessingLevel } from "../types/incense.js";

export function deriveBlessingLevel(todayPrayerCount: number): BlessingLevel {
  if (todayPrayerCount >= 15) return "功德圆满";
  if (todayPrayerCount >= 7) return "香火鼎盛";
  if (todayPrayerCount >= 3) return "香火渐盛";
  if (todayPrayerCount >= 1) return "稳定";
  return "初燃";
}

export function getLevelHint(level: BlessingLevel): string {
  switch (level) {
    case "功德圆满":
      return "上下文清明";
    case "香火鼎盛":
      return "测试有望";
    case "香火渐盛":
      return "diff 变顺";
    case "稳定":
      return "状态在线";
    case "初燃":
    default:
      return "刚刚点亮";
  }
}
