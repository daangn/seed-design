#!/bin/bash
FILE_PATH=$(jq -r '.tool_response.filePath')

# Function to run command and exit with code 2 on failure (so Claude sees the error)
run_with_feedback() {
  local output
  output=$("$@" 2>&1)
  local exit_code=$?

  if [[ $exit_code -ne 0 ]]; then
    echo "$output" >&2
    exit 2
  fi
}

# ============================================================
# docs
# ============================================================
if [[ "$FILE_PATH" == *"docs/registry/"* ]]; then
  run_with_feedback bun generate:registry
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
  run_with_feedback bun headless:test
  run_with_feedback bun --filter @seed-design/react build
  run_with_feedback bun react:test

elif [[ "$FILE_PATH" == *"packages/react/"* ]]; then
  run_with_feedback bun --filter @seed-design/react build
  run_with_feedback bun react:test

elif [[ "$FILE_PATH" == *"packages/figma/"* ]]; then
  run_with_feedback bun --filter @seed-design/figma build

elif [[ "$FILE_PATH" == *"packages/cli/"* ]]; then
  run_with_feedback bun --filter @seed-design/cli build
  run_with_feedback bun --filter @seed-design/cli test
  
elif [[ "$FILE_PATH" == *"packages/stackflow/"* ]]; then
  run_with_feedback bun --filter @seed-design/stackflow build
fi

# ============================================================
# ecosystem
# ============================================================
if [[ "$FILE_PATH" == *"ecosystem/rootage/"* ]]; then
  run_with_feedback bun --filter @seed-design/rootage-core build
  run_with_feedback bun --filter @seed-design/rootage-cli build
  run_with_feedback bun rootage:test
elif [[ "$FILE_PATH" == *"ecosystem/qvism/"* ]]; then
  run_with_feedback bun --filter @seed-design/qvism-core build
  run_with_feedback bun --filter @seed-design/qvism-cli build
  run_with_feedback bun --filter @seed-design/qvism-core test
fi
