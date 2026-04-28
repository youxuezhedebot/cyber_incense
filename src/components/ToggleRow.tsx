type ToggleRowProps = {
  label: string;
  detail: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
};

export function ToggleRow({ label, detail, checked, disabled = false, onChange }: ToggleRowProps) {
  return (
    <label className="flex min-h-[52px] items-center justify-between gap-3 rounded-lg border border-white/8 bg-white/[0.04] px-3 py-2">
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-ember-50">{label}</span>
        <span className="block truncate text-xs text-ember-100/50">{detail}</span>
      </span>
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="relative h-7 w-12 shrink-0 rounded-full border border-white/10 bg-ink-700 transition peer-checked:border-mint-300/50 peer-checked:bg-mint-500/30 peer-checked:[&>span]:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-mint-300 peer-disabled:opacity-60">
        <span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-ember-100 shadow-sm transition" />
      </span>
    </label>
  );
}
