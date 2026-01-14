from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class ConversationBase(BaseModel):
    user_id: str


class ConversationCreate(ConversationBase):
    pass


class ConversationUpdate(BaseModel):
    pass


class Conversation(ConversationBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class MessageBase(BaseModel):
    conversation_id: str
    user_id: str
    role: str
    content: str


class MessageCreate(MessageBase):
    pass


class Message(MessageBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True


class ConversationWithMessages(Conversation):
    messages: List[Message] = []