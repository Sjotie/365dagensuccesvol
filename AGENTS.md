# AGENTS.md

📚 **Fetch complete standards from TwoFeetBase:**
File ID: `yh8vstyw8m69tsq` (TwoFeetUp-Development-Standards-v1.2.0.md)

**Check TwoFeetBase often** - it contains up-to-date instructions, standards, and documentation for commonly used platforms.

Always use context7 when I need code generation, setup or configuration steps, or library/API documentation. This means you should automatically use the Context7 MCP tools to resolve library id and get library docs without me having to explicitly ask.

## Project-Specific Guidelines

### Knowledgebase
We're working with TwoFeetUp Templates here, and they use tech that a lot of is documented in the TwoFeetBase, the knowledgebase for TwoFeetUp. Use it often and frequently, it has steps to work with the agents for example.

### Other factors
Never just kill Node.exe as a whole.

### No fake data or placeholders or shitty fallbacks
Avoid fake data, placeholders, and shitty fallbacks. This means that putting in placeholders or falling back to some crappy method to hide or obfuscate that the original doesn't work is absolutely never allowed.

---

## Project Overview

Multi-agent AI system built with TwoFeetUp BaseCamp framework. Features specialized domain agents for conversation management, streaming responses, and PocketBase integration for persistent storage.

---

## File Structure

- `/pydantic_agents/` - Agent implementation and server
  - `/clients/default/agents/` - Agent definitions
  - `server.py` - FastAPI server
- `/pydantic-agents-core/` - BaseCamp framework (submodule)
- `/nextjs-frontend-template/` - Next.js frontend (submodule)
- `/scripts/` - Utility scripts for PocketBase setup
- `/tests/` - Test suites and golden prompts
  - `/golden/` - Golden test files for TDD
  - `/test-scenarios/` - E2E test scenarios
  - `/test-results/` - Test output and results
- `/docs/` - Documentation
  - `/work/prd/` - Product Requirements Documents
  - `/work/plan/` - Implementation Plans
  - `/work/progress/` - Daily Progress Logs
  - `/adr/` - Architecture Decision Records

---

## Tech Stack

- **Deployment:** Railway (Docker)
- **Git workflow:** `main` branch deploys to Railway, use `feature/**name**` for branches
- **Package manager:** Bun (for frontend), pip (for backend)

### Frontend (Next.js)

- **Frontend:** Next.js (App Router) + shadcn/ui + Tailwind
- **Commands:**
  - `cd nextjs-frontend-template`
  - `bun install` - Install dependencies
  - `bun dev` - Start dev server
  - `bun run build` - Build for production
  - `bun run lint` - Lint code
  - `bun run type-check` - Type checking

### Backend (Python + Pydantic AI)

- **Backend:** PocketBase (default database)
- **AI/Agents:** Pydantic AI for orchestration, FastMCP for tools
- **Server:** FastAPI
- **Commands:**
  - `pip install -e ./pydantic-agents-core` - Install BaseCamp framework
  - `pip install -r requirements.txt` - Install dependencies
  - `python -m pydantic_agents.server` - Start agent server
  - `pytest -q` - Run tests
  - `ruff check --fix` - Lint and fix
  - `mypy .` - Type checking

### LLM & Observability

- **LLM Logging:** Logfire (see project README for implementation)
- **Agent naming convention:** `<scope>-<role>:<Codename>`
  - Scopes: `fe | api | mcp | ops | etl | qa | rag`
  - Roles: `builder | reviewer | router | retriever | planner | executor`
  - Example: `fe-builder:Orion`, `mcp-executor:Juniper`
- **Model behavior:**
  - **NO silent fallbacks** - If a model or provider fails, surface an error
  - **If a fallback seems reasonable, ASK the user first**
  - Always validate tool inputs and use sensible timeouts

---

## Documentation Conventions

**Highly encouraged:** Track your progress as you work.

- **PRDs:** `docs/work/prd/YYYY-MM-DD-short-slug.md`
- **Plans:** `docs/work/plan/YYYY-MM-DD-short-slug.md`
- **Progress:** `docs/work/progress/YYYY-MM-DD-initials.md` ← **Use this to document what you're doing**

- **Architecture Decision Records:** `docs/adr/NNNN-title.md`
- Create ADRs for significant architectural decisions
- Link to ADRs from this file but don't embed their content

All docs should include frontmatter:

```yaml
---
doc: [prd|plan|progress|adr]
title: [Document title]
status: [draft|active|done|deprecated]
owner: [Name or agent name]
created: YYYY-MM-DD
updated: YYYY-MM-DD
related: [Links to related docs]
agent_name: [If authored/edited by an agent]
---
```

**Reference deviations:** If this project deviates from TwoFeetUp defaults, note it in the "Deviations & Notes" section below and link to the relevant ADR.

---

## Testing (TDD encouraged)

**TDD is highly encouraged.**

- `/tests/golden/` - Canonical prompts with expected structured outputs
- Assert schema validity and key invariants, not exact wording
- Add smoke tests for MCP tools (validation, timeouts, side-effect gating)

- `pytest -q` - Run tests quietly
- Keep golden test files in `/tests/golden/`

---

## Development Workflow

```bash
# Backend setup
pip install -e ./pydantic-agents-core
pip install -r requirements.txt
cp .env.example .env           # Configure environment

# Start backend
python -m pydantic_agents.server

# Frontend setup (in separate terminal)
cd nextjs-frontend-template
bun install
cp .env.example .env.local
bun dev
```

1. Create feature branch: `feature/**name**`
2. Make changes, commit frequently
3. Push and create PR
4. `main` branch deploys automatically to Railway

- Python: Ruff + Mypy (via pre-commit)
- JavaScript/TypeScript: ESLint + Prettier (via Husky)

---

## Railway Deployment

- **Dockerfile location:** `./Dockerfile` (or `./infra/Dockerfile`)
- **Port:** 8000 (FastAPI backend)
- **Health check:** `/health` (FastAPI)
- **Config:** `railway.json` at repo root

---

## Core Principles

1. **Check TwoFeetBase frequently** - Standards and platform docs are kept up-to-date there
2. **Document as you go** - Use `/docs/work/progress/` to track your work
3. **Ask before falling back** - Never silently swap models or providers
4. **PocketBase by default** - Escalate to Supabase only when justified (document in ADR)
5. **Test thoroughly** - TDD with golden tests for LLM interactions
6. **No silent failures** - Surface errors clearly to users

---

## Deviations & Notes

This section documents any deviations from TwoFeetUp defaults. Each deviation should link to a detailed ADR in `/docs/adr/`.

Currently no documented deviations.
