# Multi-stage build for 365 Hub
# Builds both Next.js frontend and Python backend

# Stage 1: Build Next.js frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy package files
COPY nextjs-frontend-template/package*.json ./

# Install dependencies
RUN npm ci

# Copy frontend source
COPY nextjs-frontend-template/ ./

# Build Next.js app
RUN npm run build

# Stage 2: Python backend setup
FROM python:3.11-slim AS backend-builder

# Accept GitHub PAT as build argument
ARG GITHUB_PAT

WORKDIR /app/backend

# Install system dependencies including git for installing from git repos
RUN apt-get update && apt-get install -y \
    gcc \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy Python requirements
COPY requirements.txt ./

# Install Python dependencies
# Install BaseCamp (pydantic-agents-core) directly from git using PAT
RUN pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir git+https://${GITHUB_PAT}@github.com/TwoFeetUp/BaseCamp.git

# Stage 3: Final production image
FROM python:3.11-slim

# Install Node.js for running Next.js
RUN apt-get update && apt-get install -y \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy Python backend
COPY --from=backend-builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=backend-builder /usr/local/bin /usr/local/bin
COPY pydantic_agents/ ./pydantic_agents/

# Copy Next.js frontend build
COPY --from=frontend-builder /app/frontend/.next ./nextjs-frontend-template/.next
COPY --from=frontend-builder /app/frontend/public ./nextjs-frontend-template/public
COPY --from=frontend-builder /app/frontend/package*.json ./nextjs-frontend-template/
COPY --from=frontend-builder /app/frontend/node_modules ./nextjs-frontend-template/node_modules

# Copy environment files (if needed)
COPY .env.example .env

# Expose ports
# 8000 for FastAPI backend
# 3000 for Next.js frontend
EXPOSE 8000 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Start both services
# In production, you might want to use a process manager like supervisord
CMD python -m pydantic_agents.server & cd nextjs-frontend-template && npm start
