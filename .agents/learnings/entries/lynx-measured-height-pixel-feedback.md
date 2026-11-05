---
id: lynx-measured-height-pixel-feedback
description: Lynx 컴포넌트가 안쪽 view의 `bindlayoutchange` 높이를 바깥 view의 `height` style로 되돌려 넣을 때(Collapsible·Accordion 열림 높이 등), Android에서 열 때 심하게 버벅이고 "CallLepusMethod called too frequently"(`rLynxChange`)가 뜨거나 logcat의 layoutchange `height`가 1 기기 픽셀 차이의 두 값을 오갈 때 읽는다. 측정값이 이미 기기 픽셀에 맞춰져 있어 좌표 반올림으로 끊을 수 없는 조건과, 1 기기 픽셀 이내 축소를 무시하는 대응·logcat 판정 방법을 다룬다. 측정 크기로 floating 레이어 좌표를 계산하는 경우는 `lynx-floating-subpixel-size-loop`을 읽는다.
scope: ["packages/lynx-react-headless/collapsible/**", "packages/lynx-react-headless/accordion/**", "packages/lynx-react/src/components/**"]
status: active
related: ["lynx-floating-subpixel-size-loop", "lynx-js-call-frequency-warning"]
verified_at: "2026-10-14"
---

# 측정 높이를 style로 되돌릴 때는 1 기기 픽셀 축소를 무시한다

## 교훈과 다음 행동

- Android는 요소의 위·아래 가장자리를 기기 픽셀로 반올림한다. 같은 내용도 `top`의 소수 부분에 따라 높이가 1 기기 픽셀(`1 / SystemInfo.pixelRatio`) 다르게 측정된다.
- 측정 높이를 바깥 `height`로 넣으면 바깥 높이가 바뀌고, 세로 가운데 정렬 같은 부모 배치에서 안쪽 `top`이 움직인다. 그러면 반올림이 뒤집혀 다시 다른 높이가 측정된다. `height` transition이 있으면 매 변경이 transition을 다시 시작해 열림이 수 초 동안 끌린다.
- 측정값이 이미 기기 픽셀에 맞춰진 두 값이므로 `lynx-floating-subpixel-size-loop`처럼 좌표를 반올림해 끊을 수 없다 → 커지는 측정은 그대로 받고, 1 기기 픽셀 이내로 줄어든 측정만 버려 큰 값을 유지한다(float32 측정 오차용 `1e-3` 여유 포함). 진짜 1px 축소를 놓쳐도 빈 공간 1 기기 픽셀만 남고 내용이 잘리지 않는다.
- 판정: logcat에서 `SendFileByAgent: type: PageCustomEvent`의 layoutchange `height`·`top`과 `CallLepusMethod: rLynxChange` 줄 수를 탭 전후 5초씩 센다. `height`가 두 값을 번갈아 나오면서 `rLynxChange`가 수백 회 이상이면 이 교훈에 해당한다. 수정 뒤에도 transition 중 layoutchange 값은 번갈아 올 수 있다. state가 바뀌지 않아 commit이 늘지 않으면 정상이다.
- 단위 테스트: ReactLynx testing environment는 thread별 global에 `SystemInfo.pixelRatio: 3`을 넣는다. `vi.stubGlobal`은 background thread의 값을 바꾸지 않으므로 3을 기준으로 측정값(`558 / 3` 등)을 만든다.

## 발생 근거와 적용 조건

- 상황: `@seed-design/lynx-react-collapsible`의 `useCollapsible`이 `contentInner`의 `bindlayoutchange` 높이를 `contentProps.style.height`로 반환한다. styled `AccordionContent`는 recipe의 `height` transition을 함께 쓴다.
- 확인 환경: Galaxy A24(SM-A245N, Android 15, 450dpi, pixelRatio 2.8125), Lynx Go, docs production bundle의 `lynx/accordion/custom-content`(세로 가운데 정렬 예제). 첫 항목 "배송 안내"를 `adb shell input tap`으로 열었다.
  - 수정 전: 5초 동안 `rLynxChange` 2575회, `OnPipelineStart` 1286회, 경고 toast 발생. layoutchange `height`가 185.956과 185.600(523·522 기기 픽셀)을 오갔고 `top`이 412에서 327까지 5초에 걸쳐 내려갔다.
  - 수정 후: 같은 조작에서 `rLynxChange` 35회, 경고 없음, 열림이 약 0.3초에 끝났다. 닫기·다시 열기·두 번째 항목 열기도 경고가 없었다.
- iOS와 다른 Android 기기에서는 확인하지 않았다.

## 변경 이력

- 2026-10-14: Accordion 열림 버벅임·`CallLepusMethod` 경고 조사에서 원인과 수정을 기록했다.
- 2026-10-22: Lynx 1.0 dev 병합 후 브랜치 전제·낡은 참조를 정리했다. 실행 재검증은 하지 않았다. `major` 브랜치 시기를 전제한 dev 비교 문장을 지웠다.
