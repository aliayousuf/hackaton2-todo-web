# Data Model: Todo AI Chatbot (Phase-3)

## Entity Relationships

### Conversation Entity
**Fields**:
- id: Unique identifier (UUID/string)
- user_id: Foreign key to users table (required for user isolation)
- created_at: Timestamp of conversation creation (ISO 8601 format)
- updated_at: Timestamp of last conversation activity (ISO 8601 format)

**Relationships**:
- Belongs to: User (many conversations per user)
- Has many: Messages (one conversation contains many messages)

**Validation rules**:
- user_id must reference valid user
- created_at and updated_at automatically managed by system
- Each conversation belongs to exactly one user

### Message Entity
**Fields**:
- id: Unique identifier (UUID/string)
- conversation_id: Foreign key to conversation table (required)
- user_id: Foreign key to users table (for data isolation)
- role: String enum (user | assistant) indicating message sender
- content: Text content of the message
- created_at: Timestamp of message creation (ISO 8601 format)

**Relationships**:
- Belongs to: Conversation (each message belongs to one conversation)
- Belongs to: User (for data isolation)

**Validation rules**:
- conversation_id must reference valid conversation
- user_id must match conversation's user_id
- role must be either 'user' or 'assistant'
- content must not be empty
- created_at automatically managed by system

### Task Entity (Extended from Phase-2)
**Fields** (existing from Phase-2):
- id: Unique identifier
- user_id: Foreign key to users table
- title: Short description
- description: Detailed text (optional)
- completed: Boolean status
- created_at: Timestamp (ISO 8601 format)
- updated_at: Timestamp (ISO 8601 format)

**Relationships** (unchanged from Phase-2):
- Belongs to: User (for data isolation)

**Validation rules** (unchanged from Phase-2):
- user_id must reference valid user
- All existing validation rules maintained

## State Transitions

### Message Lifecycle
1. **Creation**: User sends message → Message entity created with role='user'
2. **Processing**: AI agent processes message and generates response
3. **Response**: Assistant response saved as Message entity with role='assistant'

### Task State Transitions (from Phase-2)
- **Active** ↔ **Completed**: Via complete_task MCP tool
- **Creation**: Via add_task MCP tool
- **Modification**: Via update_task MCP tool
- **Deletion**: Via delete_task MCP tool

## Database Schema

```sql
-- Conversation table
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_created_at ON conversations(created_at);

-- Message table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id),
    user_id UUID NOT NULL REFERENCES users(id),
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_messages_role ON messages(role);
CREATE INDEX idx_messages_created_at ON messages(created_at);
```

## Migration Strategy

### From Phase-2 to Phase-3
1. **Schema changes**: Add conversations and messages tables
2. **No changes to existing tables**: Task and user tables remain unchanged
3. **Foreign key constraints**: Ensure proper user isolation
4. **Index creation**: Optimize for common query patterns

### Data Migration
- **Existing data**: No migration needed for existing task/user data
- **New data**: Conversations and messages created dynamically by users
- **Permissions**: Existing user permissions remain unchanged

## Query Patterns

### Common Queries
1. **Get conversation history**: Retrieve all messages for a specific conversation
2. **User's conversations**: List all conversations for a specific user
3. **Recent messages**: Get latest messages for conversation continuity
4. **Task operations**: All existing Phase-2 task queries remain unchanged

### Performance Considerations
- **Pagination**: Implement pagination for conversation history
- **Caching**: Consider caching strategies for frequently accessed conversations
- **Archiving**: Plan for archiving old conversations to maintain performance