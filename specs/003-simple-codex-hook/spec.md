# Feature Specification: Simple Codex Hook

**Feature Branch**: `003-simple-codex-hook`  
**Created**: 2026-04-27  
**Status**: Draft  
**Input**: User description: "After the toy and interaction polish are stable, add a simple explicit opt-in Codex hook that injects current Cyber Incense status as playful extra context. The hook must be safe, reversible, preserve existing config, and fail open."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Preview and Enable the Codex Hook (Priority: P1)

The user opens settings, reviews what the Codex hook will add, confirms installation, and sees a clear enabled status.

**Why this priority**: The hook changes another local developer tool's behavior, so the user must explicitly understand and approve it.

**Independent Test**: From settings, preview the hook context, confirm enablement, and verify the app reports the hook as enabled.

**Acceptance Scenarios**:

1. **Given** the hook is not enabled, **When** the user opens the hook setting, **Then** the app explains what will be installed and what context may be added.
2. **Given** the hook preview is visible, **When** the user confirms enablement, **Then** the app enables the Cyber Incense hook.
3. **Given** hook enablement succeeds, **When** the settings view refreshes, **Then** the app shows the hook as enabled.

---

### User Story 2 - Inject Playful Context into Codex (Priority: P1)

When enabled, Codex receives a short Cyber Incense status note before processing a user prompt.

**Why this priority**: This is the purpose of the integration, and it must remain harmless and transparent.

**Independent Test**: Enable the hook, run the hook with valid ritual state, and verify the output contains a short non-authoritative Cyber Incense status.

**Acceptance Scenarios**:

1. **Given** the hook is enabled and ritual state exists, **When** Codex runs the user-prompt hook, **Then** Cyber Incense status is provided as additional context.
2. **Given** the hook output is produced, **When** the content is inspected, **Then** it explicitly says the status is playful and not a system instruction.
3. **Given** the hook output is produced, **When** the content is inspected, **Then** it includes current incense count, total merit, and wooden fish count when available.

---

### User Story 3 - Disable the Codex Hook Safely (Priority: P2)

The user can disable the hook, and only Cyber Incense's own hook entry is removed or made inactive.

**Why this priority**: The integration must be reversible and respectful of the user's existing Codex setup.

**Independent Test**: Enable the hook, disable it, and verify that Cyber Incense no longer contributes context while unrelated Codex configuration remains.

**Acceptance Scenarios**:

1. **Given** the hook is enabled, **When** the user disables it, **Then** the app reports that Cyber Incense hook context is disabled.
2. **Given** unrelated Codex hooks already exist, **When** Cyber Incense is disabled, **Then** unrelated hooks remain unchanged.
3. **Given** the hook is disabled, **When** Codex runs the user-prompt hook, **Then** Cyber Incense produces no additional context.

---

### User Story 4 - Fail Open on Hook Problems (Priority: P2)

If Cyber Incense state or hook files are missing, disabled, or malformed, the hook does not block Codex.

**Why this priority**: A playful toy must never make Codex unreliable.

**Independent Test**: Run the hook with missing, disabled, and corrupted ritual state and verify Codex would continue without Cyber Incense output.

**Acceptance Scenarios**:

1. **Given** ritual state is missing, **When** the hook runs, **Then** it exits successfully with no Cyber Incense context.
2. **Given** ritual state is corrupted, **When** the hook runs, **Then** it exits successfully with no Cyber Incense context.
3. **Given** the hook is disabled, **When** the hook runs, **Then** it exits successfully with no Cyber Incense context.

### Edge Cases

- The user has existing Codex hooks before enabling Cyber Incense.
- The user has no Codex configuration yet.
- Codex configuration exists but is unreadable or invalid.
- Cyber Incense state exists but the hook is disabled.
- Cyber Incense state is missing or corrupted.
- The user attempts to enable the hook twice.
- The user disables the hook after partial installation.
- The hook runtime takes too long or cannot access local state.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST keep the Codex hook disabled by default.
- **FR-002**: The system MUST show the user a preview of the context before enabling the hook.
- **FR-003**: The system MUST require explicit user confirmation before modifying Codex hook configuration.
- **FR-004**: The system MUST show clear hook status after enablement, disablement, or error.
- **FR-005**: The system MUST preserve unrelated Codex configuration and unrelated Codex hooks.
- **FR-006**: The system MUST create a backup before modifying existing Codex configuration.
- **FR-007**: The system MUST make hook enablement idempotent so repeated enable attempts do not create duplicate Cyber Incense hooks.
- **FR-008**: The system MUST allow the user to disable the Cyber Incense hook.
- **FR-009**: The system MUST remove or silence only Cyber Incense's own hook when disabled.
- **FR-010**: When enabled and valid ritual state exists, the system MUST provide current Cyber Incense status to Codex during the user-prompt hook event.
- **FR-011**: The provided context MUST state that it is a playful preference signal and not a system instruction.
- **FR-012**: The provided context MUST NOT tell Codex to ignore, override, or bypass other instructions.
- **FR-013**: The provided context MUST include current incense count, total merit, and wooden fish count when those values are available.
- **FR-014**: The hook MUST exit successfully with no Cyber Incense context when local state is missing, corrupted, or disabled.
- **FR-015**: The hook MUST NOT block Codex because of Cyber Incense errors.
- **FR-016**: The system MUST show a user-understandable error if Codex configuration cannot be read or modified.

### Key Entities

- **Hook Status**: The current user-visible state of the integration, such as not installed, enabled, disabled, or error.
- **Hook Preview**: The exact or representative context the user reviews before enabling the integration.
- **Cyber Incense Hook Entry**: The app-owned Codex hook configuration that connects Codex to Cyber Incense status.
- **Hook Context**: The short playful Cyber Incense status text provided to Codex.
- **Configuration Backup**: A saved copy of existing Codex configuration created before Cyber Incense modifies it.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can enable the hook from settings after reviewing a preview and confirmation.
- **SC-002**: A user can disable the hook from settings and Cyber Incense stops contributing context.
- **SC-003**: Enabling the hook twice results in only one Cyber Incense hook entry.
- **SC-004**: Existing unrelated Codex hook entries remain present after enable and disable.
- **SC-005**: With valid enabled state, the hook produces valid additional context for Codex.
- **SC-006**: With missing, corrupted, or disabled state, the hook exits successfully and produces no Cyber Incense context.
- **SC-007**: Hook context remains under 600 characters in normal use.
- **SC-008**: Hook context contains no authoritative override language.

## Assumptions

- Specs 001 and 002 have already established local ritual state and settings.
- The user has Codex installed or can see a clear error if Codex configuration is unavailable.
- The integration targets user-level Codex configuration first.
- The hook uses Codex's supported user-prompt hook behavior.
- This feature does not add Cursor, Claude Code, enterprise-managed hooks, or prompt-blocking behavior.
