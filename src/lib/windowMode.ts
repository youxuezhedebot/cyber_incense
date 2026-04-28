export type AppView = "ritual" | "settings";

export function getAppView(search = window.location.search): AppView {
  const params = new URLSearchParams(search);
  return params.get("view") === "settings" ? "settings" : "ritual";
}
