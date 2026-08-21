---
description: llms.txt 변환 룰 개발 가이드
alwaysApply: true
---

# AGENTS.md

## 디렉토리 개요

`docs/app/_llms`는 문서의 `processed` MDX를 LLM 친화 텍스트로 정제하는 모듈이다. MDX AST 기반 룰 시스템으로 llms.txt 출력 품질을 제어한다. 입력인 `processed`는 상위 `app/source.tsx`의 remark 파이프라인이 만들고, 정제된 결과는 `llms-route.ts`가 서빙한다.

## 파일 작성 컨벤션

- 룰은 컴포넌트 하나당 한 파일씩 `rules/<컴포넌트명 kebab-case>-rule.ts`로 둔다.
- 룰 단위 테스트는 구현 옆에 같은 이름의 `.test.ts`로 둔다.
- 여러 룰이 공유하는 헬퍼는 `-rule` 접미사 없이 역할 이름으로 둔다(`markdown-utils.ts`, `estree-utils.ts`).
- fixture는 `__fixtures__/<룰 이름>/<케이스>.input.mdx`와 `.output.mdx` 쌍으로 두고, 여러 룰이 함께 걸리는 케이스만 `__fixtures__/pipeline/`에 둔다.
- 생성물이나 외부 패키지 데이터에 묶이는 입력은 fixture로 만들지 않는다(TECH.md 「테스트 작성」). 그 데이터가 바뀌면 룰이 멀쩡해도 fixture가 깨진다.
- barrel file은 `rules/index.ts` 하나뿐이다. 나머지 모듈은 파일 경로로 직접 import한다.

## 코드 작성 컨벤션

- 룰은 `Rule` 인터페이스를 구현해 `rules/`에 분리한다.
- 룰은 `match`(대상 식별)와 `transform`(노드 변환)을 분리한다.
- 변환 실패 시 예외를 전파하지 말고 원본 노드를 반환해 안전하게 실패한다.
- 문자열 정규식 후처리보다 AST 변환을 우선한다.
- 테스트 단언은 TECH.md 「테스트 작성」을 따른다. 이 폴더에서는 파이프라인 검증에 fixture를, 룰 단위 검증에 inline snapshot을 쓴다.

## 필수 작업 절차

1. 룰 추가/변경 시 `rules/`에 독립 모듈로 구현하고, 새 컴포넌트를 다루면 `rule-elements.ts`의 `RULE_ELEMENT_NAMES`에 이름을 추가한다.
2. 룰 단위 검증은 inline snapshot으로 충분하다. 파이프라인 fixture(`__fixtures__/pipeline`)에 케이스를 추가한다.
3. 룰 단위 테스트와 파이프라인 테스트를 모두 갱신한다.
4. 아래 검증을 통과시킨다.
   - `cd docs && bun test app/_llms`

## 변경되지 않는 중요 규칙

- 공개 인터페이스 `normalizeLLMBody(content?: string): string` 시그니처는 유지한다.
- 룰 활성 순서는 `rules/index.ts`에서 단일 진입점으로 관리한다.
- `RULE_ELEMENT_NAMES`에 없는 컴포넌트는 `processed`에서 태그가 접혀, 자식이 없으면 흔적조차 남지 않는다. 룰이 아무리 정확해도 변환할 노드가 오지 않는다.
- fixture를 읽어 비교할 때는 `normalizeForAssert`(개행 정규화 + trim)를 양쪽에 적용한다. 기대값이 소스 안 문자열 리터럴이면 CRLF도 여백도 생길 수 없어 항등 연산이므로 쓰지 않는다.
- llms.txt 변환 품질은 fixture를 소스 오브 트루스로 관리한다.
