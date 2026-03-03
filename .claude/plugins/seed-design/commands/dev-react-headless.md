---
description: $COMPONENT_NAME $PATTERN
allowed-tools: Read, Edit, Write, Glob, Grep, Bash
---

# Dev React Headless

Use the `dev-react-headless` skill to implement style-free React headless components.

## Arguments

- $COMPONENT_NAME: target component (PascalCase)
- $PATTERN: optional; `single|multipart|hook-only`

## Required Output

1. Hook/component structure follows `useX.ts` + `X.tsx` conventions
2. State exposure uses `data-*` attributes and supports controlled/uncontrolled flow
3. `forwardRef` and `displayName` are applied where component exports exist
