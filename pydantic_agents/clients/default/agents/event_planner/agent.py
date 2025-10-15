from pydantic_ai import Agent
from pydantic_ai.mcp import MCPServerStreamableHTTP
from pathlib import Path
import os

DEFAULT_MCP_URL = os.getenv("EVENT_PLANNER_MCP_URL", "https://mcp.context7.com/mcp")
MODEL_NAME = "openai:zai-org/GLM-4.5"

def _load_system_prompt() -> str:
    """Load system prompt from markdown file."""
    prompt_file = Path(__file__).parent / "system_prompt.md"
    return prompt_file.read_text(encoding="utf-8")

def build_event_planner_agent():
    """Build event planner agent with MCP toolset."""
    api_key = os.getenv("DEEPINFRA_API_KEY")
    if not api_key:
        raise RuntimeError("DEEPINFRA_API_KEY must be set to initialize the event planner agent")

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

class EventPlannerAgent:
    """Event planner agent wrapper."""
    def __init__(self):
        self.name = "event-planner"
        self.description = "Event planning and draaiboek generator"
        self.agent = None

    async def initialize(self):
        self.agent = build_event_planner_agent()

event_planner_agent = EventPlannerAgent()
