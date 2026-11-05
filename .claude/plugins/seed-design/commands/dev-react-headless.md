---
description: $COMPONENT_NAME $PATTERN
allowed-tools: Read, Edit, Write, Glob, Grep, Bash
---

# React Headless 개발

`seed-component` Skill로 스타일 없는 React Headless 컴포넌트를 `packages/react-headless/<id>/`에 구현한다. 새 컴포넌트는「새 컴포넌트 또는 한 플랫폼이 없는 포팅」분기, 기존 컴포넌트는「기존 컴포넌트의 구현·동작·구조 변경」분기다(`references/implementation-workflow.md`). 대상 플랫폼은 `react`로 정하고(`references/platform-gate.md`), Headless 레이어는 `references/implementation-steps.md`「Step 1: Headless (선택)」과 `packages/react-headless/AGENTS.md`를 따른다.

## 인자

- $COMPONENT_NAME: 대상 컴포넌트 이름(PascalCase)
- $PATTERN: 선택. `single|multipart|hook-only`

## 필수 결과

1. Hook은 `use<Name>.ts`, 컴포넌트는 `<Name>.tsx`에 둔다. `hook-only`면 `use<Name>.ts`만 둔다.
2. `packages/react-headless/AGENTS.md`의 규칙(`data-*` 상태, `useControllableState`로 제어·비제어 지원, `forwardRef`)을 지키고, export하는 컴포넌트에 `displayName`을 둔다.
3. 루트 `AGENTS.md`「검증」의 `packages/react-headless/*/` 명령(`bun headless:test`)을 실행하고 결과를 보고한다.
