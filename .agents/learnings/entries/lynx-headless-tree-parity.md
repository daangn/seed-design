---
id: lynx-headless-tree-parity
description: Lynx styled 컴포넌트를 headless hook으로 분리하면서 Provider·context·native 이벤트 전달을 바꾸거나, 스타일 없는 headless Root에 눌림 상태를 연결할 때 읽는다. 공개 API·화면이 같아도 생길 수 있는 할당 증가·이중 이벤트 바인딩·disabled 누락과, 같은 요소의 `bindtouch*`·`main-thread:bindtouch*`·`capture-bind*`가 테스트 환경과 native에서 다르게 공존하는 규칙, element tree 전후 비교·dual-thread 테스트·기기 성능 검증을 다룬다. parity 테스트가 `preact`의 `process` export 오류로 로드되지 않거나 inline CSS 변수가 빈 값으로 직렬화될 때도 읽는다.
scope: ["packages/lynx-react/**", "packages/lynx-react-headless/**"]
status: active
related: ["isolated-regression-baselines"]
---

# Headless 분리 리팩터링은 native tree 직렬화로 회귀를 막는다

## 교훈과 다음 행동

- hook이 memo된 객체를 반환하게 한다. styled 층은 기존 context 값을 `{ ...api, variantProps }`로 확장해 Provider 수를 유지한다. hook prop 중 기존에 native로 바인딩하지 않던 key는 분해해서 원래 경로로만 넘긴다. `main-thread:*` 핸들러의 disabled gate는 `packages/lynx-react-headless/toggle/src/Toggle.tsx`처럼 명시한다.
- 같은 요소의 같은 이벤트 이름에 대해 native는 Background handler 하나와 Main Thread handler 하나를 따로 보관한다. `bindtouchstart`와 `main-thread:bindtouchstart`는 둘 다 실행된다. 반면 `@lynx-js/react/testing-library`는 `bindEvent:touchstart` key 하나에 둘을 덮어쓰므로 dual-thread 테스트에서만 한쪽이 사라진다. 테스트 실패만으로 native 결함을 보고하지 말고 기기에서 확인한다.
  - headless Root가 소비자 `main-thread:bindtouch*`를 실행한 뒤 `runOnBackground(press)()`로 넘기는 합성은 테스트 환경에서 눌림 상태를 유지하고 native에서도 무해하므로 유지한다. 컴포넌트마다 `runOnBackground(press)()` 합성을 복사하지 않는다 → 소비자 handler를 `usePressTap`의 `mainThreadOnTouchStart`·`mainThreadOnTouchEnd`·`mainThreadOnTouchCancel`에 넘기고, 훅이 반환한 `main-thread:bindtouch*`를 view에 펼친다. 공개 훅(`useAccordionTrigger` 등)도 이 세 prop을 받아 `usePressTap`에 전달한다. 예: `packages/lynx-react-headless/accordion/src/useAccordionTrigger.ts`, `toggle/src/useToggle.ts`.
  - phase는 별도 칸을 만들지 않는다. `main-thread:capture-bindtouchstart`와 `main-thread:bindtouchstart`는 같은 Main Thread 칸을 두고 경쟁해 하나만 실행된다. Scale Feedback 같은 내부 Main Thread handler를 capture로 옮겨 소비자 handler와 분리하려 하지 않는다 → 같은 key로 두고 `mergeProps`로 합성한다.
