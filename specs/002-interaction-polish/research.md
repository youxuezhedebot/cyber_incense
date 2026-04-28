# Research: Cyber Incense Interaction Polish

## Decision 1: Keep smoke and glow in SVG/CSS/Framer Motion

**Decision**: Refine the existing SVG/CSS/Framer Motion scene instead of moving to Canvas.

**Rationale**: The polish feature needs smoother feedback and stable layout, not a full particle engine. Staying with the MVP scene avoids a broad rewrite and keeps the app easier to inspect and tune.

**Alternatives considered**:

- Canvas smoke: visually richer, but harder to make accessible and maintain in a compact app.
- Raster smoke assets: less state-driven and more likely to look blurry across scales.

## Decision 2: Add wooden fish as an abstract UI ritual

**Decision**: Implement "敲木鱼" as an abstract playful control and visual, not realistic religious imagery.

**Rationale**: The feature adds a second ritual while preserving the non-religious toy stance. Abstract shape/icon treatment keeps the tone humorous.

**Alternatives considered**:

- Realistic wooden fish illustration: rejected because it edges toward real ritual iconography.
- Text-only button: rejected because the toy needs tactile visual feedback.

## Decision 3: Sound is opt-in and non-blocking

**Decision**: Keep sound disabled by default and let audio failures silently degrade.

**Rationale**: A tray app can be used at work or in shared spaces. Sound surprise would be annoying, and audio availability should not affect the ritual loop.

**Alternatives considered**:

- Sound enabled by default: rejected for user comfort.
- No sound support: simpler, but the roadmap explicitly includes optional sound.

## Decision 4: Settings remain compact and local

**Decision**: Add a compact in-window settings panel for sound, compact mode, reset, and export.

**Rationale**: The app should still feel like a toy, not a preferences utility. A small panel keeps controls available without becoming the main experience.

**Alternatives considered**:

- Separate settings window: rejected as too heavy for this small app.
- Tray-only settings: less discoverable and harder to confirm destructive actions.

## Decision 5: Export state as JSON through the main process

**Decision**: Use the Electron main process to produce/export current state JSON.

**Rationale**: The main process owns local files and dialogs, so export should not give the renderer direct filesystem write access.

**Alternatives considered**:

- Renderer-created download: not a good fit for a desktop tray app.
- Copy-only export: acceptable fallback, but file export is more useful.

## Decision 6: Keep hooks as disabled placeholder only

**Decision**: If hook status appears in settings, show it only as a future placeholder without install/enable actions.

**Rationale**: Spec 002 must not touch Codex configuration. Keeping the placeholder passive prevents accidental scope bleed.

**Alternatives considered**:

- Add a disabled toggle that looks interactive: rejected because it may confuse the user.
