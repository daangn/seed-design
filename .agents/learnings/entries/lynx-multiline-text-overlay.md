---
id: lynx-multiline-text-overlay
description: Lynx Recipe·예제에서 `\n`으로 나눈 여러 줄 text가 한 줄만 보이고 잘리거나, 고정 높이 부모 안 `position: absolute` 말풍선(Value Indicator·tooltip 등)의 label이 첫 줄만 표시되거나, 예제가 `ReferenceError: Intl is not defined`로 "예제를 불러오지 못했습니다."를 띄울 때 읽는다. `white-space: nowrap`, absolute 요소의 남은 높이 제약, Lynx JS 런타임의 `Intl` 부재를 PlayLynx 기기에서 구분하는 방법과 수정 기준을 다룬다. 단일 줄 text의 말줄임(`text-maxline`)이나 웹 Recipe에는 적용하지 않는다.
scope: ["packages/lynx-qvism-preset/**", "packages/lynx-css/**", "packages/lynx-react/**", "docs/examples/lynx/**"]
status: active
related: ["lynx-device-cdp-geometry", "lynx-example-display-flex"]
verified_at: "2026-10-01"
---

# Lynx 여러 줄 text는 nowrap·absolute 남은 높이·Intl 부재를 먼저 확인한다

## 교훈과 다음 행동

- `\n`으로 줄을 나누는 text에는 `white-space: nowrap`을 두지 않는다. Lynx에서 nowrap text는 `\n` 뒤 줄을 그리지 않고 첫 줄만 남긴다. 한 줄 유지가 목적이면 부모를 `width: max-content`로 두어 줄바꿈 폭 제약을 없앤다.
- 고정 높이 부모(예: Slider `Control`) 안의 `position: absolute` 요소는 text 줄 수를 "부모 높이 - top"처럼 남은 높이 안에서 정한다. 넘치는 줄은 잘린다. 내용 높이로 커져야 하는 absolute 말풍선에는 `height: max-content`를 준다. `transform`·`bottom` 고정으로 위치만 바꿔서는 해결되지 않는다.
- 원인을 좁힐 때는 `docs/examples/lynx/<component>/`에 임시 예제를 두고 같은 Recipe class와 inline style 변형(top 위치, `height: max-content`, nowrap 유무)을 나란히 렌더해 screenshot으로 비교한다. 판정 뒤 삭제한다.
- Lynx JS 런타임(main thread·background 모두)에는 `Intl`이 없다. module 최상위에서 `new Intl.NumberFormat(...)`을 만들면 예제 전체가 로드되지 않는다. 문서 예제는 `String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")`처럼 직접 서식을 만들고, 오류는 `agent-lynx get-console`의 `ReferenceError: Intl is not defined`로 확인한다.

## 발생 근거와 적용 조건

- DES-2629에서 iOS PlayLynx(`com.karrot.playlynx`, iOS 26.6, SDK 1.4.0)의 `examples/lynx-spa` dev bundle로 확인했다.
  - `lynx/slider/custom-value-indicator-label`은 `Intl.NumberFormat` 때문에 "예제를 불러오지 못했습니다."를 표시했고, console에 main-thread·background 모두 `ReferenceError: Intl is not defined`가 남았다.
  - `Intl`을 제거한 뒤 Value Indicator가 `"thumb 1\n500,000"` 중 `thumb 1`만 표시했다. label의 computed style은 `white-space: nowrap`, 높이 18px(한 줄)였다.
  - nowrap을 지워도 Slider 안에서는 한 줄이었다. 높이 26px 부모 안에서 같은 말풍선 class를 top 50%(남은 13px)·top 10px(남은 80px)·`height: max-content`로 렌더하자, 남은 높이가 작은 경우만 한 줄로 잘렸고 `height: max-content`는 두 줄을 표시했다. `translate(-50%, 0)`·`scale`·`bottom` 고정은 남은 높이가 작으면 모두 한 줄이었다.
  - Recipe `valueIndicatorMotion`에 `height: max-content`를 추가하고 label의 nowrap을 지운 뒤 두 줄이 표시됐다. 한 줄 label 예제(`lynx/slider/value-changes`)의 drag 중 screenshot은 수정 전과 byte 단위로 같았다.
- Android와 다른 SDK 버전에서는 확인하지 않았다.

## 변경 이력

- 2026-10-01: DES-2629 Slider 예제 렌더링 실패 조사에서 기록했다.
