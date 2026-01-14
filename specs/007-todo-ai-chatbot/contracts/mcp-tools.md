# MCP Tools Specification: Todo AI Chatbot (Phase-3)

## Overview

This document specifies the Model Context Protocol (MCP) tools that the AI agent will use to perform todo operations. All tools follow the stateless architecture principle and require explicit user_id for data isolation.

## Tool Specifications

### 1. add_task

**Description**: Creates a new task for the specified user.

**Input Schema**:
```json
{
  "type": "object",
  "properties": {
    "user_id": {
      "type": "string",
      "description": "The ID of the user creating the task"
    },
    "title": {
      "type": "string",
      "description": "The title of the task"
    },
    "description": {
      "type": "string",
      "description": "Optional detailed description of the task"
    }
  },
  "required": ["user_id", "title"]
}
```

**Output Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {
      "type": "boolean",
      "description": "Whether the operation was successful"
    },
    "task_id": {
      "type": "string",
      "description": "The ID of the created task"
    },
    "message": {
      "type": "string",
      "description": "A message describing the result"
    }
  },
  "required": ["success", "task_id", "message"]
}
```

**Example Usage**:
```json
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Buy groceries",
  "description": "Milk, bread, eggs"
}
```

### 2. list_tasks

**Description**: Retrieves all tasks for the specified user.

**Input Schema**:
```json
{
  "type": "object",
  "properties": {
    "user_id": {
      "type": "string",
      "description": "The ID of the user whose tasks to retrieve"
    },
    "filter": {
      "type": "string",
      "enum": ["all", "completed", "pending"],
      "description": "Filter for task completion status",
      "default": "all"
    }
  },
  "required": ["user_id"]
}
```

**Output Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {
      "type": "boolean",
      "description": "Whether the operation was successful"
    },
    "tasks": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "The task ID"
          },
          "title": {
            "type": "string",
            "description": "The task title"
          },
          "description": {
            "type": "string",
            "description": "The task description"
          },
          "completed": {
            "type": "boolean",
            "description": "Whether the task is completed"
          },
          "created_at": {
            "type": "string",
            "format": "date-time",
            "description": "When the task was created"
          },
          "updated_at": {
            "type": "string",
            "format": "date-time",
            "description": "When the task was last updated"
          }
        },
        "required": ["id", "title", "completed", "created_at", "updated_at"]
      }
    },
    "message": {
      "type": "string",
      "description": "A message describing the result"
    }
  },
  "required": ["success", "tasks", "message"]
}
```

**Example Usage**:
```json
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "filter": "pending"
}
```

### 3. complete_task

**Description**: Marks a task as completed for the specified user.

**Input Schema**:
```json
{
  "type": "object",
  "properties": {
    "user_id": {
      "type": "string",
      "description": "The ID of the user who owns the task"
    },
    "task_id": {
      "type": "string",
      "description": "The ID of the task to mark as completed"
    }
  },
  "required": ["user_id", "task_id"]
}
```

**Output Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {
      "type": "boolean",
      "description": "Whether the operation was successful"
    },
    "message": {
      "type": "string",
      "description": "A message describing the result"
    }
  },
  "required": ["success", "message"]
}
```

**Example Usage**:
```json
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "task_id": "987e6543-e21b-98d7-c432-9876543210ff"
}
```

### 4. delete_task

**Description**: Deletes a task for the specified user.

**Input Schema**:
```json
{
  "type": "object",
  "properties": {
    "user_id": {
      "type": "string",
      "description": "The ID of the user who owns the task"
    },
    "task_id": {
      "type": "string",
      "description": "The ID of the task to delete"
    }
  },
  "required": ["user_id", "task_id"]
}
```

**Output Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {
      "type": "boolean",
      "description": "Whether the operation was successful"
    },
    "message": {
      "type": "string",
      "description": "A message describing the result"
    }
  },
  "required": ["success", "message"]
}
```

**Example Usage**:
```json
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "task_id": "987e6543-e21b-98d7-c432-9876543210ff"
}
```

### 5. update_task

**Description**: Updates the details of a task for the specified user.

**Input Schema**:
```json
{
  "type": "object",
  "properties": {
    "user_id": {
      "type": "string",
      "description": "The ID of the user who owns the task"
    },
    "task_id": {
      "type": "string",
      "description": "The ID of the task to update"
    },
    "title": {
      "type": "string",
      "description": "New title for the task (optional)"
    },
    "description": {
      "type": "string",
      "description": "New description for the task (optional)"
    },
    "completed": {
      "type": "boolean",
      "description": "New completion status for the task (optional)"
    }
  },
  "required": ["user_id", "task_id"]
}
```

**Output Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {
      "type": "boolean",
      "description": "Whether the operation was successful"
    },
    "message": {
      "type": "string",
      "description": "A message describing the result"
    }
  },
  "required": ["success", "message"]
}
```

**Example Usage**:
```json
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "task_id": "987e6543-e21b-98d7-c432-9876543210ff",
  "title": "Buy groceries and household items"
}
```

## Security Requirements

1. **User Isolation**: Each tool must validate that the user_id matches the owner of any resources being accessed or modified.
2. **Authorization**: Tools must only be callable by the AI agent through the MCP protocol.
3. **Input Validation**: All inputs must be validated to prevent injection attacks.
4. **Audit Trail**: All tool calls should be logged for debugging and monitoring.

## Error Handling

All tools should return appropriate error messages when:
- Invalid user_id is provided
- Resource not found (e.g., task_id doesn't exist)
- Permission denied (user doesn't own the resource)
- Unexpected server errors occur

## Performance Considerations

- Tools should be designed for low-latency execution
- Database queries should be optimized with proper indexing
- Tools should handle concurrent requests appropriately