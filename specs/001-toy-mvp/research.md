# Research: Cyber Incense Toy MVP

## Decision 1: Use Electron for the desktop tray app

**Decision**: Build the MVP as an Electron desktop app.

**Rationale**: The core product promise is a tray/menu-bar resident toy with local file access. Electron provides native tray behavior, app lifecycle control, filesystem access, and a React-friendly renderer in one stack.

**Alternatives considered**:

- Browser-only app: rejected because it cannot provide native tray behavior or local hook-ready filesystem access.
- Tauri: viable later, but Electron is faster for this MVP and has straightforward tray/window APIs.
- Native Swift/macOS app: good macOS fit, but does not match the planned cross-platform target.

## Decision 2: Use React + Vite + TypeScript for the renderer

**Decision**: Use React with Vite and TypeScript.

**Rationale**: The UI needs quick iteration, componentized motion, and typed IPC contracts. Vite keeps development fast, React fits the component tree, and TypeScript reduces mistakes across main/preload/renderer boundaries.

**Alternatives considered**:

- Plain HTML/CSS/JS: rejected because stateful animated UI will grow quickly.
- Vue/Svelte: viable, but the project roadmap already standardizes on React.

## Decision 3: Use Tailwind CSS and Framer Motion for visual polish

**Decision**: Use Tailwind CSS for styling and Framer Motion for click/glow/smoke transitions.

**Rationale**: The app should feel like a polished toy, not a settings panel. Tailwind supports fast visual iteration, and Framer Motion gives controlled micro-interactions without custom animation plumbing.

**Alternatives considered**:

- CSS-only animation: acceptable for simple smoke, but harder to coordinate action-triggered pulses.
- Canvas particle system: deferred because it is richer than the MVP needs.

## Decision 4: Store local state as JSON owned by the Electron main process

**Decision**: Store state in `~/.cyber-incense/state.json`, read and written by Electron main process helpers.

**Rationale**: Local JSON is transparent, portable, and enough for single-user ritual counters. Keeping writes in the main process avoids giving the renderer direct filesystem access.

**Alternatives considered**:

- Browser localStorage: rejected because future hooks need a stable file outside the renderer sandbox.
- SQLite: rejected as overbuilt for a tiny state object.
- electron-store: viable, but a small explicit JSON helper keeps the state path and recovery behavior obvious.

## Decision 5: Use SVG for the first incense scene

**Decision**: Build the burner, sticks, and smoke as React/SVG elements with CSS and Framer Motion animation.

**Rationale**: SVG is lightweight, inspectable, and easy to scale in a compact window. It supports the abstract non-religious visual direction without needing external images.

**Alternatives considered**:

- Canvas: deferred until a later smoke/particle polish pass.
- Raster illustration: less flexible for state-driven lit/unlit sticks.

## Decision 6: Do not touch Codex configuration

**Decision**: Spec 001 must not create hook files or modify any Codex configuration.

**Rationale**: The roadmap explicitly prioritizes the toy loop before hook integration. This keeps the first deliverable harmless and easy to validate.

**Alternatives considered**:

- Stub hook files: rejected because even inert hook structure invites premature integration work.
