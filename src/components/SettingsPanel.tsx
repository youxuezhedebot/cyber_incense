import { AnimatePresence, motion } from "framer-motion";
import { Copy, RotateCcw, Trash2, X } from "lucide-react";
import type { ReactNode } from "react";
import type { ExportStateResult, IncenseState, SettingsUpdate } from "../types/incense";
import { IconButton } from "./IconButton";
import { ToggleRow } from "./ToggleRow";

type SettingsPanelProps = {
  open: boolean;
  state: IncenseState | null;
  exportResult: ExportStateResult | null;
  isSaving: boolean;
  onClose: () => void;
  onUpdateSettings: (update: SettingsUpdate) => Promise<void>;
  onResetToday: () => Promise<void>;
  onResetAll: () => Promise<void>;
  onExport: () => Promise<void>;
  onClearExport: () => void;
};

export function SettingsPanel({
  open,
  state,
  exportResult,
  isSaving,
  onClose,
  onUpdateSettings,
  onResetToday,
  onResetAll,
  onExport,
  onClearExport
}: SettingsPanelProps) {
  const settings = state?.settings;

  return (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.section
          className="no-drag rounded-lg border border-white/10 bg-white/[0.055] p-3 shadow-panel"
          initial={{ opacity: 0, height: 0, y: 8 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0, y: 8 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-white">设置</h2>
            <IconButton label="关闭设置" onClick={onClose}>
              <X size={17} />
            </IconButton>
          </div>

          <div className="grid gap-2">
            <ToggleRow
              label="木鱼音"
              detail="默认关闭"
              checked={Boolean(settings?.soundEnabled)}
              disabled={!settings || isSaving}
              onChange={(soundEnabled) => {
                void onUpdateSettings({ soundEnabled });
              }}
            />
            <ToggleRow
              label="紧凑模式"
              detail="更小间距"
              checked={Boolean(settings?.compactMode)}
              disabled={!settings || isSaving}
              onChange={(compactMode) => {
                void onUpdateSettings({ compactMode });
              }}
            />
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <SettingsActionButton
              icon={<RotateCcw size={15} />}
              label="重置今日"
              disabled={isSaving}
              onClick={() => {
                if (window.confirm("重置今日香火？累计功德和木鱼会保留。")) {
                  void onResetToday();
                }
              }}
            />
            <SettingsActionButton
              icon={<Trash2 size={15} />}
              label="重置全部"
              dangerous
              disabled={isSaving}
              onClick={() => {
                if (window.confirm("重置全部本地数据？")) {
                  void onResetAll();
                }
              }}
            />
            <SettingsActionButton
              icon={<Copy size={15} />}
              label="导出 JSON"
              disabled={isSaving}
              onClick={() => {
                void onExport();
              }}
            />
          </div>

          {exportResult ? (
            <div className="mt-3 rounded-lg border border-mint-300/20 bg-ink-900/60 p-2">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="truncate text-xs text-mint-300">exported {formatExportTime(exportResult.exportedAt)}</span>
                <button
                  type="button"
                  className="rounded-md border border-white/10 px-2 py-1 text-xs text-ember-100/75 hover:text-white"
                  onClick={onClearExport}
                >
                  清除
                </button>
              </div>
              <textarea
                readOnly
                value={exportResult.json}
                className="h-24 w-full resize-none rounded-md border border-white/8 bg-black/20 p-2 font-mono text-[11px] leading-4 text-ember-50 outline-none"
              />
            </div>
          ) : null}
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}

type SettingsActionButtonProps = {
  icon: ReactNode;
  label: string;
  disabled: boolean;
  dangerous?: boolean;
  onClick: () => void;
};

function SettingsActionButton({ icon, label, disabled, dangerous = false, onClick }: SettingsActionButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex h-10 min-w-0 items-center justify-center gap-1.5 rounded-lg border px-2 text-xs font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-mint-300 disabled:cursor-not-allowed disabled:opacity-55 ${
        dangerous
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
