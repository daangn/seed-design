# Phase 0: 아키텍처 결정

> **전제조건**: `references/brainstorming.md`의 Phase 0 Pre가 완료되어 있어야 한다. 즉 사용자와 Purpose, 기존과의 관계, 엣지케이스, 토큰 의존성, 외부 레퍼런스 우선순위가 합의된 상태에서 진입한다. 합의되지 않았으면 Phase 0 Pre로 돌아간다.

구현을 시작하기 전에 이 문서의 모든 섹션을 완료한다. 여기서 내린 결정이 이후 모든 단계의 파일 구조, 유틸리티 선택, recipe 타입, 플랫폼별 검증 표면을 결정한다.

## 0. Platform Gate 결과 확인

Phase 0에 들어오기 전에 `references/platform-gate.md`의 target platform이 확정되어 있어야 한다.

| 항목 | 값 |
|------|----|
| Target platform | react / lynx / cross-platform |
| Delivery surface | package-only / snippet-only / package+snippet / docs-only |
| Current surface | `seed-component-map`의 matched / ambiguous / not-found와 근거 경로 |
| API parity | cross-platform이면 `seed-api-parity` 차이와 직접 확인이 필요한 unknown 항목 |
| Docs/registry target | React: `docs/content/react` + 필요 시 `docs/registry/react/ui`, Lynx: `docs/content/lynx` + 필요 시 `docs/registry/lynx/ui` |
| Headless ownership | React headless / Lynx headless / styled-local / 없음 |
| Lynx support delta | N/A 또는 웹 대비 차이 |

`lynx` 또는 `cross-platform`이면 `references/lynx-patterns.md`를 함께 읽고, native tag literal JSX와 headless/styled 책임 분리 제약을 Phase 1 계획에 반영한다.

Phase 0 Pre의 산출물(합의 요약)이 다음 항목의 입력이 된다:
- 합의된 **유사 컴포넌트 매트릭스** → §6 패턴 참조 컴포넌트의 기본값
- 합의된 **엣지케이스** → §4b ARIA APG 패턴, §5 추가 요건 체크리스트
- 합의된 **토큰 의존성** → Phase 1 Step 2 (Rootage)에서 사용
- 합의된 **외부 레퍼런스 우선순위** → §4a 외부 라이브러리 조사의 1순위

## 1. 컴포넌트 카테고리 결정

아래 플로우를 따라 카테고리를 확정한다:

```text
이 컴포넌트에 스타일 recipe가 필요한가?
├─ No → 카테고리 E (Layout)
└─ Yes → 시각적 slot이 몇 개인가?
    ├─ 1개 → 카테고리 A (Simple)
    └─ 2개+ → 외부 상태 로직이 필요한가?
        │      (controlled/uncontrolled, 키보드 내비게이션, ARIA 관리)
        ├─ No → 카테고리 B (Compound Stateless)
        └─ Yes → 독립 사용 가능한 sub-recipe가 있는가?
            ├─ Yes → 카테고리 D (Multi-Recipe)
            └─ No → 카테고리 C (Compound Stateful)
```

카테고리가 결정되면 `references/pattern-catalog.md`에서 해당 카테고리의 레퍼런스 컴포넌트와 필수 유틸리티를 확인한다.

| 카테고리 | Recipe 타입 | React Web 패턴 | Namespace | React 레퍼런스 |
|----------|------------|-----------|-----------|---------|
| A. Simple | defineRecipe | splitVariantProps + forwardRef | 없음 | Badge |
| B. Compound (Stateless) | defineSlotRecipe | createSlotRecipeContext | 있음 | Avatar |
| C. Compound (Stateful) | defineSlotRecipe | createSlotRecipeContext + createWithStateProps | 있음 | TextField |
| D. Multi-Recipe | defineSlotRecipe ×2 | splitMultipleVariantsProps | 있음 | Checkbox |
| E. Layout | 없음 | Box 확장 | 없음 | Flex |

### 1a. Lynx 유틸리티 선택 게이트

Target platform이 `lynx` 또는 `cross-platform`이면 카테고리 표를 React Web 결정으로만 쓰고, Styled UI 구현 전에 `packages/lynx-react/src/utils`, `packages/lynx-react/src/hooks`, `packages/lynx-react/AGENTS.md`를 확인해 유틸리티 적용 여부를 별도로 기록한다.

