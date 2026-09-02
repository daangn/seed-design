# Lynx Component Patterns

Lynx 컴포넌트는 React Web 패턴의 변형이 아니라 별도 런타임을 대상으로 하는 styled UI다. Web에서 가능한 DOM, CSS, SVG, form/focus 모델이 Lynx에서 그대로 동작한다고 가정하지 않는다.

## 책임 분리

Stateful Lynx 컴포넌트의 기본 계약은 다음과 같다.

| 레이어 | 책임 | 넣지 않는 것 |
|--------|------|--------------|
| `packages/lynx-react/src/hooks/*` 또는 컴포넌트 내부 hook/context | 직접 소유하는 상태, press/tap, controlled/uncontrolled, context | SEED recipe, token, className 자동 주입 |
| 기존 외부 Lynx primitive | 해당 primitive가 이미 소유한 상태·이벤트 | wrapper의 중복 상태 |
| `packages/lynx-react/*` Styled UI | native slot JSX, recipe variant 조합, className 병합, icon/image wiring | 중복 상태 계산, Web DOM/form/focus API |
| `packages/lynx-qvism-preset/*` | Lynx CSS 제약에 맞춘 recipe source | Web-only CSS, pseudo selector 의존 |
| `packages/lynx-css/*` | generated CSS/recipe output | 직접 수정 |

현재 저장소에 별도의 Lynx headless 패키지는 없다. 기존 상태 소유자가 `active`, `checked`, `disabled` 같은 상태를 노출하고, Styled UI가 그 상태를 recipe boolean/string variant로 전달한다.

## Native JSX 제약

Lynx compiler는 native tag를 파일 안의 literal JSX로 봐야 한다. 다음 규칙을 지킨다.

- native `<view>` / `<text>` / `<image>`는 최종 렌더링 컴포넌트 파일 안에 literal JSX로 작성한다.
- `React.createElement("view")`, `const Tag = "view"; <Tag />`, `withContext("view", ...)`처럼 intrinsic tag를 런타임 값으로 넘기지 않는다.
- native slot factory를 공통 유틸 파일로 빼지 않는다. 필요한 경우 같은 컴포넌트 파일 안의 작은 factory만 사용한다.
- `forwardRef`를 쓸 때 null ref를 전달하지 않는다.
- `{...nativeProps}`에 `children`이 섞이지 않도록 `children`은 먼저 분리해 JSX child로 전달한다.

## 유틸리티 선택

Lynx compound 컴포넌트라고 해서 `createSlotRecipeContext`를 무조건 피하거나 무조건 `withContext`로 감싸지 않는다. 유틸리티는 다음 기준으로 선택한다.

- `createSlotRecipeContext`는 slot recipe의 className map과 variant props를 context로 공유할 때 사용한다. `ActionButton`처럼 `ClassNamesProvider`, `PropsProvider`, `useClassNames`, `useProps`만 꺼내 쓰는 패턴도 표준이다.
- native `<view>` / `<text>` / `<image>` slot은 `withContext("view")`나 공통 유틸 factory로 만들지 않는다. 컴포넌트 파일 안에서 literal JSX로 직접 렌더한다.
- slot이 측정값, safe-area, imperative ref, tap/open handler 같은 런타임 값을 하위에 전파해야 하면 inline `React.createContext`를 별도로 둔다. 이 context는 recipe className context를 대체하지 않는다.
- 하나의 public component가 여러 recipe variant를 같은 props 레이어에서 받으면 `splitMultipleVariantsProps`를 쓴다. Root와 sub-component가 recipe props를 각각 소유하면 각 컴포넌트에서 `recipe.splitVariantProps`를 쓴다.
- pressed/disabled tap state를 recipe variant로 반영해야 하면 `usePressTap`을 쓴다. 단순 tap handler 전달만 필요한 순수 UI slot에는 강제로 넣지 않는다.
- controlled/uncontrolled state는 `useControllableState`를 우선한다. 외부 Lynx primitive가 상태를 소유하면 wrapper에서 중복 state를 만들지 않는다.
- safe-area가 컴포넌트 내부 layout 일부라면 `useSafeArea`를 쓴다.

구현 전 계획에는 “사용한 유틸”뿐 아니라 “의도적으로 쓰지 않은 유틸과 이유”도 남긴다.

## Styling and recipe

- recipe import는 `@seed-design/lynx-css/recipes/<name>`를 사용한다. Web의 `@seed-design/css`를 import하지 않는다.
- variant props는 `recipe.splitVariantProps(props)` 또는 `splitMultipleVariantsProps`로 분리한다. 수동 destructuring이나 타입 캐스트로 variant를 꺼내지 않는다.
- Lynx에서 상태는 pseudo selector보다 boolean/string variant로 모델링한다.
- `inherit`, CSS-wide keyword, Web-only SVG stroke/fill CSS, `content`, unsupported shorthand에 의존하지 않는다.
- style 변경은 `packages/lynx-qvism-preset/src/recipes/*` 또는 Rootage 원천에서 하고, generated `packages/lynx-css/*`는 직접 수정하지 않는다.

