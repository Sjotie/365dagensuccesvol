# Next.js Frontend Template Conversion Plan

## Overview & Goal

This plan outlines the process of converting a client-specific Next.js frontend into a reusable template that pairs with our standardized Pydantic AI agent backend. The goal is to create a clean, well-documented starting point for future client projects that includes:

- **Agent Integration**: Seamless connection to our Pydantic AI backend with streaming support
- **Function Call Transparency**: Real-time visualization of agent tool usage
- **Document Processing**: OCR capabilities for document-based interactions
- **Database Ready**: PocketBase integration for data persistence and auth
- **Client Agnostic**: All branding and client-specific code removed

This template will speed up project initialization and ensure consistency across implementations while maintaining flexibility for client-specific customizations.

---

## Progress Summary

**Status Legend:** ✅ Completed | 🔄 In Progress | ⏳ Pending | ⚠️ Blocked/Issues

### Completed ✅
1. Repository Setup - Fresh git initialized
2. Branding & Identity Cleanup - All "Olympisch Stadion" references removed
3. Facturatie Tool Removal - Completely removed (2,703 lines deleted)
4. PocketBase Configuration - Already using env vars properly
5. OCR Documentation - Fully documented (Mistral AI implementation)

### In Progress 🔄
6. Environment Configuration - Creating comprehensive .env.example

### Pending ⏳
7. Deep Identity Agent Integration - **Critical Issue Identified** (see Section 5)
8. Documentation Updates (README, TEMPLATE_SETUP.md)
9. Testing & Verification

### Issues Identified ⚠️
- **Agent Integration**: Frontend currently connects to Mistral AI directly, NOT to Pydantic AI backend
- **No Streaming in Backend**: Backend needs streaming endpoint implementation
- **Missing Env Vars**: NEXT_PUBLIC_AGENT_API_URL not configured

---

## 1. Repository Setup ✅ COMPLETED
- ✅ Clone the client-specific Next.js repository
- ✅ Remove `.git` folder to disconnect from original remote
- ✅ Initialize fresh git repository with `git init`
- ✅ Create initial commit as starting point for template
- ✅ Commit: "Initial template conversion starting point" (834dc3c)
- ✅ Commit: "Remove Facturatie tool and branding cleanup" (6f02270)

---

## 2. Branding & Identity Cleanup ✅ COMPLETED
- ✅ Search and replace client-specific company names throughout codebase
- ✅ Replace with placeholder like `[COMPANY_NAME]` or `YourCompany`
- ✅ Remove/replace all logo files in `/public` or `/assets` directories
  - Removed: `public/branding/olympisch-stadion-logo.png`
  - Updated: `src/components/branding/brand-logo.tsx` to use generic `/branding/logo.png`
- ✅ Update favicon and meta tags with generic branding
  - Updated: `src/app/layout.tsx` metadata
- ✅ Check `package.json` for client-specific naming
  - Changed: `my-v0-project` → `nextjs-ai-assistant-template`
- ✅ Update any hardcoded text in UI components
  - Updated: All prompt files (4 files)
  - Updated: All documentation files (4 files)
  - Updated: Code files with branding (3 files)

**Files Modified:** 29 files, 82 insertions(+), 2,703 deletions(-)

---

## 3. Remove Facturatie Tool ✅ COMPLETED
- ✅ Search codebase for "facturatie" references (case-insensitive)
- ✅ Remove related components, pages, or API routes
  - Deleted: `src/components/facturatie/` (3 files)
  - Deleted: `src/lib/facturatie/` (2 files)
  - Deleted: `src/app/api/facturatie/` (5 routes)
  - Deleted: `docs/facturatie-*.md` (3 files)
- ✅ Clean up navigation/menu items that reference the tool
  - Removed from: `src/app/page.tsx` tools array
  - Removed: `Euro` icon import
  - Removed: `FacturatieTool` component import and usage
- ✅ Remove any facturatie-related dependencies from `package.json`
  - No dependencies were facturatie-specific
- ✅ Update TypeScript types/interfaces that reference it
  - Types removed with component deletion
- ✅ Clean up any routing configuration
  - Removed conditional rendering in page.tsx

**Total Removed:** 14 files with facturatie references

---

## 4. Database Configuration (PocketBase) ✅ COMPLETED

### 4.1 Connection Setup ✅
- ✅ Locate PocketBase connection/config files (likely in `/lib` or `/utils`)
  - Found: `src/lib/pocketbase.ts` and `src/lib/pocketbase-admin.ts`
- ✅ Replace hardcoded PocketBase URLs with environment variables:
  - ✅ `NEXT_PUBLIC_POCKETBASE_URL` - Already implemented with dev fallback
  - ✅ `POCKETBASE_ADMIN_EMAIL` - Already implemented
  - ✅ `POCKETBASE_ADMIN_PASSWORD` - Already implemented
