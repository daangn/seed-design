---
name: seed-create-component
description: SEED Design의 React, Lynx 또는 공통 컴포넌트를 추가하거나 변경할 때 현재 공개 표면 확인, 플랫폼별 API 비교, 아키텍처 결정, 파일 계획, 구현과 검증 게이트를 안내한다. 컴포넌트 API를 건드리지 않는 Storybook 전용 작업에는 짧은 경로를 제공한다.
---

# SEED 컴포넌트 만들기

이 문서는 **라우터**다. 컴포넌트 작업의 흐름과 게이트만 정의하고, 실제 내용은 각 Phase의 reference 파일에 있다. **각 Phase에 진입할 때 해당 reference를 그때 읽는다.** 모두 미리 읽지 않는다.

## 핵심 흐름

```text
Platform Gate → Current Surface → Delivery Surface → Phase 0 Pre → Phase 0 → Scaffold Plan → Phase 1 → Phase 2
 React/Lynx 결정       현재 경로·API 확인    package/snippet 판단    사용자 합의    아키텍처 결정    파일 경계 확인    구현       검증
```

각 Phase 사이에 **게이트**가 있다. 게이트 통과 전까지 다음 Phase로 가지 않는다. 흐름이 깨지면 빠진 요구사항·어긋난 아키텍처·우회된 검증이 누적되어 다른 컴포넌트까지 흔든다.

---

## Storybook-only fast path

요청이 `docs/stories/*.stories.tsx`, `docs/.storybook/*`의 작성·리팩터링·검증에만 한정되고 컴포넌트 API나 동작을 바꾸지 않으면 Platform/Delivery Surface/Phase 0 게이트를 적용하지 않는다.

1. `references/storybook.md`를 읽는다.
2. `docs/.storybook/preview.ts`, `docs/stories/utils/parameters.ts`, 가까운 기존 story를 확인한다.
3. CSF Next factory 패턴으로 작성하고 story별 동작 범위를 보존한다.
4. `references/storybook.md`의 검증 명령과 `references/visual-testing.md`의 Storybook 항목을 실행한다.

컴포넌트 API·상태·recipe까지 바뀌면 fast path를 중단하고 일반 핵심 흐름으로 돌아간다.

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

**현재 표면 확인 → `../seed-component-map/SKILL.md`**

기존 컴포넌트를 변경하거나 React/Lynx 동등성을 확인할 때는 먼저 현재 체크아웃의 컴포넌트 맵을 조회한다. 신규 컴포넌트라면 `not-found` 결과를 현재 표면이 없다는 근거로 사용한다. 결과에 나온 경로를 직접 읽은 뒤 공개 표면을 결정한다.

Target platform이 `cross-platform`이거나 두 플랫폼의 공개 API를 맞춰야 하면 **`../seed-api-parity/SKILL.md`**를 이어서 사용한다. `unknown` 차원은 누락으로 단정하지 않는다. 근거 경로와 상속 타입을 직접 확인한 뒤 Analog Parity Check에 기록한다.

**진입 시 즉시 읽기 → `references/api-design.md`의 "Delivery Surface Gate"와 "Analog Parity Check"**

Platform Gate 직후, 구현 전에 이 컴포넌트를 **package export**, **registry snippet**, **둘 다**, **docs-only** 중 어디로 제공할지 확정한다. React 동등 컴포넌트가 있다면 variant/interface뿐 아니라 docs Usage import, registry 존재 여부, package export, example surface를 함께 비교한다.

snippet은 wrapper가 실질적인 가치를 추가할 때만 만든다. 단일 package import로 충분한 presentational primitive를 "컴포넌트 전체 플로우"라는 이유만으로 registry snippet으로 만들지 않는다.

### 🔒 게이트 Delivery Surface → 0Pre
- 공개 표면 확정: package-only / snippet-only / package+snippet / docs-only
- `seed-component-map`으로 현재 표면 확인. 신규 컴포넌트는 `not-found` 확인
- React와 Lynx를 함께 다루면 `seed-api-parity` 결과와 `unknown` 확인 항목 기록
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
- 확정한 플랫폼과 공개 표면으로 쓰기 전 계획 생성

```bash
bun skills/seed-create-component/scripts/scaffold-plan.ts <component> \
  --platform <react|lynx|cross-platform> \
  --surface <package-only|snippet-only|package+snippet|docs-only>
```

이 스크립트는 아키텍처, Recipe 사용 여부, wrapper 가치를 결정하지 않는다. 이미 통과한 게이트의 결정을 파일 경로로 바꾸고 `source`, `reference`, `generated`, 기존 대상 충돌을 JSON으로 보여준다. 충돌을 검토하고 생성물을 직접 수정하지 않는다는 점을 확인한 뒤 Phase 1로 간다.

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
| Storybook 작성 (React) | `references/storybook.md` |

### 🔒 게이트 1 → 2

`references/verification-checklist.md`의 자동 검증 게이트가 모두 통과해야 Phase 2로 간다. 어느 하나라도 실패하면 sticking-policy로 처리한다.

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
- WebLynx와 실제 Lynx 실행은 `../seed-verify-lynx-example/SKILL.md`로 확인하고 entry, manifest, bundle, 세션 근거를 결과에 남김

마지막에 `seed-changeset` 스킬로 changeset 생성.

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
| 1 | `references/storybook.md` | React Storybook 작성·리팩터링 시 |
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
