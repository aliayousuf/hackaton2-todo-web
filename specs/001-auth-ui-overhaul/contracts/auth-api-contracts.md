# Authentication API Contracts

## Overview
API contracts for authentication endpoints that the UI components interact with.

## User Registration

### POST /api/auth/register

#### Description
Registers a new user account with the provided credentials.

#### Request
- **Method**: POST
- **Endpoint**: `/api/auth/register`
- **Content-Type**: `application/json`
- **Authentication**: None (public endpoint)

##### Request Body
```json
{
  "email": "string (required)",
  "password": "string (required, min 8 characters)"
}
```

#### Responses
- **200 OK**: User registered successfully
- **400 Bad Request**: Invalid input (validation errors)
- **409 Conflict**: User already exists

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "string",
    "email": "string",
    "created_at": "string (ISO 8601)",
    "updated_at": "string (ISO 8601)"
  }
}
```

### Error Response (400/409)
```json
{
  "success": false,
  "detail": "Error message describing the issue"
}
```

## User Login

### POST /api/auth/login

#### Description
Authenticates a user with their credentials and returns an access token.

#### Request
- **Method**: POST
- **Endpoint**: `/api/auth/login`
- **Content-Type**: `application/json`
- **Authentication**: None (public endpoint)

##### Request Body
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

#### Responses
- **200 OK**: Login successful
- **401 Unauthorized**: Invalid credentials

### Success Response (200 OK)
```json
{
  "success": true,
  "access_token": "string (JWT token)",
  "token_type": "string (typically 'bearer')",
  "user": {
    "id": "string",
    "email": "string",
    "created_at": "string (ISO 8601)",
    "updated_at": "string (ISO 8601)"
  }
}
```

### Error Response (401)
```json
{
  "success": false,
  "detail": "Invalid email or password"
}
```

## User Logout

### POST /api/auth/logout

#### Description
Logs out the current user (client-side token removal).

#### Request
- **Method**: POST
- **Endpoint**: `/api/auth/logout`
- **Authentication**: None (client-side operation)

#### Responses
- **200 OK**: Logout successful

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Successfully logged out"
}
```

## Authentication Headers

For protected endpoints that require authentication:

### Authorization Header
```
Authorization: Bearer {access_token}
```

Where `{access_token}` is the JWT token received from the login endpoint.

## Validation Rules

### Email Format
- Must conform to RFC 5322 standard
- Example: `user@example.com`

### Password Requirements
- Minimum length: 8 characters
- Should contain a mix of letters, numbers, and special characters (recommended)

## Error Response Format

All error responses follow this format:
```json
{
  "success": false,
  "detail": "Descriptive error message"
}
```