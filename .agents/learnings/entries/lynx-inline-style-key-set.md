---
id: lynx-inline-style-key-set
description: "Lynx 컴포넌트가 상태에 따라 inline `style` 객체의 key 구성을 바꾸거나(예: 방향별 `top`↔`bottom`, `left`↔`right`, `width`↔`height`), PlayLynx 기기 DOM이나 `@lynx-js/react/testing-library` element tree에서 이전 렌더의 style key가 남아 배치·크기가 어긋날 때 읽는다. 이전 key가 남는 관찰 결과와, 모든 key를 매번 지정하거나 `key`로 remount하는 수정 기준을 다룬다. key 구성이 바뀌지 않는 값 변경에는 적용하지 않는다."
scope: ["packages/lynx-react/**", "packages/lynx-react-headless/**"]
status: active
related: ["lynx-device-cdp-geometry", "lynx-headless-tree-parity"]
verified_at: "2026-09-30"
---

# 상태에 따라 바뀌는 inline style은 key 구성을 고정한다

## 교훈과 다음 행동

- 상태에 따라 다른 key를 쓰는 inline style은 쓰는 key를 모두 매번 지정한다. 쓰지 않는 offset에는 `auto`를 준다(`left`·`top`·`right`·`bottom`의 기본값이며 Lynx가 지원한다).
  - 예: `side === "top" ? { left, top: "100%", right: "auto", bottom: "auto" } : …`
- 빈 key를 채울 기본값이 사용자 `className`을 덮으면(inline style이 class보다 우선하므로 `margin: 0px`이 `className="my-x4"`를 이김) key 고정 대신 key 구성을 정하는 prop으로 React `key`를 줘 remount한다(예: Divider ``key={`${orientation}-${inset}`}``). 값이 바뀔 때 native view와 ref가 다시 만들어지므로 자주 바뀌는 상태(위치 계산 결과 등)에는 쓰지 않는다.
- `undefined` 값으로 key를 남겨도 지워지지 않는다. Vitest에서 top-level 리터럴 `<view style>`는 key가 지워지지만 컴포넌트 안에서 렌더한 `<view>`·`Box`는 남는다 → 재현은 컴포넌트를 통해 `rerender`로 한다.
- 새 key를 빼는 것으로 이전 값이 지워진다고 가정하지 않는다. 기기에서는 `agent-lynx cdp --method DOM.getDocument`로 대상 요소의 `style` 속성을 읽어 이전 key가 남았는지 확인한다.
- 분리 전후 element tree 비교에서 이런 잔여 key가 한쪽에만 있으면 렌더 순서 차이일 수 있다. 위치 값과 잔여 key를 나눠서 판정한다.

## 발생 근거와 적용 조건

- 상황(DES-2652): 변경 전 HelpBubble Arrow는 방향별로 `{ left, top: "100%" }`, `{ left, bottom: "100%" }`, `{ top, right: "100%" }` 등 다른 key 객체를 썼다. 처음에는 방향을 모르는 상태로 렌더링하고, 위치를 계산한 뒤 방향을 바꾼다.
- 기기 확인: iOS 26.6 PlayLynx(Lynx SDK 1.4.0)에서 `lynx/help-bubble/placement` 기준 bundle의 Arrow `style`이 `top:100%;left:94px;bottom:100%;`, `top:32px;left:0px;right:100%;`로 남았다. 테스트 환경 element tree에도 같은 잔여 key가 나왔다.
- 조치 후: 네 offset을 모두 지정하자 같은 장면의 Arrow `style`에 잔여 key가 없었고, 12개 배치의 Positioner 위치는 기준 bundle과 같았다.
- 적용 조건: DevTool DOM의 `style` 속성과 테스트 element tree로 확인했다. 잔여 key가 화면에 미치는 영향은 요소와 layout마다 다르므로, 화면이 맞아 보인다는 이유로 잔여 key를 무시하지 않는다.
- DES-2651: Divider가 `orientation`·`inset`에 따라 `width`/`height`/`margin*`을 나눠 썼다. Vitest에서 `<Divider inset />` → vertical → 기본값 rerender 결과가 `width: 100%; height: calc(100% - 32px); margin: 16px;`로 이전 key를 유지했다. `key` remount 뒤 iOS 26.5 시뮬레이터 PlayLynx(Lynx SDK 1.4.0)에서 tap으로 세 단계를 돌며 `DOM.getDocument`의 `style`에 이전 방향 key가 없음을 확인했다. remount 전 기기 재현은 하지 않았다.

## 변경 이력

- 2026-09-30: DES-2652 HelpBubble·Popover Arrow 기기 확인 결과를 기록했다.
- 2026-10-02: DES-2651 Divider에서 `width`↔`height` 사례, remount 대안과 선택 기준, 테스트 재현 조건을 추가했다.

- 2026-10-06: harness 지도에서 frontmatter를 읽을 수 있도록 description을 문자열로 감쌌다. 교훈 내용과 기존 검증 날짜는 변경하지 않았다.
