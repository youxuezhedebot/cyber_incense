import { useCallback, useEffect, useRef, useState } from "react";
import type { ExportStateResult, IncenseState, SettingsUpdate, VisualSettingsUpdate, WindowSettingsUpdate } from "../types/incense";
import type { Vec2 } from "../types/ritualSimulation";

export type FeedbackKind = "incense" | "muyu" | "settings" | "export";

export type IncenseStore = {
  state: IncenseState | null;
  feedbackMessage: string;
  feedbackKind: FeedbackKind;
  error: string | null;
  exportResult: ExportStateResult | null;
  isLoading: boolean;
  isOffering: boolean;
  isKnocking: boolean;
  isSavingSettings: boolean;
  pulseId: number;
  muyuPulseId: number;
  feedbackId: number;
  offerIncense: () => Promise<void>;
  knockMuyu: (point?: Vec2) => Promise<void>;
  updateSettings: (update: SettingsUpdate) => Promise<void>;
  updateWindowSettings: (update: WindowSettingsUpdate) => Promise<void>;
  updateVisualSettings: (update: VisualSettingsUpdate) => Promise<void>;
  openSettings: () => Promise<void>;
  resetToday: () => Promise<void>;
  resetAll: () => Promise<void>;
  exportState: () => Promise<void>;
  clearExport: () => void;
};

