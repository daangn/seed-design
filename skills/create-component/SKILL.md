---
name: create-component
description: End-to-end SEED component implementation guide for React Web, Lynx, and cross-platform component work. Starts by deciding the target platform, then clarifies requirements, makes architecture decisions, follows the platform/category-specific pattern, and runs verification. Use this whenever the user is adding a new component, changing behavior across component layers, extending a snippet, or touching component docs — even if they don't explicitly say "create component". Always invoke before touching rootage YAML, qvism or lynx-qvism recipes, react/lynx-react/lynx-react-headless packages, docs registry snippets, or component docs. Covers all 5 component categories and refuses to skip platform gating or requirements brainstorming.
---

# Create Component

이 문서는 **라우터**다. 컴포넌트 작업의 흐름과 게이트만 정의하고, 실제 내용은 각 Phase의 reference 파일에 있다. **각 Phase에 진입할 때 해당 reference를 그때 읽는다.** 모두 미리 읽지 않는다.

## 핵심 흐름

```text
Platform Gate  →  Delivery Surface Gate  →  Phase 0 Pre (Brainstorm)  →  Phase 0 (Architecture)  →  Phase 1 (Implementation)  →  Phase 2 (Verification)
 React/Lynx 결정      package/snippet 판단           사용자 합의              아키텍처 결정              레이어별 구현                자동·수동 검증
```

각 Phase 사이에 **게이트**가 있다. 게이트 통과 전까지 다음 Phase로 가지 않는다. 흐름이 깨지면 빠진 요구사항·어긋난 아키텍처·우회된 검증이 누적되어 다른 컴포넌트까지 흔든다.

---

## 막힘 처리 (모든 Phase 공통)

작업 중 막히면 **임의 우회·mock·`as any`·테스트 생략·"나중에 고치자" 금지.** 통증 메모 작성 → 사용자 보고 → 결정 후 재시도.

상세 룰과 차단점 분류표: **`references/sticking-policy.md`**

---

## Platform Gate: 대상 플랫폼 결정

**진입 시 즉시 읽기 → `references/platform-gate.md`**

Phase 0 Pre 전에 target platform을 `react` / `lynx` / `cross-platform` 중 하나로 확정한다. 플랫폼이 정해져야 Headless, Recipe, Styled UI, Snippet, Docs, Example, Verification 경로가 결정된다.

### 🔒 게이트 Platform → 0Pre
- target platform 확정
- `cross-platform`이면 shared Rootage/API와 플랫폼별 구현 분리 원칙 확인
- 새 `packages/lynx-react-headless/<component>` 패키지가 필요하면 사용자 확인 전 구현 금지

---

## Delivery Surface Gate: 공개 표면 결정

**진입 시 즉시 읽기 → `references/api-design.md`의 "Delivery Surface Gate"와 "Analog Parity Check"**

Platform Gate 직후, 구현 전에 이 컴포넌트를 **package export**, **registry snippet**, **둘 다**, **docs-only** 중 어디로 제공할지 확정한다. React 동등 컴포넌트가 있다면 variant/interface뿐 아니라 docs Usage import, registry 존재 여부, package export, example surface를 함께 비교한다.

snippet은 wrapper가 실질적인 가치를 추가할 때만 만든다. 단일 package import로 충분한 presentational primitive를 "컴포넌트 전체 플로우"라는 이유만으로 registry snippet으로 만들지 않는다.

### 🔒 게이트 Delivery Surface → 0Pre
- 공개 표면 확정: package-only / snippet-only / package+snippet / docs-only
- 동등 React/Lynx 컴포넌트의 docs Usage, registry, package export, example surface 확인
- snippet이 필요하면 wrapper value를 한 문장으로 설명
- snippet이 필요 없으면 registry/vendored example 작업을 명시적으로 제외

---

## Phase 0 Pre: 요구사항 Brainstorming

**진입 시 즉시 읽기 → `references/brainstorming.md`**

