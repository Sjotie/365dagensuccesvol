from pydantic_ai import Agent
from pydantic_ai.mcp import MCPServerStreamableHTTP
from pathlib import Path
import os

# MCP server configuratie
DEFAULT_MCP_URL = os.getenv("MY_AGENT_MCP_URL", "https://mcp.context7.com/mcp")

# Model configuratie - GLM-4.5 via DeepInfra
MODEL_NAME = "openai:zai-org/GLM-4.5"

def _load_system_prompt() -> str:
    """Load system prompt from markdown file."""
    prompt_file = Path(__file__).parent / "system_prompt.md"
    return prompt_file.read_text(encoding="utf-8")

def build_my_agent():
    """Build agent with MCP toolset."""
    # Configure DeepInfra via environment variables
    api_key = os.getenv("DEEPINFRA_API_KEY")
    if not api_key:
        raise RuntimeError("DEEPINFRA_API_KEY must be set to initialize the agent")

    os.environ["OPENAI_API_KEY"] = api_key
    os.environ["OPENAI_BASE_URL"] = "https://api.deepinfra.com/v1/openai"

    system_prompt = _load_system_prompt()

    # Configureer MCP server (Context7)
    mcp_server = MCPServerStreamableHTTP(DEFAULT_MCP_URL)

    # Creëer agent met DeepInfra GLM-4.5
    return Agent(
        model=MODEL_NAME,
        toolsets=[mcp_server],  # MCP tools enabled with Context7
        system_prompt=system_prompt,
        retries=20
    )

class MyAgent:
    """Agent wrapper."""
    def __init__(self):
        self.name = "MyAgent"
        self.agent = None

    async def initialize(self):
        self.agent = build_my_agent()

my_agent = MyAgent()
