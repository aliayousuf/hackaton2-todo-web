# Authentication API Contracts

## Overview
This document outlines the API contracts for authentication functionality. Since the split-screen UI feature is a presentation-layer change, the underlying API contracts remain unchanged.

## Existing Authentication Endpoints

### POST /api/auth/login
**Purpose**: Authenticate user credentials and return session token

**Request**:
```json
{
  "email": "string (valid email format)",
  "password": "string (min 8 characters)"
}
```

**Response (Success)**:
```json
{
  "success": true,
  "token": "JWT token string",
  "user": {
    "id": "string",
    "email": "string"
  }
}
```

**Response (Error)**:
```json
{
  "success": false,
  "error": "string (error message)"
}
```

### POST /api/auth/register
**Purpose**: Create new user account

**Request**:
```json
{
  "email": "string (valid email format)",
  "password": "string (min 8 characters)"
}
```

**Response (Success)**:
```json
{
  "success": true,
  "message": "string (confirmation message)"
}
```

**Response (Error)**:
```json
{
  "success": false,
  "error": "string (error message)"
}
```

### POST /api/auth/logout
**Purpose**: End user session

**Request**: None required (uses session token from headers)

**Response**:
```json
{
  "success": true,
  "message": "string (confirmation message)"
}
```

## UI Layer Contracts

### Split-Screen Authentication Component Interface
**Purpose**: Define the interface for the new split-screen authentication UI

**Props**:
```typescript
interface SplitScreenAuthProps {
  mode: 'login' | 'register';
  onSuccess: () => void;
  onError: (error: string) => void;
  leftPanelConfig: {
    backgroundColor: string; // Tailwind CSS class
    welcomeText: string;
    showGeometricShapes: boolean;
  };
  rightPanelConfig: {
    title: string;
    buttonText: string;
    footerText: string;
    footerLink: string;
    footerLinkText: string;
  };
}
```

## Compatibility Requirements

1. All existing API endpoints must continue to function as before
2. Authentication logic and validation remain unchanged
3. Session management and token handling remain unchanged
4. Error handling and messaging remain consistent with existing patterns
5. User data persistence and security measures remain unchanged

## Validation

- All existing authentication tests must continue to pass
- No breaking changes to authentication API contracts
- Backward compatibility maintained for all client integrations