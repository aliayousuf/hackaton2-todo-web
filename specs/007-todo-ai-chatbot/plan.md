# Implementation Plan: Todo AI Chatbot (Phase-3)

**Branch**: `007-todo-ai-chatbot` | **Date**: 2026-01-13 | **Spec**: [link to spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-todo-ai-chatbot/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementation of an AI-powered conversational interface for todo management using OpenAI Agents SDK, MCP (Model Context Protocol) tools, and ChatKit UI. The system provides natural language interaction for all todo CRUD operations while maintaining a stateless server architecture with conversation persistence in the database.

## Technical Context

**Language/Version**: Python 3.13+ (backend), TypeScript 5.x (frontend)
**Primary Dependencies**: OpenAI Agents SDK, Official MCP SDK, @assistant-ui/react, FastAPI, SQLModel, Next.js 16+
**Storage**: Neon Serverless PostgreSQL database
**Testing**: pytest (backend), vitest/jest (frontend)
**Target Platform**: Web application (Linux server + browser clients)
**Project Type**: Web application (full-stack with frontend and backend)
**Performance Goals**: <3 second response time for 90% of AI interactions, support 1000 concurrent users
**Constraints**: <200ms p95 for database operations, stateless server architecture, 99.9% uptime for conversation persistence
**Scale/Scope**: Multi-tenant SaaS with user isolation, horizontal scalability

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ Principle I: Spec-Driven Development Only - Following strict SDD workflow as required
- ✅ Principle II: AI as Primary Developer - AI generates all implementation code
- ✅ Principle III: Mandatory Traceability - Maintaining complete audit trail with cross-references
- ✅ Principle IV: Test-First Mandate - Tests will be generated for all components
- ✅ Principle V: Evolutionary Consistency - Preserving Phase I and II functionality
- ✅ Principle VIII: Stateless Server Architecture - No in-memory state, all persistence in DB
- ✅ Principle IX: Tool-Driven AI Behavior (MCP) - AI agents use MCP tools for all operations
- ✅ Principle X: Conversation Persistence - All messages stored in database
- ✅ Technology Stack Compliance - Using approved technologies from constitution
- ✅ API-First Principles - Well-defined contracts before implementation

## Project Structure

### Documentation (this feature)

```text
specs/007-todo-ai-chatbot/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
│   ├── chat-api.yaml    # Chat API OpenAPI specification
│   └── mcp-tools.md     # MCP tools specification
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── main.py              # FastAPI entry point with chat endpoint
│   ├── models/
│   │   ├── todo.py          # Task model (extended from Phase-2)
│   │   ├── conversation.py  # Conversation entity
│   │   └── message.py       # Message entity
│   ├── schemas/
│   │   ├── chat.py          # Chat request/response schemas
│   │   └── conversation.py  # Conversation schemas
│   ├── routers/
│   │   └── chat.py          # Chat API endpoint
│   ├── services/
│   │   ├── agent_service.py # OpenAI agent orchestration
│   │   └── mcp_server.py    # MCP server implementation
│   ├── tools/
│   │   ├── add_task.py      # MCP tool for creating tasks
│   │   ├── list_tasks.py    # MCP tool for listing tasks
│   │   ├── complete_task.py # MCP tool for completing tasks
│   │   ├── delete_task.py   # MCP tool for deleting tasks
│   │   └── update_task.py   # MCP tool for updating tasks
│   ├── database.py          # Database connection
│   └── config.py            # Configuration management
├── tests/
│   ├── unit/
│   ├── integration/
│   └── conftest.py          # Pytest fixtures
├── pyproject.toml           # UV project configuration
├── uv.lock                  # UV lock file
└── .env                     # Backend environment variables

frontend/
├── app/
│   ├── chat/                # Chat interface page
│   │   └── page.tsx
│   └── globals.css
├── components/
│   ├── chat/
│   │   └── ChatInterface.tsx # ChatKit UI wrapper
│   └── layout/
├── lib/
│   ├── api/
│   │   └── chat.ts          # Chat API client
│   └── auth/
│       └── jwt.ts           # JWT handling for chat requests
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── .env.local               # Frontend environment variables
```

**Structure Decision**: Full-stack monorepo structure selected. The application extends the existing Phase-2 structure with:
- backend/: New chat endpoint, MCP server, and AI agent service
- frontend/: Chat interface replacing task CRUD UI with ChatKit
- All conversation persistence handled via new Conversation and Message entities

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| MCP Protocol | Auditable AI behavior | Direct AI database access would violate tool-driven mandate |
| Statelessness | Horizontal scalability | In-memory sessions would not scale horizontally |

## Implementation Phases

### Phase 3.1: Spec Creation
- Create agent behavior specification
- Create MCP tools specification with detailed input/output schemas
- Create chat API specification in OpenAPI format

### Phase 3.2: Backend Augmentation
- Integrate OpenAI Agents SDK
- Implement MCP Server using Official MCP SDK
- Create 5 MCP tools for task CRUD operations
- Add secured chat endpoint with JWT authentication
- Ensure all operations are stateless

### Phase 3.3: Conversation Persistence
- Extend database models with Conversation and Message entities
- Implement conversation history retrieval
- Store all messages (user and assistant) in database
- Rehydrate conversation context per request

### Phase 3.4: Frontend Chat UI
- Replace existing task CRUD UI with ChatKit interface
- Configure domain allowlist for security
- Attach JWT tokens to chat requests
- Maintain existing dashboard navigation

### Phase 3.5: Validation
- Verify statelessness requirement is met
- Test tool chaining and complex operations
- Validate conversation resumption across sessions
- Performance and security testing
