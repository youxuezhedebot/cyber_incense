import { AnimatePresence, motion } from "framer-motion";
import { Quote, Settings, Waves } from "lucide-react";
import { getDefaultBlessing } from "../lib/blessings";
import type { FeedbackKind } from "../store/incenseStore";

type BlessingBannerProps = {
  message: string;
  kind: FeedbackKind;
  error: string | null;
  compact?: boolean;
  feedbackId: number;
};

export function BlessingBanner({ message, kind, error, compact = false, feedbackId }: BlessingBannerProps) {
  const text = error ?? message ?? "";
  const tone = error ? "border-red-300/30 text-red-100" : "border-mint-300/25 text-ember-50";
  const Icon = kind === "muyu" ? Waves : kind === "settings" || kind === "export" ? Settings : Quote;

  return (
    <section
      className={`no-drag ${compact ? "min-h-[54px] px-3 py-2" : "min-h-[64px] px-4 py-3"} rounded-lg border bg-white/[0.045] ${tone}`}
      aria-live="polite"
    >
      <AnimatePresence mode="wait">
        {text ? (
          <motion.div
            key={`${feedbackId}-${text}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex h-full items-center gap-3"
          >
            <Icon size={18} className={error ? "text-red-200" : "text-mint-300"} />
            <p className="line-clamp-2 text-sm leading-5">{text}</p>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-full items-center gap-3 text-ember-100/58"
          >
            <Quote size={18} className="text-ember-300/70" />
            <p className="line-clamp-2 text-sm leading-5">{getDefaultBlessing()}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
