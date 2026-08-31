---
description: $COMPONENT_ID $MODE
allowed-tools: Read, Glob, Grep, Bash
---

# 문서 일관성 확인

`seed-component-map` 스킬로 각 컴포넌트의 현재 경로를 수집합니다. `full` 또는 `props-only` 모드에서는 `seed-api-parity`도 사용하고, 확인하지 못한 차원은 추측하지 말고 `unknown`으로 보고합니다.

## 인자

- $COMPONENT_ID: 선택 사항. 생략하면 전체를 확인합니다.
- $MODE: 선택 사항. `full|props-only|existence-only`

## 필수 결과

1. 이름, 설명, props, component id의 일관성을 보고합니다.
2. 누락된 파일과 중요한 불일치를 보고합니다.
3. 컴포넌트별 상태를 `OK`, `WARN`, `ERROR` 중 하나로 짧게 표시합니다.
