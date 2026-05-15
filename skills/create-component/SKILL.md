---
name: create-component
description: End-to-end SEED component implementation guide that starts with a brainstorming session to clarify requirements, then makes architecture decisions, follows the category-specific pattern, and runs through verification. Use this whenever the user is adding a new component, changing behavior across component layers, or extending a snippet — even if they don't explicitly say "create component". Always invoke this skill before touching rootage YAML, qvism recipes, react packages, or component docs. Covers all 5 component categories (simple, compound stateless, compound stateful, multi-recipe, layout) and refuses to skip the requirements brainstorming.
---

# Create Component

이 문서는 **라우터**다. 컴포넌트 작업의 흐름과 게이트만 정의하고, 실제 내용은 각 Phase의 reference 파일에 있다. **각 Phase에 진입할 때 해당 reference를 그때 읽는다.** 모두 미리 읽지 않는다.

## 핵심 흐름

```text
Phase 0 Pre (Brainstorm)  →  Phase 0 (Architecture)  →  Phase 1 (Implementation)  →  Phase 2 (Verification)
       사용자 합의              아키텍처 결정              레이어별 구현                자동·수동 검증
```

각 Phase 사이에 **게이트**가 있다. 게이트 통과 전까지 다음 Phase로 가지 않는다. 흐름이 깨지면 빠진 요구사항·어긋난 아키텍처·우회된 검증이 누적되어 다른 컴포넌트까지 흔든다.

---

## 막힘 처리 (모든 Phase 공통)

작업 중 막히면 **임의 우회·mock·`as any`·테스트 생략·"나중에 고치자" 금지.** 통증 메모 작성 → 사용자 보고 → 결정 후 재시도.

상세 룰과 차단점 분류표: **`references/sticking-policy.md`**

---

## Phase 0 Pre: 요구사항 Brainstorming

**진입 시 즉시 읽기 → `references/brainstorming.md`**

사용자와 5개 영역(Purpose / 기존과의 관계 / 엣지케이스 / 토큰 의존성 / 외부 레퍼런스 우선순위)을 1:1 대화로 합의한다. 질문은 한 번에 하나씩, 객관식 우선. 추측해서 채우지 않는다.

산출물: 합의 요약 (메모 또는 PR description 초안).

### 🔒 게이트 0Pre → 0
사용자가 합의 요약을 보고 **"이대로 진행"**이라고 명시적으로 컨펌해야 Phase 0 진입.

---

## Phase 0: 아키텍처 분석

**진입 시 읽기 → `references/architecture-decisions.md`**

Phase 0 Pre의 합의를 입력으로 받아 컴포넌트 카테고리(A~E), Headless 레이어 여부, 의존성 안정성, 외부 레퍼런스 + 접근성, 패턴 참조 컴포넌트를 결정한다.

**조건부 추가 reference:**
- 카테고리 확정 후 → `references/pattern-catalog.md` (카테고리별 레퍼런스 + 유틸리티 맵)
- 외부 라이브러리 조사 / 차용 결정 시 → `references/external-references.md` (라이브러리 우선순위 + 차용 결정 트리 + ARIA/WCAG)

### 🔒 게이트 0 → 1
- architecture-decisions.md 체크리스트 모든 항목 완료
- **의존성 BLOCKING이면 구현 시작 금지** (sticking-policy로)
- 사용자에게 "Phase 0 결과 요약" 보고하고 컨펌

---

## Phase 1: 구현

**진입 시 읽기 → `references/implementation-steps.md`** (전체 구현 절차)
**보조 → `references/guide.md`** (전체 흐름 개요, quick reference)

각 단계 진입 시 수정 대상 폴더의 `AGENTS.md`를 먼저 읽고, 패턴 참조 컴포넌트의 해당 파일을 먼저 읽은 뒤 구현한다.

**단계별 reference (해당 단계 진입 시에만 읽기):**

| 단계 | 읽을 reference |
|------|---------------|
| Recipe 작성 | `references/recipe-patterns.md` |
| React 컴포넌트 작성 | `references/react-patterns.md` |
| Snippet 레이어 설계 | `references/api-design.md` |
| Headless 훅 설계 (카테고리 C/D) | `references/external-references.md` |

### 🔒 게이트 1 → 2
자동 검증 4개 명령이 모두 통과해야 Phase 2 진입:

```bash
bun generate:all          # 토큰/recipe 생성
bun test:all              # 단위 테스트
bun packages:build        # 패키지 빌드
bun docs:test             # 문서 정합성
```

어느 하나라도 실패하면 sticking-policy로.

---

## Phase 2: 검증

**진입 시 읽기 → `references/verification-checklist.md` + `references/visual-testing.md`**

모든 카테고리에서 필수:
- Storybook 4종 테마/스케일 (Light / Dark / FontScaling ExtraSmall / ExtraExtraExtraLarge)
- `examples/stackflow-spa`의 유사 Activity 확인 (없으면 신설 검토)
- docs 사이트의 컴포넌트 페이지 렌더링

마지막에 `/changeset` 스킬로 changeset 생성.

### 🔒 게이트 2 → 완료
- verification-checklist 모든 항목 통과
- 사용자에게 visual screenshot 보고 + 최종 컨펌

---

## 참조 파일 인덱스

| Phase | 파일 | 언제 읽는가 |
|-------|------|------------|
| 공통 | `references/sticking-policy.md` | 막혔을 때 |
| 0 Pre | `references/brainstorming.md` | Phase 0 Pre 진입 즉시 |
| 0 | `references/architecture-decisions.md` | Phase 0 진입 즉시 |
| 0 | `references/pattern-catalog.md` | 카테고리 확정 후 |
| 0 | `references/external-references.md` | 외부 조사 / 차용 결정 시 (Phase 1의 Headless 훅 설계 시에도) |
| 1 | `references/guide.md` | Phase 1 진입 시 보조 |
| 1 | `references/implementation-steps.md` | Phase 1 진입 시 |
| 1 | `references/recipe-patterns.md` | Recipe 작성 단계 |
| 1 | `references/react-patterns.md` | React 컴포넌트 단계 |
| 1 | `references/api-design.md` | Snippet 레이어 단계 |
| 2 | `references/verification-checklist.md` | Phase 2 진입 시 |
| 2 | `references/visual-testing.md` | Phase 2 진입 시 |
