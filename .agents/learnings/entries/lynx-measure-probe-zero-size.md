---
id: lynx-measure-probe-zero-size
description: Lynx에서 `env(safe-area-inset-*)`처럼 JS 숫자로 읽을 수 없는 CSS 값을 보이지 않는 측정용 view(probe)의 layout으로 바꿔 읽거나, floating 레이어·페이지 위에 투명한 `position: fixed`·`absolute` view를 깔 때 읽는다. 크기가 있는 투명 view가 iOS에서 아래 `scroll-view`의 native 스크롤을 막은 사례, `user-interaction-enabled={false}`로 풀리지 않는 이유, 0×0 모서리 probe로 바꾸는 기준과 iOS 시뮬레이터에서 실제 pan으로 확인하는 방법을 다룬다. 탭을 받아야 하는 backdrop이나 의도적인 터치 차단 레이어에는 적용하지 않는다.
scope: ["packages/lynx-react-headless/**", "packages/lynx-react/**"]
status: active
related: ["lynx-drag-gesture-cdp", "iphone-lan-asset-prefix"]
verified_at: "2026-10-13"
---

# 측정용 probe view는 0×0으로 만든다

## 교훈과 다음 행동

- CSS 값만 있는 길이(예: `useSafeArea()`가 host 값이 없을 때 돌려주는 `env(safe-area-inset-bottom)`)를 JS 숫자로 쓰려면 그 값으로 위치를 정한 view를 두고 `boundingClientRect`로 측정한다. 이때 probe는 크기 0인 view로 만든다. 사각형 경계가 필요하면 왼쪽 위(`top`·`left`)와 오른쪽 아래(`right`·`bottom`)에 0×0 view를 하나씩 둔다.
- 화면을 덮는 투명 view(`top`·`right`·`bottom`·`left`를 지정한 fixed view)는 iOS에서 아래 `scroll-view`의 native pan을 막는다. `user-interaction-enabled={false}`는 Lynx touch 이벤트만 끄고 platform 제스처에는 영향이 없다(`@lynx-js/types` 문서). 그래서 이 문제는 해결되지 않는다.
- 비모달 레이어(HelpBubble처럼 아래 화면을 계속 조작하는 레이어)에 probe를 추가하면 iOS 시뮬레이터에서 실제 pan으로 아래 스크롤을 확인한다. `agent-device open <app> --udid <sim> --session <name>` 다음 `agent-device gesture pan <x> <y> <dx> <dy> <ms> --session <name>`을 쓴다. 같은 화면에서 `agent-device swipe`는 변경 전 bundle도 스크롤하지 못해 판정에 쓰지 않는다. `agent-device close`는 PlayLynx 앱 자체를 닫아 다른 작업의 Card까지 사라지므로 실행하지 않는다.

## 발생 근거와 적용 조건

- C8(Select 목록의 하단 안전 영역 침범) 수정에서 `@seed-design/lynx-react-floating`에 안전 영역 probe를 두고 Select·Menu·Popover의 위치 계산 경계로 썼다. 첫 구현은 inset 위치에 맞춘 크기 있는 view 하나였고, Popover view 모드에서는 페이지 안의 `position: fixed` view였다.
- iOS 26.5 시뮬레이터 PlayLynx(SDK 1.4.0)의 `lynx/help-bubble/placement`(가로 `scroll-view`, 말풍선 12개 열림)에서 `gesture pan 300 400 -200 0 600`을 실행했다.
  - 변경 전 배포 bundle(`602685a9`): 스크롤됐다.
  - 크기 있는 probe를 둔 lynx-spa dev bundle: 스크롤되지 않았다.
  - 0×0 모서리 probe 두 개로 바꾼 bundle: 스크롤됐다.
- Android 에뮬레이터(API 36)에서는 0×0 probe 상태에서 `adb shell input swipe`로 같은 화면이 스크롤됐다. 크기 있는 probe는 Android에서 확인하지 않았다.
- 같은 iOS 기기에서 `lynx.__globalProps`는 `safeAreaInsetTop` 62, `safeAreaInsetBottom` 34였다. Android 에뮬레이터(1080×2400, pixelRatio 2.625, 제스처 내비게이션)에서는 51.81, 24였다.

## 변경 이력

- 2026-10-13: C8 Select 안전 영역 수정의 기기 검증에서 기록했다.
