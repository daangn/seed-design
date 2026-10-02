---
id: lynx-main-thread-frame-tests
description: "Main Thread에서 `requestAnimationFrame`·`Date.now()`로 애니메이션·관성을 돌리는 Lynx 컴포넌트를 `@lynx-js/react/testing-library` dual-thread Vitest로 검증할 때 읽는다. frame을 한 장씩 실행하는 방법, frame callback을 `act()`로 감싸면 `runOnMainThread can only be used on the background thread`가 나는 조건, 테스트 환경에서 쓸 수 없는 rAF timestamp·`event.stopPropagation()`을 다룬다. 단순 tap·touch handler 호출만 검증하는 테스트에는 적용하지 않는다."
scope: ["packages/lynx-react/**", "packages/lynx-react-headless/**"]
status: active
related: ["lynx-headless-tree-parity", "lynx-test-event-bubbling"]
---

# Main Thread 애니메이션 테스트는 frame을 직접 돌리고 Background 처리는 waitSchedule에 맡긴다

## 교훈과 다음 행동

- 테스트 환경의 Main Thread `requestAnimationFrame`은 `setTimeout`이라 callback에 timestamp를 넘기지 않는다 → 엔진은 rAF 인자 대신 `Date.now()`로 경과 시간을 잰다. 테스트는 `vi.useFakeTimers({ toFake: ["Date"] })`와 `vi.setSystemTime()`으로 시간을 정한다.
- Main Thread의 rAF를 queue로 바꾸고 frame마다 thread를 전환해 실행한 뒤, Background 처리는 `waitSchedule()`로 흘려보낸다. frame의 결과가 `runOnBackground`로 state를 바꾸고 그 effect가 다시 `runOnMainThread`를 예약하면 작업이 한 번 더 이어지므로 `waitSchedule()`을 두 번 부른다.

  ```ts
  const frames = new Map<number, () => void>();
  const mainThread = lynxTestingEnv.mainThread.globalThis as Record<string, unknown>;
  mainThread["requestAnimationFrame"] = (callback: () => void) => { /* frames.set(id, callback) */ };
  mainThread["cancelAnimationFrame"] = (id: number) => frames.delete(id);

  for (const [frame, callback] of frames) {
    vi.setSystemTime((now += 16));
    frames.delete(frame);
    lynxTestingEnv.switchToMainThread();
    callback();
    lynxTestingEnv.switchToBackgroundThread();
  }
  await waitSchedule(); // frame이 runOnBackground로 넘긴 state 갱신과 effect
  await waitSchedule(); // 그 effect가 runOnMainThread로 예약한 작업
  ```

- frame callback을 `act()`로 감싸지 않는다. Main Thread로 전환한 채 `act`가 Background state 갱신과 effect를 즉시 flush하면, effect 안의 `runOnMainThread(...)`가 `runOnMainThread can only be used on the background thread`로 실패한다. native에서는 effect가 항상 Background에서 돌아 생기지 않는 실패다.
- 테스트 환경은 main-thread event handler를 `runWorklet(handler, [Object.assign({}, event)])`로 부른다. event의 own property만 복사되고 `stopPropagation`이 붙지 않는다 → fire할 event에 `detail`·`touches` 등을 직접 넣고, handler에서 `event.stopPropagation()`을 쓰면 테스트용 분기 없이는 실패한다.

## 발생 근거와 적용 조건

- 상황: `@seed-design/lynx-react-loop-scroll`에서 사용자 정착 뒤 `index` 동기화 effect가 `runOnMainThread`를 부르도록 바꾸자, frame callback을 `act(() => callback())`로 돌리던 dual-thread 테스트 4개가 위 오류로 실패했다. `act`를 빼고 frame 뒤 `waitSchedule()`로 넘기자 10개 테스트가 모두 통과했다(`@lynx-js/react` 0.117.0). 정착은 `runOnBackground(reportSettledJS)` → state 갱신 → `useEffect`의 `runOnMainThread(scrollToIndex)`로 이어지며, 테스트의 `runFrames()`는 이 연쇄를 위해 `waitSchedule()`을 두 번 부른다.
- 근거: 0.117.0 `testing-library/dist/env/vitest.js`는 main thread·background 양쪽 global에 `requestAnimationFrame = setTimeout`을 넣고, `__AddEvent` listener에서 worklet이면 `runWorklet(eventHandler.value, [Object.assign({}, evt)])`를 호출한다. `worklet-runtime/lib/eventPropagation.js`는 source가 native event일 때만 `stopPropagation`을 붙인다.
- `packages/lynx-react/src/components/Icon/Icon.test.tsx`는 frame callback을 `act`로 감싸지만, 그 callback이 Background effect의 `runOnMainThread`를 부르지 않아 문제가 드러나지 않는다.

## 변경 이력

- 2026-10-01: loop-scroll headless 패키지 테스트 작성 중 기록했다.
- 2026-10-02: 예제의 `waitSchedule()` 호출을 실제 테스트와 같은 두 번으로 맞췄다(PR #2390 리뷰).
