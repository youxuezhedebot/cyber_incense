# Feature Specification: Floating Ritual Surface

**Feature Branch**: `004-floating-ritual-surface`  
**Created**: 2026-04-27  
**Status**: Draft  
**Input**: User description: "The incense burner should be floating, optionally pinned above other windows. Settings must be separated from the current ritual page. Counts should be represented by drawn incense and ash instead of plain numbers. The burner should be more refined: default empty, clicking animates lighting and placing incense, incense burns out, and ash changes. Wooden fish should use its own visual language with count shown through visual changes, click-to-knock, +1 float, and strike effects. Optimize carefully."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Use a Floating Ritual Object (Priority: P1)

The user opens Cyber Incense and sees a compact floating ritual object instead of a dashboard-like panel. The object can stay above other windows when the user enables pinning.

**Why this priority**: The product should feel like a desktop toy or object, not an app settings window. Floating behavior is the foundation for that experience.

**Independent Test**: Launch the app, open the ritual surface from tray, toggle "always on top" from settings, and verify the ritual surface remains above normal windows until the setting is disabled.

**Acceptance Scenarios**:

1. **Given** the app is running, **When** the user opens the tray item, **Then** a compact floating ritual surface appears.
2. **Given** the ritual surface is visible, **When** the user enables "fixed on top", **Then** the ritual surface remains above other normal windows.
3. **Given** "fixed on top" is disabled, **When** the user focuses another normal window, **Then** the ritual surface no longer forces itself above that window.
4. **Given** the ritual surface is closed, **When** the user opens it again from tray, **Then** the app keeps running and restores the latest local visual state.

---

### User Story 2 - Offer Incense as a Visual Cycle (Priority: P1)

The user clicks "上香" and sees a new incense stick appear through a clear animated sequence: ignite, place into the burner, burn down, and become ash. Today's count is primarily communicated through visible incense/ash marks rather than a plain numeric counter.

**Why this priority**: The current app counts actions but does not make the ritual object feel materially changed. The core improvement is to make each offering leave a visible trace.

**Independent Test**: Start with fresh state, verify the burner has no incense, click "上香", watch the stick ignite and burn, and verify the ash/visual count changes after the burn completes.

**Acceptance Scenarios**:

1. **Given** today's incense count is zero, **When** the ritual surface opens, **Then** the burner shows no incense sticks.
2. **Given** the burner is empty, **When** the user clicks "上香", **Then** an incense stick is animated into the burner and ignited.
3. **Given** an incense stick is active, **When** the burn animation progresses, **Then** the stick visibly shortens or dims over time.
4. **Given** a burn completes, **When** the animation settles, **Then** the ash representation changes to show the completed offering.
5. **Given** the user performs several offerings, **When** the surface is inspected, **Then** the primary count signal is visible incense/ash/tally drawing, not a large numeric stats panel.

---

### User Story 3 - Use a Separate Settings Window (Priority: P1)

The user opens settings in a separate surface so the ritual object stays focused and uncluttered.

**Why this priority**: Settings inside the ritual surface break the toy illusion. Configuration belongs in a separate view.

**Independent Test**: Open settings from tray or ritual controls and verify a separate settings surface appears while the ritual surface remains visually distinct.

**Acceptance Scenarios**:

1. **Given** the ritual surface is visible, **When** the user opens settings, **Then** settings appear in a separate window or separate full settings view.
2. **Given** settings are open, **When** the user toggles fixed-on-top, compact behavior, or sound, **Then** changes apply to the ritual surface without embedding settings controls into the ritual object.
3. **Given** settings are closed, **When** the ritual surface is inspected, **Then** reset/export/toggle controls are not shown inside the main ritual object.

---

### User Story 4 - Knock a Distinct Wooden Fish Object (Priority: P2)

The user clicks the wooden fish and sees a visual knock response with a floating `+1`, strike/ripple effect, and a visual count representation that is stylistically separate from the incense burner.

**Why this priority**: Wooden fish should feel like a second ritual object, not a duplicate button. It can reuse the same persistence logic, but it needs a different material style and feedback language.

**Independent Test**: Click the wooden fish several times and verify the count is represented by visible marks/changes, the `+1` float appears, and the knock effect is immediate.

**Acceptance Scenarios**:

1. **Given** the wooden fish is visible, **When** the user clicks it, **Then** `muyuCount` increases by one.
2. **Given** the wooden fish is clicked, **When** feedback appears, **Then** a floating `+1` and a short strike/ripple effect are visible.
3. **Given** the wooden fish has been clicked several times, **When** the surface is inspected, **Then** visual marks or material changes communicate the count without copying the incense/ash style.
4. **Given** the app restarts, **When** the ritual surface opens, **Then** wooden fish visual count state is restored from local state.

---

### User Story 5 - Keep the Floating Toy Lightweight (Priority: P2)

The user can leave the floating ritual surface open while working without it causing jank, high CPU, or distracting layout shifts.

