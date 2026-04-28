# Feature Specification: Cyber Incense Toy MVP

**Feature Branch**: `001-toy-mvp`  
**Created**: 2026-04-27  
**Status**: Draft  
**Input**: User description: "Build the first Cyber Incense / AI 上香器 MVP as a polished desktop tray toy. Prioritize tray behavior, a compact incense GUI, 上香 interaction, and local state. Do not implement hooks or packaging in this feature."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Open the Tray Toy (Priority: P1)

An AI user launches Cyber Incense and sees it live in the system tray or menu bar. When they click the tray icon, a compact floating ritual window appears and shows the current incense status.

**Why this priority**: The product is a desktop tray toy. Without tray presence and a quick-open window, the rest of the ritual loop has no natural home.

**Independent Test**: Launch the app, click the tray icon, and verify the window opens, closes, and can be reopened without quitting the app.

**Acceptance Scenarios**:

1. **Given** the app has just launched, **When** the user looks at the system tray or menu bar, **Then** a Cyber Incense entry is visible.
2. **Given** the tray entry is visible, **When** the user clicks it, **Then** a compact floating Cyber Incense window opens.
3. **Given** the Cyber Incense window is open, **When** the user closes the window, **Then** the app remains available from the tray.
4. **Given** the app is available from the tray, **When** the user selects Quit from the tray menu, **Then** the app exits.

---

### User Story 2 - Offer Incense (Priority: P1)

The user clicks "上香" and immediately sees a satisfying visual response: incense state changes, smoke or glow appears, counts increase, and a short blessing line is shown.

**Why this priority**: This is the core toy loop and the main reason to use the app repeatedly.

**Independent Test**: Open the window, click "上香" once, and verify that the visual state, today's count, total count, and blessing text all update.

**Acceptance Scenarios**:

1. **Given** the ritual window is open, **When** the user clicks "上香", **Then** today's incense count increases by one.
2. **Given** the ritual window is open, **When** the user clicks "上香", **Then** total merit increases by one.
3. **Given** the user clicks "上香", **When** the action completes, **Then** the incense scene shows an immediate visual response.
4. **Given** the user clicks "上香", **When** the action completes, **Then** a short developer-themed blessing line is displayed.

---

### User Story 3 - Keep Local Counts (Priority: P2)

The user can quit and reopen the app without losing their incense counts. Today's count resets on a new local day, while total merit remains.

**Why this priority**: Persistence makes the toy feel continuous instead of disposable.

**Independent Test**: Offer incense, quit and reopen the app, and verify that counts persist. Simulate a new local date and verify only the daily count resets.

**Acceptance Scenarios**:

1. **Given** the user has offered incense, **When** the app is restarted on the same local day, **Then** today's count and total merit are preserved.
2. **Given** the stored day is not the current local day, **When** the app starts, **Then** today's count resets to zero.
3. **Given** the stored day is not the current local day, **When** today's count resets, **Then** total merit remains unchanged.

---

### User Story 4 - Recover from Local State Problems (Priority: P3)

If local app state is missing or unreadable, the app starts with safe default values instead of crashing.

**Why this priority**: The app is local-first and should remain harmless even when user-owned files are edited or damaged.

**Independent Test**: Delete or corrupt the local state file and verify the app still opens with default counts.

**Acceptance Scenarios**:

1. **Given** no prior local state exists, **When** the app launches, **Then** default counts and settings are created.
2. **Given** local state is unreadable, **When** the app launches, **Then** the app opens with default state and does not crash.

### Edge Cases

- The user rapidly clicks "上香" several times.
- The user closes the window during or immediately after an incense action.
- The app starts when local state is missing.
- The app starts when local state is corrupted.
- The local date changes while the app is not running.
- The tray menu action and window action are used in the same session.
- The window is opened at its minimum usable size.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST present a persistent tray or menu-bar entry while the app is running.
- **FR-002**: The system MUST open a compact Cyber Incense window from the tray or menu-bar entry.
- **FR-003**: The system MUST keep running when the user closes the Cyber Incense window unless the user explicitly quits.
- **FR-004**: The system MUST provide a visible "上香" action in the main window.
- **FR-005**: The system MUST allow the user to trigger "上香" from the tray menu.
- **FR-006**: The system MUST increase today's incense count by one for each successful "上香" action.
- **FR-007**: The system MUST increase total merit by one for each successful "上香" action.
- **FR-008**: The system MUST show an immediate visual incense response after a successful "上香" action.
- **FR-009**: The system MUST show a short blessing line after a successful "上香" action.
- **FR-010**: The system MUST preserve today's count and total merit across app restarts on the same local day.
- **FR-011**: The system MUST reset today's count when the stored day differs from the user's current local day.
- **FR-012**: The system MUST preserve total merit when today's count resets.
- **FR-013**: The system MUST create default local state when no prior state exists.
- **FR-014**: The system MUST recover from unreadable local state without crashing.
- **FR-015**: The system MUST NOT install, enable, disable, or modify any Codex hook or Codex configuration in this feature.
- **FR-016**: The system MUST avoid real religious iconography, deities, scripture, or claims of actual worship.
- **FR-017**: The system MUST work without accounts, telemetry, backend services, or network dependency.

### Key Entities

- **Incense State**: The user's local ritual state, including current local day, today's incense count, total merit, latest blessing level, and future-compatible settings.
- **Incense Action**: A user-triggered "上香" event that updates counts, produces feedback, and records when the action happened.
- **Blessing Line**: A short humorous developer-facing message shown after an incense action.
- **Tray Session**: The running desktop presence that lets the user open, hide, act, or quit.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can launch the app and open the ritual window from the tray in under 5 seconds on a typical desktop session.
- **SC-002**: A user can complete one "上香" action and see updated counts and visual feedback within 1 second.
- **SC-003**: After restarting the app on the same local day, the displayed today's count and total merit match the prior session.
- **SC-004**: After a simulated local date change, today's count resets while total merit remains unchanged.
- **SC-005**: With missing or corrupted local state, the app still opens successfully and displays default ritual state.
- **SC-006**: No files or settings related to Codex hooks are created or modified while completing this feature.

## Assumptions

- The first target platform is macOS, with Windows and Linux behavior handled later where tray behavior differs.
- The app is for individual local use by developers and AI-tool users.
- "Merit" is a humorous counter and has no religious or authoritative meaning.
- The MVP can show only the "上香" ritual; wooden fish, sound, settings polish, hooks, and packaging are separate features.
- Local state is stored on the user's machine in an app-owned location.
