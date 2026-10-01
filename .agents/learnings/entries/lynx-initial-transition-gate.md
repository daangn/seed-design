---
id: lynx-initial-transition-gate
description: Lynx styled 컴포넌트가 Item 등록·측정처럼 첫 렌더 뒤 effect에서 정해지는 값으로 Indicator 등의 위치·opacity를 정하고, 첫 진입 때 그 값이 transition으로 서서히 나타나거나 미끄러질 때 읽는다. `transitionEnabled` 같은 variant로 transition을 끄는 시점을 정하는 기준과, 값 변경과 같은 업데이트에서 transition을 켜면 Lynx 기기에서 여전히 애니메이션되는 근거, 녹화 프레임으로 판정하는 방법을 다룬다. 사용자 입력으로 시작하는 전환이나 웹 Recipe에는 적용하지 않는다.
scope: ["packages/lynx-qvism-preset/**", "packages/lynx-css/**", "packages/lynx-react/**", "packages/lynx-react-headless/**"]
status: active
related: ["lynx-transition-animatable-properties", "lynx-device-cdp-geometry"]
verified_at: "2026-10-01"
---

# 첫 진입 transition은 값이 확정된 다음 업데이트에서 켠다

## 교훈과 다음 행동

- Background effect에서 등록·측정한 값으로 위치·opacity를 정하는 요소는 첫 화면에 기본값으로 그려진 뒤 다음 업데이트에서 실제 값으로 바뀐다. transition이 켜져 있으면 이 변화가 첫 진입 애니메이션으로 보인다.
- Recipe에 transition을 끄는 variant(예: `transitionEnabled: { false: { indicator: { transitionDuration: "0s" } } }`)를 두고, 값이 확정된 업데이트에서는 끈 채로 둔다. transition은 그 다음 업데이트에서 켠다. 예: `useState(false)`와 `useEffect(() => setTransitionEnabled(registered), [registered])`, class에는 `transitionEnabled && registered`를 넘긴다.
- 값이 바뀌는 업데이트에서 variant를 함께 `true`로 바꾸면 Lynx 기기에서 여전히 애니메이션된다. 같은 업데이트에서 켜는 방식을 해결책으로 쓰지 않는다.
- jsdom 테스트는 `render`가 effect까지 flush하므로 첫 프레임을 보여 주지 않는다. `xcrun simctl io booted recordVideo --codec h264 <file>.mov`로 진입을 녹화하고, 컨트롤이 처음 보이는 encoded frame부터 대상 ROI(예: Indicator 내부 20×12px) 픽셀값을 읽는다. H.264 압축·색 변환 잡음과 구분하려고 값이 바뀌지 않아야 하는 대조 ROI(예: 비선택 Item 내부)를 같은 프레임에서 함께 읽는다. 대조 ROI 변동 폭을 넘는 중간값이 여러 프레임에 걸쳐 한 방향으로 이어지면 전환으로, 그 폭 안의 차이는 잡음으로 판정한다. 사용자 입력 전환이 남아 있는지도 같은 방식으로 확인한다.

## 발생 근거와 적용 조건

- 상황(DES-2640): Lynx SegmentedControl Indicator는 Item이 effect에서 등록되기 전 `hasSelection: false`(opacity 0)로 그려지고, 등록 뒤 opacity 1이 되며 `transition-property: transform, opacity`로 약 100–170ms 동안 fade-in했다. 수정 전 녹화 3회에서 Indicator ROI는 RGB 243→245→248→250→252→253→254로 이어졌고, 같은 프레임의 대조 ROI(비선택 New 내부)는 내내 RGB 243이었다. React는 첫 렌더에 전환이 없다. 이 동작은 Headless 분리 전 구현에도 같은 구조로 있었다.
- 1차 수정: Indicator class에 `transitionEnabled: segmentCount > 0`을 넘겨 등록과 같은 업데이트에서 켰다. iOS 시뮬레이터 PlayLynx(iOS 26.5, SDK 1.4.0) 녹화에서 3/3회 Indicator ROI가 RGB 243→245→246→248→250→252→253→254로 100–127ms에 걸쳐 바뀌어 실패했다.
- 2차 수정: 위의 다음 업데이트 방식으로 바꾸자 3/3회 컨트롤 첫 프레임부터 Indicator가 RGB 255였고 중간값이 없었다. New 탭 때 translate 중간 프레임(x 474→497.5→617.5→702.5→731.5)도 유지됐다.
- 참고: Lynx Tabs는 `areTabsTransitionsEnabled`가 측정 완료와 같은 업데이트에서 `transitionEnabled`를 켠다. 같은 첫 진입 애니메이션이 있는지는 확인하지 않았다.

## 변경 이력

- 2026-10-01: DES-2640 SegmentedControl 첫 진입 fade 수정에서 기록했다.
- 2026-10-01: PR 리뷰를 반영해 녹화 판정에 대조 ROI로 압축 잡음을 구분하는 기준과 근거를 추가했다.
