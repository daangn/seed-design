---
id: lynx-android-parent-clip-path
description: Lynx Recipe·styled 컴포넌트에서 부모 view의 `clip-path`로 transform(정적 rotate 또는 `Element.animate`·CSS animation)이 걸린 자식을 잘라 내는 구조를 만들거나, iOS에서는 맞는데 Android에서만 도형이 잘리지 않고 크게 보인다는 제보를 조사할 때 읽는다. Android 에뮬레이터 A/B probe로 확인한 실패 조건과 폭 50% `overflow` 박스로 바꾸는 대안을 다룬다. 요소 자신에게 건 `clip-path`나 iOS 결과에는 적용하지 않는다.
scope: ["packages/lynx-css/**", "packages/lynx-qvism-preset/**", "packages/lynx-react/**"]
status: active
related: ["lynx-view-default-overflow-clip", "lynx-z-index-stacking-context"]
verified_at: "2026-10-22"
---

# Android에서 부모 clip-path는 transform이 걸린 자식을 자르지 않을 수 있다

## 교훈과 다음 행동

- 자식을 회전시키고 부모의 `clip-path: inset(...)`로 잘라 내는 구조는 Android에서 쓰지 않는다. 부모 영역을 실제 크기의 박스(예: 폭 50%, `overflow: hidden`)로 만들고, 자식은 음수 `left`로 원래 좌표에 둔다. Lynx view는 기본적으로 자기 경계에서 자식을 자르므로 이 방식은 두 플랫폼에서 같게 보인다.
- 요소 자신에게 건 `clip-path`(자식 없는 반원 등)는 Android에서도 적용됐다. 의심되면 부모 clip과 자기 clip을 분리한 probe로 확인한다.
- 회전하는 두 조각을 경계에서 맞붙이면 antialias된 가장자리로 바탕이 실선처럼 비친다. 경계가 반 픽셀에 놓이는 크기(size 40, 2.625x에서 105px)에서 두드러진다. 조각을 겹쳐 그리고, 그릴 영역이 없는 조각은 `opacity: 0`으로 숨긴다.
- 확인은 jsdom이나 iOS로 대신하지 않는다. `docs/examples/lynx/<component>/zz-probe-*.tsx`에 기존 구조와 대안을 정적 rotate·animation으로 나란히 두고 Android에서 screenshot으로 비교한 뒤 probe를 지운다.

## 발생 근거와 적용 조건

- seed 1.0.0의 indeterminate `ProgressCircle`(e056828c1 이후)은 `clip-path: inset(0 0 0 50%)`인 100% 크기 wrapper 안에서 반원을 회전시켰다. Android(Karrot Alpha Debug, Android 17 에뮬레이터)에서 원호가 항상 180° 이상으로 그려지고 둥근 cap이 원호 안에 묻혔다. iOS는 정상이었다.
- probe에서 같은 wrapper 구조는 정적 `rotate(90deg)`에서도 반원 전체가 보였고, 폭 50% `overflow: hidden` 박스 구조는 정확히 90° 부채꼴을 그렸다. 수정 뒤 Android·iOS PlayLynx에서 원호가 짧아지고 cap이 보였다.
- 같은 컴포넌트의 root는 `clip-path: path(...)`·`overflow: hidden`·`border-radius`를 함께 가지며 회전하는 자식을 링 모양으로 잘 잘랐다. 어떤 속성 조합에서 부모 clip이 빠지는지는 engine 원천(`UIGroup.beforeDraw`의 `canvas.clipPath`)만으로 확정하지 못했다 → 부모 clip-path에 의존하는 새 구조는 Android에서 직접 확인한다.

## 변경 이력

- 2026-10-22: 경계 실선을 녹화 프레임의 링 중심선 밝기로 세어 확인했다. 반원을 겹치고 빈 반원을 숨긴 뒤 Android 720프레임에서 0개였고, iOS PlayLynx에서도 보이지 않았다.
- 2026-10-21: Android ProgressCircle cap 미표시 제보를 조사하며 에뮬레이터 A/B probe와 수정 전후 녹화로 확인해 기록했다.
