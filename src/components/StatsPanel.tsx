import { motion } from "framer-motion";
import { Flame, Sparkles, Trophy, Waves } from "lucide-react";
import type { ReactNode } from "react";
import { getLevelHint } from "../lib/levels";
import type { IncenseState } from "../types/incense";

type StatsPanelProps = {
  state: IncenseState | null;
  isLoading: boolean;
  compact?: boolean;
};

export function StatsPanel({ state, isLoading, compact = false }: StatsPanelProps) {
  const todayCount = state?.todayPrayerCount ?? 0;
  const totalCount = state?.totalPrayerCount ?? 0;
  const muyuCount = state?.muyuCount ?? 0;
  const level = state?.blessingLevel ?? "初燃";

  return (
    <section className="no-drag grid grid-cols-2 gap-2 min-[400px]:grid-cols-4" aria-live="polite">
      <StatItem icon={<Flame size={16} />} label="今日香火" value={isLoading ? "..." : todayCount} compact={compact} />
      <StatItem icon={<Sparkles size={16} />} label="累计功德" value={isLoading ? "..." : totalCount} compact={compact} />
      <StatItem icon={<Waves size={16} />} label="木鱼" value={isLoading ? "..." : muyuCount} compact={compact} />
      <StatItem icon={<Trophy size={16} />} label={level} value={getLevelHint(level)} compact level />
    </section>
  );
}

type StatItemProps = {
  icon: ReactNode;
  label: string;
  value: string | number;
  compact?: boolean;
  level?: boolean;
};

function StatItem({ icon, label, value, compact = false, level = false }: StatItemProps) {
  return (
    <div className={`${compact ? "min-h-[58px] px-2.5 py-2" : "min-h-[66px] px-3 py-2.5"} rounded-lg border border-white/8 bg-white/[0.045] shadow-panel`}>
      <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium text-ember-100/70">
        <span className="text-ember-300">{icon}</span>
        <span className="truncate">{label}</span>
      </div>
      <motion.div
        key={`${label}-${value}`}
        initial={{ y: 6, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 360, damping: 26 }}
        className={
          level
            ? "truncate text-sm font-semibold text-mint-300"
            : compact
              ? "text-lg font-semibold tabular-nums text-white"
              : "text-xl font-semibold tabular-nums text-white"
        }
      >
        {value}
      </motion.div>
    </div>
  );
}
