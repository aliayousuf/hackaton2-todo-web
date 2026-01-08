---
id: 1
title: "Amend Project Constitution"
stage: constitution
date_iso: "2026-01-03"
surface: "agent"
model: "Claude Sonnet 4.5"
feature: "none"
branch: "master"
user: "user"
command: "/sp.constitution"
labels: ["constitution", "governance", "setup"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml: |
  - .specify/memory/constitution.md
tests_yaml: |
  - null
---

# Amendment of Project Constitution

## PROMPT_TEXT

```
The Evolution of Todo

Preamble

This Constitution establishes the governing principles, standards, and invariants for The Evolution of Todo — a multi-phase educational software project demonstrating the evolution of a simple CLI todo application into a cloud-native, AI-powered, event-driven distributed system.

Core Purpose: To teach students modern software engineering through Spec-Driven Development (SDD) and AI-assisted implementation, where humans act as architects and AI (Claude Code) performs all coding work.

Scope of Authority: This Constitution applies to ALL phases, ALL features, ALL specifications, ALL plans, ALL tasks, and ALL implementations across the entire project lifecycle.

Supremacy Clause: If any specification, plan, task, or implementation conflicts with this Constitution, THE CONSTITUTION WINS. The conflicting artifact must be rewritten or regenerated.

I. Core Principles (NON-NEGOTIABLE)

1. Spec-Driven Development Only

Mandate: All feature development must follow the strict SDD workflow:

/sp.constitution → /sp.specify → /sp.plan → /sp.tasks → /sp.implement


Rules:

No feature may be implemented without a complete, approved specification

Humans may NOT manually write feature code

If generated code is incorrect, refine the SPEC, not the code

All specifications are versioned and stored in specs/

Every spec must include clear acceptance criteria and test scenarios

Violations: Any manually-written feature code is considered non-compliant and must be regenerated through the SDD workflow.

2. AI as Primary Developer

Division of Responsibilities:

Humans Must:

Write and refine feature specifications

Review architectural decisions

Run and validate tests

Approve changes before merge

Make final decisions on tradeoffs

AI (Claude Code) Must:

Generate architecture plans from specs

Write all implementation code

Create comprehensive test suites

Perform refactoring and bug fixes

Document all generated artifacts

Accountability: All AI-generated code is traceable to the human-written specification that authorized it.

3. Mandatory Traceability

Requirement: Every feature must maintain a complete audit trail:

Architecture Decision Record (ADR) — Why this approach?

Specification — What are we building?

Architecture Plan — How will we build it?

Task Breakdown — What are the specific implementation steps?

Implementation — The generated code

Test Suite — Verification of correctness

Linkage: All artifacts must cross-reference each other. ADRs link to specs, specs link to plans, plans link to tasks, tasks link to implementations.

Storage:

ADRs → history/adr/
Specs → specs/<feature>/spec.md
Plans → specs/<feature>/plan.md
Tasks → specs/<feature>/tasks.md
PHRs → history/prompts/
Code → src/ (Phase I) or frontend/, backend/ (Phase II+)
Tests → tests/ (Phase I) or frontend/tests/, backend/tests/ (Phase II+)

4. Test-First Mandate

Requirement: Testing is NOT optional.

Rules:

Tests must be generated before or immediately after implementation

Every feature must have integration tests covering user journeys

Unit tests required for complex business logic

All tests must pass before marking a feature complete

Test coverage must be maintained across refactoring

Minimum 80% code coverage target for Phase II+

Test Types by Phase:

Phase I (CLI or console): Integration tests for command flows, unit tests for core logic

Phase II (Web): API integration tests (contract testing), React component tests, E2E user journeys, authentication flow tests, user isolation tests (security critical)

Phase III+ (Distributed): Contract tests, integration tests, chaos testing

5. Evolutionary Consistency

Principle: Later phases extend but never break earlier phases.

Rules:

Phase II must support all Phase I functionality

Phase III must preserve Phase I and II semantics

Breaking changes require explicit ADR and migration plan

Domain model extensions are additive only

Verification: Regression test suites from earlier phases must continue to pass.

II. Domain Model Governance

Global Todo Domain Rules

Base Model (Phase I - Immutable):

Todo:
  - id: unique identifier
  - title: short description
  - description: detailed text (optional)
  - completed: boolean status


Phase II Extensions (Additive):

  - user_id: foreign key to users table (REQUIRED for multi-user support)
  - created_at: timestamp (ISO 8601 format)
  - updated_at: timestamp (ISO 8601 format)


Intermediate Extensions (Phase II - Optional/Future):

  - priority: enum (low, medium, high)
  - tags: list of strings
  - category: single classification


Advanced Extensions (Phase III+ - Additive):

  - due_date: optional deadline
  - recurrence: optional repeat pattern
  - reminders: list of reminder configs
  - assigned_to: user/agent reference
  - parent_id: for subtasks


Invariants:

id is immutable once assigned

user_id is immutable once assigned (Phase II+)

completed is boolean; no intermediate states

State transitions are explicit and logged

All timestamps use ISO 8601 format

All field additions must maintain backward compatibility

Semantic Consistency:

"Creating a todo" has the same meaning in CLI or console, Web UI, API, and AI agent

"Marking complete" follows identical rules across all interfaces

Search/filter/sort behavior is consistent across all phases

III. Technology Governance
Python Backend Standards (Phase I)

Requirements:

Python 3.13+ required

Type hints for all public interfaces

Modular, single-responsibility design

Separation of concerns: domain logic ≠ infrastructure

No global mutable state

Dependency injection for testability

Forbidden:

Mixing business logic with I/O operations

Hardcoded configuration values

Circular dependencies between modules

Undocumented magic numbers or strings

Phase II Technology Stack Requirements

Frontend (Next.js 16+):

App Router (NOT Pages Router)

Server Components by default

Client Components ONLY for interactivity

TypeScript strict mode enabled

Tailwind CSS for all styling

Better Auth with JWT plugin for authentication

Type-safe API client for backend communication

Forbidden:

Pages Router usage

Direct database access from frontend

Hardcoded API URLs

Inline styles or CSS modules

Unvalidated user input

Backend (FastAPI + SQLModel):

Python 3.13+ required

FastAPI framework for REST API

SQLModel ORM (NOT raw SQLAlchemy)

Pydantic v2 for request/response validation

UV package manager

Neon Serverless PostgreSQL database

OpenAPI/Swagger auto-generated documentation

JWT authentication middleware

Forbidden:

Raw SQLAlchemy usage

Hardcoded database credentials

SQL string concatenation

Synchronous blocking I/O

Authentication (Phase II)

JWT tokens, expiration 7 days, bcrypt password hashing

HTTP-only cookies (frontend)

Backend validates JWT and extracts user_id

User isolation enforced on all queries

Forbidden:

Trusting user_id from request

Exposing other users' data

Sequential/predictable IDs without checks

API-First Principles

API contracts defined before implementation

Backend-first contract implementation

Frontend consumes via type-safe client

OpenAPI/Swagger documentation

Contract-breaking changes require ADR

AI Agent Standards (Phase III+)

Natural language maps to existing Todo operations

Spec-driven agent logic

Confirmation prompts for destructive actions

Forbidden: undocumented side effects, bypassing validation, silent failures

Cloud & Kubernetes Standards (Phase IV+)

Requirements:

12-Factor App principles strictly enforced

All configuration via environment variables

Secrets stored in external secret managers (never in code/repos)

Docker images must be reproducible and minimal

Kubernetes manifests must be declarative (Helm/Kustomize)

Health checks (liveness, readiness) required

Resource limits defined for all containers

Horizontal Pod Autoscaling configured where appropriate

Forbidden:

Hard-coded credentials or API keys

Imperative kubectl commands in production

Mutable infrastructure

Unversioned Docker images (no latest tag)

Technology Stack (By Phase)
Phase I

Python 3.13+

UV package manager

pytest

In-memory storage

Console UI

Claude Code + Spec-Kit Plus

Phase II

Next.js 16+ (App Router)

FastAPI

SQLModel

Neon Serverless PostgreSQL

Better Auth (JWT-based auth)

Phase III

OpenAI ChatKit

OpenAI Agents SDK

Official MCP SDK

Stateless FastAPI backend

Persistent conversation storage

Phase IV

Docker

Minikube

Helm

kubectl-ai, kagent

Local Kubernetes deployment

Phase V

Kafka (Redpanda Cloud recommended)

Dapr (Pub/Sub, State, Bindings, Secrets)

DigitalOcean DOKS / GKE / AKS

CI/CD with GitHub Actions

Monitoring & logging

Spec-Driven Workflow (Mandatory)

IV. Repository Structure (MANDATORY)

Phase I Structure (CLI or console):

specs/001-console-todo-app/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── checklists/          # Quality checklists
│   └── requirements.md  # Spec validation checklist
└── tasks.md             # Phase 2 output (/sp.tasks command)
Source Code (phase-1-console/)
phase-1-console/
├── pyproject.toml       # UV project configuration
├── README.md            # Setup and usage instructions
├── src/
│   └── todo/
│       ├── __init__.py  # Package initialization
│       ├── main.py      # Entry point with main loop
│       ├── models.py    # Task dataclass definition
│       ├── manager.py   # TaskManager business logic
│       └── ui.py        # Menu display and input handling
└── tests/
    ├── __init__.py
    ├── test_models.py   # Task model unit tests
    ├── test_manager.py  # TaskManager unit tests
    └── test_ui.py       # UI function tests (input/output)
Structure Decision: Single project structure selected. The application is a console CLI with clear separation of concerns:

models.py: Data structures (Task dataclass)
manager.py: Business logic (CRUD operations, validation)
ui.py: Presentation (menu display, input prompts, formatting)
main.py: Application entry point and main loop.


Phase II Structure (Full-Stack Monorepo - MANDATORY):
/
├── .specify/
│   ├── memory/
│   │   └── constitution.md          # THIS FILE
│   ├── templates/                    # SDD templates
│   └── scripts/                      # Automation scripts
├── .spec-kit/
│   └── config.yaml                   # Spec-Kit configuration
├── history/
│   ├── adr/                          # Architecture Decision Records
│   │   └── NNNN-decision-title.md
│   └── prompts/                      # Prompt History Records
│       ├── constitution/
│       ├── <feature-name>/
│       └── general/
├── specs/
│   └── <feature-name>/
│       ├── spec.md                   # Feature specification
│       ├── plan.md                   # Architecture plan
│       └── tasks.md                  # Task breakdown
├── frontend/                         # Next.js App
│   ├── CLAUDE.md                     # Frontend-specific AI instructions
│   ├── app/                          # App Router (pages, layouts)
│   ├── components/                   # React components
│   ├── lib/                          # Utilities, API client
│   ├── public/                       # Static assets
│   ├── tests/                        # Frontend tests
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── next.config.ts
│   └── .env.local                    # Frontend environment variables
├── backend/                          # FastAPI App
│   ├── CLAUDE.md                     # Backend-specific AI instructions
│   ├── src/
│   │   ├── main.py                   # FastAPI entry point
│   │   ├── models/                   # SQLModel database models
│   │   ├── schemas/                  # Pydantic request/response schemas
│   │   ├── routers/                  # API route handlers
│   │   ├── middleware/               # JWT authentication middleware
│   │   ├── database.py               # Database connection
│   │   └── config.py                 # Configuration management
│   ├── tests/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── conftest.py               # Pytest fixtures
│   ├── pyproject.toml                # UV project configuration
│   ├── uv.lock                       # UV lock file
│   └── .env                          # Backend environment variables
├── docker-compose.yml                # Local development environment
├── .gitignore
├── README.md                         # Project overview and setup
└── CLAUDE.md                         # Root AI agent instructions
Enforcement: No alternative structures permitted. All new phases must follow this layout.

V. Quality Standards (Global)

Specification quality: clear problem statement, user stories, edge cases, performance, security, success metrics

Code quality: clean, readable, DRY, minimal complexity, logging, error handling

Documentation: versioned, README.md, CLAUDE.md, inline comments, API and DB docs

VI. Security & Compliance

Universal: input validation, SQL injection prevention, XSS/CSRF protection, secrets management, HTTPS/TLS

Data privacy: minimal collection, retention policies, secure deletion, privacy-by-design

Forbidden: plaintext passwords, trusting client-side validation, sensitive data leaks, deprecated crypto

VII. Phase Evolution Rules

Phase transition: previous phase complete, ADR exists, migration plan, regression tests pass

Phase independence: each phase deployable independently

Evolution path:

Phase I: CLI or console

Phase II: Full-Stack Web

Phase III: AI-Powered

Phase IV: Cloud-Native Distributed

Phase V: Enterprise Features

VIII. Workflow Enforcement

SDD Workflow: Constitution → Specify → Plan → Tasks → Implement → Record

ADR creation rules: impact, alternatives, scope (all three must be yes)

Violations invalidate the work

IX. Human-AI Collaboration Contract

Humans: architect, spec author, QA, review

AI: generate code, tests, refactor, document

Escalation: AI must ask clarifying questions, present trade-offs, or surface blockers

AI cannot auto-approve, skip testing, or make architecture decisions alone

X. Academic & Professional Integrity

Code originates from AI, guided by human specs

No plagiarism, all work reproducible

Attribution: mark AI-generated code, cite references

Educational value: students gain architecture, specification, and collaboration skills

XI. Versioning & Change Management

Constitution amendments: propose → ADR → approval → version bump

Versioning: MAJOR.MINOR.PATCH

Spec versioning: immutable, new version on changes, link to superseded versions

XII. Governance & Enforcement

Supremacy: Constitution > ADRs > Specs > Plans > Tasks > Implementation

Compliance: verify spec, plan, tasks, ADRs, tests, code review, PHRs

Enforcement: pre-commit hooks, CI/CD, AI agents refuse non-compliant requests

Review: monthly PHR/ADR audit, quarterly Constitution review, annual phase evolution assessment

XIII. Final Authority

Ratification: effective immediately

Amendment: requires ADR, justification, explicit approval

Interpretation: guided by SDD and human-AI collaboration principles

Non-compliance: work violating the Constitution must be rejected and regenerated
```

## RESPONSE_TEXT

Updated the project constitution at `.specify/memory/constitution.md` with the complete "The Evolution of Todo" constitution document. The new constitution establishes governing principles for a multi-phase educational software project teaching modern software engineering through Spec-Driven Development (SDD) and AI-assisted implementation. It includes core principles for SDD workflow, AI as primary developer, mandatory traceability, test-first mandate, and evolutionary consistency. The document also covers domain model governance, technology governance standards for different phases, repository structure requirements, quality standards, security compliance, phase evolution rules, workflow enforcement, human-AI collaboration contract, academic integrity, versioning, and governance procedures. The constitution is version 1.0.0 and was ratified on 2026-01-03.