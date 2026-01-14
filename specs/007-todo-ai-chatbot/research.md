# Research: Todo AI Chatbot (Phase-3)

## Technology Selection

### OpenAI Agents SDK
**Decision**: Selected OpenAI Agents SDK for AI orchestration
**Rationale**: Provides robust framework for creating AI agents that can use tools, maintains conversation context, and integrates well with existing OpenAI ecosystem
**Alternatives considered**:
- LangChain - More complex for this use case
- Custom agent implementation - Would require significant development effort

### Official MCP SDK
**Decision**: Selected Official MCP SDK for tool protocol implementation
**Rationale**: Standardized protocol for AI agents to interact with external tools, provides security and auditability as required by constitution
**Alternatives considered**:
- Custom tool protocol - Would lack standardization and security features
- LangChain tools - Not compatible with OpenAI Agents SDK

### @assistant-ui/react
**Decision**: Selected @assistant-ui/react (ChatKit) for frontend chat UI
**Rationale**: Provides pre-built, accessible chat interface components that integrate well with AI services
**Alternatives considered**:
- Building custom chat UI - Would require significant frontend development
- Third-party chat widgets - Less customizable and may not meet security requirements

### SQLModel + PostgreSQL
**Decision**: Extending existing SQLModel + Neon PostgreSQL for conversation persistence
**Rationale**: Consistent with existing Phase-2 architecture, provides ACID transactions and good performance
**Alternatives considered**:
- MongoDB - Would introduce new technology stack
- In-memory storage - Would violate statelessness requirement

### API Design
**Decision**: Single POST /api/{user_id}/chat endpoint
**Rationale**: Simple, secure design that includes user_id in path for proper isolation
**Alternatives considered**:
- Multiple endpoints per operation - Would complicate the API unnecessarily
- WebSocket connections - Not needed for this use case, HTTP is sufficient

## Security Considerations

### JWT Authentication
**Decision**: Extending existing JWT authentication for chat endpoint
**Rationale**: Consistent with existing Phase-2 security model, provides proper user isolation
**Implementation**: JWT token validated on each chat request to extract user_id

### MCP Tool Security
**Decision**: All MCP tools require explicit user_id parameter
**Rationale**: Ensures proper data isolation and prevents users from accessing others' data
**Implementation**: Each MCP tool validates that operations are performed on user's own data

## Performance Considerations

### Statelessness
**Decision**: Strictly stateless server architecture
**Rationale**: Enables horizontal scalability and fault tolerance as required by constitution
**Implementation**: All conversation state stored in database, no server-side session storage

### Caching Strategy
**Decision**: Minimal server-side caching, rely on database performance
**Rationale**: Maintains consistency with stateless architecture
**Implementation**: Leverage PostgreSQL performance optimizations and indexing

## Scalability Planning

### Horizontal Scaling
**Decision**: Designed for horizontal scaling with stateless architecture
**Rationale**: Required by constitution principle for production readiness
**Implementation**: No shared server state, all data persisted in database

### Database Optimization
**Decision**: Proper indexing on conversation and message tables
**Rationale**: Ensures performance as conversation history grows
**Implementation**: Indexes on user_id, conversation_id, and timestamps