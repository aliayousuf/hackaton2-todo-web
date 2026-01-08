---
description: "Task list for Authentication UI Split-Screen Layout implementation"
---

# Tasks: Authentication UI Split-Screen Layout

**Input**: Design documents from `/specs/003-auth-ui-update/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`
- Paths adjusted based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create SplitScreenAuth component in frontend/components/auth/SplitScreenAuth.tsx
- [X] T002 [P] Create LeftPanel component in frontend/components/auth/LeftPanel.tsx
- [X] T003 [P] Create RightPanel component in frontend/components/auth/RightPanel.tsx

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Update existing LoginForm component to match new styling requirements in frontend/components/auth/LoginForm.tsx
- [X] T005 [P] Update existing RegisterForm component to match new styling requirements in frontend/components/auth/RegisterForm.tsx
- [X] T006 [P] Update login page to use new split-screen layout in frontend/app/(auth)/login/page.tsx
- [X] T007 Update register page to use new split-screen layout in frontend/app/(auth)/register/page.tsx
- [X] T008 Implement responsive design with Tailwind CSS classes for mobile hiding

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Access Login Page (Priority: P1) 🎯 MVP

**Goal**: Implement a two-column split-screen layout on the login page with a deep navy blue left panel containing welcoming text and decorative geometric shapes, and a clean white right panel containing the login form

**Independent Test**: Can be fully tested by visiting the login page and verifying the layout renders correctly across different screen sizes, delivering a professional and modern authentication experience.

### Implementation for User Story 1

- [X] T009 [P] [US1] Create left panel with deep navy blue background in frontend/components/auth/LeftPanel.tsx
- [X] T010 [P] [US1] Add "Hello! Have a GOOD DAY" text to left panel in frontend/components/auth/LeftPanel.tsx
- [X] T011 [US1] Implement decorative geometric shapes (circles/arcs) in left panel in frontend/components/auth/LeftPanel.tsx
- [X] T012 [US1] Create right panel with clean white background in frontend/components/auth/RightPanel.tsx
- [X] T013 [US1] Add login form with email and password fields to right panel in frontend/components/auth/RightPanel.tsx
- [X] T014 [US1] Implement navy blue login button with white text in frontend/components/auth/RightPanel.tsx
- [X] T015 [US1] Add "Don't have any account? Create an account" link at bottom of right panel in frontend/components/auth/RightPanel.tsx
- [X] T016 [US1] Implement responsive behavior to hide left panel on mobile screens (<1024px) in frontend/components/auth/SplitScreenAuth.tsx
- [X] T017 [US1] Test layout renders correctly on desktop (≥1024px) with both panels visible

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Authenticate with New UI (Priority: P1)

**Goal**: Ensure users can interact with the new login form, enter their email and password, click the navy blue login button, and successfully authenticate using the existing backend authentication system without any changes to the underlying authentication flow

**Independent Test**: Can be tested by entering valid credentials in the new UI and verifying successful authentication and redirection.

### Implementation for User Story 2

- [X] T018 [P] [US2] Integrate login form with existing authentication logic in frontend/components/auth/LoginForm.tsx
- [X] T019 [P] [US2] Test successful authentication with valid credentials in frontend/components/auth/LoginForm.tsx
- [X] T020 [US2] Test error handling with invalid credentials in frontend/components/auth/LoginForm.tsx
- [X] T021 [US2] Test navigation to registration page from login form in frontend/components/auth/RightPanel.tsx
- [X] T022 [US2] Ensure authentication success rate remains unchanged (≥95% of valid attempts succeed)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Responsive Design Experience (Priority: P2)

**Goal**: Ensure users access the login page on different devices and experience appropriate layout behavior - desktop users see the split-screen design while mobile users see a single-column layout focused on the login form

**Independent Test**: Can be tested by viewing the page on different screen sizes and verifying responsive behavior.

### Implementation for User Story 3

- [X] T023 [P] [US3] Test layout on desktop screen sizes (≥1024px) to verify both panels visible
- [X] T024 [P] [US3] Test layout on mobile screen sizes (<1024px) to verify only right panel visible
- [X] T025 [US3] Verify responsive behavior works across 375px, 768px, and 1280px screen sizes
- [X] T026 [US3] Test that no text overlap occurs in the auth card at any screen size
- [X] T027 [US3] Optimize SVG geometric shapes for performance on different devices

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T028 [P] Update register page with same split-screen layout as login page in frontend/app/(auth)/register/page.tsx
- [X] T029 [P] Add accessibility enhancements to new UI components
- [X] T030 Test page load time to ensure no more than 10% increase compared to previous UI
- [X] T031 [P] Add proper semantic HTML structure to components
- [X] T032 Verify adequate color contrast ratios for accessibility
- [X] T033 Test keyboard navigation support
- [X] T034 Run quickstart.md validation to ensure all functionality works as expected

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all components for User Story 1 together:
Task: "Create left panel with deep navy blue background in frontend/components/auth/LeftPanel.tsx"
Task: "Add 'Hello! Have a GOOD DAY' text to left panel in frontend/components/auth/LeftPanel.tsx"
Task: "Create right panel with clean white background in frontend/components/auth/RightPanel.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence