# 아키텍처 결정

새 컴포넌트를 만들거나 Headless·Recipe·Registry 책임을 바꾸는 구조 변경에서 쓴다. 이번 변경과 관련된 절만 읽는다. 기존 구조를 유지하는 작은 변경에는 카테고리 결정이나 외부 조사를 추가하지 않는다. [brainstorming.md](brainstorming.md)를 거쳤다면 거기서 확정한 내용만 입력으로 쓴다.

## 0. 플랫폼과 배포 방식 확인

1. [platform-gate.md](platform-gate.md)로 target platform, [api-design.md](api-design.md)의 Delivery Surface Gate로 배포 방식을 확정한다.
2. 구조 결정 기록에 다음 값을 적는다.
   - Target platform: `react`, `lynx`, `cross-platform`
   - Delivery surface: `package-only`, `snippet-only`, `package+snippet`, `docs-only`
   - Current surface: [경로 조회](component-map.md)의 `matched`·`ambiguous`·`not-found`와 근거 경로
   - API parity: `cross-platform`이면 [API 비교](api-parity.md)의 차이와 직접 확인할 `unknown` 항목
   - Docs·registry target: React `docs/content/react`(필요 시 `docs/registry/react/ui`), Lynx `docs/content/lynx`(필요 시 `docs/registry/lynx/ui`)
   - Headless ownership: React headless, Lynx headless package, Lynx hook·context, 기존 외부 Lynx primitive, 없음 중 하나
   - Lynx support delta: 웹 대비 차이 또는 N/A
3. `lynx`·`cross-platform` → [lynx-patterns.md](lynx-patterns.md)를 함께 읽고 native tag literal JSX, 상태·Styled UI 책임 분리를 계획에 반영한다.
4. 요구사항 탐색의 합의 요약이 있으면 다음처럼 쓴다.
   - 유사 컴포넌트 매트릭스 → §6 패턴 참조 컴포넌트의 기본값
   - 엣지케이스 → §4b 접근성·입력 계약, §5 추가 요건
   - 토큰 의존성 → Rootage 작업
   - 외부 레퍼런스 우선순위 → §4a의 1순위

## 1. 컴포넌트 카테고리 결정

```text
스타일 Recipe가 필요한가?
├─ No → E (Layout)
└─ Yes → 시각적 slot이 몇 개인가?
    ├─ 1개 → A (Simple)
    └─ 2개+ → 외부 상태 로직이 필요한가? (controlled/uncontrolled, 플랫폼 입력, 접근성 관리)
        ├─ No → B (Compound Stateless)
        └─ Yes → 독립 사용 가능한 sub-recipe가 있는가?
            ├─ Yes → D (Multi-Recipe)
            └─ No → C (Compound Stateful)
```

카테고리를 정하면 [pattern-catalog.md](pattern-catalog.md)에서 해당 카테고리의 Recipe 타입, React 패턴, namespace 여부, 레퍼런스 컴포넌트, 필수 유틸리티를 확인한다.

### 1a. Lynx 유틸리티 선택

`lynx`·`cross-platform`이면 카테고리는 React Web 결정으로만 쓰고, Styled UI 구현 전에 Lynx 유틸리티 적용을 따로 정한다.

