---
id: lynx-active-state-overlays
description: Lynx Recipe·styled 컴포넌트의 눌림 색을 Background `pressed` variant나 눌림 시작 선택 상태 스냅샷(`pressSelectionRef`·`pressStart*`) 대신 `:active` selector로 옮기거나, 선택 상태에 따라 눌림 overlay 색이 달라 놓는 순간 선택이 바뀌면 색이 튀는 문제를 다룰 때 읽는다. 상태별로 색을 고정한 overlay를 두고 trigger의 `:active`와 slot의 상태 variant class로 켜는 방법과 PlayLynx 기기에서 눌림 상태를 캡처하는 방법·한계를 다룬다. 선택 상태와 무관한 단일 눌림 색에는 적용하지 않는다.
scope: ["packages/lynx-qvism-preset/**", "packages/lynx-css/**", "packages/lynx-react/**", "packages/lynx-react-headless/**"]
status: active
related: ["lynx-drag-gesture-cdp", "lynx-headless-tree-parity"]
verified_at: "2026-09-29"
---

# 선택 상태별 눌림 색은 고정 overlay와 `:active` 상태 selector로 표현한다

## 교훈과 다음 행동

- 눌림 overlay의 색이 선택 상태에 따라 다르면 overlay 하나의 색을 상태로 바꾸지 않는다. 놓는 순간 tap이 선택을 바꾸면 fade-out 중인 overlay 색이 바뀐다. Background에서 눌림 시작 상태를 스냅샷해 색을 고정하는 방식은 `pressed` 재렌더가 필요하고, 다음 눌림 시작 때 이전 스냅샷 색이 Main Thread `:active`와 함께 먼저 보인다.
- 대신 상태마다 색을 고정한 overlay slot을 둔다(예: checkmark의 `background`·`selectedBackground`). trigger Recipe의 enabled variant에 `&:active .<slot>--<state>_<value>` selector를 써서 현재 상태에 맞는 overlay만 `opacity: 1`로 켠다. qvism은 모든 slot에 모든 variant class(`--checked_false` 등)를 붙이므로 상태 gate에 쓸 수 있다. 조건이 둘이면 `.slot--checked_false.slot--indeterminate_false`처럼 class를 이어 쓴다.
- 이렇게 바꾸면 Recipe의 `pressed` variant와 compound, styled의 스냅샷 ref·`pressed` 기반 class 계산을 지운다. `pressed`는 List·SelectBox처럼 다른 Recipe가 읽는 경우 context에만 남긴다.
- 기기 검증: 눌림 상태는 `agent-lynx long-press <ref> --duration 3000`을 background로 실행하고 약 1.3초 뒤 `take-screenshot`으로 캡처한다. `lynx-drag-gesture-cdp`의 `mousePressed` 뒤 screenshot도 같은 목적에 쓸 수 있다. `--seed-duration-color-transition`(0.15s)의 놓은 뒤 fade 중간 프레임은 screenshot 명령 지연보다 짧아 잡히지 않는다 → 해당 항목은 미확인으로 보고한다.

## 발생 근거와 적용 조건

- DES-2635에서 Lynx Checkbox의 checkmark `pressed` variant와 ghost overlay 눌림 시작 스냅샷을 제거하고 `background`(선택 전 색)·`selectedBackground`(선택 후 색) overlay를 checkbox root의 `:active` 상태 selector로 켰다.
- iOS PlayLynx(`com.karrot.playlynx`, iOS 26.6, SDK 1.4.0)의 `lynx-spa` production bundle로 `lynx/checkbox/brand`에서 확인했다: ghost checked는 carrot-200, ghost unchecked는 회색 overlay, square checked는 brand pressed, square unchecked는 transparent pressed 색으로 눌렸고 놓은 뒤 선택이 바뀌었다. `lynx/checkbox/disabled`는 누르는 동안과 놓은 뒤 화면 차이가 없었다. Lynx는 `:active` 조상 뒤의 복합 class 후손 selector를 적용했다.
- 같은 스냅샷 패턴이 `packages/lynx-react/src/components/SegmentedControl/SegmentedControl.tsx`의 `pressSelectionRef`에 남아 있다(2026-09-29 기준). 이 작업에서는 바꾸지 않았다.

## 변경 이력

- 2026-09-29: DES-2635 Checkbox Headless 분리·Recipe `:active` 전환에서 처음 기록했다.
