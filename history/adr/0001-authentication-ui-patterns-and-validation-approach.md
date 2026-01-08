# ADR-0001: Authentication UI Patterns and Validation Approach

> **Scope**: Document decision clusters, not individual technology choices. Group related decisions that work together (e.g., "Frontend Stack" not separate ADRs for framework, styling, deployment).

- **Status:** Accepted
- **Date:** 2026-01-08
- **Feature:** 005-auth-ui-fix
- **Context:** The Todo application requires a consistent, accessible, and user-friendly authentication flow. Previous implementation had inconsistencies in UI/UX, duplicated validation logic, and suboptimal error handling. We needed to establish a standardized approach for authentication UI patterns that aligns with Next.js best practices while maintaining security and accessibility standards.

<!-- Significance checklist (ALL must be true to justify this ADR)
     1) Impact: Long-term consequence for architecture/platform/security?
     2) Alternatives: Multiple viable options considered with tradeoffs?
     3) Scope: Cross-cutting concern (not an isolated detail)?
     If any are false, prefer capturing as a PHR note instead of an ADR. -->

## Decision

We will implement a unified authentication UI pattern with the following components:
- Split-screen design for login/register views using the SplitScreenAuth component
- Consistent title management through the SplitScreenAuth configuration rather than duplicating in form components
- Password visibility toggle for both login and registration forms using eye/eye-off icons
- Single validation approach using Zod with react-hook-form to eliminate duplicate validation logic
- Centralized error handling with clear, specific messages for users
- Enhanced accessibility with proper ARIA attributes, focus management, and color contrast compliance
- Maintain existing backend API contracts and authentication flow for backward compatibility

## Consequences

### Positive

- Improved user experience with consistent UI patterns across login and registration flows
- Reduced code duplication through centralized validation and error handling
- Better accessibility compliance meeting WCAG guidelines
- Easier maintenance due to streamlined validation logic
- Consistent UX patterns that reduce cognitive load for users
- Maintained security posture with existing JWT-based authentication

### Negative

- Some refactoring required to consolidate duplicate validation logic
- Need to ensure backward compatibility during the transition
- Additional complexity in managing password visibility state
- Requires updating existing components to follow new patterns

## Alternatives Considered

Alternative A: Complete redesign of authentication flow with modal-based approach
- Would require significant backend changes
- Risk of breaking existing user workflows
- Rejected due to higher complexity and risk

Alternative B: Separate validation libraries for login vs registration
- Would maintain current duplication issues
- Lead to inconsistent UX patterns
- Rejected to avoid increased technical debt

Alternative C: Server-side rendering for auth pages only
- Would add complexity to the authentication flow
- Potentially slower perceived performance
- Rejected as current client-side approach meets requirements

## References

- Feature Spec: /specs/005-auth-ui-fix/spec.md
- Implementation Plan: /specs/005-auth-ui-fix/plan.md
- Related ADRs: null
- Evaluator Evidence: /history/prompts/005-auth-ui-fix/0001-auth-ui-fix-planning.plan.prompt.md
