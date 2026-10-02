---
id: lynx-main-thread-handler-unbind
description: "Lynx headless·styled 컴포넌트에서 `disabled` 등으로 `main-thread:bind*`·`main-thread:catch*` 이벤트 handler를 `undefined`로 바꾸거나 spread에서 빼려 할 때, 또는 테스트·기기 log에 `MainThreadFunction: Invalid function object: {\"_workletType\":\"main-thread\"}`가 반복될 때 읽는다. ReactLynx가 handler 대신 빈 worklet을 계속 등록한다는 원천 근거와, handler를 bound 상태로 두고 내부에서 막는 대안, catch 해제가 필요할 때의 선택지를 다룬다. Background `bind*`·`catch*` handler에는 적용하지 않는다."
scope: ["packages/lynx-react/**", "packages/lynx-react-headless/**"]
status: active
related: ["lynx-headless-tree-parity", "lynx-test-event-bubbling"]
---

# main-thread 이벤트 handler는 `undefined`로 해제되지 않는다

## 교훈과 다음 행동

- `main-thread:*` 이벤트 prop 값이 `undefined`가 되거나 spread 객체에서 빠지면 ReactLynx는 binding을 지우지 않고 `{ _workletType: "main-thread" }`인 빈 worklet을 `__AddEvent`로 다시 등록한다. 이벤트가 오면 worklet runtime이 `Invalid function object` 경고를 내고 아무것도 실행하지 않는다.
- 끄고 켜야 하는 Main Thread handler는 항상 같은 worklet으로 bound해 두고, 캡처한 상태로 handler 안에서 바로 반환한다.

  ```tsx
  const handleTouchStart = React.useCallback((event: TouchEvent) => {
    "main thread";
    if (!config.interactive) return;
    // ...
  }, [config]);
  <view main-thread:catchtouchstart={handleTouchStart} />;
  ```

- `main-thread:catch*`를 끄면 부모로 전파될 것이라고 가정하지 않는다. native는 빈 worklet도 handler로 등록하므로 catch 등록이 남는다(추론, 기기 미확인). 부모 전파가 꼭 필요하면 다음 중 하나를 고르고 기기에서 확인한다.
  - catch 대신 `main-thread:bind*`를 쓰고, 막아야 할 이벤트에서만 `event.stopPropagation()`을 호출한다. `@lynx-js/react` 0.114.1부터 있다. host SDK 지원은 확인하지 않았다.
  - 상태가 바뀔 때 `key`를 바꿔 요소를 새로 mount하고, 해제 상태의 JSX에는 `main-thread:catch*` 속성을 두지 않는다. 같은 위치에 같은 element type과 `key`가 렌더링되면 기존 element가 유지되어 binding도 남을 수 있다. 새로 mount한 element에 catch binding이 없는지는 원천과 기기에서 확인하지 않았다(추론). 하위 tree도 다시 만들어진다.

## 발생 근거와 적용 조건

- 원천: `@lynx-js/react` 0.117.0 `runtime/lib/snapshot/workletEvent.js`의 `updateWorkletEvent`는 `rawValue ?? {}`에 `_workletType`을 붙여 `__AddEvent(element, eventType, eventName, { type: "worklet", value })`를 호출한다. spread에서 key가 빠질 때도 `runtime/lib/snapshot/spread.js`가 같은 함수를 `undefined` 값으로 부른다. lynx-stack main(`4f63dfd`)의 `packages/react/runtime/src/snapshot/snapshot/workletEvent.ts`도 같다.
- native: lynx develop(`8688964`) `core/renderer/dom/fiber/fiber_element.cc`의 `FiberAddEvent`는 object callback이면 `SetWorkletEventHandler`로 등록한다. 빈 callback일 때만 `RemoveEvent`로 지운다.
- 재현: `@seed-design/lynx-react-loop-scroll` 첫 구현이 `disabled`일 때 `main-thread:catchtouch*`에 `undefined`를 넘기자, dual-thread Vitest에서 touch 이벤트를 보낼 때마다 `MainThreadFunction: Invalid function object: {"_workletType":"main-thread"}`가 찍혔다. handler를 항상 bound하고 내부에서 반환하도록 바꾼 뒤 경고가 사라졌다.
- `packages/lynx-react-headless/sortable/src/Sortable.tsx`도 `sortingDisabled`일 때 `main-thread:global-bind*`에 `undefined`를 넘긴다. 같은 경고가 날 수 있지만 bind라 전파에는 영향이 없다. 기기에서 확인하지 않았다.

## 변경 이력

- 2026-10-01: loop-scroll headless 패키지 구현 중 원천과 테스트 재현으로 기록했다.
- 2026-10-02: 재mount 대안에 `key` 조건과 미확인 범위를 밝혔다(PR #2390 리뷰).