- ✅ Create `.env.example` template with placeholder values
  - Exists as `.env.local.example`
  - Updated: admin email from `admin@olympisch.com` → `admin@company.com`
- ✅ Ensure auth flows use env vars instead of hardcoded values
  - Verified: All PocketBase connections use env vars as primary source
- ✅ Add PocketBase client initialization utility if not present
  - Already exists and properly implemented

**Status:** PocketBase configuration is production-ready with proper env var usage and error handling.

### 4.2 Schema Documentation ⏳ PENDING
- ⏳ Document PocketBase collections/schema requirements in README
  - Schema exists: `pb_schema.json` in project root
  - Collections identified: users, conversations, messages, _authOrigins, _externalAuths, _mfas, _otps
- ⏳ List required collections, fields, and relationships
- ⏳ Document any PocketBase rules or validation requirements
- ⏳ Add instructions for setting up PocketBase instance

---

## 5. Deep Identity Agent Integration ⚠️ CRITICAL ISSUES IDENTIFIED

**Current State:** Frontend is NOT connected to Pydantic AI backend. It uses Mistral AI directly.

### 5.1 Streaming Implementation ⚠️ NOT IMPLEMENTED
- ❌ **Issue:** No connection to Pydantic AI backend exists
- ✅ Frontend handles streaming (Vercel AI SDK format)
- ✅ Frontend parses multiple streaming formats (SSE, JSON chunks)
- ❌ **Backend Issue:** `pydantic_agents/server.py` returns complete responses, NOT streaming
- ⏳ Need to implement SSE/streaming endpoint in backend
- ✅ Frontend has loading states and streaming indicators
- ⏳ Need to add graceful error handling for agent backend connection

**Current Architecture:**
```
Frontend → /api/chat → Mistral AI (direct) ✅ WORKS
Frontend → /api/agent → ❌ DOES NOT EXIST → Pydantic AI Backend
```

**Required Changes:**
1. Add streaming endpoint to backend: `/chat/stream`
2. Create proxy route: `src/app/api/agent/route.ts`
3. Add `NEXT_PUBLIC_AGENT_API_URL` environment variable

### 5.2 Function Call Visualization ✅ PARTIALLY IMPLEMENTED
- ✅ UI component exists: `src/components/tool-call-display.tsx`
- ✅ Show function call status indicators implemented
  - ✅ Function called (pending)
  - ✅ Function succeeded
  - ✅ Function failed
- ✅ Display function name and parameters being used
- ✅ Show function results/errors when available
- ✅ Style distinctly from regular chat messages (collapsible card)
- ✅ Parse SSE/streaming events that contain tool call metadata
- ⚠️ **Limitation:** Only `getCurrentTime` tool implemented
- ⏳ **Need:** Map Pydantic AI MCP tools to frontend visualization

### 5.3 Agent API Configuration ❌ NOT CONFIGURED
- ❌ No agent URLs configured (hardcoded Mistral URLs exist)
- ❌ Missing environment variables:
  - `NEXT_PUBLIC_AGENT_API_URL=http://localhost:8000`
  - `AGENT_API_KEY` (if authentication needed)