- 다음 순서로 검증한다.
  - 리팩터링 전 임시 테스트(`<Component>.parity.test.tsx`)로 공개 API만 import해 조합·상태별 element tree를 JSON으로 저장한다. 대상은 태그, 정렬된 className, inline style, 속성, 이벤트 핸들러 key 집합이다.
  - parity 테스트는 대상 컴포넌트 파일이나 `<Component>.namespace.ts`를 import한다. `src/components/index.ts`(`..`)를 import하면 lynx-ui-sheet까지 불러와 `The requested module 'preact' does not provide an export named 'process'`로 suite가 로드되지 않는다.
  - 이벤트 핸들러 key는 DOM attribute에 나타나지 않는다 → `@lynx-js/react/testing-library`가 element에 붙이는 `eventMap` 속성의 key를 정렬해 직렬화한다(`"eventMap" in element`로 좁혀 읽는다).
  - tap으로 action이 경계에 닿아 Scale Feedback의 `disabled`가 바뀌면 Background만 켠 render에서 `runOnMainThread can only be used on the background thread`가 날 수 있다. 장면별 조작을 `try/catch`로 감싸 오류 문구를 콜백 로그에 남기고 다음 장면을 이어 수집한다. 전후 로그에 같은 오류가 남는지까지 비교한다.
  - 테스트 환경의 jsdom은 inline style의 CSS custom property(예: `--fab-label-width`)를 버린다. `style.cssText`·`getPropertyValue`가 모두 빈 값이므로 parity로 CSS 변수 회귀를 판정하지 않는다 → 기기에서 `agent-lynx cdp --method DOM.getDocument`의 `style` attribute로 값을 확인한다.
  - 한 테스트에서 여러 장면을 `render()`로 이어 그릴 때는 매번 testing-library의 `cleanup()`을 먼저 호출한다. 같은 컴포넌트 타입을 같은 위치에 다시 그리면 이전 장면의 state(예: 닫힌 uncontrolled `open`)가 이어진다.
  - 변경 후 같은 테스트를 다시 실행해 `cmp`로 byte 동일성을 확인한다. 임시 파일은 typecheck를 깨뜨릴 수 있으므로 `bun test:lynx-react` 최종 실행 전에 삭제한다.
  - 기기 성능은 변경 전과 변경 후 bundle을 번갈아(B,A,B,A…) 5회 이상 Perfetto로 측정하고, 중앙값 차이를 변경 전 실행 간 편차와 비교한다.
  - 소비자 Main Thread touch 핸들러를 넘기는 경로는 `render(..., { enableMainThread: true, enableBackgroundThread: true })` 테스트로 합성 전 실패를 먼저 확인한다. 소비자 Background touch 핸들러가 dual-thread 테스트에서 호출되지 않는 것은 위 테스트 환경 한계이므로 기기로 판정한다.

## 발생 근거와 적용 조건

- 상황: Lynx Accordion을 headless hook으로 옮길 때 첫 구현에 네 가지 문제가 있었다.
  - hook이 매 렌더 새 객체를 반환했고, styled·headless 컴포넌트가 이를 `useMemo`로 다시 감쌌다.
  - styled Root에 variant 전용 Provider가 하나 늘었다.
  - `triggerProps`의 `bindtouch*`를 styled view에 펼치면 `useScaleFeedback`의 `main-thread:bindtouch*`와 이중으로 바인딩될 위험이 있었다.
  - headless Trigger가 disabled일 때 `main-thread:bindtap`을 막지 않았다.
