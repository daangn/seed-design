---
id: lynx-inline-style-key-set
description: Lynx 컴포넌트에서 prop·상태 변경으로 inline `style` 객체의 key가 빠지거나 바뀔 때(예: `gap`·`bg` prop 제거, 방향별 `top`↔`bottom`), `@lynx-js/react/testing-library` element tree나 PlayLynx DevTool `DOM.getDocument`의 `style` attribute에 이전 key가 남아 보이면 읽는다. 테스트 환경·DevTool attribute의 잔존과 실제 native 렌더 결과를 구분하는 근거와 판정 방법, key 구성을 고정할지 정하는 기준을 다룬다. key 구성이 바뀌지 않는 값 변경에는 적용하지 않는다.
scope: ["packages/lynx-react/**", "packages/lynx-react-headless/**"]
status: active
related: ["lynx-device-cdp-geometry", "lynx-headless-tree-parity"]
verified_at: "2026-10-06"
---

# inline style key 잔존은 테스트 환경·DevTool attribute에서 생긴다

## 교훈과 다음 행동

- native에서는 빠진 key의 이전 값이 렌더에 남지 않는다. ReactLynx는 style이 바뀌면 새 객체 전체를 `__SetInlineStyles`로 넘기고, engine의 `FiberSetInlineStyles`는 `RemoveAllInlineStyles()`로 기존 inline style을 지운 뒤 새 값을 적용한다 → key 잔존만을 이유로 모든 key를 기본값으로 채우거나 React `key`로 remount하지 않는다. 기본값을 inline에 채우면 사용자 `className`을 덮는다.
- `@lynx-js/react/testing-library`(0.117.0 확인)의 `__SetInlineStyles`는 object를 `Object.assign(e.style, styles)`로 병합한다 → 테스트 element tree에서는 빠진 key가 남는다. prop 제거를 rerender로 검증하는 테스트는 이 차이를 알고 작성하고, 잔존을 제품 결함으로 판정하지 않는다.
- `undefined` 값으로 key를 남겨도 지워지지 않는다. Vitest에서 top-level 리터럴 `<view style>`는 key가 지워지지만 컴포넌트 안에서 렌더한 `<view>`·`Box`는 남는다 → 재현은 컴포넌트를 통해 `rerender`로 한다.
- PlayLynx DevTool `DOM.getDocument`의 `style` attribute도 빠진 key를 계속 보일 수 있다. 렌더 결과는 `DOM.getBoxModel` border quad와 screenshot으로 판정한다. `CSS.getComputedStyleForNode`도 `var(...)` 값 속성(`row-gap`·`background-color`)을 실제와 다르게 `0px`·투명으로 보였으므로 판정 근거로 쓰지 않는다.
- 상태별로 다른 offset key를 쓰는 요소(Arrow 등)는 모든 key를 지정해도 무방하다. 테스트·DevTool 표시를 실제와 맞추는 선택이지 native 결함 수정이 아니다.

## 발생 근거와 적용 조건

- 원천(2026-10-06): `@lynx-js/react` 0.117.0 `runtime/lib/snapshot/spread.js`, lynx-stack `swc_plugin_snapshot`의 style 갱신 경로, lynx-family/lynx `core/runtime/lepus/bindings/renderer_functions.cc`의 `FiberSetInlineStyles`(3.2.0–4.1.0 태그와 develop `8688964`에서 같음), testing-library `dist/env/vitest.js`.
- 기기 확인(DES-2720): iPhone iOS 26.6 PlayLynx(Lynx SDK 1.4.0), agent-lynx 0.14.2, 임시 예제. `VStack`의 `gap="x6"`·`bg="bg.neutralWeak"`(token)와 `gap={24}`·`bg="#ff0000"`(literal)를 tap으로 제거했다. 두 Stack의 둘째 자식 border y는 247→223으로 prop 없는 기준 Stack(223)과 같았고 높이는 80→56이었다. screenshot에서 회색·빨간 배경이 사라졌다. 같은 시점 literal Stack의 DevTool `style` attribute에는 `background-color:#ff0000;column-gap:24px;row-gap:24px`가 남아 있었다. 다시 tap해 prop을 넣자 247로 돌아왔다.
- 기기 확인(DES-2720, Android): Galaxy SM-F971N Lynx Go, 같은 임시 예제. 둘째 자식 border y가 270.9→246.9로 기준 Stack(246.9)과 같았고 높이는 80→56이었다. screenshot에서 배경이 사라졌고, 다시 넣자 270.9로 돌아왔다. DevTool `style` attribute에는 literal Stack의 `background-color`·`row-gap`·`column-gap`이 남았고, token Stack에는 이전 inline CSS 변수(`--seed-dimension-x6` 등)가 덧붙어 보였다.
- 테스트 환경 확인(DES-2720): `render(<VStack gap="x3" />)` 뒤 `rerender(<VStack />)`에서 root `style`에 `row-gap`·`column-gap`이 남았다.
- 이전 관찰(DES-2652): iOS 26.6 PlayLynx에서 HelpBubble Arrow의 DevTool `style`이 `top:100%;left:94px;bottom:100%;`처럼 이전 offset key를 보였고, 테스트 element tree도 같았다. 이때도 12개 배치의 Positioner 위치는 기준 bundle과 같았다. 네 offset을 모두 지정한 뒤 attribute 잔존이 사라졌다.
- 이전 관찰(DES-2651): Divider가 `orientation`·`inset`에 따라 `width`/`height`/`margin*`을 나눠 썼다. Vitest에서 `<Divider inset />` → vertical → 기본값 rerender 결과가 `width: 100%; height: calc(100% - 32px); margin: 16px;`로 이전 key를 유지했다. `key` remount 뒤 iOS 26.5 시뮬레이터 PlayLynx(Lynx SDK 1.4.0)에서 tap으로 세 단계를 돌며 `DOM.getDocument`의 `style`에 이전 방향 key가 없음을 확인했다. remount 전 기기 재현은 하지 않았다.

## 변경 이력

- 2026-09-30: DES-2652 HelpBubble·Popover Arrow 기기 확인 결과를 기록했다.
- 2026-10-02: DES-2651 Divider에서 `width`↔`height` 사례, remount 대안과 선택 기준, 테스트 재현 조건을 추가했다.
- 2026-10-06: DES-2720 기기 측정과 engine·testing-library 원천으로 잔존 위치를 테스트 환경·DevTool attribute로 정정했다. "모든 key를 매번 지정"을 필수 수정 기준에서 선택 사항으로 바꿨다. 같은 날 Android Lynx Go 측정 결과를 추가했다.
