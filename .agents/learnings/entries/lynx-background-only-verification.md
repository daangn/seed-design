---
id: lynx-background-only-verification
description: Lynx headless hook·컴포넌트의 이벤트 handler에 `'background only'`를 붙이거나, hook이 반환한 handler를 안정화할지 판단하거나, styled 컴포넌트 리팩터링 전후 main-thread·background 산출물을 비교할 때 읽는다. 지시어가 실제로 main-thread 산출물에서 본문을 지우는지 `examples/lynx-spa` 빌드로 확인하는 방법, 비교 전 `lib` 재빌드와 문서 예제 전용 컴포넌트가 들어가는 lazy bundle 위치, 지시어를 붙일 함수의 기준, 렌더마다 새 handler가 native patch를 만드는지에 대한 ReactLynx 런타임 근거를 다룬다. 새 main-thread worklet 작성이나 번들 크기 전체 분석에는 적용하지 않는다.
scope: ["packages/lynx-react/**", "packages/lynx-react-headless/**", "examples/lynx-spa/**"]
status: active
related: ["lynx-headless-tree-parity"]
verified_at: "2026-09-29"
---

# `'background only'`는 main-thread 산출물 diff로 확인한다

## 교훈과 다음 행동

- 컴파일러는 `bindtap={fn}`처럼 JSX에 바로 넣은 handler만 background 전용으로 판단한다. hook 반환값·context·custom prop을 거쳐 `bind*`에 닿는 함수는 `main-thread.js`에 본문이 남는다. 이런 함수의 첫 문장에 `"background only";`를 둔다.
- 붙이는 기준: 이벤트 handler·effect·ref callback에서만 호출되고 setState·사용자 callback·ref 조작 같은 부수 효과가 있는 함수. 순수 계산 helper와 호출 위치를 제한할 수 없는 범용 util(`useControllableState`의 setter)에는 붙이지 않는다. render 중 호출되면 main thread에서만 no-op가 되어 두 thread 결과가 달라진다.
- 확인: `cd examples/lynx-spa && DEBUG=rspeedy bun --filter lynx-spa build`는 `dist/.rspeedy/main/main-thread.js`와 `background.*.js`를 남긴다. 변경 전 파일을 복사해 두고 `tr ';{}' '\n\n\n'`로 나눈 뒤 diff하면 본문이 빠진 함수가 보인다. 지시어는 tsc·bunchee 산출물(`lib/*.js`)에도 남고 workspace 패키지에도 적용된다.
- lynx-spa는 `@seed-design/lynx-react`를 `lib/`로 소비한다(`exports["."].import`). 전후 빌드마다 먼저 `bun --filter @seed-design/lynx-react build`를 실행하고, `lib/`의 대상 파일에 바뀐 코드가 들어갔는지 확인한다.
- lynx-spa page가 import하지 않고 문서 예제에서만 쓰는 컴포넌트는 main bundle이 아니라 `dist/.rspeedy/lazy-bundle/______docs_examples_lynx_<component>_<example>.tsx/{main-thread,background}.js`에 들어간다. 먼저 `grep -l -a 'seed-<component>__' -r dist/.rspeedy`로 대상 bundle을 찾는다. main bundle diff가 hash·debugmetadata만 다르다고 해서 "변경 없음"으로 판정하지 않는다.
- handler identity: ReactLynx background diff는 이벤트 함수가 바뀌어도 main thread로 patch를 보내지 않는다. 직접 속성은 이전 값이 없을 때만 갱신하고, spread는 함수를 고정 sign 문자열로 바꿔 비교한다(`@lynx-js/react/runtime/lib/backgroundSnapshot.js`의 `setAttributeImpl`). 새 함수의 비용은 background 할당뿐이다. 반환 객체를 memo하려면 `useMemoizedFn`(`@lynx-js/lynx-ui-common`)으로 최신 props를 읽는 안정 handler를 만든다. `useCallback([])`은 오래된 closure를 남긴다.

## 발생 근거와 적용 조건

- DES-2614에서 bottom-sheet Trigger와 use-press-tap·toggle·image·accordion·app-bar headless 함수 14개(bottom-sheet Root ref callback 포함)에 지시어를 붙였다. `@lynx-js/react` 0.123.3 SPA 빌드에서 `main-thread.js`가 4,632,306 → 4,631,432 byte가 됐고, Trigger 본문(`animate:!1`)은 main-thread에서 사라지고 background에만 남았다.
- `bun test:lynx-react`는 모두 통과했다. iOS PlayLynx에서 BottomSheet 열기·닫기, Accordion 접기와 높이 측정, AppBar 좌우 폭 측정, ActionButton loading, usePressTap 눌림·tap·disabled, useToggle, useImage loaded·error를 확인했다.
- 피할 패턴: 테스트 통과만으로 지시어 효과를 주장하는 것. 테스트 환경은 main-thread 본문 제거 여부를 보여 주지 않는다.
- DES-2617(ContextualFloatingButton을 `useActionButton`으로 전환) 리뷰에서 main bundle의 `main-thread.js`만 비교했다. 차이는 debugmetadata와 hot-update hash뿐이었다. CFB는 lynx-spa page에서 쓰지 않아 코드가 lazy 예제 bundle에만 있었다. lazy bundle을 비교하자 CFB 모듈이 main bundle에 이미 있는 `useActionButton` 모듈을 참조하도록 바뀐 것이 보였고, 예제마다 main-thread.js가 40 byte, background.js가 50 byte 줄었다.

## 변경 이력

- 2026-09-29: DES-2614 background-only 적용 작업에서 처음 기록했다.
- 2026-09-29: DES-2617 리뷰에서 비교 전 `lib` 재빌드와 lazy 예제 bundle 위치를 보강했다.
