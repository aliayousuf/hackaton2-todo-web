# Implementation Plan: Authentication UI Fixes

**Branch**: `005-auth-ui-fix` | **Date**: 2026-01-08 | **Spec**: [specs/005-auth-ui-fix/spec.md](/specs/005-auth-ui-fix/spec.md)
**Input**: Feature specification from `/specs/005-auth-ui-fix/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementation plan for fixing the authentication UI in the Todo application. Based on analysis of the current implementation, this plan addresses issues with the login and registration forms including inconsistent title display, missing password visibility toggle in login form, duplicated validation logic, and accessibility improvements. The solution maintains the existing split-screen design while improving UX consistency and addressing identified technical debt. The backend authentication API remains unchanged, preserving existing contracts and security measures.

## Technical Context

**Language/Version**: TypeScript 5.4 (frontend), Python 3.13+ (backend)
**Primary Dependencies**: Next.js 16+ (App Router), FastAPI, SQLModel, Better Auth, Tailwind CSS, Zod, react-hook-form
**Storage**: Neon Serverless PostgreSQL database (backend)
**Testing**: Jest, Playwright, pytest
**Target Platform**: Web application (frontend), Linux server (backend)
**Project Type**: Full-stack web application with separate frontend/backend
**Performance Goals**: Sub-second page load times, responsive UI with no jank
**Constraints**: Must follow Next.js App Router patterns, maintain user session security, follow accessibility standards
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

### Potential Issues:
- Need to ensure authentication properly validates user identity and enforces user data isolation per constitution requirements (Section III, Technology Governance)

## Project Structure

### Documentation (this feature)

```text
specs/005-auth-ui-fix/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── main.py                   # FastAPI entry point
│   ├── models/
│   │   └── user.py               # SQLModel database models
│   ├── schemas/
│   │   └── user.py               # Pydantic request/response schemas
│   ├── routers/
│   │   └── auth.py               # Authentication API routes
│   ├── middleware/
│   ├── database.py               # Database connection
│   ├── utils/
│   │   ├── security.py           # Password hashing and validation
│   │   └── jwt.py                # JWT token handling
│   └── config.py                 # Configuration management
└── tests/

frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx          # Login page component
│   │   └── register/
│   │       └── page.tsx          # Registration page component
│   ├── dashboard/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx         # Login form component
│   │   ├── RegisterForm.tsx      # Registration form component
│   │   └── SplitScreenAuth.tsx   # Split screen auth layout
│   └── ui/
├── contexts/
│   └── AuthContext.tsx           # Authentication context
├── lib/
│   └── api.ts                    # API client
├── types/
│   └── user.ts                   # User type definitions
└── tests/
```

**Structure Decision**: Full-stack web application structure selected. The authentication UI is implemented as a split-screen design with dedicated login and registration pages under the `(auth)` group in the Next.js App Router. Forms are modularized in components/auth/ and authentication state is managed through AuthContext. Backend authentication endpoints are in backend/src/routers/auth.py following FastAPI patterns.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
