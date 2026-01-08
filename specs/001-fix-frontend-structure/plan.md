# Implementation Plan: Fix Frontend Structure and UI Issues

**Branch**: `001-fix-frontend-structure` | **Date**: 2026-01-05 | **Spec**: [link to spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-fix-frontend-structure/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This plan addresses the frontend structure issues identified in the specification, focusing on fixing import errors, resolving state management conflicts between components, and ensuring all UI elements are properly visible. The approach centers on refactoring component architecture to follow Next.js App Router patterns, consolidating state management between parent and child components, and fixing UI rendering issues throughout the application.

## Technical Context

**Language/Version**: TypeScript 5.x, Next.js 16+ (App Router)
**Primary Dependencies**: React 18+, Tailwind CSS, Better Auth, Lucide React, Next.js App Router
**Storage**: API-driven via backend service (no local storage dependencies)
**Testing**: Jest, React Testing Library (to be implemented in future tasks)
**Target Platform**: Web application (Chrome, Firefox, Safari, Edge latest versions)
**Project Type**: web (determines source structure)
**Performance Goals**: <3 second page load times, responsive UI interactions
**Constraints**: Must follow Next.js App Router patterns, Server/Client component boundaries, authentication requirements
**Scale/Scope**: Single user task management application

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution compliance verified:
- Follows Next.js 16+ App Router requirements (not Pages Router)
- Uses Server Components by default with Client Components only for interactivity
- TypeScript strict mode enabled as required
- Tailwind CSS used for all styling as mandated
- Better Auth with JWT plugin for authentication as specified
- Type-safe API client for backend communication as required
- No direct database access from frontend
- Proper user isolation enforced via JWT authentication
- Domain model maintains consistency with Todo structure (id, title, description, completed)

## Project Structure

### Documentation (this feature)

```text
specs/001-fix-frontend-structure/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
frontend/
├── app/                          # App Router pages and layouts
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/                   # React components
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── dashboard/
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   └── tasks/
│       ├── CreateTaskForm.tsx
│       ├── EmptyState.tsx
│       ├── TaskItem.tsx
│       └── TaskList.tsx
├── lib/                          # Utilities and API client
│   └── api.ts
├── types/                        # TypeScript type definitions
│   ├── task.ts
│   └── user.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

**Structure Decision**: Web application structure selected. The application follows Next.js App Router conventions with clear separation of concerns:
- Pages in `app/` directory following App Router patterns
- Components organized by feature in `components/` directory
- API client in `lib/` directory for backend communication
- Type definitions in `types/` directory for TypeScript safety

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| State management refactoring | Required to fix data inconsistency issues | Maintaining separate state would perpetuate sync issues |
