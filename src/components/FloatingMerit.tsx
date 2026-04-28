import { AnimatePresence, motion } from "framer-motion";

type FloatingMeritProps = {
  id: number;
  label: string;
};

export function FloatingMerit({ id, label }: FloatingMeritProps) {
  return (
    <AnimatePresence>
      {id > 0 ? (
        <motion.span
          key={id}
          className="pointer-events-none absolute -top-8 right-1 rounded-full border border-mint-300/40 bg-mint-300/15 px-2.5 py-1 text-xs font-semibold text-mint-300 shadow-panel"
          initial={{ opacity: 0, y: 8, scale: 0.86 }}
          animate={{ opacity: [0, 1, 1, 0], y: [-2, -18, -28, -34], scale: [0.86, 1, 1, 0.96] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        >
          {label}
        </motion.span>
      ) : null}
    </AnimatePresence>
  );
}
