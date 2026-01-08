---
id: 9
title: Auth UI Flat Rewrite
stage: spec
date: 2026-01-08
surface: agent
model: claude-sonnet-4-5-20250929
feature: auth-ui-flat-rewrite
branch: 004-auth-ui-flat-rewrite
user: Claude
command: /sp.specify
labels: ["authentication", "ui", "specification", "flattening"]
links:
  spec: specs/004-auth-ui-flat-rewrite/spec.md
  plan: null
  tasks: null
  ticket: null
  adr: null
  pr: null
files:
  - specs/004-auth-ui-flat-rewrite/spec.md
  - specs/004-auth-ui-flat-rewrite/checklists/requirements.md
tests:
  - specs/004-auth-ui-flat-rewrite/checklists/requirements.md
---

## Prompt

read constitution, specification, plan, and tailwind.config.ts. The Auth UI is currently broken. Perform a "Flat Rewrite" of the Auth system . Execute these steps:

Update SplitScreenAuth.tsx (Layout & Graphics):

Rewrite SplitScreenAuth.tsx (Flatten the UI): * Remove LeftPanel and RightPanel components. Put all code directly into SplitScreenAuth.tsx file.


Container: min-h-screen flex flex-col lg:flex-row overflow-hidden.

Left Panel (Navy): hidden lg:flex lg:w-1/2 bg-[#0a0a3c] items-center justify-center relative p-12.

Branding: Add white text "Hello!


Have a


GOOD DAY" using text-6xl font-bold leading-tight z-10.

SVG Decor: Add absolute-positioned SVGs for the background:

Top-right: A large semi-circle outline (border-white/10).

Center-left: A subtle filled circle.

Use opacity-20 for all shapes to match the reference image's depth.

Right Panel: w-full lg:w-1/2 bg-white flex flex-col items-center justify-center p-8 md:p-24.

Refactor LoginForm.tsx & RegisterForm.tsx (Form Styles):

Wrap the <form> in a div with w-full max-w-[420px].

Header: Inside the form, add <h1 class="text-4xl font-bold text-slate-900 mb-10">Login</h1> (or Sign up).

Inputs: Use border border-slate-200 rounded-xl px-4 py-4 mb-6 focus:ring-2 focus:ring-[#0a0a3c]. Remove all toggle/eye icons.

Labels: text-sm font-semibold text-slate-500 mb-2 block.

Button: w-full bg-[#0a0a3c] hover:bg-slate-800 text-white py-5 rounded-xl text-xl font-bold mt-4 transition-all shadow-xl.

Footer: Place "Don't have an account? Create an account" centered at the bottom.

Cleanup: Delete the files frontend/components/auth/LeftPanel.tsx and frontend/components/auth/RightPanel.tsx.

## Response snapshot

Successfully created the Authentication UI Flat Rewrite specification with:

- Created feature branch 004-auth-ui-flat-rewrite
- Created comprehensive specification document with user scenarios, functional requirements, and success criteria
- Specified flattening of UI structure by removing LeftPanel and RightPanel components
- Defined new layout with proper Tailwind CSS classes for container, left panel, and right panel
- Specified enhanced form styling with improved spacing and visual hierarchy
- Maintained integration with existing authentication backend
- Created validation checklist confirming specification quality

The specification covers all aspects of the requested flat rewrite while preserving existing functionality.

## Outcome

- ✅ Impact: Complete specification for flattened auth UI as requested
- 🧪 Tests: Quality checklist validates all requirements are testable and clear
- 📁 Files: spec.md and requirements.md created and validated
- 🔁 Next prompts: Ready for planning phase (/sp.plan)
- 🧠 Reflection: Successfully captured all flattening requirements while maintaining backend compatibility

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS - Specification complete and validated
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Move to planning phase