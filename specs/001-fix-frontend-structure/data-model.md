# Data Model: Frontend Structure and UI Fixes

## Entities

### Task (UI Component State)
- **id**: number (unique identifier for the task)
- **user_id**: string (UUID of the user who owns the task)
- **title**: string (short description of the task)
- **description**: string | undefined (detailed text description, optional)
- **completed**: boolean (completion status)
- **created_at**: string (ISO date string for creation timestamp)
- **updated_at**: string (ISO date string for last update timestamp)

### UI Component State
- **tasks**: Task[] (array of tasks managed in component state)
- **loading**: boolean (loading state for API requests)
- **error**: string | null (error messages for UI display)
- **isEditing**: boolean (edit mode flag for individual tasks)
- **editTitle**: string (temporary title during editing)
- **editDescription**: string (temporary description during editing)

## Validation Rules
- Task titles must not be empty when creating or updating
- User ID must be validated for access control
- Task completion status can only be boolean values
- Timestamps must be in ISO 8601 format

## State Transitions
- Task creation: New task added to state with default values
- Task completion: `completed` property toggles between true/false
- Task editing: `isEditing` flag toggles, component switches between display/edit views
- Task deletion: Task removed from local state and remote API
- Error handling: Error state activated, displayed to user, cleared on action