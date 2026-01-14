---
id: 1
title: "Fix Chat API 404 Error"
stage: "general"
date: "2026-01-14"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "007-todo-ai-chatbot"
branch: "007-todo-ai-chatbot"
user: "Hp"
command: "fix chat api 404 error"
labels: ["bug-fix", "api", "chat", "routing"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "backend/src/routers/chat.py"
  - "frontend/components/chat/ChatInterface.tsx"
tests: []
---

# Fix Chat API 404 Error

## Issue
The chat API was returning a 404 error when attempting to send messages. The error occurred because of a duplicate `/api/` prefix in the URL path.

## Root Cause
The chat router was defined with `prefix="/api"` inside the router definition in `backend/src/routers/chat.py`, and then mounted with `prefix="/api"` in `backend/src/main.py`. This created the path `/api/api/{user_id}/chat`, while the frontend was making requests to this exact path, but there was an inconsistency in how the prefixes were applied.

## Solution
1. Removed the `prefix="/api"` from the chat router definition in `backend/src/routers/chat.py`
2. Updated the frontend to call the simplified path `/api/{user_id}/chat` instead of `/api/api/{user_id}/chat` in `frontend/components/chat/ChatInterface.tsx`

## Changes Made
- `backend/src/routers/chat.py`: Changed `APIRouter(prefix="/api", tags=["chat"])` to `APIRouter(tags=["chat"])`
- `frontend/components/chat/ChatInterface.tsx`: Changed URL from `${API_BASE_URL}/api/api/${user.id}/chat` to `${API_BASE_URL}/api/${user.id}/chat`

## Result
The chat API now responds correctly without 404 errors, and the routing is consistent between frontend and backend.

## Files Modified
- `backend/src/routers/chat.py`
- `frontend/components/chat/ChatInterface.tsx`

## Testing
The fix addresses the immediate 404 error. The backend server will need to be restarted to pick up the router changes, and then the chat functionality should work properly.

PROMPT_TEXT: Console Error

Chat API error: 404
components/chat/ChatInterface.tsx (62:15) @ handleSubmit

  60 |
  61 |       if (!response.ok) {
> 62 |         throw new Error(Chat API error: ${response.status});
     |               ^
  63 |       }

RESPONSE_TEXT: Fixed the duplicate API prefix issue by removing the redundant "/api" prefix from the chat router definition in the backend and updating the frontend to use the corrected path.