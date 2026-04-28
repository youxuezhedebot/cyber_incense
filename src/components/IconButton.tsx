import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  children: ReactNode;
  active?: boolean;
};

export function IconButton({ label, children, active = false, className = "", ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border outline-none transition focus-visible:ring-2 focus-visible:ring-mint-300 ${
        active
          ? "border-mint-300/45 bg-mint-300/16 text-mint-300"
          : "border-white/10 bg-white/[0.055] text-ember-100/78 hover:border-ember-300/35 hover:text-ember-50"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