- ❌ No API client structure exists (e.g., `/lib/agent-client.ts`)
- ⏳ Need to document which agent endpoints the frontend expects:
  - `/chat` for complete responses (current backend)
  - `/chat/stream` for streaming responses (needs implementation)
  - `/agents` for listing available agents (doesn't exist)

**Hardcoded Values Found:**
- `src/app/api/chat/route.ts:12-16` - Mistral API URL
- `src/app/api/chat-enhanced/route.ts:20` - Mistral API URL
- `src/components/chat-interface.tsx:184` - `/api/chat` endpoint

---

## 6. OCR & Document Upload Functionality ✅ COMPLETED

### 6.1 Preserve OCR Interface ✅
- ✅ Ensure document upload UI components remain functional
  - Components exist: `file-upload-button.tsx`, `drag-drop-zone.tsx`
- ✅ Keep file input handlers and drag-and-drop zones
  - Fully functional in chat interface
- ✅ Maintain any file preview/thumbnail functionality
  - Document attachment preview implemented
- ✅ Preserve supported file type validation
  - Supports: PDF, PNG, JPG, GIF, WEBP, DOCX, TXT, MD

### 6.2 OCR Processing Decision Point ✅ DOCUMENTED
- ✅ **Current State**: OCR happens on BACKEND (Next.js API route)
- ✅ **Implementation Details:**
  - **Service:** Mistral AI OCR API (`mistral-ocr-latest` model)
  - **SDK:** `@mistralai/mistralai` v1.10.0
  - **Endpoint:** `/api/ocr` (Next.js API route)
  - **Client:** `src/lib/mistral-client.ts`
  - **Process Flow:**
    1. Frontend converts file to Base64
    2. POST to `/api/ocr` with Base64 data
    3. Backend processes via Mistral AI
    4. Returns extracted text + metadata
- ✅ **Template Approach:** Backend OCR is production-ready
  - No `NEXT_PUBLIC_OCR_MODE` flag needed (always backend)
- ✅ **Dependencies:** Already in package.json
- ✅ **Limitations Documented:**
  - Max 100,000 characters per document
  - Max 100 pages per document
  - 60-second processing timeout
  - 10MB file size limit

### 6.3 Document Handling Flow ✅
- ✅ Ensure documents can be attached to chat messages
  - Implemented in `use-chat-ocr.ts` and `use-chat-ocr-enhanced.ts`
- ✅ Handle file upload to storage (PocketBase files)
  - PocketBase integration in enhanced version
- ✅ Pass document references/URLs to agent backend
  - OCR text appended to user message: `[Document: filename]\n{ocrText}`
- ✅ Display documents in chat history appropriately
  - Document attachment component with status indicators

**OCR Status:** Production-ready, fully documented

---

## 7. Environment Configuration 🔄 IN PROGRESS

### Current State of `.env.local.example`:
```bash
# PocketBase Configuration
NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
POCKETBASE_ADMIN_EMAIL=admin@company.com
POCKETBASE_ADMIN_PASSWORD=your_secure_password_here

# Mistral AI Configuration
MISTRAL_API_KEY=your_mistral_api_key_here
MISTRAL_API_URL=https://api.mistral.ai/v1

# Optional: Session Secret for enhanced security
NEXTAUTH_SECRET=your_random_secret_here_generate_with_openssl

# Optional: App URL for production
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Missing Environment Variables (Needs Addition):
```bash
# Deep Identity Agents Backend (NOT YET CONFIGURED)
NEXT_PUBLIC_AGENT_API_URL=http://localhost:8000
AGENT_API_KEY=your-agent-api-key  # If authentication needed

# Application Configuration
NEXT_PUBLIC_APP_NAME=AI Assistant Dashboard

# Feature Flags (Optional)
NEXT_PUBLIC_ENABLE_FUNCTION_VISUALIZATION=true
NEXT_PUBLIC_USE_AGENT_BACKEND=false  # Toggle between Mistral direct vs Agent backend
```

### Notes:
- ⏳ Need to create comprehensive .env.example with all variables documented
- ⏳ Add descriptions for each environment variable
- ⏳ Document which variables are required vs optional
- ⏳ Add setup instructions for obtaining API keys

---

## 8. Documentation & Template Finalization ⏳ PENDING

### 8.1 README Updates ⏳
- ⏳ Generic project description
- ⏳ All environment variables with explanations
- ⏳ PocketBase setup instructions (collections, rules, file storage)
  - Schema available: `pb_schema.json` (ready to document)
- ⏳ How to connect to Deep Identity Agents backend
  - **Note:** Integration not yet implemented
- ⏳ How to customize branding
  - List all `[COMPANY_NAME]`, `[LOCATION]` placeholder locations
- ⏳ OCR setup instructions (frontend vs backend)
  - ✅ Technical details documented (Mistral AI backend OCR)
- ⏳ Streaming requirements and setup

### 8.2 Additional Documentation ⏳
- ⏳ Create `TEMPLATE_SETUP.md` with step-by-step customization guide
  - Include branding replacement checklist
  - Environment setup walkthrough
  - Deployment guide
- ⏳ Document function call visualization implementation
  - Component: `tool-call-display.tsx`
  - Current tools: `getCurrentTime` (example)
- ⏳ Add code comments in key config files
- ⏳ Create example screenshots of function call UI
- ⏳ Document expected agent API response format for function calls

### 8.3 Developer Experience ⏳
- ⏳ Add TypeScript types for agent responses
- ⏳ Create utility functions for parsing streaming events
  - Some exist in `chat-interface.tsx` (can be extracted)
- ⏳ Add example implementations for common customizations

---

## 9. Testing & Verification ⏳ PENDING

### 9.1 Core Functionality ⏳
- ⏳ Test app runs with fresh environment variables
  - ✅ PocketBase connection tested (uses env vars)
  - ✅ Mistral AI connection tested (uses env vars)
  - ⏳ Agent backend connection (not yet implemented)
- ✅ Verify all client-specific references are removed
  - Completed in Section 2 & 3
- ⏳ Ensure template connects to standard agent backend
  - **Blocked:** Agent integration not implemented (Section 5)

### 9.2 Feature Testing ⏳
- ⏳ **Streaming**: Verify progressive chat response rendering
  - ✅ Works with Mistral direct connection
  - ⏳ Needs testing with agent backend
- ⏳ **Function Calls**: Test visualization appears for tool usage
  - ✅ Component exists and functional
  - ⏳ Needs real agent tools to test
- ⏳ **OCR**: Upload document and verify processing works
  - ✅ Technical implementation verified
  - ⏳ End-to-end testing needed
- ⏳ **PocketBase**: Test auth, data persistence, and file storage
  - ✅ Implementation verified
  - ⏳ Manual testing needed
- ⏳ **Error Handling**: Test failure scenarios
  - ⏳ Network issues
  - ⏳ OCR fails
  - ⏳ Function errors

### 9.3 Edge Cases ⏳
- ⏳ Large file uploads (test 10MB limit)
- ⏳ Multiple concurrent function calls
- ⏳ Long-running agent operations (60s timeout)
- ⏳ Streaming connection interruptions

---

## 10. Future Considerations

- ✅ OCR currently uses Mistral AI backend (production-ready)
- ⏳ Note in docs: "OCR could potentially move to Deep Identity Agents backend"
- ⏳ Consider creating migration guide for moving OCR to agent backend
- ⏳ Document any assumptions about agent capabilities
- ⏳ Add version compatibility notes between frontend and backend
  - Frontend: Next.js 15.1.5, React 19
  - Backend: Pydantic AI 1.0.14, Python 3.x
- ⏳ Plan for potential PocketBase to other database migrations
- ⚠️ **Critical:** Implement agent backend integration (currently missing)

---

## Success Criteria

The template is ready when:
- 🔄 A new developer can clone and run with only environment variable changes
  - ✅ Works with Mistral AI direct
  - ⏳ Needs agent backend setup documentation
- ✅ All client-specific branding is removed
  - **Status:** Complete (29 files updated)
- ❌ Streaming chat works with agent backend
  - **Status:** Blocked - no agent integration exists
- 🔄 Function calls are visualized in real-time
  - ✅ Component implemented
  - ⏳ Needs agent MCP tool integration
- ✅ Documents can be uploaded and processed via OCR
  - **Status:** Complete - Mistral AI OCR working
- 🔄 PocketBase integration is documented and functional
  - ✅ Functional
  - ⏳ Needs documentation
- ⏳ Code is well-commented with clear customization points

---

## Next Steps (Priority Order)

1. **HIGH PRIORITY:** Setup and Test Pydantic AI Agent Backend
   - Read `pydantic-agents-core/README.md` and understand BaseCamp framework
   - Get `pydantic_agents/server.py` running
   - Test with Context7 MCP server: https://mcp.context7.com/mcp
   - Verify agent responds properly

2. **HIGH PRIORITY:** Implement Deep Identity Agent Integration
   - Add `NEXT_PUBLIC_AGENT_API_URL` to env vars
   - Create `/api/agent` proxy route
   - Implement streaming in backend (`/chat/stream`)
   - Update frontend to support agent backend toggle

3. **MEDIUM PRIORITY:** Complete Environment Configuration
   - Create comprehensive `.env.example`
   - Document all environment variables
   - Add setup instructions

4. **MEDIUM PRIORITY:** Automate PocketBase Schema Application
   - Investigate how to automatically apply `pb_schema.json` to PocketBase instance
   - Use TwoFeetBase MCP server for PocketBase documentation and APIs
   - Create setup script or instructions for schema import
   - Document the process in TEMPLATE_SETUP.md

5. **MEDIUM PRIORITY:** Documentation
   - Create `TEMPLATE_SETUP.md`
   - Update `README.md` with setup guide
   - Document PocketBase schema requirements
   - Add code comments

5. **LOW PRIORITY:** Testing & Verification
   - End-to-end testing with agent backend
   - OCR functionality testing
   - Error handling verification

---

## Technical Debt & Known Issues

### Critical ⚠️
1. **No Agent Backend Integration** - Frontend bypasses Pydantic AI entirely
2. **Backend Lacks Streaming** - Returns complete responses only
3. **Missing Authentication** - No auth between frontend and agent backend

### Medium 🔶
1. **Inconsistent Fallbacks** - PocketBase URLs use different fallbacks (127.0.0.1 vs localhost)
2. **Limited Tool Support** - Only `getCurrentTime` example tool
3. **No Conversation Sync** - PocketBase conversations don't sync with agent backend

### Low 📝
1. **Line Ending Warnings** - LF will be replaced by CRLF (cosmetic Git warning)
2. **Missing Logo** - Template needs placeholder logo file
3. **No Favicon** - Should add generic favicon

---

## Files Modified Summary

**Deleted:** 14 files (Facturatie tool, client logo)
**Modified:** 29 files (branding cleanup, env vars)
**Created:** 0 new files yet

**Total Changes:** -2,703 lines, +82 lines
