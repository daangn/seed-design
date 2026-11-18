---
id: lynx-list-scroll-top-event-drop
description: Lynx `<list>`의 `main-thread:bindscroll` `scrollTop`으로 맨 위 여부를 판정하는 컴포넌트(PullToRefresh ListContent, 맨 위에서만 동작하는 제스처 등)를 만들거나, list를 맨 위까지 되돌린 뒤 당김·제스처가 다음 스크롤 전까지 계속 거부될 때 읽는다. scroll 이벤트가 맨 위 도달 값을 빠뜨리는 관찰, `scrolltoupper`로 보완하는 방법, 디버그 로그로 확인하는 절차를 다룬다. scroll-view의 scroll 이벤트에는 확인하지 않았다.
scope: ["packages/lynx-react-headless/**", "packages/lynx-react/**"]
status: active
related: ["lynx-gesture-intercept-bounce", "lynx-drag-gesture-cdp"]
verified_at: "2026-10-23"
---

# list의 scroll 이벤트는 맨 위 도달 값을 빠뜨릴 수 있다

## 교훈과 다음 행동

- `<list>`의 `scroll` 이벤트는 간격을 두고 보내져, 스크롤이 맨 위에 닿은 마지막 `scrollTop: 0`이 오지 않을 수 있다. 이 값으로 맨 위를 판정하면 마지막으로 받은 양수 값이 남아, 다시 스크롤하기 전까지 판정이 계속 틀린다(시간이 지나도 풀리지 않는다).
- 같은 상황에서 `scrolltoupper`는 `scrollTop: 0`을 보냈다. `main-thread:bindscrolltoupper`를 같은 판정 handler에 연결해 보완한다(`packages/lynx-react-headless/pull-to-refresh/src/PullToRefresh.tsx`의 ListContent).
- `scrollstatechange` detail에도 iOS list-container에서는 `scrollTop`이 있었지만 `@lynx-js/types` 3.9의 `ListScrollStateInfo`에는 없어 플랫폼 보장이 없다 → 판정에 쓰지 않는다.
- 확인은 대상 list에 `main-thread:bindscroll`·`bindscrolltoupper`·`bindscrollstatechange` 로그 handler를 임시로 붙이고 `agent-lynx get-console --thread main --watch`로 순서를 본다. 확인 뒤 임시 handler를 지운다.

## 발생 근거와 적용 조건

- SEED-8(iOS 26.7 실기기 PlayLynx, SDK 1.4.0, `custom-list-name="list-container"`, `lynx-spa` dev bundle `lynx/pull-to-refresh/list`): CDP touch로 list를 약 457px 내린 뒤 아래로 끌어 맨 위로 되돌렸다. 4회 반복 중 4회 모두 마지막 `scroll`이 `scrollTop: 307`에서 끝났고 `scrolltoupper`(`scrollTop: 0`)만 왔다. 이어서 당긴 PullToRefresh가 모두 거부됐고 5초 뒤에도 거부됐다. `scrolltoupper`를 연결한 뒤 같은 입력 4회가 모두 수락됐다(3·4회는 여전히 마지막 `scroll`이 307).
- 이 기기에서 CDP touch(`Input.emulateTouchFromMouseEvent`)는 list를 실제로 native 스크롤시켰다(5번 항목 y 494→12).
- 기본 list(`custom-list-name="list"`)는 detail 형식이 다르고(`state` 필드), 같은 관찰은 하지 않았다. Android는 확인하지 못했다.

## 변경 이력

- 2026-10-23: SEED-8에서 기록했다.
