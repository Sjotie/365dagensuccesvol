# Setup Issues & Learnings

## Issues Encountered During Agent Setup

### Issue 1: Invalid Model ID - `zai-org/GLM-4.5`

**What happened:**
```python
Agent(
    model=f"openai:{MODEL_NAME}",  # MODEL_NAME = "zai-org/GLM-4.5"
    model_settings={
        "base_url": "https://api.deepinfra.com/v1/openai",
        "api_key": os.getenv("DEEPINFRA_API_KEY")
    },
    ...
)
```
**Error:** `status_code: 400, model_name: zai-org/GLM-4.5, body: {'message': 'invalid model ID'}`

**Root Cause:**
- **Lack of guidance** - The BaseCamp documentation showed a Tom agent example using `MODEL_NAME = "zai-org/GLM-4.5"` with `model=f"openai:{MODEL_NAME}"` but didn't show the DeepInfra configuration pattern
- **Wrong assumption** - I assumed `model_settings` was the correct way to configure DeepInfra
- **Missing info** - No documentation on how pydantic-ai handles DeepInfra vs OpenAI providers

---

### Issue 2: Switched to Wrong Model

**What happened:**
```python
MODEL_NAME = "meta-llama/Meta-Llama-3.1-70B-Instruct"
```

**Root Cause:**
- **Panic fix** - When GLM-4.5 failed, I switched to a different DeepInfra model
- **Wrong assumption** - Thought the model name itself was the issue, not the configuration pattern

---

### Issue 3: Unknown Model - `deepinfra:GLM-4.5`

**What happened:**
```python
Agent(
    model="deepinfra:GLM-4.5",
    ...
)
```
**Error:** `Unknown model: deepinfra:GLM-4.5`

**Root Cause:**
- **User instruction** - Was told to use `deepinfra:GLM-4.5` as model name
- **Wrong provider prefix** - Pydantic-ai doesn't recognize `deepinfra:` as a provider prefix
- **Missing documentation** - No clear docs on which provider prefixes are supported

---

### Issue 4: Wrong Result Attribute - `result.data`

**What happened:**
```python
result = await my_agent.agent.run(request.message)
return MessageResponse(
    response=result.data,  # ❌ Wrong attribute
    conversation_id=request.conversation_id or "default"
)
```
**Error:** `'AgentRunResult' object has no attribute 'data'`

**Root Cause:**
- **API assumption** - Assumed the result would have a `.data` attribute
- **No API reference** - Didn't have clear documentation on `AgentRunResult` structure
- **Should be** `result.output` instead

---

## The Correct Configuration (Working)

Based on the working example from `pydantic_agents/clients/default/agents/example/agent.py`:

```python
def build_my_agent():
    # Configure DeepInfra via environment variables
    os.environ["OPENAI_API_KEY"] = os.getenv("DEEPINFRA_API_KEY")
    os.environ["OPENAI_BASE_URL"] = "https://api.deepinfra.com/v1/openai"

    system_prompt = _load_system_prompt()

    # Creëer agent met DeepInfra GLM-4.5
    return Agent(
        model="openai:zai-org/GLM-4.5",  # Use openai: prefix, not deepinfra:
        system_prompt=system_prompt,
        retries=20
    )
```

**Key learnings:**
1. ✅ Use `openai:` prefix, not `deepinfra:`
2. ✅ Set `OPENAI_API_KEY` env var to DeepInfra key
3. ✅ Set `OPENAI_BASE_URL` to DeepInfra endpoint
4. ✅ NO `model_settings` parameter needed
5. ✅ Access result with `result.output`, not `result.data`

---

## Documentation Gaps

### What was missing from BaseCamp docs:

1. **Provider Configuration Patterns**
   - How to configure different LLM providers (DeepInfra, Anthropic, etc.)
   - Which provider prefixes are supported (`openai:`, `anthropic:`, etc.)
   - When to use `model_settings` vs environment variables

2. **API Reference**
   - `AgentRunResult` object structure
   - Available attributes and methods
   - How to extract the response

3. **DeepInfra-Specific Setup**
   - Clear example of DeepInfra configuration
   - Environment variable vs model_settings approach
   - Model naming conventions

### What I assumed incorrectly:

1. ❌ That `model_settings` was the right way to configure DeepInfra
2. ❌ That `deepinfra:` would be a valid provider prefix
3. ❌ That result would have `.data` attribute
4. ❌ That the model name format from docs would work as-is

---

## Recommendations for BaseCamp Docs

1. **Add Provider Configuration Guide**
   - Section on each supported provider (OpenAI, DeepInfra, Anthropic, etc.)
   - Clear examples of environment variable setup
   - Provider prefix reference table

2. **Add API Reference**
   - Document `AgentRunResult` structure
   - List all available attributes
   - Show response extraction patterns

3. **Add Troubleshooting Section**
   - Common errors and solutions
   - Model configuration issues
   - Provider-specific gotchas

4. **Update Examples**
   - Include complete working examples for each provider
   - Show both simple and advanced configurations
   - Include server.py response handling
