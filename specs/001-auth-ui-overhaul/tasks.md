# Implementation Tasks: Auth UI Overhaul

**Feature**: 001-auth-ui-overhaul
**Created**: 2026-01-08
**Spec**: [specs/001-auth-ui-overhaul/spec.md](/specs/001-auth-ui-overhaul/spec.md)
**Plan**: [specs/001-auth-ui-overhaul/plan.md](/specs/001-auth-ui-overhaul/plan.md)
**Input**: Implementation plan and research findings from `/specs/001-auth-ui-overhaul/`

## Overview

This document outlines the implementation tasks for the Auth UI Overhaul feature. The changes address critical UI issues including black-on-black button text, squashed layout positioning, and missing navy panel. The solution involves consolidating components, centering layouts, correcting contrast issues, and adding visual polish.

## Dependencies

- User Stories: US2 depends on US1 completion (shared components)
- Components: SplitScreenAuth is shared between login and register flows
- Backend: Authentication API endpoints (no changes required)

## Parallel Execution Examples

- T005, T006 can run in parallel (different auth components)
- T010, T015 can run in parallel (different auth pages)
- T020, T025 can run in parallel (different auth forms)

## Implementation Strategy

**MVP Scope**: Complete US1 (Accessible Login Experience) with proper contrast and layout
**Delivery**: Incremental approach, each user story delivers value independently

---

## Phase 1: Setup

### Goal
Initialize development environment and verify existing auth functionality works before making changes.

- [ ] T001 Set up development environment and verify existing auth functionality works
- [ ] T002 Review current authentication UI implementation and identify specific issues to fix
- [ ] T003 [P] Verify Tailwind CSS configuration supports required styling classes
- [ ] T004 [P] Locate LeftPanel.tsx and RightPanel.tsx files for removal

## Phase 2: Foundational

### Goal
Implement foundational changes that will support all user stories, including component consolidation and layout fixes.

- [ ] T005 Consolidate SplitScreenAuth component by merging LeftPanel and RightPanel logic
- [ ] T006 Update SplitScreenAuth container to use proper flex layout classes
- [ ] T007 [P] Add navy panel styling with proper responsive behavior
- [ ] T008 [P] Add decorative elements to navy panel (SVG circles, typography)
- [ ] T009 [P] Implement flex-centering for right container to center forms

## Phase 3: User Story 1 - Accessible Login Experience

### Goal
Implement properly styled, accessible authentication interface with clear visual hierarchy for login page.

### Independent Test
User can navigate to login page and see properly styled interface with no visual defects (visible button text, proper layout, navy panel present).

### Implementation Tasks
- [ ] T010 [US1] Update LoginForm container with proper max-width and flex classes
- [ ] T011 [US1] Add proper header with login title to LoginForm
- [ ] T012 [US1] Update LoginForm input fields with specified Tailwind classes for proper styling
- [ ] T013 [US1] Update LoginForm submit button with exact specified classes for contrast and visibility
- [ ] T014 [US1] Test login form functionality with new styling on desktop and mobile

## Phase 4: User Story 2 - Accessible Registration Experience

### Goal
Implement registration page with same properly styled, accessible authentication interface with consistent styling across both auth pages.

### Independent Test
User can navigate to registration page and see properly styled interface with no visual defects matching the login page styling.

### Implementation Tasks
- [ ] T015 [US2] Update RegisterForm container with proper max-width and flex classes
- [ ] T016 [US2] Add proper header with registration title to RegisterForm
- [ ] T017 [US2] Update RegisterForm input fields with specified Tailwind classes for proper styling
- [ ] T018 [US2] Update RegisterForm submit button with exact specified classes for contrast and visibility
- [ ] T019 [US2] Test registration form functionality with new styling matching login page

## Phase 5: User Story 3 - Consistent Authentication UI

### Goal
Ensure consistent styling and behavior across both login and registration forms, with proper focus states, error handling, and accessibility features.

### Independent Test
User can verify consistent styling, accessibility features, and behavior across both authentication forms.

### Implementation Tasks
- [ ] T020 [US3] Implement consistent focus states for all form elements in both forms
- [ ] T021 [US3] Standardize error message styling and presentation in both forms
- [ ] T022 [US3] Ensure consistent password visibility toggle behavior in both forms
- [ ] T023 [US3] Verify consistent accessibility attributes (ARIA labels) in both forms
- [ ] T024 [US3] Test responsive behavior consistency across both forms
- [ ] T025 [US3] Validate proper contrast ratios meet WCAG 2.1 AA standards in both forms

## Phase 6: Polish & Cross-Cutting Concerns

### Goal
Finalize implementation with polish, testing, and documentation.

### Implementation Tasks
- [ ] T026 Review and test all authentication UI changes for consistency and accessibility
- [ ] T027 [P] Delete LeftPanel.tsx and RightPanel.tsx files to clean up project structure
- [ ] T028 [P] Update login and register page components to use updated SplitScreenAuth
- [ ] T029 Run existing tests to ensure no regressions were introduced
- [ ] T030 Verify all auth functionality works as expected after UI improvements