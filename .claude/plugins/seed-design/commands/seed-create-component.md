---
description: $COMPONENT_ID $COMPONENT_NAME $WITH_HEADLESS
allowed-tools: Read, Edit, Write, Glob, Grep, Bash
---

# 컴포넌트 생성 흐름

`seed-create-component` 스킬로 SEED Design의 새 컴포넌트를 처음부터 끝까지 구현합니다.

## 인자

- $COMPONENT_ID: Rootage와 문서 경로에 사용할 kebab-case 컴포넌트 id
- $COMPONENT_NAME: PascalCase 컴포넌트 이름
- $WITH_HEADLESS: 선택 사항. `true|false`, 기본값은 `false`

## 필수 결과

1. Rootage 명세, Recipe, React 구현, 문서, 예제를 올바른 순서로 갱신합니다.
2. Rootage 변경 뒤 `bun generate:all`을 실행합니다.
3. `bun packages:build`, `bun typecheck`, 시각 검증 결과를 보고합니다.
