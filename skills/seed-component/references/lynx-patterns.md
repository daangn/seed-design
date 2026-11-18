# Lynx Component Patterns

Lynx 구현은 React Web 패턴의 변형이 아니라 별도 런타임을 대상으로 한다. Web의 DOM, CSS, SVG, form·focus 모델이 Lynx에서 그대로 동작한다고 가정하지 않는다.

## 시작

1. `packages/lynx-react/AGENTS.md`를 읽는다. native JSX 불변식, variant 분리, recipe import 경로, className context와 런타임 context 분리, 웹 차이의 타입 표기가 거기 있다.
2. Recipe를 바꾸면 `packages/lynx-qvism-preset/AGENTS.md`를 읽는다. 허용하지 않는 CSS property·keyword, `inset` 금지, 상태 variant와 Main Thread pressed 피드백용 `:active` 예외가 거기 있다. 스타일은 `packages/lynx-qvism-preset/src/recipes/*`나 Rootage 원천에서 바꾸고 생성은 루트 `AGENTS.md`「생성」을 따른다.
3. 아래 [책임 분리](#책임-분리)로 변경이 어느 레이어에 속하는지 정한다.
4. 작업에 해당하는 절만 읽는다.
   - 유틸리티·hook 선택 → [유틸리티 선택](#유틸리티-선택)
   - 측정값으로 정해지는 값이 첫 렌더에서 움직여 보임 → [초기 레이아웃 전환 방지](#초기-레이아웃-전환-방지)
   - 라벨 줄바꿈·CJK 수직 정렬 → [텍스트 줄바꿈과 intrinsic size](#텍스트-줄바꿈과-intrinsic-size)
   - 투명한 눌림 배경이 탁해지거나 잔상이 남음 → [투명 배경의 색상 전환](#투명-배경의-색상-전환)
   - 접근성 속성 → [Accessibility](#accessibility)
   - Web에만 있는 prop·기능 → [Unsupported Web API 문서화](#unsupported-web-api-문서화)
   - Registry·문서 → [Docs and registry](#docs-and-registry)
   - CSS-free Headless 구현·추출 → [Lynx Headless 구현과 추출](lynx-headless.md)

## 검증

- 자동 검증 명령 → [검증 체크리스트](verification-checklist.md#자동-검증)
- 브라우저 문서 미리보기 → MDX host·코드 탭·QR·Web preview 변경의 구조와 기본 상호작용 확인에만 쓴다. native 결과로 기록하지 않는다.
- 실제 Lynx 결과를 새로 주장함 → [검증 런북](../../seed-verify-lynx-component/references/verification.md)의 `examples/lynx-spa` 문서 예제 경로에서 직접 확인하고 SPA 예제 ID와 query를 포함한 bundle URL·환경 근거를 남긴다.
- 실행 환경이 없음 → 미확인 범위를 보고한다.

## 책임 분리

Stateful Lynx 컴포넌트의 Headless·Styled Primitive·Registry 책임은 이 절이 단일 기준이다.

- `packages/lynx-react-headless/*` → CSS-free 상태 전이, press·tap, controlled·uncontrolled, context, 이벤트 순서, ref, 접근성 계약, 필수 native 구조, 기능 geometry(측정·clipping·hidden·초기·업데이트 수명). 넣지 않는 것: SEED recipe·token 의존, 시각 variant·class 계산, 시각 motion, 권장 문구·icon·조립.
- 기존 외부 Lynx primitive → primitive가 이미 소유한 상태·이벤트를 그대로 쓴다. Headless나 wrapper에 같은 상태를 중복하지 않는다.
- `packages/lynx-react/*` Styled Primitive → Headless 계약 소비, native presentation slot, recipe variant·className, divider·chevron·시각 motion. 넣지 않는 것: 상태·이벤트·ref·a11y 재구현, 기능 geometry 재계산, Web DOM·form·focus API.
- `packages/lynx-qvism-preset/*` → Lynx CSS 제약에 맞춘 recipe 원천. `packages/lynx-css/*`는 생성 결과라 원천을 고쳐 다시 생성한다. 수동 예외는 `packages/lynx-css/AGENTS.md`에 있다.
- `docs/registry/lynx/ui/*` → 권장 문구, icon 선택·연결, 편의 조립. package의 동작·측정·숨김·ref를 다시 구현하지 않는다.

판단 규칙:

- 기존 Headless 기준 → `packages/lynx-react-headless/`의 `image`, `toggle`, `use-controllable-state`, `use-press-tap`.
- 공개 API → 실제 재사용 계약에 맞춘 component와 props로 정한다. 필요하면 namespace와 named component를 함께 제공하고, 모든 컴포넌트를 일률적인 hook 하나로 공개하거나 빈 계층을 만들지 않는다.
- generic `className`·`style`과 이벤트·ref 합성 → 공개 props 계약이 허용하는 범위에서 Headless도 받을 수 있다. 금지 대상은 SEED recipe·token 의존과 시각 variant·class 계산이다.
- geometry → 기능 geometry(예: 접히는 Content의 높이 측정·clipping·hidden)만 Headless에 둔다. FAB나 ProgressCircle의 크기·정렬 같은 표현 geometry는 Styled Primitive에 남긴다.
- `Host`·`asChild`·`renderRoot` escape hatch → Lynx runtime 계약이 있을 때만 둔다. Registry wrapper는 권장 조립을 짧게 만들 때만 둔다.
- 독립 소비와 검증 → Headless는 source·runtime·declaration graph 모두 CSS 없이 소비할 수 있어야 한다([절차](lynx-headless.md#5-배포-결과의-독립-소비)). package type·build, 실제 consumer type·build, native 장면 결과를 따로 기록하고, native 검증은 `examples/lynx-spa`에서 실제 bundle을 실행했을 때만 완료로 적는다.

## Native JSX 제약

Lynx compiler는 native tag를 파일 안의 literal JSX로 봐야 한다. literal JSX, 런타임 tag 금지, null ref, `children` 분리는 `packages/lynx-react/AGENTS.md`「런타임 불변식」을 따르고, 같은 규칙을 `packages/lynx-react-headless/*`와 `docs/registry/lynx/ui/*`의 native tag에도 적용한다.

- native slot을 `withContext("view")`처럼 intrinsic string으로 만듦 → `packages/lynx-react/src/utils/create-slot-recipe-context.tsx`의 `assertNotIntrinsicComponent`가 throw한다. 컴포넌트 파일 안에서 literal JSX로 렌더한다.
- slot factory가 필요함 → 공통 유틸 파일로 빼지 않고 같은 컴포넌트 파일 안의 작은 factory만 쓴다.

## 유틸리티 선택

Lynx compound 컴포넌트라고 `createSlotRecipeContext`를 무조건 피하거나 무조건 `withContext`로 감싸지 않는다. 유틸은 `packages/lynx-react/src/utils/`, hook은 `packages/lynx-react/src/hooks/`에 있다.

- slot recipe의 className map과 variant props를 context로 공유함 → `createSlotRecipeContext`. `ActionButton`처럼 `ClassNamesProvider`, `PropsProvider`, `useClassNames`, `useProps`만 꺼내 쓰는 것도 표준이다.
- 측정값, safe-area, imperative ref, tap·open handler 같은 런타임 값을 하위에 전파함 → inline `React.createContext`를 따로 둔다. recipe className context를 대체하지 않고 함께 둔다.
- 한 public component가 여러 recipe variant를 같은 props 레이어에서 받음 → `splitMultipleVariantsProps`. Root와 sub-component가 recipe props를 각각 소유하면 각 컴포넌트에서 `recipe.splitVariantProps`.
- pressed·disabled tap 상태를 recipe variant로 반영함 → `usePressTap`. tap handler만 전달하는 순수 UI slot에는 넣지 않는다.
- controlled·uncontrolled 상태 → `useControllableState`를 우선한다. 외부 Lynx primitive가 상태를 소유하면 wrapper에 중복 state를 만들지 않는다.
- safe-area가 컴포넌트 내부 layout의 일부 → `useSafeArea`.

구현 전 계획에는 사용한 유틸과 함께 의도적으로 쓰지 않은 유틸과 이유를 남긴다.

## 초기 레이아웃 전환 방지

등록이나 레이아웃 측정 결과로 정해지는 위치·크기·색상에 transition을 걸면, Lynx 최초 렌더링의 중간값에서 최종값으로 가는 과정이 사용자 전환처럼 보인다. 선택 Indicator, 가변 너비 Trigger, Carousel처럼 초기 선택 상태와 측정값을 함께 쓰는 컴포넌트에 적용한다. 기준 구현은 `packages/lynx-react/src/components/Tabs/Tabs.utils.ts`의 `areTabsTransitionsEnabled`, `packages/lynx-qvism-preset/src/recipes/tabs.ts`의 `transitionEnabled` variant, `Tabs.test.tsx`다.

1. recipe에 내부 boolean variant(`transitionEnabled`)를 두고, `false`일 때 transition 대상 slot 전체에 `transitionDuration: "0s"`를 준다. Indicator 위치·크기뿐 아니라 같은 초기 선택에서 바뀌는 Label 색상도 포함한다.
2. 준비 여부는 매 렌더링에서 최종 스타일에 필요한 값이 지금 모두 있는지로 계산한다. 예: `items.length > 0 && items.every((item) => rects[item.value] !== undefined)`.
3. 그 값을 recipe variant로 넘겨 각 slot className으로 적용한다.
4. 모든 대상의 측정이 끝난 동안에는 선택·swipe·layout 변경에 기존 Recipe transition을 쓴다.

하지 않는 것과 대신 할 것:

- `useEffect` 한 번 실행이나 첫 측정값 도착으로 활성화 → 2의 준비 조건으로 판단한다.
- 준비 여부를 한 번 `true`로 만든 뒤 유지 → 자식이 추가돼 측정값이 다시 불완전해지면 다시 비활성화되도록 매 렌더링 계산한다.
- 임의 timeout으로 초기화 완료 추정 → 컴포넌트가 이미 소유한 등록·측정 상태로 계산한다.
- React 레이어에서 `transitionDuration`을 inline `style`로 지정 → recipe variant를 쓴다.

회귀 테스트:

- 첫 번째가 아닌 항목을 초기 선택값으로 렌더링하고, 최초 렌더링에서 Label과 Indicator에 transition 비활성 className이 붙는지 확인한다.
- 동적 자식을 지원하면 측정 완료 뒤 새 자식을 추가했을 때 준비 상태가 다시 `false`가 되는지 확인한다.

## 텍스트 줄바꿈과 intrinsic size

자동 너비에서는 라벨을 한 줄로 두고 부모가 너비를 제한할 때만 줄바꿈해야 하는 경우다.

- `white-space: nowrap`·`pre`로 줄바꿈 막기 → 쓰지 않는다. Lynx Android에서 CJK 라벨의 수직 정렬이 어긋난다. Chip도 같은 이유로 `whiteSpace: "nowrap"`을 제거했다(`packages/lynx-qvism-preset/src/recipes/chip.ts`, 커밋 `88fd4befd`).
- 대신 컨테이너와 항목의 크기 계산을 고친다. Lynx의 `flex: 1` 항목은 Web Grid와 달리 라벨의 max-content 너비보다 작게 줄어들 수 있다.
- 같은 너비의 여러 항목이 필요함 → `packages/lynx-qvism-preset/src/recipes/segmented-control.ts`처럼 root에 `display: "grid"`, `gridAutoFlow: "column"`, `gridAutoColumns: "1fr"`, `gridAutoRows: "1fr"`, `width: "max-content"`, `maxWidth: "100%"`, label에 `textAlign: "center"`를 둔다.
  - `width: max-content` → 자동 너비에서 가장 긴 라벨로 각 track을 계산한다.
  - `max-width: 100%` → 부모 너비를 넘지 않는다.
  - 명시한 `width`나 좁은 부모 → 라벨이 줄바꿈한다. `text-align: center`가 여러 줄에도 적용되는지 확인한다.
- Grid가 필요 없거나 항목 너비가 달라도 됨 → 이 구조를 복사하지 않는다.
- `display: grid`, `grid-auto-columns: 1fr`, `width: max-content`를 쓰기 전 → `lynx-check-css-support`로 Android·iOS 최소 Engine 버전을 확인하고 문서 [호환성 frontmatter](lynx-docs-authoring.md#lynx-호환성-frontmatter)를 가장 높은 요구 버전에 맞춘다.

시각 검증은 두 경우로 나누고 native 결과는 [검증](#검증)의 경로로 확인한다.

1. 자동 너비와 긴 라벨 → 모든 라벨이 한 줄이고 항목 너비가 같다.
2. 고정 너비와 더 긴 라벨 → 필요한 라벨만 줄바꿈하고 텍스트와 항목 높이가 가운데 정렬된다.

## 투명 배경의 색상 전환

평소 투명하고 누르는 동안만 나타나는 눌림 배경에 `background-color` transition을 직접 걸지 않는다. Lynx는 불투명한 상태 색과 transparent black 사이를 보간할 때 중간 RGB가 검게 탁해진다. 같은 제스처에서 선택·checked 상태까지 바뀌면 Indicator 아래에 어두운 잔상이 보인다. 기준 구현은 `packages/lynx-qvism-preset/src/recipes/checkmark.ts`의 `background` slot과 `packages/lynx-react/src/components/Checkbox/Checkbox.tsx`의 `pressSelectionRef`다. 선택 Indicator가 움직이면 `SegmentedControl.tsx`의 `pressSelectionRef`와 recipe도 확인한다.

1. root는 투명 상태로 고정한다.
2. 별도 native `<view>`와 recipe slot(overlay)을 두고 `position: "absolute"`와 `top`·`right`·`bottom`·`left: 0`으로 채운 뒤 최종 pressed 색을 칠한다.
3. overlay는 `opacity: 0`에서 pressed일 때 `1`로, `opacity`만 전환한다. 배경색 자체는 보간하지 않는다.
4. tap으로 선택 상태가 바뀌면 touch start 시점의 의미 상태(`checked`, `selected`, `indeterminate` 등 pressed 색을 정하는 값)를 `useRef`에 저장하고, overlay className은 그 값과 현재 `pressed`로 계산한다. 본문과 Indicator는 최신 상태로 갱신해도 된다. 그래야 release fade 도중 overlay 색이 새 선택 상태 색으로 바뀌지 않는다.

상시 배경이거나 실제로 두 불투명 색 사이를 전환함 → overlay를 추가하지 않고 기존 transition을 쓴다.

회귀 테스트:

- recipe 테스트 → root가 `background-color` transition을 하지 않고 overlay가 `opacity`만 전환한다.
- 컴포넌트 테스트 → `touchstart` 뒤 선택 값이 바뀌어도 overlay가 release까지 touch start 상태의 variant를 유지한다.
- 실제 전환 영상이 있음 → 눌림 시작, Indicator 이동 중간, release fade 종료 프레임을 나눠 탁한 중간색과 잔상을 확인한다.

## Unsupported Web API 문서화

타입과 문서가 같은 차이를 말해야 한다.

- 타입 → `packages/lynx-react/AGENTS.md`대로 미지원 prop을 `Omit`으로 빼고, props 위 JSDoc에 `@platform Lynx`와 `웹 대비 미지원 기능:` 목록을 두어 항목마다 이유를 적는다. 예: `packages/lynx-react/src/components/Switch/Switch.tsx`.
- 문서 → `docs/content/lynx/components/<name>.mdx`의 차이·미지원 섹션에 같은 내용을 쓴다. 제목 표기는 [문서 페이지](lynx-docs-authoring.md#문서-페이지)를 따른다.
- SVG·icon 기능 → `@karrotmarket/lynx-monochrome-icon` 같은 Lynx icon element와 `<image tint-color>` 기반 wrapper를 먼저 검토한다.

## Accessibility

Lynx는 web ARIA가 아니라 자체 `accessibility-*` 속성을 쓰고, 모든 native tag(`<view>`, `<text>`, `<image>`, `<list>` 등)가 같은 공통 속성을 공유한다. 표준 타입은 `packages/lynx-react/src/types.ts`의 `LynxAccessibilityProps`이고 컴포넌트 props가 이를 확장해 native element로 넘긴다. 주요 web ARIA 대응은 그 JSDoc에 있다.

### 결정 트리

- interactive(button·toggle·checkbox·switch) → `accessibility-element={true}`, 역할은 `accessibility-role-description`, 상태 텍스트는 `accessibility-value`, 이름은 `accessibility-label`. disabled면 `accessibility-traits="disabled"`.
- `selected`와 `disabled`를 함께 표현해야 함 → `accessibility-traits`는 단일 값이라 불가능하다. 역할은 `role-description`, 상태는 `value`로 나눈다.
- 장식 image·icon → `accessibility-elements-hidden={true}`.
- 의미 있는 image → `accessibility-label`(대체 텍스트)과 `accessibility-traits="image"`.
- layout(Box·Stack·AspectRatio) → 보통 두지 않는다. 자식이 담당한다.
- "켜짐"/"꺼짐", "expanded"/"collapsed"처럼 locale이 필요한 상태 문구 → Headless 기본 계약과 소비자 override로 정한다. 소비자가 제공하거나 Headless의 명시적 accessibility prop으로 받는다.

### 레이어별 책임

- Headless package → 상태에 따른 `accessibility-*` 속성과 native 상호작용 구조를 소유하고, `expanded`·`collapsed` 같은 상태값과 소비자 label override를 명시적 계약으로 제공한다. Styled Primitive에서 상태를 다시 계산하지 않는다.
- 기존 외부 primitive → a11y를 포함한 상태 계약을 이미 소유하면 그것을 쓴다. wrapper가 같은 속성을 다시 계산하지 않는다.
- Styled Primitive → Headless가 만든 a11y 계약과 소비자 override를 native slot에 전달하고 recipe를 조합한다. 역할·상태·이벤트·ref는 Headless 계약을 그대로 소비한다.
- 공통 a11y helper → 새로 만들지 않는다. 컴포넌트별 native slot과 공개 계약에 필요한 속성만 Headless에 직접 둔다.

### 타입 JSDoc에 없는 속성 사실

- `accessibility-element` → `<view>`는 명시해야 a11y 트리에 들어간다. `<text>`·`<image>`는 기본 `true`다.
- `accessibility-heading`(`boolean`) → `role="heading"`에 대응한다.
- `accessibility-actions`(`string[]`) → 커스텀 액션. `bindaccessibilityaction` 이벤트와 함께 쓴다.
- `accessibility-exclusive-focus`(`boolean`) → focus 격리.
- `ios-platform-accessibility-id`(`string`) → iOS 테스트 식별자.

## Docs and registry

- Registry 제공 여부 → [API 설계](api-design.md#delivery-surface-gate)의 Delivery Surface가 `snippet-only`나 `package+snippet`일 때만 `docs/registry/lynx/ui/<name>.tsx`를 둔다.
- Registry를 제공함 → `docs/registry/lynx/registry-ui.ts`의 등록과 `dependencies` 버전 범위를 확인한다.
- vendored copy 동기화 → [플랫폼 선택](platform-gate.md#3-platform-specific-source-of-truth)
- 실제 사용 화면 → `examples/lynx-spa`에 추가하거나 기존 page에서 확인한다.
- Lynx 문서와 실행 예제 → [Lynx 문서·예제 작업](lynx-docs.md)
