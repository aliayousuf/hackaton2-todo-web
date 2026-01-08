# Feature Specification: Auth UI Overhaul

**Feature Branch**: `001-auth-ui-overhaul`
**Created**: 2026-01-08
**Status**: Draft
**Input**: User description: "read constitution, specification, plan, tailwind.config.ts, and globals.css. The Auth UI is completely broken: the button text is black-on-black, the layout is squashed at the top, and the navy panel is missing. Execute this \"Total Overhaul\":

Consolidate SplitScreenAuth.tsx:

Delete LeftPanel.tsx and RightPanel.tsx. Put all logic directly into SplitScreenAuth.tsx.

Container: <div className=\"min-h-screen w-full flex flex-col lg:flex-row bg-white overflow-hidden\">

Left Side (Navy): <div className=\"hidden lg:flex lg:w-1/2 bg-[#0a0a3c] relative flex-col items-center justify-center p-12\">

Graphic: Add <div className=\"absolute top-0 right-0 w-80 h-80 border-[40px] border-white/5 rounded-full -mr-40 -mt-40 z-0\"></div>

Text: <h1 className=\"text-white text-7xl font-bold leading-tight z-10\">Hello! <br/> Have a <br/> GOOD DAY</h1>

Right Side (White): <div className=\"w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-white\">

Refactor LoginForm.tsx & RegisterForm.tsx:

Container: <div className=\"w-full max-w-[420px] flex flex-col\">

Header: Add <h2 className=\"text-4xl font-bold text-[#0a0a3c] mb-10\">Login</h2> (or Sign up).

Inputs: Use className=\"w-full border border-gray-200 rounded-xl px-5 py-4 mb-6 text-lg focus:ring-2 focus:ring-[#0a0a3c] outline-none text-slate-900 !bg-white\"

Button (CRITICAL): Use exactly: <button type=\"submit\" className=\"w-full bg-[#0a0a3c] text-white !text-white py-5 rounded-xl text-xl font-bold mt-4 shadow-2xl hover:bg-slate-800 transition-all flex items-center justify-center border-none\"> LOGIN </button>

Cleanup: Delete unused files and ensure RegisterForm follows this exact styling."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Accessible Login Experience (Priority: P1)

User navigates to the login page and encounters a properly styled, accessible authentication interface with clear visual hierarchy. The user can see the login form with visible button text, properly spaced elements, and a distinctive navy panel on desktop view.

**Why this priority**: Critical for user access to the application - if users can't log in properly due to UI issues, they cannot access the system at all.

**Independent Test**: User can navigate to login page and see properly styled interface with no visual defects (visible button text, proper layout, navy panel present).

**Acceptance Scenarios**:

1. **Given** user accesses the login page, **When** page loads, **Then** user sees properly styled interface with visible button text, correct layout, and navy panel on desktop
2. **Given** user on mobile device accesses the login page, **When** page loads, **Then** user sees properly formatted login form without the navy panel

---

### User Story 2 - Accessible Registration Experience (Priority: P2)

User navigates to the registration page and encounters the same properly styled, accessible authentication interface with consistent styling across both auth pages. The user can see the registration form with visible button text, properly spaced elements, and a distinctive navy panel on desktop view.

**Why this priority**: Important for user acquisition - new users need to be able to register with the same positive experience as existing users logging in.

**Independent Test**: User can navigate to registration page and see properly styled interface with no visual defects matching the login page styling.

**Acceptance Scenarios**:

1. **Given** user accesses the registration page, **When** page loads, **Then** user sees properly styled interface with visible button text, correct layout, and navy panel on desktop
2. **Given** user transitions from login to registration, **When** clicking register link, **Then** user sees consistent styling and layout between both forms

---

### User Story 3 - Consistent Authentication UI (Priority: P3)

User experiences consistent styling and behavior across both login and registration forms, with proper focus states, error handling, and accessibility features that match modern web standards.

**Why this priority**: Essential for professional appearance and user confidence - inconsistent UI reduces trust and increases friction in the authentication process.

**Independent Test**: User can verify consistent styling, accessibility features, and behavior across both authentication forms.

**Acceptance Scenarios**:

1. **Given** user interacts with form elements on both login and registration, **When** focusing or hovering on elements, **Then** consistent visual feedback is provided
2. **Given** user encounters form validation errors, **When** submitting invalid data, **Then** consistent error styling and messaging appears on both forms

---

### Edge Cases

- What happens when user has reduced motion preferences enabled (animations should respect user settings)?
- How does the layout behave on extremely small or large screen sizes?
- What occurs when user disables CSS or uses a screen reader?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display login form with proper contrast ratios meeting WCAG 2.1 AA standards (button text must be visible against background)
- **FR-002**: System MUST render authentication UI with proper layout (not squashed at top) and responsive behavior
- **FR-003**: Users MUST be able to access the navy decorative panel on desktop screens as part of the brand experience
- **FR-004**: System MUST maintain consistent styling between login and registration forms
- **FR-005**: System MUST provide proper accessibility attributes (ARIA labels, focus management) for screen readers

- **FR-006**: System MUST delete LeftPanel and RightPanel components and consolidate all logic directly into SplitScreenAuth.tsx component
- **FR-007**: System MUST use specified Tailwind CSS classes for styling elements as detailed in requirements

### Key Entities *(include if feature involves data)*

- **Authentication UI Component**: Represents the visual interface for user authentication, including styling, layout, and accessibility properties without specifying implementation details

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can see all button text with proper contrast (contrast ratio > 4.5:1 for normal text) on authentication pages
- **SC-002**: Authentication UI renders properly without layout distortion on common screen sizes (mobile, tablet, desktop)
- **SC-003**: Desktop users see the navy panel as part of the authentication experience (panel visible on screens >= 1024px wide)
- **SC-004**: Both login and registration forms maintain consistent styling and user experience