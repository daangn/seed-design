---
id: lynx-display-none-overflow
description: Lynx 예제·Headless consumer·Recipe에서 선택되지 않은 패널처럼 `display: none`으로 숨긴 view의 자식 `<text>`가 iOS PlayLynx 기기에서 부모 왼쪽 위에 겹쳐 그려질 때 읽는다. DOM에서는 class·computed `display: none`이 맞고 box 크기가 0인데 글자가 보이는 경우에 적용하며, 숨김 class에 함께 둘 속성과 A/B 확인 방법을 다룬다. 요소가 아예 렌더링되지 않거나 class가 적용되지 않은 문제에는 적용하지 않는다.
scope: ["examples/lynx-spa/**", "docs/examples/lynx/**", "packages/lynx-react/**", "packages/lynx-react-headless/**", "packages/lynx-qvism-preset/**"]
status: active
related: ["lynx-example-display-flex", "lynx-device-cdp-geometry"]
verified_at: "2026-10-01"
---

# display: none으로 숨기는 view에는 overflow: hidden을 함께 둔다

## 교훈과 다음 행동

- 숨김 class에 `display: none`만 두지 않고 `overflow: hidden`을 같은 규칙에 적는다. SEED Tabs Recipe의 `content` slot도 `overflow: hidden`을 가지고 있어 같은 증상이 없다.
- 증상을 보면 먼저 `DOM.getDocument`로 대상 view의 class를 확인하고, `CSS.getComputedStyleForNode`의 `display`, `DOM.getBoxModel`의 크기를 본다. `display: none`·높이 0인데 글자가 보이면 이 경우다.
- 판정은 숨김 class에 `overflow: hidden`만 추가한 A/B screenshot으로 한다. computed `overflow`는 추가 전에도 `hidden`으로 보고되므로 computed 값만으로 판단하지 않는다.
- 원인은 명시 속성이 없는 view가 flatten되어 숨김이 자식 text에 적용되지 않는 것으로 추정한다[추론]. `flatten={false}`로 같은 결과가 나는지는 확인하지 않았다.

## 발생 근거와 적용 조건

- DES-2632에서 `examples/lynx-spa/src/pages/TabsHeadlessPage.tsx`의 Headless Tabs 패널을 `.tabs-headless-content-hidden { display: none; }`으로 숨겼다. iPhone(iOS 26.6) PlayLynx, Lynx SDK 1.4.0에서 숨긴 패널 8개의 text가 Root 왼쪽 위(패널 box 위치 16,184)에 겹쳐 보였다.
- 같은 시점 DOM은 class `tabs-headless-content-hidden`, computed `display: none`, box 높이 0이었다. 두 class를 함께 쓰던 것을 단일 class로 바꿔도 증상이 남았다.
- 숨김 class에 `overflow: hidden`만 추가하고 같은 Card를 `Page.reload`하자 겹침이 사라졌다. 같은 Card의 styled Tabs(Recipe `content` slot)는 증상이 없었다.
- Android와 iOS Simulator에서는 확인하지 않았다.

## 변경 이력

- 2026-10-01: DES-2632 Headless Tabs 예제의 기기 검증에서 A/B로 확인해 기록했다.
