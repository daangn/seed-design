# 아키텍처 결정

새 컴포넌트를 만들거나 Headless·Recipe·Registry 책임을 바꾸는 구조 변경에서 사용한다. 요구사항 탐색이 필요했던 경우에는 [brainstorming.md](brainstorming.md)에서 확정한 내용만 입력으로 사용한다.

이번 변경과 관련된 섹션만 확인한다. 기존 구조를 유지하는 작은 변경에 카테고리 결정이나 외부 조사 항목을 억지로 추가하지 않는다.

## 0. 플랫폼과 배포 방식 확인

[platform-gate.md](platform-gate.md)의 target platform과 [api-design.md](api-design.md)의 배포 방식을 먼저 확정한다.

| 항목 | 값 |
|------|----|
| Target platform | react / lynx / cross-platform |
| Delivery surface | package-only / snippet-only / package+snippet / docs-only |
| Current surface | `seed-component-map`의 matched / ambiguous / not-found와 근거 경로 |
| API parity | cross-platform이면 `seed-api-parity` 차이와 직접 확인이 필요한 unknown 항목 |
| Docs/registry target | React: `docs/content/react` + 필요 시 `docs/registry/react/ui`, Lynx: `docs/content/lynx` + 필요 시 `docs/registry/lynx/ui` |
| Headless ownership | React headless / Lynx hook·context / 기존 외부 Lynx primitive / 없음 |
| Lynx support delta | N/A 또는 웹 대비 차이 |

`lynx` 또는 `cross-platform`이면 [lynx-patterns.md](lynx-patterns.md)를 함께 읽고, native tag literal JSX와 상태·Styled UI 책임 분리를 구현 계획에 반영한다.

요구사항 탐색을 수행했다면 합의 요약의 해당 항목을 다음 결정에 사용한다.
- 합의된 **유사 컴포넌트 매트릭스** → §6 패턴 참조 컴포넌트의 기본값
- 합의된 **엣지케이스** → §4b 플랫폼별 접근성·입력 계약, §5 추가 요건 체크리스트
- 합의된 **토큰 의존성** → Rootage 작업에서 사용
- 합의된 **외부 레퍼런스 우선순위** → §4a 외부 라이브러리 조사의 1순위

## 1. 컴포넌트 카테고리 결정

아래 플로우를 따라 카테고리를 확정한다:

```text
이 컴포넌트에 스타일 recipe가 필요한가?
├─ No → 카테고리 E (Layout)
└─ Yes → 시각적 slot이 몇 개인가?
    ├─ 1개 → 카테고리 A (Simple)
    └─ 2개+ → 외부 상태 로직이 필요한가?
        │      (controlled/uncontrolled, 플랫폼 입력, 접근성 관리)
        ├─ No → 카테고리 B (Compound Stateless)
        └─ Yes → 독립 사용 가능한 sub-recipe가 있는가?
            ├─ Yes → 카테고리 D (Multi-Recipe)
            └─ No → 카테고리 C (Compound Stateful)
```

카테고리가 결정되면 [pattern-catalog.md](pattern-catalog.md)에서 해당 카테고리의 레퍼런스 컴포넌트와 필수 유틸리티를 확인한다.

| 카테고리 | Recipe 타입 | React Web 패턴 | Namespace | React 레퍼런스 |
|----------|------------|-----------|-----------|---------|
| A. Simple | defineRecipe | splitVariantProps + forwardRef | 없음 | Badge |
| B. Compound (Stateless) | defineSlotRecipe | createSlotRecipeContext | 있음 | Avatar |
| C. Compound (Stateful) | defineSlotRecipe | createSlotRecipeContext + createWithStateProps | 있음 | TextField |
| D. Multi-Recipe | defineSlotRecipe ×2 | splitMultipleVariantsProps | 있음 | Checkbox |
| E. Layout | 없음 | Box 확장 | 없음 | Flex |

### 1a. Lynx 유틸리티 선택 기준

Target platform이 `lynx` 또는 `cross-platform`이면 카테고리 표를 React Web 결정으로만 쓰고, Styled UI 구현 전에 `packages/lynx-react/src/utils`, `packages/lynx-react/src/hooks`, `packages/lynx-react/AGENTS.md`를 확인해 유틸리티 적용 여부를 별도로 기록한다.