export function useIncenseStore(): IncenseStore {
  const [state, setState] = useState<IncenseState | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackKind, setFeedbackKind] = useState<FeedbackKind>("incense");
  const [error, setError] = useState<string | null>(null);
  const [exportResult, setExportResult] = useState<ExportStateResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingOffers, setPendingOffers] = useState(0);
  const [pendingMuyu, setPendingMuyu] = useState(0);
  const [pendingSettings, setPendingSettings] = useState(0);
  const [pulseId, setPulseId] = useState(0);
  const [muyuPulseId, setMuyuPulseId] = useState(0);
  const [feedbackId, setFeedbackId] = useState(0);
  const stateRef = useRef<IncenseState | null>(null);

  const setCurrentState = useCallback((nextState: IncenseState) => {
    stateRef.current = nextState;
    setState(nextState);
  }, []);

  useEffect(() => {
    let mounted = true;

    window.cyberIncense
      .getState()
      .then((nextState) => {
        if (!mounted) return;
        setCurrentState(nextState);
        setError(null);
      })
      .catch(() => {
        if (mounted) setError("本地香火状态暂时不可读");
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    const unsubscribe = window.cyberIncense.onStateChanged((nextState) => {
      const previous = stateRef.current;
      if (previous && nextState.todayPrayerCount > previous.todayPrayerCount) {
        setPulseId((current) => current + 1);
      }
      if (previous && nextState.muyuCount > previous.muyuCount) {
        setMuyuPulseId((current) => current + 1);
      }
      setCurrentState(nextState);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [setCurrentState]);

  const offerIncense = useCallback(async () => {
    setPendingOffers((current) => current + 1);
    setError(null);

    try {
      const result = await window.cyberIncense.offerIncense();
      setCurrentState(result.state);
      setFeedbackMessage(result.blessing);
      setFeedbackKind("incense");
      setPulseId((current) => current + 1);
      setFeedbackId((current) => current + 1);
    } catch {
      setError("这炷香没递上去，再点一次试试");
    } finally {
      setPendingOffers((current) => Math.max(0, current - 1));
    }
  }, [setCurrentState]);

  const knockMuyu = useCallback(async (point?: Vec2) => {
    setPendingMuyu((current) => current + 1);
    setError(null);

    try {
      const result = await window.cyberIncense.knockMuyu(point);
      setCurrentState(result.state);
      setFeedbackMessage(result.message);
      setFeedbackKind("muyu");
      setMuyuPulseId((current) => current + 1);
      setFeedbackId((current) => current + 1);
    } catch {
      setError("木鱼没敲响，再试一次");
    } finally {
      setPendingMuyu((current) => Math.max(0, current - 1));
    }
  }, [setCurrentState]);

  const updateSettings = useCallback(async (update: SettingsUpdate) => {
    setPendingSettings((current) => current + 1);
    setError(null);

    try {
      const nextState = await window.cyberIncense.updateSettings(update);
      setCurrentState(nextState);
      setFeedbackMessage("设置已保存。");
      setFeedbackKind("settings");
      setFeedbackId((current) => current + 1);
    } catch {
      setError("设置暂时保存失败");
    } finally {
      setPendingSettings((current) => Math.max(0, current - 1));
    }
  }, [setCurrentState]);

  const updateWindowSettings = useCallback(async (update: WindowSettingsUpdate) => {
    setPendingSettings((current) => current + 1);
    setError(null);

    try {
      const nextState = await window.cyberIncense.updateWindowSettings(update);
      setCurrentState(nextState);
      if (update.activeObject) {
        setFeedbackMessage(update.activeObject === "muyu" ? "已切换到木鱼。" : "已切换到香炉。");
      } else {
        setFeedbackMessage(nextState.window.alwaysOnTop ? "香炉已固定在最前。" : "香炉已取消置顶。");
      }
      setFeedbackKind("settings");
      setFeedbackId((current) => current + 1);
    } catch {
      setError("窗口设置暂时保存失败");
    } finally {
      setPendingSettings((current) => Math.max(0, current - 1));
    }
  }, [setCurrentState]);

  const updateVisualSettings = useCallback(async (update: VisualSettingsUpdate) => {
    setPendingSettings((current) => current + 1);
    setError(null);

    try {
      const nextState = await window.cyberIncense.updateVisualSettings(update);
      setCurrentState(nextState);
      setFeedbackMessage("视觉节奏已保存。");
      setFeedbackKind("settings");
      setFeedbackId((current) => current + 1);
    } catch {
      setError("视觉设置暂时保存失败");
    } finally {
      setPendingSettings((current) => Math.max(0, current - 1));
    }
  }, [setCurrentState]);

  const openSettings = useCallback(async () => {
    try {
      await window.cyberIncense.openSettings();
    } catch {
      setError("设置窗口暂时打不开");
    }
  }, []);

  const resetToday = useCallback(async () => {
    setPendingSettings((current) => current + 1);
    setError(null);

    try {
      const nextState = await window.cyberIncense.resetToday();
      setCurrentState(nextState);
      setFeedbackMessage("今日香火已清零。");
      setFeedbackKind("settings");
      setFeedbackId((current) => current + 1);
    } catch {
      setError("今日计数暂时无法重置");
    } finally {
      setPendingSettings((current) => Math.max(0, current - 1));
    }
  }, [setCurrentState]);

  const resetAll = useCallback(async () => {
    setPendingSettings((current) => current + 1);
    setError(null);

    try {
      const nextState = await window.cyberIncense.resetAll();
      setCurrentState(nextState);
      setExportResult(null);
      setFeedbackMessage("本地数据已重置。");
      setFeedbackKind("settings");
      setPulseId((current) => current + 1);
      setMuyuPulseId((current) => current + 1);
      setFeedbackId((current) => current + 1);
    } catch {
      setError("本地数据暂时无法重置");
    } finally {
      setPendingSettings((current) => Math.max(0, current - 1));
    }
  }, [setCurrentState]);

  const exportCurrentState = useCallback(async () => {
    setPendingSettings((current) => current + 1);
    setError(null);

    try {
      const result = await window.cyberIncense.exportState();
      JSON.parse(result.json);
      setExportResult(result);
      setFeedbackMessage("JSON 已生成。");
      setFeedbackKind("export");
      setFeedbackId((current) => current + 1);
    } catch {
      setError("导出 JSON 暂时失败");
    } finally {
      setPendingSettings((current) => Math.max(0, current - 1));
    }
  }, []);

  return {
    state,
    feedbackMessage,
    feedbackKind,
    error,
    exportResult,
    isLoading,
    isOffering: pendingOffers > 0,
    isKnocking: pendingMuyu > 0,
    isSavingSettings: pendingSettings > 0,
    pulseId,
    muyuPulseId,
    feedbackId,
    offerIncense,
    knockMuyu,
    updateSettings,
    updateWindowSettings,
    updateVisualSettings,
    openSettings,
    resetToday,
    resetAll,
    exportState: exportCurrentState,
    clearExport: () => setExportResult(null)
  };
}
