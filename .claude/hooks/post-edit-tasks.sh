#!/bin/bash
FILE_PATH=$(jq -r '.tool_response.filePath')

EXECUTED_COMMANDS=()

# Function to run command and exit with code 2 on failure (so Claude sees the error)
run_with_feedback() {
  local output
  output=$("$@" 2>&1)
  local exit_code=$?

  if [[ $exit_code -ne 0 ]]; then
    echo "$output" >&2
    exit 2
  fi

  EXECUTED_COMMANDS+=("$*")
}

# ============================================================
# docs
# ============================================================
if [[ "$FILE_PATH" == *"docs/registry/"* ]]; then
  run_with_feedback bun --filter @seed-design/docs generate:registry
  run_with_feedback bun docs:test --dots
fi

# ============================================================
# packages
# ============================================================
if [[ "$FILE_PATH" == *"packages/rootage/"* ]]; then
  run_with_feedback bun rootage:generate
  run_with_feedback bun qvism:generate

elif [[ "$FILE_PATH" == *"packages/qvism-preset/"* ]]; then
  run_with_feedback bun qvism:generate

elif [[ "$FILE_PATH" == *"packages/react-headless/"* ]]; then
  run_with_feedback bun headless:build
  run_with_feedback bun headless:test --dots
  run_with_feedback bun --filter @seed-design/react build
  run_with_feedback bun react:test --dots

elif [[ "$FILE_PATH" == *"packages/react/"* ]]; then
  run_with_feedback bun --filter @seed-design/react build
  run_with_feedback bun react:test --dots

elif [[ "$FILE_PATH" == *"packages/figma/"* ]]; then
  run_with_feedback bun --filter @seed-design/figma build

elif [[ "$FILE_PATH" == *"packages/cli/"* ]]; then
  run_with_feedback bun --filter @seed-design/cli build
  run_with_feedback bun --filter @seed-design/cli test --dots
  
elif [[ "$FILE_PATH" == *"packages/stackflow/"* ]]; then
  run_with_feedback bun --filter @seed-design/stackflow build
fi

# ============================================================
# ecosystem
# ============================================================
if [[ "$FILE_PATH" == *"ecosystem/rootage/"* ]]; then
  run_with_feedback bun --filter @seed-design/rootage-core build
  run_with_feedback bun --filter @seed-design/rootage-cli build
  run_with_feedback bun rootage:test --dots
elif [[ "$FILE_PATH" == *"ecosystem/qvism/"* ]]; then
  run_with_feedback bun --filter @seed-design/qvism-core build
  run_with_feedback bun --filter @seed-design/qvism-cli build
  run_with_feedback bun --filter @seed-design/qvism-core test --dots
fi

# ============================================================
# Success feedback (only if any commands were executed)
# ============================================================
if [[ ${#EXECUTED_COMMANDS[@]} -gt 0 ]]; then
  echo "✓ All tasks completed successfully:" >&2
  for cmd in "${EXECUTED_COMMANDS[@]}"; do
    echo "  - $cmd" >&2
  done
  exit 2
fi
