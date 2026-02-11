---
description: $COMPONENT_ID $COMPONENT_NAME $HAS_SNIPPET
allowed-tools: Read, Edit, Write, Glob, Grep, Bash
---

# Write React Component Docs

Use the `write-react-component-docs` skill to generate or update React component docs.

## Arguments

- $COMPONENT_ID: target component id
- $COMPONENT_NAME: display name
- $HAS_SNIPPET: optional; `true|false`

## Required Output

1. `docs/content/react/components/{component-id}.mdx` is created or updated
2. Usage/Examples sections reference existing example files correctly
3. Snippet presence is reflected in Installation/Usage guidance
