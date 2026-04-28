import {
  createIncenseHistoryEvent,
  createMuyuTraceHistoryEvent,
  createRitualEngine
} from "../dist-electron/src/lib/ritualEngine.js";

const now = Date.now();
const incense = createIncenseHistoryEvent(0, now);
const hit = createMuyuTraceHistoryEvent({ x: 0.48, y: 0.5 }, 0, now);

const appState = {
  version: 1,
  today: "2026-04-28",
  todayPrayerCount: 1,
  totalPrayerCount: 1,
  muyuCount: 1,
  lastPrayerAt: new Date(now).toISOString(),
  lastMuyuAt: new Date(now).toISOString(),
  blessingLevel: "初燃",
  codexHook: { enabled: false, installedAt: null, lastCheckedAt: null },
  settings: { soundEnabled: false, launchAtLogin: false, theme: "dark", compactMode: false },
  window: { alwaysOnTop: false, activeObject: "incense", ritualSurfacePosition: { x: null, y: null } },
  visuals: {
    incenseBurnDurationMs: 90000,
    muyuTraceDecayMs: 120000,
    maxActiveIncense: 3,
    maxVisibleAshMarks: 18,
    maxVisibleMuyuMarks: 16
  },
  ritual: {
    totalOffered: 1,
    incenseHistory: [incense],
    muyuHitCount: 1,
    muyuTraceHistory: [hit]
  }
};

const engine = createRitualEngine({ now, appState });
engine.update(0.016, now + 500);
const snapshot = engine.getSnapshot();

const result = {
  activeSticks: snapshot.burner.activeSticks.length,
  burnProgress: Number(snapshot.burner.activeSticks[0]?.burnProgress.toFixed(3)),
  traces: snapshot.muyu.traces.length,
  traceStrength: Number(snapshot.muyu.traces[0]?.strength.toFixed(3)),
  positionsStable: checkIncensePositionStability(now),
  truncatedHistoryStable: checkTruncatedHistoryStability(now)
};

if (
  result.activeSticks !== 1 ||
  result.burnProgress <= 0 ||
  result.traces !== 1 ||
  result.traceStrength <= 0 ||
  !result.positionsStable ||
  !result.truncatedHistoryStable
) {
  console.error(JSON.stringify(result, null, 2));
  process.exit(1);
}

function checkTruncatedHistoryStability(now) {
  let history = [];

  for (let index = 0; index < 160; index += 1) {
    history.push(createIncenseHistoryEvent(index, now - (200000 - index * 500), history));
  }

  const nextEvent = createIncenseHistoryEvent(160, now - 500, history);
  const base = {
    ...appState,
    todayPrayerCount: 160,
    totalPrayerCount: 160,
    ritual: {
      totalOffered: 160,
      incenseHistory: history,
      muyuHitCount: 1,
      muyuTraceHistory: [hit]
    }
  };
  const next = {
    ...base,
    todayPrayerCount: 161,
    totalPrayerCount: 161,
    ritual: {
      ...base.ritual,
      totalOffered: 161,
      incenseHistory: [...history.slice(1), nextEvent]
    }
  };
  const before = createRitualEngine({ now, appState: base }).getSnapshot();
  const after = createRitualEngine({ now, appState: next }).getSnapshot();
  const beforeById = new Map(before.burner.activeSticks.concat(before.burner.burnedStubs).map((stick) => [stick.id, stick]));
  const afterById = new Map(after.burner.activeSticks.concat(after.burner.burnedStubs).map((stick) => [stick.id, stick]));

  return history.slice(1, 40).every((event) => {
    const a = beforeById.get(event.id);
    const b = afterById.get(event.id);
    return Boolean(a && b && Math.abs(a.x - b.x) < 0.000001 && Math.abs(a.y - b.y) < 0.000001);
  });
}

console.log(JSON.stringify(result, null, 2));

function checkIncensePositionStability(now) {
  const first = createIncenseHistoryEvent(0, now - 1000);
  const second = createIncenseHistoryEvent(1, now - 800, [first]);
  const third = createIncenseHistoryEvent(2, now - 500, [first, second]);
  const base = {
    ...appState,
    todayPrayerCount: 10,
    totalPrayerCount: 10,
    ritual: {
      totalOffered: 10,
      incenseHistory: [first, second],
      muyuHitCount: 1,
      muyuTraceHistory: [hit]
    }
  };
  const next = {
    ...base,
    todayPrayerCount: 11,
    totalPrayerCount: 11,
    ritual: {
      ...base.ritual,
      totalOffered: 11,
      incenseHistory: [first, second, third]
    }
  };
  const before = createRitualEngine({ now, appState: base }).getSnapshot();
  const after = createRitualEngine({ now, appState: next }).getSnapshot();
  const beforeById = new Map(before.burner.activeSticks.map((stick) => [stick.id, stick]));
  const afterById = new Map(after.burner.activeSticks.map((stick) => [stick.id, stick]));

  return [first.id, second.id].every((id) => {
    const a = beforeById.get(id);
    const b = afterById.get(id);
    return Boolean(a && b && Math.abs(a.x - b.x) < 0.000001 && Math.abs(a.y - b.y) < 0.000001);
  });
}
