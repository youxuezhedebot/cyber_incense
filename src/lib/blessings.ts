import type { IncenseState } from "../types/incense.js";

const INCENSE_BLESSINGS = [
  "愿本轮少幻觉。",
  "愿 diff 干净。",
  "愿测试一次过。",
  "愿类型安静。",
  "愿上下文不丢。",
  "愿依赖别打架。",
  "愿改动不跑偏。",
  "愿构建一路绿。",
  "愿命名都顺手。",
  "愿边界很清楚。",
  "愿 reviewer 点头。",
  "愿回归不冒头。"
];

const MUYU_MESSAGES = [
  "功德 +1",
  "心率稳定，继续开发。",
  "bug 退散一点点。",
  "敲一下，思路归位。",
  "缓存清明，脑内无噪。",
  "需求边界又清楚了。",
  "手稳了，继续。",
  "今天也别乱改文件。"
];

export function pickIncenseBlessing(state: IncenseState): string {
  const index = (state.todayPrayerCount * 3 + state.totalPrayerCount) % INCENSE_BLESSINGS.length;
  return INCENSE_BLESSINGS[index];
}

export function pickMuyuMessage(state: IncenseState): string {
  const index = (state.muyuCount * 5 + state.todayPrayerCount) % MUYU_MESSAGES.length;
  return MUYU_MESSAGES[index];
}

export function getDefaultBlessing(): string {
  return "愿 diff 干净，愿构建成功。";
}
