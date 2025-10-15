"""
FastAPI server for AI agents with multi-agent support.
"""
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import uvicorn
import os
import json
import asyncio
import sys
from dotenv import load_dotenv
from typing import Dict, Optional, List
# from pocketbase import PocketBase  # Placeholder - not using PocketBase yet
# from pocketbase.client import ClientResponseError
from pydantic_ai.messages import ModelMessage, ModelRequest, ModelResponse, UserPromptPart, TextPart
from pydantic_ai.messages import (
    PartStartEvent,
    PartDeltaEvent,
    ThinkingPart,
    ThinkingPartDelta,
    TextPartDelta,
    FunctionToolCallEvent,
    FunctionToolResultEvent
)

# Load environment variables
load_dotenv()

app = FastAPI(title="TwoFeetUp Agent API", version="0.2.0")

# Global PocketBase client (placeholder)
pb_client: Optional[any] = None  # Placeholder - will use PocketBase later

# Agent registry
class AgentRegistry:
    """Simple agent registry for managing multiple agents."""
    def __init__(self):
        self._agents: Dict[str, any] = {}
        self._initialized = False

    def register(self, name: str, agent_instance):
        """Register an agent."""
        self._agents[name] = agent_instance

    def get(self, name: str):
        """Get agent by name."""
        return self._agents.get(name)

    def list(self):
        """List all registered agent names."""
        return list(self._agents.keys())

    def items(self):
        """Get all agents."""
        return self._agents.items()

# Global registry
registry = AgentRegistry()

# Default agent from environment or fallback
DEFAULT_AGENT = os.getenv("DEFAULT_AGENT", "event-planner")

@app.on_event("startup")
async def startup_event():
    """Initialize all agents on startup."""
    global pb_client

    print("Skipping PocketBase initialization (placeholder for now)...")
    pb_client = None  # Placeholder

    print("Initializing agents...")
    try:
        # Import all agents
        from pydantic_agents.clients.default.agents.contract_clearance.agent import contract_clearance_agent
        from pydantic_agents.clients.default.agents.event_planner.agent import event_planner_agent
        from pydantic_agents.clients.default.agents.event_contract_assistant.agent import event_contract_assistant_agent
        from pydantic_agents.clients.default.agents.marketing_communicatie.agent import marketing_communicatie_agent
        from pydantic_agents.clients.default.agents.community_member import CommunityMemberAgent

        # Register agents (using hyphenated names for frontend compatibility)
        registry.register("contract-clearance", contract_clearance_agent)
        registry.register("event-planner", event_planner_agent)
        registry.register("event-contract-assistant", event_contract_assistant_agent)
        registry.register("marketing-communicatie", marketing_communicatie_agent)

        # Register community member (no wrapper, direct class)
        registry.register("community-member", CommunityMemberAgent)

        # Initialize all agents (except community-member which doesn't need init)
        for name, agent in registry.items():
            if name != "community-member" and hasattr(agent, 'initialize'):
                await agent.initialize()
                print(f"  Initialized: {name}")
            elif name == "community-member":
                print(f"  Registered: {name} (no initialization needed)")

        print(f"All agents initialized. Default: {DEFAULT_AGENT}")

    except Exception as e:
        print(f"ERROR initializing agents: {e}")
        raise

class MessageRequest(BaseModel):
    message: str
    conversation_id: str | None = None
    agent: str | None = None  # Agent selector

class MessageResponse(BaseModel):
    response: str
    conversation_id: str
    agent: str  # Which agent responded

# Helper functions for message conversion
def pb_message_to_model_message(pb_msg: dict) -> Optional[ModelMessage]:
    """Convert a PocketBase message to a pydantic-ai ModelMessage."""
    role = pb_msg.get("role")
    content = pb_msg.get("content", "")

    if role == "user":
        return ModelRequest(parts=[UserPromptPart(content=content)])
    elif role == "assistant":
        return ModelResponse(parts=[TextPart(content=content)])

    return None

