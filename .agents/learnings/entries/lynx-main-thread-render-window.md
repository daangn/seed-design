---
id: lynx-main-thread-render-window
description: Lynx headless·styled 컴포넌트가 Main Thread에서 transform으로 움직이는 목록(LoopScroll·휠·carousel 등)을 화면 근처 항목만 렌더하도록(windowing) 바꾸거나, 그 렌더 창을 Main Thread 이동과 맞춰 Background에서 갱신할 때 읽는다. 창 갱신 왕복 때문에 관성 출발을 늦추지 않는 순서, instant 이동만 커밋 뒤 transform을 적용하는 기준, `'main thread'` helper를 렌더 초기화에서 부르면 실패하는 조건, 기기 측정 결과를 다룬다. native `<list>`·`<scroll-view>`가 스크롤을 소유하는 목록에는 적용하지 않는다.
scope: ["packages/lynx-react-headless/**", "packages/lynx-react/**"]
status: active
related: ["lynx-initial-transition-gate"]
---

# Main Thread 이동 목록의 렌더 창은 이동을 막지 않고 비동기로 준비한다

## 교훈과 다음 행동

- Main Thread 스크립트는 기존 요소의 스타일만 바꿀 수 있고 요소를 만들 수 없다. 렌더 창을 옮기려면 `runOnBackground`로 범위를 알리고 Background 렌더·patch를 거친다. 프레임마다 보내지 말고 중심이 임계값 이상 움직일 때만 보낸다.
- 목표가 정해지는 이동(놓은 뒤 관성, 탭 선택, smooth 외부 이동)은 '현재~목표+여유' 창을 요청하는 같은 Main Thread 호출에서 바로 출발한다. 창 커밋 ACK를 기다린 뒤 출발시키면 Background가 바쁜 동안 놓자마자 시작해야 할 관성이 멈춘다. 지수 감속은 처음 몇 frame 이동량이 작아 여유 창(예: ±(보이는 절반+8)칸)이 커밋 시간을 번다.
- 사용자가 보지 않는 instant 이동·layout reset만 목표 창을 Background state로 커밋하고, 그 effect의 `runOnMainThread` 호출에서 transform을 바꾼다. ReactLynx는 이 호출을 commit patch 뒤에 실행하므로 목표 항목이 먼저 준비된다.
- 항목은 가상 index를 key로 두고 각자 absolute `top`에 놓는다. 창이 움직여도 남은 항목과 그 touch worklet은 유지되고 가장자리만 mount·unmount된다.
- `'main thread'` 지시문이 있는 module helper를 `useState` 초기화나 Background callback에서 일반 함수처럼 부르지 않는다 → dual-thread 렌더에서 `is not a function`이 난다. 초기 창은 렌더에서 계산 가능한 일반 코드로 만들고, Main Thread에서 계산한 값은 `runOnBackground` 인자로 넘긴다.

## 발생 근거와 적용 조건

- 2026-10-02 Lynx Wheel Picker 작업에서 `@seed-design/lynx-react-loop-scroll`(`packages/lynx-react-headless/loop-scroll/src/LoopScroll.tsx`)에 windowing을 넣었다. 첫 구현은 관성 출발을 창 커밋 ACK 뒤로 미뤘고, 리뷰에서 위 출발 지연 문제로 즉시 출발로 바꿨다. 즉시 관성 시작은 LoopScroll 테스트에 회귀로 남겼다. `is not a function`은 같은 작업의 dual-thread Vitest에서 관찰됐다.
- iOS 시뮬레이터 PlayLynx 1.3.4(Engine 4.1.0, iOS 26.5), `@lynx-js/react` 0.123.3, production bundle, 1000개 항목 2컬럼 Wheel Picker 3회 중앙값:
  - 컬럼 DOM 노드 14,007 → 4,237(남은 4,001은 너비 계산용 숨김 label). Track·Highlight Track 각각 5,002·5,003 → 117·118.
  - 진입→첫 picker 화면 15,967ms → 5,132ms, 탭 놓기→상태 갱신 914ms → 501ms. DevTool 연결·녹화 조건의 관측값이며 CPU render 시간이 아니다.
  - 촬영한 드래그·왕복 43 frame에서 빈 칸 0, instant 이동(일수 31→28·30)과 첫 진입에서 빈 frame·중간 점프 없음.
- 남은 위험: 첫 frame에 여유 창(44px 항목 8칸 ≈ 352px)을 넘는 매우 빠른 fling(약 20px/ms 이상)은 Background가 2 frame 넘게 지연되면 빈 칸을 보일 수 있다. CDP touch로는 이 속도를 만들 수 없어 기기에서 확인하지 못했다.

## 변경 이력

- 2026-10-02: Lynx Wheel Picker의 LoopScroll windowing 작업에서 기록했다.
