---
description: $TARGET $DEPRECATED_IN $REMOVE_IN $REPLACEMENT $REASON
allowed-tools: Read, Edit, Write, Glob, Grep, Bash
---

# Deprecation Flow

Use the deprecation skill to deprecate a component, interface, or foundation token.

## Input Handling

- If any required fields are missing, ask the user for them in order: TARGET → DEPRECATED_IN → REMOVE_IN → REPLACEMENT → REASON.
- If $ARGUMENTS is provided, attempt to parse JSON or `key=value` pairs before asking follow-up questions.

## Arguments

- $TARGET: Deprecated 대상 (예: ImageFrame rounded 옵션)
- $DEPRECATED_IN: Deprecated 적용 버전 (예: 1.2.x)
- $REMOVE_IN: 제거 예정 버전 (예: 1.3.0)
- $REPLACEMENT: 대체안 (예: borderRadius="r2")
- $REASON: Deprecated 이유

## Required Output

1. 대상에 @deprecated JSDoc 추가 (이유, 제거 버전, 대체안 포함)
2. 관련 문서 업데이트
3. docs/content/docs/migration/deprecations.mdx 갱신
4. Rootage 변경 시 rootage:generate 실행
