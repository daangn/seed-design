# Lynx Component Patterns

Lynx 컴포넌트는 React Web 패턴의 변형이 아니라 별도 런타임을 대상으로 하는 styled UI다. Web에서 가능한 DOM, CSS, SVG, form/focus 모델이 Lynx에서 그대로 동작한다고 가정하지 않는다.

## 책임 분리

Stateful Lynx 컴포넌트의 기본 계약은 다음과 같다.

| 레이어 | 책임 | 넣지 않는 것 |
|--------|------|--------------|
| `packages/lynx-headless/*` | 상태, press/tap, controlled/uncontrolled, context, render props | SEED recipe, token, className 자동 주입 |
| `packages/lynx-react/*` | native slot JSX, recipe variant 조합, className 병합, icon/image wiring | 중복 상태 계산, Web DOM/form/focus API |
| `packages/lynx-qvism-preset/*` | Lynx CSS 제약에 맞춘 recipe source | Web-only CSS, pseudo selector 의존 |
| `packages/lynx-css/*` | generated CSS/recipe output | 직접 수정 |

`lynx-headless`는 자동 state class를 주입하지 않는다. `active`, `checked`, `disabled` 같은 순수 상태를 context/render props로 노출하고, `lynx-react`가 그 상태를 recipe boolean/string variant로 전달한다.

## Native JSX 제약

Lynx compiler는 native tag를 파일 안의 literal JSX로 봐야 한다. 다음 규칙을 지킨다.

- native `<view>` / `<text>` / `<image>`는 최종 렌더링 컴포넌트 파일 안에 literal JSX로 작성한다.
- `React.createElement("view")`, `const Tag = "view"; <Tag />`, `withContext("view", ...)`처럼 intrinsic tag를 런타임 값으로 넘기지 않는다.
- native slot factory를 공통 유틸 파일로 빼지 않는다. 필요한 경우 같은 컴포넌트 파일 안의 작은 factory만 사용한다.
- `forwardRef`를 쓸 때 null ref를 전달하지 않는다.
- `{...nativeProps}`에 `children`이 섞이지 않도록 `children`은 먼저 분리해 JSX child로 전달한다.

## Styling and recipe

- recipe import는 `@seed-design/lynx-css/recipes/<name>`를 사용한다. Web의 `@seed-design/css`를 import하지 않는다.
- variant props는 `recipe.splitVariantProps(props)` 또는 `splitMultipleVariantsProps`로 분리한다. 수동 destructuring이나 타입 캐스트로 variant를 꺼내지 않는다.
- Lynx에서 상태는 pseudo selector보다 boolean/string variant로 모델링한다.
- `inherit`, CSS-wide keyword, Web-only SVG stroke/fill CSS, `content`, unsupported shorthand에 의존하지 않는다.
- style 변경은 `packages/lynx-qvism-preset/src/recipes/*` 또는 Rootage 원천에서 하고, generated `packages/lynx-css/*`는 직접 수정하지 않는다.

## Unsupported Web API 문서화

Web과 Lynx의 차이는 타입과 문서가 같은 말을 해야 한다.

- Lynx에서 지원하지 않는 prop은 `Omit` 등으로 타입에서 제거한다.
- 컴포넌트 props 위에 `@platform Lynx` JSDoc으로 미지원 목록과 이유를 남긴다.
- `docs/content/lynx/components/<name>.mdx`에 “웹 버전과의 차이”와 “Lynx 미지원 기능”을 작성한다.
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

- **headless(`packages/lynx-headless/*`)**: a11y 속성을 만들지 않는다. 상태(`pressed`/`checked`/`disabled`)만 노출한다.
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

- Lynx snippet은 `docs/registry/lynx/ui/<name>.tsx`에 둔다.
- `docs/registry/lynx/registry-ui.ts`에 item을 등록하고 `@seed-design/lynx-react`, `@seed-design/lynx-css` dependency range를 확인한다.
- `docs/content/lynx/components/<name>.mdx`의 install/usage/props는 Lynx snippet 경로를 가리킨다.
- `examples/lynx-spa/src/seed-design/ui/<name>.tsx`가 vendored copy를 갖고 있으면 registry snippet과 동기화한다.
- 실제 사용 화면은 `examples/lynx-spa`에 추가하거나 기존 page에서 확인한다.

## Verification focus

Lynx 작업의 핵심 검증은 다음을 우선한다.

- `bun generate:all`
- `bun test:all`
- `bun packages:build`
- `bun --filter @seed-design/lynx-react typecheck`와 `bun --filter @seed-design/lynx-react test`가 package script에 있으면 실행
- `packages/lynx-headless/*`를 바꿨다면 해당 package build/test 또는 root `lynx-headless:*` script가 있으면 실행
- snippet/example 변경이 있으면 `bun --filter lynx-spa build`
- generated registry가 최신인지 `bun --filter @seed-design/docs generate:registry` 또는 docs generate script로 확인