| 유틸리티/훅 | 적용 기준 | 적용하지 않는 기준 |
|-------------|-----------|--------------------|
| `createSlotRecipeContext` | slot recipe의 className/variant props context를 공유할 때. `ClassNamesProvider`, `PropsProvider`, `useClassNames`, `useProps`만 사용하는 것도 권장 패턴이다. | native `<view>`/`<text>`/`<image>`를 `withContext("view")`처럼 intrinsic string으로 감쌀 때. slot이 측정값, safe-area, ref, 이벤트 합성 등 런타임 값을 함께 전파해야 하면 inline context와 병행한다. |
| `splitMultipleVariantsProps` | 하나의 public component props가 여러 recipe variant를 같은 레이어에서 동시에 받을 때. | 각 sub-component가 자기 recipe props를 소유하거나, Root와 Slot의 recipe 책임이 분리되어 있을 때. |
| `usePressTap` | pressed/disabled 상태를 recipe variant로 반영하거나 tap을 disabled-aware로 막아야 할 때. | 순수 UI slot이 handler를 그대로 넘기는 수준이고 pressed recipe state가 없을 때. |
| `useControllableState` | controlled/uncontrolled local state가 있을 때. | 순수 UI 또는 외부 primitive가 상태를 소유할 때. |
| `useSafeArea` | top/bottom safe-area를 컴포넌트 내부 layout에 반영할 때. | 상위 screen shell이 safe-area를 전적으로 소유할 때. |

구조 결정 기록에 다음을 남긴다.
- 사용할 Lynx 유틸리티/훅
- 의도적으로 쓰지 않는 유틸리티/훅과 이유
- native slot은 literal JSX로 유지되는지
- className context와 런타임 state/context가 분리되어 있는지

## 2. Headless 레이어 결정

카테고리 C/D인 경우 상태와 입력 책임을 어디에 둘지 정한다. 기존 패키지, hook, context 또는 외부 primitive를 재사용할 수 있는지 먼저 확인한다.

**React 기존 headless 패키지** (`packages/react-headless/`):
avatar, checkbox, collapsible, dialog, drawer, field, field-button, fieldset, image, popover, portal, primitive, progress, pull-to-refresh, radio-group, scrollable, segmented-control, slider, snackbar, supports, switch, tabs, text-field, toggle, use-controllable-state

**Lynx 상태 책임**:
현재 저장소에는 별도의 Lynx headless 패키지가 없다. `packages/lynx-react/src/hooks`, 컴포넌트 내부 hook/context, 기존 외부 Lynx primitive 중 상태 소유자와 가장 가까운 경로를 쓴다. 이 경로로 재사용 요구를 충족할 수 없을 때만 새 패키지를 검토하며, 구현 전에 사용자 확인을 받는다.

- **재사용 가능**: 기존 패키지, hook, context, primitive를 그대로 사용
- **확장 필요**: 기존 책임 경계를 유지하면서 훅이나 상태 조합을 추가
- **신규 패키지 필요**: 기존 경로로 충족할 수 없는 재사용 계약이 명확할 때만 사용자에게 먼저 확인

React headless를 추가·수정하면 `packages/react-headless/AGENTS.md`를, Lynx 상태를 추가·수정하면 `packages/lynx-react/AGENTS.md`를 확인한다.

## 3. 의존성 분석

이 컴포넌트가 다른 컴포넌트/패키지에 의존하는 경우, 각 의존성의 API가 안정적(dev 브랜치에 머지됨)인지 확인한다.

| 의존성 | API 안정? | 상태 |
|--------|----------|------|
| (여기에 기록) | Yes/No | Merged/In Progress/Planned |

**하나라도 No이면 구현을 시작하지 않는다.** 불안정한 의존성 위에 구현하면 API 변경 시 전체 rework가 필요하다.

## 4. 외부 레퍼런스 조사 + 접근성 설계

카테고리 C/D(headless가 필요한 컴포넌트)인 경우 이 섹션을 완료한다.

### 4a. 외부 라이브러리 인터페이스 조사

[external-references.md](external-references.md)를 참고하여 아래 라이브러리에서 동일/유사 컴포넌트를 찾고 인터페이스를 비교한다:

- **Base UI React**: hook API 구조, controlled/uncontrolled 패턴
- **Radix Primitives**: compound component 구조, slot 분리 기준
- **Chakra UI**: prop 인터페이스, 네이밍 컨벤션
- **shadcn/ui**: 최종 사용자 API 형태

