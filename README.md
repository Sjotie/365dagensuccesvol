# 365 Hub

AI-gedreven community platform voor offline verbindingen, gebouwd met TwoFeetUp BaseCamp framework.

**Doel:** Versnellen van offline ontmoetingen en verhogen van warmte binnen communities door gespecialiseerde AI-agents die faciliteren, matchen, en bewaken.

## Setup

### 1. Install Dependencies

```bash
# Install BaseCamp framework
pip install -e ./pydantic-agents-core

# Install project dependencies
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env.example` to `.env` and add your credentials:

```bash
cp .env.example .env
```

Edit `.env`:
- `POCKETBASE_URL`: PocketBase instance URL
- `POCKETBASE_ADMIN_EMAIL`: Admin email
- `POCKETBASE_ADMIN_PASSWORD`: Admin password
- `ANTHROPIC_API_KEY`: Your Anthropic API key
- `DEEPINFRA_API_KEY`: Your DeepInfra API key (optional)

### 3. Setup PocketBase

Run the PocketBase setup scripts:

```bash
# Create collections
python create_collections.py

# Optionally create test user
python create_user.py
```

See `pb_schema.json` for the complete database schema.

### 4. Run Server

```bash
# Development
python -m pydantic_agents.server

# Or with uvicorn directly
uvicorn pydantic_agents.server:app --reload --host 0.0.0.0 --port 8000
```

## Project Structure

```
365vB/
├── pydantic-agents-core/          # BaseCamp submodule
├── pydantic_agents/               # Agent implementation
│   ├── clients/default/agents/   # Specialized agents:
│   │   ├── event_planner/        # Planner agent
│   │   ├── event_contract_assistant/  # Composer agent
│   │   ├── contract_clearance/   # Health & Safety agent
│   │   └── marketing_communicatie/    # Navigator agent
│   └── server.py                 # FastAPI server
├── nextjs-frontend-template/      # Next.js dashboard (submodule)
├── docs/                          # Documentation
│   ├── work/                     # Temporary work docs
│   │   ├── prd/                  # Product requirements
│   │   ├── plan/                 # Implementation plans
│   │   └── progress/             # Daily progress logs
│   └── adr/                      # Architecture Decision Records
├── tests/                         # Test suites
├── pb_schema.json                 # PocketBase schema
├── .env                           # Environment variables
└── README.md
```

## Usage

### API Endpoints

**Health Check:**
```bash
curl http://localhost:8000/
```

**Chat:**
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!"}'
```

## Development

### Update BaseCamp

```bash
cd pydantic-agents-core
git pull origin main
cd ..
git add pydantic-agents-core
git commit -m "Update BaseCamp"
```

### Add New Agent

1. Create directory: `pydantic_agents/clients/default/agents/new_agent/`
2. Add `system_prompt.md` with agent instructions
3. Add `agent.py` with agent implementation
4. Register in `server.py`

## AI Agents

This project implements 7 specialized agents:

1. **Planner** - Orchestreert weekritme (2 pulsen), agendeert voorstellen
2. **Retriever** - Second Brain voor context (VREDE-rituelen, tone-of-voice, locaties)
3. **Composer** - Schrijft kort-maar-warm UI-copy, draaiboekjes, uitnodigingen
4. **Matchmaker** - Koppelt buddy's op beschikbaarheid/wijk/voorkeur
5. **Health & Safety** - Detecteert stilte/spanning/risicotaal
6. **Experimenter** - Voert A/B tests uit en rapporteert metrics
7. **Navigator** - Houdt rekening met weer, openingstijden, locaties

See `PLAN.md` for detailed AI implementation strategy.

## Resources

- **BaseCamp:** https://github.com/TwoFeetUp/BaseCamp
- **Pydantic AI:** https://ai.pydantic.dev
- **PocketBase:** https://pocketbase.io
- **TwoFeetBase:** Internal knowledge base for standards and SOPs