## 초기 레이아웃 전환 방지

위치·크기·색상처럼 **등록 또는 레이아웃 측정 결과에 따라 정해지는 값**에 transition을 적용하면, Lynx의 최초 렌더링 중간값에서 최종값으로 이동하는 과정까지 사용자 전환처럼 보일 수 있다. 선택 Indicator, 가변 너비 Trigger, Carousel처럼 초기 선택 상태와 측정값을 함께 쓰는 컴포넌트는 다음 패턴을 적용한다.

- 최초 렌더링은 상태 변화가 아니라 초기화다. 필요한 자식 등록과 레이아웃 측정이 모두 끝날 때까지 관련 transition을 비활성화한다.
- `useEffect`가 한 번 실행됐거나 첫 측정값이 들어왔다는 이유만으로 활성화하지 않는다. `items.every((item) => rects[item.value] !== undefined)`처럼 최종 스타일 계산에 필요한 값이 현재 모두 준비됐는지 매 렌더링에서 계산한다.
- 준비 여부를 한 번 `true`로 만든 뒤 유지하지 않는다. 동적으로 자식이 추가되어 측정값이 다시 불완전해지면 transition도 다시 비활성화한다.
- 임의의 timeout으로 초기화 완료 시점을 추정하지 않는다. 컴포넌트가 이미 소유한 등록·측정 상태에서 준비 조건을 계산한다.
- 준비 전에는 transition 대상 전체가 `transitionDuration: "0s"`를 받도록 내부 boolean Recipe variant를 둔다. Indicator의 위치·크기뿐 아니라 같은 초기 선택 과정에서 바뀌는 Label 색상도 함께 막는다.
- React 레이어에서 `transitionDuration`을 inline `style`로 지정하지 않는다. 준비 상태를 Recipe variant에 전달하고 각 slot의 className으로 적용한다.
- 현재 등록된 모든 대상의 측정이 끝난 동안에는 일반적인 선택·swipe·layout 변경에 기존 Recipe transition을 사용한다.

```tsx
const componentRecipe = defineSlotRecipe({
  // ...
  variants: {
    transitionEnabled: {
      true: {},
      false: {
        label: { transitionDuration: "0s" },
        indicator: { transitionDuration: "0s" },
      },
    },
  },
  defaultVariants: {
    transitionEnabled: true,
  },
});

const transitionsEnabled =
  items.length > 0 && items.every((item) => rects[item.value] !== undefined);
const classNames = componentRecipe({ ...variantProps, transitionEnabled: transitionsEnabled });

<text className={classNames.label} />;
<view className={classNames.indicator} />;
```

회귀 테스트는 첫 번째가 아닌 항목을 초기 선택값으로 렌더링하고, 최초 렌더링 시 Label과 Indicator에 transition 비활성 Recipe className이 적용되는지 확인한다. 자식을 동적으로 지원하는 컴포넌트라면 측정 완료 후 새 자식을 추가했을 때 준비 상태가 다시 `false`가 되는 경로도 검증한다.

## Unsupported Web API 문서화

Web과 Lynx의 차이는 타입과 문서가 같은 말을 해야 한다.

- Lynx에서 지원하지 않는 prop은 `Omit` 등으로 타입에서 제거한다.
- 컴포넌트 props 위에 `@platform Lynx` JSDoc으로 미지원 목록과 이유를 남긴다.
- `docs/content/lynx/components/<name>.mdx`에 `Web Version Differences`와 `Unsupported Lynx Features`를 작성한다.
- SVG/icon 기능은 `@karrotmarket/lynx-monochrome-icon` 같은 Lynx icon element와 `<image tint-color>` 기반 wrapper를 우선 검토한다.

## Accessibility

Lynx는 web ARIA가 아니라 자체 `accessibility-*` 속성을 쓴다. **모든 native tag(`<view>`/`<text>`/`<image>`/`<list>`/...)가 동일한 공통 속성을 공유**하며 tag별 차이는 없다. `lynx-react`의 `LynxAccessibilityProps`(`packages/lynx-react/src/types.ts`)가 이 속성들을 모은 표준 타입이다 — 컴포넌트 props가 이를 확장해 native element에 패스스루한다.

### 속성 레퍼런스 (`@lynx-js/types` StandardProps)