**Why this priority**: A pinned desktop toy must be pleasant over long sessions. Beautiful animation is only successful if it stays light and unobtrusive.

**Independent Test**: Leave the ritual surface open, perform repeated incense and wooden fish actions, and verify animation remains smooth with stable layout and no runaway CPU usage.

**Acceptance Scenarios**:

1. **Given** the ritual surface is idle, **When** no ritual action is running, **Then** animations are subtle or paused enough to avoid unnecessary load.
2. **Given** the user performs rapid ritual actions, **When** multiple animations overlap, **Then** counts remain correct and layout remains stable.
3. **Given** many offerings or knocks have accumulated, **When** the surface renders, **Then** visual marks are capped, grouped, or virtualized enough to remain readable and performant.

### Edge Cases

- The user toggles always-on-top while the ritual surface is hidden.
- The user opens settings while the ritual surface is pinned.
- The user clicks "上香" rapidly while previous sticks are still burning.
- The user quits while an incense stick is mid-burn.
- The app restarts after several completed incense burns.
- Today's count is very high and cannot be represented as one object per count.
- The user alternates incense and wooden fish actions rapidly.
- Sound is enabled but audio playback is unavailable.
- The app is at the minimum supported floating size.
- The local state was created by Spec 001 or Spec 002 and lacks new visual/window settings.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST present the main ritual experience as a compact floating ritual surface.
- **FR-002**: The system MUST allow the user to enable or disable fixed-on-top behavior for the ritual surface.
- **FR-003**: The system MUST persist fixed-on-top preference locally.
- **FR-004**: The system MUST separate settings from the main ritual surface.
- **FR-005**: The system MUST keep settings controls such as reset/export/toggles out of the main ritual object.
- **FR-006**: The system MUST show no incense sticks in the burner when today's incense count is zero.
- **FR-007**: The system MUST animate a new incense offering through ignition and placement into the burner.
- **FR-008**: The system MUST visually show incense burn progress after placement.
- **FR-009**: The system MUST visually convert a completed incense burn into ash or an equivalent completed-offering mark.
- **FR-010**: The system MUST use drawn incense/ash/tally visuals as the primary representation of incense count.
- **FR-011**: The system MUST keep numeric counts secondary, small, hidden, or settings-only rather than the dominant main-surface UI.
- **FR-012**: The system MUST preserve count correctness during rapid repeated actions.
- **FR-013**: The system MUST restore visual count state after app restart.
- **FR-014**: The system MUST provide a visually distinct wooden fish object.
- **FR-015**: The system MUST animate a wooden fish strike effect and floating `+1` after a successful knock.
- **FR-016**: The system MUST represent wooden fish count through visual changes that are stylistically separate from incense/ash.
- **FR-017**: The system MUST cap or aggregate visual count marks so high counts remain readable and performant.
- **FR-018**: The system MUST avoid real religious iconography, deities, scripture, or claims of actual worship.
- **FR-019**: The system MUST NOT install, enable, disable, or modify any Codex hook or Codex configuration in this feature.

### Key Entities

- **Floating Ritual Surface**: The compact primary desktop object containing the burner, incense action, and wooden fish object.
- **Settings Surface**: A separate configuration view for pinning, sound, compact behavior, reset, export, and later integrations.
- **Incense Visual Cycle**: The animated lifecycle of one offering: spawn, ignite, place, burn, complete, ash.
- **Ash Representation**: The visual trace of completed incense offerings.
- **Visual Count Aggregation**: Rules that translate high counts into readable grouped marks instead of rendering unbounded objects.
- **Wooden Fish Visual State**: Visual marks, glow, dents, ripples, or ring state derived from wooden fish count.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can enable fixed-on-top and verify the ritual surface stays above normal windows.
- **SC-002**: A user can disable fixed-on-top and verify normal window focus behavior returns.
- **SC-003**: With zero daily offerings, the burner opens with no incense sticks.
- **SC-004**: A user can click "上香" and see ignition/placement feedback within 300 ms.
- **SC-005**: A completed incense burn visibly changes ash or completed-offering marks within the configured burn duration.
- **SC-006**: A user can perform 10 rapid incense actions and final persisted counts are correct.
- **SC-007**: Settings are accessible without occupying the main ritual surface.
- **SC-008**: A wooden fish click shows `+1` and strike feedback within 300 ms.
- **SC-009**: The surface remains readable at minimum floating size and with high counts.
- **SC-010**: No Cyber Incense hook files or Codex configuration entries are created or modified.

## Assumptions

- Specs 001 and 002 have established local state, tray behavior, incense and wooden fish counters, sound setting, reset, and export.
- The floating ritual surface can still be opened from the tray.
- "Fixed on top" is a local window preference and not a launch-at-login or packaging feature.
- Incense burn duration may be shorter than real time so the toy feels responsive.
- The main surface may keep small secondary labels for clarity/accessibility, but the dominant count representation is visual.
