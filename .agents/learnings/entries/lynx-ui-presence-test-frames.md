---
id: lynx-ui-presence-test-frames
description: "`@lynx-js/lynx-ui-dialog`처럼 `@lynx-js/lynx-ui-presence`를 쓰는 overlay(Dialog·AlertDialog 등)를 mock 없이 Vitest로 렌더링하거나, `lynx.requestAnimationFrame is not a function`이 나거나, 열린 Dialog의 Close·Backdrop tap이 무시될 때 읽는다. 테스트 환경의 frame stub 위치, 열림·닫힘 수명을 끝까지 진행시키는 방법, 분리 전후 element tree 비교를 결정적으로 만드는 방법을 다룬다. lynx-ui-sheet처럼 main-thread motion을 쓰는 엔진이나 기기 검증에는 적용하지 않는다."
scope: ["packages/lynx-react/**", "packages/lynx-react-headless/**"]
status: active
related: ["lynx-headless-tree-parity"]
verified_at: "2026-09-29"
---

# lynx-ui presence는 테스트에서 frame stub과 여러 act 단계가 필요하다

## 교훈과 다음 행동

- lynx-ui-presence는 `delayFrames`로 `lynx.requestAnimationFrame`을 부르는데 `@lynx-js/react/testing-library` 환경에는 이 함수가 없다. `lynx`와 `lynxTestingEnv.backgroundThread.lynx`·`lynxTestingEnv.mainThread.lynx`에 모두 stub을 넣는다. thread 전환·렌더마다 `lynx`가 바뀌므로 frame을 진행시키기 직전에 다시 넣는다.
- 동작 테스트는 `vi.useFakeTimers()`와 `requestAnimationFrame: (cb) => setTimeout(cb, 16)`을 쓴다. 상태 변화마다 effect가 다음 frame을 예약하므로 `act(() => vi.advanceTimersByTime(500))`를 한 번이 아니라 여러 번(예: 8회) 나눠 실행해야 `Entered`·`Left`까지 간다. 예: `packages/lynx-react-headless/dialog/src/Dialog.test.tsx`.
- 진입 중(`Entering`)에는 lynx-ui가 Trigger·Close·Backdrop을 busy로 막는다. tap이 무시되면 코드 결함으로 보기 전에 presence가 `Entered`까지 진행됐는지 확인한다.
- 분리 전후 element tree 비교는 `requestAnimationFrame: () => 0`으로 frame을 멈춘 뒤 렌더 직후 직렬화한다. 실제 timer로 진행시키면 실행마다 `ui-open`·`ui-closed` 개수가 달라져 비교할 수 없다.

## 발생 근거와 적용 조건

- DES-2620 Dialog 분리에서 실제 lynx-ui-dialog로 parity 테스트를 돌리자 `lynx.requestAnimationFrame is not a function`이 났다. `lynxTestingEnv.*.lynx`에 한 번만 stub을 넣으면 이후 timer 콜백에서 같은 오류가 다시 났다.
- setTimeout 기반 frame으로 한 번에 2000ms를 진행시키면 CloseButton·Backdrop tap 뒤 `onOpenChange`가 호출되지 않았다. 여러 act로 나누자 6개 동작 테스트가 통과했다.
- 실제 timer로 진행시킨 parity 결과는 3회 실행의 해시가 모두 달랐고, no-op frame으로 바꾸자 3회 모두 같았다. 이 기준으로 styled Dialog 9개 장면이 분리 전후 byte 단위로 같았다.
- 피할 패턴: overlay 동작을 mock 컴포넌트의 prop 전달 확인으로만 테스트하는 것, 한 번의 timer 진행으로 presence 수명이 끝났다고 가정하는 것.

## 변경 이력

- 2026-09-29: DES-2620 Dialog headless 분리에서 확인한 내용으로 작성했다.
