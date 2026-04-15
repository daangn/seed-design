---
name: create-component
description: End-to-end SEED component implementation guide from rootage spec to recipe, react, docs, and verification. Use when adding a new component or changing component behavior across layers. Covers architecture decisions, pattern selection, accessibility design, and implementation across all 5 component categories (simple, compound stateless, compound stateful, multi-recipe, layout).
---

# Create Component

컴포넌트를 구현하기 전에 아키텍처 결정을 먼저 내리고, 카테고리에 맞는 패턴을 따라 구현한다.

## Phase 0: 아키텍처 분석 (구현 전 필수)

`references/architecture-decisions.md`의 체크리스트를 **모두 완료**한다. 이 단계에서 결정되는 것:

1. **컴포넌트 카테고리** (A~E) → 사용할 유틸리티, 파일 구조, recipe 타입이 결정됨
2. **Headless 레이어** 필요 여부 → 기존 재사용 or 신규 생성
3. **의존성 안정성** → 불안정하면 구현 중단 (BLOCKING GATE)
4. **외부 레퍼런스 + 접근성** (카테고리 C/D) → ARIA APG 패턴, 키보드 인터랙션 스펙
5. **패턴 참조 컴포넌트** → 이후 모든 단계의 가이드

Phase 0이 완료되면 `references/pattern-catalog.md`에서 해당 카테고리의 레퍼런스를 확인한다.

## Phase 1: 구현

각 단계에서 수정 대상 폴더의 `AGENTS.md`를 먼저 읽고, **패턴 참조 컴포넌트의 해당 파일을 먼저 읽은 뒤** 구현한다.

상세 절차: `references/implementation-steps.md`

카테고리별 필요한 추가 참조:

| 조건 | 참조 문서 |
|------|----------|
| Recipe 작성 시 | `references/recipe-patterns.md` |
| React 컴포넌트 작성 시 | `references/react-patterns.md` |
| Snippet 레이어 설계 시 | `references/api-design.md` |
| Headless 훅 설계 시 (카테고리 C/D) | `references/external-references.md` |

## Phase 2: 검증

1. `references/verification-checklist.md` 완료
2. `references/visual-testing.md` 수행
3. Changeset 생성 (`/changeset` 스킬 참조)

## 참조 파일 전체 목록

### 아키텍처 결정
- `references/architecture-decisions.md` — Phase 0 의사결정 체크리스트
- `references/pattern-catalog.md` — 5가지 카테고리별 레퍼런스 + 유틸리티 맵

### 구현 가이드
- `references/guide.md` — 전체 흐름 개요
- `references/implementation-steps.md` — 단계별 구현 상세
- `references/recipe-patterns.md` — Token 경로, pseudo 선택자, 아이콘 헬퍼, 애니메이션
- `references/react-patterns.md` — Context 유틸, form 통합, namespace, multi-recipe
- `references/api-design.md` — Snippet API 설계 원칙, block 패턴

### 외부 레퍼런스 + 접근성
- `references/external-references.md` — Base UI, Radix, Chakra, shadcn 참조 + ARIA/WCAG 가이드

### 검증
- `references/verification-checklist.md` — 완료 전 체크리스트
- `references/visual-testing.md` — 브라우저 테스트 방법
