# Quickstart Guide: Todo AI Chatbot (Phase-3)

## Prerequisites

- Python 3.13+ with UV package manager
- Node.js 18+ with npm/yarn
- PostgreSQL 16+ (Neon Serverless recommended)
- OpenAI API key
- MCP Server dependencies

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install openai openai[mcp] fastapi sqlmodel pydantic better-auth python-jose[cryptography] python-multipart
```

### 2. Environment Variables

Create a `.env` file in the backend directory:

```env
DATABASE_URL=postgresql://user:password@localhost/dbname
OPENAI_API_KEY=your_openai_api_key_here
SECRET_KEY=your_jwt_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
MCP_SERVER_PORT=3000
```

### 3. Database Migration

```bash
# Run database migrations to create conversation and message tables
python -m src.database migrate
```

### 4. Start the Services

```bash
# Terminal 1: Start the MCP server
python -m src.services.mcp_server

# Terminal 2: Start the main FastAPI application
uvicorn src.main:app --reload --port 8000
```

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install @assistant-ui/react @assistant-ui/runtime @assistant-ui/runtime-react-core openai
```

### 2. Environment Variables

Update your `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Run the Application

```bash
npm run dev
```

## Verification Steps

### 1. Test Chat Endpoint

```bash
curl -X POST http://localhost:8000/api/user123/chat \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Create a task to buy groceries"}'
```

### 2. Test Conversation Persistence

```bash
# Create a conversation
curl -X POST http://localhost:8000/api/user123/chat \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Create a task to call mom"}'

# Continue the conversation
curl -X POST http://localhost:8000/api/user123/chat \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Show me my tasks", "conversation_id": "CONVERSATION_ID_FROM_PREVIOUS_RESPONSE"}'
```

### 3. Verify MCP Tools

Check that the MCP server is running and tools are available:

```bash
# Check MCP server status
curl http://localhost:3000/health

# Verify tools are registered
python -c "from src.tools.add_task import add_task_tool; print(add_task_tool.name)"
```

## Acceptance Test Scenarios

### Scenario 1: Natural Language Task Creation
1. User sends message: "Create a task to finish the report by Friday"
2. Expected: AI agent creates task with appropriate title and due date
3. Verify: Task appears in user's task list

### Scenario 2: Task Listing via Chat
1. User sends message: "Show me my tasks"
2. Expected: AI agent retrieves and displays user's task list
3. Verify: Correct tasks are returned

### Scenario 3: Task Completion via Chat
1. User sends message: "Mark 'buy groceries' as completed"
2. Expected: AI agent marks task as completed
3. Verify: Task status is updated in database

### Scenario 4: Conversation Continuity
1. User starts conversation and creates tasks
2. User ends session and returns later
3. Expected: Previous conversation context is preserved
4. Verify: User can reference previous interactions

### Scenario 5: User Isolation
1. User A creates tasks and conversations
2. User B accesses the system
3. Expected: User B cannot access User A's data
4. Verify: Proper user isolation maintained

## Troubleshooting

### Common Issues

**Issue**: MCP server not connecting to main API
- **Solution**: Verify MCP server is running on correct port and main API can reach it
- **Check**: Environment variables for MCP server URL

**Issue**: JWT authentication failing
- **Solution**: Verify JWT token is properly formatted and not expired
- **Check**: Secret key matches between frontend and backend

**Issue**: AI agent not calling MCP tools
- **Solution**: Verify tool schemas are correct and tools are properly registered
- **Check**: MCP server is accessible and tools are registered

**Issue**: Conversation history not persisting
- **Solution**: Verify database migrations ran correctly
- **Check**: Database connection and permissions

**Issue**: Rate limiting errors from OpenAI
- **Solution**: Check API key quota and rate limits
- **Check**: Implement proper retry logic with exponential backoff

### Debugging Tips

1. Enable detailed logging in both main API and MCP server
2. Monitor database connections and queries
3. Check MCP tool call logs for debugging
4. Verify JWT token contents with online decoders

### Performance Monitoring

1. Monitor API response times for chat endpoint
2. Track database query performance
3. Monitor AI agent response times
4. Check memory usage with stateless architecture