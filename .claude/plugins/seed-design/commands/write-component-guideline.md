---
description: $COMPONENT_ID $DOC_TYPE
allowed-tools: Read, Edit, Write, Glob, Grep, Bash
---

# Write Component Guideline

Use the `write-component-guideline` skill to create or update design guideline docs.

## Arguments

- $COMPONENT_ID: target component id (must match rootage yaml)
- $DOC_TYPE: `simple|comprehensive`

## Required Output

1. `docs/content/docs/components/{component-id}.mdx` is created or updated
2. Props table is aligned with rootage yaml
3. Image naming/path conventions and MDX component usage are validated
