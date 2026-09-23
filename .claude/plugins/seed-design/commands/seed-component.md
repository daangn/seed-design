---
description: $COMPONENT_ID $COMPONENT_NAME $WITH_HEADLESS
allowed-tools: Read, Edit, Write, Glob, Grep, Bash
---

# 컴포넌트 생성 흐름

`seed-component` Skill의「새 컴포넌트 또는 한 플랫폼이 없는 포팅」분기(`references/implementation-workflow.md#신규포팅`)로 SEED 컴포넌트를 처음부터 끝까지 구현한다.

## 인자

- $COMPONENT_ID: Rootage와 문서 경로에 쓸 kebab-case 컴포넌트 id
- $COMPONENT_NAME: PascalCase 컴포넌트 이름
- $WITH_HEADLESS: 선택. `true|false`, 기본값 `false`. `true`면 `packages/react-headless/<id>/`도 만든다.

## 필수 결과

1. Rootage 명세, Recipe, React 구현, 문서, 예제를 `references/implementation-steps.md`의 순서대로 갱신한다.
2. 원천을 바꾼 뒤 루트 `AGENTS.md`「생성」의 해당 명령을 실행한다. Rootage 변경이면 `bun rootage:generate && bun qvism:generate`다.
3. 루트 `AGENTS.md`「검증」의 경로별 테스트, `bun packages:build`, 시각 검증 결과를 보고한다.
