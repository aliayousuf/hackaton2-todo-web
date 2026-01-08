---
id: 13
title: Auth UI Fix
stage: spec
date: 2026-01-08
surface: agent
model: claude-sonnet-4-5-20250929
feature: auth-ui-fix
branch: 005-auth-ui-fix
user: Claude
command: /sp.specify
labels: ["authentication", "ui", "fix", "styling"]
links:
  spec: specs/005-auth-ui-fix/spec.md
  plan: null
  tasks: null
  research: null
  data-model: null
  quickstart: null
  ticket: null
  adr: null
  pr: null
files:
  - specs/005-auth-ui-fix/spec.md
  - specs/005-auth-ui-fix/checklists/requirements.md
tests:
  - specs/005-auth-ui-fix/checklists/requirements.md
---

## Prompt

read constitution, specification, plan, and tailwind.config.ts. The Auth UI is currently broken: the button text is invisible, the form is squashed at the top, and the layout is unstyled. Perform a "Flat Rewrite" of the Auth system using this exact structure:

Rewrite SplitScreenAuth.tsx using this layout:

Container: className="min-h-screen w-full flex flex-col lg:flex-row bg-white overflow-hidden"

Left Side (Navy): className="hidden lg:flex lg:w-1/2 bg-[#0a0a3c] relative flex-col items-center justify-center p-12"

Inside Left Side:

Graphic: <div className="absolute top-0 right-0 w-80 h-80 border-[40px] border-white/5 rounded-full -mr-40 -mt-40 z-0"></div>

Text: <h1 className="text-white text-7xl font-bold leading-tight z-10">Hello! <br/> Have a <br/> GOOD DAY</h1>

Right Side (White): className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16"

Rewrite LoginForm.tsx & RegisterForm.tsx with these Styles:

Container: <div className="w-full max-w-[420px] flex flex-col">

Heading: <h2 className="text-4xl font-bold text-[#0a0a3c] mb-8">Login</h2>

Labels: className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2"

Inputs: className="w-full border border-gray-200 rounded-xl px-5 py-4 mb-6 text-lg focus:ring-2 focus:ring-[#0a0a3c] focus:border-transparent outline-none transition-all text-slate-900"

The Button (FIX INVISIBLE TEXT):

Use exactly: <button type="submit" className="w-full bg-[#0a0a3c] text-white py-5 rounded-xl text-xl font-bold mt-4 shadow-2xl hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center"> LOGIN </button>

Constraint: Ensure text-white is applied to the button element to prevent dark-mode themes from turning the text black.

Cleanup:

Delete frontend/components/auth/LeftPanel.tsx and frontend/components/auth/RightPanel.tsx.

Move the "Don't have an account? Sign up" link inside the LoginForm file at the very bottom, styled as className="text-center mt-8 text-gray-500".

## Response snapshot

Successfully created the Authentication UI Fix specification with:

- Created feature branch 005-auth-ui-fix
- Created comprehensive specification document addressing all UI issues (invisible button text, squashed forms, unstyled layout)
- Defined user scenarios for accessing authentication screens, authenticating with fixed UI, and responsive design experience
- Specified functional requirements for proper layout, styling, and responsive behavior
- Included success criteria for measurable outcomes
- Created validation checklist confirming specification quality

The specification addresses all reported issues and provides a clear path for implementation.

## Outcome

- ✅ Impact: Complete specification for auth UI fixes as requested
- 🧪 Tests: Quality checklist validates all requirements are testable and clear
- 📁 Files: spec.md and requirements.md created and validated
- 🔁 Next prompts: Ready for planning phase (/sp.plan)
- 🧠 Reflection: Successfully captured all UI fix requirements and constraints

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS - All requirements properly formatted and linked to user stories
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Move to planning phase