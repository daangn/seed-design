#!/usr/bin/env bash

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
HOOK_DIR="$PROJECT_ROOT/.claude/hooks"

# Change to project root
cd "$PROJECT_ROOT"

# Run TypeScript directly with Bun
bun run "$HOOK_DIR/validation-reminder.ts"
