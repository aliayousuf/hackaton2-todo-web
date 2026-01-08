# Implementation Plan: Auth UI Overhaul

**Branch**: `001-auth-ui-overhaul` | **Date**: 2026-01-08 | **Spec**: [specs/001-auth-ui-overhaul/spec.md](/specs/001-auth-ui-overhaul/spec.md)
**Input**: Feature specification from `/specs/001-auth-ui-overhaul/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementation plan for the Auth UI Overhaul feature to address critical visual and accessibility issues. The plan involves flattening the component structure by merging LeftPanel and RightPanel into SplitScreenAuth.tsx, centering the layout to move forms from top-left to screen center, correcting contrast issues with button text, adding visual polish with SVG elements and typography, and purging redundant files. This will resolve the black-on-black text, squashed layout, and missing navy panel issues identified in the current implementation.

## Technical Context

**Language/Version**: TypeScript 5.4 (frontend), Python 3.13+ (backend)
**Primary Dependencies**: Next.js 16+ (App Router), FastAPI, SQLModel, Tailwind CSS, Lucide React, React Hook Form, Zod
**Storage**: Neon Serverless PostgreSQL database (backend)
**Testing**: Jest, Playwright, pytest
**Target Platform**: Web application (frontend), Linux server (backend)
**Project Type**: Web application with separate frontend/backend
**Performance Goals**: Sub-second page load times, responsive UI with no jank, proper accessibility (WCAG 2.1 AA compliance)
**Constraints**: Must follow Next.js App Router patterns, maintain user session security, follow accessibility standards, resolve contrast issues (4.5:1 minimum ratio)
**Scale/Scope**: Individual user authentication, multi-user support with data isolation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Compliance Verification:
- ✅ Spec-Driven Development: Following SDD workflow as required by constitution
- ✅ AI as Primary Developer: Claude Code generates all implementation code
- ✅ Mandatory Traceability: Maintaining audit trail through specs/plan/tasks structure
- ✅ Test-First Mandate: Will ensure auth UI has proper test coverage
- ✅ Evolutionary Consistency: Building upon existing auth implementation
- ✅ Technology Governance: Using Next.js 16+ App Router, FastAPI, SQLModel as required
- ✅ API-First Principles: Following established API contracts
- ✅ Security & Compliance: Implementing proper auth security measures (JWT, password hashing, etc.)
- ✅ Repository Structure: Following mandated frontend/backend structure
- ✅ Quality Standards: Maintaining clean, readable code with proper documentation
- ✅ Accessibility: Ensuring WCAG 2.1 AA compliance for auth UI components

### Potential Issues:
- Need to ensure authentication properly validates user identity and enforces user data isolation per constitution requirements (Section III, Technology Governance)
- Contrast ratio compliance required per accessibility standards

## Project Structure

### Documentation (this feature)

```text
specs/001-auth-ui-overhaul/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
├── checklists/          # Quality checklists
│   └── requirements.md  # Spec validation checklist
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx          # Login page component
│   │   └── register/
│   │       └── page.tsx          # Registration page component
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx         # Login form component
│   │   ├── RegisterForm.tsx      # Registration form component
│   │   └── SplitScreenAuth.tsx   # Split screen auth layout (to be updated)
│   └── ui/
├── contexts/
│   └── AuthContext.tsx           # Authentication context
├── lib/
│   └── api.ts                    # API client
├── types/
│   └── user.ts                   # User type definitions
└── tailwind.config.ts
```

**Structure Decision**: Web application structure selected. The authentication UI overhaul will focus on the frontend components in the auth directory. The main changes will involve updating SplitScreenAuth.tsx to consolidate LeftPanel/RightPanel functionality, updating the form components (LoginForm/RegisterForm) for better styling and accessibility, and ensuring proper layout and contrast in the authentication flow.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
