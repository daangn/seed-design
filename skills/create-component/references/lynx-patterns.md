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

## Unsupported Web API 문서화

Web과 Lynx의 차이는 타입과 문서가 같은 말을 해야 한다.

- Lynx에서 지원하지 않는 prop은 `Omit` 등으로 타입에서 제거한다.
- 컴포넌트 props 위에 `@platform Lynx` JSDoc으로 미지원 목록과 이유를 남긴다.
- `docs/content/lynx/components/<name>.mdx`에 `Web Version Differences`와 `Unsupported Lynx Features`를 작성한다.
- SVG/icon 기능은 `@karrotmarket/lynx-monochrome-icon` 같은 Lynx icon element와 `<image tint-color>` 기반 wrapper를 우선 검토한다.

## Docs and registry

- Lynx snippet은 `docs/registry/lynx/ui/<name>.tsx`에 둔다.
- `docs/registry/lynx/registry-ui.ts`에 item을 등록하고 `@seed-design/lynx-react`, `@seed-design/lynx-css` dependency range를 확인한다.
- `docs/content/lynx/components/<name>.mdx`의 install/usage/props는 Lynx snippet 경로를 가리킨다.
- Lynx component docs는 `Installation → Props → Usage → Web Version Differences → Unsupported Lynx Features` 순서를 따른다.
- Lynx docs heading은 최대한 영어로 쓰고, description과 설명 본문은 한국어로 작성한다.
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
