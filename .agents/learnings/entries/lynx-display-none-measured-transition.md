---
id: lynx-display-none-measured-transition
description: "Lynx 컴포넌트가 `bindlayoutchange`로 잰 크기를 transition 걸린 style(위치·width·height·CSS 변수)로 넘기는데, 조상에 `display: none`을 걸었다 풀면 Indicator가 왼쪽 끝에서 미끄러지거나 펼친 영역·label이 0에서 커질 때 읽는다. 숨김 동안 측정값이 0으로 보고되는 근거, 재현된 컴포넌트(Tabs·Accordion·FloatingActionButton)와 대조군(SegmentedControl·언마운트), 시뮬레이터 녹화로 판정하는 절차를 다룬다. 첫 마운트의 transition 게이트는 lynx-initial-transition-gate를 본다."
scope: ["packages/lynx-react-headless/**", "packages/lynx-react/**", "packages/lynx-qvism-preset/**"]
status: active
related: ["lynx-initial-transition-gate", "karrot-alpha-simulator-lynx-host", "lynx-display-none-overflow"]
verified_at: "2026-11-06"
---

# 조상 display: none은 측정값을 0으로 만들고, 다시 보일 때 0에서 transition된다

## 교훈과 다음 행동

- Lynx에서 조상이 `display: none`이 되면 자손의 `bindlayoutchange`가 크기 0을 보고한다. 측정값을 그대로 state로 쓰는 컴포넌트는 숨김 동안 style이 0이 되고, 다시 보일 때 0에서 실제 값으로 transition된다.
- 측정값을 transition 걸린 속성으로 넘기는 Lynx 컴포넌트를 고칠 때는 첫 마운트 게이트(`transitionsEnabled` 등)만으로 충분하다고 보지 않는다. 게이트는 측정이 한 번 끝나면 계속 켜져 있어서, 숨김 뒤 복구는 막지 못한다 → 0 측정을 "미측정"으로 취급하거나 0일 때 transition을 끄는 처리를 컴포넌트별로 검토한다.
- Lynx는 `display: none`인 요소에도 transition을 적용한다. 웹처럼 측정 전 요소를 `display: none`으로 숨기기만 하면, 숨긴 동안 바뀐 값에서 다시 보일 때 transition이 이어진다 → 숨김과 함께 0 측정 동안 transition 게이트를 끄고, 측정값이 돌아오는 업데이트는 첫 마운트처럼 transition 없이 반영한다. 0을 무시하고 마지막 측정값을 유지하는 방식은 숨김 없이도 막힌다.
- 측정 없이 CSS 변수(index·count)로 배치하는 컴포넌트는 영향이 없다(SegmentedControl). 조건부 렌더(언마운트)로 숨기면 재마운트가 첫 마운트 게이트를 다시 타므로 재현되지 않는다.
- 판정: 숨긴 상태에서 `DOM.getDocument`로 대상 node의 inline `style`이 0인지 보고, 다시 보이는 순간을 `simctl io recordVideo --display=<id>`로 녹화해 passthrough frame을 비교한다. Lynx 요소의 `bindtransitionstart`·`bindtransitionend`는 조상 view에 걸어도 이벤트가 오지 않았다 → 이벤트 로그로 판정하지 않는다.

## 발생 근거와 적용 조건

- DES-2847(React Tabs 같은 증상) 조사, 2026-11-06: iOS 27.2 시뮬레이터 iPhone Duo, 당근 DEV(client sdkVersion 1.4.0), dev 271b768b1의 `examples/lynx-spa` dev bundle.
- 임시 예제에서 Tabs(선택 라벨3)·SegmentedControl·Accordion(item-1 펼침)·FloatingActionButton(extended)을 감싼 view의 `display`를 `none`으로 바꾸자 inline style이 다음처럼 바뀌었다.
  - Tabs indicator: `width:144.67px; translateX(289.33px)` → `width:0px; translateX(0px)`
  - Accordion content: `height:51.33px` → `height:0px`
  - FAB root: `--fab-label-width:80px` → `0px`
  - SegmentedControl indicator: inline style 없음(변화 없음)
  - Slider(값 70): range·thumb의 % 변수는 그대로였고, 드래그 중에만 보이는 `--slider-value-indicator-offset`만 -4px → 0px로 바뀌었다가 복구 뒤 -4px로 돌아왔다. 복구 녹화는 3 frame(3ms 안)으로 변화가 없었다. 복구 직후 드래그는 확인하지 않았다.
- 다시 보이자 녹화 frame(약 2.68–3.0s, 60fps 안팎)에서 Tabs indicator는 라벨1 아래 폭 0에서 라벨3까지 커지며 이동했고, Accordion 본문은 0에서 펼쳐졌고, FAB label은 "+ Ex"에서 "+ Extended"로 늘어났다. 같은 예제를 조건부 렌더로 바꾸면 Accordion·FAB는 첫 frame부터 최종 크기였고 Indicator는 이동 없이 최종 위치에 나타났다.
- DES-2849 수정 검증(같은 환경): Tabs indicator에 미측정 동안 `display: none` recipe class만 붙였을 때 복구 녹화가 15 frame(약 240ms)이었고 indicator가 라벨2 근처에서 라벨3으로 이동했다. 첫 마운트 게이트(`areTabsTransitionsEnabled`)가 폭 0도 미측정으로 보게 바꾸자 4 frame(20ms 안)에 최종 위치였고, 복구 뒤 선택 변경 transition은 유지됐다. Collapsible·FAB는 0×0 측정을 무시해 3 frame으로 줄었다.
- Android와 실기기, `visibility: hidden`은 확인하지 않았다.

## 변경 이력

- 2026-11-06: DES-2849 수정 검증에서 `display: none` 요소의 transition 동작과 수정 방식을 추가했다.
- 2026-11-06: DES-2847의 Lynx 유사 사례 조사에서 재현해 기록했다.