async def load_conversation_history(conversation_id: str) -> List[ModelMessage]:
    """Load conversation history from PocketBase and convert to pydantic-ai format."""
    if not pb_client or not conversation_id:
        return []

    try:
        # Fetch messages from PocketBase, sorted by creation time
        messages = pb_client.collection("messages").get_list(
            1, 500,  # page, per_page
            query_params={
                "filter": f'conversationId = "{conversation_id}"',
                "sort": "created"
            }
        )

        # Convert to pydantic-ai format
        history: List[ModelMessage] = []
        for msg in messages.items:
            converted = pb_message_to_model_message(msg.__dict__)
            if converted:
                history.append(converted)

        print(f"Loaded {len(history)} messages from conversation {conversation_id}")
        return history

    except ClientResponseError as e:
        print(f"Error loading conversation history: {e}")
        return []
    except Exception as e:
        print(f"Unexpected error loading history: {e}")
        return []

@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "TwoFeetUp Agent Server",
        "agents": registry.list(),
        "default_agent": DEFAULT_AGENT
    }

@app.get("/agents")
async def list_agents():
    """List all available agents."""
    agents_info = {}
    for name, agent_wrapper in registry.items():
        agents_info[name] = {
            "name": name,
            "description": agent_wrapper.description,
            "model": "GLM-4.5"
        }

    return {
        "agents": agents_info,
        "default": DEFAULT_AGENT
    }

