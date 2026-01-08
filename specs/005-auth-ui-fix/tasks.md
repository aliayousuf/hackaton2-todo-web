# Implementation Tasks: Authentication UI Fixes

**Feature**: 005-auth-ui-fix
**Created**: 2026-01-08
**Spec**: [specs/005-auth-ui-fix/spec.md](/specs/005-auth-ui-fix/spec.md)
**Plan**: [specs/005-auth-ui-fix/plan.md](/specs/005-auth-ui-fix/plan.md)
**Input**: Implementation plan and research findings from `/specs/005-auth-ui-fix/`

## Overview

This document outlines the implementation tasks for fixing the authentication UI in the Todo application. The changes address issues with inconsistent title display, missing password visibility toggle, duplicated validation logic, and accessibility improvements while maintaining the existing split-screen design.

## Dependencies

- User Stories: [Independent - no dependencies between stories]
- Components: AuthContext, API client, existing auth components
- Backend: Authentication API endpoints (no changes required)

## Parallel Execution Examples

- T001-T003 can run in parallel (setup tasks)
- T010, T015 can run in parallel (different auth components)
- T020, T025 can run in parallel (different auth components)

## Implementation Strategy

**MVP Scope**: Complete the title management fix and password visibility toggle for login form (T005-T015)
**Delivery**: Incremental approach, each user story delivers value independently

---

## Phase 1: Setup

### Goal
Initialize project structure and ensure all necessary dependencies are in place for authentication UI fixes.

- [x] T001 Set up development environment and verify existing auth functionality works
- [x] T002 Review current authentication UI implementation and identify specific issues to fix
- [x] T003 [P] Install any missing dependencies for password visibility icons (lucide-react)

## Phase 2: Foundational

### Goal
Implement foundational changes that will support all user stories, including title management and validation improvements.

- [x] T004 Consolidate title management by removing redundant title display from LoginForm component
- [x] T005 Consolidate title management by removing redundant title display from RegisterForm component
- [x] T006 Update SplitScreenAuth component to properly handle title display in both login and register modes
- [x] T007 [P] Streamline validation logic in LoginForm by removing duplicate manual validation
- [x] T008 [P] Streamline validation logic in RegisterForm by removing duplicate manual validation
- [x] T009 [P] Add password visibility toggle functionality to LoginForm component

## Phase 3: User Story 1 - Improved Login Form UX

### Goal
Enhance the login form user experience by implementing consistent title display and password visibility toggle.

### Independent Test
User can navigate to login page, see consistent title display, and toggle password visibility on the password field.

### Implementation Tasks
- [x] T010 [US1] Update LoginForm to remove hardcoded "Login" title
- [x] T011 [US1] Implement password visibility toggle in LoginForm using eye/eye-off icons
- [x] T012 [US1] Ensure password visibility toggle state is properly managed in LoginForm
- [x] T013 [US1] Update login page to pass proper title to SplitScreenAuth component
- [x] T014 [US1] Test login form functionality with new password visibility feature

## Phase 4: User Story 2 - Improved Register Form UX

### Goal
Enhance the register form user experience by implementing consistent title display and ensuring consistent UX patterns with login form.

### Independent Test
User can navigate to register page, see consistent title display, and has the same UX patterns as the login form.

### Implementation Tasks
- [x] T015 [US2] Update RegisterForm to remove hardcoded "Sign up" title
- [x] T016 [US2] Ensure RegisterForm follows same title management pattern as LoginForm
- [x] T017 [US2] Verify password visibility toggle exists and works in RegisterForm
- [x] T018 [US2] Update register page to pass proper title to SplitScreenAuth component
- [x] T019 [US2] Test register form functionality with consistent UX patterns

## Phase 5: User Story 3 - Accessibility and Error Handling Improvements

### Goal
Improve accessibility and error handling consistency across both login and register forms.

### Independent Test
Users can navigate forms using keyboard, proper ARIA attributes are present, and error messages are displayed consistently and accessibly.

### Implementation Tasks
- [x] T020 [US3] Add proper ARIA attributes to login form elements for better accessibility
- [x] T021 [US3] Add proper ARIA attributes to register form elements for better accessibility
- [x] T022 [US3] Centralize error message handling in LoginForm to reduce inconsistencies
- [x] T023 [US3] Centralize error message handling in RegisterForm to reduce inconsistencies
- [x] T024 [US3] Improve error message styling for better visibility and accessibility
- [x] T025 [US3] Ensure proper focus management and keyboard navigation in both forms

## Phase 6: Polish & Cross-Cutting Concerns

### Goal
Finalize implementation with polish, testing, and documentation.

### Implementation Tasks
- [x] T026 Review and test all authentication UI changes for consistency
- [x] T027 Update any necessary documentation or comments related to auth UI changes
- [x] T028 Perform final accessibility check on both login and register forms
- [x] T029 Run existing tests to ensure no regressions were introduced
- [x] T030 Verify all auth functionality works as expected after UI improvements