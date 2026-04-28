import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { WoodenFish } from "./WoodenFish";

type RitualActionsProps = {
  disabled: boolean;
  isOffering: boolean;
  isKnocking: boolean;
  soundEnabled: boolean;
  muyuPulseId: number;
  onOffer: () => void;
  onKnockMuyu: () => void;
};

export function RitualActions({
  disabled,
  isOffering,
  isKnocking,
  soundEnabled,
  muyuPulseId,
  onOffer,
  onKnockMuyu
}: RitualActionsProps) {
  return (
    <section className="no-drag flex gap-2">
      <motion.button
        type="button"
        whileTap={{ scale: 0.965, y: 1 }}
        whileHover={{ y: -1 }}
        disabled={disabled}
        onClick={onOffer}
        className="flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-lg border border-ember-300/45 bg-ember-500 px-3 text-sm font-semibold text-ink-900 shadow-ember outline-none transition hover:bg-ember-300 focus-visible:ring-2 focus-visible:ring-mint-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Flame size={19} strokeWidth={2.4} />
        <span className="truncate">{isOffering ? "香火传递中" : "上香"}</span>
      </motion.button>
      <WoodenFish
        disabled={disabled}
        isKnocking={isKnocking}
        soundEnabled={soundEnabled}
        pulseId={muyuPulseId}
        onKnock={onKnockMuyu}
      />
    </section>
  );
}