@app.post("/chat", response_model=MessageResponse)
async def chat(request: MessageRequest):
    """
    Chat endpoint for the agent (non-streaming).
    Routes to appropriate agent based on request.agent parameter.
    """
    try:
        # Get agent name from request or use default
        agent_name = request.agent or DEFAULT_AGENT

        # Get agent from registry
        agent_wrapper = registry.get(agent_name)
        if not agent_wrapper:
            raise HTTPException(
                status_code=404,
                detail=f"Agent '{agent_name}' not found. Available agents: {', '.join(registry.list())}"
            )

        # Run agent
        result = await agent_wrapper.agent.run(request.message)

        return MessageResponse(
            response=str(result.output),
            conversation_id=request.conversation_id or "default",
            agent=agent_name
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class PulseResponseRequest(BaseModel):
    ritual_name: str
    ritual_question: str
    member_name: str = "Thomas"

class PulseResponseResponse(BaseModel):
    text: str
    tone: str
    member_name: str

@app.post("/community/pulse-response", response_model=PulseResponseResponse)
async def generate_pulse_response(request: PulseResponseRequest):
    """
    Generate an authentic Pulse B response using the Community Member Agent.
    """
    try:
        community_agent = registry.get("community-member")
        if not community_agent:
            raise HTTPException(status_code=404, detail="Community member agent not found")

        # Generate response
        response = await community_agent.generate_pulse_response(
            ritual_name=request.ritual_name,
            ritual_question=request.ritual_question,
            member_name=request.member_name
        )

        return PulseResponseResponse(
            text=response.text,
            tone=response.tone,
            member_name=request.member_name
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")

@app.post("/chat/stream")
async def chat_stream(request: MessageRequest):
    """
    Streaming chat endpoint for the agent.
    Returns Server-Sent Events (SSE) for progressive response rendering.
    Captures reasoning, tool calls, and all events from Pydantic AI.
    """
    async def generate():
        try:
            # Get agent name from request or use default
            agent_name = request.agent or DEFAULT_AGENT

            # Get agent from registry
            agent_wrapper = registry.get(agent_name)
            if not agent_wrapper:
                error_data = {
                    "error": f"Agent '{agent_name}' not found",
                    "available": registry.list()
                }
                yield f"data: {json.dumps(error_data)}\n\n"
                return

            # Load conversation history from PocketBase
            conversation_id = request.conversation_id or "default"
            history = await load_conversation_history(conversation_id)

            # Event queue for streaming
            event_queue = []
            full_response = ""

            # Event stream handler to capture ALL Pydantic AI events
            async def event_stream_handler(ctx, events):
                nonlocal full_response
                part_index = 0

                async for event in events:
                    # Reasoning/thinking (DeepSeek/GLM-4.5)
                    if isinstance(event, PartStartEvent) and isinstance(event.part, ThinkingPart):
                        event_queue.append({
                            "event_kind": "part_start",
                            "part": {
                                "part_kind": "thinking",
                                "content": event.part.content
                            },
                            "index": part_index,
                            "conversation_id": conversation_id,
                            "agent": agent_name
                        })
                        part_index += 1

                    elif isinstance(event, PartDeltaEvent) and isinstance(event.delta, ThinkingPartDelta):
                        event_queue.append({
                            "event_kind": "part_delta",
                            "delta": {
                                "part_delta_kind": "thinking",
                                "content_delta": event.delta.content_delta
                            },
                            "index": part_index - 1,
                            "conversation_id": conversation_id,
                            "agent": agent_name
                        })

                    # Regular text streaming
                    elif isinstance(event, PartStartEvent) and isinstance(event.part, TextPart):
                        event_queue.append({
                            "event_kind": "part_start",
                            "part": {
                                "part_kind": "text",
                                "content": event.part.content
                            },
                            "index": part_index,
                            "conversation_id": conversation_id,
                            "agent": agent_name
                        })
                        full_response += event.part.content
                        part_index += 1

                    elif isinstance(event, PartDeltaEvent) and isinstance(event.delta, TextPartDelta):
                        full_response += event.delta.content_delta
                        event_queue.append({
                            "event_kind": "part_delta",
                            "delta": {
                                "part_delta_kind": "text",
                                "content_delta": event.delta.content_delta
                            },
                            "index": part_index - 1,
                            "conversation_id": conversation_id,
                            "agent": agent_name
                        })

                    # Function/tool calls
                    elif isinstance(event, FunctionToolCallEvent):
                        event_queue.append({
                            "event_kind": "function_tool_call",
                            "part": {
                                "tool_call_id": f"tool-{part_index}",
                                "tool_name": event.part.tool_name,
                                "args": event.part.args if hasattr(event.part, 'args') else {}
                            },
                            "conversation_id": conversation_id,
                            "agent": agent_name
                        })
                        part_index += 1

                    elif isinstance(event, FunctionToolResultEvent):
                        event_queue.append({
                            "event_kind": "function_tool_result",
                            "result": {
                                "part_kind": "tool-return",
                                "tool_call_id": f"tool-{part_index-1}",
                                "tool_name": event.part.tool_name if hasattr(event, 'part') and hasattr(event.part, 'tool_name') else "unknown",
                                "content": str(event.result)
                            },
                            "conversation_id": conversation_id,
                            "agent": agent_name
                        })

            # Send initial ping
            yield f"data: {json.dumps({'type': 'ping', 'conversation_id': conversation_id, 'agent': agent_name})}\n\n"

            # Create agent task asynchronously
            agent_task = asyncio.create_task(
                agent_wrapper.agent.run(
                    request.message,
                    message_history=history,
                    event_stream_handler=event_stream_handler
                )
            )

            streamed_count = 0

            # Keep streaming while agent is running OR there are unstreamed events
            while not agent_task.done() or streamed_count < len(event_queue):
                # Stream all events that have accumulated
                while streamed_count < len(event_queue):
                    event = event_queue[streamed_count]
                    yield f"data: {json.dumps(event)}\n\n"
                    streamed_count += 1

                # If agent still running, wait briefly then check for more events
                if not agent_task.done():
                    await asyncio.sleep(0.1)  # Non-blocking wait

            # Get final result
            result = await agent_task

            # Send final_result event to finish thinking
            final_result_event = {
                "event_kind": "final_result",
                "conversation_id": conversation_id,
                "agent": agent_name
            }
            yield f"data: {json.dumps(final_result_event)}\n\n"

            # Send final done message
            final_data = {
                "type": "done",
                "done": True,
                "response": full_response or str(result.output),
                "conversation_id": conversation_id,
                "agent": agent_name
            }
            yield f"data: {json.dumps(final_data)}\n\n"

        except Exception as e:
            error_data = {"type": "error", "error": str(e)}
            yield f"data: {json.dumps(error_data)}\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )

if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    host = os.getenv("HOST", "0.0.0.0")

    uvicorn.run(
        "pydantic_agents.server:app",
        host=host,
        port=port,
        reload=True
    )
