import { AnimatePresence, motion } from "framer-motion";

type KnockEffectProps = {
  pulseId: number;
};

export function KnockEffect({ pulseId }: KnockEffectProps) {
  return (
    <AnimatePresence>
      {pulseId > 0 ? (
        <motion.div
          key={pulseId}
          className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-64 -translate-x-1/2 -translate-y-1/2 rounded-[52%] border border-mint-300/50"
          initial={{ opacity: 0.7, scale: 0.72 }}
          animate={{ opacity: 0, scale: 1.25 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        />
      ) : null}
    </AnimatePresence>
  );
}
