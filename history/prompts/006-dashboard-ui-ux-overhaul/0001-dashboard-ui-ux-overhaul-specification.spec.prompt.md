---
id: 0001
title: dashboard-ui-ux-overhaul-specification
stage: spec
date: 2026-01-08
surface: agent
model: claude-sonnet-4-5-20250929
feature: 006-dashboard-ui-ux-overhaul
branch: 006-dashboard-ui-ux-overhaul
user: aliayousuf
command: sp.specify
labels: ["dashboard", "ui", "ux", "overhaul", "specification", "saas", "blue-purple"]
links:
  spec: /specs/006-dashboard-ui-ux-overhaul/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - /specs/006-dashboard-ui-ux-overhaul/spec.md
  - /specs/006-dashboard-ui-ux-overhaul/checklists/requirements.md
tests:
  - none
---

## Prompt

Execute a complete UI/UX overhaul of the Todo Dashboard to fix layout overlaps and implement a premium Blue-Purple SaaS aesthetic.

Mandatory Sequence of Operations:

Step 1 (Read Constitution): Analyze the project constitution to ensure all UI changes and code refactors adhere to established architectural rules.

Step 2 (Read Backend): Index the backend/ directory to map API controllers and data schemas, ensuring the frontend Task types and fetch calls are perfectly synchronized.

Step 3 (Audit Plan): Review the existing component structure in the frontend/ directory to identify why components are currently unstyled or overlapping.

Layout & Architecture:

Viewport Control: Refactor app/dashboard/layout.tsx into a fixed h-screen overflow-hidden shell to eliminate body-level scrolling.

Zero-Overlap Shell: Implement a rigid Sidebar/Main flex split where the sidebar is flex-shrink-0 and the main area is flex-1 min-w-0.

Independent Scrolling: Only the task list container within <main> should be scrollable using overflow-y-auto.

Visual Theme (Blue-Purple SaaS):

Color Palette: Use a light Slate-50 background for the workspace.

Primary Actions: Primary buttons and active states must use a bg-gradient-to-r from-blue-600 to-purple-600.

Sidebar Design: Deep Indigo-950 background with high-contrast white text and purple-tinted hover states for navigation links.

Card Styling: Redesign TaskItem.tsx with rounded-2xl cards, soft shadow-sm, and hover:shadow-md transitions.

Component Refinement & Alignment:

Header: Position the Header as a sticky, glass-morphism element (backdrop-blur) that aligns perfectly with the content width.

Task UI: Use Lucide icons for edit/delete actions and refined typography for the "Created/Updated" timestamps to reduce visual clutter.
Read the Constitution and the Backend routes to define the data "Source of Truth."

Locate the CSS conflicts in frontend/app/dashboard/layout.tsx causing the current sidebar overlap.

Structure Refactor:

Apply the flex h-screen layout to the Dashboard shell to fix the viewport issues.

Ensure the Sidebar component is properly nested and not using absolute positioning.

Theming Execution:

Apply the Blue-Purple gradient to the "Create Task" button and active navigation links.

Update globals.css with modern font variables (Inter/Geist) and smooth transition utilities.

Functional Alignment:

Update TaskList.tsx and TaskItem.tsx to handle backend data (timestamps, titles, status) within a clean, centered max-width layout.

Final Verification:

Verify mobile responsiveness and ensure the "Loading" state matches the new dashboard shell to prevent layout shifts.

## Response snapshot

Successfully created comprehensive specification for the Dashboard UI/UX Overhaul feature. The specification includes:

- User Scenarios & Testing with 3 prioritized user stories (P1-P3)
- Functional Requirements with 12 specific requirements (FR-001 to FR-012)
- Key Entities identification for Task, Dashboard Layout, and Sidebar
- Success Criteria with 6 measurable outcomes (SC-001 to SC-006)
- Quality checklist validation confirming all requirements are met

The spec addresses all key aspects from the user input: fixing layout overlaps, implementing Blue-Purple SaaS aesthetic, viewport control, proper flex layout, color palette, button styling, sidebar design, card styling, and header positioning.

## Outcome

- ✅ Impact: Complete specification for dashboard UI overhaul with SaaS aesthetic
- 🧪 Tests: No tests created yet (will be created during implementation)
- 📁 Files: 2 files created (spec.md and requirements checklist)
- 🔁 Next prompts: /sp.plan to generate implementation plan
- 🧠 Reflection: Spec addresses all UI/UX issues with comprehensive approach

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Not applicable
- Prompt variant (if applicable): Standard sp.specify command
- Next experiment (smallest change to try): Generate implementation plan with /sp.plan