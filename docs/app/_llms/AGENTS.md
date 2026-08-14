---
description: llms.txt 변환 룰 개발 가이드
alwaysApply: true
---

# AGENTS.md

`docs/app/_llms`는 문서의 `processed` MDX를 LLM 친화 텍스트로 정제하는 모듈이다.

## 모듈 개요

- MDX AST 기반 룰 시스템으로 llms.txt 출력 품질을 제어한다.

## 코드 컨벤션

- 룰은 `Rule` 인터페이스를 구현해 `rules/`에 분리한다.
- 룰은 `match`(대상 식별)와 `transform`(노드 변환)을 분리한다.
- 변환 실패 시 예외를 전파하지 말고 원본 노드를 반환해 안전하게 실패한다.
- 문자열 정규식 후처리보다 AST 변환을 우선한다.
- 테스트 단언은 TECH.md 「테스트 작성」을 따른다. 이 폴더에서는 파이프라인 검증에 fixture를, 룰 단위 검증에 inline snapshot을 쓴다.

## 필수 작업 절차

1. 룰 추가/변경 시 `rules/`에 독립 모듈로 구현한다.
2. 룰 단위 검증은 inline snapshot으로 충분하다. 파이프라인 fixture(`__fixtures__/pipeline`)에 케이스를 추가한다.
3. 룰 단위 테스트와 파이프라인 테스트를 모두 갱신한다.
4. 아래 검증을 통과시킨다.
   - `cd docs && bun test app/_llms`

## 변경되지 않는 중요 규칙

- 공개 인터페이스 `normalizeLLMBody(content?: string): string` 시그니처는 유지한다.
- 룰 활성 순서는 `rules/index.ts`에서 단일 진입점으로 관리한다.
- fixture를 읽어 비교할 때는 `normalizeForAssert`(개행 정규화 + trim)를 양쪽에 적용한다. 기대값이 소스 안 문자열 리터럴이면 CRLF도 여백도 생길 수 없어 항등 연산이므로 쓰지 않는다.
- llms.txt 변환 품질은 fixture를 소스 오브 트루스로 관리한다.
