---
description: $COMPONENT_ID $MODE
allowed-tools: Read, Glob, Grep, Bash
---

# 문서 일관성 확인

`seed-component` Skill의 읽기 전용 분기로 컴포넌트 문서·구현의 일관성을 확인한다. 파일을 고치지 않고 보고만 한다.

## 인자

- $COMPONENT_ID: 선택. 생략하면 `docs/content/components/`의 최상위 MDX 파일명마다 확인한다.
- $MODE: 선택. `full|props-only|existence-only`

## 절차

1. 컴포넌트마다 경로 조회 분기(`references/component-map.md`)를 실행한다: `bun skills/seed-component/scripts/component-map.ts <component>`. 한 번에 한 컴포넌트만 받는다.
2. $MODE가 `full` 또는 `props-only` → API 비교 분기(`references/api-parity.md`)도 실행한다: `bun skills/seed-component/scripts/api-parity.ts <component>`. `existence-only` → 1단계만 쓴다.
3. 확인하지 못한 차원은 추측하지 말고 `unknown`으로 보고한다.

## 필수 결과

1. 이름, 설명, props, component id의 일관성
2. 누락된 파일과 중요한 불일치
3. 컴포넌트별 상태를 `OK`, `WARN`, `ERROR` 중 하나로 짧게 표시
