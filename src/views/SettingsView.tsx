import { Copy, Flame, Hammer, Pin, RotateCcw, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { ToggleRow } from "../components/ToggleRow";
import type { IncenseStore } from "../store/incenseStore";

type SettingsViewProps = {
  store: IncenseStore;
};

export function SettingsView({ store }: SettingsViewProps) {
  const {
    state,
    exportResult,
    error,
    isLoading,
    isSavingSettings,
    updateSettings,
    updateWindowSettings,
    updateVisualSettings,
    resetToday,
    resetAll,
    exportState,
    clearExport
  } = store;
  const disabled = isLoading || isSavingSettings || !state;
  const visualControlsDisabled = isLoading || !state;

  return (
    <main className="app-drag flex h-screen min-h-[520px] w-screen min-w-[380px] flex-col overflow-hidden bg-ink-900 text-ember-50">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#10100f_0%,#18130f_55%,#101515_100%)]" />
      <div className="relative flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 pb-5 pt-8">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-mint-300/75">Cyber Incense</p>
          <h1 className="mt-1 text-2xl font-semibold text-white">设置</h1>
          <p className="mt-1 text-sm text-ember-100/48">仪式表面保持干净，开关和数据操作都放在这里。</p>
        </header>

        <section className="no-drag grid gap-2">
          <div className="rounded-lg border border-white/8 bg-white/[0.04] p-3">
            <div className="mb-2 text-sm font-medium text-ember-50">悬浮物件</div>
            <div className="grid grid-cols-2 gap-2">
              <ObjectButton
                icon={<Flame size={17} />}
                label="香炉"
                active={state?.window.activeObject !== "muyu"}
                disabled={disabled}
                onClick={() => {
                  void updateWindowSettings({ activeObject: "incense" });
                }}
              />
              <ObjectButton
                icon={<Hammer size={17} />}
                label="木鱼"
                active={state?.window.activeObject === "muyu"}
                disabled={disabled}
                onClick={() => {
                  void updateWindowSettings({ activeObject: "muyu" });
                }}
              />
            </div>
          </div>
          <ToggleRow
            label="固定在最前"
            detail="让悬浮香炉保持在普通窗口上方"
            checked={Boolean(state?.window.alwaysOnTop)}
            disabled={disabled}
            onChange={(alwaysOnTop) => {
              void updateWindowSettings({ alwaysOnTop });
            }}
          />
          <ToggleRow
            label="木鱼音"
            detail="默认关闭，无法播放时会安静失败"
            checked={Boolean(state?.settings.soundEnabled)}
            disabled={disabled}
            onChange={(soundEnabled) => {
              void updateSettings({ soundEnabled });
            }}
          />
          <ToggleRow
            label="紧凑模式"
            detail="保留偏好，悬浮表面会优先保持物件式布局"
            checked={Boolean(state?.settings.compactMode)}
            disabled={disabled}
            onChange={(compactMode) => {
              void updateSettings({ compactMode });
            }}
          />
        </section>

        <section className="no-drag rounded-lg border border-white/10 bg-white/[0.045] p-4">
          <h2 className="text-sm font-semibold text-white">视觉节奏</h2>
          <div className="mt-3 grid gap-4">
            <DurationControl
              label="香燃烧"
              valueMs={state?.visuals.incenseBurnDurationMs ?? 90_000}
              minMs={30_000}
              maxMs={600_000}
              stepMs={15_000}
              disabled={visualControlsDisabled}
              onChange={(incenseBurnDurationMs) => {
                void updateVisualSettings({ incenseBurnDurationMs });
              }}
            />
            <DurationControl
              label="敲痕保留"
              valueMs={state?.visuals.muyuTraceDecayMs ?? 120_000}
              minMs={15_000}
              maxMs={300_000}
              stepMs={15_000}
              disabled={visualControlsDisabled}
              onChange={(muyuTraceDecayMs) => {
                void updateVisualSettings({ muyuTraceDecayMs });
              }}
            />
          </div>
        </section>

        <section className="no-drag rounded-lg border border-white/10 bg-white/[0.045] p-4">
          <h2 className="text-sm font-semibold text-white">本地数据</h2>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <DataStat label="今日香火" value={state?.todayPrayerCount ?? 0} />
            <DataStat label="累计功德" value={state?.totalPrayerCount ?? 0} />
            <DataStat label="木鱼" value={state?.muyuCount ?? 0} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <SettingsButton
              icon={<RotateCcw size={15} />}
              label="重置今日"
              disabled={disabled}
              onClick={() => {
                if (window.confirm("重置今日香火？累计功德和木鱼会保留。")) {
                  void resetToday();
                }
              }}
            />
            <SettingsButton
              icon={<Trash2 size={15} />}
              label="重置全部"
              danger
              disabled={disabled}
              onClick={() => {
                if (window.confirm("重置全部本地数据？")) {
                  void resetAll();
                }
              }}
            />
            <SettingsButton
              icon={<Copy size={15} />}
              label="导出"
              disabled={disabled}
              onClick={() => {
                void exportState();
              }}
            />
          </div>
        </section>

        <section className="no-drag rounded-lg border border-white/10 bg-white/[0.045] p-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
            <Pin size={15} className="text-mint-300" />
            窗口状态
          </h2>
          <p className="mt-2 text-sm leading-6 text-ember-100/54">
            当前悬浮香炉{state?.window.alwaysOnTop ? "会固定在最前面。" : "不会强制置顶。"}位置会在移动后尽量保存。
          </p>
        </section>

        {exportResult ? (
          <section className="no-drag rounded-lg border border-mint-300/20 bg-ink-900/72 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="truncate text-xs text-mint-300">JSON generated {formatExportTime(exportResult.exportedAt)}</span>
              <button
                type="button"
                className="rounded-md border border-white/10 px-2 py-1 text-xs text-ember-100/75 hover:text-white"
                onClick={clearExport}
              >
                清除
              </button>
            </div>
            <textarea
              readOnly
              value={exportResult.json}
              className="h-32 w-full resize-none rounded-md border border-white/8 bg-black/20 p-2 font-mono text-[11px] leading-4 text-ember-50 outline-none"
            />
          </section>
        ) : null}

        {error ? <p className="no-drag rounded-lg border border-red-300/25 bg-red-400/10 p-3 text-sm text-red-100">{error}</p> : null}
      </div>
    </main>
  );
}

type DataStatProps = {
  label: string;
  value: number;
};

function DataStat({ label, value }: DataStatProps) {
  return (
    <div className="rounded-lg border border-white/8 bg-black/15 px-2 py-3">
      <div className="text-xl font-semibold tabular-nums text-white">{value}</div>
      <div className="mt-1 truncate text-[11px] text-ember-100/48">{label}</div>
    </div>
  );
}

type DurationControlProps = {
  label: string;
  valueMs: number;
  minMs: number;
  maxMs: number;
  stepMs: number;
  disabled: boolean;
  onChange: (valueMs: number) => void;
};

function DurationControl({ label, valueMs, minMs, maxMs, stepMs, disabled, onChange }: DurationControlProps) {
  return (
    <label className="grid gap-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-ember-100/72">{label}</span>
        <span className="rounded-md border border-white/10 bg-black/18 px-2 py-1 text-[11px] tabular-nums text-mint-300">
          {formatDuration(valueMs)}
        </span>
      </div>
      <input
        type="range"
        min={minMs}
        max={maxMs}
        step={stepMs}
        value={valueMs}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
        className="h-2 w-full accent-mint-300 disabled:opacity-50"
      />
    </label>
  );
}

type ObjectButtonProps = {
  icon: ReactNode;
  label: string;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
};

function ObjectButton({ icon, label, active, disabled, onClick }: ObjectButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex h-12 items-center justify-center gap-2 rounded-lg border text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-mint-300 disabled:cursor-not-allowed disabled:opacity-55 ${
        active
          ? "border-mint-300/45 bg-mint-300/14 text-mint-300"
          : "border-white/10 bg-white/[0.045] text-ember-100/72 hover:border-ember-300/30 hover:text-ember-50"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

type SettingsButtonProps = {
  icon: ReactNode;
  label: string;
  disabled: boolean;
  danger?: boolean;
  onClick: () => void;
};

function SettingsButton({ icon, label, disabled, danger = false, onClick }: SettingsButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex h-11 min-w-0 items-center justify-center gap-1.5 rounded-lg border px-2 text-xs font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-mint-300 disabled:cursor-not-allowed disabled:opacity-55 ${
        danger
          ? "border-red-300/20 bg-red-400/8 text-red-100 hover:border-red-300/35"
          : "border-white/10 bg-white/[0.045] text-ember-50 hover:border-ember-300/30"
      }`}
    >
      {icon}
      <span className="truncate">{label}</span>
    </button>
  );
}

function formatExportTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDuration(valueMs: number): string {
  const seconds = Math.round(valueMs / 1000);
  if (seconds < 60) return `${seconds} 秒`;
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return rest === 0 ? `${minutes} 分钟` : `${minutes} 分 ${rest} 秒`;
}
