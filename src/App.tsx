import { getAppView } from "./lib/windowMode";
import { useIncenseStore } from "./store/incenseStore";
import { RitualSurfaceView } from "./views/RitualSurfaceView";
import { SettingsView } from "./views/SettingsView";

export default function App() {
  const store = useIncenseStore();
  const view = getAppView();

  return view === "settings" ? <SettingsView store={store} /> : <RitualSurfaceView store={store} />;
}
