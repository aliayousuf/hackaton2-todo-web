# API Contracts

This directory contains OpenAPI 3.0 specifications for the Task CRUD Operations with Authentication API.

## Contract Files

- `auth.openapi.yaml` - Authentication endpoints (register, login, logout)
- `tasks.openapi.yaml` - Task management endpoints (CRUD operations)
- `README.md` - This file

## Usage

### Validation
All API implementations must conform to these contracts. Use the following tools to validate:

```bash
# Using openapi-spec-validator
openapi-spec-validator auth.openapi.yaml
openapi-spec-validator tasks.openapi.yaml
```

### Code Generation
API clients and server stubs can be generated from these contracts:

```bash
# Generate TypeScript client for frontend
openapi-generator-cli generate -i tasks.openapi.yaml -g typescript-axios -o ./frontend/lib/api

# Generate FastAPI server stubs
openapi-generator-cli generate -i tasks.openapi.yaml -g python-fastapi -o ./backend/src/api
```

## Security Checklist

- [x] All endpoints requiring authentication use JWT bearer tokens
- [x] User data isolation enforced via user_id filtering
- [x] 404 responses (not 403) for unauthorized resource access
- [x] Input validation schemas defined for all request bodies
- [x] Proper error response schemas for all error cases
- [x] HttpOnly cookies for JWT storage in authentication endpoints

## Validation Rules

1. **User Isolation**: ALL task endpoints must filter by user_id from JWT token
2. **Error Handling**: Return 404 for unauthorized access (not 403) to prevent information leakage
3. **Input Validation**: All string fields must have length limits as defined in schemas
4. **Timestamps**: All datetime fields use ISO 8601 format
5. **HTTP Status Codes**: Use standard REST conventions (200, 201, 204, 400, 401, 404, 500)
6. **Authentication**: JWT tokens must be validated on all protected endpoints

## Versioning Strategy

- Contracts are versioned with the feature (1.0.0, 1.0.1, etc.)
- Breaking changes require new contract version and ADR documentation
- Backward compatibility is maintained through careful contract design
- New endpoints can be added without contract version changes
- Field additions should be optional to maintain backward compatibility