from fastapi import APIRouter, Depends, HTTPException, status
from typing import Optional
from uuid import UUID
from sqlmodel import Session
import uuid

from ..models.user import User
from ..schemas.chat import ChatRequest, ChatResponse, ConversationHistoryResponse
from ..schemas.conversation import ConversationCreate, Conversation, MessageCreate, Message
from ..models.conversation import Conversation as ConversationModel
from ..models.message import Message as MessageModel, MessageType
from ..database import get_session
from ..middleware.auth import get_current_user
from ..services.agent_service import agent_service


router = APIRouter(tags=["chat"])


@router.post("/{user_id}/chat", response_model=ChatResponse)
async def chat_endpoint(
    user_id: str,
    chat_request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """
    Main chat endpoint that processes user messages and returns AI responses.
    This implements the required chat flow:
    1. Receive user message
    2. Fetch conversation history from DB
    3. Store user message
    4. Run agent with MCP tools
    5. Execute tool calls
    6. Store assistant response
    7. Return response to frontend
    """
    try:
        # Validate user_id format
        try:
            UUID(user_id)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid user ID format"
            )

        # Validate that the user_id in the path matches the authenticated user
        user_id_uuid = UUID(user_id)
        if current_user.id != user_id_uuid:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: user ID mismatch"
            )

        # Get or create conversation
        conversation_id = chat_request.conversation_id

        # Validate conversation_id if provided
        if conversation_id:
            try:
                UUID(conversation_id)
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid conversation ID format"
                )

        if not conversation_id:
            # Create new conversation
            conversation = ConversationModel(
                id=str(uuid.uuid4()),
                user_id=user_id
            )
            db.add(conversation)
            db.commit()
            db.refresh(conversation)
            conversation_id = conversation.id
        else:
            # Validate conversation belongs to user
            conversation = db.get(ConversationModel, conversation_id)
            if not conversation or str(conversation.user_id) != str(user_id_uuid):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Access denied or conversation not found"
                )

        # Store user message
        user_message = MessageModel(
            id=str(uuid.uuid4()),
            conversation_id=conversation_id,
            user_id=user_id,
            role=MessageType.USER,
            content=chat_request.message
        )
        db.add(user_message)
        db.commit()

        # Fetch conversation history
        conversation_messages = db.query(MessageModel).filter(
            MessageModel.conversation_id == conversation_id
        ).order_by(MessageModel.created_at).all()

        # Format history for the agent
        history_for_agent = []
        for msg in conversation_messages:
            history_for_agent.append({
                "role": msg.role,
                "content": msg.content
            })

        # Process message with AI agent
        agent_result = agent_service.process_message(
            user_id=user_id,
            message=chat_request.message,
            conversation_history=history_for_agent[:-1]  # Exclude the current message we just added
        )

        # Store assistant response
        assistant_message = MessageModel(
            id=str(uuid.uuid4()),
            conversation_id=conversation_id,
            user_id=user_id,
            role=MessageType.ASSISTANT,
            content=agent_result["response"]
        )
        db.add(assistant_message)
        db.commit()

        # Update conversation timestamp
        from datetime import datetime
        conversation.updated_at = datetime.utcnow()
        db.add(conversation)
        db.commit()

        return ChatResponse(
            response=agent_result["response"],
            conversation_id=conversation_id,
            tool_calls=agent_result.get("tool_calls", [])
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


@router.get("/{user_id}/conversations", response_model=list[Conversation])
async def list_user_conversations(
    user_id: str,
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_session)
):
    """
    List all conversations for a user.
    """
    try:
        user_id_uuid = UUID(user_id)

        # Validate that the user_id in the path matches the authenticated user
        if current_user.id != user_id_uuid:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: user ID mismatch"
            )

        conversations = db.query(ConversationModel).filter(
            ConversationModel.user_id == user_id_uuid
        ).offset(skip).limit(limit).all()

        return [Conversation.from_orm(conv) for conv in conversations]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/{user_id}/conversations/{conversation_id}", response_model=ConversationHistoryResponse)
async def get_conversation_history(
    user_id: str,
    conversation_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """
    Get conversation history for a specific conversation.
    """
    try:
        user_id_uuid = UUID(user_id)
        conversation_id_uuid = UUID(conversation_id)

        # Validate that the user_id in the path matches the authenticated user
        if current_user.id != user_id_uuid:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: user ID mismatch"
            )

        # Verify conversation belongs to user
        conversation = db.get(ConversationModel, conversation_id_uuid)
        if not conversation or conversation.user_id != user_id_uuid:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied or conversation not found"
            )

        # Get messages for the conversation
        messages = db.query(MessageModel).filter(
            MessageModel.conversation_id == conversation_id_uuid
        ).order_by(MessageModel.created_at).all()

        message_dicts = []
        for msg in messages:
            message_dicts.append({
                "id": msg.id,
                "role": msg.role,
                "content": msg.content,
                "created_at": msg.created_at.isoformat()
            })

        return ConversationHistoryResponse(
            conversation_id=conversation_id_uuid,
            messages=message_dicts
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


from sqlalchemy import func