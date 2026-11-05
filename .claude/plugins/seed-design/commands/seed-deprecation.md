---
description: $TARGET $DEPRECATED_IN $REMOVE_IN $REPLACEMENT $REASON
allowed-tools: Read, Edit, Write, Glob, Grep, Bash
---

# 지원 중단 흐름

`seed-deprecation` Skill로 컴포넌트, 인터페이스, 파운데이션 토큰의 지원 중단을 진행한다.

## 입력 처리

1. $ARGUMENTS가 있으면 추가 질문 전에 JSON 또는 `key=value` 형식으로 해석한다.
2. 현재 변경과 릴리스 계획으로 정할 수 없는 값만 한 번에 묻는다. 질문 순서는 TARGET → DEPRECATED_IN → REMOVE_IN → REPLACEMENT → REASON이다.

## 인자

- $TARGET: 지원 중단 대상(예: ImageFrame `rounded` 옵션)
- $DEPRECATED_IN: 지원 중단 적용 버전(예: 1.2.x)
- $REMOVE_IN: 제거 예정 버전(예: 1.3.0)
- $REPLACEMENT: 대체안(예: `borderRadius="r2"`)
- $REASON: 지원 중단 이유

## 필수 결과

1. 대상에 `@deprecated` JSDoc을 추가한다. 이유, 제거 버전, 대체안을 포함한다.
2. 관련 문서를 갱신한다.
3. `docs/content/docs/migration/deprecations.mdx`를 갱신한다.
4. Rootage를 바꿨으면 루트 `AGENTS.md`「생성」의 명령(`bun rootage:generate && bun qvism:generate`)을 실행한다.