- 영향: reactlynx-best-practices 리뷰가 잡기 전까지 성능 회귀(할당·Provider·context read 증가)와 disabled 동작 결함이 있었다. 두 차례 수정 작업이 필요했다.
- 피할 패턴: hook 결과를 소비처마다 `useMemo(() => api, [fields])`로 감싸는 것. 스타일 전용 값을 옮기려고 새 Provider를 추가하는 것. hook이 준 prop 객체 전체를 native view에 펼치는 것.
- 위험: 렌더마다 할당과 context 무효화가 늘고, 기존 native tree에 없던 이벤트 key가 추가된다. 테스트와 화면은 통과해도 성능이 회귀한다.
- 상황(DES-2612): ActionButton headless Root에 소비자 `main-thread:bindtouchstart`를 넘기자 합성 전 dual-thread 테스트에서 눌림 상태가 `false`로 남았다. 테스트 환경이 `bindEvent:touchstart` key 하나에 Background·Main Thread 핸들러를 덮어쓴 결과다. 당시 native도 같다고 보았으나 DES-2618에서 아래처럼 정정했다.
- 상황(2026-09-29 리뷰): ActionButton·Callout Root는 같은 합성을 각자 복사했고, Accordion `useAccordionTrigger`와 Toggle Root에는 합성이 없었다. hook만 쓰는 소비자는 핸들러를 넘길 경로가 없었다. 합성 전 dual-thread 임시 테스트에서 Accordion `pressed`, Toggle `active`가 `false`로 남는 것을 확인했고, `usePressTap`으로 옮긴 뒤 네 패키지의 dual-thread 테스트와 `bun test:lynx-react`가 통과했다.
- 영향(DES-2612): 합성을 추가하기 전 dual-thread 테스트가 실패했고, 추가 뒤 통과했다. 232개 장면의 styled element tree는 분리 전후 byte 단위로 같았다.
- 상황(DES-2615): Callout parity 테스트에서 dismiss한 uncontrolled Root 다음 장면을 `cleanup()` 없이 같은 컴포넌트로 다시 그리자 Root가 닫힌 채 남아 `missing .seed-callout__closeButton`으로 실패했다. 장면마다 `cleanup()`을 넣은 뒤 51개 장면(트리와 콜백 순서 로그)이 분리 전후 byte 단위로 같았다.
- 상황(DES-2618): FloatingActionButton parity 테스트가 `from ".."`로 공개 namespace를 가져오다 위 `preact` 오류로 로드되지 않았다. `./FloatingActionButton.namespace`로 바꾼 뒤 38개 장면을 수집했다. label 측정 뒤 `--fab-label-width`는 jsdom에서 항상 빈 값이었고, PlayLynx 기기 DOM의 root `style`에서는 label 폭과 같은 `101px`·`73.5px`로 확인했다.
- 상황(DES-2618): 리뷰에서 styled FAB의 소비자 Background `bindtouchstart`가 dual-thread 테스트에서 0회 호출되는 것을 native 결함으로 보고, Scale Feedback trigger를 `main-thread:capture-bindtouch*`로 옮겼다.
- 영향(DES-2618): iOS PlayLynx(SDK 1.4.0)에서 원래 코드는 이미 소비자 Background `bindtouchstart`·`bindtouchend`와 눌림 상태가 모두 동작했다. capture 변경본에서는 소비자 `main-thread:bindtouchstart`만 실행되고 눌림 상태가 켜지지 않았다. 변경을 되돌렸다. Lynx engine(`core/renderer/dom/attribute_holder.h`, `f364ace`)은 Background handler를 `static_events`, Main Thread handler를 `lepus_events_`에 이벤트 이름 key로 `insert_or_assign`해 phase와 관계없이 이름당 하나씩 보관한다.
- 상황(DES-2639): QuantityPicker parity 테스트에서 removable이 아닌 Decrement를 `min`까지 누르는 장면이 위 `runOnMainThread` 오류로 전체 테스트를 실패시켰다. 장면별 `try/catch`로 오류를 로그에 남기고 `eventMap` key를 포함해 26개 장면을 수집했다. 분리 전후 JSON이 `cmp`로 byte 단위로 같았다.

## 변경 이력

- 2026-09-28: `AGENT_LEARNINGS.md`의 같은 제목 항목을 이관했다(원문 commit `cecc3eac1f0a64930788f1606571246614a631e7`). 기존 근거를 보존했으며 이관 과정에서 재검증하지 않았다.
- 2026-09-28: frontmatter만으로 읽기 대상을 고를 수 있도록 대상·적용 조건·본문에서 다루는 판단을 보강했다. 실행 재검증은 하지 않았다.
- 2026-09-28: DES-2612 ActionButton 분리에서 확인한 소비자 Main Thread touch 핸들러 합성과 dual-thread 테스트 절차를 추가했다.
- 2026-09-29: DES-2615 Callout 분리에서 확인한 장면 간 `cleanup()` 필요성을 추가했다.
- 2026-09-29: DES-2618 FloatingActionButton 작업에서 parity 테스트의 import 경로와 jsdom의 CSS 변수 누락을 추가했다.
- 2026-09-29: DES-2618에서 Background·Main Thread handler 공존 규칙을 기기와 engine 원천으로 정정하고, capture phase 분리 시도가 실패한 근거를 추가했다.
- 2026-09-29: 합성 위치를 `usePressTap` 옵션으로 옮긴 결과와 Accordion·Toggle 재현 근거를 반영했다.
- 2026-10-01: DES-2639에서 이벤트 key 직렬화 위치와 장면별 Main Thread 오류 처리 방법을 추가했다.
