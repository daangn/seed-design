---
description: $TARGET $DEPRECATED_IN $REMOVE_IN $REPLACEMENT $REASON
allowed-tools: Read, Edit, Write, Glob, Grep, Bash
---

# 지원 중단 흐름

`seed-deprecation` 스킬로 컴포넌트, 인터페이스, 파운데이션 토큰의 지원 중단을 진행합니다.

## 입력 처리

- 필수 값이 없으면 TARGET → DEPRECATED_IN → REMOVE_IN → REPLACEMENT → REASON 순서로 사용자에게 묻습니다.
- $ARGUMENTS가 있으면 추가 질문 전에 JSON 또는 `key=value` 형식으로 해석합니다.

## 인자

- $TARGET: Deprecated 대상 (예: ImageFrame rounded 옵션)
- $DEPRECATED_IN: Deprecated 적용 버전 (예: 1.2.x)
- $REMOVE_IN: 제거 예정 버전 (예: 1.3.0)
- $REPLACEMENT: 대체안 (예: borderRadius="r2")
- $REASON: Deprecated 이유

## 필수 결과

1. 대상에 @deprecated JSDoc 추가 (이유, 제거 버전, 대체안 포함)
2. 관련 문서 업데이트
3. docs/content/docs/migration/deprecations.mdx 갱신
4. Rootage 변경 시 rootage:generate 실행