1. `packages/lynx-react/src/utils`, `packages/lynx-react/src/hooks`, `packages/lynx-react/AGENTS.md`를 확인한다.
2. `createSlotRecipeContext`, `splitMultipleVariantsProps`, `usePressTap`, `useControllableState`, `useSafeArea`의 적용 여부를 [lynx-patterns.md](lynx-patterns.md#유틸리티-선택) 기준으로 정한다.
3. 구조 결정 기록에 남긴다.
   - 사용할 유틸리티·훅
   - 의도적으로 쓰지 않는 유틸리티·훅과 이유
   - native slot이 literal JSX로 유지되는지
   - className context와 런타임 state·context가 분리되는지

## 2. Headless 레이어 결정

카테고리 C·D면 상태와 입력 책임의 위치를 정한다. 기존 패키지·hook·context·외부 primitive를 재사용할 수 있는지 먼저 본다.

- React → `packages/react-headless/`의 하위 패키지를 직접 확인한다. 디렉터리 목록이 원천이다.
- Lynx → `packages/lynx-react-headless/`의 하위 패키지가 CSS-free Headless 경로다. 레이어별 책임과 CSS-free graph·검증 경계는 [lynx-patterns.md](lynx-patterns.md#책임-분리)를 따른다. 공개 API는 필요하면 namespace와 named component를 함께 제공하고, 모든 컴포넌트를 hook 하나로 만들지 않는다.

판정:

- 재사용 가능 → 기존 headless package, hook, context, primitive를 그대로 쓴다.
- 확장 필요 → 기존 책임 경계를 유지하면서 상태 조합이나 slot 계약을 추가한다.
- 신규 패키지 필요 → 기존 경로로 재사용 계약을 충족할 수 없을 때만, 구현 전에 사용자에게 확인한다. 보고 항목은 [platform-gate.md](platform-gate.md)의 「Ask-first boundary」를 따른다.

React headless를 추가·수정하면 `packages/react-headless/AGENTS.md`, Lynx 상태를 추가·수정하면 `packages/lynx-react/AGENTS.md`를 읽는다.

## 3. 의존성 분석

이번 변경에서 새로 들이거나 안정성이 확인되지 않은 의존성만 본다. 이미 쓰는 안정된 내부 경로를 다시 전수 조사하지 않는다.

- 의존성마다 API 안정 여부와 처리(사용, 기존 안정 경로 선택, 차단 사유 보고)를 적는다.
- 불안정함 → 기존 안정 경로로 요구사항을 충족할 수 있는지 먼저 판단한다.
- 새 패키지·외부 의존성이 필요함 → 사용자에게 확인한다. 그 외에는 근거를 남기고 구현 결정을 진행한다.

## 4. 외부 레퍼런스 조사와 접근성 설계

카테고리 C·D(headless가 필요한 컴포넌트)면 이 절을 완료한다.

### 4a. 외부 라이브러리 인터페이스 조사

1. [external-references.md](external-references.md)의 결정 영역별 우선순위와 조사 깊이에 따라 같은·비슷한 컴포넌트의 인터페이스를 비교한다.
2. 결과를 적는다: 공통으로 제공하는 props, SEED가 채택할 인터페이스, SEED 고유 요구사항.

### 4b. 플랫폼별 접근성·입력 계약

같은 사용자 결과를 목표로 하되 구현 계약을 같게 맞추지 않는다.

React:

- 해당 [ARIA APG 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/)에서 role, `aria-*`, 키보드 입력, focus 이동을 확인한다.
- heading·landmark 구조 → native element 고정, `asChild`, `aria-level` 중 실제 DOM·접근성 계약에 맞는 방식을 고른다.
- form control → hidden input과 브라우저 form 제출 계약이 필요한지 확인한다.

Lynx:

- [lynx-patterns.md](lynx-patterns.md#accessibility)의 native `accessibility-*` 속성과 터치·제스처 모델을 기준으로 삼는다.
- DOM ARIA, `asChild`, HTML heading level, hidden input, 키보드 focus를 자동으로 옮기지 않는다 → Lynx 런타임과 공개 API가 실제로 지원하는 것만 타입에 두고, 나머지는 플랫폼 차이로 문서화한다.
- [API 비교](api-parity.md)의 플랫폼 제약 분류와 실제 Lynx 구현 경로를 근거로 남긴다.

### 4c. 플랫폼별 적용 계획

- React → `ariaAttr()`, `dataAttr()`, `visuallyHidden`(`packages/utils/dom-utils/src/`), `createFocusRingStyles()`(`packages/qvism-preset/src/utils/focus-ring.ts`) 중 필요한 것과 적용 slot을 적는다.
- Lynx → `accessibility-label`, `accessibility-role-description`, `accessibility-value`, `accessibility-heading` 등 필요한 native 속성과 적용 element를 적는다.

## 5. 추가 요건

해당하는 항목만 확인하고 연결된 문서를 읽는다.

- Expand/collapse 애니메이션 → React [recipe-patterns.md](recipe-patterns.md)「애니메이션 패턴」의 「Expand/Collapse」, Lynx [lynx-patterns.md](lynx-patterns.md)
- Modal·Sheet 진입·퇴장 애니메이션 → React [recipe-patterns.md](recipe-patterns.md)「애니메이션 패턴」의 「Modal/Sheet 진입/퇴장」, Lynx [lynx-patterns.md](lynx-patterns.md)
- Form Field 컨텍스트 통합 → React [react-patterns.md](react-patterns.md)「Form/Field 통합 패턴」, Lynx는 지원 여부를 따로 정한다.
- Registry·snippet 레이어, Block 패턴(`footer-01` 같은 preset 조합) → [api-design.md](api-design.md)
- 아이콘 slot(prefix·suffix) → [recipe-patterns.md](recipe-patterns.md)「아이콘 헬퍼」
- 새 유틸리티 패키지 → 구현 전에 정하고, 새 패키지이면 사용자에게 확인한다.

## 6. 패턴 참조 컴포넌트 지정

참조를 하나만 고르지 않는다. 레이어마다 가장 비슷한 참조를 고르고, 구현 단계에서 그 파일을 먼저 읽는다.

- Headless: React `packages/react-headless/{name}/`, Lynx `packages/lynx-react-headless/{name}/`. 기존 외부 primitive가 상태를 소유할 때만 `packages/lynx-react/src/hooks/`나 컴포넌트 내부 hook·context
- Styled UI: React `packages/react/src/components/{Name}/`, Lynx `packages/lynx-react/src/components/{Name}/`
- Snippet: `docs/registry/{react,lynx}/ui/{name}.tsx` 또는 "없음(package-only)"
- Rootage vocabulary: `packages/rootage/components/{name}.yaml`
- Docs(선택): `docs/content/{react,lynx}/components/{name}.mdx`

기록에 함께 남긴다.

- 레이어마다 따라갈 것(slot 구조, prop naming, token vocabulary, example composition)
- 참조와 의도적으로 다르게 가는 부분
- 외부 레퍼런스(Radix, Base UI, shadcn/ui)와 내부 레퍼런스가 충돌할 때 우선할 쪽

## 7. 쓰기 전 파일 계획

새 컴포넌트이거나 Headless·Recipe·Registry 책임이 바뀌면 플랫폼과 배포 방식을 확정한 뒤 `bun skills/seed-component/scripts/scaffold-plan.ts`를 실행한다. 인자와 결과 확인은 [implementation-workflow.md의 파일 계획 읽기](implementation-workflow.md#파일-계획-읽기)를 따른다.

계획은 카테고리, Headless, Recipe, snippet 필요 여부를 추론하지 않는다. 앞선 결정을 바꿔야 하면 결과에 경로를 덧붙이지 않는다 → 이 문서의 판단 근거부터 다시 확인한다.
