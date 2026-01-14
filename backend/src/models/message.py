from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, TYPE_CHECKING, List
import uuid

if TYPE_CHECKING:
    from .conversation import Conversation

class MessageType(str):
    USER = "user"
    ASSISTANT = "assistant"


class Message(SQLModel, table=True):
    __tablename__ = "messages"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    conversation_id: str = Field(foreign_key="conversations.id")
    user_id: uuid.UUID = Field(foreign_key="users.id")
    role: str = Field(max_length=20)  # "user" or "assistant"
    content: str = Field(sa_column_kwargs={"nullable": False})
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship
    conversation: "Conversation" = Relationship(back_populates="messages")


class MessageCreate(SQLModel):
    conversation_id: str
    user_id: str
    role: str
    content: str


class MessageRead(SQLModel):
    id: str
    conversation_id: str
    user_id: str
    role: str
    content: str
    created_at: datetime