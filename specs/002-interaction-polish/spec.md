# Feature Specification: Cyber Incense Interaction Polish

**Feature Branch**: `002-interaction-polish`  
**Created**: 2026-04-27  
**Status**: Draft  
**Input**: User description: "After the toy MVP works, improve the interaction quality: refined smoke/glow motion, satisfying click feedback, wooden fish ritual, optional sound, settings controls, reset/export, better blessing copy, and tray polish. Do not implement hook installation in this feature."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Enjoy a More Satisfying Incense Action (Priority: P1)

The user clicks "上香" repeatedly and the app responds with smooth, polished, non-disruptive feedback that makes the tiny ritual feel delightful.

**Why this priority**: The product value depends on repeated micro-interactions feeling good rather than merely functional.

**Independent Test**: Use only the existing "上香" flow and verify that the updated visual feedback is smooth, readable, and stable during repeated clicks.

**Acceptance Scenarios**:

1. **Given** the ritual window is open, **When** the user clicks "上香", **Then** the visual response feels immediate and polished.
2. **Given** the user clicks "上香" multiple times quickly, **When** animations overlap, **Then** counts remain correct and the layout remains stable.
3. **Given** the app is shown at its minimum supported window size, **When** the user clicks "上香", **Then** text and controls remain readable without overlap.

---

### User Story 2 - Knock the Wooden Fish (Priority: P1)

The user clicks "敲木鱼" as a second playful ritual and sees the wooden fish count and merit feedback update immediately.

**Why this priority**: A second ritual makes the toy more replayable and gives the app a distinct personality beyond one button.

**Independent Test**: Click "敲木鱼" once and verify that the count, feedback text, and visual response update independently of the incense action.

**Acceptance Scenarios**:

1. **Given** the ritual window is open, **When** the user clicks "敲木鱼", **Then** the wooden fish count increases by one.
2. **Given** the user clicks "敲木鱼", **When** the action completes, **Then** a small merit or calming feedback message appears.
3. **Given** the app is restarted, **When** the user opens the ritual window, **Then** the wooden fish count is preserved.

---

### User Story 3 - Control Sound and Settings (Priority: P2)

The user opens settings to control sound, compact behavior, reset counts, reset all data, and export local state.

**Why this priority**: Settings make the toy comfortable for daily use while keeping sound and destructive actions under user control.

**Independent Test**: Open settings, toggle sound, reset today's count, and export state without using hook features.

**Acceptance Scenarios**:

1. **Given** sound is disabled by default, **When** the user knocks the wooden fish, **Then** no sound plays.
2. **Given** the user enables sound, **When** the user knocks the wooden fish, **Then** a short soft sound may play.
3. **Given** the user chooses to reset today's count, **When** the user confirms, **Then** today's incense count resets while total merit remains.
4. **Given** the user chooses to reset all data, **When** the user confirms, **Then** ritual state returns to defaults.
5. **Given** the user exports state, **When** export completes, **Then** the user receives valid JSON representing current local state.

---

### User Story 4 - Understand Ritual Progress (Priority: P3)

The user sees clear blessing levels and varied developer-themed blessing copy as counts increase.

**Why this priority**: Progress labels and copy variety make the app feel alive over repeated use.

**Independent Test**: Increase counts across level thresholds and verify that the displayed level and copy remain short, humorous, and non-religious.

**Acceptance Scenarios**:

1. **Given** today's count crosses a level threshold, **When** the ritual window updates, **Then** the displayed blessing level changes.
2. **Given** the user performs repeated rituals, **When** blessing text appears, **Then** copy variety is visible across actions.

### Edge Cases

- The user rapidly alternates between "上香" and "敲木鱼".
- Sound is enabled but audio playback is unavailable.
- The user cancels a destructive confirmation.
- The user resets data while the window is open.
- Export fails because the destination is unavailable.
- Long blessing text appears in a narrow window.
- Tray menu actions are used while settings are open.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST improve "上香" feedback so the user sees immediate polished motion or visual change after the action.
- **FR-002**: The system MUST keep counts correct during rapid repeated ritual actions.
- **FR-003**: The system MUST provide a visible "敲木鱼" action.
- **FR-004**: The system MUST increase wooden fish count by one for each successful "敲木鱼" action.
- **FR-005**: The system MUST persist wooden fish count across app restarts.
- **FR-006**: The system MUST show a short feedback message after a successful "敲木鱼" action.
- **FR-007**: The system MUST keep sound disabled by default.
- **FR-008**: The system MUST let the user enable or disable sound.
- **FR-009**: The system MUST continue normally if sound playback is unavailable.
- **FR-010**: The system MUST provide a settings surface for sound, compact mode, reset today, reset all data, and export state.
- **FR-011**: The system MUST require confirmation before resetting today's count.
- **FR-012**: The system MUST require confirmation before resetting all data.
- **FR-013**: The system MUST allow the user to export current local state as valid JSON.
- **FR-014**: The system MUST display a blessing level based on ritual progress.
- **FR-015**: The system MUST use short developer-themed blessing copy that fits the compact window.
- **FR-016**: The system MUST keep the UI usable at the minimum supported window size.
- **FR-017**: The system MUST NOT install, enable, disable, or modify any Codex hook or Codex configuration in this feature.
- **FR-018**: The system MUST continue avoiding real religious iconography, deities, scripture, or claims of actual worship.

### Key Entities

- **Wooden Fish Action**: A user-triggered playful ritual that increments wooden fish count and shows feedback.
- **Settings**: User-controlled local preferences such as sound and compact mode.
- **Exported State**: A user-readable JSON representation of current local ritual state.
- **Blessing Level**: A label derived from progress, such as 初燃, 稳定, 香火渐盛, 香火鼎盛, or 功德圆满.
- **Feedback Message**: A short humorous message shown after incense or wooden fish actions.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can perform 10 rapid ritual actions without incorrect counts or visible layout breakage.
- **SC-002**: A user can knock the wooden fish and see count and feedback changes within 1 second.
- **SC-003**: Sound remains off until the user explicitly enables it.
- **SC-004**: A user can reset today's count while preserving total merit.
- **SC-005**: A user can export local state and the exported content is valid JSON.
- **SC-006**: The main window remains readable and usable at the minimum supported size.
- **SC-007**: No files or settings related to Codex hooks are created or modified while completing this feature.

## Assumptions

- The Toy MVP from Spec 001 already exists and provides tray behavior, incense action, and local persistence.
- Sound is decorative feedback, not required for core use.
- Settings are local to the user's machine.
- Hook status may be shown as a future placeholder, but no hook action is available in this feature.
- Copy tone remains humorous and developer-facing, not religious or authoritative.