| 유틸리티/훅 | 적용 기준 | 적용하지 않는 기준 |
|-------------|-----------|--------------------|
| `createSlotRecipeContext` | slot recipe의 className/variant props context를 공유할 때. `ClassNamesProvider`, `PropsProvider`, `useClassNames`, `useProps`만 사용하는 것도 권장 패턴이다. | native `<view>`/`<text>`/`<image>`를 `withContext("view")`처럼 intrinsic string으로 감쌀 때. slot이 측정값, safe-area, ref, 이벤트 합성 등 런타임 값을 함께 전파해야 하면 inline context와 병행한다. |
| `splitMultipleVariantsProps` | 하나의 public component props가 여러 recipe variant를 같은 레이어에서 동시에 받을 때. | 각 sub-component가 자기 recipe props를 소유하거나, Root와 Slot의 recipe 책임이 분리되어 있을 때. |
| `usePressTap` | pressed/disabled 상태를 recipe variant로 반영하거나 tap을 disabled-aware로 막아야 할 때. | 순수 UI slot이 handler를 그대로 넘기는 수준이고 pressed recipe state가 없을 때. |
| `useControllableState` | controlled/uncontrolled local state가 있을 때. | 순수 UI 또는 외부 primitive가 상태를 소유할 때. |
| `useSafeArea` | top/bottom safe-area를 컴포넌트 내부 layout에 반영할 때. | 상위 screen shell이 safe-area를 전적으로 소유할 때. |

Phase 0 산출물에 다음을 남긴다:
- 사용할 Lynx 유틸리티/훅
- 의도적으로 쓰지 않는 유틸리티/훅과 이유
- native slot은 literal JSX로 유지되는지
- className context와 런타임 state/context가 분리되어 있는지

## 2. Headless 레이어 결정

카테고리 C/D인 경우 headless 레이어가 필요하다. 기존 패키지를 재사용할 수 있는지 먼저 확인한다.

**React 기존 headless 패키지** (`packages/react-headless/`):
avatar, checkbox, collapsible, dialog, drawer, field, field-button, fieldset, image, popover, portal, primitive, progress, pull-to-refresh, radio-group, scrollable, segmented-control, slider, snackbar, supports, switch, tabs, text-field, toggle, use-controllable-state

**Lynx headless 패키지** (`packages/lynx-react-headless/`):
현재 repo에 있는 패키지를 먼저 확인한다. stateful Lynx 컴포넌트에서 press/tap, controlled/uncontrolled, context, render props를 재사용해야 하면 `packages/lynx-react-headless/*`를 우선 검토한다. 새 패키지가 필요하면 “새 패키지 추가” boundary이므로 사용자 확인 전 구현하지 않는다.

- **재사용 가능**: 기존 패키지의 훅/컨텍스트를 그대로 사용 (예: collapsible → Accordion)
- **확장 필요**: 기존 패키지를 기반으로 새 훅 추가
- **신규 생성**: 완전히 새로운 headless 패키지 필요

신규 생성 시 target platform에 따라 `packages/react-headless/AGENTS.md` 또는 `packages/lynx-react-headless/AGENTS.md`의 컨벤션을 반드시 확인한다.

## 3. 의존성 분석 (BLOCKING GATE)

이 컴포넌트가 다른 컴포넌트/패키지에 의존하는 경우, 각 의존성의 API가 안정적(dev 브랜치에 머지됨)인지 확인한다.

| 의존성 | API 안정? | 상태 |
|--------|----------|------|
| (여기에 기록) | Yes/No | Merged/In Progress/Planned |

**하나라도 No이면 구현을 시작하지 않는다.** 불안정한 의존성 위에 구현하면 API 변경 시 전체 rework가 필요하다.

## 4. 외부 레퍼런스 조사 + 접근성 설계

카테고리 C/D(headless가 필요한 컴포넌트)인 경우 이 섹션을 완료한다.

### 4a. 외부 라이브러리 인터페이스 조사

`references/external-references.md`를 참고하여 아래 라이브러리에서 동일/유사 컴포넌트를 찾고 인터페이스를 비교한다:

- **Base UI React**: hook API 구조, controlled/uncontrolled 패턴
- **Radix Primitives**: compound component 구조, slot 분리 기준
- **Chakra UI**: prop 인터페이스, 네이밍 컨벤션
- **shadcn/ui**: 최종 사용자 API 형태

조사 결과 요약:
- 공통적으로 제공하는 props: (기록)
- SEED Design에서 채택할 인터페이스: (기록)
- SEED Design 고유 요구사항: (기록)

### 4b. ARIA APG 패턴 확인

https://www.w3.org/WAI/ARIA/apg/patterns/ 에서 해당 컴포넌트 패턴을 찾고 아래를 정리한다:

- **필수 role**: (예: `role="tablist"`, `role="tab"`)
- **필수 aria-* 속성**: (예: `aria-selected`, `aria-controls`)
- **키보드 인터랙션 스펙**:
  - Space/Enter:
  - Arrow keys:
  - Home/End:
  - Escape:
  - Tab:
- **Role/heading override 전략**:
  - `hardcode`: native element를 고정한다.
  - `asChild`: consumer가 semantic wrapper를 교체할 수 있게 한다.
  - `aria-level override`: wrapper는 유지하되 계층만 조정할 수 있게 한다.

APG가 heading 계층이나 landmark 구조를 요구하는 컴포넌트는 이 전략을 **구현 전에 명시적으로 선택**한다. 기본값으로 hardcode만 두면 문서 구조나 페이지 계층에 따라 API가 막힐 수 있다.

### 4c. SEED Design 접근성 유틸리티 적용 계획

| 유틸리티 | 적용 위치 |
|---------|----------|
| `ariaAttr()` | (예: checked 상태) |
| `dataAttr()` | (예: disabled, pressed 상태) |
| `visuallyHidden` | (예: hidden native input) |
| `createFocusRingStyles()` | (예: root slot) |

숨겨진 native input 필요 여부: Yes/No (checkbox, radio, switch 같은 form control인 경우)

## 5. 추가 요건 체크리스트

해당하는 항목에 체크하고, Yes이면 명시된 문서를 참조한다:

- [ ] Expand/collapse 애니메이션 → React는 `recipe-patterns.md` §애니메이션, Lynx는 `lynx-patterns.md`
- [ ] Modal/Sheet 진입/퇴장 애니메이션 → React는 `recipe-patterns.md` §Presence, Lynx는 `lynx-patterns.md`
- [ ] Form Field 컨텍스트 통합 → React는 `react-patterns.md` §Form/Field 통합, Lynx는 지원 여부 별도 결정
- [ ] Snippet 레이어 필요 (Delivery Surface Gate에서 Yes: 3+ sub-component, 서드파티, wrapper value) → `api-design.md`
- [ ] 새 유틸리티 패키지 필요 → 구현 전 결정
- [ ] 아이콘 slot (prefix/suffix) → `recipe-patterns.md` §아이콘 헬퍼
- [ ] Block 패턴 필요 (footer-01 같은 preset 조합) → `implementation-steps.md` §Block Patterns

## 6. 패턴 참조 컴포넌트 지정

참조 컴포넌트는 하나만 고르지 않는다. 레이어별로 가장 유사한 참조를 따로 선택하고, 이후 구현 단계에서 해당 파일을 **먼저 읽고** 패턴을 따른다.

- **Headless reference**: ________________
  - React 경로: `packages/react-headless/{name}/` 또는 `packages/react-headless/{name}/src/`
  - Lynx 경로: `packages/lynx-react-headless/{name}/` 또는 styled-local hook/context
- **Styled UI reference**: ________________
  - React 경로: `packages/react/src/components/{Name}/`
  - Lynx 경로: `packages/lynx-react/src/components/{Name}/`
- **Snippet reference**: ________________
  - React 경로: `docs/registry/react/ui/{name}.tsx` 또는 "없음(package-only)"
  - Lynx 경로: `docs/registry/lynx/ui/{name}.tsx` 또는 "없음(package-only)"
- **Rootage vocabulary reference**: ________________
  - 경로: `packages/rootage/components/{name}.yaml`
- **Docs reference** (선택): ________________
  - React 경로: `docs/content/react/components/{name}.mdx`
  - Lynx 경로: `docs/content/lynx/components/{name}.mdx`

기록 시 아래를 함께 남긴다:
- 각 레이어에서 **무엇을 따라갈지** (예: slot 구조, prop naming, token vocabulary, example composition)
- 참조와 **의도적으로 다르게 가는 부분**
- 외부 레퍼런스(Radix, Base UI, shadcn/ui)와 내부 레퍼런스가 충돌할 때 어느 쪽을 우선할지

## 7. 쓰기 전 파일 계획

사용자가 Phase 0 결과를 확인한 뒤 `scripts/scaffold-plan.ts`를 실행한다. 입력은 확정한 target platform과 Delivery surface다. 결과에서 다음을 확인한다.

- 기존 컴포넌트는 `currentSurface`가 실제 구현과 공개 경로를 포함하는가?
- 신규 컴포넌트는 `component.state`가 `not-found`인가?
- `source`와 `reference`가 이번 작업 범위와 맞는가?
- `generated`가 직접 편집 대상에서 빠졌는가?
- `conflicts`의 기존 파일을 덮어쓰지 않고 검토했는가?

이 계획은 카테고리, Headless, Recipe, snippet 필요 여부를 추론하지 않는다. 앞선 게이트의 결정을 바꾸어야 하면 스크립트 결과에 경로를 덧붙이지 말고 해당 게이트로 돌아간다.
