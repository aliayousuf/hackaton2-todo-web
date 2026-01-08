---
id: 0001
title: auth-ui-overhaul-spec
stage: spec
date: 2026-01-08
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-auth-ui-overhaul
branch: 001-auth-ui-overhaul
user: aliayousuf
command: sp.specify
labels: ["auth", "ui", "overhaul", "specification", "accessibility"]
links:
  spec: /specs/001-auth-ui-overhaul/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - /specs/001-auth-ui-overhaul/spec.md
  - /specs/001-auth-ui-overhaul/checklists/requirements.md
tests:
  - none
---

## Prompt

sp.specify read constitution, specification, plan, tailwind.config.ts, and globals.css. The Auth UI is completely broken: the button text is black-on-black, the layout is squashed at the top, and the navy panel is missing. Execute this "Total Overhaul":

Consolidate SplitScreenAuth.tsx:

Delete LeftPanel.tsx and RightPanel.tsx. Put all logic directly into SplitScreenAuth.tsx.

Container: <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white overflow-hidden">

Left Side (Navy): <div className="hidden lg:flex lg:w-1/2 bg-[#0a0a3c] relative flex-col items-center justify-center p-12">

Graphic: Add <div className="absolute top-0 right-0 w-80 h-80 border-[40px] border-white/5 rounded-full -mr-40 -mt-40 z-0"></div>

Text: <h1 className="text-white text-7xl font-bold leading-tight z-10">Hello! <br/> Have a <br/> GOOD DAY</h1>

Right Side (White): <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-white">

Refactor LoginForm.tsx & RegisterForm.tsx:

Container: <div className="w-full max-w-[420px] flex flex-col">

Header: Add <h2 className="text-4xl font-bold text-[#0a0a3c] mb-10">Login</h2> (or Sign up).

Inputs: Use className="w-full border border-gray-200 rounded-xl px-5 py-4 mb-6 text-lg focus:ring-2 focus:ring-[#0a0a3c] outline-none text-slate-900 !bg-white"

Button (CRITICAL): Use exactly: <button type="submit" className="w-full bg-[#0a0a3c] text-white !text-white py-5 rounded-xl text-xl font-bold mt-4 shadow-2xl hover:bg-slate-800 transition-all flex items-center justify-center border-none"> LOGIN </button>

Cleanup: Delete unused files and ensure RegisterForm follows this exact styling.

## Response snapshot

Successfully created specification for the Auth UI Overhaul feature. The specification addresses the critical issues with the current authentication UI including black-on-black button text, squashed layout, and missing navy panel. The spec defines three prioritized user stories covering accessible login experience (P1), accessible registration experience (P2), and consistent authentication UI (P3). Seven functional requirements were defined focusing on accessibility, proper layout, consistent styling, and component consolidation. Four measurable success criteria were established to verify the improvements.

## Outcome

- ✅ Impact: Complete specification for auth UI overhaul with accessibility focus
- 🧪 Tests: No tests created yet (will be created during implementation)
- 📁 Files: 2 files created (spec.md and requirements checklist)
- 🔁 Next prompts: /sp.plan to create implementation plan
- 🧠 Reflection: Specification addresses all UI issues with clear acceptance criteria

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Not applicable
- Prompt variant (if applicable): Standard sp.specify command
- Next experiment (smallest change to try): Create implementation plan
