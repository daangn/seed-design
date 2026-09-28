---
id: lynx-z-index-stacking-context
description: Lynx recipe·컴포넌트에서 z-index를 가진 slot(좌우 버튼, 배경, indicator 등)이 scroll-view 안에서 스크롤을 따라가지 않거나, 부모의 overflow·border-radius에 잘리지 않거나, 배경 slot이 보이지 않는다는 제보를 조사할 때 읽는다. PlayLynx 기기 재현, inline style A/B 임시 예제로 원인을 좁히는 방법, 부모를 stacking context로 만드는 수정 기준을 다룬다. jsdom 테스트나 native tree parity로는 확인할 수 없는 native 합성 결함에 적용한다.
scope: ["packages/lynx-qvism-preset/**", "packages/lynx-css/**", "packages/lynx-react/**", "packages/lynx-react-headless/**", "docs/examples/lynx/**"]
status: active
related: ["lynx-headless-tree-parity", "iphone-lan-asset-prefix"]
verified_at: "2026-09-28"
---

# Lynx에서 z-index를 가진 slot의 부모는 stacking context로 만든다

## 교훈과 다음 행동

- Lynx는 z-index가 있는 요소를 가장 가까운 stacking context로 올린다. 부모가 stacking context가 아니면 요소가 scroll-view 밖으로 올라가, 스크롤해도 제자리에 남고 조상의 overflow에 잘리지 않는다. 음수 z-index인 배경은 보이지 않을 수 있다. [Lynx z-index 문서](https://lynxjs.org/api/css/properties/z-index.md)도 스크롤을 따라가게 하려면 조상에 `z-index: 0`을 두라고 안내한다.
- recipe에서 slot에 z-index를 주면 root를 `zIndex: 0`으로 둔다(DES-2613 이후의 `app-bar` recipe). root의 z-index를 CSS 변수로 두려면, 그 변수가 Lynx에서 실제로 정의되는지 먼저 확인한다. 정의되지 않은 변수는 stacking context를 만들지 않는다.
- 제보가 오면 먼저 기기에서 재현한다. scroll-view가 있는 예제 Card를 열고 `agent-lynx scroll` 전후를 `take-screenshot`으로 비교한다. jsdom은 이 합성 동작을 재현하지 않는다. className과 inline style을 비교하는 parity도 차이를 보여주지 않는다.
- 스타일 가설은 inline style만 바꾼 임시 예제로 A/B 비교한다. `agent-lynx` 0.14.2의 PlayLynx CDP는 `DOM.setAttributeValue`를 지원하지 않는다(`Not implemented`). 한 카드에만 `style={{ zIndex: 0 }}`을 준 `docs/examples/lynx/<component>/zz-probe-*.tsx`를 만들고, 소유한 session에서 `Page.reload`의 `url`로 바꿔 연다. 비교가 끝나면 probe 파일을 삭제한다.

## 발생 근거와 적용 조건

- DES-2613: Lynx AppBar recipe의 root는 `z-index: var(--z-index-app-bar)`였다. 이 변수는 웹 AppScreen이 정의하는 값이라 Lynx에는 없다. 좌우 slot은 `z-index: 1`, 배경은 `z-index: -1`이었다.
- iOS PlayLynx `lynx/app-bar/platform-layouts`에서 스크롤하면 두 theme 모두 좌우 버튼이 제자리에 남았고, 카드 밖에서도 보였다. `tone="layer"` 흰 배경도 보이지 않았다.
- root에만 `zIndex: 0`을 준 임시 예제에서는 버튼과 배경이 함께 스크롤됐다. recipe를 수정한 뒤 실제 예제에서도 같은 결과를 확인했다. lynx-spa 카탈로그 상단 AppBar도 이때부터 `tone="layer"` 배경이 보였다.
- 같은 변경의 native tree parity는 수정 전후가 같았다. z-index는 recipe CSS에 있고 element tree에는 드러나지 않기 때문이다.
- `chip-tabs`·`tabs`·`bottom-sheet-handle` recipe에도 `zIndex: 1` slot이 있다. 이 slot들은 아직 기기에서 확인하지 않았다.

## 변경 이력

- 2026-09-28: DES-2613 AppBar 스크롤 제보를 조사하면서 기록했다. 기기 A/B 비교와 수정 후 예제로 확인했다.
