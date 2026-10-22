---
id: lynx-floating-subpixel-size-loop
description: Lynx floating 레이어(Popover·HelpBubble 등)가 측정한 콘텐츠 크기로 좌표를 계산할 때, Android에서 "CallLepusMethod called too frequently" toast가 뜨거나 페이지 내용이 사라지고 시간이 지나면 입력이 멈추거나, logcat에 `OnPatchFinishForFiber NoPatch!`와 `OnPipelineStart`가 매 프레임 반복될 때 읽는다. 좌표의 소수 부분이 기기 픽셀 반올림으로 콘텐츠 높이를 바꾸는 피드백 루프를 구분하는 계측 방법과 좌표를 기기 픽셀에 맞추는 대응을 다룬다. ref callback에서 setState를 호출해 생기는 렌더 반복에는 `lynx-ref-callback-state-loop`을, 측정 높이를 바깥 `height` style로 되돌리는 Collapsible·Accordion에는 `lynx-measured-height-pixel-feedback`을 읽는다.
scope: ["packages/lynx-react-headless/popover/**", "packages/lynx-react-headless/floating/**", "packages/lynx-react/src/components/**"]
status: active
related: ["lynx-ref-callback-state-loop", "lynx-device-cdp-geometry", "lynx-measured-height-pixel-feedback"]
verified_at: "2026-10-13"
---

# 측정 크기로 계산한 레이어 좌표는 기기 픽셀에 맞춘다

## 교훈과 다음 행동

- 측정한 높이·너비로 레이어의 `left`·`top`을 다시 계산한다면, style에 넣기 전에 `SystemInfo.pixelRatio`로 기기 픽셀에 맞춘다(`Math.round(value * pixelRatio) / pixelRatio`). Android는 요소 가장자리를 픽셀 단위로 반올림해, 같은 콘텐츠도 `top`의 소수 부분에 따라 높이가 1px 달라진다.
- 같은 원인은 좌우 배치(`left`·`right` placement)처럼 높이의 절반으로 `top`을 정하는 경우에 드러난다. 높이가 바뀌면 `top`의 소수 부분이 바뀌고, 그 `top`이 다시 높이를 바꿔 두 값 사이를 매 프레임 오간다.
- 크기 비교에 허용 오차를 두는 방식보다 좌표를 기기 픽셀에 맞추는 쪽을 먼저 쓴다. 허용 오차는 pixelRatio 1에서 정상적인 1px 변화와 구분되지 않는다.
- 이 반복을 의심하면 다음 순서로 확인한다.
  - logcat의 `OnPipelineStart`·`NoPatch!` 초당 횟수를 센다. `InvokeUIMethod … boundingClientRect`의 반복은 열린 레이어의 RAF 위치 추적이라 정상이다. selector `identifier`가 빈 값인 호출은 `selectRoot()` 측정이다.
  - 측정 함수에서 `[DEBUG-…]` 태그로 측정 rect와 계산 결과를 남긴다. `height`가 두 값 사이를 번갈아 바뀌면 이 교훈에 해당한다.
- Android 실행 결과를 비교할 때는 측정마다 PlayLynx를 `am force-stop` 뒤 deep link로 다시 연다. 이전 Card의 fixed 레이어와 측정 루프가 남아 다음 측정에 섞인다. 같은 bundle URL은 캐시되므로 query에 시각 값을 붙인다.

## 발생 근거와 적용 조건

- 상황: `@seed-design/lynx-react-popover`의 `PopoverContent`는 `bindlayoutchange` 크기를 `intrinsicSize`에 반영하고, RAF마다 `computePosition`으로 위치를 다시 계산한다. 같은 피드백은 headless 분리 전 `HelpBubble`(`fa699aa11`, dev의 `@seed-design/lynx-react` 0.10.0)에도 있었다.
- 확인 환경: PlayLynx 0.4.6, Android API 36 에뮬레이터(1080×2400, 420dpi, pixelRatio 2.625), 배포 `00d25d57`과 로컬 development bundle.
  - 수정 전: `lynx/help-bubble/close-on-interact-outside`의 콘텐츠 높이가 매 프레임 38.095(100px)와 37.714(99px)를 오갔다. 그에 따라 `top`도 451.99와 452.19를 오갔다. 초당 pipeline 200회 안팎, `NoPatch!` 160회 안팎이 발생했고 화면에 "CallLepusMethod called too frequently" toast가 떴다. 같은 반복이 `anchor`·`close-button`·`line-breaks`·`portalled`·`width` 예제에도 있었다.
  - 수정 후(`4b07f90ac`, `fix(lynx-react-popover): snap layer offsets to device pixels`): `PopoverPositioner`의 `left`·`top`을 기기 픽셀에 맞추자 높이가 38.095로 고정됐다. HelpBubble 예제 13개 모두 pipeline이 0이었다. 30초 대기 뒤에도 0이었고, 바깥 탭 닫기와 트리거로 다시 열기도 동작했다.
- iOS와 Android 실기기에서는 이번 수정을 확인하지 않았다. 수정 전 배포본에서도 iOS 시뮬레이터(iOS 26.5)는 같은 예제의 트리거와 말풍선을 표시했지만, iOS의 반복 여부는 계측하지 않았다.

## 변경 이력

- 2026-10-13: HelpBubble Android 빈 화면·입력 멈춤 조사에서 확인한 원인과 수정을 기록했다.
- 2026-10-22: Lynx 1.0 dev 병합 후 브랜치 전제·낡은 참조를 정리했다. 실행 재검증은 하지 않았다. 도달할 수 없는 rebase 전 SHA `34bc10934`를 dev의 `4b07f90ac`로 바꿨다.
