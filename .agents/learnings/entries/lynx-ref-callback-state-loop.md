---
id: lynx-ref-callback-state-loop
description: Lynx 컴포넌트가 intrinsic 요소의 ref callback에서 `setState`로 native node를 저장하거나, `@lynx-js/react/testing-library`의 `render`가 끝나지 않고 `JavaScript heap out of memory`로 죽을 때 읽는다. spread props가 있는 요소에서 같은 요소의 ref callback이 렌더마다 새 node 객체로 다시 호출되는 조건, node를 ref에 두는 방법, 측정 무효화 기준과 원인을 좁히는 절차를 다룬다. ref와 무관한 effect 무한 갱신에는 적용하지 않는다.
scope: ["packages/lynx-react/**", "packages/lynx-react-headless/**"]
status: active
related: ["lynx-headless-tree-parity"]
---

# ref callback에서 native node를 state에 넣으면 렌더가 끝나지 않을 수 있다

## 교훈과 다음 행동

- intrinsic 요소의 ref callback에서 받은 node를 `useState`에 넣지 않는다 → `useRef`에 저장하고, 측정은 RAF나 effect에서 `ref.current`를 읽는다. node 도착을 측정 시작 조건으로 써야 하면 열림 상태처럼 별도 state를 기준으로 삼는다.
- ref callback 안에서 측정 version을 올리는 등 무효화를 할 때는 node가 `null`↔요소로 바뀔 때만 한다. 같은 요소에 새 node 객체가 다시 전달될 때마다 무효화하면 진행 중인 비동기 측정이 계속 버려진다.
- 테스트가 OOM으로 죽으면 다음 순서로 좁힌다.
  - 파트를 하나씩 빼서 재현 범위를 줄인다.
  - 의심 요소에 forwarded ref로 호출 횟수를 세는 callback을 넘기고, 일정 횟수를 넘으면 throw한다. `null` 없이 객체만 반복되면 이 교훈에 해당한다.
  - 로그는 `appendFileSync`로 남긴다. OOM으로 프로세스가 죽으면 `console.log`는 출력되지 않는다.

## 발생 근거와 적용 조건

- 상황(DES-2652): `refactor-lynx-components` `4e0909074`의 `HelpBubbleContent`는 `<view ref={handleRef} ... {...nativeProps}>`의 ref callback에서 `setContentNode(node)`를 호출했다. `@lynx-js/react` 0.117.0 테스트 환경에서 `defaultOpen`으로 렌더링하자 `render()`가 반환하지 않고 heap OOM으로 종료됐다.
- 확인: Content에 호출 횟수를 세는 forwarded ref를 넘기자 `null` 없이 새 객체로 200회 넘게 호출됐다. `setContentNode((previous) => previous ?? node)`로 임시 변경하자 호출이 두 번으로 끝나고 렌더가 완료됐다. Content를 빼면 재현되지 않았다.
- 조치: `@seed-design/lynx-react-popover`의 `PopoverContent`는 node를 ref에 두고, node가 붙거나 떨어질 때만 측정 version을 올린다.
- 적용 조건: 테스트 환경에서 재현했다. 기기에서 같은 반복이 일어나는지는 확인하지 않았다. 기기에서 화면이 멈추지 않는다는 이유로 이 패턴을 안전하다고 판단하지 않는다.
- 위험: 열린 상태의 테스트를 작성할 수 없어 회귀 기준을 만들지 못하고, 기기에서는 렌더가 반복되며 측정이 계속 무효화될 수 있다.

## 변경 이력

- 2026-09-30: DES-2652 HelpBubble Headless 분리 중 변경 전 기준을 수집하다 발견한 원인과 조치를 기록했다.
