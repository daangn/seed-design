---
id: lynx-android-hscroll-transform-rect
description: Android에서 floating 레이어(HelpBubble·Popover·Menu·Select)가 가로 `scroll-view` 안의 기준 요소를 따라가지 않거나, `getRectByRef`(`@lynx-js/lynx-ui-common`)·`boundingClientRect`의 x 좌표가 가로 스크롤 뒤에도 바뀌지 않을 때 읽는다. `androidEnableTransformProps: true` 경로가 가로 스크롤 오프셋을 빼지 않는 원인, 같은 노드를 옵션 유무로 비교하는 판별 방법, 세로 스크롤과 iOS에서는 재현되지 않는 적용 범위를 다룬다.
scope: ["packages/lynx-react-headless/**", "packages/lynx-react/**"]
status: active
related: ["lynx-floating-subpixel-size-loop", "lynx-device-cdp-geometry"]
verified_at: "2026-10-13"
---

# Android 가로 scroll-view 안의 rect는 transform 옵션에서 스크롤을 놓친다

## 교훈과 다음 행동

- Android에서 `boundingClientRect`에 `androidEnableTransformProps: true`를 주면, 가로 `scroll-view` 안의 노드 x 좌표에 스크롤 오프셋이 반영되지 않는다. `@lynx-js/lynx-ui-common`의 `getRectByRef`는 이 옵션을 항상 켜므로, 이를 쓰는 floating 레이어는 가로 스크롤 뒤에도 이전 위치에 남는다. 측정값이 그대로라 re-render(`OnPipelineStart`)가 일어나지 않는다.
- 판별: 같은 노드를 background에서 `lynx.createSelectorQuery().select('[react-ref-<id>-0]')`로 두 번 측정한다. `params: { relativeTo: "screen" }`와 `{ relativeTo: "screen", androidEnableTransformProps: true }`의 `left`가 다르면 이 문제다. `react-ref` id는 logcat `InvokeUIMethod with root` 줄의 `identifier`에서 찾는다. `agent-lynx evaluate`는 Promise를 기다리지 않는다. 그래서 callback에서 `globalThis`에 결과를 저장한 뒤 두 번째 evaluate로 읽는다. 식은 `(function(){ … })()`로 감싸야 `SyntaxError`가 나지 않는다.
- 수정 방향을 정할 때는 transform이 필요한 요소(눌림 scale 중인 콘텐츠 등)와 스크롤 컨테이너 안의 기준 요소를 구분한다. 옵션을 일괄로 끄면 transform 중인 요소의 크기가 달라진다(`lynx-device-cdp-geometry`).

## 발생 근거와 적용 조건

- Android API 36 에뮬레이터 PlayLynx, lynx-spa dev bundle, `lynx/help-bubble/placement`(가로 `scroll-view`, 말풍선 12개)에서 확인했다. `adb shell input swipe`로 가로 스크롤한 뒤 기준 요소의 left 값을 비교했다. 일반 측정은 168 → -98로 바뀌었고, transform 옵션 측정은 168 그대로였다. Popover에 임시 log를 넣어 보니 `getRectByRef` 결과도 168로 고정됐다. 수정 전 배포 bundle(`602685a9`)에서도 말풍선이 따라오지 않았다.
- 세로 `scroll-view`(lynx-spa 홈 목록)는 두 측정이 모두 207 → -120으로 같았다. iOS 26.5 시뮬레이터에서는 같은 예제의 말풍선이 가로 스크롤을 따라갔다.
- Lynx 원천(`8688964`): `LynxBaseUI.getPositionInfo(true)`는 `LynxUIHelper.convertRectFromUIToRootUI`를 쓴다. 이 함수는 flatten UI의 경우 draw parent view의 `getScrollX()`만 뺀다. 가로 모드 `AndroidScrollView`의 실제 가로 스크롤은 안쪽 `CustomHorizontalScrollView`에 있다(`getRealScrollX()`). PlayLynx SDK가 이 revision과 같은지는 확인하지 않았다.

## 변경 이력

- 2026-10-13: C8 후속 조사(HelpBubble 추적 멈춤)에서 기록했다.
