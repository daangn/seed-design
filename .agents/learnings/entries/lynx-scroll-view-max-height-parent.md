---
id: lynx-scroll-view-max-height-parent
description: Lynx floating 레이어(Menu·Select 등)나 Headless consumer에서 `scroll-view`에 고정 `height`를 주지 않고, 부모의 `max-height`(위치 계산한 가용 높이)만으로 짧은 목록은 내용 높이로 줄이고 긴 목록은 스크롤하게 할지 판단할 때 읽는다. iOS PlayLynx 실기기에서 확인한 구조(flex column 부모 + `max-height`, 자식 `scroll-view`)와, 측정 높이가 가용 높이 제한에 다시 반영되어 placement가 흔들리지 않게 하는 기준을 다룬다. 가로 스크롤이나 `scroll-view` 자체에 고정 높이가 필요한 pager에는 적용하지 않는다.
scope: ["packages/lynx-react/**", "packages/lynx-react-headless/**", "packages/lynx-qvism-preset/**", "examples/lynx-spa/**"]
status: active
related: ["lynx-device-cdp-geometry", "lynx-inline-style-key-set"]
verified_at: "2026-10-01"
---

# 부모 max-height만으로 scroll-view를 내용 높이로 줄이고 스크롤할 수 있다

## 교훈과 다음 행동

- 세로 `scroll-view`에 높이를 직접 주지 않아도 된다. 부모를 `display: flex; flex-direction: column; overflow: hidden`으로 두고 부모에 `max-height`를 주면, 짧은 목록은 내용 높이로 줄고 긴 목록은 부모 높이에서 잘린 채 스크롤된다. `scroll-view` 자체에는 `width: 100%`나 recipe의 `max-height`만 있어도 된다.
- 부모 `max-height`를 위치 계산 결과로 바꾸는 컴포넌트는 그 제한에 걸린 layout 높이를 콘텐츠 원래 높이로 다시 쓰지 않는다 → `bindlayoutchange` 높이가 적용한 제한 이상이고 저장한 높이가 더 크면 저장값을 유지한다. 그렇지 않으면 제한된 높이로 다시 계산하며 flip·크기가 반복해서 바뀔 수 있다(React `packages/react-headless/menu/src/useMenu.ts`의 iOS flip 진동 주석과 같은 원인).
- 측정 전·다시 열기 전에는 `max-height`를 제거하지 말고 `"100%"`를 넣는다. Lynx는 `max-height: none`을 지원하지 않고, 지운 inline key는 이전 값이 남을 수 있다(`lynx-inline-style-key-set`). 전체 화면 레이어 안의 absolute 콘텐츠에서 `100%`는 사실상 제한 없음이다.

## 발생 근거와 적용 조건

- DES-2622(Menu Headless 분리)에서 `scroll-view`에 계산 높이를 직접 주던 구조를, Headless `MenuContent`가 `maxHeight`만 적용하고 `scroll-view`는 Primitive·consumer가 두는 구조로 바꿨다.
- iOS 26.6 iPhone 실기기 PlayLynx(Lynx SDK 1.4.0), agent-lynx 0.14.2에서 확인했다.
  - Headless consumer(`examples/lynx-spa`의 Menu (Headless) 페이지): 3개 항목은 내용 높이로 표시됐다. 30개 항목은 `max-height`까지만 그려지고 `agent-lynx scroll`로 30번째 항목까지 스크롤된 뒤 항목 탭이 `itemClick`으로 닫혔다.
  - SEED Menu(24개 항목, 두 그룹): Content `max-height:480px`(scrollArea token)로 그려지고 마지막 항목까지 스크롤됐다. 구분선은 1개였다.
- Android는 확인하지 않았다. 다른 플랫폼에서 쓰기 전에 같은 장면을 확인한다.

## 변경 이력

- 2026-10-01: DES-2622 기기 검증 결과로 작성했다.
