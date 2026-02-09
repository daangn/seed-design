---
description: $COMPONENT_ID $MODE
allowed-tools: Read, Glob, Grep, Bash
---

# Check Docs Consistency

Use the `check-docs-consistency` skill to validate alignment across rootage/design/react docs.

## Arguments

- $COMPONENT_ID: optional; if omitted run full audit
- $MODE: optional; `full|props-only|existence-only`

## Required Output

1. Report name/description/props/component-id consistency
2. Report missing files and critical mismatches
3. Return compact status (`OK`, `WARN`, `ERROR`) per component
