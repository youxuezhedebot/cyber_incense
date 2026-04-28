import { motion } from "framer-motion";
import { Drum } from "lucide-react";
import { useEffect } from "react";
import { FloatingMerit } from "./FloatingMerit";

type WoodenFishProps = {
  disabled: boolean;
  isKnocking: boolean;
  soundEnabled: boolean;
  pulseId: number;
  onKnock: () => void;
};

export function WoodenFish({ disabled, isKnocking, soundEnabled, pulseId, onKnock }: WoodenFishProps) {
  useEffect(() => {
    if (!soundEnabled || pulseId === 0) return;
    playSoftKnock();
  }, [pulseId, soundEnabled]);

  return (
    <div className="relative min-w-0 flex-1">
      <motion.button
        type="button"
        whileTap={{ scale: 0.965, y: 1 }}
        whileHover={{ y: -1 }}
        disabled={disabled}
        onClick={onKnock}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-mint-300/28 bg-white/[0.055] px-3 text-sm font-semibold text-ember-50 outline-none transition hover:border-mint-300/45 hover:bg-mint-300/10 focus-visible:ring-2 focus-visible:ring-mint-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <motion.span
          key={pulseId}
          initial={{ rotate: 0, scale: 1 }}
          animate={pulseId > 0 ? { rotate: [0, -9, 8, 0], scale: [1, 1.12, 0.98, 1] } : {}}
          transition={{ duration: 0.42, ease: "easeOut" }}
          className="relative flex h-7 w-8 items-center justify-center"
          aria-hidden="true"
        >
          <span className="absolute h-5 w-8 rounded-[50%] border border-ember-300/35 bg-[#7f4b2e]" />
          <span className="absolute h-1.5 w-5 rounded-full bg-ink-900/60" />
          <Drum size={15} className="relative text-ember-100/70" />
        </motion.span>
        <span className="truncate">{isKnocking ? "回响中" : "敲木鱼"}</span>
      </motion.button>
      <FloatingMerit id={pulseId} label="功德 +1" />
    </div>
  );
}

function playSoftKnock(): void {
  try {
    const AudioContextClass = window.AudioContext ?? window.webkitAudioContext;
    if (!AudioContextClass) return;

    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const filter = context.createBiquadFilter();
    const now = context.currentTime;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(176, now);
    oscillator.frequency.exponentialRampToValueAtTime(96, now + 0.12);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(520, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.2);
    oscillator.addEventListener("ended", () => {
      void context.close();
    });
  } catch {
    // Decorative audio should never block the ritual action.
  }
}
