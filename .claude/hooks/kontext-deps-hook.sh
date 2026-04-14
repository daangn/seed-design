#!/bin/bash
HOOK_DIR="$(cd "$(dirname "$0")" && pwd)"
bun run "$HOOK_DIR/kontext-deps-hook.ts"
