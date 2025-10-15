# Multi-Agent Architecture Documentation

## Overview

This template implements a **multi-agent architecture** where each frontend tool connects to its own specialized AI agent. This ensures domain-specific expertise, isolated contexts, and better response quality.

## Architecture Principles

### 1. One Agent Per Tool

Each frontend tool (contract-clearance, event-planner, etc.) has a dedicated backend agent with:
- **Specialized System Prompt** - Defines domain expertise and personality
- **Custom Tool Access** - Specific MCP servers for the domain
- **Isolated State** - Separate conversation context per agent
- **Performance Tuning** - Agent-specific parameters (temperature, max_tokens, etc.)

### 2. Central Agent Registry

The backend uses an **AgentRegistry** pattern to route requests:

```python
# pydantic_agents/registry.py
from typing import Dict
from .clients.default.agents.contract_clearance.agent import contract_clearance_agent
from .clients.default.agents.event_planner.agent import event_planner_agent
from .clients.default.agents.event_contract.agent import event_contract_agent
from .clients.default.agents.marketing.agent import marketing_agent

class AgentRegistry:
    """Central registry for all AI agents."""

    def __init__(self):
        self.agents: Dict[str, Any] = {
            "contract-clearance": contract_clearance_agent,
            "event-planner": event_planner_agent,
            "event-contract-assistant": event_contract_agent,
            "marketing-communicatie": marketing_agent,
        }

    async def initialize_all(self):
        """Initialize all registered agents."""
        for agent_id, agent in self.agents.items():
            await agent.initialize()

    def get_agent(self, assistant_type: str):
        """Get agent by assistantType."""
        agent = self.agents.get(assistant_type)
        if not agent:
            raise ValueError(f"Unknown assistant type: {assistant_type}")
        return agent

# Global registry instance
agent_registry = AgentRegistry()
```

### 3. Request Routing

The server routes requests based on `assistantType`:

```python
# pydantic_agents/server.py
from .registry import agent_registry

@app.post("/chat")
async def chat(request: MessageRequest):
    # Get the correct agent for this tool
    agent = agent_registry.get_agent(request.assistant_type or "event-planner")

    # Run the specialized agent
    result = await agent.agent.run(request.message)

    return {
        "response": str(result.output),
        "agent_type": request.assistant_type,
        "conversation_id": request.conversation_id
    }
```

## Directory Structure

```
pydantic_agents/
├── clients/
│   └── default/
│       └── agents/
│           ├── contract_clearance/          # Legal contract agent
│           │   ├── __init__.py
│           │   ├── agent.py                 # Agent configuration
│           │   └── system_prompt.md         # Specialized prompt
│           │
│           ├── event_planner/               # Event planning agent
│           │   ├── __init__.py
│           │   ├── agent.py
│           │   └── system_prompt.md
│           │
│           ├── event_contract/              # Event contract agent
│           │   ├── __init__.py
│           │   ├── agent.py
│           │   └── system_prompt.md
│           │
│           └── marketing/                   # Marketing agent
│               ├── __init__.py
│               ├── agent.py
│               └── system_prompt.md
│
├── registry.py                              # AgentRegistry (NEW)
├── server.py                                # FastAPI server
└── requirements.txt
```

## Agent Specifications

### Contract Clearance Agent

**Purpose:** Legal contract review and analysis

**System Prompt Characteristics:**
- Professional, formal tone
- Legal terminology expertise
- Focus on compliance and risk assessment
- Outputs in structured format (tables, bullet points)

**Tools:**
- Context7 (legal documentation)
- Contract clause library (custom MCP)

**Example Response:**
```
Contract Analysis Report
========================

Risk Level: Medium

Key Findings:
1. [Finding 1]
2. [Finding 2]

Recommendations:
- [Action 1]
- [Action 2]
```

### Event Planner Agent

**Purpose:** Event planning and logistics

**System Prompt Characteristics:**
- Friendly, collegial tone (Dutch: "je" form)
- Event industry expertise
- Creates "draaiboeken" (event rundowns)
- Timeline and checklist focused

**Tools:**
- Context7 (event planning resources)
- Venue database (custom MCP)

**Example Response:**
```
Event Draaiboek
===============

Timeline:
09:00 - Venue setup
10:00 - Guest arrival
...

Checklist:
☐ Confirm catering
☐ Test AV equipment
...
```

### Event Contract Agent

**Purpose:** Event-specific contract drafting

**System Prompt Characteristics:**
- Professional but accessible
- Event contract templates
- Venue-specific clauses
- Payment terms expertise

**Tools:**
- Context7 (contract templates)
- Legal clause library

### Marketing Agent

**Purpose:** Marketing and communications

**System Prompt Characteristics:**
- Creative, persuasive tone
- Marketing copywriting
- Multi-channel strategy
- Brand voice consistency

**Tools:**
- Context7 (marketing resources)
- Content calendar (custom MCP)

## Implementation Guide

### Step 1: Create Agent Structure

```bash
# Create all agent directories
mkdir -p pydantic_agents/clients/default/agents/{contract_clearance,event_planner,event_contract,marketing}

# Create __init__.py files
touch pydantic_agents/clients/default/agents/{contract_clearance,event_planner,event_contract,marketing}/__init__.py
```

### Step 2: Create Agent Registry

Create `pydantic_agents/registry.py` with the AgentRegistry class (see above).

### Step 3: Implement Each Agent

For each agent, create:

1. **`agent.py`** - Agent configuration and builder
2. **`system_prompt.md`** - Specialized instructions