조사 결과 요약:
- 공통적으로 제공하는 props: (기록)
- SEED Design에서 채택할 인터페이스: (기록)
- SEED Design 고유 요구사항: (기록)

### 4b. 플랫폼별 접근성·입력 계약

React와 Lynx에서 같은 사용자 결과를 목표로 하되 구현 계약을 같게 맞추지 않는다.

**React**

- 해당하는 [ARIA APG 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/)에서 role, `aria-*`, 키보드 입력, focus 이동을 확인한다.
- heading이나 landmark 구조가 필요하면 native element 고정, `asChild`, `aria-level` 중 실제 DOM과 접근성 계약에 맞는 방식을 선택한다.
- form control이면 hidden input과 브라우저 form 제출 계약이 필요한지 확인한다.

**Lynx**

- [lynx-patterns.md](lynx-patterns.md)의 native `accessibility-*` 속성과 터치·제스처 모델을 기준으로 삼는다.
- DOM ARIA, `asChild`, HTML heading level, hidden input, 키보드 focus를 자동으로 이식하지 않는다. Lynx 런타임과 공개 API가 실제로 지원하는 기능만 타입에 두고, 나머지는 플랫폼 차이로 문서화한다.
- `seed-api-parity`의 플랫폼 제약 분류와 실제 Lynx 구현 경로를 근거로 남긴다.

### 4c. 플랫폼별 적용 계획

React에서는 `ariaAttr()`, `dataAttr()`, `visuallyHidden`, `createFocusRingStyles()` 중 필요한 항목과 적용 slot을 적는다. Lynx에서는 `accessibility-label`, `accessibility-role-description`, `accessibility-value`, `accessibility-heading` 등 실제로 필요한 native 속성과 적용 element를 적는다.

## 5. 추가 요건 체크리스트

해당하는 항목에 체크하고, Yes이면 명시된 문서를 참조한다:

- [ ] Expand/collapse 애니메이션 → React는 `recipe-patterns.md` §애니메이션, Lynx는 `lynx-patterns.md`
- [ ] Modal/Sheet 진입/퇴장 애니메이션 → React는 `recipe-patterns.md` §Presence, Lynx는 `lynx-patterns.md`
- [ ] Form Field 컨텍스트 통합 → React는 `react-patterns.md` §Form/Field 통합, Lynx는 지원 여부 별도 결정
- [ ] Registry 또는 snippet 레이어 필요 → [api-design.md](api-design.md)에서 결정
- [ ] 새 유틸리티 패키지 필요 → 구현 전 결정
- [ ] 아이콘 slot (prefix/suffix) → `recipe-patterns.md` §아이콘 헬퍼
- [ ] Block 패턴 필요 (footer-01 같은 preset 조합) → `implementation-steps.md` §Block Patterns

## 6. 패턴 참조 컴포넌트 지정

참조 컴포넌트는 하나만 고르지 않는다. 레이어별로 가장 유사한 참조를 따로 선택하고, 이후 구현 단계에서 해당 파일을 **먼저 읽고** 패턴을 따른다.

- **Headless reference**: ________________
  - React 경로: `packages/react-headless/{name}/` 또는 `packages/react-headless/{name}/src/`
  - Lynx 경로: `packages/lynx-react/src/hooks/`, 컴포넌트 내부 hook/context 또는 기존 외부 primitive
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

플랫폼과 배포 방식을 확정한 뒤 `scripts/scaffold-plan.ts`를 실행한다. 사용자 선택이 필요한 구조 변경이 있었다면 먼저 확인받는다. 결과에서 다음을 확인한다.

- 기존 컴포넌트는 `currentSurface`가 실제 구현과 공개 경로를 포함하는가?
- 신규 컴포넌트는 `component.state`가 `not-found`인가?
- `source`와 `reference`가 이번 작업 범위와 맞는가?
- `generated`가 직접 편집 대상에서 빠졌는가?
- `conflicts`의 기존 파일을 덮어쓰지 않고 검토했는가?

이 계획은 카테고리, Headless, Recipe, snippet 필요 여부를 추론하지 않는다. 앞선 결정을 바꾸어야 하면 스크립트 결과에 경로를 덧붙이지 말고 판단 근거부터 다시 확인한다.
