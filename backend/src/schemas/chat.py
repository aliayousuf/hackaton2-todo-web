from pydantic import BaseModel
from typing import Optional, List
import uuid


class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    conversation_id: str
    tool_calls: Optional[List[dict]] = []


class ConversationHistoryResponse(BaseModel):
    conversation_id: str
    messages: List[dict]