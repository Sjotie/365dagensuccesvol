from pydantic_ai import Agent
from pydantic_ai.mcp import MCPServerStreamableHTTP
from pathlib import Path
import os

DEFAULT_MCP_URL = os.getenv("EVENT_CONTRACT_ASSISTANT_MCP_URL", "https://mcp.context7.com/mcp")
MODEL_NAME = "openai:zai-org/GLM-4.5"

def _load_system_prompt() -> str:
    """Load system prompt from markdown file."""
    prompt_file = Path(__file__).parent / "system_prompt.md"
    return prompt_file.read_text(encoding="utf-8")

def build_event_contract_assistant_agent():
    """Build event contract assistant agent with MCP toolset."""
    api_key = os.getenv("DEEPINFRA_API_KEY")
    if not api_key:
        raise RuntimeError("DEEPINFRA_API_KEY must be set to initialize the event contract assistant agent")

    os.environ["OPENAI_API_KEY"] = api_key
    os.environ["OPENAI_BASE_URL"] = "https://api.deepinfra.com/v1/openai"

    system_prompt = _load_system_prompt()
    mcp_server = MCPServerStreamableHTTP(DEFAULT_MCP_URL)

    return Agent(
        model=MODEL_NAME,
        toolsets=[mcp_server],
        system_prompt=system_prompt,
        retries=20
    )

class EventContractAssistantAgent:
    """Event contract assistant agent wrapper."""
    def __init__(self):
        self.name = "event-contract-assistant"
        self.description = "Event contract specialist"
        self.agent = None

    async def initialize(self):
        self.agent = build_event_contract_assistant_agent()

event_contract_assistant_agent = EventContractAssistantAgent()
