'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Send, Bot, User } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

const ChatInterface = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const { user, token, loading } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const findValidConversationId = (): string | undefined => {
    // Use the current conversation ID if we have one
    if (currentConversationId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(currentConversationId)) {
      return currentConversationId;
    }
    return undefined;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !user?.id || isLoading) return;

    // Validate user ID format
    if (!user.id || typeof user.id !== 'string' || user.id.trim() === '') {
      console.error('Invalid user ID:', user?.id);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Authentication error: Invalid user ID. Please log out and log back in.',
        createdAt: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      createdAt: new Date(),
    };

    // Add user message to UI immediately
    setMessages(prev => [...prev, userMessage]);
    const tempInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      // Call the chat API
      const url = `${API_BASE_URL}/api/${user.id}/chat`;
      console.log('Making chat API request to:', url);

      // We should only send conversation_id if we have a valid one from a previous response
      // For the first message in a session, we don't send conversation_id
      const requestBody: any = {
        message: tempInput
      };

      // Only include conversation_id if we have a valid UUID-like conversation ID stored
      if (messages.length > 0) {
        // Look for a conversation ID in our messages (should be from a previous response)
        // We'll use a state variable to track the conversation ID for this session
        const validConversationId = findValidConversationId();
        if (validConversationId) {
          requestBody.conversation_id = validConversationId;
        }
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Chat API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Chat API error response:', errorText);
        throw new Error(`Chat API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      // Store the conversation ID from the response to use for subsequent messages
      if (data.conversation_id) {
        setCurrentConversationId(data.conversation_id);
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        createdAt: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      console.error('Error details:', error instanceof Error ? error.message : String(error));

      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `Sorry, I encountered an error processing your request: ${error instanceof Error ? error.message : 'Please try again'}`,
        createdAt: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b">
        <h2 className="text-lg font-semibold text-gray-800">AI Task Assistant</h2>
        <p className="text-sm text-gray-600">Ask me to create, view, update, or manage your tasks</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 min-h-[400px] max-h-[60vh]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <Bot className="w-12 h-12 mb-3 text-gray-400" />
            <h3 className="text-lg font-medium mb-1">Welcome to your AI Task Assistant!</h3>
            <p className="max-w-md">I can help you manage your tasks using natural language. Try saying:</p>
            <ul className="mt-2 text-left list-disc list-inside text-sm space-y-1">
              <li>"Create a task to buy groceries"</li>
              <li>"Show me my tasks"</li>
              <li>"Mark the meeting task as completed"</li>
              <li>"Update the project deadline"</li>
            </ul>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.role === 'assistant' ? (
                    <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  ) : (
                    <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 rounded-lg px-4 py-2 max-w-[80%]">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div className="animate-pulse">Thinking...</div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t bg-white p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask me to create, view, or manage your tasks..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading || !user?.id}
            className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {user?.id
            ? "Connected to your account"
            : "Please log in to use the AI assistant"}
        </p>
      </form>
    </div>
  );
};

export default ChatInterface;