from typing import Dict, Any, List
from openai import OpenAI
import os
import json
from ..tools.add_task import add_task_tool
from ..tools.list_tasks import list_tasks_tool
from ..tools.complete_task import complete_task_tool
from ..tools.update_task import update_task_tool
from ..tools.delete_task import delete_task_tool


class AgentService:
    def __init__(self):
        # Use Google Gemini API directly (as requested)
        google_api_key = os.getenv("GOOGLE_API_KEY")
        if google_api_key:
            # Configure OpenAI client to use Google's Gemini API endpoint
            self.client = OpenAI(
                api_key=google_api_key,
                base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
            )
        else:
            print("Warning: No Google API key found. AI functionality will be limited.")
            self.client = None

        # Register MCP tools
        self.tools_map = {
            "add_task": add_task_tool,
            "list_tasks": list_tasks_tool,
            "complete_task": complete_task_tool,
            "update_task": update_task_tool,
            "delete_task": delete_task_tool
        }

    def process_message(self, user_id: str, message: str, conversation_history: List[Dict[str, str]]) -> Dict[str, Any]:
        """
        Process a user message using the AI agent with MCP tools.

        Args:
            user_id: The ID of the user
            message: The user's message
            conversation_history: The conversation history

        Returns:
            Dictionary with response and tool calls
        """
        # If no OpenAI client is available, return a mock response
        if self.client is None:
            # For demonstration purposes, we'll simulate a simple response
            # In a real application, you might want to implement a simpler fallback
            return {
                "response": f"Demo mode: I received your message '{message}'. In production, I would connect to OpenAI to process this.",
                "tool_calls": []
            }

        try:
            # Prepare messages for the AI agent
            system_prompt = """You are an AI assistant that helps users manage their tasks through natural language.
            You can create, view, update, complete, and delete tasks. Always use the provided tools to perform these operations.
            Be helpful and confirm actions with the user."""

            messages = [
                {"role": "system", "content": system_prompt}
            ]

            # Add conversation history
            for msg in conversation_history:
                messages.append({"role": msg["role"], "content": msg["content"]})

            # Add the current user message
            messages.append({"role": "user", "content": message})

            # Define the tools that the agent can use - simplified for Google Gemini compatibility
            tools = [
                {
                    "type": "function",
                    "function": {
                        "name": "add_task",
                        "description": "Create a new task",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "user_id": {"type": "string", "description": "The ID of the user creating the task"},
                                "title": {"type": "string", "description": "The title of the task"},
                                "description": {"type": "string", "description": "Optional detailed description of the task"}
                            },
                            "required": ["user_id", "title"]
                        }
                    }
                },
                {
                    "type": "function",
                    "function": {
                        "name": "list_tasks",
                        "description": "Retrieve all tasks for the user",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "user_id": {"type": "string", "description": "The ID of the user whose tasks to retrieve"},
                                "filter": {
                                    "type": "string",
                                    "enum": ["all", "completed", "pending"],
                                    "description": "Filter for task completion status",
                                    "default": "all"
                                }
                            },
                            "required": ["user_id"]
                        }
                    }
                },
                {
                    "type": "function",
                    "function": {
                        "name": "complete_task",
                        "description": "Mark a task as completed",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "user_id": {"type": "string", "description": "The ID of the user who owns the task"},
                                "task_id": {"type": "string", "description": "The ID of the task to mark as completed"}
                            },
                            "required": ["user_id", "task_id"]
                        }
                    }
                },
                {
                    "type": "function",
                    "function": {
                        "name": "update_task",
                        "description": "Update the details of a task",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "user_id": {"type": "string", "description": "The ID of the user who owns the task"},
                                "task_id": {"type": "string", "description": "The ID of the task to update"},
                                "title": {"type": "string", "description": "New title for the task (optional)"},
                                "description": {"type": "string", "description": "New description for the task (optional)"},
                                "completed": {"type": "boolean", "description": "New completion status for the task (optional)"}
                            },
                            "required": ["user_id", "task_id"]
                        }
                    }
                },
                {
                    "type": "function",
                    "function": {
                        "name": "delete_task",
                        "description": "Delete a task",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "user_id": {"type": "string", "description": "The ID of the user who owns the task"},
                                "task_id": {"type": "string", "description": "The ID of the task to delete"}
                            },
                            "required": ["user_id", "task_id"]
                        }
                    }
                }
            ]

            # Attempt to call the Google Gemini API with tools
            try:
                response = self.client.chat.completions.create(
                    model="gemini-2.5-flash",
                    messages=messages,
                    tools=tools,
                    tool_choice="auto"
                )

                response_message = response.choices[0].message
                tool_calls = response_message.tool_calls

                # Process tool calls if any
                tool_call_results = []
                if tool_calls:
                    for tool_call in tool_calls:
                        function_name = tool_call.function.name
                        function_args = json.loads(tool_call.function.arguments)

                        # Add user_id to the function args if not already present
                        if "user_id" not in function_args:
                            function_args["user_id"] = user_id

                        # Execute the tool
                        if function_name in self.tools_map:
                            result = self.tools_map[function_name](**function_args)
                            tool_call_results.append({
                                "name": function_name,
                                "arguments": function_args,
                                "result": result
                            })

                # Generate final response based on tool results
                if tool_call_results:
                    # If there were tool calls, process the results and create an appropriate response
                    # Google Gemini API may not support the "tool" role, so we'll construct a response differently

                    # Format the tool results for the user
                    tool_results_text = ""
                    for result in tool_call_results:
                        tool_results_text += f"\nResult from {result['name']}: {result['result']}\n"

                    # Combine the original response with the tool results
                    original_response = response_message.content or ""
                    final_content = original_response + "\n\n" + tool_results_text
                else:
                    # If no tool calls, use the original response
                    final_content = response_message.content

                return {
                    "response": final_content or "I processed your request.",
                    "tool_calls": tool_call_results
                }

            except Exception as tool_exception:
                # If tool calling fails, try without tools (fallback)
                print(f"Tool calling failed: {str(tool_exception)}, attempting fallback without tools")

                # Simplified system prompt without tool instructions
                simple_system_prompt = """You are an AI assistant that helps users manage their tasks through natural language.
                If the user wants to create, view, update, complete, or delete tasks, respond with instructions for the system to handle these operations."""

                simple_messages = [
                    {"role": "system", "content": simple_system_prompt}
                ]
                for msg in conversation_history:
                    simple_messages.append({"role": msg["role"], "content": msg["content"]})
                simple_messages.append({"role": "user", "content": message})

                response = self.client.chat.completions.create(
                    model="gemini-2.5-flash",
                    messages=simple_messages
                )

                # Return a simple response indicating that task operations need to be handled separately
                return {
                    "response": response.choices[0].message.content or "I processed your request.",
                    "tool_calls": []
                }

        except Exception as e:
            # Catch any remaining exceptions
            return {
                "response": f"Sorry, I encountered an error processing your request: {str(e)}",
                "tool_calls": []
            }


# Singleton instance
agent_service = AgentService()