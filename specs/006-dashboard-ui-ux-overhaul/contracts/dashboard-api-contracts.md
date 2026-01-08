# Dashboard API Contracts

## Overview
API contracts for dashboard endpoints that the UI components interact with. These define the data "Source of Truth" for the dashboard functionality.

## Task Endpoints

### GET /api/tasks
**Description**: Retrieve all tasks for the authenticated user.

**Request**:
- **Method**: GET
- **Endpoint**: `/api/tasks`
- **Authentication**: JWT token (required)
- **Headers**:
  ```
  Authorization: Bearer {access_token}
  ```

**Responses**:
- **200 OK**: Successfully retrieved tasks
- **401 Unauthorized**: Invalid or missing token
- **500 Internal Server Error**: Server error

**Success Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": "string (UUID)",
      "title": "string (task title)",
      "description": "string (optional)",
      "completed": false,
      "created_at": "string (ISO 8601 format)",
      "updated_at": "string (ISO 8601 format)"
    }
  ]
}
```

### POST /api/tasks
**Description**: Create a new task for the authenticated user.

**Request**:
- **Method**: POST
- **Endpoint**: `/api/tasks`
- **Content-Type**: `application/json`
- **Authentication**: JWT token (required)
- **Headers**:
  ```
  Authorization: Bearer {access_token}
  ```

**Request Body**:
```json
{
  "title": "string (required, 1-200 characters)",
  "description": "string (optional, max 1000 characters)"
}
```

**Responses**:
- **201 Created**: Task created successfully
- **400 Bad Request**: Validation errors
- **401 Unauthorized**: Invalid or missing token
- **500 Internal Server Error**: Server error

**Success Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": "string (UUID)",
    "title": "string (task title)",
    "description": "string (optional)",
    "completed": false,
    "created_at": "string (ISO 8601 format)",
    "updated_at": "string (ISO 8601 format)"
  }
}
```

### PUT /api/tasks/{task_id}
**Description**: Update an existing task for the authenticated user.

**Request**:
- **Method**: PUT
- **Endpoint**: `/api/tasks/{task_id}`
- **Content-Type**: `application/json`
- **Authentication**: JWT token (required)
- **Headers**:
  ```
  Authorization: Bearer {access_token}
  ```

**Request Body**:
```json
{
  "title": "string (optional, 1-200 characters)",
  "description": "string (optional, max 1000 characters)",
  "completed": "boolean (optional)"
}
```

**Responses**:
- **200 OK**: Task updated successfully
- **400 Bad Request**: Validation errors
- **401 Unauthorized**: Invalid or missing token
- **404 Not Found**: Task not found
- **500 Internal Server Error**: Server error

**Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": "string (UUID)",
    "title": "string (task title)",
    "description": "string (optional)",
    "completed": false,
    "created_at": "string (ISO 8601 format)",
    "updated_at": "string (ISO 8601 format)"
  }
}
```

### DELETE /api/tasks/{task_id}
**Description**: Delete a task for the authenticated user.

**Request**:
- **Method**: DELETE
- **Endpoint**: `/api/tasks/{task_id}`
- **Authentication**: JWT token (required)
- **Headers**:
  ```
  Authorization: Bearer {access_token}
  ```

**Responses**:
- **200 OK**: Task deleted successfully
- **401 Unauthorized**: Invalid or missing token
- **404 Not Found**: Task not found
- **500 Internal Server Error**: Server error

**Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

## User Authentication

### GET /api/auth/me
**Description**: Get current user information.

**Request**:
- **Method**: GET
- **Endpoint**: `/api/auth/me`
- **Authentication**: JWT token (required)
- **Headers**:
  ```
  Authorization: Bearer {access_token}
  ```

**Responses**:
- **200 OK**: User information retrieved successfully
- **401 Unauthorized**: Invalid or missing token

**Success Response (200 OK)**:
```json
{
  "success": true,
  "user": {
    "id": "string (UUID)",
    "email": "string (email address)",
    "created_at": "string (ISO 8601 format)",
    "updated_at": "string (ISO 8601 format)"
  }
}
```

## Validation Rules

### Task Title
- Minimum length: 1 character
- Maximum length: 200 characters
- Must not be empty

### Task Description
- Maximum length: 1000 characters
- Optional field

### Task ID
- Must be a valid integer
- Must belong to the authenticated user

## Error Response Format

All error responses follow this format:
```json
{
  "success": false,
  "error": "Descriptive error message"
}
```

## Data Model Consistency

### Task Entity
The frontend Task type must match the backend schema:
- id: number (unique identifier)
- user_id: string (UUID as string)
- title: string (1-200 characters)
- description: string | undefined (optional, max 1000 characters)
- completed: boolean (default false)
- created_at: string (ISO 8601 format timestamp)
- updated_at: string (ISO 8601 format timestamp)

## Authentication Headers

For protected endpoints that require authentication:
```
Authorization: Bearer {access_token}
```

Where `{access_token}` is the JWT token received from the authentication endpoint.

## Response Consistency

### Success Responses
All successful responses follow the pattern:
- `success`: boolean indicating success
- `data`: object containing the requested data (for GET/POST/PUT)
- `message`: string with success message (for DELETE operations)

### Data Consistency
- All timestamps use ISO 8601 format
- User IDs are consistently represented as UUID strings
- Task completion status is always a boolean value
- All API responses are JSON formatted