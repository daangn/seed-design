---
description: $COMPONENT_NAME $PATTERN
allowed-tools: Read, Edit, Write, Glob, Grep, Bash
---

# React Headless 개발

`seed-create-component` 스킬의 React 플랫폼 게이트와 Headless 참고 문서를 사용해 스타일 없는 React Headless 컴포넌트를 구현합니다.

## 인자

- $COMPONENT_NAME: 대상 컴포넌트 이름. PascalCase를 사용합니다.
- $PATTERN: 선택 사항. `single|multipart|hook-only`

## 필수 결과

1. Hook과 컴포넌트 구조는 `useX.ts`와 `X.tsx` 규칙을 따릅니다.
2. 상태는 `data-*` 속성으로 노출하고 제어·비제어 흐름을 지원합니다.
3. 컴포넌트를 export하는 곳에는 `forwardRef`와 `displayName`을 적용합니다.
