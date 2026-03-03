---
description: $COMPONENT_ID $COMPONENT_NAME $WITH_HEADLESS
allowed-tools: Read, Edit, Write, Glob, Grep, Bash
---

# Create Component Flow

Use the `create-component` skill to implement a new component end-to-end in SEED Design.

## Arguments

- $COMPONENT_ID: kebab-case component id (for rootage/docs paths)
- $COMPONENT_NAME: PascalCase component name
- $WITH_HEADLESS: optional, `true|false` (default: false)

## Required Output

1. Rootage spec, recipe, React implementation, docs, and examples are updated in the right order
2. `bun generate:all` is executed after rootage changes
3. Validation checklist is reported (`bun packages:build`, `bun typecheck`, visual checks)
