# ADR-001: Card-Based Authentication UI Design

**Status**: Accepted
**Date**: 2026-01-07

## Context

The existing authentication UI in the application uses a full-width layout that doesn't provide a clear visual separation between the authentication form and the background. The current design lacks modern UI/UX patterns that users expect from contemporary SaaS applications. We need to replace the current authentication pages (login and register) with a new design that:

- Improves user focus on the authentication process
- Provides better visual hierarchy and separation
- Aligns with modern SaaS design patterns
- Ensures responsive behavior across device sizes
- Maintains accessibility standards

## Decision

We will implement a card-based authentication UI design with the following characteristics:

**Layout Structure:**
- Outer container: `min-h-screen flex items-center justify-center bg-blue-500`
- Inner card: `w-full max-w-md bg-white p-8 rounded-xl shadow-lg`
- Centering achieved through flexbox, not absolute positioning

**Card Design:**
- White background on soft blue background
- Rounded-xl corners (rounded-[1rem])
- Shadow-lg for depth perception
- Clear visual separation from background
- SaaS-style modern appearance

**Form Structure:**
- Inside the card: `<form class="flex flex-col space-y-5">`
- All inputs stacked vertically
- Labels positioned above inputs
- Input styling: `w-full rounded-md border-gray-300 focus:ring-blue-500`
- Button styling: `w-full bg-blue-600 text-white rounded-md`

**Typography:**
- Title: `text-xl font-semibold text-center` (Sign in / Sign up)
- Helper text: `text-sm text-gray-600 text-center`
- Labels: `text-sm font-medium`
- No large headings or oversized buttons

**Content Structure:**
- Login page: Title "Sign in", email field, password field, "Login" button, footer "Don't have an account? Sign up"
- Register page: Title "Sign up", email field, password field, "Sign up" button, footer "Already have an account? Login"
- Logout functionality placed in navbar/sidebar/profile dropdown, styled as text-red-600 or subtle destructive button, labeled "Logout"

## Alternatives Considered

**Alternative 1: Modal-based Authentication**
- Pros: Keeps user context, can be dismissed easily, works well for quick login
- Cons: May feel intrusive, limited space for complex forms, accessibility concerns with focus trapping
- Rejected because: The card design provides a cleaner full-page experience without modal complexity

**Alternative 2: Full-width Form Layout (Current Design)**
- Pros: Maximizes available horizontal space, simple implementation
- Cons: Lacks visual focus, doesn't separate content from background, outdated appearance
- Rejected because: Doesn't meet modern UX expectations or design standards

**Alternative 3: Floating Panel with Glass Effect**
- Pros: Modern aesthetic, interesting visual effect
- Cons: Accessibility concerns with transparency, readability issues, complex implementation
- Rejected because: Could create accessibility issues and increases implementation complexity

## Consequences

**Positive:**
- Improved user focus on authentication tasks
- Modern, professional appearance that aligns with SaaS standards
- Better visual hierarchy and separation from background
- Responsive design that works across device sizes (375px, 768px, 1280px)
- Enhanced user experience with consistent styling patterns
- Clearer visual distinction between authenticated and unauthenticated states

**Negative:**
- Requires refactoring of existing authentication components
- May need adjustments to existing layout containers
- Potential impact on current user workflows during transition
- Additional CSS classes required for styling

**Neutral:**
- Maintains the same functional behavior (login, register, logout)
- Preserves existing authentication logic and backend integration
- Doesn't change security considerations

## References

- Feature specification: specs/002-auth-ui-replace/spec.md
- Original authentication implementation: specs/001-task-crud-auth/
- UI/UX requirements from user feedback and modern SaaS patterns