| 속성 | 타입 | web 대응 |
|------|------|----------|
| `accessibility-label` | `string` | `aria-label` (스크린리더가 읽을 이름) |
| `accessibility-traits` | `'button'｜'image'｜'link'｜'header'｜'selected'｜'disabled'｜'adjustable'｜'tabbar'｜...｜'none'` (**단일 값**) | `role`/state 일부 |
| `accessibility-element` | `boolean` | a11y 트리 포함 여부 (`<view>`는 명시 필요, `<text>`/`<image>`는 기본 `true`) |
| `accessibility-value` | `string` | `aria-checked` / `aria-valuenow` (상태 텍스트) |
| `accessibility-role-description` | `'switch'｜'checkbox'｜'image'｜'progressbar'｜string` | `role` |
| `accessibility-elements-hidden` | `boolean` | `aria-hidden` |
| `accessibility-heading` | `boolean` | `role="heading"` |
| `accessibility-actions` | `string[]` | 커스텀 액션 (`bindaccessibilityaction` 이벤트와 함께) |
| `accessibility-exclusive-focus` | `boolean` | focus 격리 |
| `ios-platform-accessibility-id` | `string` | iOS 테스트 식별자 |

- 이벤트: `bindaccessibilityaction` (`AccessibilityAction`) · 메서드: `requestAccessibilityFocus()`
- **타입 미제공**(가이드 문서엔 언급): `accessibility-elements`(읽기 순서), `accessibilityAnnounce`(전역 announce) — 필요 시 런타임/버전 확인 후 사용한다.

### 책임 분리

- **상태 소유 hook/context 또는 외부 primitive**: a11y 속성을 중복 계산하지 않고 `pressed`/`checked`/`disabled` 상태를 노출한다.
- **styled(`packages/lynx-react/*`)**: 내부 상태·prop에 따라 `accessibility-*`를 native element에 **직접 작성**한다. (web `react-headless`가 `stateProps`로 `aria-*`를 붙이는 역할을 Lynx에선 styled가 담당)
- 공통 헬퍼는 두지 않는다. 컴포넌트마다 label/role/value가 달라 직접 작성이 명확하다.

### 결정 트리

- **interactive (button/toggle/checkbox/switch)**: `accessibility-element={true}` + `accessibility-role-description`(역할) + `accessibility-value`(상태 텍스트) + `accessibility-label`(이름). `disabled`면 `accessibility-traits="disabled"`.
  - `traits`는 단일 값이라 `selected`+`disabled` 동시 표현 불가 → **역할은 `role-description`, 상태는 `value`**로 분담한다.
- **decorative (장식 image/icon)**: `accessibility-elements-hidden={true}` (스크린리더에서 숨김).
- **의미 있는 image**: `accessibility-label`(대체 텍스트) + `accessibility-traits="image"`.
- **layout (Box/Stack/AspectRatio)**: 보통 불필요. 자식이 a11y를 담당한다.

### 예시

```tsx
// Switch(styled) — 상태에 따라 a11y를 native <view>에 직접 작성
<view
  {...pressHandlers}
  accessibility-element={true}
  accessibility-role-description="switch"
  accessibility-value={checked ? "켜짐" : "꺼짐"}
  accessibility-traits={disabled ? "disabled" : "button"}
  accessibility-label={label}
/>

// 장식 아이콘 — 스크린리더에서 숨김
<image src={iconSrc} accessibility-elements-hidden={true} />
```

`accessibility-value`/`accessibility-label`의 텍스트("켜짐"/"꺼짐" 등)는 i18n 대상이므로 headless가 아니라 컴포넌트/소비처가 제공한다.

## Docs and registry

- Delivery Surface가 `snippet-only` 또는 `package+snippet`일 때만 Lynx snippet을 `docs/registry/lynx/ui/<name>.tsx`에 둔다.
- Registry를 제공하면 `docs/registry/lynx/registry-ui.ts`의 등록과 dependency range를 확인한다.
- `examples/lynx-spa/src/seed-design/ui/<name>.tsx`가 vendored copy를 갖고 있으면 registry snippet과 동기화한다.
- 실제 사용 화면은 `examples/lynx-spa`에 추가하거나 기존 page에서 확인한다.
- Delivery Surface 결정은 `api-design.md`, Lynx 문서와 실행 예제의 작성 규칙은 `../../seed-write-lynx-component-docs/SKILL.md`를 따른다.

## Verification focus

자동 검증 명령은 `verification-checklist.md`에서 확인한다. 브라우저 문서 미리보기는 구조와 기본 상호작용 확인에 사용한다. 실제 Lynx 결과를 새로 주장할 때는 사용 가능한 호스트 앱이나 `examples/lynx-spa`에서 직접 확인하고, 실행 환경이 없으면 미확인 범위를 보고한다.