Template for `agent.py`:
```python
from pydantic_ai import Agent
from pydantic_ai.mcp import MCPServerStreamableHTTP
from pathlib import Path
import os

MODEL_NAME = "openai:zai-org/GLM-4.5"
DEFAULT_MCP_URL = os.getenv("MY_AGENT_MCP_URL", "https://mcp.context7.com/mcp")

def _load_system_prompt() -> str:
    prompt_file = Path(__file__).parent / "system_prompt.md"
    return prompt_file.read_text(encoding="utf-8")

def build_agent():
    os.environ["OPENAI_API_KEY"] = os.getenv("DEEPINFRA_API_KEY")
    os.environ["OPENAI_BASE_URL"] = "https://api.deepinfra.com/v1/openai"

    system_prompt = _load_system_prompt()
    mcp_server = MCPServerStreamableHTTP(DEFAULT_MCP_URL)

    return Agent(
        model=MODEL_NAME,
        toolsets=[mcp_server],
        system_prompt=system_prompt,
        retries=20
    )

class YourAgent:
    def __init__(self):
        self.name = "YourAgent"
        self.agent = None

    async def initialize(self):
        self.agent = build_agent()

your_agent = YourAgent()
```

### Step 4: Update Server

Modify `pydantic_agents/server.py`:

```python
from .registry import agent_registry

@app.on_event("startup")
async def startup():
    await agent_registry.initialize_all()

@app.post("/chat")
async def chat(request: MessageRequest):
    agent = agent_registry.get_agent(
        request.assistant_type or "event-planner"
    )

    result = await agent.agent.run(request.message)

    return {
        "response": str(result.output),
        "agent_type": request.assistant_type,
        "conversation_id": request.conversation_id
    }
```

### Step 5: Update Request Model

Add `assistant_type` to the request model:

```python
class MessageRequest(BaseModel):
    message: str
    conversation_id: str = "default"
    assistant_type: str = "event-planner"  # NEW
```

### Step 6: Frontend Integration

The frontend already sends `assistantType`:

```typescript
// src/components/chat-interface.tsx
const response = await fetch(chatEndpoint, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [...messages, userMessage],
    assistantType: toolId,  // ✓ Already sending this
    conversation_id: conversationId
  })
})
```

## Testing Multi-Agent System

### Unit Tests

Test each agent individually:

```python
# test_agents.py
import pytest
from pydantic_agents.clients.default.agents.contract_clearance.agent import contract_clearance_agent

@pytest.mark.asyncio
async def test_contract_agent():
    await contract_clearance_agent.initialize()
    result = await contract_clearance_agent.agent.run(
        "Review this clause: The party agrees to..."
    )
    assert "risk" in result.output.lower()
```

### Integration Tests

Test agent routing:

```python
from pydantic_agents.registry import agent_registry

@pytest.mark.asyncio
async def test_agent_routing():
    await agent_registry.initialize_all()

    # Test correct agent is returned
    agent = agent_registry.get_agent("contract-clearance")
    assert agent.name == "ContractClearanceAgent"

    # Test error on unknown type
    with pytest.raises(ValueError):
        agent_registry.get_agent("unknown-tool")
```

### End-to-End Tests

Test via API:

```bash
# Contract agent
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Review this contract",
    "assistant_type": "contract-clearance"
  }'

# Event agent
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Plan a corporate event",
    "assistant_type": "event-planner"
  }'
```

## Benefits of Multi-Agent Architecture

### 1. **Domain Expertise**
Each agent is an expert in its domain, providing higher quality responses.

### 2. **Isolated Context**
Conversations don't bleed across tools - event planning doesn't contaminate contract review.

### 3. **Customizable Tools**
Each agent can have domain-specific MCP tools (legal databases, event venues, etc.)

### 4. **Performance Tuning**
Per-agent configuration (temperature, max_tokens, retries) optimized for the use case.

### 5. **Scalability**
Add new tools by simply creating a new agent directory - no need to modify existing agents.

### 6. **Maintainability**
Changes to one agent don't affect others - clear separation of concerns.

### 7. **Testing**
Test each agent independently - easier to validate domain-specific behavior.

## Migration from Single Agent

If you currently have a single shared agent:

1. **Backup** existing agent configuration
2. **Create** new agent directories for each tool
3. **Split** system prompt into tool-specific prompts
4. **Implement** AgentRegistry
5. **Update** server.py to use registry
6. **Test** each agent independently
7. **Deploy** with proper routing

## Common Issues

### Issue: Wrong Agent Responds

**Cause:** Frontend not sending `assistantType` correctly

**Fix:** Check chat-interface.tsx sends `assistantType: toolId`

### Issue: Agent Not Found

**Cause:** AgentRegistry missing agent mapping

**Fix:** Verify agent is registered in `registry.py`

### Issue: All Agents Use Same Prompt

**Cause:** Agents sharing system_prompt.md file

**Fix:** Each agent must have its own `system_prompt.md` in its directory

## Performance Considerations

- **Initialization:** All agents initialize at startup (5-10 seconds)
- **Memory:** Each agent loads its own model (plan for ~500MB per agent)
- **Concurrency:** Agents can run in parallel for different users
- **Caching:** System prompts are loaded once during initialization

## Security Considerations

- **Prompt Injection:** Each agent validates inputs independently
- **Access Control:** PocketBase ensures users can't access other users' conversations
- **Tool Access:** MCP tools are scoped per agent (event agent can't access legal tools)
- **Logging:** Each agent logs separately for audit trails

## Future Enhancements

1. **Dynamic Agent Loading:** Load agents on-demand instead of all at startup
2. **Agent Chaining:** Allow agents to delegate to other agents
3. **Shared Knowledge Base:** Cross-agent memory for learned information
4. **A/B Testing:** Run multiple versions of agents and compare performance
5. **Agent Analytics:** Track per-agent performance metrics and costs
