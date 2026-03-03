---
description: $TARGET_COMPONENT $TASK
allowed-tools: Read, Edit, Write, Glob, Grep, Bash
---

# Dev Figma V3 Migration Plugin

Use the `dev-figma-v3-migration-plugin` skill for mapping and migration plugin updates.

## Arguments

- $TARGET_COMPONENT: v2/v3 component name or mapping file target
- $TASK: optional; `extract|map|typecheck|debug`

## Required Output

1. Updated mapping files in `tools/figma-v3-migration/src/main/mapping`
2. `bun extract` and/or typecheck execution guidance or results
3. Clear migration notes for variant/property conversions