Platform Gate 결과를 전제로 사용자와 5개 영역(Purpose / 기존과의 관계 / 엣지케이스 / 토큰 의존성 / 외부 레퍼런스 우선순위)을 1:1 대화로 합의한다. 질문은 한 번에 하나씩, 객관식 우선. 추측해서 채우지 않는다.

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
- target platform이 `lynx` 또는 `cross-platform`이면 → `references/lynx-patterns.md` (Lynx runtime 제약 + headless/styled 책임 분리)

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
| Recipe 작성 | React는 `references/recipe-patterns.md`, Lynx는 `references/lynx-patterns.md` + `packages/lynx-qvism-preset/AGENTS.md` |
| Styled UI 작성 | React는 `references/react-patterns.md`, Lynx는 `references/lynx-patterns.md` |
| Snippet 레이어 설계 | `references/api-design.md` |
| Headless 훅/primitive 설계 (카테고리 C/D) | React는 `references/external-references.md`, Lynx는 `references/lynx-patterns.md` |

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

React 작업에서 필수:
- Storybook 4종 테마/스케일 (Light / Dark / FontScaling ExtraSmall / ExtraExtraExtraLarge)
- `examples/stackflow-spa`의 유사 Activity 확인 (없으면 신설 검토)
- docs 사이트의 컴포넌트 페이지 렌더링

Lynx 작업에서 필수:
- `examples/lynx-spa`의 유사 page 또는 vendored snippet 확인
- `docs/content/lynx`와 공개 표면 동기화. `docs/registry/lynx/ui`와 vendored snippet은 Delivery Surface Gate에서 snippet 필요로 결정된 경우만 확인
- Lynx package build/test 또는 root Lynx 검증 script 확인

마지막에 `/changeset` 스킬로 changeset 생성.

### 🔒 게이트 2 → 완료
- verification-checklist 모든 항목 통과
- 사용자에게 visual screenshot 보고 + 최종 컨펌

---

## 참조 파일 인덱스

| Phase | 파일 | 언제 읽는가 |
|-------|------|------------|
| 공통 | `references/sticking-policy.md` | 막혔을 때 |
| Platform | `references/platform-gate.md` | 컴포넌트 작업 시작 즉시 |
| Delivery Surface | `references/api-design.md` | Platform Gate 직후 공개 표면 결정 시 |
| 0 Pre | `references/brainstorming.md` | Phase 0 Pre 진입 즉시 |
| 0 | `references/architecture-decisions.md` | Phase 0 진입 즉시 |
| 0 | `references/pattern-catalog.md` | 카테고리 확정 후 |
| 0 | `references/external-references.md` | 외부 조사 / 차용 결정 시 (Phase 1의 Headless 훅 설계 시에도) |
| 0/1 | `references/lynx-patterns.md` | target platform이 `lynx` 또는 `cross-platform`일 때 |
| 1 | `references/guide.md` | Phase 1 진입 시 보조 |
| 1 | `references/implementation-steps.md` | Phase 1 진입 시 |
| 1 | `references/recipe-patterns.md` | Recipe 작성 단계 |
| 1 | `references/react-patterns.md` | React Styled UI 단계 |
| 1 | `references/api-design.md` | Snippet 레이어 단계 |
| 2 | `references/verification-checklist.md` | Phase 2 진입 시 |
| 2 | `references/visual-testing.md` | Phase 2 진입 시 |
| 유지보수 | `references/review-prompts.md` | 이 스킬 자체를 수정한 뒤 문서 리뷰할 때 |

---

## Correction Retro: 사용자 조정 후 자가 개선

사용자가 "이건 필요한가?", "왜 이렇게 판단했나?", "이 패턴은 아닌 것 같다"처럼 조정을 넣으면 구현만 고치지 말고 짧은 retro를 수행한다.

1. **빠진 맥락**: repo/docs/analog 중 무엇을 확인하지 않아 판단이 흔들렸는가?
2. **잘못 적용한 패턴**: 기존 성공 사례나 스킬 규칙을 어디에 과잉 일반화했는가?
3. **다음 판단 규칙**: 같은 상황에서 먼저 확인할 신호와 제외할 작업은 무엇인가?
4. **스킬 업데이트 후보**: 어느 reference에 durable rule로 넣을지 제안한다.

사용자가 스킬 보강을 원하거나 명시적으로 기억하라고 요청하면, 위 retro를 바탕으로 `SKILL.md` 또는 해당 reference를 함께 업데이트한다.
